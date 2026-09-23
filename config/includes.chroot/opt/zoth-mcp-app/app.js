const { ipcRenderer } = require('electron');

let currentConfig = { mcpServers: {} };
let currentHealthReport = [];
let editingServerId = null;

const statServersCount = document.getElementById('stat-servers-count');
const statConfigPath = document.getElementById('stat-config-path');
const serversGrid = document.getElementById('servers-grid');
const toolsTableBody = document.getElementById('tools-table-body');
const testerServerSelect = document.getElementById('tester-server-select');
const consoleOutput = document.getElementById('console-output');
const modalServer = document.getElementById('modal-server');

// ── Lifecycle & Data Loading ──────────────────────────────────────────

function refreshConfig() {
  ipcRenderer.send('get-mcp-config');
  ipcRenderer.send('health-mcp-check');
}

ipcRenderer.on('mcp-config-data', (event, res) => {
  if (res.success) {
    currentConfig = res.data || { mcpServers: {} };
    statConfigPath.textContent = res.configPath;
    statServersCount.textContent = Object.keys(currentConfig.mcpServers || {}).length;
    renderServers();
    renderToolMatrix();
    populateTesterSelect();
  } else {
    statConfigPath.textContent = 'Error: ' + res.error;
  }
});

ipcRenderer.on('health-mcp-result', (event, res) => {
  if (res.success) {
    currentHealthReport = res.report || [];
    renderServers();
    renderToolMatrix();
  }
});

// ── Tab Switching ─────────────────────────────────────────────────────

window.switchTab = function(tabName) {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('onclick').includes(tabName));
  });
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.toggle('active', tab.id === `tab-${tabName}`);
  });
};

// ── Render Servers Registry ───────────────────────────────────────────

function renderServers() {
  if (!serversGrid) return;
  serversGrid.innerHTML = '';

  const filter = (document.getElementById('server-search')?.value || '').toLowerCase();
  const servers = currentConfig.mcpServers || {};

  Object.keys(servers).forEach(id => {
    const srv = servers[id];
    const cmdStr = `${srv.command || ''} ${(srv.args || []).join(' ')}`.trim();
    const ring = srv.securityRing || 'RING_2_TOOLMASTER';
    const desc = srv.description || 'No description provided';
    const sandbox = srv.sandbox || '/tmp';

    if (filter && !id.toLowerCase().includes(filter) && !cmdStr.toLowerCase().includes(filter) && !ring.toLowerCase().includes(filter)) {
      return;
    }

    const health = currentHealthReport.find(h => h.name === id);
    const isHealthy = health ? health.healthy : true;
    const ringClass = ring.includes('RING_0') ? 'ring-0' : (ring.includes('RING_1') ? 'ring-1' : 'ring-2');

    const card = document.createElement('div');
    card.className = `server-card ${ringClass}`;
    card.innerHTML = `
      <div class="card-top">
        <span class="server-title">${id}</span>
        <span class="ring-tag ${ringClass}">${ring.replace('_TOOLMASTER', '').replace('_SYSADMIN', '').replace('_SOVEREIGN', '')}</span>
      </div>
      <div class="server-desc">${desc}</div>
      <div class="server-cmd"><strong>CMD:</strong> ${cmdStr}</div>
      <div style="font-size:10px; color:var(--text-dim);">
        <strong>SANDBOX:</strong> <span style="color:var(--primary);">${sandbox}</span>
      </div>
      <div class="card-actions">
        <span class="status-lbl ${isHealthy ? 'online' : 'standby'}">
          ${isHealthy ? '● READY / HEALTHY' : '▲ STANDBY (FALLBACK)'}
        </span>
        <div style="display:flex; gap:6px;">
          <button class="btn" style="padding:3px 8px; font-size:9px;" onclick="testServer('${id}')">TEST</button>
          <button class="btn btn-gold" style="padding:3px 8px; font-size:9px;" onclick="openEditServerModal('${id}')">EDIT</button>
          <button class="btn btn-red" style="padding:3px 8px; font-size:9px;" onclick="deleteServer('${id}')">DEL</button>
        </div>
      </div>
    `;
    serversGrid.appendChild(card);
  });
}

// ── Render Tool Matrix ────────────────────────────────────────────────

function renderToolMatrix() {
  if (!toolsTableBody) return;
  toolsTableBody.innerHTML = '';

  const servers = currentConfig.mcpServers || {};

  Object.keys(servers).forEach(id => {
    const srv = servers[id];
    const tr = document.createElement('tr');
    const ring = srv.securityRing || 'RING_2_TOOLMASTER';
    const ringClass = ring.includes('RING_0') ? 'ring-0' : (ring.includes('RING_1') ? 'ring-1' : 'ring-2');
    const mode = srv.offline ? '<span style="color:var(--secondary);">[OFFLINE]</span>' : '<span style="color:var(--yellow);">[NET-REQ]</span>';

    tr.innerHTML = `
      <td style="font-weight:800; color:var(--text);">${id}</td>
      <td><span class="ring-tag ${ringClass}">${ring}</span></td>
      <td style="color:var(--primary);">${srv.sandbox || '/tmp'}</td>
      <td>${mode}</td>
      <td style="color:var(--text-dim);">${srv.description || 'N/A'}</td>
    `;
    toolsTableBody.appendChild(tr);
  });
}

// ── Populate Tester Dropdown ──────────────────────────────────────────

