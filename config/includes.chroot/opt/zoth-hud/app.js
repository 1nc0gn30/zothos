const { ipcRenderer } = require('electron');

// ── Theme State ─────────────────────────────────────────────────
const THEMES = ['emerald', 'ghost', 'gold', 'cyan'];
let currentThemeIdx = 0;
let isCompact = false;
let openDrawer = null; // 'cpu', 'ram', or null

// ── Historical Buffers for Canvas Wave Graphs ───────────────────
const BUFFER_LEN = 40;
const historyCpu = new Array(BUFFER_LEN).fill(0);
const historyRam = new Array(BUFFER_LEN).fill(0);
const historyNet = new Array(BUFFER_LEN).fill(0);

// ── Wave Graph Canvas Renderer ──────────────────────────────────
function drawWaveCanvas(canvasId, data, colorHex, maxVal = 100) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;

  if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
    canvas.width = w * dpr;
    canvas.height = h * dpr;
  }

  ctx.save();
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, w, h);

  // Background subtle grid lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, h * 0.5);
  ctx.lineTo(w, h * 0.5);
  ctx.stroke();

  if (data.length < 2) {
    ctx.restore();
    return;
  }

  const stepX = w / (data.length - 1);
  const points = data.map((val, i) => {
    const norm = Math.max(0, Math.min(1, val / maxVal));
    return {
      x: i * stepX,
      y: h - norm * (h - 6) - 3
    };
  });

  // Area Fill Gradient
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, colorHex + '44');
  grad.addColorStop(1, colorHex + '02');

  ctx.beginPath();
  ctx.moveTo(points[0].x, h);
  ctx.lineTo(points[0].x, points[0].y);

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const mx = (p0.x + p1.x) / 2;
    const my = (p0.y + p1.y) / 2;
    ctx.quadraticCurveTo(p0.x, p0.y, mx, my);
  }
  ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
  ctx.lineTo(w, h);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // Wave Stroke Line
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const mx = (p0.x + p1.x) / 2;
    const my = (p0.y + p1.y) / 2;
    ctx.quadraticCurveTo(p0.x, p0.y, mx, my);
  }
  ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
  ctx.strokeStyle = colorHex;
  ctx.lineWidth = 1.6;
  ctx.shadowColor = colorHex;
  ctx.shadowBlur = 8;
  ctx.stroke();

  // Peak Tracker Dot at the end
  const lastPt = points[points.length - 1];
  ctx.beginPath();
  ctx.arc(lastPt.x, lastPt.y, 3, 0, 2 * Math.PI);
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = colorHex;
  ctx.shadowBlur = 10;
  ctx.fill();

  ctx.restore();
}

function getThemeColor(varName) {
  return getComputedStyle(document.body).getPropertyValue(varName).trim() || '#00ff9d';
}

