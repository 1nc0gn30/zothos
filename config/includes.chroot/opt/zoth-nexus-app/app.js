const { ipcRenderer } = require('electron');

let allTools = [];
let currentFilter = 'All';
let searchQuery = '';

const grid = document.getElementById('tools-grid');
const searchInput = document.getElementById('search-input');
const activeDomainLbl = document.getElementById('active-domain-lbl');
const teleTotal = document.getElementById('tele-total');
const teleInstalled = document.getElementById('tele-installed');
const installModal = document.getElementById('install-modal');
const installModalTitle = document.getElementById('install-modal-title');
const installLogs = document.getElementById('install-logs');

function refreshTools() {
  ipcRenderer.send('get-tools');
}

ipcRenderer.on('tools-list', (event, tools) => {
  allTools = tools;
  updateTelemetry();
  render();
});

function updateTelemetry() {
  if (teleTotal) teleTotal.textContent = allTools.length;
  if (teleInstalled) teleInstalled.textContent = allTools.filter(t => t.installed).length;
}

function render() {
  if (!grid) return;
  grid.innerHTML = '';

  const filtered = allTools.filter(t => {
    const matchesDomain = currentFilter === 'All' || t.domain === currentFilter;
    const matchesSearch = !searchQuery || 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      t.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.cmd.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDomain && matchesSearch;
  });

  filtered.forEach(t => {
    const card = document.createElement('div');
    card.className = 'tool-card';
    card.innerHTML = `
      <div class="card-header">
        <span class="tool-name">${t.name}</span>
        <span class="domain-badge">${t.domain}</span>
      </div>
      <div class="tool-desc">${t.desc}</div>
      <div class="card-footer">
        <span class="status-badge ${t.installed ? 'installed' : 'uninstalled'}">
          ${t.installed ? '● INSTALLED' : '○ AVAILABLE'}
        </span>
        <div>
          ${t.installed 
            ? `<button class="action-btn" onclick="launchTool('${t.cmd}')">LAUNCH</button>`
            : `<button class="action-btn install" onclick="installTool('${t.id}')">INSTALL</button>`
          }
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

window.filterDomain = function(domain) {
  currentFilter = domain;
  activeDomainLbl.textContent = domain.toUpperCase();
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.textContent.includes(domain.toUpperCase()) || (domain === 'All' && btn.textContent === 'ALL TOOLS'));
  });
  render();
};

window.launchTool = function(cmd) {
  ipcRenderer.send('launch-tool', cmd);
};

window.installTool = function(id) {
  const tool = allTools.find(t => t.id === id);
  if (tool) {
    installModalTitle.textContent = `INSTALLING ${tool.name.toUpperCase()}...`;
    installLogs.textContent = `[*] Starting installation for ${tool.name} (${tool.pkg})...\n`;
    installModal.classList.add('active');
    ipcRenderer.send('install-tool', tool);
  }
};

window.closeInstallModal = function() {
  installModal.classList.remove('active');
};

ipcRenderer.on('install-log', (event, data) => {
  installLogs.textContent += data.text;
  installLogs.scrollTop = installLogs.scrollHeight;
});

ipcRenderer.on('install-complete', (event, data) => {
  installLogs.textContent += `\n[*] Process completed with code: ${data.success ? '0 (SUCCESS)' : 'ERROR'}\n`;
  refreshTools();
});

if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.trim();
    render();
  });
}

refreshTools();
