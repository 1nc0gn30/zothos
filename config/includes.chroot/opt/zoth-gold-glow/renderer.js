// ── Zoth Gold Aura — canvas renderer ─────────────────────────────────────────
// Pure rAF particle engine. No DOM libs, no framework. Draws a magical gold
// aura around the global cursor: a soft glowing core, an alchemical radial
// halo, and a trailing particle stream that intensifies with velocity.
// Fully click-through (the window ignores mouse input) — this is pure OS layer.
//
// Cursor source: the renderer polls xdotool ITSELF via nodeIntegration. The
// main process often has no DISPLAY (stale reads); the renderer renders on the
// display it reads, so self-polling is the reliable path on X11.

const { ipcRenderer } = require('electron');
const { exec } = require('child_process');

const canvas = document.getElementById('aura');
const ctx = canvas.getContext('2d');
let W = 0, H = 0, DPR = Math.min(2, window.devicePixelRatio || 1);

function resize() {
  W = canvas.clientWidth = window.innerWidth;
  H = canvas.clientHeight = window.innerHeight;
  canvas.width = W * DPR;
  canvas.height = H * DPR;
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
}
window.addEventListener('resize', resize);
resize();

// ── State ────────────────────────────────────────────────────────────────────
let cursor = { x: W / 2, y: H / 2, vx: 0, vy: 0, speed: 0 };
let intensity = 70;          // base aura strength (0-100)
let colorHex = '#ffd700';    // gold
let enabled = true;

// Particle buffer (trail sparkles)
const MAX = 420;
let particles = [];
let sparks = [];

function makeParticle(x, y, speed) {
  const boost = Math.min(1.4, speed / 1400);
  return {
    x: x + (Math.random() - 0.5) * 6,
    y: y + (Math.random() - 0.5) * 6,
    vx: (Math.random() - 0.5) * (0.6 + boost * 1.6),
    vy: (Math.random() - 0.5) * (0.6 + boost * 1.6),
    life: 1.0,
    decay: 0.02 + Math.random() * 0.03,
    size: 2 + Math.random() * 3 + boost * 4,
    gold: Math.random() > 0.35
  };
}

function makeSparks(x, y, n) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2;
    const sp = 1.5 + Math.random() * 5;
    sparks.push({
      x, y,
      vx: Math.cos(a) * sp,
      vy: Math.sin(a) * sp,
      life: 1.0,
      decay: 0.02 + Math.random() * 0.04,
      size: 1 + Math.random() * 2.5
    });
  }
  if (sparks.length > MAX) sparks = sparks.slice(-MAX);
}

// ── Cursor polling (self-poll via xdotool — reliable on the renderer's display)
let lastX = cursor.x, lastY = cursor.y, lastT = performance.now();
function pollCursor() {
  exec('xdotool getmouselocation --shell 2>/dev/null', (err, stdout) => {
    if (!err && stdout) {
      const r = {};
      String(stdout).trim().split('\n').forEach((l) => {
        const [k, val] = l.split('=');
        if (k && val) r[k.toLowerCase()] = parseInt(val);
      });
      if (r.x != null && r.y != null) {
        const now = performance.now();
        const dt = Math.max(1, now - lastT);
        const d = Math.hypot(r.x - lastX, r.y - lastY);
        cursor.x = r.x; cursor.y = r.y;
        cursor.vx = r.x - lastX; cursor.vy = r.y - lastY;
        cursor.speed = (d / dt) * 1000;
        lastX = r.x; lastY = r.y; lastT = now;
      }
    }
  });
}
setInterval(pollCursor, 16);   // ~60 FPS

// ── IPC from main process (toggles / recolor) ─────────────────────────────
ipcRenderer.on('aura-state', (_e, s) => { enabled = !!s.enabled; });
ipcRenderer.on('aura-color', (_e, s) => { colorHex = s.color || '#ffd700'; });

// ── Color helpers ────────────────────────────────────────────────────────────
function hexToRgb(h) {
  let s = (h || '#ffd700').replace('#', '');
  if (s.length === 3) s = s.split('').map(c => c + c).join('');
  const n = parseInt(s, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}
const smooth = (a, b, k) => a + (b - a) * k;

// ── Render loop ──────────────────────────────────────────────────────────────
let smoothSpeed = 0;
function tick() {
  requestAnimationFrame(tick);
  if (W === 0) return;
  ctx.clearRect(0, 0, W, H);
  if (!enabled) return;

  smoothSpeed = smooth(smoothSpeed, cursor.speed, 0.25);
  const boost = Math.min(1.3, smoothSpeed / 1300);
  const { r, g, b } = hexToRgb(colorHex);
  const rgb = `${r},${g},${b}`;

  // 1) Primary aura core (radial gold glow following cursor)
  const coreR = 22 + boost * 46;
  const haloR = 70 + boost * 90;
  const core = ctx.createRadialGradient(cursor.x, cursor.y, 0, cursor.x, cursor.y, haloR);
  core.addColorStop(0, `rgba(${rgb},${(0.55 + intensity / 260)})`);
  core.addColorStop(0.22, `rgba(${rgb},${0.28 + intensity / 420})`);
  core.addColorStop(1, 'rgba(255,215,0,0)');
  ctx.fillStyle = core;
  ctx.beginPath(); ctx.arc(cursor.x, cursor.y, haloR, 0, Math.PI * 2); ctx.fill();

  // 2) Outer alchemical ring (slow rotating sacred halo — interactive pulse)
  const ringPulse = 0.6 + 0.4 * Math.sin(performance.now() / 520);
  ctx.strokeStyle = `rgba(${rgb},${0.16 + ringPulse * 0.2})`;
  ctx.lineWidth = 1.4;
  ctx.beginPath(); ctx.arc(cursor.x, cursor.y, coreR * 1.7, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeStyle = `rgba(${rgb},${0.1})`;
  ctx.beginPath(); ctx.arc(cursor.x, cursor.y, coreR * 2.3, 0, Math.PI * 2); ctx.stroke();

  // 3) Particle trail
  ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    p.x += p.vx; p.y += p.vy;
    p.vx *= 0.985; p.vy *= 0.985;
    p.life -= p.decay;
    if (p.life <= 0) { particles.splice(i, 1); i--; continue; }
    const al = p.life * 0.7;
    ctx.fillStyle = p.gold ? `rgba(${rgb},${al})` : `rgba(255,255,255,${al * 0.8})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
    ctx.fill();
  }

  // 4) Fast-motion sparks
  for (let i = 0; i < sparks.length; i++) {
    const s = sparks[i];
    s.x += s.vx; s.y += s.vy; s.life -= s.decay;
    s.vx *= 0.96; s.vy *= 0.96;
    if (s.life <= 0) { sparks.splice(i, 1); i--; continue; }
    ctx.fillStyle = `rgba(${rgb},${s.life * 0.9})`;
    ctx.beginPath(); ctx.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalCompositeOperation = 'source-over';
}

tick();