/**
 * Zoth Studio — pointer / touch trail.
 * Smooth head lerp + spatially resampled ribbon. Touch width stays capped.
 */
(function (global) {
  "use strict";
  if (typeof window === "undefined" || typeof document === "undefined") return;

  var reduceMq = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reduceMq && reduceMq.matches) return;

  if (global.__ZOTH_CELESTIAL_TRAIL_ACTIVE__) {
    if (global.CelestialTrail && typeof global.CelestialTrail.refresh === "function") {
      global.CelestialTrail.refresh();
    }
    return;
  }
  global.__ZOTH_CELESTIAL_TRAIL_ACTIVE__ = true;

  var fineMq = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)");
  var isFine = !!(fineMq && fineMq.matches);

  var PALETTES = {
    dark:   [{ r: 0, g: 240, b: 255 }, { r: 251, g: 191, b: 36 }, { r: 168, g: 85, b: 247 }],
    gold:   [{ r: 255, g: 215, b: 0 }, { r: 251, g: 191, b: 36 }, { r: 255, g: 251, b: 235 }],
    matrix: [{ r: 0, g: 255, b: 65 }, { r: 134, g: 239, b: 172 }, { r: 240, g: 253, b: 244 }],
    light:  [{ r: 99, g: 91, b: 255 }, { r: 2, g: 132, b: 199 }, { r: 15, g: 23, b: 42 }]
  };

  var themeId = (document.documentElement.getAttribute("data-theme") || "dark").toLowerCase();
  var palette = PALETTES[themeId] || PALETTES.dark;
  var isLight = themeId === "light";

  var dpr = isFine ? Math.min(window.devicePixelRatio || 1, 2) : 1;
  var MAX_POINTS = isFine ? 48 : 18;
  var SPACING = isFine ? 3.2 : 7.5;
  var HEAD_LAMBDA = isFine ? 28 : 18;
  var CORE_MAX = isFine ? 7.5 : 4.2;
  var GLOW_MAX = isFine ? 22 : 9;
  var VEL_CAP = isFine ? 34 : 14;
  var SPARK_MAX = isFine ? 64 : 18;

  var canvas = document.getElementById("celestial-cursor-canvas");
  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.id = "celestial-cursor-canvas";
    canvas.setAttribute("aria-hidden", "true");
    document.body.appendChild(canvas);
  }

  var style = document.getElementById("celestial-trail-css");
  if (!style) {
    style = document.createElement("style");
    style.id = "celestial-trail-css";
    style.textContent =
      "#celestial-cursor-canvas{position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:99990;contain:strict;mix-blend-mode:screen;mix-blend-mode:plus-lighter}" +
      "html[data-theme='light'] #celestial-cursor-canvas{mix-blend-mode:multiply;opacity:.72}" +
      "@media (pointer:coarse){#celestial-cursor-canvas{mix-blend-mode:screen;opacity:.85}}" +
      "@media (prefers-reduced-motion:reduce){#celestial-cursor-canvas{display:none!important}}";
    document.head.appendChild(style);
  }

  var ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
  var width = 1;
  var height = 1;

  function resize() {
    width = Math.max(1, window.innerWidth);
    height = Math.max(1, window.innerHeight);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener("resize", resize, { passive: true });
  resize();

  var rawX = -200;
  var rawY = -200;
  var headX = -200;
  var headY = -200;
  var vel = 0;
  var points = [];
  var lastSampleX = -9999;
  var lastSampleY = -9999;
  var lastMove = 0;
  var tracking = false;
  var touchDown = false;
  var running = false;
  var rafId = 0;
  var hidden = false;
  var lastT = performance.now();
  var hueShift = 0;

  function Spark() {
    this.on = false;
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.life = 0;
    this.max = 1;
    this.size = 2;
    this.ci = 0;
  }
  Spark.prototype.kick = function (x, y, vx, vy, life, size, ci) {
    this.on = true;
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.life = life;
    this.max = life;
    this.size = size;
    this.ci = ci;
  };
  var sparks = [];
  for (var si = 0; si < SPARK_MAX; si++) sparks.push(new Spark());
  function grabSpark() {
    for (var i = 0; i < sparks.length; i++) if (!sparks[i].on) return sparks[i];
    return null;
  }

  function Ripple() {
    this.on = false;
    this.x = 0;
    this.y = 0;
    this.r = 0;
    this.maxR = 40;
    this.life = 0;
    this.max = 1;
    this.ci = 0;
  }
  Ripple.prototype.kick = function (x, y, maxR, ci) {
    this.on = true;
    this.x = x;
    this.y = y;
    this.r = 2;
    this.maxR = maxR;
    this.life = 22;
    this.max = 22;
    this.ci = ci;
  };
  var ripples = [];
  for (var ri = 0; ri < (isFine ? 6 : 3); ri++) ripples.push(new Ripple());
  function grabRipple() {
    for (var i = 0; i < ripples.length; i++) if (!ripples[i].on) return ripples[i];
    return null;
  }

  function burst(x, y, n) {
    n = isFine ? n : Math.min(n, 8);
    var rip = grabRipple();
    if (rip) rip.kick(x, y, isFine ? 56 : 28, 0);
    for (var k = 0; k < n; k++) {
      var s = grabSpark();
      if (!s) break;
      var a = (k / n) * Math.PI * 2 + Math.random() * 0.4;
      var sp = (isFine ? 2.4 : 1.4) * (0.6 + Math.random());
      s.kick(x, y, Math.cos(a) * sp, Math.sin(a) * sp, 14 + Math.random() * 12, 1.4 + Math.random() * 2.2, k % palette.length);
    }
  }

  function sample(x, y, now) {
    var dx = x - lastSampleX;
    var dy = y - lastSampleY;
    var d = Math.hypot(dx, dy);
    if (d < SPACING && points.length) return;
    lastSampleX = x;
    lastSampleY = y;
    points.unshift({ x: x, y: y, t: now });
    if (points.length > MAX_POINTS) points.length = MAX_POINTS;
  }

  function onPointer(e, down) {
    if (e.pointerType === "touch" && e.isPrimary === false) return;
    if (e.pointerType === "touch") {
      tracking = e.buttons > 0 || down || touchDown;
      if (!tracking && !down) return;
    } else {
      tracking = true;
    }
    var moved = Math.hypot(e.clientX - rawX, e.clientY - rawY);
    rawX = e.clientX;
    rawY = e.clientY;
    if (down || moved > 0.45) lastMove = performance.now();
    if (down) {
      headX = rawX;
      headY = rawY;
      burst(rawX, rawY, isFine ? 16 : 7);
    }
    wake();
  }

  window.addEventListener("pointerdown", function (e) {
    if (e.pointerType === "touch") touchDown = true;
    onPointer(e, true);
  }, { passive: true });
  window.addEventListener("pointerup", function (e) {
    if (e.pointerType === "touch") touchDown = false;
    tracking = e.pointerType !== "touch";
  }, { passive: true });
  window.addEventListener("pointercancel", function () {
    touchDown = false;
    tracking = false;
  }, { passive: true });
  window.addEventListener("pointerleave", function () {
    tracking = false;
  }, { passive: true });

  var moveType = "onpointerrawupdate" in window ? "pointerrawupdate" : "pointermove";
  window.addEventListener(moveType, function (e) {
    onPointer(e, false);
  }, { passive: true });

  document.addEventListener("visibilitychange", function () {
    hidden = document.hidden;
    if (hidden) {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      ctx.clearRect(0, 0, width, height);
    } else if (points.length) wake();
  });

  function applyTheme(id) {
    themeId = String(id || "dark").toLowerCase();
    palette = PALETTES[themeId] || PALETTES.dark;
    isLight = themeId === "light";
  }
  window.addEventListener("zoth-theme-change", function (e) {
    if (e && e.detail && e.detail.theme) applyTheme(e.detail.theme);
    else applyTheme(document.documentElement.getAttribute("data-theme"));
    if (points[0]) burst(points[0].x, points[0].y, 10);
  });
  try {
    new MutationObserver(function () {
      applyTheme(document.documentElement.getAttribute("data-theme"));
    }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  } catch (err) {}

  if (reduceMq && reduceMq.addEventListener) {
    reduceMq.addEventListener("change", function (ev) {
      if (ev.matches) {
        hidden = true;
        canvas.style.display = "none";
        running = false;
        if (rafId) cancelAnimationFrame(rafId);
      }
    });
  }

  function wake() {
    if (hidden || running) return;
    running = true;
    lastT = performance.now();
    rafId = requestAnimationFrame(tick);
  }

  function lerpHead(dt) {
    var k = 1 - Math.exp(-HEAD_LAMBDA * dt);
    var ox = headX;
    var oy = headY;
    headX += (rawX - headX) * k;
    headY += (rawY - headY) * k;
    var v = Math.hypot(headX - ox, headY - oy) / Math.max(dt, 0.001);
    vel = Math.min(VEL_CAP, vel * 0.82 + v * 0.045);
  }

  function fadeTail(now) {
    if (touchDown) return;
    var idle = now - lastMove;
    var drops = idle > 70 ? 1 : 0;
    if (idle > 140) drops = 2;
    if (idle > 220) drops = 4;
    while (drops-- && points.length) points.pop();
  }

  function normals() {
    var n = points.length;
    var out = new Array(n);
    for (var i = 0; i < n; i++) {
      var a = points[Math.min(n - 1, i + 1)];
      var b = points[Math.max(0, i - 1)];
      var dx = b.x - a.x;
      var dy = b.y - a.y;
      var len = Math.hypot(dx, dy) || 1;
      out[i] = { x: -dy / len, y: dx / len };
    }
    return out;
  }

  function fillRibbon(maxW, alpha, col) {
    var n = points.length;
    if (n < 2) return;
    var ns = normals();
    ctx.beginPath();
    for (var i = 0; i < n; i++) {
      var p = 1 - i / (n - 1);
      var w = Math.max(0.4, maxW * p * p);
      var x = points[i].x + ns[i].x * w;
      var y = points[i].y + ns[i].y * w;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    for (var j = n - 1; j >= 0; j--) {
      var q = 1 - j / (n - 1);
      var w2 = Math.max(0.4, maxW * q * q);
      ctx.lineTo(points[j].x - ns[j].x * w2, points[j].y - ns[j].y * w2);
    }
    ctx.closePath();
    ctx.fillStyle = "rgba(" + col.r + "," + col.g + "," + col.b + "," + alpha + ")";
    ctx.fill();
  }

  function drawHead() {
    var c0 = palette[0];
    var c1 = palette[1] || c0;
    var r = isFine ? 11 : 7;
    var g = ctx.createRadialGradient(headX, headY, 0, headX, headY, r * 3.2);
    g.addColorStop(0, "rgba(255,255,255," + (isLight ? 0.7 : 0.95) + ")");
    g.addColorStop(0.18, "rgba(" + c1.r + "," + c1.g + "," + c1.b + ",0.85)");
    g.addColorStop(0.45, "rgba(" + c0.r + "," + c0.g + "," + c0.b + ",0.35)");
    g.addColorStop(1, "rgba(" + c0.r + "," + c0.g + "," + c0.b + ",0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(headX, headY, r * 3.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = isLight ? "rgba(15,23,42,0.9)" : "rgba(255,255,255,0.95)";
    ctx.beginPath();
    ctx.arc(headX, headY, isFine ? 2.2 : 1.6, 0, Math.PI * 2);
    ctx.fill();
  }

  function tick(now) {
    if (hidden) {
      running = false;
      return;
    }
    var dt = Math.min((now - lastT) / 1000, 0.045);
    lastT = now;

    lerpHead(dt);
    sample(headX, headY, now);
    fadeTail(now);
    hueShift = (hueShift + dt * 0.7) % 1;

    if (isFine && tracking && Math.random() < 0.22) {
      var sp = grabSpark();
      if (sp) {
        var a = Math.random() * Math.PI * 2;
        sp.kick(headX, headY, Math.cos(a) * 0.6, Math.sin(a) * 0.6 - 0.2, 10 + Math.random() * 10, 1.1 + Math.random(), 0);
      }
    }

    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = isLight ? "source-over" : "lighter";

    var glowW = Math.min(GLOW_MAX, GLOW_MAX * 0.55 + vel * 0.28);
    var coreW = Math.min(CORE_MAX, CORE_MAX * 0.45 + vel * 0.12);
    var c0 = palette[0];
    var c1 = palette[1] || c0;

    if (points.length > 1) {
      fillRibbon(glowW, isLight ? 0.16 : 0.22, c0);
      fillRibbon(glowW * 0.62, isLight ? 0.18 : 0.28, c1);
      fillRibbon(coreW, isLight ? 0.7 : 0.55, { r: 255, g: 255, b: 255 });
    }

    var liveR = 0;
    for (var r = 0; r < ripples.length; r++) {
      var rip = ripples[r];
      if (!rip.on) continue;
      var rp = 1 - rip.life / rip.max;
      rip.r = rip.maxR * (1 - Math.pow(1 - rp, 3));
      rip.life -= dt * 60;
      if (rip.life <= 0) {
        rip.on = false;
        continue;
      }
      liveR++;
      var ra = Math.sin((rip.life / rip.max) * Math.PI) * 0.55;
      var rc = palette[rip.ci % palette.length];
      ctx.strokeStyle = "rgba(" + rc.r + "," + rc.g + "," + rc.b + "," + ra + ")";
      ctx.lineWidth = isFine ? 1.6 : 1.1;
      ctx.beginPath();
      ctx.arc(rip.x, rip.y, rip.r, 0, Math.PI * 2);
      ctx.stroke();
    }

    var liveS = 0;
    for (var s = 0; s < sparks.length; s++) {
      var spark = sparks[s];
      if (!spark.on) continue;
      spark.x += spark.vx;
      spark.y += spark.vy;
      spark.vx *= 0.94;
      spark.vy *= 0.94;
      spark.life -= dt * 60;
      if (spark.life <= 0) {
        spark.on = false;
        continue;
      }
      liveS++;
      var p = spark.life / spark.max;
      var sc = palette[spark.ci % palette.length];
      ctx.globalAlpha = Math.sin(p * Math.PI) * (isLight ? 0.55 : 0.85);
      ctx.fillStyle = "rgb(" + sc.r + "," + sc.g + "," + sc.b + ")";
      ctx.beginPath();
      ctx.arc(spark.x, spark.y, spark.size * (0.4 + 0.6 * p), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    if (tracking || points.length > 2) drawHead();

    if (points.length || liveS || liveR || tracking) {
      rafId = requestAnimationFrame(tick);
    } else {
      running = false;
      ctx.clearRect(0, 0, width, height);
    }
  }

  global.HermeticCelestialTrail = {
    burst: function (x, y, count) {
      burst(x || headX, y || headY, count || 14);
      wake();
    },
    ripple: function (x, y, radius) {
      var rip = grabRipple();
      if (rip) rip.kick(x || headX, y || headY, radius || 64, 0);
      wake();
    },
    setTheme: applyTheme,
    refresh: function () {
      resize();
    },
    pause: function () {
      hidden = true;
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      ctx.clearRect(0, 0, width, height);
    },
    resume: function () {
      hidden = false;
      wake();
    },
    destroy: function () {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
      if (style && style.parentNode) style.parentNode.removeChild(style);
      delete global.__ZOTH_CELESTIAL_TRAIL_ACTIVE__;
      delete global.HermeticCelestialTrail;
      delete global.CelestialTrail;
    }
  };
  global.CelestialTrail = global.HermeticCelestialTrail;
  global.ZothMouseTrail = global.HermeticCelestialTrail;
})(typeof window !== "undefined" ? window : this);
