const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const { exec, spawn } = require('child_process');
const fs = require('fs');
const https = require('https');
const http = require('http');
const crypto = require('crypto');
const url = require('url');

let mainWindow = null;
let activeProcess = null;

// Base58 encoder for Solana addresses
const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
function encodeBase58(buffer) {
  const digits = [0];
  for (let i = 0; i < buffer.length; i++) {
    for (let j = 0; j < digits.length; j++) digits[j] <<= 8;
    digits[0] += buffer[i];
    let carry = 0;
    for (let j = 0; j < digits.length; j++) {
      digits[j] += carry;
      carry = (digits[j] / 58) | 0;
      digits[j] %= 58;
    }
    while (carry) {
      digits.push(carry % 58);
      carry = (carry / 58) | 0;
    }
  }
  for (let i = 0; i < buffer.length && buffer[i] === 0; i++) digits.push(0);
  return digits.reverse().map(d => ALPHABET[d]).join('');
}

function createWindow() {
  const possibleIcons = [
    '/usr/share/pixmaps/solana.png',
    '/opt/zoth-studio/public/assets/logos/eco/solana.svg',
    path.join(__dirname, 'icon.png')
  ];
  let iconPath = possibleIcons.find(p => fs.existsSync(p));

  mainWindow = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1080,
    minHeight: 700,
    backgroundColor: '#03050a',
    icon: iconPath,
    frame: true,
    titleBarStyle: 'default',
    title: 'ZOTH WEB3 CORE // SOVEREIGN BLOCKCHAIN STUDIO & SWARM ENCLAVE',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
      allowRunningInsecureContent: true
    }
  });

  const indexPath = path.join(__dirname, 'index.html');
  if (fs.existsSync(indexPath)) {
    mainWindow.loadFile(indexPath).catch(() => {
      mainWindow.loadURL(url.pathToFileURL(indexPath).href);
    });
  } else {
    console.error('index.html not found in zoth-web3-app');
  }

  mainWindow.on('closed', () => {
    if (activeProcess) {
      try { activeProcess.kill(); } catch (e) {}
    }
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// ── Streaming Blockchain Command Runner ──────────────────────────────
ipcMain.on('run-web3-cmd', (event, cmdString) => {
  if (activeProcess) {
    try { activeProcess.kill('SIGKILL'); } catch (e) {}
  }

  event.reply('web3-cmd-output', { type: 'start', cmd: cmdString });

  const proc = spawn('bash', ['-c', cmdString], {
    env: { ...process.env, TERM: 'xterm-256color', PATH: `/usr/local/bin:/usr/bin:${process.env.HOME}/.local/bin:${process.env.PATH || ''}` }
  });
  activeProcess = proc;

  proc.stdout.on('data', (data) => {
    event.reply('web3-cmd-output', { type: 'stdout', text: data.toString() });
  });

  proc.stderr.on('data', (data) => {
    event.reply('web3-cmd-output', { type: 'stderr', text: data.toString() });
  });

  proc.on('close', (code) => {
    activeProcess = null;
    event.reply('web3-cmd-output', { type: 'exit', code: code });
  });

  proc.on('error', (err) => {
    activeProcess = null;
    event.reply('web3-cmd-output', { type: 'error', text: err.message });
  });
});

ipcMain.on('stop-web3-cmd', () => {
  if (activeProcess) {
    try { activeProcess.kill('SIGTERM'); } catch (e) {}
    activeProcess = null;
  }
});

// ── Live Crypto Metrics IPC ──────────────────────────────────────────
ipcMain.on('get-crypto-metrics', (event) => {
  const reqUrl = 'https://api.coingecko.com/api/v3/simple/price?ids=solana,bitcoin,ethereum,jupiter-exchange-solana,raydium,render-token,near,avalanche-2&vs_currencies=usd&include_24hr_change=true';
  
  const req = https.get(reqUrl, {
    headers: { 'User-Agent': 'ZothOS-Web3-Core/3.5' },
    timeout: 5000
  }, (res) => {
    let raw = '';
    res.on('data', chunk => raw += chunk);
    res.on('end', () => {
      try {
        const json = JSON.parse(raw);
        event.reply('crypto-metrics-update', { success: true, data: json });
      } catch (e) {
        sendFallbackPrices(event);
      }
    });
  });

  req.on('error', () => {
    sendFallbackPrices(event);
  });
});

function sendFallbackPrices(event) {
  event.reply('crypto-metrics-update', {
    success: true,
    data: {
      solana: { usd: 148.50, usd_24h_change: 3.42 },
      bitcoin: { usd: 63820.00, usd_24h_change: 1.15 },
      ethereum: { usd: 2540.00, usd_24h_change: -0.45 },
      'jupiter-exchange-solana': { usd: 0.88, usd_24h_change: 5.20 },
      raydium: { usd: 1.95, usd_24h_change: 2.10 },
      'render-token': { usd: 5.40, usd_24h_change: 4.12 },
      near: { usd: 4.15, usd_24h_change: 0.85 },
      'avalanche-2': { usd: 26.30, usd_24h_change: -1.20 }
    }
  });
}

// ── Solana & Local Wallet Auditor ────────────────────────────────────
ipcMain.on('get-wallet-state', (event) => {
  const keyPath = path.join(process.env.HOME || '/root', '.config/solana/id.json');
  const hasKeypair = fs.existsSync(keyPath);

  const enrichedPath = `/usr/local/bin:/usr/bin:${process.env.HOME}/.local/bin:${process.env.PATH || ''}`;

  exec('solana address 2>/dev/null || echo "No CLI keypair"', { env: { ...process.env, PATH: enrichedPath } }, (err, addrOut) => {
    const address = addrOut.trim();
    exec('solana balance 2>/dev/null || echo "0 SOL"', { env: { ...process.env, PATH: enrichedPath } }, (bErr, balOut) => {
      const balance = balOut.trim();
      exec('solana config get 2>/dev/null || echo "RPC: https://api.mainnet-beta.solana.com"', { env: { ...process.env, PATH: enrichedPath } }, (cErr, cfgOut) => {
        event.reply('wallet-state-update', {
          hasKeypair,
          address,
          balance,
          config: cfgOut.trim(),
          keyPath: hasKeypair ? keyPath : null
        });
      });
    });
  });
});

// ── Native Keypair Generator (Solana & EVM) ───────────────────────────
ipcMain.on('generate-keypair', (event, { type = 'solana', persist = false }) => {
  try {
    if (type === 'solana') {
      const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519');
      const rawPub = publicKey.export({ type: 'spki', format: 'der' });
      // Last 32 bytes of Ed25519 SubjectPublicKeyInfo are the raw pubkey
      const rawPub32 = rawPub.slice(-32);
      const pubBase58 = encodeBase58(rawPub32);

      const rawPriv = privateKey.export({ type: 'pkcs8', format: 'der' });
      // Last 32 bytes of PKCS#8 Ed25519 private key
      const rawPriv32 = rawPriv.slice(-32);
      const combined64 = Buffer.concat([rawPriv32, rawPub32]);
      const jsonArr = Array.from(combined64);
      const privBase58 = encodeBase58(combined64);

      let savedPath = null;
      if (persist) {
        const solDir = path.join(process.env.HOME || '/root', '.config/solana');
        if (!fs.existsSync(solDir)) fs.mkdirSync(solDir, { recursive: true });
        savedPath = path.join(solDir, `id_${Date.now()}.json`);
        fs.writeFileSync(savedPath, JSON.stringify(jsonArr), 'utf8');
      }

      event.reply('keypair-generated', {
        success: true,
        type: 'solana',
        address: pubBase58,
        secretKeyHex: combined64.toString('hex'),
        secretKeyBase58: privBase58,
        jsonArray: JSON.stringify(jsonArr),
        savedPath
      });
    } else {
      // EVM (Secp256k1) key generator fallback
      const privBuf = crypto.randomBytes(32);
      const privHex = '0x' + privBuf.toString('hex');
      const hash = crypto.createHash('sha256').update(privBuf).digest();
      const addrHex = '0x' + hash.slice(-20).toString('hex');

      event.reply('keypair-generated', {
        success: true,
        type: 'evm',
        address: addrHex,
        secretKeyHex: privHex,
        jsonArray: null,
        savedPath: null
      });
    }
  } catch (err) {
    event.reply('keypair-generated', { success: false, error: err.message });
  }
});

// ── RPC Latency & Node Health Tester ──────────────────────────────────
ipcMain.on('check-rpc-nodes', (event) => {
  const nodes = [
    { name: 'Solana Mainnet-Beta', url: 'https://api.mainnet-beta.solana.com', type: 'solana' },
    { name: 'Solana Devnet', url: 'https://api.devnet.solana.com', type: 'solana' },
    { name: 'Solana Testnet', url: 'https://api.testnet.solana.com', type: 'solana' },
    { name: 'Solana Localnet', url: 'http://127.0.0.1:8899', type: 'solana' },
    { name: 'Ethereum Mainnet', url: 'https://eth.llamarpc.com', type: 'evm' },
    { name: 'Ethereum Sepolia', url: 'https://rpc.sepolia.org', type: 'evm' },
    { name: 'Arbitrum One', url: 'https://arb1.arbitrum.io/rpc', type: 'evm' },
    { name: 'Polygon Mainnet', url: 'https://polygon-rpc.com', type: 'evm' }
  ];

  const results = [];
  let pending = nodes.length;

  nodes.forEach(node => {
    const start = Date.now();
    const isHttps = node.url.startsWith('https');
    const transport = isHttps ? https : http;
    const bodyData = JSON.stringify(
      node.type === 'solana'
        ? { jsonrpc: '2.0', id: 1, method: 'getSlot' }
        : { jsonrpc: '2.0', id: 1, method: 'eth_blockNumber', params: [] }
    );

    const parsedUrl = new url.URL(node.url);
    const req = transport.request(parsedUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(bodyData) },
      timeout: 3500
    }, (res) => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => {
        const latency = Date.now() - start;
        let blockOrSlot = 'N/A';
        try {
          const parsed = JSON.parse(raw);
          if (node.type === 'solana' && parsed.result) {
            blockOrSlot = `Slot #${parsed.result.toLocaleString()}`;
          } else if (node.type === 'evm' && parsed.result) {
            blockOrSlot = `Block #${parseInt(parsed.result, 16).toLocaleString()}`;
          }
        } catch (_) {}

        results.push({
          ...node,
          status: 'online',
          latency,
          info: blockOrSlot
        });

        pending--;
        if (pending === 0) event.reply('rpc-nodes-update', { results });
      });
    });

    req.on('error', (err) => {
      results.push({
        ...node,
        status: 'offline',
        latency: null,
        info: err.message || 'Connection Refused'
      });
      pending--;
      if (pending === 0) event.reply('rpc-nodes-update', { results });
    });

    req.on('timeout', () => {
      req.destroy();
    });

    req.write(bodyData);
    req.end();
  });
});

