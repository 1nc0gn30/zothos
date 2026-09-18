import {
  Settings,
  ShieldCheck,
  CreditCard,
  Bell,
  Globe2,
  Mail,
  Smartphone,
} from 'lucide-react';

import '../../styles/Client/ClientDashboard.css';
import '../../styles/Client/ClientSettings.css';
import ClientNavbar from '../../components/navbars/ClientNavbar';

export default function ClientSettings() {
  const controls = [
    { title: 'Account', description: 'Profile, password, and security keys.' },
    { title: 'Billing', description: 'Plans, invoices, and payment methods.' },
    { title: 'Brand', description: 'Logos, favicons, and theme preferences.' },
    { title: 'Notifications', description: 'Email, SMS, and channel routing.' },
  ];

  const audits = [
    { title: 'Audit log', detail: 'Updated 4 mins ago' },
    { title: 'Security review', detail: 'Last monthly check complete' },
  ];

  const preferences = [
    { title: 'Status alerts', description: 'Incident and deploy health summaries.' },
    { title: 'Compliance exports', description: 'Automated backups and policies.' },
    { title: 'Regional routing', description: 'Preferred edges for traffic and CDN.' },
  ];

  return (
    <div className="dashboard-page">
      <ClientNavbar />

      <header className="client-feature-hero">
        <div className="eyebrow">Control center</div>
        <div className="hero-title">
          <h1>Settings</h1>
          <div className="title-accent" />
        </div>
        <p className="hero-subtitle">
          Configure account guardrails, notifications, and preferences across every workspace.
        </p>

        <div className="hero-metrics">
          <div className="metric-card">
            <span className="metric-label">Security score</span>
            <strong>98</strong>
          </div>
          <div className="metric-card">
            <span className="metric-label">Audit trails</span>
            <strong>24 events</strong>
          </div>
          <div className="metric-card">
            <span className="metric-label">Notifications</span>
            <strong>6 channels</strong>
          </div>
        </div>
      </header>

      <section className="client-section">
        <div className="section-head">
          <h2>Controls</h2>
        </div>

        <div className="settings-grid">
          {controls.map(({ title, description }) => (
            <div key={title} className="dashboard-card info-card settings-card">
              <div className="card-top">
                <Settings size={20} />
                <span className="pill live">Synced</span>
              </div>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="client-section">
        <div className="section-head">
          <h2>Security</h2>
        </div>

        <div className="mini-action-grid">
          <div className="mini-card">
            <ShieldCheck size={18} />
            <div>
              <strong>Multi-factor</strong>
              <p className="muted">Hardware keys and mobile prompts required.</p>
            </div>
          </div>
          <div className="mini-card">
            <Globe2 size={18} />
            <div>
              <strong>Allowed regions</strong>
              <p className="muted">Restrict access by geography and network.</p>
            </div>
          </div>
          <div className="mini-card">
            <CreditCard size={18} />
            <div>
              <strong>Billing controls</strong>
              <p className="muted">Spending limits, approvals, and receipts.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="client-section">
        <div className="section-head">
          <h2>Alerts & preferences</h2>
        </div>

        <div className="dual-layout">
          <div className="preference-list">
            {preferences.map(({ title, description }) => (
              <div key={title} className="preference-item">
                <Bell size={16} />
                <div>
                  <strong>{title}</strong>
                  <p className="muted">{description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="settings-grid">
            {audits.map(({ title, detail }) => (
              <div key={title} className="audit-card">
                <div>
                  <strong>{title}</strong>
                  <small>{detail}</small>
                </div>
                <Mail size={16} />
              </div>
            ))}

            <div className="audit-card">
              <div>
                <strong>Mobile confirmations</strong>
                <small>Escalate changes for device approval</small>
              </div>
              <Smartphone size={16} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
