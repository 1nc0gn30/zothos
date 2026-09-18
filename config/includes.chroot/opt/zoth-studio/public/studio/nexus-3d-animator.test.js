const test = require('node:test');
const assert = require('node:assert/strict');
const THREE = require('../assets/vendor/three.min.js');
const Nexus3DAnimator = require('./nexus-3d-animator.js');

// =========================================================================
// 1. MODULE INITIALIZATION & EASING SUITE
// =========================================================================

test('Nexus3DAnimator version exists and exports core systems', () => {
  assert.ok(Nexus3DAnimator.VERSION.includes('timeline'));
  assert.ok(Nexus3DAnimator.HoverLevitate);
  assert.ok(Nexus3DAnimator.ExplodedView);
  assert.ok(Nexus3DAnimator.OrbitalTurntable);
  assert.ok(Nexus3DAnimator.PulseBreathe);
  assert.ok(Nexus3DAnimator.WarpSpin);
  assert.ok(Nexus3DAnimator.KeyframeTrack);
  assert.ok(Nexus3DAnimator.AnimationTimeline);
  assert.ok(Nexus3DAnimator.TimelineController);
});

test('Easing library provides smooth mathematical mappings', () => {
  const Easing = Nexus3DAnimator.Easing;
  assert.equal(Easing.linear(0), 0);
  assert.equal(Easing.linear(1), 1);
  assert.equal(Easing.linear(0.5), 0.5);

  assert.equal(Easing.easeInOutCubic(0), 0);
  assert.equal(Easing.easeInOutCubic(1), 1);
  assert.equal(Easing.easeInOutCubic(0.5), 0.5);
  // Quadratic & Cubic curves should be non-linear
  assert.ok(Easing.easeInQuad(0.5) < 0.5);
  assert.ok(Easing.easeOutQuad(0.5) > 0.5);
  assert.ok(Easing.easeInSine(0.5) < 0.5);
  assert.ok(Easing.easeOutSine(0.5) > 0.5);

  // Easing fallback returns valid function
  const fallback = Easing.get('non_existent_easing');
  assert.equal(typeof fallback, 'function');
  assert.equal(fallback(0.5), 0.5);
});

// =========================================================================
// 2. PROCEDURAL GENERATOR: HOVER-LEVITATE
// =========================================================================

test('HoverLevitate computes smooth sinusoidal floating and wobble angles', () => {
  const lev = Nexus3DAnimator.HoverLevitate;
  const state0 = lev.compute(0.0, { amplitude: 0.3, frequency: 1.0 });
  const stateHalfPi = lev.compute(Math.PI / 2, { amplitude: 0.3, frequency: 1.0 });

  assert.equal(state0.offsetY, 0);
  assert.ok(stateHalfPi.offsetY > 0.25, `offsetY ${stateHalfPi.offsetY} should peak near amplitude 0.3`);
  assert.ok(typeof state0.pitch === 'number');
  assert.ok(typeof state0.roll === 'number');
  assert.ok(typeof state0.yaw === 'number');
});

test('HoverLevitate applies transforms non-destructively to Three.js Object3D', () => {
  const lev = Nexus3DAnimator.HoverLevitate;
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial());
  mesh.position.set(2, 5, -3);
  mesh.rotation.set(0.1, 0.2, 0.3);

  // Tick 1
  lev.apply(mesh, 1.0);
  assert.ok(mesh.userData.__animBasePos);
  assert.equal(mesh.userData.__animBasePos.x, 2);
  assert.equal(mesh.userData.__animBasePos.y, 5);
  assert.equal(mesh.userData.__animBasePos.z, -3);
  assert.notEqual(mesh.position.y, 5); // Shifted by levitation wave

  // Tick 2
  lev.apply(mesh, 2.0);
  assert.equal(mesh.position.x, 2);
  assert.equal(mesh.position.z, -3);
});

