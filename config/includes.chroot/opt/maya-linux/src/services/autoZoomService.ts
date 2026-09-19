import { ZoomSegment, TapEvent, ZoomFocus, AnimationCurve } from '../types/models';

export interface AutoZoomOptions {
  /** Target zoom scale (default: 1.35) */
  zoomScale?: number;
  /** Minimum duration of each zoom segment in seconds (default: 1.2) */
  minDuration?: number;
  /** Maximum duration of each zoom segment in seconds (default: 6.0) */
  maxDuration?: number;
  /** General padding applied before and after click clusters in seconds */
  paddingSec?: number;
  /** Lead padding in seconds before first click in cluster (default: 0.4) */
  leadPaddingSec?: number;
  /** Tail padding in seconds after last click in cluster (default: 0.8) */
  tailPaddingSec?: number;
  /** Maximum time gap in seconds to group consecutive taps into one cluster (default: 2.5) */
  clusterThresholdSec?: number;
  /** Minimum separation in seconds between distinct zoom segments (default: 0.3) */
  minGapSec?: number;
  /** Animation curve preset (default: 'spring') */
  curve?: AnimationCurve;
  /** Transition in duration in seconds (default: 0.45) */
  transitionIn?: number;
  /** Transition out duration in seconds (default: 0.45) */
  transitionOut?: number;
}

export interface SuggestedZoomFocus {
  focus: ZoomFocus;
  customCenter?: { x: number; y: number };
}

/**
 * Generates a unique ID for ZoomSegment
 */
function generateUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'zoom-' + Math.random().toString(36).substring(2, 11) + '-' + Date.now().toString(36);
}

/**
 * Determines optimal focus quadrant/anchor preset and custom coordinates
 * based on normalized screen coordinates (x: 0..1, y: 0..1).
 *
 * Screen coordinates:
 * (0,0) = Top-Left, (1,0) = Top-Right, (0,1) = Bottom-Left, (1,1) = Bottom-Right, (0.5,0.5) = Center.
 */
export function suggestZoomFocus(
  x: number,
  y: number
): SuggestedZoomFocus {
  const clampedX = Math.max(0, Math.min(1, Number.isFinite(x) ? x : 0.5));
  const clampedY = Math.max(0, Math.min(1, Number.isFinite(y) ? y : 0.5));

  const customCenter = {
    x: Number(clampedX.toFixed(4)),
    y: Number(clampedY.toFixed(4)),
  };

  // Center deadzone threshold (+-0.15 around 0.5 => [0.35, 0.65])
  const isCenterX = Math.abs(clampedX - 0.5) <= 0.15;
  const isCenterY = Math.abs(clampedY - 0.5) <= 0.15;

  let focus: ZoomFocus;

  if (isCenterX && isCenterY) {
    focus = 'center';
  } else if (isCenterX) {
    focus = clampedY < 0.5 ? 'top' : 'bottom';
  } else if (isCenterY) {
    focus = clampedX < 0.5 ? 'left' : 'right';
  } else {
    // Quadrant resolution
    if (clampedX < 0.5 && clampedY < 0.5) {
      focus = 'top-left';
    } else if (clampedX >= 0.5 && clampedY < 0.5) {
      focus = 'top-right';
    } else if (clampedX < 0.5 && clampedY >= 0.5) {
      focus = 'bottom-left';
    } else {
      focus = 'bottom-right';
    }
  }

  return {
    focus,
    customCenter,
  };
}

/**
 * Groups tap events that occur close together in time (< clusterThresholdSec apart).
 */
export function clusterTapEvents(
  tapEvents: TapEvent[],
  clusterThresholdSec = 2.5
): TapEvent[][] {
  if (!tapEvents || tapEvents.length === 0) return [];

  const validEvents = tapEvents
    .filter(
      (e) =>
        e &&
        typeof e.startTime === 'number' &&
        Number.isFinite(e.startTime) &&
        e.startTime >= 0
    )
    .sort((a, b) => a.startTime - b.startTime);

  if (validEvents.length === 0) return [];

  const clusters: TapEvent[][] = [];
  let currentCluster: TapEvent[] = [validEvents[0]];

  for (let i = 1; i < validEvents.length; i++) {
    const event = validEvents[i];
    const prevEvent = validEvents[i - 1];
    const delta = event.startTime - prevEvent.startTime;

    if (delta < clusterThresholdSec) {
      currentCluster.push(event);
    } else {
      clusters.push(currentCluster);
      currentCluster = [event];
    }
  }

  if (currentCluster.length > 0) {
    clusters.push(currentCluster);
  }

  return clusters;
}

