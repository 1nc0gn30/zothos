const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const THREE = require('../assets/vendor/three.min.js');
const Nexus3DSky = require('./nexus-3d-sky.js');

// =========================================================================
// 1. ENGINE INITIALIZATION & CONSTANTS
// =========================================================================

test('Nexus3DSky engine exports version and mathematical constants', () => {
  assert.ok(Nexus3DSky.VERSION.includes('sky-ibl'));
  assert.ok(Nexus3DSky.PHI > 1.618 && Nexus3DSky.PHI < 1.619);
  assert.equal(Nexus3DSky.PI, Math.PI);
  assert.equal(Nexus3DSky.DEG2RAD, Math.PI / 180.0);
  assert.equal(Nexus3DSky.RAD2DEG, 180.0 / Math.PI);
});

test('Nexus3DSky exports all 5 core presets with valid keys and aliases', () => {
  const expectedPresets = [
    'sunset_cyberpunk',
    'deep_space_nebula',
    'golden_dawn_sanctum',
    'toxic_acid_matrix',
    'midnight_aurora'
  ];

  assert.equal(Nexus3DSky.PRESET_KEYS.length, 5);
  expectedPresets.forEach((key) => {
    assert.ok(Nexus3DSky.PRESET_KEYS.includes(key), `Missing preset key: ${key}`);
    assert.ok(Nexus3DSky.SKY_PRESETS[key], `Missing preset definition: ${key}`);
    assert.ok(Nexus3DSky.SKY_PRESETS[key.replace(/_/g, '-')], `Missing kebab-case alias: ${key}`);
  });
});

// =========================================================================
// 2. MATHEMATICAL & ATMOSPHERIC SCATTERING EQUATIONS
// =========================================================================

test('Rayleigh phase function maintains physical symmetry and normalization', () => {
  // P_R(cosTheta) = 3/(16*PI) * (1 + cos^2(theta))
  const p0 = Nexus3DSky.rayleighPhase(1.0);  // Forward: cos(0) = 1
  const p180 = Nexus3DSky.rayleighPhase(-1.0); // Backward: cos(PI) = -1
  const p90 = Nexus3DSky.rayleighPhase(0.0);  // Perpendicular: cos(PI/2) = 0

  assert.equal(p0, p180, 'Rayleigh phase must be symmetric in forward and backward directions');
  assert.ok(Math.abs(p0 - (3.0 / (8.0 * Math.PI))) < 1e-6);
  assert.ok(Math.abs(p90 - (3.0 / (16.0 * Math.PI))) < 1e-6);
  assert.ok(p0 > p90, 'Forward scattering must exceed 90-degree scattering');
});

test('Mie phase function exhibits strong forward aerosol peak for g > 0', () => {
  const g = 0.85;
  const pForward = Nexus3DSky.miePhase(1.0, g);
  const pBackward = Nexus3DSky.miePhase(-1.0, g);
  const pSide = Nexus3DSky.miePhase(0.0, g);

  assert.ok(pForward > pBackward * 50.0, 'Forward Mie peak should heavily dominate backward scattering');
  assert.ok(pForward > pSide * 10.0, 'Forward Mie peak should heavily dominate perpendicular scattering');
  assert.ok(pForward > 0 && pBackward > 0 && pSide > 0, 'Mie phase must remain strictly positive');
});

test('Optical airmass prevents horizon singularities and scales with elevation', () => {
  const airmassZenith = Nexus3DSky.opticalAirmass(Math.PI / 2.0); // 90 deg elevation
  const airmass45 = Nexus3DSky.opticalAirmass(Math.PI / 4.0);    // 45 deg elevation
  const airmassHorizon = Nexus3DSky.opticalAirmass(0.01);        // Near 0 deg elevation

  assert.ok(Math.abs(airmassZenith - 1.0) < 0.05, 'Zenith airmass should be ~1.0');
  assert.ok(airmass45 > airmassZenith, 'Airmass must increase as elevation decreases');
  assert.ok(airmassHorizon > 20.0, 'Near-horizon airmass should be substantial');
  assert.ok(Number.isFinite(airmassHorizon), 'Near-horizon airmass must remain finite');
});

