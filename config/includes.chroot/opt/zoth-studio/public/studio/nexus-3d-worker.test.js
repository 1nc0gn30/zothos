const test = require('node:test');
const assert = require('node:assert/strict');
const THREE = require('../assets/vendor/three.min.js');
const { Nexus3DWorkerBridge, Nexus3DWorkerCore } = require('./nexus-3d-worker.js');
const Nexus3DGenerator = require('./nexus-3d-generator.js');

// =========================================================================
// 1. ENGINE EXPORTS & VERSIONING
// =========================================================================

test('Nexus3DWorker exports and versioning are properly registered', () => {
  assert.ok(Nexus3DWorkerBridge, 'Nexus3DWorkerBridge must be exported');
  assert.ok(Nexus3DWorkerCore, 'Nexus3DWorkerCore must be exported');
  assert.ok(Nexus3DWorkerBridge.VERSION.includes('worker-threading'), 'Version string matches worker specification');
  assert.equal(typeof Nexus3DWorkerBridge.init, 'function');
  assert.equal(typeof Nexus3DWorkerBridge.displaceNoiseAsync, 'function');
  assert.equal(typeof Nexus3DWorkerBridge.displaceGeometry, 'function');
  assert.equal(typeof Nexus3DWorkerBridge.generateMarchingCubesAsync, 'function');
  assert.equal(typeof Nexus3DWorkerBridge.generateMarchingCubesGeometry, 'function');
  assert.equal(typeof Nexus3DWorkerBridge.performCSGAsync, 'function');
  assert.equal(typeof Nexus3DWorkerBridge.performCSGGeometry, 'function');
  assert.equal(typeof Nexus3DWorkerBridge.sliceGeometryAsync, 'function');
  assert.equal(typeof Nexus3DWorkerBridge.runBenchmark, 'function');
  assert.equal(typeof Nexus3DWorkerBridge.getStats, 'function');
});

test('Nexus3DWorkerCore mathematical primitives are complete and exact', () => {
  const v1 = new Nexus3DWorkerCore.Vector(1, 2, 3);
  const v2 = new Nexus3DWorkerCore.Vector(4, 5, 6);

  const sum = v1.add(v2);
  assert.equal(sum.x, 5); assert.equal(sum.y, 7); assert.equal(sum.z, 9);

  const dot = v1.dot(v2);
  assert.equal(dot, 32);

  const cross = new Nexus3DWorkerCore.Vector(1, 0, 0).cross(new Nexus3DWorkerCore.Vector(0, 1, 0));
  assert.equal(cross.x, 0); assert.equal(cross.y, 0); assert.equal(cross.z, 1);

  const norm = new Nexus3DWorkerCore.Vector(0, 4, 0).normalize();
  assert.equal(norm.y, 1.0);
  assert.equal(norm.length(), 1.0);
});

// =========================================================================
// 2. SIMPLEX NOISE VOLUMETRIC DISPLACEMENT
// =========================================================================

test('Simplex noise volumetric displacement perturbs vertex positions and calculates normals', async () => {
  // Create a 10x10 plane vertex array (100 vertices = 300 floats)
  const vertCount = 100;
  const positions = new Float32Array(vertCount * 3);
  const normals = new Float32Array(vertCount * 3);

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      const idx = (i * 10 + j) * 3;
      positions[idx] = i * 0.5 - 2.5;
      positions[idx + 1] = 0; // flat plane
      positions[idx + 2] = j * 0.5 - 2.5;

      normals[idx] = 0;
      normals[idx + 1] = 1;
      normals[idx + 2] = 0;
    }
  }

  const res = await Nexus3DWorkerBridge.displaceNoiseAsync(positions, normals, {
    frequency: 1.0,
    amplitude: 0.8,
    octaves: 3,
    power: 1.0
  });

  assert.ok(res.positions instanceof Float32Array);
  assert.ok(res.normals instanceof Float32Array);
  assert.equal(res.count, vertCount);
  assert.equal(res.positions.length, positions.length);

  // Check that at least some vertices have been displaced along Y axis
  let displacedCount = 0;
  for (let i = 0; i < vertCount; i++) {
    const yVal = res.positions[i * 3 + 1];
    if (Math.abs(yVal) > 1e-4) displacedCount++;
  }
  assert.ok(displacedCount > 80, `Expected most vertices to be displaced by noise, got ${displacedCount}`);

  // Check that normal vectors remain valid unit length
  for (let i = 0; i < vertCount; i++) {
    const nx = res.normals[i * 3], ny = res.normals[i * 3 + 1], nz = res.normals[i * 3 + 2];
    const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
    assert.ok(Math.abs(len - 1.0) < 1e-2 || len === 0, `Normal at vertex ${i} must be unit length`);
  }
});

