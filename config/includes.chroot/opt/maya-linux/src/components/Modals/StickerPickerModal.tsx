import React, { useState } from 'react';
import { Smile, X, Sparkles, Flame, Check, Star, Heart, Zap, Target, MousePointer2 } from 'lucide-react';
import { StickerItem, StickerAnimation } from '../../types/models';
import { ProjectState } from '../../types/project';

interface StickerPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectState;
  onAddSticker: (sticker: StickerItem) => void;
}

const STICKER_LIST = [
  { emoji: '🔥', label: 'Fire' },
  { emoji: '✨', label: 'Sparkles' },
  { emoji: '🚀', label: 'Rocket' },
  { emoji: '❤️', label: 'Heart' },
  { emoji: '👍', label: 'Thumbs Up' },
  { emoji: '⚡', label: 'Lightning' },
  { emoji: '💯', label: '100 Score' },
  { emoji: '🎯', label: 'Target' },
  { emoji: '👆', label: 'Point Up' },
  { emoji: '👇', label: 'Point Down' },
  { emoji: '💡', label: 'Idea' },
  { emoji: '🎉', label: 'Party' },
  { emoji: '🚨', label: 'Alert' },
  { emoji: '⭐', label: 'Star' },
  { emoji: '👑', label: 'Crown' },
  { emoji: '💰', label: 'Money Bag' },
];

export const StickerPickerModal: React.FC<StickerPickerModalProps> = ({
  isOpen,
  onClose,
  project,
  onAddSticker,
}) => {
  const [selectedEmoji, setSelectedEmoji] = useState('🔥');
  const [animation, setAnimation] = useState<StickerAnimation>('pop');
  const [size, setSize] = useState(64);

  if (!isOpen) return null;

  const handleAdd = () => {
    const newSticker: StickerItem = {
      id: crypto.randomUUID(),
      startTime: project.currentSeconds || 0,
      duration: 2.5,
      emojiOrIcon: selectedEmoji,
      position: { x: 0.5, y: 0.5 },
      size,
      animation,
    };
    onAddSticker(newSticker);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-dark-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="w-[460px] bg-dark-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center space-x-2 text-brand-400 font-semibold">
            <Smile className="w-5 h-5" />
            <span className="text-white font-bold">Add Animated Sticker</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Emoji Grid */}
        <div className="space-y-1.5">
          <span className="text-xs text-slate-300 font-medium">Choose Sticker / Emoji</span>
          <div className="grid grid-cols-4 gap-2 bg-dark-950 p-2.5 rounded-2xl border border-slate-800 max-h-48 overflow-y-auto">
            {STICKER_LIST.map((item) => {
              const isSelected = selectedEmoji === item.emoji;
              return (
                <button
                  key={item.emoji}
                  onClick={() => setSelectedEmoji(item.emoji)}
                  className={`py-2 rounded-xl text-2xl flex flex-col items-center justify-center transition border ${
                    isSelected
                      ? 'bg-brand-500/20 border-brand-400 scale-105 shadow-md shadow-brand-500/20'
                      : 'bg-dark-900 border-slate-800/80 hover:border-slate-700 hover:scale-105'
                  }`}
                >
                  <span>{item.emoji}</span>
                  <span className="text-[9px] text-slate-400 mt-1 truncate max-w-full">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Animation Style */}
        <div className="space-y-1.5">
          <span className="text-xs text-slate-300 font-medium">Entrance Animation</span>
          <div className="grid grid-cols-3 gap-1.5 bg-dark-950 p-1 rounded-xl border border-slate-800">
            {(['pop', 'bounce', 'pulse', 'float', 'spin', 'none'] as StickerAnimation[]).map((anim) => (
              <button
                key={anim}
                onClick={() => setAnimation(anim)}
                className={`py-1.5 rounded-lg capitalize text-xs font-medium transition ${
                  animation === anim ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                {anim}
              </button>
            ))}
          </div>
        </div>

        {/* Size Slider */}
        <div className="space-y-1 p-2.5 rounded-xl bg-dark-950/70 border border-slate-800">
          <div className="flex justify-between text-slate-300 text-[11px]">
            <span>Sticker Size</span>
            <span className="font-mono text-brand-300">{size}px</span>
          </div>
          <input
            type="range"
            min="32"
            max="128"
            step="4"
            value={size}
            onChange={(e) => setSize(parseInt(e.target.value))}
            className="w-full accent-brand-500 cursor-pointer"
          />
        </div>

        {/* Add Button */}
        <button
          onClick={handleAdd}
          className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-xs font-semibold text-white transition flex items-center justify-center space-x-2 shadow-lg shadow-brand-600/30 active:scale-95"
        >
          <Sparkles className="w-4 h-4" />
          <span>Add Sticker to Canvas ({selectedEmoji})</span>
        </button>
      </div>
    </div>
  );
};
