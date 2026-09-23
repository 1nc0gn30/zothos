const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const http = require('http');
const { spawn, exec } = require('child_process');

let mainWindow = null;
let pyProcess = null;
const PORT = 8770;
const SERVER_URL = `http://127.0.0.1:${PORT}`;

function startBackend() {
  const servePy = path.join(__dirname, 'serve.py');
  pyProcess = spawn('python3', [servePy], {
    cwd: __dirname,
    env: process.env,
    detached: true,
    stdio: 'ignore'
  });
  pyProcess.unref();
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: 'ZOTH OS DESK',
    backgroundColor: '#05070a',
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    }
  });

  // Load index.html directly as a native Electron app
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// ── Native Electron IPC Gateway to Python Backend ─────────────────────
ipcMain.handle('zoth-api', async (event, { endpoint, method, body }) => {
  return new Promise((resolve, reject) => {
    const postData = body ? JSON.stringify(body) : '';
    const url = new URL(endpoint, SERVER_URL);
    const req = http.request(url, {
      method: method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(raw));
        } catch (e) {
          resolve({ ok: true, raw });
        }
      });
    });

    req.on('error', (err) => {
      // If server is starting up or unavailable, fallback response
      resolve({ ok: false, error: err.message, message: 'Backend initializing...' });
    });

    if (postData) req.write(postData);
    req.end();
  });
});

app.on('ready', () => {
  startBackend();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