test('HoverLevitate generates exportable Three.js AnimationClip', () => {
  const clip = Nexus3DAnimator.HoverLevitate.createAnimationClip('HeroShip', 4.0, { fps: 30 });
  assert.ok(clip.name.includes('HoverLevitate'));
  assert.equal(clip.duration, 4.0);
  assert.ok(clip.tracks.length >= 2);

  const posTrack = clip.tracks.find(t => t.name.includes('.position'));
  const rotTrack = clip.tracks.find(t => t.name.includes('.quaternion'));
  assert.ok(posTrack, 'Position track must exist');
  assert.ok(rotTrack, 'Quaternion rotation track must exist');
  assert.equal(posTrack.times.length, 121); // 4 * 30 + 1 frames
});

// =========================================================================
// 3. PROCEDURAL GENERATOR: EXPLODED CAD VIEW SEQUENCER
// =========================================================================

test('ExplodedView computes centroid normal vectors across multi-part composite assembly', () => {
  const exp = Nexus3DAnimator.ExplodedView;
  const group = new THREE.Group();
  group.name = 'EngineAssembly';

  const partL = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1));
  partL.name = 'LeftThruster';
  partL.position.set(-3, 0, 0);

  const partR = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1));
  partR.name = 'RightThruster';
  partR.position.set(3, 0, 0);

  const partTop = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1));
  partTop.name = 'TopIntake';
  partTop.position.set(0, 4, 0);

  group.add(partL);
  group.add(partR);
  group.add(partTop);

  const components = exp.prepareHierarchy(group);
  assert.equal(components.length, 3);

  // Left thruster normal should point primarily towards -X
  const leftItem = components.find(c => c.name === 'LeftThruster');
  assert.ok(leftItem.normalVector.x < -0.8, `Left thruster normal X should be negative, got ${leftItem.normalVector.x}`);

  // Right thruster normal should point primarily towards +X
  const rightItem = components.find(c => c.name === 'RightThruster');
  assert.ok(rightItem.normalVector.x > 0.8, `Right thruster normal X should be positive, got ${rightItem.normalVector.x}`);

  // Top intake normal should point primarily towards +Y
  const topItem = components.find(c => c.name === 'TopIntake');
  assert.ok(topItem.normalVector.y > 0.8, `Top intake normal Y should be positive, got ${topItem.normalVector.y}`);
});

test('ExplodedView parametrically expands components with slider factor 0.0 to 1.0', () => {
  const exp = Nexus3DAnimator.ExplodedView;
  const group = new THREE.Group();
  const part = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1));
  part.position.set(2, 0, 0);
  group.add(part);

  exp.prepareHierarchy(group);

  // Factor 0.0 (Assembled)
  exp.setFactor(group, 0.0, { distance: 4.0 });
  assert.equal(part.position.x, 2.0);

  // Factor 0.5 (Half Exploded)
  exp.setFactor(group, 0.5, { distance: 4.0, ease: 'linear' });
  assert.equal(part.position.x, 4.0); // 2.0 + 4.0 * 0.5

  // Factor 1.0 (Fully Exploded)
  exp.setFactor(group, 1.0, { distance: 4.0, ease: 'linear' });
  assert.equal(part.position.x, 6.0); // 2.0 + 4.0 * 1.0

  // Reset (Collapse back)
  exp.reset(group);
  assert.equal(part.position.x, 2.0);
});

test('ExplodedView handles concentric parts at exact centroid with radial fallback', () => {
  const exp = Nexus3DAnimator.ExplodedView;
  const group = new THREE.Group();
  const core = new THREE.Mesh(new THREE.SphereGeometry(1, 8, 8));
  core.position.set(0, 0, 0);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(2, 0.2, 8, 16));
  ring.position.set(0, 0, 0);

  group.add(core);
  group.add(ring);

  const comps = exp.prepareHierarchy(group);
  assert.equal(comps.length, 2);

  comps.forEach(c => {
    const len = Math.hypot(c.normalVector.x, c.normalVector.y, c.normalVector.z);
    assert.ok(len >= 0.99 && len <= 1.01, `Concentric normal vector must be normalized unit vector, got ${len}`);
  });

  exp.setFactor(group, 1.0, { distance: 3.0 });
  assert.notEqual(core.position.x + core.position.y + core.position.z, ring.position.x + ring.position.y + ring.position.z);
});

