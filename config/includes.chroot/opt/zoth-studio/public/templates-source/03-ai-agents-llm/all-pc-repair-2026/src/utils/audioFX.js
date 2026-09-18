// Synthesized Web Audio API sound effects for interactive UI widgets

let audioCtx = null;
let isMuted = false;

const getAudioContext = () => {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
};

export const setMuted = (muted) => {
  isMuted = muted;
  if (typeof window !== 'undefined') {
    localStorage.setItem('allpc_audio_muted', muted ? 'true' : 'false');
  }
};

export const getMuted = () => {
  if (typeof window !== 'undefined') {
    const val = localStorage.getItem('allpc_audio_muted');
    if (val !== null) isMuted = val === 'true';
  }
  return isMuted;
};

export const playBeep = (frequency = 440, duration = 0.08, type = 'sine') => {
  if (getMuted()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Ignore audio context autoplay restriction errors
  }
};

export const playClickSound = () => {
  playBeep(600, 0.04, 'sine');
};

export const playCalculationSound = () => {
  if (getMuted()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const freqs = [350, 480, 620, 800];
    freqs.forEach((freq, idx) => {
      setTimeout(() => {
        playBeep(freq, 0.06, 'triangle');
      }, idx * 60);
    });
  } catch (e) {}
};

export const playSuccessSound = () => {
  if (getMuted()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        playBeep(freq, 0.1, 'sine');
      }, idx * 70);
    });
  } catch (e) {}
};
