const test = require('node:test');
const assert = require('node:assert/strict');
const NexusOmniPostBridge = require('./nexus-omnipost-bridge.js');
const fs = require('node:fs');
const path = require('node:path');

// =========================================================================
// 1. CONSTANTS & METADATA TESTS
// =========================================================================

test('NexusOmniPostBridge version and constants exist', () => {
  assert.ok(NexusOmniPostBridge.VERSION.includes('motion-bridge'));
  assert.equal(NexusOmniPostBridge.CHANNEL_NAME, 'zoth-nexus-omnipost-bus');
  assert.equal(NexusOmniPostBridge.STORAGE_KEY_PAYLOAD, 'zoth_nexus_omnipost_payload');
  assert.equal(NexusOmniPostBridge.STORAGE_KEY_ACK, 'zoth_nexus_omnipost_ack');
  assert.equal(NexusOmniPostBridge.STORAGE_KEY_TEMPLATE, 'zoth_omnipost_motion_template');
  assert.equal(NexusOmniPostBridge.STORAGE_KEY_HISTORY, 'zoth_nexus_omnipost_history');
  assert.ok(NexusOmniPostBridge.PHI > 1.618);
});

test('All 4 camera transition presets are registered with generators', () => {
  const expectedPresets = [
    'Cinematic Dolly In',
    'Dramatic 360 Spiral',
    'Hero Pan & Tilt',
    'Isometric Flyby'
  ];

  expectedPresets.forEach(presetName => {
    const preset = NexusOmniPostBridge.CAMERA_PRESETS[presetName];
    assert.ok(preset, `Preset '${presetName}' must exist in CAMERA_PRESETS`);
    assert.equal(typeof preset.generator, 'function', `Preset '${presetName}' must have a generator function`);
    assert.ok(preset.duration > 0, `Preset '${presetName}' duration must be positive`);
    assert.ok(preset.defaultFov > 0, `Preset '${presetName}' defaultFov must be positive`);
    assert.ok(preset.description && preset.description.length > 10);
  });
});

// =========================================================================
// 2. MATHEMATICAL CURVES & INTERPOLATORS
// =========================================================================

test('Mathematical easing curves produce bounded normalized outputs', () => {
  // Smoothstep
  assert.equal(NexusOmniPostBridge.smoothstep(0), 0);
  assert.equal(NexusOmniPostBridge.smoothstep(1), 1);
  assert.equal(NexusOmniPostBridge.smoothstep(0.5), 0.5);
  assert.equal(NexusOmniPostBridge.smoothstep(-0.5), 0); // clamped
  assert.equal(NexusOmniPostBridge.smoothstep(1.5), 1); // clamped

  // Smootherstep
  assert.equal(NexusOmniPostBridge.smootherstep(0), 0);
  assert.equal(NexusOmniPostBridge.smootherstep(1), 1);
  assert.equal(NexusOmniPostBridge.smootherstep(0.5), 0.5);

  // EaseInOutCubic
  assert.equal(NexusOmniPostBridge.easeInOutCubic(0), 0);
  assert.equal(NexusOmniPostBridge.easeInOutCubic(1), 1);
  assert.equal(NexusOmniPostBridge.easeInOutCubic(0.5), 0.5);

  // Lerp
  assert.equal(NexusOmniPostBridge.lerp(10, 20, 0.5), 15);
  assert.deepEqual(
    NexusOmniPostBridge.lerpVec3({ x: 0, y: 10, z: -5 }, { x: 10, y: 20, z: 5 }, 0.5),
    { x: 5, y: 15, z: 0 }
  );
});

// =========================================================================
// 3. CAMERA TRAJECTORY PRESET TESTS
// =========================================================================

