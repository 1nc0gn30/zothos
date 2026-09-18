const test = require('node:test');
const assert = require('node:assert/strict');
const THREE = require('../assets/vendor/three.min.js');
const Nexus3DInspector = require('./nexus-3d-inspector.js');

// =========================================================================
// 1. CONSTANTS & VERSION VERIFICATION
// =========================================================================

test('Nexus3DInspector version & mathematical constants exist', () => {
  assert.ok(Nexus3DInspector.VERSION.includes('inspector'));
  assert.ok(Math.abs(Nexus3DInspector.PHI - 1.6180339887) < 1e-6);
  assert.ok(Math.abs(Nexus3DInspector.PHI_INV - 0.6180339887) < 1e-6);
  assert.ok(Math.abs(Nexus3DInspector.GOLDEN_ANGLE - 2.3999632) < 1e-6);
  assert.ok(Math.abs(Nexus3DInspector.TAU - 2.0 * Math.PI) < 1e-9);
});

test('Sacred Harmonic Frequencies and Material Densities are registered', () => {
  assert.equal(Nexus3DInspector.SACRED_FREQUENCIES.VERDI_432, 432);
  assert.equal(Nexus3DInspector.SACRED_FREQUENCIES.SOLFEGGIO_528, 528);
  assert.equal(Nexus3DInspector.SACRED_FREQUENCIES.COSMIC_888, 888);

  assert.equal(Nexus3DInspector.MATERIAL_DENSITIES.titanium, 4.506);
  assert.equal(Nexus3DInspector.MATERIAL_DENSITIES.gold, 19.320);
  assert.equal(Nexus3DInspector.MATERIAL_DENSITIES.carbon_fiber, 1.600);
  assert.equal(Nexus3DInspector.MATERIAL_DENSITIES.steel, 7.850);
});

test('Simplex noise evaluator generates smooth deterministic values', () => {
  const v1 = Nexus3DInspector.noise(0.2, 0.4, 0.6);
  const v2 = Nexus3DInspector.noise(0.2, 0.4, 0.6);
  assert.equal(v1, v2);
  assert.ok(typeof v1 === 'number' && !isNaN(v1));
});

// =========================================================================
// 2. SUPERQUADRIC EQUATION INSPECTOR & GENERATOR TESTS
// =========================================================================

test('Superquadric geometry generates valid 3D BufferGeometry with modifiers', () => {
  // Chamfered monolith with tapering, pinching, and bending
  const geo = Nexus3DInspector.createSuperquadricGeometry({
    s1: 0.25,
    s2: 0.25,
    radiusX: 1.2,
    radiusY: 2.4,
    radiusZ: 1.2,
    taper: -0.3,
    pinch: 0.2,
    bend: 0.15,
    segmentsU: 24,
    segmentsV: 24
  });

  assert.ok(geo.attributes.position);
  assert.ok(geo.attributes.uv);
  assert.ok(geo.attributes.normal);
  assert.ok(geo.index);
  assert.ok(geo.attributes.position.count > 100);
  assert.equal(geo.userData.type, 'Superquadric');
});

test('Superquadric inspector accurately classifies shapes and provides LaTeX formulas', () => {
  const boxoid = Nexus3DInspector.inspectSuperquadric({ s1: 0.2, s2: 0.2, radiusX: 1, radiusY: 1, radiusZ: 1 });
  assert.ok(boxoid.classification.includes('Boxoid') || boxoid.classification.includes('Monolith'));
  assert.ok(boxoid.formulas.x.includes('r_x'));
  assert.ok(boxoid.formulas.taper.includes('k_{\\text{taper}}'));

  const star = Nexus3DInspector.inspectSuperquadric({ s1: 2.0, s2: 2.0 });
  assert.ok(star.classification.includes('Astroid') || star.classification.includes('Star'));

  const sphere = Nexus3DInspector.inspectSuperquadric({ s1: 1.0, s2: 1.0 });
  assert.ok(sphere.classification.includes('Ellipsoid'));
});

// =========================================================================
// 3. INVOLUTE GEAR FORMULA INSPECTOR & GENERATOR TESTS
// =========================================================================

