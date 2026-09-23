const { ipcRenderer } = require('electron');

// UI DOM Elements
const termOutput = document.getElementById('term-output');
const termInput = document.getElementById('term-input');
const cmdStatus = document.getElementById('cmd-status');
const pricesList = document.getElementById('prices-list');

const walletAddress = document.getElementById('wallet-address');
const walletBalance = document.getElementById('wallet-balance');
const walletKeyPath = document.getElementById('wallet-key-path');

const hdrSolPrice = document.getElementById('hdr-sol-price');
const hdrGas = document.getElementById('hdr-gas');
const hdrCluster = document.getElementById('hdr-cluster');
const hdrBalance = document.getElementById('hdr-balance');

let currentSolPriceUSD = 148.50;
let currentEthPriceUSD = 2540.00;

// ── Tab Navigation ───────────────────────────────────────────────────
window.switchTab = function(tabId) {
  const tabs = document.querySelectorAll('.tab-btn');
  const panes = document.querySelectorAll('.view-pane');

  tabs.forEach(t => t.classList.remove('active'));
  panes.forEach(p => p.classList.remove('active'));

  const activePane = document.getElementById(`view-${tabId}`);
  if (activePane) activePane.classList.add('active');

  const btnIndex = ['cli', 'wallet', 'rpc', 'contract', 'gas'].indexOf(tabId);
  if (btnIndex !== -1 && tabs[btnIndex]) {
    tabs[btnIndex].classList.add('active');
  }

  if (tabId === 'rpc') refreshRPCs();
  if (tabId === 'gas') refreshGas();
  if (tabId === 'wallet') refreshWallet();
};

// ── Terminal Logic ───────────────────────────────────────────────────
function appendTerm(text) {
  if (!termOutput) return;
  termOutput.textContent += text;
  termOutput.scrollTop = termOutput.scrollHeight;
}

window.clearTerm = function() {
  if (termOutput) termOutput.textContent = '[*] Terminal cleared.\n';
};

ipcRenderer.on('web3-cmd-output', (event, data) => {
  if (!cmdStatus) return;
  if (data.type === 'start') {
    cmdStatus.textContent = 'RUNNING...';
    cmdStatus.style.color = 'var(--gold)';
    appendTerm(`\n[+] EXECUTING: ${data.cmd}\n------------------------------------------------------------\n`);
  } else if (data.type === 'stdout' || data.type === 'stderr') {
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
  if (!cmd || !cmd.trim()) return;
  switchTab('cli');
  ipcRenderer.send('run-web3-cmd', cmd);
};

const btnSend = document.getElementById('btn-term-send');
if (btnSend) {
  btnSend.addEventListener('click', () => {
    const cmd = termInput.value;
    termInput.value = '';
    window.runCmd(cmd);
  });
}

if (termInput) {
  termInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const cmd = termInput.value;
      termInput.value = '';
      window.runCmd(cmd);
    }
  });
}

// ── Market Matrix Metrics ─────────────────────────────────────────────
window.refreshMetrics = function() {
  ipcRenderer.send('get-crypto-metrics');
};

