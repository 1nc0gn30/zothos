import React from 'react';
import { X, CheckCircle, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { playClickSound } from '../lib/audio';

interface WaitlistModalProps {
  onClose: () => void;
}

export const WaitlistModal: React.FC<WaitlistModalProps> = ({ onClose }) => {
  const [status, setStatus] = React.useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    playClickSound();
    setStatus('submitting');

    const formData = new FormData(e.currentTarget);
    try {
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData as any).toString(),
      });
      setStatus('success');
      setTimeout(onClose, 3000);
    } catch (error) {
      console.error("Form submission error", error);
      setStatus('idle');
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[60] p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="waitlist-title"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
      >
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h2 id="waitlist-title" className="text-xl font-semibold text-white">Join the Waitlist</h2>
          <button 
            onClick={() => { playClickSound(); onClose(); }} 
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg"
            aria-label="Close waitlist modal"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {status === 'success' ? (
            <div className="text-center py-8 space-y-4">
              <div className="flex justify-center">
                <CheckCircle size={64} className="text-emerald-500" />
              </div>
              <h3 className="text-2xl font-bold text-white">You're on the list!</h3>
              <p className="text-slate-400">We'll notify you as soon as unlimited AI access is available for your account.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="hidden" name="form-name" value="waitlist" />
              <p className="text-slate-400 text-sm mb-4">
                You've reached your daily AI limit. Join our waitlist to get early access to unlimited AI-powered task management and insights.
              </p>
              
              <div>
                <label htmlFor="waitlist-name" className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Name</label>
                <input 
                  id="waitlist-name"
                  required
                  name="name"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="waitlist-email" className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Email</label>
                <input 
                  id="waitlist-email"
                  required
                  type="email"
                  name="email"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="waitlist-msg" className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Why do you want unlimited access?</label>
                <textarea 
                  id="waitlist-msg"
                  name="message"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 min-h-[80px]"
                  placeholder="Tell us a bit about your workflow..."
                />
              </div>

              <button 
                disabled={status === 'submitting'}
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-800 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 mt-4 shadow-lg shadow-emerald-500/20"
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Joining...
                  </>
                ) : (
                  'Join Waitlist'
                )}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};
