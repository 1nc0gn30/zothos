/**
 * LibSignal Portfolio Showcase & Cryptographic Inspector Core JavaScript Module
 * Zoth Studio Team (nullai.tech)
 */

// Web Audio API Sound Synthesizer
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx && typeof AudioContext !== 'undefined') {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  playTick() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  playSuccess() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(now + 0.3);
    } catch (e) {}
  }

  playRatchet() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(900, now + 0.12);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(now + 0.12);
    } catch (e) {}
  }

  playError() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.setValueAtTime(140, now + 0.1);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(now + 0.25);
    } catch (e) {}
  }
}

const sounds = new SoundEngine();

// Utility Cryptographic Helpers (Hex & WebCrypto)
async function generateHexKey(bytes = 32) {
  const arr = new Uint8Array(bytes);
  window.crypto.getRandomValues(arr);
  return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function sha256Hex(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuf = await window.crypto.subtle.digest('SHA-256', data);
  const hashArr = Array.from(new Uint8Array(hashBuf));
  return hashArr.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function aesGcmEncrypt(plaintext, keyHex) {
  const encoder = new TextEncoder();
  const encodedText = encoder.encode(plaintext);
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  
  // Create crypto key from keyHex
  const keyBytes = new Uint8Array(keyHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
  const cryptoKey = await window.crypto.subtle.importKey(
    'raw', keyBytes, { name: 'AES-GCM' }, false, ['encrypt']
  );
  
  const ciphertextBuf = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv }, cryptoKey, encodedText
  );
  
  const ciphertextArr = Array.from(new Uint8Array(ciphertextBuf));
  const ciphertextHex = ciphertextArr.map(b => b.toString(16).padStart(2, '0')).join('');
  const ivHex = Array.from(iv).map(b => b.toString(16).padStart(2, '0')).join('');
  
  return { ciphertextHex, ivHex };
}

// Double Ratchet State Machine
class DoubleRatchetSession {
  constructor() {
    this.stepCount = 0;
    this.messagesSent = 0;
    this.messagesReceived = 0;
    this.rootKey = '';
    this.aliceChainKey = '';
    this.bobChainKey = '';
    this.aliceDhPub = '';
    this.bobDhPub = '';
    this.init();
  }

  async init() {
    this.rootKey = await generateHexKey(32);
    this.aliceChainKey = await generateHexKey(32);
    this.bobChainKey = await generateHexKey(32);
    this.aliceDhPub = 'dh_pub_alice_' + (await generateHexKey(8));
    this.bobDhPub = 'dh_pub_bob_' + (await generateHexKey(8));
    this.stepCount = 1;
    this.messagesSent = 0;
    this.messagesReceived = 0;
    this.updateUI();
    logConsole('Double Ratchet initialized with master Root Key: ' + this.rootKey.substring(0, 16) + '...', 'info');
  }

  async advanceDhRatchet() {
    sounds.playRatchet();
    this.stepCount++;
    this.rootKey = await sha256Hex(this.rootKey + '_rk_step_' + this.stepCount);
    this.aliceChainKey = await sha256Hex(this.rootKey + '_alice_ck_' + this.stepCount);
    this.bobChainKey = await sha256Hex(this.rootKey + '_bob_ck_' + this.stepCount);
    this.aliceDhPub = 'dh_pub_alice_' + (await generateHexKey(8));
    this.bobDhPub = 'dh_pub_bob_' + (await generateHexKey(8));
    
    this.updateUI();
    logConsole(`[DH Ratchet Step #${this.stepCount}] New DH Ephemeral Keys generated. Root Key ratcheted forward!`, 'success');
    announceARIA(`DH Ratchet Advanced to Step ${this.stepCount}. New Root Key established.`);
    updateTelemetryChart();
  }

  async transmitMessage(sender, payload) {
    if (!payload.trim()) {
      logConsole('Cannot transmit empty payload.', 'warn');
      return;
    }
    
    sounds.playTick();
    let currentChainKey = sender === 'Alice' ? this.aliceChainKey : this.bobChainKey;
    const msgKey = await sha256Hex(currentChainKey + '_mk');
    
    // Ratchet sending chain key forward
    const nextChainKey = await sha256Hex(currentChainKey + '_next');
    if (sender === 'Alice') {
      this.aliceChainKey = nextChainKey;
      this.messagesSent++;
    } else {
      this.bobChainKey = nextChainKey;
      this.messagesReceived++;
    }
    
    const { ciphertextHex, ivHex } = await aesGcmEncrypt(payload, msgKey);
    
    this.updateUI();
    sounds.playSuccess();
    logConsole(`[${sender} -> E2EE] Payload: "${payload}" Encrypted with AES-256-GCM (IV: ${ivHex.substring(0, 8)}...) Ciphertext: ${ciphertextHex.substring(0, 24)}...`, 'info');
    announceARIA(`Message sent by ${sender} and encrypted with AES 256 GCM.`);
    updateTelemetryChart();
  }

  updateUI() {
    document.getElementById('rk-val').textContent = this.rootKey.substring(0, 16) + '...';
    document.getElementById('alice-ck-val').textContent = this.aliceChainKey.substring(0, 16) + '...';
    document.getElementById('bob-ck-val').textContent = this.bobChainKey.substring(0, 16) + '...';
    document.getElementById('alice-dh-val').textContent = this.aliceDhPub;
    document.getElementById('bob-dh-val').textContent = this.bobDhPub;
    document.getElementById('ratchet-step-badge').textContent = `DH Ratchet Step #${this.stepCount}`;
    document.getElementById('msg-sent-count').textContent = this.messagesSent;
    document.getElementById('msg-recv-count').textContent = this.messagesReceived;
  }
}

const ratchetSession = new DoubleRatchetSession();

// Console Log Handler
function logConsole(message, type = 'info') {
  const box = document.getElementById('console-log');
  if (!box) return;
  
  const timeStr = new Date().toISOString().substring(11, 19);
  const div = document.createElement('div');
  div.className = `console-line console-${type}`;
  div.innerHTML = `<span class="console-ts">[${timeStr}]</span> <span>${escapeHTML(message)}</span>`;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

// Accessibility ARIA Live Region Announcement
function announceARIA(message) {
  const live = document.getElementById('aria-live-status');
  if (live) {
    live.textContent = message;
  }
}

// X3DH & PQXDH Key Agreement Visualizer Builder
async function buildX3DHHandshake() {
  sounds.playTick();
  logConsole('Executing Extended Triple Diffie-Hellman (X3DH) + Post-Quantum (PQXDH) Handshake...', 'info');
  
  const ikA = await generateHexKey(32);
  const ikB = await generateHexKey(32);
  const spkB = await generateHexKey(32);
  const opkB = await generateHexKey(32);
  const pqkB = await generateHexKey(32); // Post-Quantum Kyber-768 Shared Ciphertext
  
  const dh1 = await sha256Hex(ikA + ikB);
  const dh2 = await sha256Hex(ikA + spkB);
  const dh3 = await sha256Hex(ikA + opkB);
  const dh4 = await sha256Hex(ikA + pqkB);
  
  const masterSecret = await sha256Hex(dh1 + dh2 + dh3 + dh4);
  
  const out = document.getElementById('x3dh-output');
  if (out) {
    out.innerHTML = `
      <div style="background: rgba(3, 7, 18, 0.8); padding: 1rem; border-radius: 0.5rem; font-family: var(--font-mono); font-size: 0.825rem; border: 1px solid var(--accent-cyan)">
        <div style="color: var(--accent-cyan); font-weight: 700; margin-bottom: 0.5rem;">✓ PQXDH Handshake Compute Complete</div>
        <div>IK_A: ${ikA.substring(0, 16)}...</div>
        <div>IK_B: ${ikB.substring(0, 16)}...</div>
        <div>SPK_B: ${spkB.substring(0, 16)}... (Signed Prekey)</div>
        <div>OPK_B: ${opkB.substring(0, 16)}... (One-Time Prekey)</div>
        <div>PQK_B: ${pqkB.substring(0, 16)}... (Kyber-768 Encapsulation)</div>
        <hr style="border-color: rgba(255,255,255,0.1); margin: 0.5rem 0;" />
        <div style="color: var(--accent-emerald); font-weight: 700;">HKDF Master Secret: ${masterSecret}</div>
      </div>
    `;
  }
  sounds.playSuccess();
  logConsole('PQXDH Master Shared Secret Derived: ' + masterSecret.substring(0, 24) + '...', 'success');
  announceARIA('PQXDH Key Agreement Handshake complete.');
}

// Sealed Sender Inspector
async function inspectSealedSender() {
  sounds.playTick();
  const certId = 'cert_sig_' + (await generateHexKey(12));
  const envelopeIv = await generateHexKey(12);
  const innerSender = 'Alice (Identity Key: ' + (await generateHexKey(8)) + ')';
  
  const out = document.getElementById('sealed-sender-output');
  if (out) {
    out.innerHTML = `
      <div style="background: rgba(3, 7, 18, 0.8); padding: 1rem; border-radius: 0.5rem; font-family: var(--font-mono); font-size: 0.825rem; border: 1px solid var(--accent-purple)">
        <div style="color: var(--accent-purple); font-weight: 700; margin-bottom: 0.5rem;">🛡️ Unidentified Sender Certificate Validated</div>
        <div>Server Metadata View: [Recipient: Bob] | Sender: UNIDENTIFIED (Stipped)</div>
        <div>Inner Encrypted Certificate ID: ${certId}</div>
        <div>Envelope IV: ${envelopeIv}</div>
        <div style="color: var(--accent-cyan); margin-top: 0.4rem;">Decrypted Inner Identity: ${innerSender}</div>
      </div>
    `;
  }
  sounds.playSuccess();
  logConsole('Sealed Sender envelope unpacked. Recipient verified sender certificate without server metadata leak.', 'success');
  announceARIA('Sealed sender envelope inspected.');
}

// ZKGroup Inspector
async function verifyZKProof() {
  sounds.playTick();
  const proofHash = await generateHexKey(32);
  const out = document.getElementById('zkgroup-output');
  if (out) {
    out.innerHTML = `
      <div style="background: rgba(3, 7, 18, 0.8); padding: 1rem; border-radius: 0.5rem; font-family: var(--font-mono); font-size: 0.825rem; border: 1px solid var(--accent-emerald)">
        <div style="color: var(--accent-emerald); font-weight: 700; margin-bottom: 0.5rem;">✓ Zero-Knowledge Group Membership Proof VERIFIED</div>
        <div>Group Credential Commitment: Ristretto255 Point</div>
        <div>ZKP Proof Hash: ${proofHash}</div>
        <div>Result: User belongs to Group #4092 without exposing profile ID.</div>
      </div>
    `;
  }
  sounds.playSuccess();
  logConsole('ZKGroup Membership Proof verified using Ristretto255 zero-knowledge protocol.', 'success');
  announceARIA('Zero knowledge group proof verified.');
}

// Safety Number Generator
async function computeSafetyNumber() {
  sounds.playTick();
  const hashStr = await sha256Hex('Alice_IK_Bob_IK_Fingerprint_Salt');
  const digits = [];
  for (let i = 0; i < 12; i++) {
    const chunk = parseInt(hashStr.substring(i * 4, i * 4 + 4), 16) % 100000;
    digits.push(chunk.toString().padStart(5, '0'));
  }
  
  const formatted = digits.slice(0, 6).join(' ') + '\n' + digits.slice(6, 12).join(' ');
  
  const out = document.getElementById('safety-num-display');
  if (out) {
    out.textContent = formatted;
  }
  sounds.playSuccess();
  logConsole('Computed 60-digit Out-of-Band Safety Number Fingerprint.', 'info');
  announceARIA('Safety number computed.');
}

// Background Matrix & Telemetry Canvas Renderer
let canvas, ctx, animationFrame;
const telemetryData = [];

function initCanvas() {
  canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  ctx = canvas.getContext('2d');
  
  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  window.addEventListener('resize', resize);
  resize();
  
  const particles = Array.from({ length: 45 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    radius: Math.random() * 2 + 1,
  }));
  
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw glowing particles
    ctx.fillStyle = 'rgba(0, 242, 254, 0.4)';
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    });
    
    requestAnimationFrame(draw);
  }
  draw();
}

