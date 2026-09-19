import { ZoomSegment, ZoomFocus, AnimationCurve } from '../types/models';

export interface BeatAnalysisResult {
  /** Estimated tempo in beats per minute, clamped to 70..180 BPM range */
  bpm: number;
  /** Array of beat timestamps in seconds corresponding to musical beats across the track */
  beatTimestamps: number[];
  /** Downsampled peak waveform data points (e.g. 200 values normalized 0..1) */
  waveform: number[];
  /** Alias for waveform */
  waveformData?: number[];
}

export interface BeatDetectionOptions {
  /** Number of downsampled waveform points for timeline visualization (default: 200) */
  waveformSamples?: number;
  /** Minimum BPM to search for (default: 70) */
  minBpm?: number;
  /** Maximum BPM to search for (default: 180) */
  maxBpm?: number;
  /** Lowpass filter cutoff frequency in Hz for kick/sub-bass band (default: 150) */
  lowpassCutoff?: number;
  /** Highpass filter cutoff frequency in Hz to eliminate DC offset / sub-rumble (default: 60) */
  highpassCutoff?: number;
  /** Sensitivity multiplier for adaptive transient thresholding (default: 1.35) */
  thresholdMultiplier?: number;
}

export interface SnapBeatResult {
  snappedTime: number;
  didSnap: boolean;
}

/**
 * Generates a unique ID for ZoomSegment
 */
function generateUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'beat-zoom-' + Math.random().toString(36).substring(2, 11) + '-' + Date.now().toString(36);
}

/**
 * Direct Form II Transposed Biquad Filter implementation for software DSP fallback.
 */
class BiquadFilterDSP {
  private b0 = 1;
  private b1 = 0;
  private b2 = 0;
  private a1 = 0;
  private a2 = 0;
  private z1 = 0;
  private z2 = 0;

  constructor(type: 'lowpass' | 'highpass', freq: number, sampleRate: number, q: number = 0.707) {
    const w0 = (2 * Math.PI * freq) / sampleRate;
    const cosW0 = Math.cos(w0);
    const sinW0 = Math.sin(w0);
    const alpha = sinW0 / (2 * q);

    let a0 = 1;
    let b0 = 1, b1 = 0, b2 = 0, a1 = 0, a2 = 0;

    if (type === 'lowpass') {
      b0 = (1 - cosW0) / 2;
      b1 = 1 - cosW0;
      b2 = (1 - cosW0) / 2;
      a0 = 1 + alpha;
      a1 = -2 * cosW0;
      a2 = 1 - alpha;
    } else if (type === 'highpass') {
      b0 = (1 + cosW0) / 2;
      b1 = -(1 + cosW0);
      b2 = (1 + cosW0) / 2;
      a0 = 1 + alpha;
      a1 = -2 * cosW0;
      a2 = 1 - alpha;
    }

    this.b0 = b0 / a0;
    this.b1 = b1 / a0;
    this.b2 = b2 / a0;
    this.a1 = a1 / a0;
    this.a2 = a2 / a0;
  }

  process(x: number): number {
    const y = this.b0 * x + this.z1;
    this.z1 = this.b1 * x - this.a1 * y + this.z2;
    this.z2 = this.b2 * x - this.a2 * y;
    return y;
  }

  reset() {
    this.z1 = 0;
    this.z2 = 0;
  }
}

/**
 * Decodes audio source (URL string, Blob, or AudioBuffer) into an AudioBuffer using Web Audio API.
 */
export async function decodeAudioSource(
  audioInput: string | Blob | AudioBuffer
): Promise<AudioBuffer> {
  if (typeof AudioBuffer !== 'undefined' && audioInput instanceof AudioBuffer) {
    return audioInput;
  }

  let arrayBuffer: ArrayBuffer;

  if (typeof Blob !== 'undefined' && audioInput instanceof Blob) {
    arrayBuffer = await audioInput.arrayBuffer();
  } else if (typeof audioInput === 'string') {
    const res = await fetch(audioInput);
    if (!res.ok) {
      throw new Error(`Failed to fetch audio from "${audioInput}": ${res.statusText}`);
    }
    arrayBuffer = await res.arrayBuffer();
  } else {
    throw new Error('Unsupported audio input format for beat detection.');
  }

  const AudioContextClass =
    typeof window !== 'undefined'
      ? window.AudioContext || (window as any).webkitAudioContext
      : null;

  let audioCtx: AudioContext | OfflineAudioContext;
  if (AudioContextClass) {
    audioCtx = new AudioContextClass();
  } else if (typeof OfflineAudioContext !== 'undefined') {
    audioCtx = new OfflineAudioContext(1, 44100, 44100);
  } else {
    throw new Error('Web Audio API is not supported in this environment.');
  }

  try {
    const bufferCopy = arrayBuffer.slice(0);
    const decoded = await new Promise<AudioBuffer>((resolve, reject) => {
      const promise = audioCtx.decodeAudioData(
        bufferCopy,
        (buf) => resolve(buf),
        (err) => reject(err)
      );
      if (promise && typeof promise.then === 'function') {
        promise.then(resolve).catch(reject);
      }
    });

    return decoded;
  } finally {
    if (audioCtx instanceof AudioContext && audioCtx.state !== 'closed') {
      audioCtx.close().catch(() => {});
    }
  }
}

