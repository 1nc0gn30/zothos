/**
 * Social Video & Motion FX - Video Progress Bar Service
 * 
 * Provides high-performance real-time canvas rendering for 4 modern social video progress bar styles:
 * 1. 'gradient': Smooth multi-color progress bar with rounded leading cap & sheen.
 * 2. 'neonGlow': Glowing neon laser bar with a bright focal bead at the leading tip and horizontal bloom blur.
 * 3. 'storyPills': Instagram / TikTok Story segmented pill bars with active filling animation on current segment.
 * 4. 'radialClock': Sleek circular countdown badge in top-right or bottom-right corner with time remaining.
 */

export type ProgressBarStyle = 'gradient' | 'neonGlow' | 'storyPills' | 'radialClock';
export type ProgressBarPosition = 'top' | 'bottom' | 'top-pills' | 'bottom-thin';

export interface ProgressBarConfig {
  enabled: boolean;
  style: ProgressBarStyle;
  position: ProgressBarPosition;
  height: number; // 2..16px
  colorStart: string;
  colorEnd: string;
  pillCount?: number; // for storyPills
  glowRadius?: number;
  opacity?: number;
}

export const DEFAULT_PROGRESS_BAR_CONFIG: ProgressBarConfig = {
  enabled: true,
  style: 'gradient',
  position: 'bottom',
  height: 6,
  colorStart: '#6366F1',
  colorEnd: '#EC4899',
  glowRadius: 10,
  opacity: 1,
};

export const PROGRESS_BAR_PRESETS: Record<string, ProgressBarConfig> = {
  instagramStories: {
    enabled: true,
    style: 'storyPills',
    position: 'top-pills',
    height: 4,
    colorStart: '#FFFFFF',
    colorEnd: '#FFFFFF',
    pillCount: 4,
    opacity: 0.95,
  },
  cyberNeon: {
    enabled: true,
    style: 'neonGlow',
    position: 'bottom',
    height: 6,
    colorStart: '#00F0FF',
    colorEnd: '#FF007F',
    glowRadius: 16,
    opacity: 1,
  },
  sunsetGradient: {
    enabled: true,
    style: 'gradient',
    position: 'bottom',
    height: 6,
    colorStart: '#F97316',
    colorEnd: '#F43F5E',
    glowRadius: 12,
    opacity: 1,
  },
  emeraldLaser: {
    enabled: true,
    style: 'neonGlow',
    position: 'bottom',
    height: 6,
    colorStart: '#10B981',
    colorEnd: '#06B6D4',
    glowRadius: 16,
    opacity: 1,
  },
  radialCountdown: {
    enabled: true,
    style: 'radialClock',
    position: 'top',
    height: 8,
    colorStart: '#6366F1',
    colorEnd: '#A855F7',
    glowRadius: 12,
    opacity: 0.95,
  },
  minimalThin: {
    enabled: true,
    style: 'gradient',
    position: 'bottom-thin',
    height: 3,
    colorStart: '#38BDF8',
    colorEnd: '#818CF8',
    opacity: 0.9,
  },
};

/**
 * Clamps a number between min and max.
 */
function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

/**
 * Converts a hex or rgba string into an rgba string with adjusted alpha.
 */
function hexToRgba(color: string, alpha: number): string {
  if (!color) return `rgba(255, 255, 255, ${alpha})`;
  if (color.startsWith('rgba')) {
    return color.replace(/[\d\.]+\)$/g, `${alpha})`);
  }
  if (color.startsWith('rgb')) {
    return color.replace('rgb', 'rgba').replace(')', `, ${alpha})`);
  }

  let c = color.replace('#', '');
  if (c.length === 3) {
    c = c.split('').map((char) => char + char).join('');
  }
  if (c.length >= 6) {
    const r = parseInt(c.substring(0, 2), 16) || 0;
    const g = parseInt(c.substring(2, 4), 16) || 0;
    const b = parseInt(c.substring(4, 6), 16) || 0;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return `rgba(255, 255, 255, ${alpha})`;
}

/**
 * Formats seconds into sleek mm:ss or 0:ss countdown string (e.g. '0:14', '1:05').
 */
