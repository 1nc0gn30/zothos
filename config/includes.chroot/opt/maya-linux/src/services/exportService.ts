import { ProjectState } from '../types/project';
import { getDeviceFrame, CANVAS_ASPECTS } from '../models/devices';
import { SpeedTimeline } from '../models/speedTimeline';
import { sampleAnimation, sampleTapFeedback } from './animationSampler';
import { ColorGradeType, VideoEffectsConfig, SubtitleItem, TextOverlay, StickerItem, WatermarkConfig } from '../types/models';
import { 
  draw3DChassisExtrusion, 
  drawSpecularGlare, 
  drawBrowserFrame, 
  drawTerminalFrame, 
  drawStudioDisplayFrame, 
  drawWatchUltraFrame, 
  drawPixelFrame 
} from './deviceFrameRenderer';
import { computeCursorPosition, drawCursor } from './cursorService';
import { drawAnimatedMeshGradient, drawAudioSpectrumVisualizer } from './ambientVisualizerService';
import { drawLowerThirdOverlay } from './lowerThirdsService';
import { drawBackgroundPattern } from './backgroundPatternService';
import { drawVideoProgressBar } from './progressBarService';
import { 
  drawCinematicLetterbox, 
  drawAnamorphicFlare, 
  drawLightLeaks 
} from './cinematicEffectsService';
import {
  drawMetaScribbleEffect,
  drawMetaOutlineEffect,
  drawMetaGlitterEffect,
  drawMetaSelectiveBlur,
  drawMetaFlashStrobe,
} from './metaEditsEffectsService';
import { drawTransitionEffect } from './transitionsService';
import { drawVHSTapeGlitch, drawVintage8mmFilm, drawPrismRefraction } from './vintageVFXService';
import { drawTypewriterOverlays, drawImageOverlays } from './typewriterOverlayService';

export interface ExportOptions {
  transparent: boolean;
  quality?: '1080p' | '1440p' | '4k';
  fps?: number;
  onProgress?: (progress: number) => void;
}

export interface ExportResult {
  success: boolean;
  filePath?: string;
  blob?: Blob;
  isNative?: boolean;
  cancelled?: boolean;
}

