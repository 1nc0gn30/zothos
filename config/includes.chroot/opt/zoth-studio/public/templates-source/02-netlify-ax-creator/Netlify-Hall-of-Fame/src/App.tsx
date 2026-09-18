/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { Network, Github, Linkedin, X, Trophy, Award, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import Marquee from './components/Marquee';
import Terminal from './components/Terminal';
import PersonCard from './components/PersonCard';
import FooterTerminal from './components/FooterTerminal';
import WelcomeModal from './components/WelcomeModal';
import peopleData from './data/people.json';

export default function App() {
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    setShowWelcome(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative bg-[#050505] selection:bg-netlify selection:text-white overflow-x-hidden">
      <div className="crt-overlay" />
      
      <WelcomeModal isOpen={showWelcome} onClose={() => setShowWelcome(false)} />
      
      <Marquee />

      <main className="flex-grow container mx-auto px-6 py-16 md:py-24 max-w-6xl relative z-10">
        {/* Cinematic Hero */}
        <header className="flex flex-col items-center text-center mb-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="mb-8 p-4 bg-netlify/10 border-2 border-netlify rounded-full inline-flex items-center justify-center shadow-[0_0_30px_rgba(32,198,183,0.3)]"
          >
            <Trophy size={40} className="text-netlify animate-pulse" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-8xl font-mono font-black text-gray-100 mb-4 tracking-tighter uppercase leading-none">
              <span className="block">MISSION</span>
              <span className="text-netlify glitch-hover">ACCOMPLISHED</span>
            </h1>
            <div className="flex items-center justify-center gap-4 mt-2">
              <div className="h-0.5 w-12 bg-netlify" />
              <p className="text-hacker font-mono text-sm tracking-[0.4em] uppercase">
                100 SITES SHIPPED // CHALLENGE_COMPLETE
              </p>
              <div className="h-0.5 w-12 bg-netlify" />
            </div>
            
            <p className="max-w-2xl text-gray-500 font-mono text-xs md:text-sm leading-relaxed mt-12 uppercase mx-auto px-4 opacity-80">
              A tribute to the Netlify ecosystem and the AI Shipper community. <br />
              Celebrating the completion of the <span className="text-netlify">#100WebsitesIn30Days</span> challenge in the flow state.
            </p>
          </motion.div>

          <div className="mt-16 w-full flex justify-center">
            <Terminal />
          </div>
        </header>

        {/* The Hall of Fame Sections */}
        <div className="space-y-40 relative">
          {/* Decorative vertical line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-netlify/20 via-hacker/10 to-transparent hidden lg:block" />

          {/* The Architects */}
          <section id="architects" aria-labelledby="architects-title" className="relative">
            <div className="absolute inset-0 mesh-gradient -z-10 rounded-3xl" />
            <div className="flex flex-col items-center mb-16 text-center">
              <Award className="text-netlify mb-4 opacity-50" size={32} />
              <h2 id="architects-title" className="text-3xl md:text-5xl font-mono text-gray-100 uppercase tracking-tighter font-black">
                THE_<span className="text-netlify">ARCHITECTS</span>
              </h2>
              <p className="text-gray-600 font-mono text-[10px] uppercase mt-2 tracking-widest leading-none">
                Leadership nodes / Systems architecture
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {peopleData.architects.map((person, idx) => (
                <PersonCard key={person.name} person={person} index={idx} />
              ))}
            </div>
          </section>

          {/* The Engines */}
          <section id="engines" aria-labelledby="engines-title" className="relative">
            <div className="absolute inset-0 mesh-gradient rotate-180 -z-10 rounded-3xl" />
            <div className="flex flex-col items-center mb-16 text-center">
              <div className="w-12 h-1 bg-gradient-to-r from-transparent via-netlify to-transparent mb-6" />
              <h2 id="engines-title" className="text-3xl md:text-5xl font-mono text-gray-100 uppercase tracking-tighter font-black">
                THE_<span className="text-netlify">ENGINES</span>
              </h2>
              <p className="text-gray-600 font-mono text-[10px] uppercase mt-2 tracking-widest leading-none">
                Engineering / Developer Experience / Product
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {peopleData.engines.map((person, idx) => (
                <PersonCard key={person.name} person={person} index={idx} />
              ))}
            </div>
          </section>

          {/* The Vanguard */}
          <section id="vanguard" aria-labelledby="vanguard-title" className="relative">
            <div className="absolute inset-0 mesh-gradient -z-10 rounded-3xl" />
            <div className="flex flex-col items-center mb-16 text-center">
              <Zap className="text-hacker mb-4 animate-pulse" size={32} />
              <h2 id="vanguard-title" className="text-3xl md:text-5xl font-mono text-gray-100 uppercase tracking-tighter font-black">
                THE_<span className="text-hacker">VANGUARD</span>
              </h2>
              <p className="text-gray-600 font-mono text-[10px] uppercase mt-2 tracking-widest leading-none">
                AI Shippers / 100WebsitesIn30Days Challenge Cohort
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {peopleData.vanguard.map((person, idx) => (
                <PersonCard key={person.name} person={person} index={idx} />
              ))}
            </div>
          </section>
        </div>
      </main>

      <footer className="w-full bg-black py-24 px-6 relative z-10 border-t border-white/5">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center gap-12">
            <FooterTerminal />
            
            <div className="flex flex-col gap-4">
              <h2 className="text-netlify font-mono font-bold tracking-[0.5em] text-sm uppercase">CHALLENGE_STATUS: COMPLETE</h2>
              <div className="flex justify-center gap-1">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="w-2 h-2 bg-netlify animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                ))}
              </div>
            </div>

            <nav className="flex gap-6 mt-8" aria-label="Official Netlify Channels">
              <a href="https://github.com/netlify" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-white transition-colors" aria-label="Netlify Github">
                <Github size={24} />
              </a>
              <a href="https://twitter.com/netlify" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-white transition-colors" aria-label="Netlify X">
                <X size={24} />
              </a>
              <a href="https://linkedin.com/company/netlify" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#0077b5] transition-colors" aria-label="Netlify LinkedIn">
                <Linkedin size={24} />
              </a>
            </nav>

            <div className="text-[10px] font-mono text-gray-800 uppercase tracking-widest mt-12">
              Built in the Flow State by an AI Shipper <br />
              &copy; 2024 DEV_RELEASE // TRIBUTE_NODE_001
            </div>
          </div>
        </div>
        
        {/* Floating background gradient */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-netlify/5 blur-[120px] rounded-full pointer-events-none" />
      </footer>
    </div>
  );
}
