const { ipcRenderer } = require('electron');

const termOutput = document.getElementById('term-output');
const termInput = document.getElementById('term-input');
const cmdStatus = document.getElementById('cmd-status');
const pricesList = document.getElementById('prices-list');
const walletAddress = document.getElementById('wallet-address');
const walletBalance = document.getElementById('wallet-balance');
const hdrSolPrice = document.getElementById('hdr-sol-price');
const hdrBalance = document.getElementById('hdr-balance');

function appendTerm(text) {
  termOutput.textContent += text;
  termOutput.scrollTop = termOutput.scrollHeight;
}

// ── Streaming Terminal IPC ────────────────────────────────────────────
ipcRenderer.on('web3-cmd-output', (event, data) => {
  if (data.type === 'start') {
    cmdStatus.textContent = 'RUNNING...';
    cmdStatus.style.color = 'var(--gold)';
    appendTerm(`\n[+] EXECUTING: ${data.cmd}\n------------------------------------------------------------\n`);
  } else if (data.type === 'stdout') {
    appendTerm(data.text);
  } else if (data.type === 'stderr') {
    appendTerm(data.text);
  } else if (data.type === 'exit') {
    cmdStatus.textContent = data.code === 0 ? 'COMPLETED' : `EXITED (${data.code})`;
    cmdStatus.style.color = data.code === 0 ? 'var(--sol-green)' : 'var(--rose)';
    appendTerm(`\n[✓] Finished with exit code: ${data.code}\n`);
    refreshWallet();
  } else if (data.type === 'error') {
    cmdStatus.textContent = 'ERROR';
    cmdStatus.style.color = 'var(--rose)';
    appendTerm(`\n[-] Execution error: ${data.text}\n`);
  }
});

window.runCmd = function(cmd) {
  if (!cmd.trim()) return;
  ipcRenderer.send('run-web3-cmd', cmd);
};

document.getElementById('btn-term-send').addEventListener('click', () => {
  const cmd = termInput.value;
  termInput.value = '';
  window.runCmd(cmd);
});

termInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const cmd = termInput.value;
    termInput.value = '';
    window.runCmd(cmd);
  }
});

// ── Market Matrix Metrics ─────────────────────────────────────────────
window.refreshMetrics = function() {
  ipcRenderer.send('get-crypto-metrics');
};

ipcRenderer.on('crypto-metrics-update', (event, res) => {
  if (!res.success || !res.data) return;
  const d = res.data;

  if (d.solana) {
    hdrSolPrice.textContent = `$${d.solana.usd.toFixed(2)}`;
  }

  pricesList.innerHTML = '';
  const assets = [
    { name: 'Solana (SOL)', data: d.solana },
    { name: 'Bitcoin (BTC)', data: d.bitcoin },
    { name: 'Ethereum (ETH)', data: d.ethereum },
    { name: 'Jupiter (JUP)', data: d['jupiter-exchange-solana'] },
    { name: 'Raydium (RAY)', data: d.raydium }
  ];

  assets.forEach(a => {
    if (!a.data) return;
    const change = a.data.usd_24h_change || 0;
    const row = document.createElement('div');
    row.className = 'price-row';
    row.innerHTML = `
      <div>
        <div class="coin-name">${a.name}</div>
        <div class="coin-change ${change >= 0 ? 'up' : 'down'}">${change >= 0 ? '▲' : '▼'} ${Math.abs(change).toFixed(2)}%</div>
      </div>
      <div class="coin-price">$${a.data.usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
    `;
    pricesList.appendChild(row);
  });
});

// ── Wallet Audit ──────────────────────────────────────────────────────
window.refreshWallet = function() {
  ipcRenderer.send('get-wallet-state');
};

ipcRenderer.on('wallet-state-update', (event, w) => {
  walletAddress.textContent = w.address || 'No keypair detected';
  walletBalance.textContent = `Balance: ${w.balance}`;
  hdrBalance.textContent = w.balance;
});

// Boot initialization
refreshMetrics();
refreshWallet();
setInterval(refreshMetrics, 10000);
