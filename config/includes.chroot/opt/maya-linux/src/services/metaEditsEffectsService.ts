import { MetaEditsConfig } from '../types/models';

/**
 * 1. Meta Scribble Effect (Animated hand-drawn neon sketch lines dancing around frame/taps)
 */
export function drawMetaScribbleEffect(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  config?: MetaEditsConfig['scribble'],
  targetBounds?: { x: number; y: number; width: number; height: number; radius?: number }
) {
  if (!config || !config.enabled) return;

  const intensity = config.intensity ?? 0.8;
  const speed = config.speed ?? 1.5;
  const color = config.colorHex || '#38BDF8';
  const strokeW = 3;

  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  ctx.globalAlpha = Math.min(1, intensity);
  ctx.lineWidth = strokeW;
  ctx.strokeStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 10;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const t = time * speed;
  const frameSeed = Math.floor(t * 12); // Jitter at 12fps (traditional hand-drawn animation frame rate)

  // Pseudo-random jitter generator seeded by time step
  const pseudoRand = (seed: number) => {
    const x = Math.sin(seed * 9999 + frameSeed * 1337) * 10000;
    return x - Math.floor(x);
  };

  const bounds = targetBounds || {
    x: width * 0.2,
    y: height * 0.15,
    width: width * 0.6,
    height: height * 0.7,
    radius: 24,
  };

  // Draw 3-4 energetic vibrating hand-drawn loops around perimeter
  const segments = 24;
  ctx.beginPath();

  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    const rx = bounds.width / 2 + 16 + (pseudoRand(i * 3 + 1) - 0.5) * 18;
    const ry = bounds.height / 2 + 16 + (pseudoRand(i * 3 + 2) - 0.5) * 18;
    const cx = bounds.x + bounds.width / 2;
    const cy = bounds.y + bounds.height / 2;

    const px = cx + Math.cos(angle) * rx;
    const py = cy + Math.sin(angle) * ry;

    if (i === 0) {
      ctx.moveTo(px, py);
    } else {
      ctx.lineTo(px, py);
    }
  }
  ctx.stroke();

  // Floating energetic doodle crowns & accent sparkles near top corners
  for (let s = 0; s < 4; s++) {
    const starX = bounds.x + (s < 2 ? -20 : bounds.width + 20) + (pseudoRand(s * 10 + 1) - 0.5) * 16;
    const starY = bounds.y + (s % 2 === 0 ? 10 : bounds.height - 10) + (pseudoRand(s * 10 + 2) - 0.5) * 16;
    const arm = 8 + pseudoRand(s) * 6;

    ctx.beginPath();
    ctx.moveTo(starX - arm, starY);
    ctx.lineTo(starX + arm, starY);
    ctx.moveTo(starX, starY - arm);
    ctx.lineTo(starX, starY + arm);
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * 2. Meta Outline / SAM 3 Luminous Silhouette Effect
 */
export function drawMetaOutlineEffect(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  config?: MetaEditsConfig['outline'],
  targetBounds?: { x: number; y: number; width: number; height: number; radius?: number }
) {
  if (!config || !config.enabled) return;

  const color = config.colorHex || '#EC4899';
  const strokeWidth = config.width || 4;
  const pulseSpeed = config.pulseSpeed || 2.0;
  const glow = config.glowIntensity ?? 0.9;

  const bounds = targetBounds || {
    x: width * 0.2,
    y: height * 0.15,
    width: width * 0.6,
    height: height * 0.7,
    radius: 28,
  };

  const pulse = 0.7 + Math.sin(time * pulseSpeed) * 0.3;

  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  ctx.globalAlpha = pulse * glow;
  ctx.strokeStyle = color;
  ctx.lineWidth = strokeWidth;
  ctx.shadowColor = color;
  ctx.shadowBlur = 18 * pulse;

  const r = bounds.radius || 24;
  const pad = 6;

  if (config.style === 'flowing') {
    // Flowing gradient dash offset
    ctx.setLineDash([16, 8]);
    ctx.lineDashOffset = -time * 30;
  } else if (config.style === 'dashed') {
    ctx.setLineDash([8, 8]);
  }

  // Draw rounded outline contour
  ctx.beginPath();
  ctx.roundRect
    ? ctx.roundRect(bounds.x - pad, bounds.y - pad, bounds.width + pad * 2, bounds.height + pad * 2, r + pad)
    : ctx.strokeRect(bounds.x - pad, bounds.y - pad, bounds.width + pad * 2, bounds.height + pad * 2);
  ctx.stroke();

  ctx.restore();
}

/**
 * 3. Meta Glitter & Shimmer Sparkles
 */
export function drawMetaGlitterEffect(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  config?: MetaEditsConfig['glitter']
) {
  if (!config || !config.enabled) return;

  const starCount = config.starCount || 36;
  const speed = config.speed || 1.0;
  const theme = config.colorTheme || 'diamond';

  let primaryColor = '#FFFFFF';
  let secondaryColor = '#38BDF8';
  if (theme === 'gold') {
    primaryColor = '#FDE047';
    secondaryColor = '#F59E0B';
  } else if (theme === 'neonPink') {
    primaryColor = '#F472B6';
    secondaryColor = '#EC4899';
  } else if (theme === 'cosmic') {
    primaryColor = '#C084FC';
    secondaryColor = '#818CF8';
  }

  ctx.save();
  ctx.globalCompositeOperation = 'screen';

  for (let i = 0; i < starCount; i++) {
    // Deterministic position per index + organic drift
    const seedX = ((i * 137.5) % width);
    const seedY = ((i * 269.3) % height);
    const floatY = (seedY + time * speed * 25 * (1 + (i % 3) * 0.4)) % height;
    const floatX = seedX + Math.sin(time * 1.2 + i) * 12;

    const twinkle = Math.max(0, Math.sin(time * 3.5 + i * 1.8));
    if (twinkle < 0.1) continue;

    const size = (4 + (i % 5) * 2.5) * twinkle;
    const isDiamond = i % 2 === 0;

    ctx.globalAlpha = twinkle * 0.85;
    ctx.fillStyle = isDiamond ? primaryColor : secondaryColor;
    ctx.shadowColor = secondaryColor;
    ctx.shadowBlur = 8;

    // Draw 4-point sparkling star glint
    ctx.beginPath();
    ctx.moveTo(floatX, floatY - size);
    ctx.quadraticCurveTo(floatX, floatY, floatX + size, floatY);
    ctx.quadraticCurveTo(floatX, floatY, floatX, floatY + size);
    ctx.quadraticCurveTo(floatX, floatY, floatX - size, floatY);
    ctx.quadraticCurveTo(floatX, floatY, floatX, floatY - size);
    ctx.fill();

    // Central bright core
    ctx.beginPath();
    ctx.arc(floatX, floatY, size * 0.25, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
  }

  ctx.restore();
}

/**
 * 4. Meta Selective Privacy Blur & Pixelate Censor
 */
export function drawMetaSelectiveBlur(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  config?: MetaEditsConfig['selectiveBlur']
) {
  if (!config || !config.enabled) return;

  const bx = (config.x ?? 0.5) * width;
  const by = (config.y ?? 0.5) * height;
  const bw = (config.width ?? 0.3) * width;
  const bh = (config.height ?? 0.12) * height;

  const startX = bx - bw / 2;
  const startY = by - bh / 2;

  ctx.save();

  if (config.type === 'pixelate') {
    // 8-bit Mosaic Pixelate Censor
    const pixelSize = Math.max(8, config.pixelSize || 16);
    ctx.save();
    ctx.beginPath();
    ctx.rect(startX, startY, bw, bh);
    ctx.clip();

    // Read and pixelate region
    try {
      const imgData = ctx.getImageData(startX, startY, bw, bh);
      const data = imgData.data;
      for (let py = 0; py < bh; py += pixelSize) {
        for (let px = 0; px < bw; px += pixelSize) {
          const sampleIndex = (py * bw + px) * 4;
          const r = data[sampleIndex];
          const g = data[sampleIndex + 1];
          const b = data[sampleIndex + 2];
          ctx.fillStyle = `rgb(${r},${g},${b})`;
          ctx.fillRect(startX + px, startY + py, pixelSize, pixelSize);
        }
      }
    } catch {
      // Fallback frosted acrylic tint
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(startX, startY, bw, bh);
    }
    ctx.restore();
  } else {
    // Frosted Glass Blur Tint Box
    ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
    ctx.fillRect(startX, startY, bw, bh);
  }

  // Border & Censor Label Tag
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.lineWidth = 1.2;
  ctx.setLineDash([4, 4]);
  ctx.strokeRect(startX, startY, bw, bh);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '600 10px Inter, monospace';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('🔒 PRIVACY BLUR', startX + 6, startY + 5);

  ctx.restore();
}

/**
 * 5. Meta Beat-Synced Whiteout Flash Strobe
 */
export function drawMetaFlashStrobe(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  config?: MetaEditsConfig['flashStrobe']
) {
  if (!config || !config.enabled) return;

  const interval = config.triggerEverySec || 2.0;
  const modTime = time % interval;
  const flashDur = 0.12;

  if (modTime < flashDur) {
    const flashProgress = modTime / flashDur;
    const opacity = (1 - flashProgress) * (config.intensity ?? 0.8);

    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.globalAlpha = opacity;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }
}
