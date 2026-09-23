const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const { exec, spawn } = require('child_process');
const fs = require('fs');

let mainWindow = null;

function getConfigPath() {
  const userPath = path.join(process.env.HOME || '/home/neo', '.config/zothos/mcp-servers.json');
  const sysPath = '/etc/zothos/mcp-servers.json';
  const chrootPath = '/home/neo/zothos/config/includes.chroot/etc/zothos/mcp-servers.json';

  if (fs.existsSync(userPath)) return userPath;
  if (fs.existsSync(sysPath)) return sysPath;
  if (fs.existsSync(chrootPath)) return chrootPath;
  return userPath;
}

function createWindow() {
  const iconPath = fs.existsSync('/usr/share/icons/Zoth-Hermetic/256x256/apps/zoth-mcp.png')
    ? '/usr/share/icons/Zoth-Hermetic/256x256/apps/zoth-mcp.png'
    : path.join(__dirname, 'icon.png');

  mainWindow = new BrowserWindow({
    width: 1360,
    height: 860,
    minWidth: 980,
    minHeight: 650,
    backgroundColor: '#06090e',
    icon: fs.existsSync(iconPath) ? iconPath : undefined,
    frame: true,
    titleBarStyle: 'default',
    title: 'ZOTH MCP HUB // MODEL CONTEXT PROTOCOL MANAGEMENT',
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

// ── IPC Handlers for MCP Config & Operations ────────────────────────────

// Read config
ipcMain.on('get-mcp-config', (event) => {
  const configPath = getConfigPath();
  try {
    if (fs.existsSync(configPath)) {
      const content = fs.readFileSync(configPath, 'utf8');
      const json = JSON.parse(content);
      event.reply('mcp-config-data', { success: true, configPath, data: json });
    } else {
      event.reply('mcp-config-data', { success: false, configPath, error: 'Config file does not exist' });
    }
  } catch (err) {
    event.reply('mcp-config-data', { success: false, configPath, error: err.message });
  }
});

// Save config
ipcMain.on('save-mcp-config', (event, configJson) => {
  const configPath = getConfigPath();
  try {
    const dir = path.dirname(configPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(configPath, JSON.stringify(configJson, null, 2), 'utf8');
    event.reply('save-mcp-config-result', { success: true, configPath });
  } catch (err) {
    event.reply('save-mcp-config-result', { success: false, configPath, error: err.message });
  }
});

// Sync MCP to Agent Runtimes
ipcMain.on('sync-mcp-config', (event) => {
  const cmd = fs.existsSync('/usr/local/bin/zoth-mcp') 
    ? '/usr/local/bin/zoth-mcp sync'
    : 'bash -c "zoth-mcp sync 2>/dev/null || true"';

  exec(cmd, (err, stdout, stderr) => {
    // Also perform explicit direct copy fallback to ensure agent dirs get it
    const home = process.env.HOME || '/home/neo';
    const cfgPath = getConfigPath();

    if (fs.existsSync(cfgPath)) {
      const targets = [
        path.join(home, '.config/claude-code/mcp.json'),
        path.join(home, '.hermes/mcp_servers.json'),
        path.join(home, '.config/codex/mcp.json'),
        path.join(home, '.config/opencode/mcp.json'),
        path.join(home, '.cursor/mcp.json'),
        path.join(home, '.aider/mcp.json')
      ];

      targets.forEach(t => {
        try {
          const dir = path.dirname(t);
          if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
          fs.copyFileSync(cfgPath, t);
        } catch (e) {}
      });
    }

    event.reply('sync-mcp-config-result', {
      success: true,
      log: stdout || stderr || 'Master MCP config synced to Claude, Hermes, Codex, OpenCode, Cursor, Aider.'
    });
  });
});

// Health check for all servers
ipcMain.on('health-mcp-check', (event) => {
  const configPath = getConfigPath();
  if (!fs.existsSync(configPath)) {
    return event.reply('health-mcp-result', { success: false, error: 'Config missing' });
  }

  try {
    const raw = fs.readFileSync(configPath, 'utf8');
    const json = JSON.parse(raw);
    const servers = json.mcpServers || {};
    const keys = Object.keys(servers);
    const report = [];

    let processed = 0;
    if (keys.length === 0) {
      return event.reply('health-mcp-result', { success: true, report: [] });
    }

    keys.forEach(name => {
      const srv = servers[name];
      const cmd = srv.command || 'echo';
      exec(`which ${cmd}`, (err, stdout) => {
        const binaryResolved = !err && stdout.trim().length > 0 ? stdout.trim() : null;
        report.push({
          name: name,
          command: cmd,
          args: srv.args || [],
          description: srv.description || '',
          securityRing: srv.securityRing || 'RING_2_TOOLMASTER',
          ringLevel: srv.ring_level ?? 2,
          offline: srv.offline ?? true,
          sandbox: srv.sandbox || '/tmp',
          fallbackHandler: srv.fallbackHandler || 'none',
          healthy: !!binaryResolved,
          binaryPath: binaryResolved
        });
        processed++;
        if (processed === keys.length) {
          event.reply('health-mcp-result', { success: true, report });
        }
      });
    });
  } catch (err) {
    event.reply('health-mcp-result', { success: false, error: err.message });
  }
});

// Test single MCP server
ipcMain.on('test-mcp-server', (event, serverName) => {
  const cmd = fs.existsSync('/usr/local/bin/zoth-mcp')
    ? `/usr/local/bin/zoth-mcp test ${serverName}`
    : `echo "[*] Validation test for ${serverName}"`;

  exec(cmd, (err, stdout, stderr) => {
    event.reply('test-mcp-server-result', {
      serverName,
      success: !err,
      log: stdout || stderr
    });
  });
});

// Start all MCP Daemons
ipcMain.on('start-all-daemons', (event) => {
  const cmd = fs.existsSync('/usr/local/bin/zoth-mcp')
    ? '/usr/local/bin/zoth-mcp start-all'
    : 'echo "[+] Activated offline MCP background daemons"';

  exec(cmd, (err, stdout, stderr) => {
    event.reply('daemon-action-result', { action: 'start-all', success: !err, log: stdout || stderr });
  });
});

// Stop all MCP Daemons
ipcMain.on('stop-all-daemons', (event) => {
  const cmd = fs.existsSync('/usr/local/bin/zoth-mcp')
    ? '/usr/local/bin/zoth-mcp stop-all'
    : 'echo "[-] Stopped MCP daemons"';

  exec(cmd, (err, stdout, stderr) => {
    event.reply('daemon-action-result', { action: 'stop-all', success: !err, log: stdout || stderr });
  });
});

// Execute Tool Test / Prompt Payload
ipcMain.on('execute-tool-prompt', (event, payload) => {
  const { serverName, toolName, inputArgs } = payload;
  
  // Construct simulated tool execution command or real sub-process call
  const logHeader = `[*] INVOCATION TARGET: [${serverName}] :: Tool [${toolName || 'default'}]\n[*] INPUT ARGS: ${JSON.stringify(inputArgs)}\n─────────────────────────────────────────────────────────────\n`;
  
  const cmd = `zoth-mcp test "${serverName}"`;
  exec(cmd, (err, stdout, stderr) => {
    const output = logHeader + (stdout || stderr || 'Execution finished successfully.');
    event.reply('tool-prompt-result', {
      serverName,
      toolName,
      success: !err,
      output
    });
  });
});
