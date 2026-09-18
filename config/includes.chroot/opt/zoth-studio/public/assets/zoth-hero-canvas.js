/**
 * ============================================================================
 * ZOTH STUDIO — ALCHEMICAL HERO VOID & SACRED GEOMETRY PROCEDURAL ENGINE (v6.0)
 * ============================================================================
 * Dark Starry Void · Golden Ratio (Φ = 1.6180339887) Fibonacci Spirals ·
 * Concentric Hermetic Rings · Inscribed Sacred Polygons · Aether Particle Dust ·
 * 60 FPS Delta-Normalized Multi-Plane Parallax · Zero Layout Overflow
 * ============================================================================
 */
(function (global) {
  "use strict";

  if (typeof window === "undefined" || typeof document === "undefined") return;

  // Sacred Mathematical & Physical Constants
  var PHI = 1.618033988749895;                      // Golden Ratio Φ
  var GOLDEN_ANGLE = 137.50776405003785 * (Math.PI / 180); // 2.39996323 rad
  var FIB_SPIRAL_B = 0.3063489;                     // b = ln(Φ)/(π/2)
  var DAMPING = 0.94;                               // Fluid velocity damping

  // Hermetic Spectral Palette
  var PALETTE = {
    gold: { r: 251, g: 191, b: 36, hex: "#fbbf24" },      // Solar Gold
    goldLight: { r: 253, g: 230, b: 138, hex: "#fde68a" }, // Radiant Solar Crown
    cyan: { r: 0, g: 240, b: 255, hex: "#00f0ff" },        // Aether Cyan
    cyanLight: { r: 165, g: 243, b: 252, hex: "#a5f3fc" }, // Prism Mist
    emerald: { r: 52, g: 211, b: 153, hex: "#34d399" },    // Emerald Tablet Verde
    indigo: { r: 99, g: 102, b: 241, hex: "#6366f1" },     // Interstellar Violet
    white: { r: 255, g: 255, b: 255, hex: "#ffffff" },
    voidDark: { r: 2, g: 4, b: 8, hex: "#020408" }
  };

  function initHeroCanvas() {
    var skipCanvas = window.matchMedia && (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(max-width: 880px)").matches ||
      window.matchMedia("(pointer: coarse)").matches
    );
    if (skipCanvas) return;

    var heroStage = document.getElementById("hero") || document.querySelector(".hero-stage");
    var heroPanel = document.querySelector(".hero-parallax-stage") || heroStage;
    if (!heroPanel) return;

    // Locate or create canvas element
    var canvas = document.getElementById("hero-alchemical-canvas");
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.id = "hero-alchemical-canvas";
      canvas.className = "hero-alchemical-canvas";
      canvas.setAttribute("aria-hidden", "true");
      canvas.style.position = "absolute";
      canvas.style.top = "0";
      canvas.style.left = "0";
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.style.pointerEvents = "none";
      canvas.style.zIndex = "0";
      canvas.style.borderRadius = "inherit";
      if (heroPanel.firstChild) {
        heroPanel.insertBefore(canvas, heroPanel.firstChild);
      } else {
        heroPanel.appendChild(canvas);
      }
    } else {
      canvas.style.position = "absolute";
      canvas.style.top = "0";
      canvas.style.left = "0";
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.style.pointerEvents = "none";
      canvas.style.zIndex = "0";
      canvas.style.borderRadius = "inherit";
    }

    var ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
    if (!ctx) return;

    var prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var isFinePointer = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    // Dimensions & DPR scaling
    var width = 0;
    var height = 0;
    var dpr = 1;

    function resize() {
      var rect = heroPanel.getBoundingClientRect();
      width = Math.max(280, Math.floor(rect.width || heroPanel.offsetWidth || window.innerWidth));
      height = Math.max(320, Math.floor(rect.height || heroPanel.offsetHeight || window.innerHeight));
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.style.position = "absolute";
      canvas.style.inset = "0";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      recalcGeometryCenter();
    }

    // ── INTERACTIVE PARALLAX & POINTER TRACKING ────────────────────────────
    var targetMouseX = 0;
    var targetMouseY = 0;
    var smoothMouseX = 0;
    var smoothMouseY = 0;
    var lastUserPointerTime = 0;
    var isPointerInside = false;
    var pointerClientX = 0;
    var pointerClientY = 0;

    function onPointerMove(e) {
      var rect = heroPanel.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        isPointerInside = true;
        pointerClientX = e.clientX - rect.left;
        pointerClientY = e.clientY - rect.top;

        targetMouseX = ((pointerClientX / width) * 2 - 1);
        targetMouseY = ((pointerClientY / height) * 2 - 1);
        lastUserPointerTime = performance.now();
      } else {
        isPointerInside = false;
      }
    }

    function onPointerLeave() {
      isPointerInside = false;
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    heroPanel.addEventListener("pointerleave", onPointerLeave, { passive: true });

    // Interactive Click/Tap Sacred Geometry Burst
    function onPointerDown(e) {
      var rect = heroPanel.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        var clickX = e.clientX - rect.left;
        var clickY = e.clientY - rect.top;
        spawnBurst(clickX, clickY, 18);
      }
    }
    heroPanel.addEventListener("pointerdown", onPointerDown, { passive: true });

    // ── STARFIELD SYSTEM (Multi-layer 3D Depth) ────────────────────────────
    var STAR_COUNT = isFinePointer ? 80 : 45; // OPTIMIZED: Reduced star count for performance
    var stars = [];

    function initStars() {
      stars = [];
      for (var i = 0; i < STAR_COUNT; i++) {
        var depth = 0.15 + Math.random() * 0.85; // 0.15 = far, 1.0 = near
        var colorChoice = Math.random();
        var col = PALETTE.white;
        if (colorChoice < 0.28) col = PALETTE.goldLight;
        else if (colorChoice < 0.54) col = PALETTE.cyanLight;
        else if (colorChoice < 0.68) col = PALETTE.emerald;

        stars.push({
          x: Math.random(),
          y: Math.random(),
          z: depth,
          size: (0.6 + depth * 1.6) * (isFinePointer ? 1.0 : 0.85),
          baseAlpha: 0.2 + depth * 0.55,
          twinkleSpeed: 0.6 + Math.random() * 2.4,
          twinklePhase: Math.random() * Math.PI * 2,
          color: col,
          spike: depth > 0.82 && Math.random() > 0.4
        });
      }
    }

    // ── SACRED GEOMETRY CENTER & HARMONICS ─────────────────────────────────
    var geoCenterX = 0;
    var geoCenterY = 0;
    var geoRadius = 180;

    function recalcGeometryCenter() {
      // Align sacred geometry harmonically with right column / watermark on desktop
      if (width > 960) {
        geoCenterX = width * 0.72;
        geoCenterY = height * 0.50;
        geoRadius = Math.min(Math.max(width * 0.24, 180), 320);
      } else {
        // Centered on mobile/tablet
        geoCenterX = width * 0.50;
        geoCenterY = height * 0.48;
        geoRadius = Math.min(Math.max(width * 0.38, 130), 220);
      }
      precalcFibonacci(); // OPTIMIZED: Pre-calculate spiral points on resize
    }

    var cachedSpiralPoints = [];
    var cachedSpiralNodes = []; // for the key step spark nodes

    function precalcFibonacci() {
      cachedSpiralPoints = [];
      cachedSpiralNodes = [];
      var a = geoRadius * 0.045;
      var maxTheta = 3.6 * Math.PI;
      var step = 0.05;

      for (var th = 0.2; th <= maxTheta; th += step) {
        var r = a * Math.exp(FIB_SPIRAL_B * th);
        if (r > geoRadius * 1.15) break;
        cachedSpiralPoints.push({ x: Math.cos(th) * r, y: Math.sin(th) * r });
      }

      for (var fn = 1; fn <= 6; fn++) {
        var nodeTheta = fn * (Math.PI / 2);
        var nodeR = a * Math.exp(FIB_SPIRAL_B * nodeTheta);
        if (nodeR > geoRadius * 1.15) break;
        cachedSpiralNodes.push({
          th: nodeTheta,
          x: Math.cos(nodeTheta) * nodeR,
          y: Math.sin(nodeTheta) * nodeR,
          fn: fn
        });
      }
    }

    // ── FLOATING PARTICLE DUST & BURST SPARK POOL ──────────────────────────
    var DUST_COUNT = isFinePointer ? 45 : 24; // OPTIMIZED: Reduced dust particle count
    var dustParticles = [];

    function initDust() {
      dustParticles = [];
      for (var i = 0; i < DUST_COUNT; i++) {
        dustParticles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: -0.1 - Math.random() * 0.3, // Gentle upward cosmic buoyancy
          size: Math.random() * 2.2 + 0.8,
          alpha: Math.random() * 0.6 + 0.2,
          maxAlpha: Math.random() * 0.6 + 0.3,
          life: Math.random() * 100,
          maxLife: 80 + Math.random() * 120,
          col: Math.random() > 0.5 ? PALETTE.gold : PALETTE.cyan,
          orbitPhase: Math.random() * Math.PI * 2
        });
      }
    }

    // Interactive Click Burst Pool
    var burstSparks = [];
    function spawnBurst(x, y, count) {
      for (var k = 0; k < count; k++) {
        var theta = k * GOLDEN_ANGLE;
        var spd = 1.2 + Math.random() * 3.2;
        burstSparks.push({
          x: x,
          y: y,
          vx: Math.cos(theta) * spd,
          vy: Math.sin(theta) * spd,
          size: Math.random() * 2.5 + 1.2,
          life: 25 + Math.random() * 20,
          maxLife: 45,
          col: k % 2 === 0 ? PALETTE.gold : PALETTE.cyan
        });
      }
    }

    // ── RENDER PASSES ──────────────────────────────────────────────────────

    // 1. Dark Starry Void & Atmospheric Deep-Space Fog
    function drawDeepVoid(timeSec) {
      // Cosmic radial nebula vignette centered around sacred geometry
      var cx = geoCenterX + smoothMouseX * 30;
      var cy = geoCenterY + smoothMouseY * 20;

      var grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, Math.max(width, height) * 0.85);
      grad.addColorStop(0, "rgba(8, 16, 36, 0.45)");
      grad.addColorStop(0.35, "rgba(4, 8, 20, 0.32)");
      grad.addColorStop(0.7, "rgba(2, 4, 10, 0.18)");
      grad.addColorStop(1, "rgba(2, 4, 8, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Subtle cyan/gold ethereal nebula clouds
      var nebAngleA = timeSec * 0.15;
      var nebX1 = cx + Math.cos(nebAngleA) * (geoRadius * 0.5);
      var nebY1 = cy + Math.sin(nebAngleA * 0.8) * (geoRadius * 0.4);
      var nebGrad1 = ctx.createRadialGradient(nebX1, nebY1, 0, nebX1, nebY1, geoRadius * 1.2);
      nebGrad1.addColorStop(0, "rgba(0, 240, 255, 0.055)");
      nebGrad1.addColorStop(0.5, "rgba(0, 240, 255, 0.015)");
      nebGrad1.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = nebGrad1;
      ctx.fillRect(0, 0, width, height);

      var nebAngleB = -timeSec * 0.11 + Math.PI;
      var nebX2 = cx + Math.cos(nebAngleB) * (geoRadius * 0.6);
      var nebY2 = cy + Math.sin(nebAngleB * 0.9) * (geoRadius * 0.45);
      var nebGrad2 = ctx.createRadialGradient(nebX2, nebY2, 0, nebX2, nebY2, geoRadius * 1.3);
      nebGrad2.addColorStop(0, "rgba(251, 191, 36, 0.045)");
      nebGrad2.addColorStop(0.5, "rgba(251, 191, 36, 0.012)");
      nebGrad2.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = nebGrad2;
      ctx.fillRect(0, 0, width, height);
    }

    // 2. Stars Rendering with 3D Parallax & Twinkle
    function drawStars(timeSec) {
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        // Multi-layer parallax shift
        var px = s.x * width + smoothMouseX * (s.z * 24);
        var py = s.y * height + smoothMouseY * (s.z * 18);

        // Screen wrap
        if (px < 0) px += width;
        else if (px > width) px -= width;
        if (py < 0) py += height;
        else if (py > height) py -= height;

        // Twinkle luminance calculation
        var tw = Math.sin(timeSec * s.twinkleSpeed + s.twinklePhase);
        var curAlpha = Math.max(0.08, Math.min(1.0, s.baseAlpha + tw * 0.35));
        var r = s.size * (0.8 + 0.25 * tw);

        ctx.fillStyle = "rgba(" + s.color.r + ", " + s.color.g + ", " + s.color.b + ", " + curAlpha + ")";
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fill();

        // High-depth jewels 4-point cross flare
        if (s.spike && curAlpha > 0.65 && isFinePointer) {
          ctx.strokeStyle = "rgba(" + s.color.r + ", " + s.color.g + ", " + s.color.b + ", " + (curAlpha * 0.45) + ")";
          ctx.lineWidth = 0.6;
          var spikeLen = r * 3.2;
          ctx.beginPath();
          ctx.moveTo(px - spikeLen, py);
          ctx.lineTo(px + spikeLen, py);
          ctx.moveTo(px, py - spikeLen);
          ctx.lineTo(px, py + spikeLen);
          ctx.stroke();
        }
      }
    }

    // 3. Sacred Geometry: Concentric Alchemical Astrolabe Rings & Polygons
    function drawAlchemicalGeometry(timeSec, cx, cy, R) {
      ctx.save();
      ctx.translate(cx, cy);

      // Subtle 3D tilt perspective based on mouse coordinates
      if (isFinePointer) {
        var tiltX = smoothMouseX * 0.08;
        var tiltY = smoothMouseY * 0.06;
        ctx.transform(1, tiltY * 0.5, tiltX * 0.5, 1, 0, 0);
      }

      var rotSlow = timeSec * 0.04;
      var rotCounter = -timeSec * (0.04 / PHI);

      // ── Outer Ring 1: Astrolabe Zodiac & Degree Ticks ──
      ctx.save();
      ctx.rotate(rotSlow);

      // Main Outer Ring
      ctx.strokeStyle = "rgba(0, 240, 255, 0.22)";
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.arc(0, 0, R, 0, Math.PI * 2);
      ctx.stroke();

      // Outer Fine Orbit
      ctx.strokeStyle = "rgba(251, 191, 36, 0.18)";
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.arc(0, 0, R * 1.04, 0, Math.PI * 2);
      ctx.stroke();

      // Astrolabe Degree Ticks (36 divisions)
      ctx.strokeStyle = "rgba(0, 240, 255, 0.32)";
      ctx.lineWidth = 0.8;
      for (var t = 0; t < 36; t++) {
        var ang = (t * Math.PI * 2) / 36;
        var isMajor = t % 3 === 0;
        var tLen = isMajor ? 8 : 4;
        var cosA = Math.cos(ang);
        var sinA = Math.sin(ang);
        ctx.beginPath();
        ctx.moveTo(cosA * (R - tLen), sinA * (R - tLen));
        ctx.lineTo(cosA * R, sinA * R);
        ctx.stroke();

        // Major harmonic orbital node points
        if (isMajor) {
          ctx.fillStyle = t % 6 === 0 ? "rgba(251, 191, 36, 0.6)" : "rgba(0, 240, 255, 0.5)";
          ctx.beginPath();
          ctx.arc(cosA * (R + 6), sinA * (R + 6), 1.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();

      // ── Inscribed Sacred Hexagram (Seal of Solomon / Hermetic Polygons) ──
      ctx.save();
      ctx.rotate(rotCounter);
      var hexR = R * 0.86;

      ctx.strokeStyle = "rgba(251, 191, 36, 0.24)";
      ctx.lineWidth = 0.9;
      // OPTIMIZED: Removed shadowBlur

      // Equilateral Triangle 1 (Pointing Up)
      ctx.beginPath();
      for (var i1 = 0; i1 < 3; i1++) {
        var a1 = (i1 * Math.PI * 2) / 3 - Math.PI / 2;
        var x1 = Math.cos(a1) * hexR;
        var y1 = Math.sin(a1) * hexR;
        if (i1 === 0) ctx.moveTo(x1, y1);
        else ctx.lineTo(x1, y1);
      }
      ctx.closePath();
      ctx.stroke();

      // Equilateral Triangle 2 (Pointing Down)
      ctx.strokeStyle = "rgba(0, 240, 255, 0.22)";
      ctx.beginPath();
      for (var i2 = 0; i2 < 3; i2++) {
        var a2 = (i2 * Math.PI * 2) / 3 + Math.PI / 2;
        var x2 = Math.cos(a2) * hexR;
        var y2 = Math.sin(a2) * hexR;
        if (i2 === 0) ctx.moveTo(x2, y2);
        else ctx.lineTo(x2, y2);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.restore();

      // ── Middle Ring 2: Golden Ratio Octagram Sanctuary ──
      var R2 = R / PHI;
      ctx.save();
      ctx.rotate(rotSlow * PHI);

      ctx.setLineDash([5, 7]);
      ctx.strokeStyle = "rgba(251, 191, 36, 0.3)";
      ctx.lineWidth = 0.9;
      ctx.beginPath();
      ctx.arc(0, 0, R2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Inscribed 8-Pointed Octagram
      ctx.strokeStyle = "rgba(0, 240, 255, 0.26)";
      ctx.lineWidth = 0.75;
      ctx.beginPath();
      for (var o = 0; o < 8; o++) {
        var oAng = (o * Math.PI) / 4;
        var oLen = o % 2 === 0 ? R2 : R2 * 0.42;
        var ox = Math.cos(oAng) * oLen;
        var oy = Math.sin(oAng) * oLen;
        if (o === 0) ctx.moveTo(ox, oy);
        else ctx.lineTo(ox, oy);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.restore();

      // ── Inner Ring 3: Breathing Radiant Core ──
      var R3 = R2 / PHI;
      var pulse = 1.0 + Math.sin(timeSec * 1.8) * 0.04;
      var rPulse = R3 * pulse;

      ctx.save();
      ctx.rotate(rotCounter * PHI);

      ctx.strokeStyle = "rgba(251, 191, 36, 0.4)";
      ctx.lineWidth = 1.2;
      // OPTIMIZED: Removed shadowBlur
      ctx.beginPath();
      ctx.arc(0, 0, rPulse, 0, Math.PI * 2);
      ctx.stroke();

      // Micro Inscribed Square & Center Aether Node
      var sqR = rPulse * 0.707;
      ctx.strokeStyle = "rgba(0, 240, 255, 0.35)";
      ctx.lineWidth = 0.8;
      ctx.strokeRect(-sqR * 0.5, -sqR * 0.5, sqR, sqR);

      // Revolving Satellite Nodes
      for (var sat = 0; sat < 3; sat++) {
        var satAng = (sat * Math.PI * 2) / 3 + timeSec * 0.8;
        var satX = Math.cos(satAng) * rPulse;
        var satY = Math.sin(satAng) * rPulse;
        ctx.fillStyle = sat === 0 ? PALETTE.gold.hex : PALETTE.cyan.hex;
        ctx.beginPath();
        ctx.arc(satX, satY, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }

      // Central Hot Core
      ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
      ctx.beginPath();
      ctx.arc(0, 0, 2.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
      ctx.restore();
    }

    // 4. Fibonacci Logarithmic Spirals (Twin Opposing Sacred Vortex)
    function drawFibonacciSpirals(timeSec, cx, cy, R) {
      ctx.save();
      ctx.translate(cx, cy);

      if (isFinePointer) {
        var tiltX = smoothMouseX * 0.08;
        var tiltY = smoothMouseY * 0.06;
        ctx.transform(1, tiltY * 0.5, tiltX * 0.5, 1, 0, 0);
      }

      var baseRot = timeSec * 0.05;

      // Dual Opposing Spirals (Arm 0 and Arm 1 offset by π)
      for (var arm = 0; arm < 2; arm++) {
        var armAngleOffset = baseRot + arm * Math.PI;

        ctx.save();
        ctx.rotate(armAngleOffset);

        ctx.beginPath();
        if (cachedSpiralPoints.length > 0) {
          ctx.moveTo(cachedSpiralPoints[0].x, cachedSpiralPoints[0].y);
          for (var idx = 1; idx < cachedSpiralPoints.length; idx++) {
            ctx.lineTo(cachedSpiralPoints[idx].x, cachedSpiralPoints[idx].y);
          }
        }

        // Luminous breathing gradient stroke
        var spiralGrad = ctx.createLinearGradient(-R * 0.5, -R * 0.5, R * 0.8, R * 0.8);
        if (arm === 0) {
          spiralGrad.addColorStop(0, "rgba(251, 191, 36, 0.45)");
          spiralGrad.addColorStop(0.5, "rgba(0, 240, 255, 0.32)");
          spiralGrad.addColorStop(1, "rgba(52, 211, 153, 0.08)");
        } else {
          spiralGrad.addColorStop(0, "rgba(0, 240, 255, 0.4)");
          spiralGrad.addColorStop(0.5, "rgba(251, 191, 36, 0.28)");
          spiralGrad.addColorStop(1, "rgba(165, 243, 252, 0.06)");
        }

        ctx.strokeStyle = spiralGrad;
        ctx.lineWidth = arm === 0 ? 1.2 : 0.9;
        ctx.stroke();

        // Fibonacci Key Step Spark Nodes
        for (var n = 0; n < cachedSpiralNodes.length; n++) {
          var node = cachedSpiralNodes[n];
          var nodePulse = Math.sin(timeSec * 2.5 + node.fn) * 0.5 + 0.5;

          ctx.fillStyle = arm === 0 ? "rgba(253, 230, 138, " + (0.4 + nodePulse * 0.5) + ")" : "rgba(165, 243, 252, " + (0.4 + nodePulse * 0.5) + ")";
          ctx.beginPath();
          ctx.arc(node.x, node.y, 1.4 + nodePulse * 0.8, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      ctx.restore();
    }

    // 5. Floating Particle Dust & Mouse Repulsion Vortex
    function drawParticleDust(dt, timeSec) {
      for (var i = 0; i < dustParticles.length; i++) {
        var p = dustParticles[i];

        // Brownian motion & slight horizontal sine turbulence
        p.orbitPhase += 0.02 * dt;
        p.x += (p.vx + Math.sin(p.orbitPhase) * 0.2) * dt;
        p.y += p.vy * dt;

        // Interactive mouse proximity swirl
        if (isPointerInside) {
          var dx = p.x - pointerClientX;
          var dy = p.y - pointerClientY;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120 && dist > 1) {
            var force = (120 - dist) / 120 * 0.8 * dt;
            p.x += (dx / dist) * force * 2.5 - (dy / dist) * force * 1.8;
            p.y += (dy / dist) * force * 2.5 + (dx / dist) * force * 1.8;
          }
        }

        // Particle lifecycle
        p.life += dt;
        if (p.life >= p.maxLife || p.x < -20 || p.x > width + 20 || p.y < -20 || p.y > height + 20) {
          p.x = Math.random() * width;
          p.y = height + 10;
          p.vx = (Math.random() - 0.5) * 0.35;
          p.vy = -0.15 - Math.random() * 0.3;
          p.life = 0;
          p.maxLife = 80 + Math.random() * 120;
        }

        var progress = p.life / p.maxLife;
        var pAlpha = Math.sin(progress * Math.PI) * p.maxAlpha;

        // Parallax offset for dust
        var drawX = p.x + smoothMouseX * 45;
        var drawY = p.y + smoothMouseY * 35;

        var col = p.col;
        ctx.fillStyle = "rgba(" + col.r + ", " + col.g + ", " + col.b + ", " + pAlpha + ")";
        ctx.beginPath();
        ctx.arc(drawX, drawY, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Click Burst Sparks
      for (var b = burstSparks.length - 1; b >= 0; b--) {
        var sp = burstSparks[b];
        sp.x += sp.vx * dt;
        sp.y += sp.vy * dt;
        sp.vx *= Math.pow(DAMPING, dt);
        sp.vy *= Math.pow(DAMPING, dt);
        sp.life -= dt;

        if (sp.life <= 0) {
          burstSparks.splice(b, 1);
          continue;
        }

        var bAlpha = Math.sin((sp.life / sp.maxLife) * Math.PI);
        ctx.fillStyle = "rgba(" + sp.col.r + ", " + sp.col.g + ", " + sp.col.b + ", " + bAlpha + ")";
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.size * (sp.life / sp.maxLife), 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // ── MAIN 60 FPS RENDER LOOP ────────────────────────────────────────────
    var rafId = 0;
    var isRunning = false;
    var lastFrameTime = performance.now();
    var isElementInView = true;
    var documentHidden = false;

    function renderLoop(now) {
      if (documentHidden || !isElementInView) {
        isRunning = false;
        return;
      }

      var dt = Math.min((now - lastFrameTime) / 16.667, 3.0); // 60 FPS delta
      lastFrameTime = now;
      var timeSec = now * 0.001;

      // Smooth mouse interpolation (Lerp)
      if (now - lastUserPointerTime > 1600 || !isFinePointer) {
        // Autonomous graceful Lissajous drift when mouse is idle / mobile
        var autoT = timeSec * 0.35;
        targetMouseX = Math.sin(autoT * 0.7) * 0.32 + Math.sin(autoT * 1.4) * 0.12;
        targetMouseY = Math.cos(autoT * 0.5) * 0.22 + Math.cos(autoT * 1.1) * 0.10;
      }

      smoothMouseX += (targetMouseX - smoothMouseX) * 0.045 * dt;
      smoothMouseY += (targetMouseY - smoothMouseY) * 0.045 * dt;

      // Clear viewport
      ctx.clearRect(0, 0, width, height);

      // Render Multi-Plane Cosmic Layers
      drawDeepVoid(timeSec);
      drawStars(timeSec);

      var curGeoX = geoCenterX + smoothMouseX * 35;
      var curGeoY = geoCenterY + smoothMouseY * 25;

      drawFibonacciSpirals(timeSec, curGeoX, curGeoY, geoRadius);
      drawAlchemicalGeometry(timeSec, curGeoX, curGeoY, geoRadius);
      drawParticleDust(dt, timeSec);

      rafId = requestAnimationFrame(renderLoop);
    }

    function startEngine() {
      if (documentHidden || !isElementInView || prefersReducedMotion) return;
      if (!isRunning) {
        isRunning = true;
        lastFrameTime = performance.now();
        rafId = requestAnimationFrame(renderLoop);
      }
    }

    function stopEngine() {
      isRunning = false;
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    }

    // ── LIFECYCLE & INTERSECTION OBSERVER (0% CPU Idle) ───────────────────
    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            isElementInView = entry.isIntersecting;
            if (isElementInView) {
              startEngine();
            } else {
              stopEngine();
            }
          });
        },
        { rootMargin: "60px 0px 60px 0px", threshold: [0, 0.05] }
      );
      observer.observe(heroPanel);
    }

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        documentHidden = true;
        stopEngine();
      } else {
        documentHidden = false;
        if (isElementInView) startEngine();
      }
    });

    window.addEventListener("resize", function () {
      resize();
      initStars();
      initDust();
    }, { passive: true });

    // Initial setup
    resize();
    initStars();
    initDust();
    startEngine();

    // Export Global API
    global.ZothHeroCanvas = {
      refresh: function () {
        resize();
        initStars();
        initDust();
        startEngine();
      },
      burst: function (x, y, count) {
        spawnBurst(x || geoCenterX, y || geoCenterY, count || 20);
      },
      stop: stopEngine,
      start: startEngine
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHeroCanvas);
  } else {
    initHeroCanvas();
  }

})(typeof window !== "undefined" ? window : this);
