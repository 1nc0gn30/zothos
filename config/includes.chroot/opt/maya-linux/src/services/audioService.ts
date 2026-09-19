export interface AudioSfxPreset {
  id: string;
  name: string;
  play: () => void;
}

class SoundManager {
  private ctx: AudioContext | null = null;
  private noiseBuffer: AudioBuffer | null = null;

  private initContext(): AudioContext | null {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  private getNoiseBuffer(): AudioBuffer | null {
    if (!this.ctx) return null;
    if (!this.noiseBuffer) {
      const bufferSize = Math.floor(this.ctx.sampleRate * 1.5);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      this.noiseBuffer = buffer;
    }
    return this.noiseBuffer;
  }

  playTapClick() {
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(850, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.035);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch (e) {
      console.warn('SFX audio error:', e);
    }
  }

  playWhoosh() {
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const duration = 0.28;

      // Filtered noise sweep for air movement
      const noiseBuf = this.getNoiseBuffer();
      if (noiseBuf) {
        const noise = this.ctx.createBufferSource();
        noise.buffer = noiseBuf;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.Q.setValueAtTime(1.8, now);
        filter.frequency.setValueAtTime(280, now);
        filter.frequency.exponentialRampToValueAtTime(2200, now + duration * 0.45);
        filter.frequency.exponentialRampToValueAtTime(320, now + duration);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.001, now);
        noiseGain.gain.linearRampToValueAtTime(0.28, now + duration * 0.4);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.ctx.destination);

        noise.start(now);
        noise.stop(now + duration);
      }

      // Tonal body sweep
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(540, now + duration * 0.45);
      osc.frequency.exponentialRampToValueAtTime(120, now + duration);

