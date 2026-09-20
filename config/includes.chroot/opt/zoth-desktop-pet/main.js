const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');

let petWindow = null;
let cursorPoller = null;
let windowPoller = null;

function createPetWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  petWindow = new BrowserWindow({
    width: 320,
    height: 380,
    x: width - 340,
    y: height - 410,
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
  petWindow.setAlwaysOnTop(true, 'floating', 1);

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

  // Active Window & OS Activity Monitor
  windowPoller = setInterval(() => {
    if (!petWindow || petWindow.isDestroyed()) return;
    exec('xdotool getactivewindow getwindowname 2>/dev/null || true', (err, stdout) => {
      const activeWin = (stdout || '').trim();
      if (activeWin) {
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
