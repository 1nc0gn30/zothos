import React from "react";
import { motion } from "motion/react";
import { Code, ArrowLeft, Database, Layers, ShieldCheck, Info, Terminal, Cpu, Zap, Cloud } from "lucide-react";
import { Link } from "react-router-dom";
import { Tooltip } from "../components/Tooltip";

export const APIReferencePage = () => {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans p-6 md:p-12 relative overflow-hidden">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-600/5 blur-[100px]" />
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
            className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-purple-500/20"
          >
            <Code size={32} />
          </motion.div>
          <div className="space-y-2">
            <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-white uppercase italic leading-none">
              API <span className="text-blue-500">Reference</span>
            </h1>
            <p className="text-slate-500 uppercase tracking-widest text-[10px] font-black">Programmatic control and AI Engine data structures</p>
          </div>
        </div>

        <div className="space-y-20">
          <section className="space-y-8">
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">The useAI Hook</h2>
              <Tooltip content="Unified Engine Adapter">
                <Cloud size={20} className="text-blue-500" />
              </Tooltip>
            </div>
            <p className="text-lg leading-relaxed text-slate-400">
              The core of AgentUI's intelligence is the <code className="text-blue-400">useAI</code> hook. It abstracts the complexities of different AI providers into a single, clean reactive interface.
            </p>
            <div className="relative group overflow-hidden rounded-[32px] border border-white/10 bg-black">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-blue-500" />
              <pre className="p-8 overflow-x-auto text-xs md:text-sm font-mono leading-relaxed">
                <code className="text-emerald-400">
{`const { messages, sendMessage, isLoading, clearMessages } = useAI();

// Configuration Object
const config = {
  provider: "gemini" | "openai" | "ollama",
  apiKey: "sk-...",
  baseUrl: "http://localhost:11434/api/chat", // Required for Ollama
  model: "gpt-4o" // Optional override
};

// Send a message
await sendMessage("Hello!", config);`}
                </code>
              </pre>
            </div>
          </section>

          <section className="space-y-8">
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Variant Interfaces</h2>
              <Database size={20} className="text-blue-500" />
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="glass-panel p-8 rounded-[32px] space-y-4 hover:border-blue-500/30 transition-all">
                <h3 className="text-xl font-black text-white uppercase tracking-tight">Capabilities</h3>
                <p className="text-sm text-slate-400 font-medium">
                  Enums defining agent features: <code className="text-blue-400">voice</code>, <code className="text-blue-400">vision</code>, <code className="text-blue-400">code</code>, <code className="text-blue-400">search</code>, <code className="text-blue-400">translation</code>, <code className="text-blue-400">creative</code>.
                </p>
                <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-500/5 px-3 py-1 rounded-full border border-blue-500/10 inline-block">
                  v1.2 Schema
                </div>
              </div>
              <div className="glass-panel p-8 rounded-[32px] space-y-4 hover:border-blue-500/30 transition-all">
                <h3 className="text-xl font-black text-white uppercase tracking-tight">Theme Tokens</h3>
                <p className="text-sm text-slate-400 font-medium">
                  Modular Tailwind CSS classes used for runtime styling. Supports dynamic primary colors and radius tokens.
                </p>
                <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/5 px-3 py-1 rounded-full border border-emerald-500/10 inline-block">
                  Utility Driven
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-8">
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Identity & Security</h2>
              <ShieldCheck size={20} className="text-blue-500" />
            </div>
            <div className="glass-panel p-8 rounded-[32px] border-blue-500/20 bg-blue-500/5 space-y-4">
              <p className="text-sm text-slate-300 leading-relaxed font-medium">
                <strong className="text-white">API Key Safety Architecture:</strong> While our preview tool stores keys in <code className="text-blue-400">localStorage</code> for testing, PRODUCTION implementations should ALWAYS use a server-side proxy (e.g., Express or Next.js API Routes).
              </p>
              <div className="flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase tracking-widest">
                <Zap size={14} /> Zero Trusted Persistence
              </div>
            </div>
          </section>
        </div>

        <footer className="pt-12 pb-32 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-600">
          <p>© 2026 AgentUI Systems • SDK Release 1.2.0</p>
          <div className="flex gap-4 items-center">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span>Systems Operational</span>
          </div>
        </footer>
      </div>
    </div>
  );
};
