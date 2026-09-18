/**
 * Canonical workstation list for the Cyberpunk HUD (studio index = 21 stations).
 */
(function (win) {
  'use strict';
  var WS = [
    { id: 'vos-sandbox', name: 'vOS Sandbox', shortName: 'vOS', url: '/studio/vos-sandbox.html', category: 'No-Code & Creators', catSlug: 'nocode', tags: ['WASM', 'IDE'] },
    { id: 'webgen', name: 'WebGen Studio', shortName: 'WebGen', url: '/studio/webgen.html', category: 'No-Code & Creators', catSlug: 'nocode', tags: ['FOUNDRY', 'PTY'] },
    { id: 'netlify-ax', name: 'Netlify AX Suite', shortName: 'Netlify AX', url: '/studio/netlify-ax.html', category: 'No-Code & Creators', catSlug: 'nocode', tags: ['NETLIFY', 'HEAL'] },
    { id: 'swarm', name: '3D Swarm Arena', shortName: 'Swarm', url: '/studio/swarm.html', category: 'Swarms & Consensus', catSlug: 'swarm', tags: ['WEBGL', 'ARENA'] },
    { id: 'consensus', name: 'Consensus Arena', shortName: 'Consensus', url: '/studio/consensus.html', category: 'Swarms & Consensus', catSlug: 'swarm', tags: ['AST', '3-AGENT'] },
    { id: 'agent-composer', name: 'DAG Agent Composer', shortName: 'Composer', url: '/studio/agent-composer.html', category: 'Swarms & Consensus', catSlug: 'swarm', tags: ['DAG', 'PIPELINES'] },
    { id: 'agents', name: 'Agent Codex', shortName: 'Agents', url: '/agents/', category: 'Swarms & Consensus', catSlug: 'swarm', tags: ['PANTHEON', '21'] },
    { id: 'pets-studio', name: '3D Pet Studio', shortName: 'Pet Studio', url: '/pets/pet-studio.html', category: '3D & Spatial', catSlug: '3d', tags: ['MASCOTS', '3D'] },
    { id: 'vision-link', name: 'Vision Link', shortName: 'Vision', url: '/studio/vision-link.html', category: '3D & Spatial', catSlug: '3d', tags: ['SPATIAL', 'HUD'] },
    { id: 'pets', name: 'Companion Hangar', shortName: 'Hangar', url: '/pets/', category: '3D & Spatial', catSlug: '3d', tags: ['SPIRITS'] },
    { id: 'ide', name: 'Sovereign IDE', shortName: 'IDE', url: '/studio/ide.html', category: 'Observability & Code', catSlug: 'observability', tags: ['EDITOR', 'AST'] },
    { id: 'tool-bench', name: 'Tool Bench', shortName: 'Bench', url: '/studio/tool-bench.html', category: 'Observability & Code', catSlug: 'observability', tags: ['CONTRACTS'] },
    { id: 'math-pillars', name: 'AI Math Pillars', shortName: 'Math', url: '/studio/math-pillars.html', category: 'Observability & Code', catSlug: 'observability', tags: ['MATH'] },
    { id: 'bus-monitor', name: 'Swarm Bus NOC', shortName: 'Bus NOC', url: '/studio/bus-monitor.html', category: 'Observability & Code', catSlug: 'observability', tags: ['SSE', 'IPC'] },
    { id: 'models', name: 'Model Foundry', shortName: 'Models', url: '/studio/models.html', category: 'Observability & Code', catSlug: 'observability', tags: ['VRAM', 'OLLAMA'] },
    { id: 'notes-reviewer', name: 'Notes Reviewer', shortName: 'Notes', url: '/studio/notes-reviewer.html', category: 'Observability & Code', catSlug: 'observability', tags: ['ANNOTATE'] },
    { id: 'omnipost', name: 'OmniPost 2.0', shortName: 'OmniPost', url: '/studio/omnipost.html', category: 'Creative & Media', catSlug: 'creative', tags: ['60 FPS'] },
    { id: 'nexus-3d', name: 'Nexus 3D', shortName: 'Nexus 3D', url: '/studio/nexus-3d.html', category: '3D & Spatial', catSlug: '3d', tags: ['CAD'] },
    { id: '3d-editor', name: '3D Studio CAD', shortName: '3D CAD', url: '/studio/3d-editor.html', category: '3D & Spatial', catSlug: '3d', tags: ['THREE.JS'] },
    { id: 'netrunner-memory', name: 'Netrunner Memory', shortName: 'Memory', url: '/studio/netrunner-memory.html', category: 'Observability & Code', catSlug: 'observability', tags: ['LUCY'] },
    { id: 'vault', name: 'BYOK Vault', shortName: 'Vault', url: '/vault/', category: 'Security & Vault', catSlug: 'security', tags: ['ARGON2ID'] },
    { id: 'adytum', name: 'Adytum Sanctum', shortName: 'Adytum', url: '/adytum/', category: 'Security & Vault', catSlug: 'security', tags: ['RITE'] },
    { id: 'signal', name: 'Signal Bridge', shortName: 'Signal', url: '/signal/', category: 'Security & Vault', catSlug: 'security', tags: ['MOBILE'] },
    { id: 'docs', name: 'Studio Docs', shortName: 'Docs', url: '/docs/', category: 'Security & Vault', catSlug: 'security', tags: ['MANUAL'] },
    { id: 'web3-hub', name: 'Web3 Hub', shortName: 'Web3', url: '/studio/web3-hub.html', category: 'No-Code & Creators', catSlug: 'nocode', tags: ['SOLANA'] },
    { id: 'secure-comms', name: 'SimpleX ↔ Matrix', shortName: 'SimpleX', url: '/secure-comms/', category: 'Security & Vault', catSlug: 'security', tags: ['E2EE', 'GATEWAY'] },
    { id: 'cockpit', name: 'The Cockpit', shortName: 'Cockpit', url: '/studio/cockpit.html', category: 'Swarms & Consensus', catSlug: 'swarm', tags: ['SWARM', 'COMMAND'] },
    { id: 'tool-nexus', name: 'Studio Directory', shortName: 'Directory', url: '/studio/tool-nexus.html', category: 'Observability & Code', catSlug: 'observability', tags: ['INDEX', 'TOOLS'] }
  ];

  var PATH_TO_ID = {
    '/studio/cockpit.html': 'cockpit',
    '/studio/cyberpunk-hud.html': 'cockpit',
    '/studio/vos-sandbox.html': 'vos-sandbox',
    '/studio/webgen.html': 'webgen',
    '/studio/netlify-ax.html': 'netlify-ax',
    '/studio/swarm.html': 'swarm',
    '/studio/consensus.html': 'consensus',
    '/studio/agent-composer.html': 'agent-composer',
    '/agents/': 'agents',
    '/agents/index.html': 'agents',
    '/pets/pet-studio.html': 'pets-studio',
    '/studio/vision-link.html': 'vision-link',
    '/pets/': 'pets',
    '/pets/index.html': 'pets',
    '/studio/ide.html': 'ide',
    '/studio/tool-bench.html': 'tool-bench',
    '/studio/math-pillars.html': 'math-pillars',
    '/studio/bus-monitor.html': 'bus-monitor',
    '/studio/models.html': 'models',
    '/studio/notes-reviewer.html': 'notes-reviewer',
    '/studio/omnipost.html': 'omnipost',
    '/studio/nexus-3d.html': 'nexus-3d',
    '/studio/3d-editor.html': '3d-editor',
    '/studio/netrunner-memory.html': 'netrunner-memory',
    '/vault/': 'vault',
    '/vault/index.html': 'vault',
    '/adytum/': 'adytum',
    '/adytum/index.html': 'adytum',
    '/signal/': 'signal',
    '/signal/index.html': 'signal',
    '/docs/': 'docs',
    '/docs/index.html': 'docs',
    '/studio/web3-hub.html': 'web3-hub',
    '/studio/edge-forge.html': 'edge-forge',
    '/studio/subsweep.html': 'subsweep',
    '/studio/fusion-arena.html': 'fusion-arena',
    '/studio/signal-bridge.html': 'signal-bridge',
    '/secure-comms/': 'secure-comms',
    '/secure-comms/index.html': 'secure-comms',
    '/studio/': 'tool-nexus',
    '/studio/index.html': 'tool-nexus',
    '/studio/tool-nexus.html': 'tool-nexus'
  };

  win.ZOTH_HUD_WORKSTATIONS = WS;
  win.ZOTH_HUD_PATH_TO_TOOL = PATH_TO_ID;
  win.ZOTH_HUD_LAYOUT = '/studio/cockpit.html';

  win.zothHudUrlForPath = function (pathname) {
    var id = PATH_TO_ID[pathname] || PATH_TO_ID[pathname.replace(/\/$/, '/')];
    if (!id) return null;
    return win.ZOTH_HUD_LAYOUT + '?tool=' + encodeURIComponent(id);
  };
})(typeof window !== 'undefined' ? window : this);