test('Involute gear geometry generates precision teeth profile and keyed axle bore', () => {
  const geo = Nexus3DInspector.createInvoluteGearGeometry({
    numTeeth: 18,
    m: 0.25,
    pressureAngle: 20.0,
    thickness: 0.6,
    boreRadius: 0.4,
    keyway: true,
    backlash: 0.02
  });

  assert.ok(geo.attributes.position);
  assert.ok(geo.attributes.uv);
  assert.ok(geo.attributes.normal);
  assert.ok(geo.index);
  assert.equal(geo.userData.type, 'InvoluteGear');
  assert.equal(geo.userData.parameters.numTeeth, 18);
});

test('Involute gear inspector computes pitch, base, root, addendum diameters and contact ratio', () => {
  const insp = Nexus3DInspector.inspectInvoluteGear({
    numTeeth: 20,
    m: 0.5,
    pressureAngle: 20.0,
    backlash: 0.03
  });

  assert.equal(insp.pitchDiameter, 10.0);
  assert.equal(insp.pitchRadius, 5.0);
  assert.ok(Math.abs(insp.baseDiameter - 10.0 * Math.cos(20 * Math.PI / 180)) < 1e-6);
  assert.equal(insp.addendum, 0.5);
  assert.equal(insp.dedendum, 0.625);
  assert.equal(insp.tipDiameter, 11.0);
  assert.equal(insp.rootDiameter, 8.75);
  assert.ok(insp.circularPitch > 1.5);
  assert.ok(insp.involuteRad > 0.0);
  assert.ok(insp.contactRatioStandard > 0.5);
  assert.ok(insp.formulas.involute.includes('tan'));
});

// =========================================================================
// 4. CALABI-YAU 6D MANIFOLD INSPECTOR & GENERATOR TESTS
// =========================================================================

test('Calabi-Yau geometry generates multi-sheet 3D cross-section BufferGeometry', () => {
  const geo = Nexus3DInspector.createCalabiYauGeometry({
    n: 5,
    kMax: 3,
    radius: 2.2,
    alpha: 0.45,
    beta: 0.35,
    gamma: 0.60,
    delta: 0.20,
    segmentsU: 16,
    segmentsV: 16
  });

  assert.ok(geo.attributes.position);
  assert.ok(geo.attributes.uv);
  assert.ok(geo.attributes.normal);
  assert.ok(geo.index);
  assert.equal(geo.userData.type, 'CalabiYau');
  assert.equal(geo.userData.parameters.n, 5);
  assert.equal(geo.userData.parameters.kMax, 3);
});

test('Calabi-Yau inspector evaluates topological Euler characteristic and Hodge numbers', () => {
  const insp5 = Nexus3DInspector.inspectCalabiYau({ n: 5, kMax: 5 });
  assert.equal(insp5.complexDimension, 3);
  assert.equal(insp5.realDimension, 6);
  assert.equal(insp5.eulerCharacteristic, -200);
  assert.equal(insp5.hodgeNumbers.h11, 1);
  assert.equal(insp5.hodgeNumbers.h21, 101);
  assert.equal(insp5.holonomyGroup, 'SU(3)');

  const insp3 = Nexus3DInspector.inspectCalabiYau({ n: 3, kMax: 3 });
  assert.equal(insp3.eulerCharacteristic, -18);
});

// =========================================================================
// 5. TORUS KNOT PARAMETRIC EQUATIONS INSPECTOR & GENERATOR TESTS
// =========================================================================

test('Torus knot geometry generates smooth extruded tube mesh along knot curve', () => {
  const geo = Nexus3DInspector.createTorusKnotGeometry({
    p: 2,
    q: 3,
    radius: 2.0,
    tube: 0.35,
    tubularSegments: 64,
    radialSegments: 12,
    pMod: 0.15,
    qMod: 2.0
  });

  assert.ok(geo.attributes.position);
  assert.ok(geo.attributes.normal);
  assert.ok(geo.attributes.uv);
  assert.ok(geo.index);
  assert.equal(geo.userData.type, 'TorusKnot');
  assert.equal(geo.userData.parameters.p, 2);
  assert.equal(geo.userData.parameters.q, 3);
});

