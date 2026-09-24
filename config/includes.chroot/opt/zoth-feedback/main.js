const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { exec } = require('child_process');

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 720,
    minWidth: 700,
    minHeight: 600,
    title: 'ZOTHOS // ANONYMOUS SOVEREIGN FEEDBACK',
    backgroundColor: '#05070a',
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// IPC handler to save and relay anonymous feedback
ipcMain.handle('send-feedback', async (event, payload) => {
  const homeDir = os.homedir();
  const feedbackDir = path.join(homeDir, '.zoth', 'feedback');
  
  try {
    fs.mkdirSync(feedbackDir, { recursive: true });
    const filename = `feedback_${Date.now()}.json`;
    const filepath = path.join(feedbackDir, filename);
    
    const record = {
      timestamp: new Date().toISOString(),
      type: payload.type || 'General',
      subject: payload.subject || 'No Subject',
      message: payload.message || '',
      telemetry: payload.includeTelemetry ? {
        os: 'ZothOS 1.0 (Debian 13)',
        kernel: os.release(),
        arch: os.arch(),
        cpuCores: os.cpus().length,
        totalRamGb: Math.round(os.totalmem() / 1024 / 1024 / 1024 * 10) / 10
      } : null
    };

    fs.writeFileSync(filepath, JSON.stringify(record, null, 2));

    // Also attempt Tor-routed or HTTP relay if an endpoint is configured in ~/.zoth/feedback_webhook
    const webhookFile = path.join(homeDir, '.zoth', 'feedback_webhook');
    if (fs.existsSync(webhookFile)) {
      const url = fs.readFileSync(webhookFile, 'utf8').trim();
      if (url.startsWith('http')) {
        const curlCmd = `curl -s -X POST -H "Content-Type: application/json" -d '${JSON.stringify(record).replace(/'/g, "'\\''")}' "${url}" >/dev/null 2>&1 &`;
        exec(curlCmd);
      }
    }

    return { ok: true, file: filepath };
  } catch (err) {
    return { ok: false, error: err.message };
  }
});

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
