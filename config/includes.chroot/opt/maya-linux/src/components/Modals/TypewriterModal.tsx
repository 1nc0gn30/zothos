import React, { useState } from 'react';
import { 
  Type, 
  X, 
  Sparkles, 
  Clock, 
  Plus, 
  Sliders, 
  Layers, 
  Terminal, 
  Crown,
  Palette
} from 'lucide-react';
import { TypewriterOverlayItem, TypewriterStyle } from '../../types/models';

interface TypewriterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTypewriter: (item: TypewriterOverlayItem) => void;
  currentTime: number;
}

const TYPEWRITER_PRESETS: {
  name: string;
  tag: string;
  text: string;
  subtitle: string;
  style: TypewriterStyle;
  textColor: string;
  accentColor: string;
  fontSize: number;
}[] = [
  {
    name: 'WebGen PTY Synthesis',
    tag: 'PHASE 01 // PTY SYNTHESIS CORE',
    text: 'ZOTH STUDIO · WEBGEN TERMINAL',
    subtitle: 'Interactive Sovereign PTY Engine · Real-time Autonomous App Foundry',
    style: 'stroke-typewriter',
    textColor: '#FFFFFF',
    accentColor: '#00F0FF',
    fontSize: 36,
  },
  {
    name: 'Hermes 3 & AGY Co-Pilot',
    tag: 'PHASE 02 // MULTI-AGENT HARNESS',
    text: 'DISPATCHING HERMES 3 & AGY SDK',
    subtitle: 'Autonomous Multi-Step Prompt Synthesis · Ultra-Clean Dark Theme Code Generation',
    style: 'cyber-glass',
    textColor: '#FFFFFF',
    accentColor: '#A855F7',
    fontSize: 32,
  },
  {
    name: 'Workbot Eye Stream',
    tag: 'PHASE 03 // COGNITIVE PERCEPTION',
    text: 'WORKBOT EYE STREAM & SPATIAL RADAR',
    subtitle: 'Real-Time DOM Coordinate Mapping · 100% Private Local AI Vision Verification',
    style: 'stroke-typewriter',
    textColor: '#FFFFFF',
    accentColor: '#34D399',
    fontSize: 34,
  },
  {
    name: 'Azoth Master Alchemical',
    tag: 'SOVEREIGN CORE // SUPREME ARCHITECT',
    text: '⚡ MASTER AZOTH SOVEREIGN CORE',
    subtitle: 'Fibonacci Geometry Enforcer · Zero-Leak Local Privacy Perimeter',
    style: 'alchemical-gold',
    textColor: '#FBBF24',
    accentColor: '#FDE047',
    fontSize: 38,
  },
  {
    name: 'Terminal PTY Prompt',
    tag: 'EXECUTING PROMPT DIRECTIVE',
    text: 'synthesize nousresearchditto --theme=dark-minimal --harness=agy',
    subtitle: 'AST Invariants: PASSING (0 errors) · Latency: 1.2ms loopback',
    style: 'terminal-prompt',
    textColor: '#FFFFFF',
    accentColor: '#34D399',
    fontSize: 28,
  },
];

