/**
 * Vintage & Distortion Visual Effects Service
 *
 * Real-time Canvas2D rendering routines for authentic retro and optical effects:
 * 1. drawVHSTapeGlitch: VCR tracking noise bar, retro OSD text, chromatic aberration, micro-jitter
 * 2. drawVintage8mmFilm: Sepia monochrome grade, 18fps film hair scratches & dust, gate flicker
 * 3. drawPrismRefraction: Triple-offset rainbow refraction facet borders along screen edges
 */

export interface VHSGlitchOptions {
  osdText?: string;
  channel?: string;
  speedMode?: 'SP' | 'LP' | 'EP';
  showTrackingBar?: boolean;
  showOSD?: boolean;
  showScanlines?: boolean;
  showHeadSwitching?: boolean;
}

export interface Vintage8mmOptions {
  tintColor?: string;
  grainDensity?: number;
  dustCount?: number;
  scratchCount?: number;
  flickerIntensity?: number;
  gateWobble?: boolean;
  roundedCorners?: boolean;
}

export interface PrismRefractionOptions {
  facetWidth?: number;
  dispersionSpread?: number;
  shimmerSpeed?: number;
  showCornerCaustics?: boolean;
  showFacetLines?: boolean;
}

/**
 * Fast deterministic pseudo-random number generator for seeded frame noise.
 */
function pseudoRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * Formats time in seconds into retro VCR timecode (HH:MM:SS)
 */