test('displaceGeometry updates Three.js BufferGeometry in-place', async () => {
  const geo = new THREE.PlaneGeometry(10, 10, 16, 16);
  const initialZ = geo.attributes.position.getZ(0);
  assert.equal(initialZ, 0);

  const updatedGeo = await Nexus3DWorkerBridge.displaceGeometry(geo, {
    amplitude: 0.5,
    frequency: 1.5,
    octaves: 4
  });

  assert.equal(updatedGeo, geo);
  assert.notEqual(geo.attributes.position.getZ(0), 0);
  assert.ok(geo.attributes.position.version > 0, 'BufferAttribute version should increment on update');
  assert.ok(geo.boundingBox !== null, 'Bounding box should be computed');
  assert.ok(geo.boundingSphere !== null, 'Bounding sphere should be computed');
});

test('Displacement benchmarks high-vertex workloads with high throughput', async () => {
  const highVertCount = 5000;
  const positions = new Float32Array(highVertCount * 3);
  const normals = new Float32Array(highVertCount * 3);

  for (let i = 0; i < highVertCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    normals[i * 3] = 0; normals[i * 3 + 1] = 1; normals[i * 3 + 2] = 0;
  }

  const t0 = Date.now();
  const res = await Nexus3DWorkerBridge.displaceNoiseAsync(positions, normals, {
    frequency: 0.8,
    amplitude: 0.35,
    octaves: 2
  });
  const t1 = Date.now();
  const dur = Math.max(1, t1 - t0);

  assert.equal(res.count, highVertCount);
  const throughput = highVertCount / (dur / 1000);
  assert.ok(throughput > 10000, `Throughput ${throughput} verts/sec should exceed 10,000 verts/sec`);
});

// =========================================================================
// 3. MARCHING CUBES 3D VOXEL POTENTIAL FIELD EXTRACTION
// =========================================================================

test('Marching Cubes generates organic isosurface with wyvill potential field', async () => {
  const res = await Nexus3DWorkerBridge.generateMarchingCubesAsync({
    resolution: 20,
    isolation: 20.0,
    bounds: { min: [-2, -2, -2], max: [2, 2, 2] },
    fieldFunction: 'wyvill',
    blobs: [
      { x: -0.4, y: 0, z: 0, radius: 1.2, strength: 35.0, polarity: 1.0 },
      { x: 0.4, y: 0, z: 0, radius: 1.2, strength: 35.0, polarity: 1.0 }
    ],
    noiseEnabled: false
  });

  assert.ok(res.positions instanceof Float32Array);
  assert.ok(res.normals instanceof Float32Array);
  assert.ok(res.uvs instanceof Float32Array);
  assert.ok(res.vertexCount > 50, `Expected isosurface triangles, got ${res.vertexCount}`);
  assert.equal(res.positions.length, res.vertexCount * 3);
  assert.equal(res.normals.length, res.vertexCount * 3);
  assert.equal(res.uvs.length, res.vertexCount * 2);

  // Validate normals are normalized
  for (let i = 0; i < Math.min(res.vertexCount, 100); i++) {
    const nx = res.normals[i * 3], ny = res.normals[i * 3 + 1], nz = res.normals[i * 3 + 2];
    const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
    assert.ok(Math.abs(len - 1.0) < 1e-2 || len === 0, `Gradient normal at vertex ${i} must be normalized`);
  }
});

test('Marching Cubes supports gaussian and inverse_square potential fields with Simplex noise perturbation', async () => {
  const gaussianRes = await Nexus3DWorkerBridge.generateMarchingCubesAsync({
    resolution: 18,
    isolation: 15.0,
    fieldFunction: 'gaussian',
    blobs: [{ x: 0, y: 0, z: 0, radius: 1.0, strength: 40.0, polarity: 1.0 }],
    noiseEnabled: true,
    noiseScale: 2.0,
    noiseStrength: 0.3
  });

  assert.ok(gaussianRes.vertexCount > 0);

  const invSqRes = await Nexus3DWorkerBridge.generateMarchingCubesAsync({
    resolution: 18,
    isolation: 18.0,
    fieldFunction: 'inverse_square',
    blobs: [
      { x: -0.5, y: 0, z: 0, radius: 0.9, strength: 30.0, polarity: 1.0 },
      { x: 0.5, y: 0, z: 0, radius: 0.9, strength: 30.0, polarity: -0.5 } // Negative charge repellent
    ],
    noiseEnabled: false
  });

  assert.ok(invSqRes.vertexCount > 0);
});

