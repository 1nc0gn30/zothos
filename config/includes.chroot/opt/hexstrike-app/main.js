const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const { spawn, exec } = require('child_process');
const fs = require('fs');
const http = require('http');

let mainWindow = null;
let activeProcess = null;

function createWindow() {
  const iconPath = fs.existsSync('/opt/zoth-studio/public/assets/mascot/hexstrike_logo.png')
    ? '/opt/zoth-studio/public/assets/mascot/hexstrike_logo.png'
    : '/usr/share/icons/hicolor/512x512/apps/hexstrike.png';

  mainWindow = new BrowserWindow({
    width: 1380,
    height: 880,
    minWidth: 1000,
    minHeight: 650,
    backgroundColor: '#070a0f',
    icon: fs.existsSync(iconPath) ? iconPath : undefined,
    frame: true,
    titleBarStyle: 'default',
    title: 'HEXSTRIKE AI // OFFENSIVE CYBER WARFARE COCKPIT',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  mainWindow.on('closed', () => {
    if (activeProcess) {
      try { activeProcess.kill(); } catch (e) {}
    }
    mainWindow = null;
  });
}

// Auto start hexstrike backend daemon in background
function ensureHexStrikeDaemon() {
  exec('pgrep -f hexstrike_server || nohup /usr/local/bin/hexstrike_server >/dev/null 2>&1 &');
}

app.whenReady().then(() => {
  ensureHexStrikeDaemon();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// ── Streaming Command Runner ──────────────────────────────────────────
ipcMain.on('run-cmd', (event, cmdString) => {
  if (activeProcess) {
    try { activeProcess.kill('SIGKILL'); } catch (e) {}
  }

  event.reply('cmd-output', { type: 'start', cmd: cmdString });

  const proc = spawn('bash', ['-c', cmdString], {
    env: { ...process.env, TERM: 'xterm-256color', COLUMNS: '120' }
  });
  activeProcess = proc;

  proc.stdout.on('data', (data) => {
    event.reply('cmd-output', { type: 'stdout', text: data.toString() });
  });

  proc.stderr.on('data', (data) => {
    event.reply('cmd-output', { type: 'stderr', text: data.toString() });
  });

  proc.on('close', (code) => {
    activeProcess = null;
    event.reply('cmd-output', { type: 'exit', code: code });
  });

  proc.on('error', (err) => {
    activeProcess = null;
    event.reply('cmd-output', { type: 'error', text: err.message });
  });
});

ipcMain.on('stop-cmd', () => {
  if (activeProcess) {
    try { activeProcess.kill('SIGTERM'); } catch (e) {}
    activeProcess = null;
  }
});

// ── AI Security Analysis IPC ─────────────────────────────────────────
ipcMain.on('query-ai', (event, { prompt, context }) => {
  const reqBody = JSON.stringify({
    model: 'llama3.2:latest',
    prompt: `You are HexStrike AI, an elite cybersecurity and penetration testing copilot on ZothOS.\nContext / Scan Data:\n${context || 'No scan context'}\n\nTask: ${prompt}\n\nProvide actionable, concise tactical analysis, exploit vectors, payload suggestions, and remediation steps. Format in clean markdown with code blocks.`,
    stream: false
  });

  const req = http.request({
    hostname: '127.0.0.1',
    port: 11434,
    path: '/api/generate',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(reqBody)
    },
    timeout: 10000
  }, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        event.reply('ai-response', { success: true, response: json.response });
      } catch (e) {
        event.reply('ai-response', { success: false, error: 'Failed to parse AI response' });
      }
    });
  });

  req.on('error', (err) => {
    // Fallback AI heuristic response
    event.reply('ai-response', {
      success: true,
      response: `[HEXSTRIKE HEURISTIC ENGINE // OFFLINE MODE]\n\nTarget Analysis for: ${prompt}\n\nRecommended Vectors:\n- Run service version audit: \`nmap -sV -sC -Pn -T4 <target>\`\n- Check common web misconfigurations & directory exposure with Gobuster\n- Inspect SSL/TLS ciphers & header posture\n- Test parameter injection surfaces with SQLmap / Caido proxy`
    });
  });

  req.write(reqBody);
  req.end();
});

// ── Launch External Tools ─────────────────────────────────────────────
ipcMain.on('launch-external', (event, tool) => {
  const tools = {
    burp: 'burpsuite',
    caido: 'caido',
    wireshark: 'wireshark',
    ghidra: 'ghidra',
    msfconsole: 'konsole -e msfconsole',
    nmap: 'konsole -e "nmap -h"',
    john: 'konsole -e "john --help"',
    aircrack: 'konsole -e "aircrack-ng --help"'
  };
  const cmd = tools[tool] || tool;
  exec(`nohup ${cmd} >/dev/null 2>&1 &`);
});
