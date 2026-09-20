const { ipcRenderer } = require('electron');

let isCloaked = false;
const masterShield = document.getElementById('master-shield');
const shieldIcon = document.getElementById('shield-icon');
const shieldStatus = document.getElementById('shield-status');
const shieldSub = document.getElementById('shield-sub');
const publicIp = document.getElementById('public-ip');
const torBadge = document.getElementById('tor-badge');
const btnToggleCloak = document.getElementById('btn-toggle-cloak');
const ifaceList = document.getElementById('iface-list');
const logBox = document.getElementById('log-box');

function appendLog(msg) {
  logBox.textContent += '\n' + msg;
  logBox.scrollTop = logBox.scrollHeight;
}

function refreshState() {
  ipcRenderer.send('get-privacy-state');
}

ipcRenderer.on('privacy-state-update', (event, data) => {
  isCloaked = data.isTor;
  publicIp.textContent = data.ip;

  if (data.isTor) {
    masterShield.className = 'master-shield cloaked';
    shieldIcon.textContent = '🛡️';
    shieldStatus.textContent = 'SOVEREIGN CLOAK ACTIVE';
    shieldStatus.style.color = 'var(--green)';
    shieldSub.textContent = '100% Transparent Tor & DNS redirection enforced';
    torBadge.textContent = '[✓ VERIFIED TOR EXIT NODE]';
    torBadge.style.color = 'var(--green)';
    btnToggleCloak.textContent = 'DISENGAGE CLOAK';
    btnToggleCloak.className = 'danger';
  } else {
    masterShield.className = 'master-shield uncloaked';
    shieldIcon.textContent = '🔓';
    shieldStatus.textContent = 'CLEARNET EXPOSED';
    shieldStatus.style.color = 'var(--red)';
    shieldSub.textContent = 'Traffic routed through direct ISP gateway';
    torBadge.textContent = '[! CLEARNET DETECTED]';
    torBadge.style.color = 'var(--red)';
    btnToggleCloak.textContent = 'ENGAGE GHOST CLOAK';
    btnToggleCloak.className = 'primary';
  }

  // Render Interfaces
  ifaceList.innerHTML = '';
  data.ifaces.forEach(iface => {
    const el = document.createElement('div');
    el.className = 'iface-card';
    el.innerHTML = `
      <div>
        <div style="font-size:11px; font-weight:700; color:var(--cyan);">${iface.name}</div>
        <div style="font-size:8.5px; color:var(--text-dim); margin-top:2px;">MAC: ${iface.mac}</div>
      </div>
      <button style="padding:2px 8px; font-size:8.5px;" onclick="spoofIface('${iface.name}')">SPOOF</button>
    `;
    ifaceList.appendChild(el);
  });
});

window.toggleCloak = function() {
  if (isCloaked) {
    appendLog('[*] Disengaging transparent Tor proxy...');
    ipcRenderer.send('ghost-stop');
  } else {
    appendLog('[*] Arming full sovereign Tor cloaking & DNS lock...');
    ipcRenderer.send('ghost-start');
  }
};

window.rotateCircuit = function() {
  appendLog('[*] Rotating Tor exit node circuit (SIGNAL NEWNYM)...');
  ipcRenderer.send('ghost-change-circuit');
};

window.spoofIface = function(name) {
  appendLog(`[*] Spoofing MAC address on ${name}...`);
  ipcRenderer.send('ghost-spoof-mac', name);
};

window.panicScrub = function() {
  appendLog('[🚨] Initiating emergency RAM purge and session scrub...');
  ipcRenderer.send('ghost-panic-scrub');
};

ipcRenderer.on('ghost-action-result', (event, data) => {
  appendLog(`[✓] Action ${data.action} finished: ${data.log || 'Success'}`);
  setTimeout(refreshState, 1500);
});

refreshState();
setInterval(refreshState, 6000);
