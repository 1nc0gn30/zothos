import { SubtitleItem, SubtitleStyle } from '../types/models';

export type SubtitlePresetStyle = 'hormozi' | 'neonGlow' | 'glassCard' | 'minimal';

export interface SubtitleStylePreset {
  fontSize: number;
  colorHex: string;
  strokeHex?: string;
  bgHex?: string;
  uppercase: boolean;
  positionY: number;
}

export const DEFAULT_WPM = 150;

export const SUBTITLE_STYLE_PRESETS: Record<SubtitlePresetStyle, SubtitleStylePreset> = {
  hormozi: {
    fontSize: 38,
    colorHex: '#FDE047',
    strokeHex: '#000000',
    uppercase: true,
    positionY: 0.82,
  },
  neonGlow: {
    fontSize: 36,
    colorHex: '#38BDF8',
    strokeHex: '#38BDF8',
    bgHex: 'rgba(10, 15, 30, 0.85)',
    uppercase: true,
    positionY: 0.82,
  },
  glassCard: {
    fontSize: 34,
    colorHex: '#FFFFFF',
    strokeHex: 'rgba(255, 255, 255, 0.25)',
    bgHex: 'rgba(15, 23, 42, 0.78)',
    uppercase: true,
    positionY: 0.82,
  },
  minimal: {
    fontSize: 36,
    colorHex: '#FFFFFF',
    uppercase: true,
    positionY: 0.82,
  },
};

export const NEURAL_VOICE_PRESETS = [
  { id: 'en-US-ChristopherNeural', name: 'Christopher (US Male - Deep Authority)', gender: 'Male' },
  { id: 'en-US-JennyNeural', name: 'Jenny (US Female - Natural & Clear)', gender: 'Female' },
  { id: 'en-US-GuyNeural', name: 'Guy (US Male - Casual Podcaster)', gender: 'Male' },
  { id: 'en-US-AriaNeural', name: 'Aria (US Female - Confident Expressive)', gender: 'Female' },
  { id: 'en-US-AndrewNeural', name: 'Andrew (US Male - Warm Copilot)', gender: 'Male' },
  { id: 'en-US-AvaNeural', name: 'Ava (US Female - Friendly & Upbeat)', gender: 'Female' },
  { id: 'en-GB-RyanNeural', name: 'Ryan (UK Male - British Accent)', gender: 'Male' },
  { id: 'en-GB-SoniaNeural', name: 'Sonia (UK Female - British Accent)', gender: 'Female' },
  { id: 'en-US-BrianNeural', name: 'Brian (US Male - Approachable)', gender: 'Male' },
  { id: 'en-US-AnaNeural', name: 'Ana (US Female - Cute & Energetic)', gender: 'Female' },
];

export async function generateAIAudio(params: {
  text: string;
  voice?: string;
  rate?: number;
  pitch?: number;
  style?: SubtitlePresetStyle;
  startTime?: number;
}): Promise<{
  success: boolean;
  audioUrl?: string;
  subtitles: SubtitleItem[];
  duration: number;
  error?: string;
}> {
  if (typeof window !== 'undefined' && (window as any).electronAPI?.generateNeuralTTS) {
    const res = await (window as any).electronAPI.generateNeuralTTS(params);
    if (res.success && res.audioDataUrl) {
      return {
        success: true,
        audioUrl: res.audioDataUrl,
        subtitles: res.subtitles || [],
        duration: res.duration || 3.0,
      };
    }
  }

  // Fallback: Client-side subtitle parsing
  const subs = splitScriptIntoTimedSubtitles(
    params.text,
    params.startTime || 0,
    160,
    params.style || 'hormozi'
  );
  return {
    success: true,
    subtitles: subs,
    duration: estimateScriptDuration(params.text, 160),
  };
}

/**
 * Check if the browser supports SpeechSynthesis API.
 */
export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

/**
 * Retrieves the list of available speech synthesis voices asynchronously.
 * Handles browser differences where voices may load asynchronously.
 */
export async function getAvailableVoices(): Promise<SpeechSynthesisVoice[]> {
  if (!isSpeechSynthesisSupported()) {
    return [];
  }

  const voices = window.speechSynthesis.getVoices();
  if (voices && voices.length > 0) {
    return voices;
  }

  return new Promise<SpeechSynthesisVoice[]>((resolve) => {
    let resolved = false;

    const finish = () => {
      if (!resolved) {
        resolved = true;
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.removeEventListener('voiceschanged', finish);
        }
        resolve(window.speechSynthesis?.getVoices() || []);
      }
    };

    // Safety timeout in case voiceschanged event doesn't fire
    const timer = setTimeout(finish, 800);

    if (window.speechSynthesis) {
      window.speechSynthesis.addEventListener('voiceschanged', () => {
        clearTimeout(timer);
        finish();
      }, { once: true });
    }
  });
}

/**
 * Speaks the provided text using browser speech synthesis.
 *
 * @param text The text to speak.
 * @param voiceName The optional name or URI of the voice to use.
 * @param rate Speed rate multiplier (0.1 to 10, default 1.0).
 * @param pitch Pitch multiplier (0 to 2, default 1.0).
 */
