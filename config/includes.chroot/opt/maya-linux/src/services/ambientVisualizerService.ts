/**
 * Ambient Visualizer & Dynamic Shader Service
 * 
 * Provides real-time rendering routines for:
 * 1. Multi-point organic drifting mesh gradients (Aurora, Cyberpunk, Sunset, Deep Ocean)
 * 2. Real-time audio spectrum visualizers (Bars with rounded caps & peak meters, Sine Wave Ribbons, Matrix Dots)
 */

export type MeshGradientTheme = 'aurora' | 'cyberpunk' | 'sunset' | 'deepOcean';
export type AudioSpectrumStyle = 'bars' | 'wave' | 'dots';

export interface VisualizerOptions {
  position?: 'bottom' | 'top' | 'center';
  maxHeightRatio?: number;
  barCount?: number;
  opacity?: number;
  colorHex?: string;
}

/**
 * Draws a real-time animated organic mesh gradient background with drifting radial blobs.
 *
 * @param ctx 2D Canvas Rendering Context
 * @param width Canvas width in pixels
 * @param height Canvas height in pixels
 * @param time Current timestamp in seconds
 * @param theme Color theme preset ('aurora' | 'cyberpunk' | 'sunset' | 'deepOcean')
 */
export function drawAnimatedMeshGradient(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  theme: 'aurora' | 'cyberpunk' | 'sunset' | 'deepOcean' = 'aurora'
) {
  if (width <= 0 || height <= 0) return;

  ctx.save();

  // Dark background foundation
  ctx.fillStyle = '#07090E';
  ctx.fillRect(0, 0, width, height);

  const themePalettes: Record<'aurora' | 'cyberpunk' | 'sunset' | 'deepOcean', string[]> = {
    aurora: ['#10B981', '#06B6D4', '#6366F1', '#8B5CF6', '#3B82F6'],
    cyberpunk: ['#F43F5E', '#EC4899', '#A855F7', '#06B6D4', '#EAB308'],
    sunset: ['#F97316', '#F43F5E', '#EC4899', '#8B5CF6', '#FBBF24'],
    deepOcean: ['#0284C7', '#06B6D4', '#10B981', '#4F46E5', '#1D4ED8'],
  };

  const colors = themePalettes[theme] || themePalettes.aurora;
  const maxDim = Math.max(width, height);

  // 5 dynamic orbital radial gradient nodes with organic harmonic drift
  const nodes = [
    {
      x: width * (0.28 + Math.sin(time * 0.55) * 0.18 + Math.cos(time * 0.35) * 0.08),
      y: height * (0.32 + Math.cos(time * 0.45) * 0.16 + Math.sin(time * 0.25) * 0.06),
      r: maxDim * (0.55 + Math.sin(time * 0.6) * 0.08),
      color: colors[0],
    },
    {
      x: width * (0.72 + Math.cos(time * 0.48) * 0.18 + Math.sin(time * 0.38) * 0.07),
      y: height * (0.36 + Math.sin(time * 0.62) * 0.2 + Math.cos(time * 0.28) * 0.06),
      r: maxDim * (0.5 + Math.cos(time * 0.5) * 0.08),
      color: colors[1],
    },
    {
      x: width * (0.45 + Math.sin(time * 0.68) * 0.2 + Math.cos(time * 0.42) * 0.06),
      y: height * (0.72 + Math.cos(time * 0.52) * 0.16 + Math.sin(time * 0.32) * 0.07),
      r: maxDim * (0.6 + Math.sin(time * 0.7) * 0.09),
      color: colors[2],
    },
    {
      x: width * (0.82 + Math.cos(time * 0.38) * 0.14 + Math.sin(time * 0.52) * 0.06),
      y: height * (0.78 + Math.sin(time * 0.45) * 0.14 + Math.cos(time * 0.35) * 0.05),
      r: maxDim * (0.48 + Math.cos(time * 0.65) * 0.07),
      color: colors[3],
    },
    {
      x: width * (0.18 + Math.cos(time * 0.62) * 0.15),
      y: height * (0.75 + Math.sin(time * 0.58) * 0.14),
      r: maxDim * (0.52 + Math.sin(time * 0.48) * 0.08),
      color: colors[4],
    },
  ];

  ctx.globalCompositeOperation = 'screen';
  for (const node of nodes) {
    const grad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, Math.max(1, node.r));
    grad.addColorStop(0, node.color);
    grad.addColorStop(0.35, `${node.color}AA`);
    grad.addColorStop(0.7, `${node.color}33`);
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  }

  // Soft cinematic vignette
  ctx.globalCompositeOperation = 'multiply';
  const vignette = ctx.createRadialGradient(
    width / 2,
    height / 2,
    maxDim * 0.2,
    width / 2,
    height / 2,
    maxDim * 0.8
  );
  vignette.addColorStop(0, 'rgba(255, 255, 255, 1)');
  vignette.addColorStop(0.75, 'rgba(200, 205, 220, 0.92)');
  vignette.addColorStop(1, 'rgba(10, 12, 20, 0.6)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);

  ctx.restore();
}

