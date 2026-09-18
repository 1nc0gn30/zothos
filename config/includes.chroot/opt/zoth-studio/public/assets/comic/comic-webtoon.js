/**
 * AZOTH: The Zero-Leakage Saga — Continuous Vertical Webtoon Scroll Engine
 * Features:
 *  - Smooth, continuous vertical webtoon scroll mode with customizable gaps & width presets
 *  - Scroll-linked panel illumination (Center reading zone focal tracking & ambient neon aura)
 *  - Auto-advancing audio narration (Two-way sync: scroll-to-audio & audio-end auto-advance)
 *  - Reading progress indicators (Sticky top nano bar, vertical mini-map rail, time remaining)
 *  - Auto-scroll engine with adjustable speed presets and smart pause/resume on interaction
 *  - Keyboard shortcuts, touch gesture handling, and accessibility compliance
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ComicWebtoon = factory();
    root.ComicWebtoonViewer = root.ComicWebtoon.ComicWebtoonViewer;
    root.createComicWebtoon = root.ComicWebtoon.createComicWebtoon;
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /* ==========================================================================
     Utility Helpers & Math Core
     ========================================================================== */

  function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }

  function formatTime(seconds) {
    if (isNaN(seconds) || seconds === Infinity || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  function calculateReadingTimeRemaining(currentIdx, totalPanels, secsPerPanel = 25) {
    if (totalPanels <= 0) return '0 min';
    const remainingPanels = Math.max(0, totalPanels - (currentIdx + 1));
    if (remainingPanels === 0) return '0 min';
    const totalSecs = remainingPanels * secsPerPanel;
    if (totalSecs < 60) return '< 1 min left';
    const mins = Math.ceil(totalSecs / 60);
    return `~${mins} min left`;
  }

  function calculateScrollProgress(scrollY, maxScroll) {
    if (maxScroll <= 0) return 0;
    return clamp(scrollY / maxScroll, 0, 1);
  }

  function calculatePanelFocalScore(panelTop, panelHeight, viewportHeight) {
    if (viewportHeight <= 0 || panelHeight <= 0) return 0;
    const panelCenter = panelTop + panelHeight / 2;
    const viewportCenter = viewportHeight / 2;
    const distFromCenter = Math.abs(panelCenter - viewportCenter);
    const maxDist = (viewportHeight + panelHeight) / 2;
    const score = 1 - (distFromCenter / maxDist);
    return clamp(score, 0, 1);
  }

  /* ==========================================================================
     ComicWebtoonViewer Class
     ========================================================================== */

  class ComicWebtoonViewer {
    constructor(options = {}) {
      this.options = Object.assign({
        container: null,
        panels: null, // Array of { id, img, audio, title, caption, sigil, accentColor } or null (auto-detect)
        mode: 'webtoon', // 'webtoon' | 'page'
        panelGap: 'relaxed', // 'none' | 'compact' | 'relaxed' | 'cinematic'
        containerWidth: 'standard', // 'compact' | 'standard' | 'wide' | 'full'
        illumination: true,
        autoAdvanceAudio: true,
        syncAudioOnScroll: true,
        autoScrollSpeed: 1.0, // 0.5x, 1.0x, 1.5x, 2.0x, 3.0x
        autoScrollBasePxPerSec: 65,
        readingSecsPerPanel: 25,
        enableMiniMap: true,
        enableTopProgress: true,
        enableAudioDock: true,
        enableKeyboardShortcuts: true,
        enableTouchGestures: true,
        onPanelChange: null,
        onProgressChange: null,
        onModeChange: null,
        onAudioStateChange: null
      }, options);

      this.container = typeof this.options.container === 'string'
        ? (typeof document !== 'undefined' ? document.querySelector(this.options.container) : null)
        : this.options.container;

      this.panels = [];
      this.currentPanelIdx = 0;
      this.mode = this.options.mode;
      this.panelGap = this.options.panelGap;
      this.containerWidth = this.options.containerWidth;
      this.isAutoScrolling = false;
      this.isAutoScrollPaused = false;
      this.autoScrollRAF = null;
      this.autoScrollLastTime = 0;
      this.autoScrollResumeTimer = null;
      this.audioPlayer = null;
      this.isPlayingAudio = false;
      this.audioSyncDebounceTimer = null;
      this.isDestroyed = false;
      this.listeners = {};
      this.intersectionObserver = null;

      // Event emitter store
      this._eventHandlers = {};

      this.discoverPanels();
      if (typeof document !== 'undefined') {
        this.init();
      }
    }

    /* Event Bus */
    on(event, handler) {
      if (!this._eventHandlers[event]) this._eventHandlers[event] = [];
      this._eventHandlers[event].push(handler);
      return this;
    }

    off(event, handler) {
      if (!this._eventHandlers[event]) return this;
      this._eventHandlers[event] = this._eventHandlers[event].filter(h => h !== handler);
      return this;
    }

    emit(event, data) {
      if (this._eventHandlers[event]) {
        this._eventHandlers[event].forEach(handler => {
          try { handler(data); } catch (e) { console.error(`[ComicWebtoon] Event error (${event}):`, e); }
        });
      }
      // Call direct callback if exists
      if (event === 'panelchange' && typeof this.options.onPanelChange === 'function') this.options.onPanelChange(data);
      if (event === 'progress' && typeof this.options.onProgressChange === 'function') this.options.onProgressChange(data);
      if (event === 'modechange' && typeof this.options.onModeChange === 'function') this.options.onModeChange(data);
      if (event === 'audiostate' && typeof this.options.onAudioStateChange === 'function') this.options.onAudioStateChange(data);
    }

    /* Initialization */
    init() {
      if (!this.container && typeof document !== 'undefined') {
        this.container = document.getElementById('comic-stage-container') ||
                         document.querySelector('.comic-stage') ||
                         document.querySelector('.comic-container') ||
                         document.body;
      }

      this.discoverPanels();
      this.setupDOM();
      this.setupAudio();
      this.setupIntersectionObserver();
      this.bindEvents();

      this.setMode(this.mode);
      this.updatePanelIllumination();
      this.updateProgressIndicators();
      this.emit('init', { panelsCount: this.panels.length, mode: this.mode });
    }

    /* Discover or initialize comic panels */
    discoverPanels() {
      if (Array.isArray(this.options.panels) && this.options.panels.length > 0) {
        this.panels = this.options.panels.map((p, idx) => ({
          index: idx,
          id: p.id !== undefined ? p.id : `webtoon-panel-${idx}`,
          img: p.img || p.src || '',
          audio: p.audio || '',
          title: p.title || `Page ${idx + 1}`,
          caption: p.caption || '',
          sigil: p.sigil || this._getDefaultSigil(idx),
          accentColor: p.accentColor || this._getDefaultAccent(idx),
          el: p.el || null
        }));
        return;
      }

      // Auto-extract from DOM elements
      if (!this.container || typeof document === 'undefined') return;

      const rawPanels = this.container.querySelectorAll('.comic-page-wrapper, .panel-card, .webtoon-panel, .comic-webtoon-panel');
      if (rawPanels.length > 0) {
        this.panels = Array.from(rawPanels).map((el, idx) => {
          const imgEl = el.querySelector('img.comic-page-img, img.panel-img, img');
          const titleEl = el.querySelector('.comic-page-num, .panel-tag, .panel-title');
          const captionEl = el.querySelector('.comic-page-caption, .panel-script, p');
          const pageAttr = el.getAttribute('data-page');
          const audioAttr = el.getAttribute('data-audio') || (imgEl ? imgEl.getAttribute('data-audio') : '');

          return {
            index: idx,
            id: el.id || `webtoon-panel-${idx}`,
            img: imgEl ? (imgEl.getAttribute('src') || '') : '',
            audio: audioAttr || '',
            title: titleEl ? titleEl.textContent.trim() : `Page ${idx + 1}`,
            caption: captionEl ? captionEl.textContent.trim() : '',
            sigil: el.getAttribute('data-sigil') || this._getDefaultSigil(idx),
            accentColor: el.getAttribute('data-accent') || this._getDefaultAccent(idx),
            el: el
          };
        });
      }
    }

    _getDefaultSigil(idx) {
      const sigils = ['☿', '🜂', '🜍', '🜔', '🜛', '🜚', '☉', '☽', '🜁', '🜄'];
      return sigils[idx % sigils.length];
    }

    _getDefaultAccent(idx) {
      const accents = ['cyan', 'gold', 'purple', 'emerald', 'rose'];
      return accents[idx % accents.length];
    }

    /* Build & Mount DOM Elements */
    setupDOM() {
      if (typeof document === 'undefined') return;

      // 1. Top Reading Progress Bar
      if (this.options.enableTopProgress && !document.querySelector('.webtoon-progress-track')) {
        this.progressTrack = document.createElement('div');
        this.progressTrack.className = 'webtoon-progress-track';
        this.progressTrack.setAttribute('aria-hidden', 'true');

        this.progressBar = document.createElement('div');
        this.progressBar.className = 'webtoon-progress-bar css-scroll-driven';
        this.progressTrack.appendChild(this.progressBar);
        document.body.prepend(this.progressTrack);

        // Accessible Progress Live Region
        this.progressA11y = document.createElement('div');
        this.progressA11y.className = 'sr-only';
        this.progressA11y.setAttribute('role', 'progressbar');
        this.progressA11y.setAttribute('aria-label', 'Reading progress');
        this.progressA11y.setAttribute('aria-valuemin', '0');
        this.progressA11y.setAttribute('aria-valuemax', '100');
        this.progressA11y.setAttribute('aria-valuenow', '0');
        document.body.appendChild(this.progressA11y);
      } else {
        this.progressBar = document.querySelector('.webtoon-progress-bar');
      }

      // 2. Top Header Pill
      if (!document.querySelector('.webtoon-header-pill')) {
        this.headerPill = document.createElement('div');
        this.headerPill.className = 'webtoon-header-pill';
        this.headerPill.innerHTML = `
          <span class="webtoon-pill-sigil">☿</span>
          <span class="webtoon-pill-title">AZOTH Webtoon Reader</span>
          <span class="webtoon-pill-counter">P.1 / ${this.panels.length}</span>
          <span class="webtoon-pill-remaining">~3 min left</span>
        `;
        document.body.appendChild(this.headerPill);
      } else {
        this.headerPill = document.querySelector('.webtoon-header-pill');
      }

      // 3. Container & Stream Wrapper Setup
      if (this.container) {
        this.container.classList.add('comic-webtoon-container');
        this.container.classList.add(`width-${this.containerWidth}`);
        this.container.classList.add('comic-webtoon-stream');
        this.container.classList.add(`gap-${this.panelGap}`);

        // Enhance panel elements
        this.panels.forEach((p, idx) => {
          if (p.el) {
            p.el.classList.add('comic-webtoon-panel');
            p.el.classList.add(`${p.accentColor}-glow`);

            // Ambient background glow element
            if (!p.el.querySelector('.webtoon-panel-ambient-aura')) {
              const aura = document.createElement('div');
              aura.className = 'webtoon-panel-ambient-aura';
              p.el.prepend(aura);
            }

            // Quick Narration overlay pin
            if (!p.el.querySelector('.webtoon-panel-overlay')) {
              const overlay = document.createElement('div');
              overlay.className = 'webtoon-panel-overlay';
              overlay.innerHTML = `
                <span class="webtoon-overlay-badge">${p.sigil} P.0${idx + 1}</span>
                <button type="button" class="btn-webtoon-narrate-pin" data-panel-idx="${idx}" aria-label="Listen to narration for ${p.title}">
                  🔊 Listen
                </button>
              `;
              p.el.appendChild(overlay);

              overlay.querySelector('.btn-webtoon-narrate-pin').addEventListener('click', (e) => {
                e.stopPropagation();
                this.playNarration(idx);
              });
            }
          }
        });
      }

      // 4. Vertical Mini-Map Side Rail
      if (this.options.enableMiniMap && !document.querySelector('.webtoon-minimap-rail')) {
        this.minimapRail = document.createElement('nav');
        this.minimapRail.className = 'webtoon-minimap-rail';
        this.minimapRail.setAttribute('aria-label', 'Webtoon Chapter Mini-Map');

        let pinsHtml = '';
        this.panels.forEach((p, idx) => {
          pinsHtml += `
            <button type="button" class="webtoon-minimap-pin ${idx === 0 ? 'is-active' : ''}" data-idx="${idx}" aria-label="Jump to ${p.title}">
              <span>${p.sigil}</span>
              <div class="webtoon-minimap-tooltip">
                <strong>${p.title}</strong>
                <small>${p.sigil} Panel 0${idx + 1}</small>
              </div>
            </button>
          `;
        });

        this.minimapRail.innerHTML = `
          <div class="webtoon-minimap-laser-track">
            <div class="webtoon-minimap-laser-indicator"></div>
          </div>
          ${pinsHtml}
        `;

        document.body.appendChild(this.minimapRail);

        this.minimapRail.querySelectorAll('.webtoon-minimap-pin').forEach(pin => {
          pin.addEventListener('click', () => {
            const idx = parseInt(pin.getAttribute('data-idx'), 10);
            this.scrollToPanel(idx, true);
          });
        });
      } else {
        this.minimapRail = document.querySelector('.webtoon-minimap-rail');
      }

      // 5. Floating Audio Narration Dock
      if (this.options.enableAudioDock && !document.querySelector('.webtoon-audio-dock')) {
        this.audioDock = document.createElement('section');
        this.audioDock.className = 'webtoon-audio-dock';
        this.audioDock.setAttribute('aria-label', 'Webtoon Audio Narration Controller');

        this.audioDock.innerHTML = `
          <div class="webtoon-dock-main-row">
            <div class="webtoon-dock-left">
              <button type="button" class="btn-webtoon-master-play" id="btnWebtoonMasterPlay" aria-label="Play Narration">
                <span class="webtoon-play-icon">▶</span>
              </button>
              <div class="webtoon-dock-meta">
                <div class="webtoon-dock-track-title" id="webtoonDockTrackTitle">
                  ${this.panels[0] ? this.panels[0].title : 'AZOTH Audio Narration'}
                </div>
                <div class="webtoon-dock-speaker-meta">
                  <span>🎙️ Morgan Freeman Voice</span>
                  <div class="webtoon-audio-waveform-pulse" aria-hidden="true">
                    <span class="webtoon-waveform-bar"></span>
                    <span class="webtoon-waveform-bar"></span>
                    <span class="webtoon-waveform-bar"></span>
                    <span class="webtoon-waveform-bar"></span>
                  </div>
                </div>
              </div>
            </div>
            <div class="webtoon-dock-btn-group">
              <button type="button" class="btn-webtoon-dock-action" id="btnToggleAutoScroll" title="Toggle continuous auto-scrolling (A)">
                📜 Auto-Scroll
              </button>
              <button type="button" class="btn-webtoon-dock-action" id="btnToggleMode" title="Switch Reading Mode (W)">
                📖 Mode: Webtoon
              </button>
            </div>
          </div>

          <div class="webtoon-dock-scrub-row">
            <input type="range" class="webtoon-scrub-slider" id="webtoonAudioScrubber" min="0" max="100" value="0" aria-label="Audio scrubber" />
            <span class="webtoon-dock-time-text" id="webtoonAudioTimeText">0:00 / 0:00</span>
          </div>

          <div class="webtoon-dock-controls-row">
            <label class="webtoon-toggle-label">
              <input type="checkbox" class="webtoon-toggle-checkbox" id="webtoonAutoAdvanceCheckbox" ${this.options.autoAdvanceAudio ? 'checked' : ''} />
              <span>Auto-advance on audio end</span>
            </label>
            <label class="webtoon-toggle-label">
              <input type="checkbox" class="webtoon-toggle-checkbox" id="webtoonSyncScrollCheckbox" ${this.options.syncAudioOnScroll ? 'checked' : ''} />
              <span>Sync voice on scroll</span>
            </label>
            <div class="webtoon-dock-btn-group">
              <button type="button" class="btn-webtoon-dock-action" id="btnSpeed05">0.5x</button>
              <button type="button" class="btn-webtoon-dock-action is-active" id="btnSpeed10">1.0x</button>
              <button type="button" class="btn-webtoon-dock-action" id="btnSpeed15">1.5x</button>
            </div>
          </div>
        `;

        document.body.appendChild(this.audioDock);
        this.bindAudioDockEvents();
      } else {
        this.audioDock = document.querySelector('.webtoon-audio-dock');
      }

      // 6. Auto-Scroll Floating Badge
      if (!document.querySelector('.webtoon-autoscroll-badge')) {
        this.autoScrollBadge = document.createElement('div');
        this.autoScrollBadge.className = 'webtoon-autoscroll-badge';
        this.autoScrollBadge.style.display = 'none';
        this.autoScrollBadge.innerHTML = `
          <span class="autoscroll-pulse-dot"></span>
          <span class="autoscroll-text-status">AUTO-SCROLLING 1.0x</span>
        `;
        document.body.appendChild(this.autoScrollBadge);
      } else {
        this.autoScrollBadge = document.querySelector('.webtoon-autoscroll-badge');
      }
    }

    /* Audio Player Setup */
    setupAudio() {
      if (typeof Audio === 'undefined') return;

      this.audioPlayer = new Audio();
      this.audioPlayer.preload = 'metadata';

      this.audioPlayer.addEventListener('timeupdate', () => {
        if (!this.audioPlayer.duration) return;
        const current = this.audioPlayer.currentTime;
        const duration = this.audioPlayer.duration;
        const pct = (current / duration) * 100;

        const scrub = document.getElementById('webtoonAudioScrubber');
        if (scrub && !this._isUserScrubbingAudio) {
          scrub.value = pct;
        }

        const timeText = document.getElementById('webtoonAudioTimeText');
        if (timeText) {
          timeText.textContent = `${formatTime(current)} / ${formatTime(duration)}`;
        }
      });

      this.audioPlayer.addEventListener('ended', () => {
        this.emit('audioended', { panelIndex: this.currentPanelIdx });

        // Auto-advance logic
        const autoAdvanceEl = document.getElementById('webtoonAutoAdvanceCheckbox');
        const shouldAdvance = autoAdvanceEl ? autoAdvanceEl.checked : this.options.autoAdvanceAudio;

        if (shouldAdvance && this.currentPanelIdx < this.panels.length - 1) {
          const nextIdx = this.currentPanelIdx + 1;
          this.scrollToPanel(nextIdx, true);
          this.playNarration(nextIdx);
        } else {
          this.pauseNarration();
        }
      });

      this.audioPlayer.addEventListener('play', () => {
        this.isPlayingAudio = true;
        this.updateAudioControlsUI(true);
        this.emit('audiostate', { playing: true, panelIndex: this.currentPanelIdx });
      });

      this.audioPlayer.addEventListener('pause', () => {
        this.isPlayingAudio = false;
        this.updateAudioControlsUI(false);
        this.emit('audiostate', { playing: false, panelIndex: this.currentPanelIdx });
      });
    }

    /* Intersection Observer for Illumination */
    setupIntersectionObserver() {
      if (typeof IntersectionObserver === 'undefined') return;

      const thresholds = [0.0, 0.15, 0.35, 0.5, 0.65, 0.85, 1.0];
      this.intersectionObserver = new IntersectionObserver((entries) => {
        if (this.isDestroyed) return;
        this.updatePanelIllumination();
      }, {
        root: null,
        rootMargin: '-10% 0px -10% 0px',
        threshold: thresholds
      });

      this.panels.forEach(p => {
        if (p.el) this.intersectionObserver.observe(p.el);
      });
    }

    /* Update Panel Illumination based on scroll focal zone */
    updatePanelIllumination() {
      if (typeof window === 'undefined' || !this.options.illumination) return;

      const viewportHeight = window.innerHeight || 800;
      let highestScore = -1;
      let focalIdx = this.currentPanelIdx;

      this.panels.forEach((p, idx) => {
        if (!p.el) return;
        const rect = p.el.getBoundingClientRect();
        const score = calculatePanelFocalScore(rect.top, rect.height, viewportHeight);

        if (score > highestScore && rect.bottom > 0 && rect.top < viewportHeight) {
          highestScore = score;
          focalIdx = idx;
        }

        // Apply smooth illumination styles
        const isIlluminated = score > 0.45;
        p.el.classList.toggle('is-illuminated', isIlluminated);
        p.el.style.setProperty('--webtoon-illumination-intensity', score.toFixed(2));
      });

      if (focalIdx !== this.currentPanelIdx) {
        this.setActivePanel(focalIdx, false);
      }
    }

    /* Set Active Panel */
    setActivePanel(idx, doScroll = false) {
      if (idx < 0 || idx >= this.panels.length) return;
      const prevIdx = this.currentPanelIdx;
      this.currentPanelIdx = idx;

      this.panels.forEach((p, i) => {
        if (p.el) {
          p.el.classList.toggle('is-active-panel', i === idx);
        }
      });

      this.updateProgressIndicators();
      this.updateMiniMapState(idx);

      // Scroll-driven voice sync
      if (typeof document !== 'undefined') {
        const syncEl = document.getElementById('webtoonSyncScrollCheckbox');
        const shouldSync = syncEl ? syncEl.checked : this.options.syncAudioOnScroll;

        if (shouldSync && this.isPlayingAudio && prevIdx !== idx) {
          clearTimeout(this.audioSyncDebounceTimer);
          this.audioSyncDebounceTimer = setTimeout(() => {
            this.playNarration(idx);
          }, 300);
        }
      }

      this.emit('panelchange', {
        panelIndex: idx,
        panel: this.panels[idx],
        totalPanels: this.panels.length,
        previousIndex: prevIdx
      });

      if (doScroll) {
        this.scrollToPanel(idx, true);
      }
    }

    /* Scroll smoothly to specified panel */
    scrollToPanel(idx, smooth = true) {
      if (idx < 0 || idx >= this.panels.length) return;
      const targetPanel = this.panels[idx];
      if (!targetPanel || !targetPanel.el || typeof window === 'undefined') return;

      const rect = targetPanel.el.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 800;
      const targetTop = window.scrollY + rect.top - (viewportHeight / 2) + (rect.height / 2);

      window.scrollTo({
        top: Math.max(0, targetTop),
        behavior: smooth ? 'smooth' : 'auto'
      });
    }

    /* Update Top Progress Bar, Header Pill and A11y */
    updateProgressIndicators() {
      if (typeof window === 'undefined' || typeof document === 'undefined') return;

      const scrollY = window.scrollY || window.pageYOffset || 0;
      const docHeight = document.documentElement.scrollHeight - (window.innerHeight || 800);
      const progress = calculateScrollProgress(scrollY, docHeight);
      const pct = Math.round(progress * 100);

      // Fallback for browsers without CSS scroll-timeline
      if (this.progressBar) {
        this.progressBar.style.transform = `scaleX(${progress})`;
      }

      if (this.progressA11y) {
        this.progressA11y.setAttribute('aria-valuenow', pct.toString());
      }

      // Top Header Pill
      if (this.headerPill) {
        const activePanel = this.panels[this.currentPanelIdx] || { sigil: '☿', title: 'AZOTH' };
        this.headerPill.classList.toggle('is-visible', scrollY > 150);

        const sigilEl = this.headerPill.querySelector('.webtoon-pill-sigil');
        const titleEl = this.headerPill.querySelector('.webtoon-pill-title');
        const counterEl = this.headerPill.querySelector('.webtoon-pill-counter');
        const remainingEl = this.headerPill.querySelector('.webtoon-pill-remaining');

        if (sigilEl) sigilEl.textContent = activePanel.sigil;
        if (titleEl) titleEl.textContent = activePanel.title;
        if (counterEl) counterEl.textContent = `P.${this.currentPanelIdx + 1} / ${this.panels.length} · ${pct}%`;
        if (remainingEl) remainingEl.textContent = calculateReadingTimeRemaining(this.currentPanelIdx, this.panels.length, this.options.readingSecsPerPanel);
      }

      this.emit('progress', {
        percent: pct,
        progress: progress,
        scrollY: scrollY,
        currentPanelIdx: this.currentPanelIdx,
        totalPanels: this.panels.length
      });
    }

    /* Update MiniMap Active Pin & Laser */
    updateMiniMapState(idx) {
      if (!this.minimapRail) return;
      const pins = this.minimapRail.querySelectorAll('.webtoon-minimap-pin');
      pins.forEach((pin, i) => {
        pin.classList.toggle('is-active', i === idx);
      });

      const laser = this.minimapRail.querySelector('.webtoon-minimap-laser-indicator');
      const activePin = pins[idx];
      if (laser && activePin) {
        laser.style.top = `${activePin.offsetTop + 4}px`;
      }
    }

    /* Audio Playback Methods */
    playNarration(idx = this.currentPanelIdx) {
      if (idx < 0 || idx >= this.panels.length) return;
      const track = this.panels[idx];
      if (!track) return;

      if (this.currentPanelIdx !== idx) {
        this.setActivePanel(idx, false);
      }

      if (this.audioPlayer && track.audio) {
        // If already playing this track, resume
        if (this.audioPlayer.src && this.audioPlayer.src.includes(track.audio) && this.audioPlayer.currentTime > 0 && this.audioPlayer.paused) {
          this.audioPlayer.play().catch(e => console.warn('[ComicWebtoon] Audio play failed:', e));
          return;
        }

        this.audioPlayer.src = track.audio;
        this.audioPlayer.currentTime = 0;
        this.audioPlayer.play().then(() => {
          this.isPlayingAudio = true;
          this.updateAudioControlsUI(true);
        }).catch(err => {
          console.warn('[ComicWebtoon] Autoplay prevented:', err);
        });
      } else {
        this.isPlayingAudio = true;
        this.updateAudioControlsUI(true);
      }

      // Update Track Title in Dock
      if (typeof document !== 'undefined') {
        const titleEl = document.getElementById('webtoonDockTrackTitle');
        if (titleEl) titleEl.textContent = `${track.sigil} ${track.title}`;
      }

      this.emit('audioplay', { panelIndex: idx, track });
    }

    pauseNarration() {
      if (this.audioPlayer) {
        this.audioPlayer.pause();
      }
      this.isPlayingAudio = false;
      this.updateAudioControlsUI(false);
      this.emit('audiopause', { panelIndex: this.currentPanelIdx });
    }

    toggleNarration() {
      if (this.isPlayingAudio) {
        this.pauseNarration();
      } else {
        this.playNarration(this.currentPanelIdx);
      }
    }

    seekNarration(percent) {
      if (this.audioPlayer && this.audioPlayer.duration) {
        this.audioPlayer.currentTime = (clamp(percent, 0, 100) / 100) * this.audioPlayer.duration;
      }
    }

    updateAudioControlsUI(isPlaying) {
      if (typeof document !== 'undefined') {
        const playBtn = document.getElementById('btnWebtoonMasterPlay');
        if (playBtn) {
          playBtn.classList.toggle('is-playing', isPlaying);
          const icon = playBtn.querySelector('.webtoon-play-icon');
          if (icon) icon.textContent = isPlaying ? '⏸' : '▶';
        }

        // Update panel overlay buttons
        const pins = document.querySelectorAll('.btn-webtoon-narrate-pin');
        pins.forEach(pin => {
          const pinIdx = parseInt(pin.getAttribute('data-panel-idx'), 10);
          pin.classList.toggle('is-playing', isPlaying && pinIdx === this.currentPanelIdx);
          pin.textContent = (isPlaying && pinIdx === this.currentPanelIdx) ? '⏸ Pause' : '🔊 Listen';
        });
      }
    }

    /* Auto-Scroll Engine */
    startAutoScroll(speedMultiplier = this.options.autoScrollSpeed) {
      this.options.autoScrollSpeed = speedMultiplier;
      this.isAutoScrolling = true;
      this.isAutoScrollPaused = false;
      this.autoScrollLastTime = typeof performance !== 'undefined' ? performance.now() : Date.now();

      if (this.autoScrollBadge) {
        this.autoScrollBadge.style.display = 'flex';
        this.autoScrollBadge.classList.remove('is-paused');
        const text = this.autoScrollBadge.querySelector('.autoscroll-text-status');
        if (text) text.textContent = `AUTO-SCROLLING ${speedMultiplier}x`;
      }

      if (typeof window !== 'undefined' && typeof requestAnimationFrame !== 'undefined') {
        const step = (timestamp) => {
          if (!this.isAutoScrolling) return;

          if (!this.isAutoScrollPaused) {
            const dt = (timestamp - this.autoScrollLastTime) / 1000;
            const pxToScroll = this.options.autoScrollBasePxPerSec * this.options.autoScrollSpeed * dt;

            const currentY = window.scrollY || window.pageYOffset || 0;
            const maxScroll = (document.documentElement.scrollHeight || 0) - window.innerHeight;

            if (currentY >= maxScroll - 2) {
              this.stopAutoScroll();
              this.emit('autoscrollend', {});
              return;
            }

            window.scrollBy(0, pxToScroll);
          }

          this.autoScrollLastTime = timestamp;
          this.autoScrollRAF = requestAnimationFrame(step);
        };

        if (typeof cancelAnimationFrame !== 'undefined') {
          cancelAnimationFrame(this.autoScrollRAF);
        }
        this.autoScrollRAF = requestAnimationFrame(step);
      }

      this.emit('autoscrollstart', { speed: speedMultiplier });
    }

    stopAutoScroll() {
      this.isAutoScrolling = false;
      this.isAutoScrollPaused = false;
      if (typeof cancelAnimationFrame !== 'undefined') {
        cancelAnimationFrame(this.autoScrollRAF);
      }
      clearTimeout(this.autoScrollResumeTimer);

      if (this.autoScrollBadge) {
        this.autoScrollBadge.style.display = 'none';
      }

      if (typeof document !== 'undefined') {
        const toggleBtn = document.getElementById('btnToggleAutoScroll');
        if (toggleBtn) toggleBtn.classList.remove('is-active');
      }

      this.emit('autoscrollstop', {});
    }

    toggleAutoScroll() {
      if (this.isAutoScrolling) {
        this.stopAutoScroll();
      } else {
        this.startAutoScroll(this.options.autoScrollSpeed);
        if (typeof document !== 'undefined') {
          const toggleBtn = document.getElementById('btnToggleAutoScroll');
          if (toggleBtn) toggleBtn.classList.add('is-active');
        }
      }
    }

    pauseAutoScrollTemporarily(ms = 2500) {
      if (!this.isAutoScrolling) return;
      this.isAutoScrollPaused = true;

      if (this.autoScrollBadge) {
        this.autoScrollBadge.classList.add('is-paused');
        const text = this.autoScrollBadge.querySelector('.autoscroll-text-status');
        if (text) text.textContent = 'PAUSED (USER INTERACTING)';
      }

      clearTimeout(this.autoScrollResumeTimer);
      this.autoScrollResumeTimer = setTimeout(() => {
        if (this.isAutoScrolling) {
          this.isAutoScrollPaused = false;
          this.autoScrollLastTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
          if (this.autoScrollBadge) {
            this.autoScrollBadge.classList.remove('is-paused');
            const text = this.autoScrollBadge.querySelector('.autoscroll-text-status');
            if (text) text.textContent = `AUTO-SCROLLING ${this.options.autoScrollSpeed}x`;
          }
        }
      }, ms);
    }

    setScrollSpeed(speed) {
      this.options.autoScrollSpeed = speed;
      if (this.isAutoScrolling && this.autoScrollBadge) {
        const text = this.autoScrollBadge.querySelector('.autoscroll-text-status');
        if (text) text.textContent = `AUTO-SCROLLING ${speed}x`;
      }
      this.emit('speedchange', { speed });
    }

    /* Layout & Gap Configuration */
    setMode(mode) {
      this.mode = mode;
      const isWebtoon = mode === 'webtoon';

      if (this.container) {
        this.panels.forEach((p, idx) => {
          if (p.el) {
            p.el.style.display = isWebtoon ? 'block' : (idx === this.currentPanelIdx ? 'block' : 'none');
          }
        });
      }

      if (this.minimapRail) {
        this.minimapRail.style.display = isWebtoon ? 'flex' : 'none';
      }

      if (typeof document !== 'undefined') {
        const modeBtn = document.getElementById('btnToggleMode');
        if (modeBtn) {
          modeBtn.textContent = isWebtoon ? '📖 Mode: Webtoon' : '📄 Mode: Single Page';
          modeBtn.classList.toggle('is-active', isWebtoon);
        }

        // Sync with external UI buttons if they exist
        const extPageBtn = document.getElementById('btn-mode-page');
        const extScrollBtn = document.getElementById('btn-mode-scroll');
        if (extPageBtn) extPageBtn.classList.toggle('active', !isWebtoon);
        if (extScrollBtn) extScrollBtn.classList.toggle('active', isWebtoon);

        const paginationBar = document.getElementById('comic-pagination-bar');
        if (paginationBar) paginationBar.style.display = isWebtoon ? 'none' : 'flex';
      }

      this.emit('modechange', { mode });
    }

    setPanelGap(gapPreset) {
      this.panelGap = gapPreset;
      if (this.container) {
        this.container.classList.remove('gap-none', 'gap-compact', 'gap-relaxed', 'gap-cinematic');
        this.container.classList.add(`gap-${gapPreset}`);
      }
    }

    setContainerWidth(widthPreset) {
      this.containerWidth = widthPreset;
      if (this.container) {
        this.container.classList.remove('width-compact', 'width-standard', 'width-wide', 'width-full');
        this.container.classList.add(`width-${widthPreset}`);
      }
    }

    toggleCinemaMode(enabled) {
      if (typeof document === 'undefined') return;
      document.body.classList.toggle('webtoon-cinema-focus-mode', enabled);
    }

    /* Event Listeners */
    bindEvents() {
      if (typeof window === 'undefined') return;

      // Scroll & Throttle
      let isScrolling = false;
      this.listeners.scroll = () => {
        if (!isScrolling) {
          requestAnimationFrame(() => {
            this.updatePanelIllumination();
            this.updateProgressIndicators();
            isScrolling = false;
          });
          isScrolling = true;
        }
      };
      window.addEventListener('scroll', this.listeners.scroll, { passive: true });

      // Resize
      this.listeners.resize = () => {
        this.updatePanelIllumination();
        this.updateProgressIndicators();
      };
      window.addEventListener('resize', this.listeners.resize, { passive: true });

      // User interaction pause for auto-scroll
      const onUserInteract = () => {
        if (this.isAutoScrolling) {
          this.pauseAutoScrollTemporarily(2500);
        }
      };

      window.addEventListener('wheel', onUserInteract, { passive: true });
      window.addEventListener('touchstart', onUserInteract, { passive: true });

      // Keyboard Controls
      if (this.options.enableKeyboardShortcuts) {
        this.listeners.keydown = (e) => {
          if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

          switch (e.key) {
            case 'j':
            case 'J':
            case 'ArrowDown':
              if (this.mode === 'webtoon') {
                this.scrollToPanel(Math.min(this.panels.length - 1, this.currentPanelIdx + 1), true);
              }
              break;
            case 'k':
            case 'K':
            case 'ArrowUp':
              if (this.mode === 'webtoon') {
                this.scrollToPanel(Math.max(0, this.currentPanelIdx - 1), true);
              }
              break;
            case 'a':
            case 'A':
              this.toggleAutoScroll();
              break;
            case 'w':
            case 'W':
              this.setMode(this.mode === 'webtoon' ? 'page' : 'webtoon');
              break;
            case ' ':
              e.preventDefault();
              this.toggleNarration();
              break;
            case 'm':
            case 'M':
              if (this.audioPlayer) this.audioPlayer.muted = !this.audioPlayer.muted;
              break;
            case '+':
            case '=':
              this.setScrollSpeed(Math.min(3.0, this.options.autoScrollSpeed + 0.5));
              break;
            case '-':
            case '_':
              this.setScrollSpeed(Math.max(0.5, this.options.autoScrollSpeed - 0.5));
              break;
          }
        };
        window.addEventListener('keydown', this.listeners.keydown);
      }
    }

    bindAudioDockEvents() {
      const playBtn = document.getElementById('btnWebtoonMasterPlay');
      if (playBtn) playBtn.addEventListener('click', () => this.toggleNarration());

      const scrubber = document.getElementById('webtoonAudioScrubber');
      if (scrubber) {
        scrubber.addEventListener('mousedown', () => { this._isUserScrubbingAudio = true; });
        scrubber.addEventListener('touchstart', () => { this._isUserScrubbingAudio = true; }, { passive: true });
        scrubber.addEventListener('input', (e) => {
          this.seekNarration(parseFloat(e.target.value));
        });
        scrubber.addEventListener('mouseup', () => { this._isUserScrubbingAudio = false; });
        scrubber.addEventListener('touchend', () => { this._isUserScrubbingAudio = false; });
      }

      const autoScrollBtn = document.getElementById('btnToggleAutoScroll');
      if (autoScrollBtn) autoScrollBtn.addEventListener('click', () => this.toggleAutoScroll());

      const modeBtn = document.getElementById('btnToggleMode');
      if (modeBtn) modeBtn.addEventListener('click', () => {
        this.setMode(this.mode === 'webtoon' ? 'page' : 'webtoon');
      });

      const sp05 = document.getElementById('btnSpeed05');
      const sp10 = document.getElementById('btnSpeed10');
      const sp15 = document.getElementById('btnSpeed15');

      const setSpeedBtn = (btn, speed) => {
        [sp05, sp10, sp15].forEach(b => { if (b) b.classList.remove('is-active'); });
        if (btn) btn.classList.add('is-active');
        this.setScrollSpeed(speed);
      };

      if (sp05) sp05.addEventListener('click', () => setSpeedBtn(sp05, 0.5));
      if (sp10) sp10.addEventListener('click', () => setSpeedBtn(sp10, 1.0));
      if (sp15) sp15.addEventListener('click', () => setSpeedBtn(sp15, 1.5));
    }

    /* Teardown & Clean Destruction */
    destroy() {
      this.isDestroyed = true;
      this.stopAutoScroll();
      this.pauseNarration();

      if (this.intersectionObserver) {
        this.intersectionObserver.disconnect();
      }

      if (typeof window !== 'undefined') {
        if (this.listeners.scroll) window.removeEventListener('scroll', this.listeners.scroll);
        if (this.listeners.resize) window.removeEventListener('resize', this.listeners.resize);
        if (this.listeners.keydown) window.removeEventListener('keydown', this.listeners.keydown);
      }

      if (this.progressTrack && this.progressTrack.parentNode) {
        this.progressTrack.parentNode.removeChild(this.progressTrack);
      }
      if (this.headerPill && this.headerPill.parentNode) {
        this.headerPill.parentNode.removeChild(this.headerPill);
      }
      if (this.minimapRail && this.minimapRail.parentNode) {
        this.minimapRail.parentNode.removeChild(this.minimapRail);
      }
      if (this.audioDock && this.audioDock.parentNode) {
        this.audioDock.parentNode.removeChild(this.audioDock);
      }
      if (this.autoScrollBadge && this.autoScrollBadge.parentNode) {
        this.autoScrollBadge.parentNode.removeChild(this.autoScrollBadge);
      }

      this.emit('destroy', {});
    }
  }

  /* Factory helper */
  function createComicWebtoon(options) {
    return new ComicWebtoonViewer(options);
  }

  return {
    ComicWebtoonViewer,
    createComicWebtoon,
    clamp,
    formatTime,
    calculateReadingTimeRemaining,
    calculateScrollProgress,
    calculatePanelFocalScore
  };
});
