import React, { useState } from 'react';
import { Sparkles, X, Wand2, EyeOff, Zap, Shield, Flame, Activity } from 'lucide-react';
import { ProjectState } from '../../types/project';
import { MetaEditsConfig } from '../../types/models';

interface MetaEditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectState;
  onUpdateMetaEdits: (config: MetaEditsConfig) => void;
}

export const MetaEditsModal: React.FC<MetaEditsModalProps> = ({
  isOpen,
  onClose,
  project,
  onUpdateMetaEdits,
}) => {
  const [activeTab, setActiveTab] = useState<'scribble' | 'outline' | 'glitter' | 'blur' | 'strobe'>('scribble');

  if (!isOpen) return null;

  const current = project.metaEdits || {};

  const update = (partial: Partial<MetaEditsConfig>) => {
    onUpdateMetaEdits({ ...current, ...partial });
  };

  const applyPreset = (preset: 'viral-scribble' | 'glamour-glitter' | 'cyber-glow' | 'privacy-censor') => {
    if (preset === 'viral-scribble') {
      update({
        scribble: {
          enabled: true,
          style: 'neon',
          speed: 1.6,
          intensity: 0.9,
          colorHex: '#38BDF8',
        },
        outline: {
          enabled: true,
          colorHex: '#F43F5E',
          width: 4,
          pulseSpeed: 2.5,
          glowIntensity: 0.85,
          style: 'flowing',
        },
      });
    } else if (preset === 'glamour-glitter') {
      update({
        glitter: {
          enabled: true,
          starCount: 48,
          colorTheme: 'diamond',
          speed: 1.2,
        },
        outline: {
          enabled: true,
          colorHex: '#FDE047',
          width: 3,
          pulseSpeed: 1.5,
          glowIntensity: 0.7,
          style: 'solid',
        },
      });
    } else if (preset === 'cyber-glow') {
      update({
        outline: {
          enabled: true,
          colorHex: '#06B6D4',
          width: 5,
          pulseSpeed: 3.0,
          glowIntensity: 1.0,
          style: 'flowing',
        },
        scribble: {
          enabled: true,
          style: 'electric',
          speed: 2.0,
          intensity: 0.85,
          colorHex: '#EC4899',
        },
      });
    } else if (preset === 'privacy-censor') {
      update({
        selectiveBlur: {
          enabled: true,
          type: 'pixelate',
          x: 0.5,
          y: 0.85,
          width: 0.45,
          height: 0.12,
          pixelSize: 14,
        },
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-dark-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-dark-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-rose-500 p-[1px] shadow-lg shadow-brand-500/20">
              <div className="w-full h-full rounded-[11px] bg-dark-950 flex items-center justify-center">
                <Wand2 className="w-4 h-4 text-brand-400" />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <span>Edits by Meta AI Effects</span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20">
                  SAM 3 Creative Suite
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Scribble doodles, edge outlines, diamond sparkles, and privacy blur
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-950 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1-Click Quick Presets */}
        <div className="p-4 bg-dark-950/60 border-b border-slate-800 flex items-center space-x-2 overflow-x-auto">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 shrink-0">
            Quick Packs:
          </span>
          <button
            onClick={() => applyPreset('viral-scribble')}
            className="px-2.5 py-1 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/20 text-xs font-medium shrink-0 transition flex items-center space-x-1.5"
          >
            <Activity className="w-3 h-3 text-cyan-400" />
            <span>Viral Scribble</span>
          </button>
          <button
            onClick={() => applyPreset('glamour-glitter')}
            className="px-2.5 py-1 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 text-xs font-medium shrink-0 transition flex items-center space-x-1.5"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Glamour Glitter</span>
          </button>
          <button
            onClick={() => applyPreset('cyber-glow')}
            className="px-2.5 py-1 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 border border-pink-500/20 text-xs font-medium shrink-0 transition flex items-center space-x-1.5"
          >
            <Flame className="w-3 h-3 text-pink-400" />
            <span>Cyber Outline</span>
          </button>
          <button
            onClick={() => applyPreset('privacy-censor')}
            className="px-2.5 py-1 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 text-xs font-medium shrink-0 transition flex items-center space-x-1.5"
          >
            <Shield className="w-3 h-3 text-emerald-400" />
            <span>Privacy Censor</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 pt-3 flex space-x-1.5 border-b border-slate-800/80 pb-3">
          {[
            { id: 'scribble', label: 'Neon Scribble', icon: Activity, color: 'text-cyan-400' },
            { id: 'outline', label: 'Luminous Outline', icon: Wand2, color: 'text-rose-400' },
            { id: 'glitter', label: 'Glitter & Sparkles', icon: Sparkles, color: 'text-amber-400' },
            { id: 'blur', label: 'Privacy Blur & Censor', icon: EyeOff, color: 'text-emerald-400' },
            { id: 'strobe', label: 'Flash Strobe', icon: Zap, color: 'text-yellow-400' },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center space-x-1.5 ${
                  isSelected
                    ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                    : 'bg-dark-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${tab.color}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div className="p-6 space-y-4 overflow-y-auto max-h-[55vh]">
          {/* 1. Scribble Tab */}
          {activeTab === 'scribble' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-dark-950 border border-slate-800">
                <div>
                  <h4 className="text-xs font-bold text-white">Enable Neon Scribble Effect</h4>
                  <p className="text-[11px] text-slate-400">
                    Hand-drawn animated sketch lines and doodles dancing around frame
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={current.scribble?.enabled || false}
                  onChange={(e) =>
                    update({
                      scribble: {
                        enabled: e.target.checked,
                        style: current.scribble?.style || 'neon',
                        speed: current.scribble?.speed ?? 1.5,
                        intensity: current.scribble?.intensity ?? 0.8,
                        colorHex: current.scribble?.colorHex || '#38BDF8',
                      },
                    })
                  }
                  className="accent-cyan-500 cursor-pointer w-4 h-4 rounded"
                />
              </div>

              {current.scribble?.enabled && (
                <div className="space-y-3.5 p-4 rounded-2xl bg-dark-950/80 border border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300 font-medium">Scribble Neon Color</span>
                    <div className="flex items-center space-x-2">
                      {['#38BDF8', '#EC4899', '#10B981', '#F59E0B', '#A855F7', '#FFFFFF'].map((hex) => (
                        <button
                          key={hex}
                          onClick={() =>
                            update({
                              scribble: { ...current.scribble!, colorHex: hex },
                            })
                          }
                          className={`w-6 h-6 rounded-full border transition ${
                            current.scribble?.colorHex === hex ? 'border-white ring-2 ring-cyan-500 scale-110' : 'border-slate-700'
                          }`}
                          style={{ backgroundColor: hex }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Animation Jitter Speed</span>
                      <span className="font-mono text-slate-200">{(current.scribble.speed ?? 1.5).toFixed(1)}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="3.0"
                      step="0.1"
                      value={current.scribble.speed ?? 1.5}
                      onChange={(e) =>
                        update({
                          scribble: { ...current.scribble!, speed: parseFloat(e.target.value) },
                        })
                      }
                      className="w-full accent-cyan-500 cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 2. Outline Tab */}
          {activeTab === 'outline' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-dark-950 border border-slate-800">
                <div>
                  <h4 className="text-xs font-bold text-white">Enable Luminous Silhouette Outline</h4>
                  <p className="text-[11px] text-slate-400">
                    Meta SAM 3 glowing contour highlight wrapping around the device screen
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={current.outline?.enabled || false}
                  onChange={(e) =>
                    update({
                      outline: {
                        enabled: e.target.checked,
                        colorHex: current.outline?.colorHex || '#EC4899',
                        width: current.outline?.width || 4,
                        pulseSpeed: current.outline?.pulseSpeed || 2.0,
                        glowIntensity: current.outline?.glowIntensity ?? 0.9,
                        style: current.outline?.style || 'flowing',
                      },
                    })
                  }
                  className="accent-rose-500 cursor-pointer w-4 h-4 rounded"
                />
              </div>

              {current.outline?.enabled && (
                <div className="space-y-3.5 p-4 rounded-2xl bg-dark-950/80 border border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300 font-medium">Outline Style</span>
                    <div className="flex space-x-1.5">
                      {(['solid', 'dashed', 'flowing'] as const).map((style) => (
                        <button
                          key={style}
                          onClick={() =>
                            update({
                              outline: { ...current.outline!, style },
                            })
                          }
                          className={`px-3 py-1 rounded-xl text-xs capitalize font-medium transition ${
                            current.outline?.style === style ? 'bg-rose-600 text-white' : 'bg-dark-900 text-slate-400'
                          }`}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Stroke Thickness</span>
                      <span className="font-mono text-slate-200">{current.outline.width || 4}px</span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="12"
                      step="1"
                      value={current.outline.width || 4}
                      onChange={(e) =>
                        update({
                          outline: { ...current.outline!, width: parseInt(e.target.value) },
                        })
                      }
                      className="w-full accent-rose-500 cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 3. Glitter Tab */}
          {activeTab === 'glitter' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-dark-950 border border-slate-800">
                <div>
                  <h4 className="text-xs font-bold text-white">Enable Glitter & Sparkles</h4>
                  <p className="text-[11px] text-slate-400">
                    Twinkling 4-point star glints and diamond shimmer floating over video
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={current.glitter?.enabled || false}
                  onChange={(e) =>
                    update({
                      glitter: {
                        enabled: e.target.checked,
                        starCount: current.glitter?.starCount || 36,
                        colorTheme: current.glitter?.colorTheme || 'diamond',
                        speed: current.glitter?.speed || 1.0,
                      },
                    })
                  }
                  className="accent-amber-500 cursor-pointer w-4 h-4 rounded"
                />
              </div>

              {current.glitter?.enabled && (
                <div className="space-y-3.5 p-4 rounded-2xl bg-dark-950/80 border border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300 font-medium">Sparkle Palette</span>
                    <div className="flex space-x-1.5">
                      {(['diamond', 'gold', 'neonPink', 'cosmic'] as const).map((thm) => (
                        <button
                          key={thm}
                          onClick={() =>
                            update({
                              glitter: { ...current.glitter!, colorTheme: thm },
                            })
                          }
                          className={`px-2.5 py-1 rounded-xl text-xs capitalize font-medium transition ${
                            current.glitter?.colorTheme === thm ? 'bg-amber-600 text-white' : 'bg-dark-900 text-slate-400'
                          }`}
                        >
                          {thm}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Sparkle Density</span>
                      <span className="font-mono text-slate-200">{current.glitter.starCount || 36} stars</span>
                    </div>
                    <input
                      type="range"
                      min="12"
                      max="72"
                      step="6"
                      value={current.glitter.starCount || 36}
                      onChange={(e) =>
                        update({
                          glitter: { ...current.glitter!, starCount: parseInt(e.target.value) },
                        })
                      }
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 4. Privacy Blur Tab */}
          {activeTab === 'blur' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-dark-950 border border-slate-800">
                <div>
                  <h4 className="text-xs font-bold text-white">Enable Privacy Blur & Pixelate Censor</h4>
                  <p className="text-[11px] text-slate-400">
                    Censor sensitive text, passwords, API keys, or faces on screen
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={current.selectiveBlur?.enabled || false}
                  onChange={(e) =>
                    update({
                      selectiveBlur: {
                        enabled: e.target.checked,
                        type: current.selectiveBlur?.type || 'pixelate',
                        x: current.selectiveBlur?.x ?? 0.5,
                        y: current.selectiveBlur?.y ?? 0.82,
                        width: current.selectiveBlur?.width ?? 0.45,
                        height: current.selectiveBlur?.height ?? 0.12,
                        pixelSize: current.selectiveBlur?.pixelSize || 14,
                      },
                    })
                  }
                  className="accent-emerald-500 cursor-pointer w-4 h-4 rounded"
                />
              </div>

              {current.selectiveBlur?.enabled && (
                <div className="space-y-3.5 p-4 rounded-2xl bg-dark-950/80 border border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300 font-medium">Censor Mode</span>
                    <div className="flex space-x-1.5">
                      {(['pixelate', 'gaussian'] as const).map((t) => (
                        <button
                          key={t}
                          onClick={() =>
                            update({
                              selectiveBlur: { ...current.selectiveBlur!, type: t },
                            })
                          }
                          className={`px-3 py-1 rounded-xl text-xs capitalize font-medium transition ${
                            current.selectiveBlur?.type === t ? 'bg-emerald-600 text-white' : 'bg-dark-900 text-slate-400'
                          }`}
                        >
                          {t === 'pixelate' ? '8-Bit Mosaic' : 'Frosted Blur'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>Position Y</span>
                        <span className="font-mono text-slate-200">
                          {Math.round((current.selectiveBlur.y ?? 0.82) * 100)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="0.95"
                        step="0.02"
                        value={current.selectiveBlur.y ?? 0.82}
                        onChange={(e) =>
                          update({
                            selectiveBlur: { ...current.selectiveBlur!, y: parseFloat(e.target.value) },
                          })
                        }
                        className="w-full accent-emerald-500 cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>Box Width</span>
                        <span className="font-mono text-slate-200">
                          {Math.round((current.selectiveBlur.width ?? 0.45) * 100)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="0.9"
                        step="0.05"
                        value={current.selectiveBlur.width ?? 0.45}
                        onChange={(e) =>
                          update({
                            selectiveBlur: { ...current.selectiveBlur!, width: parseFloat(e.target.value) },
                          })
                        }
                        className="w-full accent-emerald-500 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 5. Strobe Tab */}
          {activeTab === 'strobe' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-dark-950 border border-slate-800">
                <div>
                  <h4 className="text-xs font-bold text-white">Enable Beat Flash Strobe</h4>
                  <p className="text-[11px] text-slate-400">
                    High-energy rhythmic optical whiteout flash pulse
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={current.flashStrobe?.enabled || false}
                  onChange={(e) =>
                    update({
                      flashStrobe: {
                        enabled: e.target.checked,
                        intensity: current.flashStrobe?.intensity ?? 0.75,
                        triggerEverySec: current.flashStrobe?.triggerEverySec || 2.0,
                      },
                    })
                  }
                  className="accent-yellow-500 cursor-pointer w-4 h-4 rounded"
                />
              </div>

              {current.flashStrobe?.enabled && (
                <div className="space-y-3.5 p-4 rounded-2xl bg-dark-950/80 border border-slate-800">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Flash Pulse Interval</span>
                      <span className="font-mono text-slate-200">Every {current.flashStrobe.triggerEverySec || 2.0}s</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="5.0"
                      step="0.25"
                      value={current.flashStrobe.triggerEverySec || 2.0}
                      onChange={(e) =>
                        update({
                          flashStrobe: { ...current.flashStrobe!, triggerEverySec: parseFloat(e.target.value) },
                        })
                      }
                      className="w-full accent-yellow-500 cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-dark-950/50 flex items-center justify-between text-xs text-slate-400">
          <span>Meta Edits shaders render in real-time on live canvas and 4K export</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold shadow-lg shadow-brand-500/20 transition active:scale-95"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
