/**
 * 🛸 ZOTH STUDIO — AAA CYBERPUNK FLOATING COCKPIT DOCK (v2.0 ULTRA)
 * 100% Vector SVG Icons · Zero Cartoon Emojis · Spring Physics & Audio FX
 */
(function () {
  'use strict';

  if (window.__ZOTH_DOCK_LOADED__) return;
  window.__ZOTH_DOCK_LOADED__ = true;

  // Bespoke Vector SVG Icons Matrix (Zero default OS emojis)
  var ICONS = {
    home: '<svg viewBox="0 0 24 24" fill="none" class="dock-svg-icon"><path d="M12 2L2 9.5V20C2 21.1 2.9 22 4 22H9V15H15V22H20C21.1 22 22 21.1 22 20V9.5L12 2Z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="8.5" r="2" fill="var(--dock-gold, #fbbf24)"/></svg>',
    zoth: '<svg viewBox="0 0 24 24" fill="none" class="dock-svg-icon"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.4" stroke-dasharray="2 2"/><polygon points="12,4 19,16 5,16" stroke="var(--dock-gold, #fbbf24)" stroke-width="1.6" fill="none"/><circle cx="12" cy="12" r="2.5" fill="var(--dock-cyan, #00f0ff)"/><line x1="12" y1="2" x2="12" y2="22" stroke="currentColor" stroke-width="1" stroke-opacity="0.4"/></svg>',
    memory: '<svg viewBox="0 0 24 24" fill="none" class="dock-svg-icon"><circle cx="12" cy="5.5" r="2.2" fill="var(--dock-cyan, #00f0ff)"/><circle cx="5.5" cy="13.5" r="2" fill="var(--dock-purple, #c084fc)"/><circle cx="18.5" cy="13.5" r="2" fill="var(--dock-purple, #c084fc)"/><circle cx="9" cy="19.5" r="1.8" fill="var(--dock-gold, #fbbf24)"/><circle cx="15" cy="19.5" r="1.8" fill="var(--dock-gold, #fbbf24)"/><path d="M12 7.7V11.5M12 11.5L7.5 12.5M12 11.5L16.5 12.5M6.8 15.5L8.2 17.7M17.2 15.5L15.8 17.7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
    math: '<svg viewBox="0 0 24 24" fill="none" class="dock-svg-icon"><path d="M4 19L9.5 5L13.5 17L17.5 9L21 14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 21H21" stroke="var(--dock-gold, #fbbf24)" stroke-width="1.5"/><circle cx="9.5" cy="5" r="1.8" fill="var(--dock-cyan, #00f0ff)"/><circle cx="13.5" cy="17" r="1.8" fill="var(--dock-purple, #c084fc)"/></svg>',
    cockpit: '<svg viewBox="0 0 24 24" fill="none" class="dock-svg-icon"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.4"/><circle cx="12" cy="12" r="4" stroke="var(--dock-gold, #fbbf24)" stroke-width="1.6"/><line x1="12" y1="1" x2="12" y2="5" stroke="var(--dock-cyan, #00f0ff)" stroke-width="2"/><line x1="12" y1="19" x2="12" y2="23" stroke="var(--dock-cyan, #00f0ff)" stroke-width="2"/><line x1="1" y1="12" x2="5" y2="12" stroke="var(--dock-cyan, #00f0ff)" stroke-width="2"/><line x1="19" y1="12" x2="23" y2="12" stroke="var(--dock-cyan, #00f0ff)" stroke-width="2"/></svg>',
    consensus: '<svg viewBox="0 0 24 24" fill="none" class="dock-svg-icon"><path d="M5 19L19 5M6 4L20 18" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><polygon points="12,2 15,12 12,22 9,12" fill="rgba(0, 240, 255, 0.2)" stroke="var(--dock-cyan, #00f0ff)" stroke-width="1.5"/><circle cx="12" cy="12" r="2" fill="var(--dock-gold, #fbbf24)"/></svg>',
    vos: '<svg viewBox="0 0 24 24" fill="none" class="dock-svg-icon"><rect x="3" y="4" width="18" height="15" rx="3" stroke="currentColor" stroke-width="1.6"/><line x1="3" y1="9" x2="21" y2="9" stroke="currentColor" stroke-width="1.2"/><path d="M7 13.5L10 16L7 18.5" stroke="var(--dock-cyan, #00f0ff)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><line x1="13" y1="18.5" x2="17" y2="18.5" stroke="var(--dock-gold, #fbbf24)" stroke-width="1.8" stroke-linecap="round"/></svg>',
    webgen: '<svg viewBox="0 0 24 24" fill="none" class="dock-svg-icon"><path d="M13 2L4 13H11L9 22L20 10H13L16 2H13Z" stroke="var(--dock-gold, #fbbf24)" stroke-width="1.6" fill="rgba(251, 191, 36, 0.15)" stroke-linejoin="round"/></svg>',
    nexus3d: '<svg viewBox="0 0 24 24" fill="none" class="dock-svg-icon"><path d="M12 2L3 7V17L12 22L21 17V7L12 2Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><line x1="12" y1="12" x2="21" y2="7" stroke="var(--dock-cyan, #00f0ff)" stroke-width="1.5"/><line x1="12" y1="12" x2="3" y2="7" stroke="var(--dock-purple, #c084fc)" stroke-width="1.5"/><line x1="12" y1="12" x2="12" y2="22" stroke="var(--dock-gold, #fbbf24)" stroke-width="1.5"/></svg>',
    omnipost: '<svg viewBox="0 0 24 24" fill="none" class="dock-svg-icon"><rect x="3" y="4" width="18" height="16" rx="3" stroke="currentColor" stroke-width="1.6"/><polygon points="10,9 16,12 10,15" fill="var(--dock-gold, #fbbf24)" stroke="var(--dock-gold, #fbbf24)" stroke-width="1.2" stroke-linejoin="round"/><line x1="7" y1="4" x2="7" y2="8" stroke="var(--dock-cyan, #00f0ff)" stroke-width="1.5"/><line x1="17" y1="4" x2="17" y2="8" stroke="var(--dock-cyan, #00f0ff)" stroke-width="1.5"/></svg>',
    swarm: '<svg viewBox="0 0 24 24" fill="none" class="dock-svg-icon"><circle cx="12" cy="12" r="3" fill="var(--dock-cyan, #00f0ff)"/><ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="currentColor" stroke-width="1.4" transform="rotate(-30 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="var(--dock-gold, #fbbf24)" stroke-width="1.4" transform="rotate(30 12 12)"/><circle cx="18" cy="8.5" r="1.5" fill="var(--dock-purple, #c084fc)"/></svg>',
    vault: '<svg viewBox="0 0 24 24" fill="none" class="dock-svg-icon"><rect x="4" y="10" width="16" height="11" rx="2.5" stroke="currentColor" stroke-width="1.6" fill="rgba(0, 240, 255, 0.08)"/><path d="M8 10V6.5C8 4.5 9.8 3 12 3C14.2 3 16 4.5 16 6.5V10" stroke="var(--dock-gold, #fbbf24)" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="15.5" r="1.8" fill="var(--dock-cyan, #00f0ff)"/><path d="M12 17V19" stroke="var(--dock-cyan, #00f0ff)" stroke-width="1.5" stroke-linecap="round"/></svg>',
    adytum: '<svg viewBox="0 0 24 24" fill="none" class="dock-svg-icon"><path d="M12 2L2 22H22L12 2Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><circle cx="12" cy="14" r="3.5" stroke="var(--dock-gold, #fbbf24)" stroke-width="1.6" fill="rgba(251, 191, 36, 0.2)"/><circle cx="12" cy="14" r="1.2" fill="var(--dock-cyan, #00f0ff)"/><line x1="12" y1="7" x2="12" y2="9" stroke="var(--dock-gold, #fbbf24)" stroke-width="1.5"/></svg>',
    webgpu: '<svg viewBox="0 0 24 24" fill="none" class="dock-svg-icon"><rect x="4" y="4" width="16" height="16" rx="2.5" stroke="currentColor" stroke-width="1.6"/><rect x="8" y="8" width="8" height="8" rx="1" fill="rgba(0, 240, 255, 0.2)" stroke="var(--dock-cyan, #00f0ff)" stroke-width="1.5"/><line x1="2" y1="8" x2="4" y2="8" stroke="var(--dock-gold, #fbbf24)" stroke-width="1.5"/><line x1="2" y1="12" x2="4" y2="12" stroke="var(--dock-gold, #fbbf24)" stroke-width="1.5"/><line x1="2" y1="16" x2="4" y2="16" stroke="var(--dock-gold, #fbbf24)" stroke-width="1.5"/><line x1="20" y1="8" x2="22" y2="8" stroke="var(--dock-gold, #fbbf24)" stroke-width="1.5"/><line x1="20" y1="12" x2="22" y2="12" stroke="var(--dock-gold, #fbbf24)" stroke-width="1.5"/><line x1="20" y1="16" x2="22" y2="16" stroke="var(--dock-gold, #fbbf24)" stroke-width="1.5"/></svg>',
    logo3d: '<svg viewBox="0 0 24 24" fill="none" class="dock-svg-icon"><polygon points="6,4 18,4 18,7.5 10,16.5 18,16.5 18,20 6,20 6,16.5 14,7.5 6,7.5" fill="var(--dock-gold, #fbbf24)" stroke="var(--dock-gold, #fbbf24)" stroke-width="1.2" stroke-linejoin="round"/></svg>',
    annotate: '<svg viewBox="0 0 24 24" fill="none" class="dock-svg-icon"><path d="M12 20H21M16.5 3.5L20.5 7.5L7 21L3 21L3 17L16.5 3.5Z" stroke="var(--dock-gold, #fbbf24)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    palette: '<svg viewBox="0 0 24 24" fill="none" class="dock-svg-icon"><circle cx="11" cy="11" r="7" stroke="var(--dock-cyan, #00f0ff)" stroke-width="1.8"/><path d="M16 16L21 21" stroke="var(--dock-gold, #fbbf24)" stroke-width="2" stroke-linecap="round"/><circle cx="11" cy="11" r="2.5" fill="rgba(0, 240, 255, 0.4)"/></svg>',
    theme: '<svg viewBox="0 0 24 24" fill="none" class="dock-svg-icon"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/><path d="M12 3V21C16.97 21 21 16.97 21 12C21 7.03 16.97 3 12 3Z" fill="var(--dock-cyan, #00f0ff)"/><circle cx="12" cy="12" r="3" fill="var(--dock-gold, #fbbf24)"/></svg>'
  };

  var DOCK_TOOLS = [
    { id: 'home', iconSvg: ICONS.home, hotkey: '0', label: 'Zoth Hub', desc: 'Sovereign AI Gateway', href: '/' },
    { id: 'zoth', iconSvg: ICONS.zoth, hotkey: '1', label: 'Master Azoth', desc: 'Core Synthesis & Alchemical Engine', href: '/zoth/' },
    { id: 'memory', iconSvg: ICONS.memory, hotkey: '2', label: 'Memory Whitespace', desc: 'Vector Recall & Lucy Graph', href: '/memory/' },
    { id: 'math', iconSvg: ICONS.math, hotkey: '3', label: 'Math Pillars', desc: 'Neural Theory & STDP Calculus', href: '/studio/math-pillars.html' },
    { id: 'cockpit', iconSvg: ICONS.cockpit, hotkey: '4', label: 'The Cockpit', desc: '21-Agent Autonomous Swarm', href: '/studio/cockpit.html' },
    { id: 'consensus', iconSvg: ICONS.consensus, hotkey: '5', label: 'Consensus Arena', desc: '3-Agent Debate & AST Tiebreaker', href: '/studio/consensus.html' },
    { id: 'adytum', iconSvg: ICONS.adytum, hotkey: '6', label: 'Adytum Sanctum', desc: 'Keys 0-21 Hermetic Planning Rite', href: '/adytum/' },
    { id: 'webgpu', iconSvg: ICONS.webgpu, hotkey: '7', label: 'WebGPU Engine', desc: 'Local Neural Tensor Shaders', href: '/ai-webgpu.html' },
    { id: 'vos', iconSvg: ICONS.vos, hotkey: '8', label: 'vOS Sandbox', desc: 'Wasm WebContainer & Terminal', href: '/studio/vos-sandbox.html' },
    { id: 'webgen', iconSvg: ICONS.webgen, hotkey: '9', label: 'WebGen Studio', desc: 'PTY Terminal & Website Foundry', href: '/studio/webgen.html' },
    { id: 'nexus3d', iconSvg: ICONS.nexus3d, label: 'Nexus 3D', desc: 'CAD Mesh & 3D Omniverse', href: '/studio/nexus-3d.html' },
    { id: 'omnipost', iconSvg: ICONS.omnipost, label: 'OmniPost Video', desc: '60 FPS Social Motion Studio', href: '/studio/omnipost.html' },
    { id: 'swarm', iconSvg: ICONS.swarm, label: '3D Swarm Arena', desc: 'WebGL Kinetic Arena', href: '/studio/swarm.html' },
    { id: 'vault', iconSvg: ICONS.vault, label: 'Sovereign Vault', desc: 'Argon2id BYOK Keyrings', href: '/vault/' },
    { id: 'logo3d', iconSvg: ICONS.logo3d, label: '3D Emblem Engine', desc: 'Interactive Golden Z WebGL', href: '/3d-logo-showcase.html' },
    { id: 'divider', isDivider: true },
    { id: 'annotate', iconSvg: ICONS.annotate, label: 'Annotator', desc: 'On-Screen Feedback (Shift+A)', action: 'annotate' },
    { id: 'palette', iconSvg: ICONS.palette, label: 'Command Palette', desc: 'Global Launcher (Ctrl+K)', action: 'palette' },
    { id: 'theme', iconSvg: ICONS.theme, label: 'Theme Matrix', desc: 'Cycle 4 Themes (Shift+T)', action: 'theme' }
  ];

  // Procedural Cyber SFX Synthesizer
  var audioCtx = null;
  function playDockSFX(type) {
    try {
      if (!audioCtx) {
        var AudioClass = window.AudioContext || window.webkitAudioContext;
        if (AudioClass) audioCtx = new AudioClass();
      }
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      if (!audioCtx) return;

      var now = audioCtx.currentTime;
      var osc = audioCtx.createOscillator();
      var gain = audioCtx.createGain();

      if (type === 'hover') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(1800, now + 0.035);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.045);
      } else if (type === 'click') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.07);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.075);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
      }
    } catch (e) {}
  }

  function mountDock() {
    if (document.getElementById('zoth-floating-dock')) return;

    var dockWrap = document.createElement('div');
    dockWrap.id = 'zoth-floating-dock';
    dockWrap.className = 'zoth-dock-wrap';
    dockWrap.setAttribute('role', 'toolbar');
    dockWrap.setAttribute('aria-label', 'Zoth Studio Cyberpunk Floating Dock');

    var currentPath = (window.location.pathname || '/').replace(/index\.html$/, '');
    if (!currentPath.endsWith('/')) currentPath += '/';

    var itemsHtml = DOCK_TOOLS.map(function (item) {
      if (item.isDivider) {
        return '<div class="dock-divider" aria-hidden="true"></div>';
      }

      var isActive = false;
      if (item.href) {
        var hrefNorm = item.href.replace(/index\.html$/, '');
        if (!hrefNorm.endsWith('/') && !hrefNorm.includes('.')) hrefNorm += '/';
        isActive = hrefNorm === currentPath || (currentPath !== '/' && hrefNorm.length > 2 && currentPath.startsWith(hrefNorm));
      }

      return [
        '<button type="button" class="dock-item' + (isActive ? ' active' : '') + '" data-dock-id="' + item.id + '"' + (item.href ? ' data-href="' + item.href + '"' : '') + ' aria-label="' + item.label + '">',
        item.hotkey ? '  <span class="dock-hotkey">&lt;' + item.hotkey + '&gt;</span>' : '',
        '  <span class="dock-icon-box">' + item.iconSvg + '</span>',
        '  <span class="dock-tooltip">',
        '    <strong>' + item.label + '</strong>',
        '    <small>' + item.desc + '</small>',
        '  </span>',
        isActive ? '  <span class="dock-active-dot" aria-hidden="true"></span>' : '',
        '</button>'
      ].join('');
    }).join('');

    dockWrap.innerHTML = [
      '<div class="dock-container">',
      '  <div class="dock-inner">',
      itemsHtml,
      '  </div>',
      '</div>'
    ].join('');

    document.body.appendChild(dockWrap);

    // Event delegation for dock clicks & audio feedback
    dockWrap.addEventListener('click', function (e) {
      var itemBtn = e.target.closest('.dock-item');
      if (!itemBtn) return;
      e.preventDefault();

      playDockSFX('click');

      var dockId = itemBtn.getAttribute('data-dock-id');
      var href = itemBtn.getAttribute('data-href');

      if (window.CelestialTrail) {
        var r = itemBtn.getBoundingClientRect();
        window.CelestialTrail.burst(r.left + r.width / 2, r.top + r.height / 2);
      }

      if (href) {
        window.location.href = href;
      } else if (dockId === 'annotate') {
        if (window.ZothAnnotator && typeof window.ZothAnnotator.toggle === 'function') {
          window.ZothAnnotator.toggle();
        } else {
          var annotScript = document.createElement('script');
          annotScript.src = '/assets/zoth-annotator.js';
          annotScript.onload = function () {
            if (window.ZothAnnotator) window.ZothAnnotator.toggle();
          };
          document.head.appendChild(annotScript);
        }
      } else if (dockId === 'palette') {
        if (window.ZothWorkbench && typeof window.ZothWorkbench.openPalette === 'function') {
          window.ZothWorkbench.openPalette();
        } else {
          document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
        }
      } else if (dockId === 'theme') {
        if (window.__ZOTH_SWITCH_THEME) {
          var themes = ['dark', 'light', 'matrix', 'gold'];
          var current = document.documentElement.getAttribute('data-theme') || 'dark';
          var next = themes[(themes.indexOf(current) + 1) % themes.length];
          window.__ZOTH_SWITCH_THEME(next);
        } else if (window.cycleZothTheme) {
          window.cycleZothTheme();
        }
      }
    });

    // Hover audio trigger
    dockWrap.querySelectorAll('.dock-item').forEach(function(btn) {
      btn.addEventListener('mouseenter', function() {
        playDockSFX('hover');
      });
    });

    // Spring magnification effect on mouse movement
    var dockInner = dockWrap.querySelector('.dock-inner');
    if (dockInner) {
      dockInner.addEventListener('mousemove', function (e) {
        var items = dockInner.querySelectorAll('.dock-item');
        var mouseX = e.clientX;

        items.forEach(function (item) {
          var rect = item.getBoundingClientRect();
          var itemCenter = rect.left + rect.width / 2;
          var distance = Math.abs(mouseX - itemCenter);
          var maxDist = 130;

          if (distance < maxDist) {
            var scale = 1 + 0.32 * Math.cos((distance / maxDist) * (Math.PI / 2));
            item.style.transform = 'scale(' + scale.toFixed(3) + ') translateY(-' + ((scale - 1) * 14).toFixed(1) + 'px)';
          } else {
            item.style.transform = 'scale(1) translateY(0)';
          }
        });
      });

      dockInner.addEventListener('mouseleave', function () {
        dockInner.querySelectorAll('.dock-item').forEach(function (item) {
          item.style.transform = 'scale(1) translateY(0)';
        });
      });
    }

    // Scroll auto-hide logic
    var lastScrollY = window.scrollY;
    window.addEventListener('scroll', function () {
      var currentY = window.scrollY;
      if (currentY > lastScrollY && currentY > 200) {
        dockWrap.classList.add('dock-hidden');
      } else {
        dockWrap.classList.remove('dock-hidden');
      }
      lastScrollY = currentY;
    }, { passive: true });

    // Keyboard shortcut: Alt+D to toggle dock collapse
    document.addEventListener('keydown', function (e) {
      if (e.altKey && (e.key === 'd' || e.key === 'D')) {
        e.preventDefault();
        dockWrap.classList.toggle('dock-collapsed');
        playDockSFX('click');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountDock);
  } else {
    mountDock();
  }
})();