test("Camera Preset 'Cinematic Dolly In' generates forward push-in with FOV compression", () => {
  const duration = 12.0;
  const fps = 60;
  const traj = NexusOmniPostBridge.computeCameraTrajectory('Cinematic Dolly In', duration, fps);

  assert.equal(traj.preset, 'Cinematic Dolly In');
  assert.equal(traj.duration, 12.0);
  assert.equal(traj.fps, 60);
  assert.equal(traj.totalFrames, 720);
  assert.equal(traj.keyframes.length, 721); // 0 to 720 inclusive

  const firstPoint = traj.keyframes[0];
  const midPoint = traj.keyframes[360];
  const lastPoint = traj.keyframes[720];

  // Starts wide (z around 16), ends close (z around 4.2)
  assert.ok(firstPoint.position.z > 14.0, `Start distance should be wide (got ${firstPoint.position.z})`);
  assert.ok(lastPoint.position.z < 5.0, `End distance should be close (got ${lastPoint.position.z})`);
  assert.ok(firstPoint.position.z > lastPoint.position.z, 'Camera must move forward towards target');

  // Dynamic FOV compression from wide (50 deg) to telephoto (36 deg)
  assert.ok(firstPoint.fov > lastPoint.fov, `FOV must compress (start=${firstPoint.fov}, end=${lastPoint.fov})`);
  assert.equal(firstPoint.fov, 50.0);
  assert.equal(lastPoint.fov, 36.0);

  // Target lock
  assert.equal(firstPoint.target.x, 0);
  assert.equal(lastPoint.target.x, 0);

  // No NaNs across entire trajectory
  traj.keyframes.forEach((pt, idx) => {
    assert.ok(!Number.isNaN(pt.position.x), `Frame ${idx} pos.x is NaN`);
    assert.ok(!Number.isNaN(pt.position.y), `Frame ${idx} pos.y is NaN`);
    assert.ok(!Number.isNaN(pt.position.z), `Frame ${idx} pos.z is NaN`);
    assert.ok(!Number.isNaN(pt.fov), `Frame ${idx} fov is NaN`);
    assert.ok(!Number.isNaN(pt.roll), `Frame ${idx} roll is NaN`);
  });
});

test("Camera Preset 'Dramatic 360 Spiral' generates continuous helical orbit with elevation", () => {
  const duration = 14.0;
  const traj = NexusOmniPostBridge.computeCameraTrajectory('Dramatic 360 Spiral', duration, 30);

  assert.equal(traj.preset, 'Dramatic 360 Spiral');
  assert.equal(traj.keyframes.length, 421);

  const start = traj.keyframes[0];
  const quarter = traj.keyframes[105];
  const half = traj.keyframes[210];
  const threeQuarter = traj.keyframes[315];
  const end = traj.keyframes[420];

  // Verifies full circular quadrants
  assert.ok(start.position.x > 0 && Math.abs(start.position.z) < 1.0); // angle = 0 -> cos=1, sin=0
  assert.ok(Math.abs(quarter.position.x) < 2.0 && quarter.position.z > 0); // angle = 90 deg -> cos=0, sin=1
  assert.ok(half.position.x < 0 && Math.abs(half.position.z) < 2.0); // angle = 180 deg -> cos=-1, sin=0
  assert.ok(Math.abs(threeQuarter.position.x) < 2.0 && threeQuarter.position.z < 0); // angle = 270 deg -> cos=0, sin=-1

  // Verifies ascending elevation
  assert.ok(end.position.y > start.position.y, 'Helical orbit must elevate in Y');
});

test("Camera Preset 'Hero Pan & Tilt' executes sweeping Dutch tilt arc", () => {
  const traj = NexusOmniPostBridge.computeCameraTrajectory('Hero Pan & Tilt', 10.0, 30);

  const start = traj.keyframes[0];
  const end = traj.keyframes[300];

  // Sweeps from left (-9) to right (+7.5)
  assert.ok(start.position.x < -7.0);
  assert.ok(end.position.x > 6.0);

  // Dutch tilt roll transition from negative radians to positive radians
  assert.ok(start.roll < 0, `Start roll should be negative tilt (got ${start.roll})`);
  assert.ok(end.roll > 0, `End roll should be positive tilt (got ${end.roll})`);
});