      oscGain.gain.setValueAtTime(0.001, now);
      oscGain.gain.linearRampToValueAtTime(0.18, now + duration * 0.4);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {
      console.warn('SFX audio error:', e);
    }
  }

  playPop() {
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const duration = 0.085;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      // Classic bubble pop: rapid pitch chirp up then drop
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.exponentialRampToValueAtTime(1350, now + 0.022);
      osc.frequency.exponentialRampToValueAtTime(320, now + duration);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.42, now + 0.018);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {
      console.warn('SFX audio error:', e);
    }
  }

  playDing() {
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const duration = 1.2;
      const baseFreq = 2093; // C7 bright crystalline bell chime

      // Fundamental chime
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(baseFreq, now);

      gain1.gain.setValueAtTime(0.001, now);
      gain1.gain.linearRampToValueAtTime(0.35, now + 0.004);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + duration);

      // Overtone 1 (metallic ring: ~2.76x)
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(baseFreq * 2.76, now);

      gain2.gain.setValueAtTime(0.001, now);
      gain2.gain.linearRampToValueAtTime(0.18, now + 0.003);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now);
      osc2.stop(now + 0.5);

      // Overtone 2 (sparkle transient: ~5.4x)
      const osc3 = this.ctx.createOscillator();
      const gain3 = this.ctx.createGain();
      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(baseFreq * 5.4, now);

      gain3.gain.setValueAtTime(0.001, now);
      gain3.gain.linearRampToValueAtTime(0.08, now + 0.002);
      gain3.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

      osc3.connect(gain3);
      gain3.connect(this.ctx.destination);
      osc3.start(now);
      osc3.stop(now + 0.15);
    } catch (e) {
      console.warn('SFX audio error:', e);
    }
  }

  playGlitch() {
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const duration = 0.16;

      // Stepped pitch oscillator
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'sawtooth';

      // Rapid stepped arpeggio frequencies for cyber feel
      osc.frequency.setValueAtTime(1420, now);
      osc.frequency.setValueAtTime(480, now + 0.035);
      osc.frequency.setValueAtTime(2680, now + 0.075);
      osc.frequency.setValueAtTime(820, now + 0.115);

      oscGain.gain.setValueAtTime(0.18, now);
      oscGain.gain.setValueAtTime(0.02, now + 0.032);
      oscGain.gain.setValueAtTime(0.22, now + 0.035);
      oscGain.gain.setValueAtTime(0.02, now + 0.072);
      oscGain.gain.setValueAtTime(0.2, now + 0.075);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      // Resonant bandpass filter
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.Q.setValueAtTime(5, now);
      filter.frequency.setValueAtTime(2400, now);
      filter.frequency.exponentialRampToValueAtTime(800, now + duration);

      osc.connect(filter);
      filter.connect(oscGain);
      oscGain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration);

      // Noise bursts
      const noiseBuffer = this.getNoiseBuffer();
      if (noiseBuffer) {
        const noise = this.ctx.createBufferSource();
        noise.buffer = noiseBuffer;

        const noiseFilter = this.ctx.createBiquadFilter();
        noiseFilter.type = 'highpass';
        noiseFilter.frequency.setValueAtTime(3500, now);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.15, now);
        noiseGain.gain.setValueAtTime(0.001, now + 0.04);
        noiseGain.gain.setValueAtTime(0.18, now + 0.07);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(this.ctx.destination);

        noise.start(now);
        noise.stop(now + duration);
      }
    } catch (e) {
      console.warn('SFX audio error:', e);
    }
  }

  playLaser() {
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const duration = 0.16;

      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      // Steep downward frequency zap
      osc.frequency.setValueAtTime(2800, now);
      osc.frequency.exponentialRampToValueAtTime(65, now + duration);

      filter.type = 'lowpass';
      filter.Q.setValueAtTime(4, now);
      filter.frequency.setValueAtTime(4500, now);
      filter.frequency.exponentialRampToValueAtTime(150, now + duration);

      gain.gain.setValueAtTime(0.32, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {
      console.warn('SFX audio error:', e);
    }
  }

  playSwoosh() {
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const duration = 0.48;

      // Sub bass swell
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(55, now);
      subOsc.frequency.exponentialRampToValueAtTime(220, now + duration * 0.4);
      subOsc.frequency.exponentialRampToValueAtTime(45, now + duration);

      subGain.gain.setValueAtTime(0.001, now);
      subGain.gain.linearRampToValueAtTime(0.4, now + duration * 0.38);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      subOsc.connect(subGain);
      subGain.connect(this.ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + duration);

      // Deep mid body
      const midOsc = this.ctx.createOscillator();
      const midGain = this.ctx.createGain();
      midOsc.type = 'triangle';
      midOsc.frequency.setValueAtTime(110, now);
      midOsc.frequency.exponentialRampToValueAtTime(620, now + duration * 0.38);
      midOsc.frequency.exponentialRampToValueAtTime(90, now + duration);

      midGain.gain.setValueAtTime(0.001, now);
      midGain.gain.linearRampToValueAtTime(0.25, now + duration * 0.38);
      midGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      midOsc.connect(midGain);
      midGain.connect(this.ctx.destination);
      midOsc.start(now);
      midOsc.stop(now + duration);

      // Filtered noise rush
      const noiseBuf = this.getNoiseBuffer();
      if (noiseBuf) {
        const noise = this.ctx.createBufferSource();
        noise.buffer = noiseBuf;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.Q.setValueAtTime(2.2, now);
        filter.frequency.setValueAtTime(180, now);
        filter.frequency.exponentialRampToValueAtTime(1600, now + duration * 0.4);
        filter.frequency.exponentialRampToValueAtTime(140, now + duration);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.001, now);
        noiseGain.gain.linearRampToValueAtTime(0.3, now + duration * 0.38);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.ctx.destination);

        noise.start(now);
        noise.stop(now + duration);
      }
    } catch (e) {
      console.warn('SFX audio error:', e);
    }
  }

  playBassDrop() {
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const duration = 0.95;

      // Main 808 Sub Pitch Drop
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      // Punch at start down to solid 40Hz sub bass
      osc.frequency.setValueAtTime(175, now);
      osc.frequency.exponentialRampToValueAtTime(48, now + 0.08);
      osc.frequency.exponentialRampToValueAtTime(38, now + duration);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.55, now + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + duration);

      // Initial punch transient
      const punchOsc = this.ctx.createOscillator();
      const punchGain = this.ctx.createGain();
      punchOsc.type = 'triangle';
      punchOsc.frequency.setValueAtTime(260, now);
      punchOsc.frequency.exponentialRampToValueAtTime(60, now + 0.04);

      punchGain.gain.setValueAtTime(0.35, now);
      punchGain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

      punchOsc.connect(punchGain);
      punchGain.connect(this.ctx.destination);
      punchOsc.start(now);
      punchOsc.stop(now + 0.05);
    } catch (e) {
      console.warn('SFX audio error:', e);
    }
  }

  playKeyboardClack() {
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Transient tactile click
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.02);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.03);
    } catch (e) {
      console.warn('SFX audio error:', e);
    }
  }

  playCyberHologram() {
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const duration = 0.35;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.setValueAtTime(1320, now + 0.08);
      osc.frequency.setValueAtTime(1760, now + 0.16);
      osc.frequency.exponentialRampToValueAtTime(2200, now + duration);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {
      console.warn('SFX audio error:', e);
    }
  }

  playImpactBoom() {
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const duration = 0.8;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + duration);

      gain.gain.setValueAtTime(0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {
      console.warn('SFX audio error:', e);
    }
  }

  playVinylScratch() {
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const duration = 0.22;

      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + duration * 0.5);
      osc.frequency.exponentialRampToValueAtTime(600, now + duration);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, now);
      filter.Q.setValueAtTime(3, now);

      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {
      console.warn('SFX audio error:', e);
    }
  }

  playPreset(id: string) {
    switch (id) {
      case 'tap':
        return this.playTapClick();
      case 'whoosh':
        return this.playWhoosh();
      case 'pop':
        return this.playPop();
      case 'ding':
        return this.playDing();
      case 'glitch':
        return this.playGlitch();
      case 'laser':
        return this.playLaser();
      case 'swoosh':
        return this.playSwoosh();
      case 'bass':
        return this.playBassDrop();
      case 'clack':
        return this.playKeyboardClack();
      case 'hologram':
        return this.playCyberHologram();
      case 'impact':
        return this.playImpactBoom();
      case 'scratch':
        return this.playVinylScratch();
      default:
        return this.playTapClick();
    }
  }
}