/**
 * Extracts downsampled waveform peak points (default 200) across the entire audio track for visualization.
 */
export function extractDownsampledWaveform(
  audioBuffer: AudioBuffer,
  numPoints: number = 200
): number[] {
  if (!audioBuffer || audioBuffer.length === 0 || numPoints <= 0) {
    return new Array(Math.max(1, numPoints)).fill(0);
  }

  const length = audioBuffer.length;
  const numChannels = audioBuffer.numberOfChannels;
  const channelData: Float32Array[] = [];
  for (let c = 0; c < numChannels; c++) {
    channelData.push(audioBuffer.getChannelData(c));
  }

  const points = Math.min(numPoints, length);
  const blockSize = Math.floor(length / points);
  const waveform: number[] = new Array(points);

  let globalMax = 0;

  for (let i = 0; i < points; i++) {
    const start = i * blockSize;
    const end = i === points - 1 ? length : (i + 1) * blockSize;
    let blockMax = 0;

    for (let j = start; j < end; j++) {
      let sum = 0;
      for (let c = 0; c < numChannels; c++) {
        sum += Math.abs(channelData[c][j]);
      }
      const avg = sum / numChannels;
      if (avg > blockMax) {
        blockMax = avg;
      }
    }

    waveform[i] = blockMax;
    if (blockMax > globalMax) {
      globalMax = blockMax;
    }
  }

  // Normalize between 0.0 and 1.0 (rounded to 4 decimals)
  const normFactor = globalMax > 0.0001 ? 1 / globalMax : 1;
  for (let i = 0; i < points; i++) {
    waveform[i] = Number((waveform[i] * normFactor).toFixed(4));
  }

  return waveform;
}

/**
 * Applies software DSP bandpass filtering (highpass + lowpass) on downsampled mono audio data.
 */
function softwareBandpassFilter(
  audioBuffer: AudioBuffer,
  targetSampleRate: number = 22050,
  lowpassFreq: number = 150,
  highpassFreq: number = 60
): Float32Array {
  const duration = audioBuffer.duration;
  const totalTargetSamples = Math.floor(duration * targetSampleRate);
  const filtered = new Float32Array(totalTargetSamples);

  const numChannels = audioBuffer.numberOfChannels;
  const sourceSampleRate = audioBuffer.sampleRate;
  const step = sourceSampleRate / targetSampleRate;

  const channels: Float32Array[] = [];
  for (let c = 0; c < numChannels; c++) {
    channels.push(audioBuffer.getChannelData(c));
  }

  const hpFilter = new BiquadFilterDSP('highpass', highpassFreq, targetSampleRate, 0.707);
  const lpFilter = new BiquadFilterDSP('lowpass', lowpassFreq, targetSampleRate, 0.707);

  for (let i = 0; i < totalTargetSamples; i++) {
    const srcIndex = Math.min(Math.floor(i * step), audioBuffer.length - 1);
    let monoSample = 0;
    for (let c = 0; c < numChannels; c++) {
      monoSample += channels[c][srcIndex];
    }
    monoSample /= numChannels;

    // Apply highpass then lowpass
    const hpOut = hpFilter.process(monoSample);
    const lpOut = lpFilter.process(hpOut);
    filtered[i] = lpOut;
  }

  return filtered;
}

/**
 * Filters the audio focusing on the low-frequency kick drum & sub-bass band (60-150Hz)
 * using OfflineAudioContext with fallback to software Direct Form II Transposed Biquad DSP.
 */