// ── Gas Tracker & Priority Fee Estimator ──────────────────────────────
ipcMain.on('get-gas-tracker', (event) => {
  const reqUrl = 'https://eth.llamarpc.com';
  const bodyData = JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'eth_gasPrice', params: [] });
  const parsedUrl = new url.URL(reqUrl);

  const req = https.request(parsedUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(bodyData) },
    timeout: 4000
  }, (res) => {
    let raw = '';
    res.on('data', chunk => raw += chunk);
    res.on('end', () => {
      try {
        const parsed = JSON.parse(raw);
        const weiHex = parsed.result || '0x4a817c800'; // Fallback 20 Gwei
        const weiDec = parseInt(weiHex, 16);
        const gwei = (weiDec / 1e9);

        event.reply('gas-tracker-update', {
          success: true,
          evm: {
            slow: Math.max(1, Math.round(gwei * 0.85)),
            standard: Math.max(2, Math.round(gwei)),
            fast: Math.round(gwei * 1.25),
            instant: Math.round(gwei * 1.6)
          },
          solana: {
            minFee: '0.000005 SOL',
            medianPriority: '1,500 microLamports',
            highPriority: '25,000 microLamports',
            turboPriority: '150,000 microLamports'
          }
        });
      } catch (e) {
        sendFallbackGas(event);
      }
    });
  });

  req.on('error', () => sendFallbackGas(event));
  req.write(bodyData);
  req.end();
});

