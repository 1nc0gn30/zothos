import React from 'react';
import { HelpCircle, X, Play, Scissors, Layers, Sparkles, Download, Undo2 } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const SHORTCUT_CATEGORIES = [
    {
      title: 'Playback & Navigation',
      icon: <Play className="w-4 h-4 text-brand-400" />,
      items: [
        { keys: ['Space'], desc: 'Play / Pause video' },
        { keys: ['M'], desc: 'Mute / Unmute audio' },
        { keys: ['←', '→'], desc: 'Frame step backward / forward' },
      ],
    },
    {
      title: 'Trimming & Timeline Razor',
      icon: <Scissors className="w-4 h-4 text-rose-400" />,
      items: [
        { keys: ['I'], desc: 'Set Trim In-Point at playhead' },
        { keys: ['O'], desc: 'Set Trim Out-Point at playhead' },
        { keys: ['S'], desc: 'Razor Split clip at playhead' },
        { keys: ['Delete'], desc: 'Remove selected clip / element' },
      ],
    },
    {
      title: 'History & Editing',
      icon: <Undo2 className="w-4 h-4 text-indigo-400" />,
      items: [
        { keys: ['Ctrl', 'Z'], desc: 'Undo last action' },
        { keys: ['Ctrl', 'Shift', 'Z'], desc: 'Redo last action' },
        { keys: ['Ctrl', 'S'], desc: 'Save project (.mayaproj)' },
        { keys: ['Ctrl', 'O'], desc: 'Open video file' },
      ],
    },
    {
      title: 'Quick Studio Triggers',
      icon: <Sparkles className="w-4 h-4 text-amber-400" />,
      items: [
        { keys: ['Z'], desc: 'Add Zoom Segment at playhead' },
        { keys: ['T'], desc: 'Add Tap Feedback at playhead' },
        { keys: ['C'], desc: 'Add Hormozi Subtitle phrase' },
        { keys: ['?'], desc: 'Open Keyboard Shortcuts cheat sheet' },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 bg-dark-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-dark-900 border border-slate-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in-95 flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <span>Keyboard Shortcuts Cheat Sheet</span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-300 border border-brand-500/20">
                  Pro Hotkeys
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Speed up your screen recording and video editing workflow
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

        {/* Body */}
        <div className="p-5 space-y-4 overflow-y-auto max-h-[70vh]">
          {SHORTCUT_CATEGORIES.map((cat, i) => (
            <div key={i} className="space-y-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
                {cat.icon}
                <span>{cat.title}</span>
              </div>
              <div className="grid grid-cols-1 gap-1.5 bg-dark-950 p-2.5 rounded-2xl border border-slate-800">
                {cat.items.map((item, j) => (
                  <div key={j} className="flex items-center justify-between py-1 px-2 rounded-lg hover:bg-dark-900 transition">
                    <span className="text-xs text-slate-300">{item.desc}</span>
                    <div className="flex items-center space-x-1">
                      {item.keys.map((k, idx) => (
                        <kbd
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-dark-900 border border-slate-700 text-[10px] font-mono font-bold text-slate-200 shadow-sm"
                        >
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-dark-950/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-xs font-semibold text-white shadow-lg shadow-brand-600/30 transition active:scale-95"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
