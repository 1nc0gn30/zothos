import { useState } from 'react';
import {
  Globe,
  Clock,
  Activity,
  BarChart3,
  ShieldCheck,
  ExternalLink,
  RefreshCcw,
  Sparkles,
  Image,
  Search,
  Layers,
} from 'lucide-react';

import ClientNavbar from '../../components/navbars/ClientNavbar';
import Modal from '../../components/design/Modal';

import '../../styles/Client/ClientActiveWebsites.css';

export default function ClientActiveWebsites() {
  const [modal, setModal] = useState(null);

  const websites = [
    {
      name: 'mybusiness.com',
      url: 'https://mybusiness.com',
      lastDeploy: '2 hours ago',
      preview: 'https://via.placeholder.com/420x240?text=Live+Preview',
    },
    {
      name: 'portfolio.dev',
      url: 'https://portfolio.dev',
      lastDeploy: 'Yesterday',
      preview: 'https://via.placeholder.com/420x240?text=Live+Preview',
    },
  ];

  const closeModal = () => setModal(null);

  return (
    <div className="dashboard-page">
      <ClientNavbar />

      <header className="client-hero">
        <div className="eyebrow">Live infrastructure</div>
        <h1>Active Websites</h1>
        <p className="hero-subtitle">
          Deployments, performance, SEO intelligence, and AI-assisted actions.
        </p>
      </header>

      <section className="active-sites-grid">
        {websites.map((site) => (
          <div key={site.name} className="site-card">
            <div className="site-card-header">
              <Globe size={26} />
              <span className="site-status live">LIVE</span>
            </div>

            <h3 className="site-name">{site.name}</h3>

            <p className="site-deploy">
              <Clock size={14} /> Last deploy: {site.lastDeploy}
            </p>

            <div className="site-metrics">
              <div><Activity size={16} /> 99.98%</div>
              <div><BarChart3 size={16} /> 1.2s</div>
              <div><ShieldCheck size={16} /> Secure</div>
            </div>

            <div className="site-actions">
              <button onClick={() => setModal({ type: 'visit', site })}>
                <ExternalLink size={16} /> Visit
              </button>

              <button onClick={() => setModal({ type: 'redeploy', site })}>
                <RefreshCcw size={16} /> Redeploy
              </button>

              <button onClick={() => setModal({ type: 'metrics', site })}>
                <BarChart3 size={16} /> Metrics
              </button>

              <button onClick={() => setModal({ type: 'ai', site })}>
                <Sparkles size={16} /> AI
              </button>

              <button onClick={() => setModal({ type: 'seo', site })}>
                <Search size={16} /> SEO
              </button>

              <button onClick={() => setModal({ type: 'media', site })}>
                <Image size={16} /> Media
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* MODAL */}
      <Modal open={!!modal} onClose={closeModal}>
        {modal?.type === 'visit' && (
          <>
            <img src={modal.site.preview} alt="" />
            <p>Live production build. CDN accelerated.</p>
            <button
              className="primary"
              onClick={() => window.open(modal.site.url, '_blank')}
            >
              Go to Site
            </button>
          </>
        )}

        {modal?.type === 'redeploy' && (
          <>
            <h3>Deploy Summary</h3>
            <ul>
              <li>Build time: 38s</li>
              <li>Files changed: 14</li>
              <li>No errors detected</li>
            </ul>
            <button className="primary">Trigger Redeploy</button>
          </>
        )}

        {modal?.type === 'metrics' && (
          <>
            <ul>
              <li>Lighthouse: 92</li>
              <li>CLS: 0.03</li>
              <li>TTFB: 180ms</li>
            </ul>
            <button className="primary">View Report</button>
          </>
        )}

        {modal?.type === 'ai' && (
          <>
            <ul>
              <li>Fix layout shift</li>
              <li>Lazy load images</li>
              <li>Optimize fonts</li>
            </ul>
            <button className="primary">Apply Fixes</button>
          </>
        )}

        {modal?.type === 'seo' && (
          <>
            <p>SEO score: <strong>87</strong></p>
            <ul>
              <li>3 missing alt tags</li>
              <li>Meta description OK</li>
            </ul>
            <button className="primary">Optimize SEO</button>
          </>
        )}

        {modal?.type === 'media' && (
          <>
            <ul>
              <li>Images: 38</li>
              <li>Videos: 2</li>
              <li>Total size: 4.6MB</li>
            </ul>
            <button className="primary">Manage Assets</button>
          </>
        )}
      </Modal>
    </div>
  );
}
