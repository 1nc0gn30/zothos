import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Copy, Check, Code, Settings, Image as ImageIcon, Type, Palette } from "lucide-react";
import { ChatbotVariant } from "../data/chatbotVariants";

interface VariantConfigViewerProps {
  variant: ChatbotVariant;
}

export const VariantConfigViewer: React.FC<VariantConfigViewerProps> = ({ variant }) => {
  const [copied, setCopied] = useState(false);

  const configString = JSON.stringify({
    name: variant.name,
    style: variant.style,
    theme: variant.theme,
    capabilities: variant.capabilities
  }, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(configString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900/50 border border-white/10 rounded-[32px] overflow-hidden">
      <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-xl text-blue-500">
            <Settings size={20} />
          </div>
          <div>
            <h3 className="text-white font-bold tracking-tight">Variant Configuration</h3>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">JSON Structure</p>
          </div>
        </div>
        <button 
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold text-white transition-all active:scale-95"
        >
          {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
          {copied ? "Copied!" : "Copy Config"}
        </button>
      </div>

      <div className="p-6 grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2">
              <div className="flex items-center gap-2 text-blue-400">
                <Palette size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Theme</span>
              </div>
              <p className="text-sm text-white font-medium capitalize">{variant.style}</p>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2">
              <div className="flex items-center gap-2 text-purple-400">
                <Type size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Font</span>
              </div>
              <p className="text-sm text-white font-medium">{variant.theme.fontFamily.replace('font-', '')}</p>
            </div>
          </div>

          <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-4">
            <div className="flex items-center gap-2 text-emerald-400">
              <ImageIcon size={14} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Background</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-800 rounded-lg overflow-hidden border border-white/10">
                {variant.theme.backgroundImage ? (
                  <img src={variant.theme.backgroundImage} alt="BG" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600">
                    <ImageIcon size={20} />
                  </div>
                )}
              </div>
              <p className="text-xs text-slate-400 italic">
                {variant.theme.backgroundImage ? "Custom background image active" : "Default background active"}
              </p>
            </div>
          </div>

          <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-3">
            <div className="flex items-center gap-2 text-amber-400">
              <Code size={14} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Quick Tweak</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Modify the <code className="text-blue-400">theme</code> object in your component to instantly change the look and feel.
            </p>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute inset-0 bg-blue-500/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          <pre className="relative bg-black/40 border border-white/10 p-6 rounded-2xl overflow-x-auto h-[300px] scrollbar-thin scrollbar-thumb-white/10">
            <code className="text-blue-300 text-xs leading-relaxed">
              {configString}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
};