test('calculateSunDirection converts azimuth and elevation to normalized unit vector', () => {
  // Zenith (elevation = 90 deg)
  const sunZenith = Nexus3DSky.calculateSunDirection(0.0, 90.0);
  assert.ok(Math.abs(sunZenith.y - 1.0) < 1e-5);
  assert.ok(Math.abs(sunZenith.x) < 1e-5 && Math.abs(sunZenith.z) < 1e-5);

  // Horizon facing South (elevation = 0, azimuth = 0)
  const sunHorizonSouth = Nexus3DSky.calculateSunDirection(0.0, 0.0);
  assert.ok(Math.abs(sunHorizonSouth.y) < 1e-5);
  assert.ok(Math.abs(sunHorizonSouth.z - 1.0) < 1e-5);

  // Check unit length
  const sunArbitrary = Nexus3DSky.calculateSunDirection(137.5, 23.5);
  const len = Math.sqrt(sunArbitrary.x * sunArbitrary.x + sunArbitrary.y * sunArbitrary.y + sunArbitrary.z * sunArbitrary.z);
  assert.ok(Math.abs(len - 1.0) < 1e-5, 'Sun direction vector must have unit length');
});

test('calculateSunColorAndIntensity computes atmospheric reddening at sunset', () => {
  const midday = Nexus3DSky.calculateSunColorAndIntensity(75.0, 2.0);
  const sunset = Nexus3DSky.calculateSunColorAndIntensity(2.0, 6.0);

  // Midday should have higher overall intensity than low sunset
  assert.ok(midday.intensity > sunset.intensity);

  // Sunset should have a higher Red-to-Blue ratio (reddening) due to Rayleigh/Mie scattering
  const middayRedToBlue = midday.rgb[0] / (midday.rgb[2] || 0.001);
  const sunsetRedToBlue = sunset.rgb[0] / (sunset.rgb[2] || 0.001);
  assert.ok(sunsetRedToBlue > middayRedToBlue, 'Sunset must exhibit strong spectral reddening');
  assert.ok(typeof sunset.color === 'string' && sunset.color.startsWith('#'));
});

// =========================================================================
// 3. SIMPLEX NOISE & PROCEDURAL GENERATORS
// =========================================================================

test('Simplex 2D and 3D noise are deterministic and bounded in [-1, 1]', () => {
  const val2D_a = Nexus3DSky.noise2D(3.1415, 2.7182);
  const val2D_b = Nexus3DSky.noise2D(3.1415, 2.7182);
  assert.equal(val2D_a, val2D_b, '2D noise must be deterministic');
  assert.ok(val2D_a >= -1.0 && val2D_a <= 1.0);

  const val3D_a = Nexus3DSky.noise3D(1.23, 4.56, 7.89);
  const val3D_b = Nexus3DSky.noise3D(1.23, 4.56, 7.89);
  assert.equal(val3D_a, val3D_b, '3D noise must be deterministic');
  assert.ok(val3D_a >= -1.0 && val3D_a <= 1.0);
});

test('FBM 3D and Domain Warping evaluate multi-octave continuous fields', () => {
  const fbmVal = Nexus3DSky.fbm3D(0.5, 0.5, 0.5, 5, 2.0, 0.5);
  assert.ok(fbmVal >= -1.0 && fbmVal <= 1.0);

  const turbVal = Nexus3DSky.turbulence3D(0.5, 0.5, 0.5, 4);
  assert.ok(turbVal >= 0.0 && turbVal <= 1.0);

  const warpedVal = Nexus3DSky.domainWarpFBM(0.5, 0.5, 0.5, 1.2);
  assert.ok(typeof warpedVal === 'number' && !isNaN(warpedVal));
});

