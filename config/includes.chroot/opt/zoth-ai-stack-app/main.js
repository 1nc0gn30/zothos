const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const { exec, spawn } = require('child_process');
const fs = require('fs');

let mainWindow = null;

const AI_TOOLS_DATABASE = [
  // Flagship Agents
  { id: 'hermes', name: 'Hermes Agent (Nous Research)', domain: 'Flagship Agents', desc: 'Nous Research Autonomous Tool-Calling Agent Harness & Swarm Orchestrator', cmd: 'hermes', pkg: '/usr/local/bin/hermes setup || pip3 install --break-system-packages hermes-agent', type: '1liner' },
  { id: 'cline', name: 'Cline (Autonomous Agent)', domain: 'Flagship Agents', desc: 'Cline.bot Open-Source Autonomous Coding Agent & CLI', cmd: 'cline', pkg: 'mkdir -p ~/.local && npm install -g --prefix ~/.local cline', type: '1liner' },
  { id: 'grok', name: 'Grok CLI (xAI)', domain: 'Flagship Agents', desc: 'xAI Grok Intelligence Terminal & Real-Time Search', cmd: 'grok', pkg: 'mkdir -p ~/.local && (npm install -g --prefix ~/.local @xai/grok-cli || pip install --user xai-grok)', type: '1liner' },
  { id: 'codex', name: 'Open Source Codex', domain: 'Flagship Agents', desc: 'OpenAI Autonomous Codex Coding & Refactoring Agent', cmd: 'codex', pkg: 'mkdir -p ~/.local && (npm install -g --prefix ~/.local @openai/codex || pip install --user openai-codex)', type: '1liner' },
  { id: 'claude', name: 'Claude Code (Anthropic)', domain: 'Flagship Agents', desc: 'Anthropic Sovereign Polyglot Agent Console', cmd: 'claude', pkg: 'curl -fsSL https://claude.ai/install.sh | bash', type: '1liner' },
  { id: 'opencode', name: 'OpenCode AI', domain: 'Flagship Agents', desc: 'Open-Source AI Pair Programmer & Codebase Inspector', cmd: 'opencode', pkg: 'mkdir -p ~/.local && (npm install -g --prefix ~/.local opencode-ai || pip install --user opencode-ai)', type: '1liner' },
  { id: 'agy', name: 'Google AGY', domain: 'Flagship Agents', desc: 'Google Antigravity SDK & Autonomous Agent Harness', cmd: 'agy', pkg: 'mkdir -p ~/.local && (npm install -g --prefix ~/.local @google/antigravity-sdk || pip install --user google-antigravity)', type: '1liner' },

  // Local LLM & Inference
  { id: 'ollama', name: 'Ollama (ollama.com)', domain: 'Local Inference', desc: 'Official Local LLM Daemon from ollama.com for Llama 3.2, DeepSeek, Qwen & Gemma', cmd: 'ollama', pkg: 'curl -fsSL https://ollama.com/install.sh | sh', type: '1liner' },
  { id: 'litellm', name: 'LiteLLM Proxy', domain: 'Local Inference', desc: 'Universal OpenAI-Compatible Proxy in Front of 100+ LLMs', cmd: 'litellm', pkg: '/opt/zothos-ai-env/bin/pip install litellm || pip3 install --user litellm', type: 'pip' },

  // Assistants & Drivers
  { id: 'aider', name: 'Aider AI', domain: 'Assistants & Drivers', desc: 'Git-Aware Terminal Pair Programmer for LLM Refactoring', cmd: 'aider', pkg: '/opt/zothos-ai-env/bin/pip install aider-chat || pip3 install --user aider-chat', type: 'pip' },
  { id: 'goose', name: 'Block Goose', domain: 'Assistants & Drivers', desc: 'Block Open-Source Autonomous Developer Agent', cmd: 'goose', pkg: 'curl -fsSL https://github.com/block/goose/releases/download/stable/goose-x86_64-unknown-linux-gnu.tar.gz | sudo tar -xz -C /usr/local/bin 2>/dev/null || curl -fsSL https://block.github.io/goose/install.sh | bash', type: '1liner' },
  { id: 'open-interpreter', name: 'Open Interpreter', domain: 'Assistants & Drivers', desc: 'Natural Language Code Execution Engine for Linux', cmd: 'interpreter', pkg: '/opt/zothos-ai-env/bin/pip install open-interpreter || pip3 install --user open-interpreter', type: 'pip' },
  { id: 'browser-use', name: 'Browser Use', domain: 'Assistants & Drivers', desc: 'Web Browser Driving & Automation Agent Core', cmd: 'browser-use', pkg: '/opt/zothos-ai-env/bin/pip install browser-use || pip3 install --user browser-use', type: 'pip' },

  // MCP & Tooling
  { id: 'zoth-mcp', name: 'Zoth Master MCP', domain: 'MCP & Tooling', desc: '3-Ring Model Context Protocol Registry & Server Hub', cmd: 'zoth-mcp-gui', pkg: 'zothos-core', type: 'system' },
  { id: 'fastmcp', name: 'FastMCP Toolkit', domain: 'MCP & Tooling', desc: 'Python MCP Server Toolkit for Rapid Tool Development', cmd: 'fastmcp', pkg: '/opt/zothos-ai-env/bin/pip install fastmcp || pip3 install --user fastmcp', type: 'pip' },

  // AI Security & Red Teaming
  { id: 'hexstrike', name: 'HexStrike AI', domain: 'AI Red Teaming', desc: 'Autonomous Red Teaming & AI Offensive Security Suite', cmd: 'hexstrike', pkg: 'hexstrike-ai', type: 'system' },
  { id: 'garak', name: 'Garak Scanner', domain: 'AI Red Teaming', desc: 'LLM Vulnerability, Jailbreak & Hallucination Scanner', cmd: 'garak', pkg: '/opt/zothos-ai-env/bin/pip install garak || pip3 install --user garak', type: 'pip' },
  { id: 'pyrit', name: 'PyRIT Red Team', domain: 'AI Red Teaming', desc: 'Microsoft Python Risk Identification Toolkit for AI', cmd: 'pyrit', pkg: '/opt/zothos-ai-env/bin/pip install pyrit || pip3 install --user pyrit', type: 'pip' },
  { id: 'promptfoo', name: 'Promptfoo Eval', domain: 'AI Red Teaming', desc: 'LLM Prompt, Output & Security Evaluation Suite', cmd: 'promptfoo', pkg: 'mkdir -p ~/.local/bin && (npm install -g --prefix ~/.local promptfoo || sudo npm install -g promptfoo)', type: 'npm' },
  { id: 'inspect', name: 'Inspect AI', domain: 'AI Red Teaming', desc: 'UK AISI Framework for Large Language Model Evaluation', cmd: 'inspect', pkg: '/opt/zothos-ai-env/bin/pip install inspect-ai || pip3 install --user inspect-ai', type: 'pip' },

  // Generative Interfaces
  { id: 'open-webui', name: 'Open WebUI', domain: 'Interfaces', desc: 'Local ChatGPT-Style Rich Web Interface on Port 8080', cmd: 'open-webui', pkg: '/opt/zothos-ai-env/bin/pip install open-webui || pip3 install --user open-webui', type: 'pip' },
  { id: 'comfyui', name: 'ComfyUI Studio', domain: 'Interfaces', desc: 'Modular Node-Based Visual & Diffusion Generation Engine', cmd: 'comfyui', pkg: '/opt/zothos-ai-env/bin/pip install comfyui || pip3 install --user comfyui', type: 'pip' },
  { id: 'zoth-studio', name: 'Zoth Studio Pro', domain: 'Interfaces', desc: 'Sovereign 3D WebGL Alchemical Cockpit & Workspace', cmd: 'zoth-studio', pkg: 'zothos-core', type: 'system' },
];

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1040,
    minHeight: 680,
    backgroundColor: '#04060c',
    frame: true,
    titleBarStyle: 'default',
    title: 'ZOTH AI STACK // NEURAL COMPUTE & AGENT HARNESS COCKPIT',
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

