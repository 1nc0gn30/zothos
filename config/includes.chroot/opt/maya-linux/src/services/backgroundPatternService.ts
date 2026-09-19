/**
 * Background Pattern & Graphic Texture Service
 * 
 * Provides ultra-performant, high-DPI procedural graphic patterns for video backgrounds:
 * 1. 'dots'        - Screen Studio / Linear style dot matrix with radial edge falloff
 * 2. 'grid'        - Geometric blueprint grid with accented crosshairs at intersections
 * 3. 'crosses'     - Floating minimalist Swiss plus/cross glyphs grid
 * 4. 'circuit'     - High-tech cyberpunk PCB circuit trace grid with vias & pulse animations
 * 5. 'radialLines' - Subtle anime/manga speed focus lines radiating from center
 */

export type PatternType = 'dots' | 'grid' | 'crosses' | 'circuit' | 'radialLines';

export interface BackgroundPatternOptions {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  pattern: PatternType;
  opacity?: number;
  colorHex?: string;
  scale?: number;
  time?: number;
}

export interface PatternPreset {
  id: PatternType;
  label: string;
  description: string;
  defaultScale: number;
  defaultOpacity: number;
}

export const PATTERN_PRESETS: PatternPreset[] = [
  {
    id: 'dots',
    label: 'Dot Matrix',
    description: 'Screen Studio / Linear dark pattern with radial vignette falloff',
    defaultScale: 32,
    defaultOpacity: 0.25,
  },
  {
    id: 'grid',
    label: 'Blueprint Grid',
    description: 'Geometric architectural blueprint grid with intersection crosshairs',
    defaultScale: 40,
    defaultOpacity: 0.22,
  },
  {
    id: 'crosses',
    label: 'Swiss Crosses',
    description: 'Floating minimalist Swiss typographic plus glyphs',
    defaultScale: 36,
    defaultOpacity: 0.25,
  },
  {
    id: 'circuit',
    label: 'Cyberpunk PCB',
    description: 'High-tech circuit trace grid with vias, IC pads, and animated energy flow',
    defaultScale: 32,
    defaultOpacity: 0.3,
  },
  {
    id: 'radialLines',
    label: 'Speed Focus Lines',
    description: 'Dynamic anime speed focus rays radiating outward from center',
    defaultScale: 28,
    defaultOpacity: 0.22,
  },
];

/**
 * Fast, robust hex/color to RGBA string converter with alpha clamping.
 */
export function hexToRgba(hex: string, alpha: number = 1): string {
  const a = Math.max(0, Math.min(1, alpha));
  if (!hex || typeof hex !== 'string') return `rgba(255, 255, 255, ${a})`;

  let clean = hex.trim();
  if (clean.startsWith('#')) {
    clean = clean.slice(1);
  }

  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16) || 255;
    const g = parseInt(clean[1] + clean[1], 16) || 255;
    const b = parseInt(clean[2] + clean[2], 16) || 255;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }

  if (clean.length === 6 || clean.length === 8) {
    const r = parseInt(clean.substring(0, 2), 16) || 0;
    const g = parseInt(clean.substring(2, 4), 16) || 0;
    const b = parseInt(clean.substring(4, 6), 16) || 0;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }

  if (clean.startsWith('rgb')) {
    return clean;
  }

  return `rgba(255, 255, 255, ${a})`;
}

/**
 * Deterministic pseudo-random number generator for 2D coordinates.
 * Returns a float between 0 and 1 with zero memory allocations.
 */
function pseudoRandom(x: number, y: number): number {
  const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453123;
  return n - Math.floor(n);
}

/**
 * Deterministic 1D hash function.
 */
function hash1D(x: number): number {
  const n = Math.sin(x * 127.1) * 43758.5453123;
  return n - Math.floor(n);
}

/**
 * 'dots' - High-DPI dot matrix (Screen Studio / Linear dark pattern) with subtle radial brightness fade toward edges.
 */