function populateTesterSelect() {
  if (!testerServerSelect) return;
  testerServerSelect.innerHTML = '';

  const servers = currentConfig.mcpServers || {};
  Object.keys(servers).forEach(id => {
    const opt = document.createElement('option');
    opt.value = id;
    opt.textContent = `${id} (${servers[id].securityRing || 'RING_2'})`;
    testerServerSelect.appendChild(opt);
  });
}

// ── Tester Actions ────────────────────────────────────────────────────

window.runToolTest = function() {
  const serverName = testerServerSelect.value;
  const toolName = document.getElementById('tester-tool-input').value.trim();
  const rawArgs = document.getElementById('tester-args-input').value.trim();

  if (!serverName) return alert('Select an MCP server');

  let parsedArgs = {};
  if (rawArgs) {
    try {
      parsedArgs = JSON.parse(rawArgs);
    } catch (e) {
      return alert('Invalid JSON arguments: ' + e.message);
    }
  }

  consoleOutput.textContent = `[*] Invoking test on server [${serverName}]...\n`;
  ipcRenderer.send('execute-tool-prompt', {
    serverName,
    toolName,
    inputArgs: parsedArgs
  });
};

ipcRenderer.on('tool-prompt-result', (event, res) => {
  consoleOutput.textContent = res.output;
});

// ── Server Test & Daemon Controls ────────────────────────────────────

window.testServer = function(name) {
  switchTab('tester');
  testerServerSelect.value = name;
  window.runToolTest();
};

window.syncConfig = function() {
  document.getElementById('footer-status').textContent = 'SYNCING CONFIG...';
  ipcRenderer.send('sync-mcp-config');
};

ipcRenderer.on('sync-mcp-config-result', (event, res) => {
  document.getElementById('footer-status').textContent = 'SYNC COMPLETE';
  alert(res.log || 'Synced master config to all agent runtimes!');
});

window.startDaemons = function() {
  document.getElementById('footer-status').textContent = 'STARTING DAEMONS...';
  ipcRenderer.send('start-all-daemons');
};

window.stopDaemons = function() {
  document.getElementById('footer-status').textContent = 'STOPPING DAEMONS...';
  ipcRenderer.send('stop-all-daemons');
};

ipcRenderer.on('daemon-action-result', (event, res) => {
  document.getElementById('footer-status').textContent = res.success ? 'DAEMON ACTION COMPLETED' : 'DAEMON ACTION ERROR';
  alert(res.log);
  refreshConfig();
});

// ── Modal Workflows ───────────────────────────────────────────────────

window.openAddServerModal = function() {
  editingServerId = null;
  document.getElementById('modal-server-title').textContent = 'ADD NEW MCP SERVER';
  document.getElementById('modal-id').value = '';
  document.getElementById('modal-id').disabled = false;
  document.getElementById('modal-cmd').value = '';
  document.getElementById('modal-args').value = '';
  document.getElementById('modal-ring').value = 'RING_2_TOOLMASTER';
  document.getElementById('modal-desc').value = '';
  document.getElementById('modal-sandbox').value = '/home/neo';
  modalServer.classList.add('active');
};

window.openEditServerModal = function(id) {
  editingServerId = id;
  const srv = currentConfig.mcpServers[id];
  if (!srv) return;

  document.getElementById('modal-server-title').textContent = `EDIT SERVER [${id}]`;
  document.getElementById('modal-id').value = id;
  document.getElementById('modal-id').disabled = true;
  document.getElementById('modal-cmd').value = srv.command || '';
  document.getElementById('modal-args').value = (srv.args || []).join(', ');
  document.getElementById('modal-ring').value = srv.securityRing || 'RING_2_TOOLMASTER';
  document.getElementById('modal-desc').value = srv.description || '';
  document.getElementById('modal-sandbox').value = srv.sandbox || '/home/neo';
  modalServer.classList.add('active');
};

window.closeModal = function() {
  modalServer.classList.remove('active');
};

window.saveModalServer = function() {
  const id = document.getElementById('modal-id').value.trim();
  const cmd = document.getElementById('modal-cmd').value.trim();
  const rawArgs = document.getElementById('modal-args').value.trim();
  const ring = document.getElementById('modal-ring').value;
  const desc = document.getElementById('modal-desc').value.trim();
  const sandbox = document.getElementById('modal-sandbox').value.trim();

  if (!id || !cmd) {
    return alert('Server Identifier and Executable Command are required');
  }

  const args = rawArgs ? rawArgs.split(',').map(a => a.trim()).filter(Boolean) : [];

  if (!currentConfig.mcpServers) currentConfig.mcpServers = {};

  currentConfig.mcpServers[id] = {
    command: cmd,
    args: args,
    description: desc,
    offline: true,
    securityRing: ring,
    ring_level: ring.includes('RING_0') ? 0 : (ring.includes('RING_1') ? 1 : 2),
    sandbox: sandbox || '/home/neo'
  };

  ipcRenderer.send('save-mcp-config', currentConfig);
  closeModal();
};

ipcRenderer.on('save-mcp-config-result', (event, res) => {
  if (res.success) {
    refreshConfig();
  } else {
    alert('Failed to save config: ' + res.error);
  }
});

window.deleteServer = function(id) {
  if (confirm(`Are you sure you want to remove MCP server '${id}'?`)) {
    delete currentConfig.mcpServers[id];
    ipcRenderer.send('save-mcp-config', currentConfig);
  }
};

// Initial load
refreshConfig();