/**
 * Draws a real-time animated audio spectrum visualizer across the canvas.
 * Supports 3 distinctive studio styles:
 * - 'bars': Rounded equalizer bars with gradient glow and peak dots
 * - 'wave': Glowing multi-layer sine wave ribbon with fill
 * - 'dots': Futuristic matrix LED dots equalizer
 *
 * @param ctx 2D Canvas Rendering Context
 * @param width Canvas width in pixels
 * @param height Canvas height in pixels
 * @param time Current timestamp in seconds
 * @param isPlaying Whether playback is actively running
 * @param hasAudio Whether an active audio track exists
 * @param style Visual style preset ('bars' | 'wave' | 'dots')
 * @param colorHex Main visualizer color theme
 */
export function drawAudioSpectrumVisualizer(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  isPlaying: boolean,
  hasAudio: boolean,
  style: 'bars' | 'wave' | 'dots' = 'bars',
  colorHex: string = '#6466FA'
) {
  if (!hasAudio || width <= 0 || height <= 0) return;

  const barCount = 32;
  const vizWidth = width * 0.6;
  const vizHeight = Math.min(60, height * 0.16);
  const startX = (width - vizWidth) / 2;
  const startY = height - vizHeight - 24;
  const barSpacing = vizWidth / barCount;
  const barW = Math.max(3, barSpacing * 0.62);

  ctx.save();

  if (style === 'bars') {
    // -------------------------------------------------------------
    // Style 1: Modern Rounded Equalizer Bars + Dynamic Peak Caps
    // -------------------------------------------------------------
    for (let i = 0; i < barCount; i++) {
      const normI = i / barCount;
      const freqMultiplier = Math.sin(normI * Math.PI * 0.9 + 0.15);

      // Multi-harmonic audio frequency synthesis
      const bass = Math.pow(Math.max(0, Math.sin(time * 4.2)), 2) * 0.5;
      const mid = Math.sin(time * 8.5 + i * 0.4) * Math.cos(time * 6.2 + i * 0.25) * 0.35;
      const treble = Math.sin(time * 16.0 + i * 0.9) * 0.15;

      const dynamicEnergy = isPlaying
        ? Math.abs(bass * 0.6 + mid + treble) * (0.35 + freqMultiplier * 0.65)
        : 0.08;

      const barH = Math.max(4, Math.min(vizHeight, dynamicEnergy * vizHeight * 1.8));
      const x = startX + i * barSpacing;
      const y = startY + (vizHeight - barH);

      // Glowing vertical gradient
      const grad = ctx.createLinearGradient(x, startY + vizHeight, x, y);
      grad.addColorStop(0, `${colorHex}33`);
      grad.addColorStop(0.5, colorHex);
      grad.addColorStop(1, '#FFFFFF');

      ctx.fillStyle = grad;
      ctx.beginPath();
      const r = Math.min(barW / 2, 4);

      if (ctx.roundRect) {
        ctx.roundRect(x, y, barW, barH, r);
      } else {
        ctx.fillRect(x, y, barW, barH);
      }
      ctx.fill();

      // Floating Peak Cap Indicator
      if (isPlaying && dynamicEnergy > 0.22) {
        const peakY = y - 4;
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = colorHex;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(x + barW / 2, peakY, Math.min(barW / 2, 2.5), 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }
  } else if (style === 'wave') {
    // -------------------------------------------------------------
    // Style 2: Smooth Glowing Multi-Harmonic Sine Wave Ribbon
    // -------------------------------------------------------------
    const stepCount = 64;
    const stepX = vizWidth / stepCount;

    // Translucent Underlay Fill
    ctx.beginPath();
    ctx.moveTo(startX, startY + vizHeight);

    for (let i = 0; i <= stepCount; i++) {
      const normX = i / stepCount;
      const freq = Math.sin(normX * Math.PI) * (isPlaying ? 1.0 : 0.2);
      const wave = isPlaying
        ? (Math.sin(time * 9.0 + normX * Math.PI * 4) * 0.6 +
           Math.cos(time * 5.5 + normX * Math.PI * 6) * 0.4) * (vizHeight * 0.42 * freq)
        : Math.sin(normX * Math.PI * 2 + time * 2) * 3;

      const x = startX + i * stepX;
      const y = startY + vizHeight / 2 - wave;
      ctx.lineTo(x, y);
    }

    ctx.lineTo(startX + vizWidth, startY + vizHeight);
    ctx.closePath();

    const waveGrad = ctx.createLinearGradient(0, startY, 0, startY + vizHeight);
    waveGrad.addColorStop(0, `${colorHex}55`);
    waveGrad.addColorStop(1, `${colorHex}00`);
    ctx.fillStyle = waveGrad;
    ctx.fill();

    // Glowing Primary Stroke
    ctx.beginPath();
    for (let i = 0; i <= stepCount; i++) {
      const normX = i / stepCount;
      const freq = Math.sin(normX * Math.PI) * (isPlaying ? 1.0 : 0.2);
      const wave = isPlaying
        ? (Math.sin(time * 9.0 + normX * Math.PI * 4) * 0.6 +
           Math.cos(time * 5.5 + normX * Math.PI * 6) * 0.4) * (vizHeight * 0.42 * freq)
        : Math.sin(normX * Math.PI * 2 + time * 2) * 3;

      const x = startX + i * stepX;
      const y = startY + vizHeight / 2 - wave;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = colorHex;
    ctx.lineWidth = 3.5;
    ctx.shadowColor = colorHex;
    ctx.shadowBlur = 12;
    ctx.stroke();

  } else if (style === 'dots') {
    // -------------------------------------------------------------
    // Style 3: Futuristic Matrix LED Dot Grid Equalizer
    // -------------------------------------------------------------
    const dotRows = 8;
    const dotRadius = Math.max(1.8, Math.min(3.5, barW / 2));
    const rowSpacing = vizHeight / dotRows;

    for (let col = 0; col < barCount; col++) {
      const normI = col / barCount;
      const freqMultiplier = Math.sin(normI * Math.PI * 0.9 + 0.15);

      const bass = Math.pow(Math.max(0, Math.sin(time * 4.2)), 2) * 0.5;
      const mid = Math.sin(time * 8.5 + col * 0.4) * Math.cos(time * 6.2 + col * 0.25) * 0.35;
      const treble = Math.sin(time * 16.0 + col * 0.9) * 0.15;

      const dynamicEnergy = isPlaying
        ? Math.abs(bass * 0.6 + mid + treble) * (0.35 + freqMultiplier * 0.65)
        : 0.1;

      const activeDots = Math.min(dotRows, Math.max(1, Math.round(dynamicEnergy * dotRows * 1.6)));
      const cx = startX + col * barSpacing + barW / 2;

      for (let row = 0; row < dotRows; row++) {
        const cy = startY + vizHeight - row * rowSpacing - dotRadius;
        const isActive = row < activeDots;

        ctx.beginPath();
        ctx.arc(cx, cy, dotRadius, 0, Math.PI * 2);

        if (isActive) {
          if (row >= dotRows - 2) {
            ctx.fillStyle = '#F43F5E'; // High peak red
            ctx.shadowColor = '#F43F5E';
          } else if (row >= dotRows - 4) {
            ctx.fillStyle = '#FBBF24'; // Mid-high amber
            ctx.shadowColor = '#FBBF24';
          } else {
            ctx.fillStyle = colorHex;
            ctx.shadowColor = colorHex;
          }
          ctx.shadowBlur = 6;
        } else {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
          ctx.shadowBlur = 0;
        }

        ctx.fill();
      }
    }
  }

  ctx.restore();
}
