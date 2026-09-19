import React, { useRef, useState, useCallback, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Hand, 
  Gauge, 
  Type, 
  Music, 
  Trash2, 
  Scissors, 
  GripVertical, 
  MoveHorizontal, 
  Subtitles, 
  Smile, 
  Wand2, 
  ChevronDown,
  Tv,
  Magnet,
  Zap,
  RotateCw,
  Crown,
  Shield
} from 'lucide-react';
import { ProjectState } from '../../types/project';
import { SpeedTimeline } from '../../models/speedTimeline';
import { ZoomSegment, TapEvent, SpeedSegment, TextOverlay, AudioTrack, SubtitleItem, StickerItem, TransitionItem, TypewriterOverlayItem, ImageOverlayItem } from '../../types/models';
import { soundManager, AUDIO_SFX_PRESETS } from '../../services/audioService';
import { generateSmartZoomsFromClicks } from '../../services/autoZoomService';
import { analyzeAudioForBeats, generateZoomsOnBeats, snapTimeToNearestBeat } from '../../services/beatDetectionService';
import { AudioImportModal } from './AudioImportModal';

interface TimelineProps {
  project: ProjectState;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  onSeek: (time: number) => void;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onChange: (updater: Partial<ProjectState>) => void;
  onOpenStickerPicker?: () => void;
  onOpenLowerThirds?: () => void;
  onOpenSFXLibrary?: () => void;
  onOpenTransitions?: () => void;
  onOpenTypewriter?: () => void;
  onOpenBrandAssets?: () => void;
}

interface DraggableBlockProps {
  id: string;
  type: 'zoom' | 'tap' | 'overlay' | 'speed' | 'audio' | 'subtitle' | 'sticker' | 'transition' | 'typewriter' | 'imageOverlay';
  timelineStart: number;
  duration: number;
  totalDuration: number;
  isSelected: boolean;
  colorClass: {
    bg: string;
    border: string;
    text: string;
    selectedBg: string;
    selectedBorder: string;
    handleBg: string;
  };
  label: string;
  icon?: React.ReactNode;
  waveformData?: number[];
  beatTimestamps?: number[];
  bpm?: number;
  onSelect: () => void;
  onSeekToStart: () => void;
  onMove: (newTimelineStart: number) => void;
  onResizeStart: (newTimelineStart: number, newDuration: number) => void;
  onResizeEnd: (newDuration: number) => void;
  getTrackWidth: () => number;
}

function generateRulerTicks(totalSeconds: number): { time: number; label: string; pct: number }[] {
  if (totalSeconds <= 0) return [];
  let step = 1;
  if (totalSeconds > 60) step = 10;
  else if (totalSeconds > 30) step = 5;
  else if (totalSeconds > 15) step = 2;

  const ticks: { time: number; label: string; pct: number }[] = [];
  for (let t = 0; t <= totalSeconds; t += step) {
    const mins = Math.floor(t / 60);
    const secs = Math.floor(t % 60);
    const label = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    ticks.push({
      time: t,
      label,
      pct: (t / totalSeconds) * 100,
    });
  }
  return ticks;
}

