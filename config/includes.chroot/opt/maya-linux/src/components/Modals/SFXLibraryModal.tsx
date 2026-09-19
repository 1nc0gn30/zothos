import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Square, 
  Plus, 
  Search, 
  X, 
  Sparkles, 
  Zap, 
  Check, 
  Activity, 
  Music, 
  Clock, 
  Flame, 
  Layers, 
  Grid, 
  Headphones, 
  SlidersHorizontal,
  MousePointerClick,
  Wand2,
  Radio,
  Disc,
  ArrowRight
} from 'lucide-react';
import { ProjectState } from '../../types/project';
import { AudioTrack } from '../../types/models';
import { soundManager, AUDIO_SFX_PRESETS } from '../../services/audioService';

export type SFXCategory = 'All' | 'UI & Clicks' | 'Transitions' | 'Impacts & Stingers';

export interface SFXItem {
  id: string;
  name: string;
  subtitle: string;
  category: 'UI & Clicks' | 'Transitions' | 'Impacts & Stingers';
  duration: number; // in seconds
  shortcutKey: string;
  tags: string[];
  colorHex: string;
  glowColor: string;
  gradientClass: string;
  waveformProfile: number[]; // 28 normalized amplitude bars (0..1)
  play: () => void;
}

// 28-point precise amplitude envelopes for each sound effect
const SFX_ITEMS: SFXItem[] = [
  {
    id: 'tap',
    name: 'Tap Click',
    subtitle: 'Mobile / UI tap',
    category: 'UI & Clicks',
    duration: 0.04,
    shortcutKey: '1',
    tags: ['tap', 'click', 'mobile', 'ui', 'button', 'touch', 'interface', 'subtle'],
    colorHex: '#10B981', // emerald
    glowColor: 'rgba(16, 185, 129, 0.4)',
    gradientClass: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
    waveformProfile: [
      0.15, 0.95, 0.72, 0.35, 0.15, 0.06, 0.02, 0.0, 0.0, 0.0,
      0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
      0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0
    ],
    play: () => soundManager.playTapClick(),
  },
  {
    id: 'pop',
    name: 'Bubble Pop',
    subtitle: 'Playful notification pop',
    category: 'UI & Clicks',
    duration: 0.09,
    shortcutKey: '2',
    tags: ['bubble', 'pop', 'notification', 'alert', 'cute', 'playful', 'chirp'],
    colorHex: '#06B6D4', // cyan
    glowColor: 'rgba(6, 182, 212, 0.4)',
    gradientClass: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-400',
    waveformProfile: [
      0.12, 0.28, 0.65, 0.98, 0.88, 0.54, 0.26, 0.12, 0.04, 0.01,
      0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
      0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0
    ],
    play: () => soundManager.playPop(),
  },
  {
    id: 'whoosh',
    name: 'Whoosh',
    subtitle: 'Fast screen swipe transition',
    category: 'Transitions',
    duration: 0.28,
    shortcutKey: '3',
    tags: ['whoosh', 'swipe', 'transition', 'air', 'fast', 'whip', 'motion'],
    colorHex: '#6366F1', // indigo
    glowColor: 'rgba(99, 102, 241, 0.4)',
    gradientClass: 'from-indigo-500/20 to-violet-500/10 border-indigo-500/30 text-indigo-400',
    waveformProfile: [
      0.05, 0.08, 0.14, 0.24, 0.42, 0.68, 0.88, 0.98, 0.92, 0.78,
      0.58, 0.40, 0.25, 0.14, 0.07, 0.03, 0.01, 0.0, 0.0, 0.0,
      0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0
    ],
    play: () => soundManager.playWhoosh(),
  },
  {
    id: 'ding',
    name: 'Success Ding',
    subtitle: 'Reward chime',
    category: 'Impacts & Stingers',
    duration: 1.20,
    shortcutKey: '4',
    tags: ['ding', 'chime', 'bell', 'success', 'reward', 'win', 'achievement', 'sparkle'],
    colorHex: '#FBBF24', // amber
    glowColor: 'rgba(251, 191, 36, 0.4)',
    gradientClass: 'from-amber-500/20 to-yellow-500/10 border-amber-500/30 text-amber-400',
    waveformProfile: [
      0.98, 0.88, 0.76, 0.66, 0.58, 0.52, 0.46, 0.42, 0.38, 0.35,
      0.32, 0.29, 0.26, 0.24, 0.21, 0.19, 0.17, 0.15, 0.13, 0.11,
      0.10, 0.08, 0.07, 0.05, 0.04, 0.03, 0.02, 0.01
    ],
    play: () => soundManager.playDing(),
  },
  {
    id: 'glitch',
    name: 'Cyber Glitch',
    subtitle: 'Digital sci-fi noise',
    category: 'Transitions',
    duration: 0.16,
    shortcutKey: '5',
    tags: ['glitch', 'digital', 'cyber', 'scifi', 'noise', 'distortion', 'tech', 'stutter'],
    colorHex: '#EC4899', // pink/magenta
    glowColor: 'rgba(236, 72, 153, 0.4)',
    gradientClass: 'from-pink-500/20 to-fuchsia-500/10 border-pink-500/30 text-pink-400',
    waveformProfile: [
      0.82, 0.25, 0.94, 0.48, 0.18, 0.88, 0.72, 0.32, 0.85, 0.64,
      0.38, 0.78, 0.22, 0.55, 0.14, 0.05, 0.01, 0.0, 0.0, 0.0,
      0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0
    ],
    play: () => soundManager.playGlitch(),
  },
  {
    id: 'laser',
    name: 'Laser Zap',
    subtitle: 'Focused beam click',
    category: 'UI & Clicks',
    duration: 0.16,
    shortcutKey: '6',
    tags: ['laser', 'zap', 'beam', 'click', 'plasma', 'shot', 'focus', 'scifi'],
    colorHex: '#F43F5E', // rose
    glowColor: 'rgba(244, 63, 94, 0.4)',
    gradientClass: 'from-rose-500/20 to-red-500/10 border-rose-500/30 text-rose-400',
    waveformProfile: [
      0.95, 0.90, 0.82, 0.70, 0.58, 0.46, 0.35, 0.25, 0.17, 0.11,
      0.06, 0.03, 0.01, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
      0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0
    ],
    play: () => soundManager.playLaser(),
  },
  {
    id: 'swoosh',
    name: 'Deep Swoosh',
    subtitle: 'Cinematic trailer swoosh',
    category: 'Transitions',
    duration: 0.48,
    shortcutKey: '7',
    tags: ['swoosh', 'deep', 'cinematic', 'trailer', 'riser', 'heavy', 'air', 'flyby'],
    colorHex: '#8B5CF6', // purple
    glowColor: 'rgba(139, 92, 246, 0.4)',
    gradientClass: 'from-purple-500/20 to-violet-500/10 border-purple-500/30 text-purple-400',
    waveformProfile: [
      0.08, 0.14, 0.24, 0.38, 0.58, 0.80, 0.96, 1.00, 0.86, 0.70,
      0.54, 0.38, 0.26, 0.16, 0.09, 0.05, 0.02, 0.01, 0.0, 0.0,
      0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0
    ],
    play: () => soundManager.playSwoosh(),
  },
  {
    id: 'bass',
    name: '808 Bass Drop',
    subtitle: 'Sub bass impact',
    category: 'Impacts & Stingers',
    duration: 0.95,
    shortcutKey: '8',
    tags: ['bass', '808', 'drop', 'impact', 'sub', 'boom', 'hit', 'heavy', 'thump'],
    colorHex: '#FB923C', // orange
    glowColor: 'rgba(251, 146, 60, 0.4)',
    gradientClass: 'from-orange-500/20 to-amber-500/10 border-orange-500/30 text-orange-400',
    waveformProfile: [
      1.00, 0.94, 0.88, 0.82, 0.76, 0.70, 0.64, 0.58, 0.52, 0.46,
      0.40, 0.35, 0.30, 0.25, 0.20, 0.16, 0.12, 0.09, 0.06, 0.04,
      0.03, 0.02, 0.01, 0.01, 0.0, 0.0, 0.0, 0.0
    ],
    play: () => soundManager.playBassDrop(),
  },
];

