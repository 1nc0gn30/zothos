import { TapEvent, CursorConfig } from '../types/models';

export interface CursorPositionSample {
  x: number;
  y: number;
  isClicking: boolean;
  clickProgress: number;
}

export const DEFAULT_CURSOR_CONFIG: CursorConfig = {
  enabled: true,
  style: 'macos',
  colorHex: '#6466FA',
  size: 32,
  clickRipples: true,
};

/**
 * Standard Catmull-Rom Spline interpolation between 4 scalar points.
 * Provides C1-continuous smooth curve transitions.
 */
export function catmullRom(p0: number, p1: number, p2: number, p3: number, t: number): number {
  const t2 = t * t;
  const t3 = t2 * t;
  return 0.5 * (
    (2 * p1) +
    (-p0 + p2) * t +
    (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
    (-p0 + 3 * p1 - 3 * p2 + p3) * t3
  );
}

/**
 * Quintic smoothstep easing function (Perlin smootherstep: 6t^5 - 15t^4 + 10t^3)
 * Provides ultra-smooth, natural acceleration and deceleration mimicking human hand movement.
 */
export function smoothMotionEase(t: number): number {
  const clamped = Math.max(0, Math.min(1, t));
  return clamped * clamped * clamped * (clamped * (clamped * 6 - 15) + 10);
}

/**
 * Spring-based dampening ease curve for micro-inertia and snappy arrival.
 */
export function springEase(t: number, damping = 0.85): number {
  const clamped = Math.max(0, Math.min(1, t));
  return 1 - Math.exp(-clamped * 6 * damping) * Math.cos(clamped * Math.PI * (1 - damping));
}

/**
 * Interpolates 2D coordinates across 4 control points using Catmull-Rom spline with motion easing.
 */
export function interpolateSpline2D(
  p0: { x: number; y: number },
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  p3: { x: number; y: number },
  t: number
): { x: number; y: number } {
  const easedT = smoothMotionEase(t);
  const x = catmullRom(p0.x, p1.x, p2.x, p3.x, easedT);
  const y = catmullRom(p0.y, p1.y, p2.y, p3.y, easedT);
  return {
    x: Math.max(0, Math.min(1, x)),
    y: Math.max(0, Math.min(1, y)),
  };
}

/**
 * Helper to safely convert hex or color strings to RGBA canvas color string.
 */
export function hexToRgba(hex: string, alpha: number): string {
  if (!hex) return `rgba(100, 102, 250, ${alpha})`;
  let clean = hex.trim().replace(/^#/, '');
  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('');
  }
  if (clean.length >= 6) {
    const r = parseInt(clean.substring(0, 2), 16) || 0;
    const g = parseInt(clean.substring(2, 4), 16) || 0;
    const b = parseInt(clean.substring(4, 6), 16) || 0;
    return `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(1, alpha))})`;
  }
  return hex;
}

/**
 * Computes the normalized (0..1) screen coordinates and click state of the mouse cursor
 * at `currentTime` using spline curve path generation between tap events.
 *
 * Glides naturally across the screen ~0.4s-0.5s before a click and lingers briefly after.
 */
export function computeCursorPosition(
  currentTime: number,
  tapEvents: TapEvent[],
  defaultPos: { x: number; y: number } = { x: 0.5, y: 0.5 }
): CursorPositionSample {
  if (!tapEvents || tapEvents.length === 0) {
    return {
      x: defaultPos.x,
      y: defaultPos.y,
      isClicking: false,
      clickProgress: 0,
    };
  }

  // Sort chronologically by startTime
  const sorted = [...tapEvents].sort((a, b) => a.startTime - b.startTime);

  // 1. Check if currentTime falls directly inside an active click event
  for (let i = 0; i < sorted.length; i++) {
    const ev = sorted[i];
    const duration = Math.max(0.08, ev.duration || 0.3);
    const endTime = ev.startTime + duration;

    if (currentTime >= ev.startTime && currentTime <= endTime) {
      const progress = (currentTime - ev.startTime) / duration;
      return {
        x: ev.position.x,
        y: ev.position.y,
        isClicking: true,
        clickProgress: Math.max(0, Math.min(1, progress)),
      };
    }
  }

  const travelLeadTime = 0.45; // seconds before click to begin glide
  const lingerTime = 0.25;     // seconds after click to hold position

  // 2. Before the very first tap event
  const first = sorted[0];
  if (currentTime < first.startTime) {
    const travelStart = first.startTime - travelLeadTime;
    if (currentTime <= travelStart) {
      return {
        x: defaultPos.x,
        y: defaultPos.y,
        isClicking: false,
        clickProgress: 0,
      };
    }

    const t = (currentTime - travelStart) / travelLeadTime;
    const p0 = { x: defaultPos.x - (first.position.x - defaultPos.x) * 0.5, y: defaultPos.y };
    const p1 = defaultPos;
    const p2 = first.position;
    const p3 = sorted[1] ? sorted[1].position : {
      x: first.position.x + (first.position.x - defaultPos.x) * 0.5,
      y: first.position.y + (first.position.y - defaultPos.y) * 0.5,
    };

    const pos = interpolateSpline2D(p0, p1, p2, p3, t);
    return {
      x: pos.x,
      y: pos.y,
      isClicking: false,
      clickProgress: 0,
    };
  }

  // 3. Between tap events
  for (let i = 0; i < sorted.length - 1; i++) {
    const curr = sorted[i];
    const next = sorted[i + 1];
    const currEnd = curr.startTime + Math.max(0.08, curr.duration || 0.3);
    const nextStart = next.startTime;

    if (currentTime > currEnd && currentTime < nextStart) {
      const gap = nextStart - currEnd;
      const actualLinger = Math.min(lingerTime, gap * 0.35);
      const actualTravel = Math.min(travelLeadTime, gap - actualLinger);
      const travelStart = nextStart - actualTravel;

      // Lingering phase after previous click
      if (currentTime <= currEnd + actualLinger) {
        return {
          x: curr.position.x,
          y: curr.position.y,
          isClicking: false,
          clickProgress: 0,
        };
      }

      // Rest phase between linger and next travel
      if (currentTime < travelStart) {
        return {
          x: curr.position.x,
          y: curr.position.y,
          isClicking: false,
          clickProgress: 0,
        };
      }

      // Active glide phase
      const t = actualTravel > 0 ? (currentTime - travelStart) / actualTravel : 1;
      const p0 = sorted[i - 1]?.position || {
        x: curr.position.x - (next.position.x - curr.position.x) * 0.4,
        y: curr.position.y - (next.position.y - curr.position.y) * 0.4,
      };
      const p1 = curr.position;
      const p2 = next.position;
      const p3 = sorted[i + 2]?.position || {
        x: next.position.x + (next.position.x - curr.position.x) * 0.4,
        y: next.position.y + (next.position.y - curr.position.y) * 0.4,
      };

      const pos = interpolateSpline2D(p0, p1, p2, p3, t);
      return {
        x: pos.x,
        y: pos.y,
        isClicking: false,
        clickProgress: 0,
      };
    }
  }

  // 4. After the last tap event
  const last = sorted[sorted.length - 1];
  return {
    x: last.position.x,
    y: last.position.y,
    isClicking: false,
    clickProgress: 0,
  };
}

/**
 * Draws the high-end animated cursor and click ripple FX directly onto Canvas2D context.
 *
 * Supported styles:
 * - 'macos': High-DPI black pointer with crisp white border and drop shadow.
 * - 'dot': Sleek semi-translucent glowing highlighter dot (Screen Studio style).
 * - 'laser': Glowing laser beam dot with neon trailing blur and reticle.
 * - 'glow': Soft radial glow aura behind pointer with high-contrast arrow.
 */
export function drawCursor(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  isClicking: boolean,
  clickProgress: number,
  config: CursorConfig = DEFAULT_CURSOR_CONFIG
): void {
  if (config.enabled === false) return;

  const size = Math.max(12, config.size || 32);
  const colorHex = config.colorHex || '#6466FA';
  const style = config.style || 'macos';

  ctx.save();

  // 1. Draw Click Ripple Shockwave Rings (if enabled & active)
  if (config.clickRipples !== false && (isClicking || clickProgress > 0)) {
    drawClickRipple(ctx, x, y, size, colorHex, clickProgress);
  }

  // 2. Translate context to cursor coordinates
  ctx.translate(x, y);

  // Click compression micro-animation
  if (isClicking && clickProgress > 0) {
    const pressScale = 1 - 0.12 * Math.sin(clickProgress * Math.PI);
    ctx.scale(pressScale, pressScale);
  }

  // 3. Render Selected High-End Cursor Style
  switch (style) {
    case 'macos':
      drawMacOSPointer(ctx, size, colorHex, isClicking, clickProgress);
      break;

    case 'dot':
      drawDotCursor(ctx, size, colorHex, isClicking, clickProgress);
      break;

    case 'laser':
      drawLaserCursor(ctx, size, colorHex, isClicking, clickProgress);
      break;

    case 'glow':
      drawGlowCursor(ctx, size, colorHex, isClicking, clickProgress);
      break;

    default:
      drawMacOSPointer(ctx, size, colorHex, isClicking, clickProgress);
      break;
  }

  ctx.restore();
}

/**
 * Style 1: 'macos'
 * High-DPI macOS style pointer arrow with sharp geometry, crisp white border, and deep shadow.
 */
export function drawMacOSPointer(
  ctx: CanvasRenderingContext2D,
  size: number,
  accentColor: string,
  isClicking: boolean,
  clickProgress: number
): void {
  ctx.save();

  // Pointer vector geometry scaled by size
  // Scale factor normalized so size = 32 yields ~32px pointer length
  const s = size / 28;

  // Drop shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
  ctx.shadowBlur = 8 * s;
  ctx.shadowOffsetX = 2 * s;
  ctx.shadowOffsetY = 4 * s;

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, 24 * s);
  ctx.lineTo(6.5 * s, 18.5 * s);
  ctx.lineTo(12.5 * s, 26.5 * s);
  ctx.lineTo(16.5 * s, 23.5 * s);
  ctx.lineTo(10.5 * s, 16 * s);
  ctx.lineTo(19 * s, 16 * s);
  ctx.closePath();

  // Dark obsidian body
  ctx.fillStyle = '#0F1117';
  ctx.fill();

  // Crisp high-contrast white stroke border
  ctx.lineWidth = Math.max(1.75, 2.2 * s);
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.stroke();

  // Subtle accent highlight on tip when clicking
  if (isClicking && clickProgress > 0) {
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.beginPath();
    ctx.arc(1.5 * s, 1.5 * s, 3.5 * s, 0, Math.PI * 2);
    ctx.fillStyle = hexToRgba(accentColor, 0.9 * (1 - clickProgress * 0.5));
    ctx.fill();
  }

  ctx.restore();
}