const DraggableBlock: React.FC<DraggableBlockProps> = ({
  timelineStart,
  duration,
  totalDuration,
  isSelected,
  colorClass,
  label,
  icon,
  waveformData,
  beatTimestamps,
  bpm,
  onSelect,
  onSeekToStart,
  onMove,
  onResizeStart,
  onResizeEnd,
  getTrackWidth,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState<'move' | 'resize-left' | 'resize-right' | null>(null);
  const [dragInfo, setDragInfo] = useState<{ start: number; dur: number } | null>(null);

  const leftPct = totalDuration > 0 ? (timelineStart / totalDuration) * 100 : 0;
  const widthPct = totalDuration > 0 ? (duration / totalDuration) * 100 : 0;

  const startDrag = (e: React.PointerEvent, mode: 'move' | 'resize-left' | 'resize-right') => {
    e.stopPropagation();
    e.preventDefault();
    onSelect();

    const trackWidth = getTrackWidth() || 800;
    const startX = e.clientX;
    const initialStart = timelineStart;
    const initialDur = duration;
    const initialEnd = initialStart + initialDur;

    setIsDragging(true);
    setDragMode(mode);
    setDragInfo({ start: initialStart, dur: initialDur });

    const handlePointerMove = (moveEv: PointerEvent) => {
      const deltaX = moveEv.clientX - startX;
      const deltaSec = (deltaX / trackWidth) * totalDuration;

      if (mode === 'move') {
        const newStart = Math.max(0, Math.min(totalDuration - initialDur, initialStart + deltaSec));
        setDragInfo({ start: newStart, dur: initialDur });
        onMove(newStart);
      } else if (mode === 'resize-left') {
        const newStart = Math.max(0, Math.min(initialEnd - 0.15, initialStart + deltaSec));
        const newDur = initialEnd - newStart;
        setDragInfo({ start: newStart, dur: newDur });
        onResizeStart(newStart, newDur);
      } else if (mode === 'resize-right') {
        const newDur = Math.max(0.15, Math.min(totalDuration - initialStart, initialDur + deltaSec));
        setDragInfo({ start: initialStart, dur: newDur });
        onResizeEnd(newDur);
      }
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      setDragMode(null);
      setDragInfo(null);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  return (
    <div
      onDoubleClick={(e) => {
        e.stopPropagation();
        onSeekToStart();
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      className={`absolute top-0.5 bottom-0.5 rounded-lg flex items-center select-none group transition-shadow overflow-hidden ${
        isSelected
          ? `${colorClass.selectedBg} ${colorClass.selectedBorder} shadow-lg ring-2 ring-white/60 z-30`
          : `${colorClass.bg} ${colorClass.border} hover:brightness-110 z-10`
      }`}
      style={{
        left: `${Math.max(0, Math.min(99, leftPct))}%`,
        width: `${Math.max(1.8, Math.min(100 - leftPct, widthPct))}%`,
      }}
    >
      {/* Background Audio Waveform Graph */}
      {waveformData && waveformData.length > 0 && (
        <div className="absolute inset-0 flex items-center justify-around px-2 pointer-events-none opacity-30 z-0">
          {waveformData.slice(0, 60).map((peak, idx) => (
            <div
              key={idx}
              className="w-[2px] bg-white rounded-full"
              style={{ height: `${Math.max(15, peak * 85)}%` }}
            />
          ))}
        </div>
      )}

      {/* Musical Beat Marker Lines */}
      {beatTimestamps && duration > 0 && beatTimestamps.map((bTime, bIdx) => {
        if (bTime < timelineStart || bTime > timelineStart + duration) return null;
        const relPct = ((bTime - timelineStart) / duration) * 100;
        return (
          <div
            key={bIdx}
            className="absolute top-0 bottom-0 w-[1.5px] bg-amber-300/80 shadow-[0_0_3px_#FDE047] pointer-events-none z-0"
            style={{ left: `${relPct}%` }}
          />
        );
      })}

      {/* Tooltip on drag */}
      {isDragging && dragInfo && (
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-dark-900 border border-slate-700 text-white text-[10px] font-mono px-2 py-0.5 rounded shadow-xl whitespace-nowrap z-50 pointer-events-none">
          Start: {dragInfo.start.toFixed(2)}s | Dur: {dragInfo.dur.toFixed(2)}s
        </div>
      )}

      {/* Left Resize Handle */}
      <div
        onPointerDown={(e) => startDrag(e, 'resize-left')}
        title="Drag to trim start time"
        className="w-2.5 h-full cursor-ew-resize flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-white/30 rounded-l transition-opacity z-10"
      >
        <div className="w-[2px] h-3 bg-white/70 rounded-full" />
      </div>

      {/* Center Drag to Move */}
      <div
        onPointerDown={(e) => startDrag(e, 'move')}
        title="Click to select, drag to reposition on timeline"
        className="flex-1 h-full cursor-grab active:cursor-grabbing flex items-center px-1 overflow-hidden z-10 justify-between"
      >
        <div className="flex items-center space-x-1 truncate">
          {icon && <span className="mr-1 shrink-0 opacity-80">{icon}</span>}
          <span className={`text-[10px] font-semibold truncate ${colorClass.text}`}>
            {label}
          </span>
        </div>
        {bpm && (
          <span className="text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded-full shrink-0 ml-1">
            {bpm} BPM
          </span>
        )}
      </div>

      {/* Right Resize Handle */}
      <div
        onPointerDown={(e) => startDrag(e, 'resize-right')}
        title="Drag to adjust duration"
        className="w-2.5 h-full cursor-ew-resize flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-white/30 rounded-r transition-opacity z-10"
      >
        <div className="w-[2px] h-3 bg-white/70 rounded-full" />
      </div>
    </div>
  );
};

export const Timeline: React.FC<TimelineProps> = ({
  project,
  onSeek,
  onTogglePlay,
  onToggleMute,
  onChange,
  onOpenStickerPicker,
  onOpenLowerThirds,
  onOpenSFXLibrary,
  onOpenTransitions,
  onOpenTypewriter,
  onOpenBrandAssets,
}) => {
  const tracksRef = useRef<HTMLDivElement>(null);
  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);
  const [isSFXMenuOpen, setIsSFXMenuOpen] = useState(false);
  const [isScrubbing, setIsScrubbing] = useState(false);

  const speedTimeline = new SpeedTimeline(
    project.trimStartTime,
    project.trimEndTime,
    project.speedSegments
  );

  const totalDuration = speedTimeline.duration || project.videoDuration || 10;
  const playheadPercent = totalDuration > 0 ? (project.currentSeconds / totalDuration) * 100 : 0;

  const getTrackWidth = useCallback(() => {
    return tracksRef.current?.getBoundingClientRect().width || 800;
  }, []);

  const handleTrackPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!tracksRef.current || totalDuration <= 0) return;
    setIsScrubbing(true);

    const updateSeekFromEvent = (clientX: number) => {
      if (!tracksRef.current) return;
      const rect = tracksRef.current.getBoundingClientRect();
      const clickX = clientX - rect.left;
      const fraction = Math.max(0, Math.min(1, clickX / rect.width));
      const targetSeconds = fraction * totalDuration;
      onSeek(targetSeconds);
    };

    updateSeekFromEvent(e.clientX);

    const handlePointerMove = (moveEv: PointerEvent) => {
      updateSeekFromEvent(moveEv.clientX);
    };

    const handlePointerUp = () => {
      setIsScrubbing(false);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  const handleSplitAtPlayhead = useCallback(() => {
    const t = project.currentSeconds;

    // Split selected or active Zoom
    const zoomToSplit = project.animations.find(a => t > a.startTime + 0.1 && t < a.startTime + a.duration - 0.1);
    if (zoomToSplit) {
      const firstDur = t - zoomToSplit.startTime;
      const secondDur = zoomToSplit.duration - firstDur;
      const firstZoom = { ...zoomToSplit, duration: firstDur };
      const secondZoom = { ...zoomToSplit, id: crypto.randomUUID(), startTime: t, duration: secondDur };
      onChange({
        animations: project.animations.map(a => a.id === zoomToSplit.id ? firstZoom : a).concat(secondZoom),
        selectedEvent: { type: 'zoom', id: secondZoom.id },
      });
      soundManager.playWhoosh();
      return;
    }

    // Split selected or active Audio Track
    const audioToSplit = project.audioTracks?.find(a => t > a.startTime + 0.2 && t < a.startTime + a.duration - 0.2);
    if (audioToSplit) {
      const firstDur = t - audioToSplit.startTime;
      const secondDur = audioToSplit.duration - firstDur;
      const firstAudio = { ...audioToSplit, duration: firstDur };
      const secondAudio = { ...audioToSplit, id: crypto.randomUUID(), startTime: t, duration: secondDur };
      onChange({
        audioTracks: (project.audioTracks || []).map(a => a.id === audioToSplit.id ? firstAudio : a).concat(secondAudio),
        selectedEvent: { type: 'audio', id: secondAudio.id },
      });
      soundManager.playWhoosh();
      return;
    }

    // Split selected or active Subtitle
    const subToSplit = project.subtitles?.find(s => t > s.startTime + 0.2 && t < s.startTime + s.duration - 0.2);
    if (subToSplit) {
      const firstDur = t - subToSplit.startTime;
      const secondDur = subToSplit.duration - firstDur;
      const words = subToSplit.text.split(' ');
      const half = Math.max(1, Math.floor(words.length / 2));
      const firstSub = { ...subToSplit, text: words.slice(0, half).join(' '), duration: firstDur };
      const secondSub = { ...subToSplit, id: crypto.randomUUID(), text: words.slice(half).join(' '), startTime: t, duration: secondDur };
      onChange({
        subtitles: (project.subtitles || []).map(s => s.id === subToSplit.id ? firstSub : s).concat(secondSub),
        selectedEvent: { type: 'subtitle', id: secondSub.id },
      });
      soundManager.playWhoosh();
      return;
    }
  }, [project, onChange]);

  const setInPoint = useCallback(() => {
    const cur = project.currentSeconds;
    const maxEnd = project.trimEndTime > 0 ? project.trimEndTime : (project.videoDuration || totalDuration);
    const newTrimStart = Math.min(cur, maxEnd - 0.5);
    onChange({ trimStartTime: Math.max(0, newTrimStart) });
    soundManager.playPop();
  }, [project.currentSeconds, project.trimEndTime, project.videoDuration, totalDuration, onChange]);

  const setOutPoint = useCallback(() => {
    const cur = project.currentSeconds;
    const minStart = project.trimStartTime || 0;
    const newTrimEnd = Math.max(cur, minStart + 0.5);
    onChange({ trimEndTime: Math.min(project.videoDuration || totalDuration, newTrimEnd) });
    soundManager.playPop();
  }, [project.currentSeconds, project.trimStartTime, project.videoDuration, totalDuration, onChange]);

  const resetTrim = useCallback(() => {
    onChange({
      trimStartTime: 0,
      trimEndTime: project.videoDuration || totalDuration,
    });
    soundManager.playDing();
  }, [project.videoDuration, totalDuration, onChange]);

  // Global Hotkeys for Timeline (I, O, S, Space, Delete)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        handleSplitAtPlayhead();
      } else if (e.key === 'i' || e.key === 'I') {
        e.preventDefault();
        setInPoint();
      } else if (e.key === 'o' || e.key === 'O') {
        e.preventDefault();
        setOutPoint();
      } else if (e.key === ' ') {
        e.preventDefault();
        onTogglePlay();
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (project.selectedEvent) {
          e.preventDefault();
          removeSelected();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSplitAtPlayhead, setInPoint, setOutPoint, onTogglePlay, project.selectedEvent]);

  const addZoom = () => {
    soundManager.playWhoosh();
    const sourceTime = speedTimeline.sourceTime(project.currentSeconds);
    const newZoom: ZoomSegment = {
      id: crypto.randomUUID(),
      startTime: Math.max(0, sourceTime),
      duration: 2.0,
      scale: 1.35,
      focus: 'center',
      transitionIn: 0.45,
      transitionOut: 0.45,
      curve: 'spring',
    };
    onChange({
      animations: [...project.animations, newZoom],
      selectedEvent: { type: 'zoom', id: newZoom.id },
    });
  };

  const handleAutoZooms = () => {
    soundManager.playWhoosh();
    if (!project.tapEvents || project.tapEvents.length === 0) {
      alert('Add some click/tap events first or record your interactions, then click Auto-Detect Zooms!');
      return;
    }
    const smartZooms = generateSmartZoomsFromClicks(project.tapEvents, totalDuration);
    if (smartZooms.length === 0) {
      alert('No distinct tap clusters found to generate zooms from.');
      return;
    }
    onChange({
      animations: [...project.animations, ...smartZooms],
      selectedEvent: smartZooms[0] ? { type: 'zoom', id: smartZooms[0].id } : project.selectedEvent,
    });
  };

  const addTap = () => {
    soundManager.playTapClick();
    const sourceTime = speedTimeline.sourceTime(project.currentSeconds);
    const newTap: TapEvent = {
      id: crypto.randomUUID(),
      startTime: Math.max(0, sourceTime),
      duration: 0.65,
      position: { x: 0.5, y: 0.5 },
      style: 'ripple',
      diameterFraction: 0.18,
      colorHex: '#6466FA',
      playSound: true,
    };
    onChange({
      tapEvents: [...project.tapEvents, newTap],
      selectedEvent: { type: 'tap', id: newTap.id },
    });
  };

  const addOverlay = () => {
    const sourceTime = speedTimeline.sourceTime(project.currentSeconds);
    const newOverlay: TextOverlay = {
      id: crypto.randomUUID(),
      startTime: Math.max(0, sourceTime),
      duration: 2.5,
      text: 'Feature Highlight 🚀',
      position: { x: 0.5, y: 0.82 },
      style: 'pill',
      bgColor: '#6466FA',
      textColor: '#ffffff',
      fontSize: 22,
    };
    onChange({
      overlays: [...(project.overlays || []), newOverlay],
      selectedEvent: { type: 'overlay', id: newOverlay.id },
    });
  };

  const addSpeed = () => {
    const sourceTime = speedTimeline.sourceTime(project.currentSeconds);
    const newSpeed: SpeedSegment = {
      id: crypto.randomUUID(),
      startTime: Math.max(0, sourceTime),
      duration: 2.0,
      rate: 2.0,
    };
    onChange({
      speedSegments: [...project.speedSegments, newSpeed],
      selectedEvent: { type: 'speed', id: newSpeed.id },
    });
  };

  const addSubtitle = () => {
    const sourceTime = speedTimeline.sourceTime(project.currentSeconds);
    const newSub: SubtitleItem = {
      id: crypto.randomUUID(),
      startTime: Math.max(0, sourceTime),
      duration: 2.0,
      text: 'VIRAL CAPTION',
      style: 'hormozi',
      fontSize: 38,
      colorHex: '#FDE047',
      strokeHex: '#000000',
      uppercase: true,
      positionY: 0.82,
    };
    onChange({
      subtitles: [...(project.subtitles || []), newSub],
      selectedEvent: { type: 'subtitle', id: newSub.id },
    });
  };

  const addSticker = () => {
    if (onOpenStickerPicker) {
      onOpenStickerPicker();
    } else {
      const sourceTime = speedTimeline.sourceTime(project.currentSeconds);
      const newSticker: StickerItem = {
        id: crypto.randomUUID(),
        startTime: Math.max(0, sourceTime),
        duration: 2.5,
        emojiOrIcon: '🔥',
        position: { x: 0.5, y: 0.5 },
        size: 64,
        animation: 'pop',
      };
      onChange({
        stickers: [...(project.stickers || []), newSticker],
        selectedEvent: { type: 'sticker', id: newSticker.id },
      });
    }
  };

  const addTypewriter = () => {
    if (onOpenTypewriter) {
      onOpenTypewriter();
    } else {
      const sourceTime = speedTimeline.sourceTime(project.currentSeconds);
      const newTypewriter: TypewriterOverlayItem = {
        id: crypto.randomUUID(),
        startTime: Math.max(0, sourceTime),
        duration: 4.5,
        text: 'ZOTH STUDIO · WEBGEN TERMINAL',
        subtitle: 'Interactive Sovereign PTY Engine · Real-time Autonomous App Foundry',
        tag: 'PHASE 01 // SYNTHESIS',
        style: 'stroke-typewriter',
        fontSize: 34,
        strokeWidth: 5,
        textColor: '#FFFFFF',
        accentColor: '#00F0FF',
        typingSpeedCps: 26,
        showCursor: true,
        cursorChar: '█',
        position: { x: 0.5, y: 0.18 },
        align: 'center',
      };
      onChange({
        typewriters: [...(project.typewriters || []), newTypewriter],
        selectedEvent: { type: 'typewriter', id: newTypewriter.id },
      });
    }
  };

  const addBrandAsset = () => {
    if (onOpenBrandAssets) {
      onOpenBrandAssets();
    } else {
      const sourceTime = speedTimeline.sourceTime(project.currentSeconds);
      const newImg: ImageOverlayItem = {
        id: crypto.randomUUID(),
        startTime: Math.max(0, sourceTime),
        duration: 6.0,
        imageUrl: './assets/branding/zoth-navbar-logo-nobg.png',
        name: 'Zoth Studio Navbar Logo',
        position: { x: 0.18, y: 0.08 },
        scale: 0.48,
        opacity: 0.95,
        animation: 'fade',
      };
      onChange({
        imageOverlays: [...(project.imageOverlays || []), newImg],
        selectedEvent: { type: 'imageOverlay', id: newImg.id },
      });
    }
  };

  const handleAudioImported = async (audioData: { url: string; name: string }) => {
    const newAudio: AudioTrack = {
      id: crypto.randomUUID(),
      url: audioData.url,
      name: audioData.name,
      volume: 0.8,
      startTime: 0,
      duration: totalDuration,
      isMuted: false,
    };

    // Auto-detect BPM and beats in background
    try {
      const beatData = await analyzeAudioForBeats(audioData.url);
      newAudio.bpm = beatData.bpm;
      newAudio.beatTimestamps = beatData.beatTimestamps;
      newAudio.waveformData = beatData.waveform;
    } catch (e) {
      console.warn('Auto beat detection skipped:', e);
    }

    onChange({
      audioTracks: [...(project.audioTracks || []), newAudio],
      selectedEvent: { type: 'audio', id: newAudio.id },
    });
  };

  const handleDetectBPM = async (track: AudioTrack) => {
    try {
      const beatData = await analyzeAudioForBeats(track.url);
      onChange({
        audioTracks: (project.audioTracks || []).map(a =>
          a.id === track.id
            ? { ...a, bpm: beatData.bpm, beatTimestamps: beatData.beatTimestamps, waveformData: beatData.waveform }
            : a
        ),
      });
    } catch (err) {
      console.error('Failed to detect BPM:', err);
    }
  };

  const handleAutoSyncZoomsToBeats = () => {
    const audioWithBeats = (project.audioTracks || []).find(a => a.beatTimestamps && a.beatTimestamps.length > 0);
    if (!audioWithBeats || !audioWithBeats.beatTimestamps) {
      alert('Please import a music track first or click "Detect BPM" on an audio track to extract beats.');
      return;
    }

    const beatZooms = generateZoomsOnBeats(audioWithBeats.beatTimestamps, 4, 1.5, 1.35);
    onChange({
      animations: [...project.animations, ...beatZooms],
      selectedEvent: beatZooms[0] ? { type: 'zoom', id: beatZooms[0].id } : project.selectedEvent,
    });
  };

  const removeSelected = () => {
    if (!project.selectedEvent) return;
    if (project.selectedEvent.type === 'zoom') {
      onChange({
        animations: project.animations.filter(a => a.id !== project.selectedEvent?.id),
        selectedEvent: null,
      });
    } else if (project.selectedEvent.type === 'tap') {
      onChange({
        tapEvents: project.tapEvents.filter(t => t.id !== project.selectedEvent?.id),
        selectedEvent: null,
      });
    } else if (project.selectedEvent.type === 'overlay') {
      onChange({
        overlays: (project.overlays || []).filter(o => o.id !== project.selectedEvent?.id),
        selectedEvent: null,
      });
    } else if (project.selectedEvent.type === 'subtitle') {
      onChange({
        subtitles: (project.subtitles || []).filter(s => s.id !== project.selectedEvent?.id),
        selectedEvent: null,
      });
    } else if (project.selectedEvent.type === 'sticker') {
      onChange({
        stickers: (project.stickers || []).filter(s => s.id !== project.selectedEvent?.id),
        selectedEvent: null,
      });
    } else if (project.selectedEvent.type === 'transition') {
      onChange({
        transitions: (project.transitions || []).filter(tr => tr.id !== project.selectedEvent?.id),
        selectedEvent: null,
      });
    } else if (project.selectedEvent.type === 'audio') {
      onChange({
        audioTracks: (project.audioTracks || []).filter(a => a.id !== project.selectedEvent?.id),
        selectedEvent: null,
      });
    } else if (project.selectedEvent.type === 'speed') {
      onChange({
        speedSegments: project.speedSegments.filter(s => s.id !== project.selectedEvent?.id),
        selectedEvent: null,
      });
    } else if (project.selectedEvent.type === 'typewriter') {
      onChange({
        typewriters: (project.typewriters || []).filter(tw => tw.id !== project.selectedEvent?.id),
        selectedEvent: null,
      });
    } else if (project.selectedEvent.type === 'imageOverlay') {
      onChange({
        imageOverlays: (project.imageOverlays || []).filter(img => img.id !== project.selectedEvent?.id),
        selectedEvent: null,
      });
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    const ms = Math.floor((secs % 1) * 10);
    return `${mins}:${s.toString().padStart(2, '0')}.${ms}`;
  };

  const [activeMenu, setActiveMenu] = useState<'audio' | 'motion' | 'text' | 'vfx' | null>(null);

  useEffect(() => {
    const handleClickOutside = () => {
      setActiveMenu(null);
      setIsSFXMenuOpen(false);
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="h-80 border-t border-slate-800/80 bg-dark-950 flex flex-col select-none">
      <AudioImportModal
        isOpen={isAudioModalOpen}
        onClose={() => setIsAudioModalOpen(false)}
        onAudioImported={handleAudioImported}
      />

      {/* Toolbar */}
      <div className="h-10 border-b border-slate-800/80 px-4 flex items-center justify-between text-xs bg-dark-950/90 z-20">
        {/* Playback Controls */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={onTogglePlay}
            className="w-7 h-7 rounded-lg bg-brand-600 hover:bg-brand-500 text-white flex items-center justify-center transition shadow-sm active:scale-95"
            title={project.isPlaying ? "Pause (Space)" : "Play (Space)"}
          >
            {project.isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
          </button>
          <button
            onClick={onToggleMute}
            className="w-7 h-7 rounded-lg bg-dark-850 hover:bg-dark-800 text-slate-400 hover:text-slate-200 border border-slate-800 flex items-center justify-center transition"
            title={project.isMuted ? "Unmute" : "Mute"}
          >
            {project.isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
          <span className="font-mono text-slate-300 text-xs tracking-tight">
            {formatTime(project.currentSeconds)} <span className="text-slate-600">/</span> {formatTime(totalDuration)}
          </span>

          {/* In / Out Video Trim Buttons */}
          <div className="flex items-center space-x-1 border-l border-slate-800 pl-2">
            <button
              onClick={setInPoint}
              title="Set In-point (I)"
              className="px-2 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition text-[10px] font-medium"
            >
              [ In (I)
            </button>
            <button
              onClick={setOutPoint}
              title="Set Out-point (O)"
              className="px-2 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition text-[10px] font-medium"
            >
              Out (O) ]
            </button>
            {(project.trimStartTime > 0 || (project.trimEndTime > 0 && project.trimEndTime < (project.videoDuration || totalDuration))) && (
              <button
                onClick={resetTrim}
                title="Reset Video Trim"
                className="px-1.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition text-[10px]"
              >
                Reset
              </button>
            )}
            <button
              onClick={handleSplitAtPlayhead}
              title="Split at playhead (S)"
              className="px-2 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 transition text-[10px] font-medium flex items-center space-x-1"
            >
              <Scissors className="w-3 h-3 text-red-400" />
              <span>Split (S)</span>
            </button>
          </div>
        </div>

        {/* Studio Elements Quick Actions & Dropdowns (Spacious & Clean) */}
        <div className="flex items-center space-x-1.5" onClick={(e) => e.stopPropagation()}>
          {/* Quick Direct Actions */}
          <button
            onClick={addTypewriter}
            title="Add Typewriter Stroke Typed Heading"
            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition text-[11px] font-medium active:scale-95"
          >
            <Type className="w-3 h-3 text-cyan-400" />
            <span>+ Typewriter</span>
          </button>

          <button
            onClick={addBrandAsset}
            title="Add Zoth Studio Navbar Logo or Azoth Master Seal"
            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition text-[11px] font-medium active:scale-95"
          >
            <Crown className="w-3 h-3 text-amber-400" />
            <span>+ Brand</span>
          </button>

          <button
            onClick={addZoom}
            title="Add Smooth Camera Zoom"
            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-brand-500/10 hover:bg-brand-500/20 text-brand-300 border border-brand-500/30 transition text-[11px] font-medium active:scale-95"
          >
            <Sparkles className="w-3 h-3 text-brand-400" />
            <span>+ Zoom</span>
          </button>

          {/* Audio Dropdown */}
          <div className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === 'audio' ? null : 'audio')}
              className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-[11px] font-medium border transition ${
                activeMenu === 'audio'
                  ? 'bg-indigo-600 text-white border-indigo-400'
                  : 'bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border-indigo-500/20'
              }`}
            >
              <Music className="w-3 h-3 text-indigo-400" />
              <span>Audio</span>
              <ChevronDown className="w-2.5 h-2.5" />
            </button>
            {activeMenu === 'audio' && (
              <div className="absolute top-8 right-0 w-48 bg-dark-900 border border-slate-800 rounded-xl p-1.5 shadow-2xl z-50 space-y-1 animate-in fade-in">
                <button
                  onClick={() => { setActiveMenu(null); setIsAudioModalOpen(true); }}
                  className="w-full px-2.5 py-1.5 rounded-lg text-left text-xs text-slate-200 hover:text-white hover:bg-slate-800 flex items-center space-x-2 transition"
                >
                  <Music className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Import Music / Audio...</span>
                </button>
                <button
                  onClick={() => { setActiveMenu(null); onOpenSFXLibrary?.(); }}
                  className="w-full px-2.5 py-1.5 rounded-lg text-left text-xs text-slate-200 hover:text-white hover:bg-slate-800 flex items-center space-x-2 transition"
                >
                  <Volume2 className="w-3.5 h-3.5 text-pink-400" />
                  <span>SFX Soundboard...</span>
                </button>
                <button
                  onClick={() => { onChange({ snapToBeat: !project.snapToBeat }); }}
                  className="w-full px-2.5 py-1.5 rounded-lg text-left text-xs text-slate-200 hover:text-white hover:bg-slate-800 flex items-center justify-between transition"
                >
                  <div className="flex items-center space-x-2">
                    <Magnet className="w-3.5 h-3.5 text-amber-400" />
                    <span>Snap to Beats</span>
                  </div>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${project.snapToBeat ? 'bg-amber-500/20 text-amber-300' : 'text-slate-500'}`}>
                    {project.snapToBeat ? 'ON' : 'OFF'}
                  </span>
                </button>
                <button
                  onClick={() => { setActiveMenu(null); handleAutoSyncZoomsToBeats(); }}
                  className="w-full px-2.5 py-1.5 rounded-lg text-left text-xs text-slate-200 hover:text-white hover:bg-slate-800 flex items-center space-x-2 transition"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Auto-Sync Zooms to Beats</span>
                </button>
              </div>
            )}
          </div>

          {/* Text & Captions Dropdown */}
          <div className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === 'text' ? null : 'text')}
              className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-[11px] font-medium border transition ${
                activeMenu === 'text'
                  ? 'bg-yellow-600 text-white border-yellow-400'
                  : 'bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-300 border-yellow-500/20'
              }`}
            >
              <Subtitles className="w-3 h-3 text-yellow-400" />
              <span>Titles</span>
              <ChevronDown className="w-2.5 h-2.5" />
            </button>
            {activeMenu === 'text' && (
              <div className="absolute top-8 right-0 w-48 bg-dark-900 border border-slate-800 rounded-xl p-1.5 shadow-2xl z-50 space-y-1 animate-in fade-in">
                <button
                  onClick={() => { setActiveMenu(null); addSubtitle(); }}
                  className="w-full px-2.5 py-1.5 rounded-lg text-left text-xs text-slate-200 hover:text-white hover:bg-slate-800 flex items-center space-x-2 transition"
                >
                  <Subtitles className="w-3.5 h-3.5 text-yellow-400" />
                  <span>+ Subtitle / Caption</span>
                </button>
                <button
                  onClick={() => { setActiveMenu(null); onOpenLowerThirds ? onOpenLowerThirds() : addOverlay(); }}
                  className="w-full px-2.5 py-1.5 rounded-lg text-left text-xs text-slate-200 hover:text-white hover:bg-slate-800 flex items-center space-x-2 transition"
                >
                  <Tv className="w-3.5 h-3.5 text-emerald-400" />
                  <span>+ Lower Thirds Banner</span>
                </button>
                <button
                  onClick={() => { setActiveMenu(null); addOverlay(); }}
                  className="w-full px-2.5 py-1.5 rounded-lg text-left text-xs text-slate-200 hover:text-white hover:bg-slate-800 flex items-center space-x-2 transition"
                >
                  <Type className="w-3.5 h-3.5 text-emerald-400" />
                  <span>+ Callout Badge</span>
                </button>
              </div>
            )}
          </div>

          {/* More FX Dropdown */}
          <div className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === 'vfx' ? null : 'vfx')}
              className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-[11px] font-medium border transition ${
                activeMenu === 'vfx'
                  ? 'bg-purple-600 text-white border-purple-400'
                  : 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border-purple-500/20'
              }`}
            >
              <RotateCw className="w-3 h-3 text-purple-400" />
              <span>More</span>
              <ChevronDown className="w-2.5 h-2.5" />
            </button>
            {activeMenu === 'vfx' && (
              <div className="absolute top-8 right-0 w-48 bg-dark-900 border border-slate-800 rounded-xl p-1.5 shadow-2xl z-50 space-y-1 animate-in fade-in">
                <button
                  onClick={() => { setActiveMenu(null); onOpenTransitions?.(); }}
                  className="w-full px-2.5 py-1.5 rounded-lg text-left text-xs text-slate-200 hover:text-white hover:bg-slate-800 flex items-center space-x-2 transition"
                >
                  <RotateCw className="w-3.5 h-3.5 text-purple-400" />
                  <span>+ Cinema Transition...</span>
                </button>
                <button
                  onClick={() => { setActiveMenu(null); addSticker(); }}
                  className="w-full px-2.5 py-1.5 rounded-lg text-left text-xs text-slate-200 hover:text-white hover:bg-slate-800 flex items-center space-x-2 transition"
                >
                  <Smile className="w-3.5 h-3.5 text-amber-400" />
                  <span>+ Sticker Emoji</span>
                </button>
                <button
                  onClick={() => { setActiveMenu(null); addTap(); }}
                  className="w-full px-2.5 py-1.5 rounded-lg text-left text-xs text-slate-200 hover:text-white hover:bg-slate-800 flex items-center space-x-2 transition"
                >
                  <Hand className="w-3.5 h-3.5 text-pink-400" />
                  <span>+ Click / Tap Event</span>
                </button>
                <button
                  onClick={() => { setActiveMenu(null); handleAutoZooms(); }}
                  className="w-full px-2.5 py-1.5 rounded-lg text-left text-xs text-slate-200 hover:text-white hover:bg-slate-800 flex items-center space-x-2 transition"
                >
                  <Wand2 className="w-3.5 h-3.5 text-brand-400" />
                  <span>Auto-Detect Zooms</span>
                </button>
                <button
                  onClick={() => { setActiveMenu(null); addSpeed(); }}
                  className="w-full px-2.5 py-1.5 rounded-lg text-left text-xs text-slate-200 hover:text-white hover:bg-slate-800 flex items-center space-x-2 transition"
                >
                  <Gauge className="w-3.5 h-3.5 text-amber-400" />
                  <span>+ Speed Curve Segment</span>
                </button>
              </div>
            )}
          </div>

          {/* Delete selected item */}
          {project.selectedEvent && (
            <button
              onClick={removeSelected}
              title="Delete selected item (Delete / Backspace)"
              className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 transition ml-1 active:scale-95 text-[11px] font-medium"
            >
              <Trash2 className="w-3 h-3 text-rose-400" />
              <span>Delete</span>
            </button>
          )}
        </div>
      </div>

      {/* Tracks Area */}
      <div className="flex-1 flex overflow-x-auto p-3">
        {/* Track Headers */}
        <div className="w-24 pr-3 flex flex-col justify-around text-[11px] font-medium text-slate-400 border-r border-slate-800/80 select-none">
          <div className="flex items-center space-x-1.5 text-indigo-400">
            <Music className="w-3 h-3" />
            <span>Audio</span>
          </div>
          <div className="flex items-center space-x-1.5 text-purple-400">
            <RotateCw className="w-3 h-3" />
            <span>Transit</span>
          </div>
          <div className="flex items-center space-x-1.5 text-brand-400">
            <Sparkles className="w-3 h-3" />
            <span>Zooms</span>
          </div>
          <div className="flex items-center space-x-1.5 text-pink-400">
            <Hand className="w-3 h-3" />
            <span>Taps</span>
          </div>
          <div className="flex items-center space-x-1.5 text-cyan-400">
            <Type className="w-3 h-3" />
            <span>Typewriter</span>
          </div>
          <div className="flex items-center space-x-1.5 text-amber-400">
            <Crown className="w-3 h-3" />
            <span>Brand</span>
          </div>
          <div className="flex items-center space-x-1.5 text-emerald-400">
            <Type className="w-3 h-3" />
            <span>Callouts</span>
          </div>
          <div className="flex items-center space-x-1.5 text-yellow-400">
            <Subtitles className="w-3 h-3" />
            <span>Captions</span>
          </div>
          <div className="flex items-center space-x-1.5 text-amber-400">
            <Smile className="w-3 h-3" />
            <span>Stickers</span>
          </div>
          <div className="flex items-center space-x-1.5 text-amber-400">
            <Gauge className="w-3 h-3" />
            <span>Speed</span>
          </div>
          <div className="flex items-center space-x-1.5 text-slate-300">
            <Scissors className="w-3 h-3" />
            <span>Video</span>
          </div>
        </div>

        {/* Tracks Content */}
        <div 
          ref={tracksRef}
          onPointerDown={handleTrackPointerDown}
          className="flex-1 relative ml-3 bg-dark-900/60 rounded-xl border border-slate-800/80 overflow-hidden flex flex-col justify-around py-1 cursor-pointer"
        >
          {/* Timecode Ruler Ticks Background Grid */}
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            {generateRulerTicks(totalDuration).map(tick => (
              <div
                key={tick.time}
                className="absolute top-0 bottom-0 border-l border-slate-800/40 flex flex-col justify-between"
                style={{ left: `${tick.pct}%` }}
              >
                <span className="text-[9px] font-mono text-slate-500 pl-1 pt-0.5 select-none opacity-50">
                  {tick.label}
                </span>
              </div>
            ))}
          </div>

          {/* Playhead Line */}
          <div 
            className="absolute top-0 bottom-0 w-0.5 bg-brand-500 z-40 pointer-events-none transition-[left] duration-75"
            style={{ left: `${playheadPercent}%` }}
          >
            <div className="w-3 h-3 -ml-[5px] bg-brand-500 rounded-full shadow-lg shadow-brand-500/50" />
          </div>

          {/* 1. Audio Track with Waveform and Beat Grid */}
          <div className="h-6 w-full relative bg-dark-950/40 rounded-lg mx-1 border border-slate-800/40">
            {(project.audioTracks || []).map((audio) => {
              const isSelected = project.selectedEvent?.type === 'audio' && project.selectedEvent.id === audio.id;
              return (
                <DraggableBlock
                  key={audio.id}
                  id={audio.id}
                  type="audio"
                  timelineStart={audio.startTime || 0}
                  duration={audio.duration || totalDuration}
                  totalDuration={totalDuration}
                  isSelected={isSelected}
                  label={`${audio.name} (${Math.round(audio.volume * 100)}% vol)`}
                  icon={<Music className="w-3 h-3" />}
                  waveformData={audio.waveformData}
                  beatTimestamps={audio.beatTimestamps}
                  bpm={audio.bpm}
                  colorClass={{
                    bg: 'bg-indigo-700/40',
                    border: 'border border-indigo-500/40',
                    text: 'text-indigo-200',
                    selectedBg: 'bg-indigo-600/80',
                    selectedBorder: 'border border-indigo-300',
                    handleBg: 'bg-indigo-400',
                  }}
                  onSelect={() => onChange({ selectedEvent: { type: 'audio', id: audio.id } })}
                  onSeekToStart={() => onSeek(audio.startTime || 0)}
                  onMove={(newStart) => {
                    onChange({
                      audioTracks: (project.audioTracks || []).map(a =>
                        a.id === audio.id ? { ...a, startTime: newStart } : a
                      ),
                    });
                    onSeek(newStart);
                  }}
                  onResizeStart={(newStart, newDur) => {
                    onChange({
                      audioTracks: (project.audioTracks || []).map(a =>
                        a.id === audio.id ? { ...a, startTime: newStart, duration: newDur } : a
                      ),
                    });
                  }}
                  onResizeEnd={(newDur) => {
                    onChange({
                      audioTracks: (project.audioTracks || []).map(a =>
                        a.id === audio.id ? { ...a, duration: newDur } : a
                      ),
                    });
                  }}
                  getTrackWidth={getTrackWidth}
                />
              );
            })}
          </div>

          {/* 1b. Cinema Transitions Track */}
          <div className="h-6 w-full relative bg-dark-950/40 rounded-lg mx-1 border border-slate-800/40">
            {(project.transitions || []).map((tr) => {
              const timelineStart = speedTimeline.outputOffset(tr.startTime);
              const isSelected = project.selectedEvent?.type === 'transition' && project.selectedEvent.id === tr.id;
              return (
                <DraggableBlock
                  key={tr.id}
                  id={tr.id}
                  type="transition"
                  timelineStart={timelineStart}
                  duration={tr.duration}
                  totalDuration={totalDuration}
                  isSelected={isSelected}
                  label={`${tr.type} (${tr.duration.toFixed(2)}s)`}
                  icon={<RotateCw className="w-3 h-3 text-purple-400" />}
                  colorClass={{
                    bg: 'bg-purple-700/40',
                    border: 'border border-purple-500/40',
                    text: 'text-purple-200',
                    selectedBg: 'bg-purple-600/80',
                    selectedBorder: 'border border-purple-300',
                    handleBg: 'bg-purple-400',
                  }}
                  onSelect={() => onChange({ selectedEvent: { type: 'transition', id: tr.id } })}
                  onSeekToStart={() => onSeek(timelineStart)}
                  onMove={(newTimelineStart) => {
                    const newSourceStart = speedTimeline.sourceTime(newTimelineStart);
                    onChange({
                      transitions: (project.transitions || []).map(item =>
                        item.id === tr.id ? { ...item, startTime: newSourceStart } : item
                      ),
                    });
                    onSeek(newTimelineStart);
                  }}
                  onResizeStart={(newTimelineStart, newDur) => {
                    const newSourceStart = speedTimeline.sourceTime(newTimelineStart);
                    onChange({
                      transitions: (project.transitions || []).map(item =>
                        item.id === tr.id ? { ...item, startTime: newSourceStart, duration: newDur } : item
                      ),
                    });
                  }}
                  onResizeEnd={(newDur) => {
                    onChange({
                      transitions: (project.transitions || []).map(item =>
                        item.id === tr.id ? { ...item, duration: newDur } : item
                      ),
                    });
                  }}
                  getTrackWidth={getTrackWidth}
                />
              );
            })}
          </div>

          {/* 2. Zoom Track */}
          <div className="h-6 w-full relative bg-dark-950/40 rounded-lg mx-1 border border-slate-800/40">
            {project.animations.map((zoom) => {
              const timelineStart = speedTimeline.outputOffset(zoom.startTime);
              const isSelected = project.selectedEvent?.type === 'zoom' && project.selectedEvent.id === zoom.id;
              return (
                <DraggableBlock
                  key={zoom.id}
                  id={zoom.id}
                  type="zoom"
                  timelineStart={timelineStart}
                  duration={zoom.duration}
                  totalDuration={totalDuration}
                  isSelected={isSelected}
                  label={`${zoom.scale.toFixed(2)}x (${zoom.focus})`}
                  icon={<Sparkles className="w-3 h-3" />}
                  colorClass={{
                    bg: 'bg-brand-700/40',
                    border: 'border border-brand-500/40',
                    text: 'text-brand-200',
                    selectedBg: 'bg-brand-600/80',
                    selectedBorder: 'border border-brand-300',
                    handleBg: 'bg-brand-400',
                  }}
                  onSelect={() => onChange({ selectedEvent: { type: 'zoom', id: zoom.id } })}
                  onSeekToStart={() => onSeek(timelineStart)}
                  onMove={(newTimelineStart) => {
                    const newSourceStart = speedTimeline.sourceTime(newTimelineStart);
                    onChange({
                      animations: project.animations.map(z =>
                        z.id === zoom.id ? { ...z, startTime: newSourceStart } : z
                      ),
                    });
                    onSeek(newTimelineStart);
                  }}
                  onResizeStart={(newTimelineStart, newDur) => {
                    const newSourceStart = speedTimeline.sourceTime(newTimelineStart);
                    onChange({
                      animations: project.animations.map(z =>
                        z.id === zoom.id ? { ...z, startTime: newSourceStart, duration: newDur } : z
                      ),
                    });
                  }}
                  onResizeEnd={(newDur) => {
                    onChange({
                      animations: project.animations.map(z =>
                        z.id === zoom.id ? { ...z, duration: newDur } : z
                      ),
                    });
                  }}
                  getTrackWidth={getTrackWidth}
                />
              );
            })}
          </div>

          {/* 3. Tap Track */}
          <div className="h-6 w-full relative bg-dark-950/40 rounded-lg mx-1 border border-slate-800/40">
            {project.tapEvents.map((tap) => {
              const timelineStart = speedTimeline.outputOffset(tap.startTime);
              const isSelected = project.selectedEvent?.type === 'tap' && project.selectedEvent.id === tap.id;
              return (
                <DraggableBlock
                  key={tap.id}
                  id={tap.id}
                  type="tap"
                  timelineStart={timelineStart}
                  duration={tap.duration}
                  totalDuration={totalDuration}
                  isSelected={isSelected}
                  label={`${tap.style} tap`}
                  icon={<Hand className="w-3 h-3" />}
                  colorClass={{
                    bg: 'bg-pink-700/40',
                    border: 'border border-pink-500/40',
                    text: 'text-pink-200',
                    selectedBg: 'bg-pink-600/80',
                    selectedBorder: 'border border-pink-300',
                    handleBg: 'bg-pink-400',
                  }}
                  onSelect={() => onChange({ selectedEvent: { type: 'tap', id: tap.id } })}
                  onSeekToStart={() => onSeek(timelineStart)}
                  onMove={(newTimelineStart) => {
                    const newSourceStart = speedTimeline.sourceTime(newTimelineStart);
                    onChange({
                      tapEvents: project.tapEvents.map(t =>
                        t.id === tap.id ? { ...t, startTime: newSourceStart } : t
                      ),
                    });
                    onSeek(newTimelineStart);
                  }}
                  onResizeStart={(newTimelineStart, newDur) => {
                    const newSourceStart = speedTimeline.sourceTime(newTimelineStart);
                    onChange({
                      tapEvents: project.tapEvents.map(t =>
                        t.id === tap.id ? { ...t, startTime: newSourceStart, duration: newDur } : t
                      ),
                    });
                  }}
                  onResizeEnd={(newDur) => {
                    onChange({
                      tapEvents: project.tapEvents.map(t =>
                        t.id === tap.id ? { ...t, duration: newDur } : t
                      ),
                    });
                  }}
                  getTrackWidth={getTrackWidth}
                />
              );
            })}
          </div>

          {/* 3b. Typewriter Stroke Captions Track */}
          <div className="h-6 w-full relative bg-dark-950/40 rounded-lg mx-1 border border-slate-800/40">
            {(project.typewriters || []).map((tw) => {
              const timelineStart = speedTimeline.outputOffset(tw.startTime);
              const isSelected = project.selectedEvent?.type === 'typewriter' && project.selectedEvent.id === tw.id;
              return (
                <DraggableBlock
                  key={tw.id}
                  id={tw.id}
                  type="typewriter"
                  timelineStart={timelineStart}
                  duration={tw.duration}
                  totalDuration={totalDuration}
                  isSelected={isSelected}
                  label={tw.tag ? `[${tw.tag}] ${tw.text}` : tw.text}
                  icon={<Type className="w-3 h-3 text-cyan-400" />}
                  colorClass={{
                    bg: 'bg-cyan-950/60',
                    border: 'border border-cyan-500/50',
                    text: 'text-cyan-200',
                    selectedBg: 'bg-cyan-600/80',
                    selectedBorder: 'border border-cyan-300',
                    handleBg: 'bg-cyan-400',
                  }}
                  onSelect={() => onChange({ selectedEvent: { type: 'typewriter', id: tw.id } })}
                  onSeekToStart={() => onSeek(timelineStart)}
                  onMove={(newTimelineStart) => {
                    const newSourceStart = speedTimeline.sourceTime(newTimelineStart);
                    onChange({
                      typewriters: (project.typewriters || []).map(item =>
                        item.id === tw.id ? { ...item, startTime: newSourceStart } : item
                      ),
                    });
                    onSeek(newTimelineStart);
                  }}
                  onResizeStart={(newTimelineStart, newDur) => {
                    const newSourceStart = speedTimeline.sourceTime(newTimelineStart);
                    onChange({
                      typewriters: (project.typewriters || []).map(item =>
                        item.id === tw.id ? { ...item, startTime: newSourceStart, duration: newDur } : item
                      ),
                    });
                  }}
                  onResizeEnd={(newDur) => {
                    onChange({
                      typewriters: (project.typewriters || []).map(item =>
                        item.id === tw.id ? { ...item, duration: newDur } : item
                      ),
                    });
                  }}
                  getTrackWidth={getTrackWidth}
                />
              );
            })}
          </div>

          {/* 3c. Brand & Image Overlays Track */}
          <div className="h-6 w-full relative bg-dark-950/40 rounded-lg mx-1 border border-slate-800/40">
            {(project.imageOverlays || []).map((img) => {
              const timelineStart = speedTimeline.outputOffset(img.startTime);
              const isSelected = project.selectedEvent?.type === 'imageOverlay' && project.selectedEvent.id === img.id;
              return (
                <DraggableBlock
                  key={img.id}
                  id={img.id}
                  type="imageOverlay"
                  timelineStart={timelineStart}
                  duration={img.duration}
                  totalDuration={totalDuration}
                  isSelected={isSelected}
                  label={img.name || 'Brand Overlay'}
                  icon={<Crown className="w-3 h-3 text-amber-400" />}
                  colorClass={{
                    bg: 'bg-amber-950/60',
                    border: 'border border-amber-500/50',
                    text: 'text-amber-200',
                    selectedBg: 'bg-amber-600/80',
                    selectedBorder: 'border border-amber-300',
                    handleBg: 'bg-amber-400',
                  }}
                  onSelect={() => onChange({ selectedEvent: { type: 'imageOverlay', id: img.id } })}
                  onSeekToStart={() => onSeek(timelineStart)}
                  onMove={(newTimelineStart) => {
                    const newSourceStart = speedTimeline.sourceTime(newTimelineStart);
                    onChange({
                      imageOverlays: (project.imageOverlays || []).map(item =>
                        item.id === img.id ? { ...item, startTime: newSourceStart } : item
                      ),
                    });
                    onSeek(newTimelineStart);
                  }}
                  onResizeStart={(newTimelineStart, newDur) => {
                    const newSourceStart = speedTimeline.sourceTime(newTimelineStart);
                    onChange({
                      imageOverlays: (project.imageOverlays || []).map(item =>
                        item.id === img.id ? { ...item, startTime: newSourceStart, duration: newDur } : item
                      ),
                    });
                  }}
                  onResizeEnd={(newDur) => {
                    onChange({
                      imageOverlays: (project.imageOverlays || []).map(item =>
                        item.id === img.id ? { ...item, duration: newDur } : item
                      ),
                    });
                  }}
                  getTrackWidth={getTrackWidth}
                />
              );
            })}
          </div>

          {/* 4. Callouts Track */}
          <div className="h-6 w-full relative bg-dark-950/40 rounded-lg mx-1 border border-slate-800/40">
            {(project.overlays || []).map((o) => {
              const timelineStart = speedTimeline.outputOffset(o.startTime);
              const isSelected = project.selectedEvent?.type === 'overlay' && project.selectedEvent.id === o.id;
              return (
                <DraggableBlock
                  key={o.id}
                  id={o.id}
                  type="overlay"
                  timelineStart={timelineStart}
                  duration={o.duration}
                  totalDuration={totalDuration}
                  isSelected={isSelected}
                  label={o.subtitle ? `${o.text} (${o.subtitle})` : (o.text || 'Callout')}
                  icon={o.lowerThirdPreset || ['speaker-pill', 'tech-badge', 'social-cta', 'launch-tag'].includes(o.style) ? <Tv className="w-3 h-3 text-emerald-400" /> : <Type className="w-3 h-3" />}
                  colorClass={{
                    bg: 'bg-emerald-700/40',
                    border: 'border border-emerald-500/40',
                    text: 'text-emerald-200',
                    selectedBg: 'bg-emerald-600/80',
                    selectedBorder: 'border border-emerald-300',
                    handleBg: 'bg-emerald-400',
                  }}
                  onSelect={() => onChange({ selectedEvent: { type: 'overlay', id: o.id } })}
                  onSeekToStart={() => onSeek(timelineStart)}
                  onMove={(newTimelineStart) => {
                    const newSourceStart = speedTimeline.sourceTime(newTimelineStart);
                    onChange({
                      overlays: (project.overlays || []).map(item =>
                        item.id === o.id ? { ...item, startTime: newSourceStart } : item
                      ),
                    });
                    onSeek(newTimelineStart);
                  }}
                  onResizeStart={(newTimelineStart, newDur) => {
                    const newSourceStart = speedTimeline.sourceTime(newTimelineStart);
                    onChange({
                      overlays: (project.overlays || []).map(item =>
                        item.id === o.id ? { ...item, startTime: newSourceStart, duration: newDur } : item
                      ),
                    });
                  }}
                  onResizeEnd={(newDur) => {
                    onChange({
                      overlays: (project.overlays || []).map(item =>
                        item.id === o.id ? { ...item, duration: newDur } : item
                      ),
                    });
                  }}
                  getTrackWidth={getTrackWidth}
                />
              );
            })}
          </div>

          {/* 5. Subtitles & Kinetic Captions Track */}
          <div className="h-6 w-full relative bg-dark-950/40 rounded-lg mx-1 border border-slate-800/40">
            {(project.subtitles || []).map((sub) => {
              const timelineStart = speedTimeline.outputOffset(sub.startTime);
              const isSelected = project.selectedEvent?.type === 'subtitle' && project.selectedEvent.id === sub.id;
              return (
                <DraggableBlock
                  key={sub.id}
                  id={sub.id}
                  type="subtitle"
                  timelineStart={timelineStart}
                  duration={sub.duration}
                  totalDuration={totalDuration}
                  isSelected={isSelected}
                  label={sub.text || 'Caption'}
                  icon={<Subtitles className="w-3 h-3" />}
                  colorClass={{
                    bg: 'bg-yellow-700/40',
                    border: 'border border-yellow-500/40',
                    text: 'text-yellow-200',
                    selectedBg: 'bg-yellow-600/80',
                    selectedBorder: 'border border-yellow-300',
                    handleBg: 'bg-yellow-400',
                  }}
                  onSelect={() => onChange({ selectedEvent: { type: 'subtitle', id: sub.id } })}
                  onSeekToStart={() => onSeek(timelineStart)}
                  onMove={(newTimelineStart) => {
                    const newSourceStart = speedTimeline.sourceTime(newTimelineStart);
                    onChange({
                      subtitles: (project.subtitles || []).map(item =>
                        item.id === sub.id ? { ...item, startTime: newSourceStart } : item
                      ),
                    });
                    onSeek(newTimelineStart);
                  }}
                  onResizeStart={(newTimelineStart, newDur) => {
                    const newSourceStart = speedTimeline.sourceTime(newTimelineStart);
                    onChange({
                      subtitles: (project.subtitles || []).map(item =>
                        item.id === sub.id ? { ...item, startTime: newSourceStart, duration: newDur } : item
                      ),
                    });
                  }}
                  onResizeEnd={(newDur) => {
                    onChange({
                      subtitles: (project.subtitles || []).map(item =>
                        item.id === sub.id ? { ...item, duration: newDur } : item
                      ),
                    });
                  }}
                  getTrackWidth={getTrackWidth}
                />
              );
            })}
          </div>

          {/* 6. Stickers Track */}
          <div className="h-6 w-full relative bg-dark-950/40 rounded-lg mx-1 border border-slate-800/40">
            {(project.stickers || []).map((sticker) => {
              const timelineStart = speedTimeline.outputOffset(sticker.startTime);
              const isSelected = project.selectedEvent?.type === 'sticker' && project.selectedEvent.id === sticker.id;
              return (
                <DraggableBlock
                  key={sticker.id}
                  id={sticker.id}
                  type="sticker"
                  timelineStart={timelineStart}
                  duration={sticker.duration}
                  totalDuration={totalDuration}
                  isSelected={isSelected}
                  label={`${sticker.emojiOrIcon} (${sticker.animation})`}
                  icon={<Smile className="w-3 h-3" />}
                  colorClass={{
                    bg: 'bg-amber-700/40',
                    border: 'border border-amber-500/40',
                    text: 'text-amber-200',
                    selectedBg: 'bg-amber-600/80',
                    selectedBorder: 'border border-amber-300',
                    handleBg: 'bg-amber-400',
                  }}
                  onSelect={() => onChange({ selectedEvent: { type: 'sticker', id: sticker.id } })}
                  onSeekToStart={() => onSeek(timelineStart)}
                  onMove={(newTimelineStart) => {
                    const newSourceStart = speedTimeline.sourceTime(newTimelineStart);
                    onChange({
                      stickers: (project.stickers || []).map(item =>
                        item.id === sticker.id ? { ...item, startTime: newSourceStart } : item
                      ),
                    });
                    onSeek(newTimelineStart);
                  }}
                  onResizeStart={(newTimelineStart, newDur) => {
                    const newSourceStart = speedTimeline.sourceTime(newTimelineStart);
                    onChange({
                      stickers: (project.stickers || []).map(item =>
                        item.id === sticker.id ? { ...item, startTime: newSourceStart, duration: newDur } : item
                      ),
                    });
                  }}
                  onResizeEnd={(newDur) => {
                    onChange({
                      stickers: (project.stickers || []).map(item =>
                        item.id === sticker.id ? { ...item, duration: newDur } : item
                      ),
                    });
                  }}
                  getTrackWidth={getTrackWidth}
                />
              );
            })}
          </div>

          {/* 7. Speed Track */}
          <div className="h-6 w-full relative bg-dark-950/40 rounded-lg mx-1 border border-slate-800/40">
            {project.speedSegments.map((speed) => {
              const timelineStart = speedTimeline.outputOffset(speed.startTime);
              const isSelected = project.selectedEvent?.type === 'speed' && project.selectedEvent.id === speed.id;
              return (
                <DraggableBlock
                  key={speed.id}
                  id={speed.id}
                  type="speed"
                  timelineStart={timelineStart}
                  duration={speed.duration}
                  totalDuration={totalDuration}
                  isSelected={isSelected}
                  label={`${speed.rate}x speed`}
                  icon={<Gauge className="w-3 h-3" />}
                  colorClass={{
                    bg: 'bg-amber-700/40',
                    border: 'border border-amber-500/40',
                    text: 'text-amber-200',
                    selectedBg: 'bg-amber-600/80',
                    selectedBorder: 'border border-amber-300',
                    handleBg: 'bg-amber-400',
                  }}
                  onSelect={() => onChange({ selectedEvent: { type: 'speed', id: speed.id } })}
                  onSeekToStart={() => onSeek(timelineStart)}
                  onMove={(newTimelineStart) => {
                    const newSourceStart = speedTimeline.sourceTime(newTimelineStart);
                    onChange({
                      speedSegments: project.speedSegments.map(s =>
                        s.id === speed.id ? { ...s, startTime: newSourceStart } : s
                      ),
                    });
                    onSeek(newTimelineStart);
                  }}
                  onResizeStart={(newTimelineStart, newDur) => {
                    const newSourceStart = speedTimeline.sourceTime(newTimelineStart);
                    onChange({
                      speedSegments: project.speedSegments.map(s =>
                        s.id === speed.id ? { ...s, startTime: newSourceStart, duration: newDur } : s
                      ),
                    });
                  }}
                  onResizeEnd={(newDur) => {
                    onChange({
                      speedSegments: project.speedSegments.map(s =>
                        s.id === speed.id ? { ...s, duration: newDur } : s
                      ),
                    });
                  }}
                  getTrackWidth={getTrackWidth}
                />
              );
            })}
          </div>

          {/* 8. Video Base Track with Interactive Trim Boundaries */}
          <div
            onClick={() => onChange({ selectedEvent: { type: 'video', id: 'main_video' } })}
            className={`h-8 w-full relative bg-slate-900/90 rounded-lg mx-1 border cursor-pointer transition overflow-hidden ${
              project.selectedEvent?.type === 'video' ? 'border-brand-500 ring-1 ring-brand-500' : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            {/* Darkened Left Trim In Overlay */}
            {project.trimStartTime > 0 && totalDuration > 0 && (
              <div
                style={{ width: `${(project.trimStartTime / (project.videoDuration || totalDuration)) * 100}%` }}
                className="absolute top-0 bottom-0 left-0 bg-dark-950/85 border-r-2 border-amber-500 z-10 pointer-events-none flex items-center justify-center px-1"
              >
                <span className="text-[9px] text-amber-400 font-mono font-bold tracking-wider">TRIMMED IN</span>
              </div>
            )}

            {/* Darkened Right Trim Out Overlay */}
            {project.trimEndTime > 0 && project.trimEndTime < (project.videoDuration || totalDuration) && (
              <div
                style={{
                  left: `${(project.trimEndTime / (project.videoDuration || totalDuration)) * 100}%`,
                  right: 0
                }}
                className="absolute top-0 bottom-0 bg-dark-950/85 border-l-2 border-amber-500 z-10 pointer-events-none flex items-center justify-center px-1"
              >
                <span className="text-[9px] text-amber-400 font-mono font-bold tracking-wider">TRIMMED OUT</span>
              </div>
            )}

            {/* Video track info & metrics */}
            <div className="h-full flex items-center justify-between px-3 text-xs text-slate-300 font-medium z-0">
              <div className="flex items-center space-x-2">
                <Scissors className="w-3.5 h-3.5 text-brand-400" />
                <span className="font-semibold text-white truncate max-w-[200px]">{project.displayName || 'Video Source Track'}</span>
              </div>
              <div className="flex items-center space-x-3 font-mono text-[10px] text-slate-400">
                <span>In: <strong className="text-slate-200">{formatTime(project.trimStartTime || 0)}</strong></span>
                <span>•</span>
                <span>Out: <strong className="text-slate-200">{formatTime(project.trimEndTime || project.videoDuration || totalDuration)}</strong></span>
                <span>•</span>
                <span className="text-emerald-400 font-bold">Cut: {formatTime((project.trimEndTime || project.videoDuration || totalDuration) - (project.trimStartTime || 0))}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
