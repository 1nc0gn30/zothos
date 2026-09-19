import { VideoEffectsConfig } from '../types/models';

/**
 * Renders Hollywood 2.39:1 Widescreen Letterbox Matte Bars
 */
export function drawCinematicLetterbox(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  config?: VideoEffectsConfig['letterbox']
) {
  if (!config || !config.enabled) return;

  const opacity = config.opacity ?? 1.0;
  if (opacity <= 0) return;

  ctx.save();
  ctx.globalAlpha = Math.max(0, Math.min(1, opacity));
  ctx.fillStyle = '#000000';

  let barHeight = height * 0.12; // default 12% top & bottom
  if (config.aspect === '2.39:1') {
    const targetHeight = width / 2.39;
    if (targetHeight < height) {
      barHeight = (height - targetHeight) / 2;
    }
  } else if (config.aspect === '2.35:1') {
    const targetHeight = width / 2.35;
    if (targetHeight < height) {
      barHeight = (height - targetHeight) / 2;
    }
  } else if (config.aspect === '4:3') {
    // Pillarbox left and right
    const targetWidth = height * (4 / 3);
    if (targetWidth < width) {
      const pillarW = (width - targetWidth) / 2;
      ctx.fillRect(0, 0, pillarW, height);
      ctx.fillRect(width - pillarW, 0, pillarW, height);
      ctx.restore();
      return;
    }
  }

  // Top Bar
  ctx.fillRect(0, 0, width, barHeight);
  // Bottom Bar
  ctx.fillRect(0, height - barHeight, width, barHeight);

  ctx.restore();
}

/**
 * Renders Anamorphic Horizontal Optical Lens Flares (JJ Abrams / Nolan style)
 */
export function drawAnamorphicFlare(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  config?: VideoEffectsConfig['anamorphicFlare']
) {
  if (!config || !config.enabled) return;

  const intensity = config.intensity ?? 0.6;
  if (intensity <= 0) return;

  const color = config.colorHex || '#38BDF8';
  const cy = height * 0.45 + Math.sin(time * 0.7) * (height * 0.08);
  const flareX = width * 0.5 + Math.cos(time * 0.5) * (width * 0.25);
  const streakW = width * (config.streakWidth ?? 0.85);

  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  ctx.globalAlpha = Math.min(1, intensity * 0.85);

  // Horizontal Anamorphic Streak
  const streakGrad = ctx.createLinearGradient(flareX - streakW / 2, cy, flareX + streakW / 2, cy);
  streakGrad.addColorStop(0, 'rgba(0,0,0,0)');
  streakGrad.addColorStop(0.3, color + '22');
  streakGrad.addColorStop(0.5, '#FFFFFF');
  streakGrad.addColorStop(0.7, color + '22');
  streakGrad.addColorStop(1, 'rgba(0,0,0,0)');

  ctx.fillStyle = streakGrad;
  ctx.fillRect(flareX - streakW / 2, cy - 2, streakW, 4);

  // Secondary Soft Glow Beam
  const glowGrad = ctx.createLinearGradient(flareX - streakW / 3, cy, flareX + streakW / 3, cy);
  glowGrad.addColorStop(0, 'rgba(0,0,0,0)');
  glowGrad.addColorStop(0.5, color + '88');
  glowGrad.addColorStop(1, 'rgba(0,0,0,0)');

  ctx.fillStyle = glowGrad;
  ctx.fillRect(flareX - streakW / 3, cy - 8, (streakW * 2) / 3, 16);

  // Central Optical Core
  const coreGrad = ctx.createRadialGradient(flareX, cy, 1, flareX, cy, 18);
  coreGrad.addColorStop(0, '#FFFFFF');
  coreGrad.addColorStop(0.4, color);
  coreGrad.addColorStop(1, 'rgba(0,0,0,0)');

  ctx.beginPath();
  ctx.arc(flareX, cy, 18, 0, Math.PI * 2);
  ctx.fillStyle = coreGrad;
  ctx.fill();

  ctx.restore();
}

/**
 * Renders Kodak 500T 35mm Organic Light Leaks & Film Burns
 */
export function drawLightLeaks(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  config?: VideoEffectsConfig['lightLeaks']
) {
  if (!config || !config.enabled) return;

  const intensity = config.intensity ?? 0.5;
  if (intensity <= 0) return;

  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  ctx.globalAlpha = Math.min(0.85, intensity * 0.75);

  // Moving organic warm blob 1 (Top Left / Edge)
  const x1 = (Math.sin(time * 0.6) * 0.25 + 0.15) * width;
  const y1 = (Math.cos(time * 0.4) * 0.2 + 0.2) * height;
  const r1 = width * 0.45;

  const grad1 = ctx.createRadialGradient(x1, y1, 10, x1, y1, r1);
  if (config.theme === 'neonCyan') {
    grad1.addColorStop(0, '#06B6D4');
    grad1.addColorStop(0.4, '#3B82F6');
    grad1.addColorStop(1, 'rgba(0,0,0,0)');
  } else if (config.theme === 'solarAmber') {
    grad1.addColorStop(0, '#F59E0B');
    grad1.addColorStop(0.4, '#D97706');
    grad1.addColorStop(1, 'rgba(0,0,0,0)');
  } else {
    // Kodak Warm (Default)
    grad1.addColorStop(0, '#FF6B00');
    grad1.addColorStop(0.35, '#E11D48');
    grad1.addColorStop(0.7, '#FB923C22');
    grad1.addColorStop(1, 'rgba(0,0,0,0)');
  }

  ctx.fillStyle = grad1;
  ctx.beginPath();
  ctx.arc(x1, y1, r1, 0, Math.PI * 2);
  ctx.fill();

  // Moving organic warm blob 2 (Bottom Right / Edge)
  const x2 = (width * 0.85) - Math.cos(time * 0.5) * (width * 0.15);
  const y2 = (height * 0.8) + Math.sin(time * 0.3) * (height * 0.15);
  const r2 = width * 0.38;

  const grad2 = ctx.createRadialGradient(x2, y2, 5, x2, y2, r2);
  grad2.addColorStop(0, '#F97316');
  grad2.addColorStop(0.45, '#EA580C44');
  grad2.addColorStop(1, 'rgba(0,0,0,0)');

  ctx.fillStyle = grad2;
  ctx.beginPath();
  ctx.arc(x2, y2, r2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * Computes organic handheld camera micro-jitter offsets (Mimics real camera operator breathing)
 */
export function computeHandheldDrift(
  time: number,
  config?: VideoEffectsConfig['handheldCamera']
): { x: number; y: number; rotate: number } {
  if (!config || !config.enabled) {
    return { x: 0, y: 0, rotate: 0 };
  }

  const intensity = config.intensity ?? 0.4;
  const speed = config.speed ?? 1.0;
  const t = time * speed;

  // Composite harmonic sines for non-repeating natural drift
  const x = (Math.sin(t * 1.3) * 0.6 + Math.sin(t * 2.7) * 0.3 + Math.cos(t * 0.8) * 0.4) * intensity * 8;
  const y = (Math.cos(t * 1.1) * 0.6 + Math.cos(t * 3.1) * 0.3 + Math.sin(t * 0.6) * 0.4) * intensity * 8;
  const rotate = (Math.sin(t * 0.9) * 0.5 + Math.cos(t * 1.8) * 0.25) * intensity * 0.6; // in degrees

  return { x, y, rotate };
}
