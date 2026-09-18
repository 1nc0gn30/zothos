import React from "react";
import { motion } from "motion/react";
import { Users, ArrowLeft, Github, MessageSquare, Heart, Share2, Info, Sparkles, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { Tooltip } from "../components/Tooltip";

interface CommunityPageProps {
  onJoinClick?: () => void;
}

export const CommunityPage = ({ onJoinClick }: CommunityPageProps) => {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans p-6 md:p-12 relative overflow-hidden">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/5 blur-[100px]" />
      </div>

      <div className="max-w-4xl mx-auto space-y-16 relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-400 transition-all font-black uppercase tracking-widest text-[10px] group border border-blue-500/20 px-4 py-2 rounded-full bg-blue-500/5">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Gallery
        </Link>

        <div className="space-y-6">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20"
          >
            <Users size={32} />
          </motion.div>
          <div className="space-y-2">
            <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-white uppercase italic leading-none">
              Community<span className="text-blue-600">.</span>
            </h1>
            <p className="text-slate-500 uppercase tracking-widest text-[10px] font-black">Connecting AI interface designers & developers</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="glass-panel p-10 rounded-[40px] space-y-8 hover:border-blue-500/50 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full" />
            <div className="flex justify-between items-start relative z-10">
              <Github className="text-white group-hover:text-blue-500 transition-colors" size={40} />
              <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[9px] font-black text-blue-500 uppercase tracking-widest">OSS Focus</div>
            </div>
            <div className="space-y-3 relative z-10">
              <h3 className="text-2xl font-black text-white tracking-tight uppercase italic">GitHub Hub</h3>
              <p className="text-sm text-slate-400 leading-relaxed font-medium">
                Core development, bug tracking, and architectural discussions. Every line of AgentUI is public and peer-reviewed.
              </p>
            </div>
            <button 
              onClick={onJoinClick}
              className="relative z-10 w-full py-4 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              Access Repository <Share2 size={14} />
            </button>
          </div>

          <div className="glass-panel p-10 rounded-[40px] space-y-8 hover:border-indigo-500/50 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full" />
            <div className="flex justify-between items-start relative z-10">
              <MessageSquare className="text-white group-hover:text-indigo-400 transition-colors" size={40} />
              <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[9px] font-black text-indigo-400 uppercase tracking-widest">Global Sync</div>
            </div>
            <div className="space-y-3 relative z-10">
              <h3 className="text-2xl font-black text-white tracking-tight uppercase italic">Discord Core</h3>
              <p className="text-sm text-slate-400 leading-relaxed font-medium">
                Real-time collaboration with 5k+ members. Show off your custom variants and get instant feedback from top designers.
              </p>
            </div>
            <button 
              onClick={onJoinClick}
              className="relative z-10 w-full py-4 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-indigo-600 hover:border-indigo-600 transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              Enter Discord <Sparkles size={14} />
            </button>
          </div>
        </div>

        <div className="relative rounded-[48px] overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-800" />
          <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/community/1200/600')] opacity-20 contrast-125 mix-blend-overlay" />
          <div className="relative p-12 md:p-20 text-center space-y-8">
            <Heart className="text-white mx-auto animate-pulse" size={64} fill="white" />
            <div className="space-y-4">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase italic leading-none">Built for the People</h2>
              <p className="text-blue-100/80 max-w-xl mx-auto leading-relaxed font-medium text-lg">
                AgentUI is more than a gallery. It's a movement to make AI interfaces beautiful, accessible, and open to every developer on the planet.
              </p>
            </div>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={onJoinClick}
                className="bg-white text-blue-600 px-10 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:scale-105 transition-all shadow-2xl active:scale-95"
              >
                Become a Contributor
              </button>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noreferrer"
                className="px-10 py-5 rounded-2xl border border-white/20 text-white font-black uppercase tracking-[0.2em] text-xs hover:bg-white/10 transition-all"
              >
                View Manifest <Globe size={14} className="inline ml-2" />
              </a>
            </div>
          </div>
        </div>

        <footer className="pt-12 pb-32 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-600">
          <p>© 2026 AgentUI Systems • Community First</p>
          <div className="flex gap-6 items-center">
            <span className="text-blue-500/40 tracking-normal capitalize font-medium italic">"Designing the future of human-AI collaboration"</span>
          </div>
        </footer>
      </div>
    </div>
  );
};