function formatVCRTimecode(timeSec: number): string {
  const totalSec = Math.max(0, Math.floor(timeSec));
  const hrs = Math.floor(totalSec / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;

  const pad = (n: number) => (n < 10 ? '0' + n : String(n));
  return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
}

/**
 * 1. VHS Tape Glitch Effect
 *
 * Renders authentic analog VHS tape artifacts:
 * - VCR tracking noise bar creeping vertically up the frame
 * - Retro OSD text ('PLAY ▶ 00:12:45', 'SP', 'CH 03') with vintage phosphor glow
 * - Chromatic channel separation (RGB color fringing) and horizontal micro-jitter
 * - Bottom head-switching noise band
 *
 * @param ctx CanvasRenderingContext2D
 * @param width Canvas width in pixels
 * @param height Canvas height in pixels
 * @param time Current timestamp in seconds
 * @param intensity Effect intensity (0.0 to 1.0, default 0.5)
 * @param options Optional customizable VHS glitch options
 */
export function drawVHSTapeGlitch(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  intensity: number = 0.5,
  options?: VHSGlitchOptions | boolean
): void {
  if (width <= 0 || height <= 0 || intensity <= 0) return;

  const clampedIntensity = Math.max(0, Math.min(1, intensity));
  const opts = typeof options === 'boolean' ? { showOSD: options } : options;
  const showTrackingBar = opts?.showTrackingBar ?? true;
  const showOSD = opts?.showOSD ?? true;
  const showScanlines = opts?.showScanlines ?? true;
  const showHeadSwitching = opts?.showHeadSwitching ?? true;

  ctx.save();

  // --------------------------------------------------------------------------
  // A. Horizontal Micro-Jitter & Chromatic Channel Separation (RGB Split)
  // --------------------------------------------------------------------------
  const jitterFreq = time * 30; // 30fps VHS tape sync wobble
  const jitterSeed = Math.floor(jitterFreq);
  const microJitter = (pseudoRandom(jitterSeed * 17) - 0.5) * 4 * clampedIntensity;
  const chromaticShift = (2 + clampedIntensity * 6) + Math.sin(time * 8) * 1.5;

  ctx.save();
  ctx.globalCompositeOperation = 'screen';

  // Red/Magenta Channel Shift (Positive X offset)
  ctx.fillStyle = `rgba(255, 20, 80, ${0.06 * clampedIntensity})`;
  ctx.fillRect(chromaticShift + microJitter, 0, width, height);

  // Cyan/Blue Channel Shift (Negative X offset)
  ctx.fillStyle = `rgba(0, 230, 255, ${0.06 * clampedIntensity})`;
  ctx.fillRect(-chromaticShift - microJitter, 0, width, height);

  // Random scanline displacement slices (Horizontal glitch tears)
  const tearCount = Math.floor(2 + clampedIntensity * 4);
  for (let i = 0; i < tearCount; i++) {
    const tearSeed = jitterSeed + i * 99;
    const tearProb = pseudoRandom(tearSeed);
    if (tearProb > 0.4) {
      const sliceY = pseudoRandom(tearSeed + 1) * height;
      const sliceH = 2 + pseudoRandom(tearSeed + 2) * (12 * clampedIntensity);
      const sliceOffset = (pseudoRandom(tearSeed + 3) - 0.5) * (18 * clampedIntensity);

      ctx.fillStyle = `rgba(255, 255, 255, ${0.05 * clampedIntensity})`;
      ctx.fillRect(sliceOffset, sliceY, width, sliceH);

      // Chromatic tint on tear edge
      ctx.fillStyle = `rgba(255, 0, 128, ${0.08 * clampedIntensity})`;
      ctx.fillRect(sliceOffset + 3, sliceY, width, sliceH * 0.5);
    }
  }
  ctx.restore();

  // --------------------------------------------------------------------------
  // B. CRT Horizontal Scanlines & Interlacing
  // --------------------------------------------------------------------------
  if (showScanlines) {
    ctx.save();
    ctx.fillStyle = `rgba(0, 0, 0, ${0.08 * clampedIntensity})`;
    const scanlineGap = 3;
    for (let y = 0; y < height; y += scanlineGap) {
      ctx.fillRect(0, y, width, 1.2);
    }
    ctx.restore();
  }

  // --------------------------------------------------------------------------
  // C. VCR Tracking Noise Bar (Creeping vertically up the frame)
  // --------------------------------------------------------------------------
  if (showTrackingBar) {
    ctx.save();

    // The tracking bar crawls upwards cyclically over time
    const crawlSpeed = 0.12; // Cycles per second
    const trackingProgress = (time * crawlSpeed) % 1.0;
    const trackingCenterY = height * (1.0 - trackingProgress);
    const trackingBarHeight = Math.max(30, height * (0.06 + clampedIntensity * 0.05));
    const startY = trackingCenterY - trackingBarHeight / 2;

    // Tracking bar gradient distortion background
    const trackGrad = ctx.createLinearGradient(0, startY, 0, startY + trackingBarHeight);
    trackGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
    trackGrad.addColorStop(0.2, `rgba(180, 180, 200, ${0.12 * clampedIntensity})`);
    trackGrad.addColorStop(0.5, `rgba(255, 255, 255, ${0.22 * clampedIntensity})`);
    trackGrad.addColorStop(0.8, `rgba(140, 140, 180, ${0.12 * clampedIntensity})`);
    trackGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = trackGrad;
    ctx.fillRect(0, Math.max(0, startY), width, trackingBarHeight);

    // Static speckles, snow, and jagged noise strips within tracking bar
    const noiseLines = Math.floor(trackingBarHeight / 2);
    const frameSeed = Math.floor(time * 60);

    for (let j = 0; j < noiseLines; j++) {
      const lineY = startY + j * 2;
      if (lineY < 0 || lineY > height) continue;

      const lineSeed = frameSeed * 31 + j * 13;
      const segmentsInLine = 4 + Math.floor(pseudoRandom(lineSeed) * 6);

      for (let s = 0; s < segmentsInLine; s++) {
        const segSeed = lineSeed + s * 7;
        const segX = pseudoRandom(segSeed) * width;
        const segW = (0.05 + pseudoRandom(segSeed + 1) * 0.25) * width;
        const isWhite = pseudoRandom(segSeed + 2) > 0.4;
        const alpha = (0.15 + pseudoRandom(segSeed + 3) * 0.45) * clampedIntensity;

        ctx.fillStyle = isWhite ? `rgba(255, 255, 255, ${alpha})` : `rgba(10, 15, 25, ${alpha * 0.8})`;
        ctx.fillRect(segX, lineY, segW, 1.8);

        // Magnetic color snow fringes inside the bar
        if (s % 2 === 0) {
          ctx.fillStyle = `rgba(0, 255, 200, ${alpha * 0.5})`;
          ctx.fillRect(segX - 2, lineY, segW * 0.6, 1.2);
        } else {
          ctx.fillStyle = `rgba(255, 0, 160, ${alpha * 0.5})`;
          ctx.fillRect(segX + 2, lineY, segW * 0.6, 1.2);
        }
      }
    }

    // Secondary trailing glitch bar occasionally appearing
    const secondaryActive = pseudoRandom(frameSeed * 5) > 0.65;
    if (secondaryActive) {
      const secY = (startY + trackingBarHeight * 1.8) % height;
      ctx.fillStyle = `rgba(255, 255, 255, ${0.08 * clampedIntensity})`;
      ctx.fillRect(0, secY, width, 6);
    }

    ctx.restore();
  }

  // --------------------------------------------------------------------------
  // D. VCR Head-Switching Noise Band (Bottom 2% of frame)
  // --------------------------------------------------------------------------
  if (showHeadSwitching) {
    ctx.save();
    const headHeight = Math.max(12, height * 0.022);
    const headY = height - headHeight;
    const headSeed = Math.floor(time * 30);

    // Dark bottom base
    ctx.fillStyle = `rgba(5, 5, 8, ${0.5 * clampedIntensity})`;
    ctx.fillRect(0, headY, width, headHeight);

    // High frequency horizontal shift blocks
    const blockCount = 14;
    for (let b = 0; b < blockCount; b++) {
      const bSeed = headSeed + b * 23;
      const bx = (b / blockCount) * width + (pseudoRandom(bSeed) - 0.5) * 20;
      const bw = (width / blockCount) * (0.6 + pseudoRandom(bSeed + 1) * 0.8);
      const by = headY + pseudoRandom(bSeed + 2) * headHeight;
      const bh = 2 + pseudoRandom(bSeed + 3) * (headHeight * 0.6);
      const bAlpha = (0.2 + pseudoRandom(bSeed + 4) * 0.6) * clampedIntensity;

      ctx.fillStyle = pseudoRandom(bSeed + 5) > 0.5
        ? `rgba(255, 255, 255, ${bAlpha})`
        : `rgba(0, 0, 0, ${bAlpha})`;
      ctx.fillRect(bx, by, bw, bh);
    }
    ctx.restore();
  }

  // --------------------------------------------------------------------------
  // E. Retro VCR On-Screen Display (OSD) Text
  // --------------------------------------------------------------------------
  if (showOSD) {
    ctx.save();

    const scale = Math.max(0.75, Math.min(1.5, width / 960));
    const fontSize = Math.round(18 * scale);
    const osdFont = `700 ${fontSize}px "Courier New", "Consolas", monospace`;

    ctx.font = osdFont;
    ctx.textBaseline = 'top';

    const osdColor = '#22FF66'; // Authentic retro phosphor green
    const shadowColor = '#000000';
    const textPaddingX = Math.round(28 * scale);
    const textPaddingY = Math.round(24 * scale);

    // Subtle OSD text horizontal sync jitter
    const textJitterX = (pseudoRandom(Math.floor(time * 15)) - 0.5) * 1.5;
    const textJitterY = (pseudoRandom(Math.floor(time * 15) + 7) - 0.5) * 0.8;

    // Helper to draw text with authentic solid black drop shadow and soft glow
    const renderOSDText = (text: string, x: number, y: number, align: CanvasTextAlign = 'left') => {
      ctx.textAlign = align;

      const px = x + textJitterX;
      const py = y + textJitterY;

      // Solid 2px Black Shadow for high contrast legibility
      ctx.fillStyle = shadowColor;
      ctx.fillText(text, px + 2, py + 2);
      ctx.fillText(text, px + 2, py);
      ctx.fillText(text, px, py + 2);

      // Phosphor Green Glow
      ctx.shadowColor = osdColor;
      ctx.shadowBlur = 6 * scale;
      ctx.fillStyle = osdColor;
      ctx.fillText(text, px, py);

      // Crisp Center Pass
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#C8FFD8';
      ctx.fillText(text, px, py);
    };

    // 1. Top Left: PLAY ▶ 00:12:45
    const isPlayBlink = Math.floor(time * 2) % 2 === 0;
    const playSymbol = isPlayBlink ? '▶' : ' ';
    const timecode = formatVCRTimecode(time);
    const osdLeftText = opts?.osdText || `PLAY ${playSymbol} ${timecode}`;
    renderOSDText(osdLeftText, textPaddingX, textPaddingY, 'left');

    // 2. Top Right: SP (Standard Play)
    const speedMode = opts?.speedMode || 'SP';
    renderOSDText(speedMode, width - textPaddingX, textPaddingY, 'right');

    // 3. Bottom Left: CH 03 / Channel Info
    const channelText = opts?.channel || 'CH 03';
    const bottomY = height - textPaddingY - fontSize - (showHeadSwitching ? height * 0.025 : 0);
    renderOSDText(channelText, textPaddingX, bottomY, 'left');

    // 4. Bottom Right: STEREO / AUTO TRACKING
    renderOSDText('STEREO', width - textPaddingX, bottomY, 'right');

    ctx.restore();
  }

  ctx.restore();
}

/**
 * 2. Vintage 8mm Film Effect
 *
 * Renders authentic 1960s/70s 8mm & Super 8mm celluloid film aesthetics:
 * - Warm sepia / amber monochrome grading wash with optical center hotspot
 * - Film gate shutter flicker (brightness fluctuations at mechanical 18fps)
 * - Random vertical hair scratches, emulsion gouges, and dust particles flickering at 18fps
 * - Mechanical film claw registration vertical wobble
 * - Rounded camera gate aperture border vignette
 *
 * @param ctx CanvasRenderingContext2D
 * @param width Canvas width in pixels
 * @param height Canvas height in pixels
 * @param time Current timestamp in seconds
 * @param intensity Effect intensity (0.0 to 1.0, default 0.5)
 * @param options Optional customizable 8mm film options
 */
export function drawVintage8mmFilm(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  intensity: number = 0.5,
  options?: Vintage8mmOptions | boolean
): void {
  if (width <= 0 || height <= 0 || intensity <= 0) return;

  const clampedIntensity = Math.max(0, Math.min(1, intensity));
  const opts = typeof options === 'boolean' ? { dustCount: options ? 12 : 0, scratchCount: options ? 8 : 0 } : options;
  const roundedCorners = opts?.roundedCorners ?? true;
  const gateWobble = opts?.gateWobble ?? true;

  // Mechanical film projector frame rate: 18 frames per second
  const frame18 = Math.floor(time * 18);

  ctx.save();

  // --------------------------------------------------------------------------
  // A. Gate Shutter Brightness Flicker & Claw Wobble (18fps mechanical cycle)
  // --------------------------------------------------------------------------
  const flickerRaw = (pseudoRandom(frame18 * 47) - 0.5) * 0.28 * clampedIntensity;
  const lowFreqDrift = Math.sin(time * 3.2) * 0.08 * clampedIntensity;
  const netFlicker = flickerRaw + lowFreqDrift;

  // Mechanical claw vertical registration hop (±1-2px jitter at 18fps)
  const clawHop = gateWobble
    ? (pseudoRandom(frame18 * 91) - 0.5) * 2.5 * clampedIntensity
    : 0;

  if (clawHop !== 0) {
    ctx.translate(0, clawHop);
  }

  // --------------------------------------------------------------------------
  // B. Sepia & Warm Amber Monochrome Color Grading Wash
  // --------------------------------------------------------------------------
  ctx.save();
  ctx.globalCompositeOperation = 'multiply';
  ctx.fillStyle = opts?.tintColor || `rgba(185, 135, 75, ${0.35 + clampedIntensity * 0.35})`;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();

  // Warm amber highlight / Bleach bypass glow
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  ctx.fillStyle = `rgba(255, 210, 140, ${0.12 * clampedIntensity})`;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();

  // Shutter exposure flicker compensation
  if (netFlicker > 0) {
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = `rgba(255, 245, 220, ${Math.min(0.4, netFlicker * 1.2)})`;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  } else if (netFlicker < 0) {
    ctx.save();
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = `rgba(30, 20, 10, ${Math.min(0.4, -netFlicker * 1.2)})`;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }

  // --------------------------------------------------------------------------
  // C. 8mm Optical Vignette & Center Exposure Hotspot
  // --------------------------------------------------------------------------
  ctx.save();
  const maxDim = Math.max(width, height);
  const cx = width * 0.5;
  const cy = height * 0.5;

  // Center hotspot (slight vintage lens flare overexposure at core)
  const hotspotGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, maxDim * 0.55);
  hotspotGrad.addColorStop(0, `rgba(255, 235, 180, ${0.15 * clampedIntensity})`);
  hotspotGrad.addColorStop(0.5, `rgba(255, 200, 120, ${0.05 * clampedIntensity})`);
  hotspotGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.globalCompositeOperation = 'screen';
  ctx.fillStyle = hotspotGrad;
  ctx.fillRect(0, 0, width, height);

  // Heavy perimeter vignette with warm dark brown decay
  ctx.globalCompositeOperation = 'multiply';
  const vigGrad = ctx.createRadialGradient(cx, cy, maxDim * 0.32, cx, cy, maxDim * 0.72);
  vigGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  vigGrad.addColorStop(0.7, `rgba(180, 150, 120, ${1 - 0.2 * clampedIntensity})`);
  vigGrad.addColorStop(1, `rgba(35, 20, 10, ${0.35 + 0.55 * clampedIntensity})`);
  ctx.fillStyle = vigGrad;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();

  // --------------------------------------------------------------------------
  // D. Random Vertical Film Hair Scratches (18fps flickering)
  // --------------------------------------------------------------------------
  ctx.save();
  const scratchCount = opts?.scratchCount ?? Math.floor(2 + clampedIntensity * 4);

  for (let s = 0; s < scratchCount; s++) {
    const sSeed = frame18 * 19 + s * 37;
    const scratchExists = pseudoRandom(sSeed) > 0.25;
    if (!scratchExists) continue;

    const startX = pseudoRandom(sSeed + 1) * width;
    const scratchWidth = 0.75 + pseudoRandom(sSeed + 2) * 1.5;
    const scratchAlpha = (0.35 + pseudoRandom(sSeed + 3) * 0.5) * clampedIntensity;
    const isWavyHair = pseudoRandom(sSeed + 4) > 0.45;

    ctx.lineWidth = scratchWidth;
    ctx.lineCap = 'round';

    if (isWavyHair) {
      // Curving organic hair strand
      const hairLength = height * (0.2 + pseudoRandom(sSeed + 5) * 0.6);
      const hairStartY = pseudoRandom(sSeed + 6) * (height - hairLength);
      const cp1X = startX + (pseudoRandom(sSeed + 7) - 0.5) * 35;
      const cp1Y = hairStartY + hairLength * 0.33;
      const cp2X = startX + (pseudoRandom(sSeed + 8) - 0.5) * 45;
      const cp2Y = hairStartY + hairLength * 0.66;
      const endX = startX + (pseudoRandom(sSeed + 9) - 0.5) * 25;
      const endY = hairStartY + hairLength;

      ctx.beginPath();
      ctx.moveTo(startX, hairStartY);
      ctx.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, endX, endY);

      // Dark hair fiber
      ctx.strokeStyle = `rgba(15, 10, 5, ${scratchAlpha})`;
      ctx.stroke();

      // Subtle bright reflection on hair edge
      ctx.strokeStyle = `rgba(255, 240, 200, ${scratchAlpha * 0.4})`;
      ctx.lineWidth = scratchWidth * 0.5;
      ctx.stroke();
    } else {
      // Continuous vertical mechanical gate scratch line
      const driftX = (pseudoRandom(sSeed + 10) - 0.5) * 8;
      ctx.beginPath();
      ctx.moveTo(startX, 0);
      ctx.lineTo(startX + driftX, height);

      // Dark gouge
      ctx.strokeStyle = `rgba(10, 8, 5, ${scratchAlpha * 0.85})`;
      ctx.stroke();

      // Bright emulsion groove highlight right beside dark line
      ctx.beginPath();
      ctx.moveTo(startX + 1, 0);
      ctx.lineTo(startX + driftX + 1, height);
      ctx.strokeStyle = `rgba(255, 255, 230, ${scratchAlpha * 0.5})`;
      ctx.lineWidth = scratchWidth * 0.6;
      ctx.stroke();
    }
  }
  ctx.restore();

  // --------------------------------------------------------------------------
  // E. Random Dust Particles, Fibers & Emulsion Specks (18fps flickering)
  // --------------------------------------------------------------------------
  ctx.save();
  const dustCount = opts?.dustCount ?? Math.floor(18 + clampedIntensity * 32);

  for (let d = 0; d < dustCount; d++) {
    const dSeed = frame18 * 53 + d * 29;
    const dustX = pseudoRandom(dSeed) * width;
    const dustY = pseudoRandom(dSeed + 1) * height;
    const dustSize = 0.8 + pseudoRandom(dSeed + 2) * (2.8 * clampedIntensity);
    const isWhitePinhole = pseudoRandom(dSeed + 3) > 0.75;
    const dustAlpha = (0.3 + pseudoRandom(dSeed + 4) * 0.6) * clampedIntensity;

    if (isWhitePinhole) {
      // Translucent emulsion pinhole scratch (bright white/yellow speck)
      ctx.fillStyle = `rgba(255, 255, 235, ${dustAlpha})`;
      ctx.beginPath();
      ctx.arc(dustX, dustY, dustSize * 0.8, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Dark dust particle / fiber / fleck
      ctx.fillStyle = `rgba(18, 12, 6, ${dustAlpha})`;
      const shapeType = Math.floor(pseudoRandom(dSeed + 5) * 3);

      if (shapeType === 0) {
        // Round dust dot
        ctx.beginPath();
        ctx.arc(dustX, dustY, dustSize, 0, Math.PI * 2);
        ctx.fill();
      } else if (shapeType === 1) {
        // Oval / elongated lint speck
        ctx.beginPath();
        ctx.ellipse(dustX, dustY, dustSize * 1.6, dustSize * 0.7, pseudoRandom(dSeed + 6) * Math.PI, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Angular jagged specks
        const p1x = dustX + (pseudoRandom(dSeed + 7) - 0.5) * dustSize * 2;
        const p1y = dustY + (pseudoRandom(dSeed + 8) - 0.5) * dustSize * 2;
        const p2x = dustX + (pseudoRandom(dSeed + 9) - 0.5) * dustSize * 2;
        const p2y = dustY + (pseudoRandom(dSeed + 10) - 0.5) * dustSize * 2;
        ctx.beginPath();
        ctx.moveTo(dustX, dustY);
        ctx.lineTo(p1x, p1y);
        ctx.lineTo(p2x, p2y);
        ctx.closePath();
        ctx.fill();
      }
    }
  }
  ctx.restore();

  // --------------------------------------------------------------------------
  // F. 8mm Rounded Gate Aperture Frame Matte
  // --------------------------------------------------------------------------
  if (roundedCorners) {
    ctx.save();
    const cornerRadius = Math.min(width, height) * 0.04;
    const borderThickness = Math.max(4, Math.min(width, height) * 0.012);

    ctx.strokeStyle = `rgba(15, 10, 5, ${0.85 * clampedIntensity})`;
    ctx.lineWidth = borderThickness;

    // Draw rounded outer frame border
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(
        borderThickness / 2,
        borderThickness / 2,
        width - borderThickness,
        height - borderThickness,
        cornerRadius
      );
    } else {
      ctx.rect(0, 0, width, height);
    }
    ctx.stroke();
    ctx.restore();
  }

  ctx.restore();
}