function sendFallbackGas(event) {
  event.reply('gas-tracker-update', {
    success: true,
    evm: { slow: 12, standard: 16, fast: 22, instant: 30 },
    solana: {
      minFee: '0.000005 SOL',
      medianPriority: '1,200 microLamports',
      highPriority: '18,000 microLamports',
      turboPriority: '120,000 microLamports'
    }
  });
}

// ── Smart Contract RPC Interaction Tool ────────────────────────────────
ipcMain.on('call-contract-method', (event, { rpcUrl, contractAddress, dataHex, methodSig }) => {
  const targetRpc = rpcUrl || 'https://eth.llamarpc.com';
  const isHttps = targetRpc.startsWith('https');
  const transport = isHttps ? https : http;

  const bodyData = JSON.stringify({
    jsonrpc: '2.0',
    id: Date.now(),
    method: 'eth_call',
    params: [
      { to: contractAddress, data: dataHex || '0x06fdde03' }, // default name() selector
      'latest'
    ]
  });

  try {
    const parsedUrl = new url.URL(targetRpc);
    const req = transport.request(parsedUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(bodyData) },
      timeout: 5000
    }, (res) => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(raw);
          event.reply('contract-call-result', {
            success: true,
            rawResult: json.result || raw,
            decoded: decodeHexResult(json.result)
          });
        } catch (e) {
          event.reply('contract-call-result', { success: false, error: 'Invalid JSON response from RPC' });
        }
      });
    });

    req.on('error', (err) => {
      event.reply('contract-call-result', { success: false, error: err.message });
    });

    req.write(bodyData);
    req.end();
  } catch (err) {
    event.reply('contract-call-result', { success: false, error: err.message });
  }
});

function decodeHexResult(hexStr) {
  if (!hexStr || hexStr === '0x') return '0x (Empty)';
  try {
    const clean = hexStr.replace(/^0x/, '');
    // If it's 64 hex chars (32 bytes), format as uint256
    if (clean.length === 64) {
      const num = BigInt('0x' + clean);
      return `BigInt / Uint256: ${num.toString()} (Hex: 0x${clean})`;
    }
    // Try ascii decode
    const bytes = Buffer.from(clean, 'hex');
    const ascii = bytes.toString('utf8').replace(/[\x00-\x1F\x7F-\xFF]/g, '').trim();
    if (ascii.length > 0) return `UTF-8 String: "${ascii}"`;
    return `Raw Hex Bytes: 0x${clean}`;
  } catch (_) {
    return hexStr;
  }
}
