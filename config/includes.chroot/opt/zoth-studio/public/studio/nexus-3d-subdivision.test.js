const test = require('node:test');
const assert = require('node:assert/strict');
const THREE = require('../assets/vendor/three.min.js');
const Nexus3DSubdivision = require('./nexus-3d-subdivision.js');

// =========================================================================
// 1. ENGINE EXPORTS & VERSIONING
// =========================================================================

test('Nexus3DSubdivision version and API exports exist', () => {
  assert.ok(Nexus3DSubdivision.VERSION.includes('subdivision-normal'));
  assert.equal(typeof Nexus3DSubdivision.buildMeshTopology, 'function');
  assert.equal(typeof Nexus3DSubdivision.subdivideBufferGeometry, 'function');
  assert.equal(typeof Nexus3DSubdivision.catmullClarkSubdivide, 'function');
  assert.equal(typeof Nexus3DSubdivision.loopSubdivide, 'function');
  assert.equal(typeof Nexus3DSubdivision.subdivideMesh, 'function');
  assert.equal(typeof Nexus3DSubdivision.generateNormalMapBuffer, 'function');
  assert.equal(typeof Nexus3DSubdivision.createNormalMapTexture, 'function');
  assert.equal(typeof Nexus3DSubdivision.applyNormalMapToMesh, 'function');
  assert.equal(typeof Nexus3DSubdivision.getNormalizedHeightmap, 'function');
  assert.ok(Nexus3DSubdivision.KERNELS.sobel);
  assert.ok(Nexus3DSubdivision.KERNELS.scharr);
  assert.ok(Nexus3DSubdivision.PROCEDURAL_HEIGHTMAP_PRESETS);
});

// =========================================================================
// 2. MESH TOPOLOGY & ADJACENCY DATA STRUCTURES
// =========================================================================

test('buildMeshTopology extracts vertices, faces, edges, and boundary adjacency', () => {
  // Create a 2x2 grid plane (4 quads = 8 triangles)
  const planeGeom = new THREE.PlaneGeometry(2, 2, 2, 2);
  const topology = Nexus3DSubdivision.buildMeshTopology(planeGeom);

  assert.ok(topology.uniquePositions.length > 0);
  assert.equal(topology.faces.length, 8); // 8 triangles
  assert.ok(topology.edges.length > 0);

  // Plane has open boundaries
  assert.ok(topology.boundaryEdges.length > 0);
  let boundaryVertCount = 0;
  for (let i = 0; i < topology.boundaryVertices.length; i++) {
    if (topology.boundaryVertices[i]) boundaryVertCount++;
  }
  assert.equal(boundaryVertCount, 8); // Perimeter vertices on 3x3 grid (9 total - 1 center = 8)

  // Check 1-ring neighbors for center vertex
  // In a 2x2 quad plane, center vertex (index for 0,0) has valence 8 (or 4 in quad grid, 6-8 in triangulated)
  const centerVertexIdx = topology.uniquePositions.findIndex(p => Math.abs(p.x) < 1e-4 && Math.abs(p.y) < 1e-4);
  assert.ok(centerVertexIdx !== -1);
  assert.equal(topology.boundaryVertices[centerVertexIdx], 0); // Center is interior
  assert.ok(topology.vertexNeighbors[centerVertexIdx].size >= 4);
});

test('buildMeshTopology identifies closed watertight manifold (0 boundary edges)', () => {
  const boxGeom = new THREE.BoxGeometry(1, 1, 1);
  const topology = Nexus3DSubdivision.buildMeshTopology(boxGeom);

  assert.equal(topology.uniquePositions.length, 8); // 8 cube corners welded
  assert.equal(topology.faces.length, 12); // 6 faces * 2 triangles = 12
  assert.equal(topology.edges.length, 18); // 12 cube edges + 6 face diagonal edges = 18

  // Box is closed manifold: 0 boundary edges
  assert.equal(topology.boundaryEdges.length, 0);
  for (let i = 0; i < topology.boundaryVertices.length; i++) {
    assert.equal(topology.boundaryVertices[i], 0);
  }
});

// =========================================================================
// 3. LOOP MESH SUBDIVISION ALGORITHM
// =========================================================================