test('blackbodyColor computes Planck temperature chromaticities', () => {
  // Cool M-dwarf star (3000 K) -> Reddish
  const coolStar = Nexus3DSky.blackbodyColor(3000);
  assert.ok(coolStar[0] > coolStar[2], '3000K star should be red-dominated');

  // Solar G-type star (5778 K) -> Warm white / yellow
  const solarStar = Nexus3DSky.blackbodyColor(5778);
  assert.ok(solarStar[0] >= 0.9 && solarStar[1] >= 0.8);

  // Hot O/B giant star (20000 K) -> Blue-dominated
  const hotStar = Nexus3DSky.blackbodyColor(20000);
  assert.ok(hotStar[2] > coolStar[2], '20000K star should have strong blue component');
});

test('evaluateSpaceRadiance generates cosmic nebula and stellar radiance', () => {
  const viewDirZenith = { x: 0, y: 1, z: 0 };
  const spaceRadiance = Nexus3DSky.evaluateSpaceRadiance(viewDirZenith, {
    nebulaIntensity: 1.2,
    starDensity: 2000,
    dustLanes: true
  });

  assert.equal(spaceRadiance.length, 3);
  assert.ok(spaceRadiance[0] >= 0 && spaceRadiance[1] >= 0 && spaceRadiance[2] >= 0);
  assert.ok(spaceRadiance[0] > 0 || spaceRadiance[1] > 0 || spaceRadiance[2] > 0);
});

test('evaluateAtmosphericRadiance returns realistic daytime and horizon values', () => {
  const sunDir = Nexus3DSky.calculateSunDirection(195.0, 15.0);
  const viewDirSky = { x: 0, y: 0.8, z: 0.6 };
  const viewDirGround = { x: 0, y: -0.5, z: 0.866 };

  const skyRad = Nexus3DSky.evaluateAtmosphericRadiance(viewDirSky, sunDir, { turbidity: 3.0 });
  const groundRad = Nexus3DSky.evaluateAtmosphericRadiance(viewDirGround, sunDir, { turbidity: 3.0 });

  assert.ok(skyRad[0] >= 0 && skyRad[1] >= 0 && skyRad[2] >= 0);
  assert.ok(groundRad[0] >= 0 && groundRad[1] >= 0 && groundRad[2] >= 0);
});

// =========================================================================
// 4. EQUIRECTANGULAR BUFFER & PRESETS RASTERIZATION
// =========================================================================

test('generateEquirectangularBuffer generates 512x256 RGBA buffers for all 5 presets', () => {
  const width = 256;
  const height = 128;
  const expectedSize = width * height * 4;

  Nexus3DSky.PRESET_KEYS.forEach((presetKey) => {
    const result = Nexus3DSky.generateEquirectangularBuffer(width, height, presetKey);

    assert.equal(result.width, width);
    assert.equal(result.height, height);
    assert.equal(result.data.length, expectedSize);
    assert.equal(result.data.constructor.name, 'Uint8ClampedArray');

    // Verify alpha is fully opaque (255) everywhere
    let validAlpha = true;
    for (let i = 3; i < result.data.length; i += 4) {
      if (result.data[i] !== 255) {
        validAlpha = false;
        break;
      }
    }
    assert.ok(validAlpha, `Alpha channel must be 255 across preset: ${presetKey}`);

    // Verify non-zero content
    const harmonics = Nexus3DSky.calculateIBLHarmonics(result);
    assert.ok(harmonics.averageLuminance > 0.005, `Average luminance should be positive for ${presetKey}`);
    assert.ok(harmonics.maxLuminance <= 1.0, `Luminance must be normalized for ${presetKey}`);
  });
});