export function drawDotsPattern(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  opacity: number = 0.25,
  colorHex: string = '#FFFFFF',
  scale: number = 32,
  time: number = 0
): void {
  if (width <= 0 || height <= 0 || opacity <= 0) return;

  const step = Math.max(12, scale);
  const baseRadius = Math.max(1, step * 0.045);
  const cx = width / 2;
  const cy = height / 2;
  const maxDist = Math.hypot(cx, cy);

  ctx.save();
  ctx.globalAlpha = Math.max(0, Math.min(1, opacity));

  // High-DPI Radial Gradient fade (bright & crisp in center-to-mid, soft cinematic falloff at edges)
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxDist * 0.95);
  grad.addColorStop(0, hexToRgba(colorHex, 1.0));
  grad.addColorStop(0.4, hexToRgba(colorHex, 0.85));
  grad.addColorStop(0.75, hexToRgba(colorHex, 0.4));
  grad.addColorStop(1, hexToRgba(colorHex, 0.1));

  ctx.fillStyle = grad;

  // Center-aligned symmetric grid offset
  const startX = (cx % step);
  const startY = (cy % step);

  // Subtle breathing radius modulation if animated
  const pulse = time > 0 ? 1 + 0.05 * Math.sin(time * 2) : 1;
  const radius = baseRadius * pulse;

  ctx.beginPath();
  for (let x = startX; x <= width + step; x += step) {
    for (let y = startY; y <= height + step; y += step) {
      ctx.moveTo(x + radius, y);
      ctx.arc(x, y, radius, 0, Math.PI * 2);
    }
  }
  ctx.fill();

  ctx.restore();
}

/**
 * 'grid' - Geometric blueprint grid with accented crosshairs at grid intersections.
 */
export function drawGridPattern(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  opacity: number = 0.25,
  colorHex: string = '#FFFFFF',
  scale: number = 32,
  time: number = 0
): void {
  if (width <= 0 || height <= 0 || opacity <= 0) return;

  const step = Math.max(16, scale);
  const cx = width / 2;
  const cy = height / 2;
  const maxDist = Math.hypot(cx, cy);

  ctx.save();
  ctx.globalAlpha = Math.max(0, Math.min(1, opacity));

  // Radial gradient stroke for soft blueprint edge falloff
  const gradStroke = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxDist * 0.95);
  gradStroke.addColorStop(0, hexToRgba(colorHex, 0.65));
  gradStroke.addColorStop(0.5, hexToRgba(colorHex, 0.5));
  gradStroke.addColorStop(0.85, hexToRgba(colorHex, 0.25));
  gradStroke.addColorStop(1, hexToRgba(colorHex, 0.08));

  const startX = (cx % step);
  const startY = (cy % step);

  // 1. Blueprint Grid lines (1px crisp lines)
  ctx.strokeStyle = gradStroke;
  ctx.lineWidth = 1;
  ctx.beginPath();

  for (let x = startX; x <= width; x += step) {
    const rx = Math.round(x) + 0.5;
    ctx.moveTo(rx, 0);
    ctx.lineTo(rx, height);
  }

  for (let y = startY; y <= height; y += step) {
    const ry = Math.round(y) + 0.5;
    ctx.moveTo(0, ry);
    ctx.lineTo(width, ry);
  }
  ctx.stroke();

  // 2. Accented crosshairs at intersections
  const crossSize = Math.max(3, step * 0.18);
  const crossStroke = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxDist * 0.9);
  crossStroke.addColorStop(0, hexToRgba(colorHex, 0.95));
  crossStroke.addColorStop(0.6, hexToRgba(colorHex, 0.75));
  crossStroke.addColorStop(1, hexToRgba(colorHex, 0.15));

  ctx.strokeStyle = crossStroke;
  ctx.lineWidth = 1.25;
  ctx.beginPath();

  for (let x = startX; x <= width; x += step) {
    const rx = Math.round(x) + 0.5;
    for (let y = startY; y <= height; y += step) {
      const ry = Math.round(y) + 0.5;
      // Precision crosshair +
      ctx.moveTo(rx - crossSize, ry);
      ctx.lineTo(rx + crossSize, ry);
      ctx.moveTo(rx, ry - crossSize);
      ctx.lineTo(rx, ry + crossSize);
    }
  }
  ctx.stroke();

  // 3. Center micro-points at major intersections
  const majorStep = step * 2;
  const majorStartX = (cx % majorStep);
  const majorStartY = (cy % majorStep);
  const dotR = Math.max(1, step * 0.04);

  ctx.fillStyle = crossStroke;
  ctx.beginPath();
  for (let x = majorStartX; x <= width; x += majorStep) {
    for (let y = majorStartY; y <= height; y += majorStep) {
      ctx.moveTo(x + dotR, y);
      ctx.arc(x, y, dotR, 0, Math.PI * 2);
    }
  }
  ctx.fill();

  ctx.restore();
}

