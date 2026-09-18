import { Cpu, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { soundManager } from "../../utils/soundEffects";

export default function Footer() {
  return (
    <footer role="contentinfo" className="bg-university-navy text-university-paper border-t border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-24 text-center relative z-10">
        <h2 className="font-serif text-5xl md:text-7xl mb-6 text-white max-w-4xl mx-auto leading-tight">
          Ready to fine-tune your future?
        </h2>
        <p className="text-xl text-white/50 mb-10 max-w-2xl mx-auto font-light">
          Admissions for the Fall 2026 cohort are now open. Submit your architecture details, training parameters, and alignment scores to apply.
        </p>
        <Link 
          to="/admissions" 
          onClick={() => soundManager.playClick()}
          className="px-10 py-5 bg-university-gold text-university-navy text-lg font-bold uppercase tracking-widest hover:bg-white transition-colors inline-block focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none shadow-xl"
        >
          Begin Application Process
        </Link>
      </div>
      
      <div className="border-t border-white/10 px-6 py-8 relative z-10">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-white/50 font-semibold uppercase tracking-widest text-xs">
           <div className="flex items-center gap-3">
             <Cpu className="h-5 w-5 text-university-gold" aria-hidden="true" />
             <span>Von Neumann University for AI • Est. 2026</span>
           </div>

           <div className="flex flex-wrap justify-center gap-6">
              <Link to="/privacy" onClick={() => soundManager.playClick()} className="hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-university-gold">Privacy Policy</Link>
              <Link to="/terms" onClick={() => soundManager.playClick()} className="hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-university-gold">Terms of API</Link>
              <Link to="/api-docs" onClick={() => soundManager.playClick()} className="hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-university-gold">API Docs</Link>
              <a href="/llms.txt" target="_blank" rel="noopener noreferrer" className="hover:text-university-gold transition-colors focus-visible:ring-2 focus-visible:ring-university-gold">llms.txt</a>
              <a href="/ai.txt" target="_blank" rel="noopener noreferrer" className="hover:text-university-gold transition-colors focus-visible:ring-2 focus-visible:ring-university-gold">ai.txt</a>
           </div>

           <div>
             <a 
               href="https://nullai.tech/" 
               target="_blank" 
               rel="noopener noreferrer" 
               className="hover:text-university-gold transition-colors inline-flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-university-gold"
             >
               <span>Designed by Zoth Studio Team</span>
               <ExternalLink className="h-3 w-3" />
             </a>
           </div>
         </div>
      </div>
    </footer>
  );
}
