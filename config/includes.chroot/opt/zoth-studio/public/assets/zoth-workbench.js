/**
 * ⚡ Zoth Workbench, Command Palette & Interactive Tool Engine (v3.0)
 * Provides:
 * 1. Universal Command Palette (Ctrl+K / Cmd+K) with fuzzy search across all workstations
 * 2. Floating Action Dock (FABs) & Mobile Workbench Controls
 * 3. Slide-out Workstation Control Drawer with Quick Tool Palette Shortcuts
 * 4. Multi-Theme Dynamic Styling (Dark, Light, Matrix, Gold) with zero FOUC
 * 5. Config Modals & Desktop App Incentive Subsystem
 */
(function () {
  'use strict';

  try {
    if (window.self !== window.top) return;
  } catch (e) {
    return;
  }
  if (/^\/workspaces\//.test(window.location.pathname || '')) return;

  function getAssetsBase() {
    if (window.location.protocol === "file:") {
      var scripts = document.querySelectorAll("script[src]");
      for (var i = 0; i < scripts.length; i++) {
        var src = scripts[i].getAttribute("src") || "";
        if (src.indexOf("zoth-workbench.js") !== -1 || src.indexOf("zoth-nav.js") !== -1) {
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

  function ensureWorkbenchCss() {
    if (!document.querySelector('link[href*="zoth-workbench.css"]')) {
      var base = getAssetsBase();
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = base + 'zoth-workbench.css?v=20260829';
      document.head.appendChild(link);
    }
  }

  ensureWorkbenchCss();

  // ── 1. Command Palette Action Directory ──
  var COMMAND_ITEMS = [
    // Workstations & 3D Tools
    {
      group: 'Workstations & 3D Tools',
      id: 'vos',
      title: '💻 vOS Sandbox & WebContainer',
      desc: 'In-browser WebAssembly virtual OS, POSIX shell & zero-cloud compiler',
      badge: 'vOS WASM',
      href: '/studio/vos-sandbox.html',
      keywords: 'vos sandbox webcontainer webassembly ide compiler react three synth shell'
    },
    {
      group: 'Workstations & 3D Tools',
      id: 'webgen',
      title: '⚡ WebGen Studio',
      desc: 'Interactive PTY terminal & autonomous website builder',
      badge: 'FOUNDRY',
      href: '/studio/webgen.html',
      keywords: 'webgen website builder pty terminal generative html css astro'
    },
    {
      group: 'Workstations & 3D Tools',
      id: 'cockpit',
      title: '🪐 The Cockpit',
      desc: '21-Agent autonomous swarm workspace, crons & pipelines',
      badge: 'SWARM',
      href: '/studio/cockpit.html',
      keywords: 'cockpit swarm agents workspace automation 21 tools terminal'
    },
    {
      group: 'Workstations & 3D Tools',
      id: 'swarm',
      title: '🌐 3D Swarm Battle Arena',
      desc: 'Real-time WebGL kinetic multi-agent battle arena',
      badge: '3D ARENA',
      href: '/studio/swarm.html',
      keywords: 'swarm 3d webgl kinetic arena orbital boids nodes simulation'
    },
    {
      group: 'Workstations & 3D Tools',
      id: 'consensus',
      title: '⚔️ Consensus Arena',
      desc: '3-Agent triangulation & Python AST synthesis engine',
      badge: 'ARENA',
      href: '/studio/consensus.html',
      keywords: 'consensus arena triangulation ast python debate arbitration'
    },
    {
      group: 'Workstations & 3D Tools',
      id: 'nexus3d',
      title: '📐 Nexus 3D Omniverse',
      desc: 'CAD-grade 3D WebGL viewport, CSG & AI mesh generator',
      badge: 'CAD 3D',
      href: '/studio/nexus-3d.html',
      keywords: 'nexus 3d cad mesh modeling webgl gltf obj generator'
    },
    {
      group: 'Workstations & 3D Tools',
      id: 'omnipost',
      title: '🎬 OmniPost 2.0 Video',
      desc: '60 FPS social video studio, motion keyframes & clips',
      badge: 'VIDEO',
      href: '/studio/omnipost.html',
      keywords: 'omnipost video 60fps render animation motion canvas'
    },
    {
      group: 'Workstations & 3D Tools',
      id: 'studiodir',
      title: '🛠️ Studio Workstation Directory',
      desc: 'Directory of all 14+ visual workstations & DAGs',
      badge: 'STUDIO',
      href: '/studio/',
      keywords: 'studio directory workstations visual tools'
    },

    // Security & Multi-Chain Bridges
    {
      group: 'Security & Network Bridges',
      id: 'simplex',
      title: '🔒 SimpleX ↔ Matrix Bridge',
      desc: 'Zero-Knowledge E2EE SimpleX, Matrix & Swarm QR gateway',
      badge: 'E2EE',
      href: '/secure-comms/',
      keywords: 'simplex matrix bridge e2ee secure encryption messaging chat'
    },
    {
      group: 'Security & Network Bridges',
      id: 'web3',
      title: '🪙 Web3 & Solana Swarm Bridge',
      desc: 'Live Solana TPS ticker, price matrix & session allowances',
      badge: 'WEB3',
      href: '/studio/web3-hub.html',
      keywords: 'web3 solana bridge crypto tps ticker phantom wallet tokens'
    },
    {
      group: 'Security & Network Bridges',
      id: 'vault',
      title: '🔐 Sovereign BYOK Key Vault',
      desc: 'Argon2id encrypted local hardware key container (zero cloud)',
      badge: 'VAULT',
      href: '/vault/',
      keywords: 'vault byok keys secrets argon2id encryption hardware security'
    },
    {
      group: 'Security & Network Bridges',
      id: 'signal',
      title: '📡 Signal Swarm Bridge',
      desc: 'Mobile phone command deck with live SSE & voice memos',
      badge: 'SIGNAL',
      href: '/signal/',
      keywords: 'signal bridge mobile voice sse streaming phone remote'
    },
    {
      group: 'Security & Network Bridges',
      id: 'adytum',
      title: '🏛️ Adytum Sanctum',
      desc: 'Keys 0–21 offline hardware gateway & architectural rite',
      badge: 'SANCTUM',
      href: '/adytum/',
      keywords: 'adytum sanctum keys hardware offline rite cryptography'
    },

    // Core Intelligence & Pantheon
    {
      group: 'Core Intelligence & Neural Stratum',
      id: 'azoth',
      title: '🔮 Master Azoth Core',
      desc: 'Sovereign alchemical AI core & multi-agent synthesis engine',
      badge: 'AZOTH',
      href: '/zoth/',
      keywords: 'master azoth core alchemical intelligence sovereign prime'
    },
    {
      group: 'Core Intelligence & Neural Stratum',
      id: 'agents',
      title: '⚡ 21-Agent Pantheon',
      desc: 'Autonomous AI archetypes with live cognitive test sandboxes',
      badge: 'PANTHEON',
      href: '/agents/',
      keywords: 'agents pantheon 21 models archetypes sandboxes'
    },
    {
      group: 'Core Intelligence & Neural Stratum',
      id: 'memory',
      title: '🧠 Netrunner Memory World',
      desc: 'Biomorphic associative neural graph & episodic stratum',
      badge: 'MEMORY',
      href: '/memory/',
      keywords: 'netrunner memory associative graph causal stdp synapses'
    },
    {
      group: 'Core Intelligence & Neural Stratum',
      id: 'webgpu',
      title: '⚡ Local WebGPU AI',
      desc: 'Client-side private browser tensor shaders (360M Micro)',
      badge: 'WEBGPU',
      href: '/ai-webgpu.html',
      keywords: 'webgpu local ai in-browser tensor transformers shaders private'
    },
    {
      group: 'Core Intelligence & Neural Stratum',
      id: 'pets',
      title: '💎 Companion Pets 3D',
      desc: '16 Volumetric mascot spirits, task vibes & soundboards',
      badge: '3D PETS',
      href: '/pets/',
      keywords: 'pets companion 3d figurines mascot spirits task vibes audio'
    },

    // Documentation & Community
    {
      group: 'Documentation & Ecosystem',
      id: 'docs',
      title: '📚 Operator Documentation',
      desc: 'Master operator manual, port matrix & 1-click install scripts',
      badge: 'DOCS',
      href: '/docs/',
      keywords: 'docs documentation manual ports install guide reference'
    },
    {
      group: 'Documentation & Ecosystem',
      id: 'articles',
      title: '📜 Engineering Articles',
      desc: 'Architectural deep-dives, Rust AST healing & benchmarks',
      badge: 'ARTICLES',
      href: '/articles/',
      keywords: 'articles whitepapers engineering benchmarks ast rust'
    },
    {
      group: 'Documentation & Ecosystem',
      id: 'social',
      title: '🌌 Community Social Wall',
      desc: 'Builder dispatches, community transmissions & showcase',
      badge: 'SOCIAL',
      href: '/social/',
      keywords: 'social wall builder dispatches community showcase'
    },
    {
      group: 'Documentation & Ecosystem',
      id: 'comic',
      title: '🎨 AZOTH Anime Comic Series',
      desc: 'Season 1 Episode 1: Genesis in Silicon Rain (Cinematic Audio)',
      badge: 'COMIC',
      href: '/comic/',
      keywords: 'comic manga anime video episodes audio cinematic azoth'
    },

    // Theme & Developer Tools
    {
      group: 'Themes & Developer Controls',
      id: 'theme-dark',
      title: '🌙 Switch Theme: Dark',
      desc: 'Midnight Void & Electric Cyan / Violet Nebula',
      badge: 'THEME',
      action: function () { if (window.setZothTheme) window.setZothTheme('dark'); },
      keywords: 'theme dark mode midnight black cyan'
    },
    {
      group: 'Themes & Developer Controls',
      id: 'theme-light',
      title: '☀️ Switch Theme: Light',
      desc: 'Solar Alabaster & Pristine Architectural Minimalist',
      badge: 'THEME',
      action: function () { if (window.setZothTheme) window.setZothTheme('light'); },
      keywords: 'theme light mode white solar day'
    },
    {
      group: 'Themes & Developer Controls',
      id: 'theme-matrix',
      title: '📟 Switch Theme: Matrix',
      desc: 'Phosphor CRT Terminal & 90s Cyberpunk Green',
      badge: 'THEME',
      action: function () { if (window.setZothTheme) window.setZothTheme('matrix'); },
      keywords: 'theme matrix green phosphor hacker terminal cyberpunk'
    },
    {
      group: 'Themes & Developer Controls',
      id: 'theme-gold',
      title: '⚗️ Switch Theme: Gold',
      desc: 'Hermetic Alchemical Amber & 24K Celestial Obsidian',
      badge: 'THEME',
      action: function () { if (window.setZothTheme) window.setZothTheme('gold'); },
      keywords: 'theme gold amber hermetic alchemy 24k'
    },
    {
      group: 'Themes & Developer Controls',
      id: 'theme-google',
      title: '🌐 Switch Theme: Google Material You',
      desc: 'Material 3 Tonal Elevation & Google 4-Color Accents',
      badge: 'THEME',
      action: function () { if (window.setZothTheme) window.setZothTheme('google'); },
      keywords: 'theme google material you android search cloud blue red yellow green'
    },
    {
      group: 'Themes & Developer Controls',
      id: 'theme-microsoft',
      title: '🪟 Switch Theme: Microsoft Fluent',
      desc: 'Mica & Acrylic Specular Translucency with Segoe UI',
      badge: 'THEME',
      action: function () { if (window.setZothTheme) window.setZothTheme('microsoft'); },
      keywords: 'theme microsoft fluent windows 11 mica acrylic azure segoe'
    },
    {
      group: 'Themes & Developer Controls',
      id: 'theme-apple',
      title: '🍎 Switch Theme: Apple Cupertino',
      desc: 'Continuous Squircle OLED Obsidian & Frosted Glass HIG',
      badge: 'THEME',
      action: function () { if (window.setZothTheme) window.setZothTheme('apple'); },
      keywords: 'theme apple cupertino macos ios sf pro glass squircle oled'
    },
    {
      group: 'Themes & Developer Controls',
      id: 'theme-openai',
      title: '✨ Switch Theme: OpenAI Slate',
      desc: 'ChatGPT Minimalist Dark Slate & Emerald Neural Phosphors',
      badge: 'THEME',
      action: function () { if (window.setZothTheme) window.setZothTheme('openai'); },
      keywords: 'theme openai chatgpt slate emerald mint minimalist zinc'
    },
    {
      group: 'Themes & Developer Controls',
      id: 'theme-amazon',
      title: '☁️ Switch Theme: AWS Cloud Obsidian',
      desc: 'Technical Builder Console Density & Radiant AWS Amber',
      badge: 'THEME',
      action: function () { if (window.setZothTheme) window.setZothTheme('amazon'); },
      keywords: 'theme amazon aws cloud obsidian amber orange console telemetry'
    },
    {
      group: 'Themes & Developer Controls',
      id: 'annotator',
      title: '🛠️ Toggle Visual Annotator (Shift+A)',
      desc: 'Screen markup, bug pinpoints & markdown notes canvas',
      badge: 'DEV TOOL',
      action: function () {
        if (window.ZothAnnotator && typeof window.ZothAnnotator.toggle === 'function') {
          window.ZothAnnotator.toggle();
        } else {
          window.location.hash = 'annotate';
          window.location.reload();
        }
      },
      keywords: 'annotator markup notes feedback bug draw shift a'
    },
    {
      group: 'Themes & Developer Controls',
      id: 'open-sidebar',
      title: '⚡ Open Floating Tool Sidebar',
      desc: 'Toggle workstation slide-out controls & quick switcher drawer',
      badge: 'DRAWER',
      action: function () {
        openToolSidebar();
      },
      keywords: 'sidebar drawer tools controls menu settings'
    }
  ];

  // ── 2. Universal Command Palette Engine (Ctrl+K / Cmd+K) ──
  var paletteIndex = 0;
  var filteredItems = [];

  function ensureCommandPaletteModal() {
    var backdrop = document.getElementById('zothPaletteBackdrop');
    if (backdrop) return backdrop;

    backdrop = document.createElement('div');
    backdrop.id = 'zothPaletteBackdrop';
    backdrop.className = 'zoth-palette-backdrop';
    backdrop.innerHTML = [
      '<div class="zoth-palette-card" role="dialog" aria-modal="true" aria-label="Command Palette">',
      '  <div class="zoth-palette-header">',
      '    <span class="zoth-palette-search-icon">🔍</span>',
      '    <input type="text" id="zothPaletteInput" class="zoth-palette-input" placeholder="Type a command or workstation name... (e.g. WebGen, Swarm, Vault, Matrix)" autocomplete="off" spellcheck="false" />',
      '    <button type="button" class="zoth-palette-esc-badge" id="zothPaletteEscBtn" title="Close (Esc)">ESC</button>',
      '  </div>',
      '  <div class="zoth-palette-list" id="zothPaletteList"></div>',
      '  <div class="zoth-palette-footer">',
      '    <div class="zoth-palette-footer-keys">',
      '      <span class="zoth-palette-key-pill"><kbd>↑</kbd><kbd>↓</kbd> Navigate</span>',
      '      <span class="zoth-palette-key-pill"><kbd>↵</kbd> Open</span>',
      '      <span class="zoth-palette-key-pill"><kbd>Esc</kbd> Close</span>',
      '    </div>',
      '    <div style="display:flex;align-items:center;gap:8px;">',
      '      <span><kbd>Shift+T</kbd> Theme</span>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join('\n');

    document.body.appendChild(backdrop);

    // Event listeners
    backdrop.addEventListener('click', function (e) {
      if (e.target === backdrop) closeCommandPalette();
    });

    var escBtn = document.getElementById('zothPaletteEscBtn');
    if (escBtn) escBtn.addEventListener('click', closeCommandPalette);

    var input = document.getElementById('zothPaletteInput');
    if (input) {
      input.addEventListener('input', function () {
        renderPaletteItems(input.value.trim());
      });

      input.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (filteredItems.length > 0) {
            paletteIndex = (paletteIndex + 1) % filteredItems.length;
            updateSelectedPaletteItem();
          }
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (filteredItems.length > 0) {
            paletteIndex = (paletteIndex - 1 + filteredItems.length) % filteredItems.length;
            updateSelectedPaletteItem();
          }
        } else if (e.key === 'Enter') {
          e.preventDefault();
          executeSelectedPaletteItem();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          closeCommandPalette();
        }
      });
    }

    return backdrop;
  }

  function renderPaletteItems(filterText) {
    var list = document.getElementById('zothPaletteList');
    if (!list) return;

    var query = (filterText || '').toLowerCase();
    filteredItems = COMMAND_ITEMS.filter(function (item) {
      if (!query) return true;
      var haystack = (item.title + ' ' + item.desc + ' ' + item.keywords + ' ' + item.group).toLowerCase();
      return query.split(' ').every(function (word) { return haystack.indexOf(word) !== -1; });
    });

    paletteIndex = 0;
    list.innerHTML = '';

    if (filteredItems.length === 0) {
      list.innerHTML = '<div style="padding:28px 16px;text-align:center;color:var(--muted);font-size:0.88rem;font-family:var(--font-theme-mono);">No matching workstations or tools found for "<strong>' + filterText + '</strong>".</div>';
      return;
    }

    var currentGroup = '';
    filteredItems.forEach(function (item, idx) {
      if (item.group !== currentGroup) {
        currentGroup = item.group;
        var grpHeading = document.createElement('div');
        grpHeading.className = 'zoth-palette-group-heading';
        grpHeading.textContent = currentGroup;
        list.appendChild(grpHeading);
      }

      var el = document.createElement('div');
      el.className = 'zoth-palette-item' + (idx === 0 ? ' selected' : '');
      el.dataset.index = String(idx);
      el.innerHTML = [
        '<div class="zoth-palette-item-left">',
        '  <div class="zoth-palette-item-text">',
        '    <span class="zoth-palette-item-title">' + item.title + '</span>',
        '    <span class="zoth-palette-item-desc">' + item.desc + '</span>',
        '  </div>',
        '</div>',
        '<span class="zoth-palette-badge">' + item.badge + '</span>'
      ].join('');

      el.addEventListener('click', function () {
        paletteIndex = idx;
        executeSelectedPaletteItem();
      });

      el.addEventListener('mouseenter', function () {
        paletteIndex = idx;
        updateSelectedPaletteItem();
      });

      list.appendChild(el);
    });
  }

  function updateSelectedPaletteItem() {
    var items = document.querySelectorAll('.zoth-palette-item');
    items.forEach(function (item) {
      var idx = parseInt(item.dataset.index, 10);
      var isSelected = idx === paletteIndex;
      item.classList.toggle('selected', isSelected);
      if (isSelected) {
        item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    });
  }

  function executeSelectedPaletteItem() {
    var item = filteredItems[paletteIndex];
    if (!item) return;

    closeCommandPalette();

    if (typeof item.action === 'function') {
      item.action();
    } else if (item.href) {
      window.location.href = item.href;
    }
  }

  function openCommandPalette() {
    var backdrop = ensureCommandPaletteModal();
    renderPaletteItems('');
    backdrop.style.display = 'flex';
    setTimeout(function () {
      backdrop.classList.add('open');
      var input = document.getElementById('zothPaletteInput');
      if (input) {
        input.value = '';
        input.focus();
      }
    }, 20);
  }

  function closeCommandPalette() {
    var backdrop = document.getElementById('zothPaletteBackdrop');
    if (!backdrop) return;
    backdrop.classList.remove('open');
    setTimeout(function () {
      backdrop.style.display = 'none';
    }, 180);
  }

  function toggleCommandPalette() {
    var backdrop = document.getElementById('zothPaletteBackdrop');
    if (backdrop && backdrop.classList.contains('open')) {
      closeCommandPalette();
    } else {
      openCommandPalette();
    }
  }

  // Global Keyboard Shortcut: Ctrl+K or Cmd+K
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K' || e.code === 'KeyK')) {
      e.preventDefault();
      toggleCommandPalette();
    } else if (e.key === 'Escape') {
      closeCommandPalette();
      closeToolSidebar();
      closeConfigModal();
    }
  });

  // ── 3. Sidebar Menu & Workstation Controls ──
  function toggleToolSidebar(id) {
    var sidebar = document.getElementById(id || 'zothToolSidebar');
    if (!sidebar) {
      autoInjectWorkbenchElements();
      sidebar = document.getElementById(id || 'zothToolSidebar');
    }
    if (!sidebar) return;
    sidebar.classList.toggle('open');
  }

  function closeToolSidebar(id) {
    var sidebar = document.getElementById(id || 'zothToolSidebar');
    if (!sidebar) return;
    sidebar.classList.remove('open');
  }

  function openToolSidebar(id) {
    var sidebar = document.getElementById(id || 'zothToolSidebar');
    if (!sidebar) {
      autoInjectWorkbenchElements();
      sidebar = document.getElementById(id || 'zothToolSidebar');
    }
    if (!sidebar) return;
    sidebar.classList.add('open');
  }

  // ── 4. Dynamic Config Modal ──
  function openConfigModal(title, desc, formHtml, onApplyCallback) {
    var backdrop = document.getElementById('zothConfigModalBackdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.id = 'zothConfigModalBackdrop';
      backdrop.className = 'zoth-config-modal-backdrop';
      backdrop.innerHTML = [
        '<div class="zoth-config-modal-card">',
        '  <div class="zoth-config-modal-header">',
        '    <h3 class="zoth-config-modal-title" id="zothConfigModalTitle">⚙️ Configuration</h3>',
        '    <button type="button" class="zoth-sidebar-close" id="zothConfigModalClose" aria-label="Close modal">✕</button>',
        '  </div>',
        '  <p class="zoth-config-modal-desc" id="zothConfigModalDesc"></p>',
        '  <div id="zothConfigModalForm"></div>',
        '  <div class="zoth-desktop-unlock-card">',
        '    <div class="zoth-desktop-unlock-title">🖥️ Unlock Full Uncapped Desktop Engine</div>',
        '    <div class="zoth-desktop-unlock-text">Run GPU shaders, multi-threaded subagent workers, and local hardware keystores offline on your machine with zero limits.</div>',
        '    <button type="button" class="zoth-pill-cta" style="width:fit-content;margin-top:4px;" onclick="if(window.ZothGate)window.ZothGate.show()">🚀 Get Desktop App</button>',
        '  </div>',
        '  <div class="zoth-modal-actions">',
        '    <button type="button" class="zoth-fab-btn" id="zothConfigModalCancel" style="padding:8px 16px;">Cancel</button>',
        '    <button type="button" class="zoth-fab-btn primary" id="zothConfigModalApply" style="padding:8px 18px;">Apply Settings ✓</button>',
        '  </div>',
        '</div>'
      ].join('\n');
      document.body.appendChild(backdrop);

      backdrop.addEventListener('click', function (e) {
        if (e.target === backdrop) closeConfigModal();
      });
      document.getElementById('zothConfigModalClose').addEventListener('click', closeConfigModal);
      document.getElementById('zothConfigModalCancel').addEventListener('click', closeConfigModal);
    }

    document.getElementById('zothConfigModalTitle').innerHTML = title || '⚙️ Tool Configuration';
    document.getElementById('zothConfigModalDesc').innerHTML = desc || 'Customize parameters and runtime bindings for this workstation.';
    document.getElementById('zothConfigModalForm').innerHTML = formHtml || '';

    var applyBtn = document.getElementById('zothConfigModalApply');
    var newApply = applyBtn.cloneNode(true);
    applyBtn.parentNode.replaceChild(newApply, applyBtn);
    newApply.addEventListener('click', function () {
      if (typeof onApplyCallback === 'function') {
        onApplyCallback();
      }
      closeConfigModal();
    });

    backdrop.classList.add('open');
    backdrop.style.display = 'flex';
  }

  function closeConfigModal() {
    var backdrop = document.getElementById('zothConfigModalBackdrop');
    if (!backdrop) return;
    backdrop.classList.remove('open');
    setTimeout(function () {
      backdrop.style.display = 'none';
    }, 220);
  }

  // ── 5. Auto-inject Floating Workbench Controls & Drawer ──
  function autoInjectWorkbenchElements() {
    ensureWorkbenchCss();
    ensureCommandPaletteModal();

    var pathname = window.location.pathname || '';
    var isToolPage = pathname.includes('nexus-3d') || pathname.includes('swarm') || pathname.includes('webgen') || pathname.includes('site-generator') || pathname.includes('pet-studio') || pathname.includes('cockpit') || pathname.includes('consensus') || pathname.includes('web3-hub') || pathname.includes('omnipost') || pathname.includes('netrunner-memory');

    // 1. Floating Desktop App Incentive Pill at bottom on tool pages
    if (isToolPage && !document.getElementById('zothDesktopPromptPill')) {
      var pill = document.createElement('div');
      pill.id = 'zothDesktopPromptPill';
      pill.className = 'zoth-desktop-prompt-pill';
      pill.innerHTML = [
        '<span class="zoth-pill-badge">BETA PREVIEW</span>',
        '<span class="zoth-pill-text">Open on Desktop for Full Hardware & GPU Engine</span>',
        '<button type="button" class="zoth-pill-cta" onclick="if(window.ZothGate)window.ZothGate.show()">Get Desktop App ↗</button>'
      ].join('');
      document.body.appendChild(pill);
    }

    // 2. Floating Action Dock (Top Right) on tool pages
    if (isToolPage && !document.getElementById('zothFabDock')) {
      var dock = document.createElement('div');
      dock.id = 'zothFabDock';
      dock.className = 'zoth-fab-dock';
      dock.innerHTML = [
        '<button type="button" class="zoth-fab-btn primary" onclick="ZothWorkbench.togglePalette()" title="Command Palette (Ctrl+K)"><span>🔍</span> <span style="font-size:0.78rem;font-weight:700;">Palette</span> <span style="font-size:0.68rem;opacity:0.8;font-family:monospace;">Ctrl+K</span></button>',
        '<button type="button" class="zoth-fab-btn" onclick="ZothWorkbench.toggleSidebar()" title="Toggle Workstation Settings & Palette Drawer">⚙️ <span style="font-size:0.78rem;font-weight:700;">Tool Menu</span></button>',
        '<button type="button" class="zoth-fab-btn gold" onclick="if(window.ZothGate)window.ZothGate.show()" title="Get Desktop Version">🖥️ <span style="font-size:0.78rem;font-weight:700;">Desktop App</span></button>'
      ].join('');
      document.body.appendChild(dock);
    }

    // 3. Slide-out Tool Sidebar Drawer
    if (!document.getElementById('zothToolSidebar')) {
      var sidebar = document.createElement('aside');
      sidebar.id = 'zothToolSidebar';
      sidebar.className = 'zoth-tool-sidebar';
      
      var toolTitle = '🛠️ Workstation Controls';
      var toolOptionsHtml = '';

      if (pathname.includes('webgen') || pathname.includes('site-generator')) {
        toolTitle = '⚡ WebGen Foundry Controls';
        toolOptionsHtml = [
          '<div class="zoth-sidebar-group">',
          '  <span class="zoth-sidebar-label">Workflow Stages</span>',
          '  <div style="display:flex;flex-direction:column;gap:6px;">',
          '    <button class="zoth-fab-btn" style="width:100%;justify-content:flex-start;" onclick="if(window.goToStage)goToStage(1);ZothWorkbench.closeSidebar();">1️⃣ Idea & Foundation</button>',
          '    <button class="zoth-fab-btn" style="width:100%;justify-content:flex-start;" onclick="if(window.goToStage)goToStage(2);ZothWorkbench.closeSidebar();">2️⃣ Generative Synthesis</button>',
          '    <button class="zoth-fab-btn" style="width:100%;justify-content:flex-start;" onclick="if(window.goToStage)goToStage(3);ZothWorkbench.closeSidebar();">3️⃣ In-House Engines</button>',
          '    <button class="zoth-fab-btn" style="width:100%;justify-content:flex-start;" onclick="if(window.goToStage)goToStage(4);ZothWorkbench.closeSidebar();">4️⃣ 20-Agent Swarm</button>',
          '  </div>',
          '</div>',
          '<div class="zoth-sidebar-group">',
          '  <span class="zoth-sidebar-label">Foundry Configuration</span>',
          '  <div style="display:flex;flex-direction:column;gap:6px;">',
          '    <button class="zoth-fab-btn" style="width:100%;justify-content:flex-start;" onclick="ZothWorkbench.openConfig(\'🎨 Palette & Design Tokens\', \'Customize CSS variables, brand gradients, and font families.\', \'<input type=text value=\\\'#00f0ff\\\' class=\\\'prompt-box\\\' style=\\\'margin-bottom:8px;\\\'/><select class=\\\'prompt-box\\\'><option>Syne & Figtree</option><option>Space Grotesk</option></select>\')">🎨 Palette & Typography</button>',
          '    <button class="zoth-fab-btn" style="width:100%;justify-content:flex-start;" onclick="ZothWorkbench.openConfig(\'🚀 Hosting & Serverless Adapter\', \'Configure Netlify Functions, Astro SSR endpoints, or static SPA exports.\', \'<select class=\\\'prompt-box\\\'><option>Netlify Serverless</option><option>Vercel Edge</option><option>Cloudflare Pages</option><option>Static HTML5 / GitHub Pages</option></select>\')">🚀 Hosting & Deployment</button>',
          '    <button class="zoth-fab-btn" style="width:100%;justify-content:flex-start;" onclick="ZothWorkbench.openConfig(\'🔍 SEO & AEO Triples\', \'Configure Schema.org LocalBusiness, FAQ triples, and llms.txt context.\', \'<textarea class=\\\'prompt-box\\\' rows=3>llms.txt context layer enabled with JSON-LD breadcrumbs</textarea>\')">🔍 SEO / AEO / llms.txt</button>',
          '  </div>',
          '</div>'
        ].join('\n');
      } else if (pathname.includes('nexus-3d')) {
        toolTitle = '📐 Nexus 3D Viewport Controls';
        toolOptionsHtml = [
          '<div class="zoth-sidebar-group">',
          '  <span class="zoth-sidebar-label">3D Scene Presets</span>',
          '  <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">',
          '    <button class="zoth-fab-btn" onclick="if(window.loadScenePreset)loadScenePreset(\'cyberpunk_megacity\')">🌆 Cyber City</button>',
          '    <button class="zoth-fab-btn" onclick="if(window.loadScenePreset)loadScenePreset(\'deep_space_station\')">🌌 Deep Space</button>',
          '    <button class="zoth-fab-btn" onclick="if(window.loadScenePreset)loadScenePreset(\'alchemical_sanctum\')">🏛️ Sanctum</button>',
          '    <button class="zoth-fab-btn" onclick="if(window.loadScenePreset)loadScenePreset(\'matrix_holodeck\')">🟩 Matrix</button>',
          '  </div>',
          '</div>',
          '<div class="zoth-sidebar-group">',
          '  <span class="zoth-sidebar-label">Viewport Tools</span>',
          '  <div style="display:flex;flex-direction:column;gap:6px;">',
          '    <button class="zoth-fab-btn" style="width:100%;justify-content:flex-start;" onclick="if(window.resetCamera)resetCamera();ZothWorkbench.closeSidebar();">🎯 Recenter Camera</button>',
          '    <button class="zoth-fab-btn" style="width:100%;justify-content:flex-start;" onclick="if(window.toggleAutoRotate)toggleAutoRotate();ZothWorkbench.closeSidebar();">🔄 Toggle Orbit Turntable</button>',
          '    <button class="zoth-fab-btn" style="width:100%;justify-content:flex-start;" onclick="if(window.burstParticles)burstParticles();">💥 Particle Burst</button>',
          '    <button class="zoth-fab-btn" style="width:100%;justify-content:flex-start;" onclick="if(window.exportSnapshotPNG)exportSnapshotPNG();">📸 High-Res Snapshot</button>',
          '  </div>',
          '</div>'
        ].join('\n');
      } else if (pathname.includes('swarm')) {
        toolTitle = '🌐 Swarm Command Controls';
        toolOptionsHtml = [
          '<div class="zoth-sidebar-group">',
          '  <span class="zoth-sidebar-label">Swarm Node Matrix</span>',
          '  <div style="display:flex;flex-direction:column;gap:6px;">',
          '    <button class="zoth-fab-btn" style="width:100%;justify-content:flex-start;" onclick="if(window.pingAllSwarmAgents)pingAllSwarmAgents();">⚡ Ping 21 Sovereign Agents</button>',
          '    <button class="zoth-fab-btn" style="width:100%;justify-content:flex-start;" onclick="if(window.clearDialogueFeed)clearDialogueFeed();">🧹 Clear Swarm Log Feed</button>',
          '  </div>',
          '</div>'
        ].join('\n');
      }

      // Universal Tool Palette Shortcuts Section (Always available in sidebar)
      var quickPaletteShortcuts = [
        '<div class="zoth-sidebar-group">',
        '  <span class="zoth-sidebar-label">⚡ Quick Workstation Switcher</span>',
        '  <div style="display:flex;flex-direction:column;gap:6px;">',
        '    <button class="zoth-option-btn" onclick="window.location.href=\'/studio/webgen.html\'"><span>💻 Quick PTY Terminal &amp; WebGen</span> <span class="opt-badge">FOUNDRY</span></button>',
        '    <button class="zoth-option-btn" onclick="window.location.href=\'/studio/swarm.html\'"><span>🌐 3D Swarm Battle Arena</span> <span class="opt-badge">3D</span></button>',
        '    <button class="zoth-option-btn" onclick="window.location.href=\'/studio/consensus.html\'"><span>⚔️ Consensus Triangulation Arena</span> <span class="opt-badge">AST</span></button>',
        '    <button class="zoth-option-btn" onclick="window.location.href=\'/studio/cockpit.html\'"><span>🪐 The Cockpit Swarm Deck</span> <span class="opt-badge">:8484</span></button>',
        '    <button class="zoth-option-btn" onclick="window.location.href=\'/secure-comms/\'"><span>🔒 SimpleX ↔ Matrix Bridge</span> <span class="opt-badge">E2EE</span></button>',
        '    <button class="zoth-option-btn" onclick="window.location.href=\'/vault/\'"><span>🔐 Sovereign BYOK Key Vault</span> <span class="opt-badge">VAULT</span></button>',
        '    <button class="zoth-option-btn" onclick="window.location.href=\'/studio/web3-hub.html\'"><span>🪙 Web3 &amp; Solana Swarm Bridge</span> <span class="opt-badge">SOL</span></button>',
        '    <button class="zoth-option-btn" onclick="window.location.href=\'/memory/\'"><span>🧠 Netrunner Memory World</span> <span class="opt-badge">GRAPH</span></button>',
        '  </div>',
        '</div>',
        '<div class="zoth-sidebar-group">',
        '  <span class="zoth-sidebar-label">🎨 Visual Color Theme (9 Options)</span>',
        '  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;">',
        '    <button class="zoth-fab-btn" onclick="if(window.setZothTheme)window.setZothTheme(\'dark\')">🌙 Dark</button>',
        '    <button class="zoth-fab-btn" onclick="if(window.setZothTheme)window.setZothTheme(\'light\')">☀️ Light</button>',
        '    <button class="zoth-fab-btn" onclick="if(window.setZothTheme)window.setZothTheme(\'matrix\')">📟 Matrix</button>',
        '    <button class="zoth-fab-btn" onclick="if(window.setZothTheme)window.setZothTheme(\'gold\')">⚗️ Gold</button>',
        '    <button class="zoth-fab-btn" onclick="if(window.setZothTheme)window.setZothTheme(\'google\')">🌐 Google</button>',
        '    <button class="zoth-fab-btn" onclick="if(window.setZothTheme)window.setZothTheme(\'microsoft\')">🪟 Fluent</button>',
        '    <button class="zoth-fab-btn" onclick="if(window.setZothTheme)window.setZothTheme(\'apple\')">🍎 Apple</button>',
        '    <button class="zoth-fab-btn" onclick="if(window.setZothTheme)window.setZothTheme(\'openai\')">✨ OpenAI</button>',
        '    <button class="zoth-fab-btn" onclick="if(window.setZothTheme)window.setZothTheme(\'amazon\')">☁️ AWS</button>',
        '  </div>',
        '</div>'
      ].join('\n');

      sidebar.innerHTML = [
        '<div class="zoth-sidebar-head">',
        '  <h3 class="zoth-sidebar-title">' + toolTitle + '</h3>',
        '  <button type="button" class="zoth-sidebar-close" onclick="ZothWorkbench.closeSidebar()" aria-label="Close sidebar">✕</button>',
        '</div>',
        '<div class="zoth-sidebar-body">',
        toolOptionsHtml,
        quickPaletteShortcuts,
        '  <div class="zoth-desktop-unlock-card" style="margin-top:auto;">',
        '    <div class="zoth-desktop-unlock-title">🖥️ Desktop App Available</div>',
        '    <div class="zoth-desktop-unlock-text">Launch native hardware orchestration on :8484 with zero web sandbox limits.</div>',
        '    <button type="button" class="zoth-pill-cta" style="width:100%;justify-content:center;margin-top:6px;" onclick="if(window.ZothGate)window.ZothGate.show()">Get Desktop App ↗</button>',
        '  </div>',
        '</div>'
      ].join('\n');

      document.body.appendChild(sidebar);
    }
  }

  // ── 6. Export Global API ──
  window.ZothWorkbench = {
    toggleSidebar: toggleToolSidebar,
    openSidebar: openToolSidebar,
    closeSidebar: closeToolSidebar,
    openConfig: openConfigModal,
    closeConfig: closeConfigModal,
    openPalette: openCommandPalette,
    closePalette: closeCommandPalette,
    togglePalette: toggleCommandPalette
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInjectWorkbenchElements);
  } else {
    autoInjectWorkbenchElements();
  }
})();