async function filterSubBassBand(
  audioBuffer: AudioBuffer,
  lowpassFreq: number = 150,
  highpassFreq: number = 60,
  targetSampleRate: number = 22050
): Promise<{ data: Float32Array; sampleRate: number }> {
  const duration = audioBuffer.duration;
  const totalSamples = Math.ceil(duration * targetSampleRate);

  if (typeof OfflineAudioContext !== 'undefined') {
    try {
      const offlineCtx = new OfflineAudioContext(1, totalSamples, targetSampleRate);
      const source = offlineCtx.createBufferSource();
      source.buffer = audioBuffer;

      const highpass = offlineCtx.createBiquadFilter();
      highpass.type = 'highpass';
      highpass.frequency.value = highpassFreq;
      highpass.Q.value = 0.707;

      const lowpass = offlineCtx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.value = lowpassFreq;
      lowpass.Q.value = 0.707;

      source.connect(highpass);
      highpass.connect(lowpass);
      lowpass.connect(offlineCtx.destination);

      source.start(0);
      const renderedBuffer = await offlineCtx.startRendering();
      return {
        data: renderedBuffer.getChannelData(0),
        sampleRate: targetSampleRate,
      };
    } catch {
      // Fall through to pure TypeScript DSP
    }
  }

  const data = softwareBandpassFilter(audioBuffer, targetSampleRate, lowpassFreq, highpassFreq);
  return { data, sampleRate: targetSampleRate };
}

interface TransientOnset {
  time: number;
  strength: number;
  frameIndex: number;
}

/**
 * Computes energy flux and detects transient rhythmic beat onsets in the low frequency band.
 */
function computeEnergyFluxAndOnsets(
  signal: Float32Array,
  sampleRate: number,
  thresholdMultiplier: number = 1.35
): {
  energyFlux: Float32Array;
  frameHopSec: number;
  onsets: TransientOnset[];
} {
  const frameSize = 512;
  const hopSize = 256;
  const frameHopSec = hopSize / sampleRate;
  const numFrames = Math.floor((signal.length - frameSize) / hopSize);

  if (numFrames <= 0) {
    return {
      energyFlux: new Float32Array(0),
      frameHopSec: 0.01,
      onsets: [],
    };
  }

  // 1. Calculate RMS energy per frame
  const energies = new Float32Array(numFrames);
  for (let m = 0; m < numFrames; m++) {
    const offset = m * hopSize;
    let sumSquares = 0;
    for (let k = 0; k < frameSize; k++) {
      const sample = signal[offset + k];
      sumSquares += sample * sample;
    }
    energies[m] = Math.sqrt(sumSquares / frameSize);
  }

  // 2. Compute Energy Flux (half-wave rectified first difference)
  const flux = new Float32Array(numFrames);
  let maxFlux = 0;
  for (let m = 1; m < numFrames; m++) {
    const diff = energies[m] - energies[m - 1];
    flux[m] = diff > 0 ? diff : 0;
    if (flux[m] > maxFlux) {
      maxFlux = flux[m];
    }
  }

  if (maxFlux <= 0.00001) {
    return { energyFlux: flux, frameHopSec, onsets: [] };
  }

  // 3. Adaptive local thresholding to identify true transient peaks
  // Window of +/- 18 frames (~ +/- 0.2s, total ~0.4s local context)
  const localWindow = 18;
  const candidateOnsets: TransientOnset[] = [];
  const minAbsoluteThreshold = maxFlux * 0.06;

  for (let m = 2; m < numFrames - 2; m++) {
    const currentVal = flux[m];
    if (currentVal < minAbsoluteThreshold) continue;

    // Peak condition: strictly greater than preceding and at least equal to succeeding
    if (currentVal <= flux[m - 1] || currentVal < flux[m + 1]) continue;

    // Calculate local mean and standard deviation
    const winStart = Math.max(0, m - localWindow);
    const winEnd = Math.min(numFrames - 1, m + localWindow);
    const winCount = winEnd - winStart + 1;

    let mean = 0;
    for (let j = winStart; j <= winEnd; j++) {
      mean += flux[j];
    }
    mean /= winCount;

    let variance = 0;
    for (let j = winStart; j <= winEnd; j++) {
      const d = flux[j] - mean;
      variance += d * d;
    }
    const stdDev = Math.sqrt(variance / winCount);

    const adaptiveThreshold = mean + thresholdMultiplier * stdDev;

    if (currentVal > adaptiveThreshold) {
      candidateOnsets.push({
        time: m * frameHopSec,
        strength: currentVal,
        frameIndex: m,
      });
    }
  }

  // 4. Non-maximum suppression: prevent duplicate triggers within 0.18s
  const minSpacingSec = 0.18;
  const filteredOnsets: TransientOnset[] = [];

  for (const onset of candidateOnsets) {
    if (filteredOnsets.length === 0) {
      filteredOnsets.push(onset);
      continue;
    }

    const prev = filteredOnsets[filteredOnsets.length - 1];
    if (onset.time - prev.time < minSpacingSec) {
      // Keep the stronger transient
      if (onset.strength > prev.strength) {
        filteredOnsets[filteredOnsets.length - 1] = onset;
      }
    } else {
      filteredOnsets.push(onset);
    }
  }

  return {
    energyFlux: flux,
    frameHopSec,
    onsets: filteredOnsets,
  };
}

