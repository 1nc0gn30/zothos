const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');

let mainWindow = null;

function createWindow() {
  const iconPath = fs.existsSync('/opt/zoth-studio/public/assets/brand/zoth-logo.png')
    ? '/opt/zoth-studio/public/assets/brand/zoth-logo.png'
    : '/usr/share/icons/hicolor/512x512/apps/zoth-mode.png';

  mainWindow = new BrowserWindow({
    width: 1040,
    height: 720,
    minWidth: 800,
    minHeight: 600,
    backgroundColor: '#070a0f',
    icon: fs.existsSync(iconPath) ? iconPath : undefined,
    frame: true,
    titleBarStyle: 'default',
    title: 'ZOTH REALITY SWITCHER // THEME & COMPOSITOR ENGINE',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// ── IPC Handlers ────────────────────────────────────────────────────────
ipcMain.on('get-current-reality', (event) => {
  const stateFile = path.join(process.env.HOME || '/root', '.config/zothos/reality.state');
  let reality = 'matrix';
  if (fs.existsSync(stateFile)) {
    try { reality = fs.readFileSync(stateFile, 'utf8').trim(); } catch (e) {}
  }
  event.reply('current-reality', reality);
});

ipcMain.on('switch-reality', (event, reality) => {
  exec(`/usr/local/bin/zoth-mode ${reality}`, (err, stdout, stderr) => {
    event.reply('switch-complete', {
      reality: reality,
      success: !err,
      log: stdout ? stdout.toString() : stderr.toString()
    });
  });
});

ipcMain.on('toggle-live-wallpaper', (event) => {
  exec('pgrep -f zoth-live-wallpaper || pgrep -f "live-wallpaper/index.html"', (err, stdout) => {
    if (stdout && stdout.trim()) {
      exec('pkill -f zoth-live-wallpaper || pkill -f "live-wallpaper/index.html"');
      event.reply('live-wallpaper-status', false);
    } else {
      exec('nohup /usr/local/bin/zoth-live-wallpaper start >/dev/null 2>&1 &');
      event.reply('live-wallpaper-status', true);
    }
  });
});