/**
 * Style 2: 'dot'
 * Sleek semi-translucent glowing highlighter dot (Screen Studio style).
 */
export function drawDotCursor(
  ctx: CanvasRenderingContext2D,
  size: number,
  colorHex: string,
  isClicking: boolean,
  clickProgress: number
): void {
  ctx.save();
  const radius = size * 0.5;

  // Outer ambient glow halo
  const outerGlowRadius = radius * 1.6;
  const haloGrad = ctx.createRadialGradient(0, 0, radius * 0.3, 0, 0, outerGlowRadius);
  haloGrad.addColorStop(0, hexToRgba(colorHex, isClicking ? 0.45 : 0.28));
  haloGrad.addColorStop(0.7, hexToRgba(colorHex, 0.12));
  haloGrad.addColorStop(1, hexToRgba(colorHex, 0));

  ctx.fillStyle = haloGrad;
  ctx.beginPath();
  ctx.arc(0, 0, outerGlowRadius, 0, Math.PI * 2);
  ctx.fill();

  // Main translucent lens disc
  ctx.shadowColor = hexToRgba(colorHex, 0.5);
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fillStyle = hexToRgba(colorHex, isClicking ? 0.75 : 0.5);
  ctx.fill();

  // Crisp high-contrast border ring
  ctx.lineWidth = Math.max(1.5, size * 0.06);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.stroke();

  // Inner solid bright core dot
  const coreRadius = radius * (isClicking ? 0.45 : 0.32);
  ctx.beginPath();
  ctx.arc(0, 0, coreRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();

  ctx.restore();
}

/**
 * Style 3: 'laser'
 * Glowing laser beam dot with neon trailing blur and reticle target styling.
 */
export function drawLaserCursor(
  ctx: CanvasRenderingContext2D,
  size: number,
  colorHex: string,
  isClicking: boolean,
  clickProgress: number
): void {
  ctx.save();
  const radius = size * 0.42;

  // Multi-layer high-intensity neon bloom
  ctx.shadowColor = colorHex;
  ctx.shadowBlur = isClicking ? 24 : 16;

  // Outer radial laser flare
  const flareRadius = radius * 2.2;
  const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, flareRadius);
  grad.addColorStop(0, '#FFFFFF');
  grad.addColorStop(0.25, hexToRgba(colorHex, 0.9));
  grad.addColorStop(0.65, hexToRgba(colorHex, 0.35));
  grad.addColorStop(1, hexToRgba(colorHex, 0));

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(0, 0, flareRadius, 0, Math.PI * 2);
  ctx.fill();

  // Solid laser beam center
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.75, 0, Math.PI * 2);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();

  // Reticle crosshair ticks
  const tickLen = radius * 1.4;
  const tickStart = radius * 0.85;
  ctx.lineWidth = Math.max(1.2, size * 0.045);
  ctx.strokeStyle = hexToRgba(colorHex, 0.9);
  ctx.beginPath();
  // Top
  ctx.moveTo(0, -tickStart); ctx.lineTo(0, -tickLen);
  // Bottom
  ctx.moveTo(0, tickStart); ctx.lineTo(0, tickLen);
  // Left
  ctx.moveTo(-tickStart, 0); ctx.lineTo(-tickLen, 0);
  // Right
  ctx.moveTo(tickStart, 0); ctx.lineTo(tickLen, 0);
  ctx.stroke();

  ctx.restore();
}

