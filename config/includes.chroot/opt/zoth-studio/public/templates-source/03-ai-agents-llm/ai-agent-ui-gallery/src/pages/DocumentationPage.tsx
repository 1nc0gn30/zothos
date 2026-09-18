import React from "react";
import { motion } from "motion/react";
import { BookOpen, ArrowLeft, Terminal, Cpu as CpuIcon, Zap, Info, Shield, Code, Palette, Settings, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { Tooltip } from "../components/Tooltip";

export const DocumentationPage = () => {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans p-6 md:p-12 relative overflow-hidden">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-600/5 blur-[100px]" />
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
            className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20"
          >
            <BookOpen size={32} />
          </motion.div>
          <div className="space-y-2">
            <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-white uppercase italic leading-none">
              Documentation<span className="text-blue-600">.</span>
            </h1>
            <p className="text-slate-500 uppercase tracking-widest text-[10px] font-black">Architecture, Integration & Configuration for Next-Gen AI</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass-panel p-8 rounded-[32px] space-y-4 hover:border-blue-500/30 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
              <Terminal size={20} />
            </div>
            <h3 className="text-xl font-black text-white uppercase tracking-tight">Quick Start</h3>
            <p className="text-sm leading-relaxed text-slate-400">
              Select a component architecture from the gallery, configure your engine, and drop the code into your application. Minimal dependencies, maximum impact.
            </p>
            <div className="flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase tracking-widest pt-2">
              <Zap size={12} /> Component {`{v1.0.4}`}
            </div>
          </div>
          <div className="glass-panel p-8 rounded-[32px] space-y-4 hover:border-blue-500/30 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
              <CpuIcon size={20} />
            </div>
            <h3 className="text-xl font-black text-white uppercase tracking-tight">Prerequisites</h3>
            <p className="text-sm leading-relaxed text-slate-400">
              Built on <code className="text-blue-400">React 19</code> and <code className="text-blue-400">Tailwind v4</code>. Requires <code className="text-blue-400">lucide-react</code> for visuals and <code className="text-blue-400">motion</code> for fluid interactions.
            </p>
            <div className="flex items-center gap-2 text-[10px] font-black text-indigo-500 uppercase tracking-widest pt-2">
              <Code size={12} /> ESNext Standards
            </div>
          </div>
        </div>

        <div className="space-y-16">
          <section className="space-y-8">
            <div className="space-y-3">
              <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Multi-Engine Support</h2>
              <div className="h-1 w-20 bg-blue-600 rounded-full" />
            </div>
            <p className="text-lg leading-relaxed text-slate-400">
              AgentUI components are engine-agnostic. We provide a unified <code className="text-blue-400">useAI</code> hook that manages state and communication across major providers.
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { name: "Gemini", icon: Zap, color: "text-blue-400", desc: "Native Google integration" },
                { name: "OpenAI", icon: Globe, color: "text-emerald-400", desc: "Industry standard GPT support" },
                { name: "Ollama", icon: Settings, color: "text-orange-400", desc: "Local-first privacy focus" }
              ].map((provider) => (
                <div key={provider.name} className="p-6 rounded-2xl border border-white/5 bg-slate-900/50 space-y-3">
                  <provider.icon size={20} className={provider.color} />
                  <h4 className="font-black text-white uppercase text-xs tracking-widest">{provider.name}</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">{provider.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-8">
            <div className="space-y-3">
              <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">The Theme Engine</h2>
              <div className="h-1 w-20 bg-indigo-600 rounded-full" />
            </div>
            <p className="text-lg leading-relaxed text-slate-400">
              Our components use a standardized theme object for radical customization without modifying the core logic.
            </p>
            <div className="relative group overflow-hidden rounded-[32px] border border-white/10 bg-black">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
              <pre className="p-8 overflow-x-auto text-xs md:text-sm font-mono leading-relaxed">
                <code className="text-blue-300">
{`const theme = {
  primary: "bg-blue-600",
  secondary: "bg-blue-500/10",
  containerRadius: "rounded-[40px]",
  buttonRadius: "rounded-2xl",
  fontFamily: "font-sans",
  headerStyle: "glassy", // "brutal" | "accented" | "minimal"
  borderWidth: "border-2",
  backgroundImage: "url('/assets/grid.svg')" // Optional
};`}
                </code>
              </pre>
            </div>
          </section>
        </div>

        <footer className="pt-12 pb-32 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-600">
          <p>© 2026 AgentUI Systems. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="text-blue-500/40">Status: v1.0.4 Release</span>
            <span>Handcrafted by Tech Pro</span>
          </div>
        </footer>
      </div>
    </div>
  );
};
