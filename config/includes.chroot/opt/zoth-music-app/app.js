const { ipcRenderer } = require('electron');

let tracks = [];
let currentIdx = 0;
let isPlaying = false;

const audio = document.getElementById('audio-player');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const titleLbl = document.getElementById('now-playing-title');
const subLbl = document.getElementById('now-playing-sub');
const curTimeLbl = document.getElementById('cur-time');
const durTimeLbl = document.getElementById('dur-time');
const seekBar = document.getElementById('seek-bar');
const volSlider = document.getElementById('vol-slider');
const trackListEl = document.getElementById('track-list');
const medallion = document.getElementById('medallion');
const canvas = document.getElementById('visualizer');
const ctx = canvas.getContext('2d');

let audioCtx, analyser, dataArray;

function initAudioContext() {
  if (audioCtx) return;
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioCtx.createMediaElementSource(audio);
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 64;
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
    dataArray = new Uint8Array(analyser.frequencyBinCount);
    drawVisualizer();
  } catch (e) {
    console.error(e);
  }
}

function drawVisualizer() {
  requestAnimationFrame(drawVisualizer);
  const w = canvas.width = canvas.offsetWidth;
  const h = canvas.height = canvas.offsetHeight;
  ctx.clearRect(0, 0, w, h);

  if (!analyser || !isPlaying) {
    ctx.fillStyle = 'rgba(255, 215, 0, 0.15)';
    ctx.fillRect(0, h / 2 - 1, w, 2);
    return;
  }

  analyser.getByteFrequencyData(dataArray);
  const barWidth = (w / dataArray.length) * 1.5;
  let x = 0;

  for (let i = 0; i < dataArray.length; i++) {
    const barHeight = (dataArray[i] / 255) * h;
    const grad = ctx.createLinearGradient(0, h, 0, 0);
    grad.addColorStop(0, 'rgba(218, 165, 32, 0.3)');
    grad.addColorStop(1, '#ffd700');
    ctx.fillStyle = grad;
    ctx.fillRect(x, h - barHeight, barWidth - 2, barHeight);
    x += barWidth;
  }
}

ipcRenderer.send('get-tracks');

ipcRenderer.on('tracks-list', (event, loaded) => {
  tracks = loaded;
  document.getElementById('track-count').textContent = `${tracks.length} TRACKS`;
  renderTrackList();
  if (tracks.length > 0) {
    loadTrack(0, false);
  }
});

function renderTrackList() {
  trackListEl.innerHTML = '';
  tracks.forEach((t, i) => {
    const item = document.createElement('div');
    item.className = `track-item ${i === currentIdx ? 'active' : ''}`;
    item.onclick = () => loadTrack(i, true);
    item.innerHTML = `
      <span class="track-num">${String(i + 1).padStart(2, '0')}</span>
      <span class="track-title">${t.title}</span>
      <span class="track-playing-icon">${i === currentIdx && isPlaying ? '🔊' : ''}</span>
    `;
    trackListEl.appendChild(item);
  });
}

function loadTrack(idx, autoPlay = true) {
  if (!tracks[idx]) return;
  currentIdx = idx;
  const t = tracks[idx];
  titleLbl.textContent = t.title;
  subLbl.textContent = 'HERMETIC FOCUS TRACK';
  audio.src = `file://${t.path}`;
  renderTrackList();
  if (autoPlay) {
    playTrack();
  }
}

function playTrack() {
  initAudioContext();
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  audio.play().then(() => {
    isPlaying = true;
    playBtn.textContent = '⏸';
    medallion.classList.remove('paused');
    renderTrackList();
  }).catch(e => console.error(e));
}

function pauseTrack() {
  audio.pause();
  isPlaying = false;
  playBtn.textContent = '▶';
  medallion.classList.add('paused');
  renderTrackList();
}

playBtn.onclick = () => {
  if (isPlaying) pauseTrack();
  else playTrack();
};

prevBtn.onclick = () => {
  let prev = currentIdx - 1;
  if (prev < 0) prev = tracks.length - 1;
  loadTrack(prev, true);
};

nextBtn.onclick = () => {
  let next = (currentIdx + 1) % tracks.length;
  loadTrack(next, true);
};

audio.onended = () => {
  let next = (currentIdx + 1) % tracks.length;
  loadTrack(next, true);
};

audio.ontimeupdate = () => {
  if (!audio.duration) return;
  const progress = (audio.currentTime / audio.duration) * 100;
  seekBar.value = progress;
  curTimeLbl.textContent = formatTime(audio.currentTime);
  durTimeLbl.textContent = formatTime(audio.duration);
};

seekBar.oninput = () => {
  if (!audio.duration) return;
  audio.currentTime = (seekBar.value / 100) * audio.duration;
};

volSlider.oninput = () => {
  audio.volume = volSlider.value;
};

function formatTime(sec) {
  if (isNaN(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}
