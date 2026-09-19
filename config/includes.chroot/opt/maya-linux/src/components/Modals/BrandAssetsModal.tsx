import React, { useState } from 'react';
import { 
  Shield, 
  X, 
  Sparkles, 
  Plus, 
  Upload, 
  Image as ImageIcon,
  Crown,
  Layers,
  Check
} from 'lucide-react';
import { ImageOverlayItem, ImageOverlayAnimation } from '../../types/models';
import { BRAND_ASSET_PRESETS, BrandAssetPreset } from '../../services/typewriterOverlayService';

interface BrandAssetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddImageOverlay: (item: ImageOverlayItem) => void;
  currentTime: number;
}

export const BrandAssetsModal: React.FC<BrandAssetsModalProps> = ({
  isOpen,
  onClose,
  onAddImageOverlay,
  currentTime,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<BrandAssetPreset>(BRAND_ASSET_PRESETS[0]);
  const [customUrl, setCustomUrl] = useState('');
  const [duration, setDuration] = useState(6.0);
  const [scale, setScale] = useState(0.45);
  const [opacity, setOpacity] = useState(0.95);
  const [animation, setAnimation] = useState<ImageOverlayAnimation>('fade');
  const [isCircular, setIsCircular] = useState(false);
  const [posX, setPosX] = useState(0.18);
  const [posY, setPosY] = useState(0.08);
  const [activeCategory, setActiveCategory] = useState<'all' | 'logo' | 'seal' | 'heading'>('all');

  if (!isOpen) return null;

  const handleSelectPreset = (preset: BrandAssetPreset) => {
    setSelectedPreset(preset);
    setCustomUrl(preset.imageUrl);
    setScale(preset.defaultScale);
    setPosX(preset.defaultPosition.x);
    setPosY(preset.defaultPosition.y);
    setIsCircular(Boolean(preset.isCircular));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setCustomUrl(dataUrl);
      setSelectedPreset({
        id: 'custom-upload',
        name: file.name,
        category: 'badge',
        imageUrl: dataUrl,
        defaultPosition: { x: 0.5, y: 0.5 },
        defaultScale: 0.5,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const urlToUse = customUrl || selectedPreset.imageUrl;
    if (!urlToUse) return;

    const newItem: ImageOverlayItem = {
      id: crypto.randomUUID(),
      startTime: currentTime,
      duration,
      imageUrl: urlToUse,
      name: selectedPreset.name,
      position: { x: posX, y: posY },
      scale,
      opacity,
      animation,
      isCircularAvatar: isCircular,
      borderHex: selectedPreset.borderHex,
      borderWidth: isCircular ? 3 : undefined,
      glowColor: selectedPreset.glowColor,
      glowRadius: 20,
    };

    onAddImageOverlay(newItem);
    onClose();
  };

  const filteredPresets = activeCategory === 'all' 
    ? BRAND_ASSET_PRESETS 
    : BRAND_ASSET_PRESETS.filter(p => p.category === activeCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-dark-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-dark-950/80">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">Zoth Studio & Azoth Master Brand Assets</h3>
              <p className="text-xs text-slate-400">Insert authentic navbar logos, sovereign alchemical seals & transparent transition graphics</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
          {/* Category Tabs */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-1.5 bg-dark-950 p-1 rounded-xl border border-slate-800">
              {(['all', 'logo', 'seal', 'heading'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg font-bold capitalize transition text-[11px] ${
                    activeCategory === cat ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat === 'all' ? 'All Assets' : `${cat}s`}
                </button>
              ))}
            </div>

            <label className="cursor-pointer px-3 py-1.5 rounded-xl border border-slate-700 bg-dark-950/80 hover:border-brand-500 hover:bg-brand-500/10 text-slate-200 font-semibold flex items-center space-x-2 transition">
              <Upload className="w-3.5 h-3.5 text-brand-400" />
              <span>Upload Custom PNG</span>
              <input type="file" accept="image/png,image/svg+xml,image/jpeg" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          {/* Asset Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {filteredPresets.map((preset) => {
              const isSelected = selectedPreset.id === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-3 rounded-xl border text-left transition flex flex-col items-center justify-between group relative overflow-hidden ${
                    isSelected
                      ? 'bg-brand-500/15 border-brand-500 shadow-md shadow-brand-500/20'
                      : 'bg-dark-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="w-full h-24 flex items-center justify-center bg-black/40 rounded-lg p-2 mb-2 overflow-hidden">
                    <img
                      src={preset.imageUrl}
                      alt={preset.name}
                      className={`max-h-full max-w-full object-contain ${preset.isCircular ? 'rounded-full' : ''}`}
                    />
                  </div>
                  <span className="font-semibold text-slate-200 text-center text-[11px] line-clamp-1 group-hover:text-brand-300">
                    {preset.name}
                  </span>
                  <span className="text-[9px] text-slate-500 uppercase font-mono mt-0.5">{preset.category}</span>
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-brand-500 text-white flex items-center justify-center shadow">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Form Settings */}
          <form onSubmit={handleSubmit} className="space-y-4 border-t border-slate-800 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Scale ({Math.round(scale * 100)}%)</label>
                <input
                  type="range"
                  min="0.15"
                  max="1.5"
                  step="0.05"
                  value={scale}
                  onChange={(e) => setScale(Number(e.target.value))}
                  className="w-full accent-brand-500 mt-2"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Opacity ({Math.round(opacity * 100)}%)</label>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={opacity}
                  onChange={(e) => setOpacity(Number(e.target.value))}
                  className="w-full accent-brand-500 mt-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Animation</label>
                <select
                  value={animation}
                  onChange={(e) => setAnimation(e.target.value as ImageOverlayAnimation)}
                  className="w-full bg-dark-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-brand-500"
                >
                  <option value="fade">Fade In/Out</option>
                  <option value="pop">Pop Spring</option>
                  <option value="float">Gentle Float</option>
                  <option value="pulse">Pulse</option>
                  <option value="slide-in">Slide In Left</option>
                  <option value="spin">Slow Spin</option>
                  <option value="none">None (Static)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Duration (s)</label>
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  max="60"
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
                    onClick={() => { setPosX(0.18); setPosY(0.08); }}
                    className={`px-2 py-1 rounded text-[10px] font-bold border ${posX === 0.18 && posY === 0.08 ? 'bg-brand-600 border-brand-500 text-white' : 'bg-dark-950 border-slate-800 text-slate-400'}`}
                  >
                    Top Left
                  </button>
                  <button
                    type="button"
                    onClick={() => { setPosX(0.5); setPosY(0.18); }}
                    className={`px-2 py-1 rounded text-[10px] font-bold border ${posX === 0.5 && posY === 0.18 ? 'bg-brand-600 border-brand-500 text-white' : 'bg-dark-950 border-slate-800 text-slate-400'}`}
                  >
                    Top Center
                  </button>
                  <button
                    type="button"
                    onClick={() => { setPosX(0.88); setPosY(0.82); }}
                    className={`px-2 py-1 rounded text-[10px] font-bold border ${posX === 0.88 && posY === 0.82 ? 'bg-brand-600 border-brand-500 text-white' : 'bg-dark-950 border-slate-800 text-slate-400'}`}
                  >
                    Bottom Right
                  </button>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-3 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold transition shadow-lg shadow-amber-600/30 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Brand Overlay to Video</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
