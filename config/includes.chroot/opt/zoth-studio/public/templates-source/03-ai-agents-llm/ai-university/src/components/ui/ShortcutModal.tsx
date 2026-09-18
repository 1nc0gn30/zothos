import { useEffect } from "react";
import { X, Keyboard, Command } from "lucide-react";
import { soundManager } from "../../utils/soundEffects";

interface ShortcutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShortcutModal({ isOpen, onClose }: ShortcutModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        soundManager.playClick();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const shortcuts = [
    { key: "Alt + H", label: "Navigate to Home" },
    { key: "Alt + A", label: "Navigate to Academics Prospectus" },
    { key: "Alt + P", label: "Open Interactive AI Weight Lab & Playground" },
    { key: "Alt + C", label: "Navigate to Campus Datacenter" },
    { key: "Alt + T", label: "Navigate to Tuition & ROI Calculator" },
    { key: "Alt + E", label: "Navigate to Admissions Portal" },
    { key: "? or Shift + /", label: "Toggle Keyboard Shortcuts Modal" },
    { key: "Esc", label: "Close Active Modal / Dialog" },
  ];

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-university-navy/80 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcut-modal-title"
    >
      <div className="bg-white border border-university-navy/20 shadow-2xl max-w-lg w-full p-6 md:p-8 relative overflow-hidden">
        <div className="flex justify-between items-center border-b border-university-navy/10 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-university-crimson/10 text-university-crimson rounded-sm">
              <Keyboard className="h-5 w-5" />
            </div>
            <h2 id="shortcut-modal-title" className="font-serif text-2xl text-university-navy font-semibold">
              Keyboard Shortcuts
            </h2>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-2 text-university-navy/60 hover:text-university-navy hover:bg-university-navy/5 transition-colors focus-visible:ring-2 focus-visible:ring-university-gold focus-visible:outline-none"
            aria-label="Close keyboard shortcuts dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3 mb-8">
          {shortcuts.map((sc, idx) => (
            <div 
              key={idx} 
              className="flex justify-between items-center p-3 bg-university-paper/60 border border-university-navy/5 hover:border-university-navy/20 transition-colors"
            >
              <span className="text-xs text-university-navy/80 font-medium">{sc.label}</span>
              <kbd className="px-2.5 py-1 bg-university-navy text-university-paper font-mono text-[11px] font-bold uppercase tracking-wider rounded border border-university-gold/40 shadow-xs flex items-center gap-1">
                <Command className="h-3 w-3 text-university-gold opacity-70" />
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center text-xs text-university-navy/50 border-t border-university-navy/10 pt-4">
          <span>Accessible navigation enabled</span>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="px-4 py-2 bg-university-navy text-white text-xs font-bold uppercase tracking-widest hover:bg-university-crimson transition-colors focus-visible:ring-2 focus-visible:ring-university-gold focus-visible:outline-none"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
