import React, { useState, useEffect, useRef } from 'react';
import { 
  MousePointer2, 
  X, 
  Sparkles, 
  CircleDot, 
  Zap, 
  Sun, 
  Check, 
  Sliders, 
  RotateCcw,
  Waves
} from 'lucide-react';
import { ProjectState } from '../../types/project';
import { CursorConfig } from '../../types/models';
import { drawCursor, DEFAULT_CURSOR_CONFIG } from '../../services/cursorService';

export interface CursorModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: ProjectState;
  cursorConfig?: CursorConfig;
  onChange?: (config: CursorConfig) => void;
  onUpdateCursor?: (config: CursorConfig) => void;
}

const COLOR_PRESETS = [
  { hex: '#6466FA', label: 'Maya Indigo' },
  { hex: '#3B82F6', label: 'Electric Blue' },
  { hex: '#06B6D4', label: 'Neon Cyan' },
  { hex: '#10B981', label: 'Emerald' },
  { hex: '#F43F5E', label: 'Rose' },
  { hex: '#F59E0B', label: 'Amber' },
  { hex: '#8B5CF6', label: 'Purple' },
  { hex: '#FFFFFF', label: 'Pure White' },
];

const PRESETS = [
  {
    name: 'Screen Studio',
    desc: 'Glowing translucent dot with crisp core',
    config: { enabled: true, style: 'dot' as const, colorHex: '#6466FA', size: 32, clickRipples: true },
  },
  {
    name: 'Apple macOS',
    desc: 'High-DPI obsidian pointer with drop shadow',
    config: { enabled: true, style: 'macos' as const, colorHex: '#6466FA', size: 28, clickRipples: true },
  },
  {
    name: 'Cyber Laser',
    desc: 'High-energy neon laser with reticle',
    config: { enabled: true, style: 'laser' as const, colorHex: '#06B6D4', size: 36, clickRipples: true },
  },
  {
    name: 'Spotlight Aura',
    desc: 'Soft glowing radial halo behind pointer',
    config: { enabled: true, style: 'glow' as const, colorHex: '#F59E0B', size: 34, clickRipples: true },
  },
];

