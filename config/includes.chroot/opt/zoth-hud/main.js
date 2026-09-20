const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');
const fs = require('fs');
const { exec, spawn } = require('child_process');

let mainWindow = null;
let lastCpuStat = null;
let lastNetBytes = { rx: 0, tx: 0, time: Date.now() };
let currentWanInfo = { ip: 'Checking...', isTor: false, lastCheck: 0 };

function readCpuStat() {
  try {
    const content = fs.readFileSync('/proc/stat', 'utf8');
    const lines = content.split('\n');
    const cores = [];
    let totalAll = 0, idleAll = 0;

    for (const line of lines) {
      if (line.startsWith('cpu')) {
        const parts = line.trim().split(/\s+/).slice(1).map(Number);
        const idle = parts[3] + (parts[4] || 0);
        const total = parts.reduce((a, b) => a + b, 0);
        if (line.startsWith('cpu ')) {
          totalAll = total;
          idleAll = idle;
        } else {
          cores.push({ idle, total });
        }
      }
    }
    return { total: totalAll, idle: idleAll, cores };
  } catch (err) {
    return { total: 0, idle: 0, cores: [] };
  }
}

function readNetBytes() {
  let rx = 0, tx = 0;
  try {
    const lines = fs.readFileSync('/proc/net/dev', 'utf8').split('\n').slice(2);
    for (const line of lines) {
      const parts = line.trim().split(/\s+/);
      if (parts.length >= 10 && !parts[0].match(/^(lo|docker|br-|veth):/)) {
        rx += parseInt(parts[1], 10) || 0;
        tx += parseInt(parts[9], 10) || 0;
      }
    }
  } catch (err) {}
  return { rx, tx, time: Date.now() };
}

// Check WAN IP and Tor Exit Status asynchronously
function pollWanStatus() {
  const now = Date.now();
  if (now - currentWanInfo.lastCheck < 4000) return;
  currentWanInfo.lastCheck = now;

  exec("curl -s -m 4 https://check.torproject.org/api/ip 2>/dev/null || curl -s -m 4 https://api.ipify.org 2>/dev/null", (err, stdout) => {
    if (!err && stdout && stdout.trim()) {
      const out = stdout.trim();
      if (out.includes('"IsTor":true') || out.includes('"IsTor": true')) {
        const m = out.match(/"IP":\s*"([^"]+)"/);
        currentWanInfo.isTor = true;
        currentWanInfo.ip = m ? m[1] : 'Tor Cloaked';
      } else if (out.includes('"IsTor":false') || out.includes('"IsTor": false')) {
        const m = out.match(/"IP":\s*"([^"]+)"/);
        currentWanInfo.isTor = false;
        currentWanInfo.ip = m ? m[1] : out;
      } else {
        // Plain IP text
        const isIptablesTor = fs.existsSync('/run/zoth_ghostmode.state');
        currentWanInfo.ip = out.replace(/[^0-9.]/g, '').substring(0, 16);
        currentWanInfo.isTor = isIptablesTor;
      }
    }
  });
}

