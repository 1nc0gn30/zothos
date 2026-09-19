import React from 'react';
import { Sparkles, X, ArrowRight, LayoutTemplate, Flame, Monitor, Smartphone, Terminal } from 'lucide-react';
import { ProjectState } from '../../types/project';
import { PRO_TEMPLATES, applyTemplate } from '../../services/templatesService';

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectState;
  onApply: (updater: Partial<ProjectState>) => void;
}

export const TemplatesModal: React.FC<TemplatesModalProps> = ({
  isOpen,
  onClose,
  project,
  onApply,
}) => {
  if (!isOpen) return null;

  const handleSelectTemplate = (templateId: string) => {
    const update = applyTemplate(templateId, project);
    onApply(update);
    onClose();
  };

  const getIcon = (id: string) => {
    switch (id) {
      case 'viral-shorts': return <Flame className="w-5 h-5 text-rose-400" />;
      case 'saas-launch': return <Sparkles className="w-5 h-5 text-brand-400" />;
      case 'apple-minimal': return <Smartphone className="w-5 h-5 text-slate-300" />;
      case 'streamer-highlight': return <Monitor className="w-5 h-5 text-emerald-400" />;
      case 'dev-tutorial': return <Terminal className="w-5 h-5 text-indigo-400" />;
      default: return <LayoutTemplate className="w-5 h-5 text-brand-400" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-dark-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="w-[680px] max-h-[85vh] bg-dark-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 flex flex-col animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center space-x-2.5 text-brand-400 font-semibold">
            <Sparkles className="w-5 h-5" />
            <span className="text-base text-white font-bold">Pro Studio Templates</span>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
              1-Click Style
            </span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-400">
          Transform your recording instantly with tailored 3D framing, aspect ratios, LUT color grading, and viral layout styling.
        </p>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 overflow-y-auto pr-1">
          {PRO_TEMPLATES.map((tmpl) => (
            <div
              key={tmpl.id}
              onClick={() => handleSelectTemplate(tmpl.id)}
              className="p-4 rounded-2xl bg-dark-950/80 hover:bg-dark-950 border border-slate-800 hover:border-brand-500/50 cursor-pointer transition flex flex-col justify-between space-y-3 group shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-dark-900 border border-slate-800 flex items-center justify-center group-hover:scale-105 transition shadow-inner">
                    {getIcon(tmpl.id)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-brand-300 transition flex items-center space-x-1.5">
                      <span>{tmpl.title}</span>
                    </h4>
                    <span className="text-[10px] text-slate-400">{tmpl.category}</span>
                  </div>
                </div>

                <div 
                  className="w-5 h-5 rounded-full border border-slate-700 shadow-sm"
                  style={{
                    background: `linear-gradient(135deg, ${tmpl.previewColors[0]}, ${tmpl.previewColors[1]})`
                  }}
                />
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                {tmpl.description}
              </p>

              <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
                <span className="text-[10px] font-mono text-slate-400 bg-dark-900 px-2 py-0.5 rounded border border-slate-800">
                  {tmpl.badge}
                </span>
                <span className="text-[11px] font-semibold text-brand-400 group-hover:translate-x-0.5 transition flex items-center space-x-1">
                  <span>Apply</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