test('ExplodedView creates assembly/disassembly AnimationClip with multiple component tracks', () => {
  const exp = Nexus3DAnimator.ExplodedView;
  const group = new THREE.Group();
  const partA = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1));
  partA.name = 'Chassis';
  partA.position.set(-1, 0, 0);
  const partB = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1));
  partB.name = 'BatteryModule';
  partB.position.set(1, 0, 0);
  group.add(partA);
  group.add(partB);

  const clip = exp.createAnimationClip(group, { duration: 6.0, fps: 30, distance: 3.0 });
  assert.ok(clip.isAnimationClip || clip.name.includes('ExplodedCAD'));
  assert.equal(clip.duration, 6.0);
  assert.equal(clip.tracks.length, 2);
  assert.ok(clip.tracks.some(t => t.name === 'Chassis.position'));
  assert.ok(clip.tracks.some(t => t.name === 'BatteryModule.position'));
});

// =========================================================================
// 4. PROCEDURAL GENERATOR: ORBITAL TURNTABLE
// =========================================================================

test('OrbitalTurntable calculates 360-degree rotation angles and camera positions', () => {
  const tt = Nexus3DAnimator.OrbitalTurntable;
  const state0 = tt.compute(0.0, { speed: 1.0, radius: 10.0, height: 5.0 });
  const stateQuarter = tt.compute(0.25, { speed: 1.0, radius: 10.0, height: 5.0 });

  assert.equal(state0.angle, 0);
  assert.equal(state0.cameraPosition.y, 6.5); // height 5 + center.y 1.5
  assert.ok(Math.abs(state0.cameraPosition.z - 10.0) < 1e-4);

  assert.ok(Math.abs(stateQuarter.angle - Math.PI / 2) < 1e-4);
  assert.ok(Math.abs(stateQuarter.cameraPosition.x - 10.0) < 1e-4);
});

test('OrbitalTurntable applies rotation to object and camera', () => {
  const tt = Nexus3DAnimator.OrbitalTurntable;
  const obj = new THREE.Group();
  tt.apply(obj, 0.5, { mode: 'object', speed: 1.0 });
  assert.ok(Math.abs(obj.rotation.y - Math.PI) < 1e-3);

  const cam = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  tt.apply(cam, 0.5, { mode: 'camera', speed: 1.0, radius: 8.0 });
  assert.ok(Math.abs(cam.position.z - (-8.0)) < 1e-3);
});

test('OrbitalTurntable creates 360-degree loop AnimationClip', () => {
  const clip = Nexus3DAnimator.OrbitalTurntable.createAnimationClip('StationTurntable', 5.0);
  assert.ok(clip.tracks.length >= 1);
  assert.equal(clip.duration, 5.0);
  assert.ok(clip.tracks[0].name.includes('.quaternion'));
});

// =========================================================================
// 5. PROCEDURAL GENERATOR: PULSE-BREATHE
// =========================================================================

test('PulseBreathe modulates scale and emissive intensity in sync', () => {
  const pb = Nexus3DAnimator.PulseBreathe;
  const minState = pb.compute(1.5 / 0.8, { frequency: 0.8, baseScale: 1.0, scaleDelta: 0.2, baseEmissive: 0.5, emissiveDelta: 1.0 });
  const maxState = pb.compute(0.5 / 0.8 / 2, { frequency: 0.8, baseScale: 1.0, scaleDelta: 0.2, baseEmissive: 0.5, emissiveDelta: 1.0 });

  assert.ok(maxState.scale > minState.scale, 'Max state scale should exceed min state scale');
  assert.ok(maxState.emissiveIntensity > minState.emissiveIntensity, 'Max state emissive should exceed min state emissive');
});

test('PulseBreathe applies updates to mesh scale and materials', () => {
  const pb = Nexus3DAnimator.PulseBreathe;
  const mat = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 0.2 });
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), mat);

  pb.apply(mesh, 0.25, { frequency: 1.0, baseScale: 1.0, scaleDelta: 0.1, baseEmissive: 0.3, emissiveDelta: 0.8 });
  assert.notEqual(mesh.scale.x, 1.0);
  assert.notEqual(mat.emissiveIntensity, 0.2);
});

