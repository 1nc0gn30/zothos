/**
 * ZOTH THREE ORB — Sovereign 3D Alchemical Synthesis Orb (v2.0 Master)
 * 
 * Interactive 3D WebGL alchemical particle & fluid plasma core featuring:
 * - Fluid vertex displacement shaders with multi-octave harmonic wave physics
 * - Pointer-linked inertia physics with spring-damper dynamics & velocity surges
 * - Dynamic 16-brand theme reactivity (Dark Void, Matrix, Hermetic Gold, Synthwave, etc.)
 * - DevicePixelRatio capped at Math.min(window.devicePixelRatio, 2) for smooth 60 FPS
 * - Comprehensive WebGL memory lifecycle management and context disposal
 */

(function (window) {
  'use strict';

  // 16-Theme Master Color Matrix for Zoth Studio
  var ORB_THEMES = {
    dark: {
      colorA: 0x00f0ff,     // Electric Cyan
      colorB: 0x818cf8,     // Cosmic Indigo
      accent: 0xfbbf24,     // Alchemical Gold
      torusA: 0x00f0ff,
      torusB: 0xfbbf24,
      torusAOpacity: 0.60,
      torusBOpacity: 0.45,
      dispScale: 0.18
    },
    light: {
      colorA: 0x0284c7,     // Solar Sapphire
      colorB: 0xd97706,     // Warm Amber
      accent: 0x2563eb,     // Royal Blue
      torusA: 0x0284c7,
      torusB: 0xd97706,
      torusAOpacity: 0.65,
      torusBOpacity: 0.50,
      dispScale: 0.16
    },
    matrix: {
      colorA: 0x00ff41,     // Matrix Phosphor Green
      colorB: 0x10b981,     // Cyber Jade
      accent: 0x00ff66,     // Neon Emerald
      torusA: 0x00ff41,
      torusB: 0x10b981,
      torusAOpacity: 0.70,
      torusBOpacity: 0.55,
      dispScale: 0.20
    },
    gold: {
      colorA: 0xfbbf24,     // 24K Alchemical Gold
      colorB: 0xf59e0b,     // Solar Amber
      accent: 0xffd700,     // Radiant Aurum
      torusA: 0xfbbf24,
      torusB: 0xe8c872,
      torusAOpacity: 0.75,
      torusBOpacity: 0.60,
      dispScale: 0.18
    },
    synthwave: {
      colorA: 0xff2a85,     // Outrun Hot Pink
      colorB: 0x9d4edd,     // Retrowave Purple
      accent: 0x00f0ff,     // Neon Cyan
      torusA: 0xff2a85,
      torusB: 0x9d4edd,
      torusAOpacity: 0.75,
      torusBOpacity: 0.55,
      dispScale: 0.22
    },
    google: {
      colorA: 0x8ab4f8,     // Material Blue
      colorB: 0xea4335,     // Coral Red
      accent: 0xfbbc04,     // Amber Yellow
      torusA: 0x8ab4f8,
      torusB: 0x34a853,
      torusAOpacity: 0.65,
      torusBOpacity: 0.50,
      dispScale: 0.16
    },
    microsoft: {
      colorA: 0x0078d4,     // Fluent Blue
      colorB: 0x00bcf2,     // Sky Cyan
      accent: 0x7719aa,     // Fluent Purple
      torusA: 0x0078d4,
      torusB: 0x00bcf2,
      torusAOpacity: 0.65,
      torusBOpacity: 0.45,
      dispScale: 0.16
    },
    apple: {
      colorA: 0x0a84ff,     // Cupertino Blue
      colorB: 0x5e5ce6,     // VisionOS Indigo
      accent: 0xbf5af2,     // VisionOS Violet
      torusA: 0x0a84ff,
      torusB: 0x5e5ce6,
      torusAOpacity: 0.70,
      torusBOpacity: 0.50,
      dispScale: 0.15
    },
    openai: {
      colorA: 0x10a37f,     // ChatGPT Slate Mint
      colorB: 0x00d4aa,     // Emerald Cyan
      accent: 0xa7f3d0,     // Soft Mint
      torusA: 0x10a37f,
      torusB: 0x00d4aa,
      torusAOpacity: 0.65,
      torusBOpacity: 0.50,
      dispScale: 0.17
    },
    amazon: {
      colorA: 0xff9900,     // AWS Amber
      colorB: 0xec7211,     // Flame Orange
      accent: 0x00a4e4,     // Telemetry Cyan
      torusA: 0xff9900,
      torusB: 0xec7211,
      torusAOpacity: 0.70,
      torusBOpacity: 0.50,
      dispScale: 0.19
    },
    anthropic: {
      colorA: 0xd97757,     // Claude Terracotta
      colorB: 0xcc785c,     // Warm Clay
      accent: 0xf5d0c5,     // Editorial Sand
      torusA: 0xd97757,
      torusB: 0xcc785c,
      torusAOpacity: 0.65,
      torusBOpacity: 0.50,
      dispScale: 0.16
    },
    xai: {
      colorA: 0x00d4aa,     // Stark Mint
      colorB: 0x00f0ff,     // Cyber Cyan
      accent: 0xffffff,     // Pure Spark
      torusA: 0x00d4aa,
      torusB: 0x00f0ff,
      torusAOpacity: 0.75,
      torusBOpacity: 0.55,
      dispScale: 0.22
    },
    dracula: {
      colorA: 0xbd93f9,     // Gothic Purple
      colorB: 0xff79c6,     // Neon Pink
      accent: 0x50fa7b,     // Radioactive Green
      torusA: 0xbd93f9,
      torusB: 0xff79c6,
      torusAOpacity: 0.70,
      torusBOpacity: 0.55,
      dispScale: 0.20
    },
    nord: {
      colorA: 0x88c0d0,     // Arctic Frost
      colorB: 0x81a1c1,     // Glacier Blue
      accent: 0x8fbcbb,     // Polar Teal
      torusA: 0x88c0d0,
      torusB: 0x81a1c1,
      torusAOpacity: 0.65,
      torusBOpacity: 0.45,
      dispScale: 0.15
    },
    solana: {
      colorA: 0x14f195,     // Solana Mint
      colorB: 0x9945ff,     // Solana Violet
      accent: 0x00f0ff,     // Liquid Cyan
      torusA: 0x14f195,
      torusB: 0x9945ff,
      torusAOpacity: 0.75,
      torusBOpacity: 0.60,
      dispScale: 0.22
    },
    monokai: {
      colorA: 0xa6e22e,     // Acid Lime
      colorB: 0xfd971f,     // Sublime Orange
      accent: 0x66d9ef,     // Cyan Syntax
      torusA: 0xa6e22e,
      torusB: 0xfd971f,
      torusAOpacity: 0.70,
      torusBOpacity: 0.55,
      dispScale: 0.20
    }
  };

  function initThreeLoadingOrb(containerId) {
    var container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    if (!container || !window.THREE) return null;

    var width = container.clientWidth || 240;
    var height = container.clientHeight || 240;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 5.2;

    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    } catch (e) {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    }
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Root Master Group
    var rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Inner Inertia Group (rotates & tilts with physics)
    var orbGroup = new THREE.Group();
    rootGroup.add(orbGroup);

    // =========================================================================
    // 1. FLUID VERTEX DISPLACEMENT PLASMA CORE SHADER
    // =========================================================================
    var plasmaGeo = new THREE.IcosahedronGeometry(1.24, 32);
    
    var plasmaUniforms = {
      uTime: { value: 0.0 },
      uDisplacement: { value: 0.18 },
      uFrequency: { value: 2.2 },
      uSpeed: { value: 1.4 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uPointerVelocity: { value: 0.0 },
      uInertiaSurge: { value: 0.0 },
      uColorA: { value: new THREE.Color(0x00f0ff) },
      uColorB: { value: new THREE.Color(0x818cf8) },
      uColorAccent: { value: new THREE.Color(0xfbbf24) },
      uOpacity: { value: 0.88 }
    };

    var plasmaMat = new THREE.ShaderMaterial({
      uniforms: plasmaUniforms,
      vertexShader: [
        'uniform float uTime;',
        'uniform float uDisplacement;',
        'uniform float uFrequency;',
        'uniform float uSpeed;',
        'uniform vec2 uPointer;',
        'uniform float uPointerVelocity;',
        'uniform float uInertiaSurge;',
        '',
        'varying vec3 vNormal;',
        'varying vec3 vPosition;',
        'varying vec3 vWorldPosition;',
        'varying float vDisp;',
        'varying vec2 vUv;',
        '',
        '// Multi-harmonic fluid wave synthesis',
        'float calcFluidDisplacement(vec3 pos, float time) {',
        '  vec3 p = pos * uFrequency;',
        '  float d1 = sin(p.x * 1.8 + time * uSpeed) * cos(p.y * 1.6 - time * uSpeed * 0.9) * sin(p.z * 1.9 + time * uSpeed * 1.1);',
        '  float d2 = 0.5 * sin(p.x * 3.7 - time * uSpeed * 1.3) * cos(p.z * 3.4 + time * uSpeed * 1.4);',
        '  float d3 = 0.25 * sin(p.y * 7.2 + time * uSpeed * 1.9) * sin(p.x * 6.8 - time * uSpeed * 1.7);',
        '  return d1 + d2 + d3;',
        '}',
        '',
        'void main() {',
        '  vUv = uv;',
        '  vNormal = normalize(normalMatrix * normal);',
        '  vPosition = position;',
        '',
        '  float rawDisp = calcFluidDisplacement(position, uTime);',
        '  ',
        '  // Screen-space pointer proximity wave ripple',
        '  vec4 worldPos = modelMatrix * vec4(position, 1.0);',
        '  vWorldPosition = worldPos.xyz;',
        '  ',
        '  float pointerDist = length(worldPos.xy - uPointer * 2.2);',
        '  float ripple = sin(pointerDist * 9.0 - uTime * 7.0) * exp(-pointerDist * 1.6) * uPointerVelocity * 0.6;',
        '  ',
        '  float totalDisp = (rawDisp * (1.0 + uInertiaSurge * 1.6) + ripple) * uDisplacement;',
        '  vDisp = totalDisp;',
        '',
        '  vec3 newPosition = position + normal * totalDisp;',
        '  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);',
        '}'
      ].join('\n'),
      fragmentShader: [
        'uniform float uTime;',
        'uniform vec3 uColorA;',
        'uniform vec3 uColorB;',
        'uniform vec3 uColorAccent;',
        'uniform float uOpacity;',
        '',
        'varying vec3 vNormal;',
        'varying vec3 vPosition;',
        'varying vec3 vWorldPosition;',
        'varying float vDisp;',
        'varying vec2 vUv;',
        '',
        'void main() {',
        '  vec3 viewDir = normalize(cameraPosition - vWorldPosition);',
        '  vec3 normal = normalize(vNormal);',
        '',
        '  // Multi-tier Fresnel calculation',
        '  float dotNV = max(dot(viewDir, normal), 0.0);',
        '  float fresnel = pow(1.0 - dotNV, 2.4);',
        '  float rim = pow(1.0 - dotNV, 4.8);',
        '',
        '  // Fluid gradient modulated by vertex displacement',
        '  float mixFactor = clamp((vDisp * 3.0) + 0.5, 0.0, 1.0);',
        '  vec3 baseColor = mix(uColorA, uColorB, mixFactor);',
        '',
        '  // Iridescent chromatic fringe',
        '  float iridPhase = vDisp * 14.0 + uTime * 0.9;',
        '  vec3 spectralIrid = vec3(',
        '    sin(iridPhase) * 0.5 + 0.5,',
        '    sin(iridPhase + 2.094) * 0.5 + 0.5,',
        '    sin(iridPhase + 4.188) * 0.5 + 0.5',
        '  );',
        '',
        '  vec3 color = mix(baseColor, spectralIrid, fresnel * 0.55);',
        '  color += uColorAccent * fresnel * 0.75;',
        '  color += uColorA * rim * 1.35;',
        '',
        '  float alpha = clamp(uOpacity * (0.42 + fresnel * 0.58 + abs(vDisp) * 0.9), 0.0, 1.0);',
        '  gl_FragColor = vec4(color, alpha);',
        '}'
      ].join('\n'),
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });

    var plasmaMesh = new THREE.Mesh(plasmaGeo, plasmaMat);
    orbGroup.add(plasmaMesh);

    // =========================================================================
    // 2. CELESTIAL PARTICLE CLOUD (Points Matrix)
    // =========================================================================
    var particleCount = 850;
    var particleGeo = new THREE.BufferGeometry();
    var positions = new Float32Array(particleCount * 3);
    var colors = new Float32Array(particleCount * 3);
    var particleRadii = new Float32Array(particleCount);
    var particleSpeeds = new Float32Array(particleCount);
    var particleAngles = new Float32Array(particleCount);
    var particleHeights = new Float32Array(particleCount);

    for (var i = 0; i < particleCount; i++) {
      var u = Math.random();
      var v = Math.random();
      var theta = u * 2.0 * Math.PI;
      var phi = Math.acos(2.0 * v - 1.0);
      var r = 1.4 + (Math.random() - 0.5) * 0.35;

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      particleRadii[i] = r;
      particleSpeeds[i] = (0.5 + Math.random() * 0.8) * (Math.random() > 0.5 ? 1 : -1);
      particleAngles[i] = theta;
      particleHeights[i] = positions[i * 3 + 1];
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    var particleMat = new THREE.PointsMaterial({
      size: 0.048,
      vertexColors: true,
      transparent: true,
      opacity: 0.88,
      blending: THREE.AdditiveBlending
    });

    var particles = new THREE.Points(particleGeo, particleMat);
    orbGroup.add(particles);

    // =========================================================================
    // 3. DUAL WIREFRAME CELESTIAL RINGS (Torus Meshes)
    // =========================================================================
    var torusGeo = new THREE.TorusGeometry(1.72, 0.022, 16, 64);
    var torusMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.60
    });
    var torus = new THREE.Mesh(torusGeo, torusMat);
    torus.rotation.x = Math.PI / 3;
    orbGroup.add(torus);

    var goldRingGeo = new THREE.TorusGeometry(1.95, 0.016, 12, 48);
    var goldRingMat = new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      wireframe: true,
      transparent: true,
      opacity: 0.48
    });
    var goldRing = new THREE.Mesh(goldRingGeo, goldRingMat);
    goldRing.rotation.y = Math.PI / 4;
    orbGroup.add(goldRing);

    // =========================================================================
    // 4. POINTER-LINKED INERTIA PHYSICS ENGINE
    // =========================================================================
    var physics = {
      pointerX: 0,
      pointerY: 0,
      targetRotX: 0,
      targetRotY: 0,
      currentRotX: 0,
      currentRotY: 0,
      velX: 0,
      velY: 0,
      tiltX: 0,
      tiltY: 0,
      lastMoveTime: performance.now(),
      pointerVelocity: 0,
      targetVelocity: 0,
      inertiaSurge: 0,
      spring: 0.08,
      damping: 0.91,
      isHovered: false
    };

    function onPointerMove(e) {
      var rect = container.getBoundingClientRect();
      var clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : rect.left + rect.width / 2);
      var clientY = e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0] ? e.touches[0].clientY : rect.top + rect.height / 2);

      var nx = ((clientX - rect.left) / rect.width) * 2 - 1;
      var ny = -(((clientY - rect.top) / rect.height) * 2 - 1);

      var dx = nx - physics.pointerX;
      var dy = ny - physics.pointerY;
      var dt = Math.max((performance.now() - physics.lastMoveTime) / 1000, 0.001);
      physics.lastMoveTime = performance.now();

      var speed = Math.sqrt(dx * dx + dy * dy) / dt;
      physics.targetVelocity = Math.min(speed * 0.15, 2.5);
      physics.inertiaSurge = Math.min(physics.inertiaSurge + speed * 0.08, 2.0);

      physics.pointerX = nx;
      physics.pointerY = ny;
      physics.targetRotY = nx * 1.8;
      physics.targetRotX = -ny * 1.5;
      physics.isHovered = true;

      plasmaUniforms.uPointer.value.set(nx, ny);
    }

    function onPointerLeave() {
      physics.isHovered = false;
      physics.targetRotX = 0;
      physics.targetRotY = 0;
      physics.targetVelocity = 0;
    }

    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerleave', onPointerLeave);
    container.addEventListener('touchmove', onPointerMove, { passive: true });
    container.addEventListener('touchend', onPointerLeave);

    // =========================================================================
    // 5. THEME RECALIBRATION & DYNAMIC LERP SYSTEM
    // =========================================================================
    var currentThemeId = 'dark';
    var targetPal = ORB_THEMES.dark;
    var targetColorA = new THREE.Color(targetPal.colorA);
    var targetColorB = new THREE.Color(targetPal.colorB);
    var targetAccent = new THREE.Color(targetPal.accent);
    var targetTorusA = new THREE.Color(targetPal.torusA);
    var targetTorusB = new THREE.Color(targetPal.torusB);

    function applyTheme(themeId) {
      var t = (themeId || (window.getZothTheme ? window.getZothTheme() : (document.documentElement.getAttribute('data-theme') || 'dark'))).toLowerCase();
      currentThemeId = t;
      var pal = ORB_THEMES[t] || ORB_THEMES.dark;
      targetPal = pal;

      targetColorA.setHex(pal.colorA);
      targetColorB.setHex(pal.colorB);
      targetAccent.setHex(pal.accent);
      targetTorusA.setHex(pal.torusA);
      targetTorusB.setHex(pal.torusB);

      plasmaUniforms.uDisplacement.value = pal.dispScale || 0.18;

      var cA = targetColorA;
      var cB = targetColorB;
      var colArr = particleGeo.attributes.color.array;
      for (var j = 0; j < particleCount; j++) {
        var mixCol = (j % 3 === 0) ? cB : ((j % 5 === 0) ? targetAccent : cA);
        colArr[j * 3] = mixCol.r;
        colArr[j * 3 + 1] = mixCol.g;
        colArr[j * 3 + 2] = mixCol.b;
      }
      particleGeo.attributes.color.needsUpdate = true;
    }

    var onThemeChange = function (e) {
      var theme = (e && e.detail && e.detail.theme) ? e.detail.theme : (window.getZothTheme ? window.getZothTheme() : 'dark');
      applyTheme(theme);
    };
    window.addEventListener('zoth-theme-change', onThemeChange);

    // Apply initial theme immediately
    var initialTheme = window.getZothTheme ? window.getZothTheme() : (document.documentElement.getAttribute('data-theme') || 'dark');
    applyTheme(initialTheme);

    // =========================================================================
    // 6. MAIN ANIMATION & PHYSICS RENDER LOOP (60 FPS)
    // =========================================================================
    var reqId = null;
    var clock = new THREE.Clock();
    var isRunning = true;

    function onVisibilityChange() {
      if (document.hidden) {
        isRunning = false;
      } else {
        isRunning = true;
        if (clock) clock.getDelta();
      }
    }
    document.addEventListener('visibilitychange', onVisibilityChange);

    function animate() {
      reqId = requestAnimationFrame(animate);
      if (!isRunning) return;

      var delta = clock.getDelta();
      var elapsed = clock.getElapsedTime();

      // 1. Update Physics Inertia & Spring Damper
      var forceX = (physics.targetRotX - physics.currentRotX) * physics.spring;
      var forceY = (physics.targetRotY - physics.currentRotY) * physics.spring;

      physics.velX = (physics.velX + forceX) * physics.damping;
      physics.velY = (physics.velY + forceY) * physics.damping;

      physics.currentRotX += physics.velX;
      physics.currentRotY += physics.velY;

      // Pointer velocity & surge decay
      physics.pointerVelocity += (physics.targetVelocity - physics.pointerVelocity) * 0.12;
      physics.inertiaSurge *= 0.94;

      // Base orbital auto-rotation + interactive physics inertia
      rootGroup.rotation.y = elapsed * 0.35 + physics.currentRotY;
      rootGroup.rotation.x = Math.sin(elapsed * 0.4) * 0.18 + physics.currentRotX;
      rootGroup.rotation.z = Math.cos(elapsed * 0.3) * 0.12 + physics.velY * 0.5;

      // Wobble tilt on outer rings
      torus.rotation.z = elapsed * 0.65 + physics.currentRotY * 0.8;
      torus.rotation.x = Math.PI / 3 + Math.sin(elapsed * 0.5) * 0.2 + physics.currentRotX * 0.5;

      goldRing.rotation.x = elapsed * -0.55 + physics.currentRotX * 0.7;
      // 2. Audio-Reactive Pulse & Breathing Modulation
      var audioPulse = 0.0;
      if (typeof window !== 'undefined') {
        if (window.ZothAudioFX && typeof window.ZothAudioFX.getAudioLevel === 'function') {
          audioPulse = window.ZothAudioFX.getAudioLevel();
        } else if (window.zothWorldApp && window.zothWorldApp.audio && typeof window.zothWorldApp.audio.getAudioLevel === 'function') {
          audioPulse = window.zothWorldApp.audio.getAudioLevel();
        }
      }

      // Floating breathing idle oscillation & scale pulse
      var breathing = Math.sin(elapsed * 1.8) * 0.05 + audioPulse * 0.12;
      orbGroup.position.y = breathing;
      var currentScale = 1.0 + breathing * 0.4 + physics.inertiaSurge * 0.08;
      orbGroup.scale.set(currentScale, currentScale, currentScale);

      // 3. Update Fluid Plasma Shader Uniforms
      plasmaUniforms.uTime.value = elapsed;
      plasmaUniforms.uPointerVelocity.value = physics.pointerVelocity;
      plasmaUniforms.uInertiaSurge.value = physics.inertiaSurge + audioPulse * 0.8;
      plasmaUniforms.uFrequency.value = 2.2 + audioPulse * 1.4;

      // Smooth color lerping on shader uniforms & torus rings
      var lerpFactor = Math.min(delta * 4.0, 1.0);
      plasmaUniforms.uColorA.value.lerp(targetColorA, lerpFactor);
      plasmaUniforms.uColorB.value.lerp(targetColorB, lerpFactor);
      plasmaUniforms.uColorAccent.value.lerp(targetAccent, lerpFactor);

      torusMat.color.lerp(targetTorusA, lerpFactor);
      torusMat.opacity += (targetPal.torusAOpacity - torusMat.opacity) * lerpFactor;

      goldRingMat.color.lerp(targetTorusB, lerpFactor);
      goldRingMat.opacity += (targetPal.torusBOpacity - goldRingMat.opacity) * lerpFactor;

      // 4. Dynamic Particle Breathing & Swirl
      var pulse = 1.0 + Math.sin(elapsed * 2.6) * 0.05 + physics.inertiaSurge * 0.08 + audioPulse * 0.18;
      particles.scale.set(pulse, pulse, pulse);

      var pPositions = particleGeo.attributes.position.array;
      for (var k = 0; k < particleCount; k++) {
        var baseAngle = particleAngles[k] + particleSpeeds[k] * delta * (1.0 + physics.inertiaSurge * 2.0 + audioPulse * 1.5);
        particleAngles[k] = baseAngle;
        var rK = particleRadii[k] + Math.sin(elapsed * 3.0 + k) * 0.04 + audioPulse * 0.08;
        pPositions[k * 3] = Math.cos(baseAngle) * rK;
        pPositions[k * 3 + 2] = Math.sin(baseAngle) * rK;
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Render Scene
      renderer.render(scene, camera);
    }

    animate();

    // =========================================================================
    // 7. COMPLETE MEMORY & CONTEXT DISPOSAL LIFECYCLE
    // =========================================================================
    function dispose() {
      if (reqId) {
        cancelAnimationFrame(reqId);
        reqId = null;
      }
      isRunning = false;

      window.removeEventListener('zoth-theme-change', onThemeChange);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerleave', onPointerLeave);
      container.removeEventListener('touchmove', onPointerMove);
      container.removeEventListener('touchend', onPointerLeave);

      if (plasmaGeo) {
        plasmaGeo.dispose();
        plasmaGeo = null;
      }
      if (plasmaMat) {
        plasmaMat.dispose();
        plasmaMat = null;
      }
      if (particleGeo) {
        particleGeo.dispose();
        particleGeo = null;
      }
      if (particleMat) {
        particleMat.dispose();
        particleMat = null;
      }
      if (torusGeo) {
        torusGeo.dispose();
        torusGeo = null;
      }
      if (torusMat) {
        torusMat.dispose();
        torusMat = null;
      }
      if (goldRingGeo) {
        goldRingGeo.dispose();
        goldRingGeo = null;
      }
      if (goldRingMat) {
        goldRingMat.dispose();
        goldRingMat = null;
      }

      if (orbGroup) {
        rootGroup.remove(orbGroup);
        while (orbGroup.children.length > 0) {
          orbGroup.remove(orbGroup.children[0]);
        }
        orbGroup = null;
      }

      if (rootGroup) {
        scene.remove(rootGroup);
        rootGroup = null;
      }

      if (renderer) {
        if (renderer.domElement && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
        renderer.dispose();
        if (renderer.forceContextLoss) {
          renderer.forceContextLoss();
        }
        renderer.domElement = null;
        renderer = null;
      }

      if (container) {
        container.innerHTML = '';
      }
    }

    return {
      applyTheme: applyTheme,
      stop: dispose,
      dispose: dispose
    };
  }

  window.initThreeLoadingOrb = initThreeLoadingOrb;
})(window);
