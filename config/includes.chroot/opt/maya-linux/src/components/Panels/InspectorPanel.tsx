import React from 'react';
import { ProjectState } from '../../types/project';
import { Sparkles, Hand, Gauge, Type, Music, X, Clock, MapPin, Subtitles, Smile, Volume2, Shield, Scissors, Crown, Trash2, RotateCw } from 'lucide-react';
import { ZoomFocus, AnimationCurve, TapStyle, BadgeStyle, SubtitleStyle, StickerAnimation, TypewriterStyle, ImageOverlayAnimation, TransitionType } from '../../types/models';

interface InspectorPanelProps {
  project: ProjectState;
  onChange: (updater: Partial<ProjectState>) => void;
}

export const InspectorPanel: React.FC<InspectorPanelProps> = ({ project, onChange }) => {
  if (!project.selectedEvent) return null;

  const close = () => onChange({ selectedEvent: null });
  const totalDuration = Math.max(1, project.videoDuration || 10);

  const removeSelected = () => {
    if (!project.selectedEvent) return;
    const { type, id } = project.selectedEvent;
    if (type === 'zoom') {
      onChange({
        animations: project.animations.filter(a => a.id !== id),
        selectedEvent: null,
      });
    } else if (type === 'tap') {
      onChange({
        tapEvents: project.tapEvents.filter(t => t.id !== id),
        selectedEvent: null,
      });
    } else if (type === 'overlay') {
      onChange({
        overlays: (project.overlays || []).filter(o => o.id !== id),
        selectedEvent: null,
      });
    } else if (type === 'subtitle') {
      onChange({
        subtitles: (project.subtitles || []).filter(s => s.id !== id),
        selectedEvent: null,
      });
    } else if (type === 'sticker') {
      onChange({
        stickers: (project.stickers || []).filter(s => s.id !== id),
        selectedEvent: null,
      });
    } else if (type === 'transition') {
      onChange({
        transitions: (project.transitions || []).filter(tr => tr.id !== id),
        selectedEvent: null,
      });
    } else if (type === 'audio') {
      onChange({
        audioTracks: (project.audioTracks || []).map(a => a.id === id ? null : a).filter(Boolean) as any,
        selectedEvent: null,
      });
    } else if (type === 'speed') {
      onChange({
        speedSegments: project.speedSegments.filter(s => s.id !== id),
        selectedEvent: null,
      });
    } else if (type === 'typewriter') {
      onChange({
        typewriters: (project.typewriters || []).filter(tw => tw.id !== id),
        selectedEvent: null,
      });
    } else if (type === 'imageOverlay') {
      onChange({
        imageOverlays: (project.imageOverlays || []).filter(img => img.id !== id),
        selectedEvent: null,
      });
    }
  };

  // 1. Audio Track Inspector
  if (project.selectedEvent.type === 'audio') {
    const audio = project.audioTracks?.find(a => a.id === project.selectedEvent?.id);
    if (!audio) return null;

    const update = (partial: Partial<typeof audio>) => {
      onChange({
        audioTracks: (project.audioTracks || []).map(a => (a.id === audio.id ? { ...a, ...partial } : a)),
      });
    };

    return (
      <div className="w-72 border-l border-slate-800/80 bg-dark-900/80 backdrop-blur p-4 select-none text-xs space-y-5 overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-2 font-semibold text-indigo-400">
            <Music className="w-4 h-4" />
            <span>Audio Track</span>
          </div>
          <button onClick={close} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-1">
          <span className="text-slate-400 text-[11px]">Track Name</span>
          <p className="font-mono text-slate-200 text-xs truncate bg-dark-950 p-2 rounded-xl border border-slate-800">
            {audio.name}
          </p>
        </div>

        {/* Timeline Start Time */}
        <div className="space-y-1.5 p-2.5 rounded-xl bg-dark-950/60 border border-slate-800">
          <div className="flex justify-between text-slate-300 text-[11px] font-medium">
            <span className="flex items-center space-x-1">
              <Clock className="w-3 h-3 text-indigo-400" />
              <span>Start Time</span>
            </span>
            <span className="font-mono text-indigo-300">{(audio.startTime || 0).toFixed(2)}s</span>
          </div>
          <input
            type="range"
            min="0"
            max={totalDuration}
            step="0.05"
            value={audio.startTime || 0}
            onChange={(e) => update({ startTime: Math.max(0, parseFloat(e.target.value)) })}
            className="w-full accent-indigo-500 cursor-pointer"
          />
        </div>

        {/* Duration */}
        <div className="space-y-1.5 p-2.5 rounded-xl bg-dark-950/60 border border-slate-800">
          <div className="flex justify-between text-slate-300 text-[11px] font-medium">
            <span>Duration</span>
            <span className="font-mono text-indigo-300">{(audio.duration || totalDuration).toFixed(2)}s</span>
          </div>
          <input
            type="range"
            min="0.5"
            max={totalDuration}
            step="0.1"
            value={audio.duration || totalDuration}
            onChange={(e) => update({ duration: Math.max(0.5, parseFloat(e.target.value)) })}
            className="w-full accent-indigo-500 cursor-pointer"
          />
        </div>

        {/* Volume */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-slate-400 text-[11px]">
            <span>Volume</span>
            <span className="font-mono text-slate-200">{Math.round(audio.volume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={audio.volume}
            onChange={(e) => update({ volume: parseFloat(e.target.value) })}
            className="w-full accent-indigo-500 cursor-pointer"
          />
        </div>

        {/* Fade In & Fade Out */}
        <div className="space-y-3 p-2.5 rounded-xl bg-dark-950/60 border border-slate-800">
          <div className="flex items-center space-x-1.5 text-slate-300 font-semibold text-[11px]">
            <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Audio Envelopes</span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-slate-400 text-[10px]">
              <span>Fade In</span>
              <span className="font-mono text-indigo-300">{(audio.fadeIn ?? 0).toFixed(1)}s</span>
            </div>
            <input
              type="range"
              min="0"
              max="3"
              step="0.1"
              value={audio.fadeIn ?? 0}
              onChange={(e) => update({ fadeIn: parseFloat(e.target.value) })}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-slate-400 text-[10px]">
              <span>Fade Out</span>
              <span className="font-mono text-indigo-300">{(audio.fadeOut ?? 0).toFixed(1)}s</span>
            </div>
            <input
              type="range"
              min="0"
              max="3"
              step="0.1"
              value={audio.fadeOut ?? 0}
              onChange={(e) => update({ fadeOut: parseFloat(e.target.value) })}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Auto Audio Ducking */}
        <div className="space-y-2 p-2.5 rounded-xl bg-dark-950/60 border border-slate-800">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-slate-200 font-semibold text-[11px]">Auto-Ducking</span>
              <p className="text-[10px] text-slate-400">Lower volume when speech active</p>
            </div>
            <button
              onClick={() => update({ duckingEnabled: !audio.duckingEnabled })}
              className={`w-9 h-5 rounded-full p-0.5 transition ${
                audio.duckingEnabled ? 'bg-indigo-600' : 'bg-slate-800'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition transform ${
                  audio.duckingEnabled ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {audio.duckingEnabled && (
            <div className="space-y-1 pt-1 border-t border-slate-800/60">
              <div className="flex justify-between text-slate-400 text-[10px]">
                <span>Ducked Volume</span>
                <span className="font-mono text-indigo-300">
                  {Math.round((audio.duckingAmount ?? 0.3) * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.8"
                step="0.05"
                value={audio.duckingAmount ?? 0.3}
                onChange={(e) => update({ duckingAmount: parseFloat(e.target.value) })}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* Delete Action */}
        <div className="pt-2 border-t border-slate-800">
          <button
            onClick={removeSelected}
            className="w-full py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center justify-center space-x-1.5 transition text-xs font-semibold"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Audio Track</span>
          </button>
        </div>
      </div>
    );
  }

  // 2. Zoom Inspector
  if (project.selectedEvent.type === 'zoom') {
    const zoom = project.animations.find(a => a.id === project.selectedEvent?.id);
    if (!zoom) return null;

    const update = (partial: Partial<typeof zoom>) => {
      onChange({
        animations: project.animations.map(a => (a.id === zoom.id ? { ...a, ...partial } : a)),
      });
    };

    return (
      <div className="w-72 border-l border-slate-800/80 bg-dark-900/80 backdrop-blur p-4 select-none text-xs space-y-5 overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-2 font-semibold text-brand-400">
            <Sparkles className="w-4 h-4" />
            <span>Zoom Settings</span>
          </div>
          <button onClick={close} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Timeline Timing Controls */}
        <div className="space-y-2 p-2.5 rounded-xl bg-dark-950/60 border border-slate-800">
          <div className="flex items-center space-x-1 text-slate-400 text-[10px] uppercase font-semibold">
            <Clock className="w-3 h-3 text-brand-400" />
            <span>Timeline Timing</span>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-slate-300 text-[11px]">
              <span>Start Time</span>
              <span className="font-mono text-brand-300">{zoom.startTime.toFixed(2)}s</span>
            </div>
            <input
              type="range"
              min="0"
              max={totalDuration}
              step="0.05"
              value={zoom.startTime}
              onChange={(e) => update({ startTime: Math.max(0, parseFloat(e.target.value)) })}
              className="w-full accent-brand-500 cursor-pointer"
            />
          </div>

          <div className="space-y-1 pt-1 border-t border-slate-800/60">
            <div className="flex justify-between text-slate-300 text-[11px]">
              <span>Duration</span>
              <span className="font-mono text-brand-300">{zoom.duration.toFixed(2)}s</span>
            </div>
            <input
              type="range"
              min="0.3"
              max="10.0"
              step="0.1"
              value={zoom.duration}
              onChange={(e) => update({ duration: Math.max(0.3, parseFloat(e.target.value)) })}
              className="w-full accent-brand-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Scale */}
        <div className="space-y-1">
          <div className="flex justify-between text-slate-400 text-[11px]">
            <span>Zoom Scale</span>
            <span className="font-mono text-slate-200">{zoom.scale.toFixed(2)}x</span>
          </div>
          <input
            type="range"
            min="1.05"
            max="3.0"
            step="0.05"
            value={zoom.scale}
            onChange={(e) => update({ scale: parseFloat(e.target.value) })}
            className="w-full accent-brand-500 cursor-pointer"
          />
        </div>

        {/* 2D Pan & Focus Position */}
        <div className="space-y-2.5 p-2.5 rounded-xl bg-dark-950/60 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-semibold">
            <span className="flex items-center space-x-1">
              <MapPin className="w-3 h-3 text-brand-400" />
              <span>Pan & Focus Target</span>
            </span>
            <button
              onClick={() => update({ focus: 'center', panX: 0, panY: 0 })}
              className="text-[10px] text-brand-400 hover:text-brand-300 transition"
            >
              Reset Center
            </button>
          </div>

          {/* 3x3 Quick Anchor Presets */}
          <div className="grid grid-cols-3 gap-1 bg-dark-950 p-1 rounded-xl border border-slate-800 text-[11px]">
            {[
              { id: 'top-left', label: '↖ TL', x: -1, y: -1 },
              { id: 'top', label: '↑ Top', x: 0, y: -1 },
              { id: 'top-right', label: '↗ TR', x: 1, y: -1 },
              { id: 'left', label: '← Left', x: -1, y: 0 },
              { id: 'center', label: '• Mid', x: 0, y: 0 },
              { id: 'right', label: 'Right →', x: 1, y: 0 },
              { id: 'bottom-left', label: '↙ BL', x: -1, y: 1 },
              { id: 'bottom', label: '↓ Btm', x: 0, y: 1 },
              { id: 'bottom-right', label: '↘ BR', x: 1, y: 1 },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => update({ focus: item.id as ZoomFocus, panX: item.x, panY: item.y })}
                className={`py-1 rounded-lg text-center font-medium transition ${
                  zoom.focus === item.id || (zoom.panX === item.x && zoom.panY === item.y)
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white bg-dark-900/50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Custom Horizontal Pan */}
          <div className="space-y-1 pt-1 border-t border-slate-800/60">
            <div className="flex justify-between text-slate-300 text-[11px]">
              <span>Pan X (Horizontal)</span>
              <span className="font-mono text-brand-300">
                {Math.round((zoom.panX ?? 0) * 100) > 0 ? `+${Math.round((zoom.panX ?? 0) * 100)}%` : `${Math.round((zoom.panX ?? 0) * 100)}%`}
              </span>
            </div>
            <input
              type="range"
              min="-1.0"
              max="1.0"
              step="0.02"
              value={zoom.panX ?? 0}
              onChange={(e) => update({ focus: 'custom', panX: parseFloat(e.target.value) })}
              className="w-full accent-brand-500 cursor-pointer"
            />
          </div>

          {/* Custom Vertical Pan */}
          <div className="space-y-1 pt-1 border-t border-slate-800/60">
            <div className="flex justify-between text-slate-300 text-[11px]">
              <span>Pan Y (Vertical)</span>
              <span className="font-mono text-brand-300">
                {Math.round((zoom.panY ?? 0) * 100) > 0 ? `+${Math.round((zoom.panY ?? 0) * 100)}%` : `${Math.round((zoom.panY ?? 0) * 100)}%`}
              </span>
            </div>
            <input
              type="range"
              min="-1.0"
              max="1.0"
              step="0.02"
              value={zoom.panY ?? 0}
              onChange={(e) => update({ focus: 'custom', panY: parseFloat(e.target.value) })}
              className="w-full accent-brand-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Curve */}
        <div className="space-y-1.5">
          <span className="text-slate-400 text-[11px]">Animation Curve</span>
          <div className="grid grid-cols-2 gap-1.5">
            {(['spring', 'bouncy', 'smooth', 'snappy', 'gentle', 'linear'] as AnimationCurve[]).map((c) => (
              <button
                key={c}
                onClick={() => update({ curve: c })}
                className={`py-1.5 px-2 rounded-xl capitalize font-medium text-left border transition ${
                  zoom.curve === c 
                    ? 'bg-brand-500/20 border-brand-400 text-brand-300' 
                    : 'bg-dark-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Delete Action */}
        <div className="pt-2 border-t border-slate-800">
          <button
            onClick={removeSelected}
            className="w-full py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center justify-center space-x-1.5 transition text-xs font-semibold"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Zoom Event</span>
          </button>
        </div>
      </div>
    );
  }

  // 3. Tap Feedback Inspector
  if (project.selectedEvent.type === 'tap') {
    const tap = project.tapEvents.find(t => t.id === project.selectedEvent?.id);
    if (!tap) return null;

    const update = (partial: Partial<typeof tap>) => {
      onChange({
        tapEvents: project.tapEvents.map(t => (t.id === tap.id ? { ...t, ...partial } : t)),
      });
    };

    return (
      <div className="w-72 border-l border-slate-800/80 bg-dark-900/80 backdrop-blur p-4 select-none text-xs space-y-5 overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-2 font-semibold text-pink-400">
            <Hand className="w-4 h-4" />
            <span>Tap Feedback</span>
          </div>
          <button onClick={close} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Timeline Timing */}
        <div className="space-y-2 p-2.5 rounded-xl bg-dark-950/60 border border-slate-800">
          <div className="flex items-center space-x-1 text-slate-400 text-[10px] uppercase font-semibold">
            <Clock className="w-3 h-3 text-pink-400" />
            <span>Timeline Timing</span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-slate-300 text-[11px]">
              <span>Start Time</span>
              <span className="font-mono text-pink-300">{tap.startTime.toFixed(2)}s</span>
            </div>
            <input
              type="range"
              min="0"
              max={totalDuration}
              step="0.05"
              value={tap.startTime}
              onChange={(e) => update({ startTime: Math.max(0, parseFloat(e.target.value)) })}
              className="w-full accent-pink-500 cursor-pointer"
            />
          </div>

          <div className="space-y-1 pt-1 border-t border-slate-800/60">
            <div className="flex justify-between text-slate-300 text-[11px]">
              <span>Duration</span>
              <span className="font-mono text-pink-300">{tap.duration.toFixed(2)}s</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="2.0"
              step="0.05"
              value={tap.duration}
              onChange={(e) => update({ duration: Math.max(0.15, parseFloat(e.target.value)) })}
              className="w-full accent-pink-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Screen Position */}
        <div className="space-y-2 p-2.5 rounded-xl bg-dark-950/60 border border-slate-800">
          <div className="flex items-center space-x-1 text-slate-400 text-[10px] uppercase font-semibold">
            <MapPin className="w-3 h-3 text-pink-400" />
            <span>Screen Coordinates</span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-slate-300 text-[11px]">
              <span>Position X</span>
              <span className="font-mono text-pink-300">{Math.round(tap.position.x * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.95"
              step="0.01"
              value={tap.position.x}
              onChange={(e) => update({ position: { ...tap.position, x: parseFloat(e.target.value) } })}
              className="w-full accent-pink-500 cursor-pointer"
            />
          </div>

          <div className="space-y-1 pt-1 border-t border-slate-800/60">
            <div className="flex justify-between text-slate-300 text-[11px]">
              <span>Position Y</span>
              <span className="font-mono text-pink-300">{Math.round(tap.position.y * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.95"
              step="0.01"
              value={tap.position.y}
              onChange={(e) => update({ position: { ...tap.position, y: parseFloat(e.target.value) } })}
              className="w-full accent-pink-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Style */}
        <div className="space-y-1.5">
          <span className="text-slate-400 text-[11px]">Animation Style</span>
          <div className="grid grid-cols-3 gap-1 bg-dark-950 p-1 rounded-xl border border-slate-800">
            {(['ripple', 'pulse', 'ring'] as TapStyle[]).map((s) => (
              <button
                key={s}
                onClick={() => update({ style: s })}
                className={`py-1 rounded-lg capitalize font-medium transition ${
                  tap.style === s ? 'bg-pink-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* SFX Click */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-dark-950 border border-slate-800">
          <span className="text-slate-300 text-[11px]">Play Click Sound</span>
          <input
            type="checkbox"
            checked={tap.playSound}
            onChange={(e) => update({ playSound: e.target.checked })}
            className="accent-pink-500 w-4 h-4 cursor-pointer"
          />
        </div>

        {/* Size */}
        <div className="space-y-1">
          <div className="flex justify-between text-slate-400 text-[11px]">
            <span>Feedback Size</span>
            <span className="font-mono text-slate-200">{(tap.diameterFraction * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0.08"
            max="0.36"
            step="0.01"
            value={tap.diameterFraction}
            onChange={(e) => update({ diameterFraction: parseFloat(e.target.value) })}
            className="w-full accent-pink-500 cursor-pointer"
          />
        </div>

        {/* Delete Action */}
        <div className="pt-2 border-t border-slate-800">
          <button
            onClick={removeSelected}
            className="w-full py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center justify-center space-x-1.5 transition text-xs font-semibold"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Tap Event</span>
          </button>
        </div>
      </div>
    );
  }

  // 4. Callout / Overlay Inspector
  if (project.selectedEvent.type === 'overlay') {
    const overlay = project.overlays?.find(o => o.id === project.selectedEvent?.id);
    if (!overlay) return null;

    const update = (partial: Partial<typeof overlay>) => {
      onChange({
        overlays: project.overlays.map(o => (o.id === overlay.id ? { ...o, ...partial } : o)),
      });
    };

    return (
      <div className="w-72 border-l border-slate-800/80 bg-dark-900/80 backdrop-blur p-4 select-none text-xs space-y-5 overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-2 font-semibold text-emerald-400">
            <Type className="w-4 h-4" />
            <span>Badge & Callout</span>
          </div>
          <button onClick={close} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Text Input */}
        <div className="space-y-1.5">
          <span className="text-slate-400 text-[11px]">Primary Title</span>
          <input
            type="text"
            value={overlay.text}
            onChange={(e) => update({ text: e.target.value })}
            className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-slate-800 text-white font-medium focus:border-emerald-500 focus:outline-none"
          />
        </div>

        {/* Subtitle Input */}
        <div className="space-y-1.5">
          <span className="text-slate-400 text-[11px]">Subtitle / Context</span>
          <input
            type="text"
            value={overlay.subtitle || ''}
            onChange={(e) => update({ subtitle: e.target.value })}
            placeholder="e.g. Role, description, or URL"
            className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-slate-800 text-white font-medium focus:border-emerald-500 focus:outline-none"
          />
        </div>

        {/* Tag Input */}
        <div className="space-y-1.5">
          <span className="text-slate-400 text-[11px]">Tag / Badge Text</span>
          <input
            type="text"
            value={overlay.tag || ''}
            onChange={(e) => update({ tag: e.target.value })}
            placeholder="e.g. SPEAKER, FEATURE, SALE"
            className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-slate-800 text-white font-medium focus:border-emerald-500 focus:outline-none"
          />
        </div>

        {/* Timeline Timing */}
        <div className="space-y-2 p-2.5 rounded-xl bg-dark-950/60 border border-slate-800">
          <div className="flex items-center space-x-1 text-slate-400 text-[10px] uppercase font-semibold">
            <Clock className="w-3 h-3 text-emerald-400" />
            <span>Timeline Timing</span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-slate-300 text-[11px]">
              <span>Start Time</span>
              <span className="font-mono text-emerald-300">{overlay.startTime.toFixed(2)}s</span>
            </div>
            <input
              type="range"
              min="0"
              max={totalDuration}
              step="0.05"
              value={overlay.startTime}
              onChange={(e) => update({ startTime: Math.max(0, parseFloat(e.target.value)) })}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          <div className="space-y-1 pt-1 border-t border-slate-800/60">
            <div className="flex justify-between text-slate-300 text-[11px]">
              <span>Duration</span>
              <span className="font-mono text-emerald-300">{overlay.duration.toFixed(2)}s</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="10.0"
              step="0.25"
              value={overlay.duration}
              onChange={(e) => update({ duration: Math.max(0.25, parseFloat(e.target.value)) })}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Canvas Position */}
        <div className="space-y-2 p-2.5 rounded-xl bg-dark-950/60 border border-slate-800">
          <div className="flex items-center space-x-1 text-slate-400 text-[10px] uppercase font-semibold">
            <MapPin className="w-3 h-3 text-emerald-400" />
            <span>Canvas Placement</span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-slate-300 text-[11px]">
              <span>Position X</span>
              <span className="font-mono text-emerald-300">{Math.round(overlay.position.x * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="0.9"
              step="0.01"
              value={overlay.position.x}
              onChange={(e) => update({ position: { ...overlay.position, x: parseFloat(e.target.value) } })}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          <div className="space-y-1 pt-1 border-t border-slate-800/60">
            <div className="flex justify-between text-slate-300 text-[11px]">
              <span>Position Y</span>
              <span className="font-mono text-emerald-300">{Math.round(overlay.position.y * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="0.9"
              step="0.01"
              value={overlay.position.y}
              onChange={(e) => update({ position: { ...overlay.position, y: parseFloat(e.target.value) } })}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Style */}
        <div className="space-y-1.5">
          <span className="text-slate-400 text-[11px]">Style & Lower Third Preset</span>
          <div className="grid grid-cols-2 gap-1 bg-dark-950 p-1 rounded-xl border border-slate-800">
            {([
              { id: 'speaker-pill', label: 'Speaker Pill' },
              { id: 'tech-badge', label: 'Tech Badge' },
              { id: 'social-cta', label: 'Social CTA' },
              { id: 'launch-tag', label: 'Launch Ribbon' },
              { id: 'pill', label: 'Standard Pill' },
              { id: 'frosted', label: 'Frosted Glass' },
            ] as { id: BadgeStyle; label: string }[]).map((s) => (
              <button
                key={s.id}
                onClick={() => update({ 
                  style: s.id,
                  lowerThirdPreset: ['speaker-pill', 'tech-badge', 'social-cta', 'launch-tag'].includes(s.id) ? (s.id as any) : undefined 
                })}
                className={`py-1 px-1.5 rounded-lg font-medium text-[11px] truncate transition ${
                  overlay.style === s.id ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Font Size */}
        <div className="space-y-1">
          <div className="flex justify-between text-slate-400 text-[11px]">
            <span>Font Size</span>
            <span className="font-mono text-slate-200">{overlay.fontSize}px</span>
          </div>
          <input
            type="range"
            min="14"
            max="36"
            step="1"
            value={overlay.fontSize}
            onChange={(e) => update({ fontSize: parseInt(e.target.value) })}
            className="w-full accent-emerald-500 cursor-pointer"
          />
        </div>

        {/* Delete Action */}
        <div className="pt-2 border-t border-slate-800">
          <button
            onClick={removeSelected}
            className="w-full py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center justify-center space-x-1.5 transition text-xs font-semibold"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Callout</span>
          </button>
        </div>
      </div>
    );
  }

  // 5. Speed Segment Inspector
  if (project.selectedEvent.type === 'speed') {
    const speed = project.speedSegments.find(s => s.id === project.selectedEvent?.id);
    if (!speed) return null;

    const update = (partial: Partial<typeof speed>) => {
      onChange({
        speedSegments: project.speedSegments.map(s => (s.id === speed.id ? { ...s, ...partial } : s)),
      });
    };

    return (
      <div className="w-72 border-l border-slate-800/80 bg-dark-900/80 backdrop-blur p-4 select-none text-xs space-y-5 overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-2 font-semibold text-amber-400">
            <Gauge className="w-4 h-4" />
            <span>Speed Segment</span>
          </div>
          <button onClick={close} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Rate Presets */}
        <div className="space-y-2">
          <div className="flex justify-between text-slate-400 text-[11px]">
            <span>Speed Multiplier</span>
            <span className="font-mono font-semibold text-amber-300">
              {speed.rate}x {speed.rate < 1 ? `(${Math.round(1 / speed.rate)}x Slow-Mo)` : speed.rate > 1 ? `(${speed.rate}x Fast)` : ''}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            {[0.25, 0.5, 0.75, 1.25, 1.5, 2.0, 3.0, 4.0].map((rate) => (
              <button
                key={rate}
                onClick={() => update({ rate })}
                className={`py-1.5 rounded-xl font-mono text-[11px] font-medium transition border ${
                  speed.rate === rate
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-sm'
                    : 'bg-dark-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>

          <div className="pt-1">
            <input
              type="range"
              min="0.2"
              max="6.0"
              step="0.05"
              value={speed.rate}
              onChange={(e) => update({ rate: parseFloat(parseFloat(e.target.value).toFixed(2)) })}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>
        </div>

        {/* CapCut Speed Curve Presets */}
        <div className="space-y-1.5 pt-1">
          <span className="text-slate-400 text-[11px]">CapCut Speed Curves</span>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { label: 'Hero Flash-In', rate: 3.0 },
              { label: 'Montage Jump', rate: 2.5 },
              { label: 'Bullet Time', rate: 0.25 },
              { label: 'Hyper Riser', rate: 4.0 },
            ].map((curve) => (
              <button
                key={curve.label}
                onClick={() => update({ rate: curve.rate })}
                className={`px-2 py-1.5 rounded-lg text-left text-[10px] font-medium border transition ${
                  speed.rate === curve.rate
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                    : 'bg-dark-950/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {curve.label}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline Timing */}
        <div className="space-y-2 p-2.5 rounded-xl bg-dark-950/60 border border-slate-800">
          <div className="flex items-center space-x-1 text-slate-400 text-[10px] uppercase font-semibold">
            <Clock className="w-3 h-3 text-amber-400" />
            <span>Timeline Timing</span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-slate-300 text-[11px]">
              <span>Start Time</span>
              <span className="font-mono text-amber-300">{speed.startTime.toFixed(2)}s</span>
            </div>
            <input
              type="range"
              min="0"
              max={totalDuration}
              step="0.05"
              value={speed.startTime}
              onChange={(e) => update({ startTime: Math.max(0, parseFloat(e.target.value)) })}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          <div className="space-y-1 pt-1 border-t border-slate-800/60">
            <div className="flex justify-between text-slate-300 text-[11px]">
              <span>Duration</span>
              <span className="font-mono text-amber-300">{speed.duration.toFixed(2)}s</span>
            </div>
            <input
              type="range"
              min="0.25"
              max="10.0"
              step="0.25"
              value={speed.duration}
              onChange={(e) => update({ duration: Math.max(0.25, parseFloat(e.target.value)) })}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Delete Action */}
        <div className="pt-2 border-t border-slate-800">
          <button
            onClick={removeSelected}
            className="w-full py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center justify-center space-x-1.5 transition text-xs font-semibold"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Speed Segment</span>
          </button>
        </div>
      </div>
    );
  }

  // 6. Subtitle & Kinetic Caption Inspector
  if (project.selectedEvent.type === 'subtitle') {
    const sub = project.subtitles?.find(s => s.id === project.selectedEvent?.id);
    if (!sub) return null;

    const update = (partial: Partial<typeof sub>) => {
      onChange({
        subtitles: (project.subtitles || []).map(s => (s.id === sub.id ? { ...s, ...partial } : s)),
      });
    };

    return (
      <div className="w-72 border-l border-slate-800/80 bg-dark-900/80 backdrop-blur p-4 select-none text-xs space-y-5 overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-2 font-semibold text-yellow-400">
            <Subtitles className="w-4 h-4" />
            <span>Caption Inspector</span>
          </div>
          <button onClick={close} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Text Input */}
        <div className="space-y-1.5">
          <span className="text-slate-400 text-[11px]">Subtitle Text</span>
          <textarea
            rows={2}
            value={sub.text}
            onChange={(e) => update({ text: e.target.value })}
            placeholder="Type viral caption..."
            className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-yellow-500 resize-none transition"
          />
        </div>

        {/* Caption Style */}
        <div className="space-y-1.5">
          <span className="text-slate-400 text-[11px]">Caption Style</span>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { id: 'hormozi', label: 'Viral Hormozi', color: '#FDE047' },
              { id: 'neonGlow', label: 'Neon Glow', color: '#38BDF8' },
              { id: 'glassCard', label: 'Glass Card', color: '#CBD5E1' },
              { id: 'minimal', label: 'Minimal Sans', color: '#FFFFFF' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => update({ style: st.id as SubtitleStyle })}
                className={`px-2.5 py-1.5 rounded-lg text-left text-[11px] font-medium transition border flex items-center space-x-1.5 ${
                  sub.style === st.id
                    ? 'bg-yellow-500/20 border-yellow-400 text-yellow-300 shadow-sm'
                    : 'bg-dark-950/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: st.color }} />
                <span className="truncate">{st.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Uppercase Toggle & Font Size */}
        <div className="space-y-3 p-3 rounded-xl bg-dark-950/60 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-[11px]">ALL CAPS (Viral)</span>
            <input
              type="checkbox"
              checked={sub.uppercase ?? true}
              onChange={(e) => update({ uppercase: e.target.checked })}
              className="accent-yellow-500 cursor-pointer w-4 h-4 rounded"
            />
          </div>

          <div className="space-y-1 pt-1 border-t border-slate-800/60">
            <div className="flex justify-between text-slate-300 text-[11px]">
              <span>Font Size</span>
              <span className="font-mono text-yellow-300">{sub.fontSize || 36}px</span>
            </div>
            <input
              type="range"
              min="20"
              max="64"
              step="2"
              value={sub.fontSize || 36}
              onChange={(e) => update({ fontSize: parseInt(e.target.value) })}
              className="w-full accent-yellow-500 cursor-pointer"
            />
          </div>

          <div className="space-y-1 pt-1 border-t border-slate-800/60">
            <div className="flex justify-between text-slate-300 text-[11px]">
              <span>Vertical Position</span>
              <span className="font-mono text-yellow-300">{Math.round((sub.positionY ?? 0.82) * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="0.95"
              step="0.02"
              value={sub.positionY ?? 0.82}
              onChange={(e) => update({ positionY: parseFloat(e.target.value) })}
              className="w-full accent-yellow-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Timeline Timing */}
        <div className="space-y-2 p-2.5 rounded-xl bg-dark-950/60 border border-slate-800">
          <div className="flex items-center space-x-1 text-slate-400 text-[10px] uppercase font-semibold">
            <Clock className="w-3 h-3 text-yellow-400" />
            <span>Timing</span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-slate-300 text-[11px]">
              <span>Start Time</span>
              <span className="font-mono text-yellow-300">{sub.startTime.toFixed(2)}s</span>
            </div>
            <input
              type="range"
              min="0"
              max={totalDuration}
              step="0.05"
              value={sub.startTime}
              onChange={(e) => update({ startTime: Math.max(0, parseFloat(e.target.value)) })}
              className="w-full accent-yellow-500 cursor-pointer"
            />
          </div>

          <div className="space-y-1 pt-1 border-t border-slate-800/60">
            <div className="flex justify-between text-slate-300 text-[11px]">
              <span>Duration</span>
              <span className="font-mono text-yellow-300">{sub.duration.toFixed(2)}s</span>
            </div>
            <input
              type="range"
              min="0.25"
              max="10.0"
              step="0.25"
              value={sub.duration}
              onChange={(e) => update({ duration: Math.max(0.25, parseFloat(e.target.value)) })}
              className="w-full accent-yellow-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Delete Action */}
        <div className="pt-2 border-t border-slate-800">
          <button
            onClick={removeSelected}
            className="w-full py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center justify-center space-x-1.5 transition text-xs font-semibold"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Caption</span>
          </button>
        </div>
      </div>
    );
  }

  // 6. Sticker & Emoji Inspector
  if (project.selectedEvent.type === 'sticker') {
    const sticker = project.stickers?.find(s => s.id === project.selectedEvent?.id);
    if (!sticker) return null;

    const update = (partial: Partial<typeof sticker>) => {
      onChange({
        stickers: (project.stickers || []).map(s => (s.id === sticker.id ? { ...s, ...partial } : s)),
      });
    };

    return (
      <div className="w-72 border-l border-slate-800/80 bg-dark-900/80 backdrop-blur p-4 select-none text-xs space-y-5 overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-2 font-semibold text-amber-400">
            <Smile className="w-4 h-4" />
            <span>Sticker / Emoji</span>
          </div>
          <button onClick={close} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sticker Preview */}
        <div className="p-4 rounded-2xl bg-dark-950/80 border border-slate-800 flex flex-col items-center justify-center space-y-2">
          <span className="text-4xl select-none">{sticker.emojiOrIcon}</span>
          <span className="text-[10px] text-slate-400 font-mono">Drag on canvas to position</span>
        </div>

        {/* Animation */}
        <div className="space-y-1.5">
          <span className="text-slate-400 text-[11px]">Animation Style</span>
          <div className="grid grid-cols-3 gap-1 bg-dark-950 p-1 rounded-xl border border-slate-800">
            {(['pop', 'bounce', 'pulse', 'float', 'spin', 'none'] as StickerAnimation[]).map((anim) => (
              <button
                key={anim}
                onClick={() => update({ animation: anim })}
                className={`py-1.5 rounded-lg capitalize text-[10px] font-medium transition ${
                  sticker.animation === anim ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                {anim}
              </button>
            ))}
          </div>
        </div>

        {/* Size Slider */}
        <div className="space-y-1.5 p-2.5 rounded-xl bg-dark-950/60 border border-slate-800">
          <div className="flex justify-between text-slate-300 text-[11px]">
            <span>Size</span>
            <span className="font-mono text-amber-300">{sticker.size}px</span>
          </div>
          <input
            type="range"
            min="24"
            max="128"
            step="4"
            value={sticker.size}
            onChange={(e) => update({ size: parseInt(e.target.value) })}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>

        {/* Rotation Slider */}
        <div className="space-y-1.5 p-2.5 rounded-xl bg-dark-950/60 border border-slate-800">
          <div className="flex justify-between text-slate-300 text-[11px]">
            <span>Rotation</span>
            <span className="font-mono text-amber-300">{sticker.rotation || 0}°</span>
          </div>
          <input
            type="range"
            min="-180"
            max="180"
            step="5"
            value={sticker.rotation || 0}
            onChange={(e) => update({ rotation: parseInt(e.target.value) })}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>

        {/* Timeline Timing */}
        <div className="space-y-2 p-2.5 rounded-xl bg-dark-950/60 border border-slate-800">
          <div className="flex items-center space-x-1 text-slate-400 text-[10px] uppercase font-semibold">
            <Clock className="w-3 h-3 text-amber-400" />
            <span>Timeline Timing</span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-slate-300 text-[11px]">
              <span>Start Time</span>
              <span className="font-mono text-amber-300">{sticker.startTime.toFixed(2)}s</span>
            </div>
            <input
              type="range"
              min="0"
              max={totalDuration}
              step="0.05"
              value={sticker.startTime}
              onChange={(e) => update({ startTime: Math.max(0, parseFloat(e.target.value)) })}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          <div className="space-y-1 pt-1 border-t border-slate-800/60">
            <div className="flex justify-between text-slate-300 text-[11px]">
              <span>Duration</span>
              <span className="font-mono text-amber-300">{sticker.duration.toFixed(2)}s</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="15.0"
              step="0.25"
              value={sticker.duration}
              onChange={(e) => update({ duration: Math.max(0.5, parseFloat(e.target.value)) })}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Delete Action */}
        <div className="pt-2 border-t border-slate-800">
          <button
            onClick={removeSelected}
            className="w-full py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center justify-center space-x-1.5 transition text-xs font-semibold"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Sticker</span>
          </button>
        </div>
      </div>
    );
  }

  // 7. Video Track & Trimming Inspector
  if (project.selectedEvent.type === 'video') {
    const videoDur = project.videoDuration || totalDuration;
    const trimStart = project.trimStartTime || 0;
    const trimEnd = project.trimEndTime || videoDur;
    const cutDur = Math.max(0, trimEnd - trimStart);

    return (
      <div className="w-72 border-l border-slate-800/80 bg-dark-900/80 backdrop-blur p-4 select-none text-xs space-y-5 overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-2 font-semibold text-brand-400">
            <Scissors className="w-4 h-4" />
            <span>Video Source & Trimming</span>
          </div>
          <button onClick={close} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Info */}
        <div className="space-y-1">
          <span className="text-slate-400 text-[11px]">File Name</span>
          <p className="font-mono text-slate-200 text-xs truncate bg-dark-950 p-2.5 rounded-xl border border-slate-800">
            {project.displayName || 'Screen Recording.mp4'}
          </p>
          <div className="flex justify-between text-[10px] text-slate-500 px-1 pt-0.5 font-mono">
            <span>{project.videoNaturalWidth}x{project.videoNaturalHeight}</span>
            <span>Total: {videoDur.toFixed(1)}s</span>
          </div>
        </div>

        {/* In-Point (Trim Start) */}
        <div className="space-y-1.5 p-2.5 rounded-xl bg-dark-950/60 border border-slate-800">
          <div className="flex justify-between text-slate-300 text-[11px] font-medium">
            <span className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>In-Point (Start Trim)</span>
            </span>
            <span className="font-mono text-amber-300">{trimStart.toFixed(2)}s</span>
          </div>
          <input
            type="range"
            min="0"
            max={Math.max(0, trimEnd - 0.5)}
            step="0.05"
            value={trimStart}
            onChange={(e) => onChange({ trimStartTime: Math.max(0, parseFloat(e.target.value)) })}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>

        {/* Out-Point (Trim End) */}
        <div className="space-y-1.5 p-2.5 rounded-xl bg-dark-950/60 border border-slate-800">
          <div className="flex justify-between text-slate-300 text-[11px] font-medium">
            <span className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Out-Point (End Trim)</span>
            </span>
            <span className="font-mono text-amber-300">{trimEnd.toFixed(2)}s</span>
          </div>
          <input
            type="range"
            min={Math.min(videoDur, trimStart + 0.5)}
            max={videoDur}
            step="0.05"
            value={trimEnd}
            onChange={(e) => onChange({ trimEndTime: Math.min(videoDur, parseFloat(e.target.value)) })}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>

        {/* Effective Cut Summary */}
        <div className="p-3 rounded-xl bg-brand-500/10 border border-brand-500/20 text-center space-y-1">
          <span className="text-[10px] uppercase font-bold text-brand-300 tracking-wider">Export Cut Duration</span>
          <p className="text-lg font-bold font-mono text-white">{cutDur.toFixed(2)}s</p>
          <p className="text-[10px] text-slate-400">
            Trimmed out {(videoDur - cutDur).toFixed(2)}s from source
          </p>
        </div>

        {/* Quick Trim Shortcuts */}
        <div className="space-y-1.5 pt-1">
          <span className="text-slate-400 text-[11px]">Quick Trims</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onChange({ trimStartTime: Math.min(3.0, trimEnd - 0.5) })}
              className="py-1.5 px-2 rounded-lg bg-dark-950 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 transition"
            >
              Skip First 3s
            </button>
            <button
              onClick={() => onChange({ trimEndTime: Math.max(trimStart + 0.5, videoDur - 3.0) })}
              className="py-1.5 px-2 rounded-lg bg-dark-950 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 transition"
            >
              Cut Last 3s
            </button>
          </div>
          <button
            onClick={() => onChange({ trimStartTime: 0, trimEndTime: videoDur })}
            className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition"
          >
            Reset to Full Video
          </button>
        </div>
      </div>
    );
  }

  // 8. Cinema Transition Inspector
  if (project.selectedEvent.type === 'transition') {
    const tr = (project.transitions || []).find(t => t.id === project.selectedEvent?.id);
    if (!tr) return null;

    const update = (partial: Partial<typeof tr>) => {
      onChange({
        transitions: (project.transitions || []).map(t => (t.id === tr.id ? { ...t, ...partial } : t)),
      });
    };

    return (
      <div className="w-72 border-l border-slate-800/80 bg-dark-900/80 backdrop-blur p-4 select-none text-xs space-y-5 overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-2 font-semibold text-purple-400">
            <RotateCw className="w-4 h-4" />
            <span>Cinema Transition</span>
          </div>
          <button onClick={close} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Transition Preset Type */}
        <div className="space-y-1.5">
          <label className="text-slate-400 text-[11px] font-medium">Transition Cut Style</label>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { id: 'whipPan', label: 'Whip Pan' },
              { id: 'crashZoom', label: 'Crash Zoom' },
              { id: 'lightLeakFlash', label: 'Light Leak' },
              { id: 'rgbGlitch', label: 'RGB Glitch' },
              { id: 'filmBurn', label: 'Film Burn' },
              { id: 'vortexSwirl', label: 'Vortex Swirl' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => update({ type: p.id as TransitionType })}
                className={`py-1.5 px-2 rounded-xl text-left font-medium text-[11px] truncate border transition ${
                  tr.type === p.id
                    ? 'bg-purple-500/20 border-purple-400 text-purple-300 shadow-sm'
                    : 'bg-dark-950/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Direction (for Whip Pan) */}
        {tr.type === 'whipPan' && (
          <div className="space-y-1.5">
            <label className="text-slate-400 text-[11px] font-medium">Pan Direction</label>
            <div className="grid grid-cols-4 gap-1 bg-dark-950 p-1 rounded-xl border border-slate-800">
              {(['left', 'right', 'up', 'down'] as const).map((dir) => (
                <button
                  key={dir}
                  onClick={() => update({ direction: dir })}
                  className={`py-1 rounded-lg capitalize font-medium text-[10px] transition ${
                    tr.direction === dir ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {dir}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Timeline Timing */}
        <div className="space-y-3">
          <div className="space-y-1.5 p-2.5 rounded-xl bg-dark-950/60 border border-slate-800">
            <div className="flex justify-between text-slate-300 text-[11px] font-medium">
              <span className="flex items-center space-x-1">
                <Clock className="w-3 h-3 text-purple-400" />
                <span>Start Time</span>
              </span>
              <span className="font-mono text-purple-300">{tr.startTime.toFixed(2)}s</span>
            </div>
            <input
              type="range"
              min="0"
              max={totalDuration}
              step="0.05"
              value={tr.startTime}
              onChange={(e) => update({ startTime: Math.max(0, parseFloat(e.target.value)) })}
              className="w-full accent-purple-500 cursor-pointer"
            />
          </div>

          <div className="space-y-1.5 p-2.5 rounded-xl bg-dark-950/60 border border-slate-800">
            <div className="flex justify-between text-slate-300 text-[11px] font-medium">
              <span className="flex items-center space-x-1">
                <Clock className="w-3 h-3 text-purple-400" />
                <span>Duration</span>
              </span>
              <span className="font-mono text-purple-300">{tr.duration.toFixed(2)}s</span>
            </div>
            <input
              type="range"
              min="0.15"
              max="2.0"
              step="0.05"
              value={tr.duration}
              onChange={(e) => update({ duration: Math.max(0.15, parseFloat(e.target.value)) })}
              className="w-full accent-purple-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Intensity */}
        <div className="space-y-1.5 p-2.5 rounded-xl bg-dark-950/60 border border-slate-800">
          <div className="flex justify-between text-slate-300 text-[11px] font-medium">
            <span>Effect Intensity</span>
            <span className="font-mono text-purple-300">{Math.round((tr.intensity || 1.0) * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.2"
            max="2.0"
            step="0.1"
            value={tr.intensity || 1.0}
            onChange={(e) => update({ intensity: parseFloat(e.target.value) })}
            className="w-full accent-purple-500 cursor-pointer"
          />
        </div>

        {/* Delete Action */}
        <div className="pt-2 border-t border-slate-800">
          <button
            onClick={removeSelected}
            className="w-full py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center justify-center space-x-1.5 transition text-xs font-semibold"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Transition</span>
          </button>
        </div>
      </div>
    );
  }

  // 9. Typewriter Stroke Typed Overlay Inspector
  if (project.selectedEvent.type === 'typewriter') {
    const tw = (project.typewriters || []).find(t => t.id === project.selectedEvent?.id);
    if (!tw) return null;

    const update = (partial: Partial<typeof tw>) => {
      onChange({
        typewriters: (project.typewriters || []).map(t => (t.id === tw.id ? { ...t, ...partial } : t)),
      });
    };

    return (
      <div className="w-72 border-l border-slate-800/80 bg-dark-900/80 backdrop-blur p-4 select-none text-xs space-y-5 overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-2 font-semibold text-cyan-400">
            <Type className="w-4 h-4" />
            <span>Typewriter Caption</span>
          </div>
          <button onClick={close} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Text */}
        <div className="space-y-1.5">
          <label className="text-slate-400 text-[11px] font-medium">Main Heading Text</label>
          <textarea
            value={tw.text}
            onChange={(e) => update({ text: e.target.value })}
            rows={2}
            className="w-full bg-dark-950 border border-slate-800 rounded-xl p-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono text-xs resize-none"
          />
        </div>

        {/* Subtitle / Explainer */}
        <div className="space-y-1.5">
          <label className="text-slate-400 text-[11px] font-medium">Subtitle / Narrative Explainer</label>
          <textarea
            value={tw.subtitle || ''}
            onChange={(e) => update({ subtitle: e.target.value })}
            rows={2}
            className="w-full bg-dark-950 border border-slate-800 rounded-xl p-2 text-slate-200 focus:outline-none focus:border-cyan-500 text-xs resize-none"
          />
        </div>

        {/* Phase / Tag */}
        <div className="space-y-1.5">
          <label className="text-slate-400 text-[11px] font-medium">Phase Badge / Tag</label>
          <input
            type="text"
            value={tw.tag || ''}
            onChange={(e) => update({ tag: e.target.value })}
            placeholder="e.g. PHASE 01 // SYNTHESIS"
            className="w-full bg-dark-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500 text-xs font-mono"
          />
        </div>

        {/* Timing */}
        <div className="space-y-3">
          <div className="space-y-1.5 p-2.5 rounded-xl bg-dark-950/60 border border-slate-800">
            <div className="flex justify-between text-slate-300 text-[11px] font-medium">
              <span className="flex items-center space-x-1">
                <Clock className="w-3 h-3 text-cyan-400" />
                <span>Start Time</span>
              </span>
              <span className="font-mono text-cyan-300">{tw.startTime.toFixed(2)}s</span>
            </div>
            <input
              type="range"
              min="0"
              max={totalDuration}
              step="0.05"
              value={tw.startTime}
              onChange={(e) => update({ startTime: parseFloat(e.target.value) })}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>

          <div className="space-y-1.5 p-2.5 rounded-xl bg-dark-950/60 border border-slate-800">
            <div className="flex justify-between text-slate-300 text-[11px] font-medium">
              <span className="flex items-center space-x-1">
                <Clock className="w-3 h-3 text-cyan-400" />
                <span>Duration</span>
              </span>
              <span className="font-mono text-cyan-300">{tw.duration.toFixed(2)}s</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="20"
              step="0.1"
              value={tw.duration}
              onChange={(e) => update({ duration: parseFloat(e.target.value) })}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Typing Speed & Font Size */}
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1 p-2 rounded-xl bg-dark-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-400">Speed ({tw.typingSpeedCps || 24} cps)</span>
            <input
              type="range"
              min="8"
              max="60"
              step="1"
              value={tw.typingSpeedCps || 24}
              onChange={(e) => update({ typingSpeedCps: parseInt(e.target.value) })}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>

          <div className="space-y-1 p-2 rounded-xl bg-dark-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-400">Font ({tw.fontSize || 32}px)</span>
            <input
              type="range"
              min="18"
              max="56"
              step="2"
              value={tw.fontSize || 32}
              onChange={(e) => update({ fontSize: parseInt(e.target.value) })}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Position Y */}
        <div className="space-y-1.5 p-2.5 rounded-xl bg-dark-950/60 border border-slate-800">
          <div className="flex justify-between text-slate-300 text-[11px] font-medium">
            <span className="flex items-center space-x-1">
              <MapPin className="w-3 h-3 text-cyan-400" />
              <span>Vertical Position Y</span>
            </span>
            <span className="font-mono text-cyan-300">{Math.round(tw.position.y * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.05"
            max="0.95"
            step="0.01"
            value={tw.position.y}
            onChange={(e) => update({ position: { ...tw.position, y: parseFloat(e.target.value) } })}
            className="w-full accent-cyan-500 cursor-pointer"
          />
        </div>

        {/* Stroke Outline Width */}
        <div className="space-y-1.5 p-2.5 rounded-xl bg-dark-950/60 border border-slate-800">
          <div className="flex justify-between text-slate-300 text-[11px] font-medium">
            <span>Stroke Outline Width</span>
            <span className="font-mono text-cyan-300">{tw.strokeWidth || 4}px</span>
          </div>
          <input
            type="range"
            min="0"
            max="12"
            step="1"
            value={tw.strokeWidth || 4}
            onChange={(e) => update({ strokeWidth: parseInt(e.target.value) })}
            className="w-full accent-cyan-500 cursor-pointer"
          />
        </div>

        {/* Delete Action */}
        <div className="pt-2 border-t border-slate-800">
          <button
            onClick={removeSelected}
            className="w-full py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center justify-center space-x-1.5 transition text-xs font-semibold"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Typewriter Caption</span>
          </button>
        </div>
      </div>
    );
  }

  // 10. Brand Asset & Image Overlay Inspector
  if (project.selectedEvent.type === 'imageOverlay') {
    const img = (project.imageOverlays || []).find(i => i.id === project.selectedEvent?.id);
    if (!img) return null;

    const update = (partial: Partial<typeof img>) => {
      onChange({
        imageOverlays: (project.imageOverlays || []).map(i => (i.id === img.id ? { ...i, ...partial } : i)),
      });
    };

    return (
      <div className="w-72 border-l border-slate-800/80 bg-dark-900/80 backdrop-blur p-4 select-none text-xs space-y-5 overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-2 font-semibold text-amber-400">
            <Crown className="w-4 h-4" />
            <span>Brand Overlay</span>
          </div>
          <button onClick={close} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Preview Thumbnail */}
        <div className="p-3 bg-dark-950 rounded-xl border border-slate-800 flex flex-col items-center justify-center space-y-2">
          <img
            src={img.imageUrl}
            alt={img.name}
            className="max-h-24 max-w-full object-contain rounded drop-shadow-md"
          />
          <span className="font-semibold text-slate-200 text-[11px] truncate w-full text-center">
            {img.name || 'Brand Graphic'}
          </span>
        </div>

        {/* Timing */}
        <div className="space-y-3">
          <div className="space-y-1.5 p-2.5 rounded-xl bg-dark-950/60 border border-slate-800">
            <div className="flex justify-between text-slate-300 text-[11px] font-medium">
              <span className="flex items-center space-x-1">
                <Clock className="w-3 h-3 text-amber-400" />
                <span>Start Time</span>
              </span>
              <span className="font-mono text-amber-300">{img.startTime.toFixed(2)}s</span>
            </div>
            <input
              type="range"
              min="0"
              max={totalDuration}
              step="0.05"
              value={img.startTime}
              onChange={(e) => update({ startTime: parseFloat(e.target.value) })}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          <div className="space-y-1.5 p-2.5 rounded-xl bg-dark-950/60 border border-slate-800">
            <div className="flex justify-between text-slate-300 text-[11px] font-medium">
              <span className="flex items-center space-x-1">
                <Clock className="w-3 h-3 text-amber-400" />
                <span>Duration</span>
              </span>
              <span className="font-mono text-amber-300">{img.duration.toFixed(2)}s</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="30"
              step="0.1"
              value={img.duration}
              onChange={(e) => update({ duration: parseFloat(e.target.value) })}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Scale & Opacity */}
        <div className="space-y-3">
          <div className="space-y-1.5 p-2.5 rounded-xl bg-dark-950/60 border border-slate-800">
            <div className="flex justify-between text-slate-300 text-[11px] font-medium">
              <span>Scale ({Math.round(img.scale * 100)}%)</span>
              <span className="font-mono text-amber-300">{img.scale.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="2.0"
              step="0.02"
              value={img.scale}
              onChange={(e) => update({ scale: parseFloat(e.target.value) })}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          <div className="space-y-1.5 p-2.5 rounded-xl bg-dark-950/60 border border-slate-800">
            <div className="flex justify-between text-slate-300 text-[11px] font-medium">
              <span>Opacity ({Math.round((img.opacity ?? 1) * 100)}%)</span>
              <span className="font-mono text-amber-300">{((img.opacity ?? 1) * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={img.opacity ?? 1}
              onChange={(e) => update({ opacity: parseFloat(e.target.value) })}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Position X & Y */}
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1 p-2 rounded-xl bg-dark-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-400">Position X ({Math.round(img.position.x * 100)}%)</span>
            <input
              type="range"
              min="0.02"
              max="0.98"
              step="0.01"
              value={img.position.x}
              onChange={(e) => update({ position: { ...img.position, x: parseFloat(e.target.value) } })}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          <div className="space-y-1 p-2 rounded-xl bg-dark-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-400">Position Y ({Math.round(img.position.y * 100)}%)</span>
            <input
              type="range"
              min="0.02"
              max="0.98"
              step="0.01"
              value={img.position.y}
              onChange={(e) => update({ position: { ...img.position, y: parseFloat(e.target.value) } })}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Delete Action */}
        <div className="pt-2 border-t border-slate-800">
          <button
            onClick={removeSelected}
            className="w-full py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center justify-center space-x-1.5 transition text-xs font-semibold"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Brand Overlay</span>
          </button>
        </div>
      </div>
    );
  }

  return null;
};
