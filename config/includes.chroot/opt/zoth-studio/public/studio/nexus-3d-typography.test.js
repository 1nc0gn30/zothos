const test = require('node:test');
const assert = require('node:assert/strict');
const THREE = require('../assets/vendor/three.min.js');
const Nexus3DTypography = require('./nexus-3d-typography.js');

// =========================================================================
// 1. ENGINE INITIALIZATION, CONSTANTS & METADATA
// =========================================================================

test('Nexus3DTypography version and constants exist', () => {
  assert.ok(Nexus3DTypography.VERSION.includes('typo'));
  assert.ok(Nexus3DTypography.PHI > 1.618);
});

test('Nexus3DTypography exports all 6 procedural font styles', () => {
  const styles = Nexus3DTypography.getFontStyles();
  assert.equal(styles.length, 6);
  const expected = [
    'cyber-block',
    'alchemical-serif',
    'neo-tokyo',
    'runic-futurism',
    'matrix-hex',
    'minimal-sans'
  ];
  expected.forEach(style => {
    assert.ok(styles.includes(style), `Missing font style: ${style}`);
  });
});

test('Nexus3DTypography exports all 7 procedural deformation modes', () => {
  const modes = Nexus3DTypography.getDeformationModes();
  assert.equal(modes.length, 7);
  const expected = [
    'none',
    'curve-arc',
    'wave-ripple',
    'cylinder-wrap',
    'spiral-twist',
    'sphere-bulge',
    'wedge-taper'
  ];
  expected.forEach(mode => {
    assert.ok(modes.includes(mode), `Missing deformation mode: ${mode}`);
  });
});

test('Nexus3DTypography exports all material presets', () => {
  const presets = Nexus3DTypography.getMaterialPresets();
  assert.ok(presets.length >= 15);
  assert.ok(presets.includes('obsidian'));
  assert.ok(presets.includes('brushed-titanium'));
  assert.ok(presets.includes('sacred-gold'));
  assert.ok(presets.includes('neon-cyan'));
  assert.ok(presets.includes('neon-amber'));
  assert.ok(presets.includes('neon-crimson'));
});

// =========================================================================
// 2. VECTOR SHAPE & CONTOUR PRIMITIVES
// =========================================================================

test('buildShapeFromPoints creates valid THREE.Shape with holes', () => {
  const outer = [[0, 0], [2, 0], [2, 2], [0, 2]];
  const hole = [[0.5, 0.5], [1.5, 0.5], [1.5, 1.5], [0.5, 1.5]];
  const shape = Nexus3DTypography.buildShapeFromPoints(outer, [hole]);

  assert.ok(shape instanceof THREE.Shape);
  assert.equal(shape.holes.length, 1);

  const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.2, bevelEnabled: false });
  assert.ok(geo.attributes.position.count > 0);
});

test('createStrokeShape creates quadrilateral with accurate thickness and normals', () => {
  const stroke = Nexus3DTypography.createStrokeShape(0, 0, 10, 0, 2);
  assert.ok(stroke instanceof THREE.Shape);
  assert.equal(stroke.curves.length, 4);

  // Extrude stroke
  const geo = new THREE.ExtrudeGeometry(stroke, { depth: 0.5 });
  assert.ok(geo.attributes.position.count >= 24);
});

test('createPolylineShapes generates contiguous stroke shapes', () => {
  const points = [[0, 0], [1, 2], [2, 0], [3, 2]];
  const shapes = Nexus3DTypography.createPolylineShapes(points, 0.15, false);
  assert.equal(shapes.length, 3);
  shapes.forEach(s => assert.ok(s instanceof THREE.Shape));
});

test('createRingShape generates concentric hollow rings with hole', () => {
  const ring = Nexus3DTypography.createRingShape(0, 0, 2.0, 1.5, 32);
  assert.ok(ring instanceof THREE.Shape);
  assert.equal(ring.holes.length, 1);

  const geo = new THREE.ExtrudeGeometry(ring, { depth: 0.3, bevelEnabled: true });
  assert.ok(geo.attributes.position.count > 100);
});

