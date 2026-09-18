import { useFlowStore } from '../../store/useFlowStore';
import { X, Keyboard } from 'lucide-react';

export default function ShortcutsModal() {
  const isOpen = useFlowStore((s) => s.isShortcutsOpen);
  const toggleShortcuts = useFlowStore((s) => s.toggleShortcuts);

  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Shift + ?', description: 'Toggle Keyboard Shortcuts modal' },
    { key: 'Cmd / Ctrl + K', description: 'Focus agent search in catalog' },
    { key: 'Escape', description: 'Deselect node / close active panels' },
    { key: 'Backspace / Delete', description: 'Delete selected agent node' },
    { key: 'Click + Drag', description: 'Move agent or pan canvas viewport' },
    { key: 'Scroll Wheel', description: 'Zoom canvas in / out' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in-up"
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-dialog-title"
    >
      <div className="w-full max-w-md bg-[var(--bg-base)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)] bg-[var(--bg-raised)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent-bg)] border border-[var(--accent-border)] flex items-center justify-center">
              <Keyboard className="w-4 h-4 text-[var(--accent)]" />
            </div>
            <h2 id="shortcuts-dialog-title" className="text-sm font-bold text-[var(--text-primary)]">
              Keyboard Shortcuts
            </h2>
          </div>
          <button
            onClick={toggleShortcuts}
            aria-label="Close keyboard shortcuts dialog"
            className="p-1.5 rounded-lg hover:bg-[var(--bg-overlay)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-3">
          {shortcuts.map((s, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-deep)] border border-[var(--border-subtle)] text-xs font-[var(--mono)]"
            >
              <span className="text-[var(--text-secondary)]">{s.description}</span>
              <kbd className="px-2 py-1 rounded-md bg-[var(--bg-raised)] border border-[var(--border)] text-[var(--accent)] font-semibold text-[10px] shadow-sm">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="px-5 py-3 border-t border-[var(--border)] bg-[var(--bg-raised)] text-right">
          <button
            onClick={toggleShortcuts}
            className="px-4 py-2 rounded-xl bg-[var(--accent)] text-slate-950 font-bold text-xs hover:opacity-90 transition-opacity focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
