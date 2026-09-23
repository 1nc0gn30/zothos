const { ipcRenderer } = require('electron');

const grid = document.getElementById('grid');
let bundles = {};
let activeBundle = null;

function render() {
  grid.innerHTML = Object.entries(bundles).map(([id, b]) => `
    <div class="bundle-card">
      <div class="b-top">
        <div class="b-tag">${b.tag}</div>
        <div class="b-count">${b.count} TOOLS</div>
      </div>
      <div class="b-title">
        <span class="icon">${b.icon}</span>
        <span>${b.label}</span>
      </div>
      <div class="b-desc">${b.desc}</div>
      <div class="b-chips">
        ${b.tools.slice(0, 10).map(t => `<span class="chip">${t}</span>`).join('')}
        ${b.tools.length > 10 ? `<span class="chip" style="color:var(--gold)">+${b.tools.length - 10} more</span>` : ''}
      </div>
      <div class="b-bottom">
        <span class="st-text" id="st-${id}">${b.installed ? '✦ READY' : 'AVAILABLE'}</span>
        <button class="btn-install" id="btn-${id}" onclick="install('${id}')">
          ${b.installed ? 'REINSTALL' : 'INSTALL BUNDLE'}
        </button>
      </div>
    </div>
  `).join('');
}

function showLog(title) {
  document.getElementById('lg-title').textContent = title;
  document.getElementById('lg-body').textContent = '';
  document.getElementById('p-fill').style.width = '0%';
  document.getElementById('p-num').textContent = '0%';
  document.getElementById('p-tool').textContent = 'Initializing package manager...';
  document.getElementById('btn-close').style.display = 'none';
  document.getElementById('logbox').classList.add('active');
}

function closeLog() {
  document.getElementById('logbox').classList.remove('active');
}

function log(t) {
  const el = document.getElementById('lg-body');
  el.textContent = (el.textContent + '\n' + t).trim();
  el.scrollTop = el.scrollHeight;
}

function install(id) {
  activeBundle = id;
  const btn = document.getElementById('btn-' + id);
  const st = document.getElementById('st-' + id);
  btn.classList.add('installing');
  btn.textContent = 'INSTALLING...';
  st.textContent = 'PROVISIONING...';
  showLog(`✦ INSTALLING ${bundles[id].label.toUpperCase()}...`);
  ipcRenderer.send('install-bundle', id);
}

// IPC Handlers
ipcRenderer.on('bundles', (_e, data) => {
  bundles = data;
  render();
});

ipcRenderer.on('install-start', (_e, d) => {
  log(`[+] Starting deployment of ${d.total} verified packages...`);
});

ipcRenderer.on('install-log', (_e, d) => {
  const text = d.text;
  // Check for progress markers
  const match = text.match(/PROGRESS:(\d+):(\d+):(\d+):([\w\-.]+)/);
  if (match) {
    const [, curr, total, pct, pkg] = match;
    document.getElementById('p-fill').style.width = pct + '%';
    document.getElementById('p-num').textContent = `${pct}% (${curr}/${total})`;
    document.getElementById('p-tool').textContent = `Installing: ${pkg}`;
  }
  const finalMatch = text.match(/PROGRESS_FINAL:(\d+):(\d+):(\d+)/);
  if (finalMatch) {
    const [, success, skipped, total] = finalMatch;
    document.getElementById('p-fill').style.width = '100%';
    document.getElementById('p-num').textContent = '100%';
    document.getElementById('p-tool').textContent = `Completed: ${success} installed, ${skipped} skipped.`;
  }
  log(text.replace(/\s+$/, ''));
});

ipcRenderer.on('install-error', (_e, d) => {
  log(`[!] Error: ${d.msg}`);
  document.getElementById('btn-close').style.display = 'block';
});

ipcRenderer.on('install-done', (_e, d) => {
  log(`\n==== ✦ BUNDLE PROVISIONING FINISHED ✦ ====`);
  if (d.success) {
    bundles[d.bundle].installed = true;
  }
  const btn = document.getElementById('btn-' + d.bundle);
  const st = document.getElementById('st-' + d.bundle);
  if (btn) {
    btn.classList.remove('installing');
    btn.textContent = 'REINSTALL';
  }
  if (st) {
    st.textContent = '✦ INSTALLED';
  }
  document.getElementById('btn-close').style.display = 'block';
  render();
});

ipcRenderer.send('get-bundles');