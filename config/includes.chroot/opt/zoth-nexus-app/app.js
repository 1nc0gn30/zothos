const { ipcRenderer } = require('electron');

let allTools = [];
let currentFilter = 'All';
let searchQuery = '';

const grid = document.getElementById('tools-grid');
const searchInput = document.getElementById('search-input');
const activeDomainLbl = document.getElementById('active-domain-lbl');

function refreshTools() {
  ipcRenderer.send('get-tools');
}

ipcRenderer.on('tools-list', (event, tools) => {
  allTools = tools;
  render();
});

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
    alert(`Starting background installation of ${tool.name}...`);
    ipcRenderer.send('install-tool', tool);
  }
};

ipcRenderer.on('install-complete', () => {
  refreshTools();
});

searchInput.addEventListener('input', (e) => {
  searchQuery = e.target.value.trim();
  render();
});

refreshTools();