// Audio buffer to standard 16-bit PCM WAV Blob converter
function audioBufferToWavBlob(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;
  const dataByteLength = buffer.length * numChannels * bytesPerSample;
  
  const arrayBuffer = new ArrayBuffer(44 + dataByteLength);
  const view = new DataView(arrayBuffer);

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  /* RIFF identifier */
  writeString(0, 'RIFF');
  /* file length */
  view.setUint32(4, 36 + dataByteLength, true);
  /* RIFF type */
  writeString(8, 'WAVE');
  /* format chunk identifier */
  writeString(12, 'fmt ');
  /* format chunk length */
  view.setUint32(16, 16, true);
  /* sample format (raw PCM = 1) */
  view.setUint16(20, format, true);
  /* channel count */
  view.setUint16(22, numChannels, true);
  /* sample rate */
  view.setUint32(24, sampleRate, true);
  /* byte rate */
  view.setUint32(28, sampleRate * blockAlign, true);
  /* block align */
  view.setUint16(32, blockAlign, true);
  /* bits per sample */
  view.setUint16(34, bitDepth, true);
  /* data chunk identifier */
  writeString(36, 'data');
  /* data chunk length */
  view.setUint32(40, dataByteLength, true);

  const channelData: Float32Array[] = [];
  for (let i = 0; i < numChannels; i++) {
    channelData.push(buffer.getChannelData(i));
  }

  let offset = 44;
  for (let i = 0; i < buffer.length; i++) {
    for (let channel = 0; channel < numChannels; channel++) {
      let sample = channelData[channel][i];
      sample = Math.max(-1, Math.min(1, sample));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
      offset += 2;
    }
  }

  return new Blob([view], { type: 'audio/wav' });
}

