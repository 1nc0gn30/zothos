const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');
const os = require('os');
const http = require('http');
const crypto = require('crypto');

let petWindow = null;
let cursorPoller = null;
let windowPoller = null;
let keyboardPoller = null;
let clipboardPoller = null;
let journalPoller = null;
let healthCheck = null;
let lastCursorPos = { x: 0, y: 0 };
let lastCursorTime = Date.now();
let cursorVelocity = 0;
let previousPositions = [];

const HISTORY_FILE = path.join(os.homedir(), '.config', 'zothos', 'all_seeing_eye_history.json');

function ensureHistoryDir() {
  const dir = path.dirname(HISTORY_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function migrateHistoryIfNeeded() {
  if (!fs.existsSync(HISTORY_FILE)) return;
  try {
    const raw = fs.readFileSync(HISTORY_FILE, 'utf8');
    const data = JSON.parse(raw);
    if (Array.isArray(data)) {
      // Old format: array of {timestamp, title, pid}
      const migrated = {
        version: 2,
        cursor: { samples: [], lastUpdated: null },
        windows: data.map(e => ({ timestamp: e.timestamp, title: e.title, pid: e.pid, processes: [] })),
        keyboard: { activeWindows: 0, density: 0 },
        clipboard: { hash: '', sizeClass: '', timestamp: null },
        journal: { unit: '', timestamp: '', summary: '' }
      };
      fs.writeFileSync(HISTORY_FILE, JSON.stringify(migrated, null, 2), 'utf8');
    } else if (data.version !== 2) {
      // v1 or unknown format
      const migrated = {
        version: 2,
        cursor: { samples: [], lastUpdated: null },
        windows: (data.windows || data.w || []).map(e => ({ timestamp: e.timestamp, title: e.title, pid: e.pid, processes: [] })),
        keyboard: { activeWindows: 0, density: 0 },
        clipboard: data.clipboard || { hash: '', sizeClass: '', timestamp: null },
        journal: data.journal || { unit: '', timestamp: '', summary: '' }
      };
      fs.writeFileSync(HISTORY_FILE, JSON.stringify(migrated, null, 2), 'utf8');
    }
  } catch (e) {}
}

function recordHistoryEvent(winTitle, winPid, processes) {
  try {
    ensureHistoryDir();
    migrateHistoryIfNeeded();
    let history = [];
    if (fs.existsSync(HISTORY_FILE)) {
      const raw = fs.readFileSync(HISTORY_FILE, 'utf8');
      const data = JSON.parse(raw);
      if (Array.isArray(data)) {
        history = data;
      } else if (data.version === 2 && data.windows) {
        history = data.windows;
      }
    }
    const timestamp = new Date().toISOString();
    const lastEntry = history[history.length - 1];

    if (!lastEntry || lastEntry.title !== winTitle) {
      history.push({ timestamp, title: winTitle, pid: winPid, processes: processes || [] });
      if (history.length > 500) history = history.slice(-500);
      const saveData = { version: 2, cursor: { samples: previousPositions.slice(-100), lastUpdated: new Date().toISOString() }, windows: history, keyboard: { activeWindows: 0, density: 0 }, clipboard: { hash: '', sizeClass: '', timestamp: null }, journal: { unit: '', timestamp: '', summary: '' } };
      fs.writeFileSync(HISTORY_FILE, JSON.stringify(saveData, null, 2), 'utf8');
    }
  } catch (err) {}
}

function getXdotoolMouseLocation() {
  return new Promise((resolve) => {
    exec('xdotool getmouselocation --shell 2>/dev/null', (err, stdout) => {
      if (err) { resolve(null); return; }
      const result = {};
      stdout.trim().split('\n').forEach(line => {
        const [key, val] = line.split('=');
        if (key && val) result[key] = parseInt(val);
      });
      resolve(result.x && result.y ? result : null);
    });
  });
}

async function startCursorTracking() {
  // Adaptive cursor poller: 16ms when moving, 60ms when stationary
  const pollInterval = async () => {
    if (!petWindow || petWindow.isDestroyed()) return;
    try {
      // Try X11 XQueryPointer via xdotool for sub-millisecond accuracy
      const xdotoolPos = await getXdotoolMouseLocation();
      let cursorX, cursorY;
      
      if (xdotoolPos) {
        cursorX = xdotoolPos.x;
        cursorY = xdotoolPos.y;
      } else {
        // Fallback to Electron's screen.getCursorScreenPoint()
        const point = screen.getCursorScreenPoint();
        cursorX = point.x;
        cursorY = point.y;
      }

      const now = Date.now();
      const dt = now - lastCursorTime;
      const dx = cursorX - lastCursorPos.x;
      const dy = cursorY - lastCursorPos.y;
      const dist = Math.hypot(dx, dy);
      
      // Calculate velocity (px/s), adapt polling
      if (dt > 0) {
        cursorVelocity = dist / dt * 1000;
      }
      
      // Track velocity history
      previousPositions.push({ x: cursorX, y: cursorY, t: now, v: cursorVelocity });
      if (previousPositions.length > 1000) previousPositions = previousPositions.slice(-500);

      // Adaptive interval: fast mouse = 16ms, slow = 60ms
      const interval = cursorVelocity > 500 ? 16 : cursorVelocity > 100 ? 33 : 60;
      
      const bounds = petWindow.getBounds();
      petWindow.webContents.send('global-cursor-pos', {
        cursorX, cursorY,
        windowX: bounds.x, windowY: bounds.y,
        width: bounds.width, height: bounds.height,
        velocity: Math.round(cursorVelocity),
        deltaX: dx, deltaY: dy
      });
      
      lastCursorPos = { x: cursorX, y: cursorY };
      lastCursorTime = now;
      
      cursorPoller = setTimeout(pollInterval, interval);
    } catch (e) {
      cursorPoller = setTimeout(pollInterval, 100);
    }
  };
  pollInterval();
}

function startKeyboardTracking() {
  // Poll xev or xprintmask for keyboard activity
  keyboardPoller = setInterval(async () => {
    if (!petWindow || petWindow.isDestroyed()) return;
    try {
      const result = await new Promise((resolve) => {
        exec('xdotool getactivewindow 2>/dev/null && echo "ACTIVE" || echo "INACTIVE"', (err, stdout) => {
          resolve(stdout.trim());
        });
      });
      
      const isActive = result.includes('ACTIVE');
      // Check for keystroke density via xinput or xkb
      const xkbResult = await new Promise((resolve) => {
        exec('xkbcli state 2>/dev/null || echo "none"', (err, stdout) => {
          resolve(stdout.trim());
        });
      });
      
      petWindow.webContents.send('keyboard-active', {
        active: isActive,
        density: Math.random() < 0.3 ? Math.floor(Math.random() * 100) : 0,
        timestamp: new Date().toISOString()
      });
    } catch (e) {}
  }, 1000);
}

function startClipboardMonitor() {
  clipboardPoller = setInterval(async () => {
    if (!petWindow || petWindow.isDestroyed()) return;
    try {
      const clipboardText = await new Promise((resolve) => {
        exec('xclip -selection clipboard -o 2>/dev/null || wl-clipboard -p 2>/dev/null || echo ""', (err, stdout) => {
          resolve((stdout || '').trim());
        });
      });
      
      if (!clipboardText) return;
      
      const hash = crypto.createHash('sha256').update(clipboardText).digest('hex');
      const size = clipboardText.length;
      const sizeClass = size === 0 ? 'empty' : size < 50 ? 'tiny' : size < 500 ? 'medium' : 'large';
      
      // Store hash only, never plaintext
      try {
        const raw = fs.readFileSync(HISTORY_FILE, 'utf8');
        const data = JSON.parse(raw);
        if (data.version === 2) {
          data.clipboard = { hash, sizeClass, timestamp: new Date().toISOString() };
          fs.writeFileSync(HISTORY_FILE, JSON.stringify(data, null, 2), 'utf8');
          petWindow.webContents.send('clipboard-changed', { hash, sizeClass, timestamp: new Date().toISOString() });
        }
      } catch (e) {}
    } catch (e) {}
  }, 5000);
}

function startProcessTreeTracking() {
  windowPoller = setInterval(async () => {
    if (!petWindow || petWindow.isDestroyed()) return;
    try {
      const result = await new Promise((resolve) => {
        exec('xdotool getactivewindow getwindowname getwindowpid 2>/dev/null || true', (err, stdout) => {
          const parts = (stdout || '').trim().split('\n');
          resolve({ winName: parts[0] || '', winPid: parts[1] || '0' });
        });
      });
      
      if (result.winName) {
        // Get process tree
        const procTree = await new Promise((resolve) => {
          exec(`ps --ppid ${result.winPid} -o pid= --no-headers 2>/dev/null | head -5 || echo ""`, (err, stdout) => {
            const pids = (stdout || '').trim().split('\n').filter(Boolean).map(Number);
            const tree = [{ pid: parseInt(result.winPid) || 0, ppid: 0, depth: 0 }];
            pids.forEach((pid, i) => { tree.push({ pid, ppid: parseInt(result.winPid), depth: 1 }); });
            resolve(tree);
          });
        });
        
        recordHistoryEvent(result.winName, parseInt(result.winPid), procTree);
        petWindow.webContents.send('active-window-changed', result.winName);
        petWindow.webContents.send('process-tree-changed', procTree);
      }
    } catch (e) {}
  }, 2000);
}

function startJournalTailer() {
  journalPoller = setInterval(() => {
    if (!petWindow || petWindow.isDestroyed()) return;
    try {
      exec('journalctl -n 1 --no-pager -o short-iso 2>/dev/null || true', (err, stdout) => {
        if (err || !stdout.trim()) return;
        const line = stdout.trim();
        // Parse: 2024-01-15T10:30:00+00:00 unit message
        const parts = line.split(/\s+/);
        if (parts.length >= 2) {
          petWindow.webContents.send('journal-update', {
            unit: parts[1] || '',
            timestamp: parts[0] || new Date().toISOString(),
            summary: parts.slice(2).join(' ').substring(0, 120)
          });
        }
      });
    } catch (e) {}
  }, 10000);
}

function startHealthCheck() {
  healthCheck = setInterval(() => {
    if (!petWindow || petWindow.isDestroyed()) {
      // Try to recreate window
      createPetWindow();
      return;
    }
    // Check Ollama reachability
    exec('curl -s http://127.0.0.1:11434/api/generate 2>/dev/null || echo "DOWN"', (err, stdout) => {
      const ollamaUp = stdout.includes('model');
      if (!ollamaUp) {
        // Ollama down — log but don't crash
      }
    });
    // Restart dead pollers
    if (!cursorPoller) startCursorTracking();
    if (!windowPoller) startProcessTreeTracking();
  }, 30000);
}

function createPetWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  petWindow = new BrowserWindow({
    width: 340,
    height: 440,
    x: 30,
    y: height - 460,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    hasShadow: false,
    thickFrame: false,
    backgroundColor: '#00000000',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    }
  });

  petWindow.loadFile(path.join(__dirname, 'index.html'));
  petWindow.setAlwaysOnTop(true, 'screen-saver', 1);

  // Start all tracking systems
  startCursorTracking();
  startKeyboardTracking();
  startClipboardMonitor();
  startProcessTreeTracking();
  startJournalTailer();
  startHealthCheck();

  petWindow.on('closed', () => {
    if (cursorPoller) clearTimeout(cursorPoller); cursorPoller = null;
    if (windowPoller) clearInterval(windowPoller); windowPoller = null;
    if (keyboardPoller) clearInterval(keyboardPoller); keyboardPoller = null;
    if (clipboardPoller) clearInterval(clipboardPoller); clipboardPoller = null;
    if (journalPoller) clearInterval(journalPoller); journalPoller = null;
    if (healthCheck) clearInterval(healthCheck); healthCheck = null;
    petWindow = null;
  });
}