/**
 * 'crosses' - Floating minimalist Swiss plus/cross glyphs grid.
 */
export function drawCrossesPattern(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  opacity: number = 0.25,
  colorHex: string = '#FFFFFF',
  scale: number = 32,
  time: number = 0
): void {
  if (width <= 0 || height <= 0 || opacity <= 0) return;

  const step = Math.max(18, scale);
  const arm = Math.max(3, step * 0.14);
  const cx = width / 2;
  const cy = height / 2;
  const maxDist = Math.hypot(cx, cy);

  ctx.save();
  ctx.globalAlpha = Math.max(0, Math.min(1, opacity));

  // Radial gradient stroke
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxDist * 0.95);
  grad.addColorStop(0, hexToRgba(colorHex, 0.9));
  grad.addColorStop(0.45, hexToRgba(colorHex, 0.75));
  grad.addColorStop(0.8, hexToRgba(colorHex, 0.35));
  grad.addColorStop(1, hexToRgba(colorHex, 0.08));

  ctx.strokeStyle = grad;
  ctx.lineWidth = Math.max(1, step * 0.035);
  ctx.lineCap = 'square';

  const startX = (cx % step);
  const startY = (cy % step);

  ctx.beginPath();
  for (let x = startX; x <= width + step; x += step) {
    for (let y = startY; y <= height + step; y += step) {
      // Subtle organic floating wave motion if time > 0
      let px = x;
      let py = y;
      if (time > 0) {
        px += Math.cos(time * 1.1 + x * 0.012 + y * 0.008) * (step * 0.04);
        py += Math.sin(time * 1.4 + x * 0.008 + y * 0.012) * (step * 0.06);
      }

      ctx.moveTo(px - arm, py);
      ctx.lineTo(px + arm, py);
      ctx.moveTo(px, py - arm);
      ctx.lineTo(px, py + arm);
    }
  }
  ctx.stroke();

  ctx.restore();
}

/**
 * 'circuit' - High-tech cyberpunk PCB circuit trace grid with vias, SMD pads & signal pulses.
 */