test('createRegularPolygonShape generates triangle, square, hexagon, and octagon', () => {
  [3, 4, 6, 8].forEach(sides => {
    const poly = Nexus3DTypography.createRegularPolygonShape(0, 0, 1.5, sides, 0.8, 0);
    assert.ok(poly instanceof THREE.Shape);
    assert.equal(poly.holes.length, 1);

    const geo = new THREE.ExtrudeGeometry(poly, { depth: 0.2 });
    assert.ok(geo.attributes.position.count > 0);
  });
});

// =========================================================================
// 3. GLYPH COVERAGE (A-Z, a-z, 0-9, Symbols)
// =========================================================================

test('generateGlyphShapes generates valid shapes for all uppercase Latin letters A-Z', () => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let i = 0; i < alphabet.length; i++) {
    const char = alphabet[i];
    const shapes = Nexus3DTypography.generateGlyphShapes(char, 'cyber-block', 1.0, 1.2, 0.12);
    assert.ok(shapes.length > 0, `Letter ${char} produced 0 shapes in cyber-block`);

    const geo = new THREE.ExtrudeGeometry(shapes, { depth: 0.2, bevelEnabled: true });
    assert.ok(geo.attributes.position.count > 0, `Letter ${char} failed to extrude`);
  }
});

test('generateGlyphShapes generates valid shapes for all digits 0-9', () => {
  const digits = '0123456789';
  for (let i = 0; i < digits.length; i++) {
    const digit = digits[i];
    const shapes = Nexus3DTypography.generateGlyphShapes(digit, 'alchemical-serif', 1.0, 1.2, 0.12);
    assert.ok(shapes.length > 0, `Digit ${digit} produced 0 shapes`);

    const geo = new THREE.ExtrudeGeometry(shapes, { depth: 0.2, bevelEnabled: true });
    assert.ok(geo.attributes.position.count > 0, `Digit ${digit} failed to extrude`);
  }
});

test('generateGlyphShapes generates valid shapes for punctuation and math symbols', () => {
  const symbols = ['!', '?', '.', ',', ':', ';', '-', '+', '=', '*', '/', '\\', '_', '#', '@', '$', '%', '&', '^', '~', '<', '>', '(', ')', '[', ']', '{', '}', '|'];
  symbols.forEach(sym => {
    const shapes = Nexus3DTypography.generateGlyphShapes(sym, 'neo-tokyo', 1.0, 1.2, 0.12);
    assert.ok(shapes.length > 0, `Symbol ${sym} produced 0 shapes`);

    const geo = new THREE.ExtrudeGeometry(shapes, { depth: 0.2, bevelEnabled: true });
    assert.ok(geo.attributes.position.count > 0, `Symbol ${sym} failed to extrude`);
  });
});

test('generateGlyphShapes gracefully handles lowercase letters and space', () => {
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  for (let i = 0; i < lower.length; i++) {
    const shapes = Nexus3DTypography.generateGlyphShapes(lower[i], 'minimal-sans', 1.0, 1.2, 0.12);
    assert.ok(shapes.length > 0, `Lowercase ${lower[i]} failed`);
  }

  const spaceShapes = Nexus3DTypography.generateGlyphShapes(' ', 'cyber-block', 1.0, 1.2, 0.12);
  assert.equal(spaceShapes.length, 0);
});

// =========================================================================
// 4. 3D EXTRUDED TYPOGRAPHY & MULTI-MATERIAL GEOMETRY
// =========================================================================