ipcRenderer.on('crypto-metrics-update', (event, res) => {
  if (!res.success || !res.data) return;
  const d = res.data;

  if (d.solana && hdrSolPrice) {
    currentSolPriceUSD = d.solana.usd;
    hdrSolPrice.textContent = `$${d.solana.usd.toFixed(2)}`;
  }
  if (d.ethereum) {
    currentEthPriceUSD = d.ethereum.usd;
  }

  if (!pricesList) return;
  pricesList.innerHTML = '';
  const assets = [
    { name: 'Solana (SOL)', data: d.solana },
    { name: 'Bitcoin (BTC)', data: d.bitcoin },
    { name: 'Ethereum (ETH)', data: d.ethereum },
    { name: 'Jupiter (JUP)', data: d['jupiter-exchange-solana'] },
    { name: 'Raydium (RAY)', data: d.raydium },
    { name: 'Render (RENDER)', data: d['render-token'] },
    { name: 'NEAR Protocol (NEAR)', data: d.near },
    { name: 'Avalanche (AVAX)', data: d['avalanche-2'] }
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

// ── Wallet Audit & Keypair Generator ──────────────────────────────────
window.refreshWallet = function() {
  ipcRenderer.send('get-wallet-state');
};

ipcRenderer.on('wallet-state-update', (event, w) => {
  if (walletAddress) walletAddress.textContent = w.address || 'No keypair detected';
  if (walletBalance) walletBalance.textContent = `Balance: ${w.balance}`;
  if (hdrBalance) hdrBalance.textContent = w.balance;
  if (walletKeyPath) walletKeyPath.textContent = w.keyPath || 'No keypair file';

  if (w.config && hdrCluster) {
    if (w.config.includes('devnet')) hdrCluster.textContent = 'DEVNET';
    else if (w.config.includes('testnet')) hdrCluster.textContent = 'TESTNET';
    else if (w.config.includes('localhost') || w.config.includes('127.0.0.1')) hdrCluster.textContent = 'LOCALNET';
    else hdrCluster.textContent = 'MAINNET-BETA';
  }
});

window.generateKey = function(type) {
  ipcRenderer.send('generate-keypair', { type, persist: false });
};

ipcRenderer.on('keypair-generated', (event, res) => {
  if (!res.success) {
    alert(`Failed to generate keypair: ${res.error}`);
    return;
  }
  const pubElem = document.getElementById('gen-pubkey');
  const privElem = document.getElementById('gen-privkey');
  const jsonBox = document.getElementById('gen-json-box');

  if (pubElem) pubElem.value = res.address;
  if (privElem) privElem.value = res.secretKeyBase58 || res.secretKeyHex;
  if (jsonBox) jsonBox.textContent = res.jsonArray || `// EVM Hex Private Key:\n${res.secretKeyHex}`;
});

window.copyField = function(elemId) {
  const elem = document.getElementById(elemId);
  if (elem && elem.value) {
    navigator.clipboard.writeText(elem.value);
    alert('Copied to clipboard!');
  }
};

window.saveKeypairFile = function() {
  const jsonBox = document.getElementById('gen-json-box');
  if (!jsonBox || !jsonBox.textContent.startsWith('[')) {
    alert('Generate a Solana Keypair first to save as id.json!');
    return;
  }
  ipcRenderer.send('generate-keypair', { type: 'solana', persist: true });
};

// ── RPC Latency Inspector ─────────────────────────────────────────────
window.refreshRPCs = function() {
  const container = document.getElementById('rpc-node-list');
  if (container) container.innerHTML = '<div style="font-size:11px; color:var(--gold);">Pinging RPC endpoints...</div>';
  ipcRenderer.send('check-rpc-nodes');
};

ipcRenderer.on('rpc-nodes-update', (event, { results }) => {
  const container = document.getElementById('rpc-node-list');
  if (!container) return;
  container.innerHTML = '';

  results.forEach(n => {
    const card = document.createElement('div');
    card.className = 'data-card';
    const isOnline = n.status === 'online';

    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div style="font-size:11px; font-weight:800; color:var(--text);">${n.name}</div>
        <span style="font-size:9px; padding:2px 6px; border-radius:4px; font-weight:700; ${isOnline ? 'background:rgba(20,241,149,0.15); color:var(--sol-green);' : 'background:rgba(244,63,94,0.15); color:var(--rose);'}">
          ${isOnline ? 'ONLINE' : 'OFFLINE'}
        </span>
      </div>
      <div style="font-size:10px; color:var(--cyan); word-break:break-all;">${n.url}</div>
      <div style="display:flex; justify-content:space-between; align-items:center; font-size:10px; margin-top:4px;">
        <span style="color:var(--text-dim);">${n.info}</span>
        <span style="font-weight:700; color:var(--gold);">${n.latency !== null ? n.latency + ' ms' : 'TIMEOUT'}</span>
      </div>
      ${n.type === 'solana' && isOnline ? `<button style="font-size:8.5px; padding:3px 6px; margin-top:4px;" onclick="runCmd('solana config set --url ${n.url}')">SET AS ACTIVE CLI RPC</button>` : ''}
    `;
    container.appendChild(card);
  });
});

// ── Smart Contract Interaction ────────────────────────────────────────
window.applyPresetMethod = function() {
  const select = document.getElementById('preset-method-select');
  const input = document.getElementById('contract-method-hex');
  if (select && input) input.value = select.value;
};

window.executeContractCall = function() {
  const rpcUrl = document.getElementById('contract-rpc').value;
  const contractAddress = document.getElementById('contract-address').value;
  const dataHex = document.getElementById('contract-method-hex').value;
  const box = document.getElementById('contract-response-box');

  if (box) box.textContent = 'Executing JSON-RPC eth_call request...';
  ipcRenderer.send('call-contract-method', { rpcUrl, contractAddress, dataHex });
};

ipcRenderer.on('contract-call-result', (event, res) => {
  const box = document.getElementById('contract-response-box');
  if (!box) return;
  if (res.success) {
    box.textContent = `Raw Result: ${res.rawResult}\nDecoded Output: ${res.decoded}`;
  } else {
    box.textContent = `Execution Error: ${res.error}`;
  }
});

// ── Gas Tracker & Calculator ──────────────────────────────────────────
window.refreshGas = function() {
  ipcRenderer.send('get-gas-tracker');
};

ipcRenderer.on('gas-tracker-update', (event, res) => {
  if (!res.success) return;
  const gStd = document.getElementById('gas-evm-std');
  const gFast = document.getElementById('gas-evm-fast');
  const gInstant = document.getElementById('gas-evm-instant');
  const solPri = document.getElementById('gas-sol-priority');

  if (gStd) gStd.textContent = `${res.evm.standard} GWEI`;
  if (gFast) gFast.textContent = res.evm.fast;
  if (gInstant) gInstant.textContent = res.evm.instant;
  if (solPri) solPri.textContent = res.solana.medianPriority;
  if (hdrGas) hdrGas.textContent = `${res.evm.standard} GWEI`;

  calculateFeeCost();
});

window.calculateFeeCost = function() {
  const gweiInput = document.getElementById('calc-gwei');
  const txTypeInput = document.getElementById('calc-tx-type');
  const resultElem = document.getElementById('calc-fee-result');

  if (!gweiInput || !txTypeInput || !resultElem) return;

  const gwei = parseFloat(gweiInput.value) || 20;
  const gasUnits = parseFloat(txTypeInput.value) || 21000;

  const ethCost = (gwei * 1e-9) * gasUnits;
  const usdCost = ethCost * currentEthPriceUSD;

  resultElem.textContent = `Estimated Cost: ~${ethCost.toFixed(6)} ETH ($${usdCost.toFixed(2)} USD)`;
};

// Boot initialization
refreshMetrics();
refreshWallet();
refreshGas();
setInterval(refreshMetrics, 10000);
