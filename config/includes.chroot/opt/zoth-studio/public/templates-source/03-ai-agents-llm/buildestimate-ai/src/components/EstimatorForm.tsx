import { useState } from 'react';
import { MapPin, Sparkles, Sliders, Keyboard } from 'lucide-react';
import { ProjectType, EstimateRequest, QualityTier } from '../types';
import { cn } from '../lib/utils';
import { ProjectTemplates } from './ProjectTemplates';
import { playClickSound } from '../lib/sound';

export function EstimatorForm({ onSubmit, isLoading }: { onSubmit: (req: EstimateRequest) => void; isLoading: boolean }) {
  const [projectType, setProjectType] = useState<ProjectType>('residential');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState('');
  const [squareFootage, setSquareFootage] = useState('');
  const [qualityTier, setQualityTier] = useState<QualityTier>('standard');
  const [contingencyPercent, setContingencyPercent] = useState<number>(10);

  const handleSelectPreset = (preset: EstimateRequest) => {
    setProjectType(preset.projectType);
    setLocation(preset.location);
    setDescription(preset.description);
    setSquareFootage(preset.squareFootage ? String(preset.squareFootage) : '');
    setBudget(preset.budget ? String(preset.budget) : '');
    if (preset.qualityTier) setQualityTier(preset.qualityTier);
    if (preset.contingencyPercent) setContingencyPercent(preset.contingencyPercent);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();
    onSubmit({
      projectType,
      description,
      location,
      budget: budget ? Number(budget) : undefined,
      squareFootage: squareFootage ? Number(squareFootage) : undefined,
      qualityTier,
      contingencyPercent
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" role="form" aria-label="Construction Estimate Form">
      {/* 1-Click Preset Selector */}
      <ProjectTemplates onSelect={handleSelectPreset} />

      <div className="h-px bg-slate-200/80 my-4" />

      {/* Segmented Control - Project Type */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Project Sector</label>
        <div className="flex p-1 bg-slate-100/90 rounded-xl border border-slate-200/80" role="tablist">
          {(['residential', 'commercial'] as ProjectType[]).map((type) => (
            <button
              key={type}
              type="button"
              role="tab"
              aria-selected={projectType === type}
              onClick={() => {
                playClickSound();
                setProjectType(type);
              }}
              className={cn(
                "flex-1 py-2 text-xs font-bold rounded-lg transition-all capitalize",
                projectType === type ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
              )}
            >
              {type} Sector
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {/* Location & Details */}
        <div className="space-y-2">
          <label htmlFor="location-input" className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Location
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" aria-hidden="true" />
            <input
              id="location-input"
              required
              placeholder="e.g. Austin, TX or London, UK"
              className="input-field pl-10"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              aria-required="true"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="description-input" className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Scope & Specifications
          </label>
          <textarea
            id="description-input"
            required
            rows={4}
            placeholder="Describe scope, materials (e.g. quartz, solar, timber framing), structural upgrades..."
            className="input-field resize-none text-xs leading-relaxed"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            aria-required="true"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label htmlFor="budget-input" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Budget ($)
            </label>
            <input
              id="budget-input"
              type="number"
              min="1000"
              placeholder="Optional limit"
              className="input-field text-xs"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="sqft-input" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Area (sq ft)
            </label>
            <input
              id="sqft-input"
              type="number"
              min="100"
              placeholder="Total area"
              className="input-field text-xs"
              value={squareFootage}
              onChange={(e) => setSquareFootage(e.target.value)}
            />
          </div>
        </div>

        {/* Finish Quality Tier */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
            <span>Material Tier</span>
            <span className="text-[10px] font-normal text-slate-400 capitalize">{qualityTier} grade</span>
          </label>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100/90 rounded-xl border border-slate-200/80">
            {(['standard', 'premium', 'luxury'] as QualityTier[]).map((tier) => (
              <button
                key={tier}
                type="button"
                onClick={() => {
                  playClickSound();
                  setQualityTier(tier);
                }}
                className={cn(
                  "py-1.5 text-[11px] font-semibold rounded-lg capitalize transition-all",
                  qualityTier === tier ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                )}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>

        {/* Contingency Buffer Slider */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs">
            <label htmlFor="contingency-slider" className="font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3 h-3 text-slate-400" />
              Risk Buffer
            </label>
            <span className="font-mono font-bold text-accent-600 bg-accent-50 px-2 py-0.5 rounded text-[11px]">
              {contingencyPercent}% Contingency
            </span>
          </div>
          <input
            id="contingency-slider"
            type="range"
            min="5"
            max="25"
            step="5"
            value={contingencyPercent}
            onChange={(e) => setContingencyPercent(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary w-full py-3.5 text-sm flex items-center justify-center gap-2 group focus:ring-2 focus:ring-accent-500 focus:outline-none"
        aria-label="Generate Intelligence Report"
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            <span>Analyzing Project Scope...</span>
          </div>
        ) : (
          <>
            <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform text-accent-400" />
            <span>Generate Intelligence Report</span>
          </>
        )}
      </button>

      <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-mono">
        <Keyboard className="w-3 h-3" />
        <span>Press <kbd className="bg-slate-200/80 px-1 py-0.5 rounded text-slate-700">Cmd + Enter</kbd> to run</span>
      </div>
    </form>
  );
}
