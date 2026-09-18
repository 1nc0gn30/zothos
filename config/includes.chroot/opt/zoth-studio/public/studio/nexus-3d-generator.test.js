const test = require('node:test');
const assert = require('node:assert/strict');
const THREE = require('../assets/vendor/three.min.js');
const Nexus3DGenerator = require('./nexus-3d-generator.js');

test('Nexus3DGenerator version exists', () => {
  assert.ok(Nexus3DGenerator.VERSION.includes('procedural'));
  assert.ok(Nexus3DGenerator.PHI > 1.618);
});

test('Simplex noise 3D generates deterministic smooth values', () => {
  const n1 = Nexus3DGenerator.noise(0.5, 1.2, 3.4);
  const n2 = Nexus3DGenerator.noise(0.5, 1.2, 3.4);
  assert.equal(n1, n2);
  assert.ok(n1 >= -1.0 && n1 <= 1.0);
});

test('4D Tesseract projection creates valid 3D BufferGeometry', () => {
  const geo = Nexus3DGenerator.create4DTesseractGeometry(2.0, 0.5);
  assert.ok(geo.attributes.position);
  assert.ok(geo.attributes.position.count >= 32);
});

test('Fibonacci Phyllotaxis generates golden spiral geometry', () => {
  const geo = Nexus3DGenerator.createFibonacciPhyllotaxisGeometry(100, 2.5);
  assert.equal(geo.attributes.position.count, 100);
});

test('Synthesize exact weapon object from prompt', () => {
  const group = Nexus3DGenerator.synthesizeFromPrompt('Cyberpunk plasma rifle blaster');
  assert.ok(group.children.length >= 3);
  assert.ok(group.children.some(c => c.isMesh));
});

test('Synthesize exact vehicle object from prompt', () => {
  const group = Nexus3DGenerator.synthesizeFromPrompt('Supersonic starfighter ship with twin thruster nozzles');
  assert.ok(group.children.length >= 4);
});

test('Synthesize full 3D environmental scene (Cyberpunk Megacity Plaza)', () => {
  const sceneGroup = Nexus3DGenerator.synthesizeFromPrompt('Cyberpunk city plaza scene with skyscrapers and neon ground');
  assert.ok(sceneGroup.name.includes('ProceduralScene'));
  // Verifies ground plane + multiple skyscrapers + central monument
  assert.ok(sceneGroup.children.length >= 6);
});

test('Synthesize full 3D environmental scene (Deep Space Observatory)', () => {
  const sceneGroup = Nexus3DGenerator.synthesizeFromPrompt('Deep space station scene with asteroid belt and solar arrays');
  assert.ok(sceneGroup.name.includes('ProceduralScene'));
  // Torus + 2 wings + power core + 24 asteroids = 28 objects!
  assert.ok(sceneGroup.children.length >= 20);
});

test('Export to OBJ outputs valid Wavefront text', () => {
  const group = Nexus3DGenerator.synthesizeFromPrompt('Sacred gold crystal spire');
  const objText = Nexus3DGenerator.exportToOBJ(group);
  assert.ok(objText.includes('v '));
  assert.ok(objText.includes('f '));
});

test('Export to STL outputs valid facet topology', () => {
  const group = Nexus3DGenerator.synthesizeFromPrompt('Warp portal gate');
  const stlText = Nexus3DGenerator.exportToSTL(group);
  assert.ok(stlText.includes('solid ZothNexus3D'));
  assert.ok(stlText.includes('endsolid ZothNexus3D'));
});

// =========================================================================
// PROCEDURAL PBR SHADER & TEXTURE SYNTHESIS TEST SUITE
// =========================================================================

test('Nexus3DGenerator exports all 6 procedural PBR styles', () => {
  assert.ok(Array.isArray(Nexus3DGenerator.PBR_STYLES));
  const expectedStyles = [
    'carbon-fiber',
    'brushed-titanium',
    'iridescent-hologram',
    'bio-organic',
    'damascus-steel',
    'cyber-circuit'
  ];
  expectedStyles.forEach(style => {
    assert.ok(Nexus3DGenerator.PBR_STYLES.includes(style), `Missing style: ${style}`);
  });
});

test('createProceduralPBRTextures is safe in headless / SSR Node.js', () => {
  // In Node.js environment without DOM, should gracefully return null textures without throwing
  const result = Nexus3DGenerator.createProceduralPBRTextures({ style: 'carbon-fiber', size: 512 });
  assert.equal(result.map, null);
  assert.equal(result.normalMap, null);
  assert.equal(result.roughnessMap, null);
  assert.equal(result.metalnessMap, null);
  assert.equal(result.emissiveMap, null);
  assert.equal(result.canvases, null);
});

test('generatePBRBuffers creates all 5 seamless texture maps at 512x512 for carbon-fiber', () => {
  const size = 512;
  const pbr = Nexus3DGenerator.generatePBRBuffers({
    style: 'carbon-fiber',
    size: size,
    themeColor: '#00f0ff'
  });

  assert.equal(pbr.style, 'carbon-fiber');
  assert.equal(pbr.size, size);
  assert.equal(pbr.albedo.length, size * size * 4);
  assert.equal(pbr.normal.length, size * size * 4);
  assert.equal(pbr.roughness.length, size * size * 4);
  assert.equal(pbr.metalness.length, size * size * 4);
  assert.equal(pbr.emissive.length, size * size * 4);
  assert.equal(pbr.heightMap.length, size * size);

  // Validate alpha channel is fully opaque 255
  assert.equal(pbr.albedo[3], 255);
  assert.equal(pbr.normal[3], 255);
  assert.equal(pbr.roughness[3], 255);
  assert.equal(pbr.metalness[3], 255);
});

