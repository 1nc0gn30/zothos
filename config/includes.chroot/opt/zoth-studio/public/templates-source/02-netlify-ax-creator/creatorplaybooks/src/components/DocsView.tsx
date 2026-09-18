import { useState } from 'react';
import type { CreatorProfile } from '../types';
import { Copy, Check, Terminal, ExternalLink, Rocket, Bot, Code2 } from 'lucide-react';

const CANONICAL_URL = 'https://creatorplaybooks.netlify.app';

export function DocsView({ activeCreator }: { activeCreator: CreatorProfile }) {
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  const endpoints = [
    { method: 'GET', path: '/api/creators', desc: 'All creators with full playbooks' },
    { method: 'GET', path: '/api/creator?id=' + activeCreator.id, desc: 'Single creator playbook JSON' },
    { method: 'GET', path: '/api/playbook?creator=' + activeCreator.id, desc: 'Markdown playbook export' },
    { method: 'GET', path: '/api/ideas?creator=' + activeCreator.id + '&count=6', desc: 'AI-generated content ideas' },
    { method: 'GET', path: '/api/export?creator=' + activeCreator.id, desc: 'Agent-ready JSON bundle' },
  ];

  const handleCopy = (fullUrl: string, path: string) => {
    navigator.clipboard.writeText(fullUrl);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  return (
    <div className="page docs-page">
      <div className="docs-header">
        <div className="docs-header-badge">
          <Code2 size={12} />
          API Reference
        </div>
        <h2 className="page-title">Docs & API</h2>
        <p className="page-subtitle">Every creator playbook is fully exposed as structured JSON for AI agents, Cursor prompts, or custom automation workflows.</p>
      </div>

      <div className="docs-overview-grid">
        <div className="docs-overview-card shippers">
          <div className="docs-overview-card-icon">
            <span><Rocket size={20} style={{ color: 'var(--primary)' }} /></span>
            <h3 style={{ color: 'var(--primary)' }}>For Shippers</h3>
          </div>
          <p>
            Study verified growth plays from top creators. Keep consistent by drafting your weekly posts in the scheduler, track your daily streak, and level up your creator rank as you log your progress!
          </p>
        </div>

        <div className="docs-overview-card builders">
          <div className="docs-overview-card-icon">
            <span><Bot size={20} style={{ color: 'var(--accent)' }} /></span>
            <h3 style={{ color: 'var(--accent)' }}>For Builders</h3>
          </div>
          <p>
            Integrate playbook knowledge directly into your local IDE or AI agents. Copy pre-built agent prompts, download complete config folders, or fetch playbooks programmatically from our endpoints.
          </p>
        </div>
      </div>

      <div className="docs-base-banner">
        <div className="docs-base-banner-inner">
          <Terminal size={18} style={{ color: 'var(--accent)' }} />
          <span style={{ fontSize: '0.88rem', color: 'var(--muted)', fontWeight: 600 }}>API Base URL:</span>
          <code>{CANONICAL_URL}</code>
        </div>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => handleCopy(CANONICAL_URL, 'base')}
          style={{ padding: '7px 14px', fontSize: '0.8rem', borderRadius: '10px' }}
        >
          {copiedPath === 'base' ? <><Check size={12} style={{ color: 'var(--success)' }} /> Copied</> : <><Copy size={12} /> Copy Base</>}
        </button>
      </div>

      <div className="docs-grid">
        {endpoints.map((ep) => {
          const fullUrl = `${CANONICAL_URL}${ep.path}`;
          const isCopied = copiedPath === ep.path;
          return (
            <div key={ep.path} className="docs-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                <span className="docs-method">{ep.method}</span>
                <div className="docs-card-actions">
                  <button
                    onClick={() => handleCopy(fullUrl, ep.path)}
                    className="docs-card-action"
                    title="Copy full endpoint URL"
                  >
                    {isCopied ? <Check size={14} style={{ color: 'var(--success)' }} /> : <Copy size={14} />}
                  </button>
                  <a
                    href={fullUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="docs-card-action"
                    title="Open API endpoint"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <code className="docs-card-code">{ep.path}</code>
                <p className="docs-card-desc">{ep.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}