/**
 * 3. Prism Refraction Effect
 *
 * Renders multi-spectral optical prism crystal dispersion facets:
 * - Triple-offset rainbow refraction facet borders along screen edges
 * - Spectral dispersion passes (Red/Magenta -> Yellow/Green -> Cyan/Blue/Violet)
 * - Angled corner prism facet geometry and caustic flare glints
 * - Gentle harmonic refraction breathing and chromatic edge distortion
 *
 * @param ctx CanvasRenderingContext2D
 * @param width Canvas width in pixels
 * @param height Canvas height in pixels
 * @param time Current timestamp in seconds
 * @param intensity Effect intensity (0.0 to 1.0, default 0.5)
 * @param options Optional customizable prism refraction options
 */
export function drawPrismRefraction(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  intensity: number = 0.5,
  options?: PrismRefractionOptions
): void {
  if (width <= 0 || height <= 0 || intensity <= 0) return;

  const clampedIntensity = Math.max(0, Math.min(1, intensity));
  const baseFacetWidth = options?.facetWidth ?? Math.min(width, height) * 0.09;
  const spread = options?.dispersionSpread ?? 1.0;
  const speed = options?.shimmerSpeed ?? 1.2;
  const showCornerCaustics = options?.showCornerCaustics ?? true;
  const showFacetLines = options?.showFacetLines ?? true;

  const t = time * speed;
  const breathing = 1.0 + Math.sin(t * 1.4) * 0.12;

  ctx.save();
  ctx.globalCompositeOperation = 'screen';

  // --------------------------------------------------------------------------
  // Triple-Offset Spectral Refraction Layers (3 Primary Optical Dispersion Passes)
  // --------------------------------------------------------------------------
  // Layer 1: Long Wavelengths (Red, Orange, Magenta) - Outermost deep facet offset
  // Layer 2: Medium Wavelengths (Yellow, Lime, Cyan) - Mid-depth facet offset
  // Layer 3: Short Wavelengths (Cyan, Electric Blue, Violet) - Inward facet offset
  const spectralLayers = [
    {
      name: 'red-magenta',
      offsetMult: 1.35 * spread,
      alphaMult: 0.38,
      colors: {
        top: ['rgba(255, 20, 100, 0.45)', 'rgba(255, 90, 0, 0.25)', 'rgba(255, 0, 80, 0)'],
        bottom: ['rgba(255, 0, 120, 0.45)', 'rgba(255, 60, 0, 0.25)', 'rgba(255, 0, 120, 0)'],
        left: ['rgba(255, 40, 60, 0.40)', 'rgba(255, 120, 0, 0.20)', 'rgba(255, 40, 60, 0)'],
        right: ['rgba(255, 0, 90, 0.40)', 'rgba(255, 70, 0, 0.20)', 'rgba(255, 0, 90, 0)'],
      },
      flareColor: '#FF2A6D',
    },
    {
      name: 'green-yellow',
      offsetMult: 1.0 * spread,
      alphaMult: 0.32,
      colors: {
        top: ['rgba(0, 255, 160, 0.40)', 'rgba(230, 255, 30, 0.22)', 'rgba(0, 255, 160, 0)'],
        bottom: ['rgba(50, 255, 120, 0.40)', 'rgba(255, 240, 20, 0.22)', 'rgba(50, 255, 120, 0)'],
        left: ['rgba(0, 255, 180, 0.35)', 'rgba(200, 255, 40, 0.18)', 'rgba(0, 255, 180, 0)'],
        right: ['rgba(30, 255, 140, 0.35)', 'rgba(240, 255, 30, 0.18)', 'rgba(30, 255, 140, 0)'],
      },
      flareColor: '#05FFA1',
    },
    {
      name: 'cyan-violet',
      offsetMult: 0.68 * spread,
      alphaMult: 0.42,
      colors: {
        top: ['rgba(0, 210, 255, 0.45)', 'rgba(140, 40, 255, 0.25)', 'rgba(0, 210, 255, 0)'],
        bottom: ['rgba(0, 180, 255, 0.45)', 'rgba(170, 20, 255, 0.25)', 'rgba(0, 180, 255, 0)'],
        left: ['rgba(0, 230, 255, 0.38)', 'rgba(120, 50, 255, 0.20)', 'rgba(0, 230, 255, 0)'],
        right: ['rgba(0, 190, 255, 0.38)', 'rgba(150, 30, 255, 0.20)', 'rgba(0, 190, 255, 0)'],
      },
      flareColor: '#00F0FF',
    },
  ];

  for (let l = 0; l < spectralLayers.length; l++) {
    const layer = spectralLayers[l];
    const layerDepth = baseFacetWidth * layer.offsetMult * breathing * (0.8 + clampedIntensity * 0.4);
    const layerAlpha = layer.alphaMult * clampedIntensity;

    ctx.globalAlpha = Math.min(1.0, layerAlpha);

    // 1. Top Edge Prism Facet Gradient
    const topGrad = ctx.createLinearGradient(0, 0, 0, layerDepth);
    topGrad.addColorStop(0, layer.colors.top[0]);
    topGrad.addColorStop(0.5, layer.colors.top[1]);
    topGrad.addColorStop(1, layer.colors.top[2]);
    ctx.fillStyle = topGrad;
    ctx.fillRect(0, 0, width, layerDepth);

    // 2. Bottom Edge Prism Facet Gradient
    const bottomGrad = ctx.createLinearGradient(0, height, 0, height - layerDepth);
    bottomGrad.addColorStop(0, layer.colors.bottom[0]);
    bottomGrad.addColorStop(0.5, layer.colors.bottom[1]);
    bottomGrad.addColorStop(1, layer.colors.bottom[2]);
    ctx.fillStyle = bottomGrad;
    ctx.fillRect(0, height - layerDepth, width, layerDepth);

    // 3. Left Edge Prism Facet Gradient
    const leftGrad = ctx.createLinearGradient(0, 0, layerDepth, 0);
    leftGrad.addColorStop(0, layer.colors.left[0]);
    leftGrad.addColorStop(0.5, layer.colors.left[1]);
    leftGrad.addColorStop(1, layer.colors.left[2]);
    ctx.fillStyle = leftGrad;
    ctx.fillRect(0, 0, layerDepth, height);

    // 4. Right Edge Prism Facet Gradient
    const rightGrad = ctx.createLinearGradient(width, 0, width - layerDepth, 0);
    rightGrad.addColorStop(0, layer.colors.right[0]);
    rightGrad.addColorStop(0.5, layer.colors.right[1]);
    rightGrad.addColorStop(1, layer.colors.right[2]);
    ctx.fillStyle = rightGrad;
    ctx.fillRect(width - layerDepth, 0, layerDepth, height);
  }

  // --------------------------------------------------------------------------
  // B. Angled Corner Prism Facets & Glass Edge Chamfers (4 Corners)
  // --------------------------------------------------------------------------
  const cornerSize = baseFacetWidth * 1.7 * breathing;
  const corners = [
    { x: 0, y: 0, dx: 1, dy: 1, angle: 0 },
    { x: width, y: 0, dx: -1, dy: 1, angle: Math.PI * 0.5 },
    { x: width, y: height, dx: -1, dy: -1, angle: Math.PI },
    { x: 0, y: height, dx: 1, dy: -1, angle: Math.PI * 1.5 },
  ];

  for (let c = 0; c < corners.length; c++) {
    const { x, y, dx, dy } = corners[c];

    // Angular facet polygon
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + dx * cornerSize, y);
    ctx.lineTo(x, y + dy * cornerSize);
    ctx.closePath();

    const cornerGrad = ctx.createRadialGradient(x, y, 4, x, y, cornerSize);
    cornerGrad.addColorStop(0, `rgba(255, 255, 255, ${0.55 * clampedIntensity})`);
    cornerGrad.addColorStop(0.3, `rgba(0, 240, 255, ${0.35 * clampedIntensity})`);
    cornerGrad.addColorStop(0.65, `rgba(255, 0, 180, ${0.25 * clampedIntensity})`);
    cornerGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = cornerGrad;
    ctx.fill();
    ctx.restore();

    // ------------------------------------------------------------------------
    // C. Internal Glass Refraction Facet Boundary Lines
    // ------------------------------------------------------------------------
    if (showFacetLines) {
      ctx.save();
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.32 * clampedIntensity})`;

      // Diagonal prism cut line
      ctx.beginPath();
      ctx.moveTo(x + dx * cornerSize, y);
      ctx.lineTo(x, y + dy * cornerSize);
      ctx.stroke();

      // Secondary refractive facet sub-strut
      ctx.strokeStyle = `rgba(0, 230, 255, ${0.22 * clampedIntensity})`;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + dx * (cornerSize * 0.7), y + dy * (cornerSize * 0.7));
      ctx.stroke();
      ctx.restore();
    }

    // ------------------------------------------------------------------------
    // D. Corner Optical Caustic Glints & Shimmering Flares
    // ------------------------------------------------------------------------
    if (showCornerCaustics) {
      const glintPulse = 0.5 + Math.sin(t * 2.2 + c * 1.57) * 0.5;
      const flareRadius = (16 + glintPulse * 24) * (clampedIntensity * 1.2);
      const flareX = x + dx * (cornerSize * 0.35);
      const flareY = y + dy * (cornerSize * 0.35);

      ctx.save();
      const flareGrad = ctx.createRadialGradient(flareX, flareY, 1, flareX, flareY, flareRadius);
      flareGrad.addColorStop(0, '#FFFFFF');
      flareGrad.addColorStop(0.35, 'rgba(0, 240, 255, 0.7)');
      flareGrad.addColorStop(0.7, 'rgba(255, 0, 150, 0.3)');
      flareGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.globalAlpha = Math.min(1.0, 0.65 * clampedIntensity * (0.7 + glintPulse * 0.3));
      ctx.fillStyle = flareGrad;
      ctx.beginPath();
      ctx.arc(flareX, flareY, flareRadius, 0, Math.PI * 2);
      ctx.fill();

      // 4-point caustic glint star on corner vertex
      const armLen = flareRadius * 1.4;
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.75 * clampedIntensity})`;
      ctx.beginPath();
      ctx.moveTo(flareX - armLen, flareY);
      ctx.lineTo(flareX + armLen, flareY);
      ctx.moveTo(flareX, flareY - armLen);
      ctx.lineTo(flareX, flareY + armLen);
      ctx.stroke();

      ctx.restore();
    }
  }

  ctx.restore();
}