test('generatePBRBuffers creates all 5 seamless texture maps at 1024x1024 for brushed-titanium', () => {
  const size = 1024;
  const pbr = Nexus3DGenerator.generatePBRBuffers({
    style: 'brushed-titanium',
    size: size,
    themeColor: '#38bdf8'
  });

  assert.equal(pbr.style, 'brushed-titanium');
  assert.equal(pbr.size, size);
  assert.equal(pbr.albedo.length, size * size * 4);
  assert.equal(pbr.normal.length, size * size * 4);

  // Brushed titanium should exhibit high metallic property (>220/255)
  let avgMetal = 0;
  for (let i = 0; i < 1000; i += 4) {
    avgMetal += pbr.metalness[i];
  }
  avgMetal /= 250;
  assert.ok(avgMetal > 220, `Titanium metalness ${avgMetal} should be metallic (>220)`);
});

test('generatePBRBuffers generates full rainbow chromatic spectrum for iridescent-hologram', () => {
  const size = 512;
  const pbr = Nexus3DGenerator.generatePBRBuffers({
    style: 'iridescent-hologram',
    size: size,
    themeColor: '#c084fc'
  });

  // Verify diversity in chromatic channels (R, G, B should all have strong variance across surface)
  let minR = 255, maxR = 0, minG = 255, maxG = 0, minB = 255, maxB = 0;
  for (let i = 0; i < pbr.albedo.length; i += 4) {
    const r = pbr.albedo[i], g = pbr.albedo[i+1], b = pbr.albedo[i+2];
    if (r < minR) minR = r;
    if (r > maxR) maxR = r;
    if (g < minG) minG = g;
    if (g > maxG) maxG = g;
    if (b < minB) minB = b;
    if (b > maxB) maxB = b;
  }

  assert.ok(maxR - minR > 100, 'Red chromatic range should be broad');
  assert.ok(maxG - minG > 100, 'Green chromatic range should be broad');
  assert.ok(maxB - minB > 100, 'Blue chromatic range should be broad');

  // Hologram roughness should be specular (< 50/255)
  assert.ok(pbr.roughness[0] < 50, `Hologram roughness should be mirror-like`);
});

test('generatePBRBuffers generates organic non-metallic cellular veins for bio-organic', () => {
  const size = 512;
  const pbr = Nexus3DGenerator.generatePBRBuffers({
    style: 'bio-organic',
    size: size,
    themeColor: '#34d399'
  });

  // Bio-organic should be non-metallic (< 30/255)
  assert.ok(pbr.metalness[0] < 30, 'Bio-organic skin should be dielectric/non-metallic');

  // Should have glowing bioluminescent emissive areas in themeColor green
  let hasGlow = false;
  for (let i = 0; i < pbr.emissive.length; i += 4) {
    if (pbr.emissive[i+1] > 50) { // Green channel
      hasGlow = true;
      break;
    }
  }
  assert.ok(hasGlow, 'Bio-organic skin should feature glowing bioluminescent veins');
});

test('generatePBRBuffers generates high-contrast folded layers for damascus-steel', () => {
  const size = 512;
  const pbr = Nexus3DGenerator.generatePBRBuffers({
    style: 'damascus-steel',
    size: size,
    themeColor: '#e8c872'
  });

  let minLuma = 255, maxLuma = 0;
  for (let i = 0; i < pbr.albedo.length; i += 4) {
    const luma = 0.299 * pbr.albedo[i] + 0.587 * pbr.albedo[i+1] + 0.114 * pbr.albedo[i+2];
    if (luma < minLuma) minLuma = luma;
    if (luma > maxLuma) maxLuma = luma;
  }

  // Damascus steel has dark etched valleys and bright folded nickel steel ridges
  assert.ok(minLuma < 70, `Dark etched band luma ${minLuma} should be deep`);
  assert.ok(maxLuma > 180, `Bright nickel band luma ${maxLuma} should be bright`);
});

test('generatePBRBuffers generates dense PCB traces and glowing bus tracks for cyber-circuit', () => {
  const size = 512;
  const pbr = Nexus3DGenerator.generatePBRBuffers({
    style: 'cyber-circuit',
    size: size,
    themeColor: '#00f0ff'
  });

  let hasGoldPad = false;
  let hasGlowingBus = false;

  for (let i = 0; i < pbr.albedo.length; i += 4) {
    const r = pbr.albedo[i], g = pbr.albedo[i+1], b = pbr.albedo[i+2];
    // Gold pad check (~ R:229, G:184, B:66)
    if (r > 200 && g > 150 && b < 100) hasGoldPad = true;

    // Glowing cyan bus check (~ R:0, G:240, B:255)
    if (pbr.emissive[i+1] > 200 && pbr.emissive[i+2] > 200) hasGlowingBus = true;
  }

  assert.ok(hasGoldPad, 'Cyber circuit should contain gold solder connector pads');
  assert.ok(hasGlowingBus, 'Cyber circuit should contain glowing neon data bus tracks');
});

test('Tangent-space normal maps maintain unit vectors and upper hemisphere orientation', () => {
  const styles = ['carbon-fiber', 'brushed-titanium', 'iridescent-hologram', 'bio-organic', 'damascus-steel', 'cyber-circuit'];

  styles.forEach(style => {
    const pbr = Nexus3DGenerator.generatePBRBuffers({ style: style, size: 128 });
    const normal = pbr.normal;

    for (let i = 0; i < normal.length; i += 4) {
      const nx = (normal[i] / 255) * 2 - 1;
      const ny = (normal[i+1] / 255) * 2 - 1;
      const nz = (normal[i+2] / 255) * 2 - 1;

      const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
      assert.ok(len >= 0.90 && len <= 1.10, `Normal vector length at pixel should be ~1.0, got ${len} in style ${style}`);
      assert.ok(nz > 0, `Normal Z component should point outward (>0), got ${nz} in style ${style}`);
    }
  });
});

