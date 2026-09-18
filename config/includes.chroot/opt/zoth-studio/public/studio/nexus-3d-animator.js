/**
 * ⚡ ZOTH NEXUS 3D — Algorithmic Timeline & Exploded CAD Sequencer Engine
 * 
 * High-performance 3D animation timeline, procedural motion generator,
 * CAD exploded view sequencer, and Three.js AnimationClip track synthesizer.
 * 
 * Features:
 * - 5 Procedural Motion Generators:
 *   * 'hover-levitate': smooth sinusoidal floating with pitch & roll wobble
 *   * 'exploded-view': parametric CAD component expansion along centroid normals (0.0 - 1.0)
 *   * 'orbital-turntable': multi-speed 360° camera / object rotation with easing
 *   * 'pulse-breathe': harmonic volumetric scaling with synchronized emissive glow
 *   * 'warp-spin': acceleration curve spin-up with bloom surge & trail sync
 * - Lightweight Keyframe Track System:
 *   * Position (Vector3), Rotation (Euler/Quaternion), Scale (Vector3),
 *     Emissive Intensity (Number), Camera Target (Vector3)
 *   * Full Three.js AnimationClip generation exportable to GLTF/GLB
 * - Interactive Timeline Controller:
 *   * Play/Pause, Scrubbing (0-1), Speed (0.25x-4x), Loop modes (loop, once, pingpong)
 *   * Real-time parametric exploded view slider
 * - Zero external dependencies besides Three.js (works in Node.js & browser)
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    var threeInstance;
    try {
      threeInstance = require('three');
    } catch (e) {
      try {
        threeInstance = require('../assets/vendor/three.min.js');
      } catch (e2) {
        threeInstance = root.THREE;
      }
    }
    module.exports = factory(threeInstance);
  } else {
    root.Nexus3DAnimator = factory(root.THREE);
  }
})(typeof self !== 'undefined' ? self : this, function (THREE) {
  'use strict';

  var VERSION = '2026-08-24-timeline-v1.0';

  // =========================================================================
  // 1. MATHEMATICAL EASING FUNCTIONS & VECTOR UTILITIES
  // =========================================================================

  var Easing = {
    linear: function (t) { return t; },
    easeInQuad: function (t) { return t * t; },
    easeOutQuad: function (t) { return t * (2 - t); },
    easeInOutQuad: function (t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; },
    easeInCubic: function (t) { return t * t * t; },
    easeOutCubic: function (t) { return (--t) * t * t + 1; },
    easeInOutCubic: function (t) { return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1; },
    easeInSine: function (t) { return 1 - Math.cos((t * Math.PI) / 2); },
    easeOutSine: function (t) { return Math.sin((t * Math.PI) / 2); },
    easeInOutSine: function (t) { return -(Math.cos(Math.PI * t) - 1) / 2; },
    easeInExpo: function (t) { return t === 0 ? 0 : Math.pow(2, 10 * (t - 1)); },
    easeOutExpo: function (t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); },
    easeInOutExpo: function (t) {
      if (t === 0) return 0;
      if (t === 1) return 1;
      if ((t *= 2) < 1) return 0.5 * Math.pow(2, 10 * (t - 1));
      return 0.5 * (2 - Math.pow(2, -10 * (t - 1)));
    },
    easeOutElastic: function (t) {
      var s = 0.075;
      var p = 0.3;
      if (t === 0) return 0;
      if (t === 1) return 1;
      return Math.pow(2, -10 * t) * Math.sin((t - s) * (2 * Math.PI) / p) + 1;
    },
    get: function (name) {
      if (!name) return Easing.easeInOutCubic;
      if (typeof name === 'function') return name;
      return Easing[name] || Easing.easeInOutCubic;
    }
  };

  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function lerpVector3(vA, vB, t, out) {
    out = out || { x: 0, y: 0, z: 0 };
    out.x = lerp(vA.x, vB.x, t);
    out.y = lerp(vA.y, vB.y, t);
    out.z = lerp(vA.z, vB.z, t);
    return out;
  }

  function eulerToQuaternion(rx, ry, rz, order) {
    order = order || 'XYZ';
    var c1 = Math.cos(rx / 2), c2 = Math.cos(ry / 2), c3 = Math.cos(rz / 2);
    var s1 = Math.sin(rx / 2), s2 = Math.sin(ry / 2), s3 = Math.sin(rz / 2);
    var q = { x: 0, y: 0, z: 0, w: 1 };

    if (order === 'XYZ') {
      q.x = s1 * c2 * c3 + c1 * s2 * s3;
      q.y = c1 * s2 * c3 - s1 * c2 * s3;
      q.z = c1 * c2 * s3 + s1 * s2 * c3;
      q.w = c1 * c2 * c3 - s1 * s2 * s3;
    } else {
      q.x = s1 * c2 * c3 - c1 * s2 * s3;
      q.y = c1 * s2 * c3 + s1 * s2 * c3;
      q.z = c1 * c2 * s3 - s1 * s2 * c3;
      q.w = c1 * c2 * c3 + s1 * s2 * s3;
    }
    return q;
  }

  function quaternionSlerp(qa, qb, t, qOut) {
    qOut = qOut || { x: 0, y: 0, z: 0, w: 1 };
    var cosHalfTheta = qa.w * qb.w + qa.x * qb.x + qa.y * qb.y + qa.z * qb.z;

    var bx = qb.x, by = qb.y, bz = qb.z, bw = qb.w;
    if (cosHalfTheta < 0) {
      cosHalfTheta = -cosHalfTheta;
      bx = -bx; by = -by; bz = -bz; bw = -bw;
    }

    if (Math.abs(cosHalfTheta) >= 1.0) {
      qOut.w = qa.w; qOut.x = qa.x; qOut.y = qa.y; qOut.z = qa.z;
      return qOut;
    }

    var halfTheta = Math.acos(cosHalfTheta);
    var sinHalfTheta = Math.sqrt(1.0 - cosHalfTheta * cosHalfTheta);

    if (Math.abs(sinHalfTheta) < 0.001) {
      qOut.w = 0.5 * (qa.w + bw);
      qOut.x = 0.5 * (qa.x + bx);
      qOut.y = 0.5 * (qa.y + by);
      qOut.z = 0.5 * (qa.z + bz);
      return qOut;
    }

    var ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta;
    var ratioB = Math.sin(t * halfTheta) / sinHalfTheta;

    qOut.w = qa.w * ratioA + bw * ratioB;
    qOut.x = qa.x * ratioA + bx * ratioB;
    qOut.y = qa.y * ratioA + by * ratioB;
    qOut.z = qa.z * ratioA + bz * ratioB;
    return qOut;
  }

  // Calculate bounding box and centroid of Three.js object or hierarchy
  function computeObjectCentroid(object) {
    if (!object) return { x: 0, y: 0, z: 0 };
    if (THREE && THREE.Box3) {
      var box = new THREE.Box3().setFromObject(object);
      if (!box.isEmpty()) {
        var center = new THREE.Vector3();
        box.getCenter(center);
        return { x: center.x, y: center.y, z: center.z };
      }
    }
    // Fallback based on position
    var pos = object.position || { x: 0, y: 0, z: 0 };
    return { x: pos.x, y: pos.y, z: pos.z };
  }

  // =========================================================================
  // 2. PROCEDURAL ANIMATION GENERATORS
  // =========================================================================

  /**
   * PROCEDURAL GENERATOR 1: Hover-Levitate
   * Smooth sinusoidal floating with pitch and roll wobble
   */
  var HoverLevitate = {
    name: 'hover-levitate',

    compute: function (time, options) {
      options = options || {};
      var amplitude = options.amplitude !== undefined ? options.amplitude : 0.22;
      var frequency = options.frequency !== undefined ? options.frequency : 1.25;
      var wobblePitch = options.wobblePitch !== undefined ? options.wobblePitch : 0.045;
      var wobbleRoll = options.wobbleRoll !== undefined ? options.wobbleRoll : 0.055;
      var pitchFreq = options.pitchFreq !== undefined ? options.pitchFreq : 1.7;
      var rollFreq = options.rollFreq !== undefined ? options.rollFreq : 1.3;
      var phase = options.phase !== undefined ? options.phase : 0;

      var t = time * frequency + phase;
      // Primary sinusoidal elevation with secondary harmonic for natural buoyancy
      var offsetY = Math.sin(t) * amplitude + Math.sin(t * 2.0) * (amplitude * 0.15);
      var pitch = Math.sin(time * pitchFreq + phase * 1.5) * wobblePitch;
      var roll = Math.cos(time * rollFreq + phase * 0.8) * wobbleRoll;
      var yaw = Math.sin(time * 0.7 + phase) * (wobblePitch * 0.3);

      return {
        offsetY: offsetY,
        pitch: pitch,
        roll: roll,
        yaw: yaw
      };
    },

    apply: function (target, time, options, baseTransform) {
      if (!target) return;
      var res = HoverLevitate.compute(time, options);

      var basePos = (baseTransform && baseTransform.position) ? baseTransform.position : (target.userData && target.userData.__animBasePos) ? target.userData.__animBasePos : null;
      if (!basePos) {
        if (!target.userData) target.userData = {};
        target.userData.__animBasePos = { x: target.position.x, y: target.position.y, z: target.position.z };
        basePos = target.userData.__animBasePos;
      }

      var baseRot = (baseTransform && baseTransform.rotation) ? baseTransform.rotation : (target.userData && target.userData.__animBaseRot) ? target.userData.__animBaseRot : null;
      if (!baseRot) {
        if (!target.userData) target.userData = {};
        target.userData.__animBaseRot = { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z };
        baseRot = target.userData.__animBaseRot;
      }

      target.position.y = basePos.y + res.offsetY;
      target.rotation.x = baseRot.x + res.pitch;
      target.rotation.z = baseRot.z + res.roll;
      target.rotation.y = baseRot.y + res.yaw;
    },

    createAnimationClip: function (targetName, duration, options) {
      duration = duration || 4.0;
      options = options || {};
      var fps = options.fps || 30;
      var numFrames = Math.floor(duration * fps) + 1;

      var times = new Float32Array(numFrames);
      var posValues = new Float32Array(numFrames * 3);
      var rotValues = new Float32Array(numFrames * 4);

      var basePos = options.basePosition || { x: 0, y: 1.5, z: 0 };
      var baseRot = options.baseRotation || { x: 0, y: 0, z: 0 };

      for (var i = 0; i < numFrames; i++) {
        var t = (i / (numFrames - 1)) * duration;
        times[i] = t;

        var res = HoverLevitate.compute(t, options);
        var pIdx = i * 3;
        posValues[pIdx] = basePos.x;
        posValues[pIdx + 1] = basePos.y + res.offsetY;
        posValues[pIdx + 2] = basePos.z;

        var q = eulerToQuaternion(baseRot.x + res.pitch, baseRot.y + res.yaw, baseRot.z + res.roll);
        var rIdx = i * 4;
        rotValues[rIdx] = q.x;
        rotValues[rIdx + 1] = q.y;
        rotValues[rIdx + 2] = q.z;
        rotValues[rIdx + 3] = q.w;
      }

      var tracks = [];
      if (THREE && THREE.VectorKeyframeTrack && THREE.QuaternionKeyframeTrack) {
        tracks.push(new THREE.VectorKeyframeTrack((targetName || 'Root') + '.position', times, posValues));
        tracks.push(new THREE.QuaternionKeyframeTrack((targetName || 'Root') + '.quaternion', times, rotValues));
      }

      if (THREE && THREE.AnimationClip) {
        return new THREE.AnimationClip('HoverLevitateClip', duration, tracks);
      }
      return { name: 'HoverLevitateClip', duration: duration, tracks: tracks };
    }
  };

  /**
   * PROCEDURAL GENERATOR 2: Exploded CAD View Sequencer
   * Parametrically expands multi-part composite mesh components outward
   * along their centroid normal vectors with smooth slider interpolation (0.0 - 1.0)
   */
  var ExplodedView = {
    name: 'exploded-view',

    /**
     * Inspects a composite mesh / group hierarchy and caches initial transforms and explosion vectors
     */
    prepareHierarchy: function (rootGroup, options) {
      if (!rootGroup) return [];
      options = options || {};
      var rootCentroid = computeObjectCentroid(rootGroup);

      // Collect direct components or mesh children
      var components = [];
      if (rootGroup.children && rootGroup.children.length > 0) {
        for (var i = 0; i < rootGroup.children.length; i++) {
          var child = rootGroup.children[i];
          if (child.isLight || child.isCamera || child.type === 'GridHelper' || child.type === 'TransformControls') continue;
          components.push(child);
        }
      } else {
        components.push(rootGroup);
      }

      var componentDataList = [];
      var count = components.length;

      for (var j = 0; j < count; j++) {
        var comp = components[j];
        if (!comp.userData) comp.userData = {};

        // Cache original base transform if not already cached
        if (!comp.userData.__cadOrigPos) {
          comp.userData.__cadOrigPos = { x: comp.position.x, y: comp.position.y, z: comp.position.z };
        }
        if (!comp.userData.__cadOrigRot) {
          comp.userData.__cadOrigRot = { x: comp.rotation.x, y: comp.rotation.y, z: comp.rotation.z };
        }
        if (!comp.userData.__cadOrigScale) {
          comp.userData.__cadOrigScale = { x: comp.scale.x, y: comp.scale.y, z: comp.scale.z };
        }

        var partCentroid = computeObjectCentroid(comp);
        var dirX = partCentroid.x - rootCentroid.x;
        var dirY = partCentroid.y - rootCentroid.y;
        var dirZ = partCentroid.z - rootCentroid.z;

        // Also check if component has an internal offset
        if (Math.abs(dirX) < 1e-4 && Math.abs(dirY) < 1e-4 && Math.abs(dirZ) < 1e-4) {
          dirX = comp.position.x;
          dirY = comp.position.y;
          dirZ = comp.position.z;
        }

        var len = Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ);
        var normalVector;

        if (len > 0.001) {
          normalVector = { x: dirX / len, y: dirY / len, z: dirZ / len };
        } else {
          // Fallback radial distribution for concentric nested parts
          var angle = (j / Math.max(1, count)) * Math.PI * 2;
          var elev = (j % 2 === 0 ? 0.35 : -0.35);
          var nx = Math.cos(angle);
          var nz = Math.sin(angle);
          var nLen = Math.sqrt(nx * nx + elev * elev + nz * nz);
          normalVector = { x: nx / nLen, y: elev / nLen, z: nz / nLen };
        }

        var item = {
          object: comp,
          name: comp.name || ('Part_' + j),
          index: j,
          origPos: comp.userData.__cadOrigPos,
          normalVector: normalVector,
          staggerOffset: count > 1 ? (j / (count - 1)) : 0
        };

        comp.userData.__cadExplosionNormal = normalVector;
        comp.userData.__cadStagger = item.staggerOffset;
        componentDataList.push(item);
      }

      rootGroup.userData.__cadExplodedComponents = componentDataList;
      return componentDataList;
    },

    /**
     * Compute position offsets for all parts at a given interpolation factor (0.0 to 1.0)
     */
    computeOffsets: function (rootGroup, factor, options) {
      options = options || {};
      var distance = options.distance !== undefined ? options.distance : 2.5;
      var easeFn = Easing.get(options.ease || 'easeInOutCubic');
      var stagger = options.stagger || 0.0; // 0.0 (uniform) to 1.0 (sequential)
      var axisWeights = options.axisWeights || { x: 1.0, y: 1.0, z: 1.0 };

      var components = (rootGroup.userData && rootGroup.userData.__cadExplodedComponents) ? rootGroup.userData.__cadExplodedComponents : ExplodedView.prepareHierarchy(rootGroup, options);

      var clampedFactor = clamp(factor, 0.0, 1.0);
      var results = [];

      for (var i = 0; i < components.length; i++) {
        var item = components[i];
        var partFactor = clampedFactor;

        if (stagger > 0 && components.length > 1) {
          var startT = item.staggerOffset * stagger * 0.5;
          var endT = 1.0 - (1.0 - item.staggerOffset) * stagger * 0.5;
          partFactor = clamp((clampedFactor - startT) / Math.max(0.001, endT - startT), 0.0, 1.0);
        }

        var easedFactor = easeFn(partFactor);
        var norm = item.normalVector;
        var offsetX = norm.x * distance * easedFactor * (axisWeights.x !== undefined ? axisWeights.x : 1.0);
        var offsetY = norm.y * distance * easedFactor * (axisWeights.y !== undefined ? axisWeights.y : 1.0);
        var offsetZ = norm.z * distance * easedFactor * (axisWeights.z !== undefined ? axisWeights.z : 1.0);

        var targetPos = {
          x: item.origPos.x + offsetX,
          y: item.origPos.y + offsetY,
          z: item.origPos.z + offsetZ
        };

        results.push({
          object: item.object,
          name: item.name,
          factor: easedFactor,
          position: targetPos,
          offset: { x: offsetX, y: offsetY, z: offsetZ }
        });
      }

      return results;
    },

    /**
     * Instantly sets the exploded state on all components
     */
    setFactor: function (rootGroup, factor, options) {
      var offsets = ExplodedView.computeOffsets(rootGroup, factor, options);
      for (var i = 0; i < offsets.length; i++) {
        var res = offsets[i];
        if (res.object) {
          res.object.position.x = res.position.x;
          res.object.position.y = res.position.y;
          res.object.position.z = res.position.z;
        }
      }
      return offsets;
    },

    /**
     * Restores all components to initial unexploded positions
     */
    reset: function (rootGroup) {
      return ExplodedView.setFactor(rootGroup, 0.0);
    },

    /**
     * Builds a complete Three.js AnimationClip animating the CAD exploded view sequence
     */
    createAnimationClip: function (rootGroup, options) {
      options = options || {};
      var duration = options.duration || 5.0;
      var fps = options.fps || 30;
      var numFrames = Math.floor(duration * fps) + 1;
      var components = (rootGroup.userData && rootGroup.userData.__cadExplodedComponents) ? rootGroup.userData.__cadExplodedComponents : ExplodedView.prepareHierarchy(rootGroup, options);

      var tracks = [];

      for (var c = 0; c < components.length; c++) {
        var compItem = components[c];
        var objName = compItem.object.name || ('Part_' + c);
        var times = new Float32Array(numFrames);
        var posValues = new Float32Array(numFrames * 3);

        for (var f = 0; f < numFrames; f++) {
          var t = (f / (numFrames - 1)) * duration;
          times[f] = t;

          // Sequence: 0s-2s explode outward, 2s-3s hold exploded, 3s-5s collapse back
          var normTime = t / duration;
          var factor = 0;
          if (normTime < 0.40) {
            factor = normTime / 0.40;
          } else if (normTime <= 0.60) {
            factor = 1.0;
          } else {
            factor = 1.0 - ((normTime - 0.60) / 0.40);
          }

          var offsets = ExplodedView.computeOffsets(rootGroup, factor, options);
          var compOffset = offsets[c];
          var pIdx = f * 3;
          posValues[pIdx] = compOffset.position.x;
          posValues[pIdx + 1] = compOffset.position.y;
          posValues[pIdx + 2] = compOffset.position.z;
        }

        if (THREE && THREE.VectorKeyframeTrack) {
          tracks.push(new THREE.VectorKeyframeTrack(objName + '.position', times, posValues));
        }
      }

      if (THREE && THREE.AnimationClip) {
        return new THREE.AnimationClip('ExplodedCADSequenceClip', duration, tracks);
      }
      return { name: 'ExplodedCADSequenceClip', duration: duration, tracks: tracks };
    }
  };

  /**
   * PROCEDURAL GENERATOR 3: Orbital Turntable
   * Multi-speed 360-degree camera / object rotation with easing
   */
  var OrbitalTurntable = {
    name: 'orbital-turntable',

    compute: function (time, options) {
      options = options || {};
      var speed = options.speed !== undefined ? options.speed : 1.0; // Revs per unit time
      var radius = options.radius !== undefined ? options.radius : 10.0;
      var height = options.height !== undefined ? options.height : 4.5;
      var center = options.center || { x: 0, y: 1.5, z: 0 };
      var easeFn = Easing.get(options.easing || 'linear');

      var angle = (time * speed * Math.PI * 2) % (Math.PI * 2);
      var easedAngle = easeFn(angle / (Math.PI * 2)) * (Math.PI * 2);

      var camX = center.x + Math.sin(easedAngle) * radius;
      var camZ = center.z + Math.cos(easedAngle) * radius;
      var camY = center.y + height;

      return {
        angle: easedAngle,
        cameraPosition: { x: camX, y: camY, z: camZ },
        objectRotationY: easedAngle,
        center: center
      };
    },

    apply: function (target, time, options) {
      if (!target) return;
      options = options || {};
      var mode = options.mode || 'object'; // 'object' or 'camera'
      var res = OrbitalTurntable.compute(time, options);

      if (mode === 'camera') {
        target.position.set(res.cameraPosition.x, res.cameraPosition.y, res.cameraPosition.z);
        if (typeof target.lookAt === 'function') {
          target.lookAt(res.center.x, res.center.y, res.center.z);
        }
      } else {
        target.rotation.y = res.objectRotationY;
      }
    },

    createAnimationClip: function (targetName, duration, options) {
      duration = duration || 6.0;
      options = options || {};
      var fps = options.fps || 30;
      var numFrames = Math.floor(duration * fps) + 1;
      var times = new Float32Array(numFrames);
      var rotValues = new Float32Array(numFrames * 4);

      for (var i = 0; i < numFrames; i++) {
        var t = (i / (numFrames - 1)) * duration;
        times[i] = t;
        var normT = i / (numFrames - 1);
        var angle = normT * Math.PI * 2;
        var q = eulerToQuaternion(0, angle, 0);
        var idx = i * 4;
        rotValues[idx] = q.x;
        rotValues[idx + 1] = q.y;
        rotValues[idx + 2] = q.z;
        rotValues[idx + 3] = q.w;
      }

      var tracks = [];
      if (THREE && THREE.QuaternionKeyframeTrack) {
        tracks.push(new THREE.QuaternionKeyframeTrack((targetName || 'Root') + '.quaternion', times, rotValues));
      }

      if (THREE && THREE.AnimationClip) {
        return new THREE.AnimationClip('OrbitalTurntableClip', duration, tracks);
      }
      return { name: 'OrbitalTurntableClip', duration: duration, tracks: tracks };
    }
  };

  /**
   * PROCEDURAL GENERATOR 4: Pulse-Breathe
   * Rhythmic volumetric scaling synchronized with emissive intensity modulation
   */
  var PulseBreathe = {
    name: 'pulse-breathe',

    compute: function (time, options) {
      options = options || {};
      var frequency = options.frequency !== undefined ? options.frequency : 0.8; // Hz
      var scaleDelta = options.scaleDelta !== undefined ? options.scaleDelta : 0.08;
      var baseScale = options.baseScale !== undefined ? options.baseScale : 1.0;
      var emissiveDelta = options.emissiveDelta !== undefined ? options.emissiveDelta : 0.75;
      var baseEmissive = options.baseEmissive !== undefined ? options.baseEmissive : 0.35;
      var phase = options.phase !== undefined ? options.phase : 0;

      var t = time * frequency * Math.PI * 2 + phase;
      // Inhale is slightly faster than exhale for natural breathing rhythm
      var wave = 0.5 + 0.5 * Math.sin(t);
      var breatheWave = Math.pow(wave, 1.25);

      var currentScale = baseScale + breatheWave * scaleDelta;
      var currentEmissive = baseEmissive + breatheWave * emissiveDelta;

      return {
        scale: currentScale,
        emissiveIntensity: currentEmissive,
        progress: wave
      };
    },

    apply: function (target, time, options) {
      if (!target) return;
      var res = PulseBreathe.compute(time, options);

      target.scale.set(res.scale, res.scale, res.scale);

      target.traverse(function (child) {
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(function (m) {
              if (m.emissiveIntensity !== undefined) m.emissiveIntensity = res.emissiveIntensity;
            });
          } else {
            if (child.material.emissiveIntensity !== undefined) {
              child.material.emissiveIntensity = res.emissiveIntensity;
            }
          }
        }
      });
    },

    createAnimationClip: function (targetName, duration, options) {
      duration = duration || 3.0;
      options = options || {};
      var fps = options.fps || 30;
      var numFrames = Math.floor(duration * fps) + 1;

      var times = new Float32Array(numFrames);
      var scaleValues = new Float32Array(numFrames * 3);
      var emissiveValues = new Float32Array(numFrames);

      for (var i = 0; i < numFrames; i++) {
        var t = (i / (numFrames - 1)) * duration;
        times[i] = t;
        var res = PulseBreathe.compute(t, options);
        var sIdx = i * 3;
        scaleValues[sIdx] = res.scale;
        scaleValues[sIdx + 1] = res.scale;
        scaleValues[sIdx + 2] = res.scale;
        emissiveValues[i] = res.emissiveIntensity;
      }

      var tracks = [];
      if (THREE && THREE.VectorKeyframeTrack) {
        tracks.push(new THREE.VectorKeyframeTrack((targetName || 'Root') + '.scale', times, scaleValues));
      }
      if (THREE && THREE.NumberKeyframeTrack) {
        tracks.push(new THREE.NumberKeyframeTrack((targetName || 'Root') + '.material.emissiveIntensity', times, emissiveValues));
      }

      if (THREE && THREE.AnimationClip) {
        return new THREE.AnimationClip('PulseBreatheClip', duration, tracks);
      }
      return { name: 'PulseBreatheClip', duration: duration, tracks: tracks };
    }
  };

  /**
   * PROCEDURAL GENERATOR 5: Warp-Spin
   * Acceleration curve spin-up with light trail and bloom intensity surge
   */
  var WarpSpin = {
    name: 'warp-spin',

    compute: function (time, options) {
      options = options || {};
      var cycleDuration = options.cycleDuration || 4.0;
      var accelRatio = options.accelRatio !== undefined ? options.accelRatio : 0.35; // 0% - 35% accel
      var cruiseRatio = options.cruiseRatio !== undefined ? options.cruiseRatio : 0.30; // 35% - 65% warp
      var decelRatio = options.decelRatio !== undefined ? options.decelRatio : 0.35; // 65% - 100% decel
      var maxSpeed = options.maxSpeed !== undefined ? options.maxSpeed : 28.0; // rad/s
      var minSpeed = options.minSpeed !== undefined ? options.minSpeed : 1.0;
      var maxBloom = options.maxBloom !== undefined ? options.maxBloom : 3.8;
      var minBloom = options.minBloom !== undefined ? options.minBloom : 1.25;

      var normT = (time % cycleDuration) / cycleDuration;
      var speed = minSpeed;
      var bloom = minBloom;
      var phase = 'idle';

      if (normT < accelRatio) {
        var aP = normT / accelRatio;
        var easeA = Easing.easeInQuad(aP);
        speed = lerp(minSpeed, maxSpeed, easeA);
        bloom = lerp(minBloom, maxBloom, easeA);
        phase = 'accel';
      } else if (normT < accelRatio + cruiseRatio) {
        speed = maxSpeed;
        bloom = maxBloom + Math.sin(time * 20.0) * 0.25;
        phase = 'warp';
      } else {
        var dP = (normT - (accelRatio + cruiseRatio)) / decelRatio;
        var easeD = Easing.easeOutQuad(dP);
        speed = lerp(maxSpeed, minSpeed, easeD);
        bloom = lerp(maxBloom, minBloom, easeD);
        phase = 'decel';
      }

      var currentAngle = (time * speed) % (Math.PI * 2);

      return {
        speed: speed,
        angle: currentAngle,
        bloomStrength: bloom,
        trailOpacity: clamp((speed - minSpeed) / (maxSpeed - minSpeed), 0.0, 1.0),
        phase: phase
      };
    },

    apply: function (target, time, options, bloomPass) {
      if (!target) return;
      var res = WarpSpin.compute(time, options);
      target.rotation.y += res.speed * 0.016; // Incremental integration or absolute angle

      if (bloomPass && bloomPass.strength !== undefined) {
        bloomPass.strength = res.bloomStrength;
      }
    },

    createAnimationClip: function (targetName, duration, options) {
      duration = duration || 4.0;
      options = options || {};
      var fps = options.fps || 30;
      var numFrames = Math.floor(duration * fps) + 1;

      var times = new Float32Array(numFrames);
      var rotValues = new Float32Array(numFrames * 4);
      var accumulatedAngle = 0;
      var lastT = 0;

      for (var i = 0; i < numFrames; i++) {
        var t = (i / (numFrames - 1)) * duration;
        times[i] = t;
        var dt = t - lastT;
        lastT = t;

        var res = WarpSpin.compute(t, options);
        accumulatedAngle += res.speed * dt;

        var q = eulerToQuaternion(0, accumulatedAngle, 0);
        var idx = i * 4;
        rotValues[idx] = q.x;
        rotValues[idx + 1] = q.y;
        rotValues[idx + 2] = q.z;
        rotValues[idx + 3] = q.w;
      }

      var tracks = [];
      if (THREE && THREE.QuaternionKeyframeTrack) {
        tracks.push(new THREE.QuaternionKeyframeTrack((targetName || 'Root') + '.quaternion', times, rotValues));
      }

      if (THREE && THREE.AnimationClip) {
        return new THREE.AnimationClip('WarpSpinClip', duration, tracks);
      }
      return { name: 'WarpSpinClip', duration: duration, tracks: tracks };
    }
  };

  // =========================================================================
  // 3. LIGHTWEIGHT KEYFRAME TRACK SYSTEM
  // =========================================================================

  /**
   * Represents an individual animated parameter track with keyframes and interpolation
   */
  function KeyframeTrack(targetName, property, interpolation) {
    this.targetName = targetName || 'Root';
    this.property = property || 'position'; // 'position' | 'rotation' | 'scale' | 'emissiveIntensity' | 'cameraTarget'
    this.interpolation = interpolation || 'LINEAR'; // 'LINEAR' | 'SMOOTH' | 'STEP'
    this.keyframes = []; // Array of { time: number, value: any }
  }

  KeyframeTrack.prototype.addKeyframe = function (time, value) {
    time = Math.max(0, parseFloat(time) || 0);
    // Clone value
    var valCopy;
    if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) {
        valCopy = value.slice();
      } else {
        valCopy = { x: value.x || 0, y: value.y || 0, z: value.z || 0, w: value.w !== undefined ? value.w : 1 };
      }
    } else {
      valCopy = parseFloat(value) || 0;
    }

    // Insert sorted or replace existing keyframe at time
    var foundIndex = -1;
    for (var i = 0; i < this.keyframes.length; i++) {
      if (Math.abs(this.keyframes[i].time - time) < 1e-4) {
        foundIndex = i;
        break;
      }
    }

    if (foundIndex >= 0) {
      this.keyframes[foundIndex].value = valCopy;
    } else {
      this.keyframes.push({ time: time, value: valCopy });
      this.keyframes.sort(function (a, b) { return a.time - b.time; });
    }
    return this;
  };

  KeyframeTrack.prototype.removeKeyframe = function (time, epsilon) {
    epsilon = epsilon || 1e-4;
    this.keyframes = this.keyframes.filter(function (kf) {
      return Math.abs(kf.time - time) > epsilon;
    });
    return this;
  };

  KeyframeTrack.prototype.getKeyframes = function () {
    return this.keyframes;
  };

  KeyframeTrack.prototype.evaluate = function (time) {
    if (this.keyframes.length === 0) {
      if (this.property === 'scale') return { x: 1, y: 1, z: 1 };
      if (this.property === 'emissiveIntensity') return 0.5;
      if (this.property === 'rotation') return { x: 0, y: 0, z: 0, w: 1 };
      return { x: 0, y: 0, z: 0 };
    }

    if (time <= this.keyframes[0].time) {
      return this.keyframes[0].value;
    }
    if (time >= this.keyframes[this.keyframes.length - 1].time) {
      return this.keyframes[this.keyframes.length - 1].value;
    }

    // Binary / linear search for surrounding keyframes
    var idxA = 0;
    for (var i = 0; i < this.keyframes.length - 1; i++) {
      if (time >= this.keyframes[i].time && time <= this.keyframes[i + 1].time) {
        idxA = i;
        break;
      }
    }

    var kfA = this.keyframes[idxA];
    var kfB = this.keyframes[idxA + 1];
    var span = kfB.time - kfA.time;
    var t = span > 0 ? (time - kfA.time) / span : 0;

    if (this.interpolation === 'STEP') {
      return kfA.value;
    }

    if (this.interpolation === 'SMOOTH') {
      t = Easing.easeInOutCubic(t);
    }

    // Interpolate according to property type
    if (this.property === 'emissiveIntensity' || typeof kfA.value === 'number') {
      return lerp(kfA.value, kfB.value, t);
    }

    if (this.property === 'rotation') {
      // Quaternion SLERP if quaternion values exist, else Euler lerp
      if (kfA.value.w !== undefined && kfB.value.w !== undefined) {
        return quaternionSlerp(kfA.value, kfB.value, t);
      }
      return lerpVector3(kfA.value, kfB.value, t);
    }

    // Default Vector3 (Position, Scale, CameraTarget)
    return lerpVector3(kfA.value, kfB.value, t);
  };

  KeyframeTrack.prototype.toThreeTrack = function () {
    if (this.keyframes.length === 0) return null;
    var times = new Float32Array(this.keyframes.length);
    for (var k = 0; k < this.keyframes.length; k++) {
      times[k] = this.keyframes[k].time;
    }

    var prop = this.property;
    var target = this.targetName;

    if (prop === 'position' || prop === 'scale' || prop === 'cameraTarget') {
      var values = new Float32Array(this.keyframes.length * 3);
      for (var i = 0; i < this.keyframes.length; i++) {
        var v = this.keyframes[i].value;
        var pIdx = i * 3;
        values[pIdx] = v.x !== undefined ? v.x : (Array.isArray(v) ? v[0] : 0);
        values[pIdx + 1] = v.y !== undefined ? v.y : (Array.isArray(v) ? v[1] : 0);
        values[pIdx + 2] = v.z !== undefined ? v.z : (Array.isArray(v) ? v[2] : 0);
      }
      var trackName = target + '.' + (prop === 'cameraTarget' ? 'userData.cameraTarget' : prop);
      if (THREE && THREE.VectorKeyframeTrack) {
        return new THREE.VectorKeyframeTrack(trackName, times, values);
      }
      return { name: trackName, times: times, values: values, type: 'vector' };
    }

    if (prop === 'rotation') {
      var qValues = new Float32Array(this.keyframes.length * 4);
      for (var j = 0; j < this.keyframes.length; j++) {
        var rVal = this.keyframes[j].value;
        var q = (rVal.w !== undefined) ? rVal : eulerToQuaternion(rVal.x || 0, rVal.y || 0, rVal.z || 0);
        var qIdx = j * 4;
        qValues[qIdx] = q.x;
        qValues[qIdx + 1] = q.y;
        qValues[qIdx + 2] = q.z;
        qValues[qIdx + 3] = q.w;
      }
      var rotTrackName = target + '.quaternion';
      if (THREE && THREE.QuaternionKeyframeTrack) {
        return new THREE.QuaternionKeyframeTrack(rotTrackName, times, qValues);
      }
      return { name: rotTrackName, times: times, values: qValues, type: 'quaternion' };
    }

    if (prop === 'emissiveIntensity') {
      var nValues = new Float32Array(this.keyframes.length);
      for (var n = 0; n < this.keyframes.length; n++) {
        nValues[n] = parseFloat(this.keyframes[n].value) || 0;
      }
      var numTrackName = target + '.material.emissiveIntensity';
      if (THREE && THREE.NumberKeyframeTrack) {
        return new THREE.NumberKeyframeTrack(numTrackName, times, nValues);
      }
      return { name: numTrackName, times: times, values: nValues, type: 'number' };
    }

    return null;
  };

  /**
   * Multi-track timeline sequence container
   */
  function AnimationTimeline(duration) {
    this.duration = Math.max(0.1, parseFloat(duration) || 5.0);
    this.tracks = {}; // key: `${targetName}:${property}` -> KeyframeTrack
  }

  AnimationTimeline.prototype.getTrackKey = function (targetName, property) {
    return (targetName || 'Root') + '::' + property;
  };

  AnimationTimeline.prototype.addTrack = function (targetName, property, interpolation) {
    var key = this.getTrackKey(targetName, property);
    if (!this.tracks[key]) {
      this.tracks[key] = new KeyframeTrack(targetName, property, interpolation);
    }
    return this.tracks[key];
  };

  AnimationTimeline.prototype.getTrack = function (targetName, property) {
    var key = this.getTrackKey(targetName, property);
    return this.tracks[key] || null;
  };

  AnimationTimeline.prototype.removeTrack = function (targetName, property) {
    var key = this.getTrackKey(targetName, property);
    delete this.tracks[key];
  };

  AnimationTimeline.prototype.addKeyframe = function (targetName, property, time, value) {
    var track = this.addTrack(targetName, property);
    track.addKeyframe(time, value);
    if (time > this.duration) {
      this.duration = time;
    }
    return this;
  };

  AnimationTimeline.prototype.evaluateAll = function (time) {
    var result = {};
    var trackKeys = Object.keys(this.tracks);
    for (var i = 0; i < trackKeys.length; i++) {
      var track = this.tracks[trackKeys[i]];
      if (!result[track.targetName]) result[track.targetName] = {};
      result[track.targetName][track.property] = track.evaluate(time);
    }
    return result;
  };

  AnimationTimeline.prototype.applyToScene = function (rootObject, time) {
    if (!rootObject) return;
    var stateMap = this.evaluateAll(time);
    var targetNames = Object.keys(stateMap);

    targetNames.forEach(function (name) {
      var target = null;
      if (rootObject.name === name || name === 'Root') {
        target = rootObject;
      } else if (typeof rootObject.getObjectByName === 'function') {
        target = rootObject.getObjectByName(name);
      }

      if (!target) return;
      var values = stateMap[name];

      if (values.position && target.position) {
        target.position.set(values.position.x, values.position.y, values.position.z);
      }
      if (values.rotation && target.rotation) {
        if (values.rotation.w !== undefined && target.quaternion) {
          target.quaternion.set(values.rotation.x, values.rotation.y, values.rotation.z, values.rotation.w);
        } else {
          target.rotation.set(values.rotation.x, values.rotation.y, values.rotation.z);
        }
      }
      if (values.scale && target.scale) {
        target.scale.set(values.scale.x, values.scale.y, values.scale.z);
      }
      if (values.emissiveIntensity !== undefined) {
        target.traverse(function (child) {
          if (child.material && child.material.emissiveIntensity !== undefined) {
            child.material.emissiveIntensity = values.emissiveIntensity;
          }
        });
      }
    });
  };

  AnimationTimeline.prototype.toAnimationClip = function (clipName) {
    clipName = clipName || 'NexusTimelineClip';
    var threeTracks = [];
    var trackKeys = Object.keys(this.tracks);

    for (var i = 0; i < trackKeys.length; i++) {
      var track = this.tracks[trackKeys[i]];
      var threeTrack = track.toThreeTrack();
      if (threeTrack) threeTracks.push(threeTrack);
    }

    if (THREE && THREE.AnimationClip) {
      return new THREE.AnimationClip(clipName, this.duration, threeTracks);
    }
    return { name: clipName, duration: this.duration, tracks: threeTracks };
  };

  AnimationTimeline.prototype.fromAnimationClip = function (clip) {
    if (!clip || !clip.tracks) return this;
    this.duration = clip.duration || 5.0;
    this.tracks = {};

    for (var i = 0; i < clip.tracks.length; i++) {
      var track = clip.tracks[i];
      var nameParts = track.name.split('.');
      var targetName = nameParts[0] || 'Root';
      var propName = nameParts[1] || 'position';

      if (propName === 'quaternion') propName = 'rotation';
      if (propName === 'material' && nameParts[2] === 'emissiveIntensity') propName = 'emissiveIntensity';

      var newTrack = this.addTrack(targetName, propName);
      var times = track.times;
      var values = track.values;
      var stride = (propName === 'rotation') ? 4 : (propName === 'emissiveIntensity' ? 1 : 3);

      for (var k = 0; k < times.length; k++) {
        var t = times[k];
        var v;
        if (stride === 1) {
          v = values[k];
        } else if (stride === 4) {
          v = { x: values[k * 4], y: values[k * 4 + 1], z: values[k * 4 + 2], w: values[k * 4 + 3] };
        } else {
          v = { x: values[k * 3], y: values[k * 3 + 1], z: values[k * 3 + 2] };
        }
        newTrack.addKeyframe(t, v);
      }
    }
    return this;
  };

  AnimationTimeline.prototype.toJSON = function () {
    var out = {
      version: VERSION,
      duration: this.duration,
      tracks: []
    };

    var trackKeys = Object.keys(this.tracks);
    for (var i = 0; i < trackKeys.length; i++) {
      var t = this.tracks[trackKeys[i]];
      out.tracks.push({
        targetName: t.targetName,
        property: t.property,
        interpolation: t.interpolation,
        keyframes: t.keyframes
      });
    }
    return out;
  };

  AnimationTimeline.prototype.fromJSON = function (json) {
    if (!json || !json.tracks) return this;
    this.duration = json.duration || 5.0;
    this.tracks = {};

    for (var i = 0; i < json.tracks.length; i++) {
      var t = json.tracks[i];
      var track = this.addTrack(t.targetName, t.property, t.interpolation);
      if (Array.isArray(t.keyframes)) {
        for (var k = 0; k < t.keyframes.length; k++) {
          track.addKeyframe(t.keyframes[k].time, t.keyframes[k].value);
        }
      }
    }
    return this;
  };

  // =========================================================================
  // 4. TIMELINE PLAYBACK CONTROLLER
  // =========================================================================

  function TimelineController(options) {
    options = options || {};
    this.duration = options.duration !== undefined ? options.duration : 5.0;
    this.currentTime = 0.0;
    this.playbackRate = options.playbackRate !== undefined ? options.playbackRate : 1.0;
    this.loopMode = options.loopMode || 'loop'; // 'loop' | 'once' | 'pingpong'
    this.isPlaying = options.autoPlay !== undefined ? options.autoPlay : false;
    this.activePreset = options.preset || 'none'; // 'hover-levitate' | 'exploded-view' | 'orbital-turntable' | 'pulse-breathe' | 'warp-spin' | 'none'
    this.explodedFactor = 0.0;
    this.direction = 1; // 1 for forward, -1 for reverse in pingpong

    this.timeline = options.timeline || new AnimationTimeline(this.duration);
    this.targetObject = options.targetObject || null;
    this.listeners = {};
  }

  TimelineController.prototype.on = function (event, cb) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(cb);
    return this;
  };

  TimelineController.prototype.emit = function (event, data) {
    if (!this.listeners[event]) return;
    for (var i = 0; i < this.listeners[event].length; i++) {
      try {
        this.listeners[event][i](data);
      } catch (err) {
        console.error('Timeline event error:', err);
      }
    }
  };

  TimelineController.prototype.play = function () {
    this.isPlaying = true;
    this.emit('play', { time: this.currentTime, rate: this.playbackRate });
    return this;
  };

  TimelineController.prototype.pause = function () {
    this.isPlaying = false;
    this.emit('pause', { time: this.currentTime });
    return this;
  };

  TimelineController.prototype.togglePlay = function () {
    if (this.isPlaying) return this.pause();
    return this.play();
  };

  TimelineController.prototype.stop = function () {
    this.pause();
    this.seek(0.0);
    this.direction = 1;
    return this;
  };

  TimelineController.prototype.seek = function (time) {
    this.currentTime = clamp(parseFloat(time) || 0, 0.0, this.duration);
    this.applyCurrentState();
    this.emit('timeupdate', {
      time: this.currentTime,
      progress: this.currentTime / this.duration,
      isPlaying: this.isPlaying
    });
    return this;
  };

  TimelineController.prototype.scrub = function (progress) {
    progress = clamp(parseFloat(progress) || 0, 0.0, 1.0);
    return this.seek(progress * this.duration);
  };

  TimelineController.prototype.setSpeed = function (rate) {
    this.playbackRate = Math.max(0.1, parseFloat(rate) || 1.0);
    this.emit('speedchange', { rate: this.playbackRate });
    return this;
  };

  TimelineController.prototype.setLoopMode = function (mode) {
    this.loopMode = mode || 'loop';
    return this;
  };

  TimelineController.prototype.setDuration = function (dur) {
    this.duration = Math.max(0.1, parseFloat(dur) || 5.0);
    this.timeline.duration = this.duration;
    if (this.currentTime > this.duration) {
      this.seek(this.duration);
    }
    return this;
  };

  TimelineController.prototype.setPreset = function (presetName, options) {
    this.activePreset = presetName || 'none';
    if (options && options.duration) this.setDuration(options.duration);
    this.emit('presetchange', { preset: this.activePreset });
    this.applyCurrentState();
    return this;
  };

  TimelineController.prototype.setExplodedFactor = function (factor, options) {
    this.explodedFactor = clamp(parseFloat(factor) || 0, 0.0, 1.0);
    if (this.targetObject) {
      ExplodedView.setFactor(this.targetObject, this.explodedFactor, options);
    }
    this.emit('explodedchange', { factor: this.explodedFactor });
    return this;
  };

  TimelineController.prototype.setTarget = function (obj) {
    this.targetObject = obj;
    if (this.targetObject && this.targetObject.children && this.targetObject.children.length > 0) {
      ExplodedView.prepareHierarchy(this.targetObject);
    }
    return this;
  };

  TimelineController.prototype.applyCurrentState = function () {
    if (!this.targetObject) return;
    var t = this.currentTime;

    if (this.activePreset === 'hover-levitate') {
      HoverLevitate.apply(this.targetObject, t);
    } else if (this.activePreset === 'exploded-view') {
      // In timeline mode, explode dynamically if not manually scrubbed
      var normT = t / this.duration;
      var factor = 0;
      if (normT < 0.45) factor = normT / 0.45;
      else if (normT <= 0.55) factor = 1.0;
      else factor = 1.0 - ((normT - 0.55) / 0.45);
      ExplodedView.setFactor(this.targetObject, factor);
    } else if (this.activePreset === 'orbital-turntable') {
      OrbitalTurntable.apply(this.targetObject, t);
    } else if (this.activePreset === 'pulse-breathe') {
      PulseBreathe.apply(this.targetObject, t);
    } else if (this.activePreset === 'warp-spin') {
      WarpSpin.apply(this.targetObject, t);
    } else {
      // Custom timeline keyframes
      this.timeline.applyToScene(this.targetObject, t);
    }
  };

  TimelineController.prototype.update = function (deltaSeconds) {
    if (!this.isPlaying) return;
    var delta = (deltaSeconds || 0.016) * this.playbackRate * this.direction;
    var nextTime = this.currentTime + delta;

    if (this.direction > 0 && nextTime >= this.duration) {
      if (this.loopMode === 'loop') {
        nextTime = nextTime % this.duration;
        this.emit('loop', { time: nextTime });
      } else if (this.loopMode === 'pingpong') {
        nextTime = this.duration;
        this.direction = -1;
      } else {
        nextTime = this.duration;
        this.pause();
        this.emit('ended', { time: nextTime });
      }
    } else if (this.direction < 0 && nextTime <= 0) {
      if (this.loopMode === 'pingpong') {
        nextTime = 0;
        this.direction = 1;
      } else {
        nextTime = 0;
        this.pause();
      }
    }

    this.currentTime = clamp(nextTime, 0.0, this.duration);
    this.applyCurrentState();

    this.emit('timeupdate', {
      time: this.currentTime,
      progress: this.currentTime / this.duration,
      isPlaying: this.isPlaying
    });
  };

  // =========================================================================
  // 5. ANIMATED GLB / GLTF EXPORT HELPER
  // =========================================================================

  function exportAnimatedGLB(sceneOrRoot, animationClips, options, onComplete, onError) {
    options = options || {};
    animationClips = Array.isArray(animationClips) ? animationClips : (animationClips ? [animationClips] : []);

    if (typeof THREE.GLTFExporter === 'function') {
      var exporter = new THREE.GLTFExporter();
      var exportOpts = {
        binary: options.binary !== undefined ? options.binary : true,
        animations: animationClips,
        embedImages: true
      };

      exporter.parse(sceneOrRoot, function (result) {
        if (typeof onComplete === 'function') {
          onComplete(result);
        } else if (typeof document !== 'undefined' && document.createElement) {
          var isBin = result instanceof ArrayBuffer || result instanceof Uint8Array;
          var blob = isBin ? new Blob([result], { type: 'model/gltf-binary' }) : new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
          var link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = (options.filename || 'nexus_animated_cad_' + Date.now()) + (isBin ? '.glb' : '.gltf');
          link.click();
        }
      }, function (err) {
        if (typeof onError === 'function') onError(err);
        else console.error('GLTFExporter animation error:', err);
      }, exportOpts);
      return true;
    }

    if (typeof onError === 'function') {
      onError(new Error('THREE.GLTFExporter not loaded'));
    }
    return false;
  }

  // =========================================================================
  // 6. PUBLIC FACTORY EXPORTS
  // =========================================================================

  return {
    VERSION: VERSION,
    Easing: Easing,
    HoverLevitate: HoverLevitate,
    ExplodedView: ExplodedView,
    OrbitalTurntable: OrbitalTurntable,
    PulseBreathe: PulseBreathe,
    WarpSpin: WarpSpin,
    KeyframeTrack: KeyframeTrack,
    AnimationTimeline: AnimationTimeline,
    TimelineController: TimelineController,

    createTimelineController: function (options) {
      return new TimelineController(options);
    },

    createTimeline: function (duration) {
      return new AnimationTimeline(duration);
    },

    generatePresetClip: function (presetName, targetName, options) {
      if (presetName === 'hover-levitate') return HoverLevitate.createAnimationClip(targetName, options && options.duration, options);
      if (presetName === 'exploded-view' && options && options.rootGroup) return ExplodedView.createAnimationClip(options.rootGroup, options);
      if (presetName === 'orbital-turntable') return OrbitalTurntable.createAnimationClip(targetName, options && options.duration, options);
      if (presetName === 'pulse-breathe') return PulseBreathe.createAnimationClip(targetName, options && options.duration, options);
      if (presetName === 'warp-spin') return WarpSpin.createAnimationClip(targetName, options && options.duration, options);
      return null;
    },

    exportAnimatedGLB: exportAnimatedGLB
  };
});