test('PulseBreathe generates dual-track scale and emissive AnimationClip', () => {
  const clip = Nexus3DAnimator.PulseBreathe.createAnimationClip('CoreReactor', 3.0);
  assert.equal(clip.duration, 3.0);
  assert.equal(clip.tracks.length, 2);
  assert.ok(clip.tracks.some(t => t.name.includes('.scale')));
  assert.ok(clip.tracks.some(t => t.name.includes('.material.emissiveIntensity')));
});

// =========================================================================
// 6. PROCEDURAL GENERATOR: WARP-SPIN
// =========================================================================

test('WarpSpin computes acceleration, warp cruise, and deceleration phases', () => {
  const ws = Nexus3DAnimator.WarpSpin;
  const opts = { cycleDuration: 4.0, accelRatio: 0.3, cruiseRatio: 0.4, decelRatio: 0.3, minSpeed: 2.0, maxSpeed: 30.0 };

  const sAccel = ws.compute(0.5, opts); // 0.5s -> 12.5% into cycle
  const sWarp = ws.compute(2.0, opts);  // 2.0s -> 50% into cycle
  const sDecel = ws.compute(3.5, opts); // 3.5s -> 87.5% into cycle

  assert.equal(sAccel.phase, 'accel');
  assert.equal(sWarp.phase, 'warp');
  assert.equal(sDecel.phase, 'decel');

  assert.ok(sWarp.speed > sAccel.speed, 'Warp speed should be greater than initial accel speed');
  assert.ok(sWarp.bloomStrength > sAccel.bloomStrength, 'Bloom strength should surge in warp phase');
  assert.equal(sWarp.trailOpacity, 1.0, 'Trail opacity should be at maximum in warp phase');
});

test('WarpSpin updates bloom strength on UnrealBloomPass mock', () => {
  const ws = Nexus3DAnimator.WarpSpin;
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1));
  const bloomPassMock = { strength: 1.0 };

  ws.apply(mesh, 2.0, { cycleDuration: 4.0, maxBloom: 4.0 }, bloomPassMock);
  assert.ok(bloomPassMock.strength > 3.0, 'Bloom strength should surge to warp level');
});

// =========================================================================
// 7. KEYFRAME TRACK SYSTEM & ANIMATION TIMELINE
// =========================================================================

test('KeyframeTrack adds, sorts, and removes keyframes', () => {
  const track = new Nexus3DAnimator.KeyframeTrack('Drone', 'position', 'LINEAR');
  track.addKeyframe(2.0, { x: 0, y: 10, z: 0 });
  track.addKeyframe(0.0, { x: 0, y: 0, z: 0 });
  track.addKeyframe(1.0, { x: 0, y: 5, z: 0 });

  const kfs = track.getKeyframes();
  assert.equal(kfs.length, 3);
  assert.equal(kfs[0].time, 0.0);
  assert.equal(kfs[1].time, 1.0);
  assert.equal(kfs[2].time, 2.0);

  // Updating existing time replaces value
  track.addKeyframe(1.0, { x: 0, y: 6, z: 0 });
  assert.equal(track.getKeyframes().length, 3);
  assert.equal(track.getKeyframes()[1].value.y, 6);

  // Removal
  track.removeKeyframe(1.0);
  assert.equal(track.getKeyframes().length, 2);
});

