import {
  Globe2,
  ShieldCheck,
  Lock,
  PlusCircle,
  ExternalLink,
  Sparkles,
  BadgeCheck,
  Clock3,
} from 'lucide-react';

import '../../styles/Client/ClientDashboard.css';
import '../../styles/Client/ClientDomains.css';
import ClientNavbar from '../../components/navbars/ClientNavbar';

export default function ClientDomains() {
  const domains = [
    {
      name: 'mybusiness.com',
      dns: 'Managed by Netlify DNS',
      renews: 'Renews in 11 months',
      status: 'live',
      features: ['SSL', 'Auto renew', 'DNSSEC'],
    },
    {
      name: 'launchpad.dev',
      dns: 'External registrar',
      renews: 'Renews in 35 days',
      status: 'pending',
      features: ['Move DNS', 'Transfer in'],
    },
    {
      name: 'brand-assets.ai',
      dns: 'Managed by Netlify DNS',
      renews: 'Renews in 4 months',
      status: 'live',
      features: ['SSL', 'AI suggestions'],
    },
  ];

  const protections = [
    {
      title: 'DNSSEC & SSL',
      description: 'Verified trust chain with automatic certificate management.',
      icon: ShieldCheck,
    },
    {
      title: 'Transfer lock',
      description: 'Prevent unauthorized transfers and registrar hijacks.',
      icon: Lock,
    },
    {
      title: 'AI watchlist',
      description: 'AI alerts for expiring records, MX drift, or DNS conflicts.',
      icon: Sparkles,
    },
  ];

  return (
    <div className="dashboard-page">
      <ClientNavbar />

      <header className="client-feature-hero">
        <div className="eyebrow">Domain control</div>
        <div className="hero-title">
          <h1>Domains</h1>
          <div className="title-accent" />
        </div>
        <p className="hero-subtitle">
          Own, protect, and optimize the namespaces that power your brand.
        </p>

        <div className="hero-metrics">
          <div className="metric-card">
            <span className="metric-label">Owned domains</span>
            <strong>{domains.length}</strong>
          </div>
          <div className="metric-card">
            <span className="metric-label">Protected</span>
            <strong>2</strong>
          </div>
          <div className="metric-card">
            <span className="metric-label">Expiring soon</span>
            <strong>1</strong>
          </div>
        </div>
      </header>

      <section className="client-section">
        <div className="section-head">
          <h2>Domain portfolio</h2>
          <div className="section-actions">
            <button className="ghost-button">
              <PlusCircle size={16} /> Add domain
            </button>
            <button className="ghost-button">
              <ExternalLink size={16} /> Buy new
            </button>
          </div>
        </div>

        <div className="client-card-grid">
          {domains.map((domain) => (
            <div key={domain.name} className="dashboard-card info-card domain-card">
              <div className="card-top">
                <Globe2 size={22} />
                <span className={`pill ${domain.status === 'live' ? 'live' : 'pending'}`}>
                  {domain.status === 'live' ? 'Live' : 'Action needed'}
                </span>
              </div>

              <h3>{domain.name}</h3>
              <p className="muted">{domain.dns}</p>
              <p className="muted">{domain.renews}</p>

              <div className="tag-row">
                {domain.features.map((item) => (
                  <span key={item} className="tag">{item}</span>
                ))}
              </div>

              <div className="domain-insight">
                <BadgeCheck size={16} />
                Ready for deployment connections
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="client-section">
        <div className="section-head">
          <h2>Protection & reliability</h2>
          <button className="ghost-button">
            <Clock3 size={16} /> Renewal cadence
          </button>
        </div>

        <div className="mini-action-grid">
          {protections.map(({ title, description, icon: Icon }) => (
            <div key={title} className="mini-card protection-card">
              <Icon size={20} />
              <div>
                <h4>{title}</h4>
                <p>{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