/**
 * Style 4: 'glow'
 * Soft radial glow aura behind pointer so the cursor stands out against any video background.
 */
export function drawGlowCursor(
  ctx: CanvasRenderingContext2D,
  size: number,
  colorHex: string,
  isClicking: boolean,
  clickProgress: number
): void {
  ctx.save();
  const s = size / 28;
  const glowRadius = size * (isClicking ? 1.5 : 1.25);

  // Soft background aura spotlight
  const glowGrad = ctx.createRadialGradient(8 * s, 8 * s, 0, 8 * s, 8 * s, glowRadius);
  glowGrad.addColorStop(0, hexToRgba(colorHex, isClicking ? 0.6 : 0.42));
  glowGrad.addColorStop(0.6, hexToRgba(colorHex, 0.18));
  glowGrad.addColorStop(1, hexToRgba(colorHex, 0));

  ctx.fillStyle = glowGrad;
  ctx.beginPath();
  ctx.arc(8 * s, 8 * s, glowRadius, 0, Math.PI * 2);
  ctx.fill();

  // Crisp pointer on top
  drawMacOSPointer(ctx, size, colorHex, isClicking, clickProgress);
  ctx.restore();
}

/**
 * Click Ripple animation: expanding smooth dual ring pulse shockwave.
 */