export const soundManager = new SoundManager();

export const AUDIO_SFX_PRESETS: AudioSfxPreset[] = [
  { id: 'tap', name: 'Tap Click', play: () => soundManager.playTapClick() },
  { id: 'whoosh', name: 'Whoosh', play: () => soundManager.playWhoosh() },
  { id: 'pop', name: 'Bubble Pop', play: () => soundManager.playPop() },
  { id: 'ding', name: 'Success Ding', play: () => soundManager.playDing() },
  { id: 'glitch', name: 'Cyber Glitch', play: () => soundManager.playGlitch() },
  { id: 'laser', name: 'Laser Zap', play: () => soundManager.playLaser() },
  { id: 'swoosh', name: 'Deep Swoosh', play: () => soundManager.playSwoosh() },
  { id: 'bass', name: 'Bass Drop', play: () => soundManager.playBassDrop() },
  { id: 'clack', name: 'Keyboard Clack', play: () => soundManager.playKeyboardClack() },
  { id: 'hologram', name: 'Cyber Hologram', play: () => soundManager.playCyberHologram() },
  { id: 'impact', name: 'Impact Boom', play: () => soundManager.playImpactBoom() },
  { id: 'scratch', name: 'Vinyl Scratch', play: () => soundManager.playVinylScratch() },
];

/**
 * Calculates volume multiplier (0..1) based on track current time and fade in/out curves.
 * Uses smooth S-curve easing to prevent abrupt audio jumps.
 *
 * @param trackCurrentTime Current playback position in seconds within this track.
 * @param totalDuration Total duration of the audio track in seconds.
 * @param fadeIn Fade-in duration in seconds (optional, defaults to 0).
 * @param fadeOut Fade-out duration in seconds (optional, defaults to 0).
 * @returns Multiplier between 0 and 1.
 */
