import {
  FileCode,
  FolderPlus,
  Hammer,
  Image,
  LayoutTemplate,
  Search,
  Sparkles,
  UploadCloud,
  Wand2,
  Users,
} from 'lucide-react';
import '../../styles/Client/ClientDashboard.css';
import '../../styles/Client/ClientNewWebsite.css';
import ClientNavbar from '../../components/navbars/ClientNavbar';

export default function ClientNewWebsite() {
  const createPaths = [
    {
      title: 'Add or import a site',
      icon: UploadCloud,
      description:
        'Drop a ready-to-deploy static website folder—no compiler or build step required.',
      bullets: [
        'Attach an existing domain or search for a new one during setup.',
        'Upload assets and we will convert images to WebP and videos to WebM automatically.',
      ],
    },
    {
      title: 'Create from a starter',
      icon: Hammer,
      description:
        'Spin up a prebuilt repository with your chosen stack: React, Astro, or plain HTML.',
      bullets: [
        'Work manually in the repo or hand tasks to an AI agent.',
        'Start from curated templates or keep it minimal for full control.',
      ],
    },
    {
      title: 'Generate with help',
      icon: Sparkles,
      description:
        'Pick how you want to build: pair with a human developer, an AI developer, or post a gig.',
      bullets: [
        'Blend AI-generated sections with your edits inside the repo.',
        'Ask for recommendations or iterate with guided prompts.',
      ],
    },
  ];

  const domainAndIdentity = [
    {
      title: 'Find or connect a domain',
      icon: Search,
      description:
        'Search for an available domain or attach one you already own to your new website.',
    },
    {
      title: 'Brand toolkit generator',
      icon: Wand2,
      description:
        'Upload any logo or image to generate favicons, meta images, and social cards automatically.',
    },
  ];

  const buildUtilities = [
    {
      title: 'Media optimization',
      icon: Image,
      description:
        'Everything you upload is optimized for speed—images become WebP, videos become WebM.',
    },
    {
      title: 'Template library',
      icon: LayoutTemplate,
      description:
        'Start with proven layouts or inspirational designs to accelerate your launch.',
    },
    {
      title: 'Developer options',
      icon: Users,
      description:
        'Invite a human developer, collaborate with an AI builder, or keep the work in-house.',
    },
    {
      title: 'Base repos',
      icon: FileCode,
      description:
        'Initialize a clean React, Astro, or HTML repo and build manually or with AI assistance.',
    },
    {
      title: 'Drop & deploy',
      icon: FolderPlus,
      description:
        'Upload a static site bundle that needs no compilation—perfect for simple, instant deploys.',
    },
  ];

  return (
    <div className="dashboard-page new-website-page">
      <ClientNavbar />

      <header className="client-header new-website-header">
        <div>
          <h1>Create, add, or generate a new website</h1>
          <p>
            Choose the path that fits your workflow—import something you already built, start from a
            starter repo, or generate a site with human or AI help.
          </p>
        </div>
        <div className="new-website-actions">
          <button type="button" className="cta-button primary">
            Start a new site
          </button>
          <button type="button" className="cta-button ghost">
            Talk to an expert
          </button>
        </div>
      </header>

      <section className="new-website-grid">
        {createPaths.map(({ title, icon: Icon, description, bullets }) => (
          <div key={title} className="dashboard-card new-website-card">
            <div className="card-header">
              <Icon size={32} />
              <h3>{title}</h3>
            </div>
            <p className="card-description">{description}</p>
            <ul>
              {bullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="new-website-secondary">
        <div className="new-website-column">
          <h2>Domain & identity</h2>
          <div className="new-website-list">
            {domainAndIdentity.map(({ title, icon: Icon, description }) => (
              <div key={title} className="dashboard-card new-website-card compact">
                <div className="card-header">
                  <Icon size={28} />
                  <div>
                    <h3>{title}</h3>
                    <p className="card-description">{description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="new-website-column">
          <h2>Build utilities</h2>
          <div className="new-website-list">
            {buildUtilities.map(({ title, icon: Icon, description }) => (
              <div key={title} className="dashboard-card new-website-card compact">
                <div className="card-header">
                  <Icon size={28} />
                  <div>
                    <h3>{title}</h3>
                    <p className="card-description">{description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