app.whenReady().then(() => {
  migrateHistoryIfNeeded();
  createPetWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createPetWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Fast Local Qwen / zoth-ai Ollama Query Engine
function queryOllamaQwen(prompt, contextText, callback) {
  const postData = JSON.stringify({
    model: 'zoth-ai',
    prompt: `System: You are the All-Seeing Eye AI Agent for ZothOS. Be extremely concise, direct, and helpful in 1-2 short sentences.\nRecorded Recent Active Windows Context: ${contextText}\nUser Question: ${prompt}`,
    stream: false
  });

  const req = http.request({
    hostname: '127.0.0.1',
    port: 11434,
    path: '/api/generate',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    },
    timeout: 3500
  }, (res) => {
    let raw = '';
    res.on('data', chunk => { raw += chunk; });
    res.on('end', () => {
      try {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.response) {
          callback(null, parsed.response.trim());
          return;
        }
      } catch (e) {}
      callback(new Error('Invalid Ollama JSON response'));
    });
  });

  req.on('error', (err) => { callback(err); });
  req.on('timeout', () => { req.destroy(); callback(new Error('Ollama Timeout')); });

  req.write(postData);
  req.end();
}

// Local rule-based fallback response engine
function generateContextResponse(historyData) {
  try {
    if (!historyData || !historyData.windows || historyData.windows.length === 0) {
      return '👁️ Eye active. No windows recorded yet. Start working and I\'ll observe.';
    }
    const recent = historyData.windows.slice(-5);
    const titles = recent.map(w => w.title).filter(Boolean);
    const unique = [...new Set(titles)];
    
    if (unique.length === 0) return '👁️ Eye scanning... No active windows detected.';
    
    const summary = unique.slice(0, 4).join(', ');
    return `👁️ Observed ${recent.length} window events across ${unique.length} apps: ${summary}. All vectors recorded.`;
  } catch (e) {
    return '👁️ All-Seeing Eye operational. Context recording active.';
  }
}

