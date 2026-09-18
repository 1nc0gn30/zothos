/**
 * ⚡ ZOTH STUDIO — CYBERPUNK HUD EMBEDDED WORKSPACE & AUTO-ADAPTER (v5.0 SOVEREIGN)
 * 
 * Auto-adapts any Zoth Studio tool or page when rendered inside the Cyberpunk HUD Stage iframe:
 * 1. Suppresses duplicate navigation bars, marketing headers, and massive hero banners.
 * 2. Expands the workspace to 100% viewport height with zero wasted scroll margin.
 * 3. Synchronizes theme ('dark', 'light', 'matrix', 'gold') in real-time with parent HUD.
 * 4. Adds a floating [ 🎮 LAUNCH IN CYBERPUNK HUD ] badge when opened standalone in a browser.
 */

(function (win, doc) {
  'use strict';

  var FALLBACK_PATH_MAP = {
    '/studio/vos-sandbox.html': 'vos-sandbox',
    '/studio/webgen.html': 'webgen',
    '/studio/netlify-ax.html': 'netlify-ax',
    '/studio/swarm.html': 'swarm',
    '/studio/consensus.html': 'consensus',
    '/studio/agent-composer.html': 'agent-composer',
    '/studio/vision-link.html': 'vision-link',
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
    '/studio/web3-hub.html': 'web3-hub',
    '/studio/edge-forge.html': 'edge-forge',
    '/studio/subsweep.html': 'subsweep',
    '/studio/fusion-arena.html': 'fusion-arena',
    '/studio/signal-bridge.html': 'signal',
    '/vault/': 'vault',
    '/adytum/': 'adytum',
    '/signal/': 'signal',
    '/docs/': 'docs',
    '/pets/': 'pets',
    '/pets/pet-studio.html': 'pets-studio',
    '/agents/': 'agents'
  };

  var isEmbedded = false;
  try {
    isEmbedded = (win.self !== win.top) || 
                 win.location.search.indexOf('embed=1') !== -1 || 
                 win.location.search.indexOf('in_hud=1') !== -1 ||
                 win.location.search.indexOf('hud=1') !== -1;
  } catch (e) {
    isEmbedded = true;
  }

  // Registry for tool-specific action callbacks
  var actionCallbacks = {};

  var ZothEmbeddedAdapter = {
    isEmbedded: function () { return isEmbedded; },
    
    onAction: function (actionName, callback) {
      if (typeof callback === 'function') {
        actionCallbacks[actionName] = actionCallbacks[actionName] || [];
        actionCallbacks[actionName].push(callback);
      }
    },

    sendToHUD: function (type, payload) {
      try {
        if (win.parent && win.parent.postMessage) {
          win.parent.postMessage({
            type: type || 'ZOTH_TOOL_EVENT',
            payload: payload || {},
            url: win.location.pathname + win.location.search,
            timestamp: Date.now()
          }, '*');
        }
      } catch (e) {}
    },

    handleHUDAction: function (actionName, payload) {
      // 1. Trigger registered custom callbacks
      if (actionCallbacks[actionName]) {
        actionCallbacks[actionName].forEach(function (cb) {
          try { cb(payload); } catch (err) { console.warn('[HUD Adapter Callback Error]', err); }
        });
      }

      // 2. Dispatch DOM custom event
      try {
        win.dispatchEvent(new CustomEvent('zoth:hud-action', {
          detail: { action: actionName, payload: payload }
        }));
      } catch (e) {}

      // 3. Fallback to automated DOM element actions
      handleDefaultDOMAction(actionName, payload);
    }
  };

  function safeClick(el) {
    if (el && typeof el.click === 'function') {
      try { el.click(); } catch (e) {}
    }
  }

  function handleDefaultDOMAction(action, payload) {
    // OmniPost actions
    if (action === 'render_60fps' || action === 'render_video') {
      var renderBtn = doc.getElementById('btn-render-video') || 
                     doc.getElementById('omni-render-btn') || 
                     doc.querySelector('.omni-render-btn, [data-action="render"]');
      safeClick(renderBtn);
      if (win.OmniStudio && win.OmniStudio.renderVideo) win.OmniStudio.renderVideo();
    } else if (action === 'set_aspect') {
      var aspect = payload && payload.ratio ? payload.ratio : payload;
      var ratioBtn = doc.querySelector('[data-ratio="' + aspect + '"]');
      safeClick(ratioBtn);
      if (win.OmniStudio && win.OmniStudio.setAspectRatio) win.OmniStudio.setAspectRatio(aspect);
    } else if (action === 'toggle_soundscape' || action === 'synth_track') {
      var audioBtn = doc.getElementById('btn-play-audio') || doc.querySelector('.omni-audio-toggle');
      safeClick(audioBtn);
    }

    // 3D CAD & Nexus 3D actions
    else if (action === 'toggle_wireframe') {
      var wireBtn = doc.getElementById('btn-wireframe') || doc.querySelector('[data-action="wireframe"]');
      safeClick(wireBtn);
      if (win.Nexus3D && win.Nexus3D.toggleWireframe) win.Nexus3D.toggleWireframe();
      if (win.Scene3D && win.Scene3D.toggleWireframe) win.Scene3D.toggleWireframe();
    } else if (action === 'spawn_mesh') {
      var shape = payload && payload.shape ? payload.shape : payload;
      var spawnBtn = doc.getElementById('btn-spawn-' + shape) || doc.querySelector('[data-spawn="' + shape + '"]');
      safeClick(spawnBtn);
      if (win.Nexus3D && win.Nexus3D.spawnMesh) win.Nexus3D.spawnMesh(shape);
      if (win.Scene3D && win.Scene3D.addMesh) win.Scene3D.addMesh(shape);
    } else if (action === 'snapshot_canvas') {
      var snapBtn = doc.getElementById('btn-snapshot') || doc.querySelector('[data-action="snapshot"]');
      safeClick(snapBtn);
      if (win.Nexus3D && win.Nexus3D.captureSnapshot) win.Nexus3D.captureSnapshot();
    }

    // Swarm Arena actions
    else if (action === 'triangulate_lasers') {
      var triBtn = doc.getElementById('btn-triangulate') || doc.querySelector('[data-action="triangulate"]');
      safeClick(triBtn);
      if (win.SwarmArena && win.SwarmArena.triangulateLasers) win.SwarmArena.triangulateLasers();
    }

    // Consensus Battle Arena actions
    else if (action === 'arbitrate_consensus') {
      var arbBtn = doc.getElementById('btn-arbitrate') || doc.querySelector('[data-action="arbitrate"]');
      safeClick(arbBtn);
      if (win.ConsensusCrucible && win.ConsensusCrucible.runArbitration) win.ConsensusCrucible.runArbitration();
    }

    // Memory Daemon actions
    else if (action === 'consolidate_memory') {
      var conBtn = doc.getElementById('btn-consolidate') || doc.querySelector('[data-action="consolidate"]');
      safeClick(conBtn);
      if (win.NetrunnerMemory && win.NetrunnerMemory.consolidateSynapses) win.NetrunnerMemory.consolidateSynapses();
    }

    // WebGen actions
    else if (action === 'synthesize_web') {
      var synBtn = doc.getElementById('btn-synthesize') || doc.querySelector('[data-action="synthesize"]');
      safeClick(synBtn);
      if (win.WebGenStudio && win.WebGenStudio.generateApp) win.WebGenStudio.generateApp();
    }

    // Vault actions
    else if (action === 'lock_vault') {
      var lockBtn = doc.getElementById('btn-lock-vault') || doc.querySelector('[data-action="lock"]');
      safeClick(lockBtn);
      if (win.Argon2idVault && win.Argon2idVault.lockVault) win.Argon2idVault.lockVault();
    }
  }

  function applyEmbeddedMode() {
    if (isEmbedded) {
      doc.documentElement.classList.add('hud-embedded-mode');
      if (doc.body) doc.body.classList.add('in-hud', 'hud-embedded-view');

      // Listen for events from parent HUD
      win.addEventListener('message', function (event) {
        if (!event || !event.data) return;

        // Theme Synchronization
        if (event.data.type === 'ZOTH_HUD_THEME_CHANGE') {
          var newTheme = event.data.theme;
          if (newTheme) {
            doc.documentElement.setAttribute('data-theme', newTheme);
            if (doc.body) doc.body.setAttribute('data-theme', newTheme);
            if (win.ZothTheme && win.ZothTheme.setTheme) {
              win.ZothTheme.setTheme(newTheme);
            }
          }
        }

        // Tool Action Dispatcher
        if (event.data.type === 'ZOTH_TOOL_ACTION') {
          var actionName = event.data.action;
          var payload = event.data.payload;
          ZothEmbeddedAdapter.handleHUDAction(actionName, payload);
        }
      });

      // Notify parent HUD that tool is mounted
      ZothEmbeddedAdapter.sendToHUD('ZOTH_TOOL_MOUNTED', { title: doc.title });

    } else {
      if (redirectStandaloneIntoHud()) return;
      mountStandaloneHUDLauncher();
    }
  }

  function redirectStandaloneIntoHud() {
    try {
      if (win.location.search.indexOf('standalone=1') !== -1) return false;
      var path = win.location.pathname || '';
      if (/\/studio\/(cockpit|cyberpunk-hud)\.html$/.test(path)) return false;
      if (path === '/studio/' || path === '/studio/index.html') return false;
      var map = win.ZOTH_HUD_PATH_TO_TOOL || FALLBACK_PATH_MAP;
      var id = map[path] || map[path.replace(/\/index\.html$/, '/')];
      if (!id) {
        var file = path.substring(path.lastIndexOf('/') + 1).replace(/\.html$/, '');
        if (path.indexOf('/studio/') === 0 && file && file !== 'index') id = file;
      }
      if (!id) return false;
      win.location.replace('/studio/cockpit.html?tool=' + encodeURIComponent(id));
      return true;
    } catch (e) {
      return false;
    }
  }

  function mountStandaloneHUDLauncher() {
    if (doc.querySelector('.hud-standalone-launcher-banner')) return;

    var currentPath = win.location.pathname;
    var filename = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'omnipost.html';
    var toolId = filename.replace('.html', '');

    var banner = doc.createElement('div');
    banner.className = 'hud-standalone-launcher-banner';
    banner.innerHTML = '' +
      '<a href="/studio/cockpit.html?tool=' + encodeURIComponent(toolId) + '" class="hud-launch-cockpit-btn" title="Open this tool inside the Cyberpunk HUD">' +
        '<span class="hud-launch-icon">⚡</span>' +
        '<span class="hud-launch-text">OPEN IN CYBERPUNK HUD</span>' +
        '<span class="hud-launch-tag">COCKPIT ➔</span>' +
      '</a>';

    if (doc.body) {
      doc.body.appendChild(banner);
    } else {
      doc.addEventListener('DOMContentLoaded', function () {
        doc.body.appendChild(banner);
      });
    }
  }

  // Expose Globally
  win.ZothEmbeddedAdapter = ZothEmbeddedAdapter;

  // Run immediately or on DOM ready
  if (doc.readyState === 'loading') {
    doc.addEventListener('DOMContentLoaded', applyEmbeddedMode);
  } else {
    applyEmbeddedMode();
  }

})(window, document);
