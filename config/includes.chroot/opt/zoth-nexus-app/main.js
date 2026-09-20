const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const { exec, spawn } = require('child_process');
const fs = require('fs');

let mainWindow = null;

const TOOLS_DATABASE = [
  // Flagships
  { id: 'zoth-studio', name: 'Zoth Studio Pro', domain: 'Flagship', desc: 'Sovereign 3D WebGL Alchemical Cockpit & Workspace', cmd: 'zoth-studio', pkg: 'zothos-core', type: 'system' },
  { id: 'hexstrike', name: 'HexStrike AI Terminal', domain: 'Offensive Sec', desc: 'Autonomous Red Teaming & Offensive PenTest Matrix', cmd: 'hexstrike', pkg: 'hexstrike-ai', type: 'system' },
  { id: 'zoth-agent', name: 'Zoth Agent OS', domain: 'AI & Agents', desc: '21-Agent Swarm Orchestrator & Multi-Ring MCP Hub', cmd: 'zoth-agent-hud', pkg: 'zothos-ai', type: 'system' },
  { id: 'zoth-ghost', name: 'NullAI Ghostmode', domain: 'Privacy', desc: '100% Transparent Tor Routing & Anti-Forensics Mode', cmd: 'zoth-ghost-gui', pkg: 'tor', type: 'apt' },
  { id: 'zoth-mode', name: 'Reality Switcher', domain: 'Flagship', desc: 'Transmute Desktop Environment (Matrix / Ghost / Gold / Win11)', cmd: 'zoth-mode', pkg: 'zothos-core', type: 'system' },
  
  // AI & Frontier Workstations
  { id: 'ollama', name: 'Ollama LLM Daemon', domain: 'AI & Agents', desc: 'Local LLM Inference Engine for Llama 3.2, DeepSeek & Mistral', cmd: 'ollama', pkg: 'ollama', type: 'system' },
  { id: 'hermes', name: 'Hermes Agent CLI', domain: 'AI & Agents', desc: 'Autonomous Full-Stack AI Engineer & Coding Swarm', cmd: 'hermes', pkg: 'hermes-agent', type: 'pip' },
  { id: 'claude-code', name: 'Claude Code', domain: 'AI & Agents', desc: 'Anthropic Autonomous Agentic Coding CLI', cmd: 'claude', pkg: '@anthropic-ai/claude-code', type: 'npm' },
  { id: 'opencode', name: 'OpenCode AI', domain: 'AI & Agents', desc: 'Open Source Terminal AI Pair Programmer', cmd: 'opencode', pkg: 'opencode-ai', type: 'npm' },
  { id: 'maya', name: 'Maya Linux Studio', domain: 'AI & Agents', desc: 'Creator Playbooks & AI Automation Engine', cmd: 'maya', pkg: 'maya-linux', type: 'system' },
  { id: 'grok', name: 'Grok xAI CLI', domain: 'AI & Agents', desc: 'Direct xAI Grok Frontier Intelligence CLI', cmd: 'grok', pkg: 'xai-grok', type: 'pip' },
  
  // Offensive Security & Red Team
  { id: 'burpsuite', name: 'Burp Suite Community', domain: 'Offensive Sec', desc: 'Industry-Standard Web Application Security Scanner & Proxy', cmd: 'burpsuite', pkg: 'burpsuite', type: 'apt' },
  { id: 'caido', name: 'Caido Web Security', domain: 'Offensive Sec', desc: 'Lightweight Rust-based Web Security Intercepting Proxy', cmd: 'caido', pkg: 'caido', type: 'system' },
  { id: 'nmap', name: 'Nmap Network Scanner', domain: 'Offensive Sec', desc: 'Network Exploration Tool and Security / Port Scanner', cmd: 'nmap', pkg: 'nmap', type: 'apt' },
  { id: 'sqlmap', name: 'SQLmap Automated SQLi', domain: 'Offensive Sec', desc: 'Automatic SQL Injection & Database Takeover Tool', cmd: 'sqlmap', pkg: 'sqlmap', type: 'apt' },
  { id: 'nikto', name: 'Nikto Web Scanner', domain: 'Offensive Sec', desc: 'Comprehensive Web Server Vulnerability Scanner', cmd: 'nikto', pkg: 'nikto', type: 'apt' },
  { id: 'gobuster', name: 'Gobuster URI Fuzzer', domain: 'Offensive Sec', desc: 'High-Speed Directory, DNS, and VHost Buster', cmd: 'gobuster', pkg: 'gobuster', type: 'apt' },
  { id: 'metasploit', name: 'Metasploit Framework', domain: 'Offensive Sec', desc: 'World Leading Penetration Testing & Exploit Framework', cmd: 'msfconsole', pkg: 'metasploit-framework', type: 'apt' },
  { id: 'hydra', name: 'THC-Hydra', domain: 'Offensive Sec', desc: 'Very Fast Network Logon Password Cracker', cmd: 'hydra', pkg: 'hydra', type: 'apt' },
  { id: 'aircrack', name: 'Aircrack-ng Suite', domain: 'Offensive Sec', desc: 'Complete 802.11 Wireless Security Assessment Suite', cmd: 'aircrack-ng', pkg: 'aircrack-ng', type: 'apt' },
  { id: 'john', name: 'John the Ripper', domain: 'Offensive Sec', desc: 'Fast Password & Hash Cracking Engine', cmd: 'john', pkg: 'john', type: 'apt' },

  // Binary & Reverse Engineering
  { id: 'ghidra', name: 'NSA Ghidra Suite', domain: 'Binary & RE', desc: 'Software Reverse Engineering & Decompiler Framework', cmd: 'ghidra', pkg: 'ghidra', type: 'apt' },
  { id: 'radare2', name: 'Radare2 / Cutter', domain: 'Binary & RE', desc: 'UNIX-like Reverse Engineering Framework and Disassembler', cmd: 'r2', pkg: 'radare2', type: 'apt' },
  { id: 'gdb', name: 'GNU Debugger (GDB-PEDA)', domain: 'Binary & RE', desc: 'Binary Debugger with Exploit Development Assistance', cmd: 'gdb', pkg: 'gdb', type: 'apt' },

  // OSINT & Recon
  { id: 'wireshark', name: 'Wireshark Analyzer', domain: 'OSINT & Recon', desc: 'Network Traffic & Packet Capture Deep Inspection', cmd: 'wireshark', pkg: 'wireshark', type: 'apt' },
  { id: 'sherlock', name: 'Sherlock OSINT', domain: 'OSINT & Recon', desc: 'Hunt Down Social Media Accounts Across 400+ Networks', cmd: 'sherlock', pkg: 'sherlock', type: 'pip' },
  { id: 'theharvester', name: 'theHarvester', domain: 'OSINT & Recon', desc: 'E-mail, Subdomain, and Employee Name Harvester', cmd: 'theharvester', pkg: 'theharvester', type: 'apt' },
  { id: 'sublist3r', name: 'Sublist3r', domain: 'OSINT & Recon', desc: 'Fast Subdomains Enumeration Tool for Penetration Testers', cmd: 'sublist3r', pkg: 'sublist3r', type: 'apt' },

  // Productivity & Privacy
  { id: 'obsidian', name: 'Obsidian PKM', domain: 'Productivity', desc: 'Second Brain Knowledge Base & Markdown Vault', cmd: 'obsidian', pkg: 'obsidian', type: 'system' },
  { id: 'bitwarden', name: 'Bitwarden Vault', domain: 'Privacy', desc: 'End-to-End Encrypted Password & Secrets Manager', cmd: 'bitwarden', pkg: 'bitwarden', type: 'system' },
  { id: 'blender', name: 'Blender 3D Suite', domain: 'Productivity', desc: 'Open Source 3D Creation, Modeling and Animation Pipeline', cmd: 'blender', pkg: 'blender', type: 'apt' }
];