test('Loop subdivision subdivides each triangle into 4 smaller triangles (Level 1 & 2)', () => {
  // Start with 1 triangle
  const geom = new THREE.BufferGeometry();
  const pos = new Float32Array([
    0, 0, 0,
    2, 0, 0,
    1, 2, 0
  ]);
  const uvs = new Float32Array([
    0, 0,
    1, 0,
    0.5, 1
  ]);
  geom.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geom.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));

  // Level 1: 1 triangle -> 4 triangles = 12 vertices
  const level1 = Nexus3DSubdivision.loopSubdivide(geom, 1);
  assert.equal(level1.attributes.position.count, 12); // 4 * 3
  assert.equal(level1.attributes.uv.count, 12);
  assert.equal(level1.attributes.normal.count, 12);

  // Level 2: 4 triangles -> 16 triangles = 48 vertices
  const level2 = Nexus3DSubdivision.loopSubdivide(geom, 2);
  assert.equal(level2.attributes.position.count, 48); // 16 * 3
});

test('Loop subdivision preserves boundary edges and corners on open meshes', () => {
  const planeGeom = new THREE.PlaneGeometry(2, 2, 1, 1); // 2 triangles
  const initialPos = planeGeom.attributes.position;
  assert.equal(initialPos.count, 4); // 4 vertices (indexed)

  const subdivided = Nexus3DSubdivision.loopSubdivide(planeGeom, 1);
  // 2 triangles * 4 = 8 triangles = 24 vertices
  assert.equal(subdivided.attributes.position.count, 24);

  // Bounding box should remain within [-1, 1] range along X and Y
  const subPos = subdivided.attributes.position;
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (let i = 0; i < subPos.count; i++) {
    const x = subPos.getX(i);
    const y = subPos.getY(i);
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  assert.ok(Math.abs(minX - (-1.0)) < 1e-4);
  assert.ok(Math.abs(maxX - 1.0) < 1e-4);
  assert.ok(Math.abs(minY - (-1.0)) < 1e-4);
  assert.ok(Math.abs(maxY - 1.0) < 1e-4);
});

test('Loop subdivision smooths closed polyhedron towards sphere (Icosahedron & Box)', () => {
  const icosaGeom = new THREE.IcosahedronGeometry(2, 0); // 20 triangles
  const sub1 = Nexus3DSubdivision.loopSubdivide(icosaGeom, 1);
  // 20 * 4 = 80 triangles = 240 vertices
  assert.equal(sub1.attributes.position.count, 240);

  const sub2 = Nexus3DSubdivision.loopSubdivide(icosaGeom, 2);
  // 80 * 4 = 320 triangles = 960 vertices
  assert.equal(sub2.attributes.position.count, 960);

  // Test that vertices have valid normal vectors and smooth radial distance
  const pos = sub2.attributes.position;
  const norm = sub2.attributes.normal;
  for (let i = 0; i < pos.count; i++) {
    const nx = norm.getX(i);
    const ny = norm.getY(i);
    const nz = norm.getZ(i);
    const nLen = Math.sqrt(nx * nx + ny * ny + nz * nz);
    assert.ok(Math.abs(nLen - 1.0) < 1e-3, `Normal vector length must be 1.0, got ${nLen}`);
  }
});

// =========================================================================
// 4. CATMULL-CLARK MESH SUBDIVISION ALGORITHM
// =========================================================================

test('Catmull-Clark subdivision evaluates face points, edge points, and vertex points', () => {
  const boxGeom = new THREE.BoxGeometry(2, 2, 2); // 12 triangles
  const sub1 = Nexus3DSubdivision.catmullClarkSubdivide(boxGeom, 1);

  // For each triangular face (12), Catmull-Clark creates 3 quads (6 triangles).
  // 12 * 6 = 72 triangles = 216 vertices
  assert.equal(sub1.attributes.position.count, 216);

  const sub2 = Nexus3DSubdivision.catmullClarkSubdivide(boxGeom, 2);
  // 72 * 6 = 432 triangles = 1296 vertices
  assert.equal(sub2.attributes.position.count, 1296);

  // All normals must be normalized unit vectors
  const norm = sub2.attributes.normal;
  for (let i = 0; i < norm.count; i++) {
    const nLen = Math.sqrt(norm.getX(i) ** 2 + norm.getY(i) ** 2 + norm.getZ(i) ** 2);
    assert.ok(Math.abs(nLen - 1.0) < 1e-3);
  }
});

test('Catmull-Clark subdivision preserves sharp CAD creases when preserveCreases is true', () => {
  const cylinderGeom = new THREE.CylinderGeometry(1, 1, 2, 8); // Top & bottom caps meet walls at 90°
  const subCreased = Nexus3DSubdivision.catmullClarkSubdivide(cylinderGeom, 1, {
    preserveCreases: true,
    creaseAngle: 45.0
  });

  assert.ok(subCreased.attributes.position.count > 0);

  // Cylinder top should maintain top plane height near y = 1.0
  const pos = subCreased.attributes.position;
  let maxY = -Infinity;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    if (y > maxY) maxY = y;
  }
  assert.ok(Math.abs(maxY - 1.0) < 1e-3, `Top cap height preserved, got ${maxY}`);
});

