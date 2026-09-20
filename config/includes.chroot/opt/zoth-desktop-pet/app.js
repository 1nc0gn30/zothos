const { ipcRenderer } = require('electron');

const speechBubble = document.getElementById('speech-bubble');
const bubbleAgent = document.getElementById('bubble-agent');
const bubbleText = document.getElementById('bubble-text');
const eyePupil = document.getElementById('eye-pupil');
const petMenu = document.getElementById('pet-menu');

const THOUGHTS = [
  "⚡ Sentinel AI: OS Memory cache clean. 0 vulnerabilities detected.",
  "🌿 Hermetic Matrix Active: Cyber-Alchemical phosphor glow engaged.",
  "👻 NullAI Ghostmode: Transparent Tor routing verified on Port 9040.",
  "👑 Azoth 24K Gold: Sovereign Ring-0 authority enclave secure.",
  "🌌 Swarm Nexus: 7 AI agents registered across local & cloud channels."
];

let thoughtIdx = 0;

// Web Audio synth poke sound
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

// Track mouse position to move pupil
window.addEventListener('mousemove', (e) => {
  const rect = eyePupil.parentElement.getBoundingClientRect();
  const eyeCenterX = rect.left + rect.width / 2;
  const eyeCenterY = rect.top + rect.height / 2;

  const deltaX = e.clientX - eyeCenterX;
  const deltaY = e.clientY - eyeCenterY;
  const angle = Math.atan2(deltaY, deltaX);
  const distance = Math.min(10, Math.hypot(deltaX, deltaY) / 10);

  const pupilX = Math.cos(angle) * distance;
  const pupilY = Math.sin(angle) * distance;

  eyePupil.style.transform = `translate(${pupilX}px, ${pupilY}px)`;
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

// Right click to toggle quick launch menu
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
  showSpeech(`Launching ${appName.toUpperCase()}...`, '🚀 ZOTH DESKTOP DISPATCH');
};

// Periodic telemetry polling
ipcRenderer.on('telemetry-update', (event, data) => {
  if (Math.random() < 0.3) {
    showSpeech(`RAM Usage: ${data.usedGB} GB (${data.ramPct}%). Sentinel Daemon: ${data.sentinelActive ? 'ACTIVE' : 'IDLE'}.`);
  }
});

setInterval(() => {
  ipcRenderer.send('get-telemetry');
}, 15000);

// Initial greeting
setTimeout(() => {
  showSpeech("ZothOS Companion Online. Drag me anywhere or click for OS status.");
}, 1200);