export function formatTimeRemaining(seconds: number): string {
  const totalSec = Math.max(0, Math.ceil(seconds));
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Draws a rounded rectangle path onto canvas.
 */
function drawRoundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number
): void {
  if (w <= 0 || h <= 0) return;
  const r = Math.min(radius, w / 2, h / 2);
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, w, h, r);
  } else {
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }
}

/**
 * Main entrance: Draws a styled video progress bar on a 2D Canvas context.
 *
 * @param ctx 2D Canvas Rendering Context
 * @param width Canvas width in pixels
 * @param height Canvas height in pixels
 * @param progress Normalized progress value from 0.0 to 1.0
 * @param config ProgressBarConfig defining style, position, dimensions, colors, and effects
 * @param currentTime Optional current timeline position in seconds
 * @param totalDuration Optional total timeline duration in seconds
 */
export function drawVideoProgressBar(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
  config: ProgressBarConfig,
  currentTime?: number,
  totalDuration?: number
): void {
  if (!config || !config.enabled) return;
  if (width <= 0 || height <= 0) return;

  const clampedProgress = clamp(progress, 0, 1);
  const opacity = clamp(config.opacity ?? 1, 0, 1);

  if (opacity <= 0) return;

  ctx.save();
  ctx.globalAlpha = opacity;

  switch (config.style) {
    case 'gradient':
      drawGradientProgressBar(ctx, width, height, clampedProgress, config);
      break;
    case 'neonGlow':
      drawNeonGlowProgressBar(ctx, width, height, clampedProgress, config);
      break;
    case 'storyPills':
      drawStoryPillsProgressBar(ctx, width, height, clampedProgress, config);
      break;
    case 'radialClock':
      drawRadialClockProgressBar(ctx, width, height, clampedProgress, config, currentTime, totalDuration);
      break;
    default:
      drawGradientProgressBar(ctx, width, height, clampedProgress, config);
      break;
  }

  ctx.restore();
}

/**
 * 1. Gradient Style
 * Smooth multi-color progress bar with rounded leading cap & specular sheen.
 */
function drawGradientProgressBar(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
  config: ProgressBarConfig
): void {
  const barHeight = Math.max(2, Math.min(24, config.height || 6));
  const glow = config.glowRadius ?? 8;

  let barX = 0;
  let barY = 0;
  let barWidth = width;

  if (config.position === 'top') {
    barX = 0;
    barY = 0;
    barWidth = width;
  } else if (config.position === 'top-pills') {
    const margin = Math.max(16, width * 0.03);
    barX = margin;
    barY = Math.max(16, height * 0.02);
    barWidth = width - margin * 2;
  } else if (config.position === 'bottom-thin') {
    const thinHeight = Math.min(barHeight, 4);
    barX = 0;
    barY = height - thinHeight;
    barWidth = width;
  } else {
    // 'bottom'
    barX = 0;
    barY = height - barHeight;
    barWidth = width;
  }

  const radius = barHeight / 2;

  // 1. Background Track
  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  drawRoundedRectPath(ctx, barX, barY, barWidth, barHeight, radius);
  ctx.fill();

  // Subtle translucent inner track sheen
  ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
  drawRoundedRectPath(ctx, barX, barY, barWidth, barHeight, radius);
  ctx.fill();
  ctx.restore();

  // 2. Active Progress Fill
  const activeWidth = barWidth * progress;
  if (activeWidth <= 0) return;

  const colorStart = config.colorStart || '#6366F1';
  const colorEnd = config.colorEnd || '#EC4899';

  ctx.save();

  // Outer ambient glow
  if (glow > 0) {
    ctx.shadowColor = hexToRgba(colorEnd, 0.7);
    ctx.shadowBlur = glow;
  }

  // Linear Gradient across full bar span for rich color shifting
  const grad = ctx.createLinearGradient(barX, barY, barX + barWidth, barY);
  grad.addColorStop(0, colorStart);
  grad.addColorStop(1, colorEnd);

  ctx.fillStyle = grad;
  drawRoundedRectPath(ctx, barX, barY, Math.max(barHeight, activeWidth), barHeight, radius);
  ctx.fill();

  // 3. Specular Sheen & Rounded Leading Cap Highlight
  if (activeWidth > 4) {
    const capX = barX + activeWidth;
    const capY = barY + barHeight / 2;
    const beadRadius = Math.max(2, barHeight * 0.6);

    // Tip radial highlight
    const beadGrad = ctx.createRadialGradient(capX, capY, 0, capX, capY, beadRadius * 2);
    beadGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    beadGrad.addColorStop(0.3, hexToRgba(colorEnd, 0.8));
    beadGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = beadGrad;
    ctx.beginPath();
    ctx.arc(capX, capY, beadRadius * 2, 0, Math.PI * 2);
    ctx.fill();

    // Top subtle horizontal reflection
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    drawRoundedRectPath(ctx, barX + 2, barY + 1, Math.max(0, activeWidth - 4), Math.max(1, barHeight * 0.3), radius);
    ctx.fill();
  }

  ctx.restore();
}

