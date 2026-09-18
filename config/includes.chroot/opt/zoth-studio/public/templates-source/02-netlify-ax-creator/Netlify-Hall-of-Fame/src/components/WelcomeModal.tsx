import { motion, AnimatePresence } from 'motion/react';
import { Heart, X } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WelcomeModal({ isOpen, onClose }: WelcomeModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative max-w-2xl w-full max-h-[90vh] bg-[#0a0a0a] border border-netlify/30 rounded-2xl p-6 md:p-12 shadow-[0_0_50px_rgba(32,198,183,0.15)] overflow-hidden flex flex-col"
          >
            {/* Background Accent */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-netlify/5 rounded-full blur-3xl pointer-events-none" />
            
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 md:top-6 md:right-6 text-gray-500 hover:text-white transition-colors p-2 z-[210]"
              aria-label="Close message"
            >
              <X size={24} />
            </button>

            <div className="overflow-y-auto scrollbar-hide py-4 md:py-0">
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 md:mb-8 p-3 md:p-4 bg-red-500/10 rounded-full shrink-0">
                  <Heart size={32} className="text-red-500 animate-pulse md:w-10 md:h-10" fill="currentColor" />
                </div>

                <h2 className="text-2xl md:text-4xl font-mono font-bold text-white mb-6 md:mb-8 tracking-tighter uppercase leading-tight">
                  A Message from <br />
                  <span className="text-netlify">Zoth Studio Team</span>
                </h2>

                <div className="space-y-4 md:space-y-6 text-gray-300 font-mono text-xs md:text-base leading-relaxed text-left md:text-center">
                  <p>
                    "I’m standing here on the other side of what once felt like an impossible summit: <span className="text-hacker">100 Websites in 30 Days</span>. 
                    This journey wasn’t just about the syntax, the late nights, or the thousands of lines of code. It was about finding my flow in a world that never stops moving."
                  </p>

                  <p>
                    "To the <span className="text-netlify font-bold">Architects</span> and the <span className="text-netlify font-bold">Engines</span> at Netlify—you have built more than just a world-class platform. 
                    You’ve built the ground I stand on. You’ve created a home where our dreams can take flight at the speed of thought. Your work is the light that showed me what was possible."
                  </p>

                  <p>
                    "And to the <span className="text-hacker font-bold">Vanguard</span>, my fellow AI Shippers—you were the heartbeat that kept me going when the silence of the night felt heavy. 
                    We didn't just build sites; we built a movement. Every card you see on this page represents a piece of my heart and a node in a network of pure inspiration."
                  </p>

                  <p className="italic text-gray-400">
                    "Thank you for believing in the edge. Thank you for being my legends. We shipped, we conquered, and we did it together."
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="mt-8 md:mt-12 px-8 md:px-10 py-3 md:py-4 bg-netlify text-black font-mono font-bold rounded-lg uppercase tracking-widest hover:shadow-[0_0_20px_rgba(32,198,183,0.4)] transition-all duration-300 shrink-0"
                >
                  Enter the Hall of Fame
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