test('Preset spectral signatures match physical and artistic archetypes', () => {
  const sunset = Nexus3DSky.generateEquirectangularBuffer(128, 64, 'sunset_cyberpunk');
  const toxic = Nexus3DSky.generateEquirectangularBuffer(128, 64, 'toxic_acid_matrix');
  const goldenDawn = Nexus3DSky.generateEquirectangularBuffer(128, 64, 'golden_dawn_sanctum');

  const sunsetHarmonics = Nexus3DSky.calculateIBLHarmonics(sunset);
  const toxicHarmonics = Nexus3DSky.calculateIBLHarmonics(toxic);
  const goldenHarmonics = Nexus3DSky.calculateIBLHarmonics(goldenDawn);

  // Sunset should be red/orange biased (Red > Green and Red > Blue)
  assert.ok(sunsetHarmonics.averageColor[0] > sunsetHarmonics.averageColor[1], 'Sunset must have Red > Green');
  assert.ok(sunsetHarmonics.averageColor[0] > sunsetHarmonics.averageColor[2], 'Sunset must have Red > Blue');

  // Toxic Acid Matrix should be emerald/phosphor green biased (Green > Red and Green > Blue)
  assert.ok(toxicHarmonics.averageColor[1] > toxicHarmonics.averageColor[0], 'Toxic Matrix must have Green > Red');
  assert.ok(toxicHarmonics.averageColor[1] > toxicHarmonics.averageColor[2], 'Toxic Matrix must have Green > Blue');

  // Golden Dawn should have strong daylight radiance
  assert.ok(goldenHarmonics.averageLuminance > sunsetHarmonics.averageLuminance, 'Golden Dawn daylight radiance should exceed sunset dusk');
});

// =========================================================================
// 5. THREE.JS ENVIRONMENT MAP & PBR RIG INTEGRATION
// =========================================================================

test('createSkyTexture produces valid Three.js DataTexture in headless Node.js', () => {
  const texture = Nexus3DSky.createSkyTexture(THREE, 128, 64, 'golden_dawn_sanctum');

  assert.ok(texture);
  assert.ok(texture.isTexture || texture.isDataTexture);
  assert.equal(texture.mapping, THREE.EquirectangularReflectionMapping || 303);
});

test('generateEnvironmentMap creates valid texture with Equirectangular mapping', () => {
  const envMap = Nexus3DSky.generateEnvironmentMap(THREE, null, { preset: 'toxic_acid_matrix', width: 128, height: 64 });

  assert.ok(envMap);
  assert.ok(envMap.isTexture || envMap.isDataTexture);
});

test('applyEnvironmentToScene configures scene background, environment, and lights', () => {
  const scene = new THREE.Scene();
  const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
  const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
  scene.add(dirLight);
  scene.add(fillLight);

  const applied = Nexus3DSky.applyEnvironmentToScene(scene, null, { preset: 'midnight_aurora', width: 128, height: 64 }, THREE);

  assert.ok(applied);
  assert.ok(scene.environment);
  assert.ok(scene.background);
  assert.equal(applied.params.name, 'Midnight Aurora');
  // Check key light was adjusted
  assert.ok(dirLight.intensity > 0);
});

test('createSkyDomeMesh creates background sphere mesh with BackSide geometry', () => {
  const domeMesh = Nexus3DSky.createSkyDomeMesh(THREE, 500, { preset: 'deep_space_nebula', width: 128, height: 64 });

  assert.ok(domeMesh);
  assert.ok(domeMesh.isMesh);
  assert.equal(domeMesh.name, 'ProceduralSkyDome');
  assert.equal(domeMesh.renderOrder, -1000);
  assert.ok(domeMesh.geometry.isBufferGeometry || domeMesh.geometry.isGeometry);
});