export const TypewriterModal: React.FC<TypewriterModalProps> = ({
  isOpen,
  onClose,
  onAddTypewriter,
  currentTime,
}) => {
  const [tag, setTag] = useState('STEP 01 // OVERVIEW');
  const [text, setText] = useState('ZOTH STUDIO · WEBGEN SHOWCASE');
  const [subtitle, setSubtitle] = useState('Explain what happens in your video with stroke typed animated fonts');
  const [style, setStyle] = useState<TypewriterStyle>('stroke-typewriter');
  const [fontSize, setFontSize] = useState(34);
  const [strokeWidth, setStrokeWidth] = useState(5);
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [accentColor, setAccentColor] = useState('#00F0FF');
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [typingSpeedCps, setTypingSpeedCps] = useState(26);
  const [duration, setDuration] = useState(4.5);
  const [posX, setPosX] = useState(0.5);
  const [posY, setPosY] = useState(0.18);

  if (!isOpen) return null;

  const handleApplyPreset = (preset: typeof TYPEWRITER_PRESETS[0]) => {
    setTag(preset.tag);
    setText(preset.text);
    setSubtitle(preset.subtitle);
    setStyle(preset.style);
    setTextColor(preset.textColor);
    setAccentColor(preset.accentColor);
    setFontSize(preset.fontSize);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    const newItem: TypewriterOverlayItem = {
      id: crypto.randomUUID(),
      startTime: currentTime,
      duration,
      text,
      subtitle: subtitle.trim() ? subtitle : undefined,
      tag: tag.trim() ? tag : undefined,
      style,
      fontSize,
      strokeWidth,
      strokeColor,
      textColor,
      accentColor,
      typingSpeedCps,
      showCursor: true,
      cursorChar: style === 'terminal-prompt' ? '█' : style === 'alchemical-gold' ? '⚡' : '█',
      position: { x: posX, y: posY },
      align: posX < 0.35 ? 'left' : posX > 0.65 ? 'right' : 'center',
    };

    onAddTypewriter(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-dark-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-dark-950/80">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-brand-500/20 border border-brand-500/40 flex items-center justify-center text-brand-400">
              <Type className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">Typewriter Stroke Captions & Headings</h3>
              <p className="text-xs text-slate-400">Explain what is happening with animated stroke typed typography</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
          {/* Quick Presets */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              <span>Zoth Studio & WebGen Explainer Presets</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {TYPEWRITER_PRESETS.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className="p-2.5 rounded-xl border border-slate-800 bg-dark-950/60 hover:border-brand-500/60 hover:bg-brand-500/10 text-left transition group"
                >
                  <span className="font-semibold text-slate-200 block truncate group-hover:text-brand-300">{p.name}</span>
                  <span className="text-[10px] text-slate-500 block truncate mt-0.5">{p.style}</span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Tag / Step Badge */}
            <div>
              <label className="block text-slate-400 font-medium mb-1">Tag / Phase Header (Optional)</label>
              <input
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="e.g. PHASE 01 // PTY SYNTHESIS CORE"
                className="w-full bg-dark-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-brand-500 font-mono"
              />
            </div>

            {/* Headline / Main Text */}
            <div>
              <label className="block text-slate-400 font-medium mb-1">Typewriter Headline Text *</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={2}
                placeholder="e.g. ZOTH STUDIO · WEBGEN TERMINAL"
                className="w-full bg-dark-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-brand-500 font-bold"
                required
              />
            </div>

            {/* Subtitle */}
            <div>
              <label className="block text-slate-400 font-medium mb-1">Subtext / Detailed Explanation</label>
              <textarea
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                rows={2}
                placeholder="e.g. Interactive sovereign PTY terminal synthesizing responsive apps in real-time"
                className="w-full bg-dark-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>

            {/* Style & Typography */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Visual Style</label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value as TypewriterStyle)}
                  className="w-full bg-dark-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-brand-500"
                >
                  <option value="stroke-typewriter">Stroke Typewriter (No BG, High Vis)</option>
                  <option value="cyber-glass">Cyber Glass Card (Dark Frosted)</option>
                  <option value="alchemical-gold">Alchemical Gold (Master Azoth)</option>
                  <option value="terminal-prompt">Terminal Prompt ($ zoth-terminal)</option>
                  <option value="minimal-heading">Minimal Clean Heading</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Font Size ({fontSize}px)</label>
                <input
                  type="range"
                  min="20"
                  max="64"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full accent-brand-500 mt-2"
                />
              </div>
            </div>

            {/* Colors */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Accent / Glow</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer"
                  />
                  <span className="font-mono text-slate-300">{accentColor}</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Text Color</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer"
                  />
                  <span className="font-mono text-slate-300">{textColor}</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Typing Speed</label>
                <div className="flex items-center space-x-2 mt-1">
                  <input
                    type="range"
                    min="10"
                    max="60"
                    value={typingSpeedCps}
                    onChange={(e) => setTypingSpeedCps(Number(e.target.value))}
                    className="w-full accent-brand-500"
                  />
                  <span className="font-mono text-[11px] text-slate-300 whitespace-nowrap">{typingSpeedCps} cps</span>
                </div>
              </div>
            </div>

            {/* Position & Timing */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Timeline Start (s)</label>
                <input
                  type="number"
                  step="0.1"
                  value={currentTime.toFixed(1)}
                  disabled
                  className="w-full bg-dark-950/60 border border-slate-800 rounded-xl px-3 py-2 text-slate-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Duration (s)</label>
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  max="30"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full bg-dark-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Position Preset</label>
                <div className="flex space-x-1 mt-1">
                  <button
                    type="button"
                    onClick={() => { setPosX(0.5); setPosY(0.18); }}
                    className={`px-2 py-1 rounded text-[10px] font-bold border ${posY === 0.18 ? 'bg-brand-600 border-brand-500 text-white' : 'bg-dark-950 border-slate-800 text-slate-400'}`}
                  >
                    Top
                  </button>
                  <button
                    type="button"
                    onClick={() => { setPosX(0.5); setPosY(0.5); }}
                    className={`px-2 py-1 rounded text-[10px] font-bold border ${posY === 0.5 ? 'bg-brand-600 border-brand-500 text-white' : 'bg-dark-950 border-slate-800 text-slate-400'}`}
                  >
                    Center
                  </button>
                  <button
                    type="button"
                    onClick={() => { setPosX(0.5); setPosY(0.82); }}
                    className={`px-2 py-1 rounded text-[10px] font-bold border ${posY === 0.82 ? 'bg-brand-600 border-brand-500 text-white' : 'bg-dark-950 border-slate-800 text-slate-400'}`}
                  >
                    Bottom
                  </button>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold transition shadow-lg shadow-brand-600/30 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Typewriter Overlay</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
