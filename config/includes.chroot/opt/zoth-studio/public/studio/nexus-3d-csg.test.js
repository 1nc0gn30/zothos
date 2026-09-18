const test = require('node:test');
const assert = require('node:assert/strict');
const THREE = require('../assets/vendor/three.min.js');
const Nexus3DCSG = require('./nexus-3d-csg.js');

// =========================================================================
// 1. ENGINE EXPORTS & VERSIONING
// =========================================================================

test('Nexus3DCSG version and exports exist', () => {
  assert.ok(Nexus3DCSG.VERSION.includes('csg-metaball'));
  assert.equal(typeof Nexus3DCSG.union, 'function');
  assert.equal(typeof Nexus3DCSG.subtract, 'function');
  assert.equal(typeof Nexus3DCSG.intersect, 'function');
  assert.equal(typeof Nexus3DCSG.drillVentHoles, 'function');
  assert.equal(typeof Nexus3DCSG.carveCoreCavity, 'function');
  assert.equal(typeof Nexus3DCSG.fuseGeometries, 'function');
  assert.equal(typeof Nexus3DCSG.chamferBevel, 'function');
  assert.equal(typeof Nexus3DCSG.createLiquidMetalSculpt, 'function');
  assert.equal(typeof Nexus3DCSG.createPlasmaBlobSculpt, 'function');
  assert.equal(typeof Nexus3DCSG.createBioTissueSculpt, 'function');
  assert.equal(typeof Nexus3DCSG.spawnMetaballs, 'function');
});

// =========================================================================
// 2. VECTOR, VERTEX, PLANE, POLYGON MATH PRIMITIVES
// =========================================================================

test('CSG Vector performs accurate 3D vector arithmetic', () => {
  const v1 = new Nexus3DCSG.Vector(1, 2, 3);
  const v2 = new Nexus3DCSG.Vector(4, 5, 6);

  const sum = v1.add(v2);
  assert.equal(sum.x, 5); assert.equal(sum.y, 7); assert.equal(sum.z, 9);

  const diff = v2.sub(v1);
  assert.equal(diff.x, 3); assert.equal(diff.y, 3); assert.equal(diff.z, 3);

  const dot = v1.dot(v2);
  assert.equal(dot, 1 * 4 + 2 * 5 + 3 * 6); // 32

  const cross = new Nexus3DCSG.Vector(1, 0, 0).cross(new Nexus3DCSG.Vector(0, 1, 0));
  assert.equal(cross.x, 0); assert.equal(cross.y, 0); assert.equal(cross.z, 1);

  const norm = new Nexus3DCSG.Vector(0, 3, 0).normalize();
  assert.equal(norm.length(), 1.0);
  assert.equal(norm.y, 1.0);

  const lerp = v1.lerp(v2, 0.5);
  assert.equal(lerp.x, 2.5); assert.equal(lerp.y, 3.5); assert.equal(lerp.z, 4.5);
});

test('CSG Vertex interpolates position, unit normal, and UVs', () => {
  const vertA = new Nexus3DCSG.Vertex(
    new Nexus3DCSG.Vector(0, 0, 0),
    new Nexus3DCSG.Vector(0, 1, 0),
    { x: 0, y: 0 }
  );
  const vertB = new Nexus3DCSG.Vertex(
    new Nexus3DCSG.Vector(2, 4, 6),
    new Nexus3DCSG.Vector(0, 0, 1),
    { x: 1, y: 1 }
  );

  const mid = vertA.interpolate(vertB, 0.5);
  assert.equal(mid.pos.x, 1);
  assert.equal(mid.pos.y, 2);
  assert.equal(mid.pos.z, 3);
  assert.equal(mid.uv.x, 0.5);
  assert.equal(mid.uv.y, 0.5);
  assert.ok(Math.abs(mid.normal.length() - 1.0) < 1e-4);

  vertA.flip();
  assert.equal(vertA.normal.y, -1);
});

