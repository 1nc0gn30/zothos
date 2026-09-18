/**
 * Zoth Procedural Web Audio Music Synthesizer & Soundtrack Engine
 * 100% Client-Side, Zero External MP3 Dependencies.
 * Features Rick Rubin "Reducer" Minimalist Beats & Cyberpunk Arpeggiators.
 * Ultra-precise Web Audio lookahead clocking, click-free exponential gain ramps,
 * and high-fidelity harmonic scales (Major, Minor, Pentatonic, Cyberpunk, Phrygian, Solfeggio).
 */

(function(window) {
  'use strict';

  class ZothMusicEngine {
    constructor() {
      this.ctx = null;
      this.isPlaying = false;
      this.currentTrack = 'rubin_808';
      this.bpm = 90;
      this.step = 0;
      this.timerId = null;
      this.nextStepTime = 0;
      this.scheduleAheadTime = 0.12; // 120ms lookahead
      this.lookaheadInterval = 25;    // 25ms timer check
      this.masterGain = null;
      this.filterNode = null;
      this.delayNode = null;
      this.delayFeedback = null;
      this.analyser = null;
      this.freqDataArray = null;
      this.timeDataArray = null;
      this.destNode = null;
      this.targetVolume = 0.38;

      // Track Definitions & Exact Scale Frequencies (in Hz)
      // Scales: Major, Minor, Pentatonic, Cyberpunk, Phrygian, Solfeggio
      this.tracks = {
        solfeggio_432: {
          name: "✨ 432Hz Sacred Solfeggio",
          genre: "Hermetic Resonance & Golden Drone",
          scaleName: "Solfeggio (432Hz / 528Hz / 639Hz)",
          bpm: 72,
          scale: [432.00, 528.00, 639.00, 741.00, 852.00, 963.00, 216.00, 288.00],
          bassSeq: [108.00, 0, 0, 0, 144.00, 0, 0, 0, 216.00, 0, 0, 0, 108.00, 0, 0, 0],
          leadSeq: [0, 1, 2, 0, 3, 0, 4, 5, 0, 1, 3, 2, 5, 4, 1, 0],
          drumPattern: [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0]
        },
        rubin_808: {
          name: "🧘 Rubin 808 Reducer",
          genre: "Minimalist Raw 808 & Silence",
          scaleName: "C Minor Pentatonic (808 Bass)",
          bpm: 90,
          scale: [130.81, 155.56, 174.61, 196.00, 233.08, 261.63, 311.13, 392.00],
          bassSeq: [55.00, 0, 0, 0, 0, 0, 55.00, 0, 0, 0, 65.41, 0, 0, 0, 0, 0],
          leadSeq: [0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0],
          drumPattern: [1, 0, 0, 0, 2, 0, 0, 0, 1, 0, 1, 0, 2, 0, 0, 0]
        },
        primal_truth: {
          name: "🌑 Primal Truth",
          genre: "Deep Heartbeat & Ambient Space",
          scaleName: "A Minor Pentatonic",
          bpm: 74,
          scale: [110.00, 130.81, 146.83, 164.81, 196.00, 220.00, 261.63, 293.66],
          bassSeq: [55.00, 0, 0, 0, 0, 0, 0, 0, 48.99, 0, 0, 0, 0, 0, 0, 0],
          leadSeq: [0, 0, 2, 0, 0, 0, 4, 0, 0, 0, 1, 0, 0, 0, 0, 0],
          drumPattern: [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0]
        },
        azoth_transmutation: {
          name: "🌌 Azoth's Transmutation",
          genre: "Cyberpunk Synthwave",
          scaleName: "Cyberpunk Dorian b2 / Minor",
          bpm: 122,
          scale: [130.81, 146.83, 155.56, 174.61, 196.00, 207.65, 233.08, 261.63],
          bassSeq: [65.41, 0, 65.41, 0, 77.78, 0, 87.31, 0, 65.41, 0, 65.41, 0, 98.00, 0, 87.31, 0],
          leadSeq: [0, 4, 2, 7, 0, 5, 3, 7, 0, 4, 2, 7, 5, 4, 2, 1],
          drumPattern: [1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 1, 2, 0]
        },
        parrot_airgap: {
          name: "🛡️ Parrot Airgap Protocol",
          genre: "Industrial Glitch & Sub-Bass",
          scaleName: "A Phrygian Mode (Glitch / Sub)",
          bpm: 130,
          scale: [110.00, 116.54, 130.81, 146.83, 164.81, 174.61, 196.00, 220.00],
          bassSeq: [55.00, 55.00, 0, 55.00, 58.27, 0, 55.00, 0, 55.00, 55.00, 0, 55.00, 73.42, 65.41, 55.00, 0],
          leadSeq: [0, 0, 3, 0, 5, 0, 7, 6, 0, 0, 3, 0, 7, 0, 5, 3],
          drumPattern: [1, 2, 1, 2, 1, 2, 1, 2, 1, 1, 2, 0, 1, 2, 2, 2]
        },
        hermetic_sanctum: {
          name: "👑 Hermetic Sovereign Sanctum",
          genre: "Ambient Ethereal Drone & Chimes",
          scaleName: "C Major / Lydian Drone",
          bpm: 86,
          scale: [261.63, 293.66, 329.63, 369.99, 392.00, 440.00, 493.88, 523.25],
          bassSeq: [130.81, 0, 0, 0, 196.00, 0, 0, 0, 261.63, 0, 0, 0, 196.00, 0, 0, 0],
          leadSeq: [0, 2, 4, 6, 7, 5, 3, 1, 0, 2, 4, 6, 7, 6, 4, 2],
          drumPattern: [1, 0, 0, 0, 2, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0]
        },
        draco_swarm: {
          name: "🐉 Draco Swarm Arena",
          genre: "High-Octane Kinetic Drum & Bass",
          scaleName: "B Phrygian Dominant",
          bpm: 140,
          scale: [123.47, 130.81, 155.56, 164.81, 185.00, 196.00, 220.00, 246.94],
          bassSeq: [61.74, 61.74, 61.74, 0, 73.42, 0, 82.41, 0, 61.74, 61.74, 61.74, 0, 98.00, 0, 82.41, 73.42],
          leadSeq: [7, 5, 3, 2, 7, 5, 4, 2, 7, 5, 3, 2, 1, 2, 3, 5],
          drumPattern: [1, 0, 0, 2, 0, 1, 2, 0, 1, 0, 0, 2, 0, 1, 2, 1]
        },
        quantum_nexus: {
          name: "⚡ Quantum Nexus 3D",
          genre: "Lo-Fi Neural Waves",
          scaleName: "D Natural Minor",
          bpm: 96,
          scale: [146.83, 164.81, 174.61, 196.00, 220.00, 233.08, 261.63, 293.66],
          bassSeq: [73.42, 0, 0, 73.42, 87.31, 0, 0, 0, 98.00, 0, 0, 98.00, 73.42, 0, 0, 0],
          leadSeq: [0, 1, 2, 4, 3, 2, 1, 0, 4, 3, 2, 1, 0, 2, 4, 5],
          drumPattern: [1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0]
        },
        neon_overdrive: {
          name: "🏎️ Neon Overdrive",
          genre: "High-Energy Cyberpunk Synthwave",
          scaleName: "D Cyberpunk Minor",
          bpm: 128,
          scale: [146.83, 164.81, 174.61, 196.00, 220.00, 246.94, 261.63, 293.66],
          bassSeq: [73.42, 73.42, 0, 73.42, 87.31, 0, 98.00, 0, 73.42, 73.42, 0, 73.42, 110.00, 98.00, 87.31, 0],
          leadSeq: [0, 3, 5, 7, 5, 3, 2, 0, 7, 5, 3, 2, 3, 5, 7, 6],
          drumPattern: [1, 0, 2, 0, 1, 1, 2, 0, 1, 0, 2, 0, 1, 0, 2, 2]
        }
      };
    }

    initContext() {
      if (!this.ctx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;
        this.ctx = new AudioContextClass();

        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
        this.masterGain.gain.linearRampToValueAtTime(this.targetVolume, this.ctx.currentTime + 0.05);

        this.filterNode = this.ctx.createBiquadFilter();
        this.filterNode.type = 'lowpass';
        this.filterNode.frequency.setValueAtTime(2800, this.ctx.currentTime);
        this.filterNode.Q.setValueAtTime(2.2, this.ctx.currentTime);

        this.delayNode = this.ctx.createDelay();
        this.delayNode.delayTime.setValueAtTime(0.24, this.ctx.currentTime);
        this.delayFeedback = this.ctx.createGain();
        this.delayFeedback.gain.setValueAtTime(0.22, this.ctx.currentTime);

        this.delayNode.connect(this.delayFeedback);
        this.delayFeedback.connect(this.delayNode);
        this.delayNode.connect(this.filterNode);

        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 128;
        this.analyser.smoothingTimeConstant = 0.82;
        this.freqDataArray = new Uint8Array(this.analyser.frequencyBinCount);
        this.timeDataArray = new Uint8Array(this.analyser.fftSize);

        this.filterNode.connect(this.masterGain);
        this.masterGain.connect(this.analyser);
        this.analyser.connect(this.ctx.destination);
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    }

    playTrack(trackKey) {
      this.initContext();
      if (!this.ctx) return;

      if (trackKey && this.tracks[trackKey]) {
        this.currentTrack = trackKey;
        this.bpm = this.tracks[trackKey].bpm;
      }

      const now = this.ctx.currentTime;
      if (this.masterGain) {
        this.masterGain.gain.cancelScheduledValues(now);
        this.masterGain.gain.setValueAtTime(Math.max(0.0001, this.masterGain.gain.value), now);
        this.masterGain.gain.linearRampToValueAtTime(this.targetVolume, now + 0.04);
      }

      this.isPlaying = true;
      this.step = 0;
      this.nextStepTime = now + 0.02;
      this.scheduleLoop();
    }

    stopTrack() {
      this.isPlaying = false;
      if (this.timerId) {
        clearTimeout(this.timerId);
        this.timerId = null;
      }
      if (this.ctx && this.masterGain) {
        const now = this.ctx.currentTime;
        this.masterGain.gain.cancelScheduledValues(now);
        this.masterGain.gain.setValueAtTime(Math.max(0.0001, this.masterGain.gain.value), now);
        this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
      }
    }

    scheduleLoop() {
      if (!this.isPlaying || !this.ctx) return;

      const track = this.tracks[this.currentTrack];
      if (!track) return;

      const stepDuration = (60 / this.bpm) / 4;

      // Lookahead scheduling loop: schedule all notes up to (currentTime + scheduleAheadTime)
      while (this.nextStepTime < this.ctx.currentTime + this.scheduleAheadTime) {
        this.scheduleStepNotes(track, this.step, this.nextStepTime, stepDuration);
        this.nextStepTime += stepDuration;
        this.step++;
      }

      this.timerId = setTimeout(() => this.scheduleLoop(), this.lookaheadInterval);
    }

    scheduleStepNotes(track, stepIndex, time, stepDuration) {
      if (!this.filterNode || !this.ctx) return;
      const step16 = stepIndex % 16;

      // 1. Drum Machine
      const drumType = track.drumPattern[step16];
      if (drumType === 1) {
        this.triggerKick(time, this.currentTrack === 'rubin_808');
      } else if (drumType === 2) {
        this.triggerSnare(time);
      }

      // Hi-Hat
      if (this.currentTrack !== 'rubin_808' || step16 % 4 === 0) {
        this.triggerHiHat(time, step16 % 2 === 0);
      }

      // 2. Bass Synthesizer
      const bassFreq = track.bassSeq[step16];
      if (bassFreq > 0) {
        this.triggerBass(time, bassFreq, stepDuration * 1.75);
      }

      // 3. Lead Arpeggiator / Melodic Voice
      const leadIdx = track.leadSeq[step16];
      if (leadIdx !== undefined && leadIdx !== null && leadIdx >= 0) {
        const leadFreq = track.scale[leadIdx % track.scale.length];
        if (leadFreq > 0) {
          this.triggerLead(time, leadFreq, stepDuration * 0.95);
        }
      }
    }

    triggerKick(time, isRubinHeavy = false) {
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startFreq = isRubinHeavy ? 165 : 130;
        const endFreq = isRubinHeavy ? 28 : 36;
        const duration = isRubinHeavy ? 0.30 : 0.15;
        const peak = isRubinHeavy ? 0.95 : 0.82;

        osc.frequency.setValueAtTime(startFreq, time);
        osc.frequency.exponentialRampToValueAtTime(endFreq, time + duration);

        // Anti-click micro-ramp
        gain.gain.setValueAtTime(0.0001, time);
        gain.gain.linearRampToValueAtTime(peak, time + 0.003);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

        osc.connect(gain);
        gain.connect(this.filterNode);
        osc.start(time);
        osc.stop(time + duration);

        setTimeout(() => {
          try { osc.disconnect(); gain.disconnect(); } catch(e) {}
        }, (duration + 0.08) * 1000);
      } catch(e) {}
    }

    triggerSnare(time) {
      try {
        const noise = this.ctx.createBufferSource();
        const buffer = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * 0.12), this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.45;
        noise.buffer = buffer;

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.0001, time);
        gain.gain.linearRampToValueAtTime(0.36, time + 0.003);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.11);

        noise.connect(gain);
        gain.connect(this.filterNode);
        noise.start(time);
        noise.stop(time + 0.11);

        setTimeout(() => {
          try { noise.disconnect(); gain.disconnect(); } catch(e) {}
        }, 160);
      } catch(e) {}
    }

    triggerHiHat(time, accent) {
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(7800, time);

        const peak = accent ? 0.12 : 0.05;
        gain.gain.setValueAtTime(0.0001, time);
        gain.gain.linearRampToValueAtTime(peak, time + 0.002);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.038);

        osc.connect(gain);
        gain.connect(this.filterNode);
        osc.start(time);
        osc.stop(time + 0.038);

        setTimeout(() => {
          try { osc.disconnect(); gain.disconnect(); } catch(e) {}
        }, 80);
      } catch(e) {}
    }

    triggerBass(time, freq, duration) {
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, time);

        gain.gain.setValueAtTime(0.0001, time);
        gain.gain.linearRampToValueAtTime(0.52, time + 0.004);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

        osc.connect(gain);
        gain.connect(this.filterNode);
        osc.start(time);
        osc.stop(time + duration);

        setTimeout(() => {
          try { osc.disconnect(); gain.disconnect(); } catch(e) {}
        }, (duration + 0.08) * 1000);
      } catch(e) {}
    }

    triggerLead(time, freq, duration) {
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq * 2, time);

        gain.gain.setValueAtTime(0.0001, time);
        gain.gain.linearRampToValueAtTime(0.32, time + 0.004);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

        osc.connect(gain);
        gain.connect(this.filterNode);
        if (this.delayNode) gain.connect(this.delayNode);
        osc.start(time);
        osc.stop(time + duration);

        setTimeout(() => {
          try { osc.disconnect(); gain.disconnect(); } catch(e) {}
        }, (duration + 0.08) * 1000);
      } catch(e) {}
    }

    setFilterCutoff(freq) {
      if (this.filterNode && this.ctx) {
        const f = Math.max(200, Math.min(10000, parseFloat(freq) || 2800));
        this.filterNode.frequency.setTargetAtTime(f, this.ctx.currentTime, 0.02);
      }
    }

    setVolume(val) {
      this.targetVolume = Math.max(0, Math.min(1, parseFloat(val) || 0.35));
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setTargetAtTime(this.targetVolume, this.ctx.currentTime, 0.02);
      }
    }

    setBpm(val) {
      this.bpm = Math.max(40, Math.min(220, parseInt(val, 10) || 90));
    }

    getFrequencyData() {
      if (!this.analyser || !this.freqDataArray) return new Uint8Array(64);
      this.analyser.getByteFrequencyData(this.freqDataArray);
      return this.freqDataArray;
    }

    getTimeDomainData() {
      if (!this.analyser || !this.timeDataArray) return new Uint8Array(128).fill(128);
      this.analyser.getByteTimeDomainData(this.timeDataArray);
      return this.timeDataArray;
    }

    getAnalyserData() {
      return this.getFrequencyData();
    }

    getPeakLevel() {
      if (!this.analyser || !this.freqDataArray) return 0;
      this.analyser.getByteFrequencyData(this.freqDataArray);
      let sum = 0;
      for (let i = 0; i < this.freqDataArray.length; i++) {
        sum += this.freqDataArray[i];
      }
      return (sum / (this.freqDataArray.length * 255));
    }

    getAudioDestinationStream() {
      this.initContext();
      if (!this.destNode && this.ctx && this.masterGain) {
        this.destNode = this.ctx.createMediaStreamDestination();
        this.masterGain.connect(this.destNode);
      }
      return this.destNode ? this.destNode.stream : new MediaStream();
    }

    getAudioDestinationNode() {
      this.initContext();
      return this.masterGain;
    }

    getCurrentTrackInfo() {
      return this.tracks[this.currentTrack] || {
        name: "Unknown Track",
        genre: "Web Audio",
        scaleName: "Custom",
        bpm: this.bpm
      };
    }
  }

  window.ZothMusicEngine = new ZothMusicEngine();
})(typeof window !== 'undefined' ? window : this);