export function computeAudioFade(
  trackCurrentTime: number,
  totalDuration: number,
  fadeIn: number = 0,
  fadeOut: number = 0
): number {
  if (totalDuration <= 0) return 1;
  if (trackCurrentTime < 0 || trackCurrentTime > totalDuration) return 0;
  if ((!fadeIn || fadeIn <= 0) && (!fadeOut || fadeOut <= 0)) return 1;

  let inMultiplier = 1;
  if (fadeIn && fadeIn > 0) {
    if (trackCurrentTime <= 0) {
      inMultiplier = 0;
    } else if (trackCurrentTime < fadeIn) {
      const ratio = Math.min(1, Math.max(0, trackCurrentTime / fadeIn));
      // Smoothstep S-curve for natural audio fade
      inMultiplier = ratio * ratio * (3 - 2 * ratio);
    }
  }

  let outMultiplier = 1;
  if (fadeOut && fadeOut > 0) {
    const remaining = totalDuration - trackCurrentTime;
    if (remaining <= 0) {
      outMultiplier = 0;
    } else if (remaining < fadeOut) {
      const ratio = Math.min(1, Math.max(0, remaining / fadeOut));
      outMultiplier = ratio * ratio * (3 - 2 * ratio);
    }
  }

  const multiplier = Math.min(inMultiplier, outMultiplier);
  return Math.max(0, Math.min(1, multiplier));
}

/**
 * Checks if speech (subtitles or voice clips) is active at currentTime.
 * If active and ducking is enabled, smoothly reduces background audio by the ducking amount.
 * Applies smooth attack (150ms) and release (350ms) easing to eliminate popping and volume pump.
 *
 * @param currentTime Current timeline playback position in seconds.
 * @param project Project state or object containing subtitles / audio tracks.
 * @returns Volume multiplier (0..1).
 */
export function computeAudioDucking(
  currentTime: number,
  project: any
): number {
  if (!project) return 1;

  // Determine if ducking is explicitly disabled on audio tracks
  const audioTracks = Array.isArray(project.audioTracks) ? project.audioTracks : [];
  const activeBgTrack = audioTracks[0];

  // If the background track explicitly has ducking disabled, do not duck
  if (activeBgTrack && activeBgTrack.duckingEnabled === false) {
    return 1;
  }

  // Determine ducking reduction level (e.g. 0.35 = audio ducks to 35% of volume)
  const duckAmount = typeof activeBgTrack?.duckingAmount === 'number'
    ? Math.max(0, Math.min(1, activeBgTrack.duckingAmount))
    : (typeof project.duckingAmount === 'number' ? project.duckingAmount : 0.35);

  const attackTime = 0.15; // 150ms smooth ramp down
  const releaseTime = 0.35; // 350ms smooth ramp up

  // Collect active voice/speech intervals
  const speechIntervals: Array<{ start: number; end: number }> = [];

  // 1. Subtitles / Captions (Speech representation)
  if (Array.isArray(project.subtitles)) {
    for (const sub of project.subtitles) {
      if (typeof sub.startTime === 'number' && typeof sub.duration === 'number' && sub.duration > 0) {
        speechIntervals.push({
          start: sub.startTime,
          end: sub.startTime + sub.duration,
        });
      }
    }
  }

  // 2. Primary Voiceover / Speech / TTS audio tracks
  for (const track of audioTracks) {
    if (track.isVoice || track.isVoiceover || track.name?.toLowerCase().includes('voice') || track.name?.toLowerCase().includes('tts')) {
      if (typeof track.startTime === 'number' && typeof track.duration === 'number' && track.duration > 0) {
        speechIntervals.push({
          start: track.startTime,
          end: track.startTime + track.duration,
        });
      }
    }
  }

  if (speechIntervals.length === 0) {
    return 1;
  }

  let minGain = 1;

  for (const interval of speechIntervals) {
    let gain = 1;

    if (currentTime >= interval.start && currentTime <= interval.end) {
      // Inside speech interval -> full ducking
      gain = duckAmount;
    } else if (currentTime >= interval.start - attackTime && currentTime < interval.start) {
      // Attack phase (ramping down to duckAmount)
      const ratio = (interval.start - currentTime) / attackTime; // 1 down to 0
      const smooth = ratio * ratio * (3 - 2 * ratio);
      gain = duckAmount + (1 - duckAmount) * smooth;
    } else if (currentTime > interval.end && currentTime <= interval.end + releaseTime) {
      // Release phase (ramping back up to 1.0)
      const ratio = (currentTime - interval.end) / releaseTime; // 0 up to 1
      const smooth = ratio * ratio * (3 - 2 * ratio);
      gain = duckAmount + (1 - duckAmount) * smooth;
    }

    if (gain < minGain) {
      minGain = gain;
    }
  }

  return Math.max(0, Math.min(1, minGain));
}
