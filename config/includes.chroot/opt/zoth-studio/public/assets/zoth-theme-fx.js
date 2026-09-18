/**
 * Theme atmosphere: Matrix rain, gold sunlight/dust, light grain, dark motes,
 * plus one distinct overlay per extra navbar theme.
 * applyTheme() in zoth-theme.js dispatches zoth-theme-change → ZothThemeFx.set().
 */
(function () {
  "use strict";
  var root, rainCanvas, dustCanvas, rainTimer, dustTimer, resizeRain, resizeDust, reduceMq;
  var cols, drops, active, particles;
  var GLYPHS = "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴ0123456789ZOTH#$*";

  var DUST_THEMES = {
    gold: 1,
    dark: 1,
    amazon: 1,
    nord: 1,
    monokai: 1,
    ocean: 1,
    ember: 1,
    copper: 1,
    blood: 1,
    nvidia: 1,
    jade: 1,
    gruvbox: 1,
    solarized: 1,
    coral: 1,
    rust: 1,
    groq: 1,
    ayu: 1,
    flexoki: 1
  };

  var PALETTES = {
    gold: ["255, 214, 120", "251, 191, 36", "245, 158, 11"],
    dark: ["0, 240, 255", "168, 85, 247", "52, 211, 153"],
    amazon: ["255, 153, 0", "236, 114, 17", "245, 158, 11"],
    nord: ["136, 192, 208", "216, 222, 233", "236, 239, 244", "129, 161, 193"],
    monokai: ["230, 219, 116", "249, 38, 114", "166, 226, 46", "102, 217, 239", "174, 129, 255"],
    ocean: ["34, 211, 238", "14, 165, 233", "45, 212, 191", "8, 145, 178"],
    ember: ["249, 115, 22", "234, 88, 12", "251, 146, 60", "180, 83, 9"],
    copper: ["217, 119, 6", "180, 83, 9", "245, 158, 11", "120, 113, 108"],
    blood: ["239, 68, 68", "185, 28, 28", "252, 165, 165", "127, 29, 29"],
    nvidia: ["118, 185, 0", "163, 230, 53", "34, 197, 94"],
    jade: ["45, 212, 191", "52, 211, 153", "13, 148, 136"],
    gruvbox: ["250, 189, 47", "254, 128, 25", "184, 187, 38", "235, 219, 178"],
    solarized: ["38, 139, 210", "42, 161, 152", "181, 137, 0", "147, 161, 161"],
    coral: ["255, 107, 74", "234, 88, 12", "253, 186, 116"],
    rust: ["234, 88, 12", "194, 65, 12", "251, 146, 60"],
    groq: ["245, 80, 54", "220, 38, 38", "252, 165, 165"],
    ayu: ["230, 180, 80", "255, 143, 64", "191, 189, 182"],
    flexoki: ["209, 77, 65", "208, 162, 21", "58, 169, 159"]
  };

  function reduced() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function pick(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  function ensure() {
    if (root && document.body && root.parentNode) {
      if (!document.getElementById("zoth-fx-atm")) {
        var extra = document.createElement("div");
        extra.className = "fx-layer";
        extra.id = "zoth-fx-atm";
        root.appendChild(extra);
      }
      rainCanvas = document.getElementById("zoth-fx-matrix");
      dustCanvas = document.getElementById("zoth-fx-dust");
      return root;
    }
    if (!document.body) return null;
    root = document.getElementById("zoth-theme-fx");
    if (!root) {
      root = document.createElement("div");
      root.id = "zoth-theme-fx";
      root.setAttribute("aria-hidden", "true");
      root.innerHTML =
        '<canvas id="zoth-fx-matrix"></canvas>' +
        '<div class="fx-layer" id="zoth-fx-crt"></div>' +
        '<div class="fx-layer" id="zoth-fx-sun"></div>' +
        '<div class="fx-layer" id="zoth-fx-sun-orb"></div>' +
        '<div class="fx-layer" id="zoth-fx-day"></div>' +
        '<div class="fx-layer" id="zoth-fx-void"></div>' +
        '<div class="fx-layer" id="zoth-fx-atm"></div>' +
        '<canvas id="zoth-fx-dust" class="fx-layer"></canvas>';
      document.body.insertBefore(root, document.body.firstChild);
    } else if (!document.getElementById("zoth-fx-atm")) {
      var atm = document.createElement("div");
      atm.className = "fx-layer";
      atm.id = "zoth-fx-atm";
      root.appendChild(atm);
    }
    rainCanvas = document.getElementById("zoth-fx-matrix");
    dustCanvas = document.getElementById("zoth-fx-dust");
    return root;
  }

  function stopRain() {
    if (rainTimer) {
      cancelAnimationFrame(rainTimer);
      rainTimer = 0;
    }
    if (resizeRain) {
      window.removeEventListener("resize", resizeRain);
      resizeRain = null;
    }
    if (rainCanvas) {
      var ctx = rainCanvas.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, rainCanvas.width, rainCanvas.height);
    }
  }

  function startRain() {
    if (!rainCanvas || reduced()) return;
    stopRain();
    var ctx = rainCanvas.getContext("2d");
    resizeRain = function () {
      rainCanvas.width = window.innerWidth;
      rainCanvas.height = window.innerHeight;
      cols = Math.max(10, Math.floor(rainCanvas.width / 18));
      drops = new Array(cols);
      active = new Array(cols);
      for (var i = 0; i < cols; i++) {
        drops[i] = Math.random() * -50;
        var edge = i < cols * 0.28 || i > cols * 0.72;
        active[i] = edge ? Math.random() > 0.22 : Math.random() > 0.62;
      }
    };
    resizeRain();
    window.addEventListener("resize", resizeRain, { passive: true });
    function tick() {
      ctx.clearRect(0, 0, rainCanvas.width, rainCanvas.height);
      ctx.font = "14px 'Share Tech Mono', monospace";
      for (var i = 0; i < cols; i++) {
        if (!active[i]) continue;
        var x = i * 18;
        var head = drops[i] * 16;
        for (var t = 0; t < 12; t++) {
          var y = head - t * 16;
          if (y < 0) break;
          var a = t === 0 ? 1 : Math.max(0.12, 0.7 - t * 0.06);
          ctx.fillStyle = t === 0 ? "rgba(232,255,232," + a + ")" : "rgba(0,255,80," + a + ")";
          ctx.fillText(GLYPHS.charAt((i * 13 + t + ((head / 16) | 0)) % GLYPHS.length), x, y);
        }
        if (head > rainCanvas.height + 180 && Math.random() > 0.96) drops[i] = Math.random() * -20;
        drops[i] += 0.75 + Math.random() * 0.4;
      }
      rainTimer = requestAnimationFrame(tick);
    }
    rainTimer = requestAnimationFrame(tick);
  }

  function stopDust() {
    if (dustTimer) {
      cancelAnimationFrame(dustTimer);
      dustTimer = 0;
    }
    if (resizeDust) {
      window.removeEventListener("resize", resizeDust);
      resizeDust = null;
    }
    if (dustCanvas) {
      var ctx = dustCanvas.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, dustCanvas.width, dustCanvas.height);
    }
    particles = null;
  }

  function spawnDust(kind, w, h) {
    var palette = PALETTES[kind] || PALETTES.dark;
    var n = 36;
    var list = [];
    var i, p;
    if (kind === "gold") n = 48;
    else if (kind === "amazon") n = 26;
    else if (kind === "nord") n = 32;
    else if (kind === "monokai") n = 24;
    else if (kind === "ocean") n = 18;
    else if (kind === "ember" || kind === "copper" || kind === "blood" || kind === "nvidia" || kind === "coral" || kind === "rust" || kind === "groq") n = 16;
    else if (kind === "jade" || kind === "solarized") n = 18;
    else if (kind === "gruvbox" || kind === "ayu" || kind === "flexoki") n = 28;
    else if (kind === "dark") n = 36;

    for (i = 0; i < n; i++) {
      p = {
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.6 + Math.random() * 1.4,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.12,
        a: 0.25 + Math.random() * 0.5,
        da: 0,
        amin: 0.12,
        amax: 0.7,
        fill: pick(palette),
        wrap: "xy"
      };
      if (kind === "gold") {
        p.r = 1.2 + Math.random() * 2.2;
        p.vx = 0.15 + Math.random() * 0.35;
        p.vy = 0.08 + Math.random() * 0.22;
        p.a = 0.28 + Math.random() * 0.5;
      } else if (kind === "amazon") {
        p.r = 0.5 + Math.random() * 1.2;
        p.vx = (Math.random() - 0.5) * 0.12;
        p.vy = 0.18 + Math.random() * 0.28;
        p.a = 0.2 + Math.random() * 0.45;
        p.da = 0.008 + Math.random() * 0.012;
        p.amin = 0.08;
        p.amax = 0.65;
        p.wrap = "y";
      } else if (kind === "nord") {
        p.r = 0.5 + Math.random() * 1.5;
        p.vx = (Math.random() - 0.5) * 0.06;
        p.vy = 0.08 + Math.random() * 0.16;
        p.a = 0.18 + Math.random() * 0.32;
        p.wrap = "y";
      } else if (kind === "monokai") {
        p.r = 0.7 + Math.random() * 1.6;
        p.vx = (Math.random() - 0.5) * 0.28;
        p.vy = (Math.random() - 0.5) * 0.28;
        p.a = 0.22 + Math.random() * 0.4;
      } else if (kind === "ocean") {
        p.r = 1.4 + Math.random() * 2.6;
        p.vx = (Math.random() - 0.5) * 0.05;
        p.vy = -0.035 - Math.random() * 0.07;
        p.a = 0.1 + Math.random() * 0.22;
        p.wrap = "y";
      } else if (kind === "ember" || kind === "copper" || kind === "blood" || kind === "nvidia" || kind === "coral" || kind === "rust" || kind === "groq") {
        p.r = 1.0 + Math.random() * 2.2;
        p.vx = (Math.random() - 0.5) * 0.18;
        p.vy = -0.14 - Math.random() * 0.32;
        p.a = 0.3 + Math.random() * 0.5;
        p.da = 0.012 + Math.random() * 0.02;
        p.amin = 0.1;
        p.amax = 0.85;
        p.wrap = "y";
      } else if (kind === "jade" || kind === "solarized") {
        p.r = 1.4 + Math.random() * 2.6;
        p.vx = (Math.random() - 0.5) * 0.05;
        p.vy = -0.035 - Math.random() * 0.07;
        p.a = 0.1 + Math.random() * 0.22;
        p.wrap = "y";
      } else if (kind === "ayu" || kind === "flexoki") {
        p.r = 1.1 + Math.random() * 2.0;
        p.vx = 0.08 + Math.random() * 0.22;
        p.vy = 0.04 + Math.random() * 0.14;
        p.a = 0.22 + Math.random() * 0.4;
      } else if (kind === "gruvbox") {
        p.r = 1.1 + Math.random() * 2.0;
        p.vx = 0.08 + Math.random() * 0.22;
        p.vy = 0.04 + Math.random() * 0.14;
        p.a = 0.22 + Math.random() * 0.4;
      }
      list.push(p);
    }
    return list;
  }

  function startDust(kind) {
    if (!dustCanvas || reduced()) return;
    stopDust();
    var ctx = dustCanvas.getContext("2d");

    resizeDust = function () {
      dustCanvas.width = window.innerWidth;
      dustCanvas.height = window.innerHeight;
      particles = spawnDust(kind, dustCanvas.width, dustCanvas.height);
    };
    resizeDust();
    window.addEventListener("resize", resizeDust, { passive: true });
    function tick() {
      var w = dustCanvas.width;
      var h = dustCanvas.height;
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (kind === "monokai" && Math.random() > 0.992) {
          p.vx *= -1;
          p.vy *= -1;
        }
        if (p.da) {
          p.a += p.da;
          if (p.a > p.amax || p.a < p.amin) p.da *= -1;
        }
        if (p.wrap === "y") {
          if (p.x > w) p.x = 0;
          if (p.x < 0) p.x = w;
          if (p.vy < 0 && p.y < -8) {
            p.y = h + 8;
            p.x = Math.random() * w;
          } else if (p.vy >= 0 && p.y > h + 8) {
            p.y = -8;
            p.x = Math.random() * w;
          }
        } else {
          if (p.x > w) p.x = 0;
          if (p.x < 0) p.x = w;
          if (p.y > h) p.y = 0;
          if (p.y < 0) p.y = h;
        }
        ctx.beginPath();
        ctx.fillStyle = "rgba(" + p.fill + "," + p.a + ")";
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      dustTimer = requestAnimationFrame(tick);
    }
    dustTimer = requestAnimationFrame(tick);
  }

  function set(themeId) {
    if (!document.body) {
      document.addEventListener("DOMContentLoaded", function () { set(themeId); }, { once: true });
      return;
    }
    ensure();
    stopRain();
    stopDust();
    if (reduced()) return;
    if (themeId === "matrix") startRain();
    else if (DUST_THEMES[themeId]) startDust(themeId);
  }

  function onReduceChange() {
    var themeId = document.documentElement.getAttribute("data-theme") || "dark";
    set(themeId);
  }

  window.ZothThemeFx = { set: set, ensure: ensure };

  window.addEventListener("zoth-theme-change", function (e) {
    if (e && e.detail && e.detail.theme) set(e.detail.theme);
  });

  if (window.matchMedia) {
    reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMq.addEventListener) reduceMq.addEventListener("change", onReduceChange);
    else if (reduceMq.addListener) reduceMq.addListener(onReduceChange);
  }

  function boot() {
    ensure();
    set(document.documentElement.getAttribute("data-theme") || "dark");
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
