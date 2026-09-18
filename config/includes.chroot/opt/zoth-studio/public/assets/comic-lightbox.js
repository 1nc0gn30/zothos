/**
 * AZOTH: The Zero-Leakage Saga — Manga & Comic High-Res Fullscreen Lightbox Inspector
 * 
 * Features:
 *  - Double-click or tap to inspect manga artwork in high-res fullscreen
 *  - Infinite Zoom & Pan Engine (Wheel at cursor, Touch pinch-to-zoom, Drag panning, Momentum)
 *  - Interactive Dialogue Magnifier Loupe (3x Reticle Lens for Speech Bubbles & Inking)
 *  - Contrast Boost & Manga Inking Readability Modes
 *  - Minimap Radar Viewfinder with interactive viewport panning
 *  - Synchronized Audio Voice Narration HUD
 *  - Keyboard Navigation:
 *      * Left / Right Arrows (A / D, PageUp / PageDown) — Previous / Next Page
 *      * Space — Toggle 2x Zoom / Fit (or Audio Narration)
 *      * Escape — Close Lightbox / Exit Modals
 *      * F — Toggle Fullscreen mode
 *      * M — Toggle Dialogue Magnifier Loupe
 *      * C — Cycle Inking / Contrast Readability Filters
 *      * + / - (Z / X) — Zoom In / Out
 *      * 0 / R — Reset Zoom & Centering to Fit
 *      * ? — Keyboard Shortcuts Help Modal
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ComicLightbox = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // Constants
  const MIN_SCALE = 0.5;
  const MAX_SCALE = 8.0;
  const ZOOM_STEP = 1.35;
  const DOUBLE_TAP_DELAY = 300;

  class LightboxEngine {
    constructor() {
      this.items = [];
      this.currentIndex = 0;
      this.isOpen = false;
      this.scale = 1.0;
      this.fitScale = 1.0;
      this.translateX = 0;
      this.translateY = 0;
      this.isPanning = false;
      this.startPanX = 0;
      this.startPanY = 0;
      this.initialTranslateX = 0;
      this.initialTranslateY = 0;

      // Pinch zoom state
      this.activePointers = new Map();
      this.initialPinchDistance = null;
      this.initialPinchScale = 1.0;
      this.pinchCenter = { x: 0, y: 0 };

      // Touch tap tracking
      this.lastTapTime = 0;
      this.touchStartX = 0;
      this.touchStartY = 0;

      // Loupe Magnifier state
      this.magnifierActive = false;
      this.magnifierZoom = 3.0;
      this.loupeSize = 240;

      // Image Filter Mode (normal, contrast, ink, sharp)
      this.filterModes = ['normal', 'contrast', 'ink', 'sharp'];
      this.filterIndex = 0;

      // Audio Player
      this.audioPlayer = null;
      this.isAudioPlaying = false;

      // Animation frame ID
      this.rafId = null;

      // Elements
      this.overlay = null;
      this.viewport = null;
      this.stage = null;
      this.img = null;
      this.loader = null;
      this.loupe = null;
      this.minimap = null;
      this.minimapImg = null;
      this.minimapVp = null;
      this.dialogueCard = null;
      this.dialogueText = null;
      this.zoomReadout = null;
      this.zoomSlider = null;
      this.thumbRail = null;
      this.toastEl = null;
      this.shortcutsModal = null;
      this.pageTitleEl = null;
      this.metaResEl = null;
      this.btnAudio = null;
      this.btnMagnifier = null;
      this.btnFilter = null;
      this.btnFullscreen = null;
      this.btnPrev = null;
      this.btnNext = null;

      this.initialized = false;
    }

    /**
     * Initializes the lightbox: ensures CSS is loaded, builds DOM, scans page artwork.
     */
    init(options = {}) {
      if (this.initialized) {
        if (options.items) this.setItems(options.items);
        return this;
      }

      this.ensureCSS();
      this.buildDOM();
      this.bindEvents();

      if (options.items && options.items.length > 0) {
        this.setItems(options.items);
      } else {
        this.scanDocumentForPages();
      }

      this.initialized = true;
      return this;
    }

    /**
     * Injects CSS link if not present in document head.
     */
    ensureCSS() {
      if (document.querySelector('link[href*="comic-lightbox.css"]')) return;
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/assets/comic/comic-lightbox.css';
      document.head.appendChild(link);
    }

    /**
     * Scans DOM for comic/manga artwork elements and binds inspection triggers.
     */
    scanDocumentForPages() {
      const scanned = [];
      const selectors = [
        '.comic-page-wrapper',
        '.panel-card',
        '[data-comic-page]',
        '[data-lightbox]'
      ];

      const containers = document.querySelectorAll(selectors.join(', '));

      if (containers.length > 0) {
        containers.forEach((el, idx) => {
          const img = el.querySelector('img');
          if (!img) return;

          const titleEl = el.querySelector('.comic-page-num, .panel-title, h2, h3');
          const title = titleEl ? titleEl.textContent.trim() : (img.alt || `Artwork Page ${idx + 1}`);

          const captionEl = el.querySelector('.comic-page-caption, .panel-script, p');
          const caption = captionEl ? captionEl.textContent.trim() : '';

          const audioSrc = el.getAttribute('data-audio') || (window.PAGES && window.PAGES[idx] ? window.PAGES[idx].audio : '');

          const item = {
            src: img.getAttribute('data-highres') || img.currentSrc || img.src,
            thumb: img.src,
            title: title,
            caption: caption,
            audio: audioSrc,
            alt: img.alt || title,
            el: img
          };

          scanned.push(item);
          this.attachTriggerToElement(img, idx, el);
        });
      } else {
        // Fallback: look for comic images directly
        const imgs = document.querySelectorAll('img[src*="/assets/comic/"], img.comic-page-img, img.panel-img');
        imgs.forEach((img, idx) => {
          const item = {
            src: img.getAttribute('data-highres') || img.currentSrc || img.src,
            thumb: img.src,
            title: img.alt || `Comic Page ${idx + 1}`,
            caption: img.getAttribute('data-caption') || '',
            audio: img.getAttribute('data-audio') || '',
            alt: img.alt,
            el: img
          };
          scanned.push(item);
          this.attachTriggerToElement(img, idx);
        });
      }

      this.setItems(scanned);
    }

    /**
     * Attaches double-click, tap, and hover inspect badge to artwork.
     */
    attachTriggerToElement(imgEl, index, containerEl = null) {
      if (imgEl._clbAttached) return;
      imgEl._clbAttached = true;

      // Add inspect badge to parent container if positioned
      const parent = containerEl || imgEl.parentElement;
      if (parent && !parent.querySelector('.comic-inspect-badge')) {
        const badge = document.createElement('div');
        badge.className = 'comic-inspect-badge';
        badge.innerHTML = '<span>🔍</span> <span>Inspect High-Res</span>';
        badge.title = 'Double-click or click to inspect artwork in high-res fullscreen';

        badge.style.pointerEvents = 'auto';
        badge.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.open(index);
        });

        // Ensure parent has relative positioning for badge anchoring
        const parentPos = window.getComputedStyle(parent).position;
        if (parentPos === 'static') {
          parent.style.position = 'relative';
        }
        parent.appendChild(badge);
      }

      // Desktop: Double click to inspect
      imgEl.addEventListener('dblclick', (e) => {
        e.preventDefault();
        this.open(index);
      });

      // Mobile/Touch: Double-tap or tap detection
      let lastTap = 0;
      imgEl.addEventListener('touchend', (e) => {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;
        if (tapLength > 0 && tapLength < DOUBLE_TAP_DELAY) {
          e.preventDefault();
          this.open(index);
        }
        lastTap = currentTime;
      }, { passive: false });

      // Cursor visual feedback
      imgEl.style.cursor = 'zoom-in';
      imgEl.title = (imgEl.title ? imgEl.title + ' — ' : '') + 'Double-click or tap to inspect high-res fullscreen';
    }

    /**
     * Sets gallery items array.
     */
    setItems(items) {
      this.items = items || [];
      this.renderThumbnails();
    }

    /**
     * Builds DOM structure for the Lightbox overlay.
     */
    buildDOM() {
      if (document.getElementById('comic-lightbox-modal')) {
        this.overlay = document.getElementById('comic-lightbox-modal');
        return;
      }

      const overlay = document.createElement('div');
      overlay.id = 'comic-lightbox-modal';
      overlay.className = 'comic-lightbox-overlay';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');
      overlay.setAttribute('aria-label', 'High-Res Manga Fullscreen Lightbox Inspector');
      overlay.tabIndex = -1;

      overlay.innerHTML = `
        <!-- Top Header HUD -->
        <header class="clb-header">
          <div class="clb-header-left">
            <span class="clb-logo-tag">⚡ ZOTH MANGA HUD</span>
            <div class="clb-title-wrap">
              <h2 class="clb-page-title" id="clb-title">Cover · Genesis</h2>
              <div class="clb-meta-line">
                <span id="clb-counter">PAGE 01 OF 07</span>
                <span>•</span>
                <span class="clb-meta-res" id="clb-resolution">1080×1620 RAW</span>
              </div>
            </div>
          </div>

          <div class="clb-header-right">
            <!-- Audio Narration Button -->
            <button class="clb-btn clb-btn-gold" id="clb-btn-audio" type="button" title="Listen to Morgan Freeman voice narration (Space)">
              <span id="clb-audio-icon">🔊</span>
              <span class="clb-btn-text-hide" id="clb-audio-label">Narration</span>
            </button>

            <!-- Filter Mode Button -->
            <button class="clb-btn" id="clb-btn-filter" type="button" title="Cycle Contrast / Manga Inking Modes (C)">
              <span>🎨</span>
              <span class="clb-btn-text-hide">Inking Mode</span>
            </button>

            <!-- Magnifier Loupe Button -->
            <button class="clb-btn" id="clb-btn-loupe" type="button" title="Toggle Dialogue Magnifier Loupe (M)">
              <span>🔍</span>
              <span class="clb-btn-text-hide">Magnifier Lens</span>
            </button>

            <!-- Fullscreen Button -->
            <button class="clb-btn clb-btn-icon" id="clb-btn-fullscreen" type="button" title="Toggle Fullscreen (F)">
              <span id="clb-fs-icon">⛶</span>
            </button>

            <!-- Shortcuts Help Button -->
            <button class="clb-btn clb-btn-icon" id="clb-btn-help" type="button" title="Keyboard Shortcuts (?)">
              <span>⌨</span>
            </button>

            <!-- Close Button -->
            <button class="clb-btn clb-btn-icon clb-btn-close" id="clb-btn-close" type="button" title="Close Lightbox (Escape)">
              <span>✕</span>
            </button>
          </div>
        </header>

        <!-- Main Viewport Area -->
        <main class="clb-viewport" id="clb-viewport">
          <div class="clb-stage" id="clb-stage">
            <img class="clb-img" id="clb-img" src="" alt="Manga artwork page" draggable="false" />
          </div>

          <!-- Loading Spinner -->
          <div class="clb-loader" id="clb-loader">
            <div class="clb-spinner"></div>
            <span class="clb-loader-text">Deciphering High-Res Silicon Plates...</span>
          </div>

          <!-- Side Navigation Arrows -->
          <button class="clb-nav-prev" id="clb-nav-prev" type="button" title="Previous Page (Left Arrow / A)">
            <span class="clb-nav-icon">◀</span>
            <span class="clb-nav-label">PREV</span>
          </button>

          <button class="clb-nav-next" id="clb-nav-next" type="button" title="Next Page (Right Arrow / D)">
            <span class="clb-nav-icon">▶</span>
            <span class="clb-nav-label">NEXT</span>
          </button>

          <!-- Dialogue Magnifier Loupe Lens -->
          <div class="clb-loupe" id="clb-loupe">
            <div class="clb-loupe-reticle"></div>
            <div class="clb-loupe-hud-tag">3.0× RETICLE LOUPE</div>
          </div>

          <!-- Minimap Radar Viewfinder -->
          <div class="clb-minimap" id="clb-minimap">
            <span class="clb-minimap-label">MINIMAP</span>
            <img class="clb-minimap-img" id="clb-minimap-img" src="" alt="Minimap thumbnail" />
            <div class="clb-minimap-viewport" id="clb-minimap-vp"></div>
          </div>

          <!-- Dialogue Text & Caption Drawer -->
          <div class="clb-dialogue-card" id="clb-dialogue-card">
            <div class="clb-dialogue-header">
              <span class="clb-dialogue-tag">💬 SCRIPT TRANSLATION</span>
              <button class="clb-dialogue-toggle" id="clb-dialogue-toggle" type="button">Collapse ▲</button>
            </div>
            <p class="clb-dialogue-text" id="clb-dialogue-text">
              Master Azoth hands the golden sovereign coin to the hacker in Neo-Kyoto.
            </p>
          </div>

          <!-- Toast Notification -->
          <div class="clb-toast" id="clb-toast">Double-click or pinch to zoom</div>
        </main>

        <!-- Bottom Toolbar & Thumbnail Scrubber -->
        <footer class="clb-toolbar-wrap">
          <!-- Thumbnail Scrubber Rail -->
          <nav class="clb-thumbnail-rail" id="clb-thumbnail-rail" aria-label="Page Scrubber Rail"></nav>

          <!-- Toolbar HUD -->
          <div class="clb-toolbar">
            <button class="clb-btn clb-btn-icon" id="clb-btn-zoom-out" type="button" title="Zoom Out (-)">−</button>
            
            <input type="range" class="clb-slider" id="clb-zoom-slider" min="50" max="800" value="100" step="5" title="Zoom Level" />
            
            <button class="clb-btn clb-btn-icon" id="clb-btn-zoom-in" type="button" title="Zoom In (+)">+</button>

            <span class="clb-zoom-readout" id="clb-zoom-readout">100%</span>

            <div class="clb-divider"></div>

            <button class="clb-btn" id="clb-btn-fit" type="button" title="Fit Artwork to Screen (0 / R)">Fit</button>
            <button class="clb-btn" id="clb-btn-100" type="button" title="Actual Size 100%">100%</button>
            <button class="clb-btn" id="clb-btn-reset" type="button" title="Reset Zoom & Position">Reset</button>
          </div>
        </footer>

        <!-- Keyboard Shortcuts Help Modal Backdrop -->
        <div class="clb-modal-backdrop" id="clb-modal-help">
          <div class="clb-modal-box">
            <div class="clb-modal-header">
              <h3 class="clb-modal-title">⚡ Navigation & Shortcut Matrix</h3>
              <button class="clb-btn clb-btn-icon clb-btn-close" id="clb-modal-help-close" type="button">✕</button>
            </div>
            <div class="clb-shortcuts-grid">
              <div class="clb-shortcut-row">
                <span class="clb-shortcut-desc">Next / Prev Page</span>
                <div class="clb-kbd-group">
                  <kbd class="clb-kbd">←</kbd>
                  <kbd class="clb-kbd">→</kbd>
                  <kbd class="clb-kbd">A</kbd>
                  <kbd class="clb-kbd">D</kbd>
                </div>
              </div>

              <div class="clb-shortcut-row">
                <span class="clb-shortcut-desc">Toggle Zoom 2x / Fit</span>
                <kbd class="clb-kbd">Space</kbd>
              </div>

              <div class="clb-shortcut-row">
                <span class="clb-shortcut-desc">Zoom at Cursor</span>
                <span class="clb-shortcut-desc" style="font-size:0.7rem; color:var(--clb-cyan);">Mouse Wheel</span>
              </div>

              <div class="clb-shortcut-row">
                <span class="clb-shortcut-desc">Pan Artwork</span>
                <span class="clb-shortcut-desc" style="font-size:0.7rem; color:var(--clb-cyan);">Click & Drag</span>
              </div>

              <div class="clb-shortcut-row">
                <span class="clb-shortcut-desc">Zoom In / Out</span>
                <div class="clb-kbd-group">
                  <kbd class="clb-kbd">+</kbd>
                  <kbd class="clb-kbd">−</kbd>
                  <kbd class="clb-kbd">Z</kbd>
                  <kbd class="clb-kbd">X</kbd>
                </div>
              </div>

              <div class="clb-shortcut-row">
                <span class="clb-shortcut-desc">Reset to Fit</span>
                <div class="clb-kbd-group">
                  <kbd class="clb-kbd">0</kbd>
                  <kbd class="clb-kbd">R</kbd>
                </div>
              </div>

              <div class="clb-shortcut-row">
                <span class="clb-shortcut-desc">Dialogue Loupe</span>
                <kbd class="clb-kbd">M</kbd>
              </div>

              <div class="clb-shortcut-row">
                <span class="clb-shortcut-desc">Inking / Contrast</span>
                <kbd class="clb-kbd">C</kbd>
              </div>

              <div class="clb-shortcut-row">
                <span class="clb-shortcut-desc">Toggle Fullscreen</span>
                <kbd class="clb-kbd">F</kbd>
              </div>

              <div class="clb-shortcut-row">
                <span class="clb-shortcut-desc">Close Lightbox</span>
                <kbd class="clb-kbd">Esc</kbd>
              </div>
            </div>
            <div style="text-align:center;">
              <button class="clb-btn clb-btn-gold" id="clb-modal-help-ok" type="button" style="width:100%;">
                Got it (Resume Reading)
              </button>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(overlay);

      // Cache elements
      this.overlay = overlay;
      this.viewport = overlay.querySelector('#clb-viewport');
      this.stage = overlay.querySelector('#clb-stage');
      this.img = overlay.querySelector('#clb-img');
      this.loader = overlay.querySelector('#clb-loader');
      this.loupe = overlay.querySelector('#clb-loupe');
      this.minimap = overlay.querySelector('#clb-minimap');
      this.minimapImg = overlay.querySelector('#clb-minimap-img');
      this.minimapVp = overlay.querySelector('#clb-minimap-vp');
      this.dialogueCard = overlay.querySelector('#clb-dialogue-card');
      this.dialogueText = overlay.querySelector('#clb-dialogue-text');
      this.zoomReadout = overlay.querySelector('#clb-zoom-readout');
      this.zoomSlider = overlay.querySelector('#clb-zoom-slider');
      this.thumbRail = overlay.querySelector('#clb-thumbnail-rail');
      this.toastEl = overlay.querySelector('#clb-toast');
      this.shortcutsModal = overlay.querySelector('#clb-modal-help');
      this.pageTitleEl = overlay.querySelector('#clb-title');
      this.metaResEl = overlay.querySelector('#clb-resolution');
      this.btnAudio = overlay.querySelector('#clb-btn-audio');
      this.btnMagnifier = overlay.querySelector('#clb-btn-loupe');
      this.btnFilter = overlay.querySelector('#clb-btn-filter');
      this.btnFullscreen = overlay.querySelector('#clb-btn-fullscreen');
      this.btnPrev = overlay.querySelector('#clb-nav-prev');
      this.btnNext = overlay.querySelector('#clb-nav-next');
    }

    /**
     * Renders thumbnail buttons in bottom rail.
     */
    renderThumbnails() {
      if (!this.thumbRail) return;
      this.thumbRail.innerHTML = '';

      this.items.forEach((item, idx) => {
        const thumb = document.createElement('button');
        thumb.className = 'clb-thumb-item' + (idx === this.currentIndex ? ' clb-thumb-active' : '');
        thumb.type = 'button';
        thumb.title = item.title || `Page ${idx + 1}`;
        thumb.innerHTML = `
          <img class="clb-thumb-img" src="${item.thumb || item.src}" alt="${item.title || 'Page'}" loading="lazy" />
          <span class="clb-thumb-badge">P.${idx === 0 ? 'CV' : String(idx).padStart(2, '0')}</span>
        `;

        thumb.addEventListener('click', () => {
          this.setPage(idx);
        });

        this.thumbRail.appendChild(thumb);
      });
    }

    /**
     * Binds mouse, touch, pointer, audio and keyboard events.
     */
    bindEvents() {
      // Close button
      this.overlay.querySelector('#clb-btn-close').addEventListener('click', () => this.close());

      // Navigation buttons
      this.btnPrev.addEventListener('click', () => this.prev());
      this.btnNext.addEventListener('click', () => this.next());

      // Zoom Toolbar buttons
      this.overlay.querySelector('#clb-btn-zoom-in').addEventListener('click', () => this.zoomStep(ZOOM_STEP));
      this.overlay.querySelector('#clb-btn-zoom-out').addEventListener('click', () => this.zoomStep(1 / ZOOM_STEP));
      this.overlay.querySelector('#clb-btn-fit').addEventListener('click', () => this.fitToScreen(true));
      this.overlay.querySelector('#clb-btn-100').addEventListener('click', () => this.setZoom(1.0, true));
      this.overlay.querySelector('#clb-btn-reset').addEventListener('click', () => this.reset(true));

      // Zoom slider
      this.zoomSlider.addEventListener('input', (e) => {
        const pct = parseFloat(e.target.value);
        this.setZoom(pct / 100, false);
      });

      // Magnifier Toggle button
      this.btnMagnifier.addEventListener('click', () => this.toggleMagnifier());

      // Filter Mode button
      this.btnFilter.addEventListener('click', () => this.cycleFilter());

      // Fullscreen Toggle button
      this.btnFullscreen.addEventListener('click', () => this.toggleFullscreen());

      // Audio Narration button
      this.btnAudio.addEventListener('click', () => this.toggleAudio());

      // Shortcuts Modal toggle
      this.overlay.querySelector('#clb-btn-help').addEventListener('click', () => this.toggleShortcutsModal(true));
      this.overlay.querySelector('#clb-modal-help-close').addEventListener('click', () => this.toggleShortcutsModal(false));
      this.overlay.querySelector('#clb-modal-help-ok').addEventListener('click', () => this.toggleShortcutsModal(false));
      this.shortcutsModal.addEventListener('click', (e) => {
        if (e.target === this.shortcutsModal) this.toggleShortcutsModal(false);
      });

      // Dialogue toggle
      this.overlay.querySelector('#clb-dialogue-toggle').addEventListener('click', () => {
        this.dialogueCard.classList.toggle('clb-dialogue-collapsed');
        const isCollapsed = this.dialogueCard.classList.contains('clb-dialogue-collapsed');
        this.overlay.querySelector('#clb-dialogue-toggle').textContent = isCollapsed ? 'Expand ▼' : 'Collapse ▲';
      });

      // Pointer & Pan events on Viewport
      this.viewport.addEventListener('pointerdown', this.onPointerDown.bind(this));
      this.viewport.addEventListener('pointermove', this.onPointerMove.bind(this));
      this.viewport.addEventListener('pointerup', this.onPointerUp.bind(this));
      this.viewport.addEventListener('pointercancel', this.onPointerUp.bind(this));

      // Mouse Wheel Zoom
      this.viewport.addEventListener('wheel', this.onWheel.bind(this), { passive: false });

      // Double-click to zoom toggle
      this.viewport.addEventListener('dblclick', this.onDoubleClick.bind(this));

      // Touch gestures
      this.viewport.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: true });
      this.viewport.addEventListener('touchend', this.onTouchEnd.bind(this), { passive: true });

      // Global Keydown Handler
      window.addEventListener('keydown', this.onKeyDown.bind(this));

      // Window Resize Handler
      window.addEventListener('resize', () => {
        if (this.isOpen) {
          this.calculateFitScale();
          this.clampTransform();
          this.applyTransform();
        }
      });

      // Fullscreen change sync
      document.addEventListener('fullscreenchange', () => {
        const isFs = !!document.fullscreenElement;
        this.btnFullscreen.classList.toggle('clb-active', isFs);
        this.overlay.querySelector('#clb-fs-icon').textContent = isFs ? '⤓' : '⛶';
      });
    }

    /**
     * Opens the Lightbox at the specified item/index.
     */
    open(srcOrIndex = 0) {
      this.buildDOM();
      let targetIndex = 0;

      if (typeof srcOrIndex === 'number') {
        targetIndex = Math.max(0, Math.min(srcOrIndex, this.items.length - 1));
      } else if (typeof srcOrIndex === 'string') {
        const idx = this.items.findIndex(it => it.src === srcOrIndex || it.thumb === srcOrIndex);
        if (idx !== -1) targetIndex = idx;
      }

      this.isOpen = true;
      this.overlay.classList.add('clb-active');
      document.body.style.overflow = 'hidden';

      this.setPage(targetIndex);
      this.overlay.focus();

      // Show welcome toast hint on first open
      this.showToast('Double-click, Pinch, or use Wheel to inspect in High-Res');
    }

    /**
     * Closes the Lightbox overlay.
     */
    close() {
      if (!this.isOpen) return;
      this.isOpen = false;
      this.overlay.classList.remove('clb-active');
      document.body.style.overflow = '';

      if (this.audioPlayer) {
        this.audioPlayer.pause();
        this.isAudioPlaying = false;
        this.updateAudioHUD();
      }

      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }

      this.toggleShortcutsModal(false);
    }

    /**
     * Sets active page index, loads image, updates HUD & minimap.
     */
    setPage(index) {
      if (!this.items || this.items.length === 0) return;
      this.currentIndex = Math.max(0, Math.min(index, this.items.length - 1));
      const item = this.items[this.currentIndex];

      // Update Navigation button states
      this.btnPrev.disabled = this.currentIndex === 0;
      this.btnNext.disabled = this.currentIndex === this.items.length - 1;

      // Update Header Title & Breadcrumb
      this.pageTitleEl.textContent = item.title || `Page ${this.currentIndex + 1}`;
      this.overlay.querySelector('#clb-counter').textContent = `PAGE ${String(this.currentIndex + 1).padStart(2, '0')} OF ${String(this.items.length).padStart(2, '0')}`;

      // Update Dialogue script text
      if (item.caption) {
        this.dialogueText.textContent = item.caption;
        this.dialogueCard.style.display = 'block';
      } else {
        this.dialogueCard.style.display = 'none';
      }

      // Update Thumbnail selection
      const thumbs = this.thumbRail.querySelectorAll('.clb-thumb-item');
      thumbs.forEach((t, i) => {
        t.classList.toggle('clb-thumb-active', i === this.currentIndex);
        if (i === this.currentIndex) {
          t.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
      });

      // Show Loading indicator
      this.loader.classList.add('clb-loading');

      // Create new Image object to get natural dimensions
      const highResImg = new Image();
      highResImg.src = item.src;
      highResImg.onload = () => {
        this.img.src = item.src;
        this.img.alt = item.alt || item.title;
        this.minimapImg.src = item.src;
        this.metaResEl.textContent = `${highResImg.naturalWidth}×${highResImg.naturalHeight} RAW`;

        this.loader.classList.remove('clb-loading');
        this.fitToScreen(false);
      };

      highResImg.onerror = () => {
        this.loader.classList.remove('clb-loading');
        this.img.src = item.thumb || item.src;
        this.metaResEl.textContent = 'Standard Res';
        this.fitToScreen(false);
      };

      // Handle Audio Narration for current page
      this.setupPageAudio(item.audio);

      // Preload adjacent images
      this.preloadAdjacent();
    }

    /**
     * Preloads previous and next page images for zero-latency flipping.
     */
    preloadAdjacent() {
      [-1, 1].forEach(offset => {
        const idx = this.currentIndex + offset;
        if (idx >= 0 && idx < this.items.length) {
          const preImg = new Image();
          preImg.src = this.items[idx].src;
        }
      });
    }

    /**
     * Navigate to Next Page.
     */
    next() {
      if (this.currentIndex < this.items.length - 1) {
        this.setPage(this.currentIndex + 1);
      } else {
        this.showToast('Reached Last Page');
      }
    }

    /**
     * Navigate to Previous Page.
     */
    prev() {
      if (this.currentIndex > 0) {
        this.setPage(this.currentIndex - 1);
      } else {
        this.showToast('Already on First Page');
      }
    }

    /**
     * Fits image within the viewport area.
     */
    calculateFitScale() {
      if (!this.img || !this.viewport) return 1.0;
      const vpRect = this.viewport.getBoundingClientRect();
      const naturalW = this.img.naturalWidth || 1080;
      const naturalH = this.img.naturalHeight || 1620;

      const padX = 40;
      const padY = 40;
      const availW = Math.max(100, vpRect.width - padX);
      const availH = Math.max(100, vpRect.height - padY);

      const scaleX = availW / naturalW;
      const scaleY = availH / naturalH;
      this.fitScale = Math.min(scaleX, scaleY, 1.25);
      return this.fitScale;
    }

    /**
     * Fit artwork to screen bounds and centers it.
     */
    fitToScreen(animate = true) {
      this.calculateFitScale();
      this.scale = this.fitScale;
      this.centerImage();
      this.applyTransform(animate);
    }

    /**
     * Centers image inside viewport.
     */
    centerImage() {
      if (!this.viewport || !this.img) return;
      const vpRect = this.viewport.getBoundingClientRect();
      const naturalW = this.img.naturalWidth || 1080;
      const naturalH = this.img.naturalHeight || 1620;

      const renderedW = naturalW * this.scale;
      const renderedH = naturalH * this.scale;

      this.translateX = (vpRect.width - renderedW) / 2;
      this.translateY = (vpRect.height - renderedH) / 2;
    }

    /**
     * Resets zoom to fit and recenters.
     */
    reset(animate = true) {
      this.fitToScreen(animate);
    }

    /**
     * Clamps translation so artwork is never pushed completely off-screen.
     */
    clampTransform() {
      if (!this.viewport || !this.img) return;
      const vpRect = this.viewport.getBoundingClientRect();
      const naturalW = this.img.naturalWidth || 1080;
      const naturalH = this.img.naturalHeight || 1620;

      const renderedW = naturalW * this.scale;
      const renderedH = naturalH * this.scale;

      if (renderedW <= vpRect.width) {
        this.translateX = (vpRect.width - renderedW) / 2;
      } else {
        const minX = vpRect.width - renderedW - 20;
        const maxX = 20;
        this.translateX = Math.min(maxX, Math.max(minX, this.translateX));
      }

      if (renderedH <= vpRect.height) {
        this.translateY = (vpRect.height - renderedH) / 2;
      } else {
        const minY = vpRect.height - renderedH - 20;
        const maxY = 20;
        this.translateY = Math.min(maxY, Math.max(minY, this.translateY));
      }
    }

    /**
     * Applies transform matrix with requestAnimationFrame for butter-smooth rendering.
     */
    applyTransform(animate = false) {
      if (this.rafId) cancelAnimationFrame(this.rafId);

      this.rafId = requestAnimationFrame(() => {
        this.stage.style.transition = animate ? 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)' : 'none';
        this.stage.style.transform = `translate3d(${this.translateX.toFixed(2)}px, ${this.translateY.toFixed(2)}px, 0) scale(${this.scale.toFixed(4)})`;

        // Update zoom percentage readout & slider
        const pct = Math.round(this.scale * 100);
        this.zoomReadout.textContent = `${pct}%`;
        this.zoomSlider.value = Math.min(800, Math.max(50, pct));

        // Update Minimap Viewfinder
        this.updateMinimap();
      });
    }

    /**
     * Zooms in or out at a specific screen coordinate (clientX, clientY).
     */
    zoomAt(targetScale, clientX, clientY, animate = false) {
      const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, targetScale));
      if (Math.abs(newScale - this.scale) < 0.001) return;

      const vpRect = this.viewport.getBoundingClientRect();
      const originX = clientX !== undefined ? clientX - vpRect.left : vpRect.width / 2;
      const originY = clientY !== undefined ? clientY - vpRect.top : vpRect.height / 2;

      // Position relative to current stage coordinates
      const imgX = (originX - this.translateX) / this.scale;
      const imgY = (originY - this.translateY) / this.scale;

      this.scale = newScale;
      this.translateX = originX - (imgX * this.scale);
      this.translateY = originY - (imgY * this.scale);

      this.clampTransform();
      this.applyTransform(animate);
    }

    /**
     * Set explicit scale level.
     */
    setZoom(targetScale, animate = true) {
      const vpRect = this.viewport.getBoundingClientRect();
      this.zoomAt(targetScale, vpRect.left + vpRect.width / 2, vpRect.top + vpRect.height / 2, animate);
    }

    /**
     * Step zoom by multiplier.
     */
    zoomStep(factor) {
      this.setZoom(this.scale * factor, true);
    }

    /**
     * Updates minimap radar viewport box.
     */
    updateMinimap() {
      if (!this.minimap || !this.img) return;
      const naturalW = this.img.naturalWidth || 1080;
      const naturalH = this.img.naturalHeight || 1620;
      const vpRect = this.viewport.getBoundingClientRect();

      // If scale is fit or smaller, hide minimap
      if (this.scale <= this.fitScale * 1.05) {
        this.minimap.classList.add('clb-minimap-hidden');
        return;
      }

      this.minimap.classList.remove('clb-minimap-hidden');

      const renderedW = naturalW * this.scale;
      const renderedH = naturalH * this.scale;

      const mapW = this.minimap.clientWidth;
      const mapH = this.minimap.clientHeight;

      // Aspect ratio scale on minimap
      const scaleX = mapW / naturalW;
      const scaleY = mapH / naturalH;
      const fitMap = Math.min(scaleX, scaleY);

      const previewW = naturalW * fitMap;
      const previewH = naturalH * fitMap;
      const offsetX = (mapW - previewW) / 2;
      const offsetY = (mapH - previewH) / 2;

      // Visible fraction of stage
      const visibleW = (vpRect.width / renderedW) * previewW;
      const visibleH = (vpRect.height / renderedH) * previewH;
      const visibleX = (-this.translateX / renderedW) * previewW + offsetX;
      const visibleY = (-this.translateY / renderedH) * previewH + offsetY;

      this.minimapVp.style.width = `${Math.min(mapW, Math.max(15, visibleW))}px`;
      this.minimapVp.style.height = `${Math.min(mapH, Math.max(15, visibleH))}px`;
      this.minimapVp.style.left = `${Math.max(0, Math.min(mapW - 15, visibleX))}px`;
      this.minimapVp.style.top = `${Math.max(0, Math.min(mapH - 15, visibleY))}px`;
    }

    /**
     * Mouse Wheel Handler (zooms centered at mouse point).
     */
    onWheel(e) {
      e.preventDefault();
      const delta = e.deltaY < 0 ? ZOOM_STEP : (1 / ZOOM_STEP);
      this.zoomAt(this.scale * delta, e.clientX, e.clientY, false);
    }

    /**
     * Double Click Handler in Viewport (cycles Fit -> 2.5x -> 4.5x -> Fit).
     */
    onDoubleClick(e) {
      e.preventDefault();
      if (this.scale < this.fitScale * 1.5) {
        this.zoomAt(this.fitScale * 2.5, e.clientX, e.clientY, true);
        this.showToast('Zoomed 2.5x — Drag to Pan');
      } else if (this.scale < this.fitScale * 3.5) {
        this.zoomAt(this.fitScale * 4.5, e.clientX, e.clientY, true);
        this.showToast('Max Detail 4.5x');
      } else {
        this.fitToScreen(true);
        this.showToast('Reset to Fit');
      }
    }

    /**
     * Pointer Down (Panning & Multi-touch Pinch Tracking).
     */
    onPointerDown(e) {
      if (e.target.closest('.clb-btn') || e.target.closest('.clb-nav-prev') || e.target.closest('.clb-nav-next') || e.target.closest('.clb-dialogue-card')) {
        return;
      }

      this.activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      this.viewport.setPointerCapture(e.pointerId);

      if (this.activePointers.size === 1) {
        this.isPanning = true;
        this.startPanX = e.clientX;
        this.startPanY = e.clientY;
        this.initialTranslateX = this.translateX;
        this.initialTranslateY = this.translateY;
        this.viewport.classList.add('clb-panning');
      } else if (this.activePointers.size === 2) {
        // Multi-touch pinch start
        this.isPanning = false;
        const pts = Array.from(this.activePointers.values());
        this.initialPinchDistance = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        this.initialPinchScale = this.scale;
        this.pinchCenter = {
          x: (pts[0].x + pts[1].x) / 2,
          y: (pts[0].y + pts[1].y) / 2
        };
      }
    }

    /**
     * Pointer Move (Pan and Pinch).
     */
    onPointerMove(e) {
      if (this.magnifierActive) {
        this.updateLoupePosition(e.clientX, e.clientY);
      }

      if (!this.activePointers.has(e.pointerId)) return;
      this.activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (this.activePointers.size === 1 && this.isPanning) {
        const dx = e.clientX - this.startPanX;
        const dy = e.clientY - this.startPanY;
        this.translateX = this.initialTranslateX + dx;
        this.translateY = this.initialTranslateY + dy;
        this.clampTransform();
        this.applyTransform(false);
      } else if (this.activePointers.size === 2 && this.initialPinchDistance) {
        const pts = Array.from(this.activePointers.values());
        const currentDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        const factor = currentDist / this.initialPinchDistance;
        const targetScale = this.initialPinchScale * factor;
        this.zoomAt(targetScale, this.pinchCenter.x, this.pinchCenter.y, false);
      }
    }

    /**
     * Pointer Up / Cancel.
     */
    onPointerUp(e) {
      if (this.activePointers.has(e.pointerId)) {
        this.activePointers.delete(e.pointerId);
        try { this.viewport.releasePointerCapture(e.pointerId); } catch (_) {}
      }

      if (this.activePointers.size === 0) {
        this.isPanning = false;
        this.viewport.classList.remove('clb-panning');
      } else if (this.activePointers.size === 1) {
        // Reset pan start to remaining pointer
        const remaining = Array.from(this.activePointers.values())[0];
        this.isPanning = true;
        this.startPanX = remaining.x;
        this.startPanY = remaining.y;
        this.initialTranslateX = this.translateX;
        this.initialTranslateY = this.translateY;
      }
    }

    /**
     * Touch Start (Track swipe gestures when scale is 1x).
     */
    onTouchStart(e) {
      if (e.touches.length === 1) {
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;
      }
    }

    /**
     * Touch End (Double-tap to zoom or horizontal swipe to flip).
     */
    onTouchEnd(e) {
      if (e.changedTouches.length === 1) {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const diffX = touchEndX - this.touchStartX;
        const diffY = touchEndY - this.touchStartY;

        // Double tap on mobile
        const now = new Date().getTime();
        const tapLength = now - this.lastTapTime;
        if (tapLength > 0 && tapLength < DOUBLE_TAP_DELAY && Math.hypot(diffX, diffY) < 15) {
          this.onDoubleClick({
            preventDefault: () => {},
            clientX: touchEndX,
            clientY: touchEndY
          });
        } else if (this.scale <= this.fitScale * 1.05 && Math.abs(diffX) > 60 && Math.abs(diffY) < 50) {
          // Horizontal page flip swipe
          if (diffX < 0) this.next();
          else this.prev();
        }
        this.lastTapTime = now;
      }
    }

    /**
     * Dialogue Magnifier Loupe Tool.
     */
    toggleMagnifier(forceState) {
      this.magnifierActive = forceState !== undefined ? forceState : !this.magnifierActive;
      this.btnMagnifier.classList.toggle('clb-active', this.magnifierActive);
      this.viewport.classList.toggle('clb-mode-magnify', this.magnifierActive);
      this.loupe.classList.toggle('clb-loupe-visible', this.magnifierActive);

      if (this.magnifierActive) {
        this.showToast('Dialogue Magnifier Active — Move cursor over text bubbles');
        // Initial position at viewport center
        const vp = this.viewport.getBoundingClientRect();
        this.updateLoupePosition(vp.left + vp.width / 2, vp.top + vp.height / 2);
      } else {
        this.showToast('Dialogue Magnifier Closed');
      }
    }

    /**
     * Updates Magnifier Loupe position and computes pixel slice coordinates.
     */
    updateLoupePosition(clientX, clientY) {
      if (!this.magnifierActive || !this.img) return;

      const vpRect = this.viewport.getBoundingClientRect();
      const xInVp = clientX - vpRect.left;
      const yInVp = clientY - vpRect.top;

      // Position loupe container at cursor
      this.loupe.style.left = `${xInVp}px`;
      this.loupe.style.top = `${yInVp}px`;

      // Calculate position relative to stage image
      const imgNaturalW = this.img.naturalWidth || 1080;
      const imgNaturalH = this.img.naturalHeight || 1620;

      const pointOnImgX = (xInVp - this.translateX) / this.scale;
      const pointOnImgY = (yInVp - this.translateY) / this.scale;

      const bgZoom = this.magnifierZoom;
      const bgW = imgNaturalW * bgZoom;
      const bgH = imgNaturalH * bgZoom;
      const bgPosX = -(pointOnImgX * bgZoom - (this.loupeSize / 2));
      const bgPosY = -(pointOnImgY * bgZoom - (this.loupeSize / 2));

      this.loupe.style.backgroundImage = `url("${this.img.src}")`;
      this.loupe.style.backgroundSize = `${bgW}px ${bgH}px`;
      this.loupe.style.backgroundPosition = `${bgPosX}px ${bgPosY}px`;
    }

    /**
     * Cycles Inking / Contrast Readability filter modes.
     */
    cycleFilter() {
      this.filterIndex = (this.filterIndex + 1) % this.filterModes.length;
      const mode = this.filterModes[this.filterIndex];

      // Remove existing filter classes
      this.filterModes.forEach(m => {
        if (m !== 'normal') this.viewport.classList.remove(`clb-filter-${m}`);
      });

      if (mode !== 'normal') {
        this.viewport.classList.add(`clb-filter-${mode}`);
        this.btnFilter.classList.add('clb-active');
        this.showToast(`Inking Mode: ${mode.toUpperCase()} (Sharpened)`);
      } else {
        this.btnFilter.classList.remove('clb-active');
        this.showToast('Inking Mode: Normal RAW');
      }
    }

    /**
     * Audio Narration Setup & Controls.
     */
    setupPageAudio(audioSrc) {
      if (this.audioPlayer) {
        this.audioPlayer.pause();
      }

      if (!audioSrc) {
        this.btnAudio.style.display = 'none';
        return;
      }

      this.btnAudio.style.display = 'inline-flex';
      this.audioPlayer = new Audio(audioSrc);
      this.isAudioPlaying = false;
      this.updateAudioHUD();

      this.audioPlayer.addEventListener('ended', () => {
        this.isAudioPlaying = false;
        this.updateAudioHUD();
      });
    }

    toggleAudio() {
      if (!this.audioPlayer) return;
      if (this.isAudioPlaying) {
        this.audioPlayer.pause();
        this.isAudioPlaying = false;
      } else {
        this.audioPlayer.play().then(() => {
          this.isAudioPlaying = true;
          this.showToast('Playing Morgan Freeman Narration');
        }).catch(err => {
          console.warn('[ZothComicLightbox] Audio autoplay notice:', err);
        });
      }
      this.updateAudioHUD();
    }

    updateAudioHUD() {
      if (!this.btnAudio) return;
      const icon = this.overlay.querySelector('#clb-audio-icon');
      const label = this.overlay.querySelector('#clb-audio-label');

      this.btnAudio.classList.toggle('clb-active', this.isAudioPlaying);
      icon.textContent = this.isAudioPlaying ? '⏸' : '🔊';
      label.textContent = this.isAudioPlaying ? 'Pause Voice' : 'Narration';
    }

    /**
     * Fullscreen API toggle.
     */
    toggleFullscreen() {
      if (!document.fullscreenElement) {
        const target = this.overlay.requestFullscreen ? this.overlay : document.documentElement;
        if (target.requestFullscreen) {
          target.requestFullscreen().catch(err => {
            console.warn('[ZothComicLightbox] Fullscreen request error:', err);
          });
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        }
      }
    }

    /**
     * Toggle Keyboard Shortcuts Help Modal.
     */
    toggleShortcutsModal(forceState) {
      const isOpen = forceState !== undefined ? forceState : !this.shortcutsModal.classList.contains('clb-modal-open');
      this.shortcutsModal.classList.toggle('clb-modal-open', isOpen);
    }

    /**
     * Displays a temporary cyberpunk toast notification.
     */
    showToast(message) {
      if (!this.toastEl) return;
      this.toastEl.textContent = message;
      this.toastEl.classList.add('clb-toast-show');

      if (this._toastTimer) clearTimeout(this._toastTimer);
      this._toastTimer = setTimeout(() => {
        this.toastEl.classList.remove('clb-toast-show');
      }, 2400);
    }

    /**
     * Keyboard Navigation Engine.
     */
    onKeyDown(e) {
      if (!this.isOpen) return;

      // Ignore input elements
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      const key = e.key;

      switch (key) {
        // Page Navigation
        case 'ArrowRight':
        case 'PageDown':
        case 'd':
        case 'D':
        case 'l':
        case 'L':
          e.preventDefault();
          this.next();
          break;

        case 'ArrowLeft':
        case 'PageUp':
        case 'a':
        case 'A':
        case 'h':
        case 'H':
          e.preventDefault();
          this.prev();
          break;

        // Spacebar: Toggle zoom or audio
        case ' ':
          e.preventDefault();
          if (this.audioPlayer && !this.audioPlayer.paused) {
            this.toggleAudio();
          } else {
            if (this.scale < this.fitScale * 1.5) {
              this.setZoom(this.fitScale * 2.5, true);
              this.showToast('2.5x Detail View');
            } else {
              this.fitToScreen(true);
              this.showToast('Fit to Screen');
            }
          }
          break;

        // Escape: Close modal / lightbox
        case 'Escape':
          e.preventDefault();
          if (this.shortcutsModal.classList.contains('clb-modal-open')) {
            this.toggleShortcutsModal(false);
          } else {
            this.close();
          }
          break;

        // F: Toggle Fullscreen
        case 'f':
        case 'F':
          e.preventDefault();
          this.toggleFullscreen();
          break;

        // M: Toggle Dialogue Magnifier Loupe
        case 'm':
        case 'M':
          e.preventDefault();
          this.toggleMagnifier();
          break;

        // C: Cycle Inking & Contrast Filters
        case 'c':
        case 'C':
          e.preventDefault();
          this.cycleFilter();
          break;

        // Zoom In
        case '+':
        case '=':
        case 'z':
        case 'Z':
          e.preventDefault();
          this.zoomStep(ZOOM_STEP);
          break;

        // Zoom Out
        case '-':
        case '_':
        case 'x':
        case 'X':
          e.preventDefault();
          this.zoomStep(1 / ZOOM_STEP);
          break;

        // Reset to Fit (0 or R)
        case '0':
        case 'r':
        case 'R':
          e.preventDefault();
          this.reset(true);
          this.showToast('Reset to Fit');
          break;

        // Help Modal (?)
        case '?':
        case '/':
          e.preventDefault();
          this.toggleShortcutsModal();
          break;
      }
    }
  }

  // Create singleton instance
  const instance = new LightboxEngine();

  // Auto-init on DOMContentLoaded
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => instance.init());
    } else {
      instance.init();
    }
  }

  return instance;
}));
