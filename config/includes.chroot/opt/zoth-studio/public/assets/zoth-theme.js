/**
 * ZOTH STUDIO — 16-THEME UNIVERSAL ENGINE (v7.0 Master)
 * Provides instant theme switching, localStorage persistence, Shift+T hotkey,
 * full metadata registry, and CustomEvent dispatch across all workstations.
 */
(function () {
  "use strict";

  var THEMES = [
    // ✦ Studio Originals
    { id: "dark", label: "Dark Void", emoji: "🌙", accent: "#00f0ff", bg: "#05060a", category: "Studio Originals", desc: "Zoth Tron Cyber HUD & Electric Cyan", company: "Zoth Core" },
    { id: "light", label: "Solar Light", emoji: "☀️", accent: "#0a2540", bg: "#f7f9fc", category: "Studio Originals", desc: "Swiss Precision & Pure Alabaster", company: "Swiss Minimalist" },
    { id: "matrix", label: "Matrix CRT", emoji: "📟", accent: "#00ff41", bg: "#000a00", category: "Studio Originals", desc: "Phosphor Green Terminal & Digital Rain", company: "Cyber Terminal" },
    { id: "gold", label: "Hermetic Gold", emoji: "⚗️", accent: "#fbbf24", bg: "#050300", category: "Studio Originals", desc: "24K Alchemical Obsidian & Golden Ratio", company: "Hermetic Alchemy" },

    // 🌐 Tech Giants & Frontier AI
    { id: "google", label: "Google Material", emoji: "🌐", accent: "#8ab4f8", bg: "#121212", category: "Frontier AI & Tech", desc: "Material You, Gemini 4-Color & 28px Curves", company: "Google Material" },
    { id: "microsoft", label: "Microsoft Fluent", emoji: "🪟", accent: "#0078d4", bg: "#0a0d14", category: "Frontier AI & Tech", desc: "Fluent 2, Mica Glass & Win11 Specular Glow", company: "Microsoft Fluent" },
    { id: "apple", label: "Apple Cupertino", emoji: "🍎", accent: "#0a84ff", bg: "#000000", category: "Frontier AI & Tech", desc: "Cupertino HIG, VisionOS Glass & OLED", company: "Apple Cupertino" },
    { id: "openai", label: "OpenAI Slate", emoji: "✨", accent: "#10a37f", bg: "#0d0d0d", category: "Frontier AI & Tech", desc: "ChatGPT Minimalist Zinc & Emerald Mint", company: "ChatGPT Slate" },
    { id: "amazon", label: "AWS Console", emoji: "☁️", accent: "#ff9900", bg: "#0b131e", category: "Frontier AI & Tech", desc: "AWS Squid-Ink Navy, Amber Sparks & Telemetry", company: "AWS Obsidian" },
    { id: "anthropic", label: "Claude Editorial", emoji: "🏺", accent: "#d97757", bg: "#141210", category: "Frontier AI & Tech", desc: "Terracotta Obsidian, Literary Serif & Warmth", company: "Anthropic Claude" },
    { id: "xai", label: "Grok Stark Cyber", emoji: "⚡", accent: "#00d4aa", bg: "#000000", category: "Frontier AI & Tech", desc: "xAI Pitch Black & 2px Brutalist Mint Wireframes", company: "xAI Grok" },

    // ⚡ Developer & Web3 Archetypes
    { id: "dracula", label: "Dracula Gothic", emoji: "🧛", accent: "#bd93f9", bg: "#282a36", category: "Developer Archetypes", desc: "Gothic Vampire Slate & Neon Pink/Purple", company: "Gothic Developer" },
    { id: "nord", label: "Nord Glacier", emoji: "❄️", accent: "#88c0d0", bg: "#2e3440", category: "Developer Archetypes", desc: "Arctic Scandinavian Frost & Clean Polar Slate", company: "Arctic Glacier" },
    { id: "synthwave", label: "Synthwave '84", emoji: "🌴", accent: "#ff2a85", bg: "#1a102f", category: "Developer Archetypes", desc: "80s Outrun Neon Sunset & Retrowave Grid", company: "80s Neon Outrun" },
    { id: "solana", label: "Solana Matrix", emoji: "🪙", accent: "#14f195", bg: "#120924", category: "Developer Archetypes", desc: "Web3 Concentrated Liquidity & Purple/Mint", company: "Web3 DeFi Matrix" },
    { id: "monokai", label: "Monokai Sublime", emoji: "🔥", accent: "#a6e22e", bg: "#272822", category: "Developer Archetypes", desc: "Hacker Sublime Syntax Charcoal & Acid Lime", company: "Hacker Sublime" },

    { id: "rose", label: "Dusk Rose", emoji: "🥀", accent: "#fb7185", bg: "#14080c", category: "Studio Originals", desc: "Wine void, rose gold hairlines", company: "Zoth Atelier" },
    { id: "ocean", label: "Abyssal Ocean", emoji: "🌊", accent: "#22d3ee", bg: "#041018", category: "Studio Originals", desc: "Deep teal trench & sonar cyan", company: "Zoth Atelier" },
    { id: "ember", label: "Forge Ember", emoji: "🔥", accent: "#f97316", bg: "#140804", category: "Studio Originals", desc: "Volcanic slag, copper sparks", company: "Zoth Atelier" },
    { id: "paper", label: "Newsprint", emoji: "📰", accent: "#44403c", bg: "#f4efe6", category: "Studio Originals", desc: "Warm paper, ink, honest light", company: "Zoth Atelier" },
    { id: "cobalt", label: "Navy Signal", emoji: "🔷", accent: "#60a5fa", bg: "#0a1224", category: "Studio Originals", desc: "Signal-flag blue on deep navy", company: "Zoth Atelier" },
    { id: "violet", label: "Amethyst Void", emoji: "💜", accent: "#c084fc", bg: "#120818", category: "Studio Originals", desc: "Violet nebula & amethyst hairlines", company: "Zoth Atelier" },
    { id: "sage", label: "Moss Sanctum", emoji: "🌿", accent: "#86efac", bg: "#0c1410", category: "Studio Originals", desc: "Forest dusk, lichen glow", company: "Zoth Atelier" },
    { id: "copper", label: "Copper Patina", emoji: "🟠", accent: "#d97706", bg: "#160e08", category: "Studio Originals", desc: "Oxidized copper on warm slag", company: "Zoth Atelier" },
    { id: "snow", label: "Alpine Snow", emoji: "🌨️", accent: "#1e3a5f", bg: "#f5f7fb", category: "Studio Originals", desc: "Cool paper, steel ink, honest light", company: "Zoth Atelier" },
    { id: "champagne", label: "Vellum Champagne", emoji: "🥂", accent: "#8a5a2a", bg: "#f6f0e4", category: "Studio Originals", desc: "Warm vellum, cognac ink", company: "Zoth Atelier" },
    { id: "blood", label: "Crimson Ledger", emoji: "🩸", accent: "#ef4444", bg: "#140608", category: "Studio Originals", desc: "Oxblood void, ledger red", company: "Zoth Atelier" },
    { id: "jade", label: "Jade Circuit", emoji: "🟢", accent: "#2dd4bf", bg: "#06140f", category: "Studio Originals", desc: "Temple jade & teal traces", company: "Zoth Atelier" },

    { id: "meta", label: "Meta Horizon", emoji: "∞", accent: "#0668e1", bg: "#0a0e17", category: "Frontier AI & Tech", desc: "Horizon blue on midnight navy", company: "Meta" },
    { id: "nvidia", label: "NVIDIA Green", emoji: "🟩", accent: "#76b900", bg: "#0b0f0c", category: "Frontier AI & Tech", desc: "CUDA green on carbon", company: "NVIDIA" },
    { id: "huggingface", label: "Hugging Face", emoji: "🤗", accent: "#ffd21e", bg: "#0f0c08", category: "Frontier AI & Tech", desc: "Amber badge on espresso", company: "Hugging Face" },
    { id: "mistral", label: "Mistral Orange", emoji: "🌬️", accent: "#ff7a00", bg: "#140c08", category: "Frontier AI & Tech", desc: "Le Chat orange on warm black", company: "Mistral" },
    { id: "vercel", label: "Vercel Ink", emoji: "▲", accent: "#fafafa", bg: "#000000", category: "Frontier AI & Tech", desc: "Stark black, white triangle", company: "Vercel" },
    { id: "deepseek", label: "DeepSeek", emoji: "🐋", accent: "#4f8cff", bg: "#071018", category: "Frontier AI & Tech", desc: "Abyss navy & search blue", company: "DeepSeek" },

    { id: "tokyo", label: "Tokyo Night", emoji: "🌃", accent: "#7aa2f7", bg: "#1a1b26", category: "Editor Classics", desc: "Tokyo Night storm, kanagawa blue", company: "Editor" },
    { id: "catppuccin", label: "Catppuccin Mocha", emoji: "🐱", accent: "#cba6f7", bg: "#1e1e2e", category: "Editor Classics", desc: "Mocha mauve, latte foam", company: "Editor" },
    { id: "gruvbox", label: "Gruvbox Dark", emoji: "🪵", accent: "#fabd2f", bg: "#282828", category: "Editor Classics", desc: "Warm retro groove, mustard", company: "Editor" },
    { id: "solarized", label: "Solarized Night", emoji: "🌞", accent: "#268bd2", bg: "#002b36", category: "Editor Classics", desc: "Ethan Schoonover cyan-base", company: "Editor" },
    { id: "onedark", label: "One Dark", emoji: "🌑", accent: "#61afef", bg: "#282c34", category: "Editor Classics", desc: "Atom One Dark, steel blue", company: "Editor" },
    { id: "github", label: "GitHub Dark", emoji: "🐙", accent: "#58a6ff", bg: "#0d1117", category: "Editor Classics", desc: "Primer canvas, link blue", company: "Editor" },

    { id: "indigo", label: "Indigo Chapel", emoji: "💠", accent: "#818cf8", bg: "#0b0a18", category: "Studio Originals", desc: "Chapel indigo, violet glass", company: "Zoth Atelier" },
    { id: "coral", label: "Coral Dusk", emoji: "🪸", accent: "#ff6b4a", bg: "#1c0d0a", category: "Studio Originals", desc: "Sunset coral on warm soot", company: "Zoth Atelier" },
    { id: "ivory", label: "Ivory Gallery", emoji: "🦢", accent: "#3f3a32", bg: "#faf8f2", category: "Studio Originals", desc: "Gallery ivory, walnut ink", company: "Zoth Atelier" },
    { id: "ink", label: "India Ink", emoji: "🖋️", accent: "#cbd5e1", bg: "#07070b", category: "Studio Originals", desc: "Editorial black, silver nib", company: "Zoth Atelier" },
    { id: "twilight", label: "Twilight Orchid", emoji: "🌌", accent: "#c4b5fd", bg: "#12101c", category: "Studio Originals", desc: "Dusk orchid, lavender haze", company: "Zoth Atelier" },
    { id: "rust", label: "Iron Rust", emoji: "🧱", accent: "#ea580c", bg: "#1a0b06", category: "Studio Originals", desc: "Oxidized iron, furnace orange", company: "Zoth Atelier" },
    { id: "pearl", label: "Pearl Lilac", emoji: "🤍", accent: "#5b4b78", bg: "#f6f4f8", category: "Studio Originals", desc: "Cool pearl, lilac ink", company: "Zoth Atelier" },
    { id: "graphite", label: "Graphite Lead", emoji: "✏️", accent: "#a3a3a3", bg: "#1c1c1c", category: "Studio Originals", desc: "Pencil grey, studio charcoal", company: "Zoth Atelier" },

    { id: "perplexity", label: "Perplexity Teal", emoji: "🔎", accent: "#20808d", bg: "#0b141c", category: "Frontier AI & Tech", desc: "Search teal on deep slate", company: "Perplexity" },
    { id: "cursor", label: "Cursor Agent", emoji: "🖱️", accent: "#7c5cfc", bg: "#0b0b10", category: "Frontier AI & Tech", desc: "Agent violet on near-black", company: "Cursor" },
    { id: "groq", label: "Groq LPU", emoji: "⚡", accent: "#f55036", bg: "#120a08", category: "Frontier AI & Tech", desc: "LPU scarlet on warm carbon", company: "Groq" },
    { id: "cohere", label: "Cohere Coral", emoji: "🧬", accent: "#d946ef", bg: "#120e18", category: "Frontier AI & Tech", desc: "Magenta research, ink purple", company: "Cohere" },
    { id: "stripe", label: "Stripe Navy", emoji: "💳", accent: "#00d4ff", bg: "#0a2540", category: "Frontier AI & Tech", desc: "Payments navy, electric cyan", company: "Stripe" },
    { id: "cloudflare", label: "Cloudflare Orange", emoji: "☁️", accent: "#f38020", bg: "#0a0e18", category: "Frontier AI & Tech", desc: "Edge orange on midnight", company: "Cloudflare" },

    { id: "rosepine", label: "Rosé Pine", emoji: "🌲", accent: "#ebbcba", bg: "#191724", category: "Editor Classics", desc: "Pine moon, rosewood foam", company: "Editor" },
    { id: "everforest", label: "Everforest", emoji: "🌳", accent: "#a7c080", bg: "#2d353b", category: "Editor Classics", desc: "Soft forest, moss status", company: "Editor" },
    { id: "ayu", label: "Ayu Mirage", emoji: "🏜️", accent: "#e6b450", bg: "#0f1419", category: "Editor Classics", desc: "Mirage gold on desert night", company: "Editor" },
    { id: "nightowl", label: "Night Owl", emoji: "🦉", accent: "#82aaff", bg: "#011627", category: "Editor Classics", desc: "Sarah Drasner night, ice blue", company: "Editor" },
    { id: "oxocarbon", label: "Oxocarbon", emoji: "⬛", accent: "#be95ff", bg: "#161616", category: "Editor Classics", desc: "IBM carbon, magenta wire", company: "Editor" },
    { id: "flexoki", label: "Flexoki", emoji: "📜", accent: "#d14d41", bg: "#100f0f", category: "Editor Classics", desc: "Inkwell red, analog paper-dark", company: "Editor" }
  ];

  // Expose global themes registry for all sub-tools & UI builders
  window.ZOTH_THEMES = THEMES;

  function getStoredTheme() {
    try {
      var saved = localStorage.getItem("zoth-theme");
      if (saved && THEMES.some(function(t) { return t.id === saved; })) {
        return saved;
      }
    } catch (e) {}
    return "dark";
  }

  function applyTheme(themeId) {
    if (!THEMES.some(function(t) { return t.id === themeId; })) {
      themeId = "dark";
    }

    document.documentElement.setAttribute("data-theme", themeId);
    if (document.body) {
      document.body.setAttribute("data-theme", themeId);
      document.body.className = document.body.className
        .replace(/\btheme-[a-z0-9_-]+\b/g, "")
        .trim() + " theme-" + themeId;
    }
    document.documentElement.className = document.documentElement.className
      .replace(/\btheme-[a-z0-9_-]+\b/g, "")
      .trim() + " theme-" + themeId;
    var isLight = themeId === "light" || themeId === "paper" || themeId === "snow" || themeId === "champagne" || themeId === "ivory" || themeId === "pearl";
    document.documentElement.classList.toggle("dark", !isLight);
    document.documentElement.classList.toggle("light", isLight);

    document.documentElement.style.colorScheme = isLight ? "light" : "dark";

    try {
      localStorage.setItem("zoth-theme", themeId);
    } catch (e) {}

    var meta = document.querySelector('meta[name="theme-color"]');
    var currentThemeObj = THEMES.find(function(t) { return t.id === themeId; });
    if (meta && currentThemeObj) {
      meta.setAttribute("content", currentThemeObj.bg || currentThemeObj.color || "#05070e");
    }

    // Sync all theme buttons on the page
    document.querySelectorAll("[data-theme-id]").forEach(function(btn) {
      var btnId = btn.getAttribute("data-theme-id");
      var isThis = btnId === themeId;
      btn.classList.toggle("active", isThis);
      btn.setAttribute("aria-pressed", isThis ? "true" : "false");
    });

    // Sync all dropdown labels & emoji
    document.querySelectorAll(".current-theme-emoji").forEach(function(el) {
      el.textContent = currentThemeObj.emoji;
    });
    document.querySelectorAll(".current-theme-label").forEach(function(el) {
      el.textContent = currentThemeObj.label;
    });
    document.querySelectorAll(".current-theme-swatch").forEach(function(el) {
      el.style.backgroundColor = currentThemeObj.accent;
    });

    // Notify any WebGL / Canvas / Audio layers
    window.dispatchEvent(new CustomEvent("zoth-theme-change", {
      detail: { theme: themeId, themeObj: currentThemeObj }
    }));
  }

  window.getZothTheme = function() {
    return document.documentElement.getAttribute("data-theme") || getStoredTheme();
  };

  window.setZothTheme = function(themeId) {
    applyTheme(themeId);
  };

  window.cycleZothTheme = function() {
    var cur = window.getZothTheme();
    var idx = THEMES.findIndex(function(t) { return t.id === cur; });
    if (idx === -1) idx = 0;
    var next = THEMES[(idx + 1) % THEMES.length].id;
    applyTheme(next);
  };

  // Dynamic Base Path Detection for Local file:// & Web HTTP
  function getAssetsBase() {
    if (window.location.protocol === "file:") {
      var scripts = document.querySelectorAll("script[src]");
      for (var i = 0; i < scripts.length; i++) {
        var src = scripts[i].getAttribute("src") || "";
        if (src.indexOf("zoth-theme.js") !== -1 || src.indexOf("zoth-nav.js") !== -1) {
          var clean = src.split("?")[0];
          var idx = clean.lastIndexOf("/");
          if (idx !== -1) return clean.substring(0, idx + 1);
          return "./";
        }
      }
      return "./";
    }
    return "/assets/";
  }

  // Ensure Theme Style Sheets
  function ensureStylesheet(id, relHref) {
    if (document.getElementById(id)) return;
    var base = getAssetsBase();
    var href = relHref.startsWith("/assets/") ? relHref.replace(/^\/assets\//, base) : relHref;
    var link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  }

  function loadThemeFx() {
    ensureStylesheet("zoth-theme-core-css", "/assets/zoth-theme.css?v=13");
    ensureStylesheet("zoth-theme-fx-css", "/assets/zoth-theme-fx.css?v=10");
    ensureStylesheet("zoth-theme-light-css", "/assets/zoth-theme-light.css?v=13");
    ensureStylesheet("zoth-theme-transformer-css", "/assets/zoth-theme-transformer.css?v=13");
    ensureStylesheet("zoth-theme-pack-frontier-css", "/assets/zoth-theme-pack-frontier.css?v=4");
    ensureStylesheet("zoth-theme-pack-dev-css", "/assets/zoth-theme-pack-dev.css?v=4");
    ensureStylesheet("zoth-theme-pack-atelier-css", "/assets/zoth-theme-pack-atelier.css?v=4");
    ensureStylesheet("zoth-theme-pack-labs-css", "/assets/zoth-theme-pack-labs.css?v=4");
    ensureStylesheet("zoth-theme-pack-editors-css", "/assets/zoth-theme-pack-editors.css?v=4");
    ensureStylesheet("zoth-theme-pack-atelier2-css", "/assets/zoth-theme-pack-atelier2.css?v=4");
    ensureStylesheet("zoth-theme-pack-labs2-css", "/assets/zoth-theme-pack-labs2.css?v=4");
    ensureStylesheet("zoth-theme-pack-editors2-css", "/assets/zoth-theme-pack-editors2.css?v=4");
    ensureStylesheet("zoth-magic-ui-css", "/assets/zoth-magic-ui.css?v=1");
    ensureStylesheet("zoth-luxury-fx-css", "/assets/zoth-luxury-fx.css?v=1");
    ensureStylesheet("zoth-theme-life-css", "/assets/zoth-theme-life.css?v=2");
    pinLifeSheet();
  }

  function pinLifeSheet() {
    var lifeSheet = document.getElementById("zoth-theme-life-css");
    if (lifeSheet && lifeSheet.parentNode) lifeSheet.parentNode.appendChild(lifeSheet);

    var base = getAssetsBase();
    if (!document.querySelector('script[src*="zoth-spotlight.js"]')) {
      var spot = document.createElement("script");
      spot.src = base + "zoth-spotlight.js?v=1";
      spot.defer = true;
      document.head.appendChild(spot);
    }

    if (window.ZothThemeFx) return;
    var existing = document.querySelector('script[src*="zoth-theme-fx.js"]');
    if (existing) return;
    var script = document.createElement("script");
    script.src = base + "zoth-theme-fx.js?v=10";
    script.async = true;
    document.head.appendChild(script);
  }

  // Keyboard shortcut: Shift+T
  document.addEventListener("keydown", function (e) {
    if (e.shiftKey && (e.key === "T" || e.key === "t") && !["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)) {
      window.cycleZothTheme();
    }
  });

  // Global click event delegation for theme buttons
  document.addEventListener("click", function (e) {
    var themeBtn = e.target.closest("[data-theme-id]");
    if (themeBtn) {
      var targetTheme = themeBtn.getAttribute("data-theme-id");
      if (targetTheme) {
        e.preventDefault();
        applyTheme(targetTheme);
        return;
      }
    }

    var cycleBtn = e.target.closest(".zoth-topbar-theme-cycle");
    if (cycleBtn) {
      e.preventDefault();
      window.cycleZothTheme();
      return;
    }
  });

  function mountThemeUI() {
    var curTheme = window.getZothTheme();
    var curThemeObj = THEMES.find(function(t) { return t.id === curTheme; }) || THEMES[0];

    // Populate Mobile Drawer Theme Grid
    var drawerGrid = document.querySelector(".drawer-theme-grid");
    if (drawerGrid) {
      drawerGrid.innerHTML = THEMES.map(function (t) {
        var isActive = t.id === curTheme;
        return '<button class="drawer-theme-btn' + (isActive ? ' active' : '') + '" data-theme-id="' + t.id + '" data-theme-label="' + t.label.toLowerCase() + '" data-theme-cat="' + t.category.toLowerCase() + '" type="button" aria-pressed="' + isActive + '"><span class="d-swatch" style="background:' + t.accent + '"></span><span class="d-emoji">' + t.emoji + '</span><span class="d-label">' + t.label + '</span></button>';
      }).join("");
    }

    applyTheme(curTheme);

    // Cyberpunk HUD Embedded Workspace Auto-Adapter
    try {
      var isEmbeddedInHUD = (window.self !== window.top) || window.location.search.indexOf('embed=1') !== -1 || window.location.search.indexOf('in_hud=1') !== -1;
      if (isEmbeddedInHUD) {
        document.documentElement.classList.add('hud-embedded-mode');
        if (document.body) document.body.classList.add('in-hud', 'hud-embedded-view');

        window.addEventListener('message', function (ev) {
          if (ev && ev.data && ev.data.type === 'ZOTH_HUD_THEME_CHANGE' && ev.data.theme) {
            applyTheme(ev.data.theme);
          }
        });
      }
    } catch (e) {}
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      loadThemeFx();
      pinLifeSheet();
      mountThemeUI();
    });
  } else {
    loadThemeFx();
    pinLifeSheet();
    mountThemeUI();
  }
})();

