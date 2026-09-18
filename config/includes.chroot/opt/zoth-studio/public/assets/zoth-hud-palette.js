/**
 * ⚡ ZOTH STUDIO — MASTER COMMAND PALETTE & OMNIVERSE NAVIGATOR (v6.0 SOVEREIGN)
 * 
 * Instant High-Speed Fuzzy Search & Keyboard Command Controller:
 * 1. 298+ Sovereign Tools from tool-nexus-data.js
 * 2. 21 Sovereign Agents (with avatar icons, roles & domains)
 * 3. 9 Flagship Workstations (and 25+ studio hubs with hotkeys 1-9)
 * 4. 4 Theme Engine Switches (Dark, Light, Matrix, Gold)
 * 5. Sensory & Tactical Actions (SFX, Sandevistan, Kiroshi Optics, Horizon, CRT, Debate, Memory)
 * 
 * Shortcuts:
 *   - Ctrl+K / Cmd+K : Open / Toggle Command Palette
 *   - ArrowDown / ArrowUp : Navigate Results
 *   - Enter : Execute 1-Tap Action
 *   - Escape : Close Palette
 *   - Tab : Cycle Category Filter Tabs
 */

(function (window, document) {
  'use strict';

  // Canonical list of 21 Sovereign Agents fallback
  var CANONICAL_21_AGENTS = [
    { id: 'azoth', name: 'Azoth', role: 'CORE MAGUS', desc: 'Hermetic Sovereign AI Core & Alchemical Synthesis Engine', domain: 'Grand Synthesis', icon: '⚗️', avatar: '/assets/agents/azoth.jpg', color: '#fbbf24' },
    { id: 'antigravity', name: 'Antigravity', role: 'AST ORCHESTRATOR', desc: 'Lead Abstract Syntax Tree Orchestrator & Systems Architect', domain: 'Systems Engineering', icon: '🛰️', avatar: '/assets/agents/antigravity.jpg', color: '#7c9cff' },
    { id: 'grok', name: 'Grok', role: 'FIRST PRINCIPLES', desc: 'Speed Reasoning Engine & Axiomatic Mathematical Arbiter', domain: 'Mathematics & Logic', icon: '🚀', avatar: '/assets/agents/grok.jpg', color: '#00d4aa' },
    { id: 'hermes', name: 'Hermes', role: 'TOOL HARNESS', desc: 'Autonomous Tool Harness & Subprocess PTY Dispatcher', domain: 'Local Execution', icon: '⚡', avatar: '/assets/agents/hermes.jpg', color: '#ffaa40' },
    { id: 'ghostbyte', name: 'GhostByte', role: 'RED TEAM SPECTRE', desc: 'Offensive Security & Zero-Day Exploit Sentinel', domain: 'SecOps & Fuzzing', icon: '👾', avatar: '/assets/agents/ghostbyte.jpg', color: '#c084fc' },
    { id: 'ollama', name: 'Ollama', role: 'AIR-GAPPED COMPUTE', desc: 'Local Air-Gapped Sovereign Neural Inference Runner', domain: 'Neural Inference', icon: '🦙', avatar: '/assets/agents/ollama.jpg', color: '#f59e0b' },
    { id: 'kai', name: 'Kai', role: 'AST INSPECTOR', desc: 'Phoenix Spirit · Workspace File Hierarchy & Code Scanner', domain: 'Code Audit', icon: '🦅', avatar: '/assets/agents/kai.jpg', color: '#00f0ff' },
    { id: 'draco', name: 'Draco', role: 'VULCAN CODE', desc: 'Celestial Dragon · Hardware Bridge, Rust & Micro-Controllers', domain: 'Silicon & Compilers', icon: '🐲', avatar: '/assets/agents/draco.jpg', color: '#ff8833' },
    { id: 'ignis', name: 'Ignis', role: 'AST OPTIMIZER', desc: 'Flame Tiger · Refactor Specialist & Dead Code Pruner', domain: 'Refactor & Tree', icon: '🐅', avatar: '/assets/agents/ignis.jpg', color: '#ff5533' },
    { id: 'lycan', name: 'Lycan', role: 'SECURITY OSINT', desc: 'Guardian Wolf · OWASP Perimeter & Argon2id Keyrings', domain: 'SecOps & Enclave', icon: '🐺', avatar: '/assets/agents/lycan.jpg', color: '#3b82f6' },
    { id: 'athena', name: 'Athena', role: 'SEMANTIC AEO', desc: 'Wise Owl · Semantic Knowledge Graph & AEO Schema Oracle', domain: 'Knowledge & Search', icon: '🦉', avatar: '/assets/agents/athena.jpg', color: '#00d4aa' },
    { id: 'kitsune', name: 'Kitsune', role: 'UI AESTHETICS', desc: 'Nine-Tailed Fox · Creative Taste & Design Token Arbiter', domain: 'Design Systems', icon: '🦊', avatar: '/assets/agents/kitsune.jpg', color: '#10b981' },
    { id: 'pixel-neko', name: 'Pixel-Neko', role: 'REGISTRY SYNC', desc: 'Cyber Cat · Registry Indexer & 298 Tool Manifest Syncer', domain: 'Package Registry', icon: '🐱', avatar: '/assets/agents/pixel-neko.jpg', color: '#ff007a' },
    { id: 'pixel-shiba', name: 'Pixel-Shiba', role: 'VAULT WARDEN', desc: 'Guard Dog · BYOK Key Vault Warden & Salt Derivation', domain: 'Vault Keyrings', icon: '🐕', avatar: '/assets/agents/pixel-shiba.jpg', color: '#f59e0b' },
    { id: 'radical-minion', name: 'Radical-Minion', role: 'SCHEMA HERALD', desc: 'Hermes Herald · Function Caller & JSON-Schema Validator', domain: 'Contracts & Tooling', icon: '⚡', avatar: '/assets/agents/radical-minion.jpg', color: '#22c55e' },
    { id: 'aquila', name: 'Aquila', role: 'EDGE ROUTING', desc: 'Sky Eagle · Netlify Edge Functions & CDN DNS Sentinel', domain: 'Edge Infrastructure', icon: '🦅', avatar: '/assets/agents/aquila.jpg', color: '#22d3ee' },
    { id: 'leviathan', name: 'Leviathan', role: 'VECTOR MEMORY', desc: 'Abyssal Serpent · 1024d Vector DB & HNSW Graph Indexer', domain: 'Lucy Memory Daemon', icon: '🐉', avatar: '/assets/agents/leviathan.jpg', color: '#6366f1' },
    { id: 'onyx', name: 'Onyx', role: 'FUZZ SENTINEL', desc: 'Black Panther · Boundary Fuzzer & Penetration Test Harness', domain: 'Security Fuzzing', icon: '🐆', avatar: '/assets/agents/onyx.jpg', color: '#a855f7' },
    { id: 'chronos', name: 'Chronos', role: 'DAG NAVIGATOR', desc: 'Time Stag · Event Bus Time-Travel & DAG Version Sorter', domain: 'Temporal DAG', icon: '🦌', avatar: '/assets/agents/chronos.jpg', color: '#ec4899' },
    { id: 'aether', name: 'Aether', role: 'SWARM CONDUCTOR', desc: 'Cosmic Manta · Swarm Topology Mesh & Dynamic Load Balancer', domain: 'Mesh Orchestration', icon: '🛸', avatar: '/assets/agents/aether.jpg', color: '#00f0ff' },
    { id: 'kraken', name: 'Kraken', role: 'SSE SENTINEL', desc: 'Deep Cephalopod · SSE Stream Multiplexer & Packet Sniffer', domain: 'Event Streams', icon: '🐙', avatar: '/assets/agents/kraken.jpg', color: '#06b6d4' }
  ];

  // Canonical 9 Flagship Workstations + Studio Hubs
  var CANONICAL_WORKSTATIONS = [
    { id: 'omnipost', name: 'OmniPost 2.0 Video', shortName: 'OmniPost', desc: '60 FPS Video Studio, Audio Multi-Track & Social Motion Compositor', icon: '🎬', category: 'Creative & Media', hotkey: '1' },
    { id: '3d-editor', name: '3D Studio CAD', shortName: '3D Studio', desc: 'Three.js CAD Mesh Generator, UnrealBloom & Shaders', icon: '📐', category: 'Creative & Media', hotkey: '2' },
    { id: 'nexus-3d', name: 'Nexus 3D Omniverse', shortName: 'Nexus 3D', desc: 'Procedural CAD Meshes, CSG Booleans, Skybox & Motion Curves', icon: '🌐', category: 'Creative & Media', hotkey: '3' },
    { id: 'swarm', name: '3D Swarm Arena', shortName: 'Swarm Arena', desc: 'Real-Time WebGL Kinetic Battle Arena & Swarm Arbitrator', icon: '🔮', category: 'AI Agents & LLM', hotkey: '4' },
    { id: 'webgen', name: 'WebGen Studio Foundry', shortName: 'WebGen', desc: 'Universal Interactive PTY Terminal & Full-Stack Website Foundry', icon: '🏗️', category: 'Web Apps & SaaS', hotkey: '5' },
    { id: 'tool-bench', name: 'Tool Bench Studio', shortName: 'Tool Bench', desc: 'Schema-Validated Local Tool Validator, Simulators & Contracts', icon: '🛠️', category: 'Automation & Tools', hotkey: '6' },
    { id: 'netrunner-memory', name: 'Netrunner Memory', shortName: 'Memory Space', desc: 'Biomorphic Synaptic Associative Graph & Lucy Oracle Recall (:8788)', icon: '🧠', category: 'AI Agents & LLM', hotkey: '7' },
    { id: 'consensus', name: 'Consensus Arena', shortName: 'Consensus', desc: '3-Agent Triangulation, AST Synthesis & Byzantine Tiebreaker', icon: '⚖️', category: 'AI Agents & LLM', hotkey: '8' },
    { id: 'math-pillars', name: 'AI Math Pillars', shortName: 'Math Pillars', desc: 'Linear Algebra, STDP Hebbian Learning, Shannon Entropy & Manifolds', icon: '📐', category: 'Learning & Courses', hotkey: '9' },
    { id: 'vision-link', name: 'Vision Link Studio', shortName: 'Vision Link', desc: 'Multimodal Spatial OCR, Visual Telemetry & Segment Anything', icon: '👁️', category: 'AI Agents & LLM' },
    { id: 'cockpit', name: 'The Cockpit Swarm Deck', shortName: 'The Cockpit', desc: '21-Agent Autonomous Multi-Agent Command Center & Telemetry Deck', icon: '🚀', category: 'AI Agents & LLM' },
    { id: 'vos-sandbox', name: 'vOS Wasm Sandbox', shortName: 'vOS Sandbox', desc: 'In-Browser WebContainer, Wasm Linux Kernel & Terminal IDE', icon: '💻', category: 'Web Apps & SaaS' },
    { id: 'subsweep', name: 'SubSweep AST Recon', shortName: 'SubSweep', desc: 'Deep AST File Scanner, Dead Code Sweeper & Dependency Tree', icon: '🔍', category: 'Automation & Tools' },
    { id: 'agent-composer', name: 'Agent DAG Composer', shortName: 'Agent Composer', desc: 'Visual Multi-Agent Pipeline Builder & Autonomous DAG Wiring', icon: '🎼', category: 'AI Agents & LLM' },
    { id: 'edge-forge', name: 'Edge Forge Serverless', shortName: 'Edge Forge', desc: 'Netlify Edge Functions, Dynamic Prerendering & Cache Invalidation', icon: '⚡', category: 'Netlify & Creator Tools' },
    { id: 'bus-monitor', name: 'Swarm Bus NOC', shortName: 'Bus NOC', desc: 'Zero-Egress SSE Loopback Event Bus & Micro-Agent IPC Monitor', icon: '📡', category: 'Observability & Code' },
    { id: 'signal-bridge', name: 'Signal Swarm Bridge', shortName: 'Signal Bridge', desc: 'Signal Protocol E2EE Swarm Messenger, Push Relay & Mobile Daemon (:8765)', icon: '💬', category: 'Security & Vault' },
    { id: 'vault', name: 'BYOK Secrets Vault', shortName: 'BYOK Vault', desc: 'Argon2id Key Derivation, AES-256-GCM Vault & Offline Enclave', icon: '🔐', category: 'Security & Vault' },
    { id: 'web3-hub', name: 'Web3 & Solana DeFi Hub', shortName: 'Web3 Hub', desc: 'Non-Custodial Solana RPC Matrix, Multi-Chain Wallets & DEX Feeds', icon: '🪙', category: 'Crypto & Web3' },
    { id: 'pets', name: 'Companion Pets 3D Sanctuary', shortName: 'Pets 3D', desc: '21 Volumetric Mascots, Soundboard & Interactive Spirit Helpers', icon: '🦊', category: 'Creative & Media' },
    { id: 'adytum', name: 'Adytum Sanctum', shortName: 'Adytum', desc: 'Offline Cryptographic Gateway & Keys 0-21 Hermetic Planning Rite', icon: '🏛️', category: 'Security & Vault' },
    { id: 'tool-nexus', name: 'Studio Directory & Tool Nexus', shortName: 'Directory', desc: 'Complete 298-Tool Sovereign Registry & Taxonomy Manifest Index', icon: '📚', category: 'Observability & Code' }
  ];

  // 4 Studio Visual Themes
  var CANONICAL_THEMES = [
    { id: 'dark', name: 'Dark Void (Obsidian)', desc: 'Pure Midnight Void with Neon Cyan & Gold Highlights (Default)', icon: '🌑', color: '#00f0ff' },
    { id: 'light', name: 'Solar Light (Crisp)', desc: 'Clean White High-Contrast Interface with Cobalt Accents', icon: '☀️', color: '#0071e3' },
    { id: 'matrix', name: 'Cyber Matrix (CRT)', desc: 'Phosphor Green Terminal Grid with Scanline Overlay', icon: '🟩', color: '#00ff66' },
    { id: 'gold', name: 'Alchemical Gold (Hermetic)', desc: '24K Alchemical Gold with Warm Amber Bronze Hue', icon: '🌟', color: '#ffd700' }
  ];

  // Sensory, Terminal & System Actions
  var CANONICAL_ACTIONS = [
    {
      id: 'action-debate',
      name: 'Multi-Agent Consensus Debate',
      desc: 'Launch real-time debate simulator (Athena, Draco, Azoth, Hermes) in terminal REPL',
      icon: '⚖️',
      category: 'REPL Simulator',
      badge: 'ACTION',
      action: function () {
        if (window.ZothHUD && window.ZothHUD.focusTerminal) window.ZothHUD.focusTerminal();
        if (window.ZothHUD && window.ZothHUD.TerminalRepl && window.ZothHUD.TerminalRepl.execute) {
          window.ZothHUD.TerminalRepl.execute('debate');
        } else if (window.TerminalREPL && window.TerminalREPL.execute) {
          window.TerminalREPL.execute('debate');
        }
      }
    },
    {
      id: 'action-swarm-query',
      name: 'Swarm Reasoning & Execution',
      desc: 'Execute multi-agent autonomous swarm query across all 21 agents',
      icon: '🔮',
      category: 'REPL Simulator',
      badge: 'ACTION',
      action: function () {
        if (window.ZothHUD && window.ZothHUD.focusTerminal) window.ZothHUD.focusTerminal();
        if (window.ZothHUD && window.ZothHUD.TerminalRepl && window.ZothHUD.TerminalRepl.execute) {
          window.ZothHUD.TerminalRepl.execute('swarm pantheon');
        }
      }
    },
    {
      id: 'action-synthesize',
      name: 'Synthesize Consensus Blueprint',
      desc: 'Alchemically synthesize consensus and store into Lucy :8788 memory daemon',
      icon: '✨',
      category: 'REPL Simulator',
      badge: 'ACTION',
      action: function () {
        if (window.ZothHUD && window.ZothHUD.focusTerminal) window.ZothHUD.focusTerminal();
        if (window.ZothHUD && window.ZothHUD.TerminalRepl && window.ZothHUD.TerminalRepl.execute) {
          window.ZothHUD.TerminalRepl.execute('synthesize');
        }
      }
    },
    {
      id: 'action-sfx-toggle',
      name: 'Toggle Cyber SFX Audio Bus',
      desc: 'Mute / Unmute procedural Web Audio synthesizer sound effects',
      icon: '🔊',
      category: 'Sensory Cyberware',
      badge: 'ACTION',
      action: function () {
        if (window.ZothHUD && window.ZothHUD.toggleMute) {
          window.ZothHUD.toggleMute();
        } else if (window.ZothCyberpunkHUD && window.ZothCyberpunkHUD.toggleMute) {
          window.ZothCyberpunkHUD.toggleMute();
        }
      }
    },
    {
      id: 'action-sandevistan',
      name: 'Trigger Sandevistan Overdrive',
      desc: 'Engage 5.0s neural time-dilation overclock at 240 FPS with speed lines',
      icon: '⚡',
      category: 'Sensory Cyberware',
      badge: 'ACTION',
      action: function () {
        if (window.ZothHUD && window.ZothHUD.triggerSandevistan) {
          window.ZothHUD.triggerSandevistan(5000);
        }
      }
    },
    {
      id: 'action-kiroshi-zoom',
      name: 'Cycle Kiroshi Optics Zoom',
      desc: 'Cycle ocular viewport magnification (1.0x -> 1.25x -> 1.5x)',
      icon: '👁️',
      category: 'Sensory Cyberware',
      badge: 'ACTION',
      action: function () {
        if (window.ZothHUD && window.ZothHUD.cycleKiroshiZoom) {
          window.ZothHUD.cycleKiroshiZoom();
        }
      }
    },
    {
      id: 'action-horizon',
      name: 'Toggle Kiroshi Artificial Horizon',
      desc: 'Display optical flight attitude ladder & compass tape overlay (Shift+K)',
      icon: '🧭',
      category: 'Sensory Cyberware',
      badge: 'ACTION',
      action: function () {
        if (window.ZothHUD && window.ZothHUD.toggleHorizon) {
          window.ZothHUD.toggleHorizon();
        }
      }
    },
    {
      id: 'action-crt-fx',
      name: 'Toggle CRT Scanlines & Curvature',
      desc: 'Toggle authentic retro CRT phosphor scanlines and curvature vignette (Shift+C)',
      icon: '📺',
      category: 'Sensory Cyberware',
      badge: 'ACTION',
      action: function () {
        if (window.ZothHUD && window.ZothHUD.toggleCRT) {
          window.ZothHUD.toggleCRT();
        }
      }
    },
    {
      id: 'action-high-contrast',
      name: 'Toggle Tactical High Contrast',
      desc: 'Enable ultra-crisp WCAG AAA high-contrast tactical visibility mode (Shift+H)',
      icon: '🎯',
      category: 'Accessibility',
      badge: 'ACTION',
      action: function () {
        if (window.ZothHUD && window.ZothHUD.toggleHighContrast) {
          window.ZothHUD.toggleHighContrast();
        }
      }
    },
    {
      id: 'action-theater-stage',
      name: 'Toggle Fullscreen Theater Stage',
      desc: 'Expand Center Stage to 100vw/100vh full-viewport cinematic workspace (F)',
      icon: '⛶',
      category: 'Stage Mode',
      badge: 'ACTION',
      action: function () {
        if (window.ZothHUD && window.ZothHUD.toggleFullscreenStage) {
          window.ZothHUD.toggleFullscreenStage();
        }
      }
    },
    {
      id: 'action-split-stage',
      name: 'Toggle Dual-Tool Split Stage',
      desc: 'Split Center Stage into side-by-side dual workspace stages',
      icon: '⬌',
      category: 'Stage Mode',
      badge: 'ACTION',
      action: function () {
        if (window.ZothHUD && window.ZothHUD.toggleSplitStage) {
          window.ZothHUD.toggleSplitStage();
        }
      }
    },
    {
      id: 'action-memory-beat',
      name: 'Sync Lucy :8788 Vector Memory',
      desc: 'Trigger synaptic vector memory consolidation beat and pull latest working memory',
      icon: '🧠',
      category: 'Memory & Daemons',
      badge: 'ACTION',
      action: function () {
        if (window.ZothHUD && window.ZothHUD.triggerMemoryBeat) {
          window.ZothHUD.triggerMemoryBeat();
        } else if (typeof fetch !== 'undefined') {
          fetch('http://127.0.0.1:8788/v1/beat/run').catch(function () {});
        }
        if (window.ZothHUD && window.ZothHUD.addLog) {
          window.ZothHUD.addLog('MEMORY', 'Dispatched Lucy :8788 vector consolidation pulse', 'daemon');
        }
      }
    },
    {
      id: 'action-ping-ports',
      name: 'Inspect Loopback Ports Topology',
      desc: 'Perform live loopback health checks on ports :8088, :8484, :8788, :8765, :11434 (P)',
      icon: '🔌',
      category: 'Network & Daemons',
      badge: 'ACTION',
      action: function () {
        if (window.ZothHUD && window.ZothHUD.openModal) {
          window.ZothHUD.openModal('ports');
        }
      }
    },
    {
      id: 'action-shortcuts-guide',
      name: 'Open Keyboard Shortcuts Guide',
      desc: 'Display complete master keyboard command cheat sheet & guide (?)',
      icon: '⌨️',
      category: 'Help & Docs',
      badge: 'ACTION',
      action: function () {
        if (window.ZothHUD && window.ZothHUD.openShortcutsModal) {
          window.ZothHUD.openShortcutsModal();
        } else if (window.ZothCyberpunkHUD && window.ZothCyberpunkHUD.openHelpModal) {
          window.ZothCyberpunkHUD.openHelpModal();
        }
      }
    },
    {
      id: 'action-simplex-pulse',
      name: 'SimpleX: Send Swarm Pulse / Status Update',
      desc: 'Transmit live system vitals & AGY progress pulse to SimpleX chat (@4 / neal_1)',
      icon: '💬',
      category: 'Messaging & Swarm',
      badge: 'ACTION',
      action: function () {
        if (window.ZothHUD && window.ZothHUD.TerminalRepl && window.ZothHUD.TerminalRepl.execute) {
          window.ZothHUD.TerminalRepl.execute('simplex pulse');
        } else if (window.TerminalREPL && window.TerminalREPL.execute) {
          window.TerminalREPL.execute('simplex pulse');
        }
      }
    },
    {
      id: 'action-simplex-status',
      name: 'SimpleX: Check Gateway & Guardrail Status',
      desc: 'Inspect SimpleX daemon (:5225), active contacts, and guardrail monitor status',
      icon: '📡',
      category: 'Messaging & Swarm',
      badge: 'ACTION',
      action: function () {
        if (window.ZothHUD && window.ZothHUD.TerminalRepl && window.ZothHUD.TerminalRepl.execute) {
          window.ZothHUD.TerminalRepl.execute('simplex status');
        } else if (window.TerminalREPL && window.TerminalREPL.execute) {
          window.TerminalREPL.execute('simplex status');
        }
      }
    }
  ];

  /**
   * Helper function for procedural audio sound effect triggers
   */
  function triggerAudio(sound) {
    if (typeof window !== 'undefined') {
      if (window.ZothHUD && window.ZothHUD.playSFX) {
        window.ZothHUD.playSFX(sound);
      } else if (window.ZothCyberpunkHUD && window.ZothCyberpunkHUD.playSFX) {
        window.ZothCyberpunkHUD.playSFX(sound);
      }
    }
  }

  /**
   * High-Performance Fuzzy Search Scoring Function
   */
  function scoreMatch(query, targetText) {
    if (!query || !targetText) return -1;
    var q = query.toLowerCase().trim();
    var t = targetText.toLowerCase();

    if (t === q) return 1000;
    if (t.startsWith(q)) return 500 + (100 - t.length);
    var subIdx = t.indexOf(q);
    if (subIdx !== -1) return 300 - subIdx;

    // Subsequence fuzzy match
    var qIdx = 0;
    var score = 0;
    var consecutive = 0;
    for (var i = 0; i < t.length && qIdx < q.length; i++) {
      if (t[i] === q[qIdx]) {
        score += 10 + (consecutive * 5);
        consecutive++;
        qIdx++;
      } else {
        consecutive = 0;
      }
    }
    return qIdx === q.length ? score : -1;
  }

  /**
   * Highlight matched characters with <mark> tags safely
   */
  function highlightMatches(text, query) {
    if (!query || !text) return escapeHtml(text);
    var q = query.toLowerCase().trim();
    var t = text;
    var lower = t.toLowerCase();
    var idx = lower.indexOf(q);
    if (idx !== -1) {
      return escapeHtml(t.slice(0, idx)) +
        '<mark>' + escapeHtml(t.slice(idx, idx + q.length)) + '</mark>' +
        escapeHtml(t.slice(idx + q.length));
    }
    return escapeHtml(text);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * ZothHUDPalette Controller Engine
   */
  var ZothHUDPalette = {
    isOpen: false,
    activeTab: 'all',
    searchQuery: '',
    selectedIndex: 0,
    filteredItems: [],
    overlayEl: null,
    inputEl: null,
    resultsEl: null,
    dialogEl: null,
    tabsEl: null,
    totalCount: 0,

    init: function () {
      if (typeof document === 'undefined') return;
      this.ensureDOM();
      this.bindGlobalKeyboard();
      this.buildDataset();
    },

    /**
     * Build unified search dataset across all 5 domains
     */
    buildDataset: function () {
      var items = [];

      // 1. 21 Sovereign Agents
      var agentsSource = (typeof window !== 'undefined' && window.ZOTH_ALL_AGENTS) ||
                         (window.ZothCyberpunkHUD && window.ZothCyberpunkHUD.getAgentsRoster ? window.ZothCyberpunkHUD.getAgentsRoster() : null) ||
                         CANONICAL_21_AGENTS;

      agentsSource.forEach(function (agent) {
        items.push({
          id: agent.id,
          type: 'agent',
          badge: 'AGENT',
          name: agent.name + (agent.role ? ' — ' + agent.role : ''),
          shortName: agent.name,
          desc: agent.desc || ('Sovereign Swarm Agent · Domain: ' + (agent.domain || 'Sovereign Core')),
          icon: agent.icon || '🔮',
          avatar: agent.avatar || ('/assets/agents/' + agent.id + '.jpg'),
          category: agent.domain || 'Swarm Pantheon',
          tags: ['agent', 'swarm', agent.id, (agent.role || '').toLowerCase(), (agent.domain || '').toLowerCase()],
          action: function () {
            if (window.ZothHUD && window.ZothHUD.setAgent) {
              window.ZothHUD.setAgent(agent.id);
            } else if (window.ZothCyberpunkHUD && window.ZothCyberpunkHUD.setAgent) {
              window.ZothCyberpunkHUD.setAgent(agent.id);
            }
          }
        });
      });

      // 2. Flagship Workstations & Hubs
      var wsSource = (typeof window !== 'undefined' && (window.PRIMARY_WORKSTATIONS || window.ZOTH_HUD_WORKSTATIONS)) || CANONICAL_WORKSTATIONS;
      wsSource.forEach(function (ws) {
        items.push({
          id: ws.id,
          type: 'workstation',
          badge: 'WORKSTATION',
          name: ws.name,
          shortName: ws.shortName || ws.name,
          desc: ws.desc || (ws.category ? ws.category + ' Workstation' : 'Studio Workstation'),
          icon: ws.icon || '🚀',
          category: ws.category || 'Workstation',
          hotkey: ws.hotkey || null,
          tags: ['workstation', 'stage', ws.id, (ws.shortName || '').toLowerCase()].concat(ws.tags || []),
          action: function () {
            if (window.ZothHUD && window.ZothHUD.loadTool) {
              window.ZothHUD.loadTool(ws.id);
            } else if (window.ZothCyberpunkHUD && window.ZothCyberpunkHUD.loadTool) {
              window.ZothCyberpunkHUD.loadTool(ws.id);
            }
          }
        });
      });

      // 3. 298+ Tools Registry Manifest
      var toolsSource = (typeof window !== 'undefined' && (window.TOOL_DETAILS || window.TOOL_NEXUS_DATA)) || [];
      toolsSource.forEach(function (t) {
        // Skip duplicates of workstations already present
        var isDuplicate = items.some(function (it) { return it.type === 'workstation' && it.id === t.id; });
        if (!isDuplicate) {
          items.push({
            id: t.id,
            type: 'tool',
            badge: 'TOOL',
            name: t.name,
            shortName: t.name,
            desc: t.desc || (t.category + ' · Contract: ' + (t.contract || 'SCHEMA VALIDATED')),
            icon: '🛠️',
            category: t.category || 'Tool Registry',
            tags: ['tool', t.id, (t.catSlug || '').toLowerCase()].concat((t.tags || '').split(',').map(function (s) { return s.trim().toLowerCase(); })),
            action: function () {
              if (window.ZothHUD && window.ZothHUD.loadTool) {
                window.ZothHUD.loadTool(t.id);
              } else if (window.ZothCyberpunkHUD && window.ZothCyberpunkHUD.loadTool) {
                window.ZothCyberpunkHUD.loadTool(t.id);
              }
            }
          });
        }
      });

      // 4. 4 Visual Themes
      CANONICAL_THEMES.forEach(function (th) {
        items.push({
          id: th.id,
          type: 'theme',
          badge: 'THEME',
          name: 'Theme: ' + th.name,
          shortName: th.name,
          desc: th.desc,
          icon: th.icon,
          color: th.color,
          category: 'Visual Themes',
          tags: ['theme', th.id, 'color', 'dark', 'light', 'matrix', 'gold'],
          action: function () {
            if (window.ZothHUD && window.ZothHUD.setTheme) {
              window.ZothHUD.setTheme(th.id);
            } else if (window.ZothCyberpunkHUD && window.ZothCyberpunkHUD.setTheme) {
              window.ZothCyberpunkHUD.setTheme(th.id);
            }
          }
        });
      });

      // 5. Sensory & Tactical Actions
      CANONICAL_ACTIONS.forEach(function (act) {
        items.push({
          id: act.id,
          type: 'action',
          badge: act.badge || 'ACTION',
          name: act.name,
          shortName: act.name,
          desc: act.desc,
          icon: act.icon,
          category: act.category,
          tags: ['action', act.id, act.name.toLowerCase()],
          action: act.action
        });
      });

      this.allItems = items;
      this.totalCount = items.length;
      return items;
    },

    /**
     * Ensure Command Palette DOM elements are inserted into the document
     */
    ensureDOM: function () {
      if (document.getElementById('zoth-command-palette-overlay')) {
        this.overlayEl = document.getElementById('zoth-command-palette-overlay');
        this.inputEl = document.getElementById('zoth-palette-input');
        this.resultsEl = document.getElementById('zoth-palette-results');
        this.dialogEl = document.getElementById('zoth-palette-dialog');
        this.tabsEl = document.getElementById('zoth-palette-tabs');
        return;
      }

      var overlay = document.createElement('div');
      overlay.id = 'zoth-command-palette-overlay';
      overlay.className = 'zoth-palette-overlay';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');
      overlay.setAttribute('aria-label', 'Zoth Studio Sovereign Command Palette');

      overlay.innerHTML =
        '<div class="zoth-palette-dialog" id="zoth-palette-dialog" onclick="event.stopPropagation()">' +
          '<div class="zoth-palette-header">' +
            '<span class="zoth-palette-brand-tag">⚡ [COMMAND]</span>' +
            '<input type="text" id="zoth-palette-input" class="zoth-palette-input" placeholder="Type a command, tool, agent (Athena, Draco), theme or action..." autocomplete="off" autocorrect="off" spellcheck="false" role="combobox" aria-expanded="true" aria-controls="zoth-palette-results" />' +
            '<button type="button" class="zoth-palette-shortcut-badge" onclick="ZothHUDPalette.close()" aria-label="Close command palette" title="Close (Esc)">ESC</button>' +
          '</div>' +
          '<div class="zoth-palette-tabs" id="zoth-palette-tabs" role="tablist">' +
            '<button type="button" class="zoth-palette-tab is-active" data-tab="all" role="tab">ALL</button>' +
            '<button type="button" class="zoth-palette-tab" data-tab="tool" role="tab">TOOLS (298)</button>' +
            '<button type="button" class="zoth-palette-tab" data-tab="agent" role="tab">AGENTS (21)</button>' +
            '<button type="button" class="zoth-palette-tab" data-tab="workstation" role="tab">WORKSTATIONS</button>' +
            '<button type="button" class="zoth-palette-tab" data-tab="theme" role="tab">THEMES (4)</button>' +
            '<button type="button" class="zoth-palette-tab" data-tab="action" role="tab">ACTIONS</button>' +
          '</div>' +
          '<div class="zoth-palette-results" id="zoth-palette-results" role="listbox"></div>' +
          '<div class="zoth-palette-footer">' +
            '<div class="zoth-palette-footer-hints">' +
              '<span class="zoth-palette-footer-hint"><kbd>↑</kbd><kbd>↓</kbd> Navigate</span>' +
              '<span class="zoth-palette-footer-hint"><kbd>↵</kbd> Execute</span>' +
              '<span class="zoth-palette-footer-hint"><kbd>Tab</kbd> Filter</span>' +
              '<span class="zoth-palette-footer-hint"><kbd>ESC</kbd> Close</span>' +
            '</div>' +
            '<div class="zoth-palette-footer-stats" id="zoth-palette-stats">298+ Tools Indexed</div>' +
          '</div>' +
        '</div>';

      var self = this;
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) {
          self.close();
        }
      });

      document.body.appendChild(overlay);

      this.overlayEl = overlay;
      this.inputEl = (overlay.querySelector && overlay.querySelector('#zoth-palette-input')) || document.getElementById('zoth-palette-input');
      this.resultsEl = (overlay.querySelector && overlay.querySelector('#zoth-palette-results')) || document.getElementById('zoth-palette-results');
      this.dialogEl = (overlay.querySelector && overlay.querySelector('#zoth-palette-dialog')) || document.getElementById('zoth-palette-dialog');
      this.tabsEl = (overlay.querySelector && overlay.querySelector('#zoth-palette-tabs')) || document.getElementById('zoth-palette-tabs');

      // Bind input events
      if (this.inputEl) {
        this.inputEl.addEventListener('input', function () {
          self.search(self.inputEl.value);
        });

        this.inputEl.addEventListener('keydown', function (e) {
          self.handleKeyDown(e);
        });
      }

      // Bind tab clicks
      if (this.tabsEl && this.tabsEl.querySelectorAll) {
        var tabBtns = this.tabsEl.querySelectorAll('.zoth-palette-tab');
        tabBtns.forEach(function (btn) {
          btn.addEventListener('click', function () {
            self.setTab(btn.getAttribute('data-tab'));
          });
        });
      }
    },

    /**
     * Bind Global Keyboard Shortcuts (Ctrl+K / Cmd+K)
     */
    bindGlobalKeyboard: function () {
      var self = this;
      window.addEventListener('keydown', function (e) {
        // Ctrl+K or Cmd+K
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
          e.preventDefault();
          self.toggle();
        }
      });
    },

    /**
     * Open the Command Palette
     */
    open: function (initialQuery, initialTab) {
      this.ensureDOM();
      this.buildDataset();
      this.isOpen = true;
      this.activeTab = initialTab || 'all';
      this.updateTabUI();

      this.overlayEl.classList.add('is-active');
      this.overlayEl.removeAttribute('hidden');

      if (typeof initialQuery === 'string') {
        this.inputEl.value = initialQuery;
        this.search(initialQuery);
      } else {
        this.inputEl.value = '';
        this.search('');
      }

      var self = this;
      setTimeout(function () {
        if (self.inputEl) {
          self.inputEl.focus();
          self.inputEl.select();
        }
      }, 50);

      triggerAudio('chirp');
    },

    /**
     * Close the Command Palette
     */
    close: function () {
      if (!this.isOpen && (!this.overlayEl || !this.overlayEl.classList.contains('is-active'))) return;
      this.isOpen = false;
      if (this.overlayEl) {
        this.overlayEl.classList.remove('is-active');
      }
      triggerAudio('click');
    },

    /**
     * Toggle open/close state
     */
    toggle: function () {
      if (this.isOpen) {
        this.close();
      } else {
        this.open();
      }
    },

    /**
     * Set active filter tab ('all', 'tool', 'agent', 'workstation', 'theme', 'action')
     */
    setTab: function (tab) {
      this.activeTab = tab || 'all';
      this.updateTabUI();
      this.search(this.inputEl ? this.inputEl.value : '');
      triggerAudio('select');
    },

    updateTabUI: function () {
      if (!this.tabsEl) return;
      var self = this;
      var tabs = this.tabsEl.querySelectorAll('.zoth-palette-tab');
      tabs.forEach(function (t) {
        t.classList.toggle('is-active', t.getAttribute('data-tab') === self.activeTab);
      });
    },

    /**
     * Execute search query and rank results
     */
    search: function (rawQuery) {
      this.searchQuery = rawQuery || '';
      var q = this.searchQuery.trim().toLowerCase();

      // Check for prefix filters e.g. "agent:draco" or "tool:ast"
      var effectiveTab = this.activeTab;
      if (q.startsWith('agent:')) {
        effectiveTab = 'agent';
        q = q.replace('agent:', '').trim();
      } else if (q.startsWith('tool:')) {
        effectiveTab = 'tool';
        q = q.replace('tool:', '').trim();
      } else if (q.startsWith('ws:') || q.startsWith('workstation:')) {
        effectiveTab = 'workstation';
        q = q.replace(/^(ws|workstation):/, '').trim();
      } else if (q.startsWith('theme:')) {
        effectiveTab = 'theme';
        q = q.replace('theme:', '').trim();
      } else if (q.startsWith('action:')) {
        effectiveTab = 'action';
        q = q.replace('action:', '').trim();
      }

      var items = this.allItems || this.buildDataset();
      var scored = [];

      for (var i = 0; i < items.length; i++) {
        var it = items[i];

        // Apply Tab Filter
        if (effectiveTab !== 'all' && it.type !== effectiveTab) {
          continue;
        }

        if (!q) {
          // Default listing score prioritized by type
          var typePriority = 0;
          if (it.type === 'action') typePriority = 50;
          else if (it.type === 'workstation') typePriority = 40;
          else if (it.type === 'agent') typePriority = 30;
          else if (it.type === 'theme') typePriority = 20;
          else typePriority = 10;
          scored.push({ item: it, score: typePriority });
          continue;
        }

        // Compute Match Score
        var nameScore = scoreMatch(q, it.name) * 3.0;
        var shortScore = scoreMatch(q, it.shortName || '') * 3.5;
        var idScore = scoreMatch(q, it.id) * 2.5;
        var descScore = scoreMatch(q, it.desc || '') * 1.0;
        var catScore = scoreMatch(q, it.category || '') * 1.5;

        var tagScore = 0;
        if (it.tags && it.tags.length) {
          for (var tIdx = 0; tIdx < it.tags.length; tIdx++) {
            var ts = scoreMatch(q, it.tags[tIdx]);
            if (ts > tagScore) tagScore = ts;
          }
        }

        var maxScore = Math.max(nameScore, shortScore, idScore, descScore, catScore, tagScore);
        if (maxScore > 0) {
          scored.push({ item: it, score: maxScore });
        }
      }

      // Sort by score descending
      scored.sort(function (a, b) {
        return b.score - a.score;
      });

      // Limit results to top 80 for instant performance
      this.filteredItems = scored.slice(0, 80).map(function (s) { return s.item; });
      this.selectedIndex = 0;
      this.renderResults();
    },

    /**
     * Render the filtered results list
     */
    renderResults: function () {
      if (!this.resultsEl) return;
      var self = this;
      var items = this.filteredItems;
      var q = this.searchQuery;

      if (items.length === 0) {
        this.resultsEl.innerHTML =
          '<div class="zoth-palette-empty">' +
            '<div class="zoth-palette-empty-icon">🔍</div>' +
            '<div class="zoth-palette-empty-title">NO SOVEREIGN ENTITIES FOUND</div>' +
            '<div class="zoth-palette-empty-desc">Try searching for tools (e.g. omnipost, wasm, ast), sovereign agents (Athena, Draco, Hermes), or themes (Matrix, Gold).</div>' +
          '</div>';
        this.updateStats(0);
        return;
      }

      var html = '';
      for (var i = 0; i < items.length; i++) {
        var it = items[i];
        var isSelected = (i === this.selectedIndex);
        var badgeCls = 'badge-' + (it.type || 'tool');
        var badgeText = it.badge || it.type.toUpperCase();

        var iconHtml = it.icon || '⚡';
        if (it.type === 'agent' && it.avatar) {
          iconHtml = '<img class="zoth-palette-item-avatar" src="' + it.avatar + '" alt="' + escapeHtml(it.name) + '" onerror="this.outerHTML=\'' + (it.icon || '🔮') + '\'" />';
        }

        var keyHint = '';
        if (it.hotkey) {
          keyHint = '<span class="zoth-palette-item-key">[' + it.hotkey + ']</span>';
        } else if (isSelected) {
          keyHint = '<span class="zoth-palette-item-key">↵ SELECT</span>';
        }

        html +=
          '<div class="zoth-palette-item ' + (isSelected ? 'is-selected' : '') + '" data-index="' + i + '" role="option" aria-selected="' + String(isSelected) + '">' +
            '<div class="zoth-palette-item-icon">' + iconHtml + '</div>' +
            '<div class="zoth-palette-item-content">' +
              '<div class="zoth-palette-item-top">' +
                '<span class="zoth-palette-item-name">' + highlightMatches(it.name, q) + '</span>' +
                '<span class="zoth-palette-badge ' + badgeCls + '">' + badgeText + '</span>' +
              '</div>' +
              '<div class="zoth-palette-item-desc">' + highlightMatches(it.desc, q) + '</div>' +
            '</div>' +
            keyHint +
          '</div>';
      }

      this.resultsEl.innerHTML = html;

      // Bind click handlers to rendered rows
      var itemEls = this.resultsEl.querySelectorAll('.zoth-palette-item');
      itemEls.forEach(function (el) {
        el.addEventListener('click', function () {
          var idx = parseInt(el.getAttribute('data-index'), 10);
          self.selectIndex(idx);
          self.executeCurrent();
        });
        el.addEventListener('mouseenter', function () {
          var idx = parseInt(el.getAttribute('data-index'), 10);
          self.selectIndex(idx, false);
        });
      });

      this.updateStats(items.length);
    },

    updateStats: function (count) {
      var statsEl = document.getElementById('zoth-palette-stats');
      if (statsEl) {
        statsEl.textContent = count + ' of ' + this.totalCount + ' Entities';
      }
    },

    selectIndex: function (idx, scroll) {
      if (this.filteredItems.length === 0) return;
      if (idx < 0) idx = 0;
      if (idx >= this.filteredItems.length) idx = this.filteredItems.length - 1;
      this.selectedIndex = idx;

      var itemEls = this.resultsEl ? this.resultsEl.querySelectorAll('.zoth-palette-item') : [];
      itemEls.forEach(function (el, i) {
        var sel = (i === idx);
        el.classList.toggle('is-selected', sel);
        el.setAttribute('aria-selected', String(sel));
        var keyEl = el.querySelector('.zoth-palette-item-key');
        if (keyEl && !el.getAttribute('data-hotkey')) {
          keyEl.textContent = sel ? '↵ SELECT' : '';
        }
      });

      if (scroll !== false && itemEls[idx]) {
        itemEls[idx].scrollIntoView({ block: 'nearest' });
      }
    },

    handleKeyDown: function (e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        this.close();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        var next = (this.selectedIndex + 1) % (this.filteredItems.length || 1);
        this.selectIndex(next, true);
        triggerAudio('hover');
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        var prev = (this.selectedIndex - 1 + this.filteredItems.length) % (this.filteredItems.length || 1);
        this.selectIndex(prev, true);
        triggerAudio('hover');
      } else if (e.key === 'Enter') {
        e.preventDefault();
        this.executeCurrent();
      } else if (e.key === 'Tab') {
        e.preventDefault();
        this.cycleTab();
      }
    },

    cycleTab: function () {
      var tabs = ['all', 'tool', 'agent', 'workstation', 'theme', 'action'];
      var curIdx = tabs.indexOf(this.activeTab);
      var nextTab = tabs[(curIdx + 1) % tabs.length];
      this.setTab(nextTab);
    },

    /**
     * Execute the currently selected command item
     */
    executeCurrent: function () {
      if (this.filteredItems.length === 0 || this.selectedIndex < 0) return;
      var item = this.filteredItems[this.selectedIndex];
      if (!item) return;

      this.close();
      this.executeItem(item);
    },

    /**
     * Execute a specific command item
     */
    executeItem: function (item) {
      if (!item) return;

      triggerAudio('select');

      if (typeof item.action === 'function') {
        try {
          item.action();
        } catch (err) {
          console.error('[ZOTH PALETTE] Action execution error:', err);
        }
      }

      if (window.ZothHUD && window.ZothHUD.addLog) {
        window.ZothHUD.addLog('COMMAND', 'Palette executed: ' + item.name + ' [' + item.badge + ']', 'action');
      }
    },

    getItems: function () {
      return this.allItems || this.buildDataset();
    },

    getState: function () {
      return {
        isOpen: this.isOpen,
        activeTab: this.activeTab,
        searchQuery: this.searchQuery,
        selectedIndex: this.selectedIndex,
        filteredCount: this.filteredItems.length,
        totalCount: this.totalCount
      };
    }
  };

  // Expose global singleton
  window.ZothHUDPalette = ZothHUDPalette;
  window.ZothCommandPalette = ZothHUDPalette;

  // Auto-init on DOM readiness
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      ZothHUDPalette.init();
    });
  } else {
    ZothHUDPalette.init();
  }

})(typeof window !== 'undefined' ? window : this, typeof document !== 'undefined' ? document : {});
