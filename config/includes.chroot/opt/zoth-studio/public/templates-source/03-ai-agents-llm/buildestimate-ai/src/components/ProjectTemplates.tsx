import { Sparkles } from 'lucide-react';
import { EstimateRequest, ProjectType, QualityTier } from '../types';
import { playClickSound } from '../lib/sound';

export interface PresetTemplate {
  id: string;
  name: string;
  badge: string;
  projectType: ProjectType;
  location: string;
  squareFootage: number;
  budget: number;
  qualityTier: QualityTier;
  contingencyPercent: number;
  description: string;
}

export const PRESET_TEMPLATES: PresetTemplate[] = [
  {
    id: 'kitchen-remodel',
    name: 'Luxury Kitchen Remodel',
    badge: 'Residential',
    projectType: 'residential',
    location: 'Austin, TX',
    squareFootage: 450,
    budget: 85000,
    qualityTier: 'luxury',
    contingencyPercent: 10,
    description: 'Complete high-end kitchen overhaul featuring Calacatta quartz countertops, custom white-oak shaker cabinets, sub-zero refrigeration paneling, and commercial gas range.'
  },
  {
    id: 'office-fitout',
    name: 'Tech Office Fit-Out',
    badge: 'Commercial',
    projectType: 'commercial',
    location: 'Denver, CO',
    squareFootage: 4800,
    budget: 340000,
    qualityTier: 'premium',
    contingencyPercent: 12,
    description: 'Open-concept corporate office conversion with glass partition meeting rooms, acoustic drop ceiling clouds, upgraded 400A electrical service, and high-density network cabling.'
  },
  {
    id: 'solar-microgrid',
    name: 'Solar & Battery Roof',
    badge: 'Green Energy',
    projectType: 'residential',
    location: 'San Diego, CA',
    squareFootage: 2400,
    budget: 52000,
    qualityTier: 'premium',
    contingencyPercent: 8,
    description: 'Whole-home 16kW solar panel system installation with dual smart battery storage walls, electrical main panel upgrade, and bidirectional EV charging infrastructure.'
  },
  {
    id: 'adu-cottage',
    name: 'Backyard ADU Cottage',
    badge: 'Residential',
    projectType: 'residential',
    location: 'Seattle, WA',
    squareFootage: 720,
    budget: 195000,
    qualityTier: 'standard',
    contingencyPercent: 10,
    description: 'Detached 2-bedroom accessory dwelling unit featuring standing-seam metal roofing, radiant floor heating, compact kitchenette, and private utility tie-ins.'
  }
];

interface ProjectTemplatesProps {
  onSelect: (preset: EstimateRequest) => void;
}

export function ProjectTemplates({ onSelect }: ProjectTemplatesProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-accent-500" />
          Quick 1-Click Presets
        </span>
        <span className="text-[10px] text-slate-400">Select to auto-fill</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {PRESET_TEMPLATES.map((tmpl) => (
          <button
            key={tmpl.id}
            type="button"
            onClick={() => {
              playClickSound();
              onSelect({
                projectType: tmpl.projectType,
                location: tmpl.location,
                squareFootage: tmpl.squareFootage,
                budget: tmpl.budget,
                qualityTier: tmpl.qualityTier,
                contingencyPercent: tmpl.contingencyPercent,
                description: tmpl.description
              });
            }}
            className="p-3 text-left bg-slate-50/80 hover:bg-white hover:shadow-sm border border-slate-200/80 hover:border-slate-300 rounded-xl transition-all group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-900 group-hover:text-accent-600 transition-colors truncate">
                {tmpl.name}
              </span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-500">
              <span>{tmpl.squareFootage} sq ft</span>
              <span className="font-mono text-slate-700 font-semibold">${tmpl.budget.toLocaleString()}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