test('KeyframeTrack evaluates position, scale, emissive intensity, and quaternion rotation', () => {
  // Vector3 (Position)
  const posTrack = new Nexus3DAnimator.KeyframeTrack('Root', 'position', 'LINEAR');
  posTrack.addKeyframe(0, { x: 0, y: 0, z: 0 });
  posTrack.addKeyframe(2, { x: 10, y: 20, z: 30 });
  const midPos = posTrack.evaluate(1.0);
  assert.equal(midPos.x, 5);
  assert.equal(midPos.y, 10);
  assert.equal(midPos.z, 15);

  // Number (Emissive)
  const numTrack = new Nexus3DAnimator.KeyframeTrack('Core', 'emissiveIntensity', 'LINEAR');
  numTrack.addKeyframe(0, 0.2);
  numTrack.addKeyframe(10, 1.2);
  assert.equal(numTrack.evaluate(5.0), 0.7);

  // Quaternion (Rotation)
  const rotTrack = new Nexus3DAnimator.KeyframeTrack('Root', 'rotation', 'LINEAR');
  rotTrack.addKeyframe(0, { x: 0, y: 0, z: 0, w: 1 });
  rotTrack.addKeyframe(2, { x: 0, y: 1, z: 0, w: 0 }); // 180 deg
  const midRot = rotTrack.evaluate(1.0);
  assert.ok(Math.abs(midRot.y - Math.sin(Math.PI / 4)) < 1e-3);
});

test('KeyframeTrack converts to Three.js VectorKeyframeTrack, QuaternionKeyframeTrack, NumberKeyframeTrack', () => {
  const posTrack = new Nexus3DAnimator.KeyframeTrack('Player', 'position');
  posTrack.addKeyframe(0, { x: 1, y: 2, z: 3 });
  posTrack.addKeyframe(1, { x: 4, y: 5, z: 6 });
  const threePos = posTrack.toThreeTrack();
  assert.ok(threePos instanceof THREE.VectorKeyframeTrack);
  assert.equal(threePos.name, 'Player.position');

  const rotTrack = new Nexus3DAnimator.KeyframeTrack('Player', 'rotation');
  rotTrack.addKeyframe(0, { x: 0, y: 0, z: 0, w: 1 });
  rotTrack.addKeyframe(1, { x: 0, y: 0.707, z: 0, w: 0.707 });
  const threeRot = rotTrack.toThreeTrack();
  assert.ok(threeRot instanceof THREE.QuaternionKeyframeTrack);
  assert.equal(threeRot.name, 'Player.quaternion');

  const numTrack = new Nexus3DAnimator.KeyframeTrack('Player', 'emissiveIntensity');
  numTrack.addKeyframe(0, 0.1);
  numTrack.addKeyframe(1, 0.9);
  const threeNum = numTrack.toThreeTrack();
  assert.ok(threeNum instanceof THREE.NumberKeyframeTrack);
  assert.equal(threeNum.name, 'Player.material.emissiveIntensity');
});

test('AnimationTimeline manages multi-track keyframe sequence and generates AnimationClip', () => {
  const timeline = new Nexus3DAnimator.AnimationTimeline(5.0);
  timeline.addKeyframe('Chassis', 'position', 0.0, { x: 0, y: 0, z: 0 });
  timeline.addKeyframe('Chassis', 'position', 5.0, { x: 0, y: 10, z: 0 });
  timeline.addKeyframe('Core', 'emissiveIntensity', 0.0, 0.2);
  timeline.addKeyframe('Core', 'emissiveIntensity', 2.5, 1.5);
  timeline.addKeyframe('Core', 'emissiveIntensity', 5.0, 0.2);

  const evalState = timeline.evaluateAll(2.5);
  assert.equal(evalState.Chassis.position.y, 5);
  assert.equal(evalState.Core.emissiveIntensity, 1.5);

  const clip = timeline.toAnimationClip('FlightSequence');
  assert.equal(clip.name, 'FlightSequence');
  assert.equal(clip.duration, 5.0);
  assert.equal(clip.tracks.length, 2);
});

test('AnimationTimeline serializes to and from JSON', () => {
  const tl1 = new Nexus3DAnimator.AnimationTimeline(8.0);
  tl1.addKeyframe('ArmL', 'scale', 0.0, { x: 1, y: 1, z: 1 });
  tl1.addKeyframe('ArmL', 'scale', 4.0, { x: 1.5, y: 1.5, z: 1.5 });

  const json = tl1.toJSON();
  assert.equal(json.duration, 8.0);
  assert.equal(json.tracks.length, 1);

  const tl2 = new Nexus3DAnimator.AnimationTimeline();
  tl2.fromJSON(json);
  assert.equal(tl2.duration, 8.0);
  assert.ok(tl2.getTrack('ArmL', 'scale'));
  assert.equal(tl2.evaluateAll(4.0).ArmL.scale.x, 1.5);
});

