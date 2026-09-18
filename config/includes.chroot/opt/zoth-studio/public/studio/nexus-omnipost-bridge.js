/**
 * ⚡ ZOTH NEXUS 3D ➔ OMNIPOST 2.0 MOTION GRAPHICS BRIDGE
 * 
 * Seamless, local-first motion graphics bridge linking the CAD-Grade
 * Nexus 3D Omniverse WebGL Viewport to OmniPost 2.0 60 FPS Video Studio.
 * 
 * Features:
 * 1. 1-Click 'Send 3D Scene to OmniPost' workflow passing camera trajectories,
 *    3D model configurations, and lighting setups via localStorage & BroadcastChannel.
 * 2. Automated Camera Transition Presets:
 *    - 'Cinematic Dolly In'
 *    - 'Dramatic 360 Spiral'
 *    - 'Hero Pan & Tilt'
 *    - 'Isometric Flyby'
 * 3. Multi-Layer Motion Graphics Video Template Generator:
 *    - Layer 1: Active 3D Viewport Stream & Trajectory Engine
 *    - Layer 2: Animated Lower-Third Title Card & CAD Telemetry HUD
 *    - Layer 3: Synchronized Procedural Background Music Track (Web Audio Synth)
 * 4. Resilient cross-tab & cross-window communication with bidirectional ACK handshake
 * 5. High-DPI Canvas Lower-Third Motion Graphics Renderer & 3D Trajectory Projection
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.NexusOmniPostBridge = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var VERSION = '2026-08-24-motion-bridge-v2.0';
  var CHANNEL_NAME = 'zoth-nexus-omnipost-bus';
  var STORAGE_KEY_PAYLOAD = 'zoth_nexus_omnipost_payload';
  var STORAGE_KEY_ACK = 'zoth_nexus_omnipost_ack';
  var STORAGE_KEY_TEMPLATE = 'zoth_omnipost_motion_template';
  var STORAGE_KEY_HISTORY = 'zoth_nexus_omnipost_history';

  // =========================================================================
  // 1. MATHEMATICAL CONSTANTS & EASING CURVES
  // =========================================================================
  var PHI = (1 + Math.sqrt(5)) / 2; // Golden Ratio Φ ≈ 1.6180339887

  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  function smoothstep(t) {
    var c = clamp(t, 0, 1);
    return c * c * (3 - 2 * c);
  }

  function smootherstep(t) {
    var c = clamp(t, 0, 1);
    return c * c * c * (c * (c * 6 - 15) + 10);
  }

  function easeInOutCubic(t) {
    var c = clamp(t, 0, 1);
    return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2;
  }

  function easeOutQuad(t) {
    var c = clamp(t, 0, 1);
    return 1 - (1 - c) * (1 - c);
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function lerpVec3(v1, v2, t) {
    return {
      x: lerp(v1.x, v2.x, t),
      y: lerp(v1.y, v2.y, t),
      z: lerp(v1.z, v2.z, t)
    };
  }

  // =========================================================================
  // 2. AUTOMATED CAMERA TRANSITION PRESETS & TRAJECTORY GENERATOR
  // =========================================================================
  var CAMERA_PRESETS = {
    'Cinematic Dolly In': {
      id: 'cinematic_dolly_in',
      name: 'Cinematic Dolly In',
      description: 'Smooth axial push-in from wide establishing shot to hero focal close-up with dynamic FOV compression.',
      duration: 12.0,
      defaultFov: 50.0,
      targetFov: 36.0,
      generator: function (t, duration, custom) {
        var progress = clamp(t / duration, 0, 1);
        var ease = easeInOutCubic(progress);
        
        var startDist = (custom && custom.startDistance) || 16.0;
        var endDist = (custom && custom.endDistance) || 4.2;
        var height = (custom && custom.height) || 3.5;
        var targetY = (custom && custom.targetY) || 1.2;

        var dist = lerp(startDist, endDist, ease);
        var fov = lerp(50.0, 36.0, ease);

        return {
          position: {
            x: Math.sin(ease * 0.2) * 1.5,
            y: lerp(height, targetY + 0.4, ease),
            z: dist
          },
          target: {
            x: 0,
            y: targetY,
            z: 0
          },
          fov: fov,
          roll: Math.sin(progress * Math.PI) * 0.03, // subtle organic banking (radians)
          progress: progress
        };
      }
    },

    'Dramatic 360 Spiral': {
      id: 'dramatic_360_spiral',
      name: 'Dramatic 360 Spiral',
      description: 'Helical ascending orbit around the 3D subject with undulating vertical sinusoid and leading target lock.',
      duration: 14.0,
      defaultFov: 45.0,
      targetFov: 45.0,
      generator: function (t, duration, custom) {
        var progress = clamp(t / duration, 0, 1);
        var ease = smoothstep(progress);
        
        var radius = lerp(13.0, 7.5, ease);
        var angle = progress * Math.PI * 2.0 * ((custom && custom.rotations) || 1.0);
        var heightBase = (custom && custom.startHeight) || 2.0;
        var heightEnd = (custom && custom.endHeight) || 8.0;
        var y = lerp(heightBase, heightEnd, ease) + Math.sin(angle * 2) * 0.8;
        var targetY = (custom && custom.targetY) || 1.4;

        return {
          position: {
            x: Math.cos(angle) * radius,
            y: y,
            z: Math.sin(angle) * radius
          },
          target: {
            x: Math.sin(angle * 0.5) * 0.4,
            y: targetY,
            z: Math.cos(angle * 0.5) * 0.4
          },
          fov: 45.0 + Math.sin(progress * Math.PI * 2) * 3.0,
          roll: Math.sin(angle) * 0.05,
          progress: progress
        };
      }
    },

    'Hero Pan & Tilt': {
      id: 'hero_pan_tilt',
      name: 'Hero Pan & Tilt',
      description: 'Sweeping low-angle Dutch tilt heroic arc tracking across the mesh from bottom-left to elevated vantage point.',
      duration: 10.0,
      defaultFov: 48.0,
      targetFov: 42.0,
      generator: function (t, duration, custom) {
        var progress = clamp(t / duration, 0, 1);
        var ease = easeInOutCubic(progress);

        var startPos = { x: -9.0, y: 0.8, z: 8.5 };
        var endPos = { x: 7.5, y: 4.8, z: 6.2 };
        var pos = lerpVec3(startPos, endPos, ease);
        var targetY = (custom && custom.targetY) || 1.3;

        // Dutch tilt roll transition: -6 degrees to +3 degrees in radians
        var startRoll = -0.1047; // -6°
        var endRoll = 0.0523;   // +3°
        var roll = lerp(startRoll, endRoll, ease);

        return {
          position: pos,
          target: {
            x: lerp(-0.5, 0.5, ease),
            y: targetY,
            z: 0
          },
          fov: lerp(48.0, 42.0, ease),
          roll: roll,
          progress: progress
        };
      }
    },

    'Isometric Flyby': {
      id: 'isometric_flyby',
      name: 'Isometric Flyby',
      description: 'True axonometric high-speed diagonal glide trajectory across the scene with golden elevation angle.',
      duration: 12.0,
      defaultFov: 32.0,
      targetFov: 32.0,
      generator: function (t, duration, custom) {
        var progress = clamp(t / duration, 0, 1);
        var ease = smootherstep(progress);

        var span = (custom && custom.span) || 24.0;
        var offset = (ease - 0.5) * span;
        var elev = (custom && custom.elevation) || 10.5;

        // 45-degree azimuth axonometric trajectory
        return {
          position: {
            x: offset - 10.0,
            y: elev,
            z: offset + 10.0
          },
          target: {
            x: offset * 0.85,
            y: 0.8,
            z: offset * 0.85
          },
          fov: 32.0,
          roll: 0.0,
          progress: progress
        };
      }
    }
  };

  /**
   * Computes a full camera trajectory keyframe array at a given FPS.
   */
  function computeCameraTrajectory(presetName, duration, fps, customOptions) {
    var preset = CAMERA_PRESETS[presetName] || CAMERA_PRESETS['Cinematic Dolly In'];
    var dur = typeof duration === 'number' && duration > 0 ? duration : preset.duration;
    var rate = typeof fps === 'number' && fps > 0 ? fps : 60;
    var totalFrames = Math.max(2, Math.round(dur * rate));
    var trajectory = [];

    for (var i = 0; i <= totalFrames; i++) {
      var t = (i / totalFrames) * dur;
      var point = preset.generator(t, dur, customOptions);
      point.time = Number(t.toFixed(4));
      point.frame = i;
      trajectory.push(point);
    }

    return {
      preset: preset.name,
      presetId: preset.id,
      duration: dur,
      fps: rate,
      totalFrames: totalFrames,
      keyframes: trajectory
    };
  }

  /**
   * Evaluates camera position and orientation at an arbitrary timestamp t.
   */
  function evaluateCameraAt(presetOrTrajectory, time, duration, customOptions) {
    var presetName = typeof presetOrTrajectory === 'string' ? presetOrTrajectory : (presetOrTrajectory && presetOrTrajectory.preset) || 'Cinematic Dolly In';
    var preset = CAMERA_PRESETS[presetName] || CAMERA_PRESETS['Cinematic Dolly In'];
    var dur = typeof duration === 'number' && duration > 0 ? duration : ((presetOrTrajectory && presetOrTrajectory.duration) || preset.duration);
    var t = Math.max(0, time % (dur || 1.0));
    return preset.generator(t, dur, customOptions);
  }

  // =========================================================================
  // 3. MUSIC TRACK SELECTION & AUDIO-MOTION SYNC CONFIG
  // =========================================================================
  var SOUNDTRACK_PRESETS = {
    quantum_nexus: {
      key: 'quantum_nexus',
      name: '⚡ Quantum Nexus 3D',
      genre: 'Lo-Fi Neural Waves',
      bpm: 96,
      defaultVolume: 0.38,
      filterCutoff: 2800,
      vibe: 'scifi'
    },
    azoth_transmutation: {
      key: 'azoth_transmutation',
      name: "🌌 Azoth's Transmutation",
      genre: 'Cyberpunk Synthwave',
      bpm: 122,
      defaultVolume: 0.40,
      filterCutoff: 3200,
      vibe: 'cyberpunk'
    },
    solfeggio_432: {
      key: 'solfeggio_432',
      name: '✨ 432Hz Sacred Solfeggio',
      genre: 'Hermetic Resonance & Golden Drone',
      bpm: 72,
      defaultVolume: 0.35,
      filterCutoff: 2400,
      vibe: 'sacred'
    },
    draco_swarm: {
      key: 'draco_swarm',
      name: '🐉 Draco Swarm Arena',
      genre: 'High-Octane Kinetic Drum & Bass',
      bpm: 140,
      defaultVolume: 0.42,
      filterCutoff: 3600,
      vibe: 'intense'
    },
    rubin_808: {
      key: 'rubin_808',
      name: '🧘 Rubin 808 Reducer',
      genre: 'Minimalist Raw 808 & Silence',
      bpm: 90,
      defaultVolume: 0.36,
      filterCutoff: 2600,
      vibe: 'minimal'
    }
  };

  /**
   * Intelligently selects the best soundtrack preset matching prompt or model metadata.
   */
  function pickSoundtrackForScene(sceneData) {
    var text = ((sceneData && (sceneData.proceduralPrompt || sceneData.modelName || sceneData.name || sceneData.category)) || '').toLowerCase();
    
    // Check specific archetypes
    if (text.includes('quantum') || text.includes('reactor') || text.includes('tesseract') || text.includes('cad') || text.includes('neural')) {
      return SOUNDTRACK_PRESETS.quantum_nexus;
    }
    if (text.includes('sacred') || text.includes('portal') || text.includes('crystal') || text.includes('metatron') || text.includes('gold') || text.includes('solfeggio')) {
      return SOUNDTRACK_PRESETS.solfeggio_432;
    }
    if (text.includes('weapon') || text.includes('rifle') || text.includes('cannon') || text.includes('blaster') || text.includes('ship') || text.includes('starfighter') || text.includes('dragon') || text.includes('draco') || text.includes('plasma')) {
      return SOUNDTRACK_PRESETS.draco_swarm;
    }
    if (text.includes('minimal') || text.includes('zen') || text.includes('rubin') || text.includes('808')) {
      return SOUNDTRACK_PRESETS.rubin_808;
    }
    return SOUNDTRACK_PRESETS.azoth_transmutation;
  }

  // =========================================================================
  // 4. 3D SCENE DATA EXTRACTOR & PAYLOAD PACKAGER
  // =========================================================================

  /**
   * Extracts clean serializable JSON data from active Nexus 3D scene.
   */
  function extractSceneData(options) {
    var opts = options || {};
    var scene = opts.scene;
    var camera = opts.camera;
    var prompt = opts.prompt || opts.proceduralPrompt || 'Cyberpunk Quantum Mesh';
    var activeModelName = opts.modelName || opts.name || 'Quantum Core Generator';
    var category = opts.category || 'scifi';
    var format = opts.format || 'Procedural';
    var pbrStyle = opts.pbrStyle || 'carbon-fiber';
    var cameraPreset = opts.cameraPreset || 'Cinematic Dolly In';
    var duration = typeof opts.duration === 'number' ? opts.duration : 12.0;

    var meshCount = 1;
    var vertexCount = 1248;
    var faceCount = 624;
    var primitives = [];

    // Traverse scene if Three.js scene object was provided
    if (scene && typeof scene.traverse === 'function') {
      meshCount = 0;
      vertexCount = 0;
      faceCount = 0;

      scene.traverse(function (obj) {
        if (obj.isMesh && obj.geometry) {
          meshCount++;
          var pos = obj.geometry.attributes && obj.geometry.attributes.position;
          if (pos) {
            var count = pos.count || 0;
            vertexCount += count;
            faceCount += obj.geometry.index ? Math.floor(obj.geometry.index.count / 3) : Math.floor(count / 3);
          }
          primitives.push({
            name: obj.name || ('Mesh_' + meshCount),
            type: (obj.geometry.type || 'BufferGeometry').replace('Geometry', ''),
            materialType: obj.material ? (obj.material.type || 'Standard') : 'Standard',
            wireframe: Boolean(obj.material && obj.material.wireframe),
            visible: obj.visible !== false
          });
        }
      });
      if (meshCount === 0) meshCount = 1;
      if (vertexCount === 0) vertexCount = 1248;
    } else if (opts.meshList && Array.isArray(opts.meshList)) {
      meshCount = opts.meshList.length || 1;
      vertexCount = meshCount * 1248;
      faceCount = meshCount * 624;
    } else if (opts.vertexCount) {
      vertexCount = opts.vertexCount;
      meshCount = opts.meshCount || 1;
      faceCount = opts.faceCount || Math.floor(vertexCount / 2);
    }

    // Camera initial configuration
    var cameraInit = {
      position: { x: 6.0, y: 6.0, z: 12.0 },
      target: { x: 0.0, y: 1.5, z: 0.0 },
      fov: 45.0,
      near: 0.1,
      far: 1000.0,
      aspect: 16 / 9
    };

    if (camera && camera.position) {
      cameraInit.position = {
        x: Number(camera.position.x.toFixed(3)),
        y: Number(camera.position.y.toFixed(3)),
        z: Number(camera.position.z.toFixed(3))
      };
      if (typeof camera.fov === 'number') cameraInit.fov = camera.fov;
      if (typeof camera.aspect === 'number') cameraInit.aspect = camera.aspect;
    }

    // Lighting setup
    var lighting = {
      ambient: { color: '#ffffff', intensity: 0.6 },
      directionalLights: [
        { color: '#00e5ff', intensity: 2.0, position: { x: 10, y: 15, z: 10 } },
        { color: '#d946ef', intensity: 1.5, position: { x: -10, y: 10, z: -10 } }
      ],
      bloom: {
        enabled: true,
        strength: opts.bloomStrength || 1.25,
        radius: opts.bloomRadius || 0.4,
        threshold: opts.bloomThreshold || 0.85
      }
    };

    // Calculate trajectory
    var trajectory = computeCameraTrajectory(cameraPreset, duration, 60, opts.trajectoryOptions);

    // Selected soundtrack
    var soundtrack = opts.soundtrackKey && SOUNDTRACK_PRESETS[opts.soundtrackKey]
      ? SOUNDTRACK_PRESETS[opts.soundtrackKey]
      : pickSoundtrackForScene({ proceduralPrompt: prompt, modelName: activeModelName, category: category });

    // Lower-third metadata
    var lowerThird = {
      title: activeModelName.toUpperCase(),
      subtitle: (prompt.length > 50 ? prompt.substring(0, 47) + '...' : prompt),
      badge: 'CAD // 60 FPS',
      category: category.toUpperCase(),
      telemetry: {
        meshes: meshCount,
        vertices: vertexCount.toLocaleString(),
        faces: faceCount.toLocaleString(),
        pbr: pbrStyle,
        engine: 'Nexus 3D v3.2'
      }
    };

    var payload = {
      bridgeVersion: VERSION,
      timestamp: Date.now(),
      isoDate: new Date().toISOString(),
      model: {
        name: activeModelName,
        category: category,
        format: format,
        proceduralPrompt: prompt,
        pbrStyle: pbrStyle,
        meshCount: meshCount,
        vertexCount: vertexCount,
        faceCount: faceCount,
        primitives: primitives.slice(0, 16),
        activePath: opts.activePath || ''
      },
      camera: {
        preset: cameraPreset,
        initial: cameraInit,
        trajectory: trajectory
      },
      lighting: lighting,
      soundtrack: soundtrack,
      lowerThird: lowerThird,
      snapshotDataUrl: opts.snapshotDataUrl || null
    };

    return payload;
  }

  // =========================================================================
  // 5. MULTI-LAYER MOTION GRAPHICS VIDEO TEMPLATE GENERATOR
  // =========================================================================

  /**
   * Generates a multi-layer motion graphics template specifically formatted for OmniPost 2.0.
   */
  function generateMotionTemplate(scenePayload, templateOptions) {
    var payload = scenePayload || extractSceneData({});
    var opts = templateOptions || {};
    var duration = typeof opts.duration === 'number' ? opts.duration : (payload.camera.trajectory.duration || 14.0);
    var aspectRatio = opts.aspectRatio || '9_16';
    var track = payload.soundtrack || pickSoundtrackForScene(payload.model);

    var modelName = payload.model.name || '3D Procedural Solid';
    var prompt = payload.model.proceduralPrompt || 'Nexus 3D Omniverse Synthesis';
    var presetName = payload.camera.preset || 'Cinematic Dolly In';

    // Slide timings calculation
    var slide1Dur = Math.max(3.0, Number((duration * 0.25).toFixed(1)));
    var slide2Dur = Math.max(3.0, Number((duration * 0.25).toFixed(1)));
    var slide3Dur = Math.max(3.0, Number((duration * 0.25).toFixed(1)));
    var slide4Dur = Math.max(3.0, Number((duration - (slide1Dur + slide2Dur + slide3Dur)).toFixed(1)));

    var slides = [
      {
        title: 'ARCHETYPE INTRO',
        text: 'Synthesized CAD-grade 3D mesh: ' + modelName + '. Real-time procedural geometry active in 60 FPS WebGL.',
        duration: slide1Dur,
        theme: 'nebula',
        transition: 'zoom',
        mascot: 'azoth',
        cameraPhase: 'establishing_shot'
      },
      {
        title: 'CAD TELEMETRY',
        text: 'Topology: ' + payload.model.vertexCount.toLocaleString() + ' Vertices across ' + payload.model.meshCount + ' Meshes. ' + presetName + ' camera path.',
        duration: slide2Dur,
        theme: 'quantum',
        transition: 'glitch',
        mascot: 'kai',
        cameraPhase: 'telemetry_inspection'
      },
      {
        title: 'PROCEDURAL PBR',
        text: 'Procedural material shader (' + payload.model.pbrStyle + ') with multi-point directional lighting & UnrealBloom.',
        duration: slide3Dur,
        theme: 'matrix',
        transition: 'bloom',
        mascot: 'draco',
        cameraPhase: 'pbr_dynamics'
      },
      {
        title: 'RENDER FINALE',
        text: 'Full 3D scene synchronized with ' + track.name + ' (' + track.bpm + ' BPM). Sovereign local-first pipeline ready.',
        duration: slide4Dur,
        theme: 'crimson',
        transition: 'spin',
        mascot: 'lycan',
        cameraPhase: 'finale_orbit'
      }
    ];

    // Compute cumulative start and end times
    var accTime = 0;
    slides.forEach(function (slide) {
      slide.startTime = Number(accTime.toFixed(1));
      slide.endTime = Number((accTime + slide.duration).toFixed(1));
      accTime += slide.duration;
    });

    var template = {
      templateId: 'nexus_motion_' + Date.now(),
      templateName: modelName + ' — ' + presetName + ' 60 FPS Motion Template',
      version: VERSION,
      aspectRatio: aspectRatio,
      totalDuration: Number(accTime.toFixed(1)),
      fps: 60,
      layers: {
        layer1_viewportStream: {
          type: '3d_viewport_stream',
          name: 'Nexus 3D WebGL Viewport Stream',
          active: true,
          model: payload.model,
          cameraPreset: presetName,
          trajectory: payload.camera.trajectory,
          lighting: payload.lighting
        },
        layer2_lowerThirdHUD: {
          type: 'animated_lower_third',
          name: 'Animated Cyber Lower-Third & HUD',
          active: true,
          title: payload.lowerThird.title,
          subtitle: payload.lowerThird.subtitle,
          badge: payload.lowerThird.badge,
          telemetry: payload.lowerThird.telemetry,
          accentColor: '#00f0ff',
          secondaryColor: '#d946ef',
          inAnimation: 'slide_up_reveal',
          outAnimation: 'fade_out_wipe'
        },
        layer3_audioSoundtrack: {
          type: 'synchronized_bgm',
          name: 'Procedural Web Audio Soundtrack',
          active: true,
          trackKey: track.key,
          trackName: track.name,
          genre: track.genre,
          bpm: track.bpm,
          volume: track.defaultVolume || 0.38,
          filterCutoff: track.filterCutoff || 2800,
          duckOnVoiceover: true
        }
      },
      slides: slides,
      scenePayload: payload
    };

    return template;
  }

  // =========================================================================
  // 6. CROSS-TAB TRANSPORT & BIDIRECTIONAL HANDSHAKE PROTOCOL
  // =========================================================================

  var broadcastChannel = null;

  function getBroadcastChannel(forceFresh) {
    if (!forceFresh && broadcastChannel) return broadcastChannel;
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
      } catch (e) {
        broadcastChannel = null;
      }
    }
    return broadcastChannel;
  }

  function resetBroadcastChannel() {
    if (broadcastChannel && typeof broadcastChannel.close === 'function') {
      try { broadcastChannel.close(); } catch(e){}
    }
    broadcastChannel = null;
  }

  /**
   * 1-Click Send 3D Scene to OmniPost:
   * Serializes payload, persists to localStorage, dispatches over BroadcastChannel,
   * and optionally opens or focuses OmniPost 2.0.
   */
  function sendToOmniPost(sceneDataOrOptions, options) {
    var opts = options || {};
    var payload;

    if (sceneDataOrOptions && sceneDataOrOptions.bridgeVersion && sceneDataOrOptions.model) {
      payload = sceneDataOrOptions;
    } else {
      payload = extractSceneData(sceneDataOrOptions);
    }

    var template = generateMotionTemplate(payload, opts);
    var handoffRecord = {
      handoffId: 'handoff_' + Date.now(),
      status: 'pending',
      exportedAt: Date.now(),
      payload: payload,
      template: template
    };

    // 1. Write to localStorage
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY_PAYLOAD, JSON.stringify(payload));
        localStorage.setItem(STORAGE_KEY_TEMPLATE, JSON.stringify(template));
        localStorage.setItem(STORAGE_KEY_ACK, JSON.stringify({ status: 'sent', timestamp: Date.now() }));
      } catch (err) {
        // Storage quota or disabled fallback
      }
    }

    // 2. Broadcast across all active browser tabs
    var channel = getBroadcastChannel();
    if (channel) {
      try {
        channel.postMessage({
          type: 'NEXUS_3D_SCENE_EXPORT',
          handoffId: handoffRecord.handoffId,
          payload: payload,
          template: template,
          timestamp: Date.now()
        });
      } catch (e) {
        // Broadcast failed gracefully
      }
    }

    // 3. Open or redirect to OmniPost 2.0 if requested
    var targetUrl = (opts.omnipostUrl || '/studio/omnipost.html') + '?source=nexus-3d&handoff=' + handoffRecord.handoffId;
    if (opts.openWindow !== false && typeof window !== 'undefined' && window.open) {
      try {
        window.open(targetUrl, opts.target || '_blank');
      } catch (e) {
        // Popups blocked
      }
    }

    return {
      success: true,
      handoffId: handoffRecord.handoffId,
      payload: payload,
      template: template,
      targetUrl: targetUrl
    };
  }

  /**
   * Initializes the OmniPost receiver listener for incoming handoffs from Nexus 3D.
   */
  function initOmniPostReceiver(onSceneReceivedCallback) {
    var handleIncomingPayload = function (payload, template, handoffId) {
      if (!payload) return;

      // Send ACK back
      if (typeof localStorage !== 'undefined') {
        try {
          localStorage.setItem(STORAGE_KEY_ACK, JSON.stringify({
            status: 'received',
            handoffId: handoffId || 'direct',
            receivedAt: Date.now(),
            modelName: payload.model ? payload.model.name : ''
          }));
        } catch (e) {}
      }

      var channel = getBroadcastChannel();
      if (channel) {
        try {
          channel.postMessage({
            type: 'NEXUS_3D_EXPORT_ACK',
            handoffId: handoffId || 'direct',
            status: 'received',
            receivedAt: Date.now()
          });
        } catch (e) {}
      }

      if (typeof onSceneReceivedCallback === 'function') {
        onSceneReceivedCallback(payload, template);
      }
    };

    // 1. Check URL parameters for handoff trigger (if in browser)
    if (typeof window !== 'undefined' && window.location && window.location.search) {
      var urlParams = new URLSearchParams(window.location.search);
      var sourceParam = urlParams.get('source');
      var handoffParam = urlParams.get('handoff');

      if (sourceParam === 'nexus-3d' || handoffParam) {
        if (typeof localStorage !== 'undefined') {
          try {
            var rawPayload = localStorage.getItem(STORAGE_KEY_PAYLOAD);
            var rawTemplate = localStorage.getItem(STORAGE_KEY_TEMPLATE);
            if (rawPayload) {
              var p = JSON.parse(rawPayload);
              var t = rawTemplate ? JSON.parse(rawTemplate) : generateMotionTemplate(p);
              setTimeout(function () {
                handleIncomingPayload(p, t, handoffParam);
              }, 150);
            }
          } catch (e) {}
        }
      }
    }

    // 2. Listen on BroadcastChannel for live hot-handoff
    var channel = getBroadcastChannel();
    if (channel && typeof channel.addEventListener === 'function') {
      channel.addEventListener('message', function (evt) {
        if (evt.data && evt.data.type === 'NEXUS_3D_SCENE_EXPORT') {
          handleIncomingPayload(evt.data.payload, evt.data.template, evt.data.handoffId);
        }
      });
    }

    // 3. Storage event listener fallback (same origin cross-tab)
    if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
      window.addEventListener('storage', function (e) {
        if (e.key === STORAGE_KEY_PAYLOAD && e.newValue) {
          try {
            var p = JSON.parse(e.newValue);
            var rawTemplate = localStorage.getItem(STORAGE_KEY_TEMPLATE);
            var t = rawTemplate ? JSON.parse(rawTemplate) : generateMotionTemplate(p);
            handleIncomingPayload(p, t, 'storage_event');
          } catch (err) {}
        }
      });
    }
  }

  /**
   * Initializes Nexus 3D sender listener to receive ACKs from OmniPost.
   */
  function initNexusSender(onAckCallback) {
    var channel = getBroadcastChannel();
    if (channel && typeof channel.addEventListener === 'function') {
      channel.addEventListener('message', function (evt) {
        if (evt.data && evt.data.type === 'NEXUS_3D_EXPORT_ACK') {
          if (typeof onAckCallback === 'function') {
            onAckCallback(evt.data);
          }
        }
      });
    }
  }

  /**
   * Helper to check if a pending handoff exists in localStorage.
   */
  function getPendingHandoff() {
    if (typeof localStorage === 'undefined') return null;
    try {
      var raw = localStorage.getItem(STORAGE_KEY_PAYLOAD);
      if (!raw) return null;
      var payload = JSON.parse(raw);
      var rawTpl = localStorage.getItem(STORAGE_KEY_TEMPLATE);
      var template = rawTpl ? JSON.parse(rawTpl) : generateMotionTemplate(payload);
      return { payload: payload, template: template };
    } catch (e) {
      return null;
    }
  }

  /**
   * Helper to clear handoff after processing.
   */
  function clearPendingHandoff() {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.removeItem(STORAGE_KEY_PAYLOAD);
      localStorage.removeItem(STORAGE_KEY_TEMPLATE);
    } catch (e) {}
  }

  // =========================================================================
  // 7. HIGH-DPI CANVAS LOWER-THIRD & HUD MOTION GRAPHICS RENDERER
  // =========================================================================

  /**
   * Renders a CAD-grade animated Lower-Third Title Card & HUD on any 2D canvas context.
   */
  function renderLowerThird(ctx, lowerThirdConfig, time, totalDuration, canvasWidth, canvasHeight) {
    if (!ctx) return;

    var w = canvasWidth || 720;
    var h = canvasHeight || 1280;
    var isPortrait = h > w;
    var cfg = lowerThirdConfig || {};
    var title = cfg.title || 'QUANTUM REACTOR CORE';
    var subtitle = cfg.subtitle || 'Procedural 3D Mesh Deformation // CAD WebGL Viewport';
    var badge = cfg.badge || 'CAD // 60 FPS';
    var telemetry = cfg.telemetry || { meshes: 1, vertices: '1,248', pbr: 'active' };

    var primaryColor = cfg.primaryColor || '#00f0ff';
    var secondaryColor = cfg.secondaryColor || '#d946ef';

    // In-out animation calculations
    var curTime = time || 0;
    var slidePhase = curTime % 4.0; // 4s rhythm
    var inProgress = clamp(slidePhase / 0.8, 0, 1);
    var easeIn = easeOutQuad(inProgress);

    // Box dimensions
    var boxW = Math.min(w * 0.90, 680);
    var boxH = isPortrait ? 130 : 100;
    var boxX = (w - boxW) / 2;
    var targetY = h - (isPortrait ? (boxH + 140) : (boxH + 60));
    var startY = targetY + 40;
    var boxY = lerp(startY, targetY, easeIn);
    var opacity = easeIn;

    ctx.save();
    ctx.globalAlpha = opacity;

    // 1. Glassmorphism backdrop
    ctx.fillStyle = 'rgba(5, 8, 18, 0.82)';
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(boxX, boxY, boxW, boxH, 12);
    } else {
      ctx.rect(boxX, boxY, boxW, boxH);
    }
    ctx.fill();
    ctx.stroke();

    // 2. Animated neon top accent line
    var lineProgress = clamp(slidePhase / 1.2, 0, 1);
    var lineWidth = boxW * easeInOutCubic(lineProgress);
    ctx.fillStyle = primaryColor;
    ctx.fillRect(boxX + 12, boxY, lineWidth - 24, 2.5);

    // 3. Glowing pill badge (Top Left of card)
    var badgeY = boxY + 18;
    ctx.fillStyle = 'rgba(0, 240, 255, 0.16)';
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 1;
    var badgeW = Math.min(150, boxW * 0.35);
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(boxX + 16, badgeY, badgeW, 20, 10);
    } else {
      ctx.rect(boxX + 16, badgeY, badgeW, 20);
    }
    ctx.fill();
    ctx.stroke();

    // Badge text
    ctx.fillStyle = primaryColor;
    ctx.font = '700 10px "IBM Plex Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('● ' + badge, boxX + 16 + badgeW / 2, badgeY + 10);

    // 4. Telemetry pills (Top Right of card)
    var vertText = (telemetry.vertices ? telemetry.vertices + ' V' : '1.2K V') + ' · ' + (telemetry.pbr || 'PBR');
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '600 11px "IBM Plex Mono", monospace';
    ctx.textAlign = 'right';
    ctx.fillText('⚡ ' + vertText, boxX + boxW - 16, badgeY + 10);

    // 5. Main Title Typography
    var titleFontSize = Math.max(16, Math.min(26, Math.floor(boxW / 22)));
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 ' + titleFontSize + 'px "Syne", "Figtree", sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.shadowColor = 'rgba(0, 240, 255, 0.4)';
    ctx.shadowBlur = 8;
    ctx.fillText(title, boxX + 18, boxY + 65);
    ctx.shadowBlur = 0;

    // 6. Subtitle / Prompt description
    var subFontSize = Math.max(11, Math.min(14, Math.floor(boxW / 36)));
    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 ' + subFontSize + 'px "Figtree", sans-serif';
    var maxSubLen = Math.floor(boxW / 9);
    var displaySub = subtitle.length > maxSubLen ? subtitle.substring(0, maxSubLen - 3) + '...' : subtitle;
    ctx.fillText(displaySub, boxX + 18, boxY + 88);

    // 7. Mini Beat indicator bar at bottom
    var beatWidth = ((curTime * 1.5) % 1) * (boxW - 36);
    ctx.fillStyle = secondaryColor;
    ctx.fillRect(boxX + 18, boxY + boxH - 6, beatWidth, 2);

    ctx.restore();
  }

  // =========================================================================
  // 8. PUBLIC EXPORT INTERFACE
  // =========================================================================
  return {
    VERSION: VERSION,
    CHANNEL_NAME: CHANNEL_NAME,
    STORAGE_KEY_PAYLOAD: STORAGE_KEY_PAYLOAD,
    STORAGE_KEY_ACK: STORAGE_KEY_ACK,
    STORAGE_KEY_TEMPLATE: STORAGE_KEY_TEMPLATE,
    STORAGE_KEY_HISTORY: STORAGE_KEY_HISTORY,
    PHI: PHI,

    // Camera presets & math
    CAMERA_PRESETS: CAMERA_PRESETS,
    SOUNDTRACK_PRESETS: SOUNDTRACK_PRESETS,
    smoothstep: smoothstep,
    smootherstep: smootherstep,
    easeInOutCubic: easeInOutCubic,
    lerp: lerp,
    lerpVec3: lerpVec3,
    computeCameraTrajectory: computeCameraTrajectory,
    evaluateCameraAt: evaluateCameraAt,
    pickSoundtrackForScene: pickSoundtrackForScene,

    // Data extraction & template synthesis
    extractSceneData: extractSceneData,
    generateMotionTemplate: generateMotionTemplate,

    // Transport & Cross-Tab Bridge
    sendToOmniPost: sendToOmniPost,
    initOmniPostReceiver: initOmniPostReceiver,
    initNexusSender: initNexusSender,
    getPendingHandoff: getPendingHandoff,
    clearPendingHandoff: clearPendingHandoff,
    getBroadcastChannel: getBroadcastChannel,
    resetBroadcastChannel: resetBroadcastChannel,

    // Canvas Graphics Helpers
    renderLowerThird: renderLowerThird
  };
});