test("Camera Preset 'Isometric Flyby' performs 45-degree axonometric diagonal flight", () => {
  const traj = NexusOmniPostBridge.computeCameraTrajectory('Isometric Flyby', 12.0, 30);

  const start = traj.keyframes[0];
  const end = traj.keyframes[360];

  // Elevation remains constant for isometric consistency
  assert.equal(start.position.y, 10.5);
  assert.equal(end.position.y, 10.5);
  assert.equal(start.fov, 32.0);
  assert.equal(end.fov, 32.0);

  // Trajectory advances across the diagonal
  assert.ok(end.position.x > start.position.x);
  assert.ok(end.position.z > start.position.z);
});

test('evaluateCameraAt evaluates camera state at exact intermediate timestamps', () => {
  const state0 = NexusOmniPostBridge.evaluateCameraAt('Cinematic Dolly In', 0, 12.0);
  const state6 = NexusOmniPostBridge.evaluateCameraAt('Cinematic Dolly In', 6.0, 12.0);
  const state12 = NexusOmniPostBridge.evaluateCameraAt('Cinematic Dolly In', 12.0, 12.0);

  assert.equal(state0.progress, 0);
  assert.equal(state6.progress, 0.5);
  assert.equal(state12.progress, 0); // wraps modulo duration

  assert.ok(state0.position.z > state6.position.z);
});

// =========================================================================
// 4. SOUNDTRACK SYNCHRONIZATION ENGINE
// =========================================================================

test('pickSoundtrackForScene selects appropriate synth soundtrack for archetypes', () => {
  // Quantum / CAD
  const s1 = NexusOmniPostBridge.pickSoundtrackForScene({ proceduralPrompt: 'Quantum Reactor Tesseract Core' });
  assert.equal(s1.key, 'quantum_nexus');
  assert.equal(s1.bpm, 96);

  // Sacred / Hermetic
  const s2 = NexusOmniPostBridge.pickSoundtrackForScene({ proceduralPrompt: 'Sacred Gold Metatron Crystal Portal' });
  assert.equal(s2.key, 'solfeggio_432');
  assert.equal(s2.bpm, 72);

  // Weapon / Kinetic
  const s3 = NexusOmniPostBridge.pickSoundtrackForScene({ proceduralPrompt: 'Plasma Rifle Blaster Starfighter Dragon Cannon' });
  assert.equal(s3.key, 'draco_swarm');
  assert.equal(s3.bpm, 140);

  // Minimalist
  const s4 = NexusOmniPostBridge.pickSoundtrackForScene({ proceduralPrompt: 'Zen Minimalist Rubin Reducer Monolith 808' });
  assert.equal(s4.key, 'rubin_808');
  assert.equal(s4.bpm, 90);

  // Default Cyberpunk
  const s5 = NexusOmniPostBridge.pickSoundtrackForScene({ proceduralPrompt: 'Cyberpunk Skyscraper Alley' });
  assert.equal(s5.key, 'azoth_transmutation');
  assert.equal(s5.bpm, 122);
});

// =========================================================================
// 5. 3D SCENE DATA EXTRACTOR & PAYLOAD PACKAGER
// =========================================================================

test('extractSceneData packages complete serializable payload with telemetry and lighting', () => {
  const payload = NexusOmniPostBridge.extractSceneData({
    modelName: 'Quantum Torus Accelerator',
    prompt: 'Synthesize a high-tech glowing quantum reactor core with magnetic accelerator rings',
    category: 'scifi',
    cameraPreset: 'Dramatic 360 Spiral',
    duration: 14.0,
    vertexCount: 4096,
    meshCount: 4
  });

  assert.ok(payload.bridgeVersion);
  assert.ok(payload.timestamp > 0);
  assert.equal(payload.model.name, 'Quantum Torus Accelerator');
  assert.equal(payload.model.category, 'scifi');
  assert.equal(payload.model.meshCount, 4);
  assert.equal(payload.model.vertexCount, 4096);

  assert.equal(payload.camera.preset, 'Dramatic 360 Spiral');
  assert.equal(payload.camera.trajectory.duration, 14.0);
  assert.ok(payload.camera.trajectory.keyframes.length > 100);

  assert.ok(payload.lighting.ambient);
  assert.equal(payload.lighting.directionalLights.length, 2);
  assert.equal(payload.lighting.bloom.enabled, true);

  assert.equal(payload.soundtrack.key, 'quantum_nexus');
  assert.equal(payload.lowerThird.title, 'QUANTUM TORUS ACCELERATOR');
  assert.equal(payload.lowerThird.telemetry.meshes, 4);
});

