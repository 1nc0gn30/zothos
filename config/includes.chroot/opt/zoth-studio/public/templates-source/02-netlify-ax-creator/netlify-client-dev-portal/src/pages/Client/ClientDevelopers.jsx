import {
  Code2,
  Users,
  ShieldCheck,
  Sparkles,
  Handshake,
  MessageSquare,
  UserPlus,
} from 'lucide-react';

import '../../styles/Client/ClientDashboard.css';
import '../../styles/Client/ClientDevelopers.css';
import ClientNavbar from '../../components/navbars/ClientNavbar';

export default function ClientDevelopers() {
  const team = [
    { name: 'Avery', role: 'Lead Engineer', focus: 'Frontend & DX', status: 'Owner' },
    { name: 'Jordan', role: 'Platform', focus: 'Infrastructure', status: 'Admin' },
    { name: 'Casey', role: 'AI Dev', focus: 'GenAI features', status: 'Contributor' },
    { name: 'Riley', role: 'Contractor', focus: 'Landing pages', status: 'Pending invite' },
  ];

  const spaces = [
    { title: 'Dev collaboration', detail: 'Pull requests, deploy previews, and comments.' },
    { title: 'Product feedback', detail: 'Share updates to marketing & ops instantly.' },
    { title: 'Security & access', detail: 'Roles, SSO, audit logs, and least privilege.' },
  ];

  return (
    <div className="dashboard-page">
      <ClientNavbar />

      <header className="client-feature-hero">
        <div className="eyebrow">Team workspace</div>
        <div className="hero-title">
          <h1>Developers</h1>
          <div className="title-accent" />
        </div>
        <p className="hero-subtitle">
          Align developers, AI collaborators, and stakeholders with transparent access and context.
        </p>

        <div className="hero-metrics">
          <div className="metric-card">
            <span className="metric-label">Active members</span>
            <strong>3</strong>
          </div>
          <div className="metric-card">
            <span className="metric-label">Invites</span>
            <strong>1</strong>
          </div>
          <div className="metric-card">
            <span className="metric-label">Roles</span>
            <strong>4</strong>
          </div>
        </div>
      </header>

      <section className="client-section">
        <div className="section-head">
          <h2>Team roster</h2>
          <button className="ghost-button">
            <UserPlus size={16} /> Invite member
          </button>
        </div>

        <div className="team-grid">
          {team.map(({ name, role, focus, status }) => (
            <div key={name} className="dashboard-card info-card team-card">
              <div className="card-top">
                <Users size={20} />
                <span className="role-chip">{status}</span>
              </div>
              <h3>{name}</h3>
              <p>{role}</p>
              <p className="muted">{focus}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="client-section">
        <div className="section-head">
          <h2>Collaboration spaces</h2>
        </div>

        <div className="mini-action-grid">
          {spaces.map(({ title, detail }) => (
            <div key={title} className="collab-card">
              <MessageSquare size={18} />
              <div>
                <strong>{title}</strong>
                <small>{detail}</small>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="client-section">
        <div className="section-head">
          <h2>Security & ownership</h2>
        </div>

        <div className="mini-action-grid">
          <div className="mini-card">
            <ShieldCheck size={18} />
            <div>
              <strong>SSO enforcement</strong>
              <p className="muted">SAML with step-up verification for deploys.</p>
            </div>
          </div>
          <div className="mini-card">
            <Code2 size={18} />
            <div>
              <strong>Deploy approvals</strong>
              <p className="muted">Require sign-off for production changes.</p>
            </div>
          </div>
          <div className="mini-card">
            <Handshake size={18} />
            <div>
              <strong>Partner access</strong>
              <p className="muted">Time-boxed credentials for agencies and freelancers.</p>
            </div>
          </div>
          <div className="mini-card">
            <Sparkles size={18} />
            <div>
              <strong>AI collaborators</strong>
              <p className="muted">Track AI suggestions and approvals per project.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
