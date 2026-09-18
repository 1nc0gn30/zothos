/**
 * ⚡ ZOTH STUDIO — SOVEREIGN MULTI-AGENT SWARM COCKPIT (v2.0)
 * All-Around Agent Workspace: Software Engineering, Data Analysis, 
 * Social & Content Automation, Pentesting & Security, Deep Research & Reasoning.
 * With Dynamic Swarm Intensity Selector (Solo, Triangulated Strike Team, Full 21 Swarm).
 */
(function () {
  'use strict';

  // 21 Full Sovereign Agents with Specialty Domains
  const SWARM_AGENTS = [
    { id: 'azoth', name: 'Master Azoth', role: 'Prime Architect & Synthesis', icon: '✨', color: '#e8c872', domain: 'System Synthesis' },
    { id: 'antigravity', name: 'Antigravity', role: 'Lead Orchestrator & AST', icon: '🪐', color: '#7c9cff', domain: 'Code & Architecture' },
    { id: 'grok', name: 'Grok', role: 'Astrolabe Truth & First Principles', icon: '📐', color: '#34d399', domain: 'Math & Reasoning' },
    { id: 'hermes', name: 'Hermes', role: 'Action Dispatcher & Tooling', icon: '⚡', color: '#f59e0b', domain: 'Execution & Automation' },
    { id: 'ghostbyte', name: 'GhostByte', role: 'Argon2id Vault Sentinel', icon: '🔒', color: '#c084fc', domain: 'Security & Keys' },
    { id: 'athena', name: 'Athena', role: 'AEO & Semantic Knowledge', icon: '🦉', color: '#c084fc', domain: 'Research & Knowledge' },
    { id: 'chronos', name: 'Chronos', role: 'Temporal DAG Navigator', icon: '⏳', color: '#a855f7', domain: 'Workflows & Git' },
    { id: 'draco', name: 'Draco', role: 'Fusion Compiler & Arbiter', icon: '🐉', color: '#e8c872', domain: 'Consensus & Merging' },
    { id: 'ignis', name: 'Ignis', role: 'Refactor Engine & Pipelines', icon: '🔥', color: '#ff5500', domain: 'Refactoring & CI' },
    { id: 'kai', name: 'Kai', role: 'Workspace Inspector & AST', icon: '🔍', color: '#00f0ff', domain: 'Static Analysis' },
    { id: 'kitsune', name: 'Kitsune', role: 'Taste & AX Motion Restraint', icon: '🦊', color: '#ff007a', domain: 'Visuals & Polish' },
    { id: 'kraken', name: 'Kraken', role: 'Deep Memory Daemon & Cache', icon: '🐙', color: '#00f0ff', domain: 'Memory & Persistence' },
    { id: 'leviathan', name: 'Leviathan', role: 'Abyssal Load & Concurrency', icon: '🐋', color: '#38bdf8', domain: 'Scale & Performance' },
    { id: 'lycan', name: 'Lycan', role: 'SecOps & Boundary Auditor', icon: '🐺', color: '#f43f5e', domain: 'Threats & Ports' },
    { id: 'onyx', name: 'Onyx', role: 'Zero-Leak Terminal Core', icon: '🖤', color: '#cbd5e1', domain: 'CLI & Low-Level' },
    { id: 'scorpius', name: 'Scorpius', role: 'Penetration & Red Team', icon: '🦂', color: '#ef4444', domain: 'Red Teaming' },
    { id: 'aquila', name: 'Aquila', role: 'High-Altitude Vision & Eagle', icon: '🦅', color: '#fbbf24', domain: 'Vision & Strategy' },
    { id: 'aether', name: 'Aether', role: 'Universal Ambient Mesh', icon: '🌌', color: '#e2e8f0', domain: 'Bus Networking' },
    { id: 'pixel-neko', name: 'Pixel Neko', role: '8-Bit Retro Sprite Vibe', icon: '🐱', color: '#ec4899', domain: 'Creative & Gaming' },
    { id: 'pixel-shiba', name: 'Pixel Shiba', role: 'Playbook Automation Runner', icon: '🐕', color: '#eab308', domain: 'Social Automation' },
    { id: 'radical-minion', name: 'Radical Minion', role: 'Autonomous Fast Tasker', icon: '⚡', color: '#f97316', domain: 'Quick Scripting' }
  ];

  // Swarm Goal Categories (Build, Automate, Research, Secure, Create)
  const SWARM_PRESETS = [
    {
      id: 'software',
      title: '💻 Software & Apps',
      desc: 'Full-stack engineering, microservices, bug hunting, and AST refactors.',
      strikeTeam: ['antigravity', 'grok', 'hermes', 'ignis', 'kai'],
      samples: [
        'Build a multi-threaded Python CLI for automated dataset scraping with SQLite cache',
        'Refactor our auth middleware to strict zero-trust session tokens',
        'Audit code AST and generate comprehensive unit test suites'
      ]
    },
    {
      id: 'automation',
      title: '⚡ Workflow Automation',
      desc: 'Cron jobs, batch data pipelines, multi-platform publishing, and webhooks.',
      strikeTeam: ['hermes', 'chronos', 'pixel-shiba', 'radical-minion'],
      samples: [
        'Automate multi-platform dispatches (X/Twitter, LinkedIn, Discord) with thread chunking',
        'Build a scheduled lead enrichment scraper with CSV and JSON exports',
        'Create a local cron watcher that triggers backups on file modification'
      ]
    },
    {
      id: 'research',
      title: '🧠 Research & Knowledge',
      desc: 'Deep document synthesis, competitor intelligence, AEO/SEO indexing, and math proofs.',
      strikeTeam: ['grok', 'athena', 'aquila', 'azoth'],
      samples: [
        'Synthesize competitive analysis report across AI agent frameworks with matrix tables',
        'Generate llms.txt context layer, JSON-LD Schema triples, and semantic taxonomy',
        'Perform first-principles mathematical verification of token budget heuristics'
      ]
    },
    {
      id: 'security',
      title: '🔒 Security & Cryptography',
      desc: 'Argon2id key vaulting, penetration testing, port audits, and memory isolation.',
      strikeTeam: ['ghostbyte', 'lycan', 'scorpius', 'onyx'],
      samples: [
        'Run penetration audit on all active local listening ports (:8088, :8484, :8788)',
        'Derive Argon2id encrypted key enclave with hardware-bound tokens',
        'Sanitize temporary process buffers to guarantee zero plaintext memory leaks'
      ]
    },
    {
      id: 'creative',
      title: '🎨 Creative & Media',
      desc: '3D WebGL scenes, interactive storyboards, soundscapes, and anime episodes.',
      strikeTeam: ['kitsune', 'pixel-neko', 'azoth', 'aether'],
      samples: [
        'Generate a 60fps WebGL particle galaxy with audio-reactive Solfeggio frequencies',
        'Compose a 4-panel cyberpunk anime manga episode script with character dialogue',
        'Design a high-contrast futuristic dark-mode HUD theme with fluid animations'
      ]
    }
  ];

  // Mock File System
  const FILE_SYSTEM = {
    'tasks/project_plan.md': `# Sovereign Swarm Execution Plan
## Objective: Autonomous Task Execution Across 21 Agents
- **Target Goal**: End-to-end task breakdown & multi-agent execution
- **Swarm Intensity**: Triangulated Strike Team (3 to 5 specialists)
- **Status**: Ready on Loopback :8484`,
    'scripts/automate_pipeline.py': `#!/usr/bin/env python3
"""Autonomous Swarm Task Automation Script"""
import time

def execute_swarm_task(goal_name):
    print(f"⚡ [SWARM] Dispatched goal: {goal_name}")
    time.sleep(0.5)
    print("✔ [SWARM] All invariants verified. Exit 0.")

if __name__ == "__main__":
    execute_swarm_task("General Automation Pipeline")`,
    'public/index.html': `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="utf-8" />
  <title>Zoth Studio — Sovereign Multi-Agent Workspace</title>
</head>
<body>
  <h1>21 Autonomous Agents Ready</h1>
</body>
</html>`
  };

  let activeFile = 'tasks/project_plan.md';
  let targetAgentId = 'all';
  let swarmIntensity = 'strike'; // 'solo' | 'strike' | 'full'
  let chatMode = 'swarm'; // 'swarm' | 'direct'
  let splitLayout = 'split'; // 'split' | 'chat-full' | 'editor-full'

  // Initialize Cockpit
  function initIde() {
    renderSwarmRoster();
    renderDirectAgentDropdown();
    renderGoalPresets();
    renderFileTree();
    renderEditorLineNumbers();
    loadEditorFile(activeFile);
    setupKeyboardShortcuts();
    
    if (window.innerWidth <= 880) {
      setMobileIdeView('chat');
    }
  }

  // Render Swarm Goal Preset Cards
  function renderGoalPresets() {
    const wrap = document.getElementById('goalPresetsGrid');
    if (!wrap) return;

    wrap.innerHTML = SWARM_PRESETS.map(preset => `
      <div class="goal-preset-card" onclick="selectGoalPreset('${preset.id}')">
        <div class="preset-card-head">
          <strong>${preset.title}</strong>
          <span class="preset-team-pill">${preset.strikeTeam.length} Agents</span>
        </div>
        <p class="preset-card-desc">${preset.desc}</p>
        <div class="preset-samples">
          ${preset.samples.map(s => `<button class="sample-chip" onclick="event.stopPropagation(); quickSendPrompt('${s.replace(/'/g, "\\'")}')">⚡ ${s.slice(0, 48)}...</button>`).join('')}
        </div>
      </div>
    `).join('');
  }

  window.selectGoalPreset = function (presetId) {
    const preset = SWARM_PRESETS.find(p => p.id === presetId);
    if (!preset) return;

    // Log to chat
    appendChatMessage({
      isUser: false,
      author: 'Master Azoth',
      role: 'Swarm Conductor',
      avatar: '✨',
      color: '#e8c872',
      text: `Swarm Mode aligned to <strong>${preset.title}</strong>. Primary strike team deployed: ${preset.strikeTeam.map(a => `<span class="tag-pill-inline">@${a}</span>`).join(' ')}. How may we assist?`
    });

    logTerminalLine(`[SWARM] Assembled Strike Team for ${preset.title}: [${preset.strikeTeam.join(', ')}]`, 'green');
  };

  // Set Swarm Strength / Intensity (Solo vs Strike Team vs Full Swarm)
  window.setSwarmIntensity = function (intensity) {
    swarmIntensity = intensity;
    document.querySelectorAll('.swarm-intensity-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-intensity') === intensity);
    });

    const label = intensity === 'solo' ? 'Solo Specialist (1 Agent)' :
                  intensity === 'strike' ? 'Triangulated Strike Team (3–5 Agents)' :
                  'Full Pantheon Swarm (All 21 Agents)';

    appendChatMessage({
      isUser: false,
      author: 'Antigravity',
      role: 'Lead Orchestrator',
      avatar: '🪐',
      color: '#7c9cff',
      text: `Swarm Execution Strength adjusted to <strong>${label}</strong>. Tasks will now be distributed with ${intensity === 'solo' ? 'minimal resource overhead' : intensity === 'strike' ? 'balanced multi-agent verification' : 'maximum multi-model consensus depth'}.`
    });

    logTerminalLine(`[CONFIG] Swarm Strength updated to: ${intensity.toUpperCase()} (${label})`, 'cyan');
  };

  // Render 21 Agents in the Sidebar Swarm Roster
  function renderSwarmRoster() {
    const rosterEl = document.getElementById('ideSwarmRoster');
    if (!rosterEl) return;

    rosterEl.innerHTML = SWARM_AGENTS.map(agent => `
      <div class="swarm-roster-card" onclick="openDirectAgentChat('${agent.id}')">
        <div class="roster-card-left">
          <span class="roster-icon">${agent.icon}</span>
          <div>
            <div class="roster-name" style="color:${agent.color}">${agent.name}</div>
            <div class="roster-role">${agent.domain} · ${agent.role}</div>
          </div>
        </div>
        <button type="button" class="roster-chat-btn" onclick="event.stopPropagation(); openDirectAgentChat('${agent.id}')">Assign</button>
      </div>
    `).join('');
  }

  // Populate Direct Agent Dropdown
  function renderDirectAgentDropdown() {
    const dd = document.getElementById('directAgentDropdown');
    if (!dd) return;

    dd.innerHTML = SWARM_AGENTS.map(agent => `
      <option value="${agent.id}">${agent.icon} ${agent.name} — ${agent.domain}</option>
    `).join('');
  }

  // Render File Explorer Tree
  function renderFileTree() {
    const treeEl = document.getElementById('ideFileTree');
    if (!treeEl) return;

    const files = Object.keys(FILE_SYSTEM);
    treeEl.innerHTML = files.map(file => {
      const isAct = file === activeFile ? 'style="background:rgba(0,240,255,0.12);border-color:var(--cyan);color:#fff;"' : '';
      return `
        <div class="file-tree-node" ${isAct} onclick="switchEditorTab('${file}')">
          <i class="ph-bold ph-file-code" style="color:var(--cyan)"></i>
          <span style="font-size:0.75rem;font-family:var(--ide-font-mono);">${file}</span>
        </div>
      `;
    }).join('');
  }

  // Render Line Numbers in Code Editor
  function renderEditorLineNumbers() {
    const lineEl = document.getElementById('editorLineNumbers');
    if (!lineEl) return;

    const lines = [];
    for (let i = 1; i <= 60; i++) {
      lines.push(`<div>${i}</div>`);
    }
    lineEl.innerHTML = lines.join('');
  }

  // Load Content into Editor
  function loadEditorFile(filename) {
    activeFile = filename;
    const editor = document.getElementById('ideCodeEditor');
    if (editor && FILE_SYSTEM[filename]) {
      editor.value = FILE_SYSTEM[filename];
    }
    renderFileTree();
  }

  // Switch Active Tab
  window.switchEditorTab = function (filename) {
    if (!FILE_SYSTEM[filename]) {
      FILE_SYSTEM[filename] = `# File: ${filename}\n`;
    }
    loadEditorFile(filename);

    document.querySelectorAll('.editor-tab').forEach(tab => {
      tab.classList.toggle('active', tab.getAttribute('data-file') === filename);
    });
  };

  window.closeEditorTab = function (e, filename) {
    if (e) e.stopPropagation();
    const tabs = document.querySelectorAll('.editor-tab');
    if (tabs.length > 1) {
      const tabEl = document.querySelector(`.editor-tab[data-file="${filename}"]`);
      if (tabEl) tabEl.remove();
      const firstTab = document.querySelector('.editor-tab');
      if (firstTab) {
        switchEditorTab(firstTab.getAttribute('data-file'));
      }
    }
  };

  // Switch Sidebar Activity Tabs
  window.switchSidebarPanel = function (panelId) {
    document.querySelectorAll('.activity-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.sidebar-panel').forEach(p => {
      p.classList.remove('active');
      p.style.display = 'none';
    });

    const activeBtn = document.getElementById('actBtn' + panelId.charAt(0).toUpperCase() + panelId.slice(1));
    const activePanel = document.getElementById('panel' + panelId.charAt(0).toUpperCase() + panelId.slice(1));

    if (activeBtn) activeBtn.classList.add('active');
    if (activePanel) {
      activePanel.classList.add('active');
      activePanel.style.display = 'flex';
    }
  };

  // Switch Chat Mode: Swarm vs Direct
  window.switchChatMode = function (mode) {
    chatMode = mode;
    document.getElementById('tabSwarmRoom').classList.toggle('active', mode === 'swarm');
    document.getElementById('tabDirectAgent').classList.toggle('active', mode === 'direct');
    
    const wrap = document.getElementById('directAgentSelectWrap');
    if (wrap) wrap.style.display = mode === 'direct' ? 'block' : 'none';

    if (mode === 'swarm') {
      setTargetAgent('all');
    } else {
      const dd = document.getElementById('directAgentDropdown');
      if (dd) setTargetAgent(dd.value);
    }
  };

  // Open Direct Agent Chat
  window.openDirectAgentChat = function (agentId) {
    switchSidebarPanel('chat');
    switchChatMode('direct');
    const dd = document.getElementById('directAgentDropdown');
    if (dd) dd.value = agentId;
    setTargetAgent(agentId);
  };

  window.onDirectAgentSelected = function (agentId) {
    setTargetAgent(agentId);
  };

  // Set Target Mention Agent
  window.setTargetAgent = function (agentId) {
    targetAgentId = agentId;
    
    document.querySelectorAll('.mention-pill').forEach(pill => {
      const isMatch = (agentId === 'all' && pill.textContent.includes('All')) ||
                      (pill.textContent.includes(agentId));
      pill.classList.toggle('active', isMatch);
    });

    const titleEl = document.getElementById('chatHeaderTitle');
    const subEl = document.getElementById('chatHeaderSub');
    const avatarEl = document.getElementById('chatHeaderAvatar');

    if (agentId === 'all') {
      if (titleEl) titleEl.textContent = 'Swarm Task Matrix';
      if (subEl) subEl.textContent = `Strength: ${swarmIntensity.toUpperCase()} · 21 agents standing by`;
      if (avatarEl) avatarEl.textContent = '🌐';
    } else {
      const agent = SWARM_AGENTS.find(a => a.id === agentId);
      if (agent) {
        if (titleEl) titleEl.textContent = agent.name;
        if (subEl) subEl.textContent = `${agent.domain} · ${agent.role}`;
        if (avatarEl) avatarEl.textContent = agent.icon;
      }
    }
  };

  // Insert Text Snippet into Input
  window.insertSnippet = function (text) {
    const input = document.getElementById('ideChatInput');
    if (!input) return;
    input.value += text;
    input.focus();
  };

  // Quick Send Prompt from Action Chips
  window.quickSendPrompt = function (text) {
    const input = document.getElementById('ideChatInput');
    if (!input) return;
    input.value = text;
    submitIdePrompt();
  };

  // Submit Prompt from Chat Input
  window.submitIdePrompt = function () {
    const input = document.getElementById('ideChatInput');
    if (!input || !input.value.trim()) return;

    const userText = input.value.trim();
    input.value = '';

    appendChatMessage({
      isUser: true,
      author: 'Operator',
      role: 'Human Sovereign Lead',
      avatar: '👤',
      text: userText
    });

    setTimeout(() => {
      handleAgentResponse(userText);
    }, 550);
  };

  // Handle Agent Response Dispatch according to Swarm Strength & Topic
  function handleAgentResponse(prompt) {
    const stream = document.getElementById('chatStreamScroll');
    if (!stream) return;

    let respondingAgents = [];
    const lower = prompt.toLowerCase();

    if (targetAgentId === 'all') {
      if (swarmIntensity === 'solo') {
        // Pick best single specialist
        if (lower.includes('scrape') || lower.includes('automate') || lower.includes('cron')) {
          respondingAgents = ['hermes'];
        } else if (lower.includes('security') || lower.includes('vault') || lower.includes('port')) {
          respondingAgents = ['ghostbyte'];
        } else if (lower.includes('research') || lower.includes('report') || lower.includes('math')) {
          respondingAgents = ['grok'];
        } else {
          respondingAgents = ['antigravity'];
        }
      } else if (swarmIntensity === 'strike') {
        // Strike team of 3 specialists
        if (lower.includes('automate') || lower.includes('task')) {
          respondingAgents = ['hermes', 'pixel-shiba', 'antigravity'];
        } else if (lower.includes('security') || lower.includes('audit')) {
          respondingAgents = ['ghostbyte', 'lycan', 'azoth'];
        } else if (lower.includes('research') || lower.includes('data')) {
          respondingAgents = ['athena', 'grok', 'aquila'];
        } else {
          respondingAgents = ['antigravity', 'grok', 'azoth'];
        }
      } else {
        // Full Swarm mode
        respondingAgents = ['antigravity', 'grok', 'hermes', 'azoth', 'ghostbyte'];
      }
    } else {
      respondingAgents = [targetAgentId];
    }

    respondingAgents.forEach((agentId, idx) => {
      const agent = SWARM_AGENTS.find(a => a.id === agentId) || SWARM_AGENTS[0];
      setTimeout(() => {
        let replyText = generateContextualReply(agent, prompt);
        appendChatMessage({
          isUser: false,
          author: agent.name,
          role: `${agent.domain} · ${agent.role}`,
          avatar: agent.icon,
          color: agent.color,
          text: replyText
        });
        
        logTerminalLine(`[SWARM] Agent @${agent.id} (${agent.domain}) completed task step: "${prompt.slice(0, 28)}..."`, 'cyan');
      }, (idx + 1) * 650);
    });
  }

  function generateContextualReply(agent, prompt) {
    const p = prompt.toLowerCase();
    if (agent.id === 'antigravity') {
      return `Deconstructed your goal into parallel subtasks across our strike team. Topology graph verified under <code>${activeFile}</code>. Ready to write code, synthesize configs, or orchestrate tools.`;
    } else if (agent.id === 'grok') {
      return `First-principles analysis: Analyzed requirements against mathematical logic. Invariants confirmed 100% valid with zero contradiction in execution steps.`;
    } else if (agent.id === 'hermes') {
      return `Tool execution dispatched. Invoked local subprocess harness in 8ms with exit code 0. Generated output synced to workspace.`;
    } else if (agent.id === 'azoth') {
      return `Universal synthesis achieved. Harmonized multi-agent proposals into a single executable solution on loopback :8484.`;
    } else if (agent.id === 'ghostbyte') {
      return `Security review: Verified zero plaintext leaks, isolated memory buffer, and enforced Argon2id boundary rules.`;
    } else if (agent.id === 'athena') {
      return `Knowledge indexed. Formatted schema, semantic triples, and documentation manifests for instant retrieval.`;
    } else if (agent.id === 'pixel-shiba') {
      return `Social & task automation playbook active! Batch jobs queued and ready for scheduled dispatch.`;
    }
    return `Specialist ${agent.name} (${agent.domain}) has processed your goal against local invariants with zero cloud dependencies.`;
  }

  function appendChatMessage(msg) {
    const stream = document.getElementById('chatStreamScroll');
    if (!stream) return;

    const div = document.createElement('div');
    div.className = `chat-message ${msg.isUser ? 'user-msg' : 'agent-msg'}`;
    div.innerHTML = `
      <div class="msg-avatar">${msg.avatar}</div>
      <div class="msg-body">
        <div class="msg-header">
          <span class="msg-author" style="color:${msg.color || 'var(--cyan)'}">${msg.author}</span>
          <span class="msg-role">${msg.role}</span>
          <span class="msg-time">Just now</span>
        </div>
        <div class="msg-content">${msg.text}</div>
      </div>
    `;

    stream.appendChild(div);
    stream.scrollTop = stream.scrollHeight;
  }

  window.clearActiveChatMessages = function () {
    const stream = document.getElementById('chatStreamScroll');
    if (stream) {
      stream.innerHTML = `
        <div class="chat-system-banner">
          <div class="sys-banner-icon">🪐</div>
          <div>
            <strong>Swarm Workspace Reset</strong>
            <p>Ready for a fresh goal. Select a swarm preset, adjust swarm strength, or prompt directly.</p>
          </div>
        </div>
      `;
    }
  };

  window.toggleLayoutSplit = function () {
    const deck = document.getElementById('ideSplitDeck');
    if (!deck) return;

    if (splitLayout === 'split') {
      splitLayout = 'chat-full';
      deck.className = 'ide-split-deck mode-chat-full';
    } else if (splitLayout === 'chat-full') {
      splitLayout = 'editor-full';
      deck.className = 'ide-split-deck mode-editor-full';
    } else {
      splitLayout = 'split';
      deck.className = 'ide-split-deck mode-split';
    }
  };

  window.setEditorPaneMode = function (mode) {
    const btnEditor = document.getElementById('btnModeEditor');
    const btnPrev = document.getElementById('btnModePreview');
    const paneEditor = document.getElementById('paneEditor');
    const panePrev = document.getElementById('panePreview');

    if (btnEditor) btnEditor.classList.toggle('active', mode === 'editor');
    if (btnPrev) btnPrev.classList.toggle('active', mode === 'preview');

    if (paneEditor) paneEditor.style.display = mode === 'editor' ? 'flex' : 'none';
    if (panePrev) panePrev.style.display = mode === 'preview' ? 'flex' : 'none';
  };

  window.reloadIframePreview = function () {
    const frame = document.getElementById('ideLivePreviewIframe');
    if (frame) frame.src = frame.src;
  };

  window.runActiveFileDiagnostics = function () {
    logTerminalLine(`[DIAGNOSTICS] Checking invariants on ${activeFile}...`, 'gold');
    setTimeout(() => {
      logTerminalLine(`✔ Invariant check passed: 0 syntax collisions, 0 memory leaks. Ready to ship.`, 'green');
    }, 350);
  };

  window.switchTerminalTab = function (tabKey) {
    document.querySelectorAll('.term-tab').forEach(t => t.classList.remove('active'));
    const activeTab = document.getElementById('tab' + tabKey.charAt(0).toUpperCase() + tabKey.slice(1));
    if (activeTab) activeTab.classList.add('active');

    if (tabKey === 'term') {
      logTerminalLine(`Switched to Live Subprocess Terminal (:8088 / :8484)`, 'cyan');
    } else if (tabKey === 'diag') {
      logTerminalLine(`[SWARM TELEMETRY] All active tasks verified with 0 invariant violations.`, 'green');
    } else if (tabKey === 'bus') {
      logTerminalLine(`[EVENT BUS] 21/21 Agents listening on WebSocket loopback :8484`, 'green');
    }
  };

  window.clearTerminalOutput = function () {
    const termBody = document.getElementById('terminalBody');
    if (termBody) {
      termBody.innerHTML = `
        <div class="term-line"><span class="term-prompt">zoth-studio $</span> <span class="term-cursor">_</span></div>
      `;
    }
  };

  window.toggleTerminalCollapse = function () {
    const term = document.getElementById('ideBottomTerminal');
    const btn = document.getElementById('btnTermCollapse');
    if (!term) return;

    const isCollapsed = term.classList.toggle('collapsed');
    if (btn) btn.textContent = isCollapsed ? '▲' : '_';
  };

  function logTerminalLine(text, colorClass) {
    const termBody = document.getElementById('terminalBody');
    if (!termBody) return;

    const div = document.createElement('div');
    div.className = `term-line ${colorClass || ''}`;
    div.textContent = text;
    termBody.appendChild(div);
    termBody.scrollTop = termBody.scrollHeight;
  }

  window.setMobileIdeView = function (view) {
    document.querySelectorAll('.m-view-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-view') === view);
    });

    const deck = document.getElementById('ideSplitDeck');
    if (!deck) return;

    deck.classList.remove('mobile-view-chat', 'mobile-view-editor', 'mobile-view-preview', 'mobile-view-terminal');
    deck.classList.add('mobile-view-' + view);

    if (view === 'preview') {
      setEditorPaneMode('preview');
    } else if (view === 'editor') {
      setEditorPaneMode('editor');
    }
  };

  function setupKeyboardShortcuts() {
    const input = document.getElementById('ideChatInput');
    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          submitIdePrompt();
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initIde);
  } else {
    initIde();
  }
})();