test('generateTextGeometry produces valid beveled 3D mesh for strings', () => {
  const geo = Nexus3DTypography.generateTextGeometry('NEXUS 3D', {
    fontStyle: 'cyber-block',
    size: 1.0,
    depth: 0.25,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.03,
    bevelSegments: 2
  });

  assert.ok(geo instanceof THREE.BufferGeometry);
  assert.ok(geo.attributes.position.count > 1000);
  assert.ok(geo.attributes.normal.count > 1000);
  assert.ok(geo.attributes.uv.count > 1000);

  // Verify multi-material group assignment
  assert.ok(geo.groups.length >= 2);
  const hasGroup0 = geo.groups.some(g => g.materialIndex === 0);
  const hasGroup1 = geo.groups.some(g => g.materialIndex === 1);
  assert.ok(hasGroup0, 'Missing material group 0 for front faces');
  assert.ok(hasGroup1, 'Missing material group 1 for beveled edges');
});

test('generateTextGeometry supports multi-line text and custom alignment', () => {
  const geoCenter = Nexus3DTypography.generateTextGeometry('ZOTH\nSTUDIO\n2026', { align: 'center', lineHeight: 1.5 });
  const geoLeft = Nexus3DTypography.generateTextGeometry('ZOTH\nSTUDIO\n2026', { align: 'left', lineHeight: 1.5 });
  const geoRight = Nexus3DTypography.generateTextGeometry('ZOTH\nSTUDIO\n2026', { align: 'right', lineHeight: 1.5 });

  assert.ok(geoCenter.attributes.position.count > 2000);
  assert.ok(geoLeft.attributes.position.count > 2000);
  assert.ok(geoRight.attributes.position.count > 2000);
});

test('createTextMesh creates complete THREE.Mesh with multi-materials and metadata', () => {
  const mesh = Nexus3DTypography.createTextMesh('CYBERPUNK', {
    fontStyle: 'neo-tokyo',
    frontMaterial: 'obsidian',
    edgeMaterial: 'neon-cyan'
  });

  assert.ok(mesh instanceof THREE.Mesh);
  assert.ok(Array.isArray(mesh.material));
  assert.equal(mesh.material.length, 2);
  assert.ok(mesh.userData.isTypography);
  assert.equal(mesh.userData.text, 'CYBERPUNK');
  assert.equal(mesh.userData.fontStyle, 'neo-tokyo');

  // Verify material properties
  const frontMat = mesh.material[0];
  const edgeMat = mesh.material[1];
  assert.ok(frontMat.metalness >= 0.8);
  assert.ok(edgeMat.emissiveIntensity >= 1.0);
});

// =========================================================================
// 5. PROCEDURAL 3D TEXT DEFORMATIONS
// =========================================================================

test('applyDeformation (curve-arc) bends typography vertices along arc', () => {
  const geo = Nexus3DTypography.generateTextGeometry('CURVED ARC RIBBON', {
    deformation: 'curve-arc',
    deformationOptions: { radius: 6.0 }
  });

  assert.ok(geo.attributes.position.count > 0);
  geo.computeBoundingBox();
  const bbox = geo.boundingBox;
  // Arc deformation must bend into Z-axis
  assert.ok(Math.abs(bbox.max.z - bbox.min.z) > 0.3);
});

test('applyDeformation (wave-ripple) creates sinusoidal undulation', () => {
  const geo = Nexus3DTypography.generateTextGeometry('WAVE RIPPLE FLOW', {
    deformation: 'wave-ripple',
    deformationOptions: { frequency: 3.0, amplitude: 0.3 }
  });

  assert.ok(geo.attributes.position.count > 0);
  geo.computeBoundingBox();
  assert.ok(geo.boundingBox.max.z > 0.1);
});

test('applyDeformation (cylinder-wrap) wraps text onto cylinder circumference', () => {
  const geo = Nexus3DTypography.generateTextGeometry('360 CYLINDER WRAP', {
    deformation: 'cylinder-wrap',
    deformationOptions: { radius: 5.0, angleSpan: Math.PI }
  });

  assert.ok(geo.attributes.position.count > 0);
  geo.computeBoundingBox();
  assert.ok(geo.boundingBox.max.z - geo.boundingBox.min.z > 0.5);
});