test('AnimationTimeline imports from existing Three.js AnimationClip', () => {
  const times = new Float32Array([0, 2]);
  const values = new Float32Array([0, 0, 0, 10, 20, 30]);
  const threeTrack = new THREE.VectorKeyframeTrack('WeaponMount.position', times, values);
  const srcClip = new THREE.AnimationClip('ImportedClip', 2.0, [threeTrack]);

  const timeline = new Nexus3DAnimator.AnimationTimeline();
  timeline.fromAnimationClip(srcClip);

  assert.equal(timeline.duration, 2.0);
  const track = timeline.getTrack('WeaponMount', 'position');
  assert.ok(track);
  assert.equal(track.evaluate(1.0).x, 5);
  assert.equal(track.evaluate(1.0).y, 10);
  assert.equal(track.evaluate(1.0).z, 15);
});

// =========================================================================
// 8. TIMELINE PLAYBACK CONTROLLER
// =========================================================================

test('TimelineController manages play, pause, seek, speed, and loop modes', () => {
  const ctrl = new Nexus3DAnimator.TimelineController({ duration: 4.0, autoPlay: false });
  assert.equal(ctrl.isPlaying, false);
  assert.equal(ctrl.currentTime, 0.0);

  // Play / Pause
  ctrl.play();
  assert.equal(ctrl.isPlaying, true);
  ctrl.pause();
  assert.equal(ctrl.isPlaying, false);

  // Seeking & Scrubbing
  ctrl.seek(2.5);
  assert.equal(ctrl.currentTime, 2.5);
  ctrl.scrub(0.75);
  assert.equal(ctrl.currentTime, 3.0);

  // Speed Rate
  ctrl.setSpeed(2.0);
  assert.equal(ctrl.playbackRate, 2.0);

  // Forward time update
  ctrl.play();
  ctrl.seek(3.5);
  ctrl.update(0.5); // 0.5s * 2.0 speed = 1.0s advance -> 4.5s -> loops to 0.5s in 'loop' mode
  assert.ok(Math.abs(ctrl.currentTime - 0.5) < 1e-3);

  // Once mode
  ctrl.setLoopMode('once');
  ctrl.seek(3.5);
  let endedTriggered = false;
  ctrl.on('ended', () => { endedTriggered = true; });
  ctrl.update(0.5);
  assert.equal(ctrl.currentTime, 4.0);
  assert.equal(ctrl.isPlaying, false);
  assert.equal(endedTriggered, true);

  // Pingpong mode
  ctrl.setLoopMode('pingpong');
  ctrl.seek(3.8);
  ctrl.play();
  ctrl.update(0.2); // hits 4.0, reverses direction to -1
  assert.equal(ctrl.direction, -1);
  ctrl.update(0.1); // moves backward to 3.8
  assert.ok(ctrl.currentTime < 4.0);
});

test('TimelineController integrates real-time Exploded CAD View slider', () => {
  const group = new THREE.Group();
  const meshA = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1));
  meshA.position.set(-2, 0, 0);
  const meshB = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1));
  meshB.position.set(2, 0, 0);
  group.add(meshA);
  group.add(meshB);

  const ctrl = new Nexus3DAnimator.TimelineController({ targetObject: group });
  let factorEvent = null;
  ctrl.on('explodedchange', (e) => { factorEvent = e.factor; });

  ctrl.setExplodedFactor(0.85);
  assert.equal(ctrl.explodedFactor, 0.85);
  assert.equal(factorEvent, 0.85);
  assert.ok(meshA.position.x < -2.0, 'Left mesh should expand outward');
  assert.ok(meshB.position.x > 2.0, 'Right mesh should expand outward');

  // Collapse back to 0.0
  ctrl.setExplodedFactor(0.0);
  assert.equal(meshA.position.x, -2.0);
  assert.equal(meshB.position.x, 2.0);
});

