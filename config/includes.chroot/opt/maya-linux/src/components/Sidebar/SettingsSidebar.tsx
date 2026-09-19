import React, { useState } from 'react';
import { 
  Smartphone, 
  Crop, 
  Sliders,
  Palette,
  Compass,
  Sparkles,
  Shield,
  Timer,
  Wand2
} from 'lucide-react';
import { ProjectState } from '../../types/project';
import { DEVICE_MODELS, CANVAS_ASPECTS, GRADIENT_PRESETS, SOLID_PRESETS } from '../../models/devices';
import { CanvasAspectRatioType, ProgressBarStyle, ProgressBarPosition, ColorGradeType } from '../../types/models';
import { DEFAULT_PROGRESS_BAR_CONFIG } from '../../services/progressBarService';

interface SettingsSidebarProps {
  project: ProjectState;
  onChange: (updater: Partial<ProjectState>) => void;
}

type SidebarTab = 'frame' | 'background' | 'vfx' | 'branding';

export const SettingsSidebar: React.FC<SettingsSidebarProps> = ({ project, onChange }) => {
  const [activeTab, setActiveTab] = useState<SidebarTab>('frame');
  const currentModel = DEVICE_MODELS.find(m => m.id === project.deviceModelID) || DEVICE_MODELS[2];

  const CINEMATIC_LUTS: { id: ColorGradeType; label: string; color: string; desc: string }[] = [
    { id: 'none', label: 'Original / Neutral', color: '#64748b', desc: 'No color filtering' },
    { id: 'tealOrange', label: 'Teal & Orange', color: '#0284c7', desc: 'Hollywood action blockbuster' },
    { id: 'oppenheimer70mm', label: 'Oppenheimer 70mm', color: '#f59e0b', desc: 'Warm vintage contrast' },
    { id: 'bladeRunner', label: 'Blade Runner 2049', color: '#06b6d4', desc: 'Atmospheric neon teal' },
    { id: 'duneDesert', label: 'Dune Arrakis', color: '#d97706', desc: 'Golden desert spice' },
    { id: 'cyberpunk', label: 'Cyberpunk Neon', color: '#ec4899', desc: 'Vibrant pink & cyan' },
    { id: 'matrix', label: 'Matrix Terminal', color: '#10b981', desc: 'Iconic emerald phosphor' },
    { id: 'datamosh', label: 'Glitch Datamosh', color: '#8b5cf6', desc: 'Digital compression moshing' },
    { id: 'infraredHeat', label: 'Infrared Thermal', color: '#ef4444', desc: 'Predator heatmap spectrum' },
    { id: 'crtArcade', label: 'Retro Arcade CRT', color: '#eab308', desc: '1980s coin-op phosphor' },
    { id: 'vintageVHS', label: 'Retro VHS Tape', color: '#d97706', desc: 'Warm 90s camcorder tape' },
    { id: 'noir', label: 'Noir Monochrome', color: '#ffffff', desc: 'High contrast black & white' },
    { id: 'studioBoost', label: 'Studio HDR Boost', color: '#38bdf8', desc: 'Crisp vibrant clarity' },
    { id: 'interstellar', label: 'Interstellar Sci-Fi', color: '#818cf8', desc: 'Deep cosmic tone' },
    { id: 'warmSunset', label: 'Golden Hour Sunset', color: '#f97316', desc: 'Soft warm glow' },
  ];

  return (
    <aside className="w-84 border-r border-slate-800/80 bg-dark-900/80 backdrop-blur-md overflow-hidden flex flex-col select-none text-xs">
      {/* Top Segmented Navigation Tabs */}
      <div className="p-3 border-b border-slate-800/80 bg-dark-950/60">
        <div className="grid grid-cols-4 gap-1 p-1 bg-dark-900 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('frame')}
            className={`py-1.5 px-1 rounded-lg font-medium text-[11px] flex flex-col items-center justify-center space-y-1 transition ${
              activeTab === 'frame'
                ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="text-[10px]">Frame</span>
          </button>

          <button
            onClick={() => setActiveTab('background')}
            className={`py-1.5 px-1 rounded-lg font-medium text-[11px] flex flex-col items-center justify-center space-y-1 transition ${
              activeTab === 'background'
                ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span className="text-[10px]">Backdrop</span>
          </button>

          <button
            onClick={() => setActiveTab('vfx')}
            className={`py-1.5 px-1 rounded-lg font-medium text-[11px] flex flex-col items-center justify-center space-y-1 transition ${
              activeTab === 'vfx'
                ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-[10px]">VFX Shaders</span>
          </button>

          <button
            onClick={() => setActiveTab('branding')}
            className={`py-1.5 px-1 rounded-lg font-medium text-[11px] flex flex-col items-center justify-center space-y-1 transition ${
              activeTab === 'branding'
                ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="text-[10px]">Brand/Bars</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">

        {/* TAB 1: FRAME & 3D */}
        {activeTab === 'frame' && (
          <div className="space-y-5 animate-in fade-in duration-150">
            {/* Canvas Aspect Ratio */}
            <section className="space-y-2.5">
              <div className="flex items-center space-x-2 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <Crop className="w-3.5 h-3.5 text-brand-400" />
                <span>Canvas Aspect Ratio</span>
              </div>
              <div className="grid grid-cols-5 gap-1.5 bg-dark-950/80 p-1.5 rounded-xl border border-slate-800/80">
                {(Object.keys(CANVAS_ASPECTS) as CanvasAspectRatioType[]).map((key) => {
                  const aspect = CANVAS_ASPECTS[key];
                  const isSelected = project.canvasAspect === key;
                  return (
                    <button
                      key={key}
                      onClick={() => onChange({ canvasAspect: key })}
                      className={`py-2 px-1 rounded-lg text-center font-medium transition flex flex-col items-center justify-center space-y-0.5 ${
                        isSelected 
                          ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30' 
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                      }`}
                    >
                      <span className="font-bold text-[11px]">{aspect.shortLabel}</span>
                      <span className="text-[8px] opacity-75 truncate max-w-full">{aspect.displayName.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Device Model Picker */}
            <section className="space-y-3">
              <div className="flex items-center space-x-2 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <Smartphone className="w-3.5 h-3.5 text-brand-400" />
                <span>Device Frame Hardware</span>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                {DEVICE_MODELS.map((model) => {
                  const isSelected = project.deviceModelID === model.id;
                  return (
                    <button
                      key={model.id}
                      onClick={() => {
                        onChange({
                          deviceModelID: model.id,
                          deviceColorID: model.defaultColor.id,
                        });
                      }}
                      className={`px-3 py-2 rounded-xl text-left border font-medium transition flex items-center justify-between ${
                        isSelected
                          ? 'bg-brand-500/10 border-brand-500 text-brand-300 shadow-sm'
                          : 'bg-dark-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span className="truncate">{model.displayName}</span>
                    </button>
                  );
                })}
              </div>

              {/* Color Finish Variants */}
              {currentModel.kind === 'physical' && currentModel.colors.length > 1 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-slate-400 text-[11px]">Chassis Finish / Color</span>
                  <div className="flex items-center space-x-2">
                    {currentModel.colors.map((c) => {
                      const isSelected = project.deviceColorID === c.id;
                      return (
                        <button
                          key={c.id}
                          onClick={() => onChange({ deviceColorID: c.id })}
                          title={c.name}
                          className={`w-7 h-7 rounded-full transition relative flex items-center justify-center p-0.5 border ${
                            isSelected
                              ? 'border-brand-400 scale-110 shadow-md shadow-brand-500/20'
                              : 'border-slate-700/60 hover:scale-105'
                          }`}
                        >
                          <div 
                            className="w-full h-full rounded-full shadow-inner"
                            style={{ backgroundColor: c.swatchHex }}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Generic Bezel Controls */}
              {currentModel.kind === 'generic' && (
                <div className="space-y-3 p-3 rounded-xl bg-dark-950/80 border border-slate-800/80">
                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-400 text-[11px]">
                      <span>Bezel Width</span>
                      <span className="font-mono text-slate-300">{(project.bareBezelWidth * 100).toFixed(1)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="0.08"
                      step="0.005"
                      value={project.bareBezelWidth}
                      onChange={(e) => onChange({ bareBezelWidth: parseFloat(e.target.value) })}
                      className="w-full accent-brand-500 cursor-pointer"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-400 text-[11px]">
                      <span>Corner Radius</span>
                      <span className="font-mono text-slate-300">{(project.bareCornerRadius * 100).toFixed(0)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="0.5"
                      step="0.01"
                      value={project.bareCornerRadius}
                      onChange={(e) => onChange({ bareCornerRadius: parseFloat(e.target.value) })}
                      className="w-full accent-brand-500 cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {/* Window Title & URL for Browser / Terminal */}
              {(currentModel.kind === 'browser' || currentModel.kind === 'terminal') && (
                <div className="space-y-3 p-3 rounded-xl bg-dark-950/80 border border-slate-800/80">
                  <div className="space-y-1">
                    <span className="text-slate-400 text-[11px]">Window Header Title</span>
                    <input
                      type="text"
                      value={project.desktopFrame?.title || currentModel.desktopConfig?.title || ''}
                      onChange={(e) => onChange({
                        desktopFrame: { ...project.desktopFrame, title: e.target.value }
                      })}
                      placeholder="e.g. Maya Studio, Terminal"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-dark-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  {currentModel.kind === 'browser' && (
                    <div className="space-y-1">
                      <span className="text-slate-400 text-[11px]">Address Bar URL</span>
                      <input
                        type="text"
                        value={project.desktopFrame?.url || currentModel.desktopConfig?.url || ''}
                        onChange={(e) => onChange({
                          desktopFrame: { ...project.desktopFrame, url: e.target.value }
                        })}
                        placeholder="https://maya.studio"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-dark-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 font-mono text-[11px]"
                      />
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* 3D Studio Tilt & Perspective */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <Compass className="w-3.5 h-3.5 text-brand-400" />
                  <span>3D Studio Tilt & Depth</span>
                </div>
                <button
                  onClick={() => onChange({
                    transform3D: { ...project.transform3D, enabled: !project.transform3D.enabled }
                  })}
                  className={`px-2.5 py-0.5 rounded text-[10px] font-semibold border transition ${
                    project.transform3D.enabled
                      ? 'bg-brand-500/20 text-brand-300 border-brand-500/40'
                      : 'bg-dark-950 text-slate-500 border-slate-800'
                  }`}
                >
                  {project.transform3D.enabled ? 'ON' : 'OFF'}
                </button>
              </div>

              {project.transform3D.enabled && (
                <div className="space-y-3 p-3 rounded-xl bg-dark-950/80 border border-slate-800/80">
                  {/* Quick 3D Presets */}
                  <div className="grid grid-cols-2 gap-1.5 pb-1 border-b border-slate-800/60">
                    <button
                      onClick={() => onChange({
                        transform3D: { ...project.transform3D, rotateX: 14, rotateY: -20, rotateZ: 3, depthExtrusion: 16, specularGlare: true }
                      })}
                      className="py-1.5 rounded-lg bg-dark-900 hover:bg-slate-800 border border-slate-800 text-[10px] text-slate-300 font-medium"
                    >
                      Isometric Left
                    </button>
                    <button
                      onClick={() => onChange({
                        transform3D: { ...project.transform3D, rotateX: 14, rotateY: 20, rotateZ: -3, depthExtrusion: 16, specularGlare: true }
                      })}
                      className="py-1.5 rounded-lg bg-dark-900 hover:bg-slate-800 border border-slate-800 text-[10px] text-slate-300 font-medium"
                    >
                      Isometric Right
                    </button>
                    <button
                      onClick={() => onChange({
                        transform3D: { ...project.transform3D, rotateX: 18, rotateY: 0, rotateZ: 0, depthExtrusion: 18, specularGlare: true }
                      })}
                      className="py-1.5 rounded-lg bg-dark-900 hover:bg-slate-800 border border-slate-800 text-[10px] text-slate-300 font-medium"
                    >
                      Hero Pitch
                    </button>
                    <button
                      onClick={() => onChange({
                        transform3D: { ...project.transform3D, rotateX: 0, rotateY: 0, rotateZ: 0, depthExtrusion: 0, specularGlare: false }
                      })}
                      className="py-1.5 rounded-lg bg-dark-900 hover:bg-slate-800 border border-slate-800 text-[10px] text-slate-300 font-medium"
                    >
                      Flat Focus
                    </button>
                  </div>

                  {/* Pitch */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-400 text-[11px]">
                      <span>Pitch (Rotate X)</span>
                      <span className="font-mono text-slate-300">{project.transform3D.rotateX}°</span>
                    </div>
                    <input
                      type="range"
                      min="-35"
                      max="35"
                      step="1"
                      value={project.transform3D.rotateX}
                      onChange={(e) => onChange({
                        transform3D: { ...project.transform3D, rotateX: parseInt(e.target.value) }
                      })}
                      className="w-full accent-brand-500 cursor-pointer"
                    />
                  </div>

                  {/* Yaw */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-400 text-[11px]">
                      <span>Yaw (Rotate Y)</span>
                      <span className="font-mono text-slate-300">{project.transform3D.rotateY}°</span>
                    </div>
                    <input
                      type="range"
                      min="-45"
                      max="45"
                      step="1"
                      value={project.transform3D.rotateY}
                      onChange={(e) => onChange({
                        transform3D: { ...project.transform3D, rotateY: parseInt(e.target.value) }
                      })}
                      className="w-full accent-brand-500 cursor-pointer"
                    />
                  </div>

                  {/* 3D Chassis Thickness */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-400 text-[11px]">
                      <span>3D Chassis Extrusion</span>
                      <span className="font-mono text-slate-300">{project.transform3D.depthExtrusion || 14}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="24"
                      step="2"
                      value={project.transform3D.depthExtrusion || 14}
                      onChange={(e) => onChange({
                        transform3D: { ...project.transform3D, depthExtrusion: parseInt(e.target.value) }
                      })}
                      className="w-full accent-brand-500 cursor-pointer"
                    />
                  </div>

                  {/* Specular Sheen & Drift */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
                    <span className="text-slate-400 text-[11px]">Glass Specular Reflection</span>
                    <input
                      type="checkbox"
                      checked={project.transform3D.specularGlare !== false}
                      onChange={(e) => onChange({
                        transform3D: { ...project.transform3D, specularGlare: e.target.checked }
                      })}
                      className="accent-brand-500 cursor-pointer w-4 h-4 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-slate-400 text-[11px]">Cinematic Parallax Drift</span>
                    <input
                      type="checkbox"
                      checked={project.transform3D.autoDrift}
                      onChange={(e) => onChange({
                        transform3D: { ...project.transform3D, autoDrift: e.target.checked }
                      })}
                      className="accent-brand-500 cursor-pointer w-4 h-4 rounded"
                    />
                  </div>
                </div>
              )}
            </section>

            {/* Scale & Framing */}
            <section className="space-y-3">
              <div className="flex items-center space-x-2 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <Sliders className="w-3.5 h-3.5 text-brand-400" />
                <span>Scale & Framing</span>
              </div>

              <div className="space-y-3 p-3 rounded-xl bg-dark-950/80 border border-slate-800/80">
                <div className="space-y-1">
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Device Scale</span>
                    <span className="font-mono text-slate-300">{(project.scale * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.4"
                    max="1.5"
                    step="0.01"
                    value={project.scale}
                    onChange={(e) => onChange({ scale: parseFloat(e.target.value) })}
                    className="w-full accent-brand-500 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Drop Shadow Opacity</span>
                    <span className="font-mono text-slate-300">{(project.shadow.opacity * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={project.shadow.opacity}
                    onChange={(e) => onChange({ 
                      shadow: { ...project.shadow, opacity: parseFloat(e.target.value) } 
                    })}
                    className="w-full accent-brand-500 cursor-pointer"
                  />
                </div>
              </div>
            </section>
          </div>
        )}

        {/* TAB 2: BACKDROP */}
        {activeTab === 'background' && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <section className="space-y-3">
              <div className="flex items-center space-x-2 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <Palette className="w-3.5 h-3.5 text-brand-400" />
                <span>Background Mode</span>
              </div>

              {/* Mode Tabs */}
              <div className="grid grid-cols-5 gap-1 bg-dark-950/80 p-1.5 rounded-xl border border-slate-800/80">
                {(['gradient', 'meshGradient', 'solid', 'videoBlur', 'none'] as const).map((mode) => {
                  const isSelected = project.background.type === mode;
                  const labels: Record<string, string> = {
                    gradient: 'Grad',
                    meshGradient: 'Aurora',
                    solid: 'Solid',
                    videoBlur: 'Blur',
                    none: 'Alpha',
                  };
                  return (
                    <button
                      key={mode}
                      onClick={() => {
                        if (mode === 'gradient') {
                          onChange({ background: { type: 'gradient', gradient: GRADIENT_PRESETS[0] } });
                        } else if (mode === 'meshGradient') {
                          onChange({ background: { type: 'meshGradient' as any, theme: 'aurora' } as any });
                        } else if (mode === 'solid') {
                          onChange({ background: { type: 'solid', hex: SOLID_PRESETS[0] } });
                        } else if (mode === 'videoBlur') {
                          onChange({ background: { type: 'videoBlur' } });
                        } else {
                          onChange({ background: { type: 'none' } });
                        }
                      }}
                      className={`py-1.5 rounded-lg text-center font-medium transition text-[11px] ${
                        isSelected
                          ? 'bg-brand-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {labels[mode]}
                    </button>
                  );
                })}
              </div>

              {/* Animated Mesh Gradient Presets */}
              {(project.background.type as any) === 'meshGradient' && (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {[
                    { id: 'aurora', name: 'Aurora Borealis', colors: ['#10B981', '#6366F1'] },
                    { id: 'cyberpunk', name: 'Cyberpunk Neon', colors: ['#F43F5E', '#A855F7'] },
                    { id: 'sunset', name: 'Sunset Glow', colors: ['#F97316', '#EC4899'] },
                    { id: 'deepOcean', name: 'Deep Ocean', colors: ['#0284C7', '#4F46E5'] },
                  ].map((theme) => {
                    const isSelected = (project.background as any).theme === theme.id || (!((project.background as any).theme) && theme.id === 'aurora');
                    return (
                      <button
                        key={theme.id}
                        onClick={() => onChange({ background: { type: 'meshGradient' as any, theme: theme.id } as any })}
                        className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition ${
                          isSelected ? 'border-brand-400 ring-2 ring-brand-500/40 bg-brand-500/10' : 'border-slate-800 bg-dark-950 hover:border-slate-700'
                        }`}
                      >
                        <span className="text-[11px] font-medium text-white">{theme.name}</span>
                        <div 
                          className="w-4 h-4 rounded-full border border-slate-700 shadow-sm animate-pulse"
                          style={{ background: `linear-gradient(135deg, ${theme.colors[0]}, ${theme.colors[1]})` }}
                        />
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Gradient Presets */}
              {project.background.type === 'gradient' && (
                <div className="grid grid-cols-4 gap-2 pt-1">
                  {GRADIENT_PRESETS.map((grad, i) => {
                    const isSelected = project.background.gradient?.startHex === grad.startHex &&
                                       project.background.gradient?.endHex === grad.endHex;
                    return (
                      <button
                        key={i}
                        onClick={() => onChange({ background: { type: 'gradient', gradient: grad } })}
                        className={`h-10 rounded-xl transition border overflow-hidden relative shadow-sm ${
                          isSelected ? 'border-brand-400 ring-2 ring-brand-500/40 scale-105' : 'border-slate-700/60 hover:scale-102'
                        }`}
                        style={{
                          background: `linear-gradient(${grad.angleDegrees}deg, ${grad.startHex}, ${grad.endHex})`,
                        }}
                      />
                    );
                  })}
                </div>
              )}

              {/* Solid Presets */}
              {project.background.type === 'solid' && (
                <div className="grid grid-cols-5 gap-2 pt-1">
                  {SOLID_PRESETS.map((hex, i) => {
                    const isSelected = project.background.hex === hex;
                    return (
                      <button
                        key={i}
                        onClick={() => onChange({ background: { type: 'solid', hex } })}
                        className={`h-8 rounded-xl transition border shadow-inner ${
                          isSelected ? 'border-brand-400 ring-2 ring-brand-500/40 scale-105' : 'border-slate-700/60 hover:scale-105'
                        }`}
                        style={{ backgroundColor: hex }}
                      />
                    );
                  })}
                </div>
              )}

              {/* Studio Background Pattern Controls */}
              <div className="pt-2 border-t border-slate-800/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-300">Studio Texture Pattern</span>
                  <input
                    type="checkbox"
                    checked={project.background.pattern?.enabled || false}
                    onChange={(e) => onChange({
                      background: {
                        ...project.background,
                        pattern: {
                          enabled: e.target.checked,
                          type: project.background.pattern?.type || 'dots',
                          opacity: project.background.pattern?.opacity ?? 0.25,
                          colorHex: project.background.pattern?.colorHex || '#FFFFFF',
                          scale: project.background.pattern?.scale || 32,
                        }
                      }
                    })}
                    className="accent-brand-500 cursor-pointer w-4 h-4 rounded"
                  />
                </div>

                {project.background.pattern?.enabled && (
                  <div className="space-y-2.5 p-2.5 rounded-xl bg-dark-950/60 border border-slate-800">
                    <div className="grid grid-cols-5 gap-1">
                      {(['dots', 'grid', 'crosses', 'circuit', 'radialLines'] as const).map((pType) => {
                        const isSelected = (project.background.pattern?.type || 'dots') === pType;
                        return (
                          <button
                            key={pType}
                            onClick={() => onChange({
                              background: {
                                ...project.background,
                                pattern: { ...project.background.pattern!, type: pType }
                              }
                            })}
                            className={`py-1 rounded-lg text-[10px] font-medium capitalize transition ${
                              isSelected ? 'bg-brand-600 text-white' : 'bg-dark-900 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {pType === 'radialLines' ? 'Rays' : pType}
                          </button>
                        );
                      })}
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Pattern Opacity</span>
                        <span className="font-mono text-slate-200">
                          {Math.round((project.background.pattern?.opacity ?? 0.25) * 100)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.05"
                        max="0.8"
                        step="0.05"
                        value={project.background.pattern?.opacity ?? 0.25}
                        onChange={(e) => onChange({
                          background: {
                            ...project.background,
                            pattern: { ...project.background.pattern!, opacity: parseFloat(e.target.value) }
                          }
                        })}
                        className="w-full accent-brand-500 cursor-pointer"
                      />
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        {/* TAB 3: VFX & SHADERS */}
        {activeTab === 'vfx' && (
          <div className="space-y-5 animate-in fade-in duration-150">
            {/* Cinematic Color Grade Presets */}
            <section className="space-y-3">
              <div className="flex items-center space-x-2 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                <span>Cinematic Color Grades & Shaders</span>
              </div>

              <div className="grid grid-cols-1 gap-1.5">
                {CINEMATIC_LUTS.map((lut) => {
                  const isSelected = (project.effects?.colorGrade || 'none') === lut.id;
                  return (
                    <button
                      key={lut.id}
                      onClick={() => onChange({
                        effects: { ...project.effects, colorGrade: lut.id }
                      })}
                      className={`px-3 py-2 rounded-xl text-left font-medium transition flex items-center justify-between border ${
                        isSelected
                          ? 'bg-rose-500/15 border-rose-500 text-rose-300 shadow-sm'
                          : 'bg-dark-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 truncate">
                        <span 
                          className="w-3 h-3 rounded-full shrink-0 shadow-sm" 
                          style={{ backgroundColor: lut.color }}
                        />
                        <div>
                          <div className="text-[11px] font-semibold text-slate-200">{lut.label}</div>
                          <div className="text-[9px] text-slate-400 truncate">{lut.desc}</div>
                        </div>
                      </div>
                      {isSelected && <span className="text-[10px] text-rose-400 font-mono">ACTIVE</span>}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Sliders & Lens Distortions */}
            <section className="space-y-3 p-3 rounded-xl bg-dark-950/80 border border-slate-800/80">
              <div className="space-y-1">
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Vignette Depth</span>
                  <span className="font-mono text-slate-300">{((project.effects?.vignette || 0) * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={project.effects?.vignette || 0}
                  onChange={(e) => onChange({
                    effects: { ...project.effects, vignette: parseFloat(e.target.value) }
                  })}
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Camera Shake Jitter</span>
                  <span className="font-mono text-slate-300">{((project.effects?.cameraShake || 0) * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={project.effects?.cameraShake || 0}
                  onChange={(e) => onChange({
                    effects: { ...project.effects, cameraShake: parseFloat(e.target.value) }
                  })}
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>RGB Glitch Distortion</span>
                  <span className="font-mono text-slate-300">{((project.effects?.rgbGlitch || 0) * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={project.effects?.rgbGlitch || 0}
                  onChange={(e) => onChange({
                    effects: { ...project.effects, rgbGlitch: parseFloat(e.target.value) }
                  })}
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </div>

              {/* Spotlight FX */}
              <div className="space-y-2 pt-2 border-t border-slate-800/60">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">Spotlight Focus FX</span>
                  <input
                    type="checkbox"
                    checked={project.effects?.spotlight?.enabled || false}
                    onChange={(e) => onChange({
                      effects: {
                        ...project.effects,
                        spotlight: {
                          enabled: e.target.checked,
                          x: project.effects?.spotlight?.x ?? 0.5,
                          y: project.effects?.spotlight?.y ?? 0.5,
                          radius: project.effects?.spotlight?.radius ?? 0.35,
                          opacity: project.effects?.spotlight?.opacity ?? 0.65,
                        }
                      }
                    })}
                    className="accent-rose-500 cursor-pointer w-4 h-4 rounded"
                  />
                </div>
              </div>

              {/* Hardware Frame Glow */}
              <div className="space-y-2 pt-1 border-t border-slate-800/60">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">Device Frame Neon Glow</span>
                  <input
                    type="checkbox"
                    checked={project.effects?.deviceGlow?.enabled || false}
                    onChange={(e) => onChange({
                      effects: {
                        ...project.effects,
                        deviceGlow: {
                          enabled: e.target.checked,
                          colorHex: project.effects?.deviceGlow?.colorHex || '#6466FA',
                          radius: project.effects?.deviceGlow?.radius || 24,
                        }
                      }
                    })}
                    className="accent-brand-500 cursor-pointer w-4 h-4 rounded"
                  />
                </div>
              </div>

              {/* Cinema Letterbox & CRT & Leaks */}
              <div className="space-y-2 pt-1 border-t border-slate-800/60">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">2.39:1 Cinema Letterbox</span>
                  <input
                    type="checkbox"
                    checked={project.effects?.letterbox?.enabled || false}
                    onChange={(e) => onChange({
                      effects: {
                        ...project.effects,
                        letterbox: {
                          enabled: e.target.checked,
                          aspect: '2.39:1',
                          opacity: 1.0,
                        }
                      }
                    })}
                    className="accent-rose-500 cursor-pointer w-4 h-4 rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">CRT Scanlines Overlay</span>
                  <input
                    type="checkbox"
                    checked={project.effects?.scanlines || false}
                    onChange={(e) => onChange({
                      effects: { ...project.effects, scanlines: e.target.checked }
                    })}
                    className="accent-rose-500 cursor-pointer w-4 h-4 rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">VHS Tape & VCR Tracking</span>
                  <input
                    type="checkbox"
                    checked={project.effects?.vhsGlitch?.enabled || false}
                    onChange={(e) => onChange({
                      effects: {
                        ...project.effects,
                        vhsGlitch: {
                          enabled: e.target.checked,
                          intensity: project.effects?.vhsGlitch?.intensity ?? 0.6,
                          showOSD: project.effects?.vhsGlitch?.showOSD ?? true,
                        }
                      }
                    })}
                    className="accent-emerald-500 cursor-pointer w-4 h-4 rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">35mm Film Light Leaks</span>
                  <input
                    type="checkbox"
                    checked={project.effects?.lightLeaks?.enabled || false}
                    onChange={(e) => onChange({
                      effects: {
                        ...project.effects,
                        lightLeaks: {
                          enabled: e.target.checked,
                          intensity: project.effects?.lightLeaks?.intensity ?? 0.5,
                          theme: project.effects?.lightLeaks?.theme || 'kodakWarm',
                        }
                      }
                    })}
                    className="accent-amber-500 cursor-pointer w-4 h-4 rounded"
                  />
                </div>
              </div>
            </section>

            {/* Meta Edits AI Effects */}
            <section className="space-y-3">
              <div className="flex items-center space-x-2 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <Wand2 className="w-3.5 h-3.5 text-rose-400" />
                <span>Meta Edits AI Overlays</span>
              </div>

              <div className="space-y-2.5 p-3 rounded-xl bg-dark-950/80 border border-slate-800/80">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 text-[11px]">Neon Scribble Doodles</span>
                  <input
                    type="checkbox"
                    checked={project.metaEdits?.scribble?.enabled || false}
                    onChange={(e) => onChange({
                      metaEdits: {
                        ...project.metaEdits,
                        scribble: {
                          enabled: e.target.checked,
                          style: project.metaEdits?.scribble?.style || 'neon',
                          speed: project.metaEdits?.scribble?.speed ?? 1.5,
                          intensity: project.metaEdits?.scribble?.intensity ?? 0.8,
                          colorHex: project.metaEdits?.scribble?.colorHex || '#38BDF8',
                        }
                      }
                    })}
                    className="accent-cyan-500 cursor-pointer w-4 h-4 rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-300 text-[11px]">Luminous Silhouette Outline</span>
                  <input
                    type="checkbox"
                    checked={project.metaEdits?.outline?.enabled || false}
                    onChange={(e) => onChange({
                      metaEdits: {
                        ...project.metaEdits,
                        outline: {
                          enabled: e.target.checked,
                          colorHex: project.metaEdits?.outline?.colorHex || '#EC4899',
                          width: project.metaEdits?.outline?.width || 4,
                          pulseSpeed: project.metaEdits?.outline?.pulseSpeed || 2.0,
                          glowIntensity: project.metaEdits?.outline?.glowIntensity ?? 0.9,
                          style: project.metaEdits?.outline?.style || 'flowing',
                        }
                      }
                    })}
                    className="accent-rose-500 cursor-pointer w-4 h-4 rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-300 text-[11px]">Glitter & Diamond Sparkles</span>
                  <input
                    type="checkbox"
                    checked={project.metaEdits?.glitter?.enabled || false}
                    onChange={(e) => onChange({
                      metaEdits: {
                        ...project.metaEdits,
                        glitter: {
                          enabled: e.target.checked,
                          starCount: project.metaEdits?.glitter?.starCount || 36,
                          colorTheme: project.metaEdits?.glitter?.colorTheme || 'diamond',
                          speed: project.metaEdits?.glitter?.speed || 1.0,
                        }
                      }
                    })}
                    className="accent-amber-500 cursor-pointer w-4 h-4 rounded"
                  />
                </div>
              </div>
            </section>
          </div>
        )}

        {/* TAB 4: BRANDING & BARS */}
        {activeTab === 'branding' && (
          <div className="space-y-5 animate-in fade-in duration-150">
            {/* Viral Video Progress Bar */}
            <section className="space-y-3">
              <div className="flex items-center justify-between text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <div className="flex items-center space-x-2">
                  <Timer className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Progress Bar (Shorts / Reels)</span>
                </div>
                <button
                  onClick={() => {
                    const current = project.progressBar ?? DEFAULT_PROGRESS_BAR_CONFIG;
                    onChange({
                      progressBar: {
                        ...current,
                        enabled: !current.enabled,
                      },
                    });
                  }}
                  className={`w-8 h-4 rounded-full p-0.5 transition ${
                    project.progressBar?.enabled ? 'bg-cyan-600' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`w-3 h-3 rounded-full bg-white transition transform ${
                      project.progressBar?.enabled ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {project.progressBar?.enabled && (
                <div className="space-y-3 p-3 rounded-xl bg-dark-950/80 border border-slate-800/80">
                  {/* Style Selector */}
                  <div className="space-y-1">
                    <span className="text-slate-400 text-[11px]">Bar Style</span>
                    <div className="grid grid-cols-2 gap-1 bg-dark-900 p-1 rounded-lg border border-slate-800">
                      {(
                        [
                          { id: 'gradient', label: 'Gradient' },
                          { id: 'neonGlow', label: 'Neon Glow' },
                          { id: 'storyPills', label: 'Story Pills' },
                          { id: 'radialClock', label: 'Radial Clock' },
                        ] as const
                      ).map((s) => (
                        <button
                          key={s.id}
                          onClick={() =>
                            onChange({
                              progressBar: {
                                ...(project.progressBar ?? DEFAULT_PROGRESS_BAR_CONFIG),
                                style: s.id as ProgressBarStyle,
                              },
                            })
                          }
                          className={`py-1 rounded text-[10px] font-medium transition ${
                            project.progressBar?.style === s.id
                              ? 'bg-cyan-600 text-white shadow-sm'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Position Selector */}
                  <div className="space-y-1">
                    <span className="text-slate-400 text-[11px]">Position</span>
                    <div className="grid grid-cols-2 gap-1 bg-dark-900 p-1 rounded-lg border border-slate-800">
                      {(
                        [
                          { id: 'bottom', label: 'Bottom' },
                          { id: 'bottom-thin', label: 'Bottom Thin' },
                          { id: 'top', label: 'Top' },
                          { id: 'top-pills', label: 'Top Pills' },
                        ] as const
                      ).map((p) => (
                        <button
                          key={p.id}
                          onClick={() =>
                            onChange({
                              progressBar: {
                                ...(project.progressBar ?? DEFAULT_PROGRESS_BAR_CONFIG),
                                position: p.id as ProgressBarPosition,
                              },
                            })
                          }
                          className={`py-1 rounded text-[10px] capitalize transition ${
                            project.progressBar?.position === p.id
                              ? 'bg-cyan-600 text-white font-medium shadow-sm'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Colors */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <span className="text-slate-400 text-[11px]">Start Color</span>
                      <div className="flex items-center space-x-1.5 bg-dark-900 px-2 py-1 rounded-lg border border-slate-800">
                        <input
                          type="color"
                          value={project.progressBar?.colorStart || '#6366F1'}
                          onChange={(e) =>
                            onChange({
                              progressBar: {
                                ...(project.progressBar ?? DEFAULT_PROGRESS_BAR_CONFIG),
                                colorStart: e.target.value,
                              },
                            })
                          }
                          className="w-5 h-5 rounded cursor-pointer bg-transparent border-0"
                        />
                        <input
                          type="text"
                          value={project.progressBar?.colorStart || '#6366F1'}
                          onChange={(e) =>
                            onChange({
                              progressBar: {
                                ...(project.progressBar ?? DEFAULT_PROGRESS_BAR_CONFIG),
                                colorStart: e.target.value,
                              },
                            })
                          }
                          className="w-full bg-transparent font-mono text-[10px] text-slate-300 focus:outline-none uppercase"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-slate-400 text-[11px]">End Color</span>
                      <div className="flex items-center space-x-1.5 bg-dark-900 px-2 py-1 rounded-lg border border-slate-800">
                        <input
                          type="color"
                          value={project.progressBar?.colorEnd || '#EC4899'}
                          onChange={(e) =>
                            onChange({
                              progressBar: {
                                ...(project.progressBar ?? DEFAULT_PROGRESS_BAR_CONFIG),
                                colorEnd: e.target.value,
                              },
                            })
                          }
                          className="w-5 h-5 rounded cursor-pointer bg-transparent border-0"
                        />
                        <input
                          type="text"
                          value={project.progressBar?.colorEnd || '#EC4899'}
                          onChange={(e) =>
                            onChange({
                              progressBar: {
                                ...(project.progressBar ?? DEFAULT_PROGRESS_BAR_CONFIG),
                                colorEnd: e.target.value,
                              },
                            })
                          }
                          className="w-full bg-transparent font-mono text-[10px] text-slate-300 focus:outline-none uppercase"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Thickness */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-400 text-[11px]">
                      <span>Height / Thickness</span>
                      <span className="font-mono text-slate-300">
                        {project.progressBar?.height ?? 6}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="16"
                      step="1"
                      value={project.progressBar?.height ?? 6}
                      onChange={(e) =>
                        onChange({
                          progressBar: {
                            ...(project.progressBar ?? DEFAULT_PROGRESS_BAR_CONFIG),
                            height: parseInt(e.target.value, 10),
                          },
                        })
                      }
                      className="w-full accent-cyan-500 cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </section>

            {/* Studio Watermark & Branding */}
            <section className="space-y-3">
              <div className="flex items-center justify-between text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <div className="flex items-center space-x-2">
                  <Shield className="w-3.5 h-3.5 text-brand-400" />
                  <span>Watermark & Logo</span>
                </div>
                <button
                  onClick={() => onChange({
                    watermark: {
                      ...project.watermark,
                      enabled: !project.watermark?.enabled
                    }
                  })}
                  className={`w-8 h-4 rounded-full p-0.5 transition ${
                    project.watermark?.enabled ? 'bg-brand-600' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`w-3 h-3 rounded-full bg-white transition transform ${
                      project.watermark?.enabled ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {project.watermark?.enabled && (
                <div className="space-y-3 p-3 rounded-xl bg-dark-950/80 border border-slate-800/80">
                  <div className="space-y-1">
                    <span className="text-slate-400 text-[11px]">Badge Text</span>
                    <input
                      type="text"
                      value={project.watermark.text || ''}
                      onChange={(e) => onChange({
                        watermark: { ...project.watermark, text: e.target.value }
                      })}
                      placeholder="e.g. Zoth Studio, @MayaVideo"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-dark-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-400 text-[11px]">Corner Position</span>
                    <div className="grid grid-cols-2 gap-1 bg-dark-900 p-1 rounded-lg border border-slate-800">
                      {(['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const).map((pos) => (
                        <button
                          key={pos}
                          onClick={() => onChange({
                            watermark: { ...project.watermark, position: pos }
                          })}
                          className={`py-1 rounded text-[10px] capitalize transition ${
                            project.watermark.position === pos
                              ? 'bg-brand-600 text-white font-medium shadow-sm'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {pos.replace('-', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-400 text-[11px]">
                      <span>Opacity</span>
                      <span className="font-mono text-slate-300">
                        {Math.round((project.watermark.opacity ?? 0.75) * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="1.0"
                      step="0.05"
                      value={project.watermark.opacity ?? 0.75}
                      onChange={(e) => onChange({
                        watermark: { ...project.watermark, opacity: parseFloat(e.target.value) }
                      })}
                      className="w-full accent-brand-500 cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </section>
          </div>
        )}

      </div>
    </aside>
  );
};