export function drawClickRipple(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  cursorSize: number,
  colorHex: string,
  progress: number
): void {
  const p = Math.max(0, Math.min(1, progress));
  if (p <= 0 || p >= 1) return;

  ctx.save();
  ctx.translate(x, y);

  // 1. Primary expanding pulse ring
  const maxRadius1 = cursorSize * 2.2;
  const radius1 = cursorSize * 0.35 + maxRadius1 * p;
  const opacity1 = (1 - p) * 0.85;

  ctx.beginPath();
  ctx.arc(0, 0, radius1, 0, Math.PI * 2);
  ctx.strokeStyle = hexToRgba(colorHex, opacity1);
  ctx.lineWidth = Math.max(1.5, cursorSize * 0.08 * (1 - p * 0.6));
  ctx.stroke();

  // 2. Secondary trailing ripple ring
  if (p > 0.18) {
    const p2 = (p - 0.18) / 0.82;
    const maxRadius2 = cursorSize * 1.6;
    const radius2 = cursorSize * 0.2 + maxRadius2 * p2;
    const opacity2 = (1 - p2) * 0.55;

    ctx.beginPath();
    ctx.arc(0, 0, radius2, 0, Math.PI * 2);
    ctx.strokeStyle = hexToRgba(colorHex, opacity2);
    ctx.lineWidth = Math.max(1.2, cursorSize * 0.05 * (1 - p2 * 0.5));
    ctx.stroke();
  }

  // 3. Central soft energy flash
  const flashRadius = cursorSize * (0.3 + 0.4 * p);
  const flashGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, flashRadius);
  flashGrad.addColorStop(0, hexToRgba(colorHex, (1 - p) * 0.4));
  flashGrad.addColorStop(1, hexToRgba(colorHex, 0));

  ctx.fillStyle = flashGrad;
  ctx.beginPath();
  ctx.arc(0, 0, flashRadius, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