function getSystemTelemetry() {
  return new Promise((resolve) => {
    pollWanStatus();

    // 1. CPU Usage & Cores
    const curCpu = readCpuStat();
    let cpuPct = 0;
    let corePcts = [];
    if (lastCpuStat && curCpu.total > lastCpuStat.total) {
      const dTotal = curCpu.total - lastCpuStat.total;
      const dIdle = curCpu.idle - lastCpuStat.idle;
      cpuPct = Math.max(0, Math.min(100, ((dTotal - dIdle) / dTotal) * 100));

      if (curCpu.cores.length === lastCpuStat.cores.length) {
        for (let i = 0; i < curCpu.cores.length; i++) {
          const cTotal = curCpu.cores[i].total - lastCpuStat.cores[i].total;
          const cIdle = curCpu.cores[i].idle - lastCpuStat.cores[i].idle;
          corePcts.push(cTotal > 0 ? Math.max(0, Math.min(100, ((cTotal - cIdle) / cTotal) * 100)) : 0);
        }
      }
    }
    lastCpuStat = curCpu;

    // CPU Frequency
    let cpuFreqGHz = 2.4;
    try {
      const cpuInfo = fs.readFileSync('/proc/cpuinfo', 'utf8');
      const m = cpuInfo.match(/cpu MHz\s*:\s*([\d.]+)/);
      if (m) cpuFreqGHz = parseFloat(m[1]) / 1000.0;
    } catch (e) {}

    // Temperature
    let tempC = -1;
    const tempPaths = [
      '/sys/class/thermal/thermal_zone0/temp',
      '/sys/class/hwmon/hwmon0/temp1_input',
      '/sys/class/hwmon/hwmon1/temp1_input'
    ];
    for (const tp of tempPaths) {
      try {
        if (fs.existsSync(tp)) {
          tempC = parseInt(fs.readFileSync(tp, 'utf8').trim(), 10) / 1000.0;
          break;
        }
      } catch (e) {}
    }

    // 2. RAM Info
    let ramTotalGB = 8, ramUsedGB = 2, ramCachedGB = 1, ramPct = 25;
    try {
      const memInfo = fs.readFileSync('/proc/meminfo', 'utf8');
      const parseVal = (key) => {
        const m = memInfo.match(new RegExp(`^${key}:\\s+(\\d+)`, 'm'));
        return m ? parseInt(m[1], 10) : 0;
      };
      const totalKB = parseVal('MemTotal');
      const freeKB = parseVal('MemFree');
      const buffersKB = parseVal('Buffers');
      const cachedKB = parseVal('Cached');
      const availKB = parseVal('MemAvailable') || (freeKB + buffersKB + cachedKB);
      const usedKB = totalKB - availKB;

      ramTotalGB = totalKB / (1024 * 1024);
      ramUsedGB = Math.max(0, usedKB / (1024 * 1024));
      ramCachedGB = cachedKB / (1024 * 1024);
      ramPct = totalKB > 0 ? (usedKB / totalKB) * 100 : 0;
    } catch (e) {}

    // 3. Disk Usage
    let diskFreeGB = 20, diskTotalGB = 50, diskPct = 60;
    exec("df -BG / | awk 'NR==2 {print $2,$4,$5}'", (err, stdout) => {
      if (!err && stdout.trim()) {
        const parts = stdout.trim().split(/\s+/);
        if (parts.length >= 3) {
          diskTotalGB = parseInt(parts[0].replace('G', ''), 10) || 50;
          diskFreeGB = parseInt(parts[1].replace('G', ''), 10) || 20;
          diskPct = parseInt(parts[2].replace('%', ''), 10) || 60;
        }
      }

      // 4. Network Rates (Rx / Tx)
      const curNet = readNetBytes();
      const dt = Math.max(0.2, (curNet.time - lastNetBytes.time) / 1000.0);
      const netRxKB = Math.max(0, (curNet.rx - lastNetBytes.rx) / 1024.0 / dt);
      const netTxKB = Math.max(0, (curNet.tx - lastNetBytes.tx) / 1024.0 / dt);
      lastNetBytes = curNet;

      // 5. Network Hardware Interfaces & IPs
      const netIdentities = [];
      try {
        const ifaces = fs.readdirSync('/sys/class/net').filter(i => i !== 'lo');
        for (const iface of ifaces) {
          let mac = '00:00:00:00:00:00';
          const macPath = `/sys/class/net/${iface}/address`;
          if (fs.existsSync(macPath)) {
            mac = fs.readFileSync(macPath, 'utf8').trim().toUpperCase();
          }
          netIdentities.push({ iface, mac, ip: '' });
        }
      } catch (e) {}

      // Get IPs via `ip -4 -brief addr show`
      exec("ip -4 -brief addr show", (ipErr, ipOut) => {
        if (!ipErr && ipOut) {
          const lines = ipOut.trim().split('\n');
          for (const line of lines) {
            const p = line.trim().split(/\s+/);
            if (p.length >= 3 && p[0] !== 'lo') {
              const matched = netIdentities.find(n => n.iface === p[0]);
              if (matched) {
                matched.ip = p[2].split('/')[0];
              }
            }
          }
        }

        // Fill fallback if empty
        for (const ident of netIdentities) {
          if (!ident.ip) ident.ip = '0.0.0.0 (Offline)';
        }

        // Sort interfaces (physical en/eth/wl first)
        netIdentities.sort((a, b) => {
          const prio = (name) => name.match(/^(en|eth|wl)/) ? 0 : (name.match(/^(tun|tap|wg)/) ? 1 : 2);
          return prio(a.iface) - prio(b.iface);
        });

        // 6. Top Processes (CPU & RAM)
        exec("ps -eo pid,user,%cpu,%mem,rss,comm --sort=-%cpu --no-headers | head -n 6", (psErr, psOut) => {
          const cpuProcs = [];
          if (!psErr && psOut) {
            for (const line of psOut.trim().split('\n')) {
              const p = line.trim().split(/\s+/);
              if (p.length >= 6) {
                cpuProcs.push({
                  pid: p[0],
                  user: p[1].substring(0, 7),
                  cpu: parseFloat(p[2]) || 0,
                  mem: parseFloat(p[3]) || 0,
                  rssMB: (parseInt(p[4], 10) || 0) / 1024.0,
                  name: p.slice(5).join(' ').substring(0, 14)
                });
              }
            }
          }

          exec("ps -eo pid,user,%cpu,%mem,rss,comm --sort=-rss --no-headers | head -n 6", (psRamErr, psRamOut) => {
            const ramProcs = [];
            if (!psRamErr && psRamOut) {
              for (const line of psRamOut.trim().split('\n')) {
                const p = line.trim().split(/\s+/);
                if (p.length >= 6) {
                  ramProcs.push({
                    pid: p[0],
                    user: p[1].substring(0, 7),
                    cpu: parseFloat(p[2]) || 0,
                    mem: parseFloat(p[3]) || 0,
                    rssMB: (parseInt(p[4], 10) || 0) / 1024.0,
                    name: p.slice(5).join(' ').substring(0, 14)
                  });
                }
              }
            }

            // 7. Check Tor & Transparent Proxy
            exec("iptables -t nat -L OUTPUT 2>/dev/null | grep -q '9040' || [ -f /run/zoth_ghostmode.state ]", (torErr) => {
              const torActive = (torErr === null) || currentWanInfo.isTor;

              // Uptime
              let uptimeStr = '0h 00m';
              try {
                const upSec = parseFloat(fs.readFileSync('/proc/uptime', 'utf8').split(' ')[0]);
                const h = Math.floor(upSec / 3600);
                const m = Math.floor((upSec % 3600) / 60);
                uptimeStr = `${h}h ${m.toString().padStart(2, '0')}m`;
              } catch (e) {}

              resolve({
                cpu: {
                  pct: cpuPct,
                  freqGHz: cpuFreqGHz,
                  tempC,
                  cores: corePcts,
                  top: cpuProcs[0] ? `${cpuProcs[0].name} (${Math.round(cpuProcs[0].cpu)}%)` : 'idle'
                },
                ram: {
                  usedGB: ramUsedGB,
                  totalGB: ramTotalGB,
                  cachedGB: ramCachedGB,
                  pct: ramPct
                },
                disk: {
                  freeGB: diskFreeGB,
                  totalGB: diskTotalGB,
                  pct: diskPct
                },
                net: {
                  rxKB: netRxKB,
                  txKB: netTxKB,
                  wanIp: currentWanInfo.ip,
                  isTor: currentWanInfo.isTor,
                  interfaces: netIdentities.slice(0, 3)
                },
                processes: {
                  cpu: cpuProcs,
                  ram: ramProcs
                },
                torActive,
                sentinelActive: true,
                aiModel: 'llama3.2:latest',
                uptime: uptimeStr
              });
            });
          });
        });
      });
    });
  });
}

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenW, height: screenH } = primaryDisplay.workAreaSize;

  const hudW = 420;
  const hudH = 710;
  const posX = Math.max(10, screenW - hudW - 16);
  const posY = 36;

  mainWindow = new BrowserWindow({
    width: hudW,
    height: hudH,
    x: posX,
    y: posY,
    transparent: true,
    frame: false,
    resizable: false,
    skipTaskbar: true,
    hasShadow: false,
    type: 'utility',
    show: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.setSkipTaskbar(true);

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  mainWindow.webContents.on('did-finish-load', async () => {
    const data = await getSystemTelemetry();
    mainWindow.webContents.send('telemetry-update', data);
  });

  // Periodic Telemetry IPC Broadcast
  setInterval(async () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      const data = await getSystemTelemetry();
      mainWindow.webContents.send('telemetry-update', data);
    }
  }, 800);
}