test('Height maps and textures are seamless across toroidal wrap boundaries', () => {
  const size = 128;
  const pbr = Nexus3DGenerator.generatePBRBuffers({ style: 'damascus-steel', size: size });
  const hm = pbr.heightMap;

  // Verify wrap-around continuity: boundary slope matches interior slope without seam step
  for (let y = 0; y < size; y++) {
    const p0 = hm[y * size + 0];
    const p1 = hm[y * size + 1];
    const pLast = hm[y * size + (size - 1)];
    const pLastMinus1 = hm[y * size + (size - 2)];

    const wrapSlope = p0 - pLast;
    const interiorSlope = p1 - p0;
    const secondDiff = Math.abs(wrapSlope - interiorSlope);

    // Second derivative across boundary should be smooth (no sharp kink)
    assert.ok(secondDiff < 0.25, `Wrap slope discontinuity at row ${y}: ${secondDiff}`);
  }
});

test('Mock Canvas integration creates valid Three.js CanvasTextures when DOM exists', () => {
  // Setup minimal mock DOM
  const mockCanvas = () => {
    return {
      width: 512,
      height: 512,
      getContext: () => ({
        createImageData: (w, h) => ({ data: new Uint8ClampedArray(w * h * 4) }),
        putImageData: () => {}
      })
    };
  };

  global.document = {
    createElement: (tag) => {
      if (tag === 'canvas') return mockCanvas();
      return {};
    }
  };

  try {
    const pbr = Nexus3DGenerator.createProceduralPBRTextures({
      style: 'carbon-fiber',
      size: 512
    });

    assert.ok(pbr.canvases);
    assert.ok(pbr.canvases.albedo);
    assert.ok(pbr.canvases.normal);
    assert.ok(pbr.canvases.roughness);
    assert.ok(pbr.canvases.metalness);
    assert.ok(pbr.canvases.emissive);

    // When THREE is loaded, textures should be instantiated CanvasTexture
    assert.ok(pbr.map && pbr.map.isTexture);
    assert.ok(pbr.normalMap && pbr.normalMap.isTexture);
    assert.ok(pbr.roughnessMap && pbr.roughnessMap.isTexture);
    assert.ok(pbr.metalnessMap && pbr.metalnessMap.isTexture);
    assert.ok(pbr.emissiveMap && pbr.emissiveMap.isTexture);
  } finally {
    delete global.document;
  }
});

test('Prompt synthesis activates procedural PBR styles correctly', () => {
  const cfObj = Nexus3DGenerator.synthesizeFromPrompt('High-speed racing vehicle with carbon fiber chassis');
  assert.ok(cfObj.children.length > 0);

  const tiObj = Nexus3DGenerator.synthesizeFromPrompt('Heavy mech chassis with brushed titanium plating');
  assert.ok(tiObj.children.length > 0);

  const holoObj = Nexus3DGenerator.synthesizeFromPrompt('Iridescent hologram warp gate portal');
  assert.ok(holoObj.children.length > 0);

  const bioObj = Nexus3DGenerator.synthesizeFromPrompt('Alien bio-organic cellular entity with glowing veins');
  assert.ok(bioObj.children.length > 0);

  const damascusObj = Nexus3DGenerator.synthesizeFromPrompt('Ancient damascus steel katana blade with folded wave pattern');
  assert.ok(damascusObj.children.length > 0);
});

// =========================================================================
// CAD CSG & PARAMETRIC GEOMETRY GENERATION TEST SUITE
// =========================================================================

test('Superquadrics & Superellipsoids create pinched, tapered, and bent mathematical solids', () => {
  const geo = Nexus3DGenerator.createSuperquadricGeometry({
    s1: 0.25,
    s2: 0.25,
    radiusX: 1.2,
    radiusY: 2.5,
    radiusZ: 1.2,
    pinch: 0.2,
    taper: 0.15,
    bend: 0.25,
    segmentsU: 24,
    segmentsV: 24
  });

  assert.ok(geo.isBufferGeometry);
  assert.equal(geo.attributes.position.count, 25 * 25);
  assert.ok(geo.attributes.normal);
  assert.ok(geo.attributes.uv);
  assert.equal(geo.index.count, 24 * 24 * 6);
});

test('Calabi-Yau 6D Manifold 3D cross-section projection creates multi-sheet complex geometry', () => {
  const geo = Nexus3DGenerator.createCalabiYauGeometry({
    n: 5,
    kMax: 3,
    radius: 2.0,
    segmentsU: 20,
    segmentsV: 20
  });

  assert.ok(geo.isBufferGeometry);
  assert.equal(geo.attributes.position.count, 3 * (21 * 21));
  assert.ok(geo.attributes.normal);
  assert.ok(geo.index.count > 0);
});

test('Parametric Involute Gear creates precision teeth profile with central axle bore', () => {
  const geo = Nexus3DGenerator.createInvoluteGearGeometry({
    numTeeth: 16,
    pitchRadius: 2.0,
    thickness: 0.4,
    boreRadius: 0.5,
    keyway: true
  });

  assert.ok(geo.isBufferGeometry);
  const nPts = 16 * 6; // 96 profile points
  assert.equal(geo.attributes.position.count, nPts * 4);
  assert.ok(geo.attributes.normal);
  assert.ok(geo.index.count > 0);
});

test('Procedural Cyber Armor Plates create interlocking hexagonal and diamond arrays with chamfer bevels', () => {
  // Hexagonal honeycomb
  const hexGeo = Nexus3DGenerator.createCyberArmorPlateGeometry({
    pattern: 'hexagonal',
    rows: 3,
    cols: 3,
    plateRadius: 0.7,
    thickness: 0.2,
    bevelSize: 0.05,
    curvature: 4.0
  });
  assert.ok(hexGeo.isBufferGeometry);
  assert.ok(hexGeo.attributes.position.count > 0);
  assert.ok(hexGeo.index.count > 0);

  // Diamond array
  const diaGeo = Nexus3DGenerator.createCyberArmorPlateGeometry({
    pattern: 'diamond',
    rows: 3,
    cols: 3,
    plateRadius: 0.7,
    thickness: 0.2,
    bevelSize: 0.05
  });
  assert.ok(diaGeo.isBufferGeometry);
  assert.ok(diaGeo.attributes.position.count > 0);
  assert.ok(diaGeo.index.count > 0);
});

