const { ipcRenderer } = require('electron');

const speechBubble = document.getElementById('speech-bubble');
const bubbleAgent = document.getElementById('bubble-agent');
const bubbleText = document.getElementById('bubble-text');
const eyeIris = document.getElementById('eye-iris');
const eyePupil = document.getElementById('eye-pupil');
const scanBeam = document.getElementById('scan-beam');
const petMenu = document.getElementById('pet-menu');
const chatInput = document.getElementById('chat-input');

const THOUGHTS = [
  "⚡ Sentinel AI: OS Memory & history buffer active. Zero anomalies.",
  "👁️ All-Seeing Eye: Recorded active window vector & cursor trajectory.",
  "👻 NullAI Ghostmode: Transparent Tor routing verified on Port 9040.",
  "👑 Azoth 24K Gold: Sovereign Ring-0 authority enclave active.",
  "🌌 Swarm Nexus: Multi-agent swarm monitoring desktop environment."
];

let thoughtIdx = 0;
let isReadingCode = false;

// Synthesized Web Audio Acoustic Feedback
function playSound(freq = 520, type = 'sine') {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.4, ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.12);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  } catch (e) {}
}

// 60FPS Global OS Cursor Tracking
ipcRenderer.on('global-cursor-pos', (event, pos) => {
  if (!eyeIris) return;
  const eyeSocket = eyeIris.parentElement;
  const socketRect = eyeSocket.getBoundingClientRect();
  
  // Calculate center of eye socket in global screen coordinates
  const eyeGlobalX = pos.windowX + socketRect.left + socketRect.width / 2;
  const eyeGlobalY = pos.windowY + socketRect.top + socketRect.height / 2;

  const deltaX = pos.cursorX - eyeGlobalX;
  const deltaY = pos.cursorY - eyeGlobalY;

  const angle = Math.atan2(deltaY, deltaX);
  const distance = Math.min(11, Math.hypot(deltaX, deltaY) / 40);

  const pupilX = Math.cos(angle) * distance;
  const pupilY = Math.sin(angle) * distance;

  eyeIris.style.transform = `translate(${pupilX}px, ${pupilY}px)`;
});

// Active Window Reading & Recording Reaction
ipcRenderer.on('active-window-changed', (event, winTitle) => {
  const lower = winTitle.toLowerCase();
  if (lower.includes('terminal') || lower.includes('code') || lower.includes('hexstrike') || lower.includes('studio') || lower.includes('bash')) {
    if (!isReadingCode) {
      isReadingCode = true;
      eyePupil.classList.add('reading');
      scanBeam.classList.add('active');
      showSpeech(`Recording active workspace: "${winTitle.substring(0, 32)}..."`, '👁️ ALL-SEEING EYE OBSERVER');
    }
  } else {
    if (isReadingCode) {
      isReadingCode = false;
      eyePupil.classList.remove('reading');
      scanBeam.classList.remove('active');
    }
  }
});

function showSpeech(text, agent = '👁️ ALL-SEEING EYE AI') {
  bubbleAgent.textContent = agent;
  bubbleText.textContent = text;
  speechBubble.classList.add('visible');
  setTimeout(() => {
    speechBubble.classList.remove('visible');
  }, 6500);
}

window.triggerPoke = function() {
  playSound(680, 'triangle');
  thoughtIdx = (thoughtIdx + 1) % THOUGHTS.length;
  showSpeech(THOUGHTS[thoughtIdx]);
};

window.sendChatQuery = function() {
  const query = chatInput.value.trim();
  if (!query) return;
  chatInput.value = '';
  playSound(780, 'sine');
  showSpeech(`Thinking: "${query}"...`, '👁️ QWEN REASONING');
  ipcRenderer.send('query-all-seeing-eye', query);
};

window.handleChatKey = function(event) {
  if (event.key === 'Enter') {
    sendChatQuery();
  }
};

ipcRenderer.on('all-seeing-eye-response', (event, responseText) => {
  playSound(920, 'sine');
  showSpeech(responseText, '👁️ ALL-SEEING EYE QWEN');
});

// Right click context menu
window.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  petMenu.classList.toggle('active');
});

window.toggleMenu = function() {
  petMenu.classList.remove('active');
};

window.launch = function(appName) {
  playSound(880, 'sine');
  ipcRenderer.send('launch-app', appName);
  petMenu.classList.remove('active');
  showSpeech(`Launching ${appName.toUpperCase()}...`, '🚀 ZOTH DISPATCH');
};

// Telemetry Polling
ipcRenderer.on('telemetry-update', (event, data) => {
  if (Math.random() < 0.2) {
    showSpeech(`RAM Buffer: ${data.usedGB} GB (${data.ramPct}%). All-Seeing Eye sentinel recording continuously.`);
  }
});

setInterval(() => {
  ipcRenderer.send('get-telemetry');
}, 18000);

// Initial greeting
setTimeout(() => {
  showSpeech("👁️ All-Seeing Eye Active. Recording OS events & tracking cursor globally. Speak to me below!");
}, 1000);
