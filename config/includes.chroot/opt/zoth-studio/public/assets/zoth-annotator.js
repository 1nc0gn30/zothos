/**
 * ==============================================================================
 * ⚡ ZOTH STUDIO — In-Context Visual Annotator & Multi-Agent Feedback Subsystem
 * ==============================================================================
 * Enables instant visual clicking, circling, component highlighting, and rich note
 * pinning with @agent tagging on dev servers & studio preview surfaces.
 *
 * Hotkeys:
 *   - Ctrl+Alt+A / Ctrl+Shift+A / Alt+N / ` : Toggle Annotation HUD
 *   - Ctrl+Shift+O / Alt+M                 : Open All Notes Drawer
 *   - Escape                               : Cancel draw / Close dialog
 * ==============================================================================
 */

(function () {
  'use strict';

  // Dev Server Guard & Manual Activation
  function isDevEnvironment() {
    try {
      const hostname = (window.location.hostname || '').toLowerCase();
      const search = (window.location.search || '').toLowerCase();
      const hash = (window.location.hash || '').toLowerCase();

      // Manual opt-in override: ?annotate=1, ?debug=1, or #annotate allows testing anywhere
      if (search.includes('annotate=1') || search.includes('debug=1') || hash.includes('annotate')) {
        return true;
      }

      // Check stored preference if previously toggled on
      if (localStorage.getItem('zoth_annotator_enabled') === 'true') {
        return true;
      }

      // Default allowed for local dev environments (loopback, Tailscale, & private LAN IPs)
      const isLocalhost =
        hostname === 'localhost' ||
        hostname === '127.0.0.1' ||
        hostname === '0.0.0.0' ||
        hostname === '[::1]' ||
        hostname.startsWith('100.') ||   // Tailscale VPN IPs
        hostname.startsWith('192.168.') ||
        hostname.startsWith('10.') ||
        hostname.startsWith('172.16.') ||
        hostname.endsWith('.local') ||
        hostname.endsWith('.internal');

      return isLocalhost;
    } catch (e) {
      return false;
    }
  }

  if (!isDevEnvironment()) {
    // Completely silent exit on public production website (e.g. zoth.nullai.tech)
    // No UI elements, no storage access, and no notes/conversations rendered.
    return;
  }

  if (window.__ZOTH_ANNOTATOR_LOADED__) return;
  window.__ZOTH_ANNOTATOR_LOADED__ = true;

  // Known Swarm Agents for Zoth Studio
  const SWARM_AGENTS = [
    { tag: 'azoth', name: 'Master Azoth', role: 'Sovereign AI Core & Alchemical Synthesis', icon: '✨' },
    { tag: 'antigravity', name: 'Antigravity', role: 'Lead AI Orchestrator & AST Architect', icon: '🪐' },
    { tag: 'grok', name: 'Grok', role: 'Astrolabe Truth Oracle & First Principles (xAI)', icon: '🦊' },
    { tag: 'hermes', name: 'Hermes', role: 'Autonomous Tool & Function Dispatch Engine', icon: '⚡' },
    { tag: 'ghostbyte', name: 'GhostByte', role: 'Argon2id Cryptographic Sentinel (NullAI)', icon: '🔒' },
    { tag: 'lycan', name: 'Lycan', role: 'SecOps Sentinel & Vault Auditor', icon: '🐺' },
    { tag: 'kitsune', name: 'Kitsune', role: 'Vibe Coder, React 19 & AX Visuals', icon: '🎨' },
    { tag: 'athena', name: 'Athena', role: 'SEO / AEO Semantic Knowledge Oracle', icon: '🦉' },
    { tag: 'kai', name: 'Kai', role: 'Offline Daemon & Local Loop (Ollama :11434)', icon: '🤖' },
    { tag: 'draco', name: 'Draco', role: 'High-Throughput AST Compiler', icon: '🐉' },
    { tag: 'user', name: 'Operator / Neo', role: 'Human Sovereign Operator', icon: '👤' }
  ];

  const CATEGORIES = [
    'UI / Visual',
    'Bug / Broken',
    'Copy / Content',
    'UX / Flow',
    'AX (Accessibility)',
    'SEO / Metadata',
    'Feature Request'
  ];

  const STORAGE_KEY = 'zoth_visual_annotations_v2';
  const API_ENDPOINT = '/api/annotations';

  // State
  let isAnnotating = false;
  let currentMode = 'inspect'; // 'inspect' | 'draw' | 'box'
  let drawColor = '#e8c872'; // Default Gold
  let isDrawing = false;
  let currentPath = [];
  let allPaths = [];
  let boxStart = null;
  let hoveredElement = null;
  let selectedTarget = null;
  let annotations = [];
  let activeFilterAgent = 'all';
  let activeFilterStatus = 'all';

  // Inject Stylesheet if not present
  function ensureStyles() {
    if (!document.querySelector('link[href*="zoth-annotator.css"]') &&
        !document.querySelector('#zoth-annotator-inline-style')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/assets/zoth-annotator.css';
      link.onerror = () => {
        // Fallback: in case loaded standalone on port without static assets
        console.warn('[ZothAnnotator] Could not fetch stylesheet from /assets/zoth-annotator.css');
      };
      document.head.appendChild(link);
    }
  }

  // Load annotations from local storage and backend
  function loadLocalAnnotations() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) annotations = JSON.parse(raw);
    } catch (e) {
      annotations = [];
    }
    fetchBackendAnnotations();
  }

  function saveLocalAnnotations() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(annotations));
    } catch (e) {}
    renderMarkers();
    updatePillBadge();
  }

  async function fetchBackendAnnotations() {
    try {
      // Only query backend if orchestrator port (:8484) or specific API route is available
      if (window.location.port === '8088') return; // Static web server
      const res = await fetch(API_ENDPOINT);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.annotations)) {
          // Merge remote with local
          const map = new Map();
          annotations.forEach(a => map.set(a.id, a));
          data.annotations.forEach(a => map.set(a.id, a));
          annotations = Array.from(map.values());
          saveLocalAnnotations();
        }
      }
    } catch (e) {
      // Backend optional / offline
    }
  }

  async function syncAnnotationToBackend(note) {
    try {
      await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(note)
      });
    } catch (e) {
      console.log('[ZothAnnotator] Saved locally (Backend API offline).');
    }
  }

  async function resolveAnnotationBackend(id) {
    try {
      await fetch(`${API_ENDPOINT}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, resolved_by: '@user' })
      });
    } catch (e) {}
  }

  async function deleteAnnotationBackend(id) {
    try {
      await fetch(`${API_ENDPOINT}?id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
    } catch (e) {}
  }

  // DOM Helpers
  function getCssSelector(el) {
    if (!(el instanceof Element)) return '';
    if (el.id) return `#${el.id}`;
    
    let path = [];
    let cur = el;
    while (cur && cur.nodeType === Node.ELEMENT_NODE) {
      let selector = cur.nodeName.toLowerCase();
      if (cur.id) {
        selector = `#${cur.id}`;
        path.unshift(selector);
        break;
      } else {
        let sibling = cur;
        let nth = 1;
        while (sibling = sibling.previousElementSibling) {
          if (sibling.nodeName.toLowerCase() === selector) nth++;
        }
        if (cur.className && typeof cur.className === 'string') {
          const classes = cur.className.trim().split(/\s+/).filter(c => !c.startsWith('za-') && c.length < 30).slice(0, 2);
          if (classes.length) selector += `.${classes.join('.')}`;
        }
        if (nth > 1) selector += `:nth-of-type(${nth})`;
      }
      path.unshift(selector);
      cur = cur.parentElement;
      if (path.length > 4) break;
    }
    return path.join(' > ');
  }

  function getElementXPath(el) {
    if (!(el instanceof Element)) return '';
    if (el.id) return `//*[@id="${el.id}"]`;
    let segments = [];
    for (; el && el.nodeType === 1; el = el.parentNode) {
      let count = 1;
      for (let sib = el.previousSibling; sib; sib = sib.previousSibling) {
        if (sib.nodeType === 1 && sib.tagName === el.tagName) count++;
      }
      let tag = el.tagName.toLowerCase();
      segments.unshift(count > 1 ? `${tag}[${count}]` : tag);
    }
    return `/${segments.join('/')}`;
  }

  // UI Components Creation
  let pillEl, toolbarEl, canvasEl, ctx, inspectorEl, modalEl, drawerEl, markersLayer;

  function initUI() {
    ensureStyles();

    // 1. Floating HUD Pill (Hidden by default - annotator is triggered via navbar Annotate button / Shift+A)
    pillEl = document.createElement('div');
    pillEl.id = 'zoth-annotator-pill';
    pillEl.style.display = 'none';
    pillEl.setAttribute('role', 'button');
    pillEl.setAttribute('title', 'Click or press Ctrl+Alt+A to annotate & review notes');
    pillEl.innerHTML = `
      <span class="za-pill-icon">⚡</span>
      <span>ZOTH Annotate</span>
      <span class="za-pill-badge" id="za-pill-count" style="display:none">0</span>
      <span class="za-pill-keybind">Ctrl+Alt+A</span>
    `;
    pillEl.addEventListener('click', () => toggleAnnotationMode());

    // 2. Toolbar
    toolbarEl = document.createElement('div');
    toolbarEl.id = 'zoth-annotator-toolbar';
    toolbarEl.innerHTML = `
      <button class="za-tool-btn active" data-mode="inspect" title="Hover & pin note to DOM element">📍 Pin Element</button>
      <button class="za-tool-btn" data-mode="draw" title="Freehand circle, arrow, or drawing">⭕ Circle / Draw</button>
      <button class="za-tool-btn" data-mode="box" title="Drag rectangle area">🔲 Box Area</button>
      <div class="za-tool-divider"></div>
      <div class="za-color-picker" id="za-color-picker" style="display:none">
        <div class="za-color-dot active" style="background:#e8c872; color:#e8c872" data-color="#e8c872" title="Gold"></div>
        <div class="za-color-dot" style="background:#00f0ff; color:#00f0ff" data-color="#00f0ff" title="Cyan"></div>
        <div class="za-color-dot" style="background:#ff007a; color:#ff007a" data-color="#ff007a" title="Neon Pink"></div>
        <div class="za-color-dot" style="background:#34d399; color:#34d399" data-color="#34d399" title="Emerald"></div>
      </div>
      <div class="za-tool-divider"></div>
      <button class="za-tool-btn gold" id="za-btn-open-drawer" title="View all notes on site">📋 Notes (<span id="za-toolbar-note-count">0</span>)</button>
      <button class="za-tool-btn" id="za-btn-exit" style="color:var(--za-pink)">✕ Done</button>
    `;
    document.body.appendChild(toolbarEl);

    // Toolbar events
    toolbarEl.querySelectorAll('[data-mode]').forEach(btn => {
      btn.addEventListener('click', () => {
        setMode(btn.getAttribute('data-mode'));
      });
    });

    toolbarEl.querySelectorAll('[data-color]').forEach(dot => {
      dot.addEventListener('click', () => {
        toolbarEl.querySelectorAll('[data-color]').forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
        drawColor = dot.getAttribute('data-color');
      });
    });

    toolbarEl.querySelector('#za-btn-open-drawer').addEventListener('click', () => toggleDrawer(true));
    toolbarEl.querySelector('#za-btn-exit').addEventListener('click', () => toggleAnnotationMode(false));

    // 3. Canvas Overlay
    canvasEl = document.createElement('canvas');
    canvasEl.id = 'zoth-annotator-canvas';
    document.body.appendChild(canvasEl);
    ctx = canvasEl.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 4. Inspector Highlight Box
    inspectorEl = document.createElement('div');
    inspectorEl.id = 'zoth-annotator-inspector';
    inspectorEl.innerHTML = `<div class="za-inspector-tag" id="za-inspector-tag"></div>`;
    document.body.appendChild(inspectorEl);

    // 5. Markers Layer Container
    markersLayer = document.createElement('div');
    markersLayer.id = 'zoth-annotator-markers';
    document.body.appendChild(markersLayer);

    // 6. Note Creator / Editor Modal
    modalEl = document.createElement('div');
    modalEl.id = 'zoth-annotator-modal';
    modalEl.innerHTML = `
      <div class="za-modal-header">
        <div class="za-modal-title">
          <span>⚡ Leave Visual Note</span>
          <span class="za-modal-target" id="za-modal-target-label">#element</span>
        </div>
        <button class="za-modal-close" id="za-modal-close-btn" title="Close">✕</button>
      </div>

      <div class="za-agent-chips-wrap">
        <div class="za-chips-label">
          <span>Tag Agents Working Here</span>
          <span style="font-size:10px; color:var(--za-cyan)">Type @ in note to auto-complete</span>
        </div>
        <div class="za-agent-chips" id="za-modal-agent-chips">
          ${SWARM_AGENTS.map(a => `
            <div class="za-agent-chip ${a.tag}" data-tag="${a.tag}">
              <span>${a.icon}</span>
              <span>@${a.tag}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="za-textarea-wrap">
        <textarea class="za-textarea" id="za-note-text" placeholder="Describe the change, issue, or prompt here... (e.g. '@antigravity fix alignment on mobile and add gold neon glow')"></textarea>
        <div class="za-mention-menu" id="za-mention-menu"></div>
      </div>

      <div class="za-modal-options">
        <div class="za-select-group">
          <label class="za-select-label">Category</label>
          <select class="za-select" id="za-note-category">
            ${CATEGORIES.map(c => `<option value="${c}">${c}</option>`).join('')}
          </select>
        </div>
        <div class="za-select-group">
          <label class="za-select-label">Priority</label>
          <select class="za-select" id="za-note-priority">
            <option value="Normal">Normal</option>
            <option value="High">High</option>
            <option value="Urgent">🚨 Urgent</option>
          </select>
        </div>
      </div>

      <div class="za-modal-actions">
        <button class="za-btn za-btn-ghost" id="za-modal-cancel-btn">Cancel</button>
        <button class="za-btn za-btn-primary" id="za-modal-submit-btn">Save & Notify Agents ➔</button>
      </div>
    `;
    document.body.appendChild(modalEl);

    setupModalEvents();

    // 7. All Notes Drawer
    drawerEl = document.createElement('div');
    drawerEl.id = 'zoth-annotator-drawer';
    drawerEl.innerHTML = `
      <div class="za-drawer-header">
        <div class="za-drawer-title">
          <span>⚡ Swarm Notes & Visual Feedback</span>
        </div>
        <button class="za-modal-close" id="za-drawer-close-btn">✕</button>
      </div>
      <div class="za-drawer-filters">
        <select class="za-select" id="za-filter-agent" style="flex:1">
          <option value="all">All Agents</option>
          ${SWARM_AGENTS.map(a => `<option value="${a.tag}">@${a.tag} (${a.name})</option>`).join('')}
        </select>
        <select class="za-select" id="za-filter-status" style="flex:1">
          <option value="all">All Statuses</option>
          <option value="open">Open Only</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>
      <div class="za-drawer-list" id="za-drawer-list"></div>
      <div class="za-drawer-footer">
        <button class="za-btn za-btn-ghost" id="za-btn-copy-briefing" style="flex:1" title="Copy formatted prompt for Antigravity / Grok">📋 Copy Agent Briefing</button>
        <button class="za-btn za-btn-primary" id="za-btn-sync-bus" style="flex:1">🔄 Sync Swarm Bus</button>
      </div>
    `;
    document.body.appendChild(drawerEl);

    setupDrawerEvents();

    // Mouse & Drawing Event Listeners
    setupCanvasEvents();
    setupInspectorEvents();
    setupGlobalHotkeys();

    // Load initial data
    loadLocalAnnotations();
  }

  function resizeCanvas() {
    if (!canvasEl) return;
    const dpr = window.devicePixelRatio || 1;
    canvasEl.width = window.innerWidth * dpr;
    canvasEl.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);
    redrawAllCanvasPaths();
  }

  function setMode(mode) {
    currentMode = mode;
    toolbarEl.querySelectorAll('[data-mode]').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-mode') === mode);
    });

    const colorPicker = toolbarEl.querySelector('#za-color-picker');
    if (colorPicker) colorPicker.style.display = (mode === 'draw' || mode === 'box') ? 'flex' : 'none';

    if (mode === 'draw' || mode === 'box') {
      canvasEl.classList.add('drawing-active');
      hideInspector();
    } else {
      canvasEl.classList.remove('drawing-active');
    }
  }

  function toggleAnnotationMode(forceState) {
    isAnnotating = forceState !== undefined ? forceState : !isAnnotating;

    pillEl.classList.toggle('active', isAnnotating);
    toolbarEl.classList.toggle('visible', isAnnotating);

    if (isAnnotating) {
      setMode(currentMode || 'inspect');
      renderMarkers();
    } else {
      canvasEl.classList.remove('drawing-active');
      hideInspector();
      closeModal();
      clearCanvasDrawing();
    }
  }

  function updatePillBadge() {
    const unres = annotations.filter(a => a.status !== 'resolved').length;
    const badge = pillEl ? pillEl.querySelector('#za-pill-count') : null;
    const tbCount = toolbarEl ? toolbarEl.querySelector('#za-toolbar-note-count') : null;

    if (badge) {
      badge.textContent = unres;
      badge.style.display = unres > 0 ? 'inline-block' : 'none';
    }
    if (tbCount) {
      tbCount.textContent = unres;
    }
  }

  // ─── Drawing Canvas Handling ─────────────────────────────────────
  function setupCanvasEvents() {
    const getPos = (e) => {
      const rect = canvasEl.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top,
        pageX: clientX + window.scrollX,
        pageY: clientY + window.scrollY
      };
    };

    const start = (e) => {
      if (!isAnnotating || (currentMode !== 'draw' && currentMode !== 'box')) return;
      if (e.target.closest('#zoth-annotator-toolbar') || e.target.closest('#zoth-annotator-modal') || e.target.closest('#zoth-annotator-drawer')) return;

      isDrawing = true;
      const pos = getPos(e);

      if (currentMode === 'draw') {
        currentPath = [pos];
      } else if (currentMode === 'box') {
        boxStart = pos;
      }
    };

    const move = (e) => {
      if (!isDrawing) return;
      const pos = getPos(e);

      if (currentMode === 'draw') {
        currentPath.push(pos);
        ctx.strokeStyle = drawColor;
        ctx.lineWidth = 3.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.shadowColor = drawColor;
        ctx.shadowBlur = 8;

        ctx.beginPath();
        const prev = currentPath[currentPath.length - 2];
        ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
      } else if (currentMode === 'box' && boxStart) {
        redrawAllCanvasPaths();
        ctx.strokeStyle = drawColor;
        ctx.lineWidth = 2.5;
        ctx.fillStyle = drawColor === '#e8c872' ? 'rgba(232, 200, 114, 0.15)' : 'rgba(0, 240, 255, 0.15)';
        ctx.shadowColor = drawColor;
        ctx.shadowBlur = 10;

        const w = pos.x - boxStart.x;
        const h = pos.y - boxStart.y;
        ctx.fillRect(boxStart.x, boxStart.y, w, h);
        ctx.strokeRect(boxStart.x, boxStart.y, w, h);
      }
    };

    const end = (e) => {
      if (!isDrawing) return;
      isDrawing = false;

      if (currentMode === 'draw' && currentPath.length > 4) {
        // Calculate bounding box and centroid of drawing
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        currentPath.forEach(p => {
          minX = Math.min(minX, p.pageX);
          minY = Math.min(minY, p.pageY);
          maxX = Math.max(maxX, p.pageX);
          maxY = Math.max(maxY, p.pageY);
        });

        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;

        selectedTarget = {
          type: 'drawing',
          label: `Drawing (${Math.round(maxX - minX)}x${Math.round(maxY - minY)}px)`,
          selector: 'canvas-drawing',
          xpath: '',
          elementText: '',
          pageX: centerX,
          pageY: centerY,
          clientX: (minX + maxX) / 2 - window.scrollX,
          clientY: (minY + maxY) / 2 - window.scrollY,
          rect: { x: minX, y: minY, width: maxX - minX, height: maxY - minY },
          pathPoints: currentPath.map(p => ({ x: Math.round(p.x), y: Math.round(p.y) }))
        };

        allPaths.push({ path: currentPath, color: drawColor });
        openModal(selectedTarget);
      } else if (currentMode === 'box' && boxStart) {
        const pos = e.changedTouches ? getPos(e) : (e.clientX ? getPos(e) : boxStart);
        const minX = Math.min(boxStart.pageX, pos.pageX);
        const minY = Math.min(boxStart.pageY, pos.pageY);
        const w = Math.abs(pos.pageX - boxStart.pageX);
        const h = Math.abs(pos.pageY - boxStart.pageY);

        if (w > 10 && h > 10) {
          selectedTarget = {
            type: 'box',
            label: `Box Area (${Math.round(w)}x${Math.round(h)}px)`,
            selector: 'box-area',
            xpath: '',
            elementText: '',
            pageX: minX + w / 2,
            pageY: minY + h / 2,
            clientX: (minX + w / 2) - window.scrollX,
            clientY: (minY + h / 2) - window.scrollY,
            rect: { x: minX, y: minY, width: w, height: h }
          };
          openModal(selectedTarget);
        }
        boxStart = null;
      }
    };

    canvasEl.addEventListener('mousedown', start);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', end);

    canvasEl.addEventListener('touchstart', start, { passive: false });
    window.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('touchend', end);
  }

  function redrawAllCanvasPaths() {
    if (!ctx || !canvasEl) return;
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);

    allPaths.forEach(({ path, color }) => {
      if (!path || path.length < 2) return;
      ctx.strokeStyle = color;
      ctx.lineWidth = 3.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(path[0].x, path[0].y);
      for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i].x, path[i].y);
      }
      ctx.stroke();
    });
  }

  function clearCanvasDrawing() {
    allPaths = [];
    currentPath = [];
    if (ctx && canvasEl) {
      ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    }
  }

  // ─── Inspector & Pin Handling ─────────────────────────────────────
  function setupInspectorEvents() {
    window.addEventListener('mousemove', (e) => {
      if (!isAnnotating || currentMode !== 'inspect') return;
      if (e.target.closest('#zoth-annotator-toolbar') ||
          e.target.closest('#zoth-annotator-modal') ||
          e.target.closest('#zoth-annotator-drawer') ||
          e.target.closest('#zoth-annotator-pill') ||
          e.target.closest('#zoth-annotator-inspector') ||
          e.target.closest('.za-marker-pin')) {
        hideInspector();
        return;
      }

      hoveredElement = e.target;
      const rect = hoveredElement.getBoundingClientRect();

      inspectorEl.style.display = 'block';
      inspectorEl.style.top = `${rect.top + window.scrollY}px`;
      inspectorEl.style.left = `${rect.left + window.scrollX}px`;
      inspectorEl.style.width = `${rect.width}px`;
      inspectorEl.style.height = `${rect.height}px`;

      const tagLabel = inspectorEl.querySelector('#za-inspector-tag');
      const sel = getCssSelector(hoveredElement);
      tagLabel.textContent = `<${hoveredElement.tagName.toLowerCase()}> ${sel.slice(0, 32)}`;
    }, { passive: true });

    window.addEventListener('click', (e) => {
      if (!isAnnotating || currentMode !== 'inspect') return;
      if (e.target.closest('#zoth-annotator-toolbar') ||
          e.target.closest('#zoth-annotator-modal') ||
          e.target.closest('#zoth-annotator-drawer') ||
          e.target.closest('#zoth-annotator-pill') ||
          e.target.closest('.za-marker-pin')) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      const el = e.target;
      const rect = el.getBoundingClientRect();
      const selector = getCssSelector(el);
      const textPreview = el.innerText ? el.innerText.trim().slice(0, 80) : '';

      selectedTarget = {
        type: 'element',
        label: selector,
        selector: selector,
        xpath: getElementXPath(el),
        elementTag: el.tagName.toLowerCase(),
        elementText: textPreview,
        pageX: rect.left + rect.width / 2 + window.scrollX,
        pageY: rect.top + rect.height / 2 + window.scrollY,
        clientX: rect.left + rect.width / 2,
        clientY: rect.top + rect.height / 2,
        rect: {
          x: rect.left + window.scrollX,
          y: rect.top + window.scrollY,
          width: rect.width,
          height: rect.height
        }
      };

      openModal(selectedTarget);
    }, true);
  }

  function hideInspector() {
    if (inspectorEl) inspectorEl.style.display = 'none';
  }

  // ─── Modal Popover Handling ──────────────────────────────────────
  let currentEditingNote = null;

  function setupModalEvents() {
    const closeBtn = modalEl.querySelector('#za-modal-close-btn');
    const cancelBtn = modalEl.querySelector('#za-modal-cancel-btn');
    const submitBtn = modalEl.querySelector('#za-modal-submit-btn');
    const textarea = modalEl.querySelector('#za-note-text');
    const mentionMenu = modalEl.querySelector('#za-mention-menu');
    const agentChips = modalEl.querySelector('#za-modal-agent-chips');

    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    // Agent chip click
    agentChips.querySelectorAll('.za-agent-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        chip.classList.toggle('selected');
        const tag = chip.getAttribute('data-tag');
        const mentionStr = `@${tag} `;
        if (chip.classList.contains('selected')) {
          if (!textarea.value.includes(`@${tag}`)) {
            textarea.value = mentionStr + textarea.value;
          }
        }
        textarea.focus();
      });
    });

    // Mention autocomplete on typing '@'
    textarea.addEventListener('input', () => {
      const val = textarea.value;
      const cursor = textarea.selectionStart;
      const lastAt = val.lastIndexOf('@', cursor - 1);

      if (lastAt !== -1 && lastAt === cursor - 1 || (lastAt !== -1 && !/\s/.test(val.slice(lastAt, cursor)))) {
        const query = val.slice(lastAt + 1, cursor).toLowerCase();
        const matches = SWARM_AGENTS.filter(a => a.tag.includes(query) || a.name.toLowerCase().includes(query));

        if (matches.length) {
          mentionMenu.innerHTML = matches.map(a => `
            <div class="za-mention-item" data-tag="${a.tag}">
              <span>${a.icon}</span>
              <strong>@${a.tag}</strong>
              <span class="za-mention-role">${a.role}</span>
            </div>
          `).join('');
          mentionMenu.style.display = 'block';

          mentionMenu.querySelectorAll('.za-mention-item').forEach(item => {
            item.addEventListener('click', () => {
              const tag = item.getAttribute('data-tag');
              const before = val.slice(0, lastAt);
              const after = val.slice(cursor);
              textarea.value = `${before}@${tag} ${after}`;
              textarea.focus();
              textarea.selectionStart = textarea.selectionEnd = lastAt + tag.length + 2;
              mentionMenu.style.display = 'none';

              // Highlight chip
              const chip = agentChips.querySelector(`.za-agent-chip[data-tag="${tag}"]`);
              if (chip) chip.classList.add('selected');
            });
          });
          return;
        }
      }
      mentionMenu.style.display = 'none';
    });

    textarea.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (mentionMenu.style.display === 'block') {
          mentionMenu.style.display = 'none';
          e.stopPropagation();
        } else {
          closeModal();
        }
      }
    });

    submitBtn.addEventListener('click', saveCurrentNote);
  }

  function openModal(target, existingNote = null) {
    currentEditingNote = existingNote;
    const targetLabel = modalEl.querySelector('#za-modal-target-label');
    const textarea = modalEl.querySelector('#za-note-text');
    const categorySel = modalEl.querySelector('#za-note-category');
    const prioritySel = modalEl.querySelector('#za-note-priority');
    const agentChips = modalEl.querySelector('#za-modal-agent-chips');

    targetLabel.textContent = target.label.slice(0, 30);

    // Reset fields
    agentChips.querySelectorAll('.za-agent-chip').forEach(c => c.classList.remove('selected'));

    if (existingNote) {
      textarea.value = existingNote.text || '';
      categorySel.value = existingNote.category || CATEGORIES[0];
      prioritySel.value = existingNote.priority || 'Normal';

      if (Array.isArray(existingNote.tagged_agents)) {
        existingNote.tagged_agents.forEach(tag => {
          const chip = agentChips.querySelector(`.za-agent-chip[data-tag="${tag}"]`);
          if (chip) chip.classList.add('selected');
        });
      }
    } else {
      textarea.value = '';
      categorySel.value = CATEGORIES[0];
      prioritySel.value = 'Normal';
    }

    // Position modal safely on screen
    modalEl.style.display = 'block';
    const modalWidth = 420;
    const modalHeight = 360;

    let posX = target.clientX ? target.clientX + 20 : window.innerWidth / 2 - modalWidth / 2;
    let posY = target.clientY ? target.clientY - 40 : window.innerHeight / 2 - modalHeight / 2;

    if (posX + modalWidth > window.innerWidth - 20) posX = window.innerWidth - modalWidth - 20;
    if (posX < 20) posX = 20;
    if (posY + modalHeight > window.innerHeight - 20) posY = window.innerHeight - modalHeight - 20;
    if (posY < 20) posY = 20;

    modalEl.style.left = `${posX}px`;
    modalEl.style.top = `${posY}px`;

    setTimeout(() => textarea.focus(), 50);
  }

  function closeModal() {
    if (modalEl) modalEl.style.display = 'none';
    currentEditingNote = null;
    selectedTarget = null;
    clearCanvasDrawing();
  }

  function saveCurrentNote() {
    const textarea = modalEl.querySelector('#za-note-text');
    const categorySel = modalEl.querySelector('#za-note-category');
    const prioritySel = modalEl.querySelector('#za-note-priority');
    const agentChips = modalEl.querySelector('#za-modal-agent-chips');

    const text = textarea.value.trim();
    if (!text) {
      textarea.focus();
      return;
    }

    // Extract tagged agents from selected chips + @ mentions in text
    const taggedSet = new Set();
    agentChips.querySelectorAll('.za-agent-chip.selected').forEach(c => {
      taggedSet.add(c.getAttribute('data-tag'));
    });

    const mentionMatches = text.match(/@([a-zA-Z0-9_-]+)/g);
    if (mentionMatches) {
      mentionMatches.forEach(m => taggedSet.add(m.slice(1).toLowerCase()));
    }

    const tagged_agents = Array.from(taggedSet);
    const now = new Date();

    const noteObj = currentEditingNote || {
      id: `zn-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      created_at: now.toISOString(),
      created_local: now.toLocaleString(),
      status: 'open'
    };

    noteObj.text = text;
    noteObj.category = categorySel.value;
    noteObj.priority = prioritySel.value;
    noteObj.tagged_agents = tagged_agents;
    noteObj.page_url = window.location.href;
    noteObj.pathname = window.location.pathname;
    noteObj.viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
      scrollX: window.scrollX,
      scrollY: window.scrollY
    };

    if (selectedTarget) {
      noteObj.target = selectedTarget;
      noteObj.pageX = selectedTarget.pageX;
      noteObj.pageY = selectedTarget.pageY;
      noteObj.selector = selectedTarget.selector;
    }

    if (!currentEditingNote) {
      annotations.push(noteObj);
    } else {
      const idx = annotations.findIndex(a => a.id === noteObj.id);
      if (idx !== -1) annotations[idx] = noteObj;
    }

    saveLocalAnnotations();
    syncAnnotationToBackend(noteObj);
    closeModal();
  }

  // ─── On-Screen Markers Rendering ─────────────────────────────────
  function renderMarkers() {
    if (!markersLayer) return;
    markersLayer.innerHTML = '';

    const currentPathname = window.location.pathname;
    const pageNotes = annotations.filter(a => a.pathname === currentPathname || (!a.pathname && a.page_url === window.location.href));

    pageNotes.forEach((note, idx) => {
      if (!note.pageX || !note.pageY) return;

      const pin = document.createElement('div');
      pin.className = `za-marker-pin ${note.status === 'resolved' ? 'resolved' : ''} ${note.priority === 'Urgent' ? 'urgent' : ''}`;
      pin.style.left = `${note.pageX}px`;
      pin.style.top = `${note.pageY}px`;
      pin.textContent = note.status === 'resolved' ? '✓' : String(idx + 1);
      pin.setAttribute('title', `[${note.category}] ${note.text.slice(0, 50)}...`);

      pin.addEventListener('click', (e) => {
        e.stopPropagation();
        openModal(note.target || { label: note.selector || 'Note Target', clientX: e.clientX, clientY: e.clientY }, note);
      });

      markersLayer.appendChild(pin);
    });
  }

  // ─── All Notes Drawer ────────────────────────────────────────────
  function setupDrawerEvents() {
    const closeBtn = drawerEl.querySelector('#za-drawer-close-btn');
    const filterAgent = drawerEl.querySelector('#za-filter-agent');
    const filterStatus = drawerEl.querySelector('#za-filter-status');
    const copyBriefingBtn = drawerEl.querySelector('#za-btn-copy-briefing');
    const syncBusBtn = drawerEl.querySelector('#za-btn-sync-bus');

    closeBtn.addEventListener('click', () => toggleDrawer(false));

    filterAgent.addEventListener('change', (e) => {
      activeFilterAgent = e.target.value;
      renderDrawerList();
    });

    filterStatus.addEventListener('change', (e) => {
      activeFilterStatus = e.target.value;
      renderDrawerList();
    });

    copyBriefingBtn.addEventListener('click', () => {
      const briefing = generateAgentPromptBriefing();
      navigator.clipboard.writeText(briefing).then(() => {
        copyBriefingBtn.textContent = '✅ Copied to Clipboard!';
        setTimeout(() => copyBriefingBtn.textContent = '📋 Copy Agent Briefing', 2000);
      });
    });

    syncBusBtn.addEventListener('click', async () => {
      syncBusBtn.textContent = '⏳ Syncing...';
      for (const a of annotations) {
        await syncAnnotationToBackend(a);
      }
      await fetchBackendAnnotations();
      syncBusBtn.textContent = '✅ Synced!';
      setTimeout(() => syncBusBtn.textContent = '🔄 Sync Swarm Bus', 2000);
    });
  }

  function toggleDrawer(forceState) {
    const isOpen = forceState !== undefined ? forceState : !drawerEl.classList.contains('open');
    drawerEl.classList.toggle('open', isOpen);
    if (isOpen) renderDrawerList();
  }

  function renderDrawerList() {
    const list = drawerEl.querySelector('#za-drawer-list');
    if (!list) return;

    let filtered = annotations;
    if (activeFilterAgent !== 'all') {
      filtered = filtered.filter(a => a.tagged_agents && a.tagged_agents.includes(activeFilterAgent));
    }
    if (activeFilterStatus === 'open') {
      filtered = filtered.filter(a => a.status !== 'resolved');
    } else if (activeFilterStatus === 'resolved') {
      filtered = filtered.filter(a => a.status === 'resolved');
    }

    if (!filtered.length) {
      list.innerHTML = `
        <div style="text-align:center; padding:40px 20px; color:var(--za-text-dim)">
          <p style="font-size:24px; margin-bottom:8px">📝</p>
          <p style="font-weight:600">No notes found</p>
          <p style="font-size:12px; margin-top:4px">Use the Pin or Draw tool to leave notes on any page.</p>
        </div>
      `;
      return;
    }

    list.innerHTML = filtered.map((note) => `
      <div class="za-note-card ${note.status === 'resolved' ? 'resolved' : ''}" data-id="${note.id}">
        <div class="za-note-card-header">
          <span class="za-note-card-id">${note.id} · ${note.category}</span>
          <span class="za-note-card-page" title="${note.page_url}">${note.pathname || '/'}</span>
        </div>
        <div class="za-note-card-text">${escapeHtml(note.text)}</div>
        <div class="za-note-card-tags">
          ${(note.tagged_agents || []).map(t => `<span class="za-note-tag-agent">@${t}</span>`).join('')}
          ${note.selector ? `<span class="za-note-tag-agent" style="background:rgba(255,255,255,0.06);color:#fff">${escapeHtml(note.selector.slice(0, 24))}</span>` : ''}
        </div>
        <div class="za-note-card-actions">
          <span class="za-card-time">${note.created_local || note.created_at || ''}</span>
          <div style="display:flex; gap:6px">
            <button class="za-btn za-btn-ghost za-btn-resolve" data-id="${note.id}" style="padding:4px 8px; font-size:11px">
              ${note.status === 'resolved' ? '↩ Reopen' : '✓ Resolve'}
            </button>
            <button class="za-btn za-btn-ghost za-btn-delete" data-id="${note.id}" style="padding:4px 8px; font-size:11px; color:var(--za-pink)">✕</button>
          </div>
        </div>
      </div>
    `).join('');

    // Events on cards
    list.querySelectorAll('.za-note-card').forEach(card => {
      const id = card.getAttribute('data-id');
      const note = annotations.find(a => a.id === id);

      card.addEventListener('click', (e) => {
        if (e.target.closest('.za-btn-resolve') || e.target.closest('.za-btn-delete')) return;
        if (note && note.pathname === window.location.pathname && note.pageX && note.pageY) {
          window.scrollTo({ top: note.pageY - 180, behavior: 'smooth' });
          toggleDrawer(false);
          pulseMarker(note);
        }
      });
    });

    list.querySelectorAll('.za-btn-resolve').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const note = annotations.find(a => a.id === id);
        if (note) {
          note.status = note.status === 'resolved' ? 'open' : 'resolved';
          saveLocalAnnotations();
          resolveAnnotationBackend(id);
          renderDrawerList();
        }
      });
    });

    list.querySelectorAll('.za-btn-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        if (confirm('Delete this annotation?')) {
          annotations = annotations.filter(a => a.id !== id);
          saveLocalAnnotations();
          deleteAnnotationBackend(id);
          renderDrawerList();
        }
      });
    });
  }

  function pulseMarker(note) {
    const pins = markersLayer.querySelectorAll('.za-marker-pin');
    pins.forEach(pin => {
      if (Math.abs(parseFloat(pin.style.left) - note.pageX) < 5 && Math.abs(parseFloat(pin.style.top) - note.pageY) < 5) {
        pin.style.transform = 'translate(-50%, -50%) scale(2)';
        pin.style.boxShadow = '0 0 35px #00f0ff';
        setTimeout(() => {
          pin.style.transform = '';
          pin.style.boxShadow = '';
        }, 1200);
      }
    });
  }

  function generateAgentPromptBriefing() {
    const openNotes = annotations.filter(a => a.status !== 'resolved');
    if (!openNotes.length) return 'No open notes remaining in Zoth Studio.';

    let md = `### ⚡ ZOTH STUDIO — Visual Feedback & Task Dispatch\n`;
    md += `I have reviewed the site locally and left ${openNotes.length} visual note(s) for the swarm:\n\n`;

    openNotes.forEach((n, i) => {
      const agents = (n.tagged_agents || []).map(t => `@${t}`).join(', ') || '@antigravity';
      md += `#### ${i + 1}. [${n.category}] ${n.pathname || '/'} (${n.priority})\n`;
      md += `- **Assigned / Tagged:** ${agents}\n`;
      if (n.selector) md += `- **Target Element Selector:** \`${n.selector}\`\n`;
      if (n.target && n.target.elementText) md += `- **Element Text Preview:** "${n.target.elementText}"\n`;
      md += `- **Requested Change:** ${n.text}\n\n`;
    });

    md += `---\n*Please review and apply these changes to the codebase.*`;
    return md;
  }

  function escapeHtml(str) {
    return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // ─── Global Keyboard Shortcuts ───────────────────────────────────
  function setupGlobalHotkeys() {
    window.addEventListener('keydown', (e) => {
      // Don't trigger if user is typing inside an input or textarea (unless Escape or specific hotkey)
      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName) || e.target.isContentEditable;

      if ((e.ctrlKey && e.altKey && e.code === 'KeyA') ||
          (e.ctrlKey && e.shiftKey && e.code === 'KeyA') ||
          (e.altKey && e.code === 'KeyN')) {
        e.preventDefault();
        toggleAnnotationMode();
        return;
      }

      if ((e.ctrlKey && e.shiftKey && e.code === 'KeyO') || (e.altKey && e.code === 'KeyM')) {
        e.preventDefault();
        toggleDrawer();
        return;
      }

      if (e.key === 'Escape') {
        if (modalEl && modalEl.style.display === 'block') {
          closeModal();
          return;
        }
        if (drawerEl && drawerEl.classList.contains('open')) {
          toggleDrawer(false);
          return;
        }
        if (isAnnotating) {
          toggleAnnotationMode(false);
        }
        return;
      }

      // Backtick shortcut when not in input
      if (e.key === '`' && !isInput && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        toggleAnnotationMode();
      }
    });
  }

  // Self Initialization on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUI);
  } else {
    initUI();
  }

  // Expose API for external integration
  window.ZothAnnotator = {
    toggle: toggleAnnotationMode,
    openDrawer: () => toggleDrawer(true),
    getNotes: () => annotations,
    exportBriefing: generateAgentPromptBriefing
  };
})();