function createWindow() {
  const iconPath = fs.existsSync('/opt/zoth-studio/public/assets/brand/zoth-logo.png')
    ? '/opt/zoth-studio/public/assets/brand/zoth-logo.png'
    : '/usr/share/icons/hicolor/512x512/apps/zoth-tool-nexus.png';

  mainWindow = new BrowserWindow({
    width: 1380,
    height: 880,
    minWidth: 1000,
    minHeight: 650,
    backgroundColor: '#070a0f',
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
    exec(`which ${t.cmd}`, (err) => {
      results.push({
        ...t,
        installed: !err
      });
      checked++;
      if (checked === total) {
        event.reply('tools-list', results);
      }
    });
  });
});

// ── Launch Tool IPC ───────────────────────────────────────────────────
ipcMain.on('launch-tool', (event, cmd) => {
  const isGui = ['zoth-studio', 'zoth-agent-hud', 'zoth-ghost-gui', 'zoth-mode', 'burpsuite', 'caido', 'wireshark', 'ghidra', 'obsidian', 'bitwarden', 'blender'].includes(cmd);
  if (isGui) {
    exec(`nohup ${cmd} >/dev/null 2>&1 &`);
  } else {
    exec(`xfce4-terminal -T '${cmd.toUpperCase()}' -e '${cmd}'`);
  }
});

// ── Install Tool IPC ──────────────────────────────────────────────────
ipcMain.on('install-tool', (event, tool) => {
  let installCmd = '';
  if (tool.type === 'apt') {
    installCmd = `sudo apt-get update && sudo apt-get install -y ${tool.pkg}`;
  } else if (tool.type === 'pip') {
    installCmd = `pip3 install --break-system-packages ${tool.pkg}`;
  } else if (tool.type === 'npm') {
    installCmd = `sudo npm install -g ${tool.pkg}`;
  } else {
    installCmd = `echo "[*] System package ${tool.pkg} is native to ZothOS."`;
  }

  const proc = spawn('bash', ['-c', installCmd]);
  
  proc.stdout.on('data', data => event.reply('install-log', { text: data.toString() }));
  proc.stderr.on('data', data => event.reply('install-log', { text: data.toString() }));
  proc.on('close', code => {
    event.reply('install-complete', { toolId: tool.id, success: code === 0 });
  });
});