export async function exportVideo(
  project: ProjectState,
  options: ExportOptions,
  videoElement: HTMLVideoElement
): Promise<ExportResult> {
  const aspectConfig = CANVAS_ASPECTS[project.canvasAspect];
  
  let scaleMult = 1.0;
  if (options.quality === '4k') scaleMult = 2.0;
  else if (options.quality === '1440p') scaleMult = 1.3333;

  const targetWidth = Math.round(aspectConfig.renderWidth * scaleMult);
  const targetHeight = Math.round(aspectConfig.renderHeight * scaleMult);

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d', { alpha: true, willReadFrequently: true });
  if (!ctx) throw new Error('Could not create Canvas2D rendering context');

  // Pre-load frame overlay image if physical
  const frame = getDeviceFrame(project.deviceModelID, project.deviceColorID);
  let frameImage: HTMLImageElement | null = null;
  if (frame.kind === 'physical' && frame.imageName) {
    frameImage = await loadImage(`./frames/${frame.imageName}`);
  }

  let bgImage: HTMLImageElement | null = null;
  if (project.background.type === 'image' && project.background.imageURL) {
    bgImage = await loadImage(project.background.imageURL);
  }

  const loadedImagesMap = new Map<string, HTMLImageElement>();
  if (project.imageOverlays) {
    for (const ov of project.imageOverlays) {
      if (ov.imageUrl && !loadedImagesMap.has(ov.imageUrl)) {
        try {
          const img = await loadImage(ov.imageUrl);
          loadedImagesMap.set(ov.imageUrl, img);
        } catch (_) {}
      }
    }
  }

  const speedTimeline = new SpeedTimeline(
    project.trimStartTime,
    project.trimEndTime,
    project.speedSegments
  );

  const totalDuration = speedTimeline.duration || 1;
  const fps = options.fps || 60;
  const totalFrames = Math.max(1, Math.floor(totalDuration * fps));

  const isDesktopNative = Boolean((window as any).electronAPI?.startNativeExport);

  // 1. Desktop Native FFmpeg Export Engine (AppImage / Electron)
  if (isDesktopNative) {
    const ext = options.transparent ? 'webm' : 'mp4';
    const baseName = project.displayName?.replace(/\.[^/.]+$/, "") || "Recording";

    const saveDialog = await (window as any).electronAPI.showSaveDialog({
      title: `Export ${options.transparent ? 'Transparent Alpha Video' : 'MP4 Video'}`,
      defaultName: `Maya-${baseName}.${ext}`,
      filters: options.transparent
        ? [
            { name: 'WebM Alpha Video (*.webm)', extensions: ['webm'] },
            { name: 'All Files (*.*)', extensions: ['*'] },
          ]
        : [
            { name: 'MP4 Video (*.mp4)', extensions: ['mp4'] },
            { name: 'All Files (*.*)', extensions: ['*'] },
          ]
    });

    if (saveDialog.canceled || !saveDialog.filePath) {
      return { success: false, cancelled: true };
    }

    const outputPath = saveDialog.filePath;

    // Start FFmpeg stdin stream in Electron main
    await (window as any).electronAPI.startNativeExport({
      width: targetWidth,
      height: targetHeight,
      fps,
      outputPath,
      transparent: options.transparent,
      bgAudioBase64: project.audioTracks?.[0]?.url,
      bgAudioVolume: project.audioTracks?.[0]?.volume ?? 0.8,
    });

    // Save previous video state
    const prevTime = videoElement.currentTime;
    const prevMuted = videoElement.muted;
    videoElement.muted = true;

    try {
      for (let frameIndex = 0; frameIndex < totalFrames; frameIndex++) {
        const timelineTime = (frameIndex / totalFrames) * totalDuration;
        const sourceTime = speedTimeline.sourceTime(timelineTime);

        await seekVideoSafely(videoElement, sourceTime);

        // Render composite frame
        renderCompositeFrame({
          ctx,
          canvasWidth: targetWidth,
          canvasHeight: targetHeight,
          video: videoElement,
          project,
          frame,
          frameImage,
          bgImage,
          sourceTime,
          transparent: options.transparent,
          loadedImagesMap,
        });

        // Extract raw RGBA buffer and feed to FFmpeg
        const imgData = ctx.getImageData(0, 0, targetWidth, targetHeight);
        await (window as any).electronAPI.feedNativeExportFrame(imgData.data.buffer);

        options.onProgress?.((frameIndex + 1) / totalFrames);
      }

      await (window as any).electronAPI.finishNativeExport();

      videoElement.currentTime = prevTime;
      videoElement.muted = prevMuted;

      return {
        success: true,
        filePath: outputPath,
        isNative: true,
      };
    } catch (err) {
      try { await (window as any).electronAPI.cancelNativeExport(); } catch (_) {}
      videoElement.currentTime = prevTime;
      videoElement.muted = prevMuted;
      throw err;
    }
  }

  // 2. Web Browser Fallback (MediaRecorder)
  const mimeType = options.transparent 
    ? (MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus') ? 'video/webm;codecs=vp9' : 'video/webm')
    : (MediaRecorder.isTypeSupported('video/mp4') ? 'video/mp4' : 'video/webm;codecs=vp9');

  const stream = canvas.captureStream(fps);
  const recorder = new MediaRecorder(stream, {
    mimeType,
    videoBitsPerSecond: 20_000_000,
  });

  const chunks: Blob[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  const recordingPromise = new Promise<Blob>((resolve, reject) => {
    recorder.onstop = () => resolve(new Blob(chunks, { type: mimeType }));
    recorder.onerror = (e) => reject(e);
  });

  recorder.start();

  const prevTime = videoElement.currentTime;
  const prevMuted = videoElement.muted;
  videoElement.muted = true;

  for (let frameIndex = 0; frameIndex < totalFrames; frameIndex++) {
    const timelineTime = (frameIndex / totalFrames) * totalDuration;
    const sourceTime = speedTimeline.sourceTime(timelineTime);

    await seekVideoSafely(videoElement, sourceTime);

    renderCompositeFrame({
      ctx,
      canvasWidth: targetWidth,
      canvasHeight: targetHeight,
      video: videoElement,
      project,
      frame,
      frameImage,
      bgImage,
      sourceTime,
      transparent: options.transparent,
      loadedImagesMap,
    });

    options.onProgress?.((frameIndex + 1) / totalFrames);
    await new Promise(r => setTimeout(r, 6));
  }

  recorder.stop();
  videoElement.currentTime = prevTime;
  videoElement.muted = prevMuted;

  const finalBlob = await recordingPromise;
  return {
    success: true,
    blob: finalBlob,
    isNative: false,
  };
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(img);
    img.src = src;
  });
}

function seekVideoSafely(video: HTMLVideoElement, time: number): Promise<void> {
  return new Promise((resolve) => {
    if (Math.abs(video.currentTime - time) < 0.008) {
      resolve();
      return;
    }
    let finished = false;
    const timer = setTimeout(() => {
      if (!finished) {
        finished = true;
        video.removeEventListener('seeked', onSeeked);
        resolve();
      }
    }, 45); // Safe bounded timeout prevents decoder starvation

    const onSeeked = () => {
      if (!finished) {
        finished = true;
        clearTimeout(timer);
        video.removeEventListener('seeked', onSeeked);
        resolve();
      }
    };
    video.addEventListener('seeked', onSeeked, { once: true });
    video.currentTime = time;
  });
}

interface FrameRenderContext {
  ctx: CanvasRenderingContext2D;
  canvasWidth: number;
  canvasHeight: number;
  video: HTMLVideoElement;
  project: ProjectState;
  frame: any;
  frameImage: HTMLImageElement | null;
  bgImage: HTMLImageElement | null;
  sourceTime: number;
  transparent: boolean;
  loadedImagesMap?: Map<string, HTMLImageElement>;
}

