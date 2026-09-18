import {
  Globe,
  Archive,
  Sparkles,
  Search,
  Users,
  Bot,
  Briefcase,
  LayoutTemplate,
  UploadCloud,
} from 'lucide-react';

import '../../styles/Client/ClientDashboard.css';
import '../../styles/Client/ClientWebsites.css';
import { Link } from 'react-router-dom';
import ClientNavbar from '../../components/navbars/ClientNavbar';

export default function ClientWebsites() {
  const sections = [
    {
      title: 'ACTIVE WEBSITES',
      description: 'Your currently deployed and live sites',
      icon: Globe,
      link: '/ClientActiveWebsites',
    },
    {
      title: 'ARCHIVED / DEAD SITES',
      description: 'Previously deployed or disabled projects',
      icon: Archive,
    },
    {
      title: 'INSPIRED BY YOUR SITES',
      description: 'Recommended Netlify sites & layouts based on your projects',
      icon: Sparkles,
    },
  ];

  const actions = [
    { label: 'CREATE / ADD WEBSITE', icon: Sparkles, link: '/ClientNewWebsite' },
    { label: 'SEARCH / BUY DOMAIN', icon: Search },
    { label: 'HUMAN DEVELOPER', icon: Users },
    { label: 'AI DEVELOPER', icon: Bot },
    { label: 'POST A GIG', icon: Briefcase },
    { label: 'WEBSITE TEMPLATES', icon: LayoutTemplate },
    { label: 'DROP & DEPLOY', icon: UploadCloud },
  ];

  return (
    <div className="dashboard-page">
      <ClientNavbar />
      {/* HEADER */}
      <header className="client-header">
        <h1>Your Websites</h1>
        <div className="client-header-actions">
          <p>Manage, deploy, inspire, and build — all in one place.</p>
          <Link to="/ClientNewWebsite" className="primary-link">Create / Add Website</Link>
        </div>
      </header>

      {/* SITE SECTIONS */}
      <section className="client-sections">
        {sections.map(({ title, description, icon: Icon, link }) => (
          <Link to={link} key={title}>
            <div className="dashboard-card client-section-card">
              <Icon size={36} />
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </div>
          </Link>
        ))}
      </section>

      {/* ACTION HUB */}
      <section className="client-actions">
        <h2>Build & Grow</h2>

        <div className="dashboard-grid">
          {actions.map(({ label, icon: Icon, link }) => {
            const card = (
              <div className="dashboard-card client-action-card">
                <Icon size={34} />
                <span>{label}</span>
              </div>
            );

            if (link) {
              return (
                <Link key={label} to={link} className="client-action-link">
                  {card}
                </Link>
              );
            }

            return (
              <div key={label} className="client-action-link">
                {card}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
