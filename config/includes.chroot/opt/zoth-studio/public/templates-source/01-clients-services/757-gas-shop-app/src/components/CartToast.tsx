import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ShoppingBag, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { useToastStore } from '../store/toastStore';

const iconMap = {
  success: CheckCircle2,
  error: AlertCircle,
  info: ShoppingBag,
};

const variantStyles = {
  success: 'border-green-500/30 bg-green-500/10 text-green-400',
  error: 'border-destructive/30 bg-destructive/10 text-destructive',
  info: 'border-primary/30 bg-primary/10 text-primary',
};

const iconColors = {
  success: 'text-green-400',
  error: 'text-destructive',
  info: 'text-primary',
};

export default function CartToast() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = iconMap[toast.variant || 'info'];
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 60, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.95 }}
              transition={{ type: 'spring', damping: 22, stiffness: 300 }}
              className={`pointer-events-auto min-w-[280px] max-w-[360px] rounded-2xl border p-4 shadow-xl backdrop-blur-md ${variantStyles[toast.variant || 'info']}`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 shrink-0 ${iconColors[toast.variant || 'info']}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-foreground">{toast.title}</p>
                  {toast.message && (
                    <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{toast.message}</p>
                  )}
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="shrink-0 -mt-1 -mr-1 p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  aria-label="Dismiss"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