test('Torus knot inspector correctly classifies knot topologies and computes arc length and crossings', () => {
  const trefoil = Nexus3DInspector.inspectTorusKnot({ p: 2, q: 3, radius: 2.0, tube: 0.4 });
  assert.ok(trefoil.classification.includes('Trefoil'));
  assert.equal(trefoil.crossingNumber, 3);
  assert.equal(trefoil.isLink, false);
  assert.ok(trefoil.approxArcLength > 10.0);
  assert.ok(trefoil.surfaceArea > 0);
  assert.ok(trefoil.volume > 0);

  const cinquefoil = Nexus3DInspector.inspectTorusKnot({ p: 2, q: 5 });
  assert.ok(cinquefoil.classification.includes('Cinquefoil'));
  assert.equal(cinquefoil.crossingNumber, 5);

  const link = Nexus3DInspector.inspectTorusKnot({ p: 2, q: 4 });
  assert.equal(link.isLink, true);
  assert.equal(link.gcd, 2);
});

// =========================================================================
// 6. SACRED GEOMETRY & PHYSICAL MASS TELEMETRY TESTS
// =========================================================================

test('computeMeshTelemetry accurately evaluates signed tetrahedral volume and surface area', () => {
  // Test with standard cube of side 2 (volume = 8, surface area = 24)
  const boxGeo = new THREE.BoxGeometry(2, 2, 2);
  const telemetry = Nexus3DInspector.computeMeshTelemetry(boxGeo, { unitScale: 1.0 });

  assert.ok(Math.abs(telemetry.volume - 8.0) < 0.1, `Expected volume ~8.0, got ${telemetry.volume}`);
  assert.ok(Math.abs(telemetry.surfaceArea - 24.0) < 0.1, `Expected area ~24.0, got ${telemetry.surfaceArea}`);
  assert.ok(telemetry.vertexCount > 0);
  assert.ok(telemetry.triangleCount === 12);
  assert.ok(telemetry.boundingBox.size.x === 2);
});

test('computeMeshTelemetry computes bounding mass across 10 material densities', () => {
  const boxGeo = new THREE.BoxGeometry(2, 2, 2); // 8 cm^3
  const telemetry = Nexus3DInspector.computeMeshTelemetry(boxGeo, { unitScale: 1.0 });

  assert.ok(telemetry.massBreakdown.titanium);
  assert.ok(telemetry.massBreakdown.gold);
  assert.ok(telemetry.massBreakdown.carbon_fiber);

  // Gold mass = 8 cm^3 * 19.32 g/cm^3 = 154.56 grams
  assert.ok(Math.abs(telemetry.massBreakdown.gold.mass_grams - 154.56) < 1.0);
  // Titanium mass = 8 cm^3 * 4.506 g/cm^3 = 36.048 grams
  assert.ok(Math.abs(telemetry.massBreakdown.titanium.mass_grams - 36.048) < 1.0);
});

test('computeMeshTelemetry analyzes Golden Ratio Phi fit score and harmonic resonance frequencies', () => {
  // Golden ratio rectangle box: size 1.618 x 1.0 x 1.0
  const phiBoxGeo = new THREE.BoxGeometry(1.618034, 1.0, 1.0);
  const telemetry = Nexus3DInspector.computeMeshTelemetry(phiBoxGeo, { unitScale: 10.0 });

  assert.ok(telemetry.goldenRatioMetrics.phiFitScore > 95.0, `Expected Phi fit > 95%, got ${telemetry.goldenRatioMetrics.phiFitScore}`);
  assert.ok(Array.isArray(telemetry.resonanceFrequencies));
  assert.ok(telemetry.resonanceFrequencies.some(r => r.freq === 432));
  assert.ok(telemetry.resonanceFrequencies.some(r => r.freq === 528));
  assert.ok(telemetry.resonanceFrequencies.some(r => r.freq === 888));
});

