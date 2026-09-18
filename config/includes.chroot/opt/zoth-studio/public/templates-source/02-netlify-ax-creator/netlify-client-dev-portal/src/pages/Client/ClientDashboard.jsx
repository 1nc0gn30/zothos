import {
  Globe,
  Link2,
  Image,
  Wrench,
  Code2,
  Settings,
} from 'lucide-react';

import '../../styles/Client/ClientDashboard.css';
import { Link } from 'react-router-dom';
import ClientNavbar from '../../components/navbars/ClientNavbar';

export default function ClientDashboard() {
  const cards = [
    { label: 'MY WEBSITES', icon: Globe, link: '/ClientWebsites' },
    { label: 'MY DOMAINS', icon: Link2, link: '/ClientDomains' },
    { label: 'MY MEDIA', icon: Image, link: '/ClientMedia' },
    { label: 'MY TOOLS', icon: Wrench, link: '/ClientTools' },
    { label: 'MY DEVELOPERS', icon: Code2, link: '/ClientDevelopers' },
    { label: 'SETTINGS', icon: Settings, link: '/ClientSettings' },
  ];

  return (
    <div className="dashboard-page">
      <ClientNavbar />

      {/* GRID */}
      <main className="dashboard-grid">
        {cards.map(({ label, icon: Icon, link }) => (
          <Link to={link} key={label}>
            <div className="dashboard-card">
              <Icon size={34} />
              <span>{label}</span>
            </div>
          </Link>
        ))}
      </main>
    </div>
  );
}