test('Klein Bottle differential geometry creates continuous non-orientable immersion', () => {
  const geo = Nexus3DGenerator.createKleinBottleGeometry({
    radius: 1.8,
    tubeRadius: 0.6,
    segmentsU: 24,
    segmentsV: 24
  });

  assert.ok(geo.isBufferGeometry);
  assert.equal(geo.attributes.position.count, 25 * 25);
  assert.ok(geo.attributes.normal);
  assert.ok(geo.index.count > 0);
});

test('Mobius Strip creates ribbon with differential twists and finite thickness', () => {
  const geo = Nexus3DGenerator.createMobiusStripGeometry({
    radius: 2.0,
    width: 0.8,
    thickness: 0.1,
    twists: 1,
    segmentsU: 32,
    segmentsV: 8
  });

  assert.ok(geo.isBufferGeometry);
  assert.equal(geo.attributes.position.count, 2 * (33 * 9));
  assert.ok(geo.attributes.normal);
  assert.ok(geo.index.count > 0);
});

test('Prompt synthesis recognizes mechanical cyber gear mechanism', () => {
  const group = Nexus3DGenerator.synthesizeFromPrompt('mechanical cyber gear mechanism with planetary cogs');
  assert.ok(group.children.length >= 4);
  assert.ok(group.children.some(c => c.isMesh));
});

test('Prompt synthesis recognizes superquadric monolith', () => {
  const group = Nexus3DGenerator.synthesizeFromPrompt('futuristic superquadric monolith mathematical solid');
  assert.ok(group.children.length >= 3);
  assert.ok(group.children.some(c => c.isMesh));
});

test('Prompt synthesis recognizes calabi-yau manifold', () => {
  const group = Nexus3DGenerator.synthesizeFromPrompt('calabi-yau manifold 6D quantum string theory cross-section');
  assert.ok(group.children.length >= 4);
  assert.ok(group.children.some(c => c.isMesh));
});

test('Prompt synthesis recognizes interlocking armor plates', () => {
  const group = Nexus3DGenerator.synthesizeFromPrompt('interlocking armor plates with hexagonal chamfers');
  assert.ok(group.children.length >= 3);
  assert.ok(group.children.some(c => c.isMesh));
});

test('Prompt synthesis recognizes klein bottle', () => {
  const group = Nexus3DGenerator.synthesizeFromPrompt('4D klein bottle differential immersion surface');
  assert.ok(group.children.length >= 3);
});

test('Prompt synthesis recognizes mobius strip', () => {
  const group = Nexus3DGenerator.synthesizeFromPrompt('mobius strip topology ribbon with chiral twist');
  assert.ok(group.children.length >= 3);
});

// =========================================================================
// 3D ENVIRONMENTAL SCENE ARCHITECTURE & LIGHTING TEST SUITE
// =========================================================================

test('Nexus3DGenerator exports all 9 environmental scene presets with complete parameters', () => {
  assert.ok(Nexus3DGenerator.SCENE_PRESETS);
  const presets = Nexus3DGenerator.getScenePresets();
  assert.equal(presets.length, 9);

  const expectedSceneIds = [
    'cyberpunk_megacity',
    'deep_space_station',
    'alchemical_sanctum',
    'matrix_holodeck',
    'scifi_hangar_bay',
    'crystal_sky_islands',
    'alien_crystalline_desert',
    'sunken_cyber_atlantis',
    'volcanic_magma_forge'
  ];

  expectedSceneIds.forEach(id => {
    const sc = Nexus3DGenerator.SCENE_PRESETS[id];
    assert.ok(sc, `Missing scene preset: ${id}`);
    assert.ok(sc.name, `Scene ${id} missing name`);
    assert.ok(sc.category, `Scene ${id} missing category`);
    assert.ok(sc.description, `Scene ${id} missing description`);

    // Environment & Fog
    assert.ok(sc.environment, `Scene ${id} missing environment`);
    assert.ok(sc.environment.background, `Scene ${id} missing background`);
    assert.ok(sc.environment.fogColor, `Scene ${id} missing fogColor`);
    assert.ok(typeof sc.environment.fogDensity === 'number', `Scene ${id} missing fogDensity`);
    assert.ok(sc.environment.ground, `Scene ${id} missing ground definition`);
    assert.ok(sc.environment.ground.type, `Scene ${id} missing ground type`);
    assert.ok(sc.environment.ground.grid, `Scene ${id} missing ground grid`);

    // Dynamic Multi-Point Lighting
    assert.ok(sc.lighting, `Scene ${id} missing lighting`);
    assert.ok(sc.lighting.ambient && sc.lighting.ambient.color, `Scene ${id} missing ambient light`);
    assert.ok(sc.lighting.key && sc.lighting.key.color && sc.lighting.key.pos, `Scene ${id} missing key light`);
    assert.ok(sc.lighting.fill && sc.lighting.fill.color && sc.lighting.fill.pos, `Scene ${id} missing fill light`);
    assert.ok(Array.isArray(sc.lighting.accents) && sc.lighting.accents.length >= 1, `Scene ${id} missing accent lights`);

    // Thematic Particle Emitters
    assert.ok(sc.particles, `Scene ${id} missing particles`);
    assert.ok(sc.particles.count > 0, `Scene ${id} missing particle count`);
    assert.ok(sc.particles.color, `Scene ${id} missing particle color`);
    assert.ok(sc.particles.type, `Scene ${id} missing particle type`);
  });
});

