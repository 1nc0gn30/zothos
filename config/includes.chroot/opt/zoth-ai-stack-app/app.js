const { ipcRenderer } = require('electron');

let allTools = [];
let currentFilter = 'All';
let searchQuery = '';

const grid = document.getElementById('tools-grid');
const searchInput = document.getElementById('search-input');
const activeDomainLbl = document.getElementById('active-domain-lbl');
const statTotal = document.getElementById('stat-total');
const statInstalled = document.getElementById('stat-installed');
const statAvailable = document.getElementById('stat-available');

function refreshTools() {
  ipcRenderer.send('get-ai-tools');
}

ipcRenderer.on('ai-tools-list', (event, tools) => {
  allTools = tools;
  updateStats();
  render();
});

function updateStats() {
  const installedCount = allTools.filter(t => t.installed).length;
  statTotal.textContent = allTools.length;
  statInstalled.textContent = installedCount;
  statAvailable.textContent = allTools.length - installedCount;
}

function render() {
  grid.innerHTML = '';

  const filtered = allTools.filter(t => {
    const matchesDomain = currentFilter === 'All' || t.domain === currentFilter;
    const matchesSearch = !searchQuery || 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      t.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.cmd.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDomain && matchesSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1; text-align:center; color:var(--text-dim); padding:40px;">No AI tools matched your query.</div>`;
    return;
  }

  filtered.forEach(t => {
    const card = document.createElement('div');
    card.className = 'tool-card';
    card.innerHTML = `
      <div>
        <div class="card-header">
          <span class="tool-name">${t.name}</span>
          <span class="domain-badge">${t.domain}</span>
        </div>
        <div class="tool-desc">${t.desc}</div>
      </div>
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
    btn.classList.toggle('active', btn.textContent === domain.toUpperCase() || (domain === 'All' && btn.textContent === 'ALL TOOLS'));
  });
  render();
};

window.launchTool = function(cmd) {
  ipcRenderer.send('launch-ai-tool', cmd);
};

window.installTool = function(id) {
  const tool = allTools.find(t => t.id === id);
  if (tool) {
    ipcRenderer.send('install-ai-tool', tool);
  }
};

ipcRenderer.on('install-complete', () => {
  setTimeout(refreshTools, 1000);
});

searchInput.addEventListener('input', (e) => {
  searchQuery = e.target.value.trim();
  render();
});

refreshTools();
setInterval(refreshTools, 10000);
