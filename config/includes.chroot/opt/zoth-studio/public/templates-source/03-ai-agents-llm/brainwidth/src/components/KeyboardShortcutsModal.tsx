import React from 'react';
import { motion } from 'motion/react';
import { X, Keyboard } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  onClose: () => void;
}

const SHORTCUTS = [
  { key: 'N', label: 'Create new task' },
  { key: '1 / D', label: 'Go to Daily Overview Dashboard' },
  { key: '2 / C', label: 'Go to Calendar View' },
  { key: '3 / T', label: 'Go to Task Planner' },
  { key: '4 / B', label: 'Go to Bandwidth Analysis & Playground' },
  { key: '5 / S', label: 'Go to App Settings' },
  { key: '?', label: 'Toggle keyboard shortcuts menu' },
  { key: 'Esc', label: 'Close open modals' },
];

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[70] p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-title"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl p-6 relative"
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
          <div className="flex items-center gap-2 text-emerald-400">
            <Keyboard size={20} />
            <h2 id="shortcuts-title" className="text-lg font-bold text-white">Keyboard Shortcuts</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg"
            aria-label="Close keyboard shortcuts"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
          {SHORTCUTS.map(sc => (
            <div key={sc.key} className="flex items-center justify-between py-2 border-b border-white/5 text-sm">
              <span className="text-slate-300">{sc.label}</span>
              <kbd className="bg-white/10 border border-white/10 rounded px-2.5 py-1 text-xs font-mono font-bold text-emerald-300 shadow-sm">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center text-xs text-slate-500">
          Press <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-slate-300 font-mono">Esc</kbd> or <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-slate-300 font-mono">?</kbd> at any time to close.
        </div>
      </motion.div>
    </div>
  );
};