test('Synthesize Alien Crystalline Desert scene graph with dual moons and crystal obelisks', () => {
  const scene = Nexus3DGenerator.synthesizeScenePreset('alien_crystalline_desert');
  assert.equal(scene.name, 'ProceduralScene_alien_crystalline_desert');
  assert.ok(scene.userData.preset);
  assert.equal(scene.userData.preset.id, 'alien_crystalline_desert');

  // Ground plane + 2 moons + halo + 6 obelisks + 2 rings + dais + center spire + 8 satellites >= 20 meshes!
  assert.ok(scene.children.length >= 18);

  // Verify prompt synthesis routes to alien desert
  const promptScene = Nexus3DGenerator.synthesizeFromPrompt('Alien Crystalline Desert with Dual Moons scene with phosphorescent obelisks and dunes');
  assert.equal(promptScene.name, 'ProceduralScene_alien_crystalline_desert');
  assert.equal(promptScene.userData.preset.environment.ground.type, 'alien_dunes');
  assert.equal(promptScene.userData.preset.particles.type, 'prismatic_dust');
});

test('Synthesize Sunken Cyber Atlantis Trench scene graph with hydrothermal vents and coral reefs', () => {
  const scene = Nexus3DGenerator.synthesizeScenePreset('sunken_cyber_atlantis');
  assert.equal(scene.name, 'ProceduralScene_sunken_cyber_atlantis');
  assert.ok(scene.userData.preset);

  // Ground + 4 vents (4 body + 4 rims) + 6 corals + 4 pylons (4 pylon + 4 rings) + 3 pyramid tiers + dome + eye >= 25 meshes!
  assert.ok(scene.children.length >= 20);

  const promptScene = Nexus3DGenerator.synthesizeFromPrompt('Sunken Cyber Atlantis Trench with Bioluminescent Reefs and hydrothermal vents');
  assert.equal(promptScene.name, 'ProceduralScene_sunken_cyber_atlantis');
  assert.equal(promptScene.userData.preset.environment.ground.type, 'abyssal_trench_floor');
  assert.equal(promptScene.userData.preset.particles.type, 'bioluminescent_bubbles');
});

test('Synthesize Volcanic Magma Forge scene graph with basalt caldera and molten streams', () => {
  const scene = Nexus3DGenerator.synthesizeScenePreset('volcanic_magma_forge');
  assert.equal(scene.name, 'ProceduralScene_volcanic_magma_forge');
  assert.ok(scene.userData.preset);

  // Ground + 3 magma canals + 8 crags + 3 pylons + 3 radiators + lava arch + crucible + lava bath + 2 rings + core >= 24 meshes!
  assert.ok(scene.children.length >= 20);

  const promptScene = Nexus3DGenerator.synthesizeFromPrompt('Volcanic Forge with Molten Magma Streams scene and geothermal pylons');
  assert.equal(promptScene.name, 'ProceduralScene_volcanic_magma_forge');
  assert.equal(promptScene.userData.preset.environment.ground.type, 'volcanic_basalt_crust');
  assert.equal(promptScene.userData.preset.particles.type, 'volcanic_ember_sparks');
});

test('Synthesize all 9 scene presets successfully with valid geometries and structures', () => {
  const sceneIds = [
    'cyberpunk_megacity',
    'deep_space_station',
    'alchemical_sanctum',
    'matrix_holodeck',
    'scifi_hangar_bay',
    'crystal_sky_islands',
    'alien_crystalline_desert',
    'sunken_cyber_atlantis',
    'volcanic_magma_forge'
  ];

  sceneIds.forEach(id => {
    const group = Nexus3DGenerator.synthesizeScenePreset(id);
    assert.ok(group.isGroup || group.isObject3D);
    assert.ok(group.children.length >= 5, `Scene ${id} should have comprehensive scene graph components`);
    assert.ok(group.userData.preset, `Scene ${id} must carry preset metadata`);
    assert.equal(group.userData.preset.id, id);
  });
});

// =========================================================================
// 3D EXPORTERS & MESH MANIFOLD VALIDATION TEST SUITE
// =========================================================================

test('Export to OBJ outputs Wavefront OBJ with normals, UVs, and group naming', () => {
  const group = new THREE.Group();
  const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial());
  box.name = 'Chassis_Hull';
  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 2, 16), new THREE.MeshStandardMaterial());
  barrel.name = 'Plasma_Barrel';
  barrel.position.set(0, 1, 0);
  group.add(box);
  group.add(barrel);

  const objText = Nexus3DGenerator.exportToOBJ(group);
  assert.ok(objText.includes('o Chassis_Hull'), 'OBJ missing object name for Chassis_Hull');
  assert.ok(objText.includes('g Chassis_Hull'), 'OBJ missing group name for Chassis_Hull');
  assert.ok(objText.includes('o Plasma_Barrel'), 'OBJ missing object name for Plasma_Barrel');
  assert.ok(objText.includes('g Plasma_Barrel'), 'OBJ missing group name for Plasma_Barrel');
  assert.ok(objText.includes('v '), 'OBJ missing vertex coordinates');
  assert.ok(objText.includes('vt '), 'OBJ missing texture coordinates');
  assert.ok(objText.includes('vn '), 'OBJ missing vertex normals');
  assert.ok(objText.includes('f '), 'OBJ missing face definitions');
  // Verify face index format references v/vt/vn
  assert.ok(/f\s+\d+\/\d+\/\d+\s+\d+\/\d+\/\d+\s+\d+\/\d+\/\d+/.test(objText), 'OBJ faces must use v/vt/vn indices');
});

test('Export to STL (ASCII) computes accurate facet normal vectors', () => {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2));
  const stlAscii = Nexus3DGenerator.exportToSTL(mesh, { binary: false, name: 'CyberBox' });

  assert.ok(stlAscii.includes('solid CyberBox'));
  assert.ok(stlAscii.includes('endsolid CyberBox'));
  assert.ok(stlAscii.includes('facet normal '));
  assert.ok(stlAscii.includes('outer loop'));
  assert.ok(stlAscii.includes('vertex '));
  assert.ok(stlAscii.includes('endloop'));
  assert.ok(stlAscii.includes('endfacet'));

  // Verify normal vectors are not dummy (0,0,1) for all faces, but unit vectors like (1.000000 0.000000 0.000000)
  assert.ok(stlAscii.includes('facet normal 1.000000 0.000000 0.000000') || stlAscii.includes('facet normal -1.000000 0.000000 0.000000'));
});