test('computeMeshTelemetry gracefully handles empty or invalid meshes', () => {
  const telemetry = Nexus3DInspector.computeMeshTelemetry(null);
  assert.equal(telemetry.volume, 0);
  assert.equal(telemetry.surfaceArea, 0);
  assert.equal(telemetry.vertexCount, 0);
});

// =========================================================================
// 7. LIVE FORMULA PARSER & SAFE PARAMETRIC SURFACE EVALUATOR TESTS
// =========================================================================

test('parseParametricEquation safely compiles standard math expressions and implicit multiplication', () => {
  const fn1 = Nexus3DInspector.parseParametricEquation('2 * sin(u) * cos(v)');
  assert.equal(typeof fn1, 'function');
  const val1 = fn1(Math.PI / 2, 0);
  assert.ok(Math.abs(val1 - 2.0) < 1e-6);

  // Implicit multiplication: 3u -> 3*u
  const fn2 = Nexus3DInspector.parseParametricEquation('3u + 4v');
  const val2 = fn2(2, 3);
  assert.equal(val2, 18);

  // Power operator ^ -> **
  const fn3 = Nexus3DInspector.parseParametricEquation('u^2 + v^2');
  const val3 = fn3(3, 4);
  assert.equal(val3, 25);

  // Constants: pi, phi, e, tau
  const fn4 = Nexus3DInspector.parseParametricEquation('phi * pi');
  const val4 = fn4(0, 0);
  assert.ok(Math.abs(val4 - (Nexus3DInspector.PHI * Math.PI)) < 1e-6);
});

test('parseParametricEquation handles custom variables and time parameter t', () => {
  const fn = Nexus3DInspector.parseParametricEquation('a * sin(u + t) + b * cos(v)');
  const val = fn(0, 0, 0, { a: 5, b: 10 });
  assert.equal(val, 10); // 5*0 + 10*1 = 10
});

test('parseParametricEquation safely handles division by zero and invalid syntax without crashing', () => {
  const fnDivZero = Nexus3DInspector.parseParametricEquation('1.0 / 0.0');
  const val1 = fnDivZero(0, 0);
  assert.equal(val1, 0.0); // Clamped from Infinity to 0.0

  const fnInvalid = Nexus3DInspector.parseParametricEquation('invalid syntax @#$%%^^');
  const val2 = fnInvalid(0, 0);
  assert.equal(val2, 0.0);
});

test('createCustomParametricGeometry builds valid mesh for user equations', () => {
  const geo = Nexus3DInspector.createCustomParametricGeometry({
    fx: 'cos(u) * (2 + cos(v))',
    fy: 'sin(u) * (2 + cos(v))',
    fz: 'sin(v)',
    uMin: 0,
    uMax: 2 * Math.PI,
    vMin: 0,
    vMax: 2 * Math.PI,
    segmentsU: 24,
    segmentsV: 24
  });

  assert.ok(geo.attributes.position);
  assert.ok(geo.attributes.uv);
  assert.ok(geo.attributes.normal);
  assert.ok(geo.index);
  assert.equal(geo.userData.type, 'CustomParametric');
  assert.ok(geo.attributes.position.count > 100);
});

test('All 8 built-in parametric presets generate valid 3D geometries', () => {
  const presetKeys = Object.keys(Nexus3DInspector.PARAMETRIC_PRESETS);
  assert.ok(presetKeys.length >= 8);

  presetKeys.forEach(key => {
    const preset = Nexus3DInspector.PARAMETRIC_PRESETS[key];
    const geo = Nexus3DInspector.createCustomParametricGeometry({
      fx: preset.fx,
      fy: preset.fy,
      fz: preset.fz,
      uMin: preset.uMin,
      uMax: preset.uMax,
      vMin: preset.vMin,
      vMax: preset.vMax,
      segmentsU: 16,
      segmentsV: 16,
      scale: preset.scale
    });

    assert.ok(geo.attributes.position, `Preset ${key} position missing`);
    assert.ok(geo.attributes.position.count > 0, `Preset ${key} empty positions`);
    assert.ok(geo.index, `Preset ${key} missing indices`);
  });
});