// ── IPC Handlers ────────────────────────────────────────────────
ipcMain.on('randomize-mac', (event, iface) => {
  exec(`sudo macchanger -r ${iface} || (sudo ip link set dev ${iface} down && sudo ip link set dev ${iface} address 02:$(hexdump -n5 -e'/1 ":%02x"' /dev/urandom | cut -c2-) && sudo ip link set dev ${iface} up)`, (err) => {
    exec(`notify-send -i /usr/share/pixmaps/zothos.png "[+] MAC CLOAKED" "Interface ${iface} spoofed"`);
  });
});

ipcMain.on('renew-dhcp', (event, iface) => {
  exec(`sudo nmcli device reapply ${iface} || (sudo dhclient -r ${iface} && sudo dhclient ${iface})`, (err) => {
    exec(`notify-send -i /usr/share/pixmaps/zothos.png "[+] IP RENEWED" "DHCP lease refreshed on ${iface}"`);
  });
});

ipcMain.on('cloak-all', (event) => {
  exec("sudo /usr/local/bin/zoth-ghost start", (err) => {
    currentWanInfo.lastCheck = 0;
    pollWanStatus();
  });
});

ipcMain.on('rotate-ip', (event) => {
  exec("sudo /usr/local/bin/zoth-ghost change", (err) => {
    currentWanInfo.lastCheck = 0;
    pollWanStatus();
  });
});