test('CSG Plane classifies and splits polygons with precision', () => {
  const plane = new Nexus3DCSG.Plane(new Nexus3DCSG.Vector(0, 1, 0), 0); // Y = 0 plane

  // Polygon entirely in front (Y > 0)
  const polyFront = new Nexus3DCSG.Polygon([
    new Nexus3DCSG.Vertex(new Nexus3DCSG.Vector(0, 1, 0)),
    new Nexus3DCSG.Vertex(new Nexus3DCSG.Vector(1, 1, 0)),
    new Nexus3DCSG.Vertex(new Nexus3DCSG.Vector(0, 2, 0))
  ]);

  const fList = [], bList = [], cpF = [], cpB = [];
  plane.splitPolygon(polyFront, cpF, cpB, fList, bList);
  assert.equal(fList.length, 1);
  assert.equal(bList.length, 0);

  // Polygon spanning the plane (from Y = -1 to Y = 1)
  const polySpanning = new Nexus3DCSG.Polygon([
    new Nexus3DCSG.Vertex(new Nexus3DCSG.Vector(0, -1, 0)),
    new Nexus3DCSG.Vertex(new Nexus3DCSG.Vector(2, -1, 0)),
    new Nexus3DCSG.Vertex(new Nexus3DCSG.Vector(1, 1, 0))
  ]);

  const fSplit = [], bSplit = [];
  plane.splitPolygon(polySpanning, cpF, cpB, fSplit, bSplit);
  assert.ok(fSplit.length >= 1, 'Front sub-polygon created');
  assert.ok(bSplit.length >= 1, 'Back sub-polygon created');
});

// =========================================================================
// 3. CSG CONVERSION & THREE.JS BUFFERGEOMETRY ADAPTER
// =========================================================================

test('CSG fromMesh / fromGeometry extracts valid planar polygons from Box and Cylinder', () => {
  const box = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2));
  box.updateMatrixWorld(true);
  const csgBox = Nexus3DCSG.CSG.fromMesh(box);
  assert.equal(csgBox.polygons.length, 12); // 6 faces * 2 tris

  const cyl = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 2, 16));
  cyl.updateMatrixWorld(true);
  const csgCyl = Nexus3DCSG.CSG.fromMesh(cyl);
  assert.ok(csgCyl.polygons.length >= 32);
});

test('CSG toGeometry and toMesh produces complete Three.js BufferGeometry with normals and UVs', () => {
  const box = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2));
  const csg = Nexus3DCSG.CSG.fromMesh(box);
  const geo = csg.toGeometry();

  assert.ok(geo.isBufferGeometry);
  assert.equal(geo.attributes.position.count, 36); // 12 tris * 3
  assert.equal(geo.attributes.normal.count, 36);
  assert.equal(geo.attributes.uv.count, 36);
  assert.ok(geo.boundingBox);
  assert.ok(geo.boundingSphere);

  const mesh = csg.toMesh(new THREE.MeshStandardMaterial({ color: 0x00f0ff }));
  assert.ok(mesh.isMesh);
  assert.ok(mesh.geometry.isBufferGeometry);
  assert.equal(mesh.geometry.attributes.position.count, 36);
});

// =========================================================================
// 4. CSG BOOLEAN OPERATIONS (UNION, SUBTRACT, INTERSECT, INVERSE)
// =========================================================================

test('CSG Union merges two intersecting cubes into a single solid', () => {
  const boxA = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2));
  const boxB = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2));
  boxB.position.set(1, 0, 0);
  boxA.updateMatrixWorld(true);
  boxB.updateMatrixWorld(true);

  const csgA = Nexus3DCSG.CSG.fromMesh(boxA);
  const csgB = Nexus3DCSG.CSG.fromMesh(boxB);
  const unionCSG = csgA.union(csgB);
  const unionGeo = unionCSG.toGeometry();

  assert.ok(unionGeo.attributes.position.count > 36);
  // Bounding box X should span from -1 to 2 = 3 units
  assert.ok(unionGeo.boundingBox.max.x >= 1.95);
  assert.ok(unionGeo.boundingBox.min.x <= -0.95);
});

test('CSG Subtract carves cylindrical hole straight through cube', () => {
  const box = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2));
  const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 3, 16));
  box.updateMatrixWorld(true);
  cyl.updateMatrixWorld(true);

  const csgBox = Nexus3DCSG.CSG.fromMesh(box);
  const csgCyl = Nexus3DCSG.CSG.fromMesh(cyl);
  const subtractedCSG = csgBox.subtract(csgCyl);
  const subGeo = subtractedCSG.toGeometry();

  assert.ok(subGeo.attributes.position.count > 36);
  // Mesh must have bounding box matching the base cube
  assert.ok(Math.abs(subGeo.boundingBox.max.y - 1.0) < 1e-3);
  assert.ok(Math.abs(subGeo.boundingBox.min.y + 1.0) < 1e-3);
});

