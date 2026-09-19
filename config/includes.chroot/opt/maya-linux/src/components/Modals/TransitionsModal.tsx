import React, { useState } from 'react';
import { Sparkles, X, MoveHorizontal, Maximize2, Sun, Zap, Flame, RotateCw, Plus, Play } from 'lucide-react';
import { ProjectState } from '../../types/project';
import { TransitionItem, TransitionType } from '../../types/models';
import { TRANSITION_PRESETS } from '../../services/transitionsService';

interface TransitionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectState;
  onAddTransition: (transition: TransitionItem) => void;
}

export const TransitionsModal: React.FC<TransitionsModalProps> = ({
  isOpen,
  onClose,
  project,
  onAddTransition,
}) => {
  const [selectedType, setSelectedType] = useState<TransitionType>('whipPan');
  const [duration, setDuration] = useState<number>(0.35);
  const [direction, setDirection] = useState<'left' | 'right' | 'up' | 'down'>('left');

  if (!isOpen) return null;

  const getIcon = (type: TransitionType) => {
    switch (type) {
      case 'whipPan': return <MoveHorizontal className="w-5 h-5 text-cyan-400" />;
      case 'crashZoom': return <Maximize2 className="w-5 h-5 text-indigo-400" />;
      case 'lightLeakFlash': return <Sun className="w-5 h-5 text-amber-400" />;
      case 'rgbGlitch': return <Zap className="w-5 h-5 text-rose-400" />;
      case 'filmBurn': return <Flame className="w-5 h-5 text-orange-400" />;
      case 'vortexSwirl': return <RotateCw className="w-5 h-5 text-purple-400" />;
      default: return <Sparkles className="w-5 h-5 text-slate-400" />;
    }
  };

  const handleInsert = (type: TransitionType) => {
    const playheadTime = project.currentSeconds || 0;
    const newTransition: TransitionItem = {
      id: crypto.randomUUID(),
      type,
      startTime: Math.max(0, parseFloat((playheadTime - duration / 2).toFixed(2))),
      duration,
      direction,
      intensity: 1.0,
    };
    onAddTransition(newTransition);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-dark-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-dark-900 border border-slate-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in-95 flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <span>Cinema Transition Effects</span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  Studio Cut
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Seamless whip pans, crash zooms, optical light leaks, and analog film burns
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-950 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Transition Presets Grid */}
        <div className="p-5 grid grid-cols-2 gap-3 overflow-y-auto max-h-[50vh]">
          {TRANSITION_PRESETS.map((preset) => {
            const isSelected = selectedType === preset.id;
            return (
              <div
                key={preset.id}
                onClick={() => {
                  setSelectedType(preset.id);
                  setDuration(preset.duration);
                }}
                className={`p-3.5 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-purple-600/10 border-purple-500 ring-2 ring-purple-500/30'
                    : 'bg-dark-950/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-dark-900 border border-slate-800 flex items-center justify-center">
                    {getIcon(preset.id)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{preset.name}</h4>
                    <span className="text-[10px] font-mono text-slate-400">{preset.duration}s</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 mb-3">{preset.description}</p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleInsert(preset.id);
                  }}
                  className="w-full py-1.5 rounded-xl bg-purple-500/15 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 text-xs font-semibold flex items-center justify-center space-x-1.5 transition active:scale-95 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Insert at Playhead</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer Settings */}
        <div className="p-4 border-t border-slate-800 bg-dark-950/60 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-3">
            <span>Duration:</span>
            <input
              type="range"
              min="0.2"
              max="1.0"
              step="0.05"
              value={duration}
              onChange={(e) => setDuration(parseFloat(e.target.value))}
              className="w-24 accent-purple-500 cursor-pointer"
            />
            <span className="font-mono text-slate-200">{duration.toFixed(2)}s</span>
          </div>

          <button
            onClick={() => handleInsert(selectedType)}
            className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold shadow-lg shadow-purple-500/20 transition active:scale-95"
          >
            Insert Selected
          </button>
        </div>
      </div>
    </div>
  );
};