test('extractSceneData extracts topology from simulated Three.js Scene hierarchy', () => {
  const mockScene = {
    traverse: function (callback) {
      // Mock Mesh 1
      callback({
        isMesh: true,
        name: 'CoreReactor',
        geometry: {
          type: 'IcosahedronGeometry',
          attributes: { position: { count: 1200 } },
          index: { count: 3600 }
        },
        material: { type: 'MeshStandardMaterial', wireframe: false },
        visible: true
      });
      // Mock Mesh 2
      callback({
        isMesh: true,
        name: 'OuterRing',
        geometry: {
          type: 'TorusGeometry',
          attributes: { position: { count: 2400 } },
          index: { count: 7200 }
        },
        material: { type: 'MeshPhysicalMaterial', wireframe: true },
        visible: true
      });
      // Non-mesh light
      callback({ isMesh: false, isLight: true });
    }
  };

  const mockCamera = {
    position: { x: 5.2, y: 4.1, z: 10.8 },
    fov: 48,
    aspect: 1.777
  };

  const payload = NexusOmniPostBridge.extractSceneData({
    scene: mockScene,
    camera: mockCamera,
    modelName: 'Dual Reactor Assembly',
    prompt: 'Twin rotating magnetic torus rings',
    cameraPreset: 'Hero Pan & Tilt'
  });

  assert.equal(payload.model.meshCount, 2);
  assert.equal(payload.model.vertexCount, 3600); // 1200 + 2400
  assert.equal(payload.model.faceCount, 3600); // (3600/3) + (7200/3) = 1200 + 2400
  assert.equal(payload.model.primitives.length, 2);
  assert.equal(payload.model.primitives[0].name, 'CoreReactor');
  assert.equal(payload.model.primitives[1].wireframe, true);
  assert.equal(payload.camera.initial.position.x, 5.2);
  assert.equal(payload.camera.initial.fov, 48);
});

// =========================================================================
// 6. MULTI-LAYER MOTION GRAPHICS VIDEO TEMPLATE GENERATOR
// =========================================================================

test('generateMotionTemplate creates compliant 3-layer video template for OmniPost', () => {
  const payload = NexusOmniPostBridge.extractSceneData({
    modelName: 'Hyperion Plasma Cannon',
    prompt: 'Heavy energy plasma cannon with neon heatsinks',
    category: 'weapons',
    cameraPreset: 'Cinematic Dolly In',
    duration: 12.0
  });

  const template = NexusOmniPostBridge.generateMotionTemplate(payload, {
    aspectRatio: '9_16',
    duration: 12.0
  });

  assert.ok(template.templateId.startsWith('nexus_motion_'));
  assert.ok(template.templateName.includes('Hyperion Plasma Cannon'));
  assert.equal(template.aspectRatio, '9_16');
  assert.equal(template.fps, 60);
  assert.equal(template.totalDuration, 12.0);

  // Layer 1: 3D Viewport Stream
  assert.ok(template.layers.layer1_viewportStream);
  assert.equal(template.layers.layer1_viewportStream.cameraPreset, 'Cinematic Dolly In');
  assert.ok(template.layers.layer1_viewportStream.trajectory.keyframes.length > 0);

  // Layer 2: Animated Lower-Third HUD
  assert.ok(template.layers.layer2_lowerThirdHUD);
  assert.equal(template.layers.layer2_lowerThirdHUD.title, 'HYPERION PLASMA CANNON');
  assert.equal(template.layers.layer2_lowerThirdHUD.accentColor, '#00f0ff');

  // Layer 3: Synchronized BGM
  assert.ok(template.layers.layer3_audioSoundtrack);
  assert.equal(template.layers.layer3_audioSoundtrack.trackKey, 'draco_swarm');
  assert.equal(template.layers.layer3_audioSoundtrack.bpm, 140);

  // Slide Sequencer verification
  assert.equal(template.slides.length, 4);
  assert.equal(template.slides[0].title, 'ARCHETYPE INTRO');
  assert.equal(template.slides[1].title, 'CAD TELEMETRY');
  assert.equal(template.slides[2].title, 'PROCEDURAL PBR');
  assert.equal(template.slides[3].title, 'RENDER FINALE');

  // Timing continuity
  assert.equal(template.slides[0].startTime, 0.0);
  assert.equal(template.slides[0].endTime, template.slides[1].startTime);
  assert.equal(template.slides[1].endTime, template.slides[2].startTime);
  assert.equal(template.slides[2].endTime, template.slides[3].startTime);
  assert.equal(template.slides[3].endTime, 12.0);
});