test('generateMarchingCubesGeometry produces compliant Three.js BufferGeometry', async () => {
  const geo = await Nexus3DWorkerBridge.generateMarchingCubesGeometry({
    resolution: 20,
    isolation: 20.0,
    blobs: [{ x: 0, y: 0, z: 0, radius: 1.2, strength: 35.0 }]
  }, THREE);

  assert.ok(geo.isBufferGeometry);
  assert.ok(geo.attributes.position);
  assert.ok(geo.attributes.normal);
  assert.ok(geo.attributes.uv);
  assert.ok(geo.attributes.position.count > 0);
  assert.ok(geo.boundingBox !== null);
});

// =========================================================================
// 4. CSG BOOLEAN OPERATIONS & BSP TREE CLIPPING
// =========================================================================

test('Asynchronous CSG Boolean subtracts cutter from base solid', async () => {
  const boxGeo = new THREE.BoxGeometry(2, 2, 2);
  const cylGeo = new THREE.CylinderGeometry(0.5, 0.5, 3, 16);

  const subtractGeo = await Nexus3DWorkerBridge.performCSGGeometry('subtract', boxGeo, cylGeo, {}, THREE);

  assert.ok(subtractGeo.isBufferGeometry);
  assert.ok(subtractGeo.attributes.position.count > 0);
  assert.ok(subtractGeo.attributes.normal.count > 0);
});

test('Asynchronous CSG Boolean computes union and intersection of geometries', async () => {
  const boxA = new THREE.BoxGeometry(1.5, 1.5, 1.5);
  const boxB = new THREE.BoxGeometry(1.5, 1.5, 1.5);

  const unionGeo = await Nexus3DWorkerBridge.performCSGGeometry('union', boxA, boxB, {}, THREE);
  assert.ok(unionGeo.isBufferGeometry);
  assert.ok(unionGeo.attributes.position.count > 0);

  const intersectGeo = await Nexus3DWorkerBridge.performCSGGeometry('intersect', boxA, boxB, {}, THREE);
  assert.ok(intersectGeo.isBufferGeometry);
  assert.ok(intersectGeo.attributes.position.count > 0);
});

test('Asynchronous CSG slices geometry across mathematical cutting plane', async () => {
  const boxGeo = new THREE.BoxGeometry(2, 2, 2).toNonIndexed();
  const positions = new Float32Array(boxGeo.attributes.position.array);
  const normals = new Float32Array(boxGeo.attributes.normal.array);

  const slicedRes = await Nexus3DWorkerBridge.sliceGeometryAsync({
    positions: positions,
    normals: normals
  }, { x: 0, y: 0, z: 0 }, { x: 0, y: 1, z: 0 }); // Y = 0 cutting plane

  assert.ok(slicedRes.positions instanceof Float32Array);
  assert.ok(slicedRes.vertexCount > 0, 'Front slice should contain clipped polygons');
  assert.equal(slicedRes.positions.length, slicedRes.vertexCount * 3);
  assert.equal(slicedRes.normals.length, slicedRes.vertexCount * 3);
});

// =========================================================================
// 5. INSTANCEDMESH & BATCHEDMESH PROCEDURAL BACKDROP CLUSTERS
// =========================================================================

test('Nexus3DGenerator creates 64+ Cyberpunk Skyscrapers in a single InstancedMesh draw call', () => {
  const instancedSkyscrapers = Nexus3DGenerator.createInstancedBackdropCluster('cyberpunk_skyscrapers', 64, {}, THREE);

  assert.ok(instancedSkyscrapers.isInstancedMesh);
  assert.equal(instancedSkyscrapers.count, 64);
  assert.equal(instancedSkyscrapers.name, 'InstancedCyberpunkSkyscrapers');
  assert.equal(instancedSkyscrapers.userData.instanceCount, 64);
  assert.ok(instancedSkyscrapers.instanceMatrix);
  assert.equal(instancedSkyscrapers.instanceMatrix.count, 64);

  // Verify instance matrices have been populated (not all zeros)
  const matrixArray = instancedSkyscrapers.instanceMatrix.array;
  let nonZeroCount = 0;
  for (let i = 0; i < matrixArray.length; i++) {
    if (matrixArray[i] !== 0) nonZeroCount++;
  }
  assert.ok(nonZeroCount > 64 * 4, 'Instance matrices must contain populated transformations');

  // Verify instance colors
  if (instancedSkyscrapers.instanceColor) {
    assert.equal(instancedSkyscrapers.instanceColor.count, 64);
  }
});

