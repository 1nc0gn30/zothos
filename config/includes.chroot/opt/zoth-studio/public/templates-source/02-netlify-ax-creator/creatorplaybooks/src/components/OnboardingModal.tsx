import { X, ArrowRight } from 'lucide-react';
import type { Tab } from '../types';

export function OnboardingModal({ step, setStep, close, setTab }: { step: number; setStep: (n: number) => void; close: () => void; setTab: (t: Tab | 'members') => void }) {
  const steps = [
    { icon: '🔭', title: 'Pick a mentor', body: 'Browse real playbooks from creators who have shipped and grown on X. Study their repeatable strategy, pillars, and angles.', cta: 'Next Step' },
    { icon: '📋', title: 'Copy their plays', body: 'Grab the full markdown playbook, content hooks, or copy a ready-to-paste AI agent prompt trained on their voice.', cta: 'Next Step' },
    { icon: '⚡', title: 'Run your first play', body: 'Log your posts, schedule content, track your streak, and level up your growth health in the dashboard. Consistency wins.', cta: 'Open Dashboard' },
  ];
  const s = steps[step];

  return (
    <div className="modal-backdrop" onClick={close}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={close} title="Skip onboarding"><X size={20} /></button>
        
        {/* Step Indicator Dots */}
        <div className="modal-step">
          {steps.map((_, i) => (
            <span 
              key={i} 
              className={`step-dot ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`} 
            />
          ))}
        </div>

        {/* Icon */}
        <div className="modal-icon">{s.icon}</div>

        {/* Title & Body */}
        <h2>{s.title}</h2>
        <p className="text-muted" style={{ minHeight: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.92rem', margin: '10px 0 20px' }}>
          {s.body}
        </p>

        {/* Actions */}
        <div className="modal-actions" style={{ marginTop: '10px' }}>
          <button 
            className="btn btn-hot btn-lg" 
            onClick={() => { 
              if (step < steps.length - 1) {
                setStep(step + 1); 
              } else { 
                close(); 
                setTab('dashboard'); 
              } 
            }}
          >
            {s.cta} <ArrowRight size={18} />
          </button>
        </div>

        {/* Footer */}
        <div className="modal-footer" style={{ borderTop: 'none', paddingTop: 0 }}>
          <button className="btn-link" onClick={close}>Skip and browse</button>
        </div>
      </div>
    </div>
  );
}
