/**
 * AZOTH Comic Series — Mobile Gesture Engine (`comic-gestures.js`)
 * 
 * Provides high-performance, smooth mobile touch gestures for comic readers:
 *  1. Horizontal Swipe: Smooth swipe-to-turn-page with inertia, rubber-band cues, and angle locking.
 *  2. Pinch-to-Zoom: Multi-touch focal-point zooming and panning for high-res panel artwork.
 *  3. Double-Tap: Instant reader HUD toggle (immersive mode) and smart zoom reset.
 * 
 * Zero dependencies. 60/120fps hardware-accelerated transforms via requestAnimationFrame.
 * UMD + ESM + CommonJS compatible.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ComicGestures = factory();
    root.ZothComicGestures = root.ComicGestures; // Alias for Zoth ecosystem
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function () {
  'use strict';

  // --- Default Configuration ---
  const DEFAULTS = {
    container: null,            // Target container or selector (defaults to comic stage or body)
    imageSelector: '.comic-page-img, .panel-img, #mainComicImg, .comic-page-wrapper img, .panel-media-wrap img',
    pageSelector: '.comic-page-wrapper, .panel-card, #singlePageView',
    hudSelector: '.comic-audio-dock, .comic-scrubber-strip, .comic-nav-controls, #comic-pagination-bar, #pageNavControls, #thumbStrip, .comic-control-dock, .site-header, .comic-header, .drawer-toggle, .skip-to-content, [data-comic-hud]',
    
    // Swipe Configuration
    enableSwipe: true,
    swipeThreshold: 45,         // Min horizontal px displacement to trigger turn
    swipeVelocityThreshold: 0.3, // Min px/ms velocity for flick detection
    swipeAngleMax: 35,          // Max degrees from horizontal axis to recognize as swipe
    liveSwipeFeedback: true,    // Apply subtle interactive translation while dragging
    swipeResistance: 0.35,      // Visual dampening factor for swipe drag preview
    
    // Pinch & Zoom Configuration
    enableZoom: true,
    minScale: 1.0,
    maxScale: 4.5,
    zoomSnapBackDuration: 280,  // ms for spring-back animation
    panBoundsPadding: 20,       // px overscroll elasticity
    
    // Double-Tap Configuration
    enableDoubleTap: true,
    doubleTapDelay: 320,        // Max ms between taps
    doubleTapDistance: 24,      // Max px displacement between two taps
    smartDoubleTapZoom: true,   // If zoomed > 1.1x, double tap resets zoom; otherwise toggles HUD
    
    // UI Feedback
    showHudToast: true,
    showZoomPill: true,
    injectStyles: true,
    
    // Callbacks / Hooks
    onPagePrev: null,
    onPageNext: null,
    onPageChange: null,
    onZoomChange: null,
    onZoomReset: null,
    onHudToggle: null,
    onDoubleTap: null
  };

  // --- Utility Functions ---
  function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }

  function getDistance(p1, p2) {
    const dx = p2.clientX - p1.clientX;
    const dy = p2.clientY - p1.clientY;
    return Math.hypot(dx, dy);
  }

  function getMidpoint(p1, p2) {
    return {
      x: (p1.clientX + p2.clientX) / 2,
      y: (p1.clientY + p2.clientY) / 2
    };
  }

  // --- Style Injection ---
  let stylesInjected = false;
  function injectDefaultStyles() {
    if (stylesInjected || typeof document === 'undefined') return;
    const cssId = 'zoth-comic-gestures-styles';
    if (document.getElementById(cssId)) {
      stylesInjected = true;
      return;
    }

    const style = document.createElement('style');
    style.id = cssId;
    style.textContent = `
      /* Comic Gestures Core Hardware Acceleration */
      .comic-gesture-active {
        touch-action: none !important;
        user-select: none !important;
        -webkit-user-select: none !important;
      }
      .comic-zoomable-target {
        transform-origin: 0 0;
        will-change: transform;
        transition: transform 0.05s linear;
        cursor: grab;
      }
      .comic-zoomable-target.is-zoomed {
        cursor: grab;
        z-index: 40;
      }
      .comic-zoomable-target.is-animating {
        transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1) !important;
      }
      .comic-zoomable-target.is-dragging {
        cursor: grabbing !important;
      }

      /* Swipe Drag Feedback Layer */
      .comic-swipe-layer {
        will-change: transform;
        transition: transform 0.05s linear;
      }
      .comic-swipe-layer.is-animating {
        transition: transform 0.26s cubic-bezier(0.2, 0.9, 0.3, 1) !important;
      }

      /* HUD Hidden Transitions */
      body.comic-hud-hidden .site-header,
      body.comic-hud-hidden .comic-header,
      body.comic-hud-hidden .comic-audio-dock,
      body.comic-hud-hidden .comic-scrubber-strip,
      body.comic-hud-hidden .comic-nav-controls,
      body.comic-hud-hidden #comic-pagination-bar,
      body.comic-hud-hidden #pageNavControls,
      body.comic-hud-hidden #thumbStrip,
      body.comic-hud-hidden .comic-control-dock,
      body.comic-hud-hidden .drawer-toggle,
      body.comic-hud-hidden .skip-to-content,
      body.comic-hud-hidden [data-comic-hud] {
        opacity: 0 !important;
        pointer-events: none !important;
        transform: translateY(-8px) scale(0.98);
        transition: opacity 0.25s ease, transform 0.25s ease !important;
      }

      body.comic-hud-hidden .comic-nav-controls,
      body.comic-hud-hidden #comic-pagination-bar,
      body.comic-hud-hidden #pageNavControls,
      body.comic-hud-hidden #thumbStrip,
      body.comic-hud-hidden .comic-audio-dock {
        transform: translateY(12px) scale(0.98);
      }

      .site-header,
      .comic-header,
      .comic-audio-dock,
      .comic-scrubber-strip,
      .comic-nav-controls,
      #comic-pagination-bar,
      #pageNavControls,
      #thumbStrip,
      .comic-control-dock,
      [data-comic-hud] {
        transition: opacity 0.25s ease, transform 0.25s ease;
      }

      /* Floating Cyberpunk Feedback Pill */
      .comic-gesture-toast {
        position: fixed;
        bottom: 24px;
        left: 50%;
        transform: translateX(-50%) translateY(20px);
        background: rgba(11, 15, 29, 0.92);
        border: 1px solid rgba(0, 240, 255, 0.4);
        box-shadow: 0 8px 32px rgba(0, 240, 255, 0.25), inset 0 0 12px rgba(168, 85, 247, 0.2);
        color: #f1f5f9;
        padding: 8px 18px;
        border-radius: 9999px;
        font-family: 'IBM Plex Mono', monospace, monospace;
        font-size: 0.76rem;
        font-weight: 600;
        letter-spacing: 0.04em;
        z-index: 10000;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.22s ease, transform 0.22s cubic-bezier(0.16, 1, 0.3, 1);
        display: flex;
        align-items: center;
        gap: 8px;
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
      }
      .comic-gesture-toast.is-visible {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }
      .comic-gesture-toast .toast-sigil {
        color: #fbbf24;
        font-size: 0.9rem;
      }

      /* Floating Zoom Level Pill */
      .comic-zoom-pill {
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(11, 15, 29, 0.88);
        border: 1px solid rgba(251, 191, 36, 0.5);
        color: #fbbf24;
        padding: 6px 14px;
        border-radius: 20px;
        font-family: 'IBM Plex Mono', monospace;
        font-size: 0.72rem;
        font-weight: 700;
        z-index: 10000;
        opacity: 0;
        pointer-events: auto;
        cursor: pointer;
        transition: opacity 0.2s ease, transform 0.2s ease;
        transform: scale(0.9);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
      }
      .comic-zoom-pill.is-visible {
        opacity: 1;
        transform: scale(1);
      }
      .comic-zoom-pill:hover {
        background: rgba(251, 191, 36, 0.15);
        border-color: #fbbf24;
      }
    `;
    document.head.appendChild(style);
    stylesInjected = true;
  }

  // --- Main Gesture Engine Class ---
  class ComicGesturesEngine {
    constructor(options = {}) {
      this.opts = Object.assign({}, DEFAULTS, options);
      this.container = this.resolveContainer(this.opts.container);

      // State Flags & Tracking
      this.isHudHidden = false;
      this.isSwiping = false;
      this.isZooming = false;
      this.isPanning = false;

      // Transform state for active zoomable element
      this.currentScale = 1.0;
      this.translateX = 0;
      this.translateY = 0;
      this.targetImg = null;
      this.imgContainer = null;
      this.activeTouches = new Map();

      // Swipe Tracking
      this.touchStartX = 0;
      this.touchStartY = 0;
      this.touchStartTime = 0;
      this.lastTouchX = 0;
      this.lastTouchY = 0;
      this.swipeLocked = false;
      this.dragDeltaX = 0;

      // Double-Tap Tracking
      this.lastTapTime = 0;
      this.lastTapX = 0;
      this.lastTapY = 0;
      this.tapTimeout = null;

      // Pinch Tracking
      this.initialPinchDistance = 0;
      this.initialScale = 1.0;
      this.initialPanX = 0;
      this.initialPanY = 0;
      this.pinchMidpoint = { x: 0, y: 0 };
      this.startFocalRatio = { x: 0.5, y: 0.5 };

      // UI Nodes
      this.toastEl = null;
      this.zoomPillEl = null;
      this.toastTimer = null;
      this.rafId = null;

      // Bound Event Handlers (for clean cleanup)
      this._onTouchStart = this.onTouchStart.bind(this);
      this._onTouchMove = this.onTouchMove.bind(this);
      this._onTouchEnd = this.onTouchEnd.bind(this);
      this._onTouchCancel = this.onTouchCancel.bind(this);
      this._onKeyDown = this.onKeyDown.bind(this);

      this.init();
    }

    resolveContainer(c) {
      if (typeof window === 'undefined') return null;
      if (typeof c === 'string') return document.querySelector(c);
      if (c && c.nodeType) return c;
      return (
        document.getElementById('comic-stage-container') ||
        document.querySelector('.comic-stage') ||
        document.querySelector('.comic-wrap') ||
        document.getElementById('singlePageView') ||
        document.querySelector('main') ||
        document.body
      );
    }

    init() {
      if (typeof window === 'undefined' || !this.container) return;

      if (this.opts.injectStyles) {
        injectDefaultStyles();
      }

      this.createFeedbackElements();
      this.bindEvents();
      this.setupZoomableTargets();
    }

    createFeedbackElements() {
      if (typeof document === 'undefined') return;

      // Toast feedback pill
      if (this.opts.showHudToast && !document.getElementById('comicGestureToast')) {
        this.toastEl = document.createElement('div');
        this.toastEl.id = 'comicGestureToast';
        this.toastEl.className = 'comic-gesture-toast';
        this.toastEl.innerHTML = '<span class="toast-sigil">☿</span><span class="toast-text">Immersive Reader HUD Toggled</span>';
        document.body.appendChild(this.toastEl);
      } else {
        this.toastEl = document.getElementById('comicGestureToast');
      }

      // Zoom level pill
      if (this.opts.showZoomPill && !document.getElementById('comicZoomPill')) {
        this.zoomPillEl = document.createElement('div');
        this.zoomPillEl.id = 'comicZoomPill';
        this.zoomPillEl.className = 'comic-zoom-pill';
        this.zoomPillEl.innerHTML = '🔍 <span class="zoom-val">1.0x</span> · Tap to Reset';
        this.zoomPillEl.addEventListener('click', (e) => {
          e.stopPropagation();
          this.resetZoom(true);
        });
        document.body.appendChild(this.zoomPillEl);
      } else {
        this.zoomPillEl = document.getElementById('comicZoomPill');
      }
    }

    showToast(message, sigil = '☿', duration = 1800) {
      if (!this.toastEl) return;
      const textEl = this.toastEl.querySelector('.toast-text');
      const sigilEl = this.toastEl.querySelector('.toast-sigil');
      if (textEl) textEl.textContent = message;
      if (sigilEl) sigilEl.textContent = sigil;

      this.toastEl.classList.add('is-visible');
      if (this.toastTimer) clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(() => {
        if (this.toastEl) this.toastEl.classList.remove('is-visible');
      }, duration);
    }

    updateZoomPill(scale) {
      if (!this.zoomPillEl) return;
      const valEl = this.zoomPillEl.querySelector('.zoom-val');
      if (valEl) valEl.textContent = scale.toFixed(1) + 'x';

      if (scale > 1.05) {
        this.zoomPillEl.classList.add('is-visible');
      } else {
        this.zoomPillEl.classList.remove('is-visible');
      }
    }

    setupZoomableTargets() {
      if (!this.container) return;
      const images = this.container.querySelectorAll(this.opts.imageSelector);
      images.forEach((img) => {
        img.classList.add('comic-zoomable-target');
        const parent = img.parentElement;
        if (parent && getComputedStyle(parent).overflow === 'visible') {
          // ensure container clips zoomed child cleanly
          parent.style.overflow = 'hidden';
          parent.style.position = parent.style.position || 'relative';
        }
      });
    }

    bindEvents() {
      if (!this.container) return;

      const opts = { passive: false };
      this.container.addEventListener('touchstart', this._onTouchStart, opts);
      this.container.addEventListener('touchmove', this._onTouchMove, opts);
      this.container.addEventListener('touchend', this._onTouchEnd, opts);
      this.container.addEventListener('touchcancel', this._onTouchCancel, opts);
      window.addEventListener('keydown', this._onKeyDown);
    }

    unbindEvents() {
      if (!this.container) return;

      this.container.removeEventListener('touchstart', this._onTouchStart);
      this.container.removeEventListener('touchmove', this._onTouchMove);
      this.container.removeEventListener('touchend', this._onTouchEnd);
      this.container.removeEventListener('touchcancel', this._onTouchCancel);
      window.removeEventListener('keydown', this._onKeyDown);
    }

    // --- Touch Event Handlers ---

    onTouchStart(e) {
      const touches = e.touches;

      // Update active touch registry
      for (let i = 0; i < touches.length; i++) {
        this.activeTouches.set(touches[i].identifier, {
          clientX: touches[i].clientX,
          clientY: touches[i].clientY
        });
      }

      if (touches.length === 1) {
        const touch = touches[0];
        this.touchStartX = touch.clientX;
        this.touchStartY = touch.clientY;
        this.lastTouchX = touch.clientX;
        this.lastTouchY = touch.clientY;
        this.touchStartTime = Date.now();
        this.swipeLocked = false;
        this.dragDeltaX = 0;

        // Check if touching on a zoomable target
        const targetImg = touch.target.closest(this.opts.imageSelector);
        if (targetImg) {
          this.targetImg = targetImg;
          this.imgContainer = targetImg.parentElement;
        }

        // If already zoomed in, prepare for single-finger panning
        if (this.currentScale > 1.05 && this.targetImg) {
          this.isPanning = true;
          this.initialPanX = this.translateX;
          this.initialPanY = this.translateY;
          this.targetImg.classList.remove('is-animating');
          this.targetImg.classList.add('is-dragging');
        }

      } else if (touches.length === 2 && this.opts.enableZoom) {
        // Multi-touch Pinch to Zoom
        const t1 = touches[0];
        const t2 = touches[1];
        this.isZooming = true;
        this.isSwiping = false;
        this.isPanning = false;

        const targetImg = t1.target.closest(this.opts.imageSelector) || t2.target.closest(this.opts.imageSelector) || this.getActiveVisibleImage();
        if (targetImg) {
          this.targetImg = targetImg;
          this.imgContainer = targetImg.parentElement;
          this.targetImg.classList.remove('is-animating');
          this.targetImg.classList.add('comic-gesture-active');
        }

        this.initialPinchDistance = getDistance(t1, t2);
        this.initialScale = this.currentScale;
        this.initialPanX = this.translateX;
        this.initialPanY = this.translateY;
        this.pinchMidpoint = getMidpoint(t1, t2);

        if (this.targetImg) {
          const rect = this.targetImg.getBoundingClientRect();
          this.startFocalRatio = {
            x: rect.width > 0 ? (this.pinchMidpoint.x - rect.left) / rect.width : 0.5,
            y: rect.height > 0 ? (this.pinchMidpoint.y - rect.top) / rect.height : 0.5
          };
        }

        e.preventDefault(); // Prevent native browser pinch zoom
      }
    }

    onTouchMove(e) {
      const touches = e.touches;

      // Handle 2-Finger Pinch Zoom
      if (touches.length === 2 && this.isZooming && this.opts.enableZoom && this.targetImg) {
        e.preventDefault();
        const t1 = touches[0];
        const t2 = touches[1];
        const currentDist = getDistance(t1, t2);
        if (this.initialPinchDistance <= 0) return;

        const scaleRatio = currentDist / this.initialPinchDistance;
        let newScale = this.initialScale * scaleRatio;

        // Resistance over limit
        if (newScale > this.opts.maxScale) {
          newScale = this.opts.maxScale + (newScale - this.opts.maxScale) * 0.25;
        } else if (newScale < this.opts.minScale) {
          newScale = this.opts.minScale - (this.opts.minScale - newScale) * 0.25;
        }

        // Calculate midpoint motion (2-finger panning during pinch)
        const currentMid = getMidpoint(t1, t2);
        const midDeltaX = currentMid.x - this.pinchMidpoint.x;
        const midDeltaY = currentMid.y - this.pinchMidpoint.y;

        this.currentScale = newScale;
        this.translateX = this.initialPanX + midDeltaX;
        this.translateY = this.initialPanY + midDeltaY;

        this.clampPanCoordinates();
        this.scheduleRender();
        this.updateZoomPill(this.currentScale);
        return;
      }

      // Handle 1-Finger Interactions (Panning or Horizontal Swiping)
      if (touches.length === 1) {
        const touch = touches[0];
        const deltaX = touch.clientX - this.touchStartX;
        const deltaY = touch.clientY - this.touchStartY;
        const moveDeltaX = touch.clientX - this.lastTouchX;
        const moveDeltaY = touch.clientY - this.lastTouchY;

        this.lastTouchX = touch.clientX;
        this.lastTouchY = touch.clientY;

        // A. Panning when zoomed in
        if (this.currentScale > 1.05 && this.targetImg && this.isPanning) {
          e.preventDefault();
          this.translateX += moveDeltaX;
          this.translateY += moveDeltaY;
          this.clampPanCoordinates();
          this.scheduleRender();
          return;
        }

        // B. Horizontal Swipe for Page Turning
        if (this.opts.enableSwipe && this.currentScale <= 1.05) {
          const absX = Math.abs(deltaX);
          const absY = Math.abs(deltaY);

          // Lock direction angle once movement exceeds 8px
          if (!this.swipeLocked && (absX > 8 || absY > 8)) {
            const angle = (Math.atan2(absY, absX) * 180) / Math.PI;
            if (angle <= this.opts.swipeAngleMax && absX > absY) {
              this.isSwiping = true;
              this.swipeLocked = true;
            } else {
              // Vertical dominant scroll: allow default native scroll
              this.isSwiping = false;
              this.swipeLocked = true;
            }
          }

          if (this.isSwiping) {
            // Prevent native horizontal navigation gestures (e.g. iOS back swipe)
            e.preventDefault();
            this.dragDeltaX = deltaX;

            if (this.opts.liveSwipeFeedback) {
              this.applyLiveSwipePreview(deltaX);
            }
          }
        }
      }
    }

    onTouchEnd(e) {
      const remainingTouches = e.touches.length;

      // Pinch zoom released
      if (this.isZooming && remainingTouches < 2) {
        this.isZooming = false;
        if (this.targetImg) {
          this.targetImg.classList.remove('comic-gesture-active');
        }

        // Elastic snap back if under min scale or close to 1.0
        if (this.currentScale < 1.05) {
          this.resetZoom(true);
        } else {
          // Snap inside boundaries
          this.currentScale = clamp(this.currentScale, this.opts.minScale, this.opts.maxScale);
          this.clampPanCoordinates();
          this.animateToTransform(this.currentScale, this.translateX, this.translateY);
          this.targetImg.classList.add('is-zoomed');
        }
      }

      // Single finger drag/swipe released
      if (remainingTouches === 0) {
        const touchEndTime = Date.now();
        const duration = touchEndTime - this.touchStartTime;
        const deltaX = this.lastTouchX - this.touchStartX;
        const deltaY = this.lastTouchY - this.touchStartY;
        const distance = Math.hypot(deltaX, deltaY);
        const velocityX = Math.abs(deltaX) / Math.max(duration, 1);

        if (this.isPanning && this.targetImg) {
          this.isPanning = false;
          this.targetImg.classList.remove('is-dragging');
          this.clampPanCoordinates();
          this.animateToTransform(this.currentScale, this.translateX, this.translateY);
        }

        // Check for double tap
        if (distance < this.opts.doubleTapDistance && duration < 250) {
          const now = Date.now();
          const timeSinceLastTap = now - this.lastTapTime;
          const distFromLastTap = Math.hypot(this.lastTouchX - this.lastTapX, this.lastTouchY - this.lastTapY);

          if (timeSinceLastTap < this.opts.doubleTapDelay && distFromLastTap < this.opts.doubleTapDistance) {
            // Double-Tap Triggered!
            if (this.tapTimeout) clearTimeout(this.tapTimeout);
            this.handleDoubleTap(this.lastTouchX, this.lastTouchY, e);
            this.lastTapTime = 0;
            this.resetSwipePreview();
            return;
          } else {
            this.lastTapTime = now;
            this.lastTapX = this.lastTouchX;
            this.lastTapY = this.lastTouchY;
          }
        }

        // Complete Swipe Page Turn
        if (this.isSwiping && this.currentScale <= 1.05) {
          const isFlick = velocityX > this.opts.swipeVelocityThreshold && Math.abs(deltaX) > 20;
          const isFarSwipe = Math.abs(deltaX) > this.opts.swipeThreshold;

          if (isFarSwipe || isFlick) {
            if (deltaX < 0) {
              this.turnPage(1, 'swipe_left');
            } else {
              this.turnPage(-1, 'swipe_right');
            }
          }
          this.resetSwipePreview();
        }

        this.isSwiping = false;
        this.swipeLocked = false;
        this.activeTouches.clear();
      }
    }

    onTouchCancel() {
      this.isSwiping = false;
      this.isZooming = false;
      this.isPanning = false;
      this.swipeLocked = false;
      this.resetSwipePreview();
      if (this.currentScale < 1.05) {
        this.resetZoom(true);
      }
      this.activeTouches.clear();
    }

    // --- Double-Tap Handler (HUD Toggle & Smart Zoom) ---

    handleDoubleTap(clientX, clientY, originalEvent) {
      if (!this.opts.enableDoubleTap) return;

      // Smart zoom reset if already zoomed in
      if (this.opts.smartDoubleTapZoom && this.currentScale > 1.1) {
        this.resetZoom(true);
        this.showToast('🔍 Panel Zoom Reset (1.0x)', '✦', 1400);
        this.dispatchEvent('comic:zoomreset', { scale: 1.0 });
        if (typeof this.opts.onZoomReset === 'function') {
          this.opts.onZoomReset();
        }
        return;
      }

      // If at 1.0x, toggle Reader HUD
      this.toggleHUD();
      this.dispatchEvent('comic:doubletap', { clientX, clientY, isHudHidden: this.isHudHidden });
      if (typeof this.opts.onDoubleTap === 'function') {
        this.opts.onDoubleTap({ clientX, clientY, isHudHidden: this.isHudHidden });
      }
    }

    toggleHUD(forceState) {
      if (typeof document === 'undefined') return;

      if (typeof forceState === 'boolean') {
        this.isHudHidden = !forceState;
      } else {
        this.isHudHidden = !this.isHudHidden;
      }

      if (this.isHudHidden) {
        document.body.classList.add('comic-hud-hidden');
        if (this.opts.showHudToast) {
          this.showToast('⚡ Reader HUD Hidden — Double-tap anywhere to restore', '🕶️', 2000);
        }
      } else {
        document.body.classList.remove('comic-hud-hidden');
        if (this.opts.showHudToast) {
          this.showToast('📖 Reader HUD Visible', '👑', 1600);
        }
      }

      this.dispatchEvent('comic:hudtoggle', { isHudHidden: this.isHudHidden, visible: !this.isHudHidden });
      if (typeof this.opts.onHudToggle === 'function') {
        this.opts.onHudToggle(!this.isHudHidden);
      }
    }

    // --- Page Turning Logic ---

    turnPage(direction, triggerReason = 'swipe') {
      let handled = false;

      // 1. Check custom callbacks
      if (direction > 0 && typeof this.opts.onPageNext === 'function') {
        this.opts.onPageNext();
        handled = true;
      } else if (direction < 0 && typeof this.opts.onPagePrev === 'function') {
        this.opts.onPagePrev();
        handled = true;
      }

      if (typeof this.opts.onPageChange === 'function') {
        this.opts.onPageChange(direction);
      }

      // 2. Integration with reader globals in existing comic pages
      if (!handled && typeof window !== 'undefined') {
        if (typeof window.changePage === 'function') {
          window.changePage(direction);
          handled = true;
        } else if (typeof window.setPage === 'function' && typeof window.currentPageIdx === 'number') {
          window.setPage(window.currentPageIdx + direction);
          handled = true;
        } else if (typeof window.goToPage === 'function' && typeof window.currentPageIdx === 'number') {
          window.goToPage(window.currentPageIdx + direction);
          handled = true;
        }
      }

      // 3. Fallback: simulate clicking navigation buttons
      if (!handled && typeof document !== 'undefined') {
        if (direction > 0) {
          const nextBtn = document.getElementById('btn-next') || document.getElementById('btnNextPage') || document.querySelector('.btn-next');
          if (nextBtn && !nextBtn.disabled) {
            nextBtn.click();
            handled = true;
          }
        } else {
          const prevBtn = document.getElementById('btn-prev') || document.getElementById('btnPrevPage') || document.querySelector('.btn-prev');
          if (prevBtn && !prevBtn.disabled) {
            prevBtn.click();
            handled = true;
          }
        }
      }

      // Reset any active zoom on page turn
      this.resetZoom(false);

      // Dispatch custom DOM events
      this.dispatchEvent(direction > 0 ? 'comic:nextpage' : 'comic:prevpage', { direction, triggerReason });
      this.dispatchEvent('comic:pagechange', { direction, triggerReason });
    }

    // --- Live Swipe Drag Preview ---

    applyLiveSwipePreview(deltaX) {
      const activePage = this.getActiveVisiblePage();
      if (!activePage) return;

      activePage.classList.add('comic-swipe-layer');
      activePage.classList.remove('is-animating');
      const dampenedX = deltaX * this.opts.swipeResistance;
      activePage.style.transform = `translate3d(${dampenedX}px, 0, 0)`;
    }

    resetSwipePreview() {
      const pages = this.container ? this.container.querySelectorAll(this.opts.pageSelector) : [];
      pages.forEach((p) => {
        if (p.classList.contains('comic-swipe-layer')) {
          p.classList.add('is-animating');
          p.style.transform = 'translate3d(0, 0, 0)';
          setTimeout(() => {
            p.classList.remove('comic-swipe-layer', 'is-animating');
            p.style.transform = '';
          }, 260);
        }
      });
    }

    // --- Pinch-to-Zoom & Pan Helpers ---

    clampPanCoordinates() {
      if (!this.targetImg) return;
      const containerRect = (this.imgContainer || this.targetImg.parentElement || this.container).getBoundingClientRect();
      const imgWidth = this.targetImg.offsetWidth || containerRect.width;
      const imgHeight = this.targetImg.offsetHeight || containerRect.height;

      const scaledWidth = imgWidth * this.currentScale;
      const scaledHeight = imgHeight * this.currentScale;

      // Allow panning when scaled dimension exceeds container dimension
      const maxPanX = Math.max(0, (scaledWidth - containerRect.width) / 2) + this.opts.panBoundsPadding;
      const minPanX = -maxPanX;

      const maxPanY = Math.max(0, (scaledHeight - containerRect.height) / 2) + this.opts.panBoundsPadding;
      const minPanY = -maxPanY;

      this.translateX = clamp(this.translateX, minPanX, maxPanX);
      this.translateY = clamp(this.translateY, minPanY, maxPanY);
    }

    scheduleRender() {
      if (this.rafId) return;
      this.rafId = requestAnimationFrame(() => {
        this.renderTransform();
        this.rafId = null;
      });
    }

    renderTransform() {
      if (!this.targetImg) return;
      const transform = `translate3d(${this.translateX}px, ${this.translateY}px, 0) scale(${this.currentScale})`;
      this.targetImg.style.transform = transform;

      if (this.currentScale > 1.05) {
        this.targetImg.classList.add('is-zoomed');
      } else {
        this.targetImg.classList.remove('is-zoomed');
      }

      this.dispatchEvent('comic:zoom', {
        scale: this.currentScale,
        x: this.translateX,
        y: this.translateY
      });

      if (typeof this.opts.onZoomChange === 'function') {
        this.opts.onZoomChange(this.currentScale, this.translateX, this.translateY);
      }
    }

    animateToTransform(scale, x, y, duration = this.opts.zoomSnapBackDuration) {
      if (!this.targetImg) return;
      this.currentScale = scale;
      this.translateX = x;
      this.translateY = y;

      this.targetImg.classList.add('is-animating');
      this.renderTransform();
      this.updateZoomPill(this.currentScale);

      setTimeout(() => {
        if (this.targetImg) {
          this.targetImg.classList.remove('is-animating');
          if (this.currentScale <= 1.0) {
            this.targetImg.style.transform = '';
            this.targetImg.classList.remove('is-zoomed');
          }
        }
      }, duration);
    }

    resetZoom(animate = true) {
      if (!this.targetImg && this.container) {
        this.targetImg = this.getActiveVisibleImage();
      }

      if (this.targetImg) {
        if (animate) {
          this.animateToTransform(1.0, 0, 0);
        } else {
          this.currentScale = 1.0;
          this.translateX = 0;
          this.translateY = 0;
          this.targetImg.style.transform = '';
          this.targetImg.classList.remove('is-zoomed', 'is-animating');
        }
      }

      this.currentScale = 1.0;
      this.translateX = 0;
      this.translateY = 0;
      this.updateZoomPill(1.0);
    }

    setZoom(scale, x = 0, y = 0, animate = true) {
      if (!this.targetImg) {
        this.targetImg = this.getActiveVisibleImage();
      }
      if (!this.targetImg) return;

      const clampedScale = clamp(scale, this.opts.minScale, this.opts.maxScale);
      if (animate) {
        this.animateToTransform(clampedScale, x, y);
      } else {
        this.currentScale = clampedScale;
        this.translateX = x;
        this.translateY = y;
        this.renderTransform();
        this.updateZoomPill(this.currentScale);
      }
    }

    getActiveVisibleImage() {
      if (!this.container) return null;
      // Search for visible page wrapper image
      const visibleWrapper = Array.from(this.container.querySelectorAll(this.opts.pageSelector)).find((el) => {
        return el.style.display !== 'none' && el.offsetHeight > 0;
      });
      if (visibleWrapper) {
        const img = visibleWrapper.querySelector(this.opts.imageSelector);
        if (img) return img;
      }
      return this.container.querySelector(this.opts.imageSelector);
    }

    getActiveVisiblePage() {
      if (!this.container) return null;
      return Array.from(this.container.querySelectorAll(this.opts.pageSelector)).find((el) => {
        return el.style.display !== 'none' && el.offsetHeight > 0;
      }) || this.container.querySelector(this.opts.pageSelector);
    }

    // --- Keyboard Shortcuts Helper ---

    onKeyDown(e) {
      // Don't intercept if user is typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
        return;
      }

      switch (e.key) {
        case 'h':
        case 'H':
          e.preventDefault();
          this.toggleHUD();
          break;
        case 'z':
        case 'Z':
          e.preventDefault();
          if (this.currentScale > 1.05) {
            this.resetZoom(true);
          } else {
            this.setZoom(2.2, 0, 0, true);
          }
          break;
        case '0':
          e.preventDefault();
          this.resetZoom(true);
          break;
      }
    }

    // --- Custom Event Dispatcher ---

    dispatchEvent(name, detail = {}) {
      if (typeof window === 'undefined') return;
      const evt = new CustomEvent(name, {
        bubbles: true,
        cancelable: true,
        detail: Object.assign({}, detail, { engine: this })
      });
      (this.container || window).dispatchEvent(evt);
    }

    // --- Public Lifecycle Methods ---

    refresh() {
      this.setupZoomableTargets();
    }

    destroy() {
      this.unbindEvents();
      if (this.toastEl && this.toastEl.parentNode) {
        this.toastEl.parentNode.removeChild(this.toastEl);
      }
      if (this.zoomPillEl && this.zoomPillEl.parentNode) {
        this.zoomPillEl.parentNode.removeChild(this.zoomPillEl);
      }
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
      }
      if (this.toastTimer) {
        clearTimeout(this.toastTimer);
      }
    }
  }

  // --- Static Helper & Auto-Init ---
  let defaultInstance = null;

  const ComicGestures = {
    init: function (options) {
      return new ComicGesturesEngine(options);
    },
    autoInit: function () {
      if (typeof window === 'undefined' || typeof document === 'undefined') return null;
      if (defaultInstance) return defaultInstance;

      const stage = (
        document.getElementById('comic-stage-container') ||
        document.querySelector('.comic-stage') ||
        document.querySelector('.comic-wrap') ||
        document.getElementById('singlePageView') ||
        document.body
      );

      if (stage) {
        defaultInstance = new ComicGesturesEngine({ container: stage });
        window.comicGesturesInstance = defaultInstance;
      }
      return defaultInstance;
    },
    getInstance: function () {
      return defaultInstance;
    },
    Engine: ComicGesturesEngine
  };

  // Automatically auto-init when DOM is loaded if in browser
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        // Auto initialize if not already manually configured
        if (!defaultInstance && !window.comicGesturesInstance) {
          ComicGestures.autoInit();
        }
      });
    } else {
      setTimeout(() => {
        if (!defaultInstance && !window.comicGesturesInstance) {
          ComicGestures.autoInit();
        }
      }, 0);
    }
  }

  return ComicGestures;
});
