const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const { exec, spawn } = require('child_process');
const fs = require('fs');

// Enable GPU hardware acceleration for 3D WebGL
app.commandLine.appendSwitch('enable-webgl');
app.commandLine.appendSwitch('ignore-gpu-blocklist');
app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-zero-copy');

let mainWindow = null;

function createWindow() {
  const iconPath = fs.existsSync('/opt/zoth-studio/public/assets/brand/zoth-golden-z-512.png')
    ? '/opt/zoth-studio/public/assets/brand/zoth-golden-z-512.png'
    : '/usr/share/icons/hicolor/512x512/apps/zoth-studio.png';

  mainWindow = new BrowserWindow({
    width: 1440,
    height: 960,
    minWidth: 1024,
    minHeight: 700,
    backgroundColor: '#070a0f',
    icon: fs.existsSync(iconPath) ? iconPath : undefined,
    frame: true,
    titleBarStyle: 'default',
    title: 'ZOTH STUDIO PRO // SOVEREIGN 3D ALCHEMICAL COCKPIT',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
      allowRunningInsecureContent: true
    }
  });

  const indexPath = path.join(__dirname, 'index.html');
  mainWindow.loadFile(indexPath);

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

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
ipcMain.on('launch-tool', (event, toolName) => {
  const tools = {
    'hexstrike': 'hexstrike',
    'ghostmode': 'zoth-ghost',
    'agent-os': 'zoth-agent-os',
    'reality': 'zoth-mode',
    'nexus': 'zoth-tool-nexus',
    'sentinel': 'zoth-sentinel-hud',
    'obsidian': 'obsidian',
    'caido': 'caido',
    'burp': 'burpsuite',
    'bitwarden': 'bitwarden',
    'terminal': 'konsole'
  };

  const cmd = tools[toolName] || toolName;
  exec(`nohup ${cmd} >/dev/null 2>&1 &`);
});

ipcMain.on('exec-cmd', (event, command) => {
  exec(command, (err, stdout, stderr) => {
    event.reply('exec-result', {
      success: !err,
      stdout: stdout ? stdout.toString() : '',
      stderr: stderr ? stderr.toString() : (err ? err.message : '')
    });
  });
});

ipcMain.on('open-external', (event, url) => {
  shell.openExternal(url);
});
