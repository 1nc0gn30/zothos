/**
 * Video Shader & Motion Transition Service for Maya Video Editor
 *
 * Provides high-speed directional whip pans, radial crash zooms, warm optical light leak dissolves,
 * cyberpunk chromatic RGB glitches, organic 35mm film gate burns, vortex spiral distortions,
 * and directional push transitions rendered onto HTML5 2D Canvas.
 */

export type TransitionType = 
  | 'whipPan' 
  | 'crashZoom' 
  | 'lightLeakFlash' 
  | 'rgbGlitch' 
  | 'filmBurn' 
  | 'vortexSwirl' 
  | 'directionalPush'
  | 'none';

export interface TransitionItem {
  id: string;
  type: TransitionType;
  startTime: number; // timeline trigger point in seconds
  duration: number; // typically 0.3..0.8s
  direction?: 'left' | 'right' | 'up' | 'down';
  intensity?: number; // 0..1
}

export interface TransitionPreset {
  id: TransitionType;
  name: string;
  description: string;
  duration: number;
  defaultDuration?: number;
  icon: string;
  direction?: 'left' | 'right' | 'up' | 'down';
  intensity?: number;
}

/**
 * Standard transition presets with recommended duration and metadata
 */
export const TRANSITION_PRESETS: TransitionPreset[] = [
  {
    id: 'whipPan',
    name: 'Whip Pan',
    description: 'High-speed directional motion blur streak and camera whip',
    duration: 0.5,
    defaultDuration: 0.5,
    icon: 'MoveRight',
    direction: 'right',
    intensity: 1.0,
  },
  {
    id: 'crashZoom',
    name: 'Crash Zoom',
    description: 'Rapid snap punch-in / snap-out with radial warp rays and shockwaves',
    duration: 0.45,
    icon: 'ZoomIn',
    intensity: 1.0,
  },
  {
    id: 'lightLeakFlash',
    name: 'Light Leak Flash',
    description: 'Blinding warm optical light leak flare dissolve and anamorphic bloom',
    duration: 0.6,
    icon: 'Sun',
    intensity: 1.0,
  },
  {
    id: 'rgbGlitch',
    name: 'RGB Glitch',
    description: 'Cyberpunk chromatic channel split with horizontal scanline block slicing',
    duration: 0.4,
    icon: 'Tv',
    intensity: 1.0,
  },
  {
    id: 'filmBurn',
    name: 'Film Burn',
    description: 'Organic 35mm Kodak celluloid film gate burn, grain pulse, and scratches',
    duration: 0.65,
    icon: 'Flame',
    intensity: 1.0,
  },
  {
    id: 'vortexSwirl',
    name: 'Vortex Swirl',
    description: 'Rotational spiral swirl warp distortion centered on frame',
    duration: 0.55,
    icon: 'RotateCw',
    intensity: 1.0,
  },
  {
    id: 'directionalPush',
    name: 'Directional Push',
    description: 'Cinematic directional slide transition with trailing velocity glow',
    duration: 0.45,
    icon: 'ArrowRightLeft',
    direction: 'left',
    intensity: 1.0,
  },
];

/**
 * Fast deterministic pseudo-random generator seeded by floating point numbers
 */
function pseudoRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453123;
  return x - Math.floor(x);
}

/**
 * 1. Whip Pan: High-speed horizontal or vertical directional motion blur streak transition
 */