/**
 * 2. Neon Glow Style
 * Glowing neon laser bar with a bright focal bead at the leading tip and horizontal bloom blur.
 */
function drawNeonGlowProgressBar(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
  config: ProgressBarConfig
): void {
  const barHeight = Math.max(2, Math.min(24, config.height || 6));
  const glow = config.glowRadius ?? 18;

  let barX = 0;
  let barY = 0;
  let barWidth = width;

  if (config.position === 'top') {
    barX = 0;
    barY = 0;
    barWidth = width;
  } else if (config.position === 'top-pills') {
    const margin = Math.max(16, width * 0.03);
    barX = margin;
    barY = Math.max(16, height * 0.02);
    barWidth = width - margin * 2;
  } else if (config.position === 'bottom-thin') {
    const thinHeight = Math.min(barHeight, 4);
    barX = 0;
    barY = height - thinHeight;
    barWidth = width;
  } else {
    // 'bottom'
    barX = 0;
    barY = height - barHeight;
    barWidth = width;
  }

  const radius = barHeight / 2;
  const colorStart = config.colorStart || '#00F0FF';
  const colorEnd = config.colorEnd || '#FF007F';

  // 1. Sleek Glass Track
  ctx.save();
  ctx.fillStyle = 'rgba(10, 15, 28, 0.7)';
  drawRoundedRectPath(ctx, barX, barY, barWidth, barHeight, radius);
  ctx.fill();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1;
  drawRoundedRectPath(ctx, barX, barY, barWidth, barHeight, radius);
  ctx.stroke();
  ctx.restore();

  // 2. Active Neon Laser Fill
  const activeWidth = barWidth * progress;
  if (activeWidth <= 0) return;

  const tipX = barX + activeWidth;
  const tipY = barY + barHeight / 2;

  // Pass A: Wide Horizontal Bloom Blur
  ctx.save();
  ctx.shadowColor = colorEnd;
  ctx.shadowBlur = glow * 1.6;
  ctx.fillStyle = colorEnd;
  ctx.globalAlpha = 0.65;
  drawRoundedRectPath(ctx, barX, barY, Math.max(barHeight, activeWidth), barHeight, radius);
  ctx.fill();
  ctx.restore();

  // Pass B: Intense Core Laser Gradient
  ctx.save();
  ctx.shadowColor = colorStart;
  ctx.shadowBlur = glow * 0.8;

  const laserGrad = ctx.createLinearGradient(barX, barY, barX + barWidth, barY);
  laserGrad.addColorStop(0, colorStart);
  laserGrad.addColorStop(1, colorEnd);

  ctx.fillStyle = laserGrad;
  drawRoundedRectPath(ctx, barX, barY, Math.max(barHeight, activeWidth), barHeight, radius);
  ctx.fill();

  // Pass C: Hyper-Bright White Hot Core Filament
  const coreHeight = Math.max(1.5, barHeight * 0.35);
  const coreY = barY + (barHeight - coreHeight) / 2;
  const coreGrad = ctx.createLinearGradient(barX, coreY, barX + activeWidth, coreY);
  coreGrad.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
  coreGrad.addColorStop(0.8, 'rgba(255, 255, 255, 0.95)');
  coreGrad.addColorStop(1, '#FFFFFF');

  ctx.fillStyle = coreGrad;
  drawRoundedRectPath(ctx, barX + 1, coreY, Math.max(0, activeWidth - 2), coreHeight, coreHeight / 2);
  ctx.fill();
  ctx.restore();

  // 3. Bright Focal Bead & Horizontal Flare at Leading Tip
  if (activeWidth > 2) {
    ctx.save();

    // Horizontal bloom flare streak
    const flareWidth = Math.min(48, Math.max(16, activeWidth * 0.3));
    const flareHeight = Math.max(2, barHeight * 0.4);
    const flareGrad = ctx.createLinearGradient(tipX - flareWidth, tipY, tipX + flareWidth, tipY);
    flareGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
    flareGrad.addColorStop(0.5, '#FFFFFF');
    flareGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = flareGrad;
    ctx.fillRect(tipX - flareWidth, tipY - flareHeight / 2, flareWidth * 2, flareHeight);

    // Multi-ring glowing focal bead
    // Outer glow aura
    const beadRadius = Math.max(4, barHeight * 1.3);
    const auraGrad = ctx.createRadialGradient(tipX, tipY, 0, tipX, tipY, beadRadius * 2);
    auraGrad.addColorStop(0, '#FFFFFF');
    auraGrad.addColorStop(0.3, colorEnd);
    auraGrad.addColorStop(0.7, hexToRgba(colorEnd, 0.4));
    auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = auraGrad;
    ctx.beginPath();
    ctx.arc(tipX, tipY, beadRadius * 2, 0, Math.PI * 2);
    ctx.fill();

    // Intense focal point center
    ctx.shadowColor = '#FFFFFF';
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(tipX, tipY, Math.max(2, barHeight * 0.4), 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

/**
 * 3. Story Pills Style
 * Instagram / TikTok Story segmented pill bars with active filling animation on current segment.
 */
function drawStoryPillsProgressBar(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
  config: ProgressBarConfig
): void {
  const pillCount = Math.max(2, Math.min(20, config.pillCount ?? 4));
  const pillHeight = Math.max(2, Math.min(16, config.height || 4));
  const pillRadius = pillHeight / 2;

  // Horizontal and vertical margins
  const marginH = Math.max(12, width * 0.025);
  let barY = 0;

  if (config.position === 'top' || config.position === 'top-pills') {
    barY = Math.max(12, height * 0.016);
  } else if (config.position === 'bottom-thin' || config.position === 'bottom') {
    barY = height - pillHeight - Math.max(12, height * 0.016);
  } else {
    barY = Math.max(12, height * 0.016);
  }

  const totalWidth = width - marginH * 2;
  const gap = Math.max(3, Math.min(8, totalWidth * 0.008));
  const totalGaps = (pillCount - 1) * gap;
  const pillWidth = Math.max(4, (totalWidth - totalGaps) / pillCount);

  const totalProgress = progress * pillCount;
  const colorStart = config.colorStart || '#FFFFFF';
  const colorEnd = config.colorEnd || '#FFFFFF';

  ctx.save();

  // Drop shadow behind all pills for high contrast on bright videos
  ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
  ctx.shadowBlur = 4;
  ctx.shadowOffsetY = 1;

  for (let i = 0; i < pillCount; i++) {
    const pillX = marginH + i * (pillWidth + gap);

    // Compute segment fill progress (0.0 to 1.0)
    let segProgress = 0;
    if (i < Math.floor(totalProgress)) {
      segProgress = 1.0;
    } else if (i === Math.floor(totalProgress)) {
      segProgress = totalProgress - i;
    } else {
      segProgress = 0.0;
    }

    // 1. Background Pill Track
    ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
    drawRoundedRectPath(ctx, pillX, barY, pillWidth, pillHeight, pillRadius);
    ctx.fill();

    // 2. Active Filled Portion
    if (segProgress > 0) {
      const fillW = pillWidth * segProgress;

      ctx.save();
      // Clip to current pill's rounded capsule shape
      drawRoundedRectPath(ctx, pillX, barY, pillWidth, pillHeight, pillRadius);
      ctx.clip();

      // Pill Gradient fill
      const grad = ctx.createLinearGradient(pillX, barY, pillX + pillWidth, barY);
      grad.addColorStop(0, colorStart);
      grad.addColorStop(1, colorEnd);

      ctx.fillStyle = grad;
      ctx.fillRect(pillX, barY, fillW, pillHeight);

      // Active leading edge specular shimmer on current filling segment
      if (segProgress > 0.02 && segProgress < 0.98) {
        const shineX = pillX + fillW;
        const shineWidth = Math.min(8, fillW);
        const shineGrad = ctx.createLinearGradient(shineX - shineWidth, barY, shineX, barY);
        shineGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        shineGrad.addColorStop(1, 'rgba(255, 255, 255, 0.9)');

        ctx.fillStyle = shineGrad;
        ctx.fillRect(shineX - shineWidth, barY, shineWidth, pillHeight);
      }

      ctx.restore();
    }
  }

  ctx.restore();
}

/**
 * 4. Radial Clock Style
 * Sleek circular countdown badge in top-right or bottom-right corner with time remaining string (e.g. '0:14').
 */
function drawRadialClockProgressBar(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
  config: ProgressBarConfig,
  currentTime?: number,
  totalDuration?: number
): void {
  const minDim = Math.min(width, height);
  const radius = Math.max(26, Math.min(48, minDim * 0.045, (config.height || 6) * 4));
  const margin = Math.max(18, minDim * 0.03);

  let centerX = width - margin - radius;
  let centerY = margin + radius;

  if (config.position === 'bottom' || config.position === 'bottom-thin') {
    centerX = width - margin - radius;
    centerY = height - margin - radius;
  } else {
    // 'top' or 'top-pills' -> top-right corner
    centerX = width - margin - radius;
    centerY = margin + radius;
  }

  // Calculate remaining time string
  let remainingSeconds = 0;
  if (typeof currentTime === 'number' && typeof totalDuration === 'number' && totalDuration > 0) {
    remainingSeconds = Math.max(0, totalDuration - currentTime);
  } else {
    remainingSeconds = Math.max(0, Math.round((1 - progress) * 30));
  }

  const timeString = formatTimeRemaining(remainingSeconds);
  const colorStart = config.colorStart || '#6366F1';
  const colorEnd = config.colorEnd || '#A855F7';
  const glow = config.glowRadius ?? 12;

  ctx.save();

  // 1. Frosted Dark Glass Badge Backdrop with drop shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 12;
  ctx.shadowOffsetY = 4;

  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fill();

  // Reset shadow for crisp inner strokes
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  // Delicate white rim stroke
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // 2. Background Ring Track
  const ringRadius = radius - Math.max(4, radius * 0.16);
  const ringThickness = Math.max(2.5, Math.min(5, radius * 0.12));

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
  ctx.lineWidth = ringThickness;
  ctx.beginPath();
  ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
  ctx.stroke();

  // 3. Active Progress Arc
  const startAngle = -Math.PI / 2; // 12 o'clock
  const endAngle = startAngle + Math.PI * 2 * progress;

  if (progress > 0.005) {
    ctx.save();

    if (glow > 0) {
      ctx.shadowColor = colorEnd;
      ctx.shadowBlur = glow;
    }

    const ringGrad = ctx.createLinearGradient(
      centerX - ringRadius,
      centerY - ringRadius,
      centerX + ringRadius,
      centerY + ringRadius
    );
    ringGrad.addColorStop(0, colorStart);
    ringGrad.addColorStop(1, colorEnd);

    ctx.strokeStyle = ringGrad;
    ctx.lineWidth = ringThickness;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(centerX, centerY, ringRadius, startAngle, endAngle);
    ctx.stroke();

    // Glowing leading bead at the arc tip
    const tipX = centerX + ringRadius * Math.cos(endAngle);
    const tipY = centerY + ringRadius * Math.sin(endAngle);
    const beadRadius = ringThickness * 1.1;

    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = '#FFFFFF';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(tipX, tipY, beadRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // 4. Center Countdown Typography
  const fontSize = Math.round(radius * 0.58);
  ctx.font = `700 ${fontSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Text subtle drop shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
  ctx.shadowBlur = 4;
  ctx.shadowOffsetY = 1;

  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(timeString, centerX, centerY + fontSize * 0.05);

  ctx.restore();
}