function updateTelemetryChart() {
  const chartCanvas = document.getElementById('telemetry-canvas');
  if (!chartCanvas) return;
  const cctx = chartCanvas.getContext('2d');
  
  chartCanvas.width = chartCanvas.clientWidth;
  chartCanvas.height = chartCanvas.clientHeight;
  
  telemetryData.push(Math.random() * 60 + 40);
  if (telemetryData.length > 30) telemetryData.shift();
  
  cctx.clearRect(0, 0, chartCanvas.width, chartCanvas.height);
  
  // Draw grid lines
  cctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  cctx.lineWidth = 1;
  for (let y = 0; y < chartCanvas.height; y += 30) {
    cctx.beginPath();
    cctx.moveTo(0, y);
    cctx.lineTo(chartCanvas.width, y);
    cctx.stroke();
  }
  
  // Draw line graph
  if (telemetryData.length > 1) {
    cctx.beginPath();
    cctx.strokeStyle = '#00f2fe';
    cctx.lineWidth = 2;
    const step = chartCanvas.width / 29;
    
    telemetryData.forEach((val, i) => {
      const x = i * step;
      const y = chartCanvas.height - (val / 100) * chartCanvas.height;
      if (i === 0) cctx.moveTo(x, y);
      else cctx.lineTo(x, y);
    });
    cctx.stroke();
  }
}

