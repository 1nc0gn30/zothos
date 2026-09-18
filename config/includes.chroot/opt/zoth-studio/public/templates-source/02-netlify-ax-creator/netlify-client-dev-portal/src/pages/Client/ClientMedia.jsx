import {
  ImageDown,
  UploadCloud,
  Sparkles,
  Play,
  Layers,
  Gauge,
  Palette,
} from 'lucide-react';

import '../../styles/Client/ClientDashboard.css';
import '../../styles/Client/ClientMedia.css';
import ClientNavbar from '../../components/navbars/ClientNavbar';

export default function ClientMedia() {
  const collections = [
    { title: 'Brand kit', count: '182 assets', label: 'Fonts, logos, palettes' },
    { title: 'Campaigns', count: '94 assets', label: 'Launch creative & ads' },
    { title: 'Product shots', count: '68 assets', label: '3D & studio renders' },
    { title: 'Video', count: '22 assets', label: 'Explainers & shorts' },
  ];

  const assets = [
    { name: 'hero-banner.png', size: '1.2 MB' },
    { name: 'launch-reel.mp4', size: '45 MB' },
    { name: 'press-kit.zip', size: '12 MB' },
    { name: 'palette.json', size: '4 KB' },
  ];

  return (
    <div className="dashboard-page">
      <ClientNavbar />

      <header className="client-feature-hero">
        <div className="eyebrow">Media library</div>
        <div className="hero-title">
          <h1>Media & Assets</h1>
          <div className="title-accent" />
        </div>
        <p className="hero-subtitle">
          Centralize creative files, automate optimization, and keep assets synced
          across every site.
        </p>

        <div className="hero-metrics">
          <div className="metric-card">
            <span className="metric-label">Assets stored</span>
            <strong>366</strong>
          </div>
          <div className="metric-card">
            <span className="metric-label">Bandwidth</span>
            <strong>74 GB</strong>
          </div>
          <div className="metric-card">
            <span className="metric-label">AI optimizations ready</span>
            <strong>9</strong>
          </div>
        </div>
      </header>

      <section className="client-section">
        <div className="section-head">
          <h2>Collections</h2>
          <div className="media-toolbar">
            <button className="ghost-button">
              <UploadCloud size={16} /> Upload
            </button>
            <button className="ghost-button">
              <Sparkles size={16} /> Auto-optimize
            </button>
          </div>
        </div>

        <div className="media-grid">
          {collections.map(({ title, count, label }) => (
            <div key={title} className="dashboard-card info-card media-card">
              <Layers size={22} />
              <h3>{title}</h3>
              <p>{label}</p>
              <div className="tag-row">
                <span className="tag">{count}</span>
                <span className="tag">Shared with devs</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="client-section">
        <div className="section-head">
          <h2>Recent uploads</h2>
          <button className="ghost-button">
            <Gauge size={16} /> Usage analytics
          </button>
        </div>

        <div className="asset-list">
          {assets.map(({ name, size }) => (
            <div key={name} className="asset-item">
              <div>
                <span>{name}</span>
                <small>{size}</small>
              </div>
              <div className="tag-row">
                <span className="tag">CDN cached</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="client-section">
        <div className="section-head">
          <h2>Smart media tools</h2>
        </div>

        <div className="mini-action-grid">
          <div className="mini-card">
            <ImageDown size={18} />
            <div>
              <strong>Image compression</strong>
              <p className="muted">Lossless and WebP fallbacks ready.</p>
            </div>
          </div>
          <div className="mini-card">
            <Play size={18} />
            <div>
              <strong>Video transcode</strong>
              <p className="muted">Adaptive streaming presets for launches.</p>
            </div>
          </div>
          <div className="mini-card">
            <Palette size={18} />
            <div>
              <strong>Design tokens</strong>
              <p className="muted">Sync palettes and typography to dev builds.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
