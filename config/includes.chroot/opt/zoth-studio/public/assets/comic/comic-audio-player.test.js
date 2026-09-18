/**
 * AZOTH Comic Audio Player Comprehensive Unit Test Suite
 * Run with: node public/assets/comic/comic-audio-player.test.js
 */

const assert = require('assert');
const ComicAudioPlayer = require('./comic-audio-player.js');

let pass = 0;
let fail = 0;

function test(name, fn) {
  try {
    fn();
    pass++;
    console.log(`[32m✔ PASS[0m: ${name}`);
  } catch (err) {
    fail++;
    console.error(`[31m✘ FAIL[0m: ${name}`);
    console.error(err);
  }
}

console.log('\n⚡ ========================================================');
console.log('⚡ AZOTH COMIC AUDIO PLAYER HUD TEST SUITE');
console.log('⚡ ========================================================\n');

// 1. Static Catalog & Database
test('EPISODES_DB contains all Season 1 episodes with 7 panels each', () => {
  const db = ComicAudioPlayer.EPISODES_DB;
  assert.ok(db['s01e01'], 's01e01 exists');
  assert.ok(db['s01e02'], 's01e02 exists');
  assert.ok(db['s01e03'], 's01e03 exists');

  assert.strictEqual(db['s01e01'].tracks.length, 7, 'Episode 1 has 7 tracks');
  assert.strictEqual(db['s01e02'].tracks.length, 7, 'Episode 2 has 7 tracks');
  assert.strictEqual(db['s01e03'].tracks.length, 7, 'Episode 3 has 7 tracks');

  db['s01e01'].tracks.forEach((t, i) => {
    assert.strictEqual(t.index, i);
    assert.ok(t.title && t.title.length > 0, 'track has title');
    assert.ok(t.src.endsWith('.mp3'), 'track src is an mp3');
    assert.ok(t.thumb.endsWith('.jpg'), 'track thumb is a jpg');
    assert.ok(t.panelLabel, 'track has panel label');
  });
});

// 2. formatTime Helper
test('formatTime helper converts seconds to MM:SS correctly', () => {
  assert.strictEqual(ComicAudioPlayer.formatTime(0), '00:00');
  assert.strictEqual(ComicAudioPlayer.formatTime(9), '00:09');
  assert.strictEqual(ComicAudioPlayer.formatTime(45), '00:45');
  assert.strictEqual(ComicAudioPlayer.formatTime(65), '01:05');
  assert.strictEqual(ComicAudioPlayer.formatTime(125), '02:05');
  assert.strictEqual(ComicAudioPlayer.formatTime(3600), '60:00');
  assert.strictEqual(ComicAudioPlayer.formatTime(NaN), '00:00');
  assert.strictEqual(ComicAudioPlayer.formatTime(-10), '00:00');
  assert.strictEqual(ComicAudioPlayer.formatTime(Infinity), '00:00');
});

// 3. Waveform Peaks Generator
test('generateWaveformPeaks produces deterministic normalized peak values', () => {
  const peaks1 = ComicAudioPlayer.generateWaveformPeaks('Test Track 1', 48);
  const peaks2 = ComicAudioPlayer.generateWaveformPeaks('Test Track 1', 48);
  const peaksDifferent = ComicAudioPlayer.generateWaveformPeaks('Different Title', 48);

  assert.strictEqual(peaks1.length, 48);
  assert.deepStrictEqual(peaks1, peaks2, 'Deterministic for same seed');
  assert.notDeepStrictEqual(peaks1, peaksDifferent, 'Different for different seeds');

  peaks1.forEach(p => {
    assert.ok(p >= 0 && p <= 1.0, `Peak ${p} within bounds [0, 1]`);
  });
});

// 4. Instance Creation & Default States
test('ComicAudioPlayer initializes with correct default state', () => {
  const player = new ComicAudioPlayer({ autoInit: false, defaultEpisode: 's01e01' });

  assert.strictEqual(player.episodeId, 's01e01');
  assert.strictEqual(player.currentTrackIndex, 0);
  assert.strictEqual(player.isPlaying, false);
  assert.strictEqual(player.volume, 0.85);
  assert.strictEqual(player.isMuted, false);
  assert.strictEqual(player.speed, 1.0);
  assert.strictEqual(player.autoAdvance, true);
  assert.strictEqual(player.loopMode, 'all');
  assert.strictEqual(player.isMinimized, false);

  const cur = player.getCurrentTrack();
  assert.strictEqual(cur.index, 0);
  assert.ok(cur.title.includes('Prologue') || cur.title.includes('Genesis'));
});