test('createIBLMaterialTestRig creates Chrome, Gold, Titanium, and Obsidian test spheres', () => {
  const rig = Nexus3DSky.createIBLMaterialTestRig(THREE, { spacing: 3.0 });

  assert.ok(rig);
  assert.ok(rig.isGroup);
  assert.equal(rig.name, 'IBL_Material_Reflection_Rig');

  // Expect 4 spheres + 4 pedestals = 8 child objects
  assert.equal(rig.children.length, 8);

  const spheres = rig.children.filter((c) => c.name.startsWith('IBL_Sphere_'));
  assert.equal(spheres.length, 4);

  const chromeSphere = spheres.find((s) => s.name.includes('Chrome'));
  const goldSphere = spheres.find((s) => s.name.includes('Gold'));
  const titaniumSphere = spheres.find((s) => s.name.includes('Titanium'));
  const obsidianSphere = spheres.find((s) => s.name.includes('Obsidian'));

  assert.ok(chromeSphere);
  assert.ok(goldSphere);
  assert.ok(titaniumSphere);
  assert.ok(obsidianSphere);

  // Chrome should have 0.0 roughness and 1.0 metalness
  assert.equal(chromeSphere.material.roughness, 0.0);
  assert.equal(chromeSphere.material.metalness, 1.0);

  // Gold should have high metalness and golden color tint
  assert.ok(goldSphere.material.metalness >= 0.9);
  assert.equal(goldSphere.material.color.getHex(), 0xffd700);

  // Titanium should have satin roughness and high metalness
  assert.ok(titaniumSphere.material.roughness > 0.15);
  assert.ok(titaniumSphere.material.metalness > 0.8);

  // Obsidian should have high gloss (low roughness) and dielectric metalness
  assert.ok(obsidianSphere.material.roughness <= 0.05);
  assert.ok(obsidianSphere.material.metalness <= 0.1);
});

// =========================================================================
// 6. BENCHMARK & PERFORMANCE SUITE
// =========================================================================

test('runReflectionBenchmark generates throughput and latency statistics across all presets', () => {
  const benchmark = Nexus3DSky.runReflectionBenchmark({
    width: 128,
    height: 64,
    iterations: 2
  });

  assert.ok(benchmark);
  assert.equal(benchmark.results.length, 5);

  benchmark.results.forEach((res) => {
    assert.ok(res.averageLatencyMs >= 0);
    assert.ok(res.throughputMps > 0);
    assert.ok(res.averageLuminance >= 0 && res.averageLuminance <= 1.0);
  });
});

test('nexus-3d.html includes nexus-3d-sky script, 5-preset UI switcher, and controller functions', () => {
  const htmlPath = path.join(__dirname, 'nexus-3d.html');
  const html = fs.readFileSync(htmlPath, 'utf8');

  // 1. Script tag inclusion
  assert.ok(html.includes('nexus-3d-sky.js'), 'nexus-3d.html must load nexus-3d-sky.js');

  // 2. UI Panel Heading
  assert.ok(html.includes('PROCEDURAL PHYSICAL SKY &amp; IBL DOME') || html.includes('PROCEDURAL PHYSICAL SKY & IBL DOME'), 'HTML must include Sky Dome panel header');

  // 3. All 5 Preset buttons
  assert.ok(html.includes('btn-sky-sunset-cyberpunk'), 'HTML must include Sunset Cyberpunk button');
  assert.ok(html.includes('btn-sky-deep-space-nebula'), 'HTML must include Deep Space Nebula button');
  assert.ok(html.includes('btn-sky-golden-dawn-sanctum'), 'HTML must include Golden Dawn Sanctum button');
  assert.ok(html.includes('btn-sky-toxic-acid-matrix'), 'HTML must include Toxic Acid Matrix button');
  assert.ok(html.includes('btn-sky-midnight-aurora'), 'HTML must include Midnight Aurora button');

  // 4. Parameter sliders
  assert.ok(html.includes('sky-sun-elevation'), 'HTML must include Sun Elevation slider');
  assert.ok(html.includes('sky-sun-azimuth'), 'HTML must include Sun Azimuth slider');
  assert.ok(html.includes('sky-turbidity'), 'HTML must include Turbidity slider');
  assert.ok(html.includes('sky-nebula-intensity'), 'HTML must include Nebula Intensity slider');
  assert.ok(html.includes('sky-star-density'), 'HTML must include Star Density slider');

  // 5. Controller JS functions
  assert.ok(html.includes('function setSkyPreset('), 'HTML must define setSkyPreset function');
  assert.ok(html.includes('function updateSkyParameters('), 'HTML must define updateSkyParameters function');
  assert.ok(html.includes('function spawnIBLTestRig('), 'HTML must define spawnIBLTestRig function');
});
