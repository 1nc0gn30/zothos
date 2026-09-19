import { ZoomSegment, AnimationCurve, ZoomFocus, TapEvent } from '../types/models';

export interface AnimationSample {
  scale: number;
  offsetX: number;
  offsetY: number;
}

export const BASE_HEIGHT_FRACTION = 0.9;

export function sampleAnimation(
  seconds: number,
  segments: ZoomSegment[],
  baseScale: number,
  baseOffset: { width: number; height: number }
): AnimationSample {
  const base: AnimationSample = {
    scale: baseScale,
    offsetX: baseOffset.width,
    offsetY: baseOffset.height,
  };

  const segment = segments.find(s => seconds >= s.startTime && seconds <= s.startTime + s.duration);
  if (!segment) return base;

  const localT = seconds - segment.startTime;
  const half = Math.max(0.05, segment.duration / 2);
  const transitionIn = Math.min(segment.transitionIn, half);
  const transitionOut = Math.min(segment.transitionOut, half);

  const envelope = envelopeProgress(
    localT,
    segment.duration,
    transitionIn,
    transitionOut,
    segment.curve
  );

  const peak = peakState(segment);
  return {
    scale: lerp(base.scale, peak.scale, envelope),
    offsetX: lerp(base.offsetX, peak.offsetX, envelope),
    offsetY: lerp(base.offsetY, peak.offsetY, envelope),
  };
}

function peakState(segment: ZoomSegment): AnimationSample {
  const factor = (BASE_HEIGHT_FRACTION * (segment.scale - 1)) / 2;
  let nx = segment.panX ?? 0;
  let ny = segment.panY ?? 0;

  if (segment.focus === 'top') {
    nx = 0; ny = -1;
  } else if (segment.focus === 'bottom') {
    nx = 0; ny = 1;
  } else if (segment.focus === 'left') {
    nx = -1; ny = 0;
  } else if (segment.focus === 'right') {
    nx = 1; ny = 0;
  } else if (segment.focus === 'top-left') {
    nx = -1; ny = -1;
  } else if (segment.focus === 'top-right') {
    nx = 1; ny = -1;
  } else if (segment.focus === 'bottom-left') {
    nx = -1; ny = 1;
  } else if (segment.focus === 'bottom-right') {
    nx = 1; ny = 1;
  } else if (segment.focus === 'center') {
    nx = 0; ny = 0;
  }

  // Multiply by -1 so panning toward top-left shifts canvas content to bring top-left into center
  const dx = -nx * factor;
  const dy = -ny * factor;

  return { scale: segment.scale, offsetX: dx, offsetY: dy };
}

function envelopeProgress(
  localTime: number,
  duration: number,
  transitionIn: number,
  transitionOut: number,
  curve: AnimationCurve
): number {
  if (duration <= 0 || localTime <= 0) return 0;
  if (localTime >= duration) return 0;

  const easeFn = easingFunction(curve);

  if (localTime < transitionIn && transitionIn > 0) {
    return easeFn(localTime / transitionIn);
  }
  const outStart = duration - transitionOut;
  if (localTime >= outStart && transitionOut > 0) {
    return 1 - easeFn((localTime - outStart) / transitionOut);
  }
  return 1;
}

function easingFunction(curve: AnimationCurve): (u: number) => number {
  switch (curve) {
    case 'spring':
      return (u: number) => springOut(u, 1.55);
    case 'bouncy':
      return (u: number) => springOut(u, 2.7);
    case 'smooth':
      return easeInOutCubic;
    case 'snappy':
      return easeOutQuart;
    case 'gentle':
      return easeOutSine;
    case 'linear':
    default:
      return (u: number) => Math.max(0, Math.min(1, u));
  }
}

function springOut(u: number, overshoot: number): number {
  const c1 = overshoot;
  const c3 = c1 + 1;
  const t = Math.max(0, Math.min(1, u)) - 1;
  return 1 + c3 * t * t * t + c1 * t * t;
}

function easeInOutCubic(u: number): number {
  const c = Math.max(0, Math.min(1, u));
  return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2;
}

function easeOutQuart(u: number): number {
  const c = Math.max(0, Math.min(1, u));
  return 1 - Math.pow(1 - c, 4);
}

function easeOutSine(u: number): number {
  const c = Math.max(0, Math.min(1, u));
  return Math.sin((c * Math.PI) / 2);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

// TAP FEEDBACK SAMPLER
export interface TapFeedbackSample {
  ringScale: number;
  ringOpacity: number;
  coreScale: number;
  coreOpacity: number;
}

export function sampleTapFeedback(seconds: number, event: TapEvent): TapFeedbackSample | null {
  const endTime = event.startTime + event.duration;
  if (event.duration <= 0 || seconds < event.startTime || seconds > endTime) {
    return null;
  }

  const progress = Math.max(0, Math.min(1, (seconds - event.startTime) / event.duration));
  const appear = smoothstep(Math.max(0, Math.min(1, progress / 0.10)));
  const fade = 1 - smoothstep(Math.max(0, Math.min(1, (progress - 0.58) / 0.42)));
  const expansion = 1 - Math.pow(1 - progress, 3); // easeOutCubic

  const backProgress = Math.min(progress / 0.28, 1);
  const backVal = easeOutBack(backProgress);

  return {
    ringScale: 0.32 + 0.68 * expansion,
    ringOpacity: appear * (1 - progress) * 0.92,
    coreScale: 0.72 + 0.28 * backVal,
    coreOpacity: appear * fade * 0.88,
  };
}

function smoothstep(value: number): number {
  return value * value * (3 - 2 * value);
}

function easeOutBack(value: number): number {
  const c1 = 1.35;
  const c3 = c1 + 1;
  const t = value - 1;
  return 1 + c3 * t * t * t + c1 * t * t;
}
