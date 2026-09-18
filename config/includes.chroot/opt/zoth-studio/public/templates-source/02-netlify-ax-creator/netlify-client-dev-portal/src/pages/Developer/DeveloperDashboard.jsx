import { Terminal, GitBranch, Database, Cloud, ShieldCheck, Settings } from 'lucide-react';

import '../../styles/Developer/DeveloperDashboard.css';
import DeveloperNavbar from '../../components/navbars/DeveloperNavbar';

export default function DeveloperDashboard() {
  const cards = [
    { label: 'DEPLOYMENTS', icon: Cloud },
    { label: 'GIT REPOS', icon: GitBranch },
    { label: 'DATABASES', icon: Database },
    { label: 'ENV VARIABLES', icon: Terminal },
    { label: 'SECURITY', icon: ShieldCheck },
    { label: 'SETTINGS', icon: Settings },
  ];

  return (
    <div className="dashboard-page">
      <DeveloperNavbar />

      {/* GRID */}
      <main className="dashboard-grid">
        {cards.map(({ label, icon: Icon }) => (
          <div key={label} className="dashboard-card">
            <Icon size={34} />
            <span>{label}</span>
          </div>
        ))}
      </main>
    </div>
  );
}