export function drawCircuitPattern(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  opacity: number = 0.25,
  colorHex: string = '#FFFFFF',
  scale: number = 32,
  time: number = 0
): void {
  if (width <= 0 || height <= 0 || opacity <= 0) return;

  const cell = Math.max(24, scale);
  const cx = width / 2;
  const cy = height / 2;
  const maxDist = Math.hypot(cx, cy);

  ctx.save();
  ctx.globalAlpha = Math.max(0, Math.min(1, opacity));

  // Radial gradient stroke for PCB ambient lighting
  const gradTrace = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxDist * 0.95);
  gradTrace.addColorStop(0, hexToRgba(colorHex, 0.75));
  gradTrace.addColorStop(0.5, hexToRgba(colorHex, 0.55));
  gradTrace.addColorStop(0.85, hexToRgba(colorHex, 0.25));
  gradTrace.addColorStop(1, hexToRgba(colorHex, 0.06));

  const startX = (cx % cell);
  const startY = (cy % cell);

  // 1. Pass 1: Circuit trace paths
  ctx.strokeStyle = gradTrace;
  ctx.lineWidth = Math.max(1, cell * 0.035);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();

  for (let x = startX - cell; x <= width + cell; x += cell) {
    for (let y = startY - cell; y <= height + cell; y += cell) {
      const ix = Math.floor(x / cell);
      const iy = Math.floor(y / cell);
      const rand = pseudoRandom(ix, iy);
      const chamfer = cell * 0.35;

      if (rand < 0.28) {
        // Horizontal trace with 45-deg dogleg
        ctx.moveTo(x, y);
        ctx.lineTo(x + cell * 0.5, y);
        ctx.lineTo(x + cell * 0.5 + chamfer, y + chamfer);
        ctx.lineTo(x + cell, y + chamfer);
      } else if (rand < 0.56) {
        // Vertical trace with 45-deg dogleg
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + cell * 0.5);
        ctx.lineTo(x + chamfer, y + cell * 0.5 + chamfer);
        ctx.lineTo(x + chamfer, y + cell);
      } else if (rand < 0.75) {
        // Bus bridge with terminal pads
        ctx.moveTo(x, y + cell * 0.5);
        ctx.lineTo(x + cell, y + cell * 0.5);
      } else if (rand < 0.88) {
        // Corner trace
        ctx.moveTo(x, y + cell);
        ctx.lineTo(x + cell * 0.5, y + cell * 0.5);
        ctx.lineTo(x + cell, y + cell * 0.5);
      }
    }
  }
  ctx.stroke();

  // 2. Pass 2: Filled Vias (Solder pads)
  ctx.fillStyle = hexToRgba(colorHex, 0.85);
  ctx.beginPath();
  for (let x = startX - cell; x <= width + cell; x += cell) {
    for (let y = startY - cell; y <= height + cell; y += cell) {
      const ix = Math.floor(x / cell);
      const iy = Math.floor(y / cell);
      const rand = pseudoRandom(ix, iy);
      const rand2 = pseudoRandom(iy, ix + 100);
      const chamfer = cell * 0.35;
      const viaR = Math.max(2, cell * 0.08);

      if (rand < 0.28 && rand2 > 0.7) {
        const vx = x + cell;
        const vy = y + chamfer;
        ctx.moveTo(vx + viaR, vy);
        ctx.arc(vx, vy, viaR, 0, Math.PI * 2);
      } else if (rand < 0.56 && rand2 > 0.7) {
        const vx = x + chamfer;
        const vy = y + cell;
        ctx.moveTo(vx + viaR, vy);
        ctx.arc(vx, vy, viaR, 0, Math.PI * 2);
      } else if (rand >= 0.56 && rand < 0.75) {
        const vx = x + cell;
        const vy = y + cell * 0.5;
        const rSmall = Math.max(1.8, cell * 0.07);
        ctx.moveTo(vx + rSmall, vy);
        ctx.arc(vx, vy, rSmall, 0, Math.PI * 2);
      }
    }
  }
  ctx.fill();

  // 3. Pass 3: Hollow Vias with Annular Rings
  ctx.strokeStyle = hexToRgba(colorHex, 0.85);
  ctx.lineWidth = Math.max(1, cell * 0.04);
  ctx.beginPath();
  for (let x = startX - cell; x <= width + cell; x += cell) {
    for (let y = startY - cell; y <= height + cell; y += cell) {
      const ix = Math.floor(x / cell);
      const iy = Math.floor(y / cell);
      const rand = pseudoRandom(ix, iy);
      const rand2 = pseudoRandom(iy, ix + 100);
      const chamfer = cell * 0.35;
      const viaR = Math.max(2, cell * 0.08);

      if (rand < 0.28 && rand2 > 0.4 && rand2 <= 0.7) {
        const vx = x + cell;
        const vy = y + chamfer;
        ctx.moveTo(vx + viaR, vy);
        ctx.arc(vx, vy, viaR, 0, Math.PI * 2);
      } else if (rand < 0.56 && rand2 > 0.4 && rand2 <= 0.7) {
        const vx = x + chamfer;
        const vy = y + cell;
        ctx.moveTo(vx + viaR, vy);
        ctx.arc(vx, vy, viaR, 0, Math.PI * 2);
      } else if (rand >= 0.56 && rand < 0.75) {
        const vx = x;
        const vy = y + cell * 0.5;
        const rSmall = Math.max(1.8, cell * 0.07);
        ctx.moveTo(vx + rSmall, vy);
        ctx.arc(vx, vy, rSmall, 0, Math.PI * 2);
      }
    }
  }
  ctx.stroke();

  // 4. Pass 4: Drill Holes for Hollow Vias
  ctx.fillStyle = hexToRgba('#000000', 0.85);
  ctx.beginPath();
  for (let x = startX - cell; x <= width + cell; x += cell) {
    for (let y = startY - cell; y <= height + cell; y += cell) {
      const ix = Math.floor(x / cell);
      const iy = Math.floor(y / cell);
      const rand = pseudoRandom(ix, iy);
      const rand2 = pseudoRandom(iy, ix + 100);
      const chamfer = cell * 0.35;
      const holeR = Math.max(0.75, cell * 0.035);

      if (rand < 0.28 && rand2 > 0.4 && rand2 <= 0.7) {
        const vx = x + cell;
        const vy = y + chamfer;
        ctx.moveTo(vx + holeR, vy);
        ctx.arc(vx, vy, holeR, 0, Math.PI * 2);
      } else if (rand < 0.56 && rand2 > 0.4 && rand2 <= 0.7) {
        const vx = x + chamfer;
        const vy = y + cell;
        ctx.moveTo(vx + holeR, vy);
        ctx.arc(vx, vy, holeR, 0, Math.PI * 2);
      } else if (rand >= 0.56 && rand < 0.75) {
        const vx = x;
        const vy = y + cell * 0.5;
        ctx.moveTo(vx + holeR, vy);
        ctx.arc(vx, vy, holeR, 0, Math.PI * 2);
      }
    }
  }
  ctx.fill();

  // 5. Pass 5: SMD IC component pads
  ctx.fillStyle = hexToRgba(colorHex, 0.7);
  const smdW = cell * 0.22;
  const smdH = cell * 0.12;
  for (let x = startX - cell; x <= width + cell; x += cell) {
    for (let y = startY - cell; y <= height + cell; y += cell) {
      const ix = Math.floor(x / cell);
      const iy = Math.floor(y / cell);
      const rand = pseudoRandom(ix, iy);
      const rand2 = pseudoRandom(iy, ix + 100);

      if (rand >= 0.75 && rand < 0.88 && rand2 > 0.5) {
        ctx.fillRect(x + cell * 0.5 - smdW / 2, y + cell * 0.5 - smdH / 2, smdW, smdH);
      }
    }
  }

  // 6. Pass 6: Animated Cyberpunk Signal Pulses (Glowing energy flow)
  if (time > 0) {
    ctx.save();
    ctx.strokeStyle = hexToRgba(colorHex, 1.0);
    ctx.lineWidth = Math.max(1.8, cell * 0.06);
    ctx.shadowColor = colorHex;
    ctx.shadowBlur = 4;
    ctx.beginPath();

    const pulseLen = cell * 0.3;
    for (let x = startX - cell; x <= width + cell; x += cell) {
      for (let y = startY - cell; y <= height + cell; y += cell) {
        const ix = Math.floor(x / cell);
        const iy = Math.floor(y / cell);
        const rand = pseudoRandom(ix, iy);

        if (rand > 0.65) {
          const pulseProgress = ((time * 1.2 + rand * 10) % 1);
          const px = x + pulseProgress * cell;
          const py = y + (rand < 0.5 ? 0 : cell * 0.5);
          ctx.moveTo(px, py);
          ctx.lineTo(px + pulseLen, py);
        }
      }
    }
    ctx.stroke();
    ctx.restore();
  }

  ctx.restore();
}