export const CursorModal: React.FC<CursorModalProps> = ({
  isOpen,
  onClose,
  project,
  cursorConfig,
  onChange,
  onUpdateCursor,
}) => {
  const initialConfig: CursorConfig = {
    ...DEFAULT_CURSOR_CONFIG,
    ...(cursorConfig || project?.cursor || {}),
  };

  const [config, setConfig] = useState<CursorConfig>(initialConfig);
  const [interactiveClick, setInteractiveClick] = useState<{ x: number; y: number; time: number } | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);

  // Sync state whenever modal opens or props change
  useEffect(() => {
    if (isOpen) {
      setConfig({
        ...DEFAULT_CURSOR_CONFIG,
        ...(cursorConfig || project?.cursor || {}),
      });
    }
  }, [isOpen, cursorConfig, project?.cursor]);

  // Live Canvas Interactive Preview Loop
  useEffect(() => {
    if (!isOpen) return;

    let startTime = performance.now();

    const renderPreview = (now: number) => {
      const canvas = previewCanvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;
      const elapsed = (now - startTime) / 1000;

      // Dark background gradient with subtle grid
      ctx.clearRect(0, 0, width, height);
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, '#0B0D13');
      bgGrad.addColorStop(1, '#131722');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Subtle preview grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      const gridSize = 24;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0); ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y); ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Compute cursor demo position: smooth infinity/figure-8 glide across preview canvas
      let cursorX = width * 0.5 + Math.sin(elapsed * 1.6) * (width * 0.32);
      let cursorY = height * 0.5 + Math.sin(elapsed * 3.2) * (height * 0.22);
      let isClicking = false;
      let clickProgress = 0;

      // Check if user clicked on canvas interactively
      if (interactiveClick) {
        const clickAge = (now - interactiveClick.time) / 1000;
        if (clickAge < 0.6) {
          cursorX = interactiveClick.x;
          cursorY = interactiveClick.y;
          isClicking = true;
          clickProgress = clickAge / 0.6;
        }
      } else {
        // Automated simulated click every ~2.5 seconds
        const cycle = elapsed % 2.5;
        if (cycle < 0.55) {
          isClicking = true;
          clickProgress = cycle / 0.55;
        }
      }

      // Draw Cursor onto preview canvas
      if (config.enabled) {
        drawCursor(ctx, cursorX, cursorY, isClicking, clickProgress, config);
      } else {
        // Disabled overlay text
        ctx.fillStyle = 'rgba(148, 163, 184, 0.4)';
        ctx.font = '12px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Cursor Disabled', width / 2, height / 2);
      }

      animFrameRef.current = requestAnimationFrame(renderPreview);
    };

    animFrameRef.current = requestAnimationFrame(renderPreview);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isOpen, config, interactiveClick]);

  if (!isOpen) return null;

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    setInteractiveClick({ x, y, time: performance.now() });
  };

  const applyChanges = (newConfig: CursorConfig) => {
    setConfig(newConfig);
    if (onChange) onChange(newConfig);
    if (onUpdateCursor) onUpdateCursor(newConfig);
  };

  const handleSave = () => {
    applyChanges(config);
    onClose();
  };

  const handleReset = () => {
    applyChanges(DEFAULT_CURSOR_CONFIG);
  };

  return (
    <div className="fixed inset-0 bg-dark-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="w-[620px] max-h-[90vh] bg-dark-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 flex flex-col animate-in fade-in zoom-in-95 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3.5">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-500/20 text-brand-400 border border-brand-500/30 flex items-center justify-center shadow-sm">
              <MousePointer2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base text-white font-bold tracking-tight">Cursor & Pointer FX</span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
                  DSP Animation
                </span>
              </div>
              <p className="text-xs text-slate-400">Spline curve trajectory & interactive click feedback</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-7 h-7 rounded-lg bg-dark-950/60 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto space-y-5 pr-1 text-xs">
          {/* 1. Live Interactive Preview Canvas */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-slate-400 text-[11px] font-medium">
              <span className="flex items-center space-x-1.5 text-slate-300 font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                <span>Live Interactive Preview</span>
              </span>
              <span className="text-[10px] text-slate-400 opacity-80">Click preview to test ripple feedback</span>
            </div>
            <div className="relative rounded-2xl overflow-hidden border border-slate-800/80 shadow-inner group">
              <canvas
                ref={previewCanvasRef}
                width={570}
                height={160}
                onClick={handleCanvasClick}
                className="w-full h-40 cursor-crosshair block"
              />
              <div className="absolute top-2.5 right-2.5 px-2 py-1 rounded-lg bg-dark-950/70 backdrop-blur border border-slate-700/50 text-[10px] text-slate-300 pointer-events-none flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Active 60fps Spline</span>
              </div>
            </div>
          </div>

          {/* 2. Master Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-dark-950/80 border border-slate-800/80">
            <div className="space-y-0.5">
              <div className="font-semibold text-slate-200 text-xs">Enable Smooth Mouse Cursor</div>
              <div className="text-[11px] text-slate-400">Renders smooth Catmull-Rom glide between tap & click keyframes</div>
            </div>
            <button
              onClick={() => applyChanges({ ...config, enabled: !config.enabled })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                config.enabled ? 'bg-brand-600' : 'bg-slate-800'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  config.enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* 3. Style Picker */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-slate-300 font-semibold text-[11px]">
              <span>Pointer Style</span>
              <span className="text-[10px] font-mono text-brand-300 uppercase tracking-wider">{config.style}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {/* Style 1: macos */}
              <button
                type="button"
                onClick={() => applyChanges({ ...config, style: 'macos' })}
                className={`p-3 rounded-2xl text-left border transition flex items-start space-x-3 ${
                  config.style === 'macos'
                    ? 'bg-brand-500/10 border-brand-500 text-white shadow-md shadow-brand-500/10'
                    : 'bg-dark-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-dark-900 border border-slate-700/60 flex items-center justify-center text-slate-200">
                  <MousePointer2 className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <div className="font-bold text-xs flex items-center space-x-1.5">
                    <span>macOS Pointer</span>
                    {config.style === 'macos' && <Check className="w-3 h-3 text-brand-400" />}
                  </div>
                  <div className="text-[10px] text-slate-400 leading-tight">High-DPI black pointer with crisp white border & shadow</div>
                </div>
              </button>

              {/* Style 2: dot */}
              <button
                type="button"
                onClick={() => applyChanges({ ...config, style: 'dot' })}
                className={`p-3 rounded-2xl text-left border transition flex items-start space-x-3 ${
                  config.style === 'dot'
                    ? 'bg-brand-500/10 border-brand-500 text-white shadow-md shadow-brand-500/10'
                    : 'bg-dark-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-dark-900 border border-slate-700/60 flex items-center justify-center text-brand-400">
                  <CircleDot className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <div className="font-bold text-xs flex items-center space-x-1.5">
                    <span>Screen Studio Dot</span>
                    {config.style === 'dot' && <Check className="w-3 h-3 text-brand-400" />}
                  </div>
                  <div className="text-[10px] text-slate-400 leading-tight">Translucent glowing lens with high-contrast core</div>
                </div>
              </button>

              {/* Style 3: laser */}
              <button
                type="button"
                onClick={() => applyChanges({ ...config, style: 'laser' })}
                className={`p-3 rounded-2xl text-left border transition flex items-start space-x-3 ${
                  config.style === 'laser'
                    ? 'bg-brand-500/10 border-brand-500 text-white shadow-md shadow-brand-500/10'
                    : 'bg-dark-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-dark-900 border border-slate-700/60 flex items-center justify-center text-cyan-400">
                  <Zap className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <div className="font-bold text-xs flex items-center space-x-1.5">
                    <span>Neon Laser</span>
                    {config.style === 'laser' && <Check className="w-3 h-3 text-brand-400" />}
                  </div>
                  <div className="text-[10px] text-slate-400 leading-tight">Glowing laser beam with reticle & trailing bloom</div>
                </div>
              </button>

              {/* Style 4: glow */}
              <button
                type="button"
                onClick={() => applyChanges({ ...config, style: 'glow' })}
                className={`p-3 rounded-2xl text-left border transition flex items-start space-x-3 ${
                  config.style === 'glow'
                    ? 'bg-brand-500/10 border-brand-500 text-white shadow-md shadow-brand-500/10'
                    : 'bg-dark-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-dark-900 border border-slate-700/60 flex items-center justify-center text-amber-400">
                  <Sun className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <div className="font-bold text-xs flex items-center space-x-1.5">
                    <span>Spotlight Aura</span>
                    {config.style === 'glow' && <Check className="w-3 h-3 text-brand-400" />}
                  </div>
                  <div className="text-[10px] text-slate-400 leading-tight">Soft radial ambient glow aura behind pointer</div>
                </div>
              </button>
            </div>
          </div>

          {/* 4. Size Slider */}
          <div className="space-y-2 p-3.5 rounded-2xl bg-dark-950/80 border border-slate-800/80">
            <div className="flex justify-between items-center text-[11px]">
              <span className="font-semibold text-slate-300 flex items-center space-x-1.5">
                <Sliders className="w-3.5 h-3.5 text-brand-400" />
                <span>Cursor Size</span>
              </span>
              <span className="font-mono text-brand-300 font-bold">{config.size}px</span>
            </div>
            <input
              type="range"
              min="16"
              max="64"
              step="1"
              value={config.size}
              onChange={(e) => applyChanges({ ...config, size: parseInt(e.target.value, 10) })}
              className="w-full accent-brand-500 cursor-pointer"
            />
            <div className="flex justify-between pt-1">
              {[20, 28, 36, 48, 64].map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => applyChanges({ ...config, size: sz })}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-mono transition ${
                    config.size === sz
                      ? 'bg-brand-600 text-white font-bold'
                      : 'bg-dark-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {sz}px
                </button>
              ))}
            </div>
          </div>

          {/* 5. Accent Color Picker */}
          <div className="space-y-2 p-3.5 rounded-2xl bg-dark-950/80 border border-slate-800/80">
            <div className="flex justify-between items-center text-[11px]">
              <span className="font-semibold text-slate-300">Accent & Glow Color</span>
              <span className="font-mono text-slate-300 text-[10px] uppercase">{config.colorHex}</span>
            </div>
            <div className="flex items-center space-x-2">
              {COLOR_PRESETS.map((col) => {
                const isSelected = config.colorHex.toLowerCase() === col.hex.toLowerCase();
                return (
                  <button
                    key={col.hex}
                    type="button"
                    title={col.label}
                    onClick={() => applyChanges({ ...config, colorHex: col.hex })}
                    className={`w-7 h-7 rounded-full transition relative flex items-center justify-center p-0.5 border ${
                      isSelected
                        ? 'border-white scale-110 shadow-lg shadow-brand-500/30'
                        : 'border-slate-700/60 hover:scale-105'
                    }`}
                  >
                    <div
                      className="w-full h-full rounded-full shadow-inner"
                      style={{ backgroundColor: col.hex }}
                    />
                  </button>
                );
              })}

              <div className="h-6 w-[1px] bg-slate-800 mx-1" />

              {/* Custom Color Input */}
              <label className="w-7 h-7 rounded-full border border-slate-700 bg-dark-900 flex items-center justify-center cursor-pointer hover:border-brand-400 transition relative overflow-hidden" title="Custom Color">
                <input
                  type="color"
                  value={config.colorHex}
                  onChange={(e) => applyChanges({ ...config, colorHex: e.target.value })}
                  className="opacity-0 absolute inset-0 cursor-pointer w-full h-full"
                />
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: config.colorHex }}
                />
              </label>
            </div>
          </div>

          {/* 6. Click Ripple Animation Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-dark-950/80 border border-slate-800/80">
            <div className="space-y-0.5">
              <div className="font-semibold text-slate-200 text-xs flex items-center space-x-1.5">
                <Waves className="w-3.5 h-3.5 text-brand-400" />
                <span>Click Ripple Pulse Rings</span>
              </div>
              <div className="text-[11px] text-slate-400">Expands an animated concentric shockwave ring on tap and click events</div>
            </div>
            <button
              onClick={() => applyChanges({ ...config, clickRipples: !config.clickRipples })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                config.clickRipples ? 'bg-brand-600' : 'bg-slate-800'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  config.clickRipples ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* 7. Quick Presets */}
          <div className="space-y-2">
            <span className="text-slate-400 font-semibold text-[11px]">Curated Studio Presets</span>
            <div className="grid grid-cols-2 gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => applyChanges({ ...p.config })}
                  className="p-2.5 rounded-xl bg-dark-950 hover:bg-dark-900 border border-slate-800/80 hover:border-brand-500/40 text-left transition group"
                >
                  <div className="font-bold text-slate-200 group-hover:text-brand-300 text-xs">{p.name}</div>
                  <div className="text-[10px] text-slate-400 truncate">{p.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-slate-800/80 pt-3.5">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center space-x-1.5 py-2 px-3 rounded-xl bg-dark-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition border border-slate-800 text-xs font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 rounded-xl bg-dark-950 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition border border-slate-800"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="py-2 px-5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold transition shadow-lg shadow-brand-600/30 flex items-center space-x-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Apply & Close</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CursorModal;