test('generateMotionTemplate supports all 4 camera presets and custom aspect ratios', () => {
  const presets = ['Cinematic Dolly In', 'Dramatic 360 Spiral', 'Hero Pan & Tilt', 'Isometric Flyby'];
  const ratios = ['9_16', '16_9', '1_1'];

  presets.forEach(p => {
    ratios.forEach(r => {
      const payload = NexusOmniPostBridge.extractSceneData({
        modelName: `Artifact ${p}`,
        cameraPreset: p,
        duration: 16.0
      });
      const tpl = NexusOmniPostBridge.generateMotionTemplate(payload, { aspectRatio: r });
      assert.equal(tpl.aspectRatio, r);
      assert.equal(tpl.layers.layer1_viewportStream.cameraPreset, p);
      assert.equal(tpl.totalDuration, 16.0);
    });
  });
});

// =========================================================================
// 7. CROSS-TAB TRANSPORT & BIDIRECTIONAL HANDSHAKE PROTOCOL
// =========================================================================

test('sendToOmniPost serializes to storage and dispatches over channel', () => {
  NexusOmniPostBridge.resetBroadcastChannel();

  // Mock localStorage
  const storage = {};
  global.localStorage = {
    setItem: (k, v) => { storage[k] = v; },
    getItem: (k) => storage[k] || null,
    removeItem: (k) => { delete storage[k]; }
  };

  // Mock BroadcastChannel
  const broadcastMessages = [];
  global.BroadcastChannel = class MockBroadcastChannel {
    constructor(name) {
      this.name = name;
    }
    postMessage(msg) {
      broadcastMessages.push(msg);
    }
    addEventListener() {}
    close() {}
  };

  const payload = NexusOmniPostBridge.extractSceneData({
    modelName: 'Cyber Mech Titan',
    prompt: 'Heavy exoskeleton mech walker'
  });

  const result = NexusOmniPostBridge.sendToOmniPost(payload, { openWindow: false });

  assert.equal(result.success, true);
  assert.ok(result.handoffId.startsWith('handoff_'));
  assert.ok(storage[NexusOmniPostBridge.STORAGE_KEY_PAYLOAD]);
  assert.ok(storage[NexusOmniPostBridge.STORAGE_KEY_TEMPLATE]);

  const storedPayload = JSON.parse(storage[NexusOmniPostBridge.STORAGE_KEY_PAYLOAD]);
  assert.equal(storedPayload.model.name, 'Cyber Mech Titan');

  assert.equal(broadcastMessages.length, 1);
  assert.equal(broadcastMessages[0].type, 'NEXUS_3D_SCENE_EXPORT');
  assert.equal(broadcastMessages[0].payload.model.name, 'Cyber Mech Titan');

  // Test getPendingHandoff & clearPendingHandoff
  const pending = NexusOmniPostBridge.getPendingHandoff();
  assert.ok(pending);
  assert.equal(pending.payload.model.name, 'Cyber Mech Titan');

  NexusOmniPostBridge.clearPendingHandoff();
  assert.equal(NexusOmniPostBridge.getPendingHandoff(), null);
});

