import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Sparkles, Send, CheckCircle2 } from "lucide-react";

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WaitlistModal: React.FC<WaitlistModalProps> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    try {
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData as any).toString(),
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-[40px] overflow-hidden shadow-2xl"
          >
            <div className="p-8 md:p-12 text-center space-y-8">
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              {!submitted ? (
                <>
                  <div className="w-20 h-20 bg-blue-600/10 border border-blue-500/20 rounded-[32px] flex items-center justify-center text-blue-500 mx-auto">
                    <Sparkles size={40} />
                  </div>
                  
                  <div className="space-y-2">
                    <h2 className="text-4xl font-black tracking-tighter uppercase italic text-white">Pro <span className="text-blue-500">Access</span></h2>
                    <p className="text-slate-400 leading-relaxed">
                      Get exclusive access to premium components, source files, and early bird updates.
                    </p>
                  </div>

                  <form 
                    name="waitlist" 
                    method="POST" 
                    data-netlify="true" 
                    onSubmit={handleSubmit}
                    className="space-y-4"
                  >
                    <input type="hidden" name="form-name" value="waitlist" />
                    <div className="space-y-4 text-left">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-4">Full Name</label>
                        <input 
                          type="text" 
                          name="name"
                          required
                          placeholder="John Doe"
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-4">Email Address</label>
                        <input 
                          type="email" 
                          name="email"
                          required
                          placeholder="you@example.com"
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                        />
                      </div>
                    </div>
                    <button 
                      type="submit"
                      className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-600/20"
                    >
                      <Send size={18} />
                      Join Waitlist
                    </button>
                  </form>
                  
                  <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                    No spam. Just pure value.
                  </p>
                </>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 space-y-6"
                >
                  <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 rounded-[32px] flex items-center justify-center text-green-500 mx-auto">
                    <CheckCircle2 size={40} />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black tracking-tighter uppercase italic text-white">You're <span className="text-green-500">In!</span></h2>
                    <p className="text-slate-400">
                      Thanks for joining. We'll be in touch soon with your Pro Access details.
                    </p>
                  </div>
                  <button 
                    onClick={onClose}
                    className="px-8 py-3 bg-white/5 border border-white/10 rounded-full text-xs font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all"
                  >
                    Close
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
