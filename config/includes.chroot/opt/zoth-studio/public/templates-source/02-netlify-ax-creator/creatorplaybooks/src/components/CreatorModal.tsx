import { useState } from 'react';
import { X, Copy, Check, Bot, FolderOpen, Share2, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import type { CreatorProfile } from '../types';
import { useXProfile, formatNumber } from '../lib/xData';

export function CreatorModal({ creator, onClose, onCopyPlaybook, onCopyAgent, onInstallAgent }: { creator: CreatorProfile; onClose: () => void; onCopyPlaybook: () => void; onCopyAgent: () => void; onInstallAgent: () => void }) {
  const xUrl = `https://x.com/${creator.handle.replace('@', '')}`;
  const initials = creator.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
  
  // State
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [expandedPlayId, setExpandedPlayId] = useState<string | null>(creator.plays[0]?.id || null);
  const [swipeTab, setSwipeTab] = useState<'hooks' | 'angles'>('hooks');
  const [apiSnippetTab, setApiSnippetTab] = useState<'js' | 'curl' | 'curl-select'>('js');
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);

  // Live X data
  const { profile: xProfile, loading: xLoading } = useXProfile(creator.xHandle, true);

  // Use live avatar/banner when available
  const liveAvatar = xProfile?.avatar || creator.avatar;
  const liveBanner = xProfile?.banner || creator.banner;
  const liveFollowers = xProfile?.followers ? formatNumber(xProfile.followers) : creator.followersStr;

  const triggerCopy = (fn: () => void, key: string) => {
    fn();
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const apiFetchSnippet = `// Fetch ${creator.name}'s complete playbook bundle
fetch('https://creatorplaybooks.netlify.app/api/creator?id=${creator.id}&expand=all')
  .then(res => res.json())
  .then(({ profile, category, playbook, hooks, angles, theme, tags, resources }) => {
    console.log('\u2705', profile.name, '—', profile.followersStr, 'followers');
    console.log('Category:', category);
    console.log('Theme colors:', theme);
    console.log('Tags:', tags);
    console.log('Repeatable plays:', (playbook?.plays || []).map(p => p.title));
    console.log('Hook templates:', hooks);
    console.log('Writing angles:', angles);
    console.log('Products:', profile.products.map(p => p.name));
    console.log('Media assets:', profile.media.length);
    console.log('Recent tweets:', profile.recentTweets.length);
    console.log('Resources:', resources);
  });`;

  const apiCurlSnippet = `# Get ${creator.name}'s full mentor bundle
# Includes profile, plays, hooks, angles, theme, tags, media, and related endpoints
curl -s 'https://creatorplaybooks.netlify.app/api/creator?id=${creator.id}&expand=all' \
  -H 'Accept: application/json' | jq '.'`;

  const apiCurlSelectSnippet = `# Select only the fields you need
curl -s 'https://creatorplaybooks.netlify.app/api/creator?id=${creator.id}&expand=plays,hooks,angles' \
  -H 'Accept: application/json' | jq '{ name: .profile.name, plays: .playbook.plays, hooks: .hooks, angles: .angles }'`;

  return (
    <div 
      className="modal-backdrop creator-modal-backdrop" 
      onClick={onClose}
      style={{
        '--primary': creator.theme.primary,
        '--secondary': creator.theme.secondary,
        '--accent': creator.theme.accent,
      } as React.CSSProperties}
    >
      <div className="creator-modal" onClick={(e) => e.stopPropagation()} style={{ borderColor: 'rgba(var(--primary), 0.2)' }}>
        <button className="modal-close" onClick={onClose} title="Close modal"><X size={20} /></button>
        
        {/* Banner Section */}
        <div 
          className="creator-modal-hero" 
          style={{ 
            backgroundImage: liveBanner ? `url(${liveBanner})` : `linear-gradient(135deg, ${creator.theme.primary}40, ${creator.theme.accent}40)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundColor: creator.theme.primary + '20'
          }}
        >
          {/* Avatar Rendering */}
          {imgError || !liveAvatar ? (
            <div className="creator-modal-avatar" style={{ display: 'grid', placeItems: 'center', background: `linear-gradient(135deg, ${creator.theme.primary}, ${creator.theme.accent})`, color: '#fff', fontSize: '2.2rem', fontWeight: 800 }}>
              {initials}
            </div>
          ) : (
            <img 
              src={liveAvatar} 
              alt={creator.name} 
              className="creator-modal-avatar" 
              onError={() => setImgError(true)} 
            />
          )}

          <div className="creator-modal-hero-info">
            <div className="creator-modal-name-row">
              <h2 style={{ color: '#fff', textShadow: '0 2px 16px rgba(0,0,0,0.85)' }}>{creator.name}</h2>
              <span className={`status-badge status-${creator.status}`}>{creator.status}</span>
              {xProfile?.verified && <span className="badge" style={{ background: '#1da1f222', color: '#1da1f2', border: '1px solid #1da1f244' }}>✓ Verified</span>}
            </div>
            <span className="creator-modal-handle" style={{ textShadow: '0 1px 10px rgba(0,0,0,0.8)', fontWeight: 700 }}>{creator.handle}</span>
            {xLoading && <span className="badge" style={{ marginLeft: '8px', fontSize: '0.7rem', background: '#ffffff15', color: '#aaa' }}>⟳ X live sync...</span>}
          </div>
        </div>

        <div className="creator-modal-body">
          {/* Bio */}
          <p className="creator-modal-bio">{xProfile?.bio || creator.bio}</p>

          {/* Pillars */}
          <div className="creator-modal-tags" style={{ marginBottom: '24px' }}>
            {creator.pillars.slice(0, 4).map((p, i) => (
              <span key={i} className="badge badge-accent" style={{ background: `${creator.theme.primary}15`, color: creator.theme.primary, borderColor: `${creator.theme.primary}30` }}>
                {p.split(' — ')[0]}
              </span>
            ))}
          </div>

          {/* Stats Grid */}
          <div className="creator-modal-stats">
            <div className="stat">
              <span className="value" style={{ color: creator.theme.primary }}>{liveFollowers}</span>
              <span className="label">Followers{xLoading && ' ⟳'}</span>
            </div>
            <div className="stat">
              <span className="value" style={{ color: creator.theme.secondary }}>{creator.products.length}</span>
              <span className="label">Products</span>
            </div>
            <div className="stat">
              <span className="value" style={{ color: creator.theme.accent }}>{creator.plays.length}</span>
              <span className="label">Repeatable Plays</span>
            </div>
          </div>

          {/* Milestones Sub-stats */}
          {creator.milestones && creator.milestones.length > 0 && (
            <div className="creator-modal-section">
              <h6 style={{ marginBottom: '12px' }}>Key Milestones</h6>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' }}>
                {creator.milestones.map((m, i) => (
                  <div key={i} style={{ background: 'var(--surface-3)', padding: '12px 16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>{m.label}</span>
                    <strong style={{ fontSize: '1.05rem', color: 'var(--ink)', letterSpacing: '-0.01em' }}>{m.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Products */}
          <div className="creator-modal-section">
            <div className="creator-modal-section-header">
              <h3>Products</h3>
              <span className="creator-modal-section-sub">Ships and shows from this mentor</span>
            </div>
            <div className="creator-modal-products" style={{ display: 'grid', gap: '12px', marginTop: '12px' }}>
              {creator.products.map((p) => (
                <a key={p.name} href={p.url} target="_blank" rel="noreferrer" className="creator-modal-product" style={{ transition: 'all 0.2s', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <span className="creator-modal-product-name">{p.name}</span>
                  <span className="creator-modal-product-desc" style={{ flex: 1, paddingRight: '12px' }}>{p.description}</span>
                  <ExternalLink size={14} style={{ color: creator.theme.accent }} />
                </a>
              ))}
            </div>
          </div>

          {/* Interactive Plays Accordion */}
          <div className="creator-modal-section">
            <div className="creator-modal-section-header">
              <h3>Repeatable plays</h3>
              <span className="creator-modal-section-sub">Proven formats you can reuse</span>
            </div>
            <div className="creator-modal-plays" style={{ marginTop: '12px' }}>
              {creator.plays.map((p) => {
                const isExpanded = expandedPlayId === p.id;
                return (
                  <div 
                    key={p.id} 
                    className={`creator-modal-play ${isExpanded ? 'expanded' : ''}`} 
                    onClick={() => setExpandedPlayId(isExpanded ? null : p.id)}
                    style={{ borderColor: isExpanded ? creator.theme.primary : undefined }}
                  >
                    <div className="creator-modal-play-header">
                      <span className="play-emoji">{p.emoji}</span>
                      <strong className="h4" style={{ flex: 1, letterSpacing: '-0.01em' }}>{p.title}</strong>
                      <span className="play-frequency" style={{ color: creator.theme.accent, background: `${creator.theme.accent}15` }}>{p.frequency}</span>
                      {isExpanded ? <ChevronUp size={16} style={{ color: 'var(--muted)' }} /> : <ChevronDown size={16} style={{ color: 'var(--muted)' }} />}
                    </div>
                    {isExpanded && (
                      <div className="creator-modal-play-body" style={{ animation: 'fadeIn 0.25s ease' }}>
                        <p style={{ color: 'var(--ink-muted)', fontSize: '0.94rem', lineHeight: 1.65 }}>{p.description}</p>
                        <div className="play-action-box" style={{ borderLeftColor: creator.theme.primary }}>
                          <span style={{ fontSize: '0.74rem', color: creator.theme.primary, textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '5px', letterSpacing: '0.06em' }}>Daily Action Challenge</span>
                          <span className="play-action" style={{ color: 'var(--ink)', fontWeight: 550, fontSize: '0.94rem' }}>{p.action}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Swipe File: Hook Book & Angles */}
          <div className="creator-modal-section">
            <div className="creator-modal-section-header">
              <h3>Swipe File</h3>
              <span className="creator-modal-section-sub">Click rows to copy directly</span>
            </div>
            <div className="api-tab-bar" style={{ marginTop: '12px' }}>
              <button 
                className={`api-tab ${swipeTab === 'hooks' ? 'active' : ''}`} 
                onClick={() => setSwipeTab('hooks')}
                style={{ background: swipeTab === 'hooks' ? creator.theme.primary : undefined }}
              >
                Hook Book ({creator.hooks.length})
              </button>
              <button 
                className={`api-tab ${swipeTab === 'angles' ? 'active' : ''}`} 
                onClick={() => setSwipeTab('angles')}
                style={{ background: swipeTab === 'angles' ? creator.theme.primary : undefined }}
              >
                Writing Angles ({creator.angles.length})
              </button>
            </div>
            <div className="creator-modal-api swipe-file-panel" style={{ padding: '14px', background: 'var(--surface-2)', border: '1px solid rgba(255,255,255,0.05)' }}>
              {swipeTab === 'hooks' ? (
                <div style={{ display: 'grid', gap: '8px' }}>
                  {creator.hooks.map((hook, i) => (
                    <div 
                      key={i} 
                      className="api-endpoint-row swipe-row" 
                      style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '14px' }}
                      onClick={() => copyText(hook, `hook-${i}`)}
                      title="Click to copy hook example"
                    >
                      <span style={{ fontSize: '0.94rem', color: 'var(--ink-muted)', wordBreak: 'break-word', textAlign: 'left', lineHeight: 1.45 }}>"{hook}"</span>
                      <span className="badge" style={{ color: copiedKey === `hook-${i}` ? 'var(--success)' : undefined, borderColor: copiedKey === `hook-${i}` ? 'var(--success)' : undefined, fontSize: '0.72rem', flexShrink: 0 }}>
                        {copiedKey === `hook-${i}` ? 'Copied!' : 'Copy'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '8px' }}>
                  {creator.angles.map((angle, i) => (
                    <div 
                      key={i} 
                      className="api-endpoint-row swipe-row" 
                      style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '14px' }}
                      onClick={() => copyText(angle, `angle-${i}`)}
                      title="Click to copy angle strategy"
                    >
                      <span style={{ fontSize: '0.94rem', color: 'var(--ink-muted)', wordBreak: 'break-word', textAlign: 'left', lineHeight: 1.45 }}>{angle}</span>
                      <span className="badge" style={{ color: copiedKey === `angle-${i}` ? 'var(--success)' : undefined, borderColor: copiedKey === `angle-${i}` ? 'var(--success)' : undefined, fontSize: '0.72rem', flexShrink: 0 }}>
                        {copiedKey === `angle-${i}` ? 'Copied!' : 'Copy'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Live X Tweets */}
          {xProfile?.tweets && xProfile.tweets.length > 0 && (
            <div className="creator-modal-section">
              <div className="creator-modal-section-header">
                <h3>Latest Posts</h3>
                <span className="creator-modal-section-sub">Live from X (10 most recent)</span>
              </div>
              <div style={{ display: 'grid', gap: '12px' }}>
                {xProfile.tweets.slice(0, 5).map((t) => (
                  <a
                    key={t.id}
                    href={`https://x.com/${creator.xHandle}/status/${t.id}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'block',
                      padding: '14px 16px',
                      borderRadius: '14px',
                      background: 'var(--surface-3)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      textDecoration: 'none',
                      color: 'inherit',
                      transition: 'all 0.2s',
                    }}
                    className="hover-zoom"
                  >
                    <p style={{ fontSize: '0.92rem', lineHeight: 1.55, color: 'var(--ink-muted)', marginBottom: '10px' }}>{t.text}</p>
                    {t.media.length > 0 && (
                      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(t.media.length, 2)}, 1fr)`, gap: '8px', marginBottom: '10px' }}>
                        {t.media.map((m, mi) => (
                          <img key={mi} src={m.url} alt="" style={{ width: '100%', borderRadius: '10px', objectFit: 'cover', aspectRatio: '16/10' }} />
                        ))}
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '14px', fontSize: '0.78rem', color: 'var(--muted)' }}>
                      {t.metrics.impression_count != null && <span>👁 {t.metrics.impression_count.toLocaleString()}</span>}
                      {t.metrics.like_count != null && <span>♥ {t.metrics.like_count.toLocaleString()}</span>}
                      {t.metrics.retweet_count != null && <span>🔄 {t.metrics.retweet_count.toLocaleString()}</span>}
                      <span style={{ marginLeft: 'auto' }}>{new Date(t.createdAt).toLocaleDateString()}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Proof of Work: Media Manifest Images */}
          {creator.media && creator.media.length > 0 && (
            <div className="creator-modal-section">
              <div className="creator-modal-section-header">
                <h3>Proof of Work</h3>
                <span className="creator-modal-section-sub">Tap an artifact to inspect</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '14px' }}>
                {creator.media.map((imgUrl, i) => (
                  <div 
                    key={i} 
                    className="hover-zoom proof-tile"
                    style={{ 
                      borderRadius: '14px', 
                      overflow: 'hidden', 
                      border: '1px solid rgba(255,255,255,0.07)', 
                      cursor: 'pointer', 
                      aspectRatio: '16/10',
                      background: 'var(--surface-3)',
                      boxShadow: '0 8px 18px rgba(0,0,0,0.25)'
                    }}
                    onClick={() => setLightboxImg(imgUrl)}
                  >
                    <img 
                      src={imgUrl} 
                      alt={`${creator.name} Proof of Work ${i + 1}`} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Developer API Reference Tab */}
          <div className="creator-modal-section">
            <div className="creator-modal-section-header">
              <h3>Developer API Playbook</h3>
              <span className="creator-modal-section-sub">Connect agents and datasets</span>
            </div>
            <div className="api-tab-bar" style={{ marginTop: '12px' }}>
              <button 
                className={`api-tab ${apiSnippetTab === 'js' ? 'active' : ''}`} 
                onClick={() => setApiSnippetTab('js')}
                style={{ background: apiSnippetTab === 'js' ? creator.theme.secondary : undefined }}
              >
                JavaScript Fetch
              </button>
              <button 
                className={`api-tab ${apiSnippetTab === 'curl' ? 'active' : ''}`} 
                onClick={() => setApiSnippetTab('curl')}
                style={{ background: apiSnippetTab === 'curl' ? creator.theme.secondary : undefined }}
              >
                cURL Full Bundle
              </button>
              <button 
                className={`api-tab ${apiSnippetTab === 'curl-select' ? 'active' : ''}`} 
                onClick={() => setApiSnippetTab('curl-select')}
                style={{ background: apiSnippetTab === 'curl-select' ? creator.theme.secondary : undefined }}
              >
                cURL Select Fields
              </button>
            </div>
            <div style={{ position: 'relative', borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 14px 34px rgba(0,0,0,0.45)' }}>
              <pre className="code-block api-code-block" style={{ fontSize: '0.82rem', background: 'var(--surface-3)', paddingRight: '100px', overflowX: 'auto' }}>
                <code>{apiSnippetTab === 'js' ? apiFetchSnippet : apiSnippetTab === 'curl' ? apiCurlSnippet : apiCurlSelectSnippet}</code>
              </pre>
              <button 
                className="badge badge-accent api-copy-btn" 
                style={{ position: 'absolute', top: '12px', right: '12px', cursor: 'pointer', fontSize: '0.74rem', boxShadow: '0 10px 22px rgba(0,0,0,0.45)' }}
                onClick={() => copyText(apiSnippetTab === 'js' ? apiFetchSnippet : apiSnippetTab === 'curl' ? apiCurlSnippet : apiCurlSelectSnippet, 'api-code')}
              >
                {copiedKey === 'api-code' ? 'Copied!' : 'Copy Code'}
              </button>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="creator-modal-actions">
            <button className="btn btn-hot" onClick={() => triggerCopy(onCopyPlaybook, 'playbook')} style={{ background: creator.theme.primary }}>
              {copiedKey === 'playbook' ? <Check size={14} /> : <Copy size={14} />} 
              {copiedKey === 'playbook' ? 'Copied!' : 'Copy Playbook MD'}
            </button>
            <button className="btn btn-secondary" onClick={() => triggerCopy(onCopyAgent, 'agent')}>
              {copiedKey === 'agent' ? <Check size={14} style={{ color: 'var(--success)' }} /> : <Bot size={14} style={{ color: creator.theme.accent }} />} 
              {copiedKey === 'agent' ? 'Copied!' : 'Copy Agent Prompt'}
            </button>
            <button className="btn btn-secondary" onClick={() => triggerCopy(onInstallAgent, 'install')}>
              {copiedKey === 'install' ? <Check size={14} style={{ color: 'var(--success)' }} /> : <FolderOpen size={14} style={{ color: creator.theme.secondary }} />} 
              {copiedKey === 'install' ? 'Downloaded!' : 'Agent Kit (.zip)'}
            </button>
            <a href={xUrl} target="_blank" rel="noreferrer" className="btn btn-secondary x-action">
              <Share2 size={14} style={{ color: '#1da1f2' }} /> 
              Follow on X
            </a>
          </div>
        </div>
      </div>

      {/* Fullscreen Lightbox Overlay */}
      {lightboxImg && (
        <div className="lightbox-backdrop" onClick={() => setLightboxImg(null)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setLightboxImg(null)} title="Close image"><X size={20} /></button>
            <img src={lightboxImg} alt="Enlarged Proof of Work" className="lightbox-img" />
          </div>
        </div>
      )}
    </div>
  );
}
