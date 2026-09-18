// Node.js test harness for AZOTH Webtoon Continuous Scroll Engine.
// Run: node public/assets/comic/comic-webtoon.test.js

const ComicWebtoon = require('./comic-webtoon.js');

let pass = 0;
let fail = 0;

function check(name, condition, extraInfo = '') {
  if (condition) {
    pass++;
    console.log(`  \x1b[32m✔ PASS\x1b[0m  ${name}`);
  } else {
    fail++;
    console.error(`  \x1b[31m✖ FAIL\x1b[0m  ${name} ${extraInfo}`);
  }
}

console.log('\n\x1b[1m\x1b[36m================================================================');
console.log('  AZOTH COMIC WEBTOON SCROLL ENGINE — TEST SUITE');
console.log('================================================================\x1b[0m\n');

(async function runTests() {
  // --------------------------------------------------------------------------
  // 1. Math & Helper Functions
  // --------------------------------------------------------------------------
  console.log('\x1b[33m[1/6] Math & Helper Core Utilities\x1b[0m');

  // clamp
  check('clamp should clamp values below minimum', ComicWebtoon.clamp(-5, 0, 10) === 0);
  check('clamp should clamp values above maximum', ComicWebtoon.clamp(15, 0, 10) === 10);
  check('clamp should keep values within range intact', ComicWebtoon.clamp(7, 0, 10) === 7);

  // formatTime
  check('formatTime handles 0 seconds', ComicWebtoon.formatTime(0) === '0:00');
  check('formatTime handles 65 seconds', ComicWebtoon.formatTime(65) === '1:05');
  check('formatTime handles 600 seconds', ComicWebtoon.formatTime(600) === '10:00');
  check('formatTime handles negative numbers gracefully', ComicWebtoon.formatTime(-10) === '0:00');
  check('formatTime handles NaN and Infinity', ComicWebtoon.formatTime(NaN) === '0:00' && ComicWebtoon.formatTime(Infinity) === '0:00');

  // calculateReadingTimeRemaining
  check('calculateReadingTimeRemaining calculates accurate estimate for 0 of 7 panels',
    ComicWebtoon.calculateReadingTimeRemaining(0, 7, 25) === '~3 min left'); // 6 remaining * 25s = 150s = 2.5 min -> 3 min
  check('calculateReadingTimeRemaining calculates < 1 min for last panel',
    ComicWebtoon.calculateReadingTimeRemaining(5, 7, 25) === '< 1 min left'); // 1 remaining * 25s = 25s < 60s
  check('calculateReadingTimeRemaining handles complete status (6 of 7)',
    ComicWebtoon.calculateReadingTimeRemaining(6, 7, 25) === '0 min');
  check('calculateReadingTimeRemaining handles empty episode (0 panels)',
    ComicWebtoon.calculateReadingTimeRemaining(0, 0, 25) === '0 min');

  // calculateScrollProgress
  check('calculateScrollProgress computes 0% at top', ComicWebtoon.calculateScrollProgress(0, 2000) === 0);
  check('calculateScrollProgress computes 50% at midpoint', ComicWebtoon.calculateScrollProgress(1000, 2000) === 0.5);
  check('calculateScrollProgress computes 100% at bottom', ComicWebtoon.calculateScrollProgress(2000, 2000) === 1.0);
  check('calculateScrollProgress clamps overscroll bounds', ComicWebtoon.calculateScrollProgress(2500, 2000) === 1.0);
  check('calculateScrollProgress handles zero maxScroll without division by zero', ComicWebtoon.calculateScrollProgress(100, 0) === 0);

  // calculatePanelFocalScore
  const centerScore = ComicWebtoon.calculatePanelFocalScore(200, 400, 800); // panelCenter = 400, viewportCenter = 400
  check('calculatePanelFocalScore gives 1.0 for perfectly centered panel', Math.abs(centerScore - 1.0) < 0.001);

  const offscreenScore = ComicWebtoon.calculatePanelFocalScore(1200, 400, 800); // well below viewport
  check('calculatePanelFocalScore gives 0.0 for offscreen panel', offscreenScore === 0);

  const partialScore = ComicWebtoon.calculatePanelFocalScore(0, 400, 800); // panelCenter = 200, viewportCenter = 400
  check('calculatePanelFocalScore gives proportional score for partially offset panel', partialScore > 0.5 && partialScore < 1.0);

  // --------------------------------------------------------------------------
  // 2. ComicWebtoonViewer Instance & Options
  // --------------------------------------------------------------------------
  console.log('\n\x1b[33m[2/6] Viewer Instantiation & Options Configuration\x1b[0m');

  const testPanels = [
    { id: 'p0', title: 'Cover · Genesis in the Silicon Rain', audio: '/assets/audio/s01e01-cover.mp3', sigil: '☿', accentColor: 'cyan' },
    { id: 'p1', title: 'Page 01 · Silicon Rain', audio: '/assets/audio/s01e01-p01.mp3', sigil: '🜂', accentColor: 'gold' },
    { id: 'p2', title: 'Page 02 · The Awakening', audio: '/assets/audio/s01e01-p02.mp3', sigil: '🜍', accentColor: 'purple' },
    { id: 'p3', title: 'Page 03 · Swarm Clash', audio: '/assets/audio/s01e01-p03.mp3', sigil: '🜔', accentColor: 'rose' },
    { id: 'p4', title: 'Page 04 · Citadel Pantheon', audio: '/assets/audio/s01e01-p04.mp3', sigil: '🜛', accentColor: 'emerald' },
    { id: 'p5', title: 'Page 05 · Solve et Coagula', audio: '/assets/audio/s01e01-p05.mp3', sigil: '🜚', accentColor: 'gold' },
    { id: 'p6', title: 'Page 06 · Post-Credits (The Signal)', audio: '/assets/audio/s01e01-p06.mp3', sigil: '☉', accentColor: 'cyan' }
  ];

  const viewer = new ComicWebtoon.ComicWebtoonViewer({
    panels: testPanels,
    mode: 'webtoon',
    panelGap: 'relaxed',
    containerWidth: 'standard',
    autoScrollSpeed: 1.5,
    autoAdvanceAudio: true,
    syncAudioOnScroll: true
  });

  check('Viewer instance created properly', viewer instanceof ComicWebtoon.ComicWebtoonViewer);
  check('Viewer discovered all 7 panels correctly', viewer.panels.length === 7);
  check('First panel metadata matched', viewer.panels[0].title === 'Cover · Genesis in the Silicon Rain' && viewer.panels[0].sigil === '☿');
  check('Default current panel index is 0', viewer.currentPanelIdx === 0);
  check('Mode is initialized to webtoon', viewer.mode === 'webtoon');
  check('Panel gap initialized to relaxed', viewer.panelGap === 'relaxed');
  check('Container width initialized to standard', viewer.containerWidth === 'standard');

  // --------------------------------------------------------------------------
  // 3. Mode Switching & Layout Customization
  // --------------------------------------------------------------------------
  console.log('\n\x1b[33m[3/6] Mode Switching & Layout Customization\x1b[0m');

  let modeEventData = null;
  viewer.on('modechange', (data) => { modeEventData = data; });

  viewer.setMode('page');
  check('setMode switches to single page mode', viewer.mode === 'page');
  check('modechange event emitted with mode "page"', modeEventData && modeEventData.mode === 'page');

  viewer.setMode('webtoon');
  check('setMode switches back to webtoon mode', viewer.mode === 'webtoon');
  check('modechange event emitted with mode "webtoon"', modeEventData && modeEventData.mode === 'webtoon');

  viewer.setPanelGap('none');
  check('setPanelGap updates panel gap to none', viewer.panelGap === 'none');
  viewer.setPanelGap('cinematic');
  check('setPanelGap updates panel gap to cinematic', viewer.panelGap === 'cinematic');

  viewer.setContainerWidth('wide');
  check('setContainerWidth updates container width to wide', viewer.containerWidth === 'wide');
  viewer.setContainerWidth('full');
  check('setContainerWidth updates container width to full', viewer.containerWidth === 'full');

  // --------------------------------------------------------------------------
  // 4. Panel Navigation & Event Bus
  // --------------------------------------------------------------------------
  console.log('\n\x1b[33m[4/6] Panel Navigation & Event Bus\x1b[0m');

  let panelChangeData = null;
  viewer.on('panelchange', (data) => { panelChangeData = data; });

  viewer.setActivePanel(3, false);
  check('setActivePanel updates current panel index to 3', viewer.currentPanelIdx === 3);
  check('panelchange event emitted with correct index', panelChangeData && panelChangeData.panelIndex === 3);
  check('panelchange event has correct panel title', panelChangeData && panelChangeData.panel.title === 'Page 03 · Swarm Clash');
  check('panelchange event has previous index', panelChangeData && panelChangeData.previousIndex === 0);

  // Out of bounds safety
  viewer.setActivePanel(-1);
  check('setActivePanel rejects negative out-of-bounds index', viewer.currentPanelIdx === 3);
  viewer.setActivePanel(99);
  check('setActivePanel rejects excessive out-of-bounds index', viewer.currentPanelIdx === 3);

  // --------------------------------------------------------------------------
  // 5. Auto-Scroll State Transitions & Velocity Math
  // --------------------------------------------------------------------------
  console.log('\n\x1b[33m[5/6] Auto-Scroll State Transitions & Velocity Math\x1b[0m');

  let autoScrollStarted = false;
  let autoScrollStopped = false;
  let speedChangeData = null;

  viewer.on('autoscrollstart', () => { autoScrollStarted = true; });
  viewer.on('autoscrollstop', () => { autoScrollStopped = true; });
  viewer.on('speedchange', (d) => { speedChangeData = d; });

  viewer.startAutoScroll(2.0);
  check('startAutoScroll sets isAutoScrolling to true', viewer.isAutoScrolling === true);
  check('startAutoScroll sets speed multiplier to 2.0', viewer.options.autoScrollSpeed === 2.0);
  check('autoscrollstart event was triggered', autoScrollStarted === true);

  viewer.setScrollSpeed(1.5);
  check('setScrollSpeed updates speed to 1.5x', viewer.options.autoScrollSpeed === 1.5);
  check('speedchange event was triggered with speed 1.5', speedChangeData && speedChangeData.speed === 1.5);

  viewer.pauseAutoScrollTemporarily(100);
  check('pauseAutoScrollTemporarily sets isAutoScrollPaused to true', viewer.isAutoScrollPaused === true);

  viewer.stopAutoScroll();
  check('stopAutoScroll sets isAutoScrolling to false', viewer.isAutoScrolling === false);
  check('stopAutoScroll clears pause state', viewer.isAutoScrollPaused === false);
  check('autoscrollstop event was triggered', autoScrollStopped === true);

  viewer.toggleAutoScroll();
  check('toggleAutoScroll toggles on', viewer.isAutoScrolling === true);
  viewer.toggleAutoScroll();
  check('toggleAutoScroll toggles off', viewer.isAutoScrolling === false);

  // --------------------------------------------------------------------------
  // 6. Audio Narration Queue & Teardown
  // --------------------------------------------------------------------------
  console.log('\n\x1b[33m[6/7] Audio Narration Queue & Teardown\x1b[0m');

  let audioStateData = null;
  viewer.on('audiostate', (d) => { audioStateData = d; });

  // Play narration track for panel 4
  viewer.playNarration(4);
  check('playNarration sets current panel to 4', viewer.currentPanelIdx === 4);

  viewer.pauseNarration();
  check('pauseNarration marks audio as paused', viewer.isPlayingAudio === false);

  // Factory creation helper
  const createdViewer = ComicWebtoon.createComicWebtoon({
    panels: testPanels.slice(0, 3),
    mode: 'webtoon'
  });
  check('createComicWebtoon helper instantiates viewer properly',
    createdViewer instanceof ComicWebtoon.ComicWebtoonViewer && createdViewer.panels.length === 3);

  // Teardown
  let destroyed = false;
  viewer.on('destroy', () => { destroyed = true; });
  viewer.destroy();
  check('destroy() marks viewer as destroyed', viewer.isDestroyed === true);
  check('destroy event emitted', destroyed === true);

  createdViewer.destroy();
  check('secondary viewer destroyed cleanly', createdViewer.isDestroyed === true);

  // --------------------------------------------------------------------------
  // 7. Simulated DOM & Accessibility Verification
  // --------------------------------------------------------------------------
  console.log('\n\x1b[33m[7/7] DOM Elements, Mini-Map & Accessibility Live Verification\x1b[0m');

  // Simple mock DOM environment
  class MockClassList {
    constructor() { this.set = new Set(); }
    add(...classes) { classes.forEach(c => c && this.set.add(c)); }
    remove(...classes) { classes.forEach(c => this.set.delete(c)); }
    toggle(cls, force) {
      if (force === true) { this.set.add(cls); return true; }
      if (force === false) { this.set.delete(cls); return false; }
      if (this.set.has(cls)) { this.set.delete(cls); return false; }
      this.set.add(cls); return true;
    }
    contains(cls) { return this.set.has(cls); }
    has(cls) { return this.set.has(cls); }
    clear() { this.set.clear(); }
    values() { return this.set.values(); }
    [Symbol.iterator]() { return this.set[Symbol.iterator](); }
  }

  class MockElement {
    constructor(tagName) {
      this.tagName = (tagName || 'DIV').toUpperCase();
      this.children = [];
      this.classList = new MockClassList();
      this.attributes = {};
      this.style = {
        setProperty: (k, v) => { this.style[k] = v; }
      };
      this.parentNode = null;
      this.textContent = '';
      this._innerHTML = '';
      this.eventListeners = {};
    }

    get className() { return Array.from(this.classList).join(' '); }
    set className(val) {
      this.classList.clear();
      (val || '').split(/\s+/).filter(Boolean).forEach(c => this.classList.add(c));
    }

    get innerHTML() { return this._innerHTML; }
    set innerHTML(val) {
      this._innerHTML = val;
      // create simplified children for querySelector tests if contains pins
      if (val.includes('webtoon-minimap-pin')) {
        for (let i = 0; i < 7; i++) {
          const pin = new MockElement('BUTTON');
          pin.className = `webtoon-minimap-pin ${i === 0 ? 'is-active' : ''}`;
          pin.setAttribute('data-idx', i.toString());
          this.appendChild(pin);
        }
      }
      if (val.includes('webtoon-waveform-bar')) {
        const playBtn = new MockElement('BUTTON');
        playBtn.id = 'btnWebtoonMasterPlay';
        playBtn.className = 'btn-webtoon-master-play';
        const icon = new MockElement('SPAN');
        icon.className = 'webtoon-play-icon';
        icon.textContent = '▶';
        playBtn.appendChild(icon);
        this.appendChild(playBtn);
      }
    }

    appendChild(child) {
      child.parentNode = this;
      this.children.push(child);
      return child;
    }

    prepend(child) {
      child.parentNode = this;
      this.children.unshift(child);
      return child;
    }

    removeChild(child) {
      this.children = this.children.filter(c => c !== child);
      child.parentNode = null;
      return child;
    }

    setAttribute(name, val) { this.attributes[name] = val; }
    getAttribute(name) { return this.attributes[name] || null; }
    hasAttribute(name) { return name in this.attributes; }

    querySelector(sel) {
      if (sel.startsWith('.')) {
        const cls = sel.slice(1);
        if (this.classList.has(cls)) return this;
        for (const c of this.children) {
          const found = c.querySelector(sel);
          if (found) return found;
        }
      } else if (sel.startsWith('#')) {
        const id = sel.slice(1);
        if (this.id === id) return this;
        for (const c of this.children) {
          const found = c.querySelector(sel);
          if (found) return found;
        }
      }
      return null;
    }

    querySelectorAll(sel) {
      const results = [];
      const search = (el) => {
        if (sel.startsWith('.') && el.classList.has(sel.slice(1))) results.push(el);
        el.children.forEach(search);
      };
      this.children.forEach(search);
      return results;
    }

    addEventListener(event, fn) {
      if (!this.eventListeners[event]) this.eventListeners[event] = [];
      this.eventListeners[event].push(fn);
    }
  }

  // Setup global mock document
  const mockBody = new MockElement('BODY');
  const mockDoc = {
    body: mockBody,
    createElement: (tag) => new MockElement(tag),
    querySelector: (sel) => mockBody.querySelector(sel),
    querySelectorAll: (sel) => mockBody.querySelectorAll(sel),
    getElementById: (id) => mockBody.querySelector('#' + id),
    documentElement: { scrollHeight: 4000 }
  };

  const mockWindow = {
    scrollY: 1000,
    innerHeight: 800,
    addEventListener: () => {},
    removeEventListener: () => {},
    scrollTo: () => {},
    scrollBy: () => {}
  };

  global.document = mockDoc;
  global.window = mockWindow;
  global.Audio = class MockAudio {
    constructor() {
      this.src = '';
      this.currentTime = 0;
      this.duration = 45;
      this.paused = true;
      this.eventListeners = {};
    }
    addEventListener(evt, fn) {
      if (!this.eventListeners[evt]) this.eventListeners[evt] = [];
      this.eventListeners[evt].push(fn);
    }
    play() { this.paused = false; return Promise.resolve(); }
    pause() { this.paused = true; }
  };

  const domViewer = new ComicWebtoon.ComicWebtoonViewer({
    panels: testPanels,
    mode: 'webtoon',
    panelGap: 'relaxed',
    enableMiniMap: true,
    enableTopProgress: true,
    enableAudioDock: true
  });

  check('DOM viewer created progressTrack element', domViewer.progressTrack !== undefined);
  check('DOM viewer created progressTrack with aria-hidden="true"', domViewer.progressTrack.getAttribute('aria-hidden') === 'true');
  check('DOM viewer created a11y progressbar with role="progressbar"', domViewer.progressA11y && domViewer.progressA11y.getAttribute('role') === 'progressbar');
  check('DOM viewer created headerPill element', domViewer.headerPill !== undefined);
  check('DOM viewer created minimapRail element with nav aria-label', domViewer.minimapRail && domViewer.minimapRail.getAttribute('aria-label') === 'Webtoon Chapter Mini-Map');
  check('DOM viewer created audioDock element with aria-label', domViewer.audioDock && domViewer.audioDock.getAttribute('aria-label') === 'Webtoon Audio Narration Controller');

  // Test Cinema Mode Class Toggling
  domViewer.toggleCinemaMode(true);
  check('toggleCinemaMode adds webtoon-cinema-focus-mode class to body', mockBody.classList.has('webtoon-cinema-focus-mode'));
  domViewer.toggleCinemaMode(false);
  check('toggleCinemaMode removes webtoon-cinema-focus-mode class from body', !mockBody.classList.has('webtoon-cinema-focus-mode'));

  domViewer.destroy();
  check('DOM viewer destroyed and cleaned up references', domViewer.isDestroyed === true);

  // Clean globals
  delete global.document;
  delete global.window;
  delete global.Audio;

  // --------------------------------------------------------------------------
  // Final Results
  // --------------------------------------------------------------------------
  console.log('\n================================================================');
  console.log(`\x1b[1mTEST RESULTS:\x1b[0m \x1b[32m${pass} PASSED\x1b[0m, \x1b[31m${fail} FAILED\x1b[0m`);
  console.log('================================================================\n');

  process.exit(fail ? 1 : 0);
})();