export function drawWhipPan(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
  transition: TransitionItem
): void {
  const intensity = Math.max(0, Math.min(1, transition.intensity ?? 1.0));
  if (intensity <= 0) return;

  const bell = Math.sin(progress * Math.PI) * intensity;
  if (bell <= 0.001) return;

  const direction = transition.direction || 'right';
  const isHorizontal = direction === 'left' || direction === 'right';
  const dirSign = direction === 'right' || direction === 'down' ? 1 : -1;

  ctx.save();

  // 1. Directional Smear / Shutter Blur Bands
  ctx.globalCompositeOperation = 'screen';
  const bandCount = 18;
  for (let i = 0; i < bandCount; i++) {
    const seed = i * 17.3 + Math.floor(progress * 24);
    const rnd = pseudoRandom(seed);
    const bandAlpha = bell * (0.15 + rnd * 0.35);

    if (isHorizontal) {
      const y = (i / bandCount) * height + (rnd - 0.5) * (height / bandCount);
      const bandHeight = (height / bandCount) * (1.2 + rnd * 1.5);

      const grad = ctx.createLinearGradient(0, y, width, y);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      grad.addColorStop(
        Math.max(0, Math.min(1, 0.5 + dirSign * 0.3 * (progress - 0.5))),
        i % 2 === 0 ? `rgba(56, 189, 248, ${bandAlpha})` : `rgba(245, 158, 11, ${bandAlpha})`
      );
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = grad;
      ctx.fillRect(0, y - bandHeight / 2, width, bandHeight);
    } else {
      const x = (i / bandCount) * width + (rnd - 0.5) * (width / bandCount);
      const bandWidth = (width / bandCount) * (1.2 + rnd * 1.5);

      const grad = ctx.createLinearGradient(x, 0, x, height);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      grad.addColorStop(
        Math.max(0, Math.min(1, 0.5 + dirSign * 0.3 * (progress - 0.5))),
        i % 2 === 0 ? `rgba(56, 189, 248, ${bandAlpha})` : `rgba(245, 158, 11, ${bandAlpha})`
      );
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = grad;
      ctx.fillRect(x - bandWidth / 2, 0, bandWidth, height);
    }
  }

  // 2. High-speed Motion Streaks (Shutter drag speed lines)
  const streakCount = 32;
  ctx.lineWidth = 2.5;
  for (let i = 0; i < streakCount; i++) {
    const seed = i * 41.7 + Math.floor(progress * 30);
    const r1 = pseudoRandom(seed);
    const r2 = pseudoRandom(seed + 1);
    const r3 = pseudoRandom(seed + 2);

    const streakAlpha = bell * (0.3 + r3 * 0.7);
    ctx.globalAlpha = Math.min(1, streakAlpha);
    ctx.strokeStyle = i % 3 === 0 ? '#FFFFFF' : i % 3 === 1 ? '#38BDF8' : '#F59E0B';

    if (isHorizontal) {
      const y = r1 * height;
      const length = width * (0.3 + r2 * 0.7) * bell;
      const startX = dirSign > 0 ? r2 * width * 0.5 : width - r2 * width * 0.5 - length;

      ctx.beginPath();
      ctx.moveTo(startX, y);
      ctx.lineTo(startX + dirSign * length, y);
      ctx.stroke();
    } else {
      const x = r1 * width;
      const length = height * (0.3 + r2 * 0.7) * bell;
      const startY = dirSign > 0 ? r2 * height * 0.5 : height - r2 * height * 0.5 - length;

      ctx.beginPath();
      ctx.moveTo(x, startY);
      ctx.lineTo(x, startY + dirSign * length);
      ctx.stroke();
    }
  }

  // 3. Chromatic RGB Offset Streaks along Motion Axis
  const chromaticShift = bell * 45 * intensity;
  if (chromaticShift > 1) {
    ctx.globalCompositeOperation = 'screen';
    ctx.globalAlpha = bell * 0.45;

    // Red fringe
    ctx.fillStyle = '#FF0055';
    if (isHorizontal) {
      ctx.fillRect(dirSign * chromaticShift, 0, width, height);
    } else {
      ctx.fillRect(0, dirSign * chromaticShift, width, height);
    }

    // Cyan fringe
    ctx.fillStyle = '#00FFFF';
    if (isHorizontal) {
      ctx.fillRect(-dirSign * chromaticShift, 0, width, height);
    } else {
      ctx.fillRect(0, -dirSign * chromaticShift, width, height);
    }
  }

  // 4. Directional Luminance Punch / Center Flash at Apex
  const apexFlash = Math.pow(bell, 3) * 0.45;
  if (apexFlash > 0.01) {
    ctx.globalCompositeOperation = 'screen';
    ctx.globalAlpha = apexFlash;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);
  }

  // 5. Directional Vignette / Shutter Inertia Shadow
  ctx.globalCompositeOperation = 'multiply';
  ctx.globalAlpha = bell * 0.4;
  const shadowGrad = isHorizontal
    ? ctx.createLinearGradient(0, 0, width, 0)
    : ctx.createLinearGradient(0, 0, 0, height);

  if (dirSign > 0) {
    shadowGrad.addColorStop(0, 'rgba(0,0,0,0.8)');
    shadowGrad.addColorStop(0.5, 'rgba(0,0,0,0)');
    shadowGrad.addColorStop(1, 'rgba(0,0,0,0.4)');
  } else {
    shadowGrad.addColorStop(0, 'rgba(0,0,0,0.4)');
    shadowGrad.addColorStop(0.5, 'rgba(0,0,0,0)');
    shadowGrad.addColorStop(1, 'rgba(0,0,0,0.8)');
  }
  ctx.fillStyle = shadowGrad;
  ctx.fillRect(0, 0, width, height);

  ctx.restore();
}

/**
 * 2. Crash Zoom: Rapid snap zoom-in / punch-out with radial motion blur streaks
 */