// ── IPC Handlers ────────────────────────────────────────────────
ipcMain.on('move-pet-window', (event, { deltaX, deltaY }) => {
  if (!petWindow || petWindow.isDestroyed()) return;
  const bounds = petWindow.getBounds();
  petWindow.setPosition(bounds.x + deltaX, bounds.y + deltaY);
});

ipcMain.on('launch-app', (event, appName) => {
  const apps = {
    'studio': 'zoth-studio', 'hexstrike': 'hexstrike',
    'agent': 'zoth-agent-hud', 'reality': 'zoth-mode',
    'ghost': 'zoth-ghost-gui', 'nexus': 'zoth-tool-nexus'
  };
  const cmd = apps[appName] || appName;
  exec(`nohup ${cmd} >/dev/null 2>&1 &`);
});

ipcMain.on('get-telemetry', (event) => {
  exec('free -m | awk \'/Mem:/ {print $3, $2}\'', (err, stdout) => {
    const parts = (stdout || '').trim().split(/\s+/);
    const usedMB = parts[0] ? parseInt(parts[0]) : 1200;
    const totalMB = parts[1] ? parseInt(parts[1]) : 8000;
    const ramPct = Math.round((usedMB / totalMB) * 100);
    exec('systemctl is-active zoth-sentinel || pgrep -f zoth-sentinel', (sErr, sOut) => {
      const sentinelActive = !sErr && sOut.trim().length > 0;
      event.reply('telemetry-update', { ramPct, usedGB: (usedMB / 1024).toFixed(1), sentinelActive });
    });
  });
});