// ── Telemetry Update Handler ────────────────────────────────────
ipcRenderer.on('telemetry-update', (event, data) => {
  if (!data) return;

  // 1. CPU
  const cpuPct = data.cpu.pct || 0;
  document.getElementById('cpu-pct').textContent = `${cpuPct.toFixed(1)}%`;
  document.getElementById('cpu-freq').textContent = `[${data.cpu.freqGHz.toFixed(1)} GHz]`;
  document.getElementById('cpu-top-proc').textContent = `Top: ${data.cpu.top}`;
  
  const tempBadge = document.getElementById('cpu-temp');
  if (data.cpu.tempC > 0) {
    tempBadge.textContent = `${Math.round(data.cpu.tempC)}°C`;
    tempBadge.style.color = data.cpu.tempC > 78 ? 'var(--danger)' : 'var(--accent)';
  } else {
    tempBadge.textContent = 'OPT';
  }

  // CPU Cores Equalizer
  const eqEl = document.getElementById('core-equalizer');
  if (data.cpu.cores && data.cpu.cores.length > 0) {
    if (eqEl.children.length !== data.cpu.cores.length) {
      eqEl.innerHTML = '';
      data.cpu.cores.forEach(() => {
        const col = document.createElement('div');
        col.className = 'core-col';
        const fill = document.createElement('div');
        fill.className = 'core-fill';
        col.appendChild(fill);
        eqEl.appendChild(col);
      });
    }
    data.cpu.cores.forEach((cp, idx) => {
      if (eqEl.children[idx]) {
        eqEl.children[idx].firstElementChild.style.height = `${Math.max(4, cp)}%`;
      }
    });
  }

  // Update CPU Wave Buffer
  historyCpu.shift();
  historyCpu.push(cpuPct);
  drawWaveCanvas('canvas-cpu', historyCpu, getThemeColor('--primary'), 100);

  // CPU Drawer Table
  if (openDrawer === 'cpu' && data.processes && data.processes.cpu) {
    const listEl = document.getElementById('cpu-proc-list');
    listEl.innerHTML = '';
    data.processes.cpu.slice(0, 5).forEach(proc => {
      const row = document.createElement('div');
      row.className = 'proc-row';
      row.innerHTML = `
        <div class="proc-info">
          <span class="proc-pid">PID ${proc.pid}</span>
          <span class="proc-name">${proc.name}</span>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <span class="proc-metric">${proc.cpu.toFixed(1)}% CPU</span>
          <button class="pill-btn danger" style="padding:1px 6px; font-size:7px;" onclick="killProc('${proc.pid}', '${proc.name}', event)">KILL</button>
        </div>
      `;
      listEl.appendChild(row);
    });
  }

  // 2. RAM
  const ramUsed = data.ram.usedGB || 0;
  const ramTotal = data.ram.totalGB || 8;
  const ramPct = data.ram.pct || 0;
  document.getElementById('ram-metric').textContent = `${ramUsed.toFixed(2)}G / ${ramTotal.toFixed(2)}G`;
  document.getElementById('ram-cache').textContent = `(Cache: ${data.ram.cachedGB.toFixed(2)}G)`;
  document.getElementById('ram-pct-badge').textContent = `${Math.round(ramPct)}% USED`;
  document.getElementById('ram-bar-fill').style.width = `${Math.min(100, ramPct)}%`;

  historyRam.shift();
  historyRam.push(ramPct);
  drawWaveCanvas('canvas-ram', historyRam, getThemeColor('--secondary'), 100);

  // RAM Drawer Table
  if (openDrawer === 'ram' && data.processes && data.processes.ram) {
    const listEl = document.getElementById('ram-proc-list');
    listEl.innerHTML = '';
    data.processes.ram.slice(0, 5).forEach(proc => {
      const row = document.createElement('div');
      row.className = 'proc-row';
      row.innerHTML = `
        <div class="proc-info">
          <span class="proc-pid">PID ${proc.pid}</span>
          <span class="proc-name">${proc.name}</span>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <span class="proc-metric" style="color:var(--secondary)">${Math.round(proc.rssMB)}MB (${proc.mem.toFixed(1)}%)</span>
          <button class="pill-btn danger" style="padding:1px 6px; font-size:7px;" onclick="killProc('${proc.pid}', '${proc.name}', event)">KILL</button>
        </div>
      `;
      listEl.appendChild(row);
    });
  }

  // 3. Storage & Network Dual Grid
  document.getElementById('disk-free').textContent = `${data.disk.freeGB.toFixed(1)} GB Free`;
  document.getElementById('disk-used-sub').textContent = `Used: ${data.disk.pct}% of ${data.disk.totalGB}G`;
  document.getElementById('disk-bar-fill').style.width = `${Math.min(100, data.disk.pct)}%`;

  document.getElementById('net-rx').textContent = `▼ ${data.net.rxKB.toFixed(1)} KB/s`;
  document.getElementById('net-tx').textContent = `▲ ${data.net.txKB.toFixed(1)} KB/s`;

  historyNet.shift();
  historyNet.push(data.net.rxKB);
  const maxNet = Math.max(50, ...historyNet);
  drawWaveCanvas('canvas-net', historyNet, getThemeColor('--primary'), maxNet);

  // 4. Network Interfaces
  const ifaceList = document.getElementById('iface-list');
  ifaceList.innerHTML = '';
  if (data.net.interfaces && data.net.interfaces.length > 0) {
    data.net.interfaces.slice(0, 2).forEach(ident => {
      const entry = document.createElement('div');
      entry.className = 'iface-entry';
      entry.innerHTML = `
        <div class="iface-top">
          <div style="display:flex; align-items:center; gap:6px;">
            <span class="iface-badge">[${ident.iface}]</span>
            <span class="iface-ip">${ident.ip}</span>
          </div>
          <div class="iface-actions">
            <button class="pill-btn" style="font-size:7.5px; padding:1px 6px;" onclick="renewDhcp('${ident.iface}', event)">RENEW</button>
            <button class="pill-btn" style="font-size:7.5px; padding:1px 6px; border-color:var(--primary-glow); color:var(--primary);" onclick="spoofMac('${ident.iface}', event)">SPOOF</button>
          </div>
        </div>
        <div class="iface-mac">HW MAC: ${ident.mac}</div>
      `;
      ifaceList.appendChild(entry);
    });
  } else {
    ifaceList.innerHTML = '<div style="font-size:8px; color:var(--text-dim);">No active network adapters</div>';
  }

  // 5. Sentinel & Tor Status
  const torBtn = document.getElementById('btn-tor');
  if (data.torActive) {
    torBtn.textContent = 'TOR: ON';
    torBtn.classList.add('active');
  } else {
    torBtn.textContent = 'TOR: OFF';
    torBtn.classList.remove('active');
  }

  document.getElementById('hud-uptime').textContent = `UPTIME: ${data.uptime}`;

  // Mini Ticker Updates
  document.getElementById('mini-cpu').textContent = `CPU: ${cpuPct.toFixed(1)}%`;
  document.getElementById('mini-ram').textContent = `RAM: ${ramUsed.toFixed(1)}G`;
  document.getElementById('mini-net').textContent = `NET: ▼${data.net.rxKB.toFixed(0)}K`;
});

