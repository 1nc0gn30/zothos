import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, ArrowRight, CheckCircle2, Shield } from 'lucide-react';
import { useState } from 'react';

export function WaitlistModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="bg-white border-2 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] max-w-sm w-full relative overflow-hidden"
      >
        {/* Progress Bar Header */}
        <div className="h-1.5 w-full bg-slate-100">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: submitted ? '100%' : '60%' }}
            className="h-full bg-slate-900 transition-all duration-500"
          />
        </div>

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-slate-100 rounded transition-colors text-slate-400 hover:text-slate-900"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <header className="mb-8">
            <div className="inline-flex items-center gap-2 px-2 py-1 rounded bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold uppercase tracking-widest mb-4">
              <Shield className="w-3 h-3" />
              Limit Reached
            </div>
            <h2 className="text-3xl font-black text-slate-900 leading-tight tracking-tighter">
              UPGRADE TO <br />PRO ACCESS.
            </h2>
            <p className="text-slate-500 text-sm mt-3 leading-relaxed">
              You've utilized your free project credits. Connect a private API key or join the priority queue for unlimited local estimates.
            </p>
          </header>

          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form 
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                name="waitlist" 
                method="POST" 
                data-netlify="true" 
                netlify-honeypot="bot-field"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  try {
                    await fetch("/", {
                      method: "POST",
                      headers: { "Content-Type": "application/x-www-form-urlencoded" },
                      body: new URLSearchParams(formData as any).toString(),
                    });
                    setSubmitted(true);
                  } catch (error) {
                    alert("Submission failed. Try again.");
                  }
                }}
                className="space-y-4"
              >
                <input type="hidden" name="form-name" value="waitlist" />
                <input type="text" name="bot-field" className="hidden" />
                
                <div className="group space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                    Corporate Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                    <input 
                      type="email" 
                      name="email"
                      required
                      placeholder="name@company.com"
                      className="w-full bg-slate-50 border-2 border-slate-200 px-11 py-3 text-sm font-medium focus:border-slate-900 focus:bg-white outline-none transition-all"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-slate-900 text-white font-bold py-4 px-6 flex items-center justify-between group hover:bg-slate-800 transition-colors active:translate-y-0.5"
                >
                  JOIN PRIORITY LIST
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.form>
            ) : (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-6 text-center border-2 border-dashed border-slate-200"
              >
                <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900">ENROLLED SUCCESSFULLY</h3>
                <p className="text-xs text-slate-500 mt-2">We will contact you at {email}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <footer className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase">BuildEstimate © 2024</span>
            <button 
              onClick={onClose}
              className="text-[10px] font-bold text-slate-900 uppercase hover:underline"
            >
              Skip for now
            </button>
          </footer>
        </div>
      </motion.div>
    </div>
  );
}
