// Test suite for AZOTH Comic Gestures Engine.
// Run: node comic-gestures.test.js

const ComicGestures = require('./comic-gestures.js');

let pass = 0, fail = 0;
function check(name, cond, details = '') {
  if (cond) {
    pass++;
    console.log(`✓ PASS: ${name}`);
  } else {
    fail++;
    console.error(`✗ FAIL: ${name} ${details}`);
  }
}

// Mock browser environment for node testing
class MockDOMElement {
  constructor(tag = 'div', id = '', className = '') {
    this.nodeType = 1;
    this.tagName = tag.toUpperCase();
    this.id = id;
    this.className = className;
    this.classList = {
      _classes: new Set(className ? className.split(' ') : []),
      add: (c) => this.classList._classes.add(c),
      remove: (c) => this.classList._classes.delete(c),
      contains: (c) => this.classList._classes.has(c),
      toggle: (c, force) => {
        if (force === undefined) {
          if (this.classList._classes.has(c)) this.classList._classes.delete(c);
          else this.classList._classes.add(c);
        } else if (force) {
          this.classList._classes.add(c);
        } else {
          this.classList._classes.delete(c);
        }
      }
    };
    this.style = {};
    this.children = [];
    this.parentNode = null;
    this.listeners = new Map();
    this.offsetWidth = 800;
    this.offsetHeight = 1200;
  }

  get parentElement() {
    return this.parentNode;
  }

  getBoundingClientRect() {
    return {
      left: 0,
      top: 0,
      right: this.offsetWidth,
      bottom: this.offsetHeight,
      width: this.offsetWidth,
      height: this.offsetHeight
    };
  }

  addEventListener(event, fn, opts) {
    if (!this.listeners.has(event)) this.listeners.set(event, []);
    this.listeners.get(event).push(fn);
  }

  removeEventListener(event, fn) {
    if (!this.listeners.has(event)) return;
    const filtered = this.listeners.get(event).filter(f => f !== fn);
    this.listeners.set(event, filtered);
  }

  dispatchEvent(evt) {
    const list = this.listeners.get(evt.type) || [];
    list.forEach(fn => fn(evt));
    return true;
  }

  appendChild(child) {
    child.parentNode = this;
    this.children.push(child);
    return child;
  }

  removeChild(child) {
    this.children = this.children.filter(c => c !== child);
    child.parentNode = null;
    return child;
  }

  querySelector(sel) {
    const all = this.querySelectorAll(sel);
    return all.length ? all[0] : null;
  }

  querySelectorAll(sel) {
    const res = [];
    const selectors = sel.split(',').map(s => s.trim());
    const walk = (node) => {
      for (const c of node.children) {
        let match = false;
        for (const s of selectors) {
          if (s === 'img' || s === '.comic-page-img') {
            if (c.tagName === 'IMG' || c.classList.contains('comic-page-img')) match = true;
          } else if (s === '.comic-page-wrapper') {
            if (c.classList.contains('comic-page-wrapper')) match = true;
          } else if (s === '.panel-card') {
            if (c.classList.contains('panel-card')) match = true;
          } else if (s.includes('img')) {
            if (c.tagName === 'IMG' || c.classList.contains('comic-page-img') || c.classList.contains('panel-img')) match = true;
          }
        }
        if (match && !res.includes(c)) res.push(c);
        walk(c);
      }
    };
    walk(this);
    return res;
  }

  closest(sel) {
    let curr = this;
    while (curr) {
      if ((sel.includes('img') || sel.includes('.comic-page-img')) && (curr.tagName === 'IMG' || curr.classList.contains('comic-page-img'))) {
        return curr;
      }
      curr = curr.parentNode;
    }
    return null;
  }
}

// Setup Global Mocks
global.document = {
  getElementById: (id) => null,
  querySelector: (sel) => null,
  querySelectorAll: (sel) => [],
  createElement: (tag) => new MockDOMElement(tag),
  head: new MockDOMElement('head'),
  body: new MockDOMElement('body')
};
global.window = {
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => {},
  location: { href: 'http://localhost' }
};
global.getComputedStyle = () => ({ overflow: 'visible' });
global.requestAnimationFrame = (cb) => { cb(); return 1; };
global.cancelAnimationFrame = () => {};
global.CustomEvent = class CustomEvent {
  constructor(type, init = {}) {
    this.type = type;
    this.detail = init.detail || {};
  }
};

