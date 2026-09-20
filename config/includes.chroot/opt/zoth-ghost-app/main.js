const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');
const https = require('https');

let mainWindow = null;

function createWindow() {
  const iconPath = fs.existsSync('/opt/zoth-studio/public/assets/mascot/ghostbyte-nullai-icon.png')
    ? '/opt/zoth-studio/public/assets/mascot/ghostbyte-nullai-icon.png'
    : '/usr/share/icons/hicolor/512x512/apps/zoth-ghost.png';

  mainWindow = new BrowserWindow({
    width: 1120,
    height: 780,
    minWidth: 860,
    minHeight: 600,
    backgroundColor: '#05070a',
    icon: fs.existsSync(iconPath) ? iconPath : undefined,
    frame: true,
    titleBarStyle: 'default',
    title: 'NULLAI GHOSTMODE // SOVEREIGN TOR & ANTI-FORENSICS FORTRESS',
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

// ── IP & Tor State Poller ─────────────────────────────────────────────
ipcMain.on('get-privacy-state', (event) => {
  exec('ip -j link show', (err, linkOut) => {
    let ifaces = [];
    try {
      const parsed = JSON.parse(linkOut);
      parsed.forEach(i => {
        if (i.ifname !== 'lo') {
          ifaces.push({
            name: i.ifname,
            mac: i.address || 'Unknown',
            state: i.operstate || 'UNKNOWN'
          });
        }
      });
    } catch (e) {}

    // Check Tor status via Tor check API or local socket
    const req = https.get('https://check.torproject.org/api/ip', { timeout: 4000 }, (res) => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(raw);
          event.reply('privacy-state-update', {
            isTor: json.IsTor,
            ip: json.IP,
            ifaces: ifaces
          });
        } catch (e) {
          fallbackIp(event, ifaces);
        }
      });
    });

    req.on('error', () => {
      fallbackIp(event, ifaces);
    });
  });
});

function fallbackIp(event, ifaces) {
  exec('curl -s --max-time 3 https://api.ipify.org || curl -s --max-time 3 https://icanhazip.com', (err, stdout) => {
    const ip = stdout ? stdout.trim() : 'Unknown';
    exec('systemctl is-active tor || pgrep -x tor', (tErr, tOut) => {
      const isTorRunning = !tErr && tOut.trim().length > 0;
      event.reply('privacy-state-update', {
        isTor: isTorRunning,
        ip: ip,
        ifaces: ifaces
      });
    });
  });
}

// ── Ghostmode Action Handlers ─────────────────────────────────────────
ipcMain.on('ghost-start', (event) => {
  exec('sudo /usr/local/bin/zoth-ghost start', (err, stdout, stderr) => {
    event.reply('ghost-action-result', { action: 'start', success: !err, log: stdout || stderr });
  });
});

ipcMain.on('ghost-stop', (event) => {
  exec('sudo /usr/local/bin/zoth-ghost stop', (err, stdout, stderr) => {
    event.reply('ghost-action-result', { action: 'stop', success: !err, log: stdout || stderr });
  });
});

ipcMain.on('ghost-change-circuit', (event) => {
  exec('sudo /usr/local/bin/zoth-ghost change || sudo anonsurf change', (err, stdout, stderr) => {
    event.reply('ghost-action-result', { action: 'change', success: !err, log: stdout || stderr });
  });
});

ipcMain.on('ghost-spoof-mac', (event, iface) => {
  exec(`sudo macchanger -r ${iface} || sudo ip link set dev ${iface} address 02:$(hexdump -n5 -e'/1 ":%02x"' /dev/urandom)`, (err, stdout) => {
    event.reply('ghost-action-result', { action: 'spoof', iface, success: !err, log: stdout });
  });
});

ipcMain.on('ghost-panic-scrub', (event) => {
  exec('sync; echo 3 | sudo tee /proc/sys/vm/drop_caches; history -c; rm -rf ~/.cache/thumbnails/*', (err) => {
    event.reply('ghost-action-result', { action: 'panic', success: !err, log: 'Memory cache dropped and history scrubbed.' });
  });
});