/**
 * Computes the bounding center (midpoint of min and max coordinates) of a cluster of tap events.
 */
export function calculateClusterCenter(events: TapEvent[]): { x: number; y: number } {
  if (!events || events.length === 0) {
    return { x: 0.5, y: 0.5 };
  }

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  let hasValidPos = false;

  for (const e of events) {
    if (e.position && Number.isFinite(e.position.x) && Number.isFinite(e.position.y)) {
      minX = Math.min(minX, e.position.x);
      maxX = Math.max(maxX, e.position.x);
      minY = Math.min(minY, e.position.y);
      maxY = Math.max(maxY, e.position.y);
      hasValidPos = true;
    }
  }

  if (!hasValidPos) {
    return { x: 0.5, y: 0.5 };
  }

  const centerX = Math.max(0, Math.min(1, (minX + maxX) / 2));
  const centerY = Math.max(0, Math.min(1, (minY + maxY) / 2));

  return {
    x: Number(centerX.toFixed(4)),
    y: Number(centerY.toFixed(4)),
  };
}

interface InternalSegment extends ZoomSegment {
  events: TapEvent[];
}

/**
 * Generates automated Smart Zoom segments from user click/tap interactions.
 *
 * Algorithm Pipeline:
 * 1. Validates and chronologically sorts tap events.
 * 2. Groups taps into temporal clusters (< 2.5s gap between consecutive clicks).
 * 3. Calculates the bounding box center of each cluster and suggests the optimal ZoomFocus.
 * 4. Shapes smooth ZoomSegment windows with 0.4s lead padding and 0.8s tail padding.
 * 5. Merges adjacent or overlapping segments when feasible (under maxDuration) or spaces them cleanly.
 * 6. Enforces minDuration, maxDuration, and videoDuration boundary constraints.
 */