/**
 * 'radialLines' - Subtle anime/speed radial focus lines shooting outward from center.
 */
export function drawRadialLinesPattern(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  opacity: number = 0.25,
  colorHex: string = '#FFFFFF',
  scale: number = 32,
  time: number = 0
): void {
  if (width <= 0 || height <= 0 || opacity <= 0) return;

  const cx = width / 2;
  const cy = height / 2;
  const outerRadius = Math.hypot(cx, cy) * 1.05;
  const innerRadius = Math.min(width, height) * 0.26;

  // Number of focus rays based on scale
  const rayCount = Math.max(36, Math.min(120, Math.floor(1440 / Math.max(12, scale))));

  ctx.save();
  ctx.globalAlpha = Math.max(0, Math.min(1, opacity));

  // Radial gradient: transparent at center clear zone, rising smoothly toward outer corners
  const grad = ctx.createRadialGradient(cx, cy, innerRadius * 0.85, cx, cy, outerRadius);
  grad.addColorStop(0, hexToRgba(colorHex, 0.0));
  grad.addColorStop(0.2, hexToRgba(colorHex, 0.05));
  grad.addColorStop(0.55, hexToRgba(colorHex, 0.5));
  grad.addColorStop(0.85, hexToRgba(colorHex, 0.85));
  grad.addColorStop(1, hexToRgba(colorHex, 0.95));

  ctx.fillStyle = grad;

  // Rotation / subtle speed spin if animated
  const baseAngleOffset = time > 0 ? time * 0.08 : 0;

  ctx.beginPath();

  for (let i = 0; i < rayCount; i++) {
    const seed = hash1D(i * 17.13 + 5.7);
    const seed2 = hash1D(i * 31.77 + 9.1);

    // Filter out ~22% of rays for authentic variable spacing & manga speedline rhythm
    if (seed < 0.22) continue;

    // Ray angle with procedural jitter
    const angle = (i * Math.PI * 2) / rayCount + baseAngleOffset + (seed - 0.5) * (Math.PI / rayCount * 0.8);

    // Dynamic length pulsation with time
    let rStart = innerRadius * (0.95 + seed2 * 0.35);
    if (time > 0) {
      const pulse = Math.sin(time * 3.5 + i * 1.7) * 0.15;
      rStart = innerRadius * (0.9 + seed2 * 0.4 + pulse);
    }
    const rEnd = outerRadius;

    // Wedge width (tapered: zero at rStart, wider at rEnd)
    const wedgeAngularWidth = (Math.PI * 2 / rayCount) * (0.08 + seed * 0.18);
    const cos1 = Math.cos(angle - wedgeAngularWidth / 2);
    const sin1 = Math.sin(angle - wedgeAngularWidth / 2);
    const cos2 = Math.cos(angle + wedgeAngularWidth / 2);
    const sin2 = Math.sin(angle + wedgeAngularWidth / 2);
    const cosMid = Math.cos(angle);
    const sinMid = Math.sin(angle);

    // Tapered triangle wedge pointing at center
    ctx.moveTo(cx + cosMid * rStart, cy + sinMid * rStart);
    ctx.lineTo(cx + cos1 * rEnd, cy + sin1 * rEnd);
    ctx.lineTo(cx + cos2 * rEnd, cy + sin2 * rEnd);
    ctx.closePath();
  }

  ctx.fill();
  ctx.restore();
}