/**
 * Estimates BPM from energy flux signal using multi-harmonic autocorrelation and comb filtering.
 * Clamped strictly to the [minBpm..maxBpm] range (70..180 BPM).
 */
function estimateBPM(
  energyFlux: Float32Array,
  frameHopSec: number,
  onsets: TransientOnset[],
  minBpm: number = 70,
  maxBpm: number = 180
): number {
  if (energyFlux.length === 0 || frameHopSec <= 0) {
    return 120.0;
  }

  const numFrames = energyFlux.length;
  let bestBpm = 120.0;
  let maxScore = -Infinity;

  // Inter-onset interval (IOI) histogram boosting
  const ioiWeights = new Map<number, number>();
  for (let i = 0; i < onsets.length; i++) {
    for (let j = i + 1; j < Math.min(i + 8, onsets.length); j++) {
      const dt = onsets[j].time - onsets[i].time;
      if (dt >= 0.33 && dt <= 2.0) {
        let candidateBpm = 60 / dt;
        while (candidateBpm < minBpm) candidateBpm *= 2;
        while (candidateBpm > maxBpm) candidateBpm /= 2;

        if (candidateBpm >= minBpm && candidateBpm <= maxBpm) {
          const roundedBpm = Math.round(candidateBpm);
          const weight = (onsets[i].strength + onsets[j].strength) * 0.5;
          ioiWeights.set(roundedBpm, (ioiWeights.get(roundedBpm) || 0) + weight);
        }
      }
    }
  }

  // Sweep BPM from minBpm to maxBpm in 0.5 BPM steps
  for (let bpm = minBpm; bpm <= maxBpm; bpm += 0.5) {
    const periodSec = 60 / bpm;
    const lagFrames = periodSec / frameHopSec;
    const lag0 = Math.round(lagFrames);

    if (lag0 <= 0 || lag0 >= numFrames) continue;

    // Autocorrelation function at lag0
    let r1 = 0;
    const limit1 = numFrames - lag0;
    for (let m = 0; m < limit1; m++) {
      r1 += energyFlux[m] * energyFlux[m + lag0];
    }
    r1 /= limit1;

    // Harmonic lag 2x (two-beat interval)
    let r2 = 0;
    const lag2 = Math.round(lagFrames * 2);
    if (lag2 < numFrames) {
      const limit2 = numFrames - lag2;
      for (let m = 0; m < limit2; m++) {
        r2 += energyFlux[m] * energyFlux[m + lag2];
      }
      r2 /= limit2;
    }

    // Harmonic lag 0.5x (half-beat / eighth note interval)
    let rHalf = 0;
    const lagHalf = Math.round(lagFrames * 0.5);
    if (lagHalf > 0 && lagHalf < numFrames) {
      const limitHalf = numFrames - lagHalf;
      for (let m = 0; m < limitHalf; m++) {
        rHalf += energyFlux[m] * energyFlux[m + lagHalf];
      }
      rHalf /= limitHalf;
    }

    // Combined multi-harmonic comb filter score
    const combScore = r1 + 0.65 * r2 + 0.3 * rHalf;

    // Soft Gaussian tempo prior centered at 120 BPM (standard music center)
    const bpmPrior = Math.exp(-Math.pow(bpm - 120, 2) / (2 * Math.pow(42, 2)));

    // IOI histogram boost
    const roundedIntBpm = Math.round(bpm);
    const ioiBonus = (ioiWeights.get(roundedIntBpm) || 0) * 0.15;

    const totalScore = combScore * (0.8 + 0.2 * bpmPrior) + ioiBonus;

    if (totalScore > maxScore) {
      maxScore = totalScore;
      bestBpm = bpm;
    }
  }

  // Ensure clamped to bounds
  bestBpm = Math.max(minBpm, Math.min(maxBpm, bestBpm));
  return Number((Math.round(bestBpm * 10) / 10).toFixed(1));
}

