const { ipcRenderer } = require('electron');

let currentAgent = 'sentinel';
let currentModel = 'llama3.2:latest';
let stateData = null;

const agentsList = document.getElementById('agents-list');
const mcpList = document.getElementById('mcp-list');
const activeAgentTitle = document.getElementById('active-agent-title');
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');

function refreshState() {
  ipcRenderer.send('get-state');
}

ipcRenderer.on('state-update', (event, data) => {
  stateData = data;
  renderAgents(data.agents);
  renderMcp(data.mcpServers);
  document.getElementById('stat-agents').textContent = `${data.agents.length} REGISTERED`;
  document.getElementById('stat-mcp').textContent = `${Object.keys(data.mcpServers).length} ACTIVE`;
});

function renderAgents(agents) {
  agentsList.innerHTML = '';
  agents.forEach(ag => {
    const card = document.createElement('div');
    card.className = `agent-card ${ag.id === currentAgent ? 'selected' : ''}`;
    card.innerHTML = `
      <div class="agent-top">
        <span class="agent-name">${ag.name}</span>
        <span class="badge ${ag.active ? 'active' : 'inactive'}">${ag.active ? 'RUNNING' : 'IDLE'}</span>
      </div>
      <div class="agent-role">${ag.role}</div>
      <div class="agent-footer">
        <span>${ag.model} [${ag.ring}]</span>
        <div style="display:flex; gap:4px;">
          <button class="${ag.active ? 'danger' : 'primary'}" style="padding:1px 6px; font-size:7.5px;" onclick="toggleAgent('${ag.id}', '${ag.active ? 'stop' : 'start'}', event)">${ag.active ? 'STOP' : 'START'}</button>
        </div>
      </div>
    `;
    card.onclick = () => selectAgent(ag);
    agentsList.appendChild(card);
  });
}

function renderMcp(mcpServers) {
  mcpList.innerHTML = '';
  Object.keys(mcpServers).forEach(key => {
    const s = mcpServers[key];
    const item = document.createElement('div');
    item.className = 'mcp-item';
    item.innerHTML = `
      <div class="mcp-top">
        <span>⚡ ${key}</span>
        <span style="font-size:7.5px; color:var(--gold);">${s.security_ring || 'Ring 2'}</span>
      </div>
      <div class="mcp-desc">${s.description || 'Native tool server'}</div>
    `;
    mcpList.appendChild(item);
  });
}

window.selectAgent = function(ag) {
  currentAgent = ag.id;
  currentModel = ag.model;
  activeAgentTitle.textContent = `DISPATCH TO: ${ag.name.toUpperCase()}`;
  if (stateData) renderAgents(stateData.agents);
};

window.toggleAgent = function(agentId, action, event) {
  if (event) event.stopPropagation();
  ipcRenderer.send('trigger-agent', { agentId, action });
};

ipcRenderer.on('agent-action-result', () => {
  setTimeout(refreshState, 1000);
});

// ── Chat & Prompt Dispatch ────────────────────────────────────────────
function dispatchPrompt() {
  const prompt = chatInput.value.trim();
  if (!prompt) return;
  chatInput.value = '';

  // Append user bubble
  const uBubble = document.createElement('div');
  uBubble.className = 'chat-bubble user';
  uBubble.textContent = `[TO ${currentAgent.toUpperCase()}]: ${prompt}`;
  chatMessages.appendChild(uBubble);

  // Append agent response placeholder
  const aBubble = document.createElement('div');
  aBubble.className = 'chat-bubble agent';
  aBubble.innerHTML = `<i>${currentAgent.toUpperCase()} processing task via ${currentModel}...</i>`;
  chatMessages.appendChild(aBubble);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  ipcRenderer.send('prompt-agent', {
    agentId: currentAgent,
    prompt: prompt,
    model: currentModel
  });

  ipcRenderer.once('prompt-response', (event, res) => {
    aBubble.innerHTML = `<b>${res.agentId.toUpperCase()} RESPONSE:</b><br>` + res.text.replace(/\n/g, '<br>');
    chatMessages.scrollTop = chatMessages.scrollHeight;
  });
}

document.getElementById('btn-send-prompt').addEventListener('click', dispatchPrompt);
chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') dispatchPrompt();
});

// Initial boot fetch
refreshState();
setInterval(refreshState, 5000);
