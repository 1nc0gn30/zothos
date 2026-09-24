const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const { exec, spawn } = require('child_process');
const fs = require('fs');

let mainWindow = null;

const extraPaths = [
  path.join(process.env.HOME || '/home/neo', '.cargo/bin'),
  path.join(process.env.HOME || '/home/neo', '.foundry/bin'),
  path.join(process.env.HOME || '/home/neo', 'go/bin'),
  '/usr/local/go/bin',
  path.join(process.env.HOME || '/home/neo', '.local/bin'),
  '/opt/zothos-ai-env/bin',
  '/usr/local/bin',
  '/usr/bin',
  '/bin',
  '/usr/sbin',
  '/sbin'
];
const fullPath = Array.from(new Set([...extraPaths, ...(process.env.PATH || '').split(':')])).join(':');

const TOOLS_DATABASE = [
  // Flagships & Hubs
  { id: 'zoth-studio', name: 'Zoth Studio Pro', domain: 'Flagship', desc: 'Sovereign 3D WebGL Alchemical Cockpit & Workspace', cmd: 'zoth-studio', pkg: 'zothos-core', type: 'system' },
  { id: 'hexstrike', name: 'NullAI HexStrike AI Terminal', domain: 'Offensive Sec', desc: 'Autonomous Red Teaming & Offensive PenTest Matrix', cmd: 'hexstrike-ai', pkg: 'hexstrike-ai', type: 'system' },
  { id: 'zoth-cockpit', name: 'ZothOS Cockpit', domain: 'Flagship', desc: 'Autonomous Swarm Command Deck & Real-Time Telemetry', cmd: 'zoth-cockpit', pkg: 'zothos-core', type: 'system' },
  { id: 'zoth-docs', name: 'ZothOS Codex Docs', domain: 'Flagship', desc: 'Interactive Documentation Codex & Sovereign Manifesto', cmd: 'zoth-docs', pkg: 'zothos-core', type: 'system' },
  { id: 'zoth-feedback', name: 'Zoth Feedback Dispatcher', domain: 'Flagship', desc: 'Anonymous Sovereign Feedback Dispatcher to Lead Architect', cmd: 'zoth-feedback', pkg: 'zothos-core', type: 'system' },
  { id: 'zoth-soundtrack', name: 'Zoth Sound Matrix', domain: 'Flagship', desc: 'Hermetic Focus & Classical Soundtrack Player', cmd: 'zoth-soundtrack', pkg: 'zothos-core', type: 'system' },
  { id: 'zoth-mode', name: 'Reality Switcher', domain: 'Flagship', desc: 'Transmute Desktop Environment (Matrix / Ghost / Gold / Stealth)', cmd: 'zoth-mode', pkg: 'zothos-core', type: 'system' },
  
  // AI & Frontier Workstations
  { id: 'ollama', name: 'Ollama LLM Daemon', domain: 'AI & Agents', desc: 'Local LLM Inference Engine for Llama 3.2, DeepSeek & Mistral', cmd: 'ollama', pkg: 'ollama', type: 'system' },
  { id: 'hermes', name: 'Hermes Agent CLI', domain: 'AI & Agents', desc: 'Autonomous Full-Stack AI Engineer & Coding Swarm', cmd: 'hermes', pkg: 'hermes-agent', type: 'pip' },
  { id: 'claude-code', name: 'Claude Code', domain: 'AI & Agents', desc: 'Anthropic Autonomous Agentic Coding CLI', cmd: 'claude', pkg: '@anthropic-ai/claude-code', type: 'npm' },
  { id: 'codex', name: 'OpenAI Codex CLI', domain: 'AI & Agents', desc: 'OpenAI Autonomous Codex Coding Harness', cmd: 'codex', pkg: '@openai/codex', type: 'npm' },
  { id: 'opencode', name: 'OpenCode AI', domain: 'AI & Agents', desc: 'Open Source Terminal AI Pair Programmer', cmd: 'opencode', pkg: 'opencode-ai', type: 'npm' },
  { id: 'maya', name: 'Maya Linux Studio', domain: 'AI & Agents', desc: 'Creator Playbooks & AI Automation Engine', cmd: 'maya', pkg: 'maya-linux', type: 'system' },
  { id: 'grok', name: 'Grok xAI CLI', domain: 'AI & Agents', desc: 'Direct xAI Grok Frontier Intelligence CLI', cmd: 'grok', pkg: 'xai-grok', type: 'pip' },
  { id: 'fastmcp', name: 'FastMCP SDK', domain: 'AI & Agents', desc: 'High-performance Python Model Context Protocol Tooling', cmd: 'fastmcp', pkg: 'fastmcp', type: 'pip' },

  // Web3 & Core Dev
  { id: 'foundry', name: 'Foundry Suite', domain: 'Web3 & Dev', desc: 'Ethereum Development Toolkit (forge, cast, anvil, chisel)', cmd: 'forge', pkg: 'foundryup', type: 'system' },
  { id: 'solana', name: 'Solana CLI Suite', domain: 'Web3 & Dev', desc: 'Solana Blockchain Validator & Program Interaction CLI', cmd: 'solana', pkg: 'solana', type: 'system' },
  { id: 'docker', name: 'Container Engine (Docker/Podman)', domain: 'Web3 & Dev', desc: 'Container Isolation & OCI Runtime (Podman/Docker)', cmd: 'docker', pkg: 'cdocker', type: 'system' },
  { id: 'rustc', name: 'Rust Compiler (rustc & cargo)', domain: 'Web3 & Dev', desc: 'Memory-safe Systems Programming Compiler', cmd: 'rustc', pkg: 'rustc', type: 'apt' },
  { id: 'go', name: 'Golang Toolchain', domain: 'Web3 & Dev', desc: 'High-Performance Concurrent Language Runtime', cmd: 'go', pkg: 'golang', type: 'apt' },
  { id: 'clang', name: 'Clang / LLVM Compiler', domain: 'Web3 & Dev', desc: 'C/C++ Compiler Toolchain and Optimizing Backend', cmd: 'clang', pkg: 'clang', type: 'apt' },
  { id: 'sqlite3', name: 'SQLite3 Database Engine', domain: 'Web3 & Dev', desc: 'Serverless Self-Contained SQL Database Engine', cmd: 'sqlite3', pkg: 'sqlite3', type: 'apt' },
  
  // Encrypted Comms & Privacy
  { id: 'signal', name: 'Signal Secure Messenger', domain: 'Privacy', desc: 'Private End-to-End Encrypted Comms Application', cmd: 'signal-desktop', pkg: 'signal-desktop', type: 'system' },
  { id: 'simplex', name: 'SimpleX Chat', domain: 'Privacy', desc: 'Decentralized Private Chat Without User IDs', cmd: 'simplex-desktop', pkg: 'simplex-desktop', type: 'system' },
  { id: 'element', name: 'Matrix Element Chat', domain: 'Privacy', desc: 'Federated Secure Matrix Network Messenger', cmd: 'element-desktop', pkg: 'element-desktop', type: 'system' },
  { id: 'tor-browser', name: 'Tor Browser', domain: 'Privacy', desc: 'Anonymous Onion Routing Privacy Browser', cmd: 'tor-browser', pkg: 'torbrowser-launcher', type: 'apt' },
  { id: 'zoth-ghost', name: 'NullAI Ghostmode', domain: 'Privacy', desc: '100% Transparent Tor Routing & Anti-Forensics Mode', cmd: 'zoth-ghost', pkg: 'tor', type: 'apt' },

  // Offensive Security & Red Team
  { id: 'burpsuite', name: 'Burp Suite Community', domain: 'Offensive Sec', desc: 'Web Application Security Scanner & Intercepting Proxy', cmd: 'burpsuite', pkg: 'burpsuite', type: 'apt' },
  { id: 'caido', name: 'Caido Web Security', domain: 'Offensive Sec', desc: 'Lightweight Rust-based Web Security Intercepting Proxy', cmd: 'caido', pkg: 'caido', type: 'system' },
  { id: 'nmap', name: 'Nmap Network Scanner', domain: 'Offensive Sec', desc: 'Network Exploration Tool and Security / Port Scanner', cmd: 'nmap', pkg: 'nmap', type: 'apt' },
  { id: 'sqlmap', name: 'SQLmap Automated SQLi', domain: 'Offensive Sec', desc: 'Automatic SQL Injection & Database Takeover Tool', cmd: 'sqlmap', pkg: 'sqlmap', type: 'apt' },
  { id: 'nikto', name: 'Nikto Web Scanner', domain: 'Offensive Sec', desc: 'Comprehensive Web Server Vulnerability Scanner', cmd: 'nikto', pkg: 'nikto', type: 'apt' },
  { id: 'gobuster', name: 'Gobuster URI Fuzzer', domain: 'Offensive Sec', desc: 'High-Speed Directory, DNS, and VHost Buster', cmd: 'gobuster', pkg: 'gobuster', type: 'apt' },
  { id: 'metasploit', name: 'Metasploit Framework', domain: 'Offensive Sec', desc: 'World Leading Penetration Testing & Exploit Framework', cmd: 'msfconsole', pkg: 'metasploit-framework', type: 'apt' },
  { id: 'hydra', name: 'THC-Hydra', domain: 'Offensive Sec', desc: 'Fast Network Logon Password Cracker', cmd: 'hydra', pkg: 'hydra', type: 'apt' },
  { id: 'aircrack', name: 'Aircrack-ng Suite', domain: 'Offensive Sec', desc: 'Complete 802.11 Wireless Security Assessment Suite', cmd: 'aircrack-ng', pkg: 'aircrack-ng', type: 'apt' },
  { id: 'john', name: 'John the Ripper', domain: 'Offensive Sec', desc: 'Fast Password & Hash Cracking Engine', cmd: 'john', pkg: 'john', type: 'apt' },
  { id: 'wireshark', name: 'Wireshark Analyzer', domain: 'Offensive Sec', desc: 'Network Traffic & Packet Capture Deep Inspection', cmd: 'wireshark', pkg: 'wireshark', type: 'apt' }
];

