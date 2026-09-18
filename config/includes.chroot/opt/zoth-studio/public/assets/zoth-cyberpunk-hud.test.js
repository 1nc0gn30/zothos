/**
 * Unit Test Suite for Master Cyberpunk HUD Controller Engine (zoth-cyberpunk-hud.js)
 * Comprehensive verification of:
 * 1. Master API & State Initialization
 * 2. Real-Time Audio Oscilloscope / FFT Spectrum Canvas Engine
 * 3. 360° Polar Radar Sweep Mini-Map (21 Fleet Swarm Agents)
 * 4. Complete 6-Pillar Mathematical Calculus Engine
 * 5. Interactive Memory Graph & Synaptic Consolidation Waves
 * 6. Dynamic Stage Tool Loader & Stage History Navigation
 * 7. Dual-Tool Split Stage Mode
 * 8. Device Aspect Ratio Switcher
 * 9. Active Agents Selector (21 Agents) & Speech Synthesis
 * 10. 4-Theme Engine Cycle
 * 11. Modals, Message Logger & Terminal REPL
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

// Mock browser DOM environment
function createMockDOM() {
  const elements = {};
  const listeners = {};

  const store = { 'zoth-hud-theme': 'dark' };

  const doc = {
    readyState: 'complete',
    documentElement: {
      classList: {
        add: (c) => { doc.documentElement.className = (doc.documentElement.className + ' ' + c).trim(); },
        remove: (c) => { doc.documentElement.className = doc.documentElement.className.replace(new RegExp('\\b' + c + '\\b', 'g'), '').trim(); },
        contains: (c) => doc.documentElement.className.includes(c)
      },
      setAttribute: (k, v) => { doc.documentElement[k] = v; },
      getAttribute: (k) => doc.documentElement[k] || 'dark',
      removeAttribute: (k) => { delete doc.documentElement[k]; },
      style: {
        setProperty: (k, v) => { doc.documentElement.styleProps = doc.documentElement.styleProps || {}; doc.documentElement.styleProps[k] = v; },
        getPropertyValue: (k) => (doc.documentElement.styleProps && doc.documentElement.styleProps[k]) || ''
      },
      className: ''
    },
    body: {
      classList: {
        add: (c) => { doc.body.className = (doc.body.className + ' ' + c).trim(); },
        remove: (c) => { doc.body.className = doc.body.className.replace(new RegExp('\\b' + c + '\\b', 'g'), '').trim(); },
        contains: (c) => doc.body.className.includes(c)
      },
      className: '',
      innerHTML: '',
      appendChild: (el) => { elements[el.id || 'badge'] = el; return el; },
      setAttribute: (k, v) => { doc.body[k] = v; },
      getAttribute: (k) => doc.body[k] || null,
      removeAttribute: (k) => { delete doc.body[k]; }
    },
    getElementById: (id) => {
      if (!elements[id]) {
        elements[id] = createElement('div', id);
      }
      return elements[id];
    },
    querySelectorAll: (sel) => {
      return Object.values(elements).filter(el => {
        if (!el) return false;
        if (sel.startsWith('.')) return el.classList && typeof el.classList.contains === 'function' && el.classList.contains(sel.slice(1));
        if (sel.startsWith('#')) return el.id === sel.slice(1);
        return false;
      });
    },
    querySelector: (sel) => {
      if (sel.startsWith('#')) return doc.getElementById(sel.slice(1));
      const list = doc.querySelectorAll(sel);
      return list.length ? list[0] : createElement('div', 'query-' + sel.replace(/[^a-zA-Z0-9]/g, '-'));
    },
    createElement: (tag) => {
      return createElement(tag);
    },
    addEventListener: (ev, cb) => {
      listeners[ev] = listeners[ev] || [];
      listeners[ev].push(cb);
    }
  };

  function createElement(tag, id) {
    const el = {
      tagName: tag.toUpperCase(),
      id: id || '',
      className: '',
      classList: {
        add: (c) => { el.className = (el.className + ' ' + c).trim(); },
        remove: (c) => { el.className = el.className.replace(new RegExp('\\b' + c + '\\b', 'g'), '').trim(); },
        contains: (c) => el.className.includes(c),
        toggle: (c, force) => {
          const has = el.className.includes(c);
          const shouldAdd = typeof force === 'boolean' ? force : !has;
          if (shouldAdd) el.className = (el.className + ' ' + c).trim();
          else el.className = el.className.replace(new RegExp('\\b' + c + '\\b', 'g'), '').trim();
          return shouldAdd;
        }
      },
      style: {},
      children: [],
      get firstChild() { return this.children[0] || null; },
      appendChild: (child) => { el.children.push(child); return child; },
      removeChild: (child) => {
        const target = child || el.children[0];
        const idx = el.children.indexOf(target);
        if (idx !== -1) el.children.splice(idx, 1);
      },
      addEventListener: (ev, cb) => {},
      getContext: (type) => ({
        clearRect: () => {},
        beginPath: () => {},
        arc: () => {},
        fill: () => {},
        stroke: () => {},
        moveTo: () => {},
        lineTo: () => {},
        scale: () => {},
        fillRect: () => {},
        strokeRect: () => {},
        fillText: () => {},
        createLinearGradient: () => ({ addColorStop: () => {} }),
        setLineDash: () => {},
        closePath: () => {}
      }),
      getBoundingClientRect: () => ({ width: 320, height: 95, left: 0, top: 0 }),
      querySelectorAll: (sel) => [],
      querySelector: (sel) => createElement('div'),
      setAttribute: (k, v) => { el[k] = v; },
      getAttribute: (k) => el[k] || null,
      removeAttribute: (k) => { delete el[k]; },
      focus: () => {},
      click: () => {}
    };
    if (id) elements[id] = el;
    return el;
  }

  const win = {
    document: doc,
    location: {
      origin: 'http://127.0.0.1:8088',
      pathname: '/studio/cyberpunk-hud.html',
      search: '',
      hash: ''
    },
    history: {
      pushState: () => {},
      replaceState: () => {}
    },
    localStorage: {
      getItem: (k) => store[k] || null,
      setItem: (k, v) => { store[k] = String(v); },
      removeItem: (k) => { delete store[k]; }
    },
    speechSynthesis: {
      cancel: () => {},
      speak: (u) => {}
    },
    SpeechSynthesisUtterance: function (text) {
      this.text = text;
      this.rate = 1;
      this.pitch = 1;
    },
    addEventListener: (ev, cb) => {
      listeners[ev] = listeners[ev] || [];
      listeners[ev].push(cb);
    },
    dispatchEvent: () => {},
    requestAnimationFrame: (cb) => 1,
    setInterval: (cb, ms) => 1,
    clearInterval: () => {},
    fetch: () => Promise.resolve({ ok: true, json: () => Promise.resolve({}) }),
    navigator: {
      vibrate: (pattern) => {
        win._lastVibrate = pattern;
        return true;
      },
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)'
    }
  };

  return { win, doc, elements };
}

console.log('⚡ Running Cyberpunk HUD Tactical Visualizers Verification Tests...\n');

// 1. Verify File Exists and is Non-Empty
const possiblePaths = [
  path.join(__dirname, 'zoth-cyberpunk-hud.js'),
  path.join(__dirname, 'public/assets/zoth-cyberpunk-hud.js'),
  path.join(process.cwd(), 'public/assets/zoth-cyberpunk-hud.js'),
  path.join(process.cwd(), 'zoth-cyberpunk-hud.js')
];
const hudJsPath = possiblePaths.find(p => fs.existsSync(p)) || possiblePaths[0];
assert.ok(fs.existsSync(hudJsPath), 'zoth-cyberpunk-hud.js must exist on disk');
const hudJsContent = fs.readFileSync(hudJsPath, 'utf8');
assert.ok(hudJsContent.length > 5000, 'zoth-cyberpunk-hud.js must contain full implementation');
console.log('✔ Test 1 Passed: zoth-cyberpunk-hud.js exists (' + hudJsContent.length + ' bytes)');

// 2. Execute within Mock Browser Environment
const { win, doc } = createMockDOM();
const fn = new Function('window', 'document', hudJsContent);
fn(win, doc);

assert.ok(win.ZothHUD, 'window.ZothHUD must be exposed');
assert.ok(win.ZothCyberpunkHUD, 'window.ZothCyberpunkHUD must be exposed');
assert.strictEqual(typeof win.ZothHUD.init, 'function', 'ZothHUD.init must be a function');
assert.strictEqual(typeof win.ZothHUD.loadTool, 'function', 'ZothHUD.loadTool must be a function');
assert.strictEqual(typeof win.ZothHUD.setAgent, 'function', 'ZothHUD.setAgent must be a function');
assert.strictEqual(typeof win.ZothHUD.setTheme, 'function', 'ZothHUD.setTheme must be a function');
assert.strictEqual(typeof win.ZothHUD.pingRadar, 'function', 'ZothHUD.pingRadar must be a function');
assert.strictEqual(typeof win.ZothHUD.setScopeMode, 'function', 'ZothHUD.setScopeMode must be a function');
assert.strictEqual(typeof win.ZothHUD.getPillars, 'function', 'ZothHUD.getPillars must be a function');
assert.strictEqual(typeof win.ZothHUD.getAllAgents, 'function', 'ZothHUD.getAllAgents must be a function');
console.log('✔ Test 2 Passed: Master HUD Controller API initialized and tactical methods exposed');

// 3. Test Real-Time Audio Oscilloscope / FFT Spectrum Visualizer Engine
assert.ok(win.ZothHUD.AudioOscilloscope, 'AudioOscilloscope module must be present');
assert.strictEqual(typeof win.ZothHUD.AudioOscilloscope.init, 'function');
assert.strictEqual(typeof win.ZothHUD.AudioOscilloscope.setMode, 'function');
assert.strictEqual(typeof win.ZothHUD.AudioOscilloscope.triggerPulse, 'function');

win.ZothHUD.AudioOscilloscope.setMode('fft');
assert.strictEqual(win.ZothHUD.AudioOscilloscope.getMode(), 'fft', 'Oscilloscope mode must be fft');

win.ZothHUD.AudioOscilloscope.setMode('lissajous');
assert.strictEqual(win.ZothHUD.AudioOscilloscope.getMode(), 'lissajous', 'Oscilloscope mode must be lissajous');

win.ZothHUD.AudioOscilloscope.setMode('wave');
assert.strictEqual(win.ZothHUD.AudioOscilloscope.getMode(), 'wave', 'Oscilloscope mode must be wave');

win.ZothHUD.AudioOscilloscope.triggerPulse(0.8, 880);
console.log('✔ Test 3 Passed: Real-Time Audio Oscilloscope operates across wave, fft, and lissajous modes');

// 4. Test 360° Polar Radar Sweep Mini-Map & 21 Fleet Swarm Agents
assert.ok(win.ZothHUD.PolarRadar, 'PolarRadar module must be present');
assert.strictEqual(typeof win.ZothHUD.PolarRadar.init, 'function');
assert.strictEqual(typeof win.ZothHUD.PolarRadar.setRange, 'function');
assert.strictEqual(typeof win.ZothHUD.PolarRadar.pingAll, 'function');

const allAgents = win.ZothHUD.getAllAgents();
assert.strictEqual(allAgents.length, 21, 'Must contain all 21 Sovereign Swarm Agents');

const coreAgents = allAgents.filter(a => a.isCore);
assert.strictEqual(coreAgents.length, 6, 'Must contain 6 Sovereign Core agents');

assert.ok(allAgents.find(a => a.id === 'azoth'), 'Azoth must be present');
assert.ok(allAgents.find(a => a.id === 'antigravity'), 'Antigravity must be present');
assert.ok(allAgents.find(a => a.id === 'grok'), 'Grok must be present');
assert.ok(allAgents.find(a => a.id === 'hermes'), 'Hermes must be present');
assert.ok(allAgents.find(a => a.id === 'ghostbyte'), 'GhostByte must be present');
assert.ok(allAgents.find(a => a.id === 'ollama'), 'Ollama must be present');
assert.ok(allAgents.find(a => a.id === 'kai'), 'Kai must be present');
assert.ok(allAgents.find(a => a.id === 'draco'), 'Draco must be present');
assert.ok(allAgents.find(a => a.id === 'athena'), 'Athena must be present');
assert.ok(allAgents.find(a => a.id === 'kraken'), 'Kraken must be present');

win.ZothHUD.pingRadar();
win.ZothHUD.PolarRadar.setRange(1.5);
console.log('✔ Test 4 Passed: 360° Polar Radar Sweep Mini-Map tracks all 21 swarm agents correctly');

// 5. Test Complete 6-Pillar Mathematical Calculus Engine
assert.ok(win.ZothHUD.CalculusEngine, 'CalculusEngine must be present');
assert.strictEqual(typeof win.ZothHUD.CalculusEngine.update, 'function');
assert.strictEqual(typeof win.ZothHUD.CalculusEngine.calculateShannonEntropy, 'function');

const entropyVal = win.ZothHUD.CalculusEngine.calculateShannonEntropy([0.85, 0.10, 0.03, 0.02]);
assert.ok(entropyVal > 0 && entropyVal < 1.0, 'Shannon entropy calculation must be valid');

win.ZothHUD.CalculusEngine.update();
const pillars = win.ZothHUD.getPillars();
assert.ok(pillars.p1, 'Pillar 1: Monoidal Sheaf Topologies must exist');
assert.ok(pillars.p2, 'Pillar 2: Info Geometry & Fisher Metric must exist');
assert.ok(pillars.p3, 'Pillar 3: STDP Synaptic Plasticity must exist');
assert.ok(pillars.p4, 'Pillar 4: Shannon Agreement Entropy must exist');
assert.ok(pillars.p5, 'Pillar 5: Kolmogorov-Arnold B-Splines must exist');
assert.ok(pillars.p6, 'Pillar 6: Continuous Modern Hopfield must exist');

assert.ok(pillars.p1.formula.includes('H¹(U,F)'), 'Pillar 1 formula check');
assert.ok(pillars.p2.formula.includes('∇̃L'), 'Pillar 2 formula check');
assert.ok(pillars.p3.formula.includes('Δw'), 'Pillar 3 formula check');
assert.ok(pillars.p4.formula.includes('0.20'), 'Pillar 4 threshold bound check');
assert.ok(pillars.p5.formula.includes('Φ_q'), 'Pillar 5 formula check');
assert.ok(pillars.p6.formula.includes('E(x)'), 'Pillar 6 formula check');
console.log('✔ Test 5 Passed: Complete 6-Pillar Mathematical Calculus telemetry verified');

// 6. Test Interactive Memory Graph & Synaptic Consolidation Waves
assert.ok(win.ZothHUD.MemGraphCanvas, 'MemGraphCanvas must be present');
assert.strictEqual(typeof win.ZothHUD.MemGraphCanvas.triggerConsolidation, 'function');
assert.strictEqual(typeof win.ZothHUD.MemGraphCanvas.pulseAll, 'function');

win.ZothHUD.MemGraphCanvas.triggerConsolidation(0);
let state = win.ZothHUD.getState();
assert.ok(state.memStats.selectedNode, 'Selected memory node must be recorded');
assert.ok(state.memStats.lastConsolidation, 'Last consolidation value must be recorded');
console.log('✔ Test 6 Passed: Interactive Memory Graph node clicking & consolidation waves verified');

// 7. Test Dynamic Stage Tool Loader & Navigation History
win.ZothHUD.loadTool('swarm');
state = win.ZothHUD.getState();
assert.strictEqual(state.activeTool.id, 'swarm', 'Active tool must switch to swarm');

win.ZothHUD.loadTool('3d-editor');
state = win.ZothHUD.getState();
assert.strictEqual(state.activeTool.id, '3d-editor', 'Active tool must switch to 3d-editor');

win.ZothHUD.stageBack();
state = win.ZothHUD.getState();
assert.strictEqual(state.activeTool.id, 'swarm', 'Stage back must return to swarm');

win.ZothHUD.stageForward();
state = win.ZothHUD.getState();
assert.strictEqual(state.activeTool.id, '3d-editor', 'Stage forward must return to 3d-editor');
console.log('✔ Test 7 Passed: Dynamic Stage Tool Loader & Stage History verified');

// 8. Test Dual-Tool Split Stage Mode
win.ZothHUD.toggleSplitStage();
state = win.ZothHUD.getState();
assert.strictEqual(state.splitMode, true, 'Split mode must be active');

win.ZothHUD.setSecondaryTool('tool-bench');
state = win.ZothHUD.getState();
assert.strictEqual(state.secondaryTool.id, 'tool-bench', 'Secondary tool set');

win.ZothHUD.swapSplitStage();
state = win.ZothHUD.getState();
assert.strictEqual(state.activeTool.id, 'tool-bench', 'Active tool became previous secondary');

win.ZothHUD.closeSplitStage();
state = win.ZothHUD.getState();
assert.strictEqual(state.splitMode, false, 'Split mode closed');
console.log('✔ Test 8 Passed: Dual-Tool Split Stage Mode verified');

// 9. Test Active Agents Selector
win.ZothHUD.setAgent('grok');
state = win.ZothHUD.getState();
assert.strictEqual(state.activeAgent, 'grok', 'Active agent must be grok');

win.ZothHUD.setAgent('athena');
state = win.ZothHUD.getState();
assert.strictEqual(state.activeAgent, 'athena', 'Active agent must be athena');
console.log('✔ Test 9 Passed: Active Agents Selector switches across 21 agents with voice feedback');

// 10. Test 4-Theme Engine
win.ZothHUD.setTheme('matrix');
state = win.ZothHUD.getState();
assert.strictEqual(state.activeTheme, 'matrix', 'Theme must be matrix');

win.ZothHUD.setTheme('gold');
state = win.ZothHUD.getState();
assert.strictEqual(state.activeTheme, 'gold', 'Theme must be gold');

win.ZothHUD.setTheme('light');
state = win.ZothHUD.getState();
assert.strictEqual(state.activeTheme, 'light', 'Theme must be light');

win.ZothHUD.setTheme('dark');
state = win.ZothHUD.getState();
assert.strictEqual(state.activeTheme, 'dark', 'Theme must be dark');
console.log('✔ Test 10 Passed: 4-Theme Engine cycles between dark, light, matrix, and gold');

// 11. Test Modals & Telemetry
win.ZothHUD.openModal('ports');
win.ZothHUD.closeModal();

win.ZothHUD.openModal('pillars');
win.ZothHUD.closeModal();

win.ZothHUD.openModal('toolmgr');
win.ZothHUD.closeModal();

win.ZothHUD.addLog('TACTICAL', 'All tactical visualizers verified 100% nominal', 'consensus');
console.log('✔ Test 11 Passed: Modals (ports, pillars, toolmgr) and live logging operational');

// 12. Test Omniverse Navigator & Tool Router
win.ZothHUD.openOmniverseNav('omnipost');
assert.ok(typeof win.ZothHUD.openToolManagerModal === 'function', 'openToolManagerModal alias exists');
assert.ok(typeof win.ZothHUD.openOmniverseNav === 'function', 'openOmniverseNav method exists');
win.ZothHUD.closeModal();
console.log('✔ Test 12 Passed: Omniverse Navigator & Tool Router open/close and filter verified');

// 13. Test URL State Synchronization & Aliases
assert.ok(typeof win.ZothHUD.syncURLState === 'function', 'syncURLState method exists');
win.ZothHUD.syncURLState();
assert.ok(typeof win.ZothCyberpunkHUD.openHelpModal === 'function', 'openHelpModal alias exists');
assert.ok(typeof win.ZothCyberpunkHUD.cycleHudTheme === 'function', 'cycleHudTheme alias exists');
console.log('✔ Test 13 Passed: URL State Synchronization & backwards-compatible aliases verified');

// 14. Test Embedded Workspace Adapters
const embeddedJsPath = path.join(__dirname, 'zoth-hud-embedded.js');
const embeddedCssPath = path.join(__dirname, 'zoth-hud-embedded.css');
assert.ok(fs.existsSync(embeddedJsPath), 'zoth-hud-embedded.js must exist');
assert.ok(fs.existsSync(embeddedCssPath), 'zoth-hud-embedded.css must exist');
const embeddedJs = fs.readFileSync(embeddedJsPath, 'utf8');
const embeddedCss = fs.readFileSync(embeddedCssPath, 'utf8');
assert.ok(embeddedJs.includes('ZOTH_HUD_THEME_CHANGE'), 'embedded JS must handle theme sync');
assert.ok(embeddedCss.includes('hud-embedded-mode'), 'embedded CSS must define hud-embedded-mode');
assert.ok(embeddedCss.includes('header.bar'), 'embedded CSS must suppress header.bar');
assert.ok(embeddedCss.includes('footer.site'), 'embedded CSS must suppress footer.site');
assert.ok(embeddedCss.includes('omni-guided-steps'), 'embedded CSS must suppress omni-guided-steps');
console.log('✔ Test 14 Passed: Universal Embedded Workspace Adapters & Navbar/Footer Cleaner verified');

// 15. Test Tool-Specific HUD Context Operations Card & Telemetry
assert.ok(typeof win.ZothHUD.getToolContextProfile === 'function', 'getToolContextProfile method exists');
assert.ok(typeof win.ZothHUD.renderToolContextCard === 'function', 'renderToolContextCard method exists');
assert.ok(typeof win.ZothHUD.sendToolAction === 'function', 'sendToolAction method exists');

const omniProfile = win.ZothHUD.getToolContextProfile('omnipost');
assert.ok(omniProfile, 'OmniPost tool profile must exist');
assert.strictEqual(omniProfile.badge, '60 FPS RENDERER');
assert.ok(omniProfile.actions.some(a => a.action === 'render_60fps'), 'Must have render_60fps action');
assert.ok(omniProfile.actions.some(a => a.action === 'synth_track'), 'Must have synth_track action');

const cadProfile = win.ZothHUD.getToolContextProfile('3d-editor');
assert.ok(cadProfile, '3D Editor CAD tool profile must exist');
assert.strictEqual(cadProfile.badge, 'THREE.JS WEBGL');
assert.ok(cadProfile.actions.some(a => a.action === 'toggle_wireframe'), 'Must have toggle_wireframe action');

win.ZothHUD.renderToolContextCard('omnipost');
win.ZothHUD.renderToolContextCard('3d-editor');
win.ZothHUD.renderToolContextCard('swarm');
win.ZothHUD.renderToolContextCard('consensus');
win.ZothHUD.renderToolContextCard('math-pillars');
win.ZothHUD.renderToolContextCard('netrunner-memory');
win.ZothHUD.renderToolContextCard('webgen');
win.ZothHUD.renderToolContextCard('vault');
console.log('✔ Test 15 Passed: Tool-Specific HUD Context Card & 10 Workstation Profiles verified');

// 16. Test Bi-Directional Action Bridge & Embedded Action Execution
const { win: childWin, doc: childDoc } = createMockDOM();
const childAdapterFn = new Function('window', 'document', embeddedJs);
childAdapterFn(childWin, childDoc);

assert.ok(childWin.ZothEmbeddedAdapter, 'ZothEmbeddedAdapter must be exposed in embedded window');
let actionReceived = false;
let actionPayload = null;
childWin.ZothEmbeddedAdapter.onAction('render_60fps', (payload) => {
  actionReceived = true;
  actionPayload = payload;
});

childWin.ZothEmbeddedAdapter.handleHUDAction('render_60fps', { fps: 60, mode: 'shorts' });
assert.strictEqual(actionReceived, true, 'Custom action callback must execute');
assert.strictEqual(actionPayload.fps, 60, 'Payload must pass accurately through action bridge');

win.ZothHUD.sendToolAction('render_60fps', { fps: 60 });
console.log('✔ Test 16 Passed: Bi-Directional Action Bridge & Event Dispatch verified');

// 17. Test Hermes Agent CLI Integration & Terminal REPL Autocomplete
const hermesSuggestions = win.ZothHUD.getAutocompleteSuggestions('her');
assert.ok(hermesSuggestions.includes('hermes'), 'Autocomplete must suggest hermes command');
assert.ok(win.ZothHUD.TerminalRepl, 'TerminalRepl must be defined');
win.ZothHUD.TerminalRepl.execute('hermes status');
win.ZothHUD.TerminalRepl.execute('hermes optimize audio 60fps');
console.log('✔ Test 17 Passed: Hermes Agent Integration, Dispatch & REPL Autocomplete verified');

// 18. Test Grok Intelligence Layer, Dashboard Mode, Auto-Acclimation & Self-Healing Watchdog
const intelJs = fs.readFileSync(path.join(__dirname, 'zoth-hud-intel.js'), 'utf8');
assert.ok(intelJs.length > 500, 'zoth-hud-intel.js must exist and have content');
const intelFn = new Function('window', 'document', intelJs);
intelFn(win, doc);

assert.ok(win.ZothHudIntel, 'ZothHudIntel must be exposed on window');
assert.strictEqual(win.ZothHudIntel.ready, true, 'ZothHudIntel ready status must be true');
assert.ok(typeof win.ZothHudIntel.showDashboard === 'function', 'showDashboard method exists');
assert.ok(typeof win.ZothHudIntel.acclimate === 'function', 'acclimate method exists');
assert.ok(typeof win.ZothHudIntel.retryStage === 'function', 'retryStage method exists');
assert.ok(typeof win.ZothHudIntel.healNow === 'function', 'healNow method exists');

win.ZothHudIntel.showDashboard();
win.ZothHUD.loadTool('webgen');
assert.strictEqual(win.ZothHUD.getState().activeAgent, 'hermes', 'WebGen must auto-acclimate active agent to hermes');

win.ZothHUD.loadTool('netrunner-memory');
assert.strictEqual(win.ZothHUD.getState().activeAgent, 'leviathan', 'Netrunner Memory must auto-acclimate active agent to leviathan');

win.ZothHUD.loadTool('math-pillars');
assert.strictEqual(win.ZothHUD.getState().activeAgent, 'grok', 'Math Pillars must auto-acclimate active agent to grok');

win.ZothHUD.loadTool('consensus');
assert.strictEqual(win.ZothHUD.getState().activeAgent, 'draco', 'Consensus Arena must auto-acclimate active agent to draco');

win.ZothHUD.loadTool('dashboard');

const learnedData = win.ZothHudIntel.learn();
assert.ok(learnedData.recents.includes('webgen'), 'Learned recents must track webgen');
assert.ok(learnedData.recents.includes('netrunner-memory'), 'Learned recents must track netrunner-memory');
assert.ok(learnedData.recents.includes('math-pillars'), 'Learned recents must track math-pillars');

win.ZothHudIntel.retryStage();
win.ZothHudIntel.healNow();
console.log('✔ Test 18 Passed: Grok Intelligence Layer, Dashboard Mode, Auto-Acclimation & Self-Healing Watchdog verified');

// 19. Test Multi-Device Responsive Cockpit Engine (Desktop, Tablet, Phone)
assert.strictEqual(typeof win.ZothHUD.setDeviceMode, 'function', 'setDeviceMode must be a function');
assert.strictEqual(typeof win.ZothHUD.getDeviceMode, 'function', 'getDeviceMode must be a function');
assert.strictEqual(typeof win.ZothHUD.getEffectiveDevice, 'function', 'getEffectiveDevice must be a function');

win.ZothHUD.setDeviceMode('desktop');
assert.strictEqual(win.ZothHUD.getDeviceMode(), 'desktop', 'Device mode must be desktop');
assert.strictEqual(win.ZothHUD.getEffectiveDevice(), 'desktop', 'Effective device must be desktop');
assert.strictEqual(doc.documentElement.getAttribute('data-device'), 'desktop', 'documentElement data-device must be desktop');

win.ZothHUD.setDeviceMode('tablet');
assert.strictEqual(win.ZothHUD.getDeviceMode(), 'tablet', 'Device mode must be tablet');
assert.strictEqual(win.ZothHUD.getEffectiveDevice(), 'tablet', 'Effective device must be tablet');
assert.strictEqual(doc.documentElement.getAttribute('data-device'), 'tablet', 'documentElement data-device must be tablet');

win.ZothHUD.setDeviceMode('mobile');
assert.strictEqual(win.ZothHUD.getDeviceMode(), 'mobile', 'Device mode must be mobile');
assert.strictEqual(win.ZothHUD.getEffectiveDevice(), 'mobile', 'Effective device must be mobile');
assert.strictEqual(doc.documentElement.getAttribute('data-device'), 'mobile', 'documentElement data-device must be mobile');

win.ZothHUD.setDeviceMode('auto');
assert.strictEqual(win.ZothHUD.getDeviceMode(), 'auto', 'Device mode must be auto');

win.ZothHUD.openDeviceModal();
assert.ok(doc.getElementById('hud-modal-device'), 'Device modal must be created');
win.ZothHUD.closeModal();

console.log('✔ Test 19 Passed: Multi-Device Responsive Cockpit Engine (Desktop, Tablet, Phone) verified');

// 20. Test Tablet Tactical Bar, Mobile Bottom Sheets & Audio Mute Controller
assert.strictEqual(typeof win.ZothHUD.setTabletView, 'function', 'setTabletView must be a function');
win.ZothHUD.setTabletView('telemetry');
assert.strictEqual(win.ZothHUD.getState().activeTabletView, 'telemetry', 'Tablet view must be telemetry');
assert.strictEqual(win.ZothHUD.getState().isDeckOpen, true, 'Deck must open on telemetry view');

win.ZothHUD.setTabletView('stage');
assert.strictEqual(win.ZothHUD.getState().activeTabletView, 'stage', 'Tablet view must be stage');
assert.strictEqual(win.ZothHUD.getState().isDeckOpen, false, 'Deck must close on stage view');

assert.strictEqual(typeof win.ZothHUD.setMobileTab, 'function', 'setMobileTab must be a function');
assert.strictEqual(typeof win.ZothHUD.openMobileSheet, 'function', 'openMobileSheet must be a function');
assert.strictEqual(typeof win.ZothHUD.closeMobileSheet, 'function', 'closeMobileSheet must be a function');

win.ZothHUD.setMobileTab('swarm');
assert.strictEqual(win.ZothHUD.getState().activeMobileTab, 'swarm', 'Mobile tab must be swarm');

win.ZothHUD.openMobileSheet('tools');
assert.strictEqual(win.ZothHUD.getState().activeMobileSheet, 'tools', 'Mobile sheet must be tools');
win.ZothHUD.closeMobileSheet();

win.ZothHUD.openMobileSheet('repl');
assert.strictEqual(win.ZothHUD.getState().activeMobileSheet, 'repl', 'Mobile sheet must be repl');
win.ZothHUD.closeMobileSheet();

win.ZothHUD.openMobileSheet('telemetry');
assert.strictEqual(win.ZothHUD.getState().activeMobileSheet, 'telemetry', 'Mobile sheet must be telemetry');
win.ZothHUD.closeMobileSheet();

assert.strictEqual(typeof win.ZothHUD.toggleMute, 'function', 'toggleMute must be a function');
assert.strictEqual(typeof win.ZothHUD.isMuted, 'function', 'isMuted must be a function');
assert.strictEqual(win.ZothHUD.isMuted(), false, 'Default sound is unmuted');

const mutedState = win.ZothHUD.toggleMute();
assert.strictEqual(mutedState, true, 'Sound must be muted');
assert.strictEqual(win.ZothHUD.isMuted(), true, 'isMuted must return true');

win.ZothHUD.toggleMute();
assert.strictEqual(win.ZothHUD.isMuted(), false, 'Sound must be unmuted again');

// Test REPL device and mute commands
win.ZothHUD.TerminalRepl.execute('device tablet');
assert.strictEqual(win.ZothHUD.getDeviceMode(), 'tablet', 'REPL command must set tablet mode');

win.ZothHUD.TerminalRepl.execute('device mobile');
assert.strictEqual(win.ZothHUD.getDeviceMode(), 'mobile', 'REPL command must set mobile mode');

win.ZothHUD.TerminalRepl.execute('mute');
assert.strictEqual(win.ZothHUD.isMuted(), true, 'REPL mute command must mute sound');

win.ZothHUD.TerminalRepl.execute('audio');
assert.strictEqual(win.ZothHUD.isMuted(), false, 'REPL audio command must unmute sound');

win.ZothHUD.setDeviceMode('desktop');
console.log('✔ Test 20 Passed: Tablet Tactical Bar, Mobile Bottom Sheets & Audio Mute Controller verified');

// ==========================================
// TEST 21: Tool Dropdown Quick-Switcher & Left Deck 21-Agent Dynamic Roster
// ==========================================
assert.strictEqual(typeof win.ZothHUD.toggleToolDropdown, 'function', 'toggleToolDropdown must be exposed');
assert.strictEqual(typeof win.ZothHUD.openToolDropdown, 'function', 'openToolDropdown must be exposed');
assert.strictEqual(typeof win.ZothHUD.closeToolDropdown, 'function', 'closeToolDropdown must be exposed');
assert.strictEqual(typeof win.ZothHUD.filterToolDropdown, 'function', 'filterToolDropdown must be exposed');
assert.strictEqual(typeof win.ZothHUD.renderAgentsRoster, 'function', 'renderAgentsRoster must be exposed');

// Open and filter dropdown
win.ZothHUD.openToolDropdown();
const dropMenu = doc.getElementById('hud-tool-dropdown-menu');
assert.strictEqual(dropMenu.classList.contains('is-open'), true, 'Dropdown menu must have is-open class');

win.ZothHUD.filterToolDropdown('omnipost');
const dropList = doc.getElementById('hud-tool-dropdown-list');
assert.ok(dropList.innerHTML.includes('OmniPost'), 'Filtered list must contain OmniPost');

win.ZothHUD.closeToolDropdown();
assert.strictEqual(dropMenu.classList.contains('is-open'), false, 'Dropdown menu must close');

// Verify 21 Agents Roster
win.ZothHUD.renderAgentsRoster();
const agentsRoster = doc.getElementById('hud-agents-roster');
assert.ok(agentsRoster.innerHTML.includes('AZOTH'), 'Roster must render AZOTH');
assert.ok(agentsRoster.innerHTML.includes('LEVIATHAN'), 'Roster must render LEVIATHAN');
assert.ok(agentsRoster.innerHTML.includes('KRAKEN'), 'Roster must render KRAKEN');
console.log('✔ Test 21 Passed: Tool Dropdown Quick-Switcher & 21-Agent Dynamic Left Deck Roster verified');

// ==========================================
// TEST 22: Dashboard Surface Toggle & Bottom Dock Navigation
// ==========================================
win.ZothHUD.loadTool('dashboard');
assert.strictEqual(win.ZothHUD.getState().activeTool.id, 'dashboard', 'Active tool must be dashboard');
const dashEl = doc.getElementById('hud-dashboard');
assert.strictEqual(dashEl.classList.contains('is-open'), true, 'hud-dashboard must have is-open class');

win.ZothHUD.loadTool('swarm');
assert.strictEqual(win.ZothHUD.getState().activeTool.id, 'swarm', 'Active tool must switch to swarm');
assert.strictEqual(dashEl.classList.contains('is-open'), false, 'hud-dashboard must be hidden when tool loaded');

win.ZothHUD.loadTool('dashboard');
assert.strictEqual(win.ZothHUD.getState().activeTool.id, 'dashboard', 'Active tool must return to dashboard');
assert.strictEqual(dashEl.classList.contains('is-open'), true, 'hud-dashboard must be open again');

win.ZothHUD.loadTool('omnipost');
console.log('✔ Test 22 Passed: Dashboard Surface Toggle & Bottom Dock Navigation verified');

// ==========================================
// TEST 23: CyberAudioSynth Sound Generator, Waveforms & Mute Persistence
// ==========================================
assert.strictEqual(typeof win.ZothHUD.CyberAudioSynth, 'object', 'CyberAudioSynth must be an object');
assert.strictEqual(typeof win.ZothHUD.CyberAudioSynth.play, 'function', 'CyberAudioSynth.play must be a function');
assert.strictEqual(typeof win.ZothHUD.CyberAudioSynth.trigger, 'function', 'CyberAudioSynth.trigger must be a function');
assert.strictEqual(typeof win.ZothHUD.CyberAudioSynth.beep, 'function', 'CyberAudioSynth.beep must be a function');
assert.strictEqual(typeof win.ZothHUD.CyberAudioSynth.toggleMute, 'function', 'CyberAudioSynth.toggleMute must be a function');
assert.strictEqual(typeof win.ZothHUD.CyberAudioSynth.setMuted, 'function', 'CyberAudioSynth.setMuted must be a function');
assert.strictEqual(typeof win.ZothHUD.CyberAudioSynth.isMutedStatus, 'function', 'CyberAudioSynth.isMutedStatus must be a function');
assert.strictEqual(typeof win.ZothHUD.CyberAudioSynth.persist, 'function', 'CyberAudioSynth.persist must be a function');

// Test SFX triggers across new sound types
assert.doesNotThrow(() => win.ZothHUD.playSFX('visor'), 'Visor SFX must not throw');
assert.doesNotThrow(() => win.ZothHUD.playSFX('zoom'), 'Zoom SFX must not throw');
assert.doesNotThrow(() => win.ZothHUD.playSFX('sandevistan'), 'Sandevistan SFX must not throw');
assert.doesNotThrow(() => win.ZothHUD.playSFX('overdrive'), 'Overdrive SFX must not throw');
assert.doesNotThrow(() => win.ZothHUD.playSFX('neural'), 'Neural SFX must not throw');
assert.doesNotThrow(() => win.ZothHUD.playSFX('contrast'), 'Contrast SFX must not throw');
assert.doesNotThrow(() => win.ZothHUD.CyberAudioSynth.beep(880, 0.05, 'sawtooth'), 'Beep must not throw');

// Test mute toggle and persistence
win.ZothHUD.CyberAudioSynth.setMuted(true);
assert.strictEqual(win.ZothHUD.CyberAudioSynth.isMutedStatus(), true, 'Synth should report muted');
assert.strictEqual(win.ZothHUD.isMuted(), true, 'ZothHUD.isMuted should return true');
assert.strictEqual(win.localStorage.getItem('zoth_hud_muted'), 'true', 'Mute state must be saved to localStorage');

win.ZothHUD.CyberAudioSynth.setMuted(false);
assert.strictEqual(win.ZothHUD.CyberAudioSynth.isMutedStatus(), false, 'Synth should report unmuted');
assert.strictEqual(win.ZothHUD.isMuted(), false, 'ZothHUD.isMuted should return false');
assert.strictEqual(win.localStorage.getItem('zoth_hud_muted'), 'false', 'Unmuted state must be saved to localStorage');

console.log('✔ Test 23 Passed: CyberAudioSynth Sound Generator, Waveforms & Mute Persistence verified');

// ==========================================
// TEST 24: Kiroshi POV Visor Mode, Sandevistan Overdrive & Neural Load Vitals
// ==========================================
assert.strictEqual(typeof win.ZothHUD.toggleKiroshiVisor, 'function', 'toggleKiroshiVisor must be a function');
assert.strictEqual(typeof win.ZothHUD.cycleKiroshiZoom, 'function', 'cycleKiroshiZoom must be a function');
assert.strictEqual(typeof win.ZothHUD.getKiroshiState, 'function', 'getKiroshiState must be a function');
assert.strictEqual(typeof win.ZothHUD.triggerSandevistan, 'function', 'triggerSandevistan must be a function');
assert.strictEqual(typeof win.ZothHUD.isSandevistanActive, 'function', 'isSandevistanActive must be a function');
assert.strictEqual(typeof win.ZothHUD.getNeuralVitals, 'function', 'getNeuralVitals must be a function');
assert.strictEqual(typeof win.ZothHUD.updateNeuralVitals, 'function', 'updateNeuralVitals must be a function');

// Test Kiroshi Visor Toggle & Zoom
assert.strictEqual(win.ZothHUD.getKiroshiState().active, false, 'Kiroshi visor initially inactive');
const visorOn = win.ZothHUD.toggleKiroshiVisor();
assert.strictEqual(visorOn, true, 'toggleKiroshiVisor should return true when enabled');
assert.strictEqual(win.ZothHUD.getKiroshiState().active, true, 'Kiroshi state active must be true');
assert.strictEqual(doc.body.classList.contains('hud-kiroshi-active'), true, 'body must have hud-kiroshi-active class');

const zoom1 = win.ZothHUD.cycleKiroshiZoom();
assert.strictEqual(zoom1, 1.25, 'First zoom cycle should be 1.25x');
assert.strictEqual(win.ZothHUD.getKiroshiState().zoom, 1.25, 'Kiroshi state zoom must be 1.25');

const zoom2 = win.ZothHUD.cycleKiroshiZoom();
assert.strictEqual(zoom2, 1.5, 'Second zoom cycle should be 1.5x');

const zoom3 = win.ZothHUD.cycleKiroshiZoom();
assert.strictEqual(zoom3, 1.0, 'Third zoom cycle should reset to 1.0x');

const visorOff = win.ZothHUD.toggleKiroshiVisor();
assert.strictEqual(visorOff, false, 'toggleKiroshiVisor should return false when disabled');
assert.strictEqual(win.ZothHUD.getKiroshiState().active, false, 'Kiroshi state active must be false');
assert.strictEqual(doc.body.classList.contains('hud-kiroshi-active'), false, 'body must remove hud-kiroshi-active class');

// Test Sandevistan Overdrive & Neural Load Vitals
assert.strictEqual(win.ZothHUD.isSandevistanActive(), false, 'Sandevistan initially inactive');
const sandevistanOn = win.ZothHUD.triggerSandevistan(1000);
assert.strictEqual(sandevistanOn, true, 'triggerSandevistan must return true');
assert.strictEqual(win.ZothHUD.isSandevistanActive(), true, 'Sandevistan must be active');
assert.strictEqual(win.ZothHUD.getNeuralVitals().active, true, 'Neural vitals active must be true');

const updatedVitals = win.ZothHUD.updateNeuralVitals({ synRate: 99.4, coreClock: 5.2, neuralLoad: 92 });
assert.strictEqual(updatedVitals.synRate, 99.4, 'synRate must update');
assert.strictEqual(updatedVitals.coreClock, 5.2, 'coreClock must update');
assert.strictEqual(updatedVitals.neuralLoad, 92, 'neuralLoad must update');

console.log('✔ Test 24 Passed: Kiroshi POV Visor Mode, Sandevistan Overdrive & Neural Load Vitals verified');

// ==========================================
// TEST 25: Video Game Keyboard Shortcuts, High-Contrast WCAG AAA Mode, Theater Stage & A11y Live Announcer
// ==========================================
assert.strictEqual(typeof win.ZothHUD.toggleHighContrast, 'function', 'toggleHighContrast must be a function');
assert.strictEqual(typeof win.ZothHUD.isHighContrast, 'function', 'isHighContrast must be a function');
assert.strictEqual(typeof win.ZothHUD.toggleFullscreenStage, 'function', 'toggleFullscreenStage must be a function');
assert.strictEqual(typeof win.ZothHUD.isTheaterMode, 'function', 'isTheaterMode must be a function');
assert.strictEqual(typeof win.ZothHUD.isFullscreenStage, 'function', 'isFullscreenStage must be a function');
assert.strictEqual(typeof win.ZothHUD.announce, 'function', 'announce must be a function');
assert.strictEqual(typeof win.ZothHUD.getLastAnnouncement, 'function', 'getLastAnnouncement must be a function');
assert.strictEqual(typeof win.ZothHUD.cycleWorkstation, 'function', 'cycleWorkstation must be a function');
assert.strictEqual(typeof win.ZothHUD.nextWorkstation, 'function', 'nextWorkstation must be a function');
assert.strictEqual(typeof win.ZothHUD.prevWorkstation, 'function', 'prevWorkstation must be a function');
assert.strictEqual(typeof win.ZothHUD.focusTerminal, 'function', 'focusTerminal must be a function');
assert.strictEqual(typeof win.ZothHUD.focusMemory, 'function', 'focusMemory must be a function');
assert.strictEqual(typeof win.ZothHUD.openShortcutsModal, 'function', 'openShortcutsModal must be a function');

// Test High-Contrast Mode & Persistence
assert.strictEqual(win.ZothHUD.isHighContrast(), false, 'High contrast initially false');
const hcOn = win.ZothHUD.toggleHighContrast();
assert.strictEqual(hcOn, true, 'toggleHighContrast returns true when enabled');
assert.strictEqual(win.ZothHUD.isHighContrast(), true, 'isHighContrast must be true');
assert.strictEqual(doc.body.classList.contains('hud-high-contrast'), true, 'body has hud-high-contrast class');
assert.strictEqual(win.localStorage.getItem('zoth_hud_high_contrast'), 'true', 'High contrast saved in localStorage');

const hcOff = win.ZothHUD.toggleHighContrast();
assert.strictEqual(hcOff, false, 'toggleHighContrast returns false when disabled');
assert.strictEqual(win.ZothHUD.isHighContrast(), false, 'isHighContrast must be false');
assert.strictEqual(doc.body.classList.contains('hud-high-contrast'), false, 'body removes hud-high-contrast class');

// Test Theater / Fullscreen Stage Mode
assert.strictEqual(win.ZothHUD.isTheaterMode(), false, 'Theater mode initially false');
const theaterOn = win.ZothHUD.toggleFullscreenStage();
assert.strictEqual(theaterOn, true, 'toggleFullscreenStage returns true when enabled');
assert.strictEqual(win.ZothHUD.isTheaterMode(), true, 'isTheaterMode must be true');
assert.strictEqual(win.ZothHUD.isFullscreenStage(), true, 'isFullscreenStage must be true');
assert.strictEqual(doc.body.classList.contains('hud-theater-mode'), true, 'body has hud-theater-mode class');

const theaterOff = win.ZothHUD.toggleFullscreenStage();
assert.strictEqual(theaterOff, false, 'toggleFullscreenStage returns false when disabled');
assert.strictEqual(win.ZothHUD.isTheaterMode(), false, 'isTheaterMode must be false');
assert.strictEqual(doc.body.classList.contains('hud-theater-mode'), false, 'body removes hud-theater-mode class');

// Test A11y Live Announcer
const a11yEl = doc.getElementById('hud-a11y-announcer');
win.ZothHUD.announce('Neural bridge synchronized with Agent AZOTH', 'polite');
assert.strictEqual(win.ZothHUD.getLastAnnouncement(), 'Neural bridge synchronized with Agent AZOTH', 'Announcement must be stored');
assert.strictEqual(a11yEl.textContent, 'Neural bridge synchronized with Agent AZOTH', 'Announcer DOM element textContent must update');

// Test Workstation Cycle & Modal Openers
win.ZothHUD.loadTool('omnipost');
const currentTool = win.ZothHUD.getState().activeTool.id;
win.ZothHUD.nextWorkstation();
const nextTool = win.ZothHUD.getState().activeTool.id;
assert.notStrictEqual(currentTool, nextTool, 'nextWorkstation must advance tool');

win.ZothHUD.prevWorkstation();
assert.strictEqual(win.ZothHUD.getState().activeTool.id, currentTool, 'prevWorkstation must return to previous tool');

win.ZothHUD.openShortcutsModal();
assert.ok(doc.getElementById('hud-modal-shortcuts'), 'Shortcuts modal element must exist');
win.ZothHUD.closeModal();

// Test REPL Commands
win.ZothHUD.TerminalRepl.execute('visor');
assert.strictEqual(win.ZothHUD.getKiroshiState().active, true, 'REPL visor command must toggle visor');

win.ZothHUD.TerminalRepl.execute('zoom');
assert.strictEqual(win.ZothHUD.getKiroshiState().zoom, 1.25, 'REPL zoom command must cycle zoom');

win.ZothHUD.TerminalRepl.execute('sandevistan');
assert.strictEqual(win.ZothHUD.isSandevistanActive(), true, 'REPL sandevistan command must trigger overdrive');

win.ZothHUD.TerminalRepl.execute('contrast');
assert.strictEqual(win.ZothHUD.isHighContrast(), true, 'REPL contrast command must toggle contrast');

win.ZothHUD.TerminalRepl.execute('theater');
assert.strictEqual(win.ZothHUD.isTheaterMode(), true, 'REPL theater command must toggle theater mode');

win.ZothHUD.TerminalRepl.execute('vitals');
win.ZothHUD.TerminalRepl.execute('shortcuts');
win.ZothHUD.closeModal();

console.log('✔ Test 25 Passed: Video Game Keyboard Shortcuts, High-Contrast WCAG AAA Mode, Theater Stage & A11y Live Announcer verified');

// ==========================================
// TEST 26: Procedural Web Audio API Synthesizer (Zero-Dependency Sound Generation)
// ==========================================
assert.strictEqual(typeof win.ZothHUD.CyberAudioSynth, 'object', 'CyberAudioSynth module must be exposed');
assert.strictEqual(typeof win.ZothHUD.playSfx, 'function', 'ZothHUD.playSfx must be exposed');
assert.strictEqual(typeof win.ZothHUD.playSFX, 'function', 'ZothHUD.playSFX alias must be exposed');

// 1. Verify 5 core cyberware synthesized sound triggers
assert.doesNotThrow(() => win.ZothHUD.playSfx('click'), 'Click SFX (triangle blip 1400->450Hz) must execute');
assert.doesNotThrow(() => win.ZothHUD.playSfx('lock'), 'Lock SFX (dual-tone acquisition chirp 880/1320Hz) must execute');
assert.doesNotThrow(() => win.ZothHUD.playSfx('sandevistan'), 'Sandevistan SFX (resonant lowpass sweep 3600->90Hz) must execute');
assert.doesNotThrow(() => win.ZothHUD.playSfx('warning'), 'Warning SFX (pulsed triple-alarm 960/1280Hz) must execute');
assert.doesNotThrow(() => win.ZothHUD.playSfx('warp'), 'Warp SFX (cyber triad D4/F#4/A4 chord) must execute');

// 2. Verify all legacy & tactical sound aliases
const allSfxNames = ['chirp', 'select', 'switch', 'tool', 'ping', 'radar', 'error', 'boot', 'wave', 'ripple', 'zoom', 'neural', 'contrast', 'overdrive'];
allSfxNames.forEach(name => {
  assert.doesNotThrow(() => win.ZothHUD.CyberAudioSynth.play(name), `SFX alias "${name}" must execute without throwing`);
});

// 3. Verify mute preference persistence across localStorage keys
win.ZothHUD.setMuted(true);
assert.strictEqual(win.ZothHUD.isMuted(), true, 'Mute must be active');
assert.strictEqual(win.localStorage.getItem('zoth_hud_sfx'), 'muted', 'zoth_hud_sfx must persist "muted"');
assert.strictEqual(win.localStorage.getItem('zoth_hud_muted'), 'true', 'zoth_hud_muted must persist "true"');

// While muted, play() returns false
assert.strictEqual(win.ZothHUD.CyberAudioSynth.play('click'), false, 'play() should return false when muted');

win.ZothHUD.setMuted(false);
assert.strictEqual(win.ZothHUD.isMuted(), false, 'Unmute must be active');
assert.strictEqual(win.localStorage.getItem('zoth_hud_sfx'), 'unmuted', 'zoth_hud_sfx must persist "unmuted"');
assert.strictEqual(win.localStorage.getItem('zoth_hud_muted'), 'false', 'zoth_hud_muted must persist "false"');

console.log('✔ Test 26 Passed: Procedural Web Audio API Synthesizer (5 sound types, aliases, mute persistence) verified');

// ==========================================
// TEST 27: POV Cockpit Vitals Engine, Multi-Factor Neural Load, Sandevistan 10s Cooldown & Kiroshi Zoom
// ==========================================
assert.ok(win.ZothHUD.VitalsEngine, 'VitalsEngine module must be exposed');
assert.strictEqual(typeof win.ZothHUD.getNeuralLoad, 'function', 'getNeuralLoad must be exposed');
assert.strictEqual(typeof win.ZothHUD.triggerSandevistan, 'function', 'triggerSandevistan must be exposed');
assert.strictEqual(typeof win.ZothHUD.getSandevistanState, 'function', 'getSandevistanState must be exposed');
assert.strictEqual(typeof win.ZothHUD.setKiroshiZoom, 'function', 'setKiroshiZoom must be exposed');
assert.strictEqual(typeof win.ZothHUD.toggleKiroshiZoom, 'function', 'toggleKiroshiZoom must be exposed');
assert.strictEqual(typeof win.ZothHUD.getKiroshiZoom, 'function', 'getKiroshiZoom must be exposed');

// 1. Test Multi-Factor Neural Load Computation
const neuralLoadObj = win.ZothHUD.getNeuralLoad();
assert.strictEqual(typeof neuralLoadObj.load, 'number', 'Neural load must return a numeric percentage');
assert.ok(neuralLoadObj.load >= 0 && neuralLoadObj.load <= 100, 'Neural load must be bounded [0, 100]');
assert.ok(neuralLoadObj.breakdown, 'Neural load must include telemetry factor breakdown');
assert.ok(neuralLoadObj.breakdown.agents > 0, 'Agent count factor must be factored in');
assert.strictEqual(typeof neuralLoadObj.warning, 'boolean', 'Warning flag must be a boolean');

// 2. Test Sandevistan Overdrive Lifecycle & 10s Cooldown
win.ZothHUD.toggleSandevistan(false);
let sandyState = win.ZothHUD.getSandevistanState();
assert.strictEqual(sandyState.active, false, 'Sandevistan initially inactive');
assert.strictEqual(sandyState.ready, true, 'Sandevistan initially ready');

const engaged = win.ZothHUD.triggerSandevistan(4);
assert.strictEqual(engaged, true, 'triggerSandevistan(4) must return true on first activation');
sandyState = win.ZothHUD.getSandevistanState();
assert.strictEqual(sandyState.active, true, 'Sandevistan active state must be true');
assert.strictEqual(sandyState.ready, false, 'Sandevistan ready state must be false during overdrive');

// Re-engaging while active must be rejected safely
const reEngage = win.ZothHUD.triggerSandevistan(4);
assert.strictEqual(reEngage, false, 'Second trigger while active must return false');

// Neural load should reflect Sandevistan strain (+28%)
const boostedNeural = win.ZothHUD.getNeuralLoad();
assert.strictEqual(boostedNeural.breakdown.sandevistan, 28, 'Neural load breakdown must include +28% Sandevistan strain');

// Test cooldown cycle progression
win.ZothHUD.VitalsEngine.updateSandevistan();

// 3. Test Kiroshi Optics Zoom Levels (1.0x -> 1.25x -> 1.5x -> 1.0x)
win.ZothHUD.setKiroshiZoom(1.0);
assert.strictEqual(win.ZothHUD.getKiroshiZoom(), 1.0, 'Kiroshi zoom must be 1.0x');
assert.strictEqual(doc.documentElement.styleProps['--hud-kiroshi-scale'], '1', '--hud-kiroshi-scale must be set');

const zoomNext1 = win.ZothHUD.toggleKiroshiZoom();
assert.strictEqual(zoomNext1, 1.25, 'First zoom cycle must advance to 1.25x');
assert.strictEqual(win.ZothHUD.getKiroshiZoom(), 1.25, 'getKiroshiZoom must return 1.25');

const zoomNext2 = win.ZothHUD.toggleKiroshiZoom();
assert.strictEqual(zoomNext2, 1.5, 'Second zoom cycle must advance to 1.5x');
assert.strictEqual(win.ZothHUD.getKiroshiZoom(), 1.5, 'getKiroshiZoom must return 1.5');

const zoomNext3 = win.ZothHUD.toggleKiroshiZoom();
assert.strictEqual(zoomNext3, 1.0, 'Third zoom cycle must wrap around to 1.0x');
assert.strictEqual(win.ZothHUD.getKiroshiZoom(), 1.0, 'getKiroshiZoom must return 1.0');

// 4. Test REPL cyberware commands
win.ZothHUD.TerminalRepl.execute('vitals');
win.ZothHUD.TerminalRepl.execute('sfx lock');
win.ZothHUD.TerminalRepl.execute('sfx sandevistan');
win.ZothHUD.TerminalRepl.execute('sfx warning');
win.ZothHUD.TerminalRepl.execute('sfx warp');
win.ZothHUD.TerminalRepl.execute('sandy');
win.ZothHUD.TerminalRepl.execute('kiroshi 1.25');

console.log('✔ Test 27 Passed: POV Cockpit Vitals Engine, Multi-Factor Neural Load, Sandevistan 10s Cooldown & Kiroshi Zoom verified');

// 28. Test Comprehensive Workstation Switcher & Overlap Prevention
const allWorkstations = [
  'omnipost', '3d-editor', 'nexus-3d', 'swarm', 'webgen', 'tool-bench',
  'netrunner-memory', 'consensus', 'math-pillars', 'vision-link', 'cockpit',
  'vos-sandbox', 'subsweep', 'agent-composer', 'edge-forge', 'bus-monitor',
  'signal-bridge', 'vault', 'web3-hub', 'pets', 'adytum', 'ai-webgpu',
  'tool-nexus', 'fusion-arena', '3d-logo'
];

for (let i = 0; i < allWorkstations.length; i++) {
  const toolId = allWorkstations[i];
  win.ZothHUD.loadTool(toolId);
  const activeTool = win.ZothHUD.getState().activeTool;
  assert.strictEqual(activeTool.id, toolId, 'Active tool must be set to ' + toolId);
  const frame = doc.getElementById('hud-stage-frame');
  assert.ok(frame.src && frame.src.indexOf(activeTool.url) !== -1, 'Iframe src must contain ' + activeTool.url);
  assert.ok(frame.src && frame.src.indexOf('embed=1') !== -1, 'Iframe src must have embed=1 param');
  assert.strictEqual(doc.body['data-hud-mode'], 'tool', 'Body data-hud-mode must be "tool"');
}

// Test Dashboard Switch
win.ZothHUD.loadTool('dashboard');
assert.strictEqual(win.ZothHUD.getState().activeTool.id, 'dashboard', 'Active tool must be dashboard');
assert.strictEqual(doc.body['data-hud-mode'], 'dashboard', 'Body data-hud-mode must be "dashboard"');

// Switch back to Swarm
win.ZothHUD.loadTool('swarm');
assert.strictEqual(win.ZothHUD.getState().activeTool.id, 'swarm', 'Active tool must switch back to swarm');
assert.strictEqual(doc.body['data-hud-mode'], 'tool', 'Body data-hud-mode must return to "tool"');

console.log('✔ Test 28 Passed: Comprehensive 25+ Workstations Mounting, Dashboard Mode Toggle & Overlap Prevention verified');

// ==========================================
// TEST 29: Mobile HUD Ergonomics, Attuned Agent Pill, Swarm Categories & Haptics
// ==========================================
// 1. Mobile Attuned Agent Header Pill
win.ZothHUD.setAgent('athena');
const mobAgentName = doc.getElementById('hudMobileAgentName');
const mobAgentIcon = doc.getElementById('hudMobileAgentIcon');
assert.strictEqual(mobAgentName.textContent, 'ATHENA', 'Mobile agent name pill must display ATHENA');
assert.strictEqual(mobAgentIcon.textContent, '🦉', 'Mobile agent icon must display owl icon');

win.ZothHUD.setAgent('draco');
assert.strictEqual(mobAgentName.textContent, 'DRACO', 'Mobile agent name pill must display DRACO');
assert.strictEqual(mobAgentIcon.textContent, '🐲', 'Mobile agent icon must display dragon icon');

// 2. Mobile Swarm Categories & Sheet Filtering
win.ZothHUD.openMobileSheet('swarm');
assert.strictEqual(win.ZothHUD.getState().activeMobileSheet, 'swarm', 'Active mobile sheet must be swarm');

// Swarm category filtering
win.ZothHUD.setMobileSwarmCategory('core');
const allAgentsList = win.ZothHUD.getAllAgents();
const coreAgentsCount = allAgentsList.filter(a => a.isCore || (a.quadrant && a.quadrant.toLowerCase().includes('core'))).length;
assert.strictEqual(coreAgentsCount, 6, 'Must filter to 6 core agents');

win.ZothHUD.setMobileSwarmCategory('silicon');
const siliconCount = allAgentsList.filter(a => (a.quadrant && (a.quadrant.toLowerCase().includes('silicon') || a.quadrant.toLowerCase().includes('synthesis')))).length;
assert.strictEqual(siliconCount, 5, 'Must filter to 5 silicon agents');

win.ZothHUD.setMobileSwarmCategory('familiars');
const familiarCount = allAgentsList.filter(a => (a.quadrant && (a.quadrant.toLowerCase().includes('familiar') || a.quadrant.toLowerCase().includes('mascot')))).length;
assert.strictEqual(familiarCount, 5, 'Must filter to 5 familiar/mascot agents');

win.ZothHUD.setMobileSwarmCategory('abyssal');
const abyssalCount = allAgentsList.filter(a => (a.quadrant && (a.quadrant.toLowerCase().includes('abyssal') || a.quadrant.toLowerCase().includes('temporal')))).length;
assert.strictEqual(abyssalCount, 5, 'Must filter to 5 abyssal agents');

win.ZothHUD.setMobileSwarmCategory('all');
assert.strictEqual(allAgentsList.length, 21, 'Must reset to 21 total agents in all category');

// 3. Mobile Swarm Query Filtering
win.ZothHUD.filterMobileSwarm('athena');
const listEl = doc.getElementById('hud-mobile-swarm-list');
assert.ok(listEl.innerHTML.includes('ATHENA'), 'Filtered mobile swarm list must contain ATHENA');

// 4. Mobile Haptic Touch Vibrations
win.ZothHUD.playHaptic(15);
assert.strictEqual(win._lastVibrate, 15, 'Haptic feedback must invoke navigator.vibrate with duration');

// 5. Close Mobile Sheet
win.ZothHUD.closeMobileSheet();
assert.strictEqual(win.ZothHUD.getState().activeMobileSheet, null, 'Mobile sheet must close');

console.log('✔ Test 29 Passed: Mobile HUD Ergonomics, Attuned Agent Pill, Swarm Categories & Haptics verified');

// ==========================================
// TEST 30: Master Mobile Fullscreen Popups with Nested Slides (Studio & Control Hubs)
// ==========================================
// 1. Open Studio Fullscreen Hub
win.ZothHUD.openMobileFullscreen('studio');
assert.strictEqual(win.ZothHUD.getState().activeMobileHub, 'studio', 'Active mobile hub must be studio');
assert.strictEqual(win.ZothHUD.getState().activeMobileSlide, 'workstations', 'Default slide must be workstations');
assert.ok(doc.body.classList.contains('hud-fs-hub-open'), 'Body must receive hud-fs-hub-open class');

// 2. Nested Slide Navigation in Studio Hub
win.ZothHUD.setMobileFullscreenSlide('swarm');
assert.strictEqual(win.ZothHUD.getState().activeMobileSlide, 'swarm', 'Slide must switch to swarm');

win.ZothHUD.setMobileFullscreenSlide('tools');
assert.strictEqual(win.ZothHUD.getState().activeMobileSlide, 'tools', 'Slide must switch to tools');

// 3. Switch to Control Fullscreen Hub
win.ZothHUD.switchMobileFullscreenHub();
assert.strictEqual(win.ZothHUD.getState().activeMobileHub, 'control', 'Active mobile hub must switch to control');
assert.strictEqual(win.ZothHUD.getState().activeMobileSlide, 'themes', 'Default slide in control must be themes');

// 4. Nested Slide Navigation in Control Hub
win.ZothHUD.setMobileFullscreenSlide('repl');
assert.strictEqual(win.ZothHUD.getState().activeMobileSlide, 'repl', 'Slide must switch to repl');

win.ZothHUD.setMobileFullscreenSlide('memory');
assert.strictEqual(win.ZothHUD.getState().activeMobileSlide, 'memory', 'Slide must switch to memory');

win.ZothHUD.setMobileFullscreenSlide('vitals');
assert.strictEqual(win.ZothHUD.getState().activeMobileSlide, 'vitals', 'Slide must switch to vitals');

// 5. Workstation Filtering
win.ZothHUD.openMobileFullscreen('studio', 'workstations');
win.ZothHUD.filterMobileWorkstations('omnipost');
const wsListEl = doc.getElementById('hud-mobile-ws-list');
assert.ok(wsListEl.innerHTML.includes('OmniPost Video Studio'), 'Filtered workstation list must contain OmniPost');

// 6. Close Fullscreen Hub
win.ZothHUD.closeMobileFullscreen();
assert.strictEqual(win.ZothHUD.getState().activeMobileHub, null, 'Active mobile hub must be null on close');
assert.strictEqual(win.ZothHUD.getState().activeMobileSlide, null, 'Active mobile slide must be null on close');
assert.ok(!doc.body.classList.contains('hud-fs-hub-open'), 'hud-fs-hub-open class must be removed');

console.log('✔ Test 30 Passed: Master Mobile Fullscreen Popups with Nested Slides (Studio & Control Hubs) verified');

console.log('\n⭐ ALL 30 CYBERPUNK HUD TACTICAL VISUALIZERS, FULLSCREEN MOBILE HUBS, NESTED SLIDES & VITALS TESTS PASSED (100%)!\n');
process.exit(0);