ipcMain.on('kill-process', (event, { pid, name }) => {
  exec(`kill -9 ${pid}`, (err) => {
    exec(`notify-send -u critical "[!] PROCESS TERMINATED" "Terminated ${name} (PID ${pid})"`);
  });
});

ipcMain.on('toggle-tor', (event, active) => {
  const cmd = active ? "sudo /usr/local/bin/zoth-ghost stop" : "sudo /usr/local/bin/zoth-ghost start";
  exec(cmd, () => {
    currentWanInfo.lastCheck = 0;
    pollWanStatus();
  });
});

ipcMain.on('purge-ram', () => {
  exec('sync; echo 3 | sudo tee /proc/sys/vm/drop_caches', () => {
    exec('notify-send -i /usr/share/pixmaps/zothos.png "[✓] RAM PURGED" "Kernel PageCache cleared"');
  });
});

ipcMain.on('run-heal', () => {
  spawn('/usr/local/bin/zoth-heal', ['--quick'], { detached: true, stdio: 'ignore' }).unref();
});

ipcMain.on('toggle-sentinel', () => {
  spawn('/usr/local/bin/zoth-sentinel-hud', [], { detached: true, stdio: 'ignore' }).unref();
});

ipcMain.on('resize-window', (event, { height }) => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    const [w] = mainWindow.getSize();
    mainWindow.setSize(w, height, true);
  }
});

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