/**
 * Finds the optimal phase offset that aligns a regular beat grid with detected transient peaks,
 * and generates the full array of musical beat timestamps across the track.
 */
function generateBeatGridTimestamps(
  bpm: number,
  duration: number,
  onsets: TransientOnset[]
): number[] {
  if (bpm <= 0 || duration <= 0) return [];

  const beatPeriodSec = 60 / bpm;
  const numSteps = Math.floor(beatPeriodSec / 0.005); // 5ms phase search resolution
  let bestOffset = 0;
  let maxPhaseScore = -Infinity;

  // Search optimal phase offset phi in [0..beatPeriodSec)
  for (let s = 0; s < numSteps; s++) {
    const phi = s * 0.005;
    let score = 0;

    for (let t = phi; t <= duration; t += beatPeriodSec) {
      for (const onset of onsets) {
        const dt = Math.abs(onset.time - t);
        if (dt < 0.06) {
          // Gaussian weighting around grid line
          score += onset.strength * Math.exp(-Math.pow(dt, 2) / (2 * Math.pow(0.025, 2)));
        }
      }
    }

    if (score > maxPhaseScore) {
      maxPhaseScore = score;
      bestOffset = phi;
    }
  }

  // Generate beat timestamps across the entire duration
  const timestamps: number[] = [];
  for (let t = bestOffset; t <= duration; t += beatPeriodSec) {
    if (t < 0) continue;

    // If there is an actual transient peak within 35ms, snap lightly to humanized transient peak
    let finalTime = t;
    let closestDist = 0.035;

    for (const onset of onsets) {
      const dist = Math.abs(onset.time - t);
      if (dist < closestDist) {
        closestDist = dist;
        finalTime = onset.time;
      }
    }

    timestamps.push(Number(finalTime.toFixed(3)));
  }

  return timestamps;
}

/**
 * Analyzes audio for beat tracking, tempo (BPM) detection, and downsampled waveform extraction.
 *
 * Pipeline:
 * 1. Decodes audio source into AudioBuffer.
 * 2. Extracts downsampled waveform peaks (200 data points across the track for waveform visualization).
 * 3. Applies low-frequency bandpass filtering (60-150Hz) to isolate sub-bass and kick drum punch.
 * 4. Runs energy flux and transient peak detection to capture rhythmic onsets.
 * 5. Estimates musical BPM via multi-harmonic autocorrelation (clamped to 70..180 BPM range).
 * 6. Generates phase-aligned musical beat timestamps across the full track duration.
 *
 * @param audioUrlOrBlob Audio file URL string, Blob/File, or existing AudioBuffer.
 * @param options Optional configuration parameters.
 * @returns Promise resolving to { bpm, beatTimestamps, waveform }
 */
export async function analyzeAudioForBeats(
  audioUrlOrBlob: string | Blob | AudioBuffer,
  options?: BeatDetectionOptions
): Promise<BeatAnalysisResult> {
  const waveformSamples = options?.waveformSamples ?? 200;
  const minBpm = options?.minBpm ?? 70;
  const maxBpm = options?.maxBpm ?? 180;
  const lowpassCutoff = options?.lowpassCutoff ?? 150;
  const highpassCutoff = options?.highpassCutoff ?? 60;
  const thresholdMultiplier = options?.thresholdMultiplier ?? 1.35;

  // 1. Decode audio source into AudioBuffer
  const audioBuffer = await decodeAudioSource(audioUrlOrBlob);
  const duration = audioBuffer.duration;

  if (!duration || duration <= 0) {
    return {
      bpm: 120.0,
      beatTimestamps: [],
      waveform: new Array(waveformSamples).fill(0),
    };
  }

  // 2. Extract downsampled waveform peaks for UI display
  const waveform = extractDownsampledWaveform(audioBuffer, waveformSamples);

  // 3. Low-frequency bandpass filtering (60-150Hz)
  const { data: filteredSignal, sampleRate } = await filterSubBassBand(
    audioBuffer,
    lowpassCutoff,
    highpassCutoff,
    22050
  );

  // 4. Energy flux & transient onset detection
  const { energyFlux, frameHopSec, onsets } = computeEnergyFluxAndOnsets(
    filteredSignal,
    sampleRate,
    thresholdMultiplier
  );

  // 5. BPM estimation (clamped to 70..180)
  const bpm = estimateBPM(energyFlux, frameHopSec, onsets, minBpm, maxBpm);

  // 6. Generate phase-aligned beat timestamps
  const beatTimestamps = generateBeatGridTimestamps(bpm, duration, onsets);

  return {
    bpm,
    beatTimestamps,
    waveform,
    waveformData: waveform,
  };
}

