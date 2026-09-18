import type { BuilderProfile } from '../types';
import { User, Target, Link2, FileText, Eye, Accessibility, Palette } from 'lucide-react';

export function MeView({ profile, setProfile }: { profile: BuilderProfile; setProfile: (p: BuilderProfile) => void }) {
  const initials = profile.name ? profile.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase() : 'B';

  return (
    <div className="page me-page">
      <div className="me-header">
        <div className="me-header-badge">
          <Palette size={12} />
          Builder Profile
        </div>
        <h2 className="page-title">Who you are, what you ship</h2>
        <p className="page-subtitle">Edit your details, customize accessibility, and see your live preview card update in real time.</p>
      </div>

      <div className="me-grid-layout">
        <div className="me-left-col">
          {/* Form Card */}
          <div className="me-card me-form-card">
            <h3>
              <User size={18} style={{ color: 'var(--secondary)' }} />
              Edit Details
            </h3>
            <div className="me-form">
              <div className="me-form-row">
                <div className="me-field">
                  <label>Name</label>
                  <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                </div>
                <div className="me-field">
                  <label>Handle</label>
                  <input value={profile.handle} onChange={(e) => setProfile({ ...profile, handle: e.target.value })} placeholder="@handle" />
                </div>
              </div>
              <div className="me-form-row">
                <div className="me-field">
                  <label>
                    <Target size={11} style={{ display: 'inline', marginRight: '4px' }} />
                    Project Name
                  </label>
                  <input value={profile.project} onChange={(e) => setProfile({ ...profile, project: e.target.value })} />
                </div>
                <div className="me-field">
                  <label>
                    <Link2 size={11} style={{ display: 'inline', marginRight: '4px' }} />
                    URL
                  </label>
                  <input value={profile.url} onChange={(e) => setProfile({ ...profile, url: e.target.value })} placeholder="https://" />
                </div>
              </div>
              <div className="me-field">
                <label>
                  <FileText size={11} style={{ display: 'inline', marginRight: '4px' }} />
                  Bio
                </label>
                <textarea value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} rows={3} />
              </div>
              <div className="me-field">
                <label>Goal</label>
                <textarea value={profile.goal} onChange={(e) => setProfile({ ...profile, goal: e.target.value })} rows={2} />
              </div>
            </div>
          </div>

          {/* Accessibility Settings Card */}
          <div className="me-card me-acc-card">
            <h3>
              <Accessibility size={18} style={{ color: 'var(--secondary)' }} />
              Accessibility Preferences
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <label className="me-acc-toggle">
                <input
                  type="checkbox"
                  className="me-acc-toggle-checkbox"
                  checked={!!profile.accessibilityPreferences?.largeText}
                  onChange={(e) => setProfile({
                    ...profile,
                    accessibilityPreferences: {
                      ...profile.accessibilityPreferences,
                      largeText: e.target.checked
                    }
                  })}
                />
                <div className="me-acc-toggle-info">
                  <strong>Large Typography</strong>
                  <span>Increase default typography sizes for readability</span>
                </div>
              </label>

              <label className="me-acc-toggle">
                <input
                  type="checkbox"
                  className="me-acc-toggle-checkbox"
                  checked={!!profile.accessibilityPreferences?.highContrast}
                  onChange={(e) => setProfile({
                    ...profile,
                    accessibilityPreferences: {
                      ...profile.accessibilityPreferences,
                      highContrast: e.target.checked
                    }
                  })}
                />
                <div className="me-acc-toggle-info">
                  <strong>High Contrast Highlights</strong>
                  <span>Emphasize paragraphs and sections with clean contrast highlights</span>
                </div>
              </label>

              <label className="me-acc-toggle">
                <input
                  type="checkbox"
                  className="me-acc-toggle-checkbox"
                  checked={!!profile.accessibilityPreferences?.reducedMotion}
                  onChange={(e) => setProfile({
                    ...profile,
                    accessibilityPreferences: {
                      ...profile.accessibilityPreferences,
                      reducedMotion: e.target.checked
                    }
                  })}
                />
                <div className="me-acc-toggle-info">
                  <strong>Reduced Motion</strong>
                  <span>Disable keyframe animation glows and dynamic visual drifts</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Side: Preview Card */}
        <div className="me-card me-preview-card">
          <div className="me-preview-label">
            <Eye size={11} />
            Live Preview
          </div>
          <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Your Card</h3>
          <div className="creator-card-clean" style={{ cursor: 'default', pointerEvents: 'none', background: 'rgba(18, 18, 26, 0.7)', '--card-primary': 'var(--primary)', '--card-accent': 'var(--accent)' } as React.CSSProperties}>
            <div className="creator-card-clean-banner" style={{ height: '80px', background: 'linear-gradient(135deg, var(--primary) 40%, var(--accent) 40%)' }} />
            <div className="creator-card-clean-avatar avatar-fallback" style={{ top: '42px', width: '64px', height: '64px', fontSize: '1.1rem', background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}>
              {initials}
            </div>
            <div className="creator-card-clean-body" style={{ padding: '36px 20px 20px' }}>
              <div className="creator-card-clean-top" style={{ marginBottom: '8px' }}>
                <div className="creator-card-clean-title">
                  <h3 className="creator-card-clean-name" style={{ fontSize: '1.1rem' }}>{profile.name || 'Your name'}</h3>
                  <span className="creator-card-clean-handle">{profile.handle || '@handle'}</span>
                </div>
                <span className="status-badge" style={{ background: 'rgba(236,72,153,0.12)', border: '1px solid rgba(236,72,153,0.2)', color: 'var(--primary)', textTransform: 'uppercase', fontSize: '0.65rem', padding: '3px 8px', borderRadius: '99px', fontWeight: 700 }}>Builder</span>
              </div>
              <p className="creator-card-clean-bio" style={{ fontSize: '0.84rem', margin: '0 0 12px' }}>{profile.bio || 'Your bio will appear here. Share what you build!'}</p>
              {profile.project && (
                <div className="tag-chip" style={{ background: 'rgba(34, 211, 238, 0.1)', borderColor: 'rgba(34, 211, 238, 0.2)', color: 'var(--accent)', fontSize: '0.7rem', padding: '4px 10px', borderRadius: '99px', display: 'inline-block', marginBottom: '14px', fontWeight: 600 }}>
                  Shipping {profile.project}
                </div>
              )}
              <div className="creator-card-clean-stats" style={{ display: 'flex', gap: '16px', fontSize: '0.78rem', color: 'var(--muted)', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
                <span><strong>{profile.streak}</strong> streak</span>
                <span><strong>{profile.xp}</strong> XP</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}