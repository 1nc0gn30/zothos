import React from "react";
import { motion } from "motion/react";
import { Layout, ArrowLeft, Palette, Type, Box, Info, Sparkles, Layers, Search, Code } from "lucide-react";
import { Link } from "react-router-dom";
import { Tooltip } from "../components/Tooltip";
import { cn } from "../lib/utils";

export const UIKitPage = () => {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans p-6 md:p-12 relative overflow-hidden">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-600/5 blur-[100px]" />
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
            <Layout size={32} />
          </motion.div>
          <div className="space-y-2">
            <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-white uppercase italic leading-none">
              UI <span className="text-blue-500">Kit</span>
            </h1>
            <p className="text-slate-500 uppercase tracking-widest text-[10px] font-black">The design system behind 50+ AgentUI variants</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Palette, title: "Color System", desc: "Vibrant, high-contrast palettes optimized for accessibility and punchy dark modes.", label: "AA Contrast" },
            { icon: Type, title: "Typography", desc: "Intentional pairings of Plus Jakarta Sans and JetBrains Mono for a tech-forward feel.", label: "Type Scales" },
            { icon: Box, title: "Shapes", desc: "A modular radius system from sharp Brutalist corners to soft modern Squircles.", label: "Geometry" }
          ].map((item, idx) => (
            <div key={idx} className="glass-panel p-8 rounded-[32px] space-y-4 hover:border-blue-500/30 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                <item.icon size={20} />
              </div>
              <h4 className="font-black text-white uppercase tracking-tight">{item.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">{item.desc}</p>
              <div className="text-[9px] font-black text-blue-500 uppercase tracking-widest bg-blue-500/5 px-2 py-0.5 rounded-full inline-block border border-blue-500/10">
                {item.label}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-20">
          <section className="space-y-8">
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Visual Philosophies</h2>
              <Sparkles size={20} className="text-blue-500" />
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4 group">
                <div className="h-48 glass-panel rounded-[32px] flex items-center justify-center group-hover:border-blue-500/50 transition-all overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-transparent to-indigo-500/10" />
                  <span className="relative text-blue-400 font-extrabold uppercase tracking-widest text-sm italic">Glass Architecture</span>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed font-medium">
                  Utilizes <code className="text-blue-400">backdrop-blur-xl</code> and tiered transparency to create a layered, modern aesthetic suitable for high-end SaaS.
                </p>
              </div>
              <div className="space-y-4 group">
                <div className="h-48 bg-white border-[4px] border-black rounded-none flex items-center justify-center group-hover:bg-slate-100 transition-all shadow-[8px_8px_0px_0px_#3b82f6]">
                  <span className="text-black font-extrabold uppercase tracking-widest text-sm italic">Neo-Brutalism</span>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed font-medium">
                  Prioritizes raw structure, hard shadows, and bold typography. Designed for developers who value technical honesty and punchy interactions.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-8">
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Atomic Architecture</h2>
              <Layers size={20} className="text-blue-500" />
            </div>
            <div className="glass-panel rounded-[40px] p-10 space-y-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500">
                  <Code size={24} />
                </div>
                <div>
                  <h4 className="font-black text-white uppercase tracking-tight">Utility-First Framework</h4>
                  <p className="text-sm text-slate-500 font-medium">Built using Tailwind CSS v4 and PostCSS for zero-runtime performance.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-6">
                {[
                  { name: "Glass", bg: "bg-white/10 blur-[1px]" },
                  { name: "Shadow", bg: "shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] bg-white" },
                  { name: "Gradient", bg: "bg-gradient-to-tr from-blue-600 to-indigo-600" },
                  { name: "Neon", bg: "bg-cyan-500 shadow-[0_0_20px_blue] border border-white" },
                  { name: "Retro", bg: "bg-gray-300 border-t-2 border-l-2 border-white border-b-2 border-r-2 border-gray-600" },
                  { name: "Soft", bg: "bg-slate-100/50 rounded-full" }
                ].map((token) => (
                  <div key={token.name} className="space-y-3 flex flex-col items-center">
                    <div className={cn("w-16 h-16 rounded-2xl", token.bg)} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{token.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        <footer className="pt-12 pb-32 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-600">
          <p>© 2026 AgentUI Systems • UI Kit Release Candidate 2.1</p>
          <div className="flex gap-6 items-center">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span>Ready for Production</span>
          </div>
        </footer>
      </div>
    </div>
  );
};