test('CSG Intersect extracts overlapping volume between box and sphere', () => {
  const box = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2));
  const sphere = new THREE.Mesh(new THREE.SphereGeometry(1.2, 16, 16));
  box.updateMatrixWorld(true);
  sphere.updateMatrixWorld(true);

  const csgBox = Nexus3DCSG.CSG.fromMesh(box);
  const csgSphere = Nexus3DCSG.CSG.fromMesh(sphere);
  const interCSG = csgBox.intersect(csgSphere);
  const interGeo = interCSG.toGeometry();

  assert.ok(interGeo.attributes.position.count > 0);
  assert.ok(interGeo.boundingSphere.radius <= 1.25);
});

test('CSG Inverse flips normal vectors and polygon orientations', () => {
  const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1));
  const csg = Nexus3DCSG.CSG.fromMesh(box);
  const inv = csg.inverse();
  const invGeo = inv.toGeometry();

  assert.equal(invGeo.attributes.position.count, 36);
  // Normals should point inwards
  assert.ok(invGeo.attributes.normal.getX(0) <= 0);
});

// =========================================================================
// 5. HIGH-LEVEL CAD BOOLEAN TOOLS (DRILL, CARVE, FUSE, BEVEL)
// =========================================================================

test('drillVentHoles creates precision cooling vents in linear pattern', () => {
  const chassis = new THREE.Mesh(new THREE.BoxGeometry(3, 1, 2), new THREE.MeshStandardMaterial());
  const ventedChassis = Nexus3DCSG.drillVentHoles(chassis, {
    count: 5,
    radius: 0.12,
    spacing: 0.4,
    pattern: 'linear',
    axis: 'z'
  });

  assert.ok(ventedChassis.isMesh);
  assert.ok(ventedChassis.geometry.attributes.position.count > 36);
  assert.ok(ventedChassis.name.includes('_Vented'));
});

test('drillVentHoles creates radial circular cooling vents array', () => {
  const disc = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 0.4, 24));
  const ventedDisc = Nexus3DCSG.drillVentHoles(disc, {
    count: 8,
    radius: 0.1,
    ringRadius: 0.8,
    pattern: 'circular',
    axis: 'y'
  });

  assert.ok(ventedDisc.isMesh);
  assert.ok(ventedDisc.geometry.attributes.position.count > 48);
});

test('drillVentHoles creates 2D matrix grid and rectangular cooling slots', () => {
  // Grid
  const panelGrid = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 0.5));
  const ventedGrid = Nexus3DCSG.drillVentHoles(panelGrid, {
    rows: 3,
    cols: 3,
    radius: 0.12,
    spacing: 0.6,
    pattern: 'grid',
    axis: 'z'
  });
  assert.ok(ventedGrid.geometry.attributes.position.count > 36);

  // Slots
  const panelSlot = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 0.5));
  const ventedSlots = Nexus3DCSG.drillVentHoles(panelSlot, {
    count: 4,
    slotWidth: 1.2,
    radius: 0.08,
    spacing: 0.5,
    pattern: 'slot',
    axis: 'z'
  });
  assert.ok(ventedSlots.geometry.attributes.position.count > 36);
});

test('carveCoreCavity creates hollow engine housing with front viewport window', () => {
  const engineBlock = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2));
  const hollowEngine = Nexus3DCSG.carveCoreCavity(engineBlock, {
    shape: 'sphere',
    scaleRatio: 0.7,
    accessPort: true,
    portRadius: 0.35,
    portAxis: 'z'
  });

  assert.ok(hollowEngine.isMesh);
  assert.ok(hollowEngine.geometry.attributes.position.count > 36);
  assert.ok(hollowEngine.name.includes('_HollowCore'));
});

test('carveCoreCavity supports box and cylinder interior chambers', () => {
  const baseBox = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2));
  const boxCavity = Nexus3DCSG.carveCoreCavity(baseBox, { shape: 'box', scaleRatio: 0.6, accessPort: false });
  assert.ok(boxCavity.geometry.attributes.position.count > 36);

  const baseCyl = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 2, 16));
  const cylCavity = Nexus3DCSG.carveCoreCavity(baseCyl, { shape: 'cylinder', scaleRatio: 0.6, accessPort: false });
  assert.ok(cylCavity.geometry.attributes.position.count > 36);
});

