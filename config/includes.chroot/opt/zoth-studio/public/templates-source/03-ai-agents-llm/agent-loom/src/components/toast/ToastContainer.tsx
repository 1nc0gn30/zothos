import { useFlowStore } from '../../store/useFlowStore';
import {
  CheckCircle2,
  AlertCircle,
  Info,
  AlertTriangle,
  X,
} from 'lucide-react';

const ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
  warn: AlertTriangle,
};

const STYLES = {
  success: {
    border: 'border-[var(--success)]/30',
    bg: 'bg-[#052e16]/90',
    iconColor: 'var(--success)',
    glow: 'shadow-[0_0_20px_rgba(46,232,160,0.15)]',
  },
  error: {
    border: 'border-[var(--error)]/30',
    bg: 'bg-[#2c0b0e]/90',
    iconColor: 'var(--error)',
    glow: 'shadow-[0_0_20px_rgba(255,77,109,0.15)]',
  },
  info: {
    border: 'border-[var(--accent)]/30',
    bg: 'bg-[#0c1a3a]/90',
    iconColor: 'var(--accent)',
    glow: 'shadow-[0_0_20px_rgba(0,240,255,0.15)]',
  },
  warn: {
    border: 'border-[var(--warn)]/30',
    bg: 'bg-[#1c1917]/90',
    iconColor: 'var(--warn)',
    glow: 'shadow-[0_0_20px_rgba(255,176,32,0.15)]',
  },
};

export default function ToastContainer() {
  const toasts = useFlowStore((s) => s.toasts);
  const removeToast = useFlowStore((s) => s.removeToast);

  if (toasts.length === 0) return null;

  return (
    <div
      role="region"
      aria-label="Notifications"
      aria-live="polite"
      className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none"
    >
      {toasts.map((toast) => {
        const Icon = ICONS[toast.type];
        const style = STYLES[toast.type];

        return (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto min-w-[280px] max-w-[380px] rounded-xl border backdrop-blur-xl animate-toast-in ${style.border} ${style.bg} ${style.glow}`}
          >
            <div className="flex items-start gap-3 p-3.5">
              <div className="shrink-0 mt-0.5">
                <Icon className="w-5 h-5" style={{ color: style.iconColor }} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-[13px] font-semibold text-[var(--text-primary)] leading-tight">
                  {toast.title}
                </h4>
                {toast.message && (
                  <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 leading-relaxed">
                    {toast.message}
                  </p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                aria-label="Close notification"
                className="shrink-0 p-1 rounded-md hover:bg-white/5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Progress bar */}
            <div className="h-[2px] rounded-b-xl overflow-hidden">
              <div
                className="h-full animate-[toastProgress_linear_forwards]"
                style={{
                  background: style.iconColor,
                  animationDuration: `${toast.duration ?? 3500}ms`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
