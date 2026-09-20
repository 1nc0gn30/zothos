const { ipcRenderer } = require('electron');

let currentActiveReality = 'matrix';

function playSound(freq = 440, type = 'sine') {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch (e) {}
}

ipcRenderer.send('get-current-reality');

ipcRenderer.on('current-reality', (event, reality) => {
  setActive(reality);
});

function setActive(reality) {
  currentActiveReality = reality;
  ['matrix', 'ghost', 'gold', 'win11'].forEach(r => {
    const card = document.getElementById(`card-${r}`);
    const badge = document.getElementById(`badge-${r}`);
    if (r === reality) {
      card.classList.add('active');
      badge.textContent = '● ACTIVE REALITY';
    } else {
      card.classList.remove('active');
      badge.textContent = 'STANDBY';
    }
  });
}

window.triggerSwitch = function(reality) {
  if (reality === 'matrix') playSound(520, 'triangle');
  if (reality === 'ghost') playSound(220, 'sawtooth');
  if (reality === 'gold') playSound(680, 'sine');
  if (reality === 'win11') playSound(440, 'square');

  const badge = document.getElementById(`badge-${reality}`);
  badge.textContent = 'TRANSMUTING...';

  ipcRenderer.send('switch-reality', reality);
};

ipcRenderer.on('switch-complete', (event, res) => {
  if (res.success) {
    setActive(res.reality);
  }
});

window.toggleLiveWallpaper = function() {
  playSound(600, 'sine');
  ipcRenderer.send('toggle-live-wallpaper');
};

ipcRenderer.on('live-wallpaper-status', (event, isActive) => {
  const btn = document.getElementById('btn-live-wp');
  btn.textContent = isActive ? 'STOP 3D WALLPAPER' : 'START 3D WALLPAPER';
});

// Keyboard shortcuts (1, 2, 3, 4)
window.addEventListener('keydown', (e) => {
  if (e.key === '1') window.triggerSwitch('matrix');
  if (e.key === '2') window.triggerSwitch('ghost');
  if (e.key === '3') window.triggerSwitch('gold');
  if (e.key === '4') window.triggerSwitch('win11');
});
