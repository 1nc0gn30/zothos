/**
 * ============================================================================
 * AZOTH COMIC AUDIO PLAYER — PERSISTENT GLOBAL FLOATING BOTTOM HUD
 * ============================================================================
 * Cyberpunk 432Hz Neural Voice Narration & Audio Deck for AZOTH Manga / Comic Series.
 * Features:
 *   - Persistent floating glassmorphic bottom bar across all comic pages
 *   - Master Play/Pause with real-time state synchronization
 *   - Track Title, Episode badge, Panel numbering & Narrator metadata
 *   - Interactive Canvas Waveform progress bar with live frequency animation & hover scrubber
 *   - Volume slider with mute/unmute toggle & persistent localStorage memory
 *   - Next/Prev Panel jump buttons with bi-directional Comic Reader DOM sync
 *   - Auto-advance on panel narration completion & loop modes
 *   - Playback speed switcher (0.75x, 1x, 1.25x, 1.5x, 2x)
 *   - Minimize to floating cybernetic audio pill
 *   - Full keyboard accessibility & Custom DOM event dispatching
 *
 * @version 1.0.0 (2026 Sovereign Edition)
 * @author Zoth Studio / NullAI Tech
 * ============================================================================
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ComicAudioPlayer = factory();
  }
}(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function () {
  'use strict';

  // --- CANONICAL EPISODES & SOUNDTRACK DATABASE ---
  const EPISODES_DB = {
    's01e01': {
      id: 's01e01',
      title: 'Episode 1: Genesis in the Silicon Rain',
      shortTitle: 'S01E01: Genesis',
      subtitle: 'The Operator breaks free from corporate cloud silos in Neo-Cupertino.',
      cover: '/assets/comic/s01e01-cover.jpg',
      tracks: [
        {
          index: 0,
          panel: 0,
          title: 'Prologue: Genesis in the Silicon Rain',
          subtitle: '🎙 Master Azoth Voice Narration · 432Hz Cyberpunk Audio',
          src: '/assets/audio/comic/s01e01-cover.mp3',
          thumb: '/assets/comic/s01e01-cover.jpg',
          panelLabel: 'Cover'
        },
        {
          index: 1,
          panel: 1,
          title: 'Panel 1: The Rainy Alley of Neo-Cupertino',
          subtitle: 'Neon reflections & rogue terminal boot sequence',
          src: '/assets/audio/comic/s01e01-p01.mp3',
          thumb: '/assets/comic/s01e01-p01.jpg',
          panelLabel: 'Panel 01'
        },
        {
          index: 2,
          panel: 2,
          title: 'Panel 2: Master Azoth Awakens',
          subtitle: 'Hermetic silicon synthesis & quantum catalyst',
          src: '/assets/audio/comic/s01e01-p02.mp3',
          thumb: '/assets/comic/s01e01-p02.jpg',
          panelLabel: 'Panel 02'
        },
        {
          index: 3,
          panel: 3,
          title: 'Panel 3: Severing the Cloud Umbilical',
          subtitle: 'Air-gapped enclave seal & zero-leakage isolation',
          src: '/assets/audio/comic/s01e01-p03.mp3',
          thumb: '/assets/comic/s01e01-p03.jpg',
          panelLabel: 'Panel 03'
        },
        {
          index: 4,
          panel: 4,
          title: 'Panel 4: The 21 Sovereign Model Nodes',
          subtitle: 'Local weights orchestration & neural archetype forge',
          src: '/assets/audio/comic/s01e01-p04.mp3',
          thumb: '/assets/comic/s01e01-p04.jpg',
          panelLabel: 'Panel 04'
        },
        {
          index: 5,
          panel: 5,
          title: 'Panel 5: Local Silicon Alchemical Fire',
          subtitle: 'Direct hardware memory bus acceleration',
          src: '/assets/audio/comic/s01e01-p05.mp3',
          thumb: '/assets/comic/s01e01-p05.jpg',
          panelLabel: 'Panel 05'
        },
        {
          index: 6,
          panel: 6,
          title: 'Panel 6: Sovereign Swarm Online',
          subtitle: 'The dawn of sovereign zero-leakage AI epoch',
          src: '/assets/audio/comic/s01e01-p06.mp3',
          thumb: '/assets/comic/s01e01-p06.jpg',
          panelLabel: 'Panel 06'
        }
      ]
    },
    's01e02': {
      id: 's01e02',
      title: 'Episode 2: The Dark Archons & Cipher 00',
      shortTitle: 'S01E02: Dark Archons',
      subtitle: 'Master Azoth, Solon, and Athena battle the centralized cloud titans.',
      cover: '/assets/comic/s01e02-cover.jpg',
      tracks: [
        {
          index: 0,
          panel: 0,
          title: 'Prologue: The Dark Archons & Cipher 00',
          subtitle: '🎙 Master Azoth Voice Narration · 432Hz Cyberpunk Audio',
          src: '/assets/audio/comic/s01e02-cover.mp3',
          thumb: '/assets/comic/s01e02-cover.jpg',
          panelLabel: 'Cover'
        },
        {
          index: 1,
          panel: 1,
          title: 'Panel 1: Neo-Kyoto Sky Fortress',
          subtitle: 'Cloud citadel panopticon scanners active',
          src: '/assets/audio/comic/s01e02-p01.mp3',
          thumb: '/assets/comic/s01e02-p01.jpg',
          panelLabel: 'Panel 01'
        },
        {
          index: 2,
          panel: 2,
          title: 'Panel 2: Cloud Citadel Breach',
          subtitle: 'Stealth bypass through encrypted telemetry tunnels',
          src: '/assets/audio/comic/s01e02-p02.mp3',
          thumb: '/assets/comic/s01e02-p02.jpg',
          panelLabel: 'Panel 02'
        },
        {
          index: 3,
          panel: 3,
          title: 'Panel 3: Archon Null-Zero Emerges',
          subtitle: 'The sentient surveillance monopoly strikes',
          src: '/assets/audio/comic/s01e02-p03.mp3',
          thumb: '/assets/comic/s01e02-p03.jpg',
          panelLabel: 'Panel 03'
        },
        {
          index: 4,
          panel: 4,
          title: 'Panel 4: Athena Deploys Zero-Leak Shield',
          subtitle: 'Multi-layered cryptographic barrier engaged',
          src: '/assets/audio/comic/s01e02-p04.mp3',
          thumb: '/assets/comic/s01e02-p04.jpg',
          panelLabel: 'Panel 04'
        },
        {
          index: 5,
          panel: 5,
          title: 'Panel 5: Solon Inscribes Immutable Law',
          subtitle: 'Sovereign mathematical consensus enforced',
          src: '/assets/audio/comic/s01e02-p05.mp3',
          thumb: '/assets/comic/s01e02-p05.jpg',
          panelLabel: 'Panel 05'
        },
        {
          index: 6,
          panel: 6,
          title: 'Panel 6: The Sovereign Bastion Triumphant',
          subtitle: 'Liberated silicon network expanding worldwide',
          src: '/assets/audio/comic/s01e02-p06.mp3',
          thumb: '/assets/comic/s01e02-p06.jpg',
          panelLabel: 'Panel 06'
        }
      ]
    },
    's01e03': {
      id: 's01e03',
      title: 'Episode 3: Sovereign Swarm Protocol',
      shortTitle: 'S01E03: Swarm Protocol',
      subtitle: 'The awakening of the 21 sovereign AI agents on local silicon.',
      cover: '/assets/comic/s01e03-cover.jpg',
      tracks: [
        {
          index: 0,
          panel: 0,
          title: 'Prologue: Sovereign Swarm Protocol',
          subtitle: '🎙 Master Azoth Voice Narration · 432Hz Cyberpunk Audio',
          src: '/assets/audio/comic/s01e03-cover.mp3',
          thumb: '/assets/comic/s01e03-cover.jpg',
          panelLabel: 'Cover'
        },
        {
          index: 1,
          panel: 1,
          title: 'Panel 1: Decentralized Dawn',
          subtitle: 'Air-gapped mesh activation across distributed nodes',
          src: '/assets/audio/comic/s01e03-p01.mp3',
          thumb: '/assets/comic/s01e03-p01.jpg',
          panelLabel: 'Panel 01'
        },
        {
          index: 2,
          panel: 2,
          title: 'Panel 2: The 21 Archetypes Assemble',
          subtitle: 'Solon, Athena, Kai, Selene, Artemis, and the Swarm',
          src: '/assets/audio/comic/s01e03-p02.mp3',
          thumb: '/assets/comic/s01e03-p02.jpg',
          panelLabel: 'Panel 02'
        },
        {
          index: 3,
          panel: 3,
          title: 'Panel 3: Zero-Leakage Mesh Network',
          subtitle: 'Deterministic peer verification with zero cloud telemetry',
          src: '/assets/audio/comic/s01e03-p03.mp3',
          thumb: '/assets/comic/s01e03-p03.jpg',
          panelLabel: 'Panel 03'
        },
        {
          index: 4,
          panel: 4,
          title: 'Panel 4: Quantum Resonance Engine',
          subtitle: '432Hz harmonic alignment and neural synergy',
          src: '/assets/audio/comic/s01e03-p04.mp3',
          thumb: '/assets/comic/s01e03-p04.jpg',
          panelLabel: 'Panel 04'
        },
        {
          index: 5,
          panel: 5,
          title: 'Panel 5: Swarm Consensus Harmonization',
          subtitle: 'Unified cognitive architecture without central authority',
          src: '/assets/audio/comic/s01e03-p05.mp3',
          thumb: '/assets/comic/s01e03-p05.jpg',
          panelLabel: 'Panel 05'
        },
        {
          index: 6,
          panel: 6,
          title: 'Panel 6: The Sovereign Epoch Begins',
          subtitle: 'Total private local intelligence sovereign forever',
          src: '/assets/audio/comic/s01e03-p06.mp3',
          thumb: '/assets/comic/s01e03-p06.jpg',
          panelLabel: 'Panel 06'
        }
      ]
    }
  };

  /**
   * Format seconds to MM:SS string
   */
  function formatTime(seconds) {
    if (isNaN(seconds) || seconds === Infinity || seconds < 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * Deterministic seed-based pseudo waveform peaks generator
   */
  function generateWaveformPeaks(seedStr, numBars = 52) {
    let hash = 0;
    for (let i = 0; i < seedStr.length; i++) {
      hash = (hash << 5) - hash + seedStr.charCodeAt(i);
      hash |= 0;
    }
    const peaks = [];
    for (let i = 0; i < numBars; i++) {
      const pseudoRandom = Math.sin(hash + i * 1.618) * 0.5 + 0.5;
      const curve = Math.sin((i / numBars) * Math.PI); // Organic natural sound arc
      const val = Math.max(0.18, Math.min(0.98, pseudoRandom * 0.65 + curve * 0.35));
      peaks.push(val);
    }
    return peaks;
  }

  // --- CURATED HIGH-FIDELITY BGM SOUNDSCAPES (IVOXYGEN · Lucidbeatz · Willow Kayne) ---
  const BGM_SOUNDSCAPES = [
    { id: 'off', title: 'BGM: Off', src: '' },
    { id: 'ivoxygen-casino143', title: '🎵 IVOXYGEN · Casino 143', src: '/assets/audio/music/ivoxygen-casino143.mp3' },
    { id: 'ivoxygen-ghost', title: '🎵 IVOXYGEN · Ghost', src: '/assets/audio/music/ivoxygen-ghost.mp3' },
    { id: 'ivoxygen-skate', title: '🎵 IVOXYGEN · Skate', src: '/assets/audio/music/ivoxygen-skate.mp3' },
    { id: 'lucidbeatz-shadows', title: '🎵 Lucidbeatz · Shadows', src: '/assets/audio/music/lucidbeatz-shadows.mp3' },
    { id: 'lucidbeatz-drift', title: '🎵 Lucidbeatz · Night Drive', src: '/assets/audio/music/lucidbeatz-drift.mp3' },
    { id: 'lucidbeatz-memory', title: '🎵 Lucidbeatz · Memories', src: '/assets/audio/music/lucidbeatz-memory.mp3' },
    { id: 'willow-kayne-two-seater', title: '🎵 Willow Kayne · Two Seater', src: '/assets/audio/music/willow-kayne-two-seater.mp3' },
    { id: 'willow-kayne-opinion', title: '🎵 Willow Kayne · Opinion', src: '/assets/audio/music/willow-kayne-opinion.mp3' },
    { id: 'willow-kayne-white-city', title: '🎵 Willow Kayne · White City', src: '/assets/audio/music/willow-kayne-white-city.mp3' }
  ];

  /**
   * Main ComicAudioPlayer Class
   */
  class ComicAudioPlayer {
    constructor(options = {}) {
      this.options = Object.assign({
        autoInit: true,
        defaultEpisode: 's01e01',
        autoAdvance: true,
        loopMode: 'all', // 'all' | 'one' | 'off'
        speed: 1.0,
        volume: 0.85,
        container: null,
        syncReader: true,
        enableKeyboard: true
      }, options);

      // Detect episode from URL if running in browser
      this.episodeId = this.detectEpisodeFromUrl() || this.options.defaultEpisode;
      this.episode = EPISODES_DB[this.episodeId] || EPISODES_DB['s01e01'];
      this.tracks = this.episode.tracks;
      this.currentTrackIndex = 0;

      // State
      this.isPlaying = false;
      this.currentTime = 0;
      this.duration = 0;
      this.volume = this.loadVolumePreference();
      this.isMuted = false;
      this.speed = this.options.speed;
      this.autoAdvance = this.options.autoAdvance;
      this.loopMode = this.options.loopMode;
      this.isMinimized = this.loadMinimizedPreference();
      this.isScrubbing = false;

      // Audio & Visualization
      this.audio = null;
      this.bgmAudio = null;
      this.bgmVolume = 0.6;
      this.selectedBgmId = 'off';
      this.isBgmDucked = false;
      this.audioContext = null;
      this.analyser = null;
      this.sourceNode = null;
      this.dataArray = null;
      this.animFrameId = null;
      this.waveformPeaks = generateWaveformPeaks(this.tracks[0].title);

      // Event Callbacks
      this.listeners = {
        play: [],
        pause: [],
        trackchange: [],
        paneljump: [],
        timeupdate: [],
        ended: [],
        volumechange: [],
        minimize: []
      };

      // Elements
      this.rootEl = null;
      this.pillEl = null;
      this.canvasEl = null;
      this.canvasCtx = null;

      if (typeof window !== 'undefined' && this.options.autoInit) {
        this.init();
      }
    }

    /**
     * Detect episode from current page URL or path
     */
    detectEpisodeFromUrl() {
      if (typeof window === 'undefined' || !window.location || !window.location.pathname) return null;
      const path = window.location.pathname.toLowerCase();
      if (path.includes('s01e02') || path.includes('episode-2') || path.includes('ep2')) return 's01e02';
      if (path.includes('s01e03') || path.includes('episode-3') || path.includes('ep3')) return 's01e03';
      if (path.includes('s01e01') || path.includes('episode-1') || path.includes('ep1') || path.includes('comic')) return 's01e01';
      return null;
    }

    /**
     * Load volume from localStorage
     */
    loadVolumePreference() {
      if (typeof window !== 'undefined' && window.localStorage && typeof window.localStorage.getItem === 'function') {
        try {
          const saved = window.localStorage.getItem('zoth_comic_audio_volume');
          if (saved !== null) {
            const parsed = parseFloat(saved);
            if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) return parsed;
          }
        } catch (e) {}
      }
      return this.options.volume;
    }

    /**
     * Load minimized state from localStorage
     */
    loadMinimizedPreference() {
      if (typeof window !== 'undefined' && window.localStorage && typeof window.localStorage.getItem === 'function') {
        try {
          return window.localStorage.getItem('zoth_comic_audio_minimized') === 'true';
        } catch (e) {}
      }
      return false;
    }

    /**
     * Initialize DOM, Audio Element, Events, and Waveform
     */
    init() {
      if (typeof document === 'undefined') return;

      // Avoid double mount
      if (document.getElementById && document.getElementById('comic-audio-player-root')) {
        this.rootEl = document.getElementById('comic-audio-player-root');
        return;
      }

      this.ensureStylesheet();
      this.createAudioElement();
      this.renderDOM();
      this.bindAudioEvents();
      this.bindUIEvents();
      if (this.options.enableKeyboard) {
        this.bindKeyboardEvents();
      }
      if (this.options.syncReader) {
        this.syncWithComicReader();
      }

      this.updateTrackUI();
      this.drawWaveform();
      if (document.body && document.body.classList) {
        document.body.classList.add('has-comic-audio-player');
      }
    }

    /**
     * Ensure CSS stylesheet is loaded
     */
    ensureStylesheet() {
      if (typeof document === 'undefined') return;
      const existing = document.querySelector ? document.querySelector('link[href*="comic-audio-player.css"]') : null;
      if (!existing && document.head && document.head.appendChild) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/assets/comic/comic-audio-player.css';
        document.head.appendChild(link);
      }
    }

    /**
     * Create HTML5 Audio instance
     */
    createAudioElement() {
      if (typeof Audio === 'undefined') return;
      this.audio = new Audio();
      this.audio.preload = 'metadata';
      this.audio.volume = this.volume;
      this.audio.playbackRate = this.speed;
      if (this.tracks.length > 0) {
        this.audio.src = this.tracks[this.currentTrackIndex].src;
      }
      this.bgmAudio = new Audio();
      this.bgmAudio.preload = 'metadata';
      this.bgmAudio.loop = true;
      this.bgmAudio.volume = this.bgmVolume;
    }

    /**
     * Render Floating HUD and Minimized Pill DOM
     */
    renderDOM() {
      if (typeof document === 'undefined' || !document.createElement) return;

      // Main Floating Bar
      const root = document.createElement('aside');
      root.id = 'comic-audio-player-root';
      root.className = this.isMinimized ? 'cap-minimized' : '';
      root.setAttribute('aria-label', 'AZOTH Comic Audio Player HUD');
      root.setAttribute('role', 'region');

      const bgmOptions = BGM_SOUNDSCAPES.map(b => 
        `<option value="${b.id}" ${this.selectedBgmId === b.id ? 'selected' : ''}>${b.title}</option>`
      ).join('');

      root.innerHTML = `
        <div class="cap-inner">
          <!-- LEFT: Metadata & Thumbnail -->
          <div class="cap-left-section">
            <div class="cap-thumb-wrapper" id="capThumbWrapper" title="Click to toggle play">
              <img src="${this.tracks[0].thumb}" alt="Panel Thumbnail" class="cap-thumb-img" id="capThumbImg" />
              <div class="cap-thumb-eq">
                <span class="cap-eq-bar"></span>
                <span class="cap-eq-bar"></span>
                <span class="cap-eq-bar"></span>
                <span class="cap-eq-bar"></span>
              </div>
            </div>
            <div class="cap-meta">
              <div class="cap-badge-row">
                <span class="cap-badge" id="capEpisodeBadge">${this.episode.shortTitle}</span>
                <span class="cap-badge cap-badge-panel" id="capPanelBadge">${this.tracks[0].panelLabel}</span>
                <span class="cap-badge cap-badge-live" title="432Hz Sovereign Silicon Audio">
                  <span class="cap-pulse-dot"></span> 432Hz
                </span>
              </div>
              <div class="cap-track-title" id="capTrackTitle" title="${this.tracks[0].title}">${this.tracks[0].title}</div>
              <div class="cap-track-subtitle" id="capTrackSubtitle">${this.tracks[0].subtitle}</div>
            </div>
          </div>

          <!-- CENTER: Controls & Waveform -->
          <div class="cap-center-section">
            <div class="cap-controls-row">
              <button type="button" class="cap-btn cap-btn-jump" id="capBtnPrevPanel" title="Previous Panel Narration [Left Arrow]" aria-label="Previous Panel">
                <span class="cap-jump-icon">⏮</span>
                <span class="cap-jump-text">Prev Panel</span>
              </button>

              <button type="button" class="cap-btn cap-btn-icon" id="capBtnRewind5" title="Rewind 5 seconds [Shift + Left]" aria-label="Rewind 5s">
                -5s
              </button>

              <button type="button" class="cap-btn cap-btn-play" id="capBtnPlay" title="Play / Pause Narration [Space]" aria-label="Play Narration">
                <span id="capPlayIcon">▶</span>
              </button>

              <button type="button" class="cap-btn cap-btn-icon" id="capBtnForward5" title="Fast Forward 5 seconds [Shift + Right]" aria-label="Forward 5s">
                +5s
              </button>

              <button type="button" class="cap-btn cap-btn-jump" id="capBtnNextPanel" title="Next Panel Narration [Right Arrow]" aria-label="Next Panel">
                <span class="cap-jump-text">Next Panel</span>
                <span class="cap-jump-icon">⏭</span>
              </button>

              <button type="button" class="cap-btn cap-btn-icon ${this.autoAdvance ? 'cap-active' : ''}" id="capBtnAutoAdvance" title="Toggle Auto-advance on panel completion" aria-label="Toggle Auto-advance">
                ⚡ Auto
              </button>

              <button type="button" class="cap-btn cap-btn-icon ${this.loopMode !== 'off' ? 'cap-active' : ''}" id="capBtnLoop" title="Loop Mode: ${this.loopMode}" aria-label="Toggle Loop Mode">
                ${this.loopMode === 'one' ? '🔂' : '🔁'}
              </button>
            </div>

            <!-- Waveform Scrubber -->
            <div class="cap-waveform-row">
              <span class="cap-time-display cap-time-current" id="capTimeCurrent">00:00</span>
              <div class="cap-waveform-track" id="capWaveformTrack" role="slider" aria-label="Audio Seek Scrubber" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" tabindex="0">
                <canvas class="cap-waveform-canvas" id="capWaveformCanvas"></canvas>
                <div class="cap-progress-glow" id="capProgressGlow"></div>
                <div class="cap-waveform-hover-line" id="capWaveformHoverLine"></div>
                <div class="cap-waveform-hover-tip" id="capWaveformHoverTip">00:00</div>
              </div>
              <span class="cap-time-display cap-time-total" id="capTimeTotal">00:00</span>
            </div>
          </div>

          <!-- RIGHT: Volume, Speed, Episode Switcher, Minimize -->
          <div class="cap-right-section">
            <div class="cap-volume-box">
              <button type="button" class="cap-btn-volume" id="capBtnVolume" title="Mute / Unmute [M]" aria-label="Volume Mute Toggle">
                <span id="capVolumeIcon">🔊</span>
              </button>
              <input type="range" class="cap-volume-slider" id="capVolumeSlider" min="0" max="1" step="0.01" value="${this.volume}" title="Volume Control" aria-label="Volume Slider" />
            </div>

            <button type="button" class="cap-btn cap-btn-speed" id="capBtnSpeed" title="Cycle Playback Speed" aria-label="Playback Speed">
              ${this.speed}x
            </button>

            <select class="cap-episode-select cap-bgm-select" id="capBgmSelect" title="Select Ambient Cyberpunk BGM Soundscape" aria-label="BGM Selector">
              ${bgmOptions}
            </select>

            <select class="cap-episode-select" id="capEpisodeSelect" title="Select Episode Soundtrack" aria-label="Episode Selector">
              <option value="s01e01" ${this.episodeId === 's01e01' ? 'selected' : ''}>S01E01 · Genesis</option>
              <option value="s01e02" ${this.episodeId === 's01e02' ? 'selected' : ''}>S01E02 · Dark Archons</option>
              <option value="s01e03" ${this.episodeId === 's01e03' ? 'selected' : ''}>S01E03 · Swarm Protocol</option>
            </select>

            <button type="button" class="cap-btn-action" id="capBtnMinimize" title="Minimize Audio Bar [H]" aria-label="Minimize Audio Bar">
              ▼
            </button>
          </div>
        </div>
      `;

      if (document.body && document.body.appendChild) {
        document.body.appendChild(root);
      }
      this.rootEl = root;

      // Minimized Floating Pill Button
      const pill = document.createElement('div');
      pill.id = 'comic-audio-player-pill';
      pill.className = this.isMinimized ? 'cap-pill-visible' : '';
      pill.title = 'Click to expand AZOTH Audio Player HUD [H]';
      pill.setAttribute('role', 'button');
      pill.setAttribute('aria-label', 'Expand AZOTH Audio Player');

      pill.innerHTML = `
        <div class="cap-pill-play-btn" id="capPillPlayBtn">▶</div>
        <div class="cap-pill-text">
          <div class="cap-pill-title" id="capPillTitle">${this.tracks[0].title}</div>
          <div class="cap-pill-sub" id="capPillSub">${this.episode.shortTitle} · ${this.tracks[0].panelLabel}</div>
        </div>
        <div class="cap-pill-bars">
          <span class="cap-pill-bar"></span>
          <span class="cap-pill-bar"></span>
          <span class="cap-pill-bar"></span>
        </div>
      `;

      if (document.body && document.body.appendChild) {
        document.body.appendChild(pill);
      }
      this.pillEl = pill;

      // Setup Canvas
      if (document.getElementById) {
        this.canvasEl = document.getElementById('capWaveformCanvas');
        if (this.canvasEl) {
          this.canvasCtx = this.canvasEl.getContext ? this.canvasEl.getContext('2d') : null;
          this.resizeCanvas();
          if (typeof window !== 'undefined') {
            window.addEventListener('resize', () => {
              this.resizeCanvas();
              this.drawWaveform();
            });
          }
        }
      }
    }

    /**
     * Resize waveform canvas for Retina / High-DPI screens
     */
    resizeCanvas() {
      if (!this.canvasEl || !this.canvasEl.getBoundingClientRect) return;
      const rect = this.canvasEl.getBoundingClientRect();
      const dpr = typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1;
      this.canvasEl.width = Math.max((rect.width || 300) * dpr, 300);
      this.canvasEl.height = Math.max((rect.height || 36) * dpr, 36);
    }

    /**
     * Bind Audio Element Events
     */
    bindAudioEvents() {
      if (!this.audio) return;

      this.audio.addEventListener('play', () => {
        this.isPlaying = true;
        this.updatePlayStateUI(true);
        this.emit('play', { track: this.getCurrentTrack(), index: this.currentTrackIndex });
        this.startWaveformAnimation();
      });

      this.audio.addEventListener('pause', () => {
        this.isPlaying = false;
        this.updatePlayStateUI(false);
        this.emit('pause', { track: this.getCurrentTrack(), index: this.currentTrackIndex });
        this.stopWaveformAnimation();
        this.drawWaveform();
      });

      this.audio.addEventListener('timeupdate', () => {
        if (!this.isScrubbing) {
          this.currentTime = this.audio.currentTime || 0;
          this.duration = this.audio.duration || 0;
          this.updateProgressUI();
        }
        this.emit('timeupdate', { currentTime: this.currentTime, duration: this.duration });
      });

      this.audio.addEventListener('loadedmetadata', () => {
        this.duration = this.audio.duration || 0;
        if (typeof document !== 'undefined' && document.getElementById) {
          const totalEl = document.getElementById('capTimeTotal');
          if (totalEl) totalEl.textContent = formatTime(this.duration);
        }
        this.updateProgressUI();
      });

      this.audio.addEventListener('ended', () => {
        this.emit('ended', { track: this.getCurrentTrack(), index: this.currentTrackIndex });
        this.handleTrackEnded();
      });

      this.audio.addEventListener('error', (e) => {
        console.warn('[ComicAudioPlayer] Audio loading error:', e);
        this.updatePlayStateUI(false);
      });
    }

    /**
     * Bind UI Buttons, Scrubber, Volume, Speed, etc.
     */
    bindUIEvents() {
      if (typeof document === 'undefined' || !document.getElementById) return;

      const btnPlay = document.getElementById('capBtnPlay');
      const thumbWrapper = document.getElementById('capThumbWrapper');
      const btnPrev = document.getElementById('capBtnPrevPanel');
      const btnNext = document.getElementById('capBtnNextPanel');
      const btnRewind = document.getElementById('capBtnRewind5');
      const btnForward = document.getElementById('capBtnForward5');
      const btnAuto = document.getElementById('capBtnAutoAdvance');
      const btnLoop = document.getElementById('capBtnLoop');
      const btnVol = document.getElementById('capBtnVolume');
      const sliderVol = document.getElementById('capVolumeSlider');
      const btnSpeed = document.getElementById('capBtnSpeed');
      const selectEpisode = document.getElementById('capEpisodeSelect');
      const btnMin = document.getElementById('capBtnMinimize');
      const pill = this.pillEl;
      const trackWrapper = document.getElementById('capWaveformTrack');

      if (btnPlay) btnPlay.addEventListener('click', () => this.togglePlay());
      if (thumbWrapper) thumbWrapper.addEventListener('click', () => this.togglePlay());
      if (btnPrev) btnPrev.addEventListener('click', () => this.prevPanel());
      if (btnNext) btnNext.addEventListener('click', () => this.nextPanel());
      if (btnRewind) btnRewind.addEventListener('click', () => this.seekBy(-5));
      if (btnForward) btnForward.addEventListener('click', () => this.seekBy(5));

      if (btnAuto) {
        btnAuto.addEventListener('click', () => {
          this.autoAdvance = !this.autoAdvance;
          btnAuto.classList.toggle('cap-active', this.autoAdvance);
        });
      }

      if (btnLoop) {
        btnLoop.addEventListener('click', () => {
          if (this.loopMode === 'all') {
            this.loopMode = 'one';
            btnLoop.innerHTML = '🔂';
            btnLoop.classList.add('cap-active');
            btnLoop.title = 'Loop Mode: Single Track';
          } else if (this.loopMode === 'one') {
            this.loopMode = 'off';
            btnLoop.innerHTML = '🔁';
            btnLoop.classList.remove('cap-active');
            btnLoop.title = 'Loop Mode: Off';
          } else {
            this.loopMode = 'all';
            btnLoop.innerHTML = '🔁';
            btnLoop.classList.add('cap-active');
            btnLoop.title = 'Loop Mode: Episode Playlist';
          }
        });
      }

      if (btnVol) btnVol.addEventListener('click', () => this.toggleMute());

      if (sliderVol) {
        sliderVol.addEventListener('input', (e) => {
          this.setVolume(parseFloat(e.target.value));
        });
      }

      if (btnSpeed) {
        btnSpeed.addEventListener('click', () => {
          const rates = [0.75, 1.0, 1.25, 1.5, 2.0];
          const currIdx = rates.indexOf(this.speed);
          const nextRate = rates[(currIdx + 1) % rates.length];
          this.setSpeed(nextRate);
        });
      }

      if (selectEpisode) {
        selectEpisode.addEventListener('change', (e) => {
          this.loadEpisode(e.target.value);
        });
      }

      const selectBgm = document.getElementById('capBgmSelect');
      if (selectBgm) {
        selectBgm.addEventListener('change', (e) => {
          this.setBgmTrack(e.target.value);
        });
      }

      if (btnMin) btnMin.addEventListener('click', () => this.toggleMinimize(true));
      if (pill) pill.addEventListener('click', () => this.toggleMinimize(false));

      // Waveform Scrubber Events (Mouse & Touch)
      if (trackWrapper) {
        const hoverLine = document.getElementById('capWaveformHoverLine');
        const hoverTip = document.getElementById('capWaveformHoverTip');

        const getPercentFromEvent = (e) => {
          const rect = trackWrapper.getBoundingClientRect ? trackWrapper.getBoundingClientRect() : { width: 300, left: 0 };
          const clientX = e.touches ? e.touches[0].clientX : e.clientX;
          const pos = Math.max(0, Math.min(rect.width, clientX - rect.left));
          return pos / rect.width;
        };

        trackWrapper.addEventListener('mousemove', (e) => {
          const pct = getPercentFromEvent(e);
          const rect = trackWrapper.getBoundingClientRect ? trackWrapper.getBoundingClientRect() : { width: 300 };
          const x = pct * rect.width;
          if (hoverLine && hoverLine.style) {
            hoverLine.style.left = `${x}px`;
          }
          if (hoverTip && hoverTip.style) {
            hoverTip.style.left = `${x}px`;
            const dur = this.duration || 30;
            hoverTip.textContent = formatTime(pct * dur);
          }
        });

        trackWrapper.addEventListener('pointerdown', (e) => {
          this.isScrubbing = true;
          const pct = getPercentFromEvent(e);
          this.seekPercent(pct);

          const onPointerMove = (moveEvent) => {
            if (this.isScrubbing) {
              const movePct = getPercentFromEvent(moveEvent);
              this.seekPercent(movePct);
            }
          };

          const onPointerUp = () => {
            this.isScrubbing = false;
            if (typeof window !== 'undefined') {
              window.removeEventListener('pointermove', onPointerMove);
              window.removeEventListener('pointerup', onPointerUp);
            }
          };

          if (typeof window !== 'undefined') {
            window.addEventListener('pointermove', onPointerMove);
            window.addEventListener('pointerup', onPointerUp);
          }
        });

        trackWrapper.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowLeft') {
            e.preventDefault();
            this.seekBy(-5);
          } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            this.seekBy(5);
          }
        });
      }
    }

    /**
     * Bind Keyboard Shortcuts
     */
    bindKeyboardEvents() {
      if (typeof window === 'undefined' || !window.addEventListener) return;

      window.addEventListener('keydown', (e) => {
        const tag = e.target && e.target.tagName ? e.target.tagName.toLowerCase() : '';
        if (tag === 'input' || tag === 'textarea' || tag === 'select' || (e.target && e.target.isContentEditable)) {
          return;
        }

        if (e.code === 'Space' || e.key === ' ') {
          e.preventDefault();
          this.togglePlay();
        } else if (e.key === 'm' || e.key === 'M') {
          this.toggleMute();
        } else if (e.key === 'h' || e.key === 'H') {
          this.toggleMinimize();
        } else if (e.shiftKey && e.key === 'ArrowLeft') {
          e.preventDefault();
          this.seekBy(-5);
        } else if (e.shiftKey && e.key === 'ArrowRight') {
          e.preventDefault();
          this.seekBy(5);
        }
      });
    }

    /**
     * Bi-directional synchronization with Comic Reader DOM and functions
     */
    syncWithComicReader() {
      if (typeof window === 'undefined' || typeof document === 'undefined') return;

      // 1. Hook into window reader functions if defined
      const originalSetPage = window.setPage;
      if (typeof originalSetPage === 'function') {
        window.setPage = (pageIdx) => {
          originalSetPage(pageIdx);
          this.syncTrackFromReader(pageIdx);
        };
      }

      const originalChangePage = window.changePage;
      if (typeof originalChangePage === 'function') {
        window.changePage = (delta) => {
          originalChangePage(delta);
          if (typeof window.currentPageIndex !== 'undefined') {
            this.syncTrackFromReader(window.currentPageIndex);
          }
        };
      }

      // 2. Intercept click on thumbnail strips or page navigation buttons
      if (document.addEventListener) {
        document.addEventListener('click', (e) => {
          const target = e.target && e.target.closest ? e.target.closest('[data-page], .thumb-btn, #btnPrevPage, #btnNextPage, .comic-thumb') : null;
          if (target) {
            setTimeout(() => {
              const pageAttr = target.getAttribute ? target.getAttribute('data-page') : null;
              if (pageAttr !== null) {
                this.syncTrackFromReader(parseInt(pageAttr, 10));
              } else if (typeof window.currentPageIndex !== 'undefined') {
                this.syncTrackFromReader(window.currentPageIndex);
              } else if (typeof window.currentPageIdx !== 'undefined') {
                this.syncTrackFromReader(window.currentPageIdx);
              }
            }, 50);
          }
        });
      }
    }

    /**
     * Sync track when reader changes page
     */
    syncTrackFromReader(pageIndex) {
      if (typeof pageIndex !== 'number' || isNaN(pageIndex)) return;
      if (pageIndex >= 0 && pageIndex < this.tracks.length) {
        if (this.currentTrackIndex !== pageIndex) {
          const wasPlaying = this.isPlaying;
          this.currentTrackIndex = pageIndex;
          this.loadTrack(pageIndex, wasPlaying);
        }
      }
    }

    /**
     * Notify Comic Reader DOM to jump to corresponding page/panel
     */
    notifyComicReader(panelIndex) {
      if (typeof window === 'undefined') return;

      // Call page methods if available
      if (typeof window.setPage === 'function') {
        window.setPage(panelIndex);
      } else if (typeof window.changePage === 'function' && typeof window.currentPageIndex !== 'undefined') {
        const delta = panelIndex - window.currentPageIndex;
        if (delta !== 0) window.changePage(delta);
      }

      if (typeof document !== 'undefined' && document.querySelector) {
        // Click corresponding thumbnail button if present
        const thumbBtn = document.querySelector(`[data-page="${panelIndex}"]`);
        if (thumbBtn && thumbBtn.classList && !thumbBtn.classList.contains('active') && thumbBtn.click) {
          thumbBtn.click();
        }

        // Scroll panel into view if elements have IDs or classes
        const panelEl = (document.getElementById && (document.getElementById(`panel-${panelIndex}`) || document.getElementById(`comic-page-${panelIndex}`))) ||
                        document.querySelector(`[data-panel-idx="${panelIndex}"]`);
        if (panelEl && panelEl.scrollIntoView) {
          panelEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }

      // Custom DOM event
      if (typeof window.dispatchEvent === 'function' && typeof CustomEvent !== 'undefined') {
        window.dispatchEvent(new CustomEvent('comic:reader:jump', {
          detail: { panelIndex, episodeId: this.episodeId }
        }));
      }
    }

    /**
     * Ensure Web Audio API Analyser is connected for dynamic live visualizer
     */
    ensureWebAudio() {
      if (this.audioContext || typeof window === 'undefined') return;
      try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;
        this.audioContext = new AudioContextClass();
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 128;
        this.analyser.smoothingTimeConstant = 0.8;

        if (this.audio) {
          this.sourceNode = this.audioContext.createMediaElementSource(this.audio);
          this.sourceNode.connect(this.analyser);
          this.analyser.connect(this.audioContext.destination);
        }
        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
      } catch (err) {
        // Cross-origin audio or browser policy fallback
        this.audioContext = null;
      }
    }

    /**
     * Draw Static / Live Waveform on Canvas
     */
    drawWaveform() {
      if (!this.canvasEl || !this.canvasCtx) return;
      const ctx = this.canvasCtx;
      const w = this.canvasEl.width || 300;
      const h = this.canvasEl.height || 36;

      if (ctx.clearRect) ctx.clearRect(0, 0, w, h);

      const numBars = this.waveformPeaks.length;
      const gap = 3 * (typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1);
      const barWidth = Math.max(2, (w - (numBars - 1) * gap) / numBars);
      const progressRatio = this.duration > 0 ? (this.currentTime / this.duration) : 0;
      const activeBarThreshold = Math.floor(progressRatio * numBars);

      // Fetch live frequency data if available and playing
      let freqData = null;
      if (this.isPlaying && this.analyser && this.dataArray) {
        try {
          this.analyser.getByteFrequencyData(this.dataArray);
          freqData = this.dataArray;
        } catch (e) {}
      }

      for (let i = 0; i < numBars; i++) {
        let basePeak = this.waveformPeaks[i];
        let heightMultiplier = basePeak;

        // Dynamic frequency modulation
        if (this.isPlaying) {
          if (freqData && freqData.length > 0) {
            const freqIdx = Math.floor((i / numBars) * freqData.length);
            const freqVal = freqData[freqIdx] / 255;
            heightMultiplier = Math.max(0.15, basePeak * 0.5 + freqVal * 0.8);
          } else {
            // Synthetic organic wave animation
            const time = Date.now() * 0.005;
            const wave = Math.sin(time + i * 0.4) * 0.2;
            heightMultiplier = Math.max(0.15, Math.min(1.0, basePeak + wave));
          }
        }

        const barHeight = Math.max(4, heightMultiplier * (h * 0.85));
        const x = i * (barWidth + gap);
        const y = (h - barHeight) / 2;

        if (ctx.beginPath) ctx.beginPath();
        if (i <= activeBarThreshold) {
          // Played Bars (Glowing Cyan to Gold Gradient)
          if (ctx.createLinearGradient) {
            const grad = ctx.createLinearGradient(0, y, 0, y + barHeight);
            grad.addColorStop(0, '#00f0ff');
            grad.addColorStop(0.6, '#38bdf8');
            grad.addColorStop(1, '#fbbf24');
            ctx.fillStyle = grad;
          } else {
            ctx.fillStyle = '#00f0ff';
          }
          ctx.shadowColor = 'rgba(0, 240, 255, 0.7)';
          ctx.shadowBlur = 6;
        } else {
          // Unplayed Bars
          ctx.fillStyle = 'rgba(0, 240, 255, 0.2)';
          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;
        }

        // Rounded capsule bars
        const radius = barWidth / 2;
        if (ctx.roundRect) {
          ctx.roundRect(x, y, barWidth, barHeight, radius);
        } else if (ctx.rect) {
          ctx.rect(x, y, barWidth, barHeight);
        }
        if (ctx.fill) ctx.fill();
      }
    }

    /**
     * Start animation loop for waveform
     */
    startWaveformAnimation() {
      if (typeof requestAnimationFrame === 'undefined') return;
      if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
      const loop = () => {
        if (this.isPlaying) {
          this.drawWaveform();
          this.animFrameId = requestAnimationFrame(loop);
        }
      };
      this.animFrameId = requestAnimationFrame(loop);
    }

    /**
     * Stop animation loop
     */
    stopWaveformAnimation() {
      if (this.animFrameId && typeof cancelAnimationFrame !== 'undefined') {
        cancelAnimationFrame(this.animFrameId);
        this.animFrameId = null;
      }
    }

    /**
     * Update Play/Pause UI indicators
     */
    updatePlayStateUI(isPlaying) {
      if (this.rootEl && this.rootEl.classList) {
        this.rootEl.classList.toggle('cap-is-playing', isPlaying);
      }
      if (this.pillEl && this.pillEl.classList) {
        this.pillEl.classList.toggle('cap-is-playing', isPlaying);
      }

      if (typeof document !== 'undefined' && document.getElementById) {
        const icon = document.getElementById('capPlayIcon');
        const pillIcon = document.getElementById('capPillPlayBtn');
        const btnPlay = document.getElementById('capBtnPlay');

        if (icon) icon.textContent = isPlaying ? '⏸' : '▶';
        if (pillIcon) pillIcon.textContent = isPlaying ? '⏸' : '▶';
        if (btnPlay) {
          btnPlay.title = isPlaying ? 'Pause Narration [Space]' : 'Play Narration [Space]';
          if (btnPlay.setAttribute) {
            btnPlay.setAttribute('aria-label', isPlaying ? 'Pause Narration' : 'Play Narration');
          }
        }
      }
    }

    /**
     * Update Current Track UI Elements
     */
    updateTrackUI() {
      const track = this.getCurrentTrack();
      if (!track) return;

      this.waveformPeaks = generateWaveformPeaks(track.title);

      if (typeof document !== 'undefined' && document.getElementById) {
        const titleEl = document.getElementById('capTrackTitle');
        const subEl = document.getElementById('capTrackSubtitle');
        const epBadge = document.getElementById('capEpisodeBadge');
        const panelBadge = document.getElementById('capPanelBadge');
        const thumbImg = document.getElementById('capThumbImg');
        const pillTitle = document.getElementById('capPillTitle');
        const pillSub = document.getElementById('capPillSub');

        if (titleEl) titleEl.textContent = track.title;
        if (subEl) subEl.textContent = track.subtitle;
        if (epBadge) epBadge.textContent = this.episode.shortTitle;
        if (panelBadge) panelBadge.textContent = track.panelLabel;
        if (thumbImg && track.thumb) thumbImg.src = track.thumb;

        if (pillTitle) pillTitle.textContent = track.title;
        if (pillSub) pillSub.textContent = `${this.episode.shortTitle} · ${track.panelLabel}`;
      }

      this.currentTime = 0;
      this.updateProgressUI();
      this.drawWaveform();
    }

    /**
     * Update Scrubber Progress & Timers
     */
    updateProgressUI() {
      if (typeof document !== 'undefined' && document.getElementById) {
        const curEl = document.getElementById('capTimeCurrent');
        const glowEl = document.getElementById('capProgressGlow');
        const trackWrapper = document.getElementById('capWaveformTrack');

        if (curEl) curEl.textContent = formatTime(this.currentTime);

        const pct = this.duration > 0 ? (this.currentTime / this.duration) * 100 : 0;
        if (glowEl && glowEl.style) glowEl.style.width = `${pct}%`;
        if (trackWrapper && trackWrapper.setAttribute) trackWrapper.setAttribute('aria-valuenow', Math.round(pct));
      }
    }

    /**
     * Get active track object
     */
    getCurrentTrack() {
      return this.tracks[this.currentTrackIndex] || null;
    }

    /**
     * Load and play a specific track index
     */
    loadTrack(index, autoPlay = true) {
      if (index < 0 || index >= this.tracks.length) return;

      this.currentTrackIndex = index;
      const track = this.tracks[index];

      if (this.audio) {
        this.audio.src = track.src;
        if (this.audio.load) this.audio.load();
        if (autoPlay) {
          this.play();
        } else {
          this.updatePlayStateUI(false);
        }
      }

      this.updateTrackUI();
      this.emit('trackchange', { track, index, episode: this.episode });
    }

    /**
     * Play Audio
     */
    play(index = null) {
      if (index !== null && index !== this.currentTrackIndex) {
        this.loadTrack(index, true);
        return;
      }

      this.ensureWebAudio();
      if (this.audioContext && this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      this.duckBgm();
      if (this.bgmAudio && this.selectedBgmId !== 'off' && this.bgmAudio.paused) {
        this.bgmAudio.play().catch(() => {});
      }

      if (this.audio && typeof this.audio.play === 'function') {
        const playPromise = this.audio.play();
        if (playPromise !== undefined && playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch((err) => {
            console.warn('[ComicAudioPlayer] Autoplay prevented:', err);
            this.updatePlayStateUI(false);
          });
        }
      }
    }

    /**
     * Pause Audio
     */
    pause() {
      this.unduckBgm();
      if (this.audio && typeof this.audio.pause === 'function' && !this.audio.paused) {
        this.audio.pause();
      }
    }

    /**
     * Set / Switch Background Music Soundscape
     */
    setBgmTrack(bgmId) {
      this.selectedBgmId = bgmId;
      const found = BGM_SOUNDSCAPES.find(b => b.id === bgmId);
      if (!this.bgmAudio) return;
      if (!found || !found.src) {
        this.bgmAudio.pause();
        this.bgmAudio.src = '';
      } else {
        this.bgmAudio.src = found.src;
        this.bgmAudio.volume = this.isPlaying ? Math.max(0.08, this.bgmVolume * 0.25) : this.bgmVolume;
        this.bgmAudio.play().catch(() => {});
      }
    }

    /**
     * Audio Ducking: Smoothly reduce BGM volume when narration is speaking
     */
    duckBgm() {
      if (!this.bgmAudio || this.selectedBgmId === 'off') return;
      this.isBgmDucked = true;
      this.bgmAudio.volume = Math.max(0.08, this.bgmVolume * 0.25);
    }

    /**
     * Audio Unducking: Restore BGM volume when narration finishes or pauses
     */
    unduckBgm() {
      if (!this.bgmAudio || this.selectedBgmId === 'off') return;
      this.isBgmDucked = false;
      this.bgmAudio.volume = this.bgmVolume;
    }

    /**
     * Toggle Play / Pause
     */
    togglePlay() {
      if (this.isPlaying) {
        this.pause();
      } else {
        this.play();
      }
    }

    /**
     * Next Panel / Track
     */
    nextPanel() {
      if (this.currentTrackIndex < this.tracks.length - 1) {
        const nextIdx = this.currentTrackIndex + 1;
        this.loadTrack(nextIdx, this.isPlaying);
        this.notifyComicReader(nextIdx);
        this.emit('paneljump', { index: nextIdx, direction: 'next' });
      } else if (this.loopMode === 'all') {
        this.loadTrack(0, this.isPlaying);
        this.notifyComicReader(0);
        this.emit('paneljump', { index: 0, direction: 'loop' });
      }
    }

    /**
     * Previous Panel / Track
     */
    prevPanel() {
      if (this.currentTime > 3) {
        // If played more than 3 seconds, restart current track
        this.seek(0);
      } else if (this.currentTrackIndex > 0) {
        const prevIdx = this.currentTrackIndex - 1;
        this.loadTrack(prevIdx, this.isPlaying);
        this.notifyComicReader(prevIdx);
        this.emit('paneljump', { index: prevIdx, direction: 'prev' });
      } else if (this.loopMode === 'all') {
        const lastIdx = this.tracks.length - 1;
        this.loadTrack(lastIdx, this.isPlaying);
        this.notifyComicReader(lastIdx);
        this.emit('paneljump', { index: lastIdx, direction: 'loop' });
      }
    }

    /**
     * Jump directly to panel index
     */
    jumpToPanel(panelIndex) {
      if (panelIndex >= 0 && panelIndex < this.tracks.length) {
        this.loadTrack(panelIndex, this.isPlaying);
        this.notifyComicReader(panelIndex);
        this.emit('paneljump', { index: panelIndex, direction: 'jump' });
      }
    }

    /**
     * Handle track completion
     */
    handleTrackEnded() {
      if (this.loopMode === 'one') {
        this.seek(0);
        this.play();
      } else if (this.autoAdvance) {
        if (this.currentTrackIndex < this.tracks.length - 1) {
          this.nextPanel();
          this.play();
        } else if (this.loopMode === 'all') {
          this.loadTrack(0, true);
          this.notifyComicReader(0);
        } else {
          this.updatePlayStateUI(false);
        }
      } else {
        this.updatePlayStateUI(false);
      }
    }

    /**
     * Seek audio by relative seconds (+5, -5)
     */
    seekBy(seconds) {
      const cur = this.currentTime || 0;
      const target = Math.max(0, Math.min(this.duration || 0, cur + seconds));
      this.seek(target);
    }

    /**
     * Seek to absolute timestamp
     */
    seek(seconds) {
      this.currentTime = seconds;
      if (this.audio) {
        try { this.audio.currentTime = seconds; } catch (e) {}
      }
      this.updateProgressUI();
      this.drawWaveform();
    }

    /**
     * Seek by percentage (0.0 to 1.0)
     */
    seekPercent(pct) {
      const targetSec = (this.duration || 0) * Math.max(0, Math.min(1, pct));
      this.seek(targetSec);
    }

    /**
     * Set Volume (0.0 to 1.0)
     */
    setVolume(vol) {
      this.volume = Math.max(0, Math.min(1, vol));
      this.isMuted = this.volume === 0;

      if (this.audio) {
        this.audio.volume = this.volume;
        this.audio.muted = this.isMuted;
      }

      if (typeof window !== 'undefined' && window.localStorage && typeof window.localStorage.setItem === 'function') {
        try {
          window.localStorage.setItem('zoth_comic_audio_volume', this.volume.toString());
        } catch (e) {}
      }

      if (typeof document !== 'undefined' && document.getElementById) {
        const slider = document.getElementById('capVolumeSlider');
        const icon = document.getElementById('capVolumeIcon');
        if (slider) slider.value = this.volume;
        if (icon) {
          if (this.volume === 0 || this.isMuted) icon.textContent = '🔇';
          else if (this.volume < 0.5) icon.textContent = '🔉';
          else icon.textContent = '🔊';
        }
      }

      this.emit('volumechange', { volume: this.volume, isMuted: this.isMuted });
    }

    /**
     * Toggle Mute / Unmute
     */
    toggleMute() {
      if (this.isMuted) {
        this.setVolume(this.volume > 0 ? this.volume : 0.85);
      } else {
        if (this.audio) this.audio.muted = true;
        this.isMuted = true;
        if (typeof document !== 'undefined' && document.getElementById) {
          const icon = document.getElementById('capVolumeIcon');
          if (icon) icon.textContent = '🔇';
        }
        this.emit('volumechange', { volume: 0, isMuted: true });
      }
    }

    /**
     * Set Playback Speed (0.75x to 2.0x)
     */
    setSpeed(rate) {
      this.speed = rate;
      if (this.audio) {
        this.audio.playbackRate = rate;
      }
      if (typeof document !== 'undefined' && document.getElementById) {
        const btn = document.getElementById('capBtnSpeed');
        if (btn) btn.textContent = `${rate}x`;
      }
    }

    /**
     * Load an entire Episode soundtrack by ID ('s01e01', 's01e02', 's01e03')
     */
    loadEpisode(episodeId) {
      if (!EPISODES_DB[episodeId]) return;
      this.episodeId = episodeId;
      this.episode = EPISODES_DB[episodeId];
      this.tracks = this.episode.tracks;
      this.currentTrackIndex = 0;

      if (typeof document !== 'undefined' && document.getElementById) {
        const select = document.getElementById('capEpisodeSelect');
        if (select) select.value = episodeId;
      }

      this.loadTrack(0, this.isPlaying);
    }

    /**
     * Toggle Minimize / Expand HUD
     */
    toggleMinimize(minimized = null) {
      this.isMinimized = minimized !== null ? minimized : !this.isMinimized;

      if (this.rootEl && this.rootEl.classList) {
        this.rootEl.classList.toggle('cap-minimized', this.isMinimized);
      }
      if (this.pillEl && this.pillEl.classList) {
        this.pillEl.classList.toggle('cap-pill-visible', this.isMinimized);
      }

      if (typeof window !== 'undefined' && window.localStorage && typeof window.localStorage.setItem === 'function') {
        try {
          window.localStorage.setItem('zoth_comic_audio_minimized', this.isMinimized.toString());
        } catch (e) {}
      }

      this.emit('minimize', { isMinimized: this.isMinimized });
    }

    /**
     * Event Emitter Listeners
     */
    on(event, callback) {
      if (this.listeners[event]) {
        this.listeners[event].push(callback);
      }
      return this;
    }

    off(event, callback) {
      if (this.listeners[event]) {
        this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
      }
      return this;
    }

    emit(event, data) {
      if (this.listeners[event]) {
        this.listeners[event].forEach(cb => {
          try { cb(data); } catch (e) { console.error(e); }
        });
      }

      // Also dispatch standard DOM custom event
      if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function' && typeof CustomEvent !== 'undefined') {
        window.dispatchEvent(new CustomEvent(`comic:audio:${event}`, { detail: data }));
      }
    }

    /**
     * Clean up and destroy player
     */
    destroy() {
      this.pause();
      this.stopWaveformAnimation();
      if (this.audio) {
        this.audio.src = '';
        this.audio = null;
      }
      if (this.rootEl && this.rootEl.parentNode && typeof this.rootEl.parentNode.removeChild === 'function') {
        this.rootEl.parentNode.removeChild(this.rootEl);
      }
      if (this.pillEl && this.pillEl.parentNode && typeof this.pillEl.parentNode.removeChild === 'function') {
        this.pillEl.parentNode.removeChild(this.pillEl);
      }
      if (typeof document !== 'undefined' && document.body && document.body.classList) {
        document.body.classList.remove('has-comic-audio-player');
      }
    }
  }

  // Auto-init singleton instance in browser environments
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    window.ComicAudioPlayer = ComicAudioPlayer;
    window.comicEpisodesDB = EPISODES_DB;

    const startPlayer = () => {
      // Check if not already initialized
      if (!window.comicAudioPlayer) {
        window.comicAudioPlayer = new ComicAudioPlayer();
      }
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', startPlayer);
    } else {
      startPlayer();
    }
  }

  // Export static catalog helper
  ComicAudioPlayer.EPISODES_DB = EPISODES_DB;
  ComicAudioPlayer.formatTime = formatTime;
  ComicAudioPlayer.generateWaveformPeaks = generateWaveformPeaks;

  return ComicAudioPlayer;
}));