test('Nexus3DGenerator creates 240+ Deep Space Asteroids in a single InstancedMesh draw call', () => {
  const instancedAsteroids = Nexus3DGenerator.createInstancedBackdropCluster('deep_space_asteroids', 240, {}, THREE);

  assert.ok(instancedAsteroids.isInstancedMesh);
  assert.equal(instancedAsteroids.count, 240);
  assert.equal(instancedAsteroids.name, 'InstancedDeepSpaceAsteroidBelt');
  assert.equal(instancedAsteroids.userData.instanceCount, 240);
  assert.equal(instancedAsteroids.instanceMatrix.count, 240);
});

test('Nexus3DGenerator creates 64+ Crystal Spires in a single InstancedMesh draw call', () => {
  const instancedCrystals = Nexus3DGenerator.createInstancedBackdropCluster('crystal_spires', 64, {}, THREE);

  assert.ok(instancedCrystals.isInstancedMesh);
  assert.equal(instancedCrystals.count, 64);
  assert.equal(instancedCrystals.name, 'InstancedCrystalSpires');
  assert.equal(instancedCrystals.userData.instanceCount, 64);
});

test('Nexus3DGenerator benchmarks draw call reduction with over 95% optimization', () => {
  const report = Nexus3DGenerator.benchmarkInstancing(THREE);

  assert.equal(report.status, 'OPTIMIZED');
  assert.equal(report.traditionalDrawCalls, 368); // 64 + 240 + 64
  assert.equal(report.instancedDrawCalls, 3); // 3 single-draw-call clusters
  assert.ok(report.drawCallReductionPercent > 95.0, `Expected >95% reduction, got ${report.drawCallReductionPercent}%`);
  assert.ok(report.drawCallReductionPercent > 99.0, '368 objects down to 3 draw calls is >99% reduction');
  assert.ok(report.breakdown.cyberpunkSkyscrapers.count >= 50);
  assert.ok(report.breakdown.deepSpaceAsteroids.count >= 200);
  assert.ok(report.breakdown.crystalSpires.count >= 50);
});

test('Scene presets integrate InstancedMesh clusters seamlessly', () => {
  const cyberpunkScene = Nexus3DGenerator.synthesizeScenePreset('cyberpunk_megacity');
  let hasInstancedSky = false;
  cyberpunkScene.traverse(child => {
    if (child.isInstancedMesh && child.name === 'InstancedCyberpunkSkyscrapers') {
      hasInstancedSky = true;
    }
  });
  assert.ok(hasInstancedSky, 'Cyberpunk Megacity must contain InstancedCyberpunkSkyscrapers');

  const spaceScene = Nexus3DGenerator.synthesizeScenePreset('deep_space_station');
  let hasInstancedAst = false;
  spaceScene.traverse(child => {
    if (child.isInstancedMesh && child.name === 'InstancedDeepSpaceAsteroidBelt') {
      hasInstancedAst = true;
    }
  });
  assert.ok(hasInstancedAst, 'Deep Space Station must contain InstancedDeepSpaceAsteroidBelt');

  const crystalScene = Nexus3DGenerator.synthesizeScenePreset('crystal_sky_islands');
  let hasInstancedCrys = false;
  crystalScene.traverse(child => {
    if (child.isInstancedMesh && child.name === 'InstancedCrystalSpires') {
      hasInstancedCrys = true;
    }
  });
  assert.ok(hasInstancedCrys, 'Crystal Islands must contain InstancedCrystalSpires');
});

// =========================================================================
// 6. WORKER BRIDGE BENCHMARK SUITE & TELEMETRY
// =========================================================================

test('Nexus3DWorkerBridge executes full benchmark suite and reports telemetry', async () => {
  const report = await Nexus3DWorkerBridge.runBenchmark({ vertexCount: 3000 });

  assert.equal(report.status, 'PASSED');
  assert.ok(report.displacement);
  assert.equal(report.displacement.vertexCount, 3000);
  assert.ok(report.displacement.durationMs >= 0);
  assert.ok(report.displacement.throughputVertsPerSec > 0);

  assert.ok(report.marchingCubes);
  assert.ok(report.marchingCubes.vertexCount > 0);

  const stats = Nexus3DWorkerBridge.getStats();
  assert.ok(stats.tasksCompleted > 0);
  assert.ok(stats.totalVerticesProcessed > 0);
  assert.ok(typeof stats.mode === 'string');
});

test('Nexus3DWorkerBridge handles invalid or corrupt payloads gracefully', async () => {
  await assert.rejects(
    async () => {
      await Nexus3DWorkerBridge.displaceGeometry(null);
    },
    /Invalid BufferGeometry/
  );

  await assert.rejects(
    async () => {
      await Nexus3DWorkerCore.executeTask({ type: 'UNSUPPORTED_TASK_XYZ' });
    },
    /Unsupported Nexus 3D worker task/
  );
});