// ── Interactive Actions ─────────────────────────────────────────
window.killProc = function(pid, name, event) {
  if (event) event.stopPropagation();
  ipcRenderer.send('kill-process', { pid, name });
};

window.renewDhcp = function(iface, event) {
  if (event) event.stopPropagation();
  ipcRenderer.send('renew-dhcp', iface);
};

window.spoofMac = function(iface, event) {
  if (event) event.stopPropagation();
  ipcRenderer.send('randomize-mac', iface);
};

// ── Drawer Toggles ──────────────────────────────────────────────
document.getElementById('card-cpu').addEventListener('click', () => {
  const cardCpu = document.getElementById('card-cpu');
  const cardRam = document.getElementById('card-ram');
  if (openDrawer === 'cpu') {
    openDrawer = null;
    cardCpu.classList.remove('open');
    ipcRenderer.send('resize-window', { height: 680 });
  } else {
    openDrawer = 'cpu';
    cardCpu.classList.add('open');
    cardRam.classList.remove('open');
    ipcRenderer.send('resize-window', { height: 820 });
  }
});

document.getElementById('card-ram').addEventListener('click', () => {
  const cardCpu = document.getElementById('card-cpu');
  const cardRam = document.getElementById('card-ram');
  if (openDrawer === 'ram') {
    openDrawer = null;
    cardRam.classList.remove('open');
    ipcRenderer.send('resize-window', { height: 680 });
  } else {
    openDrawer = 'ram';
    cardRam.classList.add('open');
    cardCpu.classList.remove('open');
    ipcRenderer.send('resize-window', { height: 820 });
  }
});

// ── Header Controls ─────────────────────────────────────────────
document.getElementById('btn-theme').addEventListener('click', () => {
  currentThemeIdx = (currentThemeIdx + 1) % THEMES.length;
  const theme = THEMES[currentThemeIdx];
  document.body.setAttribute('data-theme', theme);
  document.getElementById('theme-sub-label').textContent = `PRO SOVEREIGN // [${theme.toUpperCase()}]`;
});

document.getElementById('btn-mini').addEventListener('click', () => {
  isCompact = !isCompact;
  const container = document.getElementById('hud-container');
  if (isCompact) {
    container.classList.add('mini');
    ipcRenderer.send('resize-window', { height: 68 });
  } else {
    container.classList.remove('mini');
    ipcRenderer.send('resize-window', { height: openDrawer ? 820 : 680 });
  }
});

// ── Command Deck Buttons ────────────────────────────────────────
document.getElementById('btn-cloak-all').addEventListener('click', (e) => {
  e.stopPropagation();
  ipcRenderer.send('cloak-all');
});

document.getElementById('btn-tor').addEventListener('click', (e) => {
  e.stopPropagation();
  const isActive = document.getElementById('btn-tor').classList.contains('active');
  ipcRenderer.send('toggle-tor', isActive);
});

document.getElementById('btn-sentinel').addEventListener('click', (e) => {
  e.stopPropagation();
  ipcRenderer.send('toggle-sentinel');
});

document.getElementById('btn-purge').addEventListener('click', (e) => {
  e.stopPropagation();
  ipcRenderer.send('purge-ram');
});

document.getElementById('btn-heal').addEventListener('click', (e) => {
  e.stopPropagation();
  ipcRenderer.send('run-heal');
});