test('OmniPost receiver acknowledges incoming handoff and triggers callback', () => {
  NexusOmniPostBridge.resetBroadcastChannel();

  let receivedPayload = null;
  let receivedTemplate = null;
  const channelCallbacks = [];

  global.BroadcastChannel = class MockBroadcastChannel {
    constructor(name) {
      this.name = name;
    }
    addEventListener(event, handler) {
      if (event === 'message') channelCallbacks.push(handler);
    }
    postMessage(msg) {}
    close() {}
  };

  global.window = {
    location: { search: '' },
    addEventListener: () => {}
  };
  global.localStorage = {
    getItem: () => null,
    setItem: () => {}
  };

  NexusOmniPostBridge.initOmniPostReceiver((payload, template) => {
    receivedPayload = payload;
    receivedTemplate = template;
  });

  assert.ok(channelCallbacks.length > 0);

  // Simulate incoming BroadcastChannel event
  const mockExportEvent = {
    data: {
      type: 'NEXUS_3D_SCENE_EXPORT',
      handoffId: 'test_handoff_123',
      payload: {
        model: { name: 'Alchemical Warp Gate' },
        camera: { preset: 'Isometric Flyby' }
      },
      template: {
        totalDuration: 12.0,
        slides: [{ title: 'INTRO', duration: 3.0 }]
      }
    }
  };

  channelCallbacks[0](mockExportEvent);

  assert.ok(receivedPayload);
  assert.equal(receivedPayload.model.name, 'Alchemical Warp Gate');
  assert.ok(receivedTemplate);
  assert.equal(receivedTemplate.totalDuration, 12.0);
});

test('Nexus sender receives ACK from OmniPost receiver', () => {
  NexusOmniPostBridge.resetBroadcastChannel();

  let ackData = null;
  const channelCallbacks = [];

  global.BroadcastChannel = class MockBroadcastChannel {
    constructor(name) {
      this.name = name;
    }
    addEventListener(event, handler) {
      if (event === 'message') channelCallbacks.push(handler);
    }
    postMessage(msg) {}
    close() {}
  };

  NexusOmniPostBridge.initNexusSender((ack) => {
    ackData = ack;
  });

  assert.ok(channelCallbacks.length > 0);

  // Simulate ACK message
  channelCallbacks[0]({
    data: {
      type: 'NEXUS_3D_EXPORT_ACK',
      handoffId: 'handoff_999',
      status: 'received',
      receivedAt: 1771800000000
    }
  });

  assert.ok(ackData);
  assert.equal(ackData.handoffId, 'handoff_999');
  assert.equal(ackData.status, 'received');
});

// =========================================================================
// 8. LOWER-THIRD CANVAS GRAPHICS RENDERER TESTS
// =========================================================================

test('renderLowerThird draws cyber lower-third card without errors on mock Canvas 2D', () => {
  const drawCalls = [];
  const mockCtx = {
    save: () => drawCalls.push('save'),
    restore: () => drawCalls.push('restore'),
    fillRect: (x, y, w, h) => drawCalls.push(`fillRect(${x},${y},${w},${h})`),
    fillText: (text, x, y) => drawCalls.push(`fillText(${text})`),
    beginPath: () => drawCalls.push('beginPath'),
    roundRect: (x, y, w, h, r) => drawCalls.push(`roundRect(${x},${y},${w},${h})`),
    fill: () => drawCalls.push('fill'),
    stroke: () => drawCalls.push('stroke')
  };

  const lowerThirdData = {
    title: 'QUANTUM REACTOR CORE',
    subtitle: 'Procedural 3D Mesh Deformation // CAD WebGL Viewport',
    badge: 'CAD // 60 FPS',
    telemetry: { vertices: '1,248', pbr: 'active' },
    primaryColor: '#00f0ff',
    secondaryColor: '#d946ef'
  };

  // Test at time = 0.5s (in portrait 720x1280)
  NexusOmniPostBridge.renderLowerThird(mockCtx, lowerThirdData, 0.5, 12.0, 720, 1280);

  assert.ok(drawCalls.includes('save'));
  assert.ok(drawCalls.includes('restore'));
  assert.ok(drawCalls.some(c => c.includes('fillText(QUANTUM REACTOR CORE)')));
  assert.ok(drawCalls.some(c => c.includes('fillText(● CAD // 60 FPS)')));
  assert.ok(drawCalls.some(c => c.includes('roundRect')));

  // Test at time = 2.0s (in landscape 1280x720)
  drawCalls.length = 0;
  NexusOmniPostBridge.renderLowerThird(mockCtx, lowerThirdData, 2.0, 12.0, 1280, 720);
  assert.ok(drawCalls.some(c => c.includes('fillText(QUANTUM REACTOR CORE)')));
});

