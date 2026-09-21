const { ipcRenderer } = require('electron');

const speechBubble = document.getElementById('speech-bubble');
const bubbleAgent = document.getElementById('bubble-agent');
const bubbleText = document.getElementById('bubble-text');
const eyeIris = document.getElementById('eye-iris');
const eyePupil = document.getElementById('eye-pupil');
const scanBeam = document.getElementById('scan-beam');
const petMenu = document.getElementById('pet-menu');
const chatInput = document.getElementById('chat-input');
const mascotWrapper = document.querySelector('.mascot-wrapper');
const container = document.querySelector('.container');
const orbCore = document.querySelector('.orb-core');

const THOUGHTS = [
  "⚡ Sentinel AI: OS Memory & history buffer active. Zero anomalies.",
  "👁️ All-Seeing Eye: Recorded active window vector & cursor trajectory.",
  "👻 NullAI Ghostmode: Transparent Tor routing verified on Port 9040.",
  "👑 Azoth 24K Gold: Sovereign Ring-0 authority enclave active.",
  "🌌 Swarm Nexus: Multi-agent swarm monitoring desktop environment."
];

let thoughtIdx = 0;
let isReadingCode = false;
let isKeyboardActive = false;
let particleContainer = null;

// Create particle container for cursor trail
function initParticleSystem() {
  particleContainer = document.createElement('div');
  particleContainer.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:15;overflow:hidden;';
  document.querySelector('.container').prepend(particleContainer);
}
initParticleSystem();

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

// 60FPS Global OS Cursor Tracking with velocity awareness
ipcRenderer.on('global-cursor-pos', (event, pos) => {
  if (!eyeIris) return;
  const eyeSocket = eyeIris.parentElement;
  const socketRect = eyeSocket.getBoundingClientRect();
  
  const eyeGlobalX = pos.windowX + socketRect.left + socketRect.width / 2;
  const eyeGlobalY = pos.windowY + socketRect.top + socketRect.height / 2;

  const deltaX = pos.cursorX - eyeGlobalX;
  const deltaY = pos.cursorY - eyeGlobalY;
  const angle = Math.atan2(deltaY, deltaX);
  const distTotal = Math.hypot(deltaX, deltaY);

  const maxRadius = 16;
  const distance = Math.min(maxRadius, distTotal / 18);
  const pupilX = Math.cos(angle) * distance;
  const pupilY = Math.sin(angle) * distance;

  eyeIris.style.transform = `translate(${pupilX}px, ${pupilY}px)`;

  // PARTICLE TRAIL: spawn particles when cursor moves fast
  if (pos.velocity > 500) {
    spawnParticleTrail(pos.cursorX, pos.cursorY, pos.velocity);
  }
});

// Particle trail effect
function spawnParticleTrail(cursorX, cursorY, velocity) {
  const particleCount = Math.min(5, Math.floor(velocity / 200));
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    const offsetX = (Math.random() - 0.5) * 20;
    const offsetY = (Math.random() - 0.5) * 20;
    const size = Math.random() * 4 + 2;
    particle.style.cssText = `
      position:absolute;
      left:${cursorX + offsetX}px;
      top:${cursorY + offsetY}px;
      width:${size}px;
      height:${size}px;
      border-radius:50%;
      background:rgba(0,255,157,${0.6 + Math.random()*0.4});
      box-shadow:0 0 ${size*2}px rgba(0,255,157,0.8);
      pointer-events:none;
      z-index:16;
      transition:opacity 0.6s ease-out, transform 0.6s ease-out;
      transform:translate(0,0) scale(1);
    `;
    particleContainer.appendChild(particle);
    
    // Animate: drift outward and fade
    const driftX = (Math.random() - 0.5) * 30;
    const driftY = -Math.random() * 20 - 5;
    requestAnimationFrame(() => {
      particle.style.transform = `translate(${driftX}px, ${driftY}px) scale(0.3)`;
      particle.style.opacity = '0';
    });
    
    // Remove after animation
    setTimeout(() => { if (particle.parentNode) particle.remove(); }, 700);
  }
}

// Interactive Desktop Dragging Logic
let isDraggingPet = false;
let dragStartX = 0;
let dragStartY = 0;

if (mascotWrapper) {
  mascotWrapper.addEventListener('mousedown', (e) => {
    if (e.button === 0) {
      isDraggingPet = true;
      dragStartX = e.screenX;
      dragStartY = e.screenY;
      // Focus state: pupil dilates on click
      eyePupil.classList.add('focused');
      setTimeout(() => eyePupil.classList.remove('focused'), 800);
      playSound(880, 'sine');
    }
  });

  window.addEventListener('mousemove', (e) => {
    if (isDraggingPet) {
      const deltaX = e.screenX - dragStartX;
      const deltaY = e.screenY - dragStartY;
      dragStartX = e.screenX;
      dragStartY = e.screenY;
      ipcRenderer.send('move-pet-window', { deltaX, deltaY });
    }
  });

  window.addEventListener('mouseup', () => { isDraggingPet = false; });
}

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

// Keyboard activity — pause bobbing when typing
ipcRenderer.on('keyboard-active', (event, data) => {
  isKeyboardActive = data.active;
  if (container) {
    if (data.active) {
      container.classList.add('keyboard-active');
    } else {
      container.classList.remove('keyboard-active');
    }
  }
});

// Clipboard change — orb pulse
ipcRenderer.on('clipboard-changed', (event, data) => {
  // Orb pulse animation
  if (orbCore) {
    orbCore.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    orbCore.style.transform = 'scale(1.08)';
    setTimeout(() => {
      orbCore.style.transform = 'scale(1.0)';
    }, 50);
    setTimeout(() => {
      orbCore.style.transform = '';
    }, 400);
  }
  showSpeech(`Clipboard event detected. Hash recorded.`, '👁️ CLIPBOARD MONITOR');
});

// Process tree change — subtle orb shimmer
ipcRenderer.on('process-tree-changed', (event, tree) => {
  if (orbCore && tree.length > 0) {
    orbCore.style.boxShadow = '0 0 40px rgba(0,255,157,0.9), inset 0 0 25px rgba(255,255,255,0.9)';
    setTimeout(() => {
      orbCore.style.boxShadow = '';
    }, 300);
  }
});

// Journal update — subtle notification
ipcRenderer.on('journal-update', (event, data) => {
  if (data.unit && data.unit !== 'eye-init') {
    showSpeech(`System event: ${data.summary.substring(0, 40)}`, '⚙️ JOURNAL');
  }
});

// History summary — update thought on telemetry
ipcRenderer.on('history-summary', (event, summary) => {
  // Optional: update the THOUGHTS display with real data
});

function showSpeech(text, agent = '👁️ ALL-SEEING EYE AI') {
  bubbleAgent.textContent = agent;
  bubbleText.textContent = text;
  speechBubble.classList.add('visible');
  setTimeout(() => { speechBubble.classList.remove('visible'); }, 6500);
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
  if (event.key === 'Enter') { sendChatQuery(); }
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

window.toggleMenu = function() { petMenu.classList.remove('active'); };

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

setInterval(() => { ipcRenderer.send('get-telemetry'); }, 18000);

// Request history summary on startup
setTimeout(() => {
  ipcRenderer.send('get-history-summary');
}, 3000);

// Initial greeting
setTimeout(() => {
  showSpeech("👁️ All-Seeing Eye Active. Tracking cursor globally, recording every window, clipboard, process, and journal event. Speak to me below!");
}, 1000);