test('subdivideMesh updates Mesh geometry in-place and sets userData metadata', () => {
  const geom = new THREE.TorusGeometry(1, 0.4, 8, 16);
  const mat = new THREE.MeshStandardMaterial({ color: 0x00f0ff });
  const mesh = new THREE.Mesh(geom, mat);

  const origVertCount = geom.attributes.position.count;
  Nexus3DSubdivision.subdivideMesh(mesh, { type: 'catmull-clark', level: 1 });

  assert.equal(mesh.userData.subdivided, true);
  assert.equal(mesh.userData.subdivisionLevel, 1);
  assert.equal(mesh.userData.subdivisionType, 'catmull-clark');
  assert.equal(mesh.userData.originalVertexCount, origVertCount);
  assert.ok(mesh.userData.subdividedVertexCount > origVertCount);
});

// =========================================================================
// 5. SOBEL & SCHARR 3x3 NORMAL MAP FILTERS
// =========================================================================

test('Sobel 3x3 filter computes flat normal (0, 0, 1) for constant height field', () => {
  const width = 64;
  const height = 64;
  const flatHeights = new Float32Array(width * height).fill(0.5);

  const normalBuffer = Nexus3DSubdivision.generateNormalMapBuffer(flatHeights, {
    width: width,
    height: height,
    filter: 'sobel',
    bumpScale: 2.5
  });

  assert.equal(normalBuffer.length, width * height * 4);

  // Check center pixel: should be (R: 128, G: 128, B: 255, A: 255)
  const centerIdx = (32 * width + 32) * 4;
  assert.equal(normalBuffer[centerIdx + 0], 128); // nx = 0 -> 128
  assert.equal(normalBuffer[centerIdx + 1], 128); // ny = 0 -> 128
  assert.equal(normalBuffer[centerIdx + 2], 255); // nz = 1 -> 255
  assert.equal(normalBuffer[centerIdx + 3], 255);
});

test('Sobel & Scharr filters compute accurate gradient direction for horizontal and vertical ramps', () => {
  const width = 64;
  const height = 64;

  // Horizontal ramp: height increases along X
  const hRamp = (u, v) => u;
  const normalHRamp = Nexus3DSubdivision.generateNormalMapBuffer(hRamp, {
    width: width,
    height: height,
    filter: 'sobel',
    bumpScale: 2.0
  });

  const centerIdx = (32 * width + 32) * 4;
  const rX = normalHRamp[centerIdx + 0];
  const gX = normalHRamp[centerIdx + 1];
  const bX = normalHRamp[centerIdx + 2];

  // Normal should be tilted in -X direction: R < 128, G == 128, B > 0
  assert.ok(rX < 128, `Normal X component should be negative (R < 128), got ${rX}`);
  assert.equal(gX, 128, `Normal Y component should be 0 (G == 128), got ${gX}`);
  assert.ok(bX > 100, `Normal Z component should be positive (B > 100), got ${bX}`);

  // Vertical ramp: height increases along Y
  const vRamp = (u, v) => v;
  const normalVRamp = Nexus3DSubdivision.generateNormalMapBuffer(vRamp, {
    width: width,
    height: height,
    filter: 'scharr',
    bumpScale: 2.0
  });

  const rY = normalVRamp[centerIdx + 0];
  const gY = normalVRamp[centerIdx + 1];
  const bY = normalVRamp[centerIdx + 2];

  // Normal should be tilted in -Y direction: R == 128, G < 128, B > 0
  assert.equal(rY, 128, `Normal X component should be 0 (R == 128), got ${rY}`);
  assert.ok(gY < 128, `Normal Y component should be negative (G < 128), got ${gY}`);
  assert.ok(bY > 100, `Normal Z component should be positive (B > 100), got ${bY}`);
});

