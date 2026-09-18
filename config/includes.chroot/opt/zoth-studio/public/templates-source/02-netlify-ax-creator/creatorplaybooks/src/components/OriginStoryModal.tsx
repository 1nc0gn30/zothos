import { X, ArrowRight } from 'lucide-react';

export function OriginStoryModal({ close }: { close: () => void }) {
  const particles = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div className="origin-backdrop" onClick={close}>
      <div className="origin-modal" onClick={(e) => e.stopPropagation()}>
        {/* Rotating border gradient highlight */}
        <div className="origin-shine" />
        
        {/* Floating particles background */}
        <div className="origin-particles">
          {particles.map((i) => (
            <div 
              key={i} 
              className="origin-particle" 
              style={{ '--i': i } as React.CSSProperties} 
            />
          ))}
        </div>

        <button className="modal-close" onClick={close} title="Close story"><X size={20} /></button>
        
        {/* Banner Section */}
        <div className="origin-banner">
          <div className="origin-logo-ring">
            <img src="/brand_logo.png" alt="CreatorPlaybooks Brand Logo" className="origin-brand-img" />
          </div>
          <div className="origin-title-block">
            <span className="origin-kicker">Origin Story</span>
            <h2 className="origin-title">CreatorPlaybooks started as one question:</h2>
            <div className="origin-credits">
              by <a href="https://x.com/buildwithmaya" target="_blank" rel="noreferrer">@buildwithmaya</a> + <a href="https://x.com/NealFrazierTech" target="_blank" rel="noreferrer">@NealFrazierTech</a>
            </div>
          </div>
        </div>

        {/* Body Section */}
        <div className="origin-body">
          <p className="lead" style={{ marginBottom: '20px' }}>
            Why do some indie hackers grow an audience while others ship silently?
          </p>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '16px' }}>
            We studied builders like <strong>Maya</strong> who ship in public, share playbooks, and turn followers into users. Then we turned those patterns into an agent-ready library of repeatable growth plays.
          </p>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '16px' }}>
            Every creator playbook here is reverse-engineered from real posts and is structured so you can copy their plays, schedule drafts, or drop the playbook JSON directly into your cursor/AI agent.
          </p>
          <div className="highlight-box" style={{ marginTop: '24px', marginBottom: '8px' }}>
            <strong>The formula is simple:</strong> Pick a mentor. Copy their plays. Adapt to your stack. Start shipping.
          </div>
        </div>

        {/* Action Button Section */}
        <div className="origin-actions">
          <button className="btn btn-hot btn-lg origin-cta" onClick={close}>
            <span className="origin-cta-shine" />
            <ArrowRight size={18} /> Get Started — Browse Mentors
          </button>
        </div>
      </div>
    </div>
  );
}
