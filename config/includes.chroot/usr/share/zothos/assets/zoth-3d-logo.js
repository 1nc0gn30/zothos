/**
 * ⚡ ZOTH STUDIO — 3D VOLUMETRIC GOLDEN Z LOGO ENGINE (v2.0 Ultra)
 * GPU-Accelerated WebGL Interactive 3D Emblem for Master Navbar & Studio
 * 
 * Features:
 * 1. Dual-Layer PBR Geometry: 24K Alchemical Gold Outer Shell + Internal Pulsing Quantum Core
 * 2. 3-Tier Multi-Axis Astrolabe Gimbal Rings with Orbiting Satellite Photon
 * 3. Restrained & Tasteful Interactivity: Delicate cursor lean, smooth damping, idle breathing drift
 * 4. Reactive Quantum Stardust: Subtle floating embers with vortex dynamics
 * 5. Procedural Studio Reflection Engine: Dynamic HDR key/rim lighting
 * 6. Elastic Spin Impulse on Click: Smooth 360° flip with glass harmonic feedback
 * 7. Viewport-Aware Auto-Sleep: 0% GPU/CPU consumption when off-screen
 */
(function (global) {
  'use strict';

  // ── WebGL Detection ──
  function isWebGLAvailable() {
    try {
      var canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }

  // ── Three.js Loader with Multi-Source & CDN Fallback ──
  // Single-flight guard: each Zoth3DLogo instance used to call loadThree()
  // independently, so two instances injected three.min.js TWICE. That logs
  // "Multiple instances of Three.js being imported" and breaks THREE.*
  // instanceof checks. Queue every caller behind one shared injection.
  var threePending = null;

  function loadThree(callback) {
    if (global.THREE) {
      callback(global.THREE);
      return;
    }

    if (threePending) {
      threePending.push(callback);
      return;
    }

    threePending = [callback];
    var pending = threePending;

    var candidateUrls = [
      '/assets/vendor/three.min.js',
      './vendor/three.min.js',
      '../assets/vendor/three.min.js',
      './assets/vendor/three.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'
    ];

    var idx = 0;

    function flush() {
      if (threePending === pending) {
        threePending = null;
      }
      for (var i = 0; i < pending.length; i++) {
        try {
          pending[i](global.THREE);
        } catch (e) {
          console.warn('[Zoth3DLogo] Three.js ready callback failed:', e);
        }
      }
      pending.length = 0;
    }

    function giveUp() {
      if (threePending === pending) {
        threePending = null;
      }
      console.warn('[Zoth3DLogo] Could not load Three.js; keeping 2D fallback.');
    }

    function tryNext() {
      if (global.THREE) {
        flush();
        return;
      }
      if (idx >= candidateUrls.length) {
        giveUp();
        return;
      }
      var url = candidateUrls[idx++];
      var script = document.createElement('script');
      script.src = url;
      script.onload = function () {
        if (global.THREE) {
          flush();
        } else {
          tryNext();
        }
      };
      script.onerror = function () {
        tryNext();
      };
      document.head.appendChild(script);
    }

    tryNext();
  }

  // ── Particle Texture Generator ──
  function createParticleTexture() {
    var canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    var ctx = canvas.getContext('2d');
    var grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.3, 'rgba(251, 191, 36, 0.9)');
    grad.addColorStop(0.6, 'rgba(0, 240, 255, 0.4)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    return canvas;
  }

  // ── Procedural Environment Reflection Generator ──
  function createStudioEnvironment(THREE) {
    var canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    var ctx = canvas.getContext('2d');

    var bg = ctx.createLinearGradient(0, 0, 256, 256);
    bg.addColorStop(0, '#1e1b18');
    bg.addColorStop(0.5, '#05070e');
    bg.addColorStop(1, '#020305');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 256, 256);

    // Warm Gold Key (Top-Right)
    var goldGlint = ctx.createRadialGradient(200, 50, 0, 200, 50, 110);
    goldGlint.addColorStop(0, 'rgba(255, 245, 200, 1)');
    goldGlint.addColorStop(0.4, 'rgba(251, 191, 36, 0.7)');
    goldGlint.addColorStop(1, 'rgba(251, 191, 36, 0)');
    ctx.fillStyle = goldGlint;
    ctx.beginPath();
    ctx.arc(200, 50, 110, 0, Math.PI * 2);
    ctx.fill();

    // Electric Cyan Rim (Bottom-Left)
    var cyanGlint = ctx.createRadialGradient(50, 200, 0, 50, 200, 90);
    cyanGlint.addColorStop(0, 'rgba(0, 240, 255, 0.9)');
    cyanGlint.addColorStop(0.5, 'rgba(56, 189, 248, 0.4)');
    cyanGlint.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = cyanGlint;
    ctx.beginPath();
    ctx.arc(50, 200, 90, 0, Math.PI * 2);
    ctx.fill();

    var tex = new THREE.CanvasTexture(canvas);
    tex.mapping = THREE.EquirectangularReflectionMapping;
    return tex;
  }

  // ── Procedural Web Audio Resonator ──
  var audioCtx = null;
  function playAudioFeedback(type) {
    try {
      if (localStorage.getItem("zoth_ui_sound") === "false") return;
      var AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      if (!audioCtx) audioCtx = new AudioContextClass();
      if (audioCtx.state === "suspended") audioCtx.resume();

      var now = audioCtx.currentTime;
      var osc = audioCtx.createOscillator();
      var gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'hover') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(1400, now + 0.06);
        gain.gain.setValueAtTime(0.012, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
        osc.start(now);
        osc.stop(now + 0.06);
      } else if (type === 'spin' || type === 'click') {
        var freqs = [1046.5, 1318.5, 1567.98];
        freqs.forEach(function (f, i) {
          var o = audioCtx.createOscillator();
          var g = audioCtx.createGain();
          o.type = 'sine';
          o.frequency.setValueAtTime(f, now);
          o.connect(g);
          g.connect(audioCtx.destination);
          g.gain.setValueAtTime(0.03 / (i + 1), now);
          g.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
          o.start(now);
          o.stop(now + 0.28);
        });
      }
    } catch (e) {}
  }

  // ── Zoth Golden Z Geometry Vector Definition ──
  function createZothShape(THREE, scaleMod) {
    var shape = new THREE.Shape();
    var scale = (scaleMod || 1) * 0.085;

    shape.moveTo(-18 * scale, 22 * scale);
    shape.lineTo(20 * scale, 22 * scale);
    shape.quadraticCurveTo(24 * scale, 22 * scale, 23 * scale, 18 * scale);
    shape.lineTo(-10 * scale, -14 * scale);
    shape.lineTo(20 * scale, -14 * scale);
    shape.quadraticCurveTo(24 * scale, -14 * scale, 24 * scale, -18 * scale);
    shape.quadraticCurveTo(24 * scale, -22 * scale, 20 * scale, -22 * scale);
    shape.lineTo(-20 * scale, -22 * scale);
    shape.quadraticCurveTo(-24 * scale, -22 * scale, -23 * scale, -18 * scale);
    shape.lineTo(10 * scale, 14 * scale);
    shape.lineTo(-18 * scale, 14 * scale);
    shape.quadraticCurveTo(-22 * scale, 14 * scale, -22 * scale, 18 * scale);
    shape.quadraticCurveTo(-22 * scale, 22 * scale, -18 * scale, 22 * scale);

    return shape;
  }

  // ── Material Presets ──
  var MATERIAL_PRESETS = {
    gold: {
      name: "24K Hermetic Gold",
      color: 0xfbbf24,
      emissive: 0x3d1a00,
      metalness: 0.96,
      roughness: 0.14,
      coreColor: 0x00f0ff,
      ring1Color: 0xfde047,
      ring2Color: 0x00f0ff,
      particleColor: 0xfbbf24,
      lightKey: 0xfff7cc,
      lightRim: 0x00f0ff
    },
    obsidian: {
      name: "Obsidian Cyber Onyx",
      color: 0x111827,
      emissive: 0x002030,
      metalness: 0.98,
      roughness: 0.08,
      coreColor: 0x00f0ff,
      ring1Color: 0x38bdf8,
      ring2Color: 0x818cf8,
      particleColor: 0x38bdf8,
      lightKey: 0x67e8f9,
      lightRim: 0xa855f7
    },
    matrix: {
      name: "Matrix Phosphor CRT",
      color: 0x003b00,
      emissive: 0x002200,
      metalness: 0.85,
      roughness: 0.22,
      coreColor: 0x00ff41,
      ring1Color: 0x00ff41,
      ring2Color: 0x34d399,
      particleColor: 0x00ff41,
      lightKey: 0x86efac,
      lightRim: 0x00ff41
    },
    prism: {
      name: "Solar Platinum & Prism",
      color: 0xf8fafc,
      emissive: 0x1e293b,
      metalness: 0.92,
      roughness: 0.12,
      coreColor: 0xa855f7,
      ring1Color: 0xf43f5e,
      ring2Color: 0x06b6d4,
      particleColor: 0xffffff,
      lightKey: 0xffffff,
      lightRim: 0x38bdf8
    },
    damascus: {
      name: "Damascus Cyber Steel",
      color: 0x475569,
      emissive: 0x0f172a,
      metalness: 0.95,
      roughness: 0.28,
      coreColor: 0xf59e0b,
      ring1Color: 0x94a3b8,
      ring2Color: 0xf59e0b,
      particleColor: 0xfde68a,
      lightKey: 0xe2e8f0,
      lightRim: 0xf59e0b
    },
    claude: {
      name: "Terracotta Alchemical Ceramic",
      color: 0xd97757,
      emissive: 0x2b1005,
      metalness: 0.75,
      roughness: 0.25,
      coreColor: 0xfbbf24,
      ring1Color: 0xd97757,
      ring2Color: 0xfbbf24,
      particleColor: 0xf97316,
      lightKey: 0xffedd5,
      lightRim: 0xfbbf24
    }
  };

  // ── Zoth 3D Logo Instance Class ──
  function Zoth3DLogoInstance(container, options) {
    this.container = container;
    this.options = options || {};
    this.size = this.options.size || 34;
    this.isNavbar = !!this.options.isNavbar;
    this.particleCount = this.options.particles !== undefined ? this.options.particles : (this.isNavbar ? 36 : 180);
    this.enableAstrolabe = this.options.astrolabe !== undefined ? this.options.astrolabe : true;
    this.interactiveSound = this.options.sound !== undefined ? this.options.sound : !this.isNavbar;
    this.materialKey = this.options.material || 'gold';

    this.mouseX = 0;
    this.mouseY = 0;
    this.targetRotX = 0;
    this.targetRotY = 0;
    this.currentRotX = 0;
    this.currentRotY = 0;
    this.isHovered = false;
    this.isSleeping = false;
    this.time = Math.random() * 100;

    // Kinematic parameters
    this.explodeFactor = 0;
    this.targetExplode = 0;
    this.spinVelocity = 0;
    this.supernovaTime = 0;
    this.wireframeMode = false;

    this.init();
  }

  Zoth3DLogoInstance.prototype.init = function () {
    var self = this;
    loadThree(function (THREE) {
      self.THREE = THREE;
      self.setupScene();
      self.setupParticles();
      self.bindEvents();
      self.animate();
    });
  };

  Zoth3DLogoInstance.prototype.setupScene = function () {
    var THREE = this.THREE;
    var w = this.size;
    var h = this.size;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(36, w / h, 0.1, 100);
    this.camera.position.set(0, 0, this.isNavbar ? 7.6 : 8.5);

    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
      preserveDrawingBuffer: true
    });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping || THREE.NoToneMapping;
    this.renderer.toneMappingExposure = 1.15;

    this.canvas = this.renderer.domElement;
    this.canvas.className = 'zoth-3d-logo-canvas';
    this.canvas.style.width = w + 'px';
    this.canvas.style.height = h + 'px';
    this.canvas.style.display = 'block';
    this.canvas.style.position = 'relative';
    this.canvas.style.zIndex = '2';
    this.canvas.style.cursor = 'pointer';

    // Group Hierarchy
    this.rootGroup = new THREE.Group();
    this.scene.add(this.rootGroup);

    this.zGroup = new THREE.Group();
    this.astrolabeGroup = new THREE.Group();
    this.rootGroup.add(this.zGroup);
    this.rootGroup.add(this.astrolabeGroup);

    // Reflection Map
    this.envMap = createStudioEnvironment(THREE);
    this.scene.environment = this.envMap;

    // ── 1. Outer 24K Alchemical Gold Armor ──
    var outerShape = createZothShape(THREE, 1.0);
    var extrudeSettings = {
      steps: 2,
      depth: 0.68,
      bevelEnabled: true,
      bevelThickness: 0.22,
      bevelSize: 0.18,
      bevelOffset: 0,
      bevelSegments: 4
    };
    var outerGeom = new THREE.ExtrudeGeometry(outerShape, extrudeSettings);
    outerGeom.center();

    var matConfig = MATERIAL_PRESETS[this.materialKey] || MATERIAL_PRESETS.gold;

    this.goldMaterial = new THREE.MeshStandardMaterial({
      color: matConfig.color,
      emissive: matConfig.emissive,
      metalness: matConfig.metalness,
      roughness: matConfig.roughness,
      envMap: this.envMap,
      envMapIntensity: 1.6
    });

    this.zMesh = new THREE.Mesh(outerGeom, this.goldMaterial);
    this.zGroup.add(this.zMesh);

    // ── 2. Internal Quantum Wireframe Core ──
    var innerShape = createZothShape(THREE, 0.88);
    var innerExtrude = {
      steps: 1,
      depth: 0.44,
      bevelEnabled: true,
      bevelThickness: 0.10,
      bevelSize: 0.10,
      bevelSegments: 2
    };
    var innerGeom = new THREE.ExtrudeGeometry(innerShape, innerExtrude);
    innerGeom.center();

    this.coreMaterial = new THREE.MeshStandardMaterial({
      color: matConfig.coreColor,
      emissive: matConfig.coreColor,
      emissiveIntensity: 0.85,
      wireframe: true,
      transparent: true,
      opacity: 0.75
    });

    this.coreMesh = new THREE.Mesh(innerGeom, this.coreMaterial);
    this.zGroup.add(this.coreMesh);

    // ── 3. Multi-Axis Astrolabe Gimbal Rings ──
    if (this.enableAstrolabe) {
      // Tier 1: Outer Celestial Ring
      var ring1Geom = new THREE.TorusGeometry(3.0, 0.042, 10, 48);
      this.ring1Material = new THREE.MeshStandardMaterial({
        color: matConfig.ring1Color,
        emissive: matConfig.ring1Color,
        emissiveIntensity: 0.4,
        metalness: 0.9,
        roughness: 0.2
      });
      this.ring1 = new THREE.Mesh(ring1Geom, this.ring1Material);
      this.ring1.rotation.x = Math.PI / 3;
      this.astrolabeGroup.add(this.ring1);

      // Tier 2: Middle Cyan Flux Ring
      var ring2Geom = new THREE.TorusGeometry(2.4, 0.032, 8, 36);
      this.ring2Material = new THREE.MeshStandardMaterial({
        color: matConfig.ring2Color,
        emissive: matConfig.ring2Color,
        emissiveIntensity: 0.5,
        metalness: 0.8,
        roughness: 0.15
      });
      this.ring2 = new THREE.Mesh(ring2Geom, this.ring2Material);
      this.ring2.rotation.y = Math.PI / 3.8;
      this.astrolabeGroup.add(this.ring2);

      // Cardinal Anchor Nodes
      this.nodesGroup = new THREE.Group();
      var nodeGeom = new THREE.SphereGeometry(0.12, 12, 12);
      var goldNodeMat = new THREE.MeshBasicMaterial({ color: 0xfff7cc });
      var cyanNodeMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });

      this.nodeTop = new THREE.Mesh(nodeGeom, goldNodeMat);
      this.nodeTop.position.set(0, 3.0, 0);
      this.nodeBottom = new THREE.Mesh(nodeGeom, goldNodeMat);
      this.nodeBottom.position.set(0, -3.0, 0);
      this.nodeLeft = new THREE.Mesh(nodeGeom, cyanNodeMat);
      this.nodeLeft.position.set(-3.0, 0, 0);
      this.nodeRight = new THREE.Mesh(nodeGeom, cyanNodeMat);
      this.nodeRight.position.set(3.0, 0, 0);

      this.nodesGroup.add(this.nodeTop, this.nodeBottom, this.nodeLeft, this.nodeRight);
      this.astrolabeGroup.add(this.nodesGroup);

      // Satellite Drone
      var satGeom = new THREE.SphereGeometry(0.14, 12, 12);
      var satMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      this.satellite = new THREE.Mesh(satGeom, satMat);
      this.astrolabeGroup.add(this.satellite);
    }

    // ── 4. Cinematic Studio Lighting ──
    var ambient = new THREE.AmbientLight(0x1e293b, 1.8);
    this.scene.add(ambient);

    this.keyLight = new THREE.DirectionalLight(matConfig.lightKey, 3.6);
    this.keyLight.position.set(6, 8, 10);
    this.scene.add(this.keyLight);

    this.rimLight = new THREE.PointLight(matConfig.lightRim, 2.8, 18);
    this.rimLight.position.set(-7, -4, 5);
    this.scene.add(this.rimLight);

    var fillLight = new THREE.PointLight(0xf59e0b, 2.0, 16);
    fillLight.position.set(4, -5, 3);
    this.scene.add(fillLight);

    // Hide fallback image and insert 3D canvas
    var fallbackImg = this.container.querySelector('img');
    if (fallbackImg) fallbackImg.style.display = 'none';
    this.container.appendChild(this.canvas);
  };

  // ── 5. Setup Quantum Particle Vortex ──
  Zoth3DLogoInstance.prototype.setupParticles = function () {
    var THREE = this.THREE;
    if (this.particleCount <= 0) return;

    var particleGeom = new THREE.BufferGeometry();
    var posArray = new Float32Array(this.particleCount * 3);
    var colorArray = new Float32Array(this.particleCount * 3);

    var c1 = new THREE.Color(0xfbbf24);
    var c2 = new THREE.Color(0x00f0ff);
    var c3 = new THREE.Color(0xffffff);

    for (var i = 0; i < this.particleCount; i++) {
      var theta = Math.random() * Math.PI * 2;
      var phi = Math.acos((Math.random() * 2) - 1);
      var r = 1.6 + Math.random() * 2.2;

      posArray[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      posArray[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      posArray[i * 3 + 2] = r * Math.cos(phi);

      var pick = Math.random();
      var c = pick < 0.5 ? c1 : (pick < 0.85 ? c2 : c3);
      colorArray[i * 3] = c.r;
      colorArray[i * 3 + 1] = c.g;
      colorArray[i * 3 + 2] = c.b;
    }

    particleGeom.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particleGeom.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    var pTex = new THREE.CanvasTexture(createParticleTexture());
    var particleMat = new THREE.PointsMaterial({
      size: this.isNavbar ? 0.16 : 0.22,
      map: pTex,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.particleSystem = new THREE.Points(particleGeom, particleMat);
    this.rootGroup.add(this.particleSystem);
  };

  // ── 6. Restrained, Tactile & Smooth Interaction ──
  Zoth3DLogoInstance.prototype.bindEvents = function () {
    var self = this;
    var targetArea = this.container.closest('.brand') || this.container;

    targetArea.addEventListener('mouseenter', function () {
      self.isHovered = true;
      if (self.interactiveSound) playAudioFeedback('hover');
    });

    targetArea.addEventListener('mouseleave', function () {
      self.isHovered = false;
      self.targetRotX = 0;
      self.targetRotY = 0;
    });

    targetArea.addEventListener('click', function (e) {
      self.triggerImpulse();
    });

    window.addEventListener('mousemove', function (e) {
      if (!self.isHovered && !self.options.trackGlobalMouse) return;
      var rect = self.container.getBoundingClientRect();
      var cx = rect.left + rect.width / 2;
      var cy = rect.top + rect.height / 2;
      var dx = (e.clientX - cx) / (window.innerWidth / 2);
      var dy = (e.clientY - cy) / (window.innerHeight / 2);

      // Subtle, restrained angular lean (max ~14 degrees)
      var sens = self.isNavbar ? 0.35 : 0.9;
      self.targetRotY = dx * sens;
      self.targetRotX = dy * (sens * 0.7);
    }, { passive: true });

    // Auto-sleep when scrolled off screen
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          self.isSleeping = !entry.isIntersecting;
        });
      }, { threshold: 0.05 });
      this.observer.observe(this.container);
    }

    document.addEventListener('visibilitychange', function () {
      self.isSleeping = document.hidden;
    });

    // Theme Change Observer
    window.addEventListener('zoth-theme-change', function (e) {
      if (e.detail && e.detail.themeId) {
        self.adaptToTheme(e.detail.themeId);
      }
    });
  };

  // ── 7. Elastic Spin Impulse ──
  Zoth3DLogoInstance.prototype.triggerImpulse = function () {
    this.spinVelocity = Math.PI * 2.8;
    this.supernovaTime = 1.0;
    if (this.keyLight) this.keyLight.intensity = 7.0;
    playAudioFeedback('spin');
  };

  // ── 8. Material & Theme Swapping ──
  Zoth3DLogoInstance.prototype.setMaterial = function (matKey) {
    if (!MATERIAL_PRESETS[matKey]) return;
    this.materialKey = matKey;
    var cfg = MATERIAL_PRESETS[matKey];

    if (this.goldMaterial) {
      this.goldMaterial.color.setHex(cfg.color);
      this.goldMaterial.emissive.setHex(cfg.emissive);
      this.goldMaterial.metalness = cfg.metalness;
      this.goldMaterial.roughness = cfg.roughness;
    }
    if (this.coreMaterial) {
      this.coreMaterial.color.setHex(cfg.coreColor);
      this.coreMaterial.emissive.setHex(cfg.coreColor);
    }
    if (this.ring1Material) {
      this.ring1Material.color.setHex(cfg.ring1Color);
      this.ring1Material.emissive.setHex(cfg.ring1Color);
    }
    if (this.ring2Material) {
      this.ring2Material.color.setHex(cfg.ring2Color);
      this.ring2Material.emissive.setHex(cfg.ring2Color);
    }
    if (this.keyLight) this.keyLight.color.setHex(cfg.lightKey);
    if (this.rimLight) this.rimLight.color.setHex(cfg.lightRim);
  };

  Zoth3DLogoInstance.prototype.adaptToTheme = function (themeId) {
    if (themeId === 'matrix') {
      this.setMaterial('matrix');
    } else if (themeId === 'light' || themeId === 'apple' || themeId === 'google') {
      this.setMaterial('prism');
    } else if (themeId === 'gold') {
      this.setMaterial('gold');
    } else if (themeId === 'anthropic') {
      this.setMaterial('claude');
    } else {
      this.setMaterial('gold');
    }
  };

  Zoth3DLogoInstance.prototype.setExplode = function (val) {
    this.targetExplode = Math.max(0, Math.min(1, val));
  };

  Zoth3DLogoInstance.prototype.toggleWireframe = function () {
    this.wireframeMode = !this.wireframeMode;
    if (this.goldMaterial) this.goldMaterial.wireframe = this.wireframeMode;
    return this.wireframeMode;
  };

  Zoth3DLogoInstance.prototype.capturePNG = function (width, height) {
    width = width || 1920;
    height = height || 1920;

    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.render(this.scene, this.camera);
    var dataUrl = this.canvas.toDataURL('image/png');

    this.renderer.setSize(this.size, this.size, false);
    this.camera.aspect = 1;
    this.camera.updateProjectionMatrix();

    return dataUrl;
  };

  // ── 9. Simulation & Render Loop ──
  Zoth3DLogoInstance.prototype.animate = function () {
    var self = this;

    function render() {
      requestAnimationFrame(render);

      if (self.isSleeping) return;

      self.time += 0.02;

      // Restrained, Damped Inertia
      self.currentRotX += (self.targetRotX - self.currentRotX) * 0.08;
      self.currentRotY += (self.targetRotY - self.currentRotY) * 0.08;

      // Explode Kinematics
      self.explodeFactor += (self.targetExplode - self.explodeFactor) * 0.1;
      if (self.zMesh && self.coreMesh) {
        self.zMesh.position.z = self.explodeFactor * 1.8;
        self.coreMesh.position.z = -self.explodeFactor * 1.8;
      }
      if (self.astrolabeGroup) {
        self.astrolabeGroup.scale.setScalar(1.0 + self.explodeFactor * 0.5);
      }

      // Spin Impulse Damping
      if (self.spinVelocity > 0.001) {
        self.rootGroup.rotation.y += self.spinVelocity;
        self.spinVelocity *= 0.92;
      }
      if (self.supernovaTime > 0) {
        self.supernovaTime -= 0.03;
        if (self.keyLight) self.keyLight.intensity = 3.6 + (self.supernovaTime * 3.4);
      }

      // Restrained Idle Floating & Breathing
      var floatOffset = Math.sin(self.time * 1.2) * (self.isNavbar ? 0.06 : 0.14);
      var idleRotY = Math.sin(self.time * 0.6) * (self.isNavbar ? 0.10 : 0.22);
      var idleRotX = Math.cos(self.time * 0.75) * (self.isNavbar ? 0.06 : 0.12);

      self.rootGroup.position.y = floatOffset;
      self.rootGroup.rotation.x = idleRotX + self.currentRotX;
      self.rootGroup.rotation.y += (idleRotY + self.currentRotY - self.rootGroup.rotation.y) * 0.1;

      // Astrolabe Gimbal Rings (Slow, Elegant Precession)
      if (self.ring1) self.ring1.rotation.z += (self.isHovered ? 0.03 : 0.012);
      if (self.ring2) self.ring2.rotation.z -= (self.isHovered ? 0.025 : 0.010);
      if (self.nodesGroup) self.nodesGroup.rotation.z += (self.isHovered ? 0.02 : 0.008);

      // Satellite Drone Orbit
      if (self.satellite) {
        var st = self.time * 1.5;
        self.satellite.position.x = Math.sin(st) * 3.1;
        self.satellite.position.y = Math.cos(st * 0.7) * 2.2;
        self.satellite.position.z = Math.sin(st * 1.3) * 2.6;
      }

      // Internal Core Pulse Luminescence
      if (self.coreMaterial) {
        self.coreMaterial.emissiveIntensity = 0.6 + Math.sin(self.time * 3.0) * 0.3;
      }

      // Particle Vortex Simulation
      if (self.particleSystem) {
        var positions = self.particleSystem.geometry.attributes.position.array;
        var pCount = self.particleCount;
        var speedMul = self.isHovered ? 1.8 : 1.0;

        for (var i = 0; i < pCount; i++) {
          var px = positions[i * 3];
          var py = positions[i * 3 + 1];
          var pz = positions[i * 3 + 2];

          var angle = (0.010 + (i % 4) * 0.003) * speedMul;
          var cosA = Math.cos(angle);
          var sinA = Math.sin(angle);

          positions[i * 3] = px * cosA - pz * sinA;
          positions[i * 3 + 2] = px * sinA + pz * cosA;
          positions[i * 3 + 1] = py + Math.sin(self.time + i) * 0.006;
        }
        self.particleSystem.geometry.attributes.position.needsUpdate = true;
      }

      self.renderer.render(self.scene, self.camera);
    }

    render();
  };

  // ── Auto-Mount 3D Logo Across Navbar & Footer ──
  var activeLogoInstances = [];

  function initNavbar3DLogo() {
    if (!isWebGLAvailable()) return;

    var curTheme = (window.getZothTheme && window.getZothTheme()) || (document.documentElement.getAttribute("data-theme") || "dark");
    var wraps = document.querySelectorAll('.brand-emblem-wrap, .foot-brand-emblem-wrap, .footer-brand-emblem-wrap');
    wraps.forEach(function (wrap) {
      if (wrap.dataset.threeMounted) return;
      wrap.dataset.threeMounted = "true";
      var isFoot = wrap.classList.contains('foot-brand-emblem-wrap') || wrap.classList.contains('footer-brand-emblem-wrap') || !!wrap.closest('footer');
      var instance = new Zoth3DLogoInstance(wrap, { size: isFoot ? 36 : 34, isNavbar: true });
      instance.adaptToTheme(curTheme);
      activeLogoInstances.push(instance);
    });
  }

  // Theme Sync across all 3D logo emblems
  window.addEventListener('zoth-theme-change', function (e) {
    if (e && e.detail && e.detail.theme) {
      activeLogoInstances.forEach(function (inst) {
        if (inst && typeof inst.adaptToTheme === 'function') {
          inst.adaptToTheme(e.detail.theme);
        }
      });
    }
  });

  // Re-scan when DOM or Navigation updates
  if (typeof MutationObserver !== 'undefined') {
    var observer = new MutationObserver(function () {
      initNavbar3DLogo();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  // ── Global Export ──
  global.Zoth3DLogo = {
    create: function (container, options) {
      var inst = new Zoth3DLogoInstance(container, options);
      activeLogoInstances.push(inst);
      return inst;
    },
    materials: MATERIAL_PRESETS,
    initNavbar: initNavbar3DLogo,
    instances: activeLogoInstances
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavbar3DLogo);
  } else {
    initNavbar3DLogo();
  }
  window.addEventListener('load', initNavbar3DLogo);
})(typeof window !== 'undefined' ? window : this);