// Global cached WAV data URLs for instant timeline track creation
const sfxWavCache: Record<string, string> = {};

// Synthesizes each sound effect using Web Audio OfflineAudioContext into a playable WAV Blob URL
async function generateSfxWavUrl(sfxId: string): Promise<string> {
  if (sfxWavCache[sfxId]) {
    return sfxWavCache[sfxId];
  }

  if (typeof window === 'undefined') {
    return '';
  }

  const AudioCtx = window.OfflineAudioContext || (window as any).webkitOfflineAudioContext;
  if (!AudioCtx) {
    // Fallback: procedural silent/carrier buffer
    const dummyBlob = new Blob([new Uint8Array(44)], { type: 'audio/wav' });
    const url = URL.createObjectURL(dummyBlob);
    sfxWavCache[sfxId] = url;
    return url;
  }

  const sampleRate = 44100;
  let duration = 0.5;

  switch (sfxId) {
    case 'tap': duration = 0.05; break;
    case 'pop': duration = 0.10; break;
    case 'whoosh': duration = 0.32; break;
    case 'ding': duration = 1.25; break;
    case 'glitch': duration = 0.20; break;
    case 'laser': duration = 0.20; break;
    case 'swoosh': duration = 0.52; break;
    case 'bass': duration = 1.00; break;
  }

  const length = Math.ceil(sampleRate * duration);
  const offlineCtx = new AudioCtx(1, length, sampleRate);
  const now = 0;

  try {
    if (sfxId === 'tap') {
      const osc = offlineCtx.createOscillator();
      const gain = offlineCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(850, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.035);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
      osc.connect(gain);
      gain.connect(offlineCtx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    } else if (sfxId === 'pop') {
      const osc = offlineCtx.createOscillator();
      const gain = offlineCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.exponentialRampToValueAtTime(1350, now + 0.022);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.085);
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.42, now + 0.018);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.085);
      osc.connect(gain);
      gain.connect(offlineCtx.destination);
      osc.start(now);
      osc.stop(now + 0.085);
    } else if (sfxId === 'whoosh') {
      const noiseBuf = offlineCtx.createBuffer(1, Math.floor(sampleRate * 0.4), sampleRate);
      const data = noiseBuf.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      const noise = offlineCtx.createBufferSource();
      noise.buffer = noiseBuf;

      const filter = offlineCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.Q.setValueAtTime(1.8, now);
      filter.frequency.setValueAtTime(280, now);
      filter.frequency.exponentialRampToValueAtTime(2200, now + 0.28 * 0.45);
      filter.frequency.exponentialRampToValueAtTime(320, now + 0.28);

      const noiseGain = offlineCtx.createGain();
      noiseGain.gain.setValueAtTime(0.001, now);
      noiseGain.gain.linearRampToValueAtTime(0.28, now + 0.28 * 0.4);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(offlineCtx.destination);
      noise.start(now);
      noise.stop(now + 0.28);

      const osc = offlineCtx.createOscillator();
      const oscGain = offlineCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(540, now + 0.28 * 0.45);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.28);
      oscGain.gain.setValueAtTime(0.001, now);
      oscGain.gain.linearRampToValueAtTime(0.18, now + 0.28 * 0.4);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc.connect(oscGain);
      oscGain.connect(offlineCtx.destination);
      osc.start(now);
      osc.stop(now + 0.28);
    } else if (sfxId === 'ding') {
      const baseFreq = 2093;
      const osc1 = offlineCtx.createOscillator();
      const gain1 = offlineCtx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(baseFreq, now);
      gain1.gain.setValueAtTime(0.001, now);
      gain1.gain.linearRampToValueAtTime(0.35, now + 0.004);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
      osc1.connect(gain1);
      gain1.connect(offlineCtx.destination);
      osc1.start(now);
      osc1.stop(now + 1.2);

      const osc2 = offlineCtx.createOscillator();
      const gain2 = offlineCtx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(baseFreq * 2.76, now);
      gain2.gain.setValueAtTime(0.001, now);
      gain2.gain.linearRampToValueAtTime(0.18, now + 0.003);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
      osc2.connect(gain2);
      gain2.connect(offlineCtx.destination);
      osc2.start(now);
      osc2.stop(now + 0.5);

      const osc3 = offlineCtx.createOscillator();
      const gain3 = offlineCtx.createGain();
      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(baseFreq * 5.4, now);
      gain3.gain.setValueAtTime(0.001, now);
      gain3.gain.linearRampToValueAtTime(0.08, now + 0.002);
      gain3.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
      osc3.connect(gain3);
      gain3.connect(offlineCtx.destination);
      osc3.start(now);
      osc3.stop(now + 0.15);
    } else if (sfxId === 'glitch') {
      const osc = offlineCtx.createOscillator();
      const oscGain = offlineCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1420, now);
      osc.frequency.setValueAtTime(480, now + 0.035);
      osc.frequency.setValueAtTime(2680, now + 0.075);
      osc.frequency.setValueAtTime(820, now + 0.115);

      oscGain.gain.setValueAtTime(0.18, now);
      oscGain.gain.setValueAtTime(0.02, now + 0.032);
      oscGain.gain.setValueAtTime(0.22, now + 0.035);
      oscGain.gain.setValueAtTime(0.02, now + 0.072);
      oscGain.gain.setValueAtTime(0.2, now + 0.075);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      const filter = offlineCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.Q.setValueAtTime(5, now);
      filter.frequency.setValueAtTime(2400, now);
      filter.frequency.exponentialRampToValueAtTime(800, now + 0.16);

      osc.connect(filter);
      filter.connect(oscGain);
      oscGain.connect(offlineCtx.destination);
      osc.start(now);
      osc.stop(now + 0.16);

      const noiseBuf = offlineCtx.createBuffer(1, Math.floor(sampleRate * 0.25), sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      const noise = offlineCtx.createBufferSource();
      noise.buffer = noiseBuf;
      const noiseFilter = offlineCtx.createBiquadFilter();
      noiseFilter.type = 'highpass';
      noiseFilter.frequency.setValueAtTime(3500, now);
      const noiseGain = offlineCtx.createGain();
      noiseGain.gain.setValueAtTime(0.15, now);
      noiseGain.gain.setValueAtTime(0.001, now + 0.04);
      noiseGain.gain.setValueAtTime(0.18, now + 0.07);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(offlineCtx.destination);
      noise.start(now);
      noise.stop(now + 0.16);
    } else if (sfxId === 'laser') {
      const osc = offlineCtx.createOscillator();
      const filter = offlineCtx.createBiquadFilter();
      const gain = offlineCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(2800, now);
      osc.frequency.exponentialRampToValueAtTime(65, now + 0.16);
      filter.type = 'lowpass';
      filter.Q.setValueAtTime(4, now);
      filter.frequency.setValueAtTime(4500, now);
      filter.frequency.exponentialRampToValueAtTime(150, now + 0.16);
      gain.gain.setValueAtTime(0.32, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(offlineCtx.destination);
      osc.start(now);
      osc.stop(now + 0.16);
    } else if (sfxId === 'swoosh') {
      const subOsc = offlineCtx.createOscillator();
      const subGain = offlineCtx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(55, now);
      subOsc.frequency.exponentialRampToValueAtTime(220, now + 0.48 * 0.4);
      subOsc.frequency.exponentialRampToValueAtTime(45, now + 0.48);
      subGain.gain.setValueAtTime(0.001, now);
      subGain.gain.linearRampToValueAtTime(0.4, now + 0.48 * 0.38);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.48);
      subOsc.connect(subGain);
      subGain.connect(offlineCtx.destination);
      subOsc.start(now);
      subOsc.stop(now + 0.48);

      const midOsc = offlineCtx.createOscillator();
      const midGain = offlineCtx.createGain();
      midOsc.type = 'triangle';
      midOsc.frequency.setValueAtTime(110, now);
      midOsc.frequency.exponentialRampToValueAtTime(620, now + 0.48 * 0.38);
      midOsc.frequency.exponentialRampToValueAtTime(90, now + 0.48);
      midGain.gain.setValueAtTime(0.001, now);
      midGain.gain.linearRampToValueAtTime(0.25, now + 0.48 * 0.38);
      midGain.gain.exponentialRampToValueAtTime(0.001, now + 0.48);
      midOsc.connect(midGain);
      midGain.connect(offlineCtx.destination);
      midOsc.start(now);
      midOsc.stop(now + 0.48);

      const noiseBuf = offlineCtx.createBuffer(1, Math.floor(sampleRate * 0.6), sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      const noise = offlineCtx.createBufferSource();
      noise.buffer = noiseBuf;
      const filter = offlineCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.Q.setValueAtTime(2.2, now);
      filter.frequency.setValueAtTime(180, now);
      filter.frequency.exponentialRampToValueAtTime(1600, now + 0.48 * 0.4);
      filter.frequency.exponentialRampToValueAtTime(140, now + 0.48);
      const noiseGain = offlineCtx.createGain();
      noiseGain.gain.setValueAtTime(0.001, now);
      noiseGain.gain.linearRampToValueAtTime(0.3, now + 0.48 * 0.38);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.48);
      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(offlineCtx.destination);
      noise.start(now);
      noise.stop(now + 0.48);
    } else if (sfxId === 'bass') {
      const osc = offlineCtx.createOscillator();
      const gain = offlineCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(175, now);
      osc.frequency.exponentialRampToValueAtTime(48, now + 0.08);
      osc.frequency.exponentialRampToValueAtTime(38, now + 0.95);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.55, now + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.95);
      osc.connect(gain);
      gain.connect(offlineCtx.destination);
      osc.start(now);
      osc.stop(now + 0.95);

      const punchOsc = offlineCtx.createOscillator();
      const punchGain = offlineCtx.createGain();
      punchOsc.type = 'triangle';
      punchOsc.frequency.setValueAtTime(260, now);
      punchOsc.frequency.exponentialRampToValueAtTime(60, now + 0.04);
      punchGain.gain.setValueAtTime(0.35, now);
      punchGain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
      punchOsc.connect(punchGain);
      punchGain.connect(offlineCtx.destination);
      punchOsc.start(now);
      punchOsc.stop(now + 0.05);
    }

    const renderedBuffer = await offlineCtx.startRendering();
    const wavBlob = audioBufferToWavBlob(renderedBuffer);
    const url = URL.createObjectURL(wavBlob);
    sfxWavCache[sfxId] = url;
    return url;
  } catch (err) {
    console.warn('Failed to render offline SFX buffer, using fallback URL:', err);
    return '';
  }
}

