/**
 * AZOTH: The Zero-Leakage Saga — Comic & S01 Trailers Cinematic UI Engine
 * Features:
 *  - 2.39:1 Anamorphic Letterbox Viewport & Cinema Theater Mode
 *  - Interactive Alchemical Chapter Markers (Timeline Pins & Rail Cards)
 *  - Glassmorphic Custom Video HUD (Precision Scrubber, Speed, Glow, PiP, Fullscreen)
 *  - Responsive Multi-Episode Navigation & Keyboard Controls
 */

(function () {
  'use strict';

  function formatTime(seconds) {
    if (isNaN(seconds) || seconds === Infinity) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  class CinematicTrailerPlayer {
    constructor(options) {
      this.container = typeof options.container === 'string' ? document.getElementById(options.container) : options.container;
      this.video = typeof options.video === 'string' ? document.getElementById(options.video) : options.video;
      this.chapters = options.chapters || [];
      this.onChapterChange = options.onChapterChange || null;
      this.onPageJump = options.onPageJump || null;
      this.episodeTitle = options.episodeTitle || 'AZOTH Motion Comic Trailer';
      this.currentChapterIdx = 0;
      this.idleTimeout = null;
      this.isSeeking = false;

      if (!this.container || !this.video) {
        console.warn('[ZothCinematic] Container or Video element not found.');
        return;
      }

      this.init();
    }

    init() {
      this.setupDOM();
      this.bindVideoEvents();
      this.bindHUDEvents();
      this.bindKeyboardShortcuts();
      this.renderChapterMarkers();
      this.renderChapterRail();
      this.updateActiveChapter(0);
    }

    setupDOM() {
      // Ensure container has cinematic styling classes
      this.container.classList.add('cinematic-trailer-container');

      // Create Ambient Glow element if not present
      if (!this.container.querySelector('.cinematic-ambient-glow')) {
        this.ambientGlow = document.createElement('div');
        this.ambientGlow.className = 'cinematic-ambient-glow';
        this.container.prepend(this.ambientGlow);
      } else {
        this.ambientGlow = this.container.querySelector('.cinematic-ambient-glow');
      }

      // Close Cinema Mode button
      if (!this.container.querySelector('.cinema-mode-close-btn')) {
        this.closeCinemaBtn = document.createElement('button');
        this.closeCinemaBtn.className = 'cinema-mode-close-btn';
        this.closeCinemaBtn.type = 'button';
        this.closeCinemaBtn.innerHTML = '✕ Exit Cinema View';
        this.closeCinemaBtn.addEventListener('click', () => this.toggleCinemaMode(false));
        this.container.prepend(this.closeCinemaBtn);
      }

      // Setup Viewport wrapper
      this.viewport = this.video.closest('.cinematic-viewport');
      if (!this.viewport) {
        this.viewport = document.createElement('div');
        this.viewport.className = 'cinematic-viewport';
        this.video.parentNode.insertBefore(this.viewport, this.video);
        this.viewport.appendChild(this.video);
      }

      this.video.classList.add('cinematic-video-element');
      this.video.controls = false; // Disable default controls to use our custom HUD

      // Anamorphic flare top line
      if (!this.viewport.querySelector('.cinematic-flare-line')) {
        const flare = document.createElement('div');
        flare.className = 'cinematic-flare-line';
        this.viewport.appendChild(flare);
      }

      // Big center play button
      this.bigPlayBtn = document.createElement('button');
      this.bigPlayBtn.className = 'cinematic-big-play-btn';
      this.bigPlayBtn.type = 'button';
      this.bigPlayBtn.setAttribute('aria-label', 'Play Cinematic Trailer');
      this.bigPlayBtn.innerHTML = '▶';
      this.viewport.appendChild(this.bigPlayBtn);

      // HUD Overlay
      this.hud = document.createElement('div');
      this.hud.className = 'cinematic-hud';
      this.hud.innerHTML = `
        <div class="cinematic-hud-top">
          <div class="cinematic-title-badge">
            <span class="alchemical-sigil" id="hudActiveSigil">☿</span>
            <span id="hudActiveChapterTitle">${this.episodeTitle}</span>
          </div>
          <div class="cinematic-meta-tags">
            <span class="cinematic-tag gold">2.39:1 ANAMORPHIC</span>
            <span class="cinematic-tag">60 FPS</span>
            <span class="cinematic-tag rose">ALCHEMICAL VO</span>
          </div>
        </div>

        <div class="cinematic-hud-bottom">
          <!-- Scrubber -->
          <div class="cinematic-scrubber-box" id="hudScrubberBox">
            <div class="cinematic-scrubber-track">
              <div class="cinematic-scrubber-buffered" id="hudScrubberBuffered"></div>
              <div class="cinematic-scrubber-played" id="hudScrubberPlayed"></div>
              <div class="cinematic-scrubber-thumb" id="hudScrubberThumb"></div>
              <!-- Chapter Pins will be inserted here -->
            </div>
            <div class="cinematic-scrubber-tooltip" id="hudScrubberTooltip">
              <span class="tooltip-sigil">☿</span><span class="tooltip-text">00:00</span>
            </div>
          </div>

          <!-- Controls Deck -->
          <div class="cinematic-control-bar">
            <div class="cinematic-ctrl-group">
              <button class="cinematic-btn gold-highlight" id="hudBtnPlay" type="button" aria-label="Play / Pause">▶</button>
              <button class="cinematic-btn" id="hudBtnRewind" type="button" title="Rewind 5s (← / J)" aria-label="Rewind 5 seconds">⟲5</button>
              <button class="cinematic-btn" id="hudBtnForward" type="button" title="Forward 5s (→ / L)" aria-label="Forward 5 seconds">5⟳</button>
              
              <div class="cinematic-volume-wrap">
                <button class="cinematic-btn" id="hudBtnMute" type="button" title="Mute (M)" aria-label="Mute / Unmute">🔊</button>
                <input class="cinematic-volume-slider" id="hudVolumeSlider" type="range" min="0" max="1" step="0.05" value="1" title="Volume" />
              </div>

              <div class="cinematic-time-display">
                <span class="current" id="hudTimeCurrent">00:00</span> / <span id="hudTimeTotal">00:30</span>
              </div>
            </div>

            <div class="cinematic-ctrl-group">
              <!-- Speed Popover -->
              <div class="cinematic-dropdown-wrap">
                <button class="cinematic-btn" id="hudBtnSpeed" type="button" title="Playback Speed">1.0x</button>
                <div class="cinematic-menu-popover" id="hudSpeedPopover">
                  <button class="cinematic-menu-item" data-speed="0.5" type="button">0.5x Slow</button>
                  <button class="cinematic-menu-item" data-speed="0.75" type="button">0.75x</button>
                  <button class="cinematic-menu-item active" data-speed="1.0" type="button">1.0x Normal</button>
                  <button class="cinematic-menu-item" data-speed="1.25" type="button">1.25x</button>
                  <button class="cinematic-menu-item" data-speed="1.5" type="button">1.5x Fast</button>
                  <button class="cinematic-menu-item" data-speed="2.0" type="button">2.0x Turbo</button>
                </div>
              </div>

              <button class="cinematic-btn" id="hudBtnAspect" type="button" title="Toggle 2.39:1 Letterbox / 16:9">2.39:1</button>
              <button class="cinematic-btn" id="hudBtnGlow" type="button" title="Toggle Ambient Backlight">✨</button>
              <button class="cinematic-btn" id="hudBtnCinema" type="button" title="Cinema Theater Mode (C)">🎬</button>
              <button class="cinematic-btn" id="hudBtnPip" type="button" title="Picture-in-Picture">⧉</button>
              <button class="cinematic-btn" id="hudBtnFullscreen" type="button" title="Fullscreen (F)">⛶</button>
              <button class="cinematic-btn" id="hudBtnShortcuts" type="button" title="Keyboard Shortcuts (?)">⌨</button>
            </div>
          </div>
        </div>
      `;
      this.viewport.appendChild(this.hud);

      // Setup Keyboard Shortcuts modal
      this.createShortcutsModal();
    }

    createShortcutsModal() {
      if (document.getElementById('zothShortcutsModal')) return;
      const modal = document.createElement('div');
      modal.id = 'zothShortcutsModal';
      modal.className = 'cinematic-shortcuts-modal';
      modal.innerHTML = `
        <div class="cinematic-shortcuts-header">
          <h3><span>⚡</span> Master Operator Keyboard Shortcuts</h3>
          <button style="background:none;border:none;color:#94a3b8;font-size:1.2rem;cursor:pointer;" id="btnCloseShortcuts">✕</button>
        </div>
        <div class="cinematic-shortcuts-grid">
          <div class="shortcut-row"><span>Play / Pause</span> <span class="shortcut-key">Space / K</span></div>
          <div class="shortcut-row"><span>Seek ±5 Seconds</span> <span class="shortcut-key">← / → / J / L</span></div>
          <div class="shortcut-row"><span>Volume Up / Down</span> <span class="shortcut-key">↑ / ↓</span></div>
          <div class="shortcut-row"><span>Mute Audio</span> <span class="shortcut-key">M</span></div>
          <div class="shortcut-row"><span>Cinema Theater Mode</span> <span class="shortcut-key">C</span></div>
          <div class="shortcut-row"><span>Native Fullscreen</span> <span class="shortcut-key">F</span></div>
          <div class="shortcut-row"><span>Jump to 0% – 90%</span> <span class="shortcut-key">0 – 9</span></div>
          <div class="shortcut-row"><span>Prev / Next Chapter</span> <span class="shortcut-key">[ / ]</span></div>
        </div>
      `;
      document.body.appendChild(modal);

      document.getElementById('btnCloseShortcuts').addEventListener('click', () => {
        modal.classList.remove('is-open');
      });
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('is-open');
      });
    }

    bindVideoEvents() {
      const v = this.video;

      v.addEventListener('play', () => {
        this.viewport.classList.add('is-playing');
        this.bigPlayBtn.classList.add('is-hidden');
        document.getElementById('hudBtnPlay').innerHTML = '⏸';
        this.triggerIdleTimer();
      });

      v.addEventListener('pause', () => {
        this.viewport.classList.remove('is-playing');
        this.bigPlayBtn.classList.remove('is-hidden');
        this.bigPlayBtn.innerHTML = '▶';
        document.getElementById('hudBtnPlay').innerHTML = '▶';
        this.clearIdleTimer();
      });

      v.addEventListener('ended', () => {
        this.viewport.classList.remove('is-playing');
        this.bigPlayBtn.classList.remove('is-hidden');
        this.bigPlayBtn.innerHTML = '↺';
        document.getElementById('hudBtnPlay').innerHTML = '↺';
      });

      v.addEventListener('timeupdate', () => {
        if (this.isSeeking) return;
        this.updateProgress();
        this.checkChapterTransition();
      });

      v.addEventListener('progress', () => {
        if (v.buffered.length > 0 && v.duration) {
          const bufferedEnd = v.buffered.end(v.buffered.length - 1);
          const pct = (bufferedEnd / v.duration) * 100;
          document.getElementById('hudScrubberBuffered').style.width = `${pct}%`;
        }
      });

      v.addEventListener('loadedmetadata', () => {
        document.getElementById('hudTimeTotal').textContent = formatTime(v.duration);
        this.renderChapterMarkers();
      });

      this.video.addEventListener('click', () => this.togglePlay());
      this.bigPlayBtn.addEventListener('click', () => this.togglePlay());
    }

    bindHUDEvents() {
      const v = this.video;

      // Play / Pause
      document.getElementById('hudBtnPlay').addEventListener('click', () => this.togglePlay());

      // Rewind / Forward 5s
      document.getElementById('hudBtnRewind').addEventListener('click', () => this.seekDelta(-5));
      document.getElementById('hudBtnForward').addEventListener('click', () => this.seekDelta(5));

      // Mute / Volume
      const btnMute = document.getElementById('hudBtnMute');
      const volSlider = document.getElementById('hudVolumeSlider');

      btnMute.addEventListener('click', () => {
        v.muted = !v.muted;
        btnMute.innerHTML = v.muted || v.volume === 0 ? '🔇' : '🔊';
        volSlider.value = v.muted ? 0 : v.volume;
      });

      volSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        v.volume = val;
        v.muted = val === 0;
        btnMute.innerHTML = val === 0 ? '🔇' : '🔊';
      });

      // Scrubber Interactions
      const scrubberBox = document.getElementById('hudScrubberBox');
      const tooltip = document.getElementById('hudScrubberTooltip');

      const handleScrubberMove = (e) => {
        const rect = scrubberBox.getBoundingClientRect();
        const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const previewTime = (v.duration || 30) * pos;

        // Position tooltip
        tooltip.style.left = `${pos * 100}%`;
        tooltip.classList.add('is-visible');

        // Find hovered chapter
        const chapter = this.getChapterForTime(previewTime);
        const sigilSpan = tooltip.querySelector('.tooltip-sigil');
        const textSpan = tooltip.querySelector('.tooltip-text');

        if (sigilSpan) sigilSpan.textContent = chapter ? chapter.sigil : '☿';
        if (textSpan) textSpan.textContent = `${formatTime(previewTime)} · ${chapter ? chapter.title : ''}`;

        if (this.isSeeking) {
          v.currentTime = previewTime;
          document.getElementById('hudScrubberPlayed').style.width = `${pos * 100}%`;
          document.getElementById('hudScrubberThumb').style.left = `${pos * 100}%`;
          document.getElementById('hudTimeCurrent').textContent = formatTime(previewTime);
        }
      };

      scrubberBox.addEventListener('mousemove', handleScrubberMove);
      scrubberBox.addEventListener('mouseenter', handleScrubberMove);
      scrubberBox.addEventListener('mouseleave', () => {
        if (!this.isSeeking) tooltip.classList.remove('is-visible');
      });

      scrubberBox.addEventListener('mousedown', (e) => {
        this.isSeeking = true;
        handleScrubberMove(e);
        const onMouseUp = () => {
          this.isSeeking = false;
          tooltip.classList.remove('is-visible');
          window.removeEventListener('mouseup', onMouseUp);
        };
        window.addEventListener('mouseup', onMouseUp);
      });

      // Speed dropdown
      const btnSpeed = document.getElementById('hudBtnSpeed');
      const speedPopover = document.getElementById('hudSpeedPopover');

      btnSpeed.addEventListener('click', (e) => {
        e.stopPropagation();
        speedPopover.classList.toggle('is-open');
      });

      speedPopover.querySelectorAll('.cinematic-menu-item').forEach((item) => {
        item.addEventListener('click', () => {
          const speed = parseFloat(item.getAttribute('data-speed'));
          v.playbackRate = speed;
          btnSpeed.textContent = `${speed}x`;
          speedPopover.querySelectorAll('.cinematic-menu-item').forEach((i) => i.classList.remove('active'));
          item.classList.add('active');
          speedPopover.classList.remove('is-open');
        });
      });

      document.addEventListener('click', () => speedPopover.classList.remove('is-open'));

      // Aspect ratio toggle (2.39:1 vs 16:9)
      const btnAspect = document.getElementById('hudBtnAspect');
      btnAspect.addEventListener('click', () => {
        const is169 = this.viewport.classList.toggle('aspect-16-9');
        btnAspect.textContent = is169 ? '16:9' : '2.39:1';
      });

      // Ambient Glow toggle
      const btnGlow = document.getElementById('hudBtnGlow');
      btnGlow.addEventListener('click', () => {
        if (this.ambientGlow.classList.contains('glow-boost')) {
          this.ambientGlow.classList.remove('glow-boost');
          this.ambientGlow.classList.add('glow-off');
          btnGlow.classList.remove('active');
        } else if (this.ambientGlow.classList.contains('glow-off')) {
          this.ambientGlow.classList.remove('glow-off');
          btnGlow.classList.add('active');
        } else {
          this.ambientGlow.classList.add('glow-boost');
          btnGlow.classList.add('active');
        }
      });

      // Cinema Theater Mode
      document.getElementById('hudBtnCinema').addEventListener('click', () => this.toggleCinemaMode());

      // PiP
      const btnPip = document.getElementById('hudBtnPip');
      if ('pictureInPictureEnabled' in document) {
        btnPip.addEventListener('click', async () => {
          try {
            if (document.pictureInPictureElement) {
              await document.exitPictureInPicture();
            } else {
              await v.requestPictureInPicture();
            }
          } catch (err) {
            console.warn('[ZothCinematic] PiP error:', err);
          }
        });
      } else {
        btnPip.style.display = 'none';
      }

      // Fullscreen
      document.getElementById('hudBtnFullscreen').addEventListener('click', () => this.toggleFullscreen());

      // Shortcuts Modal Trigger
      document.getElementById('hudBtnShortcuts').addEventListener('click', () => {
        const modal = document.getElementById('zothShortcutsModal');
        if (modal) modal.classList.toggle('is-open');
      });

      // Mouse inactivity detection for HUD
      this.viewport.addEventListener('mousemove', () => this.triggerIdleTimer());
      this.viewport.addEventListener('touchstart', () => this.triggerIdleTimer(), { passive: true });
    }

    triggerIdleTimer() {
      this.viewport.classList.remove('is-idle');
      this.clearIdleTimer();
      if (!this.video.paused) {
        this.idleTimeout = setTimeout(() => {
          this.viewport.classList.add('is-idle');
        }, 2600);
      }
    }

    clearIdleTimer() {
      if (this.idleTimeout) clearTimeout(this.idleTimeout);
    }

    togglePlay() {
      if (this.video.paused) {
        this.video.play().catch((e) => console.warn('Autoplay check:', e));
      } else {
        this.video.pause();
      }
    }

    seekDelta(delta) {
      this.video.currentTime = Math.max(0, Math.min(this.video.duration || 30, this.video.currentTime + delta));
      this.triggerIdleTimer();
    }

    toggleCinemaMode(forceState) {
      const active = typeof forceState === 'boolean' ? forceState : !document.body.classList.contains('cinema-mode-active');
      document.body.classList.toggle('cinema-mode-active', active);
      document.getElementById('hudBtnCinema').classList.toggle('active', active);
    }

    toggleFullscreen() {
      if (!document.fullscreenElement) {
        if (this.container.requestFullscreen) {
          this.container.requestFullscreen();
        } else if (this.video.webkitEnterFullscreen) {
          this.video.webkitEnterFullscreen();
        }
      } else {
        if (document.exitFullscreen) document.exitFullscreen();
      }
    }

    updateProgress() {
      const v = this.video;
      if (!v.duration) return;
      const pct = (v.currentTime / v.duration) * 100;
      document.getElementById('hudScrubberPlayed').style.width = `${pct}%`;
      document.getElementById('hudScrubberThumb').style.left = `${pct}%`;
      document.getElementById('hudTimeCurrent').textContent = formatTime(v.currentTime);
    }

    getChapterForTime(time) {
      if (!this.chapters || this.chapters.length === 0) return null;
      for (let i = this.chapters.length - 1; i >= 0; i--) {
        if (time >= this.chapters[i].time) {
          return this.chapters[i];
        }
      }
      return this.chapters[0];
    }

    checkChapterTransition() {
      const curTime = this.video.currentTime;
      const curChap = this.getChapterForTime(curTime);
      if (!curChap) return;

      const idx = this.chapters.indexOf(curChap);
      if (idx !== this.currentChapterIdx && idx !== -1) {
        this.currentChapterIdx = idx;
        this.updateActiveChapter(idx);
        if (this.onChapterChange) this.onChapterChange(curChap, idx);
      }
    }

    updateActiveChapter(idx) {
      const chap = this.chapters[idx];
      if (!chap) return;

      const sigilElem = document.getElementById('hudActiveSigil');
      const titleElem = document.getElementById('hudActiveChapterTitle');
      if (sigilElem) sigilElem.textContent = chap.sigil || '☿';
      if (titleElem) titleElem.textContent = chap.title;

      // Update pins active state
      const pins = this.container.querySelectorAll('.alchemical-marker-pin');
      pins.forEach((pin, i) => pin.classList.toggle('active', i === idx));

      // Update chapter rail active state
      const railCards = document.querySelectorAll('.alchemical-chapter-card');
      railCards.forEach((card, i) => card.classList.toggle('active', i === idx));
    }

    renderChapterMarkers() {
      const track = this.container.querySelector('.cinematic-scrubber-track');
      if (!track) return;

      // Remove existing pins
      track.querySelectorAll('.alchemical-marker-pin').forEach((p) => p.remove());

      const dur = this.video.duration || 30;
      this.chapters.forEach((chap, idx) => {
        const pin = document.createElement('div');
        pin.className = 'alchemical-marker-pin';
        const pct = (chap.time / dur) * 100;
        pin.style.left = `${pct}%`;
        pin.setAttribute('data-idx', idx);
        pin.title = `${chap.sigil} ${chap.title} (${formatTime(chap.time)})`;

        pin.addEventListener('click', (e) => {
          e.stopPropagation();
          this.jumpToChapter(idx);
        });

        track.appendChild(pin);
      });
    }

    renderChapterRail() {
      const railTarget = document.getElementById('alchemicalChapterRail');
      if (!railTarget || !this.chapters.length) return;

      railTarget.innerHTML = `
        <div class="alchemical-rail-header">
          <div class="alchemical-rail-title">
            <span>✦</span> Alchemical Chapter Timeline &amp; Key Scenes
          </div>
          <span style="font-family:var(--font-mono);font-size:0.74rem;color:var(--cinema-cyan);">
            Click any scene to seek trailer &amp; jump panel
          </span>
        </div>
        <div class="alchemical-chapters-grid">
          ${this.chapters
            .map(
              (chap, idx) => `
            <div class="alchemical-chapter-card ${idx === 0 ? 'active' : ''}" data-idx="${idx}">
              <div class="chapter-card-top">
                <span class="chapter-sigil">${chap.sigil}</span>
                <span class="chapter-time">${formatTime(chap.time)}</span>
              </div>
              <div class="chapter-title">${chap.title}</div>
              <div class="chapter-desc">${chap.desc}</div>
            </div>
          `
            )
            .join('')}
        </div>
      `;

      railTarget.querySelectorAll('.alchemical-chapter-card').forEach((card) => {
        card.addEventListener('click', () => {
          const idx = parseInt(card.getAttribute('data-idx'), 10);
          this.jumpToChapter(idx);
        });
      });
    }

    jumpToChapter(idx) {
      const chap = this.chapters[idx];
      if (!chap) return;

      this.video.currentTime = chap.time;
      if (this.video.paused) {
        this.video.play().catch(() => {});
      }
      this.currentChapterIdx = idx;
      this.updateActiveChapter(idx);

      if (this.onPageJump && typeof chap.pageIdx === 'number') {
        this.onPageJump(chap.pageIdx);
      }
    }

    bindKeyboardShortcuts() {
      window.addEventListener('keydown', (e) => {
        // Ignore if user is typing in form inputs
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

        switch (e.key) {
          case ' ':
          case 'k':
          case 'K':
            e.preventDefault();
            this.togglePlay();
            break;
          case 'ArrowLeft':
          case 'j':
          case 'J':
            e.preventDefault();
            this.seekDelta(-5);
            break;
          case 'ArrowRight':
          case 'l':
          case 'L':
            e.preventDefault();
            this.seekDelta(5);
            break;
          case 'ArrowUp':
            e.preventDefault();
            this.video.volume = Math.min(1, this.video.volume + 0.1);
            document.getElementById('hudVolumeSlider').value = this.video.volume;
            break;
          case 'ArrowDown':
            e.preventDefault();
            this.video.volume = Math.max(0, this.video.volume - 0.1);
            document.getElementById('hudVolumeSlider').value = this.video.volume;
            break;
          case 'm':
          case 'M':
            this.video.muted = !this.video.muted;
            document.getElementById('hudBtnMute').innerHTML = this.video.muted ? '🔇' : '🔊';
            break;
          case 'f':
          case 'F':
            this.toggleFullscreen();
            break;
          case 'c':
          case 'C':
            this.toggleCinemaMode();
            break;
          case 'Escape':
            this.toggleCinemaMode(false);
            const modal = document.getElementById('zothShortcutsModal');
            if (modal) modal.classList.remove('is-open');
            break;
          case '[':
            this.jumpToChapter(Math.max(0, this.currentChapterIdx - 1));
            break;
          case ']':
            this.jumpToChapter(Math.min(this.chapters.length - 1, this.currentChapterIdx + 1));
            break;
          case '?':
            const shortcutsModal = document.getElementById('zothShortcutsModal');
            if (shortcutsModal) shortcutsModal.classList.toggle('is-open');
            break;
          default:
            if (e.key >= '0' && e.key <= '9') {
              const fraction = parseInt(e.key, 10) / 10;
              this.video.currentTime = (this.video.duration || 30) * fraction;
            }
            break;
        }
      });
    }
  }

  window.ZothCinematic = {
    init: function (options) {
      return new CinematicTrailerPlayer(options);
    },
    formatTime: formatTime,
  };
})();