test('fuseGeometries unifies multiple independent meshes into a seamless manifold', () => {
  const box1 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1));
  const box2 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1));
  const box3 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1));
  box2.position.set(0.8, 0, 0);
  box3.position.set(0, 0.8, 0);
  box1.updateMatrixWorld(true);
  box2.updateMatrixWorld(true);
  box3.updateMatrixWorld(true);

  const fused = Nexus3DCSG.fuseGeometries([box1, box2, box3]);
  assert.ok(fused.isMesh);
  assert.ok(fused.geometry.attributes.position.count > 36);
  assert.equal(fused.name, 'Fused_Composite_Manifold');
});

test('chamferBevel slices corner edges with 45 degree cutters', () => {
  const cube = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2));
  const beveled = Nexus3DCSG.chamferBevel(cube, { bevelSize: 0.2 });

  assert.ok(beveled.isMesh);
  assert.ok(beveled.geometry.attributes.position.count > 36);
  assert.ok(beveled.name.includes('_Beveled'));
});

// =========================================================================
// 6. MARCHING CUBES VOXEL METABALL FIELD GENERATOR
// =========================================================================

test('Marching Cubes lookup tables contain exactly 256 edge entries and 4096 tri entries', () => {
  assert.equal(Nexus3DCSG.MC_EDGE_TABLE.length, 256);
  assert.equal(Nexus3DCSG.MC_TRI_TABLE.length, 4096);
});

test('MetaballField evaluates single blob and multi-blob potential fields', () => {
  const field = new Nexus3DCSG.MetaballField({ resolution: 24, isolation: 20 });
  field.addBlob(0, 0, 0, 1.0, 40);

  // At center (r = 0), potential = 40
  const centerPot = field.evaluatePotential(0, 0, 0);
  assert.equal(centerPot, 40);

  // At r = 1.0, potential = 0
  const edgePot = field.evaluatePotential(1.0, 0, 0);
  assert.equal(edgePot, 0);

  // Add 2nd blob overlapping
  field.addBlob(0.5, 0, 0, 1.0, 40);
  const overlapPot = field.evaluatePotential(0.25, 0, 0);
  assert.ok(overlapPot > 30, 'Overlapping potential is additive');
});

test('MetaballField supports Gaussian and Inverse Square falloff functions', () => {
  const gaussField = new Nexus3DCSG.MetaballField({ fieldFunction: 'gaussian' });
  gaussField.addBlob(0, 0, 0, 1.0, 50);
  assert.equal(gaussField.evaluatePotential(0, 0, 0), 50);
  assert.ok(gaussField.evaluatePotential(1.5, 0, 0) > 0);

  const invField = new Nexus3DCSG.MetaballField({ fieldFunction: 'inverse_square' });
  invField.addBlob(0, 0, 0, 1.0, 50);
  assert.ok(invField.evaluatePotential(0, 0, 0) > 500);
});

test('MetaballField supports Simplex noise perturbation for organic ridges', () => {
  const noiseField = new Nexus3DCSG.MetaballField({
    noiseEnabled: true,
    noiseScale: 2.0,
    noiseStrength: 0.5,
    noiseOctaves: 3
  });
  noiseField.addBlob(0, 0, 0, 1.0, 30);

  const pot1 = noiseField.evaluatePotential(0.3, 0.4, 0.5);
  const pot2 = noiseField.evaluatePotential(0.3, 0.4, 0.5);
  assert.equal(pot1, pot2, 'Deterministic noise potential');
});

test('MetaballField generates watertight 3D BufferGeometry with outward unit normals and UVs', () => {
  const field = new Nexus3DCSG.MetaballField({ resolution: 28, isolation: 20 });
  field.addBlob(-0.5, 0, 0, 1.2, 35);
  field.addBlob(0.5, 0, 0, 1.2, 35);

  const geo = field.generateGeometry();
  assert.ok(geo.isBufferGeometry);
  assert.ok(geo.attributes.position.count > 500);
  assert.equal(geo.attributes.position.count, geo.attributes.normal.count);
  assert.equal(geo.attributes.position.count, geo.attributes.uv.count);

  // Validate unit normals
  const posAttr = geo.attributes.position;
  const normAttr = geo.attributes.normal;
  for (let i = 0; i < Math.min(100, posAttr.count); i++) {
    const nx = normAttr.getX(i), ny = normAttr.getY(i), nz = normAttr.getZ(i);
    const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
    assert.ok(Math.abs(len - 1.0) < 0.05, `Normal length ${len} must be ~1.0`);
  }
});