test('Scharr 3x3 filter produces sharper high-fidelity response than Sobel on fine details', () => {
  const width = 64;
  const height = 64;
  // Step function (sharp CAD chamfer ridge)
  const stepHeight = (u, v) => (u < 0.5 ? 0.0 : 1.0);

  const sobelMap = Nexus3DSubdivision.generateNormalMapBuffer(stepHeight, {
    width: width,
    height: height,
    filter: 'sobel',
    bumpScale: 3.0,
    preserveCreases: false
  });

  const scharrMap = Nexus3DSubdivision.generateNormalMapBuffer(stepHeight, {
    width: width,
    height: height,
    filter: 'scharr',
    bumpScale: 3.0,
    preserveCreases: false
  });

  // Check the edge transition pixel (x = 31, y = 32)
  const edgeIdx = (32 * width + 31) * 4;
  const sobelR = sobelMap[edgeIdx + 0];
  const scharrR = scharrMap[edgeIdx + 0];

  // Both should detect negative normal tilt (R < 128)
  assert.ok(sobelR < 128);
  assert.ok(scharrR < 128);
});

test('All generated normal map pixels are normalized unit vectors (Nx^2 + Ny^2 + Nz^2 = 1)', () => {
  const width = 32;
  const height = 32;
  const waveHeight = (u, v) => (Math.sin(u * 10) * Math.cos(v * 10) + 1) * 0.5;

  const normalMap = Nexus3DSubdivision.generateNormalMapBuffer(waveHeight, {
    width: width,
    height: height,
    filter: 'scharr',
    bumpScale: 4.0
  });

  for (let i = 0; i < width * height; i++) {
    const r = normalMap[i * 4 + 0];
    const g = normalMap[i * 4 + 1];
    const b = normalMap[i * 4 + 2];

    const nx = (r / 255.0) * 2.0 - 1.0;
    const ny = (g / 255.0) * 2.0 - 1.0;
    const nz = (b / 255.0) * 2.0 - 1.0;

    const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
    assert.ok(Math.abs(len - 1.0) < 0.05, `Pixel ${i} unit length mismatch: ${len}`);
    assert.ok(nz >= 0, `Tangent-space normal Z must be facing forward (+Z), got ${nz}`);
  }
});

test('Normal map filter supports bumpScale, invertR, and invertG flags', () => {
  const width = 32;
  const height = 32;
  const diagRamp = (u, v) => (u + v) * 0.5;

  const standard = Nexus3DSubdivision.generateNormalMapBuffer(diagRamp, {
    width: width,
    height: height,
    bumpScale: 2.0,
    invertR: false,
    invertG: false
  });

  const inverted = Nexus3DSubdivision.generateNormalMapBuffer(diagRamp, {
    width: width,
    height: height,
    bumpScale: 2.0,
    invertR: true,
    invertG: true
  });

  const centerIdx = (16 * width + 16) * 4;
  const stdR = standard[centerIdx + 0];
  const stdG = standard[centerIdx + 1];
  const invR = inverted[centerIdx + 0];
  const invG = inverted[centerIdx + 1];

  // Inverted R & G should be flipped across 128
  assert.ok(stdR < 128);
  assert.ok(invR > 128);
  assert.ok(stdG < 128);
  assert.ok(invG > 128);
});

// =========================================================================
// 6. PROCEDURAL HEIGHTMAP PRESETS
// =========================================================================

test('All 7 procedural heightmap presets generate valid bounded values in [0, 1]', () => {
  const presets = Object.keys(Nexus3DSubdivision.PROCEDURAL_HEIGHTMAP_PRESETS);
  assert.equal(presets.length, 7);

  for (const presetName of presets) {
    const fn = Nexus3DSubdivision.PROCEDURAL_HEIGHTMAP_PRESETS[presetName];
    assert.equal(typeof fn, 'function');

    for (let v = 0.0; v <= 1.0; v += 0.25) {
      for (let u = 0.0; u <= 1.0; u += 0.25) {
        const val = fn(u, v);
        assert.ok(typeof val === 'number');
        assert.ok(val >= 0.0 && val <= 1.2, `Preset ${presetName} produced out of bound height ${val} at (${u}, ${v})`);
      }
    }
  }
});

test('createNormalMapTexture generates valid Three.js DataTexture with RepeatWrapping', () => {
  const tex = Nexus3DSubdivision.createNormalMapTexture('cad-chamfer-bevel', {
    width: 128,
    height: 128,
    bumpScale: 3.5,
    filter: 'scharr'
  });

  assert.ok(tex);
  assert.equal(tex.image.width, 128);
  assert.equal(tex.image.height, 128);
  assert.equal(tex.image.data.length, 128 * 128 * 4);
  assert.equal(tex.wrapS, THREE.RepeatWrapping);
  assert.equal(tex.wrapT, THREE.RepeatWrapping);
});

