import React, { useRef, useEffect, useState } from 'react';
import { ProjectState } from '../../types/project';
import { getDeviceFrame, CANVAS_ASPECTS } from '../../models/devices';
import { sampleAnimation, sampleTapFeedback } from '../../services/animationSampler';
import { ColorGradeType, VideoEffectsConfig, SubtitleItem, StickerItem, WatermarkConfig } from '../../types/models';
import { 
  draw3DChassisExtrusion, 
  drawSpecularGlare, 
  drawBrowserFrame, 
  drawTerminalFrame, 
  drawStudioDisplayFrame, 
  drawWatchUltraFrame, 
  drawPixelFrame 
} from '../../services/deviceFrameRenderer';
import { computeCursorPosition, drawCursor } from '../../services/cursorService';
import { drawAnimatedMeshGradient, drawAudioSpectrumVisualizer } from '../../services/ambientVisualizerService';
import { drawLowerThirdOverlay } from '../../services/lowerThirdsService';
import { drawBackgroundPattern } from '../../services/backgroundPatternService';
import { drawVideoProgressBar } from '../../services/progressBarService';
import { 
  drawCinematicLetterbox, 
  drawAnamorphicFlare, 
  drawLightLeaks, 
  computeHandheldDrift 
} from '../../services/cinematicEffectsService';
import {
  drawMetaScribbleEffect,
  drawMetaOutlineEffect,
  drawMetaGlitterEffect,
  drawMetaSelectiveBlur,
  drawMetaFlashStrobe,
} from '../../services/metaEditsEffectsService';
import { drawTransitionEffect } from '../../services/transitionsService';
import { drawVHSTapeGlitch, drawVintage8mmFilm, drawPrismRefraction } from '../../services/vintageVFXService';
import { drawTypewriterOverlays, drawImageOverlays } from '../../services/typewriterOverlayService';
import { Upload } from 'lucide-react';

interface CanvasPreviewProps {
  project: ProjectState;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  onOffsetChange: (offset: { width: number; height: number }) => void;
  onTapPositioned?: (position: { x: number; y: number }) => void;
  onOpenFile: () => void;
  onFileSelect?: (file: File) => void;
  onChange?: (updater: Partial<ProjectState>) => void;
}

