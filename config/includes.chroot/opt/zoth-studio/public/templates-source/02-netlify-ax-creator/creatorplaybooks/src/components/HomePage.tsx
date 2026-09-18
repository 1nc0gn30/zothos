import type { CreatorProfile } from '../types';
import { Sparkles, Search, SlidersHorizontal, Tag, ArrowRight, Zap, Bot, Code2, Terminal, Globe, X, ChevronRight } from 'lucide-react';
import { CATEGORIES } from '../lib/creators';
import { HoneycombWebGLGrid } from './HoneycombWebGLGrid';
import { useMemo } from 'react';

export function HomePage({
  filteredCreators,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedTag,
  setSelectedTag,
  categories,
  allTags,
  openCreatorModal,
  activeCreator,
  totalPlays,
  modalCreatorId,
}: {
  filteredCreators: CreatorProfile[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (c: string | null) => void;
  selectedTag: string | null;
  setSelectedTag: (t: string | null) => void;
  categories: [string, number][];
  allTags: string[];
  openCreatorModal: (c: CreatorProfile) => void;
  activeCreator: CreatorProfile;
  totalPlays: number;
  modalCreatorId: string | null;
}) {


  const categoryCounts = useMemo(() => {
    const map = new Map<string, number>();
    categories.forEach(([k, v]) => map.set(k, v));
    return map;
  }, [categories]);

  const activeFilterCount = (selectedCategory ? 1 : 0) + (selectedTag ? 1 : 0) + (searchQuery ? 1 : 0);

  return (
    <div className="home-page">
      {/* Background effects */}
      <div className="home-orb home-orb-1" />
      <div className="home-orb home-orb-2" />
      <div className="home-grid" />

      {/* Hero */}
      <section className="home-hero">
        <div className="home-hero-content">
          <div className="home-kicker">
            <span className="home-kicker-dot" />
            34 verified creator playbooks
          </div>
          <h1 className="home-headline">
            Growth playbooks from<br />
            <span className="home-gradient-text">the creators who ship.</span>
          </h1>
          <p className="home-subhead">
            Stop guessing what to post. Study the exact repeatable plays used by indie hackers, Netlify shippers, and big players — then copy them into your workflow.
          </p>
          <div className="home-hero-actions">
            <button className="home-btn home-btn-primary" onClick={() => document.getElementById('directory')?.scrollIntoView({ behavior: 'smooth' })}>
              <Sparkles size={18} />
              Browse mentors
              <ChevronRight size={16} />
            </button>
            <button className="home-btn home-btn-secondary" onClick={() => document.getElementById('api-section')?.scrollIntoView({ behavior: 'smooth' })}>
              <Code2 size={18} />
              Try the API
            </button>
          </div>
          <div className="home-stats-bar">
            <div className="home-stat">
              <span className="home-stat-num">34</span>
              <span className="home-stat-label">creators</span>
            </div>
            <div className="home-stat-sep" />
            <div className="home-stat">
              <span className="home-stat-num">{totalPlays}+</span>
              <span className="home-stat-label">growth plays</span>
            </div>
            <div className="home-stat-sep" />
            <div className="home-stat">
              <span className="home-stat-num">1</span>
              <span className="home-stat-label">agent-ready API</span>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="home-section home-how">
        <div className="home-section-header">
          <span className="home-section-eyebrow">How it works</span>
          <h2 className="home-section-title">Pick a mentor. Copy the playbook. Start shipping.</h2>
        </div>
        <div className="home-steps">
          <div className="home-step">
            <div className="home-step-icon"><Sparkles size={22} /></div>
            <h3>Discover</h3>
            <p>Browse creators by category, audience size, or topic. Every profile is reverse-engineered from real posts.</p>
          </div>
          <div className="home-step">
            <div className="home-step-icon"><Terminal size={22} /></div>
            <h3>Copy</h3>
            <p>Grab the full playbook, content hooks, or a ready-to-paste agent prompt trained on their voice.</p>
          </div>
          <div className="home-step">
            <div className="home-step-icon"><Zap size={22} /></div>
            <h3>Run</h3>
            <p>Schedule posts, track streaks, and level up in the dashboard. Consistency beats virality.</p>
          </div>
        </div>
      </section>

      {/* Origin Story */}
      <section className="home-origin-story">
        {/* Subtle glowing liquid trail watermark */}
        <div className="origin-watermark" />
        
        <div className="home-origin-left">
          <div className="origin-visual-stack">
            {/* Background Grid Ambience */}
            <div className="stack-grid-bg" />
            
            {/* Card 3: Code Card (Bottom) */}
            <div className="stack-card card-bottom">
              <div className="stack-card-header">
                <span className="dot red" />
                <span className="dot yellow" />
                <span className="dot green" />
                <span className="stack-title">playbook.json</span>
              </div>
              <pre className="stack-code">
                <code>{`{
  "creator": "maya",
  "plays": [
    { "play": "Build in public", "xp": 12 },
    { "play": "Hook template", "leads": 450 }
  ]
}`}</code>
              </pre>
            </div>
            
            {/* Card 2: Swipe File List (Middle) */}
            <div className="stack-card card-middle">
              <div className="stack-card-badge">Swipe File</div>
              <h4>Voice & Angles</h4>
              <div className="swipe-lines">
                <div className="swipe-line-item">✦ "Why X grew while Y failed..."</div>
                <div className="swipe-line-item">✦ "I analyzed 100 posts..."</div>
                <div className="swipe-line-item">✦ "Stop doing Z. Do this instead..."</div>
              </div>
            </div>
            
            {/* Card 1: Brand Identifier Card (Top) */}
            <div className="stack-card card-top">
              <div className="card-top-glow" />
              <div className="card-top-inner">
                <div className="origin-logo-ring">
                  <img src="/brand_logo.png" alt="CreatorPlaybooks Brand Logo" className="origin-brand-img" />
                </div>
                <h3>CreatorPlaybooks</h3>
                <span className="pill-active">
                  <span className="pulse-dot" />
                  Growth System
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="home-origin-right">
          <span className="origin-badge">Origin Story</span>
          <span className="home-section-eyebrow" style={{ display: 'block', marginBottom: '6px' }}>CreatorPlaybooks started as one question:</span>
          
          <blockquote className="origin-quote">
            “Why do some indie hackers grow an audience while others ship silently?”
          </blockquote>
          
          <div className="origin-authors">
            <span className="origin-by">Co-created by</span>
            <a href="https://x.com/buildwithmaya" target="_blank" rel="noreferrer" className="author-badge maya-badge">
              <span className="author-avatar" style={{ background: 'linear-gradient(135deg, #ec4899, #8b5cf6)' }}>M</span>
              <span>@buildwithmaya</span>
            </a>
            <a href="https://x.com/NealFrazierTech" target="_blank" rel="noreferrer" className="author-badge neal-badge">
              <span className="author-avatar" style={{ background: 'linear-gradient(135deg, #8b5cf6, #22d3ee)' }}>N</span>
              <span>@NealFrazierTech</span>
            </a>
          </div>

          <p className="lead">
            We studied builders like <strong>Maya</strong> who ship in public, share playbooks, and turn followers into users. Then we turned those patterns into an agent-ready library of repeatable growth plays.
          </p>
          
          <p className="origin-desc">
            Every creator playbook here is reverse-engineered from real posts and is structured so you can copy their plays, schedule drafts, or drop the playbook JSON directly into your Cursor/AI agent.
          </p>
          
          <div className="origin-formula-box">
            <div className="formula-header">
              <Zap size={14} className="formula-icon" />
              <span>The 4-Step Growth Engine</span>
            </div>
            <div className="formula-steps-row">
              <div className="formula-step-item">
                <span className="num">1</span>
                <span className="step-txt">Pick a mentor</span>
              </div>
              <div className="formula-arrow">→</div>
              <div className="formula-step-item">
                <span className="num">2</span>
                <span className="step-txt">Copy plays</span>
              </div>
              <div className="formula-arrow">→</div>
              <div className="formula-step-item">
                <span className="num">3</span>
                <span className="step-txt">Adapt stack</span>
              </div>
              <div className="formula-arrow">→</div>
              <div className="formula-step-item">
                <span className="num">4</span>
                <span className="step-txt">Start shipping</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Directory */}
      <section className="home-section home-directory" id="directory">
        <div className="home-section-header">
          <span className="home-section-eyebrow">Mentor directory</span>
          <h2 className="home-section-title">Find your growth blueprint</h2>
        </div>

        <div className="home-filter-bar">
          <div className="home-search">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search creators, handles, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && <button className="home-search-clear" onClick={() => setSearchQuery('')}><X size={14} /></button>}
          </div>
          <div className="home-filter-group">
            <div className="home-dropdown">
              <button className={`home-filter-chip ${selectedCategory ? 'active' : ''}`}>
                <SlidersHorizontal size={14} />
                Category
                {selectedCategory && <span className="home-filter-badge">1</span>}
              </button>
              <div className="home-dropdown-menu">
                <button className="home-dropdown-item" onClick={() => setSelectedCategory(null)}>
                  All categories <span className="home-dropdown-count">34</span>
                </button>
                {CATEGORIES.map((cat) => (
                  <button key={cat.id} className="home-dropdown-item" onClick={() => setSelectedCategory(cat.id)}>
                    <span>{cat.emoji}</span> {cat.label}
                    <span className="home-dropdown-count">{categoryCounts.get(cat.id) ?? 0}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="home-dropdown">
              <button className={`home-filter-chip ${selectedTag ? 'active' : ''}`}>
                <Tag size={14} />
                Tag
                {selectedTag && <span className="home-filter-badge">1</span>}
              </button>
              <div className="home-dropdown-menu">
                <button className="home-dropdown-item" onClick={() => setSelectedTag(null)}>
                  All tags <span className="home-dropdown-count">34</span>
                </button>
                {allTags.slice(0, 16).map((t) => (
                  <button key={t} className="home-dropdown-item" onClick={() => setSelectedTag(t)}>
                    #{t}
                  </button>
                ))}
              </div>
            </div>
            {activeFilterCount > 0 && (
              <button className="home-filter-chip reset" onClick={() => { setSearchQuery(''); setSelectedCategory(null); setSelectedTag(null); }}>
                Reset
              </button>
            )}
          </div>
        </div>

        {selectedCategory && (
          <div className="home-category-hero" style={{ background: `linear-gradient(135deg, ${activeCreator.theme.primary}15, ${activeCreator.theme.accent}15)` }}>
            <div className="home-category-hero-text">
              <strong>{CATEGORIES.find(c => c.id === selectedCategory)?.emoji} {CATEGORIES.find(c => c.id === selectedCategory)?.label}</strong>
              <span>{CATEGORIES.find(c => c.id === selectedCategory)?.description}</span>
            </div>
            <button onClick={() => setSelectedCategory(null)}><X size={14} /></button>
          </div>
        )}

        {filteredCreators.length === 0 ? (
          <div className="home-empty">
            <div className="home-empty-icon">🔭</div>
            <h3>No creators match</h3>
            <p>Try clearing your search or filters.</p>
            <button className="home-btn home-btn-secondary" onClick={() => { setSearchQuery(''); setSelectedCategory(null); setSelectedTag(null); }}>
              <ArrowRight size={14} /> Clear filters
            </button>
          </div>
        ) : (
          <HoneycombWebGLGrid 
            filteredCreators={filteredCreators}
            openCreatorModal={openCreatorModal}
            modalCreatorId={modalCreatorId}
          />
        )}
      </section>

      {/* API teaser */}
      <section className="home-section home-api" id="api-section">
        <div className="home-api-card">
          <div className="home-api-left">
            <span className="home-section-eyebrow">Agent-ready API</span>
            <h2 className="home-section-title">Plug every playbook into your agent.</h2>
            <p className="home-section-subtitle">Pull any creator playbook as clean JSON. Drop it into Cursor, n8n, or your own automation.</p>
            <div className="home-api-actions">
              <a href="/api/creators" target="_blank" rel="noreferrer" className="home-btn home-btn-primary">
                <Globe size={16} /> /api/creators
              </a>
              <a href="/api/creator?id=maya" target="_blank" rel="noreferrer" className="home-btn home-btn-secondary">
                <Bot size={16} /> Sample playbook
              </a>
            </div>
          </div>
          <div className="home-api-code">
            <pre><code>{`GET /api/creator?id=maya
{
  "name": "Maya",
  "handle": "@buildwithmaya",
  "plays": [
    { "title": "Build in public", ... },
    { "title": "Distribution first", ... }
  ]
}`}</code></pre>
          </div>
        </div>
      </section>
    </div>
  );
}