function createWindow() {
  const iconPath = fs.existsSync('/usr/share/pixmaps/zoth-tool-nexus.png')
    ? '/usr/share/pixmaps/zoth-tool-nexus.png'
    : '/opt/zoth-studio/public/assets/brand/zoth-logo.png';

  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    backgroundColor: '#06090e',
    icon: fs.existsSync(iconPath) ? iconPath : undefined,
    frame: true,
    titleBarStyle: 'default',
    title: 'ZOTH TOOL NEXUS // 175+ CYBER ARSENAL & APP STORE',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  mainWindow.on('closed', () => {
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

// ── Check Tools Status IPC ────────────────────────────────────────────
ipcMain.on('get-tools', (event) => {
  let checked = 0;
  const total = TOOLS_DATABASE.length;
  const results = [];

  TOOLS_DATABASE.forEach(t => {
    let isInstalled = false;
    const home = process.env.HOME || '/home/neo';

    if (t.id === 'foundry') {
      isInstalled = fs.existsSync('/usr/local/bin/forge') || fs.existsSync('/usr/local/bin/foundryup') || fs.existsSync(path.join(home, '.foundry/bin/forge')) || fs.existsSync(path.join(home, '.foundry/bin/foundryup'));
    } else if (t.id === 'docker') {
      isInstalled = fs.existsSync('/usr/local/bin/docker') || fs.existsSync('/usr/bin/podman') || fs.existsSync('/usr/bin/docker');
    } else if (t.id === 'rustc') {
      isInstalled = fs.existsSync('/usr/bin/rustc') || fs.existsSync(path.join(home, '.cargo/bin/rustc')) || fs.existsSync('/usr/local/bin/rustc');
    } else if (t.id === 'go') {
      isInstalled = fs.existsSync('/usr/bin/go') || fs.existsSync('/usr/local/go/bin/go') || fs.existsSync(path.join(home, 'go/bin/go')) || fs.existsSync('/usr/local/bin/go');
    } else if (t.id === 'clang') {
      isInstalled = fs.existsSync('/usr/bin/clang') || fs.existsSync('/usr/bin/clang-19') || fs.existsSync('/usr/bin/clang-16');
    } else if (t.id === 'sqlite3') {
      isInstalled = fs.existsSync('/usr/bin/sqlite3') || fs.existsSync('/usr/bin/sqlite');
    } else if (t.id === 'solana') {
      isInstalled = fs.existsSync('/usr/local/bin/solana') || fs.existsSync(path.join(home, '.local/share/solana/install/active_release/bin/solana'));
    } else if (t.id === 'signal') {
      isInstalled = fs.existsSync('/opt/Signal/signal-desktop') || fs.existsSync('/usr/local/bin/signal-desktop');
    } else if (t.id === 'simplex') {
      isInstalled = fs.existsSync('/usr/local/bin/simplex-chat') || fs.existsSync('/usr/local/bin/simplex-desktop');
    } else if (t.id === 'element') {
      isInstalled = fs.existsSync('/opt/Element/element-desktop') || fs.existsSync('/usr/local/bin/element-desktop');
    }

    if (isInstalled) {
      results.push({ ...t, installed: true });
      checked++;
      if (checked === total) event.reply('tools-list', results);
    } else {
      const firstWord = t.cmd.split(' ')[0];
      exec(`which ${firstWord}`, { env: { ...process.env, PATH: fullPath } }, (err) => {
        results.push({
          ...t,
          installed: !err
        });
        checked++;
        if (checked === total) {
          event.reply('tools-list', results);
        }
      });
    }
  });
});

// ── Launch Tool IPC ───────────────────────────────────────────────────
ipcMain.on('launch-tool', (event, cmd) => {
  const isGui = ['zoth-studio', 'zoth-agent-hud', 'zoth-ghost-gui', 'zoth-mode', 'zoth-mcp', 'burpsuite', 'caido', 'wireshark', 'ghidra', 'obsidian', 'bitwarden', 'blender', 'zoth-sentinel-hud', 'zoth-docs', 'zoth-feedback', 'zoth-soundtrack', 'signal-desktop', 'simplex-desktop', 'element-desktop', 'tor-browser'].includes(cmd);
  if (isGui) {
    exec(`nohup ${cmd} >/dev/null 2>&1 &`, { env: { ...process.env, PATH: fullPath } });
  } else {
    exec(`konsole --title '${cmd.toUpperCase()}' -e bash -c '${cmd}; exec bash'`, { env: { ...process.env, PATH: fullPath } });
  }
});

// ── Install Tool IPC ──────────────────────────────────────────────────
ipcMain.on('install-tool', (event, tool) => {
  let installCmd = '';
  if (tool.id === 'foundry') {
    installCmd = `curl -L https://foundry.paradigm.xyz | bash && ~/.foundry/bin/foundryup`;
  } else if (tool.pkg === 'cdocker') {
    installCmd = `sudo apt-get update && sudo apt-get install -y podman docker.io || true`;
  } else if (tool.type === 'apt') {
    installCmd = `sudo apt-get update && sudo apt-get install -y ${tool.pkg}`;
  } else if (tool.type === 'pip') {
    installCmd = `pip3 install --break-system-packages ${tool.pkg}`;
  } else if (tool.type === 'npm') {
    installCmd = `sudo npm install -g ${tool.pkg}`;
  } else {
    installCmd = `zoth-pkg install ${tool.pkg}`;
  }

  const proc = spawn('bash', ['-c', installCmd], { env: { ...process.env, PATH: fullPath } });
  
  proc.stdout.on('data', data => event.reply('install-log', { text: data.toString() }));
  proc.stderr.on('data', data => event.reply('install-log', { text: data.toString() }));
  proc.on('close', code => {
    event.reply('install-complete', { toolId: tool.id, success: code === 0 });
  });
});