// =========================================================================
// 9. HTML INTEGRATION VERIFICATION
// =========================================================================

test('nexus-3d.html includes script, export modal, and bottom HUD action', () => {
  const htmlPath = path.join(__dirname, 'nexus-3d.html');
  const html = fs.readFileSync(htmlPath, 'utf8');

  // Script include
  assert.ok(html.includes('nexus-omnipost-bridge.js'), 'nexus-3d.html must include nexus-omnipost-bridge.js');

  // Prominent button
  assert.ok(html.includes('Export to OmniPost Video Studio'), 'nexus-3d.html must contain prominent Export button');
  assert.ok(html.includes('id="btn-export-omnipost"'), 'nexus-3d.html must contain btn-export-omnipost element');

  // Modal
  assert.ok(html.includes('id="omnipost-export-modal"'), 'nexus-3d.html must contain omnipost-export-modal');
  assert.ok(html.includes('Cinematic Dolly In'), 'Modal must contain Cinematic Dolly In option');
  assert.ok(html.includes('Dramatic 360 Spiral'), 'Modal must contain Dramatic 360 Spiral option');
  assert.ok(html.includes('Hero Pan & Tilt'), 'Modal must contain Hero Pan & Tilt option');
  assert.ok(html.includes('Isometric Flyby'), 'Modal must contain Isometric Flyby option');

  // JS functions
  assert.ok(html.includes('function openOmniPostExportModal'), 'nexus-3d.html must define openOmniPostExportModal');
  assert.ok(html.includes('function exportActiveSceneToOmniPost'), 'nexus-3d.html must define exportActiveSceneToOmniPost');
});

test('omnipost.html includes bridge script, receiver, toast HUD, and camera trajectory renderer', () => {
  const htmlPath = path.join(__dirname, 'omnipost.html');
  const html = fs.readFileSync(htmlPath, 'utf8');

  // Script include
  assert.ok(html.includes('nexus-omnipost-bridge.js'), 'omnipost.html must include nexus-omnipost-bridge.js');

  // Receiver & Toast
  assert.ok(html.includes('initOmniPostReceiver'), 'omnipost.html must initialize receiver');
  assert.ok(html.includes('showOmniPostBridgeToast'), 'omnipost.html must define showOmniPostBridgeToast');
  assert.ok(html.includes('activeNexusHandoff'), 'omnipost.html must store activeNexusHandoff');

  // Canvas lower third & trajectory integration
  assert.ok(html.includes('renderLowerThird'), 'omnipost.html must call renderLowerThird');
  assert.ok(html.includes('evaluateCameraAt'), 'omnipost.html must call evaluateCameraAt');
});

// =========================================================================
// 10. ROBUSTNESS & GRACEFUL ERROR HANDLING
// =========================================================================

test('Bridge handles empty, missing, or corrupt arguments gracefully', () => {
  // Empty extractSceneData
  const pDefault = NexusOmniPostBridge.extractSceneData();
  assert.ok(pDefault.model.name);
  assert.ok(pDefault.camera.preset);

  // Unknown camera preset falls back safely
  const pCustom = NexusOmniPostBridge.extractSceneData({ cameraPreset: 'NonExistentPreset' });
  assert.ok(pCustom.camera.trajectory.keyframes.length > 0);

  // Invalid duration handled
  const trajInvalid = NexusOmniPostBridge.computeCameraTrajectory('Cinematic Dolly In', -5, 0);
  assert.ok(trajInvalid.duration > 0);
  assert.ok(trajInvalid.fps > 0);

  // Null ctx in renderLowerThird does not throw
  assert.doesNotThrow(() => {
    NexusOmniPostBridge.renderLowerThird(null, {}, 0, 10, 720, 1280);
  });
});
