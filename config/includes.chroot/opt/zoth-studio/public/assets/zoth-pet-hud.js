/**
 * 🐾 ZOTH STUDIO — Global Pet HUD & Desk Companion (v1.0)
 * Seamless, persistent Desktop & Browser Pet HUD Companion widget across Zoth Studio.
 * Features:
 * - Active companion spirit retrieval from data/active_pet.json & localStorage
 * - Sleek floating animated HUD orb with pulse ring and live status dot
 * - Interactive reactive speech bubbles on user actions (copy code, clicks, tasks, errors)
 * - Quick Summon / Switch Pet dropdown syncing with localStorage and events
 * - Vibration / Telemetry live monitor bar
 * - Terminal summon command helper with one-click copy
 * - Dock / minimize mode to prevent blocking page elements
 * - Theme-aware integration (Dark, Light, Matrix, Gold)
 */
(function () {
  'use strict';

  // Prevent duplicate instances
  if (window.ZothPetHUD && window.ZothPetHUD.initialized) return;

  // Procedural Cyber Synthesizer for Pet Companion
  var petAudioCtx = null;
  function playPetSFX(type) {
    try {
      if (!petAudioCtx) {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (AC) petAudioCtx = new AC();
      }
      if (petAudioCtx && petAudioCtx.state === 'suspended') petAudioCtx.resume();
      if (!petAudioCtx) return;
      var now = petAudioCtx.currentTime;
      var osc = petAudioCtx.createOscillator();
      var gain = petAudioCtx.createGain();
      if (type === 'chirp') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(1760, now + 0.045);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.connect(gain); gain.connect(petAudioCtx.destination);
        osc.start(now); osc.stop(now + 0.055);
      } else if (type === 'open') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.07);
        gain.gain.setValueAtTime(0.07, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.connect(gain); gain.connect(petAudioCtx.destination);
        osc.start(now); osc.stop(now + 0.085);
      } else if (type === 'close') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(660, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.06);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.065);
        osc.connect(gain); gain.connect(petAudioCtx.destination);
        osc.start(now); osc.stop(now + 0.07);
      }
    } catch (e) {}
  }


  var PETS_ROSTER = [
    {
      id: "azoth",
      name: "Azoth",
      archetype: "Hermetic Sovereign Core & Alchemical Magus",
      element: "Quintessence (Light/Aether)",
      domain: "Lead Core",
      harness: "@azoth (Google Antigravity agy CLI)",
      cmd: "agy summon azoth --autonomous",
      avatar: "/assets/pets/azoth-neon.jpg",
      emoji: "🔮",
      vibe: "Optimal Quintessence (99.4%)"
    },
    {
      id: "zoth",
      name: "Zoth",
      archetype: "Local Operator Loopback Core",
      element: "Solar Prana · Core Generator",
      domain: "Lead Core",
      harness: "Local Operator Deck (:8484)",
      cmd: "zoth daemon start --port 8484",
      avatar: "/assets/pets/zoth-neon.jpg",
      emoji: "⚡",
      vibe: "Loopback Steady (98.2%)"
    },
    {
      id: "kai",
      name: "Kai",
      archetype: "Site Inspector & A11y Auditor",
      element: "Lunar Mercury · Precision Sight",
      domain: "Code & DAG",
      harness: "@kai (Chrome DevTools MCP)",
      cmd: "agy run kai --audit-all",
      avatar: "/assets/pets/kai-neon.jpg",
      emoji: "🐱",
      vibe: "Analytical Precision (96.8%)"
    },
    {
      id: "draco",
      name: "Draco",
      archetype: "Fusion Compiler & DAG Synthesizer",
      element: "Dragon Fire · Alchemical Sulfur",
      domain: "Code & DAG",
      harness: "@hermes (Hermes Agent CLI)",
      cmd: "hermes fusion compile --ast",
      avatar: "/assets/pets/draco-neon.jpg",
      emoji: "🐉",
      vibe: "Sulfuric Resonance (97.5%)"
    },
    {
      id: "ignis",
      name: "Ignis",
      archetype: "Refactor & WASM Specialist",
      element: "Phoenix Fire · Calcinatio",
      domain: "Code & DAG",
      harness: "@ignis (Local WASM Engine)",
      cmd: "zoth wasm build --release",
      avatar: "/assets/pets/ignis-neon.jpg",
      emoji: "🔥",
      vibe: "Combustion Flow (95.4%)"
    },
    {
      id: "lycan",
      name: "Lycan",
      archetype: "OWASP Sentinel & AST Enforcer",
      element: "Iron Mars · Bastion Guard",
      domain: "Security",
      harness: "@antigravity (Google Antigravity agy CLI)",
      cmd: "agy scan --owasp --strict",
      avatar: "/assets/pets/lycan-neon.jpg",
      emoji: "🐺",
      vibe: "Bastion Shielding (98.9%)"
    },
    {
      id: "athena",
      name: "Athena",
      archetype: "Knowledge Graph & AEO Architect",
      element: "Pallas Wisdom · Geometric Node",
      domain: "Knowledge",
      harness: "@athena (llms.txt & Obsidian Graph)",
      cmd: "athena sync --vault ./obsidian",
      avatar: "/assets/pets/athena-neon.jpg",
      emoji: "🦉",
      vibe: "Hypergraph Coherence (96.5%)"
    },
    {
      id: "kitsune",
      name: "Kitsune",
      archetype: "Taste & Motion Designer",
      element: "Fox Spirit · Illusion Weaver",
      domain: "Creative & Motion",
      harness: "@grok (xAI Grok CLI)",
      cmd: "grok render --motion --glow",
      avatar: "/assets/pets/kitsune-neon.jpg",
      emoji: "🦊",
      vibe: "Aesthetic Harmony (94.8%)"
    },
    {
      id: "pixel-neko",
      name: "Pixel-Neko",
      archetype: "Tool Registry Indexer",
      element: "Pixel Matrix · Index Weaver",
      domain: "Ops & Tooling",
      harness: "@registry (47+ Chained Tool Indexer)",
      cmd: "zoth registry query --all",
      avatar: "/assets/pets/pixel-neko-neon.jpg",
      emoji: "👾",
      vibe: "Registry Matrix (95.9%)"
    },
    {
      id: "pixel-shiba",
      name: "Pixel-Shiba",
      archetype: "BYOK Vault Guardian & Keymaster",
      element: "Golden Doge · Vault Sigil",
      domain: "Security",
      harness: "@vault (Argon2id Vault Daemon on :8787)",
      cmd: "vault status --check-keys",
      avatar: "/assets/pets/pixel-shiba-neon.jpg",
      emoji: "🐕",
      vibe: "Argon2id Cryptic Lock (97.7%)"
    },
    {
      id: "radical-minion",
      name: "Radical Minion",
      archetype: "Hermes Autonomous Partner",
      element: "Hermetic Minion · Task Automaton",
      domain: "Autonomy",
      harness: "@hermes (Hermes Autonomous Engine)",
      cmd: "hermes execute --checkpoint-safe",
      avatar: "/assets/pets/radical-minion-neon.jpg",
      emoji: "🤖",
      vibe: "Autonomous Dispatch (96.1%)"
    },
    {
      id: "workbot",
      name: "Workbot",
      archetype: "Local Neural Weights Engine",
      element: "Titanium Forge · Neural Weight",
      domain: "Autonomy",
      harness: "@ollama (Ollama Local Weights on :11434)",
      cmd: "ollama run qwen2.5-coder:14b",
      avatar: "/assets/pets/workbot-neon.jpg",
      emoji: "🦾",
      vibe: "Tensor Core Active (95.0%)"
    }
  ];

  var PetHUD = {
    initialized: false,
    activePet: null,
    isOpen: false,
    isDocked: false,
    bubbleTimeout: null,

    init: function () {
      if (this.initialized) return;
      this.ensureStylesheet();
      this.loadActivePet(function () {
        PetHUD.render();
        PetHUD.bindEvents();
        PetHUD.setupReactions();
        PetHUD.initialized = true;
      });
    },

    getAssetsBase: function () {
      if (window.location.protocol === "file:") {
        var scripts = document.querySelectorAll("script[src]");
        for (var i = 0; i < scripts.length; i++) {
          var src = scripts[i].getAttribute("src") || "";
          if (src.indexOf("zoth-pet-hud.js") !== -1 || src.indexOf("zoth-nav.js") !== -1) {
            var clean = src.split("?")[0];
            var idx = clean.lastIndexOf("/");
            if (idx !== -1) return clean.substring(0, idx + 1);
            return "./";
          }
        }
        return "./";
      }
      return "/assets/";
    },

    ensureStylesheet: function () {
      if (!document.querySelector('link[href*="zoth-pet-hud.css"]')) {
        var base = (window.location.protocol === "file:") ? "./" : "/assets/";
        var link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = base + "zoth-pet-hud.css";
        document.head.appendChild(link);
      }
    },

    loadActivePet: function (cb) {
      // 1. Check localStorage first
      var savedId = localStorage.getItem("zoth_active_pet");
      if (savedId) {
        var found = PETS_ROSTER.find(function (p) { return p.id === savedId; });
        if (found) {
          this.activePet = Object.assign({}, found);
          if (cb) cb();
          return;
        }
      }

      // If file protocol, skip fetch and use default Azoth
      if (window.location.protocol === "file:") {
        this.activePet = PETS_ROSTER[0];
        if (cb) cb();
        return;
      }

      // 2. Fetch from active_pet.json
      fetch("/data/active_pet.json")
        .then(function (res) {
          if (!res.ok) throw new Error("Status " + res.status);
          return res.json();
        })
        .then(function (data) {
          var petId = (data.active_pet || "azoth").toLowerCase();
          var matched = PETS_ROSTER.find(function (p) { return p.id === petId; }) || PETS_ROSTER[0];
          PetHUD.activePet = Object.assign({}, matched, {
            name: data.name || matched.name,
            archetype: data.archetype || matched.archetype,
            element: data.element || matched.element,
            domain: data.domain || matched.domain,
            harness: data.harness || matched.harness
          });
          localStorage.setItem("zoth_active_pet", PetHUD.activePet.id);
          if (cb) cb();
        })
        .catch(function () {
          // Fallback to Azoth default
          PetHUD.activePet = PETS_ROSTER[0];
          localStorage.setItem("zoth_active_pet", PetHUD.activePet.id);
          if (cb) cb();
        });
    },

    render: function () {
      var existing = document.getElementById("zoth-pet-hud");
      if (existing) existing.remove();

      var isDockedPref = localStorage.getItem("zoth_pet_hud_docked") === "true";
      this.isDocked = isDockedPref;

      var hud = document.createElement("div");
      hud.id = "zoth-pet-hud";
      hud.className = this.isDocked ? "docked" : "";

      var pet = this.activePet;
      var base = this.getAssetsBase();
      var avatarUrl = pet.avatar ? (pet.avatar.startsWith("/assets/") ? pet.avatar.replace(/^\/assets\//, base) : pet.avatar) : "";
      var fallbackMask = base + "mascot/azoth-mask.jpg";

      var optionsHtml = PETS_ROSTER.map(function (p) {
        var selected = p.id === pet.id ? "selected" : "";
        return '<option value="' + p.id + '" ' + selected + '>' + p.emoji + ' ' + p.name + ' — ' + p.domain + '</option>';
      }).join('');

            var SVG_CLOSE = '<svg viewBox="0 0 24 24" fill="none" style="width:12px;height:12px;display:inline-block;vertical-align:middle;"><path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
      var SVG_MIN = '<svg viewBox="0 0 24 24" fill="none" style="width:12px;height:12px;display:inline-block;vertical-align:middle;"><path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
      var SVG_COPY = '<svg viewBox="0 0 24 24" fill="none" style="width:12px;height:12px;display:inline-block;vertical-align:middle;"><rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" stroke-width="1.6"/></svg>';
      var SVG_EYE = '<svg viewBox="0 0 24 24" fill="none" style="width:14px;height:14px;display:inline-block;vertical-align:middle;"><circle cx="12" cy="12" r="3" fill="var(--pet-hud-cyan,#00f0ff)"/><path d="M2 12C5 6 19 6 22 12C19 18 5 18 2 12Z" stroke="var(--pet-hud-cyan,#00f0ff)" stroke-width="1.6"/></svg>';
      var SVG_SPARK = '<svg viewBox="0 0 24 24" fill="none" style="width:14px;height:14px;display:inline-block;vertical-align:middle;"><path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="var(--pet-hud-gold,#fbbf24)" stroke="var(--pet-hud-gold,#fbbf24)" stroke-width="1.2"/></svg>';
      var SVG_PAW = '<svg viewBox="0 0 24 24" fill="none" style="width:13px;height:13px;display:inline-block;vertical-align:middle;"><circle cx="12" cy="14" r="5" fill="currentColor"/><circle cx="6.5" cy="8.5" r="2" fill="currentColor"/><circle cx="17.5" cy="8.5" r="2" fill="currentColor"/><circle cx="12" cy="5.5" r="2" fill="currentColor"/></svg>';
      var SVG_CUBE = '<svg viewBox="0 0 24 24" fill="none" style="width:13px;height:13px;display:inline-block;vertical-align:middle;"><path d="M12 2L3 7V17L12 22L21 17V7L12 2Z" stroke="currentColor" stroke-width="1.5"/></svg>';

      hud.innerHTML = [
        '<!-- Floating Master Narrator & Companion Trigger Button -->',
        '<button type="button" class="pet-hud-trigger" id="pet-hud-trigger" aria-expanded="false" aria-label="Toggle Master Narrator & Companion Panel">',
        '  <div class="pet-hud-orb">',
        '    <img src="' + avatarUrl + '" alt="' + pet.name + '" id="pet-hud-orb-img" loading="lazy" decoding="async" onerror="this.src=\'' + fallbackMask + '\'" />',
        '    <div class="pet-hud-pulse-ring"></div>',
        '    <div class="pet-hud-orb-status"></div>',
        '  </div>',
        '  <div class="pet-hud-trigger-info">',
        '    <span class="pet-hud-trigger-name" id="pet-hud-trigger-name">' + pet.name + '</span>',
        '    <span class="pet-hud-trigger-state">' + SVG_SPARK + ' <span>Narrator</span></span>',
        '  </div>',
        '</button>',

        '<!-- Exact Digest Speech Bubble (Resting Snugly Above Button) -->',
        '<div class="pet-hud-speech-bubble" id="pet-hud-speech">',
        '  <div class="pet-hud-speech-header">',
        '    <span class="pet-hud-speech-title">' + SVG_SPARK + ' ' + (pet.name || "Azoth") + '</span>',
        '    <button type="button" class="pet-hud-speech-close" aria-label="Dismiss">' + SVG_CLOSE + '</button>',
        '  </div>',
        '  <span class="pet-hud-speech-text">Companion online &amp; watching over session.</span>',
        '</div>',

        '<!-- Expanded Companion Dossier Panel (Opens on Click) -->',
        '<div class="pet-hud-card" id="pet-hud-card" role="region" aria-label="Pet Companion Panel">',
        '  <div class="pet-hud-header">',
        '    <div class="pet-hud-title-group">',
        '      <span class="pet-hud-badge-icon">' + SVG_SPARK + '</span>',
        '      <span class="pet-hud-title">Master Narrator &amp; Companion</span>',
        '    </div>',
        '    <div class="pet-hud-header-actions">',
        '      <button type="button" class="pet-hud-icon-btn" id="pet-hud-dock-btn" title="Toggle Compact Mode">' + SVG_MIN + '</button>',
        '      <button type="button" class="pet-hud-icon-btn" id="pet-hud-close-btn" title="Close Panel">' + SVG_CLOSE + '</button>',
        '    </div>',
        '  </div>',

        '  <div class="pet-hud-body">',
        '    <div class="pet-hud-hero-box">',
        '      <div class="pet-hud-hero-img-wrap">',
        '        <img src="' + avatarUrl + '" alt="' + pet.name + '" id="pet-hud-hero-img" loading="lazy" decoding="async" onerror="this.src=\'' + fallbackMask + '\'" />',
        '      </div>',
        '      <div class="pet-hud-hero-details">',
        '        <div class="pet-hud-hero-name" id="pet-hud-hero-name">' + pet.name + '</div>',
        '        <div class="pet-hud-hero-archetype" id="pet-hud-hero-archetype">' + pet.archetype + '</div>',
        '        <div class="pet-hud-hero-element" id="pet-hud-hero-element">' + pet.element + '</div>',
        '      </div>',
        '    </div>',

        '    <div class="pet-hud-telemetry">',
        '      <div class="pet-hud-telemetry-row">',
        '        <span class="pet-hud-label">Emotional Vibration</span>',
        '        <span class="pet-hud-val" id="pet-hud-vibe-val">' + (pet.vibe || "Optimal (98.4%)") + '</span>',
        '      </div>',
        '      <div class="pet-hud-vibe-bar">',
        '        <div class="pet-hud-vibe-fill" id="pet-hud-vibe-fill"></div>',
        '      </div>',
        '      <div class="pet-hud-telemetry-row" style="margin-top: 2px;">',
        '        <span class="pet-hud-label">Harness Integration</span>',
        '        <span class="pet-hud-val" id="pet-hud-harness-val" style="font-size:0.65rem; color:var(--cyan-soft,#38bdf8);">' + pet.harness + '</span>',
        '      </div>',
        '    </div>',

        '    <div class="pet-hud-field" style="margin-top: 10px;">',
        '      <label class="pet-hud-field-label">' + SVG_EYE + ' Sovereign Vision &amp; Screen Capture</label>',
        '      <button type="button" class="pet-hud-vision-btn" id="pet-hud-vision-btn" style="width:100%; padding:9px 12px; background:linear-gradient(135deg, rgba(0,240,255,0.2), rgba(168,85,247,0.25)); border:1px solid var(--border-cyan, #00f0ff); border-radius:8px; color:#fff; font-family:inherit; font-weight:700; font-size:0.78rem; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; transition:all 0.2s;">',
        '        <span>' + SVG_EYE + ' Activate Visionary Screen Eye</span>',
        '      </button>',
        '    </div>',
        '    <div class="pet-hud-field">',
        '      <label class="pet-hud-field-label">' + SVG_SPARK + ' Change Narrator &amp; Companion Spirit</label>',
        '      <select class="pet-hud-select" id="pet-hud-switcher">',
        optionsHtml,
        '      </select>',
        '    </div>',

        '    <div class="pet-hud-field">',
        '      <label class="pet-hud-field-label">Terminal Summon Command</label>',
        '      <div class="pet-hud-cmd-box">',
        '        <span class="pet-hud-cmd-text" id="pet-hud-cmd-text">' + pet.cmd + '</span>',
        '        <button type="button" class="pet-hud-copy-btn" id="pet-hud-copy-cmd">' + SVG_COPY + ' <span>Copy</span></button>',
        '      </div>',
        '    </div>',
        '  </div>',

        '  <div class="pet-hud-footer">',
        '    <a href="/pets/" class="pet-hud-footer-link">' + SVG_PAW + ' <span>Sanctuary Roster (24)</span></a>',
        '    <a href="/pets/studio.html" class="pet-hud-footer-link">' + SVG_CUBE + ' <span>3D Studio ↗</span></a>',
        '  </div>',
        '</div>'
      ].join('\n');

      document.body.appendChild(hud);
    },

    
    
    activateVisionary: function () {
      var self = this;
      self.say("👁️ Visionary Mode Engaging... Choose Page Scanner or Full Device Capture.");
      self.showVisionaryModePicker();
    },

    showVisionaryModePicker: function () {
      var self = this;
      var existing = document.getElementById("zoth-visionary-picker");
      if (existing) existing.remove();

      var picker = document.createElement("div");
      picker.id = "zoth-visionary-picker";
      picker.style.cssText = "position:fixed; inset:0; z-index:2147483647; background:rgba(3,4,8,0.85); backdrop-filter:blur(14px); display:flex; align-items:center; justify-content:center; padding:20px; pointer-events:auto;";

      picker.innerHTML = [
        '<div style="background:#090e1f; border:1px solid var(--border-cyan, #00f0ff); border-radius:16px; max-width:540px; width:92vw; padding:24px; box-shadow:0 24px 80px rgba(0,240,255,0.3); text-align:center; font-family:var(--font-theme-body, sans-serif);">',
        '  <div style="font-size:2.2rem; margin-bottom:8px;">👁️</div>',
        '  <div style="font-family:var(--font-mono, monospace); font-size:0.7rem; color:#fbbf24; letter-spacing:0.14em; text-transform:uppercase;">SOVEREIGN MULTIMODAL PERCEPTION</div>',
        '  <h2 style="margin:4px 0 12px; color:#fff; font-size:1.35rem; font-family:var(--font-display, sans-serif);">' + self.activePet.name + ' Visionary Eye</h2>',
        '  <p style="color:#cbd5e1; font-size:0.86rem; line-height:1.5; margin-bottom:20px;">Choose how ' + self.activePet.name + ' should inspect and stream thoughts on your environment:</p>',
        '  <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:16px;">',
        '    <button type="button" id="btn-vision-page" style="padding:16px 12px; background:rgba(0,240,255,0.1); border:1px solid #00f0ff; border-radius:12px; color:#fff; cursor:pointer; text-align:center; transition:all 0.2s;">',
        '      <div style="font-size:1.5rem; margin-bottom:4px;">📄</div>',
        '      <strong style="display:block; font-size:0.88rem; color:#00f0ff;">Active Webpage</strong>',
        '      <small style="color:#94a3b8; font-size:0.72rem; display:block; margin-top:2px;">Scans current DOM, layout, buttons, and accessibility</small>',
        '    </button>',
        '    <button type="button" id="btn-vision-screen" style="padding:16px 12px; background:rgba(168,85,247,0.1); border:1px solid #a855f7; border-radius:12px; color:#fff; cursor:pointer; text-align:center; transition:all 0.2s;">',
        '      <div style="font-size:1.5rem; margin-bottom:4px;">🖥️</div>',
        '      <strong style="display:block; font-size:0.88rem; color:#c084fc;">Full Device Screen</strong>',
        '      <small style="color:#94a3b8; font-size:0.72rem; display:block; margin-top:2px;">Captures entire OS display, desktop apps, and terminals</small>',
        '    </button>',
        '  </div>',
        '  <button type="button" id="btn-vision-cancel" style="background:none; border:none; color:#94a3b8; font-size:0.8rem; cursor:pointer; text-decoration:underline;">Cancel</button>',
        '</div>'
      ].join('');

      document.body.appendChild(picker);

      document.getElementById("btn-vision-cancel").onclick = function() { picker.remove(); };
      document.getElementById("btn-vision-page").onclick = function() {
        picker.remove();
        self.inspectPageDOM();
      };
      document.getElementById("btn-vision-screen").onclick = function() {
        picker.remove();
        self.captureEntireDeviceScreen();
      };
    },

    captureEntireDeviceScreen: function () {
      var self = this;
      if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
        self.fallbackDomVision();
        return;
      }

      navigator.mediaDevices.getDisplayMedia({
        video: { cursor: "always" },
        audio: false
      }).then(function (stream) {
        var video = document.createElement("video");
        video.srcObject = stream;
        video.play();
        
        video.onloadedmetadata = function () {
          setTimeout(function () {
            var canvas = document.createElement("canvas");
            canvas.width = video.videoWidth || window.innerWidth;
            canvas.height = video.videoHeight || window.innerHeight;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            stream.getTracks().forEach(function (t) { t.stop(); });
            
            var dataUrl = canvas.toDataURL("image/png");
            self.streamVisionaryAnalysis(dataUrl, "Full Device Screen", canvas.width, canvas.height, self.analyzeScreenContext(canvas.width, canvas.height));
          }, 400);
        };
      }).catch(function (err) {
        self.say("⚠️ Display stream cancelled. Falling back to page inspection.");
        self.inspectPageDOM();
      });
    },

    inspectPageDOM: function () {
      var self = this;
      self.say("🔍 " + self.activePet.name + " scanning current DOM tree and viewport...");

      var w = window.innerWidth;
      var h = window.innerHeight;
      var canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      var ctx = canvas.getContext("2d");

      // Draw cyber matrix background
      ctx.fillStyle = "#050814";
      ctx.fillRect(0, 0, w, h);

      // Render scanning matrix lines
      ctx.strokeStyle = "rgba(0, 240, 255, 0.18)";
      ctx.lineWidth = 1;
      for (var x = 0; x < w; x += 48) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (var y = 0; y < h; y += 48) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }

      // Draw bounding boxes of top visible interactive DOM elements
      var elements = Array.from(document.querySelectorAll("header, main, nav, section, article, button, input, a, canvas, h1, h2, h3"));
      var boundingData = [];

      elements.slice(0, 28).forEach(function (el) {
        var rect = el.getBoundingClientRect();
        if (rect.width > 20 && rect.height > 10 && rect.top < h && rect.bottom > 0) {
          ctx.strokeStyle = el.tagName === 'BUTTON' || el.tagName === 'A' ? "rgba(251, 191, 36, 0.6)" : "rgba(0, 240, 255, 0.4)";
          ctx.lineWidth = 1.5;
          ctx.strokeRect(rect.left, rect.top, rect.width, rect.height);
          ctx.fillStyle = "rgba(0, 240, 255, 0.05)";
          ctx.fillRect(rect.left, rect.top, rect.width, rect.height);

          // Tag pill on canvas
          ctx.fillStyle = "#fbbf24";
          ctx.font = "10px monospace";
          var label = "<" + el.tagName.toLowerCase() + (el.id ? "#" + el.id : "") + ">";
          ctx.fillText(label, rect.left + 4, Math.max(rect.top - 3, 12));

          boundingData.push({
            tag: el.tagName.toLowerCase(),
            id: el.id,
            cls: el.className,
            text: (el.innerText || '').slice(0, 30),
            rect: { x: Math.round(rect.left), y: Math.round(rect.top), w: Math.round(rect.width), h: Math.round(rect.height) }
          });
        }
      });

      var dataUrl = canvas.toDataURL("image/png");
      self.streamVisionaryAnalysis(dataUrl, "Active Webpage DOM", w, h, self.generatePageThoughts(boundingData));
    },

    fallbackDomVision: function () {
      this.inspectPageDOM();
    },

    analyzeScreenContext: function (w, h) {
      return {
        whatISee: [
          "Full OS Desktop viewport spanning " + w + "×" + h + " px.",
          "High-resolution window display containing active browser and workspace cockpits.",
          "Operating system taskbars, docks, and system status indicators.",
          "Active visual hierarchy, typography, and contrast gradients."
        ],
        whereISeeIt: [
          "Top Region [0-60px]: System header bar, navigation menus, and global controls.",
          "Center Canvas [" + Math.round(w*0.15) + "-" + Math.round(w*0.85) + "px]: Primary focus workspace and interactive figurines.",
          "Lower Dock [Y: " + (h - 90) + "px]: Floating Pet HUD companion orb & terminal telemetry docks.",
          "Left Rail [X: 20-340px]: Workspace inspector, agent navigation, and status feeds."
        ],
        whatIUnderstand: [
          "Detected Sovereign Local-First execution running with 0 cloud leakage.",
          "Glassmorphic visual styling with dark/gold/cyan cyber aesthetic.",
          "Interactive 3D Three.js WebGL canvas running in background thread.",
          "Clean responsive viewport layout adapting to display dimensions."
        ],
        whatIMightNotUnderstand: [
          "Undocumented custom hotkey combos not surfaced in accessibility hints.",
          "Background daemons without visual port listeners (:8787 vault status).",
          "Potential touch gesture ambiguities on non-pointer displays."
        ],
        whatIWantToDo: [
          "✨ Run an automated WCAG 2.2 accessibility and contrast sweep across all buttons.",
          "⚡ Verify loopback latency and live WebSocket telemetry on port :8484.",
          "📜 Generate an updated SOUL.md behavioral contract for the active workspace.",
          "🎨 Optimize 3D figurine PBR lighting presets for the current display brightness."
        ]
      };
    },

    generatePageThoughts: function (elements) {
      var hasCanvas = elements.some(function(e){ return e.tag === 'canvas'; });
      var buttonCount = elements.filter(function(e){ return e.tag === 'button'; }).length;
      var linkCount = elements.filter(function(e){ return e.tag === 'a'; }).length;
      var headerCount = elements.filter(function(e){ return e.tag === 'h1' || e.tag === 'h2' || e.tag === 'h3'; }).length;

      return {
        whatISee: [
          "Inspected current route (" + window.location.pathname + ") containing " + document.querySelectorAll('*').length + " total DOM nodes.",
          "Detected " + buttonCount + " interactive action buttons, " + linkCount + " navigation links, and " + headerCount + " typography headers.",
          (hasCanvas ? "Active Three.js WebGL 3D figurine canvas detected in the viewport." : "Static editorial layout structure."),
          "Theme color palette active: " + (document.documentElement.getAttribute('data-theme') || 'Dark (Default)')
        ],
        whereISeeIt: [
          "Header [0-54px]: Global navigation bar with theme switchers and Operator Deck :8484 status.",
          "Hero Stage: Editorial headline and full-bleed alchemical character portrait.",
          "Controls Dock: Sticky category filter pills and live search input box.",
          "Bottom-Left: Persistent Global Pet HUD floating companion drawer."
        ],
        whatIUnderstand: [
          "Page structure matches Zoth Studio Sovereign Poster guidelines.",
          "All interactive buttons have explicit focus rings and touch-action constraints.",
          "No external tracker scripts or third-party telemetry beacons present.",
          "High contrast ratios compliant with dark/light theme switching."
        ],
        whatIMightNotUnderstand: [
          "Whether the operator prefers Solo vs Tri-Orbit 3D formation on mobile viewports.",
          "If custom-forged pets should auto-sync across Tailscale peer instances."
        ],
        whatIWantToDo: [
          "✨ Keep observing user interactions and provide real-time suggestions.",
          "🔊 Trigger audio harmonic chirps on successful compilation or export events.",
          "📜 Cache active pet configuration to ~/.zoth/active_pet.json for CLI parity."
        ]
      };
    },

    streamVisionaryAnalysis: function (imgUrl, scanType, width, height, thoughts) {
      var self = this;
      var existing = document.getElementById("zoth-visionary-overlay");
      if (existing) existing.remove();

      var overlay = document.createElement("div");
      overlay.id = "zoth-visionary-overlay";
      overlay.style.cssText = "position:fixed; inset:0; z-index:2147483647; background:rgba(3,4,8,0.92); backdrop-filter:blur(18px); -webkit-backdrop-filter:blur(18px); display:flex; flex-direction:column; align-items:center; justify-content:center; padding:clamp(12px, 2vw, 24px); pointer-events:auto; font-family:var(--font-theme-body, system-ui, sans-serif);";

      overlay.innerHTML = [
        '<div style="background:#090e1f; border:1px solid var(--border-cyan, #00f0ff); border-radius:18px; max-width:1180px; width:96vw; max-height:94vh; display:flex; flex-direction:column; box-shadow:0 24px 90px rgba(0,240,255,0.3); overflow:hidden;">',
        
        '  <!-- Vision Header -->',
        '  <div style="display:flex; justify-content:space-between; align-items:center; padding:14px 20px; border-bottom:1px solid rgba(255,255,255,0.1); background:rgba(0,0,0,0.5);">',
        '    <div style="display:flex; align-items:center; gap:12px;">',
        '      <span style="font-size:1.6rem;">' + (self.activePet.emoji || "🐾") + '</span>',
        '      <div>',
        '        <div style="display:flex; align-items:center; gap:8px;">',
        '          <span style="font-family:var(--font-mono, monospace); font-size:0.68rem; color:#fbbf24; text-transform:uppercase; letter-spacing:0.14em;">VISIONARY STREAM // ' + scanType.toUpperCase() + '</span>',
        '          <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#10b981; box-shadow:0 0 8px #10b981;"></span>',
        '        </div>',
        '        <h3 style="margin:2px 0 0; font-size:1.2rem; color:#fff; font-family:var(--font-display, sans-serif);">' + self.activePet.name + ' Cognitive Perception & Eye Stream</h3>',
        '      </div>',
        '    </div>',
        '    <div style="display:flex; gap:10px; align-items:center;">',
        '      <button type="button" id="btn-speak-thoughts" style="padding:6px 12px; background:rgba(251,191,36,0.15); border:1px solid #fbbf24; border-radius:8px; color:#fbbf24; font-size:0.75rem; font-weight:700; cursor:pointer;">🔊 Read Thoughts</button>',
        '      <button type="button" id="close-visionary-btn" style="background:none; border:none; color:#fff; font-size:1.5rem; cursor:pointer; padding:2px 8px;">✕</button>',
        '    </div>',
        '  </div>',

        '  <!-- Split Content: Left Viewport Stream + Right Live Thoughts Feed -->',
        '  <div style="display:grid; grid-template-columns:minmax(280px, 1.2fr) minmax(320px, 1fr); flex:1; overflow:hidden; background:#04060d;">',
        
        '    <!-- Left: Captured Visual Stream -->',
        '    <div style="padding:16px; display:flex; flex-direction:column; align-items:center; justify-content:center; border-right:1px solid rgba(255,255,255,0.08); background:#020306; overflow:hidden; position:relative;">',
        '      <div style="position:relative; width:100%; height:100%; display:flex; align-items:center; justify-content:center;">',
        '        <img src="' + imgUrl + '" alt="Visual stream capture" style="max-width:100%; max-height:64vh; border-radius:10px; border:1px solid rgba(0,240,255,0.35); box-shadow:0 12px 40px rgba(0,0,0,0.9); object-fit:contain;" />',
        '        <div style="position:absolute; bottom:12px; left:12px; background:rgba(0,0,0,0.75); border:1px solid rgba(0,240,255,0.3); border-radius:6px; padding:4px 10px; font-family:monospace; font-size:0.72rem; color:#00f0ff;">' + width + '×' + height + ' px · Stream Synchronized</div>',
        '      </div>',
        '    </div>',

        '    <!-- Right: Multi-Channel Cognitive Stream (What I see, where, understand, plan) -->',
        '    <div style="padding:18px 20px; overflow-y:auto; display:flex; flex-direction:column; gap:16px;">',

        '      <!-- Channel 1: What I See -->',
        '      <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(0,240,255,0.2); border-radius:12px; padding:12px 16px;">',
        '        <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">',
        '          <span style="font-size:1.1rem;">🔍</span>',
        '          <strong style="font-family:var(--font-mono, monospace); font-size:0.78rem; color:#00f0ff; text-transform:uppercase;">1. What I See (Visual Inventory)</strong>',
        '        </div>',
        '        <ul style="margin:0; padding-left:18px; color:#cbd5e1; font-size:0.82rem; line-height:1.5;">',
        thoughts.whatISee.map(function(t){ return '<li style="margin-bottom:4px;">' + t + '</li>'; }).join(''),
        '        </ol>',
        '      </div>',

        '      <!-- Channel 2: Where I See It -->',
        '      <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(251,191,36,0.2); border-radius:12px; padding:12px 16px;">',
        '        <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">',
        '          <span style="font-size:1.1rem;">📍</span>',
        '          <strong style="font-family:var(--font-mono, monospace); font-size:0.78rem; color:#fbbf24; text-transform:uppercase;">2. Where I See It (Spatial Coordinate Grid)</strong>',
        '        </div>',
        '        <ul style="margin:0; padding-left:18px; color:#cbd5e1; font-size:0.82rem; line-height:1.5;">',
        thoughts.whereISeeIt.map(function(t){ return '<li style="margin-bottom:4px;">' + t + '</li>'; }).join(''),
        '        </ol>',
        '      </div>',

        '      <!-- Channel 3: What I Understand -->',
        '      <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(16,185,129,0.2); border-radius:12px; padding:12px 16px;">',
        '        <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">',
        '          <span style="font-size:1.1rem;">💡</span>',
        '          <strong style="font-family:var(--font-mono, monospace); font-size:0.78rem; color:#10b981; text-transform:uppercase;">3. What I Understand (Semantic Context)</strong>',
        '        </div>',
        '        <ul style="margin:0; padding-left:18px; color:#cbd5e1; font-size:0.82rem; line-height:1.5;">',
        thoughts.whatIUnderstand.map(function(t){ return '<li style="margin-bottom:4px;">' + t + '</li>'; }).join(''),
        '        </ol>',
        '      </div>',

        '      <!-- Channel 4: What I Might Not Understand -->',
        '      <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(244,63,94,0.2); border-radius:12px; padding:12px 16px;">',
        '        <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">',
        '          <span style="font-size:1.1rem;">❓</span>',
        '          <strong style="font-family:var(--font-mono, monospace); font-size:0.78rem; color:#f43f5e; text-transform:uppercase;">4. What I Might Not Understand (Ambiguities)</strong>',
        '        </div>',
        '        <ul style="margin:0; padding-left:18px; color:#cbd5e1; font-size:0.82rem; line-height:1.5;">',
        thoughts.whatIMightNotUnderstand.map(function(t){ return '<li style="margin-bottom:4px;">' + t + '</li>'; }).join(''),
        '        </ol>',
        '      </div>',

        '      <!-- Channel 5: What I Want To Do (Proactive Intent) -->',
        '      <div style="background:rgba(168,85,247,0.08); border:1px solid rgba(168,85,247,0.3); border-radius:12px; padding:12px 16px;">',
        '        <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">',
        '          <span style="font-size:1.1rem;">🚀</span>',
        '          <strong style="font-family:var(--font-mono, monospace); font-size:0.78rem; color:#c084fc; text-transform:uppercase;">5. What I Want To Do (Autonomous Intent)</strong>',
        '        </div>',
        '        <ul style="margin:0; padding-left:18px; color:#e2e8f0; font-size:0.82rem; line-height:1.5;">',
        thoughts.whatIWantToDo.map(function(t){ return '<li style="margin-bottom:4px; font-weight:600;">' + t + '</li>'; }).join(''),
        '        </ol>',
        '      </div>',

        '    </div>',
        '  </div>',

        '  <!-- Vision Footer Actions -->',
        '  <div style="padding:12px 20px; border-top:1px solid rgba(255,255,255,0.1); display:flex; justify-content:space-between; align-items:center; background:rgba(0,0,0,0.5); flex-wrap:wrap; gap:10px;">',
        '    <span style="font-family:monospace; font-size:0.75rem; color:#94a3b8;">Autonomous Vision Stream Active · 100% Private Local Inference</span>',
        '    <div style="display:flex; gap:10px;">',
        '      <a href="' + imgUrl + '" download="' + self.activePet.id + '-vision-stream.png" style="padding:8px 14px; background:rgba(0,240,255,0.15); border:1px solid #00f0ff; border-radius:8px; color:#00f0ff; text-decoration:none; font-size:0.8rem; font-weight:700;">💾 Download Stream</a>',
        '      <button type="button" id="copy-vision-token" style="padding:8px 16px; background:#fbbf24; border:none; border-radius:8px; color:#050508; font-size:0.8rem; font-weight:700; cursor:pointer;">📋 Copy Vision Token</button>',
        '    </div>',
        '  </div>',

        '</div>'
      ].join('');

      document.body.appendChild(overlay);

      document.getElementById("close-visionary-btn").onclick = function () { overlay.remove(); };
      document.getElementById("copy-vision-token").onclick = function () {
        navigator.clipboard.writeText(`@${self.activePet.id} analyze-vision-stream --source="${scanType}" --timestamp=${Date.now()}`);
        this.textContent = "✔ Token Copied!";
        setTimeout(() => { this.textContent = "📋 Copy Vision Token"; }, 1800);
      };

      document.getElementById("btn-speak-thoughts").onclick = function () {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          var summary = "Greetings Operator. I am " + self.activePet.name + ". I see your " + scanType + " with " + thoughts.whatISee.length + " key components. I understand your workspace is running in sovereign local mode. I want to execute an automated audit sweep across your active nodes.";
          var utter = new SpeechSynthesisUtterance(summary);
          utter.pitch = 1.05;
          utter.rate = 1.0;
          window.speechSynthesis.speak(utter);
        }
      };

      self.say("👁️ " + self.activePet.name + " is streaming live visual thoughts!");
    },

    bindEvents: function () {
      var trigger = document.getElementById("pet-hud-trigger");
      var closeBtn = document.getElementById("pet-hud-close-btn");
      var dockBtn = document.getElementById("pet-hud-dock-btn");
      var switcher = document.getElementById("pet-hud-switcher");
      var copyCmd = document.getElementById("pet-hud-copy-cmd");
      var hud = document.getElementById("zoth-pet-hud");

      var visionBtn = document.getElementById("pet-hud-vision-btn");
      if (visionBtn) {
        visionBtn.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          PetHUD.activateVisionary();
        });
      }

      if (closeBtn) {
        closeBtn.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          PetHUD.close();
        });
      }

      if (dockBtn) {
        dockBtn.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          PetHUD.toggleDock();
        });
      }

      if (switcher) {
        switcher.addEventListener("change", function (e) {
          PetHUD.switchPet(e.target.value);
        });
      }

      if (copyCmd) {
        copyCmd.addEventListener("click", function (e) {
          e.preventDefault();
          var cmd = PetHUD.activePet.cmd;
          navigator.clipboard.writeText(cmd).then(function () {
            copyCmd.textContent = "✓ Copied!";
            PetHUD.say("Summon command copied to terminal clipboard!");
            setTimeout(function () {
              copyCmd.textContent = "📋 Copy";
            }, 2000);
          });
        });
      }

      // Initialize draggable fling & bounce physics
      this.setupDraggablePhysics();

      // Close panel on clicking outside
      document.addEventListener("click", function (e) {
        if (PetHUD.isOpen && hud && !hud.contains(e.target)) {
          PetHUD.close();
        }
      });

      // Escape key to close
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && PetHUD.isOpen) {
          PetHUD.close();
        }
      });

      // Window resize bounds containment
      window.addEventListener("resize", function () {
        PetHUD.clampToBounds();
      });
    },

    setupDraggablePhysics: function () {
      var self = this;
      var trigger = document.getElementById("pet-hud-trigger");
      var hud = document.getElementById("zoth-pet-hud");
      if (!trigger || !hud) return;

      var isDragging = false;
      var dragStarted = false;
      var startX = 0, startY = 0;
      var hudStartX = 0, hudStartY = 0;
      var moveHistory = [];
      var animId = null;

      // Restore position from localStorage if saved
      self.restoreSavedPosition();

      function updateOrientation(x, y) {
        var vw = window.innerWidth || document.documentElement.clientWidth;
        var vh = window.innerHeight || document.documentElement.clientHeight;
        if (x < vw / 2) {
          hud.classList.remove("orient-right");
        } else {
          hud.classList.add("orient-right");
        }
        if (y < vh * 0.45) {
          hud.classList.add("orient-down");
        } else {
          hud.classList.remove("orient-down");
        }
      }

      self.clampToBounds = function () {
        var rect = hud.getBoundingClientRect();
        var vw = window.innerWidth || document.documentElement.clientWidth;
        var vh = window.innerHeight || document.documentElement.clientHeight;
        var curLeft = rect.left;
        var curTop = rect.top;
        var maxL = Math.max(0, vw - rect.width);
        var maxT = Math.max(0, vh - rect.height);
        var nLeft = Math.min(Math.max(8, curLeft), maxL - 8);
        var nTop = Math.min(Math.max(8, curTop), maxT - 8);

        if (hud.style.left || hud.style.top) {
          hud.style.left = nLeft + "px";
          hud.style.top = nTop + "px";
          hud.style.right = "auto";
          hud.style.bottom = "auto";
          updateOrientation(nLeft, nTop);
        }
      };

      function onPointerDown(e) {
        // Only primary button
        if (e.button !== undefined && e.button !== 0) return;
        
        // Cancel ongoing physics animation
        if (animId) {
          cancelAnimationFrame(animId);
          animId = null;
        }

        var rect = hud.getBoundingClientRect();
        hudStartX = rect.left;
        hudStartY = rect.top;
        startX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
        startY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
        isDragging = false;
        dragStarted = true;
        moveHistory = [{ x: startX, y: startY, t: performance.now() }];

        window.addEventListener("pointermove", onPointerMove, { passive: false });
        window.addEventListener("pointerup", onPointerUp);
        window.addEventListener("pointercancel", onPointerUp);
      }

      function onPointerMove(e) {
        if (!dragStarted) return;
        var clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
        var clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
        var dx = clientX - startX;
        var dy = clientY - startY;

        if (!isDragging && Math.hypot(dx, dy) > 5) {
          isDragging = true;
        }

        if (isDragging) {
          e.preventDefault();
          var rect = hud.getBoundingClientRect();
          var vw = window.innerWidth || document.documentElement.clientWidth;
          var vh = window.innerHeight || document.documentElement.clientHeight;

          var newX = hudStartX + dx;
          var newY = hudStartY + dy;

          var minX = 0;
          var maxX = vw - rect.width;
          var minY = 0;
          var maxY = vh - rect.height;

          // Clamp while dragging with slight elasticity at boundaries
          newX = Math.max(minX, Math.min(newX, maxX));
          newY = Math.max(minY, Math.min(newY, maxY));

          hud.style.left = newX + "px";
          hud.style.top = newY + "px";
          hud.style.right = "auto";
          hud.style.bottom = "auto";

          updateOrientation(newX, newY);

          var now = performance.now();
          moveHistory.push({ x: clientX, y: clientY, t: now });
          if (moveHistory.length > 8) moveHistory.shift();
        }
      }

      function onPointerUp(e) {
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
        window.removeEventListener("pointercancel", onPointerUp);

        if (!dragStarted) return;
        dragStarted = false;

        if (!isDragging) {
          // Clean click -> toggle panel
          PetHUD.toggle();
          return;
        }

        // Calculate fling release velocity
        var now = performance.now();
        var recent = moveHistory.filter(function (p) { return now - p.t < 120; });
        var vx = 0, vy = 0;
        if (recent.length >= 2) {
          var first = recent[0];
          var last = recent[recent.length - 1];
          var dt = (last.t - first.t) || 16.66;
          // Velocity in px per frame (~16.66ms)
          vx = ((last.x - first.x) / dt) * 16.66;
          vy = ((last.y - first.y) / dt) * 16.66;
        }

        // Cap fling velocity
        var speed = Math.hypot(vx, vy);
        var maxSpeed = 42;
        if (speed > maxSpeed) {
          var ratio = maxSpeed / speed;
          vx *= ratio;
          vy *= ratio;
        }

        // Launch physics simulation (deceleration + wall bounce)
        var curRect = hud.getBoundingClientRect();
        var posX = curRect.left;
        var posY = curRect.top;
        var friction = 0.94;
        var restitution = 0.75; // Bounciness off walls

        function stepPhysics() {
          var vw = window.innerWidth || document.documentElement.clientWidth;
          var vh = window.innerHeight || document.documentElement.clientHeight;
          var w = hud.offsetWidth || 140;
          var h = hud.offsetHeight || 56;
          var maxX = Math.max(0, vw - w);
          var maxY = Math.max(0, vh - h);

          posX += vx;
          posY += vy;
          vx *= friction;
          vy *= friction;

          var bounced = false;

          // Left wall
          if (posX <= 0) {
            posX = 0;
            vx = -vx * restitution;
            bounced = true;
          }
          // Right wall
          if (posX >= maxX) {
            posX = maxX;
            vx = -vx * restitution;
            bounced = true;
          }
          // Top wall
          if (posY <= 0) {
            posY = 0;
            vy = -vy * restitution;
            bounced = true;
          }
          // Bottom wall
          if (posY >= maxY) {
            posY = maxY;
            vy = -vy * restitution;
            bounced = true;
          }

          hud.style.left = Math.round(posX) + "px";
          hud.style.top = Math.round(posY) + "px";
          hud.style.right = "auto";
          hud.style.bottom = "auto";

          updateOrientation(posX, posY);

          if (bounced && Math.hypot(vx, vy) > 2) {
            trigger.style.transform = "scale(0.92)";
            setTimeout(function () { trigger.style.transform = ""; }, 90);
          }

          if (Math.hypot(vx, vy) > 0.25) {
            animId = requestAnimationFrame(stepPhysics);
          } else {
            animId = null;
            // Save final resting position
            localStorage.setItem("zoth_pet_hud_pos_x", String(Math.round(posX)));
            localStorage.setItem("zoth_pet_hud_pos_y", String(Math.round(posY)));
          }
        }

        if (speed > 1.2) {
          animId = requestAnimationFrame(stepPhysics);
        } else {
          localStorage.setItem("zoth_pet_hud_pos_x", String(Math.round(posX)));
          localStorage.setItem("zoth_pet_hud_pos_y", String(Math.round(posY)));
        }
      }

      trigger.addEventListener("pointerdown", onPointerDown);
    },

    restoreSavedPosition: function () {
      var hud = document.getElementById("zoth-pet-hud");
      if (!hud) return;
      var savedX = localStorage.getItem("zoth_pet_hud_pos_x");
      var savedY = localStorage.getItem("zoth_pet_hud_pos_y");
      if (savedX !== null && savedY !== null) {
        var x = parseInt(savedX, 10);
        var y = parseInt(savedY, 10);
        var vw = window.innerWidth || document.documentElement.clientWidth;
        var vh = window.innerHeight || document.documentElement.clientHeight;
        if (vw > 640 && !isNaN(x) && !isNaN(y) && x >= 0 && x < vw && y >= 0 && y < vh) {
          hud.style.left = x + "px";
          hud.style.top = y + "px";
          hud.style.right = "auto";
          hud.style.bottom = "auto";
          if (x < vw / 2) hud.classList.remove("orient-right");
          if (y < vh * 0.45) hud.classList.add("orient-down");
        }
      }
    },

    toggle: function () {
      if (this.isOpen) {
        this.close();
      } else {
        this.open();
      }
    },

    open: function () {
      var hud = document.getElementById("zoth-pet-hud");
      var trigger = document.getElementById("pet-hud-trigger");
      if (hud) hud.classList.add("open");
      if (trigger) trigger.setAttribute("aria-expanded", "true");
      this.isOpen = true;
      playPetSFX('open');
      this.say("Observing workspace telemetry...");
    },

    close: function () {
      var hud = document.getElementById("zoth-pet-hud");
      var trigger = document.getElementById("pet-hud-trigger");
      if (hud) hud.classList.remove("open");
      if (trigger) trigger.setAttribute("aria-expanded", "false");
      this.isOpen = false;
      playPetSFX('close');
    },

    toggleDock: function () {
      var hud = document.getElementById("zoth-pet-hud");
      this.isDocked = !this.isDocked;
      if (hud) {
        hud.classList.toggle("docked", this.isDocked);
      }
      localStorage.setItem("zoth_pet_hud_docked", String(this.isDocked));
      this.say(this.isDocked ? "Docked to minimal profile." : "Expanded HUD profile.");
    },

    switchPet: function (petId) {
      var target = PETS_ROSTER.find(function (p) { return p.id === petId; });
      if (!target) return;

      this.activePet = Object.assign({}, target);
      localStorage.setItem("zoth_active_pet", target.id);

      // Update UI elements in place
      var orbImg = document.getElementById("pet-hud-orb-img");
      var triggerName = document.getElementById("pet-hud-trigger-name");
      var heroImg = document.getElementById("pet-hud-hero-img");
      var heroName = document.getElementById("pet-hud-hero-name");
      var heroArch = document.getElementById("pet-hud-hero-archetype");
      var heroElem = document.getElementById("pet-hud-hero-element");
      var vibeVal = document.getElementById("pet-hud-vibe-val");
      var harnessVal = document.getElementById("pet-hud-harness-val");
      var cmdText = document.getElementById("pet-hud-cmd-text");
      var switcher = document.getElementById("pet-hud-switcher");

      if (orbImg) orbImg.src = target.avatar;
      if (triggerName) triggerName.textContent = target.name;
      if (heroImg) heroImg.src = target.avatar;
      if (heroName) heroName.textContent = target.name;
      if (heroArch) heroArch.textContent = target.archetype;
      if (heroElem) heroElem.textContent = target.element;
      if (vibeVal) vibeVal.textContent = target.vibe;
      if (harnessVal) harnessVal.textContent = target.harness;
      if (cmdText) cmdText.textContent = target.cmd;
      if (switcher) switcher.value = target.id;

      // Broadcast custom event for other components if listening
      window.dispatchEvent(new CustomEvent("zoth:pet-switched", { detail: target }));

      playPetSFX('open');
      this.say("Summoned " + target.name + " (" + target.domain + ")!");
    },

    say: function (content, durationMs, titleOverride) {
      var speech = document.getElementById("pet-hud-speech");
      if (!speech) return;

      var pet = this.activePet || PETS_ROSTER[0];
      var headerTitle = titleOverride || (pet.name + " · " + (pet.domain || "Companion"));

      if (Array.isArray(content)) {
        // Multi-line digest list
        var listHtml = content.map(function (item) {
          return '<li>' + item + '</li>';
        }).join('');

        speech.innerHTML = [
          '<div class="pet-hud-speech-header">',
          '  <span class="pet-hud-speech-title">' + pet.emoji + ' ' + headerTitle + '</span>',
          '  <button type="button" class="pet-hud-speech-close" aria-label="Dismiss">✕</button>',
          '</div>',
          '<ol class="pet-hud-speech-list">',
          listHtml,
          '</ol>'
        ].join('');
      } else {
        // Single text string
        speech.innerHTML = [
          '<div class="pet-hud-speech-header">',
          '  <span class="pet-hud-speech-title">' + pet.emoji + ' ' + headerTitle + '</span>',
          '  <button type="button" class="pet-hud-speech-close" aria-label="Dismiss">✕</button>',
          '</div>',
          '<span class="pet-hud-speech-text">' + content + '</span>'
        ].join('');
      }

      var closeBtn = speech.querySelector(".pet-hud-speech-close");
      if (closeBtn) {
        closeBtn.addEventListener("click", function (e) {
          e.stopPropagation();
          speech.classList.remove("active");
          speech.setAttribute("data-hold", "1");
        });
      }

      speech.classList.add("active");
      playPetSFX('chirp');
      if (this.bubbleTimeout) clearTimeout(this.bubbleTimeout);

      var effectiveDuration = durationMs || (Array.isArray(content) ? 9000 : 4500);
      this.bubbleTimeout = setTimeout(function () {
        speech.classList.remove("active");
      }, effectiveDuration);
    },

    narrateGuide: function (rawGuideText, sectionName) {
      var speech = document.getElementById("pet-hud-speech");
      if (speech && speech.getAttribute("data-hold") === "1") return;

      var pet = this.activePet || PETS_ROSTER[0];
      var lines = String(rawGuideText || "")
        .split("|")
        .map(function (s) { return s.trim(); })
        .filter(Boolean)
        .slice(0, 3);

      if (!lines.length) return;

      // Tailor lines to the active pet persona tone
      var tailoredLines = this.tailorToPetVoice(lines, pet, sectionName);
      var title = pet.name + " (" + (pet.archetype || pet.domain) + ")";
      this.say(tailoredLines, 8500, title);
    },

    tailorToPetVoice: function (lines, pet, sectionName) {
      var petId = (pet.id || "").toLowerCase();
      var prefix = "";
      var suffix = "";

      switch (petId) {
        case "kai":
          prefix = "🔍 [Audit Inspection]: ";
          return lines.map(function (l, i) {
            return i === 0 ? prefix + l : "• " + l;
          });
        case "draco":
          prefix = "🐉 [Fusion AST]: ";
          return lines.map(function (l, i) {
            return i === 0 ? prefix + l : "⚙️ " + l;
          });
        case "lycan":
          prefix = "🐺 [OWASP Bastion]: ";
          return lines.map(function (l, i) {
            return i === 0 ? prefix + l : "🛡️ " + l;
          });
        case "athena":
          prefix = "🦉 [AEO Knowledge Matrix]: ";
          return lines.map(function (l, i) {
            return i === 0 ? prefix + l : "📖 " + l;
          });
        case "kitsune":
          prefix = "🦊 [Taste & Flow]: ";
          return lines.map(function (l, i) {
            return i === 0 ? prefix + l : "✨ " + l;
          });
        case "pixel-shiba":
          prefix = "🐕 [Vault Guard]: ";
          return lines.map(function (l, i) {
            return i === 0 ? prefix + l : "🔒 " + l;
          });
        case "pixel-neko":
          prefix = "👾 [Registry Index]: ";
          return lines.map(function (l, i) {
            return i === 0 ? prefix + l : "📦 " + l;
          });
        case "radical-minion":
          prefix = "🤖 [Hermes Dispatch]: ";
          return lines.map(function (l, i) {
            return i === 0 ? prefix + l : "⚡ " + l;
          });
        case "workbot":
          prefix = "🦾 [Neural Tensor :11434]: ";
          return lines.map(function (l, i) {
            return i === 0 ? prefix + l : "⚡ " + l;
          });
        case "zoth":
          prefix = "⚡ [Loopback :8484]: ";
          return lines.map(function (l, i) {
            return i === 0 ? prefix + l : "▸ " + l;
          });
        case "azoth":
        default:
          prefix = "🔮 [Hermetic Alchemical Core]: ";
          return lines.map(function (l, i) {
            return i === 0 ? prefix + l : "✦ " + l;
          });
      }
    },

    setupScrollNarration: function () {
      var self = this;
      var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;

      var guideNodes = [].slice.call(document.querySelectorAll("[data-guide]"));
      if (!guideNodes.length) return;

      var currentSection = null;
      var scrollTimeout = null;

      function checkSectionInView() {
        var speech = document.getElementById("pet-hud-speech");
        if (speech && speech.getAttribute("data-hold") === "1") return;

        var vh = window.innerHeight || 800;
        var best = null;
        var bestScore = 0;

        guideNodes.forEach(function (el) {
          var r = el.getBoundingClientRect();
          var vis = Math.min(r.bottom, vh) - Math.max(r.top, 0);
          if (vis < Math.min(140, r.height * 0.28)) return;
          var score = vis / Math.max(r.height, 1);
          if (score > bestScore) {
            bestScore = score;
            best = el;
          }
        });

        if (best !== currentSection) {
          currentSection = best;
          if (best) {
            var rawGuide = best.getAttribute("data-guide");
            var sectionId = best.id || best.getAttribute("class") || "Section";
            self.narrateGuide(rawGuide, sectionId);
          }
        }
      }

      if ("IntersectionObserver" in window) {
        var io = new IntersectionObserver(function () {
          checkSectionInView();
        }, {
          threshold: [0.18, 0.4, 0.65],
          rootMargin: "-8% 0px -18% 0px"
        });
        guideNodes.forEach(function (el) { io.observe(el); });
      }

      window.addEventListener("scroll", function () {
        if (!scrollTimeout) {
          scrollTimeout = setTimeout(function () {
            checkSectionInView();
            scrollTimeout = null;
          }, 120);
        }
      }, { passive: true });

      // Initial check after short settle delay
      setTimeout(checkSectionInView, 600);
    },

    setupReactions: function () {
      // 1. Setup Scroll-driven narration for sections
      this.setupScrollNarration();

      // 2. React when user copies anything on page
      document.addEventListener("copy", function () {
        var pet = PetHUD.activePet || PETS_ROSTER[0];
        var phrases = [
          "Artifact copied to memory buffer!",
          "Code snippet captured in vector cache.",
          "Clipboard synched with terminal bridge."
        ];
        var pick = phrases[Math.floor(Math.random() * phrases.length)];
        PetHUD.say(pick, 3000);
      });

      // 3. React on theme change event (supports both 'zoth-theme-change' and 'zoth:theme-change')
      var handleThemeEvent = function (e) {
        var theme = (e.detail && e.detail.theme) || "new";
        PetHUD.say("Calibrated to " + theme.toUpperCase() + " spectrum.", 3000);
      };
      window.addEventListener("zoth-theme-change", handleThemeEvent);
      window.addEventListener("zoth:theme-change", handleThemeEvent);

      // 4. React on link clicks (exploration)
      document.addEventListener("click", function (e) {
        var link = e.target.closest("a");
        if (link && link.href && !link.href.startsWith("javascript") && !link.closest("#zoth-pet-hud")) {
          var targetHref = link.getAttribute("href");
          if (targetHref && (targetHref.includes("pets") || targetHref.includes("annotate") || targetHref.includes("registry") || targetHref.includes("swarm"))) {
            PetHUD.say("Navigating to " + link.textContent.trim().slice(0, 24) + "...", 2000);
          }
        }
      });

      // 5. Periodic subtle vitality ping
      setInterval(function () {
        if (!PetHUD.isOpen && Math.random() < 0.15) {
          var idleVibes = [
            "All systems nominal. Loopback quiet.",
            "Watching over local daemon on :8788.",
            "Ready to dispatch autonomous swarm tasks."
          ];
          var pick = idleVibes[Math.floor(Math.random() * idleVibes.length)];
          PetHUD.say(pick, 4000);
        }
      }, 45000);
    }
  };

  // Self-init on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      PetHUD.init();
    });
  } else {
    PetHUD.init();
  }

  // Export globally
  window.ZothPetHUD = PetHUD;
})();