export function drawCrashZoom(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
  transition: TransitionItem
): void {
  const intensity = Math.max(0, Math.min(1, transition.intensity ?? 1.0));
  if (intensity <= 0) return;

  const bell = Math.sin(progress * Math.PI) * intensity;
  if (bell <= 0.001) return;

  const cx = width / 2;
  const cy = height / 2;
  const maxR = Math.hypot(width, height) / 2;

  ctx.save();

  // 1. Radial Motion Blur Streak Rays (Zoom Warp Streaks)
  ctx.globalCompositeOperation = 'screen';
  const rayCount = 44;
  const rayRotation = progress * 0.5;

  for (let i = 0; i < rayCount; i++) {
    const angle = (i / rayCount) * Math.PI * 2 + rayRotation;
    const seed = i * 23.1;
    const rndLength = 0.5 + pseudoRandom(seed) * 0.5;
    const rndWidth = 0.02 + pseudoRandom(seed + 1) * 0.04;
    const rayAlpha = bell * (0.2 + pseudoRandom(seed + 2) * 0.5);

    const rOuter = maxR * rndLength * (0.6 + bell * 0.7);
    const rInner = maxR * 0.08 * (1 - bell * 0.5);

    const x1 = cx + Math.cos(angle - rndWidth) * rInner;
    const y1 = cy + Math.sin(angle - rndWidth) * rInner;
    const x2 = cx + Math.cos(angle + rndWidth) * rInner;
    const y2 = cy + Math.sin(angle + rndWidth) * rInner;
    const x3 = cx + Math.cos(angle + rndWidth * 1.5) * rOuter;
    const y3 = cy + Math.sin(angle + rndWidth * 1.5) * rOuter;
    const x4 = cx + Math.cos(angle - rndWidth * 1.5) * rOuter;
    const y4 = cy + Math.sin(angle - rndWidth * 1.5) * rOuter;

    const rayGrad = ctx.createRadialGradient(cx, cy, rInner, cx, cy, rOuter);
    rayGrad.addColorStop(0, `rgba(255, 255, 255, ${rayAlpha * 0.2})`);
    rayGrad.addColorStop(0.3, i % 2 === 0 ? `rgba(56, 189, 248, ${rayAlpha})` : `rgba(245, 158, 11, ${rayAlpha})`);
    rayGrad.addColorStop(0.8, `rgba(255, 255, 255, ${rayAlpha * 0.8})`);
    rayGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = rayGrad;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.lineTo(x4, y4);
    ctx.closePath();
    ctx.fill();
  }

  // 2. Expanding Concentric Shockwave Wavefront Rings
  const waveCount = 3;
  for (let w = 0; w < waveCount; w++) {
    const waveProgress = (progress * 1.6 + w * 0.33) % 1;
    const waveRadius = waveProgress * maxR * 1.1;
    const waveAlpha = Math.sin(waveProgress * Math.PI) * bell * 0.65;

    ctx.lineWidth = 3 + waveProgress * 8;
    ctx.strokeStyle = w % 2 === 0 ? `rgba(255, 255, 255, ${waveAlpha})` : `rgba(96, 165, 250, ${waveAlpha})`;
    ctx.shadowColor = '#38BDF8';
    ctx.shadowBlur = 16 * bell;

    ctx.beginPath();
    ctx.arc(cx, cy, waveRadius, 0, Math.PI * 2);
    ctx.stroke();
  }

  // 3. Central Blinding Optical Bloom Core
  const bloomRadius = maxR * (0.15 + 0.55 * bell);
  const bloomGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, bloomRadius);
  bloomGrad.addColorStop(0, `rgba(255, 255, 255, ${bell * 0.95})`);
  bloomGrad.addColorStop(0.35, `rgba(254, 240, 138, ${bell * 0.75})`);
  bloomGrad.addColorStop(0.7, `rgba(56, 189, 248, ${bell * 0.35})`);
  bloomGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = bloomGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, bloomRadius, 0, Math.PI * 2);
  ctx.fill();

  // 4. Radial Vignette / Warp Tunnel Shadow on Periphery
  ctx.globalCompositeOperation = 'multiply';
  ctx.globalAlpha = bell * 0.65;
  const tunnelGrad = ctx.createRadialGradient(cx, cy, maxR * 0.2, cx, cy, maxR);
  tunnelGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
  tunnelGrad.addColorStop(0.6, 'rgba(0, 0, 0, 0.3)');
  tunnelGrad.addColorStop(1, 'rgba(0, 0, 0, 0.9)');

  ctx.fillStyle = tunnelGrad;
  ctx.fillRect(0, 0, width, height);

  ctx.restore();
}

/**
 * 3. Light Leak Flash: Blinding warm optical light leak flare dissolve
 */
