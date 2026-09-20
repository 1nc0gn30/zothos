const { ipcRenderer } = require('electron');

const speechBubble = document.getElementById('speech-bubble');
const bubbleAgent = document.getElementById('bubble-agent');
const bubbleText = document.getElementById('bubble-text');
const eyePupil = document.getElementById('eye-pupil');
const scanBeam = document.getElementById('scan-beam');
const petMenu = document.getElementById('pet-menu');

const THOUGHTS = [
  "⚡ Sentinel AI: OS Memory cache clean. 0 vulnerabilities detected.",
  "🌿 Hermetic Matrix Active: Cyber-Alchemical phosphor glow engaged.",
  "👻 NullAI Ghostmode: Transparent Tor routing verified on Port 9040.",
  "👑 Azoth 24K Gold: Sovereign Ring-0 authority enclave secure.",
  "🌌 Swarm Nexus: 7 AI agents registered across local & cloud channels."
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
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.12);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  } catch (e) {}
}

// 60FPS Global OS Cursor Tracking
ipcRenderer.on('global-cursor-pos', (event, pos) => {
  const eyeSocket = eyePupil.parentElement;
  const socketRect = eyeSocket.getBoundingClientRect();
  
  // Calculate center of eye socket in global screen coordinates
  const eyeGlobalX = pos.windowX + socketRect.left + socketRect.width / 2;
  const eyeGlobalY = pos.windowY + socketRect.top + socketRect.height / 2;

  const deltaX = pos.cursorX - eyeGlobalX;
  const deltaY = pos.cursorY - eyeGlobalY;

  const angle = Math.atan2(deltaY, deltaX);
  const distance = Math.min(12, Math.hypot(deltaX, deltaY) / 45);

  const pupilX = Math.cos(angle) * distance;
  const pupilY = Math.sin(angle) * distance;

  eyePupil.style.transform = `translate(${pupilX}px, ${pupilY}px)`;
});

// Active Window Reading Reaction
ipcRenderer.on('active-window-changed', (event, winTitle) => {
  const lower = winTitle.toLowerCase();
  if (lower.includes('terminal') || lower.includes('code') || lower.includes('hexstrike') || lower.includes('studio') || lower.includes('bash')) {
    if (!isReadingCode) {
      isReadingCode = true;
      eyePupil.classList.add('reading');
      scanBeam.classList.add('active');
      showSpeech(`Reading active window: "${winTitle.substring(0, 32)}..."`, '📖 AI CODE & TASK READER');
    }
  } else {
    if (isReadingCode) {
      isReadingCode = false;
      eyePupil.classList.remove('reading');
      scanBeam.classList.remove('active');
    }
  }
});

function showSpeech(text, agent = '⚡ GHOSTBYTE NULLAI') {
  bubbleAgent.textContent = agent;
  bubbleText.textContent = text;
  speechBubble.classList.add('visible');
  setTimeout(() => {
    speechBubble.classList.remove('visible');
  }, 4500);
}

window.triggerPoke = function() {
  playSound(680, 'triangle');
  thoughtIdx = (thoughtIdx + 1) % THOUGHTS.length;
  showSpeech(THOUGHTS[thoughtIdx]);
};

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
  if (Math.random() < 0.25) {
    showSpeech(`RAM Usage: ${data.usedGB} GB (${data.ramPct}%). Sentinel Supervisor: ${data.sentinelActive ? 'ACTIVE' : 'IDLE'}.`);
  }
});

setInterval(() => {
  ipcRenderer.send('get-telemetry');
}, 16000);

// Initial greeting
setTimeout(() => {
  showSpeech("ZothOS Companion Online. Tracking cursor across OS & reading active windows.");
}, 1000);