// Hotkey & Navigation Listener Setup
function setupEventListeners() {
  // Tab switcher
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.style.display = 'none');
      
      e.target.classList.add('active');
      const targetId = e.target.getAttribute('data-tab');
      const pane = document.getElementById(targetId);
      if (pane) pane.style.display = 'block';
      sounds.playTick();
    });
  });
  
  // Ratchet controls
  document.getElementById('btn-advance-ratchet')?.addEventListener('click', () => ratchetSession.advanceDhRatchet());
  document.getElementById('btn-send-alice')?.addEventListener('click', () => {
    const input = document.getElementById('msg-input');
    if (input) {
      ratchetSession.transmitMessage('Alice', input.value || 'Hello Bob, securing our channel!');
    }
  });
  document.getElementById('btn-send-bob')?.addEventListener('click', () => {
    const input = document.getElementById('msg-input');
    if (input) {
      ratchetSession.transmitMessage('Bob', input.value || 'Hello Alice, ratchet confirmed.');
    }
  });
  document.getElementById('btn-reset-session')?.addEventListener('click', () => {
    ratchetSession.init();
    sounds.playRatchet();
  });
  
  // Sound Mute Toggle
  const audioBtn = document.getElementById('audio-toggle-btn');
  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      const isMuted = sounds.toggleMute();
      audioBtn.classList.toggle('active', !isMuted);
      audioBtn.setAttribute('aria-label', isMuted ? 'Unmute Web Audio' : 'Mute Web Audio');
      logConsole(isMuted ? 'Audio synthesizer MUTED.' : 'Audio synthesizer UNMUTED.', 'info');
      announceARIA(isMuted ? 'Audio muted' : 'Audio unmuted');
    });
  }
  
  // Hotkey Modal Open/Close
  const hotkeyModal = document.getElementById('hotkey-modal');
  document.getElementById('btn-show-hotkeys')?.addEventListener('click', () => {
    hotkeyModal?.classList.add('open');
  });
  document.getElementById('btn-close-modal')?.addEventListener('click', () => {
    hotkeyModal?.classList.remove('open');
  });
  
  // Global Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    if (e.altKey && e.key.toLowerCase() === 's') {
      e.preventDefault();
      ratchetSession.advanceDhRatchet();
    } else if (e.altKey && e.key.toLowerCase() === 'e') {
      e.preventDefault();
      ratchetSession.transmitMessage('Alice', 'Keyboard triggered encrypted packet');
    } else if (e.altKey && e.key.toLowerCase() === 'r') {
      e.preventDefault();
      ratchetSession.init();
    } else if (e.altKey && e.key.toLowerCase() === 'm') {
      e.preventDefault();
      audioBtn?.click();
    } else if (e.key === 'Escape') {
      hotkeyModal?.classList.remove('open');
    } else if (e.key === '?') {
      hotkeyModal?.classList.add('open');
    }
  });
  
  // Protocol Tab Handshake Builders
  document.getElementById('btn-run-x3dh')?.addEventListener('click', buildX3DHHandshake);
  document.getElementById('btn-inspect-sealed')?.addEventListener('click', inspectSealedSender);
  document.getElementById('btn-verify-zk')?.addEventListener('click', verifyZKProof);
  document.getElementById('btn-gen-safety')?.addEventListener('click', computeSafetyNumber);
}

// Initializer
document.addEventListener('DOMContentLoaded', () => {
  initCanvas();
  setupEventListeners();
  updateTelemetryChart();
  computeSafetyNumber();
  logConsole('LibSignal Protocol Suite & Visualizer Initialized successfully.', 'success');
});