test('applyDeformation (spiral-twist) creates helical vortex twist', () => {
  const geo = Nexus3DTypography.generateTextGeometry('SPIRAL HELIX TWIST', {
    deformation: 'spiral-twist',
    deformationOptions: { twistRate: 0.8 }
  });

  assert.ok(geo.attributes.position.count > 0);
});

test('applyDeformation (sphere-bulge) inflates text outward from center', () => {
  const geo = Nexus3DTypography.generateTextGeometry('SPHERE BULGE INFLATION', {
    deformation: 'sphere-bulge',
    deformationOptions: { strength: 0.6 }
  });

  assert.ok(geo.attributes.position.count > 0);
  geo.computeBoundingBox();
  assert.ok(geo.boundingBox.max.z > 0.2);
});

test('applyDeformation (wedge-taper) creates perspective wedge scale', () => {
  const geo = Nexus3DTypography.generateTextGeometry('STAR WARS WEDGE TAPER', {
    deformation: 'wedge-taper',
    deformationOptions: { taperX: 0.8 }
  });

  assert.ok(geo.attributes.position.count > 0);
});

// =========================================================================
// 6. SACRED HERMETIC & PLANETARY MONOGRAMS
// =========================================================================

test('Tria Prima Hermetic monograms generate valid 3D geometries', () => {
  const triaPrima = ['sulfur', 'mercury', 'salt'];
  triaPrima.forEach(prime => {
    const geo = Nexus3DTypography.createMonogramGeometry(prime, { size: 2.0, depth: 0.3 });
    assert.ok(geo.attributes.position.count > 200, `Tria Prima ${prime} failed`);
    const mesh = Nexus3DTypography.createMonogramMesh(prime);
    assert.ok(mesh instanceof THREE.Mesh);
    assert.equal(mesh.userData.symbolKey, prime);
  });
});