export async function speakText(
  text: string,
  voiceName?: string,
  rate: number = 1.0,
  pitch: number = 1.0
): Promise<void> {
  if (!isSpeechSynthesisSupported()) {
    console.warn('Speech synthesis is not supported in this browser environment.');
    return;
  }

  const cleanText = text.trim();
  if (!cleanText) return;

  // Cancel any active utterance before starting
  stopSpeaking();

  const voices = await getAvailableVoices();
  const utterance = new SpeechSynthesisUtterance(cleanText);

  if (voiceName) {
    const matchedVoice = voices.find(
      (v) => v.name === voiceName || v.voiceURI === voiceName
    );
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }
  }

  utterance.rate = Math.max(0.1, Math.min(10, rate));
  utterance.pitch = Math.max(0, Math.min(2, pitch));

  return new Promise<void>((resolve, reject) => {
    utterance.onend = () => {
      resolve();
    };

    utterance.onerror = (event) => {
      // Normal cancellation / interruption shouldn't throw a fatal error
      if (event.error === 'canceled' || event.error === 'interrupted') {
        resolve();
      } else {
        console.error('SpeechSynthesis utterance error:', event.error);
        reject(new Error(`Speech synthesis error: ${event.error}`));
      }
    };

    window.speechSynthesis.speak(utterance);
  });
}

/**
 * Stops any active speech synthesis playback.
 */
export function stopSpeaking(): void {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Generate a unique identifier for subtitle items.
 */
function generateSubtitleId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'sub_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
}

/**
 * Helper to split an array of words into bite-sized phrases (3-6 words each).
 */
function chunkWordsIntoPhrases(words: string[]): string[] {
  if (words.length === 0) return [];
  const phrases: string[] = [];
  let index = 0;

  while (index < words.length) {
    const remaining = words.length - index;
    let chunkSize: number;

    if (remaining <= 5) {
      chunkSize = remaining;
    } else if (remaining === 6) {
      chunkSize = 3;
    } else if (remaining === 7) {
      chunkSize = 4;
    } else if (remaining === 8) {
      chunkSize = 4;
    } else if (remaining === 9) {
      chunkSize = 4;
    } else if (remaining === 10) {
      chunkSize = 4;
    } else {
      chunkSize = 4;
    }

    const chunk = words.slice(index, index + chunkSize);
    phrases.push(chunk.join(' '));
    index += chunkSize;
  }

  return phrases;
}

/**
 * Splits a full script into timed, bite-sized viral caption subtitle cards.
 *
 * @param script The full text script.
 * @param startTime The start timestamp in seconds on the timeline.
 * @param wordsPerMinute Reading speed (default 150 WPM).
 * @param style Caption style preset ('hormozi' | 'neonGlow' | 'glassCard' | 'minimal').
 * @returns Array of SubtitleItem objects with sequential timing and styling.
 */
export function splitScriptIntoTimedSubtitles(
  script: string,
  startTime: number,
  wordsPerMinute: number = DEFAULT_WPM,
  style: 'hormozi' | 'neonGlow' | 'glassCard' | 'minimal' = 'hormozi'
): SubtitleItem[] {
  if (!script || !script.trim()) {
    return [];
  }

  const effectiveWpm = wordsPerMinute && wordsPerMinute > 0 ? wordsPerMinute : DEFAULT_WPM;
  const safeStartTime = Math.max(0, startTime || 0);
  const selectedStyleKey: SubtitlePresetStyle =
    style && SUBTITLE_STYLE_PRESETS[style] ? style : 'hormozi';
  const stylePreset = SUBTITLE_STYLE_PRESETS[selectedStyleKey];

  // Split script into paragraphs / blocks
  const paragraphs = script
    .split(/\r?\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const phrases: string[] = [];

  for (const paragraph of paragraphs) {
    // Split sentences by terminal punctuation (. ! ?)
    const sentenceMatches = paragraph.match(/[^.!?]+(?:[.!?]+|$)/g) || [paragraph];

    for (const sentence of sentenceMatches) {
      const words = sentence.trim().split(/\s+/).filter(Boolean);
      if (words.length === 0) continue;

      const sentencePhrases = chunkWordsIntoPhrases(words);
      for (const phrase of sentencePhrases) {
        if (phrase) {
          phrases.push(phrase);
        }
      }
    }
  }

  if (phrases.length === 0) {
    return [];
  }

  let currentStart = safeStartTime;
  const subtitles: SubtitleItem[] = [];

  for (const phrase of phrases) {
    const wordCount = phrase.split(/\s+/).filter(Boolean).length;
    // Calculate duration based on WPM: (wordCount / WPM) * 60 seconds
    const rawDuration = (wordCount / effectiveWpm) * 60;
    // Ensure a minimum readable duration of 0.6s
    const duration = Number(Math.max(0.6, rawDuration).toFixed(2));
    const itemStartTime = Number(currentStart.toFixed(2));

    subtitles.push({
      id: generateSubtitleId(),
      startTime: itemStartTime,
      duration,
      text: phrase,
      style: selectedStyleKey as SubtitleStyle,
      fontSize: stylePreset.fontSize,
      colorHex: stylePreset.colorHex,
      strokeHex: stylePreset.strokeHex,
      bgHex: stylePreset.bgHex,
      uppercase: stylePreset.uppercase,
      positionY: stylePreset.positionY,
    });

    currentStart += duration;
  }

  return subtitles;
}

/**
 * Estimates the total speech duration in seconds for a given script at a specific WPM.
 */
export function estimateScriptDuration(script: string, wordsPerMinute: number = DEFAULT_WPM): number {
  if (!script || !script.trim()) return 0;
  const wordCount = script.trim().split(/\s+/).filter(Boolean).length;
  const effectiveWpm = wordsPerMinute && wordsPerMinute > 0 ? wordsPerMinute : DEFAULT_WPM;
  return Number(((wordCount / effectiveWpm) * 60).toFixed(2));
}