function renderCompositeFrame(rc: FrameRenderContext) {
  const { ctx, canvasWidth, canvasHeight, video, project, frame, frameImage, bgImage, sourceTime, transparent, loadedImagesMap = new Map() } = rc;

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // 1. Draw Background (if not transparent)
  if (!transparent && project.background.type !== 'none') {
    drawBackground(ctx, canvasWidth, canvasHeight, project.background, bgImage, video);
  }

  // 2. Geometry calculations
  const naturalHeightFraction = 0.9;
  const maxH = canvasHeight * naturalHeightFraction;
  const maxW = canvasWidth * naturalHeightFraction;

  let effectiveAspect = frame.frameAspectRatio;
  if (frame.kind === 'none' || frame.kind === 'generic') {
    if (video.videoWidth > 0 && video.videoHeight > 0) {
      effectiveAspect = video.videoWidth / video.videoHeight;
    }
  }

  const phoneW = Math.min(maxW, maxH * effectiveAspect);
  const phoneH = effectiveAspect > 0 ? phoneW / effectiveAspect : maxH;

  const sampled = sampleAnimation(sourceTime, project.animations, project.scale, project.offset);
  const offsetRef = Math.min(canvasWidth, canvasHeight);

  const shakeIntensity = project.effects?.cameraShake ?? 0;
  let shakeX = 0;
  let shakeY = 0;
  if (shakeIntensity > 0) {
    const s = shakeIntensity * (canvasWidth / 50);
    shakeX = (Math.sin(sourceTime * 48) + Math.cos(sourceTime * 72)) * s;
    shakeY = (Math.cos(sourceTime * 52) + Math.sin(sourceTime * 84)) * s;
  }

  ctx.save();
  // Translate to center + animated offset
  ctx.translate(
    canvasWidth / 2 + sampled.offsetX * offsetRef + shakeX,
    canvasHeight / 2 + sampled.offsetY * offsetRef + shakeY
  );
  ctx.scale(sampled.scale, sampled.scale);
  ctx.translate(-phoneW / 2, -phoneH / 2);

  const screenX = frame.screenRectNormalized.x * phoneW;
  const screenY = frame.screenRectNormalized.y * phoneH;
  const screenW = frame.screenRectNormalized.width * phoneW;
  const screenH = frame.screenRectNormalized.height * phoneH;

  let cornerRadius = frame.screenCornerRadiusNormalized * phoneW;
  if (frame.kind === 'none' || frame.kind === 'generic') {
    cornerRadius = project.bareCornerRadius * Math.min(screenW, screenH);
  }

  const bezelWidth = frame.kind === 'generic' ? Math.max(0, phoneW * project.bareBezelWidth) : 0;

  // 3D Chassis Depth Extrusion
  draw3DChassisExtrusion(ctx, phoneW, phoneH, cornerRadius, project, sourceTime);

  // Device Frame Neon Glow
  if (project.effects?.deviceGlow?.enabled) {
    ctx.save();
    ctx.shadowColor = project.effects.deviceGlow.colorHex || '#6466FA';
    ctx.shadowBlur = (project.effects.deviceGlow.radius || 24) * (canvasWidth / 600);
    ctx.strokeStyle = project.effects.deviceGlow.colorHex || '#6466FA';
    ctx.lineWidth = 4 * (canvasWidth / 1000);
    drawRoundedRect(ctx, screenX - bezelWidth / 2, screenY - bezelWidth / 2, phoneW + bezelWidth, phoneH + bezelWidth, cornerRadius + bezelWidth / 2);
    ctx.stroke();
    ctx.restore();
  }

  // 3. Drop Shadow
  if (project.shadow.enabled && project.shadow.opacity > 0) {
    ctx.save();
    ctx.shadowColor = project.shadow.colorHex + Math.floor(project.shadow.opacity * 255).toString(16).padStart(2, '0');
    ctx.shadowBlur = project.shadow.radius * (canvasWidth / 500);
    ctx.shadowOffsetX = project.shadow.offsetX * (canvasWidth / 500);
    ctx.shadowOffsetY = project.shadow.offsetY * (canvasWidth / 500);

    ctx.fillStyle = '#000000';
    if (frame.kind === 'physical' && frameImage && frameImage.complete && frameImage.naturalWidth > 0) {
      ctx.drawImage(frameImage, 0, 0, phoneW, phoneH);
    } else {
      drawRoundedRect(ctx, screenX - bezelWidth / 2, screenY - bezelWidth / 2, phoneW + bezelWidth, phoneH + bezelWidth, cornerRadius + bezelWidth / 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // Procedural Desktop / Browser Frame Underlays
  if (frame.kind === 'browser') {
    drawBrowserFrame(ctx, phoneW, phoneH, screenX, screenY, screenW, screenH, cornerRadius, project);
  } else if (frame.kind === 'terminal') {
    drawTerminalFrame(ctx, phoneW, phoneH, screenX, screenY, screenW, screenH, cornerRadius, project);
  } else if (frame.kind === 'desktop') {
    drawStudioDisplayFrame(ctx, phoneW, phoneH, screenX, screenY, screenW, screenH, cornerRadius, project);
  } else if (frame.kind === 'watch') {
    drawWatchUltraFrame(ctx, phoneW, phoneH, screenX, screenY, screenW, screenH, cornerRadius, project);
  }

  // 4. Draw Video (clipped to rounded screen rect)
  ctx.save();
  ctx.beginPath();
  drawRoundedRect(ctx, screenX, screenY, screenW, screenH, cornerRadius);
  ctx.clip();

  const colorFilter = getFilterForColorGrade(project.effects?.colorGrade);
  if (colorFilter !== 'none') {
    ctx.filter = colorFilter;
  }

  ctx.drawImage(video, screenX, screenY, screenW, screenH);
  ctx.filter = 'none';

  // 5. Draw Tap feedback on top of video inside screen rect
  drawTapEvents(ctx, screenX, screenY, screenW, screenH, project.tapEvents, sourceTime);

  // Screen Studio Mouse Cursor with spline motion & click ripples
  if (project.cursor?.enabled !== false) {
    const cursorPos = computeCursorPosition(sourceTime, project.tapEvents);
    const cursorPixelX = screenX + cursorPos.x * screenW;
    const cursorPixelY = screenY + cursorPos.y * screenH;
    drawCursor(ctx, cursorPixelX, cursorPixelY, cursorPos.isClicking, cursorPos.clickProgress, project.cursor);
  }
  ctx.restore();

  // 3D Specular Glass Glare Sheen
  drawSpecularGlare(ctx, screenX, screenY, screenW, screenH, cornerRadius, project, sourceTime);

  // 6. Draw Frame Overlay
  if (frame.kind === 'physical' && frameImage && frameImage.complete && frameImage.naturalWidth > 0) {
    ctx.drawImage(frameImage, 0, 0, phoneW, phoneH);
  } else if (project.deviceModelID === 'pixel-9-pro') {
    drawPixelFrame(ctx, phoneW, phoneH, screenX, screenY, screenW, screenH, cornerRadius, project);
  } else if (frame.kind === 'browser') {
    drawBrowserFrame(ctx, phoneW, phoneH, screenX, screenY, screenW, screenH, cornerRadius, project);
  } else if (frame.kind === 'terminal') {
    drawTerminalFrame(ctx, phoneW, phoneH, screenX, screenY, screenW, screenH, cornerRadius, project);
  } else if (frame.kind === 'desktop') {
    drawStudioDisplayFrame(ctx, phoneW, phoneH, screenX, screenY, screenW, screenH, cornerRadius, project);
  } else if (frame.kind === 'watch') {
    drawWatchUltraFrame(ctx, phoneW, phoneH, screenX, screenY, screenW, screenH, cornerRadius, project);
  } else if (frame.kind === 'generic' && bezelWidth > 0) {
    ctx.save();
    ctx.strokeStyle = project.bareBezelHex || '#000000';
    ctx.lineWidth = bezelWidth;
    drawRoundedRect(ctx, screenX - bezelWidth / 2, screenY - bezelWidth / 2, screenW + bezelWidth, screenH + bezelWidth, cornerRadius + bezelWidth / 2);
    ctx.stroke();
    ctx.restore();
  }

  ctx.restore();

  // Draw Dancing Audio Spectrum Visualizer
  if (project.audioTracks && project.audioTracks.length > 0) {
    drawAudioSpectrumVisualizer(ctx, canvasWidth, canvasHeight, sourceTime, true, true, 'bars', '#6466FA');
  }

  // 7. Draw Text Overlays & Badges
  drawTextOverlays(ctx, canvasWidth, canvasHeight, project.overlays, sourceTime);

  // 8. Draw Subtitles & Kinetic Captions
  drawSubtitles(ctx, canvasWidth, canvasHeight, project.subtitles, sourceTime);

  // 9. Draw Animated Stickers
  drawStickers(ctx, canvasWidth, canvasHeight, project.stickers, sourceTime);

  // 10. Draw Watermark Badge
  drawWatermark(ctx, canvasWidth, canvasHeight, project.watermark);

  // 10b. Draw Typewriter Stroke Captions & Headings
  drawTypewriterOverlays(ctx, canvasWidth, canvasHeight, project.typewriters, sourceTime);

  // 10c. Draw Brand Logos & Image Overlays
  drawImageOverlays(ctx, canvasWidth, canvasHeight, project.imageOverlays, sourceTime, loadedImagesMap);

  // 11. Apply CapCut Video Effects (Vignette, Film Grain, Bloom, Scanlines)
  applyVideoEffects(ctx, canvasWidth, canvasHeight, project.effects);

  // 12. Draw Cinematic 35mm Light Leaks & Film Burns
  if (project.effects?.lightLeaks?.enabled) {
    drawLightLeaks(ctx, canvasWidth, canvasHeight, sourceTime, project.effects.lightLeaks);
  }

  // 13. Draw Anamorphic Optical Lens Flare
  if (project.effects?.anamorphicFlare?.enabled) {
    drawAnamorphicFlare(ctx, canvasWidth, canvasHeight, sourceTime, project.effects.anamorphicFlare);
  }

  // 14. Draw Hollywood 2.39:1 Widescreen Letterbox Matte
  if (project.effects?.letterbox?.enabled) {
    drawCinematicLetterbox(ctx, canvasWidth, canvasHeight, project.effects.letterbox);
  }

  // 15. Draw Meta Edits AI Effects Suite (Scribble, Outline, Glitter, Privacy Blur, Flash Strobe)
  if (project.metaEdits) {
    const targetBounds = { x: screenX, y: screenY, width: screenW, height: screenH, radius: cornerRadius };

    if (project.metaEdits.scribble?.enabled) {
      drawMetaScribbleEffect(ctx, canvasWidth, canvasHeight, sourceTime, project.metaEdits.scribble, targetBounds);
    }
    if (project.metaEdits.outline?.enabled) {
      drawMetaOutlineEffect(ctx, canvasWidth, canvasHeight, sourceTime, project.metaEdits.outline, targetBounds);
    }
    if (project.metaEdits.glitter?.enabled) {
      drawMetaGlitterEffect(ctx, canvasWidth, canvasHeight, sourceTime, project.metaEdits.glitter);
    }
    if (project.metaEdits.selectiveBlur?.enabled) {
      drawMetaSelectiveBlur(ctx, canvasWidth, canvasHeight, project.metaEdits.selectiveBlur);
    }
    if (project.metaEdits.flashStrobe?.enabled) {
      drawMetaFlashStrobe(ctx, canvasWidth, canvasHeight, sourceTime, project.metaEdits.flashStrobe);
    }
  }

  // 16. Draw Vintage & Retro Glitch Shaders
  if (project.effects?.vhsGlitch?.enabled) {
    drawVHSTapeGlitch(ctx, canvasWidth, canvasHeight, sourceTime, project.effects.vhsGlitch.intensity, project.effects.vhsGlitch.showOSD);
  }
  if (project.effects?.vintage8mm?.enabled) {
    drawVintage8mmFilm(ctx, canvasWidth, canvasHeight, sourceTime, project.effects.vintage8mm.intensity, project.effects.vintage8mm.dustFlicker);
  }
  if (project.effects?.prismRefraction?.enabled) {
    drawPrismRefraction(ctx, canvasWidth, canvasHeight, sourceTime, project.effects.prismRefraction.intensity);
  }

  // 17. Draw Cinema Transitions
  if (project.transitions && project.transitions.length > 0) {
    drawTransitionEffect(ctx, canvasWidth, canvasHeight, sourceTime, project.transitions);
  }

  // 18. Draw Viral Video Progress Bar (Reels / Shorts / TikTok)
  if (project.progressBar?.enabled) {
    const totalDur = Math.max(1, project.videoDuration || 10);
    const progressRatio = sourceTime / totalDur;
    drawVideoProgressBar(ctx, canvasWidth, canvasHeight, progressRatio, project.progressBar, sourceTime, totalDur);
  }
}

function drawBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  bg: any,
  bgImage: HTMLImageElement | null,
  video: HTMLVideoElement,
  sourceTime: number = 0
) {
  if (bg.type === 'solid') {
    ctx.fillStyle = bg.hex || '#6466FA';
    ctx.fillRect(0, 0, width, height);
  } else if (bg.type === 'gradient' && bg.gradient) {
    const angleRad = (bg.gradient.angleDegrees * Math.PI) / 180;
    const x1 = width / 2 - Math.cos(angleRad) * (width / 2);
    const y1 = height / 2 - Math.sin(angleRad) * (height / 2);
    const x2 = width / 2 + Math.cos(angleRad) * (width / 2);
    const y2 = height / 2 + Math.sin(angleRad) * (height / 2);

    const grad = ctx.createLinearGradient(x1, y1, x2, y2);
    grad.addColorStop(0, bg.gradient.startHex);
    grad.addColorStop(1, bg.gradient.endHex);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  } else if (bg.type === 'image' && bgImage && bgImage.complete) {
    ctx.drawImage(bgImage, 0, 0, width, height);
  } else if (bg.type === 'videoBlur') {
    ctx.save();
    ctx.filter = 'blur(40px) brightness(0.7)';
    ctx.drawImage(video, -40, -40, width + 80, height + 80);
    ctx.restore();
  } else {
    // Dynamic Animated Mesh Gradient
    const theme = bg.theme || 'aurora';
    drawAnimatedMeshGradient(ctx, width, height, sourceTime, theme);
  }

  // Draw Studio Background Pattern (Dots, Grid, Crosses, Circuit, Radial Lines)
  if (bg.pattern?.enabled) {
    drawBackgroundPattern(
      ctx,
      width,
      height,
      bg.pattern.type,
      bg.pattern.opacity,
      bg.pattern.colorHex,
      bg.pattern.scale,
      sourceTime
    );
  }
}

function drawTapEvents(
  ctx: CanvasRenderingContext2D,
  screenX: number,
  screenY: number,
  screenW: number,
  screenH: number,
  tapEvents: any[],
  sourceTime: number
) {
  const shortSide = Math.min(screenW, screenH);

  for (const ev of tapEvents) {
    const sample = sampleTapFeedback(sourceTime, ev);
    if (!sample) continue;

    const posX = screenX + ev.position.x * screenW;
    const posY = screenY + ev.position.y * screenH;
    const diameter = shortSide * ev.diameterFraction;
    const colorHex = ev.colorHex || '#6466FA';

    ctx.save();
    ctx.translate(posX, posY);

    if (ev.style === 'ripple') {
      // Ring
      ctx.beginPath();
      ctx.arc(0, 0, (diameter / 2) * sample.ringScale, 0, Math.PI * 2);
      ctx.strokeStyle = colorHex;
      ctx.globalAlpha = sample.ringOpacity;
      ctx.lineWidth = Math.max(2, diameter * 0.055);
      ctx.stroke();

      // Core
      ctx.beginPath();
      ctx.arc(0, 0, (diameter * 0.11) * sample.coreScale, 0, Math.PI * 2);
      ctx.fillStyle = colorHex;
      ctx.globalAlpha = sample.coreOpacity;
      ctx.fill();
    } else if (ev.style === 'pulse') {
      ctx.beginPath();
      ctx.arc(0, 0, (diameter * 0.29) * sample.coreScale, 0, Math.PI * 2);
      ctx.fillStyle = colorHex;
      ctx.globalAlpha = sample.coreOpacity * 0.82;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(0, 0, (diameter / 2) * sample.ringScale, 0, Math.PI * 2);
      ctx.strokeStyle = colorHex;
      ctx.globalAlpha = sample.ringOpacity * 0.42;
      ctx.lineWidth = Math.max(2, diameter * 0.035);
      ctx.stroke();
    } else if (ev.style === 'ring') {
      ctx.beginPath();
      ctx.arc(0, 0, (diameter / 2) * sample.ringScale, 0, Math.PI * 2);
      ctx.strokeStyle = colorHex;
      ctx.globalAlpha = sample.ringOpacity;
      ctx.lineWidth = Math.max(2, diameter * 0.07);
      ctx.stroke();
    }
    ctx.restore();
  }
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function getFilterForColorGrade(grade?: ColorGradeType): string {
  switch (grade) {
    case 'cyberpunk': return 'contrast(1.25) saturate(1.4) hue-rotate(-12deg)';
    case 'warmSunset': return 'sepia(0.18) saturate(1.28) brightness(1.04) contrast(1.08)';
    case 'vintageVHS': return 'contrast(1.15) saturate(0.85) sepia(0.3) brightness(1.05)';
    case 'noir': return 'grayscale(1) contrast(1.35) brightness(0.96)';
    case 'studioBoost': return 'contrast(1.12) saturate(1.25) brightness(1.02)';
    case 'matrix': return 'hue-rotate(65deg) saturate(1.45) contrast(1.18)';
    case 'oppenheimer70mm': return 'contrast(1.35) saturate(1.22) sepia(0.16) brightness(1.04)';
    case 'duneDesert': return 'sepia(0.42) saturate(1.38) hue-rotate(-22deg) contrast(1.22)';
    case 'bladeRunner': return 'contrast(1.38) saturate(1.48) hue-rotate(185deg) brightness(0.96)';
    case 'interstellar': return 'contrast(1.28) saturate(1.18) brightness(1.06) hue-rotate(12deg)';
    case 'tealOrange': return 'contrast(1.3) saturate(1.35) hue-rotate(-15deg) brightness(1.02)';
    case 'datamosh': return 'contrast(1.4) saturate(1.8) invert(0.08) hue-rotate(45deg)';
    case 'infraredHeat': return 'invert(0.9) hue-rotate(180deg) saturate(2.2) contrast(1.4)';
    case 'crtArcade': return 'contrast(1.35) brightness(1.1) saturate(1.3) sepia(0.1)';
    default: return 'none';
  }
}

function drawTextOverlays(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  overlays: TextOverlay[] | undefined,
  sourceTime: number
) {
  if (!overlays) return;

  for (const o of overlays) {
    if (sourceTime < o.startTime || sourceTime > o.startTime + o.duration) continue;

    // Rich Broadcast Lower Thirds
    if (o.lowerThirdPreset || ['speaker-pill', 'tech-badge', 'social-cta', 'launch-tag'].includes(o.style)) {
      drawLowerThirdOverlay(ctx, width, height, o, sourceTime);
      continue;
    }

    const x = o.position.x * width;
    const y = o.position.y * height;
    const padding = 16;

    ctx.save();
    ctx.font = `600 ${o.fontSize || 24}px Inter, sans-serif`;
    const textWidth = ctx.measureText(o.text).width;
    const cardW = textWidth + padding * 2.5;
    const cardH = (o.fontSize || 24) + padding * 1.5;

    ctx.save();
    ctx.translate(x - cardW / 2, y - cardH / 2);

    if (o.style === 'frosted') {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    } else if (o.style === 'neon') {
      ctx.fillStyle = '#1e1b4b';
      ctx.strokeStyle = '#6466fa';
      ctx.shadowColor = '#6466fa';
      ctx.shadowBlur = 12;
    } else {
      ctx.fillStyle = o.bgColor || '#6466FA';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    }

    ctx.lineWidth = 1.5;
    drawRoundedRect(ctx, 0, 0, cardW, cardH, cardH / 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = o.textColor || '#ffffff';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillText(o.text, cardW / 2, cardH / 2);

    ctx.restore();
    ctx.restore();
  }
}

function drawSubtitles(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  subtitles: SubtitleItem[] | undefined,
  sourceTime: number
) {
  if (!subtitles || subtitles.length === 0) return;

  for (const sub of subtitles) {
    if (sourceTime < sub.startTime || sourceTime > sub.startTime + sub.duration) continue;

    const posY = sub.positionY ?? 0.82;
    const x = width / 2;
    const y = height * posY;
    const textToDraw = sub.uppercase ? sub.text.toUpperCase() : sub.text;
    const fontSize = sub.fontSize || 36;

    const elapsed = sourceTime - sub.startTime;
    const progress = Math.min(1, Math.max(0, elapsed / sub.duration));

    let popScale = 1.0;
    if (sub.style === 'popBounce') {
      if (elapsed < 0.15) {
        const t = elapsed / 0.15;
        popScale = 0.5 + Math.sin(t * Math.PI * 0.5) * 0.65;
      }
    } else if (elapsed < 0.12) {
      popScale = 0.82 + (elapsed / 0.12) * 0.23;
    } else if (elapsed < 0.22) {
      popScale = 1.05 - ((elapsed - 0.12) / 0.10) * 0.05;
    }

    ctx.save();
    ctx.translate(x, y);
    ctx.scale(popScale, popScale);

    const words = textToDraw.trim().split(/\s+/);
    const wordCount = words.length;
    const activeWordIdx = Math.min(wordCount - 1, Math.floor(progress * wordCount));

    if (sub.style === 'hormozi' || sub.style === 'karaoke') {
      ctx.font = `900 ${fontSize}px Impact, "Arial Black", sans-serif`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';

      const spaceWidth = ctx.measureText(' ').width;
      let totalWidth = 0;
      const wordWidths = words.map(w => {
        const wWidth = ctx.measureText(w).width;
        totalWidth += wWidth;
        return wWidth;
      });
      totalWidth += spaceWidth * Math.max(0, wordCount - 1);

      let currentX = -totalWidth / 2;

      words.forEach((word, idx) => {
        const isActive = idx === activeWordIdx;
        const isPast = idx < activeWordIdx;

        ctx.save();
        const wordCenter = currentX + wordWidths[idx] / 2;
        ctx.translate(wordCenter, 0);

        if (isActive) {
          ctx.scale(1.12, 1.12);
        }

        ctx.strokeStyle = sub.strokeHex || '#000000';
        ctx.lineWidth = Math.max(6, fontSize * 0.22);
        ctx.lineJoin = 'round';
        ctx.miterLimit = 2;
        ctx.strokeText(word, -wordWidths[idx] / 2, 0);

        if (isActive) {
          ctx.fillStyle = '#38BDF8';
        } else if (isPast) {
          ctx.fillStyle = sub.colorHex || '#FDE047';
        } else {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        }
        ctx.fillText(word, -wordWidths[idx] / 2, 0);
        ctx.restore();

        currentX += wordWidths[idx] + spaceWidth;
      });
    } else if (sub.style === 'neonGlow' || sub.style === 'popBounce') {
      ctx.font = `800 ${fontSize}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const textWidth = ctx.measureText(textToDraw).width;
      const padX = 24;
      const padY = 12;

      ctx.fillStyle = 'rgba(10, 15, 30, 0.88)';
      ctx.strokeStyle = sub.colorHex || '#38BDF8';
      ctx.shadowColor = sub.colorHex || '#38BDF8';
      ctx.shadowBlur = 18;
      ctx.lineWidth = 2.5;
      drawRoundedRect(ctx, -textWidth / 2 - padX, -fontSize / 2 - padY, textWidth + padX * 2, fontSize + padY * 2, (fontSize + padY * 2) / 2);
      ctx.fill();
      ctx.stroke();

      ctx.shadowBlur = 10;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(textToDraw, 0, 0);
    } else if (sub.style === 'glassCard') {
      ctx.font = `700 ${fontSize}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const textWidth = ctx.measureText(textToDraw).width;
      const padX = 20;
      const padY = 10;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.78)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 1.5;
      drawRoundedRect(ctx, -textWidth / 2 - padX, -fontSize / 2 - padY, textWidth + padX * 2, fontSize + padY * 2, 16);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = sub.colorHex || '#FFFFFF';
      ctx.fillText(textToDraw, 0, 0);
    } else {
      ctx.font = `800 ${fontSize}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      ctx.shadowColor = 'rgba(0,0,0,0.85)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 3;

      ctx.fillStyle = sub.colorHex || '#FFFFFF';
      ctx.fillText(textToDraw, 0, 0);
    }

    ctx.restore();
  }
}

function applyVideoEffects(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  effects?: VideoEffectsConfig
) {
  if (!effects) return;

  if (effects.colorGrade && effects.colorGrade !== 'none') {
    ctx.save();
    if (effects.colorGrade === 'cyberpunk') {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, 'rgba(236, 72, 153, 0.12)');
      grad.addColorStop(1, 'rgba(6, 182, 212, 0.12)');
      ctx.fillStyle = grad;
      ctx.globalCompositeOperation = 'color';
      ctx.fillRect(0, 0, width, height);
    } else if (effects.colorGrade === 'warmSunset') {
      ctx.fillStyle = 'rgba(251, 146, 60, 0.12)';
      ctx.globalCompositeOperation = 'color';
      ctx.fillRect(0, 0, width, height);
    } else if (effects.colorGrade === 'vintageVHS') {
      ctx.fillStyle = 'rgba(180, 140, 80, 0.15)';
      ctx.globalCompositeOperation = 'multiply';
      ctx.fillRect(0, 0, width, height);
    } else if (effects.colorGrade === 'matrix') {
      ctx.fillStyle = 'rgba(16, 185, 129, 0.14)';
      ctx.globalCompositeOperation = 'color';
      ctx.fillRect(0, 0, width, height);
    }
    ctx.restore();
  }

  if (effects.vignette && effects.vignette > 0) {
    ctx.save();
    const radius = Math.max(width, height) * 0.72;
    const vig = ctx.createRadialGradient(width / 2, height / 2, radius * 0.35, width / 2, height / 2, radius);
    vig.addColorStop(0, 'rgba(0,0,0,0)');
    vig.addColorStop(1, `rgba(0,0,0,${Math.min(0.88, effects.vignette * 0.85)})`);
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }

  if (effects.scanlines) {
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.10)';
    for (let y = 0; y < height; y += 4) {
      ctx.fillRect(0, y, width, 1.5);
    }
    ctx.restore();
  }

  // 4. RGB Glitch FX
  if (effects.rgbGlitch && effects.rgbGlitch > 0) {
    ctx.save();
    const glitchOffset = effects.rgbGlitch * 14 * (width / 600);
    const isJitter = Math.sin(Date.now() / 60) > 0.35;
    if (isJitter) {
      ctx.fillStyle = 'rgba(255, 0, 80, 0.09)';
      ctx.fillRect(glitchOffset, 0, width, height);
      ctx.fillStyle = 'rgba(0, 240, 255, 0.09)';
      ctx.fillRect(-glitchOffset, 0, width, height);
    }
    ctx.restore();
  }

  // 5. Spotlight FX
  if (effects.spotlight && effects.spotlight.enabled) {
    ctx.save();
    const spotX = (effects.spotlight.x ?? 0.5) * width;
    const spotY = (effects.spotlight.y ?? 0.5) * height;
    const spotRadius = (effects.spotlight.radius ?? 0.35) * Math.min(width, height);
    const maxRadius = Math.max(width, height) * 0.95;
    const op = Math.min(0.95, effects.spotlight.opacity ?? 0.65);

    const grad = ctx.createRadialGradient(spotX, spotY, spotRadius * 0.35, spotX, spotY, maxRadius);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(1, `rgba(0,0,0,${op})`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }
}

function drawStickers(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  stickers: StickerItem[] | undefined,
  sourceTime: number
) {
  if (!stickers || stickers.length === 0) return;

  for (const s of stickers) {
    if (sourceTime < s.startTime || sourceTime > s.startTime + s.duration) continue;

    const x = s.position.x * width;
    const y = s.position.y * height;
    const size = s.size || 64;
    const elapsed = sourceTime - s.startTime;

    let scale = 1.0;
    let rotation = (s.rotation || 0) * (Math.PI / 180);
    let offsetY = 0;

    if (s.animation === 'pop') {
      if (elapsed < 0.15) {
        scale = 0.5 + (elapsed / 0.15) * 0.7;
      } else if (elapsed < 0.25) {
        scale = 1.2 - ((elapsed - 0.15) / 0.10) * 0.2;
      }
    } else if (s.animation === 'bounce') {
      const bounceCycle = (elapsed * 4) % (Math.PI * 2);
      offsetY = -Math.abs(Math.sin(bounceCycle)) * (size * 0.2);
    } else if (s.animation === 'pulse') {
      scale = 1.0 + Math.sin(elapsed * 6) * 0.12;
    } else if (s.animation === 'float') {
      offsetY = Math.sin(elapsed * 2.5) * (size * 0.15);
    } else if (s.animation === 'spin') {
      rotation += elapsed * 2.0;
    }

    ctx.save();
    ctx.translate(x, y + offsetY);
    ctx.rotate(rotation);
    ctx.scale(scale, scale);

    ctx.font = `${size}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(s.emojiOrIcon, 0, 0);

    ctx.restore();
  }
}

function drawWatermark(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  watermark?: WatermarkConfig
) {
  if (!watermark || !watermark.enabled || !watermark.text) return;

  const pad = 24;
  const scale = watermark.scale || 1.0;
  const fontSize = Math.round(18 * scale);

  ctx.save();
  ctx.globalAlpha = watermark.opacity ?? 0.75;
  ctx.font = `700 ${fontSize}px Inter, sans-serif`;

  const text = watermark.text;
  const textWidth = ctx.measureText(text).width;
  const boxW = textWidth + 24 * scale;
  const boxH = fontSize + 16 * scale;

  let x = pad;
  let y = pad;

  if (watermark.position === 'top-right') {
    x = width - boxW - pad;
    y = pad;
  } else if (watermark.position === 'bottom-left') {
    x = pad;
    y = height - boxH - pad;
  } else if (watermark.position === 'bottom-right') {
    x = width - boxW - pad;
    y = height - boxH - pad;
  }

  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
  ctx.lineWidth = 1;
  drawRoundedRect(ctx, 0, 0, boxW, boxH, boxH / 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, boxW / 2, boxH / 2);

  ctx.restore();
  ctx.restore();
}