test('Export to STL (Binary) produces compliant 50-byte facet binary buffer with 80-byte header', () => {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2));
  const stlBin = Nexus3DGenerator.exportToSTL(mesh, { binary: true });

  assert.ok(stlBin instanceof Uint8Array || Buffer.isBuffer(stlBin));
  const triCount = 12; // 6 faces * 2 triangles
  const expectedByteLength = 84 + triCount * 50; // 684 bytes
  assert.equal(stlBin.byteLength, expectedByteLength);

  const view = new DataView(stlBin.buffer, stlBin.byteOffset, stlBin.byteLength);
  const headerBuf = Buffer.from(stlBin.buffer, stlBin.byteOffset, 80);
  assert.ok(headerBuf.toString('utf8').includes('Zoth Nexus 3D'));

  const parsedTriCount = view.getUint32(80, true);
  assert.equal(parsedTriCount, triCount);

  // Check first facet stride
  const nX = view.getFloat32(84, true);
  const nY = view.getFloat32(88, true);
  const nZ = view.getFloat32(92, true);
  const normLen = Math.sqrt(nX * nX + nY * nY + nZ * nZ);
  assert.ok(normLen >= 0.99 && normLen <= 1.01, 'Facet normal should be normalized unit vector');
});

test('Mesh Manifold Validator detects watertight closed 3D solids (0 non-manifold edges)', () => {
  const box = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2));
  const auditBox = Nexus3DGenerator.validateMeshManifold(box);

  assert.equal(auditBox.isManifold, true);
  assert.equal(auditBox.isWatertight, true);
  assert.equal(auditBox.validFor3DPrinting, true);
  assert.equal(auditBox.nonManifoldEdgesCount, 0);
  assert.equal(auditBox.boundaryEdgesCount, 0);
  assert.equal(auditBox.degenerateFacesCount, 0);
  assert.equal(auditBox.eulerCharacteristic, 2); // Sphere/Box genus 0: V - E + F = 2
  assert.equal(auditBox.genus, 0);
  assert.equal(auditBox.volume, 8); // 2^3
  assert.equal(auditBox.surfaceArea, 24); // 6 * 4

  const sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 16));
  const auditSphere = Nexus3DGenerator.validateMeshManifold(sphere);
  assert.equal(auditSphere.isManifold, true);
  assert.equal(auditSphere.isWatertight, true);
  assert.equal(auditSphere.nonManifoldEdgesCount, 0);
  assert.equal(auditSphere.boundaryEdgesCount, 0);
  assert.equal(auditSphere.eulerCharacteristic, 2);
});

test('Mesh Manifold Validator identifies open boundary meshes and non-manifold edges', () => {
  // Open plane
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2));
  const auditPlane = Nexus3DGenerator.validateMeshManifold(plane);
  assert.equal(auditPlane.isManifold, true);
  assert.equal(auditPlane.isWatertight, false);
  assert.equal(auditPlane.boundaryEdgesCount, 4);
  assert.equal(auditPlane.validFor3DPrinting, false);

  // Artificial non-manifold edge (3 triangles sharing single edge)
  const nmGeo = new THREE.BufferGeometry();
  const nmPos = new Float32Array([
    0, 0, 0,  1, 0, 0,  0, 1, 0,
    0, 0, 0,  1, 0, 0,  0, -1, 0,
    0, 0, 0,  1, 0, 0,  0, 0, 1
  ]);
  nmGeo.setAttribute('position', new THREE.BufferAttribute(nmPos, 3));
  const nmMesh = new THREE.Mesh(nmGeo);
  const auditNM = Nexus3DGenerator.validateMeshManifold(nmMesh);

  assert.equal(auditNM.isManifold, false);
  assert.equal(auditNM.nonManifoldEdgesCount, 1);
  assert.equal(auditNM.validFor3DPrinting, false);
  assert.ok(auditNM.errors.some(e => e.includes('non-manifold edges')));
});

test('Export Scene GLTF generates valid glTF 2.0 schema and GLB binary containers', () => {
  const group = Nexus3DGenerator.synthesizeFromPrompt('Quantum reactor core plasma generator');

  // JSON GLTF Export
  const gltfJson = Nexus3DGenerator.exportSceneGLTF(group, { binary: false });
  assert.ok(gltfJson.asset);
  assert.equal(gltfJson.asset.version, '2.0');
  assert.ok(gltfJson.scenes && gltfJson.scenes.length > 0);
  assert.ok(gltfJson.nodes && gltfJson.nodes.length > 0);
  assert.ok(gltfJson.meshes && gltfJson.meshes.length > 0);
  assert.ok(gltfJson.buffers && gltfJson.buffers.length > 0);
  assert.ok(gltfJson.buffers[0].uri.startsWith('data:application/octet-stream;base64,'));

  // Binary GLB Export
  const glbBin = Nexus3DGenerator.exportSceneGLTF(group, { binary: true });
  assert.ok(glbBin instanceof Uint8Array || Buffer.isBuffer(glbBin));
  const view = new DataView(glbBin.buffer, glbBin.byteOffset, glbBin.byteLength);
  const magic = view.getUint32(0, true);
  assert.equal(magic, 0x46546C67, 'Magic must be 0x46546C67 (glTF)');
  const version = view.getUint32(4, true);
  assert.equal(version, 2);
  const totalLength = view.getUint32(8, true);
  assert.equal(totalLength, glbBin.byteLength);
});

// =========================================================================
// ASSET COMPATIBILITY VERIFICATION FOR ALL 68 MODELS IN /assets/models/
// =========================================================================

