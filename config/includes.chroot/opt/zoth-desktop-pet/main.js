const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');
const os = require('os');
const http = require('http');

let petWindow = null;
let cursorPoller = null;
let windowPoller = null;

const HISTORY_FILE = path.join(os.homedir(), '.config', 'zothos', 'all_seeing_eye_history.json');

function ensureHistoryDir() {
  const dir = path.dirname(HISTORY_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function recordHistoryEvent(winTitle, winPid) {
  try {
    ensureHistoryDir();
    let history = [];
    if (fs.existsSync(HISTORY_FILE)) {
      history = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
    }
    const timestamp = new Date().toISOString();
    const lastEntry = history[history.length - 1];

    if (!lastEntry || lastEntry.title !== winTitle) {
      history.push({ timestamp, title: winTitle, pid: winPid });
      if (history.length > 200) history = history.slice(-200);
      fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2), 'utf8');
    }
  } catch (err) {}
}

function createPetWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  petWindow = new BrowserWindow({
    width: 360,
    height: 480,
    x: width - 380,
    y: height - 510,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    hasShadow: false,
    backgroundColor: '#00000000',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    }
  });

  petWindow.loadFile(path.join(__dirname, 'index.html'));
  petWindow.setAlwaysOnTop(true, 'screen-saver', 1);

  // 60FPS Global Cursor Tracking across entire OS desktop
  cursorPoller = setInterval(() => {
    if (!petWindow || petWindow.isDestroyed()) return;
    const point = screen.getCursorScreenPoint();
    const bounds = petWindow.getBounds();
    petWindow.webContents.send('global-cursor-pos', {
      cursorX: point.x,
      cursorY: point.y,
      windowX: bounds.x,
      windowY: bounds.y,
      width: bounds.width,
      height: bounds.height
    });
  }, 16);

  // Always-Watching OS Activity & Window Recorder
  windowPoller = setInterval(() => {
    if (!petWindow || petWindow.isDestroyed()) return;
    exec('xdotool getactivewindow getwindowname getwindowpid 2>/dev/null || true', (err, stdout) => {
      const parts = (stdout || '').trim().split('\n');
      const activeWin = parts[0] || '';
      const activePid = parts[1] || '0';
      if (activeWin) {
        recordHistoryEvent(activeWin, activePid);
        petWindow.webContents.send('active-window-changed', activeWin);
      }
    });
  }, 2500);

  petWindow.on('closed', () => {
    if (cursorPoller) clearInterval(cursorPoller);
    if (windowPoller) clearInterval(windowPoller);
    petWindow = null;
  });
}

app.whenReady().then(() => {
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

// ── IPC Handlers ────────────────────────────────────────────────────────
ipcMain.on('launch-app', (event, appName) => {
  const apps = {
    'studio': 'zoth-studio',
    'hexstrike': 'hexstrike',
    'agent': 'zoth-agent-hud',
    'reality': 'zoth-mode',
    'ghost': 'zoth-ghost-gui',
    'nexus': 'zoth-tool-nexus'
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
      event.reply('telemetry-update', {
        ramPct,
        usedGB: (usedMB / 1024).toFixed(1),
        sentinelActive
      });
    });
  });
});

// Fast Local Qwen Interactive AI Query for All-Seeing Eye
ipcMain.on('query-all-seeing-eye', (event, userPrompt) => {
  let historyContext = '';
  try {
    if (fs.existsSync(HISTORY_FILE)) {
      const history = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8')).slice(-6);
      historyContext = history.map(h => h.title).join(' -> ');
    }
  } catch (e) {}

  // 1. Try fast local zoth-ai / Qwen Ollama model
  queryOllamaQwen(userPrompt, historyContext, (err, response) => {
    if (!err && response) {
      event.reply('all-seeing-eye-response', `👁️ ${response}`);
    } else {
      // 2. Fallback to zoth-sentinel CLI executor
      exec(`/usr/local/bin/zoth-sentinel ask ${JSON.stringify(userPrompt)} 2>/dev/null || echo "All-Seeing Eye: Observed recent window history (${historyContext}). All systems nominal."`, (sErr, stdout) => {
        const answer = (stdout || '').trim() || `All-Seeing Eye: Recorded window history (${historyContext}).`;
        event.reply('all-seeing-eye-response', `👁️ ${answer}`);
      });
    }
  });
});
