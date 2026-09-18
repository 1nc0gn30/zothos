import React, { useState } from 'react';
import { ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';
import { Logo } from './Logo';

export const AGE_VERIFIED_STORAGE_KEY = 'age_verified_21_plus_v1';

interface AgeGateProps {
  onVerified: () => void;
}

const AgeGate = ({ onVerified }: AgeGateProps) => {
  const [confirmed, setConfirmed] = useState(false);
  const [blocked, setBlocked] = useState(false);

  const handleContinue = () => {
    if (!confirmed) return;
    localStorage.setItem(
      AGE_VERIFIED_STORAGE_KEY,
      JSON.stringify({ verified: true, confirmedAt: new Date().toISOString() }),
    );
    onVerified();
  };

  const Background = () => (
    <>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(212,143,28,0.18),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(212,143,28,0.12),transparent_40%),radial-gradient(circle_at_50%_80%,rgba(212,143,28,0.14),transparent_45%)] dark:bg-[radial-gradient(circle_at_20%_20%,rgba(212,143,28,0.2),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(212,143,28,0.14),transparent_40%),radial-gradient(circle_at_50%_80%,rgba(212,143,28,0.16),transparent_45%)]" />

        <motion.div
          initial={{ opacity: 0.2, y: 0 }}
          animate={{ opacity: [0.2, 0.35, 0.2], y: [0, -10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-16 -left-12 h-56 w-56 rounded-full bg-primary/20 blur-3xl dark:bg-primary/25"
        />
        <motion.div
          initial={{ opacity: 0.15, y: 0 }}
          animate={{ opacity: [0.15, 0.3, 0.15], y: [0, 8, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-24 -right-10 h-72 w-72 rounded-full bg-gold-300/20 blur-3xl dark:bg-gold-500/20"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, rotate: -8 }}
        animate={{ opacity: 0.14, scale: 1, rotate: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="pointer-events-none absolute top-10 right-8 hidden md:block"
      >
        <Logo className="h-28 w-28" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, rotate: 10 }}
        animate={{ opacity: 0.1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        className="pointer-events-none absolute bottom-10 left-8 hidden md:block"
      >
        <Logo className="h-24 w-24" />
      </motion.div>
    </>
  );

  if (blocked) {
    return (
      <div className="min-h-screen bg-background text-foreground relative flex items-center justify-center px-6 py-8">
        <Background />
        <div className="relative max-w-lg w-full rounded-3xl border border-border/70 bg-card/85 backdrop-blur-xl p-8 text-center shadow-2xl">
          <ShieldAlert className="h-10 w-10 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-3">Access Restricted</h1>
          <p className="text-muted-foreground">
            You must be 21 or older to access this app.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative flex items-center justify-center px-6 py-8">
      <Background />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="relative max-w-lg w-full rounded-3xl border border-border/70 bg-card/85 backdrop-blur-xl p-8 shadow-2xl"
      >
        <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-border/70 bg-background/80 px-4 py-2">
          <Logo className="h-6 w-6" />
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">757 Gas Shop Access</span>
        </div>

        <h1 className="text-3xl font-black tracking-tight mb-3">Age Verification Required</h1>
        <p className="text-muted-foreground mb-6">
          You must confirm you are at least 21 years old to continue.
        </p>

        <label className="flex items-start gap-3 mb-6 cursor-pointer">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mt-1 h-4 w-4"
          />
          <span className="text-sm">
            I confirm that I am 21 years of age or older.
          </span>
        </label>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleContinue}
            disabled={!confirmed}
            className="flex-1 bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </button>
          <button
            type="button"
            onClick={() => setBlocked(true)}
            className="flex-1 border border-border py-3 rounded-xl font-bold hover:bg-muted transition-colors"
          >
            I am under 21
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AgeGate;