export interface SFXLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: ProjectState;
  currentPlayheadTime?: number;
  onAddAudioTrack: (audioTrack: AudioTrack) => void;
}

export const SFXLibraryModal: React.FC<SFXLibraryModalProps> = ({
  isOpen,
  onClose,
  project,
  currentPlayheadTime,
  onAddAudioTrack,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SFXCategory>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'soundboard'>('grid');
  const [auditioningId, setAuditioningId] = useState<string | null>(null);
  const [playbackProgress, setPlaybackProgress] = useState<number>(0);
  const [recentlyInsertedId, setRecentlyInsertedId] = useState<string | null>(null);
  const [padHitId, setPadHitId] = useState<string | null>(null);

  const animationFrameRef = useRef<number | null>(null);
  const playbackStartTimeRef = useRef<number>(0);
  const activeDurationRef = useRef<number>(0);
  const insertedTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const effectivePlayhead = typeof currentPlayheadTime === 'number' 
    ? currentPlayheadTime 
    : (project?.currentSeconds || 0);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    const ms = Math.floor((secs % 1) * 10);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms}`;
  };

  // Pre-generate WAV blobs in background when modal opens
  useEffect(() => {
    if (isOpen) {
      SFX_ITEMS.forEach((item) => {
        generateSfxWavUrl(item.id);
      });
    }
  }, [isOpen]);

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (insertedTimeoutRef.current) {
        clearTimeout(insertedTimeoutRef.current);
      }
    };
  }, []);

  // Handle live waveform scanning playhead animation during audition
  const startAuditionAnimation = useCallback((sfxId: string, duration: number) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    setAuditioningId(sfxId);
    setPlaybackProgress(0);
    playbackStartTimeRef.current = performance.now();
    activeDurationRef.current = duration * 1000; // ms

    const step = (timestamp: number) => {
      const elapsed = timestamp - playbackStartTimeRef.current;
      const progress = Math.min(1, elapsed / activeDurationRef.current);
      setPlaybackProgress(progress);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(step);
      } else {
        setAuditioningId(null);
        setPlaybackProgress(0);
      }
    };

    animationFrameRef.current = requestAnimationFrame(step);
  }, []);

  const handleAudition = useCallback((sfx: SFXItem) => {
    if (auditioningId === sfx.id) {
      // Toggle off / stop
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      setAuditioningId(null);
      setPlaybackProgress(0);
      return;
    }

    sfx.play();
    startAuditionAnimation(sfx.id, sfx.duration);
  }, [auditioningId, startAuditionAnimation]);

  const handlePadTrigger = useCallback((sfx: SFXItem) => {
    sfx.play();
    setPadHitId(sfx.id);
    startAuditionAnimation(sfx.id, sfx.duration);
    setTimeout(() => {
      setPadHitId((prev) => (prev === sfx.id ? null : prev));
    }, 180);
  }, [startAuditionAnimation]);

  const handleInsert = async (sfx: SFXItem, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }

    // Play quick feedback chime
    sfx.play();

    // Generate or retrieve WAV URL
    const wavUrl = await generateSfxWavUrl(sfx.id);

    const newTrack: AudioTrack = {
      id: crypto.randomUUID(),
      url: wavUrl,
      name: `SFX - ${sfx.name}`,
      volume: 0.9,
      startTime: effectivePlayhead,
      duration: sfx.duration,
      fadeIn: 0,
      fadeOut: Math.min(0.05, sfx.duration * 0.2),
      isMuted: false,
    };

    onAddAudioTrack(newTrack);

    setRecentlyInsertedId(sfx.id);
    if (insertedTimeoutRef.current) {
      clearTimeout(insertedTimeoutRef.current);
    }
    insertedTimeoutRef.current = setTimeout(() => {
      setRecentlyInsertedId(null);
    }, 1800);
  };

  // Keyboard shortcut listener (keys 1-8 for rapid soundboard trigger and Escape to close)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'Escape') {
        onClose();
        return;
      }

      const matchingSFX = SFX_ITEMS.find((s) => s.shortcutKey === e.key);
      if (matchingSFX) {
        e.preventDefault();
        handlePadTrigger(matchingSFX);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handlePadTrigger]);

  // Filter sound effects
  const filteredSFX = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return SFX_ITEMS.filter((item) => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!q) return true;
      const matchName = item.name.toLowerCase().includes(q);
      const matchSub = item.subtitle.toLowerCase().includes(q);
      const matchCat = item.category.toLowerCase().includes(q);
      const matchTags = item.tags.some((tag) => tag.toLowerCase().includes(q));

      return matchName || matchSub || matchCat || matchTags;
    });
  }, [searchQuery, selectedCategory]);

  const categories: { label: SFXCategory; count: number }[] = [
    { label: 'All', count: SFX_ITEMS.length },
    { label: 'UI & Clicks', count: SFX_ITEMS.filter((s) => s.category === 'UI & Clicks').length },
    { label: 'Transitions', count: SFX_ITEMS.filter((s) => s.category === 'Transitions').length },
    { label: 'Impacts & Stingers', count: SFX_ITEMS.filter((s) => s.category === 'Impacts & Stingers').length },
  ];

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-dark-950/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 select-none"
      onClick={onClose}
    >
      <div 
        className="w-[840px] max-w-full max-h-[92vh] bg-dark-900 border border-slate-800/90 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Studio Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800/80 bg-dark-950/70 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center shadow-lg shadow-indigo-500/10">
              <Headphones className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-white tracking-wide">Sound Effects Studio</h2>
                <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center space-x-1">
                  <Activity className="w-2.5 h-2.5 text-indigo-400 animate-pulse" />
                  <span>Pro Synthesizer</span>
                </span>
              </div>
              <p className="text-xs text-slate-400">Audition and insert studio audio effects directly at your timeline playhead</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Playhead Badge Indicator */}
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-dark-950 border border-slate-800">
              <Clock className="w-3.5 h-3.5 text-brand-400" />
              <span className="text-[11px] text-slate-400">Playhead:</span>
              <span className="text-[11px] font-mono font-bold text-brand-300">
                {formatTime(effectivePlayhead)}
              </span>
            </div>

            <button 
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition"
              title="Close SFX Studio (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar: Search, Category Filters, and View Mode Switcher */}
        <div className="px-6 py-3.5 border-b border-slate-800/70 bg-dark-950/40 flex flex-wrap items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search SFX (e.g., whoosh, pop, tap, bass, glitch)..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-dark-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500 font-sans transition"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-dark-950 border border-slate-800">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition ${
                viewMode === 'grid' 
                  ? 'bg-slate-800 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Studio Grid</span>
            </button>
            <button
              onClick={() => setViewMode('soundboard')}
              className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition ${
                viewMode === 'soundboard' 
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Soundboard Pads</span>
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="px-6 py-2.5 bg-dark-900/60 border-b border-slate-800/50 flex items-center space-x-2 overflow-x-auto scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.label;
            return (
              <button
                key={cat.label}
                onClick={() => setSelectedCategory(cat.label)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition flex items-center space-x-2 border ${
                  isSelected
                    ? 'bg-brand-500/20 border-brand-500/50 text-brand-300 shadow-sm shadow-brand-500/10'
                    : 'bg-dark-950/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isSelected ? 'bg-brand-500/30 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-800">
          {filteredSFX.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-800/50 border border-slate-700 mx-auto flex items-center justify-center text-slate-500">
                <VolumeX className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-300">No sound effects matched "{searchQuery}"</p>
              <p className="text-xs text-slate-500">Try searching for keywords like "swipe", "zap", "click", or clear the filter.</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition"
              >
                Reset Filters
              </button>
            </div>
          ) : viewMode === 'soundboard' ? (
            /* Soundboard Pad Mode (Big responsive MPC touch pads) */
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span className="flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Tap pads or press keyboard keys <strong className="text-white font-mono">1 - 8</strong> to trigger live audio</span>
                </span>
                <span className="text-[11px] font-mono text-slate-500">Zero Latency DSP Synthesis</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                {filteredSFX.map((sfx) => {
                  const isAuditioning = auditioningId === sfx.id;
                  const isHit = padHitId === sfx.id;
                  const isInserted = recentlyInsertedId === sfx.id;

                  return (
                    <div
                      key={sfx.id}
                      onClick={() => handlePadTrigger(sfx)}
                      className={`relative group rounded-2xl p-4 cursor-pointer transition-all duration-150 flex flex-col justify-between h-36 border ${
                        isHit || isAuditioning
                          ? 'scale-[0.98] border-white/60 shadow-xl'
                          : 'bg-dark-950/80 border-slate-800 hover:border-slate-700 hover:shadow-lg'
                      }`}
                      style={{
                        backgroundColor: isHit ? `${sfx.colorHex}25` : undefined,
                        boxShadow: isHit || isAuditioning ? `0 0 24px ${sfx.glowColor}` : undefined,
                      }}
                    >
                      {/* Top Header */}
                      <div className="flex items-start justify-between">
                        <span 
                          className="w-7 h-7 rounded-xl flex items-center justify-center text-xs font-mono font-bold border transition shadow-inner"
                          style={{
                            backgroundColor: `${sfx.colorHex}20`,
                            borderColor: `${sfx.colorHex}50`,
                            color: sfx.colorHex,
                          }}
                        >
                          {sfx.shortcutKey}
                        </span>

                        <span className="text-[10px] font-mono text-slate-500 bg-dark-900 px-2 py-0.5 rounded-lg border border-slate-800">
                          {sfx.duration}s
                        </span>
                      </div>

                      {/* Center Sound Name */}
                      <div className="space-y-1 my-auto text-left">
                        <div className="text-sm font-bold text-white tracking-wide group-hover:text-brand-300 transition">
                          {sfx.name}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-full">
                          {sfx.subtitle}
                        </div>
                      </div>

                      {/* Bottom Insert Button */}
                      <div className="pt-2 flex items-center justify-between border-t border-slate-800/60">
                        <span className="text-[10px] text-slate-500 font-medium truncate">
                          {sfx.category}
                        </span>

                        <button
                          onClick={(e) => handleInsert(sfx, e)}
                          title={`Insert ${sfx.name} at playhead (${formatTime(effectivePlayhead)})`}
                          className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition flex items-center space-x-1 border ${
                            isInserted
                              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                              : 'bg-slate-800/80 hover:bg-brand-600 border-slate-700 hover:border-brand-500 text-slate-200 hover:text-white'
                          }`}
                        >
                          {isInserted ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span>Added</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3 h-3" />
                              <span>Insert</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Studio Grid Mode (Detailed Cards with Waveforms and Audition Controls) */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredSFX.map((sfx) => {
                const isAuditioning = auditioningId === sfx.id;
                const isInserted = recentlyInsertedId === sfx.id;

                return (
                  <div
                    key={sfx.id}
                    className={`rounded-2xl p-4 bg-dark-950/80 border transition-all duration-200 flex flex-col justify-between space-y-3.5 relative overflow-hidden group ${
                      isAuditioning
                        ? 'border-indigo-500/50 shadow-xl shadow-indigo-500/10'
                        : 'border-slate-800/90 hover:border-slate-700/90 hover:bg-dark-950'
                    }`}
                  >
                    {/* Active Scanning Wave Glow Background */}
                    {isAuditioning && (
                      <div 
                        className="absolute inset-0 opacity-10 pointer-events-none transition"
                        style={{ backgroundColor: sfx.colorHex }}
                      />
                    )}

                    {/* Top Row: Title, Category Badge, and Keyboard Shortcut */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-2">
                          <span 
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: sfx.colorHex }}
                          />
                          <h3 className="text-sm font-bold text-white tracking-wide group-hover:text-brand-300 transition">
                            {sfx.name}
                          </h3>
                        </div>
                        <p className="text-[11px] text-slate-400 pl-4">{sfx.subtitle}</p>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        <span 
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-md border ${sfx.gradientClass}`}
                        >
                          {sfx.category}
                        </span>
                        <span className="w-5 h-5 rounded-md bg-dark-900 border border-slate-800 text-[10px] font-mono text-slate-400 flex items-center justify-center font-bold">
                          {sfx.shortcutKey}
                        </span>
                      </div>
                    </div>

                    {/* Waveform Visualization Container */}
                    <div className="relative bg-dark-900/90 rounded-xl p-3 border border-slate-800/80 space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                        <span className="flex items-center space-x-1">
                          <Activity className="w-3 h-3 text-slate-400" />
                          <span>Amplitude Profile</span>
                        </span>
                        <span className="text-slate-400 font-semibold">{sfx.duration}s</span>
                      </div>

                      {/* 28-Bar Waveform Display with Dynamic Scanline Playhead */}
                      <div className="relative h-12 flex items-end justify-between gap-[2px] px-1 py-1 overflow-hidden">
                        {sfx.waveformProfile.map((amp, idx) => {
                          const barProgress = idx / sfx.waveformProfile.length;
                          const isActive = isAuditioning && playbackProgress >= barProgress;
                          const barHeightPct = Math.max(8, amp * 100);

                          return (
                            <div
                              key={idx}
                              className="flex-1 flex flex-col justify-end items-center h-full group/bar"
                            >
                              <div
                                className="w-full rounded-full transition-all duration-75"
                                style={{
                                  height: `${barHeightPct}%`,
                                  backgroundColor: isActive ? sfx.colorHex : 'rgba(148, 163, 184, 0.25)',
                                  boxShadow: isActive ? `0 0 8px ${sfx.glowColor}` : undefined,
                                }}
                              />
                            </div>
                          );
                        })}

                        {/* Animated Scanning Playhead Laser */}
                        {isAuditioning && (
                          <div
                            className="absolute top-0 bottom-0 w-[2px] bg-white shadow-lg pointer-events-none transition-all"
                            style={{
                              left: `${playbackProgress * 100}%`,
                              boxShadow: `0 0 10px #FFFFFF, 0 0 16px ${sfx.colorHex}`,
                            }}
                          />
                        )}
                      </div>
                    </div>

                    {/* Bottom Actions: Audition Play and Insert Buttons */}
                    <div className="grid grid-cols-5 gap-2 pt-1">
                      {/* Play/Audition Button */}
                      <button
                        onClick={() => handleAudition(sfx)}
                        className={`col-span-2 py-2 px-3 rounded-xl text-xs font-semibold transition flex items-center justify-center space-x-1.5 border shadow-sm ${
                          isAuditioning
                            ? 'bg-rose-500/20 hover:bg-rose-500/30 border-rose-500/40 text-rose-300'
                            : 'bg-dark-900 hover:bg-slate-800 border-slate-800 hover:border-slate-700 text-slate-200'
                        }`}
                      >
                        {isAuditioning ? (
                          <>
                            <Square className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                            <span>Stop</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 text-brand-400 fill-brand-400" />
                            <span>Audition</span>
                          </>
                        )}
                      </button>

                      {/* Insert at Playhead Button */}
                      <button
                        onClick={(e) => handleInsert(sfx, e)}
                        className={`col-span-3 py-2 px-3 rounded-xl text-xs font-semibold transition flex items-center justify-center space-x-1.5 shadow-md active:scale-95 border ${
                          isInserted
                            ? 'bg-emerald-600 border-emerald-500 text-white shadow-emerald-600/20'
                            : 'bg-brand-600 hover:bg-brand-500 border-brand-500/80 text-white shadow-brand-600/20'
                        }`}
                      >
                        {isInserted ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                            <span>Inserted!</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Insert @ {formatTime(effectivePlayhead)}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer / Info Bar */}
        <div className="px-6 py-3.5 border-t border-slate-800/80 bg-dark-950 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-3">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300 font-medium">Web Audio 44.1kHz DSP Engine</span>
            </span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:inline text-slate-500">
              Inserting tracks will position SFX precisely at {formatTime(effectivePlayhead)}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
