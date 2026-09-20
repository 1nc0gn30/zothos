const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');
const os = require('os');

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

    // Avoid duplicate rapid logging of same window
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

// Interactive AI Query to the All-Seeing Eye
ipcMain.on('query-all-seeing-eye', (event, userPrompt) => {
  let historyContext = '';
  try {
    if (fs.existsSync(HISTORY_FILE)) {
      const history = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8')).slice(-8);
      historyContext = history.map(h => `[${h.timestamp.substring(11, 19)}] ${h.title}`).join(' | ');
    }
  } catch (e) {}

  const fullQuery = `Context of user recent activity: (${historyContext}). User Query: ${userPrompt}`;
  
  exec(`/usr/local/bin/zoth-sentinel ask ${JSON.stringify(userPrompt)} 2>/dev/null || echo "All-Seeing Eye: Recorded active window context. Processing request via Sentinel AI."`, (err, stdout) => {
    const answer = (stdout || '').trim() || `All-Seeing Eye: Observed recent window history. System nominal.`;
    event.reply('all-seeing-eye-response', answer);
  });
});