test('Verify asset compatibility with all 68 GLTF/GLB/OBJ models in assets/models', () => {
  const fs = require('node:fs');
  const path = require('node:path');

  const modelsDir = path.resolve(__dirname, '../assets/models');
  assert.ok(fs.existsSync(modelsDir), 'assets/models directory must exist');

  const modelFiles = [];
  function scanModels(dir) {
    const entries = fs.readdirSync(dir);
    for (const entry of entries) {
      const fullPath = path.join(dir, entry);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        scanModels(fullPath);
      } else {
        const ext = path.extname(entry).toLowerCase();
        if (ext === '.glb' || ext === '.gltf' || ext === '.obj') {
          modelFiles.push(fullPath);
        }
      }
    }
  }
  scanModels(modelsDir);

  assert.equal(modelFiles.length, 68, `Expected exactly 68 models in assets/models, found ${modelFiles.length}`);

  let objCount = 0;
  let glbCount = 0;

  for (const modelPath of modelFiles) {
    const rel = path.relative(modelsDir, modelPath);
    const ext = path.extname(modelPath).toLowerCase();

    if (ext === '.obj') {
      objCount++;
      const text = fs.readFileSync(modelPath, 'utf8');
      assert.ok(text.length > 50, `OBJ model ${rel} is too small`);
      assert.ok(text.includes('v '), `OBJ model ${rel} must contain vertex definitions`);
      assert.ok(text.includes('f '), `OBJ model ${rel} must contain face definitions`);
    } else if (ext === '.glb' || ext === '.gltf') {
      glbCount++;
      const buf = fs.readFileSync(modelPath);
      assert.ok(buf.length > 50, `GLTF/GLB model ${rel} is too small`);

      let isValidGltf = false;
      if (buf.length >= 12 && buf.readUInt32LE(0) === 0x46546C67) {
        // Binary GLB Container
        const version = buf.readUInt32LE(4);
        assert.equal(version, 2, `GLB model ${rel} version must be 2.0`);
        const chunk0Length = buf.readUInt32LE(12);
        const chunk0Type = buf.readUInt32LE(16);
        assert.equal(chunk0Type, 0x4E4F534A, `GLB model ${rel} chunk 0 must be JSON`);
        const json = JSON.parse(buf.toString('utf8', 20, 20 + chunk0Length));
        assert.ok(json.asset && json.asset.version, `GLB model ${rel} must specify asset.version`);
        isValidGltf = true;
      } else {
        // Text glTF JSON Container (with .glb or .gltf extension)
        const json = JSON.parse(buf.toString('utf8'));
        assert.ok(json.asset && json.asset.version, `glTF model ${rel} must specify asset.version`);
        isValidGltf = true;
      }
      assert.ok(isValidGltf, `Model ${rel} must be valid glTF 2.0`);
    }
  }

  assert.equal(objCount, 32, 'Expected 32 OBJ models');
  assert.equal(glbCount, 36, 'Expected 36 GLB/glTF models');
});

// =========================================================================
// CINEMATIC VOLUMETRIC LIGHTING & POSTPROCESSING TEST SUITE
// =========================================================================

test('Volumetric Godrays Shader exports compliant GLSL shader and uniforms', () => {
  const shader = Nexus3DGenerator.VolumetricGodraysShader;
  assert.ok(shader, 'VolumetricGodraysShader must exist');
  assert.ok(shader.uniforms, 'Shader must have uniforms');
  assert.ok('tDiffuse' in shader.uniforms);
  assert.ok('lightPositionOnScreen' in shader.uniforms);
  assert.ok('exposure' in shader.uniforms);
  assert.ok('decay' in shader.uniforms);
  assert.ok('density' in shader.uniforms);
  assert.ok('weight' in shader.uniforms);
  assert.ok('intensity' in shader.uniforms);
  assert.ok('lightColor' in shader.uniforms);

  // Validate vertex & fragment shader code
  assert.ok(shader.vertexShader.includes('vUv = uv;'));
  assert.ok(shader.fragmentShader.includes('deltaTextCoord'));
  assert.ok(shader.fragmentShader.includes('illuminationDecay'));
  assert.ok(shader.fragmentShader.includes('smoothstep'));
  assert.ok(shader.fragmentShader.includes('gl_FragColor'));

  // Test factory instantiation
  const pass = Nexus3DGenerator.createGodraysPass(THREE, {
    intensity: 1.2,
    decay: 0.98,
    exposure: 0.70
  });
  assert.ok(pass);
  if (pass.uniforms) {
    assert.equal(pass.uniforms.intensity.value, 1.2);
    assert.equal(pass.uniforms.decay.value, 0.98);
    assert.equal(pass.uniforms.exposure.value, 0.70);
  }
});

test('Screen-Space Ambient Occlusion (SSAO) Shader exports crevice occlusion pipeline', () => {
  const shader = Nexus3DGenerator.SSAOShader;
  assert.ok(shader, 'SSAOShader must exist');
  assert.ok(shader.uniforms, 'SSAOShader must have uniforms');
  assert.ok('tDiffuse' in shader.uniforms);
  assert.ok('resolution' in shader.uniforms);
  assert.ok('radius' in shader.uniforms);
  assert.ok('intensity' in shader.uniforms);
  assert.ok('bias' in shader.uniforms);
  assert.ok('power' in shader.uniforms);
  assert.ok('aoColor' in shader.uniforms);
  assert.ok('onlyAO' in shader.uniforms);

  // Validate sampling kernel equations in fragment shader
  assert.ok(shader.fragmentShader.includes('SAMPLES'));
  assert.ok(shader.fragmentShader.includes('centerLum'));
  assert.ok(shader.fragmentShader.includes('aoFactor'));
  assert.ok(shader.fragmentShader.includes('gl_FragColor'));

  // Test factory instantiation
  const pass = Nexus3DGenerator.createSSAOPass(THREE, {
    radius: 12.0,
    intensity: 1.5,
    bias: 0.05,
    power: 2.2
  });
  assert.ok(pass);
  if (pass.uniforms) {
    assert.equal(pass.uniforms.radius.value, 12.0);
    assert.equal(pass.uniforms.intensity.value, 1.5);
    assert.equal(pass.uniforms.bias.value, 0.05);
    assert.equal(pass.uniforms.power.value, 2.2);
  }
});

