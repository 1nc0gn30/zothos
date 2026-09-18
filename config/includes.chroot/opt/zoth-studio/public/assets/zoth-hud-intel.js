/**
 * HUD intelligence: dashboard home, per-tool acclimation, learned recents,
 * iframe/port self-heal. Wraps ZothHUD after it boots.
 */
(function (window, document) {
  'use strict';
  if (window.ZothHudIntel && window.ZothHudIntel.ready) return;

  var LEARN_KEY = 'zoth-hud-learn-v1';
  var AGENT_FOR_TOOL = {
    omnipost: 'azoth',
    '3d-editor': 'azoth',
    'nexus-3d': 'azoth',
    pets: 'azoth',
    webgen: 'hermes',
    'vos-sandbox': 'hermes',
    'edge-forge': 'hermes',
    'tool-bench': 'hermes',
    'tool-nexus': 'hermes',
    vault: 'lycan',
    adytum: 'lycan',
    subsweep: 'onyx',
    'netrunner-memory': 'leviathan',
    consensus: 'draco',
    'fusion-arena': 'draco',
    'math-pillars': 'grok',
    'signal-bridge': 'aether',
    'web3-hub': 'kitsune',
    swarm: 'azoth',
    'bus-monitor': 'aether',
    'agent-composer': 'antigravity',
    'vision-link': 'kai',
    ide: 'antigravity',
    models: 'grok',
    'notes-reviewer': 'kai',
    'netlify-ax': 'hermes',
    'pets-studio': 'azoth',
    docs: 'athena',
    signal: 'aether',
    agents: 'azoth'
  };

  function loadLearn() {
    try {
      var raw = window.localStorage.getItem(LEARN_KEY);
      var data = raw ? JSON.parse(raw) : null;
      if (data && data.v === 1) return data;
    } catch (e) {}
    return { v: 1, tools: {}, recents: [], lastTool: '', lastAgent: 'azoth' };
  }

  function saveLearn(data) {
    try { window.localStorage.setItem(LEARN_KEY, JSON.stringify(data)); } catch (e) {}
  }

  var LEARN = loadLearn();
  var dwellStarted = 0;
  var dwellTool = '';
  var healTimers = {};
  var iframeAlive = false;

  function recordOpen(toolId) {
    if (!toolId || toolId === 'dashboard') return;
    var rec = LEARN.tools[toolId] || { opens: 0, last: 0, dwellMs: 0, errors: 0, prefs: {} };
    rec.opens += 1;
    rec.last = Date.now();
    LEARN.tools[toolId] = rec;
    LEARN.recents = [toolId].concat(LEARN.recents.filter(function (id) { return id !== toolId; })).slice(0, 10);
    LEARN.lastTool = toolId;
    saveLearn(LEARN);
  }

  function recordDwell(toolId) {
    if (!toolId || !dwellStarted) return;
    var rec = LEARN.tools[toolId] || { opens: 0, last: 0, dwellMs: 0, errors: 0, prefs: {} };
    rec.dwellMs += Math.max(0, Date.now() - dwellStarted);
    LEARN.tools[toolId] = rec;
    saveLearn(LEARN);
  }

  function recordError(toolId) {
    if (!toolId) return;
    var rec = LEARN.tools[toolId] || { opens: 0, last: 0, dwellMs: 0, errors: 0, prefs: {} };
    rec.errors += 1;
    LEARN.tools[toolId] = rec;
    saveLearn(LEARN);
  }

  function savePref(toolId, patch) {
    if (!toolId) return;
    var rec = LEARN.tools[toolId] || { opens: 0, last: 0, dwellMs: 0, errors: 0, prefs: {} };
    rec.prefs = rec.prefs || {};
    Object.keys(patch || {}).forEach(function (k) { rec.prefs[k] = patch[k]; });
    LEARN.tools[toolId] = rec;
    saveLearn(LEARN);
  }

  function prefsFor(toolId) {
    return (LEARN.tools[toolId] && LEARN.tools[toolId].prefs) || {};
  }

  function relatedTools(toolId) {
    var hud = window.ZothHUD;
    var list = (hud && hud.getState && window.ZothHUD) ? null : null;
    var stations = [];
    try {
      stations = window.ZothHUD.getState ? [] : [];
    } catch (e) {}
    var all = document.querySelectorAll('.hud-dock-tab[data-tool]');
    var ids = [];
    all.forEach(function (el) { ids.push(el.getAttribute('data-tool')); });
    var recents = LEARN.recents.filter(function (id) { return id !== toolId; });
    return recents.slice(0, 4);
  }

  function setMode(mode, tool) {
    var shell = document.querySelector('.hud-app-shell');
    if (!shell) return;
    shell.setAttribute('data-hud-mode', mode);
    if (tool && tool.id) {
      shell.setAttribute('data-hud-tool', tool.id);
      shell.setAttribute('data-hud-cat', (tool.catSlug || tool.category || 'workstation').toLowerCase().replace(/[^a-z0-9]+/g, '-'));
    } else {
      shell.setAttribute('data-hud-tool', 'dashboard');
      shell.setAttribute('data-hud-cat', 'dashboard');
    }
    document.body.setAttribute('data-hud-mode', mode);
  }

  function ensureDashboard() {
    var viewport = document.getElementById('hud-stage-viewport') || document.getElementById('hudStageViewport');
    if (!viewport) return null;
    var el = document.getElementById('hud-dashboard');
    if (el) return el;
    el = document.createElement('div');
    el.id = 'hud-dashboard';
    el.className = 'hud-dashboard';
    el.setAttribute('role', 'region');
    el.setAttribute('aria-label', 'HUD dashboard');
    viewport.appendChild(el);
    return el;
  }

  function ensureHeal() {
    var pane = document.getElementById('hud-stage-pri-pane');
    if (!pane) return null;
    var el = document.getElementById('hud-stage-heal');
    if (el) return el;
    el = document.createElement('div');
    el.id = 'hud-stage-heal';
    el.className = 'hud-stage-heal';
    el.hidden = true;
    el.innerHTML = '<div class="hud-heal-card">' +
      '<div class="hud-heal-title">STAGE SELF-HEAL</div>' +
      '<p class="hud-heal-copy" id="hud-heal-copy">Workstation did not mount. Retrying…</p>' +
      '<div class="hud-heal-actions">' +
      '<button type="button" class="hud-stage-btn" id="hud-heal-retry">RETRY</button>' +
      '<button type="button" class="hud-stage-btn" id="hud-heal-dash">DASHBOARD</button>' +
      '</div></div>';
    pane.appendChild(el);
    var retry = el.querySelector('#hud-heal-retry');
    var dash = el.querySelector('#hud-heal-dash');
    if (retry) retry.addEventListener('click', function () { window.ZothHudIntel.retryStage(); });
    if (dash) dash.addEventListener('click', function () { window.ZothHudIntel.showDashboard(); });
    return el;
  }

  var WORKSTATION_META = {
    'omnipost': { icon: '🎬', name: 'OmniPost 2.0 Video', desc: '60 FPS Video Studio, Audio Multi-Track & Social Motion Compositor', cat: 'Creative & Media', contract: 'DETERMINISTIC', runtime: 'FRONTEND', flagship: true },
    'webgen': { icon: '⚡', name: 'WebGen Studio Foundry', desc: 'Universal Interactive PTY Terminal & Full-Stack Website Foundry', cat: 'Web Apps & SaaS', contract: 'SCHEMA VALIDATED', runtime: 'NODE', flagship: true },
    'nexus-3d': { icon: '📐', name: 'Nexus 3D Omniverse', desc: 'Procedural CAD Meshes, CSG Booleans, Skybox & Motion Curves', cat: 'Creative & Media', contract: 'DETERMINISTIC', runtime: 'THREE.JS', flagship: true },
    '3d-editor': { icon: '📐', name: '3D Studio CAD', desc: 'Three.js CAD Mesh Generator, UnrealBloom & Custom Shaders', cat: 'Creative & Media', contract: 'SCHEMA VALIDATED', runtime: 'THREE.JS', flagship: true },
    'swarm': { icon: '🔮', name: '3D Swarm Arena', desc: 'Real-Time WebGL Kinetic Battle Arena & Swarm Arbitrator', cat: 'AI Agents & LLM', contract: 'SCHEMA VALIDATED', runtime: 'VITE GPU', flagship: true },
    'consensus': { icon: '⚔️', name: 'Consensus Battle Arena', desc: '3-Agent Triangulation, AST Synthesis & Byzantine Tiebreaker', cat: 'AI Agents & LLM', contract: 'DETERMINISTIC', runtime: 'VITE', flagship: true },
    'netrunner-memory': { icon: '🧠', name: 'Netrunner Memory Whitespace', desc: 'Biomorphic Synaptic Associative Graph & Lucy Oracle Recall (:8788)', cat: 'AI Agents & LLM', contract: 'SCHEMA VALIDATED', runtime: 'NODE :8788', flagship: true },
    'vos-sandbox': { icon: '💻', name: 'vOS Wasm Sandbox', desc: 'In-Browser WebContainer, Wasm Linux Kernel & Terminal IDE', cat: 'Web Apps & SaaS', contract: 'DETERMINISTIC', runtime: 'WASM', flagship: true },
    'vault': { icon: '🔐', name: 'Sovereign BYOK Vault', desc: 'Argon2id Enclave, BYOK Secret Manager & Hardware Keyrings', cat: 'Security & Enclave', contract: 'DETERMINISTIC', runtime: 'RUST', flagship: true },
    'pets': { icon: '💎', name: 'Companion Pets 3D Sanctuary', desc: '21 Volumetric Mascots, Soundboard & Interactive Spirit Helpers', cat: 'Creative & Media', contract: 'DETERMINISTIC', runtime: 'VOXEL 3D', flagship: true },
    'math-pillars': { icon: '📐', name: 'AI Math Pillars & Academy', desc: 'Linear Algebra, STDP Hebbian Learning, Shannon Entropy & Manifolds', cat: 'Learning & Cognitive', contract: 'DETERMINISTIC', runtime: 'MATH ENGINE', flagship: false },
    'secure-comms': { icon: '🔒', name: 'SimpleX ↔ Matrix Bridge', desc: 'Zero-Knowledge E2EE SimpleX & Matrix Sovereign Gateway', cat: 'Security & Enclave', contract: 'SCHEMA VALIDATED', runtime: 'NODE E2EE', flagship: false },
    'signal-bridge': { icon: '📡', name: 'Signal Swarm Bridge', desc: 'Mobile Phone Command Deck, Signal Gateway & Voice Dispatcher', cat: 'AI Agents & LLM', contract: 'SCHEMA VALIDATED', runtime: 'SIGNAL SSE', flagship: false },
    'signal': { icon: '📡', name: 'Signal Swarm Bridge', desc: 'Mobile Phone Command Deck, Signal Gateway & Voice Dispatcher', cat: 'AI Agents & LLM', contract: 'SCHEMA VALIDATED', runtime: 'SIGNAL SSE', flagship: false },
    'web3-hub': { icon: '🪙', name: 'Web3 & Solana DeFi Hub', desc: 'Non-Custodial Solana RPC Matrix, Multi-Chain Wallets & DEX Feeds', cat: 'Crypto & Web3', contract: 'SCHEMA VALIDATED', runtime: 'VITE RPC', flagship: false },
    'agent-composer': { icon: '🌐', name: 'Agent DAG Composer', desc: 'Visual Multi-Agent Pipeline Builder & Autonomous DAG Wiring', cat: 'AI Agents & LLM', contract: 'SCHEMA VALIDATED', runtime: 'DAG REACT', flagship: false },
    'subsweep': { icon: '🧹', name: 'SubSweep AST Recon', desc: 'Deep AST File Scanner, Dead Code Sweeper & Dependency Tree', cat: 'Automation & Tools', contract: 'DETERMINISTIC', runtime: 'NODE AST', flagship: false },
    'edge-forge': { icon: '⚡', name: 'Edge Forge Studio', desc: 'Netlify Edge Functions, Serverless API Proxies & Webhooks', cat: 'Web Apps & SaaS', contract: 'SCHEMA VALIDATED', runtime: 'SERVERLESS', flagship: false },
    'bus-monitor': { icon: '📊', name: 'Inter-Agent Bus NOC', desc: 'Live File Bus Activity, IPC Telemetry & Message Flow Tracer (:8484)', cat: 'Automation & Tools', contract: 'DETERMINISTIC', runtime: 'IPC :8484', flagship: false },
    'vision-link': { icon: '👁️', name: 'Vision Link Studio', desc: 'Multimodal Spatial OCR, Visual Telemetry & Segment Anything', cat: 'AI Agents & LLM', contract: 'SCHEMA VALIDATED', runtime: 'PYTHON SAM', flagship: false },
    'tool-bench': { icon: '🛠️', name: 'Tool Bench Studio', desc: 'Schema-Validated Local Tool Validator, Simulators & Contracts', cat: 'Automation & Tools', contract: 'DETERMINISTIC', runtime: 'CONTRACTS', flagship: false },
    'tool-nexus': { icon: '🚀', name: 'Tool Nexus Master Registry', desc: 'Master Directory & Execution Launcher for All 298 Sovereign Tools', cat: 'Automation & Tools', contract: 'DETERMINISTIC', runtime: 'REGISTRY', flagship: false },
    'adytum': { icon: '🏛️', name: 'Adytum Sanctum', desc: 'Offline Cryptographic Gateway & Keys 0-21 Hermetic Planning Rite', cat: 'Security & Enclave', contract: 'DETERMINISTIC', runtime: 'OFFLINE', flagship: false },
    'fusion-arena': { icon: '🏆', name: 'Fusion Arena Benchmark', desc: 'Live Multi-Model Tournament, Latency Contests & AST Accuracy', cat: 'AI Agents & LLM', contract: 'SCHEMA VALIDATED', runtime: 'BENCHMARK', flagship: false },
    'ai-webgpu': { icon: '⚡', name: 'WebGPU Neural Engine', desc: 'In-Browser Local Neural Transformer Shaders (360M Micro)', cat: 'AI Agents & LLM', contract: 'DETERMINISTIC', runtime: 'WEBGPU SHADERS', flagship: false }
  };

  function renderDashboard() {
    var el = ensureDashboard();
    if (!el) return;

    var allTools = PRIMARY_FALLBACK();
    var enrichedTools = allTools.map(function (t) {
      var meta = WORKSTATION_META[t.id] || {};
      return {
        id: t.id,
        name: t.name || meta.name || t.id,
        shortName: t.shortName || meta.name || t.name || t.id,
        desc: t.desc || meta.desc || 'Sovereign local workstation tool.',
        category: meta.cat || t.category || 'Automation & Tools',
        contract: t.contract || meta.contract || 'SCHEMA VALIDATED',
        runtime: t.runtime || meta.runtime || 'SOVEREIGN',
        icon: meta.icon || '🛠️',
        url: t.url || '/studio/webgen.html?tool=' + t.id,
        flagship: !!meta.flagship
      };
    });

    var recents = LEARN.recents.slice(0, 6);
    var health = window.ZothHudIntel.health || {};
    var ports = [
      { num: '8088', name: 'WEB' },
      { num: '8788', name: 'MEMORY' },
      { num: '8484', name: 'BUS NOC' },
      { num: '11434', name: 'LLM' }
    ];

    var healthHtml = ports.map(function (p) {
      var ok = health[p.num];
      var cls = ok === true ? 'ok' : (ok === false ? 'down' : 'ok');
      return '<div class="hud-dash-port-pill ' + cls + '" title="Port :' + p.num + ' status">' +
        '<span class="hud-port-dot"></span>' +
        '<span class="hud-port-lbl">:' + p.num + ' ' + p.name + '</span>' +
      '</div>';
    }).join('');

    var flagshipTools = enrichedTools.filter(function (t) { return t.flagship; });
    var otherTools = enrichedTools.filter(function (t) { return !t.flagship; });

    // 1. Flagship Cards HTML
    var flagshipCardsHtml = flagshipTools.map(function (t) {
      return '<div class="hud-dash-flagship-card" data-tool-card data-id="' + t.id + '" data-cat="' + t.category.toLowerCase() + '" data-name="' + t.name.toLowerCase() + '" data-desc="' + t.desc.toLowerCase() + '">' +
        '<div class="hud-flagship-top">' +
          '<div class="hud-flagship-badge-row">' +
            '<span class="hud-flagship-cat">' + t.category.toUpperCase() + '</span>' +
            '<span class="hud-flagship-runtime">' + t.runtime + '</span>' +
          '</div>' +
          '<div class="hud-flagship-title-row">' +
            '<span class="hud-flagship-icon">' + t.icon + '</span>' +
            '<div>' +
              '<h3 class="hud-flagship-title">' + t.name + '</h3>' +
              '<span class="hud-flagship-contract">' + t.contract + '</span>' +
            '</div>' +
          '</div>' +
          '<p class="hud-flagship-desc">' + t.desc + '</p>' +
        '</div>' +
        '<div class="hud-flagship-actions">' +
          '<button type="button" class="hud-dash-btn primary" data-act="primary" data-id="' + t.id + '">⚡ PRIMARY STAGE</button>' +
          '<button type="button" class="hud-dash-btn split" data-act="split" data-id="' + t.id + '" title="Mount in split right stage">◫ SPLIT</button>' +
          '<a href="' + t.url + '" target="_blank" class="hud-dash-btn popout" title="Open standalone window">↗</a>' +
        '</div>' +
      '</div>';
    }).join('');

    // 2. Categorized Groups HTML
    var groups = {};
    enrichedTools.forEach(function (t) {
      var g = t.category || 'General Workstations';
      groups[g] = groups[g] || [];
      groups[g].push(t);
    });

    var categorizedHtml = Object.keys(groups).map(function (g) {
      var list = groups[g];
      var inner = list.map(function (t) {
        return '<div class="hud-dash-tool-card" data-tool-card data-id="' + t.id + '" data-cat="' + g.toLowerCase() + '" data-name="' + t.name.toLowerCase() + '" data-desc="' + t.desc.toLowerCase() + '">' +
          '<div class="hud-dash-tool-head">' +
            '<div class="hud-dash-tool-title-wrap">' +
              '<span class="hud-dash-tool-icon">' + t.icon + '</span>' +
              '<div>' +
                '<strong class="hud-dash-tool-name">' + t.name + '</strong>' +
                '<span class="hud-dash-tool-runtime">' + t.runtime + '</span>' +
              '</div>' +
            '</div>' +
            '<span class="hud-dash-tool-contract">' + t.contract + '</span>' +
          '</div>' +
          '<p class="hud-dash-tool-desc">' + t.desc + '</p>' +
          '<div class="hud-dash-tool-actions">' +
            '<button type="button" class="hud-dash-btn mini primary" data-act="primary" data-id="' + t.id + '">⚡ LOAD</button>' +
            '<button type="button" class="hud-dash-btn mini split" data-act="split" data-id="' + t.id + '">◫ SPLIT</button>' +
            '<a href="' + t.url + '" target="_blank" class="hud-dash-btn mini popout" title="Standalone">↗</a>' +
          '</div>' +
        '</div>';
      }).join('');

      return '<div class="hud-dash-group" data-group-category="' + g.toLowerCase() + '">' +
        '<div class="hud-dash-group-header">' +
          '<div class="hud-dash-group-title"><span>⚡</span> ' + g.toUpperCase() + ' <span class="hud-dash-group-count">(' + list.length + ')</span></div>' +
          '<div class="hud-dash-group-line"></div>' +
        '</div>' +
        '<div class="hud-dash-group-grid">' + inner + '</div>' +
      '</div>';
    }).join('');

    // 3. Recents Bar HTML
    var recentsHtml = recents.length ? recents.map(function (id) {
      var t = enrichedTools.find(function (item) { return item.id === id; }) || { id: id, name: id, icon: '🛠️' };
      var opens = (LEARN.tools[id] && LEARN.tools[id].opens) || 1;
      return '<button type="button" class="hud-dash-recent-chip" data-act="primary" data-id="' + id + '">' +
        '<span class="hud-recent-icon">' + t.icon + '</span>' +
        '<span class="hud-recent-name">' + (t.shortName || t.name) + '</span>' +
        '<span class="hud-recent-opens">' + opens + 'x</span>' +
      '</button>';
    }).join('') : '<span class="hud-dash-empty-hint">Open workstations from the deck or catalog to build learned recents.</span>';

    // Assemble Full Dashboard
    el.innerHTML =
      '<div class="hud-dash-hero">' +
        '<div class="hud-dash-hero-left">' +
          '<div class="hud-dash-kicker">' +
            '<span class="hud-kicker-dot"></span>' +
            '<span>ZOTH SOVEREIGN COMMAND DECK // HYPER-WORKSPACE</span>' +
          '</div>' +
          '<h2 class="hud-dash-title">Master Studio Workstations</h2>' +
          '<p class="hud-dash-subtitle">' + enrichedTools.length + ' sovereign tools running on local silicon. Mount into full Center Stage, orchestrate dual split-screen viewports, or detach into floating windows.</p>' +
        '</div>' +
        '<div class="hud-dash-hero-right">' +
          '<div class="hud-dash-ports-matrix">' + healthHtml + '</div>' +
          '<div class="hud-dash-hero-actions">' +
            '<button type="button" class="hud-dash-hero-btn" id="hud-dash-btn-catalog" onclick="if(window.ZothHUD) window.ZothHUD.openOmniverseNav();">🚀 [ 298+ TOOL CATALOG ]</button>' +
            '<button type="button" class="hud-dash-hero-btn secondary" id="hud-dash-btn-heal" onclick="if(window.ZothHudIntel) window.ZothHudIntel.healNow();">↻ [ HEAL PORTS ]</button>' +
          '</div>' +
        '</div>' +
      '</div>' +

      '<!-- Interactive Filter & Search Bar -->' +
      '<div class="hud-dash-filter-bar">' +
        '<div class="hud-dash-search-wrap">' +
          '<span class="hud-dash-search-icon">🔍</span>' +
          '<input type="text" class="hud-dash-search-input" id="hudDashSearchInput" placeholder="Instant search ' + enrichedTools.length + '+ workstations (e.g. 3D, Video, Swarm, WASM, Security, SOL)..." autocomplete="off" spellcheck="false" />' +
          '<span class="hud-dash-search-count" id="hudDashCountBadge">' + enrichedTools.length + ' TOOLS</span>' +
        '</div>' +
        '<div class="hud-dash-cat-pills" id="hudDashCatPills">' +
          '<button type="button" class="hud-dash-cat-pill active" data-cat="all">⚡ ALL (' + enrichedTools.length + ')</button>' +
          '<button type="button" class="hud-dash-cat-pill" data-cat="flagship">👑 FLAGSHIP (' + flagshipTools.length + ')</button>' +
          '<button type="button" class="hud-dash-cat-pill" data-cat="creative">🎨 3D & MEDIA</button>' +
          '<button type="button" class="hud-dash-cat-pill" data-cat="ai">🔮 SWARMS & AI</button>' +
          '<button type="button" class="hud-dash-cat-pill" data-cat="web">⚡ WEB APPS</button>' +
          '<button type="button" class="hud-dash-cat-pill" data-cat="security">🔐 SECURITY & VAULT</button>' +
          '<button type="button" class="hud-dash-cat-pill" data-cat="learning">🧠 COGNITIVE & MATH</button>' +
        '</div>' +
      '</div>' +

      '<!-- Learned Recents Row -->' +
      '<div class="hud-dash-recents-strip">' +
        '<span class="hud-dash-recents-lbl">LEARNED RECENTS:</span>' +
        '<div class="hud-dash-recents-list">' + recentsHtml + '</div>' +
      '</div>' +

      '<!-- Featured Flagship Shelf -->' +
      '<div class="hud-dash-flagship-shelf" id="hudDashFlagshipShelf">' +
        '<div class="hud-dash-section-kicker"><span>👑</span> FLAGSHIP SOVEREIGN WORKSTATIONS</div>' +
        '<div class="hud-dash-flagship-grid">' + flagshipCardsHtml + '</div>' +
      '</div>' +

      '<!-- Full Categorized Workspace Directory -->' +
      '<div class="hud-dash-directory-wrap" id="hudDashDirectoryWrap">' +
        categorizedHtml +
      '</div>';

    // Wire Interactive Click Handlers
    el.querySelectorAll('[data-act]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var act = btn.getAttribute('data-act');
        var id = btn.getAttribute('data-id');
        if (!id) return;
        if (act === 'primary') {
          if (window.ZothHUD && window.ZothHUD.loadTool) window.ZothHUD.loadTool(id);
        } else if (act === 'split') {
          if (window.ZothHUD) {
            window.ZothHUD.setSecondaryTool(id);
            if (!window.ZothHUD.getState().splitMode) window.ZothHUD.toggleSplitStage();
          }
        }
      });
    });

    // Wire Real-Time Search Filtering
    var searchInput = el.querySelector('#hudDashSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', function (e) {
        var query = e.target.value.toLowerCase().trim();
        filterDashboard(el, query, activeCategoryFilter);
      });
    }

    // Wire Category Pills
    var activeCategoryFilter = 'all';
    el.querySelectorAll('#hudDashCatPills .hud-dash-cat-pill').forEach(function (pill) {
      pill.addEventListener('click', function () {
        el.querySelectorAll('#hudDashCatPills .hud-dash-cat-pill').forEach(function (p) { p.classList.remove('active'); });
        pill.classList.add('active');
        activeCategoryFilter = pill.getAttribute('data-cat');
        var query = searchInput ? searchInput.value.toLowerCase().trim() : '';
        filterDashboard(el, query, activeCategoryFilter);
        if (window.ZothHUD && window.ZothHUD.playSfx) window.ZothHUD.playSfx('chirp');
      });
    });
  }

  function filterDashboard(container, query, category) {
    var cards = container.querySelectorAll('[data-tool-card]');
    var groups = container.querySelectorAll('.hud-dash-group');
    var flagshipShelf = container.querySelector('#hudDashFlagshipShelf');
    var visibleCount = 0;

    cards.forEach(function (c) {
      var id = c.getAttribute('data-id') || '';
      var name = c.getAttribute('data-name') || '';
      var desc = c.getAttribute('data-desc') || '';
      var cat = c.getAttribute('data-cat') || '';
      var isFlagship = c.classList.contains('hud-dash-flagship-card');

      var matchesQuery = !query || id.includes(query) || name.includes(query) || desc.includes(query) || cat.includes(query);
      var matchesCat = (category === 'all') || 
                       (category === 'flagship' && isFlagship) ||
                       (category === 'creative' && (cat.includes('creative') || cat.includes('3d') || cat.includes('media'))) ||
                       (category === 'ai' && (cat.includes('ai') || cat.includes('swarm') || cat.includes('llm') || cat.includes('consensus'))) ||
                       (category === 'web' && (cat.includes('web') || cat.includes('saas') || cat.includes('nocode') || cat.includes('ax'))) ||
                       (category === 'security' && (cat.includes('security') || cat.includes('vault') || cat.includes('enclave') || cat.includes('comms'))) ||
                       (category === 'learning' && (cat.includes('learning') || cat.includes('math') || cat.includes('cognitive') || cat.includes('observability')));

      if (matchesQuery && matchesCat) {
        c.style.display = 'flex';
        visibleCount++;
      } else {
        c.style.display = 'none';
      }
    });

    if (flagshipShelf) {
      if (category !== 'all' && category !== 'flagship' && query) {
        flagshipShelf.style.display = 'none';
      } else if (category === 'flagship') {
        flagshipShelf.style.display = 'block';
      } else {
        flagshipShelf.style.display = 'block';
      }
    }

    groups.forEach(function (g) {
      var visibleCardsInGroup = g.querySelectorAll('.hud-dash-tool-card[style*="display: flex"], .hud-dash-tool-card:not([style*="display: none"])');
      if (visibleCardsInGroup.length === 0 || category === 'flagship') {
        g.style.display = 'none';
      } else {
        g.style.display = 'block';
      }
    });

    var countBadge = container.querySelector('#hudDashCountBadge');
    if (countBadge) countBadge.textContent = visibleCount + ' TOOLS';
  }

  function PRIMARY_FALLBACK() {
    if (window.ZOTH_HUD_WORKSTATIONS && window.ZOTH_HUD_WORKSTATIONS.length) {
      return window.ZOTH_HUD_WORKSTATIONS.slice();
    }
    if (window.ZOTH_PRIMARY_WORKSTATIONS && window.ZOTH_PRIMARY_WORKSTATIONS.length) {
      return window.ZOTH_PRIMARY_WORKSTATIONS.slice();
    }
    return [];
  }

  function findTool(id) {
    var tiles = PRIMARY_FALLBACK();
    for (var i = 0; i < tiles.length; i++) if (tiles[i].id === id) return tiles[i];
    try {
      var hud = window.ZothHUD;
      if (hud && hud.getState) {
        var st = hud.getState();
        if (st && st.activeTool && st.activeTool.id === id) return st.activeTool;
      }
    } catch (e) {}
    return { id: id, name: id, shortName: id, category: 'Tool' };
  }

  function showDashboard() {
    if (healTimers.iframe) {
      clearTimeout(healTimers.iframe);
      healTimers.iframe = null;
    }
    setMode('dashboard', null);
    var dash = ensureDashboard();
    if (dash) {
      dash.hidden = false;
      dash.classList.add('is-open');
    }
    hideHeal();
    renderDashboard();
    var tabs = document.querySelectorAll('.hud-dock-tab');
    tabs.forEach(function (tab) {
      tab.classList.toggle('active', tab.getAttribute('data-tool') === 'dashboard');
    });
    var title = document.getElementById('hud-stage-tool-name');
    if (title) title.innerHTML = '<span>⌂</span> DASHBOARD';
    if (window.ZothHUD && window.ZothHUD.addLog) {
      window.ZothHUD.addLog('HUD', 'Dashboard surface armed. Tools remain one click away.', 'system');
    }
  }

  function hideDashboard() {
    var dash = document.getElementById('hud-dashboard');
    if (dash) {
      dash.hidden = true;
      dash.classList.remove('is-open');
    }
  }

  function hideHeal() {
    var el = document.getElementById('hud-stage-heal');
    if (el) el.hidden = true;
  }

  function showHeal(msg) {
    var el = ensureHeal();
    if (!el) return;
    var copy = document.getElementById('hud-heal-copy');
    if (copy) copy.textContent = msg || 'Workstation failed to mount.';
    el.hidden = false;
  }

  function acclimate(toolId) {
    var hud = window.ZothHUD;
    if (!hud) return;
    var st = hud.getState ? hud.getState() : {};
    var tool = st.activeTool || findTool(toolId);
    setMode('tool', tool);
    hideDashboard();
    hideHeal();

    var wantAgent = AGENT_FOR_TOOL[toolId];
    if (wantAgent && st.activeAgent !== wantAgent && hud.setAgent) {
      hud.setAgent(wantAgent, true);
      LEARN.lastAgent = wantAgent;
      saveLearn(LEARN);
    }

    var prefs = prefsFor(toolId);
    if (prefs.aspect && hud.setAspectRatio) hud.setAspectRatio(prefs.aspect);

    var ctx = document.getElementById('hud-tool-context-card');
    if (ctx) ctx.classList.add('is-acclimated');

    rebuildLearnedDock();
    if (hud.addLog) {
      hud.addLog('HUD', 'Acclimated to ' + (tool.name || toolId) + '. Agent ' + (wantAgent || st.activeAgent || 'azoth') + '.', 'system');
    }
  }

  function rebuildWorkstationDock() {
    var tabs = document.getElementById('hud-dock-tabs');
    if (!tabs) return;
    // Preserve rich curated dock tabs and wire listeners
    tabs.querySelectorAll('.hud-dock-tab[data-tool]').forEach(function (btn) {
      if (btn._hudBound) return;
      btn._hudBound = true;
      btn.addEventListener('click', function () {
        if (window.ZothHUD && window.ZothHUD.loadTool) {
          window.ZothHUD.loadTool(btn.getAttribute('data-tool'));
        }
      });
    });
  }

  function rebuildLearnedDock() {
    var host = document.getElementById('hud-dock-learned');
    if (!host) return;
    var recents = LEARN.recents.slice(0, 5);
    if (!recents.length) {
      host.innerHTML = '';
      return;
    }
    host.innerHTML = recents.map(function (id) {
      var t = findTool(id);
      return '<button type="button" class="hud-dock-tab learned" data-tool="' + id + '" title="Learned recent">' + (t.shortName || t.name) + '</button>';
    }).join('');
    host.querySelectorAll('[data-tool]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (window.ZothHUD) window.ZothHUD.loadTool(btn.getAttribute('data-tool'));
      });
    });
  }

  function watchIframe() {
    var frame = document.getElementById('hud-stage-frame');
    if (!frame || frame._hudHealBound) return;
    frame._hudHealBound = true;
    frame.addEventListener('load', function () {
      iframeAlive = true;
      hideHeal();
      if (healTimers.iframe) {
        clearTimeout(healTimers.iframe);
        healTimers.iframe = null;
      }
    });
    frame.addEventListener('error', function () {
      iframeAlive = false;
      var id = LEARN.lastTool;
      recordError(id);
      showHeal('Iframe error. Self-heal can retry the workstation or return to dashboard.');
    });
  }

  function armIframeWatch(toolId) {
    iframeAlive = false;
    if (healTimers.iframe) clearTimeout(healTimers.iframe);
    healTimers.iframe = setTimeout(function () {
      if (!iframeAlive) {
        recordError(toolId);
        showHeal('No mount handshake in 8s. Retry or open dashboard.');
        if (window.ZothHUD && window.ZothHUD.addLog) {
          window.ZothHUD.addLog('HEAL', 'Stage watchdog tripped for ' + toolId, 'warn');
        }
      }
    }, 8000);
  }

  function retryStage() {
    var hud = window.ZothHUD;
    if (!hud || !hud.getState) return;
    var st = hud.getState();
    var id = st.activeTool && st.activeTool.id;
    if (!id) return;
    var frame = document.getElementById('hud-stage-frame');
    if (frame) {
      var src = frame.getAttribute('src') || frame.src;
      frame.src = src;
    }
    hideHeal();
    armIframeWatch(id);
    if (hud.addLog) hud.addLog('HEAL', 'Retrying stage mount for ' + id, 'system');
  }

  function pingHealth() {
    window.ZothHudIntel.health = window.ZothHudIntel.health || {};
    var isHttp = window.location.protocol === 'http:';
    var isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    var checks = [
      { port: '8088', url: '/studio/cyberpunk-hud.html', localOnly: false },
      { port: '8484', url: 'http://127.0.0.1:8484/api/health', localOnly: true },
      { port: '8788', url: 'http://127.0.0.1:8788/health', localOnly: true },
      { port: '11434', url: 'http://127.0.0.1:11434/api/tags', localOnly: true }
    ];

    checks.forEach(function (c) {
      if (c.localOnly && (!isLocal || !isHttp)) {
        // In cloud / HTTPS preview, mark local daemons as standby rather than triggering mixed content warnings
        window.ZothHudIntel.health[c.port] = null;
        paintHealth();
        return;
      }

      var ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
      var t = setTimeout(function () { if (ctrl) ctrl.abort(); }, 1600);
      fetch(c.url, { signal: ctrl ? ctrl.signal : undefined, mode: c.port === '8088' ? 'same-origin' : 'no-cors' })
        .then(function (r) {
          window.ZothHudIntel.health[c.port] = c.port === '8088' ? !!r.ok : (r.type === 'opaque' || r.ok);
        })
        .catch(function () {
          window.ZothHudIntel.health[c.port] = c.port === '8088' ? true : false;
        })
        .then(function () {
          clearTimeout(t);
          paintHealth();
        });
    });
  }

  function paintHealth() {
    var host = document.getElementById('hud-dock-health');
    if (!host) return;
    var h = window.ZothHudIntel.health || {};
    host.innerHTML = ['8484', '8788', '11434'].map(function (p) {
      var ok = h[p];
      var cls = ok === true ? 'ok' : (ok === false ? 'down' : 'unk');
      return '<span class="hud-health-chip ' + cls + '" title=":' + p + '">' + p + '</span>';
    }).join('');
    var dash = document.getElementById('hud-dashboard');
    if (dash && !dash.hidden) renderDashboard();
  }

  function healNow() {
    pingHealth();
    retryStage();
    if (window.ZothHUD && window.ZothHUD.addLog) {
      window.ZothHUD.addLog('HEAL', 'Self-heal sweep: ports + stage watchdog.', 'system');
    }
  }

  function wrapHud() {
    var hud = window.ZothHUD;
    if (!hud || hud._intelWrapped) return;
    hud._intelWrapped = true;

    var origLoad = hud.loadTool.bind(hud);
    hud.loadTool = function (toolId, isInitial) {
      if (toolId === 'dashboard' || toolId === 'home') {
        if (dwellTool) recordDwell(dwellTool);
        dwellTool = '';
        dwellStarted = 0;
        showDashboard();
        origLoad('dashboard', isInitial);
        return;
      }
      var bootParams = new URLSearchParams(window.__HUD_LANDING_SEARCH || '');
      if (isInitial && !bootParams.get('tool')) {
        showDashboard();
        origLoad('dashboard', isInitial);
        return;
      }
      if (dwellTool && dwellTool !== toolId) recordDwell(dwellTool);
      origLoad(toolId, isInitial);
      dwellTool = toolId;
      dwellStarted = Date.now();
      recordOpen(toolId);
      acclimate(toolId);
      watchIframe();
      armIframeWatch(toolId);
    };

    var origAspect = hud.setAspectRatio && hud.setAspectRatio.bind(hud);
    if (origAspect) {
      hud.setAspectRatio = function (ratio) {
        origAspect(ratio);
        if (dwellTool) savePref(dwellTool, { aspect: ratio });
      };
    }

    var origInit = hud.init.bind(hud);
    hud.init = function () {
      origInit();
      afterInit();
    };
  }

  function afterInit() {
    try {
      ensureDashboard();
      ensureHeal();
      watchIframe();
      rebuildWorkstationDock();
      rebuildLearnedDock();
      pingHealth();
      if (!window._hudHealPulse) {
        window._hudHealPulse = setInterval(pingHealth, 20000);
      }
      var landing = window.__HUD_LANDING_SEARCH || '';
      var params = new URLSearchParams(landing);
      if (!params.get('tool')) {
        showDashboard();
      } else {
        acclimate(params.get('tool'));
      }
      window.addEventListener('beforeunload', function () {
        if (dwellTool) recordDwell(dwellTool);
      });
    } catch (err) {
      console.warn('[HUD intel]', err);
      try { showDashboard(); } catch (e2) {}
    }
  }

  window.ZothHudIntel = {
    ready: true,
    health: {},
    showDashboard: showDashboard,
    hideDashboard: hideDashboard,
    acclimate: acclimate,
    retryStage: retryStage,
    healNow: healNow,
    learn: function () { return LEARN; }
  };

  function bootIntel() {
    wrapHud();
    afterInit();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootIntel);
  } else {
    bootIntel();
  }
})(window, document);