// 5. Episode Loading & Switching
test('loadEpisode switches episode playlists accurately', () => {
  const player = new ComicAudioPlayer({ autoInit: false, defaultEpisode: 's01e01' });
  
  player.loadEpisode('s01e02');
  assert.strictEqual(player.episodeId, 's01e02');
  assert.strictEqual(player.currentTrackIndex, 0);
  assert.ok(player.getCurrentTrack().title.includes('Dark Archons'));

  player.loadEpisode('s01e03');
  assert.strictEqual(player.episodeId, 's01e03');
  assert.ok(player.getCurrentTrack().title.includes('Swarm Protocol'));
});

// 6. Panel Navigation (Jump, Next, Prev, Boundary Wrap)
test('Panel navigation methods update track index and handle boundary wrapping', () => {
  const player = new ComicAudioPlayer({ autoInit: false, defaultEpisode: 's01e01', loopMode: 'all' });

  // Jump to panel 3
  player.jumpToPanel(3);
  assert.strictEqual(player.currentTrackIndex, 3);
  assert.strictEqual(player.getCurrentTrack().panelLabel, 'Panel 03');

  // Next panel -> 4
  player.nextPanel();
  assert.strictEqual(player.currentTrackIndex, 4);

  // Prev panel -> 3
  player.currentTime = 1; // within 3s threshold for prev
  player.prevPanel();
  assert.strictEqual(player.currentTrackIndex, 3);

  // Jump to last panel -> 6
  player.jumpToPanel(6);
  assert.strictEqual(player.currentTrackIndex, 6);

  // Next panel at end with loopMode: 'all' wraps to 0
  player.nextPanel();
  assert.strictEqual(player.currentTrackIndex, 0);

  // Prev panel at start with loopMode: 'all' wraps to 6
  player.currentTime = 0;
  player.prevPanel();
  assert.strictEqual(player.currentTrackIndex, 6);
});

// 7. Seeking and Time Progression
test('seek, seekBy, and seekPercent calculate target timestamps properly', () => {
  const player = new ComicAudioPlayer({ autoInit: false });
  player.duration = 60; // Mock duration 60s
  player.currentTime = 10;

  player.seek(25);
  assert.strictEqual(player.currentTime, 25);

  player.seekBy(10);
  assert.strictEqual(player.currentTime, 35);

  player.seekBy(-15);
  assert.strictEqual(player.currentTime, 20);

  player.seekPercent(0.5); // 50% of 60s = 30s
  assert.strictEqual(player.currentTime, 30);
});

// 8. Auto-advance and Track Ended Handler
test('handleTrackEnded advances or loops according to loopMode & autoAdvance', () => {
  // Test autoAdvance true with loopMode 'all'
  const player = new ComicAudioPlayer({ autoInit: false, autoAdvance: true, loopMode: 'all' });
  player.jumpToPanel(2);
  player.handleTrackEnded();
  assert.strictEqual(player.currentTrackIndex, 3, 'Advances to next track');

  // Test loopMode 'one'
  const playerLoopOne = new ComicAudioPlayer({ autoInit: false, autoAdvance: true, loopMode: 'one' });
  playerLoopOne.jumpToPanel(2);
  playerLoopOne.currentTime = 20;
  playerLoopOne.handleTrackEnded();
  assert.strictEqual(playerLoopOne.currentTrackIndex, 2, 'Stays on same track for loop one');
  assert.strictEqual(playerLoopOne.currentTime, 0, 'Resets time to 0');
});

// 9. Volume, Mute, and Speed Management
test('Volume, mute toggle, and speed setters work properly', () => {
  const player = new ComicAudioPlayer({ autoInit: false });

  player.setVolume(0.5);
  assert.strictEqual(player.volume, 0.5);
  assert.strictEqual(player.isMuted, false);

  player.setVolume(1.5); // clamps to 1.0
  assert.strictEqual(player.volume, 1.0);

  player.toggleMute();
  assert.strictEqual(player.isMuted, true);

  player.toggleMute();
  assert.strictEqual(player.isMuted, false);
  assert.strictEqual(player.volume, 1.0);

  player.setSpeed(1.5);
  assert.strictEqual(player.speed, 1.5);
});

// 10. Event Emitter System
test('Event emitter handles on/off/emit callbacks with payload', () => {
  const player = new ComicAudioPlayer({ autoInit: false });

  let eventFired = false;
  let eventPayload = null;

  const callback = (data) => {
    eventFired = true;
    eventPayload = data;
  };

  player.on('paneljump', callback);
  player.jumpToPanel(2);

  assert.strictEqual(eventFired, true);
  assert.strictEqual(eventPayload.index, 2);
  assert.strictEqual(eventPayload.direction, 'jump');

  // Test off
  eventFired = false;
  player.off('paneljump', callback);
  player.jumpToPanel(4);
  assert.strictEqual(eventFired, false, 'Callback should not fire after removal');
});