test('Chromatic Aberration & Lens Distortion Shader exports optical dispersion uniforms', () => {
  const shader = Nexus3DGenerator.ChromaticAberrationShader;
  assert.ok(shader, 'ChromaticAberrationShader must exist');
  assert.ok(shader.uniforms, 'ChromaticAberrationShader must have uniforms');
  assert.ok('tDiffuse' in shader.uniforms);
  assert.ok('resolution' in shader.uniforms);
  assert.ok('distortion' in shader.uniforms);
  assert.ok('aberrationOffset' in shader.uniforms);
  assert.ok('fringingPower' in shader.uniforms);
  assert.ok('vignetteStrength' in shader.uniforms);
  assert.ok('vignetteRadius' in shader.uniforms);

  // Validate radial lens distortion and RGB separation in fragment shader
  assert.ok(shader.fragmentShader.includes('distortedUv'));
  assert.ok(shader.fragmentShader.includes('radialDir'));
  assert.ok(shader.fragmentShader.includes('redUv'));
  assert.ok(shader.fragmentShader.includes('blueUv'));
  assert.ok(shader.fragmentShader.includes('vignetteStrength'));
  assert.ok(shader.fragmentShader.includes('gl_FragColor'));

  // Test factory instantiation
  const pass = Nexus3DGenerator.createChromaticAberrationPass(THREE, {
    distortion: 0.12,
    aberrationOffset: 0.010,
    vignetteStrength: 0.45
  });
  assert.ok(pass);
  if (pass.uniforms) {
    assert.equal(pass.uniforms.distortion.value, 0.12);
    assert.equal(pass.uniforms.aberrationOffset.value, 0.010);
    assert.equal(pass.uniforms.vignetteStrength.value, 0.45);
  }
});

test('Adaptive Resolution Scaler maintains 60 FPS budget and scales under heavy load', () => {
  const scaler = Nexus3DGenerator.createAdaptiveResolutionScaler({
    targetFPS: 60,
    minScale: 0.65,
    maxScale: 1.0,
    smoothing: 0.25
  });

  assert.equal(scaler.targetFPS, 60);
  assert.equal(scaler.currentScale, 1.0);
  assert.equal(scaler.minScale, 0.65);
  assert.equal(scaler.maxScale, 1.0);

  // 1. Nominal 60 FPS load (16.6ms per frame)
  for (let i = 0; i < 20; i++) {
    const res = scaler.update(16.6);
    assert.equal(res.resolutionScale, 1.0);
    assert.equal(res.isThrottled, false);
  }

  // 2. Heavy load simulation (30ms per frame = 33 FPS) -> Should step resolution down
  let scaleDropped = false;
  for (let j = 0; j < 30; j++) {
    const res = scaler.update(30.0);
    if (res.scaleChanged || res.resolutionScale < 1.0) {
      scaleDropped = true;
    }
  }
  assert.ok(scaleDropped, 'Scaler should throttle down resolution under heavy frame time (30ms)');
  assert.ok(scaler.currentScale < 1.0, `Current scale ${scaler.currentScale} should be throttled`);
  assert.ok(scaler.currentScale >= 0.65, `Current scale ${scaler.currentScale} must not drop below minScale 0.65`);

  // 3. Fast recovery simulation (10ms per frame = 100 FPS) -> Should step resolution back up
  let scaleRecovered = false;
  for (let k = 0; k < 60; k++) {
    const res = scaler.update(10.0);
    if (res.resolutionScale >= 0.95) {
      scaleRecovered = true;
      break;
    }
  }
  assert.ok(scaleRecovered, 'Scaler should recover back toward 1.0 when frame headroom exists (10ms)');

  // 4. Manual setScale and clamp bounds
  scaler.setScale(0.4); // Below min
  assert.equal(scaler.currentScale, 0.65);
  scaler.setScale(1.5); // Above max
  assert.equal(scaler.currentScale, 1.0);

  // 5. Telemetry metrics inspection
  const metrics = scaler.getMetrics();
  assert.ok(typeof metrics.fps === 'number');
  assert.ok(typeof metrics.frameTimeMs === 'number');
  assert.ok(typeof metrics.resolutionScale === 'number');
  assert.ok(typeof metrics.scalePercent === 'number');
  assert.ok(metrics.tier === 'low-power' || metrics.tier === 'high-performance');

  // 6. Reset & Disable
  scaler.setEnabled(false);
  const disabledRes = scaler.update(40.0);
  assert.equal(disabledRes.resolutionScale, 1.0);
  assert.equal(disabledRes.isThrottled, false);

  scaler.setEnabled(true);
  scaler.reset();
  assert.equal(scaler.currentScale, 1.0);
});

test('Cinematic Pipeline Orchestrator initializes and manages postprocessing chain', () => {
  // Test pipeline creation
  const pipeline = Nexus3DGenerator.createCinematicPipeline(THREE, null, null, null, {
    width: 800,
    height: 600,
    bloomStrength: 1.5,
    godraysIntensity: 0.9,
    ssaoIntensity: 1.1,
    distortion: 0.1
  });

  assert.ok(pipeline, 'Cinematic pipeline must be created');
  assert.ok(pipeline.scaler, 'Pipeline must include adaptive scaler');
  assert.ok(typeof pipeline.setSize === 'function');
  assert.ok(typeof pipeline.updateLightPosition === 'function');
  assert.ok(typeof pipeline.render === 'function');

  // Verify render cycle returns performance scale info
  const renderRes = pipeline.render(16.6, { x: 5, y: 10, z: 5 });
  assert.ok(renderRes);
  assert.ok(typeof renderRes.fps === 'number');
  assert.ok(typeof renderRes.resolutionScale === 'number');
});