/**
 * Snaps a target timeline timestamp to the nearest detected musical beat within a snap window.
 *
 * @param time Current playhead or segment boundary time in seconds.
 * @param beatTimestamps Array of detected beat timestamps in seconds.
 * @param snapWindowSec Maximum distance in seconds to trigger snap (default: 0.15s).
 * @returns { snappedTime, didSnap }
 */
export function snapTimeToNearestBeat(
  time: number,
  beatTimestamps: number[],
  snapWindowSec: number = 0.15
): SnapBeatResult {
  if (!beatTimestamps || beatTimestamps.length === 0 || !Number.isFinite(time)) {
    return { snappedTime: time, didSnap: false };
  }

  // Binary search for closest timestamp in sorted array
  let low = 0;
  let high = beatTimestamps.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (beatTimestamps[mid] === time) {
      return { snappedTime: time, didSnap: true };
    }
    if (beatTimestamps[mid] < time) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  let closest = beatTimestamps[0];
  let minDiff = Math.abs(closest - time);

  for (const idx of [high, low]) {
    if (idx >= 0 && idx < beatTimestamps.length) {
      const diff = Math.abs(beatTimestamps[idx] - time);
      if (diff < minDiff) {
        minDiff = diff;
        closest = beatTimestamps[idx];
      }
    }
  }

  if (minDiff <= snapWindowSec) {
    return { snappedTime: closest, didSnap: true };
  }

  return { snappedTime: time, didSnap: false };
}

/**
 * Automatically generates ZoomSegment objects synchronized to musical beats.
 *
 * @param beatTimestamps Array of detected musical beat timestamps in seconds.
 * @param intervalBeats Trigger zoom on every Nth beat (default: 4 beats = 1 musical measure/bar).
 * @param zoomDuration Duration of each zoom segment in seconds (default: 1.5s).
 * @param scale Target zoom magnification scale (default: 1.35).
 * @returns Array of synchronized ZoomSegment objects.
 */
export function generateZoomsOnBeats(
  beatTimestamps: number[],
  intervalBeats: number = 4,
  zoomDuration: number = 1.5,
  scale: number = 1.35
): ZoomSegment[] {
  if (!beatTimestamps || beatTimestamps.length === 0) {
    return [];
  }

  const step = Math.max(1, Math.floor(intervalBeats));
  const segments: ZoomSegment[] = [];

  // Visually dynamic focus pattern rotation
  const focusCycle: ZoomFocus[] = [
    'center',
    'top-left',
    'center',
    'bottom-right',
    'top-right',
    'center',
    'bottom-left',
  ];

  for (let i = 0; i < beatTimestamps.length; i += step) {
    const startTime = beatTimestamps[i];
    const nextBeatTime = i + step < beatTimestamps.length ? beatTimestamps[i + step] : undefined;

    // Prevent zoom segments from overlapping the next scheduled beat zoom
    let effectiveDuration = zoomDuration;
    if (nextBeatTime !== undefined) {
      effectiveDuration = Math.min(zoomDuration, (nextBeatTime - startTime) - 0.1);
    }
    effectiveDuration = Math.max(0.3, effectiveDuration);

    const focus = focusCycle[(Math.floor(i / step)) % focusCycle.length];

    // Compute pan coordinates based on focus quadrant
    let panX = 0;
    let panY = 0;
    if (focus.includes('left')) panX = -0.35;
    if (focus.includes('right')) panX = 0.35;
    if (focus.includes('top')) panY = -0.35;
    if (focus.includes('bottom')) panY = 0.35;

    const transitionIn = Number(Math.min(0.35, effectiveDuration * 0.25).toFixed(3));
    const transitionOut = Number(Math.min(0.35, effectiveDuration * 0.25).toFixed(3));
    const curve: AnimationCurve = 'spring';

    segments.push({
      id: generateUUID(),
      startTime: Number(startTime.toFixed(3)),
      duration: Number(effectiveDuration.toFixed(3)),
      scale,
      focus,
      panX,
      panY,
      transitionIn,
      transitionOut,
      curve,
    });
  }

  return segments;
}