// ── Get AI Tools State IPC ────────────────────────────────────────────
ipcMain.on('get-ai-tools', (event) => {
  const total = AI_TOOLS_DATABASE.length;
  let checked = 0;
  const results = [];

  AI_TOOLS_DATABASE.forEach(t => {
    exec(`which ${t.cmd} 2>/dev/null || which ${t.id} 2>/dev/null`, (err, stdout) => {
      const isBin = !err && stdout.trim().length > 0;
      results.push({
        ...t,
        installed: isBin,
        path: isBin ? stdout.trim() : null
      });
      checked++;
      if (checked === total) {
        event.reply('ai-tools-list', results);
      }
    });
  });
});

// ── Launch AI Tool IPC ────────────────────────────────────────────────
ipcMain.on('launch-ai-tool', (event, cmd) => {
  const guiApps = ['zoth-studio', 'zoth-mcp-gui', 'comfyui', 'open-webui'];
  if (guiApps.includes(cmd)) {
    exec(`nohup ${cmd} >/dev/null 2>&1 &`);
  } else {
    exec(`konsole --title '${cmd.toUpperCase()} AGENT' -e '${cmd}'`);
  }
});

// ── Install AI Tool IPC ───────────────────────────────────────────────
ipcMain.on('install-ai-tool', (event, tool) => {
  const cmd = `konsole --title 'INSTALLING ${tool.name.toUpperCase()}' -e 'bash -c "${tool.pkg.replace(/"/g, '\\"')}; echo \"\"; echo \"[✓] Installer finished. Press Enter to close...\"; read"'`;
  exec(cmd, (err) => {
    event.reply('install-complete', { toolId: tool.id, success: !err });
  });
});
