import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Keyboard, X } from "lucide-react";
import { soundFx } from "../lib/audio";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-title"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="glass max-w-lg w-full p-6 md:p-8 rounded-3xl border-white/20 relative shadow-2xl"
      >
        <button
          onClick={() => {
            soundFx.playClick();
            onClose();
          }}
          className="absolute top-5 right-5 text-gray-400 hover:text-white p-2 rounded-xl focus-visible:ring-2 focus-visible:ring-signal-blue focus-visible:outline-none"
          aria-label="Close keyboard shortcuts modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-signal-blue/20 rounded-xl flex items-center justify-center">
            <Keyboard className="w-5 h-5 text-signal-blue" />
          </div>
          <div>
            <h2 id="shortcuts-title" className="text-xl font-bold font-display text-white">
              Keyboard Shortcuts
            </h2>
            <p className="text-xs text-gray-400">Navigate SignalBridge AI with speed</p>
          </div>
        </div>

        <div className="space-y-3 font-mono text-xs">
          {[
            { key: "Ctrl + K / ⌘ + K", action: "Jump directly to Interactive Simulator" },
            { key: "?", action: "Open this Keyboard Shortcuts cheat sheet" },
            { key: "M", action: "Toggle Web Audio SFX sound effects (Mute / Unmute)" },
            { key: "Esc", action: "Close active modal dialogs" },
            { key: "Tab / Shift + Tab", action: "Navigate focusable interactive elements" },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="text-gray-300 font-sans">{item.action}</span>
              <kbd className="px-2.5 py-1 rounded-lg bg-black/60 border border-white/20 text-signal-blue font-mono text-[11px]">
                {item.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="w-full bg-signal-blue hover:bg-blue-600 font-bold py-2.5 rounded-xl text-sm transition-colors focus-visible:ring-2 focus-visible:ring-signal-blue focus-visible:outline-none"
          >
            Got it
          </button>
        </div>
      </motion.div>
    </div>
  );
};