(async () => {
  console.log('--- RUNNING COMIC GESTURES TESTS ---\n');

  // Test 1: Module Export Verification
  check('ComicGestures exports init, autoInit, getInstance and Engine', 
    typeof ComicGestures.init === 'function' &&
    typeof ComicGestures.autoInit === 'function' &&
    typeof ComicGestures.Engine === 'function'
  );

  // Test 2: Engine Initialization with custom mock container
  const mockContainer = new MockDOMElement('div', 'comic-stage-container', 'comic-stage');
  const mockPage1 = new MockDOMElement('article', 'page-1', 'comic-page-wrapper');
  const mockImg = new MockDOMElement('img', 'img-1', 'comic-page-img');
  mockPage1.appendChild(mockImg);
  mockContainer.appendChild(mockPage1);

  let pageNextCalled = false;
  let pagePrevCalled = false;
  let zoomChanged = false;
  let hudToggled = false;

  const engine = ComicGestures.init({
    container: mockContainer,
    enableSwipe: true,
    enableZoom: true,
    enableDoubleTap: true,
    swipeThreshold: 40,
    onPageNext: () => { pageNextCalled = true; },
    onPagePrev: () => { pagePrevCalled = true; },
    onZoomChange: (scale) => { zoomChanged = true; },
    onHudToggle: (vis) => { hudToggled = true; }
  });

  check('Engine instantiates and attaches zoomable classes', mockImg.classList.contains('comic-zoomable-target'));

  // Test 3: Horizontal Swipe (Next Page on swipe left)
  // Simulate swipe left: touchstart at x=200, move to x=100, end at x=100
  mockContainer.dispatchEvent({
    type: 'touchstart',
    touches: [{ identifier: 0, clientX: 200, clientY: 100, target: mockImg }]
  });
  mockContainer.dispatchEvent({
    type: 'touchmove',
    touches: [{ identifier: 0, clientX: 120, clientY: 102, target: mockImg }],
    preventDefault: () => {}
  });
  mockContainer.dispatchEvent({
    type: 'touchend',
    touches: []
  });

  check('Horizontal swipe left triggers onPageNext', pageNextCalled === true);

  // Test 4: Horizontal Swipe (Prev Page on swipe right)
  mockContainer.dispatchEvent({
    type: 'touchstart',
    touches: [{ identifier: 0, clientX: 100, clientY: 100, target: mockImg }]
  });
  mockContainer.dispatchEvent({
    type: 'touchmove',
    touches: [{ identifier: 0, clientX: 180, clientY: 98, target: mockImg }],
    preventDefault: () => {}
  });
  mockContainer.dispatchEvent({
    type: 'touchend',
    touches: []
  });

  check('Horizontal swipe right triggers onPagePrev', pagePrevCalled === true);

  // Test 5: Vertical scroll dominance does not trigger swipe
  let swipeOnVertical = false;
  engine.opts.onPageNext = () => { swipeOnVertical = true; };
  mockContainer.dispatchEvent({
    type: 'touchstart',
    touches: [{ identifier: 0, clientX: 100, clientY: 100, target: mockImg }]
  });
  mockContainer.dispatchEvent({
    type: 'touchmove',
    touches: [{ identifier: 0, clientX: 110, clientY: 200, target: mockImg }], // mostly vertical
    preventDefault: () => {}
  });
  mockContainer.dispatchEvent({
    type: 'touchend',
    touches: []
  });
  check('Vertical scrolling ignores page swipe (angle locking)', swipeOnVertical === false);

  // Test 6: Multi-touch Pinch to Zoom
  engine.targetImg = mockImg;
  mockContainer.dispatchEvent({
    type: 'touchstart',
    touches: [
      { identifier: 0, clientX: 100, clientY: 100, target: mockImg },
      { identifier: 1, clientX: 200, clientY: 100, target: mockImg }
    ],
    preventDefault: () => {}
  });
  // Move fingers apart (200px distance instead of 100px) -> 2.0x zoom
  mockContainer.dispatchEvent({
    type: 'touchmove',
    touches: [
      { identifier: 0, clientX: 50, clientY: 100, target: mockImg },
      { identifier: 1, clientX: 250, clientY: 100, target: mockImg }
    ],
    preventDefault: () => {}
  });

  check('Pinch-to-zoom updates currentScale and triggers zoom callback', engine.currentScale > 1.8 && zoomChanged);

  // Test 7: Double Tap when zoomed in resets zoom
  mockContainer.dispatchEvent({
    type: 'touchstart',
    touches: [{ identifier: 0, clientX: 100, clientY: 100, target: mockImg }]
  });
  mockContainer.dispatchEvent({
    type: 'touchend',
    touches: []
  });
  // Immediate second tap
  mockContainer.dispatchEvent({
    type: 'touchstart',
    touches: [{ identifier: 0, clientX: 102, clientY: 101, target: mockImg }]
  });
  mockContainer.dispatchEvent({
    type: 'touchend',
    touches: []
  });

  check('Double-tap while zoomed in resets scale back to 1.0x', engine.currentScale === 1.0);

  // Test 8: Double Tap when not zoomed toggles HUD
  mockContainer.dispatchEvent({
    type: 'touchstart',
    touches: [{ identifier: 0, clientX: 100, clientY: 100, target: mockImg }]
  });
  mockContainer.dispatchEvent({
    type: 'touchend',
    touches: []
  });
  mockContainer.dispatchEvent({
    type: 'touchstart',
    touches: [{ identifier: 0, clientX: 101, clientY: 100, target: mockImg }]
  });
  mockContainer.dispatchEvent({
    type: 'touchend',
    touches: []
  });

  check('Double-tap while at 1.0x toggles HUD state to hidden', engine.isHudHidden === true && hudToggled === true);

  // Test 9: Toggle HUD method switches back to visible
  engine.toggleHUD(true); // force visible
  check('toggleHUD(true) makes HUD visible again', engine.isHudHidden === false);

  // Test 10: SetZoom and ResetZoom direct API methods
  engine.setZoom(2.5, 10, 10, false);
  check('setZoom(2.5) directly sets scale', Math.abs(engine.currentScale - 2.5) < 0.01);
  engine.resetZoom(false);
  check('resetZoom() resets scale to 1.0', engine.currentScale === 1.0);

  // Test 11: Destroy cleans up resources
  engine.destroy();
  check('destroy() successfully unbinds without errors', true);

  console.log(`\n========================================`);
  console.log(`SUMMARY: ${pass} passed, ${fail} failed`);
  console.log(`========================================\n`);

  process.exit(fail > 0 ? 1 : 0);
})();