// 11. Minimize / Expand Toggle
test('toggleMinimize updates state properly', () => {
  const player = new ComicAudioPlayer({ autoInit: false });

  assert.strictEqual(player.isMinimized, false);
  player.toggleMinimize(true);
  assert.strictEqual(player.isMinimized, true);

  player.toggleMinimize();
  assert.strictEqual(player.isMinimized, false);
});

// 12. Mock DOM Rendering Verification
test('DOM Rendering creates Floating Audio HUD with all required controls', () => {
  const createdElements = [];
  const bodyChildren = [];

  class MockElement {
    constructor(tagName) {
      this.tagName = tagName.toUpperCase();
      this.id = '';
      this.className = '';
      this.attributes = {};
      this.innerHTML = '';
      this.style = {};
      this.classList = {
        _classes: new Set(),
        add: (c) => this.classList._classes.add(c),
        remove: (c) => this.classList._classes.delete(c),
        toggle: (c, force) => {
          if (force === undefined) {
            this.classList._classes.has(c) ? this.classList._classes.delete(c) : this.classList._classes.add(c);
          } else if (force) {
            this.classList._classes.add(c);
          } else {
            this.classList._classes.delete(c);
          }
        },
        contains: (c) => this.classList._classes.has(c)
      };
      this.children = [];
      this.parentNode = null;
      createdElements.push(this);
    }

    setAttribute(k, v) { this.attributes[k] = v; }
    getAttribute(k) { return this.attributes[k]; }
    appendChild(el) {
      this.children.push(el);
      el.parentNode = this;
      return el;
    }
    removeChild(el) {
      const idx = this.children.indexOf(el);
      if (idx >= 0) this.children.splice(idx, 1);
      el.parentNode = null;
      return el;
    }
    addEventListener() {}
    removeEventListener() {}
    getBoundingClientRect() { return { width: 400, height: 40, left: 0, top: 0 }; }
    getContext() {
      return {
        clearRect: () => {},
        beginPath: () => {},
        fill: () => {},
        rect: () => {},
        roundRect: () => {},
        createLinearGradient: () => ({ addColorStop: () => {} })
      };
    }
  }

  global.document = {
    createElement: (tag) => new MockElement(tag),
    getElementById: (id) => createdElements.find(e => e.id === id) || null,
    querySelector: () => null,
    querySelectorAll: () => [],
    head: new MockElement('head'),
    body: {
      classList: {
        _classes: new Set(),
        add: (c) => {},
        remove: (c) => {}
      },
      appendChild: (el) => {
        bodyChildren.push(el);
        return el;
      }
    }
  };

  global.window = {
    location: { pathname: '/comic/s01e01.html' },
    localStorage: {
      getItem: () => null,
      setItem: () => {}
    },
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
    devicePixelRatio: 2
  };

  global.Audio = class MockAudio {
    constructor() {
      this.src = '';
      this.volume = 1;
      this.playbackRate = 1;
      this.paused = true;
      this.currentTime = 0;
      this.duration = 24;
      this._events = {};
    }
    addEventListener(ev, cb) { this._events[ev] = cb; }
    removeEventListener(ev) { delete this._events[ev]; }
    play() { this.paused = false; return Promise.resolve(); }
    pause() { this.paused = true; }
    load() {}
  };

  // Initialize with mocked DOM
  const player = new ComicAudioPlayer({ autoInit: true, defaultEpisode: 's01e01' });

  assert.ok(player.rootEl, 'Floating HUD root element created');
  assert.strictEqual(player.rootEl.id, 'comic-audio-player-root');
  assert.ok(player.pillEl, 'Minimized floating pill element created');
  assert.strictEqual(player.pillEl.id, 'comic-audio-player-pill');

  // Verify DOM Inner HTML includes essential controls
  const html = player.rootEl.innerHTML;
  assert.ok(html.includes('id="capBtnPlay"'), 'Play/Pause button present');
  assert.ok(html.includes('id="capTrackTitle"'), 'Track Title element present');
  assert.ok(html.includes('id="capBtnPrevPanel"'), 'Prev Panel jump button present');
  assert.ok(html.includes('id="capBtnNextPanel"'), 'Next Panel jump button present');
  assert.ok(html.includes('id="capWaveformCanvas"'), 'Waveform canvas present');
  assert.ok(html.includes('id="capVolumeSlider"'), 'Volume slider present');
  assert.ok(html.includes('id="capBtnVolume"'), 'Volume mute button present');
  assert.ok(html.includes('id="capEpisodeSelect"'), 'Episode selector dropdown present');

  // Clean up
  player.destroy();
  delete global.document;
  delete global.window;
  delete global.Audio;
});

console.log('\n--------------------------------------------------------');
console.log(`Results: ${pass} passed, ${fail} failed.`);
console.log('--------------------------------------------------------\n');

process.exit(fail ? 1 : 0);
