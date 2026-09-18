import {
  Workflow,
  Bot,
  ShieldCheck,
  Gauge,
  Rocket,
  Plug,
} from 'lucide-react';

import '../../styles/Client/ClientDashboard.css';
import '../../styles/Client/ClientTools.css';
import ClientNavbar from '../../components/navbars/ClientNavbar';

export default function ClientTools() {
  const automations = [
    {
      title: 'Deploy pipeline',
      description: 'Preview deploys, approvals, and performance gates.',
      tags: ['CI/CD', 'Performance'],
    },
    {
      title: 'Workflow automation',
      description: 'Trigger builds from CMS or marketing updates automatically.',
      tags: ['Webhooks', 'CMS'],
    },
    {
      title: 'AI fixes',
      description: 'Ship AI-curated improvements with human review.',
      tags: ['AI', 'Accessibility'],
    },
  ];

  const integrations = [
    { name: 'GitHub', detail: 'Connected repos', icon: Plug },
    { name: 'Slack', detail: 'Incident channel', icon: Plug },
    { name: 'Figma', detail: 'Design tokens sync', icon: Plug },
    { name: 'Analytics', detail: 'Traffic dashboards', icon: Plug },
  ];

  return (
    <div className="dashboard-page">
      <ClientNavbar />

      <header className="client-feature-hero">
        <div className="eyebrow">Automation & tooling</div>
        <div className="hero-title">
          <h1>Tools</h1>
          <div className="title-accent" />
        </div>
        <p className="hero-subtitle">
          Automate repetitive tasks, connect your stack, and ship faster with guardrails.
        </p>

        <div className="hero-metrics">
          <div className="metric-card">
            <span className="metric-label">Active automations</span>
            <strong>7</strong>
          </div>
          <div className="metric-card">
            <span className="metric-label">AI suggestions</span>
            <strong>5</strong>
          </div>
          <div className="metric-card">
            <span className="metric-label">Integrations</span>
            <strong>{integrations.length}</strong>
          </div>
        </div>
      </header>

      <section className="client-section">
        <div className="section-head">
          <h2>Automation kits</h2>
          <button className="ghost-button">
            <Gauge size={16} /> View run history
          </button>
        </div>

        <div className="client-card-grid">
          {automations.map(({ title, description, tags }) => (
            <div key={title} className="dashboard-card info-card tool-card">
              <div className="card-top">
                <Workflow size={20} />
                <span className="pill live">Ready</span>
              </div>
              <h3>{title}</h3>
              <p>{description}</p>
              <div className="tag-row">
                {tags.map((tag) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="client-section">
        <div className="section-head">
          <h2>Integrations</h2>
        </div>

        <div className="integration-list">
          {integrations.map(({ name, detail, icon: Icon }) => (
            <div key={name} className="integration-card">
              <Icon size={18} />
              <div>
                <strong>{name}</strong>
                <small>{detail}</small>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="client-section">
        <div className="section-head">
          <h2>Safety nets</h2>
        </div>

        <div className="mini-action-grid">
          <div className="mini-card">
            <ShieldCheck size={18} />
            <div>
              <strong>Access controls</strong>
              <p className="muted">Role-based deployments with approvals.</p>
            </div>
          </div>
          <div className="mini-card">
            <Bot size={18} />
            <div>
              <strong>AI guardrails</strong>
              <p className="muted">Automatic code scanning and fixes.</p>
            </div>
          </div>
          <div className="mini-card">
            <Rocket size={18} />
            <div>
              <strong>Rollback</strong>
              <p className="muted">Instantly revert to last healthy release.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