test('TimelineController switches procedural presets smoothly', () => {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2));
  const ctrl = new Nexus3DAnimator.TimelineController({ targetObject: mesh });

  ctrl.setPreset('hover-levitate');
  assert.equal(ctrl.activePreset, 'hover-levitate');
  ctrl.seek(1.0);
  assert.notEqual(mesh.position.y, 0);

  ctrl.setPreset('orbital-turntable');
  assert.equal(ctrl.activePreset, 'orbital-turntable');
  ctrl.seek(0.5); // Midway in rotation (angle = PI rad)
  assert.notEqual(mesh.rotation.y, 0);

  ctrl.setPreset('pulse-breathe');
  assert.equal(ctrl.activePreset, 'pulse-breathe');
  ctrl.seek(1.5);
  assert.notEqual(mesh.scale.x, 1.0);
});

test('Factory generates preset AnimationClips for all procedural styles', () => {
  const hoverClip = Nexus3DAnimator.generatePresetClip('hover-levitate', 'Drone', { duration: 3.0 });
  assert.equal(hoverClip.duration, 3.0);
  assert.ok(hoverClip.tracks.length >= 2);

  const orbitClip = Nexus3DAnimator.generatePresetClip('orbital-turntable', 'Station', { duration: 4.0 });
  assert.equal(orbitClip.duration, 4.0);

  const pulseClip = Nexus3DAnimator.generatePresetClip('pulse-breathe', 'HeartCore', { duration: 2.5 });
  assert.equal(pulseClip.duration, 2.5);

  const warpClip = Nexus3DAnimator.generatePresetClip('warp-spin', 'Portal', { duration: 5.0 });
  assert.equal(warpClip.duration, 5.0);

  const explodedGroup = new THREE.Group();
  explodedGroup.add(new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1)));
  explodedGroup.add(new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1)));
  const explodedClip = Nexus3DAnimator.generatePresetClip('exploded-view', 'Assembly', { rootGroup: explodedGroup, duration: 6.0 });
  assert.equal(explodedClip.duration, 6.0);
});

// =========================================================================
// 9. EXTENSIVE BOUNDARY, NESTING & AXIS WEIGHT TEST SUITE
// =========================================================================

test('ExplodedView respects custom axis weights and locks unaffected axes', () => {
  const exp = Nexus3DAnimator.ExplodedView;
  const group = new THREE.Group();
  const part = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1));
  part.position.set(2, 3, 4);
  group.add(part);

  exp.prepareHierarchy(group);

  // Explode only along Y axis (x: 0, z: 0)
  const offsets = exp.computeOffsets(group, 1.0, {
    distance: 5.0,
    ease: 'linear',
    axisWeights: { x: 0.0, y: 1.0, z: 0.0 }
  });

  assert.equal(offsets[0].position.x, 2.0); // X untouched
  assert.equal(offsets[0].position.z, 4.0); // Z untouched
  assert.ok(offsets[0].position.y > 3.0, 'Y should expand outward');
});

test('ExplodedView handles deeply nested hierarchies with child subassemblies', () => {
  const exp = Nexus3DAnimator.ExplodedView;
  const rootGroup = new THREE.Group();
  rootGroup.name = 'MechRoot';

  const torso = new THREE.Group();
  torso.name = 'TorsoGroup';
  const chestPlate = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 1));
  chestPlate.position.set(0, 2, 1);
  torso.add(chestPlate);

  const leftArm = new THREE.Group();
  leftArm.name = 'LeftArmGroup';
  const shoulderL = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1));
  shoulderL.position.set(-3, 2, 0);
  leftArm.add(shoulderL);

  rootGroup.add(torso);
  rootGroup.add(leftArm);

  const comps = exp.prepareHierarchy(rootGroup);
  assert.equal(comps.length, 2); // Torso and LeftArm direct groups

  exp.setFactor(rootGroup, 1.0, { distance: 3.0 });
  assert.ok(leftArm.position.x < 0, 'Left arm subassembly must expand outwards');
});