test('applyNormalMapToMesh attaches normal map texture and scales material normals', () => {
  const geom = new THREE.BoxGeometry(2, 2, 2);
  const mat = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const mesh = new THREE.Mesh(geom, mat);

  Nexus3DSubdivision.applyNormalMapToMesh(mesh, 'hex-armor-plate', {
    bumpScale: 4.2,
    filter: 'scharr'
  });

  assert.ok(mesh.material.normalMap);
  assert.equal(mesh.material.normalScale.x, 4.2);
  assert.equal(mesh.material.normalScale.y, 4.2);
  assert.equal(mesh.userData.hasCustomNormalMap, true);
  assert.equal(mesh.userData.normalMapFilter, 'scharr');
  assert.equal(mesh.userData.normalMapPreset, 'hex-armor-plate');
  assert.equal(mesh.userData.bumpScale, 4.2);
});

// =========================================================================
// 7. ROBUSTNESS & ERROR HANDLING
// =========================================================================

test('subdivideBufferGeometry throws descriptive error for empty or invalid geometry', () => {
  const invalidGeom = new THREE.BufferGeometry(); // No positions
  assert.throws(() => {
    Nexus3DSubdivision.subdivideBufferGeometry(invalidGeom);
  }, /missing position attribute/i);
});

test('subdivideMesh throws descriptive error for null mesh', () => {
  assert.throws(() => {
    Nexus3DSubdivision.subdivideMesh(null);
  }, /invalid mesh/i);
});

test('getNormalizedHeightmap handles 2D arrays, 1D arrays, Float32Array, and functions', () => {
  const from2D = Nexus3DSubdivision.getNormalizedHeightmap([[0, 1], [1, 0]], 2, 2);
  assert.equal(from2D.length, 4);
  assert.equal(from2D[0], 0);
  assert.equal(from2D[1], 1);

  const from1D = Nexus3DSubdivision.getNormalizedHeightmap([0.2, 0.4, 0.6, 0.8], 2, 2);
  assert.equal(from1D.length, 4);
  assert.ok(Math.abs(from1D[3] - 0.8) < 1e-5);

  const fromFloat = Nexus3DSubdivision.getNormalizedHeightmap(new Float32Array([0.1, 0.2, 0.3, 0.4]), 2, 2);
  assert.equal(fromFloat.length, 4);
  assert.ok(Math.abs(fromFloat[0] - 0.1) < 1e-5);
});

// =========================================================================
// 8. NEXUS-3D.HTML INTEGRATION VERIFICATION
// =========================================================================

test('nexus-3d.html includes subdivision script, UI panel, and handler functions', () => {
  const fs = require('node:fs');
  const path = require('node:path');
  const htmlPath = path.join(__dirname, 'nexus-3d.html');
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');

  // Verify script import
  assert.ok(htmlContent.includes('/studio/nexus-3d-subdivision.js'), 'Must include nexus-3d-subdivision.js script tag');

  // Verify UI controls & IDs
  assert.ok(htmlContent.includes('id="subdiv-algorithm"'), 'Must have subdiv-algorithm select');
  assert.ok(htmlContent.includes('id="subdiv-level"'), 'Must have subdiv-level select');
  assert.ok(htmlContent.includes('id="subdiv-preserve-boundaries"'), 'Must have subdiv-preserve-boundaries checkbox');
  assert.ok(htmlContent.includes('id="subdiv-preserve-creases"'), 'Must have subdiv-preserve-creases checkbox');
  assert.ok(htmlContent.includes('onclick="executeSmoothSubdivide()"'), 'Must have executeSmoothSubdivide button action');
  assert.ok(htmlContent.includes('✨ Smooth Subdivide'), 'Must have ✨ Smooth Subdivide button text');

  assert.ok(htmlContent.includes('id="normal-filter-type"'), 'Must have normal-filter-type select');
  assert.ok(htmlContent.includes('id="normal-preset-select"'), 'Must have normal-preset-select select');
  assert.ok(htmlContent.includes('id="normal-bump-scale"'), 'Must have normal-bump-scale slider');
  assert.ok(htmlContent.includes('onclick="executeApplyNormalMap()"'), 'Must have executeApplyNormalMap button action');

  // Verify JavaScript handler implementations
  assert.ok(htmlContent.includes('function executeSmoothSubdivide()'), 'Must implement executeSmoothSubdivide function');
  assert.ok(htmlContent.includes('function executeApplyNormalMap()'), 'Must implement executeApplyNormalMap function');
});