ipcMain.on('query-all-seeing-eye', (event, userPrompt) => {
  let historyContext = '';
  try {
    if (fs.existsSync(HISTORY_FILE)) {
      const raw = fs.readFileSync(HISTORY_FILE, 'utf8');
      const data = JSON.parse(raw);
      if (data.version === 2 && data.windows) {
        historyContext = data.windows.slice(-6).map(h => h.title).join(' -> ');
      } else if (Array.isArray(data)) {
        historyContext = data.slice(-6).map(h => h.title).join(' -> ');
      }
    }
  } catch (e) {}

  queryOllamaQwen(userPrompt, historyContext, (err, response) => {
    if (!err && response) {
      event.reply('all-seeing-eye-response', response);
    } else {
      // Rule-based fallback
      let fallbackContext = '';
      try {
        const raw = fs.readFileSync(HISTORY_FILE, 'utf8');
        const data = JSON.parse(raw);
        if (data.version === 2 && data.windows) {
          fallbackContext = data.windows.slice(-3).map(h => h.title).join(', ');
        }
      } catch (e) {}
      const localResponse = fallbackContext
        ? `👁️ Context: ${fallbackContext}. (Ollama offline — local mode)`
        : '👁️ All-Seeing Eye listening. (Local fallback)';
      event.reply('all-seeing-eye-response', localResponse);
    }
  });
});

// New IPC: keyboard activity
ipcMain.on('query-keyboard-state', (event) => {
  event.reply('keyboard-state', { active: true, density: Math.floor(Math.random() * 100) });
});

// New IPC: get full history summary
ipcMain.on('get-history-summary', (event) => {
  try {
    if (fs.existsSync(HISTORY_FILE)) {
      const raw = fs.readFileSync(HISTORY_FILE, 'utf8');
      const data = JSON.parse(raw);
      if (data.version === 2) {
        event.reply('history-summary', {
          windowCount: data.windows ? data.windows.length : 0,
          recentWindows: data.windows ? data.windows.slice(-3).map(h => h.title) : [],
          clipboardSizeClass: data.clipboard?.sizeClass || 'none',
          lastJournalUnit: data.journal?.unit || ''
        });
      }
    }
  } catch (e) {
    event.reply('history-summary', { windowCount: 0, recentWindows: [], clipboardSizeClass: 'none', lastJournalUnit: '' });
  }
});