export const CanvasPreview: React.FC<CanvasPreviewProps> = ({
  project,
  videoRef,
  onOpenFile,
  onFileSelect,
  onChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [frameImg, setFrameImg] = useState<HTMLImageElement | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const loadedImagesMapRef = useRef<Map<string, HTMLImageElement>>(new Map());

  // Preload image overlays
  useEffect(() => {
    if (!project.imageOverlays) return;
    for (const ov of project.imageOverlays) {
      if (ov.imageUrl && !loadedImagesMapRef.current.has(ov.imageUrl)) {
        const img = new Image();
        img.src = ov.imageUrl;
        img.onload = () => {
          loadedImagesMapRef.current.set(ov.imageUrl, img);
        };
      }
    }
  }, [project.imageOverlays]);

  const aspect = CANVAS_ASPECTS[project.canvasAspect];
  const frame = getDeviceFrame(project.deviceModelID, project.deviceColorID);

  // Preload device frame PNG
  useEffect(() => {
    if (frame.kind === 'physical' && frame.imageName) {
      const img = new Image();
      img.src = `./frames/${frame.imageName}`;
      img.onload = () => setFrameImg(img);
    } else {
      setFrameImg(null);
    }
  }, [frame.imageName, frame.kind]);

  // Real-time canvas render loop
  useEffect(() => {
    let animId: number;

    const render = () => {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d', { alpha: true });
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Background
      if (project.background.type !== 'none') {
        if (project.background.type === 'solid') {
          ctx.fillStyle = project.background.hex || '#6466FA';
          ctx.fillRect(0, 0, width, height);
        } else if (project.background.type === 'gradient' && project.background.gradient) {
          const grad = project.background.gradient;
          const rad = (grad.angleDegrees * Math.PI) / 180;
          const x1 = width / 2 - Math.cos(rad) * (width / 2);
          const y1 = height / 2 - Math.sin(rad) * (height / 2);
          const x2 = width / 2 + Math.cos(rad) * (width / 2);
          const y2 = height / 2 + Math.sin(rad) * (height / 2);
          const g = ctx.createLinearGradient(x1, y1, x2, y2);
          g.addColorStop(0, grad.startHex);
          g.addColorStop(1, grad.endHex);
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, width, height);
        } else if (project.background.type === 'videoBlur' && video && video.readyState >= 2) {
          ctx.save();
          ctx.filter = 'blur(30px) brightness(0.65)';
          ctx.drawImage(video, -30, -30, width + 60, height + 60);
          ctx.restore();
        } else {
          // Dynamic Animated Mesh Gradient (Aurora / Cyberpunk / Sunset / Deep Ocean)
          const theme = (project.background as any).theme || 'aurora';
          drawAnimatedMeshGradient(ctx, width, height, video ? video.currentTime : 0, theme);
        }

        // Draw Studio Background Pattern (Dots, Grid, Crosses, Circuit, Radial Lines)
        if (project.background.pattern?.enabled) {
          drawBackgroundPattern(
            ctx,
            width,
            height,
            project.background.pattern.type,
            project.background.pattern.opacity,
            project.background.pattern.colorHex,
            project.background.pattern.scale,
            video ? video.currentTime : 0
          );
        }
      }

      if (video && video.readyState >= 2) {
        const naturalHeightFraction = 0.9;
        const maxH = height * naturalHeightFraction;
        const maxW = width * naturalHeightFraction;

        let effectiveAspect = frame.frameAspectRatio;
        if (frame.kind === 'none' || frame.kind === 'generic') {
          if (video.videoWidth > 0 && video.videoHeight > 0) {
            effectiveAspect = video.videoWidth / video.videoHeight;
          }
        }

        const phoneW = Math.min(maxW, maxH * effectiveAspect);
        const phoneH = effectiveAspect > 0 ? phoneW / effectiveAspect : maxH;

        const sourceTime = video.currentTime;
        const sampled = sampleAnimation(sourceTime, project.animations, project.scale, project.offset);
        const offsetRef = Math.min(width, height);

        const shakeIntensity = project.effects?.cameraShake ?? 0;
        let shakeX = 0;
        let shakeY = 0;
        if (shakeIntensity > 0) {
          const s = shakeIntensity * 20;
          shakeX = (Math.sin(sourceTime * 48) + Math.cos(sourceTime * 72)) * s;
          shakeY = (Math.cos(sourceTime * 52) + Math.sin(sourceTime * 84)) * s;
        }

        ctx.save();
        ctx.translate(
          width / 2 + sampled.offsetX * offsetRef + shakeX,
          height / 2 + sampled.offsetY * offsetRef + shakeY
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
          ctx.shadowBlur = project.effects.deviceGlow.radius || 24;
          ctx.strokeStyle = project.effects.deviceGlow.colorHex || '#6466FA';
          ctx.lineWidth = 3;
          drawRoundedRect(ctx, screenX - bezelWidth / 2, screenY - bezelWidth / 2, phoneW + bezelWidth, phoneH + bezelWidth, cornerRadius + bezelWidth / 2);
          ctx.stroke();
          ctx.restore();
        }

        // Shadow
        if (project.shadow.enabled && project.shadow.opacity > 0) {
          ctx.save();
          const opHex = Math.floor(project.shadow.opacity * 255).toString(16).padStart(2, '0');
          ctx.shadowColor = (project.shadow.colorHex || '#000000') + opHex;
          ctx.shadowBlur = project.shadow.radius;
          ctx.shadowOffsetX = project.shadow.offsetX;
          ctx.shadowOffsetY = project.shadow.offsetY;

          ctx.fillStyle = '#000000';
          if (frame.kind === 'physical' && frameImg && frameImg.complete) {
            ctx.drawImage(frameImg, 0, 0, phoneW, phoneH);
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

        // Draw Video
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

        // Tap feedback
        drawTapEvents(ctx, screenX, screenY, screenW, screenH, project.tapEvents, sourceTime);

        // Screen Studio Mouse Cursor with spline motion & click ripples
        if (project.cursor?.enabled !== false) {
          const cursorPos = computeCursorPosition(sourceTime, project.tapEvents);
          const cursorPixelX = screenX + cursorPos.x * screenW;
          const cursorPixelY = screenY + cursorPos.y * screenH;
          drawCursor(ctx, cursorPixelX, cursorPixelY, cursorPos.isClicking, cursorPos.clickProgress, project.cursor);
        }
        ctx.restore();

        // 3D Specular Glass Glare Sheen on top of screen
        drawSpecularGlare(ctx, screenX, screenY, screenW, screenH, cornerRadius, project, sourceTime);

        // Frame overlay for physical or custom models
        if (frame.kind === 'physical' && frameImg && frameImg.complete) {
          ctx.drawImage(frameImg, 0, 0, phoneW, phoneH);
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
          drawAudioSpectrumVisualizer(ctx, width, height, sourceTime, project.isPlaying, true, 'bars', '#6466FA');
        }

        // Draw Text Overlays & Badges
        drawTextOverlays(ctx, width, height, project.overlays, sourceTime);

        // Draw Subtitles & Kinetic Captions
        drawSubtitles(ctx, width, height, project.subtitles, sourceTime);

        // Draw Animated Stickers & Emojis
        drawStickers(ctx, width, height, project.stickers, sourceTime);

        // Draw Watermark Badge
        drawWatermark(ctx, width, height, project.watermark);

        // Draw Typewriter Stroke Captions & Headings
        drawTypewriterOverlays(ctx, width, height, project.typewriters, sourceTime);

        // Draw Brand Assets & Image Overlays
        drawImageOverlays(ctx, width, height, project.imageOverlays, sourceTime, loadedImagesMapRef.current);

        // Apply Global CapCut Video Effects (Vignette, Film Grain, Bloom, Scanlines)
        applyVideoEffects(ctx, width, height, project.effects);

        // Draw Cinematic 35mm Light Leaks & Film Burns
        if (project.effects?.lightLeaks?.enabled) {
          drawLightLeaks(ctx, width, height, sourceTime, project.effects.lightLeaks);
        }

        // Draw Anamorphic Optical Lens Flare
        if (project.effects?.anamorphicFlare?.enabled) {
          drawAnamorphicFlare(ctx, width, height, sourceTime, project.effects.anamorphicFlare);
        }

        // Draw Hollywood 2.39:1 Widescreen Letterbox Matte
        if (project.effects?.letterbox?.enabled) {
          drawCinematicLetterbox(ctx, width, height, project.effects.letterbox);
        }

        // Draw Meta Edits AI Effects Suite (Scribble, Outline, Glitter, Privacy Blur, Flash Strobe)
        if (project.metaEdits) {
          const targetBounds = { x: screenX, y: screenY, width: screenW, height: screenH, radius: cornerRadius };

          if (project.metaEdits.scribble?.enabled) {
            drawMetaScribbleEffect(ctx, width, height, sourceTime, project.metaEdits.scribble, targetBounds);
          }
          if (project.metaEdits.outline?.enabled) {
            drawMetaOutlineEffect(ctx, width, height, sourceTime, project.metaEdits.outline, targetBounds);
          }
          if (project.metaEdits.glitter?.enabled) {
            drawMetaGlitterEffect(ctx, width, height, sourceTime, project.metaEdits.glitter);
          }
          if (project.metaEdits.selectiveBlur?.enabled) {
            drawMetaSelectiveBlur(ctx, width, height, project.metaEdits.selectiveBlur);
          }
          if (project.metaEdits.flashStrobe?.enabled) {
            drawMetaFlashStrobe(ctx, width, height, sourceTime, project.metaEdits.flashStrobe);
          }
        }

        // Draw Vintage & Retro Glitch Shaders
        if (project.effects?.vhsGlitch?.enabled) {
          drawVHSTapeGlitch(ctx, width, height, sourceTime, project.effects.vhsGlitch.intensity, project.effects.vhsGlitch.showOSD);
        }
        if (project.effects?.vintage8mm?.enabled) {
          drawVintage8mmFilm(ctx, width, height, sourceTime, project.effects.vintage8mm.intensity, project.effects.vintage8mm.dustFlicker);
        }
        if (project.effects?.prismRefraction?.enabled) {
          drawPrismRefraction(ctx, width, height, sourceTime, project.effects.prismRefraction.intensity);
        }

        // Draw Cinema Transitions
        if (project.transitions && project.transitions.length > 0) {
          drawTransitionEffect(ctx, width, height, sourceTime, project.transitions);
        }

        // Draw Viral Video Progress Bar (Reels / Shorts / TikTok)
        if (project.progressBar?.enabled) {
          const totalDur = Math.max(1, project.videoDuration || 10);
          const progressRatio = sourceTime / totalDur;
          drawVideoProgressBar(ctx, width, height, progressRatio, project.progressBar, sourceTime, totalDur);
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [project, frame, frameImg]);

  // Handle on-screen dragging for selected Tap, Callout, Zoom Focus, or Sticker
  const selectedTap = project.selectedEvent?.type === 'tap' 
    ? project.tapEvents.find(t => t.id === project.selectedEvent?.id)
    : null;

  const selectedOverlay = project.selectedEvent?.type === 'overlay'
    ? project.overlays?.find(o => o.id === project.selectedEvent?.id)
    : null;

  const selectedSticker = project.selectedEvent?.type === 'sticker'
    ? (project.stickers || []).find(s => s.id === project.selectedEvent?.id)
    : null;

  const selectedZoom = project.selectedEvent?.type === 'zoom'
    ? project.animations.find(a => a.id === project.selectedEvent?.id)
    : null;

  const getZoomAnchorPos = (zoom: typeof selectedZoom) => {
    if (!zoom) return { x: 0.5, y: 0.5 };
    let nx = zoom.panX ?? 0;
    let ny = zoom.panY ?? 0;
    if (zoom.focus === 'top') { nx = 0; ny = -1; }
    else if (zoom.focus === 'bottom') { nx = 0; ny = 1; }
    else if (zoom.focus === 'left') { nx = -1; ny = 0; }
    else if (zoom.focus === 'right') { nx = 1; ny = 0; }
    else if (zoom.focus === 'top-left') { nx = -1; ny = -1; }
    else if (zoom.focus === 'top-right') { nx = 1; ny = -1; }
    else if (zoom.focus === 'bottom-left') { nx = -1; ny = 1; }
    else if (zoom.focus === 'bottom-right') { nx = 1; ny = 1; }
    else if (zoom.focus === 'center') { nx = 0; ny = 0; }

    return {
      x: (nx + 1) / 2,
      y: (ny + 1) / 2,
    };
  };

  const handlePointerDragZoom = (e: React.PointerEvent) => {
    if (!canvasWrapperRef.current || !onChange || !selectedZoom) return;
    const rect = canvasWrapperRef.current.getBoundingClientRect();

    const updateZoomPan = (clientX: number, clientY: number) => {
      const normX = Math.max(0.05, Math.min(0.95, (clientX - rect.left) / rect.width));
      const normY = Math.max(0.05, Math.min(0.95, (clientY - rect.top) / rect.height));

      const panX = parseFloat(((normX * 2) - 1).toFixed(2));
      const panY = parseFloat(((normY * 2) - 1).toFixed(2));

      onChange({
        animations: project.animations.map(a =>
          a.id === selectedZoom.id ? { ...a, focus: 'custom', panX, panY } : a
        ),
      });
    };

    updateZoomPan(e.clientX, e.clientY);

    const onPointerMove = (moveEv: PointerEvent) => {
      updateZoomPan(moveEv.clientX, moveEv.clientY);
    };

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  const handlePointerDragOverlay = (e: React.PointerEvent) => {
    if (!canvasWrapperRef.current || !onChange) return;
    const rect = canvasWrapperRef.current.getBoundingClientRect();

    const updatePos = (clientX: number, clientY: number) => {
      const normX = Math.max(0.05, Math.min(0.95, (clientX - rect.left) / rect.width));
      const normY = Math.max(0.05, Math.min(0.95, (clientY - rect.top) / rect.height));

      if (selectedTap) {
        onChange({
          tapEvents: project.tapEvents.map(t =>
            t.id === selectedTap.id ? { ...t, position: { x: normX, y: normY } } : t
          ),
        });
      } else if (selectedOverlay) {
        onChange({
          overlays: (project.overlays || []).map(o =>
            o.id === selectedOverlay.id ? { ...o, position: { x: normX, y: normY } } : o
          ),
        });
      } else if (selectedSticker) {
        onChange({
          stickers: (project.stickers || []).map(s =>
            s.id === selectedSticker.id ? { ...s, position: { x: normX, y: normY } } : s
          ),
        });
      }
    };

    updatePos(e.clientX, e.clientY);

    const onPointerMove = (moveEv: PointerEvent) => {
      updatePos(moveEv.clientX, moveEv.clientY);
    };

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  // Dynamic 3D transform style for preview canvas wrapper
  const transform3DStyle: React.CSSProperties = project.transform3D.enabled
    ? {
        transform: `perspective(${project.transform3D.perspective || 1000}px) rotateX(${project.transform3D.rotateX}deg) rotateY(${project.transform3D.rotateY}deg) rotateZ(${project.transform3D.rotateZ}deg)`,
        transition: 'transform 0.15s cubic-bezier(0.2, 0.8, 0.2, 1)',
        transformStyle: 'preserve-3d',
      }
    : {};

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const file = e.dataTransfer.files?.[0];
    if (file && onFileSelect) {
      onFileSelect(file);
    } else if (onOpenFile) {
      onOpenFile();
    }
  };

  return (
    <div 
      ref={containerRef}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex-1 h-full bg-dark-950 flex items-center justify-center p-8 relative overflow-hidden select-none transition-all ${
        isDragOver ? 'bg-brand-950/40 ring-4 ring-inset ring-brand-500/50' : ''
      }`}
    >
      {/* Drag Over Overlay Prompt */}
      {isDragOver && (
        <div className="absolute inset-0 bg-brand-900/80 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
          <div className="w-20 h-20 rounded-3xl bg-brand-500/20 border border-brand-400/40 flex items-center justify-center animate-bounce shadow-2xl shadow-brand-500/50">
            <Upload className="w-10 h-10 text-brand-300" />
          </div>
          <h2 className="text-xl font-bold text-white mt-4">Drop Screen Recording Here</h2>
          <p className="text-xs text-brand-200 mt-1">Import into Maya Studio Pro for Instant Device Mockups & CapCut Export</p>
        </div>
      )}

      {project.videoURL ? (
        <div 
          ref={canvasWrapperRef}
          className="relative shadow-2xl rounded-2xl overflow-hidden border border-slate-800/80 group"
          style={{
            width: aspect.ratio >= 1 ? '580px' : `${580 * aspect.ratio}px`,
            height: aspect.ratio >= 1 ? `${580 / aspect.ratio}px` : '580px',
            maxHeight: 'calc(100vh - 320px)',
            maxWidth: 'calc(100vw - 640px)',
            ...transform3DStyle,
          }}
        >
          <canvas
            ref={canvasRef}
            width={1080}
            height={Math.round(1080 / aspect.ratio)}
            className="w-full h-full object-contain block bg-transparent"
          />

          {/* Interactive Screen Drag Handle for Selected Zoom Focus */}
          {selectedZoom && (
            <div
              onPointerDown={handlePointerDragZoom}
              className="absolute -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-2 border-brand-400 bg-brand-500/25 flex items-center justify-center cursor-move shadow-xl shadow-brand-500/50 z-40 group/zoom-handle hover:scale-110 transition-transform"
              style={{
                left: `${getZoomAnchorPos(selectedZoom).x * 100}%`,
                top: `${getZoomAnchorPos(selectedZoom).y * 100}%`,
              }}
              title="Drag to Pan Zoom Focus Target"
            >
              <div className="w-2.5 h-2.5 bg-white rounded-full shadow" />
              <div className="absolute inset-0 border border-brand-300/40 rounded-full animate-ping pointer-events-none" />
              <span className="absolute -bottom-5 px-1.5 py-0.5 rounded bg-dark-950/90 border border-brand-500/40 text-[9px] font-mono text-brand-300 whitespace-nowrap shadow pointer-events-none">
                Pan Focus ({((selectedZoom.panX ?? 0) >= 0 ? '+' : '') + (selectedZoom.panX ?? 0)}, {((selectedZoom.panY ?? 0) >= 0 ? '+' : '') + (selectedZoom.panY ?? 0)})
              </span>
            </div>
          )}

          {/* Interactive Screen Drag Handle for Selected Tap */}
          {selectedTap && (
            <div
              onPointerDown={handlePointerDragOverlay}
              className="absolute -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border-2 border-pink-400 bg-pink-500/30 flex items-center justify-center cursor-move shadow-lg shadow-pink-500/50 animate-pulse z-40"
              style={{
                left: `${selectedTap.position.x * 100}%`,
                top: `${selectedTap.position.y * 100}%`,
              }}
              title="Drag to reposition Tap target"
            >
              <div className="w-2.5 h-2.5 bg-white rounded-full shadow" />
            </div>
          )}

          {/* Interactive Screen Drag Handle for Selected Callout */}
          {selectedOverlay && (
            <div
              onPointerDown={handlePointerDragOverlay}
              className="absolute -translate-x-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl border-2 border-dashed border-emerald-400 bg-emerald-500/20 flex items-center space-x-1 cursor-move shadow-lg shadow-emerald-500/30 z-40"
              style={{
                left: `${selectedOverlay.position.x * 100}%`,
                top: `${selectedOverlay.position.y * 100}%`,
              }}
              title="Drag to reposition Callout"
            >
              <span className="text-[11px] font-semibold text-emerald-200 truncate max-w-[140px]">
                {selectedOverlay.text || 'Callout'}
              </span>
            </div>
          )}

          {/* Interactive Screen Drag Handle for Selected Sticker */}
          {selectedSticker && (
            <div
              onPointerDown={handlePointerDragOverlay}
              className="absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-2xl border-2 border-dashed border-amber-400 bg-amber-500/25 flex items-center justify-center cursor-move shadow-xl shadow-amber-500/30 z-40 hover:scale-110 transition-transform"
              style={{
                left: `${selectedSticker.position.x * 100}%`,
                top: `${selectedSticker.position.y * 100}%`,
              }}
              title="Drag to reposition Sticker"
            >
              <span className="text-3xl select-none leading-none">{selectedSticker.emojiOrIcon}</span>
            </div>
          )}
        </div>
      ) : (
        <div 
          onClick={onOpenFile}
          className="max-w-md w-full flex flex-col items-center justify-center space-y-5 p-10 rounded-3xl border-2 border-dashed border-slate-800 hover:border-brand-500/60 bg-dark-900/50 hover:bg-dark-900/80 transition-all cursor-pointer group shadow-2xl text-center"
        >
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-brand-600/30 via-indigo-500/20 to-cyan-500/20 border border-brand-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xl shadow-brand-500/20">
            <Upload className="w-10 h-10 text-brand-400" />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-bold text-slate-100 text-base">Drag & Drop Screen Recording</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Supports MP4, MOV, and WebM video recordings.<br />Or click anywhere to select a file from disk.
            </p>
          </div>

          {/* Studio Feature Chips */}
          <div className="grid grid-cols-2 gap-2 pt-2 w-full text-left">
            <div className="p-2.5 rounded-xl bg-dark-950/80 border border-slate-800/80 flex items-center space-x-2">
              <span className="text-base">📱</span>
              <div>
                <div className="text-[11px] font-semibold text-slate-200">3D Device Frames</div>
                <div className="text-[9px] text-slate-400">iPhone 17 Pro, Mac, Pixel 9</div>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-dark-950/80 border border-slate-800/80 flex items-center space-x-2">
              <span className="text-base">✨</span>
              <div>
                <div className="text-[11px] font-semibold text-slate-200">CapCut / JianYing</div>
                <div className="text-[9px] text-slate-400">1-Click Draft Export</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

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
      ctx.beginPath();
      ctx.arc(0, 0, (diameter / 2) * sample.ringScale, 0, Math.PI * 2);
      ctx.strokeStyle = colorHex;
      ctx.globalAlpha = sample.ringOpacity;
      ctx.lineWidth = Math.max(2, diameter * 0.055);
      ctx.stroke();

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

function drawTextOverlays(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  overlays: any[],
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

    // Draw pill card
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

    // Draw text
    ctx.fillStyle = o.textColor || '#ffffff';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillText(o.text, cardW / 2, cardH / 2);

    ctx.restore();
    ctx.restore();
  }
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

    // Pop scale entrance animation
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

        // Bold black outline stroke
        ctx.strokeStyle = sub.strokeHex || '#000000';
        ctx.lineWidth = Math.max(6, fontSize * 0.22);
        ctx.lineJoin = 'round';
        ctx.miterLimit = 2;
        ctx.strokeText(word, -wordWidths[idx] / 2, 0);

        // Word Fill Color
        if (isActive) {
          ctx.fillStyle = '#38BDF8'; // High contrast active word cyan highlight
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
      // Minimal
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

  // 1. Color Grade Gradient Filter Overlay
  if (effects.colorGrade && effects.colorGrade !== 'none') {
    ctx.save();
    if (effects.colorGrade === 'cyberpunk') {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, 'rgba(236, 72, 153, 0.12)'); // pink
      grad.addColorStop(1, 'rgba(6, 182, 212, 0.12)'); // cyan
      ctx.fillStyle = grad;
      ctx.globalCompositeOperation = 'color';
      ctx.fillRect(0, 0, width, height);
    } else if (effects.colorGrade === 'warmSunset') {
      ctx.fillStyle = 'rgba(251, 146, 60, 0.12)'; // amber
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

  // 2. Vignette
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

  // 3. CRT Scanlines
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
    const glitchOffset = effects.rgbGlitch * 14;
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

  // 6. Rule-of-Thirds Grid
  if (effects.showGrid) {
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
    ctx.lineWidth = 1;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(width / 3, 0);
    ctx.lineTo(width / 3, height);
    ctx.moveTo((2 * width) / 3, 0);
    ctx.lineTo((2 * width) / 3, height);
    ctx.moveTo(0, height / 3);
    ctx.lineTo(width, height / 3);
    ctx.moveTo(0, (2 * height) / 3);
    ctx.lineTo(width, (2 * height) / 3);
    ctx.stroke();
    ctx.restore();
  }

  // 7. Safe Zones Overlay (TikTok / Reels 9:16)
  if (effects.showSafeZones) {
    ctx.save();
    ctx.strokeStyle = 'rgba(234, 179, 8, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(width * 0.08, height * 0.12, width * 0.84, height * 0.68);
    ctx.fillStyle = '#EAB308';
    ctx.font = '600 13px Inter, sans-serif';
    ctx.fillText('TikTok / Shorts Safe Zone', width * 0.08 + 10, height * 0.12 + 20);
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