export function drawLightLeakFlash(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
  transition: TransitionItem
): void {
  const intensity = Math.max(0, Math.min(1, transition.intensity ?? 1.0));
  if (intensity <= 0) return;

  const bell = Math.sin(progress * Math.PI) * intensity;
  if (bell <= 0.001) return;

  ctx.save();
  ctx.globalCompositeOperation = 'screen';

  // 1. Sweeping Diagonal Anamorphic Optical Beam
  const beamAngle = -0.6; // ~-35 degrees
  const sweepProgress = progress; // 0 to 1
  const beamCenterX = width * (sweepProgress * 1.4 - 0.2);
  const beamCenterY = height * (sweepProgress * 1.4 - 0.2);
  const beamWidth = width * (0.8 + 0.6 * bell);

  ctx.save();
  ctx.translate(beamCenterX, beamCenterY);
  ctx.rotate(beamAngle);

  const beamGrad = ctx.createLinearGradient(-beamWidth / 2, 0, beamWidth / 2, 0);
  beamGrad.addColorStop(0, 'rgba(255, 107, 0, 0)');
  beamGrad.addColorStop(0.2, `rgba(255, 45, 85, ${bell * 0.4})`);
  beamGrad.addColorStop(0.4, `rgba(255, 140, 0, ${bell * 0.8})`);
  beamGrad.addColorStop(0.5, `rgba(255, 255, 255, ${bell * 0.95})`);
  beamGrad.addColorStop(0.6, `rgba(254, 225, 64, ${bell * 0.8})`);
  beamGrad.addColorStop(0.8, `rgba(255, 0, 122, ${bell * 0.4})`);
  beamGrad.addColorStop(1, 'rgba(255, 107, 0, 0)');

  ctx.fillStyle = beamGrad;
  ctx.fillRect(-beamWidth / 2, -height * 1.5, beamWidth, height * 3);
  ctx.restore();

  // 2. Organic Light Leak Plasma Blobs (Kodak 500T 35mm optical lobes)
  const blobs = [
    {
      x: width * (0.2 + progress * 0.5),
      y: height * (0.15 + Math.sin(progress * 4) * 0.15),
      radius: width * (0.4 + 0.3 * bell),
      c1: '#FF7B00',
      c2: '#E11D48',
      alpha: bell * 0.85,
    },
    {
      x: width * (0.85 - progress * 0.4),
      y: height * (0.8 - Math.cos(progress * 3) * 0.2),
      radius: width * (0.45 + 0.35 * bell),
      c1: '#FF4500',
      c2: '#F59E0B',
      alpha: bell * 0.8,
    },
    {
      x: width * (0.5 + Math.sin(progress * 6) * 0.2),
      y: height * (0.5 + Math.cos(progress * 5) * 0.15),
      radius: width * (0.35 + 0.45 * bell),
      c1: '#FFFFFF',
      c2: '#F43F5E',
      alpha: bell * 0.9,
    },
    {
      x: width * (0.1 + progress * 0.7),
      y: height * (0.9 - progress * 0.5),
      radius: width * (0.3 + 0.25 * bell),
      c1: '#FDE047',
      c2: '#EA580C',
      alpha: bell * 0.7,
    },
  ];

  for (const b of blobs) {
    const radGrad = ctx.createRadialGradient(b.x, b.y, 10, b.x, b.y, b.radius);
    radGrad.addColorStop(0, b.c1);
    radGrad.addColorStop(0.35, b.c2);
    radGrad.addColorStop(0.7, `${b.c1}33`);
    radGrad.addColorStop(1, 'rgba(0,0,0,0)');

    ctx.globalAlpha = Math.min(1, b.alpha);
    ctx.fillStyle = radGrad;
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // 3. Floating Optical Bokeh Dust Motes
  const particleCount = 28;
  for (let i = 0; i < particleCount; i++) {
    const seed = i * 37.1;
    const px = (pseudoRandom(seed) * width + progress * 150 * pseudoRandom(seed + 1)) % width;
    const py = (pseudoRandom(seed + 2) * height + Math.sin(progress * 5 + i) * 30) % height;
    const pSize = 4 + pseudoRandom(seed + 3) * 18;
    const pAlpha = bell * (0.2 + pseudoRandom(seed + 4) * 0.6);

    ctx.globalAlpha = Math.min(1, pAlpha);
    ctx.fillStyle = i % 2 === 0 ? '#FFFFFF' : '#FDE047';
    ctx.beginPath();
    ctx.arc(px, py, pSize, 0, Math.PI * 2);
    ctx.fill();
  }

  // 4. Overexposure Apex Whiteout Dissolve
  const apexGlow = Math.pow(bell, 2.5) * 0.85;
  if (apexGlow > 0.01) {
    ctx.globalAlpha = apexGlow;
    ctx.fillStyle = '#FFF7ED';
    ctx.fillRect(0, 0, width, height);
  }

  ctx.restore();
}

/**
 * 4. RGB Glitch: Chromatic RGB channel displacement with horizontal scanline slicing
 */
export function drawRgbGlitch(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
  transition: TransitionItem
): void {
  const intensity = Math.max(0, Math.min(1, transition.intensity ?? 1.0));
  if (intensity <= 0) return;

  const bell = Math.sin(progress * Math.PI) * intensity;
  if (bell <= 0.001) return;

  ctx.save();

  const sliceCount = 18;
  const sliceHeight = height / sliceCount;

  // 1. Horizontal Slicing & Chromatic Channel Displacement
  ctx.globalCompositeOperation = 'screen';

  for (let i = 0; i < sliceCount; i++) {
    const seed = i * 47.9 + Math.floor(progress * 40);
    const rnd = pseudoRandom(seed);
    if (rnd < 0.25) continue; // Some slices stay undisplaced for visual rhythm

    const y = i * sliceHeight;
    const h = sliceHeight * (0.8 + rnd * 0.4);
    const maxDisplace = width * 0.08 * bell;
    const shiftX = (pseudoRandom(seed + 1) - 0.5) * 2 * maxDisplace;

    const sliceAlpha = bell * (0.35 + rnd * 0.55);

    // Red Channel Slice Shift
    ctx.globalAlpha = sliceAlpha;
    ctx.fillStyle = '#FF0055';
    ctx.fillRect(shiftX * 1.2, y, width, h);

    // Cyan Channel Slice Shift (Opposite Direction)
    ctx.fillStyle = '#00FFFF';
    ctx.fillRect(-shiftX * 1.2, y, width, h);

    // Green / Yellow accent highlights
    if (rnd > 0.7) {
      ctx.fillStyle = '#FFFF00';
      ctx.globalAlpha = sliceAlpha * 0.5;
      ctx.fillRect(shiftX * 0.5, y + h * 0.2, width, h * 0.3);
    }
  }

  // 2. High-Tech Glitch Matrix Artifact Blocks
  const blockCount = Math.floor(16 * bell);
  for (let b = 0; b < blockCount; b++) {
    const bSeed = b * 61.3 + Math.floor(progress * 50);
    const bx = pseudoRandom(bSeed) * width;
    const by = pseudoRandom(bSeed + 1) * height;
    const bw = (20 + pseudoRandom(bSeed + 2) * 120) * bell;
    const bh = 4 + pseudoRandom(bSeed + 3) * 18;
    const bAlpha = bell * (0.4 + pseudoRandom(bSeed + 4) * 0.6);

    const colors = ['#00FFCC', '#FF007F', '#7000FF', '#FFFFFF', '#FFE600'];
    ctx.fillStyle = colors[Math.floor(pseudoRandom(bSeed + 5) * colors.length)];
    ctx.globalAlpha = bAlpha;
    ctx.fillRect(bx, by, bw, bh);
  }

  // 3. CRT / VHS Horizontal Scanline Matrix
  ctx.globalCompositeOperation = 'source-over';
  ctx.lineWidth = 1;
  ctx.strokeStyle = `rgba(0, 0, 0, ${0.45 * bell})`;
  const scanlineSpacing = 4;
  ctx.beginPath();
  for (let y = 0; y < height; y += scanlineSpacing) {
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
  }
  ctx.stroke();

  // 4. Rolling VHS Sync Drift Bar
  const syncY = (progress * 1.8 * height) % height;
  const syncH = height * 0.12;
  const syncGrad = ctx.createLinearGradient(0, syncY - syncH / 2, 0, syncY + syncH / 2);
  syncGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
  syncGrad.addColorStop(0.5, `rgba(255, 255, 255, ${0.35 * bell})`);
  syncGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

  ctx.globalCompositeOperation = 'screen';
  ctx.fillStyle = syncGrad;
  ctx.fillRect(0, syncY - syncH / 2, width, syncH);

  ctx.restore();
}

/**
 * 5. Film Burn: Organic orange/red film gate burn and grain pulse
 */
export function drawFilmBurn(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
  transition: TransitionItem
): void {
  const intensity = Math.max(0, Math.min(1, transition.intensity ?? 1.0));
  if (intensity <= 0) return;

  const bell = Math.sin(progress * Math.PI) * intensity;
  if (bell <= 0.001) return;

  ctx.save();

  // 1. Warm Sepia / Fiery Amber Overall Color Wash
  ctx.globalCompositeOperation = 'screen';
  ctx.globalAlpha = bell * 0.45;
  ctx.fillStyle = '#EA580C';
  ctx.fillRect(0, 0, width, height);

  // 2. Burning Celluloid Holes (Gate Burn Creep)
  const burnHoles = [
    {
      x: width * 0.15 + Math.sin(progress * 3) * width * 0.1,
      y: height * 0.2 + Math.cos(progress * 2) * height * 0.1,
      r: width * (0.2 + bell * 0.4),
    },
    {
      x: width * 0.85 - Math.cos(progress * 4) * width * 0.1,
      y: height * 0.75 - Math.sin(progress * 3) * height * 0.1,
      r: width * (0.25 + bell * 0.45),
    },
    {
      x: width * 0.5,
      y: height * 0.5,
      r: width * (0.15 + Math.pow(bell, 2) * 0.5),
    },
  ];

  for (const h of burnHoles) {
    const burnGrad = ctx.createRadialGradient(h.x, h.y, 5, h.x, h.y, h.r);
    burnGrad.addColorStop(0, `rgba(255, 255, 255, ${bell * 0.98})`); // Molten white center
    burnGrad.addColorStop(0.25, `rgba(254, 240, 138, ${bell * 0.9})`); // Bright yellow
    burnGrad.addColorStop(0.5, `rgba(249, 115, 22, ${bell * 0.85})`); // Fiery orange
    burnGrad.addColorStop(0.75, `rgba(185, 28, 28, ${bell * 0.75})`); // Charred crimson
    burnGrad.addColorStop(0.9, `rgba(69, 10, 10, ${bell * 0.6})`); // Scorched brown
    burnGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = burnGrad;
    ctx.beginPath();
    ctx.arc(h.x, h.y, h.r, 0, Math.PI * 2);
    ctx.fill();
  }

  // 3. Vertical Film Scratches & Projector Hair Artifacts
  ctx.globalCompositeOperation = 'screen';
  const scratchCount = 8;
  for (let s = 0; s < scratchCount; s++) {
    const seed = s * 73.1 + Math.floor(progress * 24);
    const sx = pseudoRandom(seed) * width;
    const scratchAlpha = bell * (0.2 + pseudoRandom(seed + 1) * 0.6);
    const tilt = (pseudoRandom(seed + 2) - 0.5) * 12;

    ctx.lineWidth = 1 + pseudoRandom(seed + 3) * 1.5;
    ctx.strokeStyle = s % 2 === 0 ? `rgba(255, 255, 255, ${scratchAlpha})` : `rgba(254, 202, 202, ${scratchAlpha})`;

    ctx.beginPath();
    ctx.moveTo(sx, 0);
    ctx.lineTo(sx + tilt, height);
    ctx.stroke();
  }

  // 4. Coarse 35mm Celluloid Film Grain Pulse
  const grainSeed = Math.floor(progress * 18);
  const grainCount = 120;
  for (let g = 0; g < grainCount; g++) {
    const seed = g * 19.7 + grainSeed * 100;
    const gx = pseudoRandom(seed) * width;
    const gy = pseudoRandom(seed + 1) * height;
    const gSize = 1.5 + pseudoRandom(seed + 2) * 3;
    const gAlpha = bell * (0.15 + pseudoRandom(seed + 3) * 0.45);

    ctx.fillStyle = pseudoRandom(seed + 4) > 0.5 ? `rgba(255, 255, 255, ${gAlpha})` : `rgba(0, 0, 0, ${gAlpha * 0.8})`;
    ctx.fillRect(gx, gy, gSize, gSize);
  }

  // 5. White Hot Film Gate Melt Burnout
  const burnout = Math.pow(bell, 3) * 0.9;
  if (burnout > 0.01) {
    ctx.globalCompositeOperation = 'screen';
    ctx.globalAlpha = burnout;
    ctx.fillStyle = '#FFFBEB';
    ctx.fillRect(0, 0, width, height);
  }

  ctx.restore();
}

/**
 * 6. Vortex Swirl: Rotational swirl distortion centered on screen
 */
export function drawVortexSwirl(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
  transition: TransitionItem
): void {
  const intensity = Math.max(0, Math.min(1, transition.intensity ?? 1.0));
  if (intensity <= 0) return;

  const bell = Math.sin(progress * Math.PI) * intensity;
  if (bell <= 0.001) return;

  const cx = width / 2;
  const cy = height / 2;
  const maxR = Math.hypot(width, height) / 2;

  ctx.save();
  ctx.globalCompositeOperation = 'screen';

  // 1. Multi-Arm Logarithmic Spiral Vortex Arms
  const armCount = 10;
  const baseRotation = progress * Math.PI * 4;

  for (let a = 0; a < armCount; a++) {
    const armOffset = (a / armCount) * Math.PI * 2;
    const armAlpha = bell * 0.6;

    ctx.beginPath();
    const steps = 36;
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      const r = t * maxR * 1.1;
      const swirlTwist = Math.pow(t, 0.7) * (Math.PI * 3.5 * bell);
      const theta = baseRotation + armOffset + swirlTwist;

      const px = cx + Math.cos(theta) * r;
      const py = cy + Math.sin(theta) * r;

      if (s === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }

    ctx.lineWidth = (2 + (a % 3) * 3) * bell;
    ctx.strokeStyle =
      a % 3 === 0
        ? `rgba(56, 189, 248, ${armAlpha})`
        : a % 3 === 1
        ? `rgba(236, 72, 153, ${armAlpha})`
        : `rgba(250, 204, 21, ${armAlpha})`;
    ctx.shadowColor = a % 3 === 0 ? '#38BDF8' : '#EC4899';
    ctx.shadowBlur = 12 * bell;
    ctx.stroke();
  }

  // 2. Swirling Orbital Stardust Particles
  const particleCount = 40;
  for (let p = 0; p < particleCount; p++) {
    const seed = p * 29.3;
    const normDist = (pseudoRandom(seed) + progress * 0.8) % 1;
    const r = normDist * maxR;
    const angle = pseudoRandom(seed + 1) * Math.PI * 2 + baseRotation + Math.pow(normDist, 0.6) * 5 * bell;
    const pSize = (2 + pseudoRandom(seed + 2) * 5) * bell;
    const pAlpha = bell * (0.3 + pseudoRandom(seed + 3) * 0.7);

    const px = cx + Math.cos(angle) * r;
    const py = cy + Math.sin(angle) * r;

    ctx.globalAlpha = Math.min(1, pAlpha);
    ctx.fillStyle = p % 2 === 0 ? '#FFFFFF' : '#38BDF8';
    ctx.beginPath();
    ctx.arc(px, py, pSize, 0, Math.PI * 2);
    ctx.fill();
  }

  // 3. Central Singularity / Event Horizon Core
  const coreRadius = maxR * (0.1 + 0.3 * bell);
  const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreRadius);
  coreGrad.addColorStop(0, `rgba(255, 255, 255, ${bell * 0.95})`);
  coreGrad.addColorStop(0.4, `rgba(168, 85, 247, ${bell * 0.8})`);
  coreGrad.addColorStop(0.8, `rgba(56, 189, 248, ${bell * 0.4})`);
  coreGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = coreGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, coreRadius, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * 7. Directional Push: Smooth directional push/slide transition with glow edge & motion blur ribbon
 */
export function drawDirectionalPush(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
  transition: TransitionItem
): void {
  const intensity = Math.max(0, Math.min(1, transition.intensity ?? 1.0));
  if (intensity <= 0) return;

  const bell = Math.sin(progress * Math.PI) * intensity;
  if (bell <= 0.001) return;

  const direction = transition.direction || 'left';
  const isHorizontal = direction === 'left' || direction === 'right';

  // Smooth ease-in-out curve for position
  const eased = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;

  ctx.save();

  // Calculate divider boundary position
  let boundaryPos = 0;
  if (direction === 'left') {
    boundaryPos = (1 - eased) * width;
  } else if (direction === 'right') {
    boundaryPos = eased * width;
  } else if (direction === 'up') {
    boundaryPos = (1 - eased) * height;
  } else {
    boundaryPos = eased * height;
  }

  // 1. Motion Blur Trailing Ribbon
  ctx.globalCompositeOperation = 'screen';
  const trailWidth = (isHorizontal ? width : height) * 0.35 * bell;

  if (isHorizontal) {
    const trailStart = direction === 'right' ? boundaryPos - trailWidth : boundaryPos;
    const trailGrad = ctx.createLinearGradient(
      direction === 'right' ? boundaryPos - trailWidth : boundaryPos,
      0,
      direction === 'right' ? boundaryPos : boundaryPos + trailWidth,
      0
    );
    trailGrad.addColorStop(direction === 'right' ? 0 : 1, 'rgba(56, 189, 248, 0)');
    trailGrad.addColorStop(direction === 'right' ? 1 : 0, `rgba(56, 189, 248, ${0.6 * bell})`);

    ctx.fillStyle = trailGrad;
    ctx.fillRect(trailStart, 0, trailWidth, height);
  } else {
    const trailStart = direction === 'down' ? boundaryPos - trailWidth : boundaryPos;
    const trailGrad = ctx.createLinearGradient(
      0,
      direction === 'down' ? boundaryPos - trailWidth : boundaryPos,
      0,
      direction === 'down' ? boundaryPos : boundaryPos + trailWidth
    );
    trailGrad.addColorStop(direction === 'down' ? 0 : 1, 'rgba(56, 189, 248, 0)');
    trailGrad.addColorStop(direction === 'down' ? 1 : 0, `rgba(56, 189, 248, ${0.6 * bell})`);

    ctx.fillStyle = trailGrad;
    ctx.fillRect(0, trailStart, width, trailWidth);
  }

  // 2. Leading Edge Laser Divider Line
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#FFFFFF';
  ctx.shadowColor = '#38BDF8';
  ctx.shadowBlur = 20 * bell;
  ctx.globalAlpha = Math.min(1, bell * 1.2);

  ctx.beginPath();
  if (isHorizontal) {
    ctx.moveTo(boundaryPos, 0);
    ctx.lineTo(boundaryPos, height);
  } else {
    ctx.moveTo(0, boundaryPos);
    ctx.lineTo(width, boundaryPos);
  }
  ctx.stroke();

  // 3. Chromatic RGB Edge Split along Boundary
  const chromaticOffset = 8 * bell;
  ctx.lineWidth = 2;
  ctx.globalAlpha = bell * 0.7;

  // Red offset edge
  ctx.strokeStyle = '#FF0055';
  ctx.beginPath();
  if (isHorizontal) {
    ctx.moveTo(boundaryPos - chromaticOffset, 0);
    ctx.lineTo(boundaryPos - chromaticOffset, height);
  } else {
    ctx.moveTo(0, boundaryPos - chromaticOffset);
    ctx.lineTo(width, boundaryPos - chromaticOffset);
  }
  ctx.stroke();

  // Cyan offset edge
  ctx.strokeStyle = '#00FFFF';
  ctx.beginPath();
  if (isHorizontal) {
    ctx.moveTo(boundaryPos + chromaticOffset, 0);
    ctx.lineTo(boundaryPos + chromaticOffset, height);
  } else {
    ctx.moveTo(0, boundaryPos + chromaticOffset);
    ctx.lineTo(width, boundaryPos + chromaticOffset);
  }
  ctx.stroke();

  ctx.restore();
}

/**
 * Returns all active transitions occurring at the given timestamp.
 */
export function getActiveTransitions(
  sourceTime: number,
  transitions?: TransitionItem[]
): TransitionItem[] {
  if (!transitions || transitions.length === 0) return [];
  return transitions.filter(
    (t) => sourceTime >= t.startTime && sourceTime <= t.startTime + t.duration && t.duration > 0
  );
}

/**
 * Calculates the 0..1 normalized animation progress for a transition at the given timestamp.
 */
export function getTransitionProgress(sourceTime: number, transition: TransitionItem): number {
  const duration = Math.max(0.001, transition.duration);
  return Math.max(0, Math.min(1, (sourceTime - transition.startTime) / duration));
}

/**
 * Factory helper to construct a TransitionItem with sensible defaults
 */
export function createTransitionItem(
  type: TransitionType,
  startTime: number,
  duration?: number,
  options?: Partial<TransitionItem>
): TransitionItem {
  const preset = TRANSITION_PRESETS.find((p) => p.id === type);
  return {
    id: options?.id || `tr-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    type,
    startTime,
    duration: duration ?? preset?.duration ?? 0.5,
    direction: options?.direction ?? preset?.direction,
    intensity: options?.intensity ?? preset?.intensity ?? 1.0,
    ...options,
  };
}

/**
 * Master dispatcher for drawing all active video transition effects.
 *
 * @param ctx HTML5 2D Canvas rendering context
 * @param width Canvas width in pixels
 * @param height Canvas height in pixels
 * @param sourceTime Current playback/timeline time in seconds
 * @param transitions Array of configured TransitionItems
 */
export function drawTransitionEffect(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  sourceTime: number,
  transitions?: TransitionItem[]
): void {
  if (!transitions || transitions.length === 0) return;

  for (const transition of transitions) {
    if (sourceTime < transition.startTime || sourceTime > transition.startTime + transition.duration) {
      continue;
    }

    const duration = Math.max(0.001, transition.duration);
    const progress = Math.max(0, Math.min(1, (sourceTime - transition.startTime) / duration));

    switch (transition.type) {
      case 'whipPan':
        drawWhipPan(ctx, width, height, progress, transition);
        break;
      case 'crashZoom':
        drawCrashZoom(ctx, width, height, progress, transition);
        break;
      case 'lightLeakFlash':
        drawLightLeakFlash(ctx, width, height, progress, transition);
        break;
      case 'rgbGlitch':
        drawRgbGlitch(ctx, width, height, progress, transition);
        break;
      case 'filmBurn':
        drawFilmBurn(ctx, width, height, progress, transition);
        break;
      case 'vortexSwirl':
        drawVortexSwirl(ctx, width, height, progress, transition);
        break;
      case 'directionalPush':
        drawDirectionalPush(ctx, width, height, progress, transition);
        break;
      default:
        break;
    }
  }
}