export function generateSmartZoomsFromClicks(
  tapEvents: TapEvent[],
  videoDuration: number,
  options?: AutoZoomOptions
): ZoomSegment[] {
  if (!tapEvents || tapEvents.length === 0 || !Number.isFinite(videoDuration) || videoDuration <= 0) {
    return [];
  }

  const zoomScale = options?.zoomScale ?? 1.35;
  const minDuration = Math.min(options?.minDuration ?? 1.2, videoDuration);
  const maxDuration = Math.max(options?.maxDuration ?? 6.0, minDuration);
  const leadPaddingSec = options?.leadPaddingSec ?? options?.paddingSec ?? 0.4;
  const tailPaddingSec = options?.tailPaddingSec ?? options?.paddingSec ?? 0.8;
  const clusterThresholdSec = options?.clusterThresholdSec ?? 2.5;
  const minGapSec = options?.minGapSec ?? 0.3;
  const curve: AnimationCurve = options?.curve ?? 'spring';
  const defaultTransIn = options?.transitionIn ?? 0.45;
  const defaultTransOut = options?.transitionOut ?? 0.45;

  // 1. Cluster tap events by temporal proximity (< clusterThresholdSec)
  const clusters = clusterTapEvents(tapEvents, clusterThresholdSec);
  if (clusters.length === 0) return [];

  // 2. Build initial candidate segments per cluster
  const rawSegments: InternalSegment[] = [];

  for (const cluster of clusters) {
    const firstClickTime = cluster[0].startTime;
    const lastClickTime = cluster[cluster.length - 1].startTime;

    const center = calculateClusterCenter(cluster);
    const { focus } = suggestZoomFocus(center.x, center.y);
    const panX = Number(((center.x - 0.5) * 2).toFixed(3));
    const panY = Number(((center.y - 0.5) * 2).toFixed(3));

    let start = Math.max(0, firstClickTime - leadPaddingSec);
    let end = Math.min(videoDuration, lastClickTime + tailPaddingSec);
    let dur = end - start;

    // Expand to minDuration if too short
    if (dur < minDuration) {
      const mid = (firstClickTime + lastClickTime) / 2;
      start = Math.max(0, mid - minDuration / 2);
      end = start + minDuration;
      if (end > videoDuration) {
        end = videoDuration;
        start = Math.max(0, end - minDuration);
      }
      dur = end - start;
    }

    // Clamp to maxDuration
    if (dur > maxDuration) {
      dur = maxDuration;
      end = start + dur;
    }

    const transIn = Math.min(defaultTransIn, dur / 2);
    const transOut = Math.min(defaultTransOut, dur / 2);

    rawSegments.push({
      id: generateUUID(),
      startTime: Number(start.toFixed(3)),
      duration: Number(dur.toFixed(3)),
      scale: zoomScale,
      focus,
      panX,
      panY,
      transitionIn: Number(transIn.toFixed(3)),
      transitionOut: Number(transOut.toFixed(3)),
      curve,
      events: cluster,
    });
  }

  // Sort candidate segments by startTime
  rawSegments.sort((a, b) => a.startTime - b.startTime);

  // 3. Resolve overlaps and merge close segments
  const mergedSegments: InternalSegment[] = [];

  for (const seg of rawSegments) {
    if (mergedSegments.length === 0) {
      mergedSegments.push(seg);
      continue;
    }

    const prev = mergedSegments[mergedSegments.length - 1];
    const prevEnd = prev.startTime + prev.duration;
    const gap = seg.startTime - prevEnd;

    if (gap < minGapSec) {
      // Overlapping or near-touching segments
      const combinedStart = Math.min(prev.startTime, seg.startTime);
      const combinedEnd = Math.max(prevEnd, seg.startTime + seg.duration);
      const combinedDuration = combinedEnd - combinedStart;

      if (combinedDuration <= maxDuration) {
        // Merge into one unified segment
        const combinedEvents = [...prev.events, ...seg.events];
        const combinedCenter = calculateClusterCenter(combinedEvents);
        const { focus: combinedFocus } = suggestZoomFocus(combinedCenter.x, combinedCenter.y);
        const combinedPanX = Number(((combinedCenter.x - 0.5) * 2).toFixed(3));
        const combinedPanY = Number(((combinedCenter.y - 0.5) * 2).toFixed(3));

        prev.startTime = Number(combinedStart.toFixed(3));
        prev.duration = Number(Math.min(videoDuration - combinedStart, combinedDuration).toFixed(3));
        prev.focus = combinedFocus;
        prev.panX = combinedPanX;
        prev.panY = combinedPanY;
        prev.events = combinedEvents;
        prev.transitionIn = Number(Math.min(defaultTransIn, prev.duration / 2).toFixed(3));
        prev.transitionOut = Number(Math.min(defaultTransOut, prev.duration / 2).toFixed(3));
      } else {
        // Space them cleanly to eliminate overlap
        if (seg.startTime < prevEnd) {
          const midTime = (prev.startTime + prev.duration + seg.startTime) / 2;
          const adjustedPrevDur = Math.max(minDuration, midTime - prev.startTime);
          prev.duration = Number(adjustedPrevDur.toFixed(3));
          seg.startTime = Number(Math.max(prev.startTime + prev.duration + 0.05, seg.startTime).toFixed(3));
          seg.duration = Number(Math.min(maxDuration, Math.max(minDuration, seg.duration)).toFixed(3));
        }
        mergedSegments.push(seg);
      }
    } else {
      mergedSegments.push(seg);
    }
  }

  // 4. Final validation & clamping to video duration
  const finalSegments: ZoomSegment[] = [];

  for (const s of mergedSegments) {
    let start = Math.max(0, s.startTime);
    if (start >= videoDuration) continue;

    let dur = s.duration;
    if (start + dur > videoDuration) {
      dur = Math.max(0.1, videoDuration - start);
    }

    if (dur <= 0.2) continue; // Skip negligible segments at edge

    const transIn = Math.min(s.transitionIn, dur / 2);
    const transOut = Math.min(s.transitionOut, dur / 2);

    finalSegments.push({
      id: s.id,
      startTime: Number(start.toFixed(3)),
      duration: Number(dur.toFixed(3)),
      scale: s.scale,
      focus: s.focus,
      panX: s.panX,
      panY: s.panY,
      transitionIn: Number(transIn.toFixed(3)),
      transitionOut: Number(transOut.toFixed(3)),
      curve: s.curve,
    });
  }

  return finalSegments;
}