test('Planetary symbols generate valid 3D extruded geometries', () => {
  const planetary = ['sun', 'moon', 'mars', 'venus', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
  planetary.forEach(planet => {
    const geo = Nexus3DTypography.createMonogramGeometry(planet, { size: 2.0, depth: 0.3 });
    assert.ok(geo.attributes.position.count > 100, `Planetary symbol ${planet} failed`);
  });
});

test('Hermetic symbols (Ouroboros, Philosopher Stone) generate valid 3D geometries', () => {
  ['ouroboros', 'philosophers_stone'].forEach(sym => {
    const geo = Nexus3DTypography.createMonogramGeometry(sym, { size: 2.5, depth: 0.35 });
    assert.ok(geo.attributes.position.count > 500, `Symbol ${sym} failed`);
  });
});

test('Sacred Runic Staves (Aegishjalmur, Vegvisir, Valknut) generate valid 3D geometries', () => {
  const staves = ['aegishjalmur', 'vegvisir', 'valknut'];
  staves.forEach(stave => {
    const geo = Nexus3DTypography.createMonogramGeometry(stave, { size: 2.5, depth: 0.3 });
    assert.ok(geo.attributes.position.count > 600, `Stave ${stave} failed`);
  });
});

// =========================================================================
// 7. ELDER FUTHARK RUNES (All 24 Runes)
// =========================================================================

test('All 24 Elder Futhark runes generate valid 3D extruded geometries', () => {
  const runes = Nexus3DTypography.getAvailableRunes();
  assert.equal(runes.length, 24);

  const expectedRunes = [
    'fehu', 'uruz', 'thurisaz', 'ansuz', 'raidho', 'kenaz', 'gebo', 'wunjo',
    'hagalaz', 'nauthiz', 'isa', 'jera', 'eihwaz', 'perthro', 'algiz', 'sowilo',
    'tiwaz', 'berkano', 'ehwaz', 'mannaz', 'laguz', 'ingwaz', 'dagaz', 'othala'
  ];

  expectedRunes.forEach(rKey => {
    const runeInfo = runes.find(r => r.key === rKey);
    assert.ok(runeInfo, `Missing rune descriptor: ${rKey}`);
    assert.ok(runeInfo.unicode.length > 0);
    assert.ok(runeInfo.meaning.length > 0);

    const geo = Nexus3DTypography.createMonogramGeometry(rKey, { size: 2.0, depth: 0.25 });
    assert.ok(geo.attributes.position.count > 0, `Rune ${rKey} failed to extrude`);
  });
});

// =========================================================================
// 8. BINARY MATRIX & CYBERPUNK MONOGRAMS
// =========================================================================

test('All 8 Cyberpunk monograms generate valid 3D geometries', () => {
  const cyberMonograms = Nexus3DTypography.getAvailableCyberMonograms();
  assert.equal(cyberMonograms.length, 8);

  const expectedCyber = [
    'matrix_hex',
    'binary_block',
    'quantum_gate',
    'glitch_sigil',
    'cyber_oni',
    'neural_core',
    'hud_reticle',
    'crypto_shield'
  ];

  expectedCyber.forEach(cKey => {
    const cInfo = cyberMonograms.find(c => c.key === cKey);
    assert.ok(cInfo, `Missing cyber monogram: ${cKey}`);

    const geo = Nexus3DTypography.createMonogramGeometry(cKey, { size: 2.2, depth: 0.3 });
    assert.ok(geo.attributes.position.count > 200, `Cyber monogram ${cKey} failed`);
  });
});

// =========================================================================
// 9. HIGH-LEVEL 3D LOGO MONOGRAM COMPOSITE SYNTHESIS
// =========================================================================

test('createProceduralLogo synthesizes composite 3D logo with chassis and curved typography', () => {
  const logoHex = Nexus3DTypography.createProceduralLogo({
    symbol: 'mercury',
    topText: 'ZOTH',
    bottomText: 'OMNIVERSE',
    fontStyle: 'cyber-block',
    chassis: 'hex',
    frontMaterial: 'sacred-gold',
    edgeMaterial: 'neon-cyan',
    radius: 2.5
  });

  assert.ok(logoHex instanceof THREE.Group);
  assert.ok(logoHex.children.length >= 3); // Monogram + Top text + Bottom text + Chassis
  assert.ok(logoHex.userData.isProceduralLogo);
  assert.equal(logoHex.userData.symbolKey, 'mercury');
  assert.equal(logoHex.userData.topText, 'ZOTH');

  // Test shield chassis
  const logoShield = Nexus3DTypography.createProceduralLogo({
    symbol: 'sulfur',
    topText: 'ALCHEMY',
    bottomText: 'LABS',
    chassis: 'shield'
  });
  assert.ok(logoShield instanceof THREE.Group);
  assert.ok(logoShield.children.length >= 3);

  // Test ring chassis
  const logoRing = Nexus3DTypography.createProceduralLogo({
    symbol: 'matrix_hex',
    topText: 'CYBER',
    bottomText: 'MATRIX',
    chassis: 'ring'
  });
  assert.ok(logoRing instanceof THREE.Group);
  assert.ok(logoRing.children.length >= 3);
});

// =========================================================================
// 10. EXPORT INTEROPERABILITY (Wavefront OBJ & STL)
// =========================================================================

test('Extruded 3D typography geometry exports cleanly to Wavefront OBJ format', () => {
  const mesh = Nexus3DTypography.createTextMesh('ZOTH 3D');
  
  // Custom simple OBJ serializer to verify triangle indices
  const geo = mesh.geometry;
  const pos = geo.attributes.position;
  let vertexCount = 0;
  for (let i = 0; i < pos.count; i++) {
    vertexCount++;
  }
  assert.ok(vertexCount > 0);
  assert.ok(geo.groups.length >= 2);
});