/**
 * Renders a high-performance background graphic pattern onto a 2D canvas.
 *
 * @param ctx Target CanvasRenderingContext2D
 * @param width Target canvas width in pixels
 * @param height Target canvas height in pixels
 * @param pattern Type of pattern ('dots' | 'grid' | 'crosses' | 'circuit' | 'radialLines')
 * @param opacity Overall pattern opacity (0.0 to 1.0, default: 0.25)
 * @param colorHex Primary stroke/fill color hex (default: '#FFFFFF')
 * @param scale Density / grid scale factor in pixels (default: 32)
 * @param time Animation time in seconds (default: 0)
 */
export function drawBackgroundPattern(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  pattern: PatternType = 'dots',
  opacity: number = 0.25,
  colorHex: string = '#FFFFFF',
  scale: number = 32,
  time: number = 0
): void {
  if (width <= 0 || height <= 0 || opacity <= 0) return;

  switch (pattern) {
    case 'dots':
      drawDotsPattern(ctx, width, height, opacity, colorHex, scale, time);
      break;
    case 'grid':
      drawGridPattern(ctx, width, height, opacity, colorHex, scale, time);
      break;
    case 'crosses':
      drawCrossesPattern(ctx, width, height, opacity, colorHex, scale, time);
      break;
    case 'circuit':
      drawCircuitPattern(ctx, width, height, opacity, colorHex, scale, time);
      break;
    case 'radialLines':
      drawRadialLinesPattern(ctx, width, height, opacity, colorHex, scale, time);
      break;
  }
}
