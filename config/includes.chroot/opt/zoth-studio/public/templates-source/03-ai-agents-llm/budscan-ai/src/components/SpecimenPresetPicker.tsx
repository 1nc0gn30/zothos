import React from 'react';
import { PRESET_SPECIMENS, ScanResult } from '@/src/services/gemini';
import { Sparkles, AlertTriangle, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface SpecimenPresetPickerProps {
  onSelectPreset: (preset: typeof PRESET_SPECIMENS[0]) => void;
  disabled?: boolean;
}

export default function SpecimenPresetPicker({ onSelectPreset, disabled }: SpecimenPresetPickerProps) {
  const getBadgeStyle = (quality: string) => {
    switch (quality) {
      case 'fire': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'moldy': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'pgr': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      default: return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    }
  };

  return (
    <div className="space-y-2 bg-slate-900/60 border border-slate-800 rounded-xl p-3 backdrop-blur-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          Test-Drive Specimen Gallery
        </div>
        <span className="text-[10px] font-mono text-slate-400 uppercase">Click to analyze</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {PRESET_SPECIMENS.map((specimen) => (
          <button
            key={specimen.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelectPreset(specimen)}
            className="group relative flex items-center gap-2.5 p-2 rounded-lg bg-black/40 border border-slate-800/80 hover:border-emerald-500/50 hover:bg-emerald-950/20 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:opacity-50"
            aria-label={`Test scan ${specimen.name}`}
          >
            <div className="relative w-10 h-10 rounded-md overflow-hidden shrink-0 border border-slate-800">
              <img
                src={specimen.imageUrl}
                alt={specimen.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                loading="lazy"
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-medium text-slate-200 truncate group-hover:text-emerald-300">
                {specimen.name}
              </div>
              <span className={`inline-block text-[9px] px-1.5 py-0.5 rounded border font-mono font-bold mt-0.5 ${getBadgeStyle(specimen.quality)}`}>
                {specimen.badge}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