test('KeyframeTrack handles STEP and SMOOTH interpolation modes accurately', () => {
  const stepTrack = new Nexus3DAnimator.KeyframeTrack('Node', 'position', 'STEP');
  stepTrack.addKeyframe(0, { x: 0, y: 0, z: 0 });
  stepTrack.addKeyframe(10, { x: 100, y: 100, z: 100 });

  assert.equal(stepTrack.evaluate(0).x, 0);
  assert.equal(stepTrack.evaluate(5.0).x, 0); // Holds previous step value
  assert.equal(stepTrack.evaluate(9.99).x, 0);
  assert.equal(stepTrack.evaluate(10.0).x, 100);

  const smoothTrack = new Nexus3DAnimator.KeyframeTrack('Node', 'position', 'SMOOTH');
  smoothTrack.addKeyframe(0, { x: 0, y: 0, z: 0 });
  smoothTrack.addKeyframe(10, { x: 100, y: 100, z: 100 });

  const valSmooth = smoothTrack.evaluate(2.0).x; // At 20% time
  const valLinear = 20.0;
  // Cubic ease in-out should produce slower start than linear at 20%
  assert.ok(valSmooth < valLinear, `Smooth val ${valSmooth} should be < linear ${valLinear} at t=0.2`);
});

test('KeyframeTrack boundary evaluation clamps before first and after last keyframe', () => {
  const track = new Nexus3DAnimator.KeyframeTrack('Node', 'position');
  track.addKeyframe(2.0, { x: 10, y: 20, z: 30 });
  track.addKeyframe(4.0, { x: 50, y: 60, z: 70 });

  const beforeFirst = track.evaluate(0.5);
  assert.equal(beforeFirst.x, 10);
  assert.equal(beforeFirst.y, 20);

  const afterLast = track.evaluate(10.0);
  assert.equal(afterLast.x, 50);
  assert.equal(afterLast.y, 60);
});

test('AnimationTimeline applyToScene updates matching named objects in scene graph', () => {
  const sceneRoot = new THREE.Scene();
  const ship = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial());
  ship.name = 'SpeedShip';
  ship.position.set(0, 0, 0);
  sceneRoot.add(ship);

  const timeline = new Nexus3DAnimator.AnimationTimeline(10.0);
  timeline.addKeyframe('SpeedShip', 'position', 0, { x: 0, y: 0, z: 0 });
  timeline.addKeyframe('SpeedShip', 'position', 10, { x: 50, y: 100, z: -20 });
  timeline.addKeyframe('SpeedShip', 'scale', 0, { x: 1, y: 1, z: 1 });
  timeline.addKeyframe('SpeedShip', 'scale', 10, { x: 3, y: 3, z: 3 });

  timeline.applyToScene(sceneRoot, 5.0);
  assert.equal(ship.position.x, 25);
  assert.equal(ship.position.y, 50);
  assert.equal(ship.position.z, -10);
  assert.equal(ship.scale.x, 2);
  assert.equal(ship.scale.y, 2);
  assert.equal(ship.scale.z, 2);
});

test('TimelineController emits speedchange and presetchange events', () => {
  const ctrl = new Nexus3DAnimator.TimelineController({ duration: 5.0 });
  let speedEvt = null;
  let presetEvt = null;

  ctrl.on('speedchange', (d) => { speedEvt = d.rate; });
  ctrl.on('presetchange', (d) => { presetEvt = d.preset; });

  ctrl.setSpeed(3.5);
  assert.equal(speedEvt, 3.5);

  ctrl.setPreset('pulse-breathe');
  assert.equal(presetEvt, 'pulse-breathe');
});

test('exportAnimatedGLB gracefully reports error or parses when GLTFExporter is mock/present', () => {
  const group = new THREE.Group();
  let errorReported = false;

  // In Node environment without mock GLTFExporter, callback should report error gracefully
  Nexus3DAnimator.exportAnimatedGLB(group, [], {}, null, (err) => {
    errorReported = true;
    assert.ok(err);
  });

  assert.equal(errorReported, true);
});