// =========================================================================
// 7. METABALL SCULPTOR PRESETS & DYNAMIC ANIMATION MODES
// =========================================================================

test('createLiquidMetalSculpt creates specular chrome droplet cluster', () => {
  const mesh = Nexus3DCSG.createLiquidMetalSculpt({ resolution: 26 });
  assert.ok(mesh.isMesh);
  assert.equal(mesh.name, 'Liquid_Metal_Sculpt');
  assert.ok(mesh.userData.isMetaballField);
  assert.equal(mesh.material.metalness, 0.98);
  assert.equal(mesh.material.roughness, 0.02);
});

test('createPlasmaBlobSculpt creates pulsing emissive plasma cluster', () => {
  const mesh = Nexus3DCSG.createPlasmaBlobSculpt({ resolution: 26 });
  assert.ok(mesh.isMesh);
  assert.equal(mesh.name, 'Plasma_Blob_Sculpt');
  assert.ok(mesh.userData.isMetaballField);
  assert.ok(mesh.material.transparent);
  assert.ok(mesh.material.emissiveIntensity > 0.5);
});

test('createBioTissueSculpt creates multi-octave cellular organoid tissue', () => {
  const mesh = Nexus3DCSG.createBioTissueSculpt({ resolution: 26 });
  assert.ok(mesh.isMesh);
  assert.equal(mesh.name, 'Bio_Tissue_Sculpt');
  assert.ok(mesh.userData.isMetaballField);
  assert.ok(mesh.userData.field.noiseEnabled);
});

test('spawnMetaballs routes to correct preset', () => {
  const m1 = Nexus3DCSG.spawnMetaballs('liquid-metal', { resolution: 20 });
  assert.equal(m1.name, 'Liquid_Metal_Sculpt');

  const m2 = Nexus3DCSG.spawnMetaballs('plasma-blob', { resolution: 20 });
  assert.equal(m2.name, 'Plasma_Blob_Sculpt');

  const m3 = Nexus3DCSG.spawnMetaballs('bio-tissue', { resolution: 20 });
  assert.equal(m3.name, 'Bio_Tissue_Sculpt');
});

test('MetaballField animate updates charge centers across liquid-mercury, plasma-core, and cellular-mitosis', () => {
  const field = new Nexus3DCSG.MetaballField();
  field.addBlob(0, 0, 0, 1.0, 30);
  field.addBlob(0, 0, 0, 1.0, 30);

  // Mercury
  field.animate(1.5, 'liquid-mercury');
  assert.notEqual(field.blobs[0].x, 0);

  // Plasma
  field.animate(2.0, 'plasma-core');
  assert.notEqual(field.blobs[0].z, 0);

  // Mitosis
  field.animate(Math.PI / 2, 'cellular-mitosis');
  assert.ok(field.blobs[0].x !== 0);
  assert.ok(field.blobs[1].x !== 0);
  assert.equal(field.blobs[0].x, -field.blobs[1].x);
});

test('Manifold audit verifies CSG and Metaball meshes produce valid solids', () => {
  const Nexus3DGenerator = require('./nexus-3d-generator.js');

  // CSG subtracted solid audit
  const box = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2));
  const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 3, 16));
  box.updateMatrixWorld(true);
  cyl.updateMatrixWorld(true);

  const vented = Nexus3DCSG.subtract(box, cyl);
  const auditCSG = Nexus3DGenerator.validateMeshManifold(vented);
  assert.equal(auditCSG.isManifold, true);
  assert.equal(auditCSG.nonManifoldEdgesCount, 0);
  assert.ok(auditCSG.volume > 5.0 && auditCSG.volume < 8.0);

  // Metaballs audit (watertight closed manifold)
  const sculpt = Nexus3DCSG.createLiquidMetalSculpt({ resolution: 24 });
  const auditMeta = Nexus3DGenerator.validateMeshManifold(sculpt);
  assert.equal(auditMeta.isManifold, true);
  assert.equal(auditMeta.isWatertight, true);
  assert.equal(auditMeta.validFor3DPrinting, true);
  assert.equal(auditMeta.nonManifoldEdgesCount, 0);
  assert.equal(auditMeta.boundaryEdgesCount, 0);
  assert.equal(auditMeta.eulerCharacteristic, 2);
});

