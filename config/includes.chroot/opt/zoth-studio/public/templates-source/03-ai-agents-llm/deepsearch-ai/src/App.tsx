import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Loader2, BarChart3, PieChart as PieChartIcon, TrendingUp, Share2, 
  ExternalLink, Globe, Hash, Info, ShieldCheck, Settings, X, Volume2, VolumeX,
  Download, Copy, Check, Sparkles, Key, History, HelpCircle, Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area 
} from 'recharts';
import Markdown from 'react-markdown';
import { performDeepSearch } from './services/searchService';
import { SearchResult, ChartViewMode } from './types';
import { cn } from './lib/utils';
import { soundEngine } from './services/soundService';
import { BackgroundCanvas } from './components/BackgroundCanvas';

const COLORS = ['#4285F4', '#EA4335', '#FBBC05', '#34A853', '#8E44AD', '#00C49F'];

const PRESET_TOPICS = [
  'Future of Quantum Computing',
  'Autonomous AI Agent Tooling Architecture',
  'Nuclear Fusion Commercialization 2026',
  'Post-Quantum Cryptography Standards',
  'Neuromorphic Chip Processing Units'
];

const FOOTER_LINKS = ['About', 'Advertising', 'Business', 'How Search works', 'Privacy', 'Terms', 'Settings'] as const;

type FooterLink = typeof FOOTER_LINKS[number];
type FooterDialogConfig = {
  title: string;
  subtitle: string;
  body: string[];
};

const FOOTER_DIALOGS: Record<FooterLink, FooterDialogConfig> = {
  About: {
    title: 'About DeepSearch AI',
    subtitle: 'Built for exploratory research with clear synthesis and grounded sources.',
    body: [
      'DeepSearch AI blends Google-style search UX with structured AI analysis so you can move from question to insight quickly.',
      'Your workflow stays flexible: bring your own Gemini API key or explore instant results with our local defensive mock engine.',
      'Designed and engineered by Zoth Studio Team (https://nullai.tech) for speed, clarity, and dependable research citations.',
    ],
  },
  Advertising: {
    title: 'Advertising',
    subtitle: 'Promote research-focused tools and services to analysts and developers.',
    body: [
      'Advertising placements stay low-friction with transparent sponsorship labeling.',
      'Campaign formats prioritize contextual relevance so the research experience remains clean.',
      'For sponsorship inquiries, visit nullai.tech or contact the developer repository.',
    ],
  },
  Business: {
    title: 'Business Solutions',
    subtitle: 'DeepSearch AI for teams, research analysts, and decision support.',
    body: [
      'Business deployments include shared query templates, topic monitoring, and structured export pipelines.',
      'Security-conscious teams can operate with environment-scoped API keys and data retention controls.',
      'Custom API endpoints and reporting integrations are available upon request.',
    ],
  },
  'How Search works': {
    title: 'How DeepSearch Works',
    subtitle: 'A transparent, four-step analysis pipeline.',
    body: [
      'Step 1: Input a research query or pick from curated cutting-edge topics.',
      'Step 2: DeepSearch passes context to Gemini 2.5 with Google Search grounding enabled.',
      'Step 3: Output is constrained to strict JSON schema (summary, keywords, data points, related topics, and source URLs).',
      'Step 4: Interactive charts, verified citation links, and export tools render instantly in your workspace.',
    ],
  },
  Privacy: {
    title: 'Privacy Policy',
    subtitle: 'Your API key and research queries remain under your direct control.',
    body: [
      'Your Gemini API key is saved exclusively in your browser local storage (`localStorage`).',
      'Search requests are transmitted directly to the Gemini API endpoint or processed via the local mock engine.',
      'No personal identifiers, key values, or search histories are tracked on external telemetry servers.',
    ],
  },
  Terms: {
    title: 'Terms of Service',
    subtitle: 'Responsible AI usage and service guidelines.',
    body: [
      'Users are responsible for complying with Google Gemini API terms, rate limits, and usage policies.',
      'DeepSearch outputs are generated for informational purposes and should be verified for safety-critical domain applications.',
      'The project is published as open showcase software under the MIT license by Zoth Studio Team.',
    ],
  },
  Settings: {
    title: 'Application Preferences',
    subtitle: 'Control local persistence, audio state, and API configuration.',
    body: [
      'API Key: Managed locally via the input bar above search.',
      'Audio Feedback: Toggle UI chime and completion sound effects in the header.',
      'Keyboard Shortcuts: Press `/` or `Ctrl+K` to search, `Esc` to reset views.',
    ],
  },
};

export default function App() {
  const [query, setQuery] = useState('');
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('deepsearch_gemini_api_key') || '');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ChartViewMode>('bar');
  const [activeFooterDialog, setActiveFooterDialog] = useState<FooterLink | null>(null);
  const [isMuted, setIsMuted] = useState(() => soundEngine.isMuted());
  const [copied, setCopied] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('deepsearch_recent_queries');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [announcement, setAnnouncement] = useState('');

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  // Global Keyboard Shortcuts (AX)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if inside an input or textarea unless it's Escape
      const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();

      if (e.key === 'Escape') {
        if (activeFooterDialog) {
          setActiveFooterDialog(null);
          soundEngine.playClickSound();
        } else if (result) {
          setResult(null);
          setQuery('');
          soundEngine.playClickSound();
        }
        return;
      }

      if ((e.key === '/' || (e.ctrlKey && e.key === 'k') || (e.metaKey && e.key === 'k')) && targetTag !== 'input' && targetTag !== 'textarea') {
        e.preventDefault();
        searchInputRef.current?.focus();
        soundEngine.playClickSound();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [activeFooterDialog, result]);

  const saveRecentSearch = (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    const updated = [trimmed, ...recentSearches.filter((item) => item.toLowerCase() !== trimmed.toLowerCase())].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('deepsearch_recent_queries', JSON.stringify(updated));
  };

  const handleSearch = async (e?: React.FormEvent, customQuery?: string) => {
    e?.preventDefault();
    const searchQuery = customQuery || query;
    if (!searchQuery.trim()) return;

    soundEngine.playSearchSound();
    setIsSearching(true);
    setError(null);
    setAnnouncement(`Initiating deep research for: ${searchQuery}`);
    saveRecentSearch(searchQuery);

    try {
      const data = await performDeepSearch(searchQuery, apiKey.trim());
      setResult(data);
      soundEngine.playSuccessSound();
      setAnnouncement(`Deep synthesis complete for ${searchQuery}. Results displayed.`);
    } catch (err) {
      console.error(err);
      setError('Failed to analyze topic. Please verify key or try again.');
      setAnnouncement('Error occurred during search synthesis.');
    } finally {
      setIsSearching(false);
    }
  };

  const toggleSound = () => {
    const newState = soundEngine.toggleMute();
    setIsMuted(newState);
    if (!newState) soundEngine.playClickSound();
  };

  const copySynthesis = () => {
    if (!result) return;
    soundEngine.playClickSound();
    navigator.clipboard.writeText(result.summary);
    setCopied(true);
    setAnnouncement('Research synthesis copied to clipboard.');
    setTimeout(() => setCopied(false), 2000);
  };

  const exportReport = (format: 'md' | 'json') => {
    if (!result) return;
    soundEngine.playClickSound();
    let blob: Blob;
    let filename: string;

    if (format === 'md') {
      const content = `# DeepSearch AI Research Report: ${query}\n\n${result.summary}\n\n## Key Keywords\n${result.keywords.map(k => `- ${k}`).join('\n')}\n\n## Sources\n${result.sources.map(s => `- [${s.title}](${s.url})`).join('\n')}`;
      blob = new Blob([content], { type: 'text/markdown' });
      filename = `DeepSearch_${query.replace(/\s+/g, '_')}.md`;
    } else {
      blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
      filename = `DeepSearch_${query.replace(/\s+/g, '_')}.json`;
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    setAnnouncement(`Exported analysis report as ${filename}`);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 font-sans selection:bg-blue-600 selection:text-white flex flex-col relative overflow-x-hidden">
      {/* Background Particle Canvas Visualizer */}
      <BackgroundCanvas />

      {/* Accessibility Skip Navigation (AX) */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2.5 focus:bg-blue-600 focus:text-white focus:rounded-xl focus:shadow-2xl font-medium focus:ring-2 focus:ring-white focus:outline-none"
      >
        Skip to main content
      </a>

      {/* ARIA Live Region for Screen Readers (AX) */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>

      {/* Global Top Navbar */}
      <header role="banner" className="relative z-40 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                soundEngine.playClickSound();
                setResult(null);
                setQuery('');
              }}
              className="group flex items-center space-x-1.5 focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg p-1"
              aria-label="DeepSearch AI Home"
            >
              <span className="text-2xl md:text-3xl font-black tracking-tighter select-none">
                <span className="text-[#4285F4]">D</span>
                <span className="text-[#EA4335]">e</span>
                <span className="text-[#FBBC05]">e</span>
                <span className="text-[#4285F4]">p</span>
                <span className="text-[#34A853]">S</span>
                <span className="text-[#EA4335]">e</span>
                <span className="text-[#FBBC05]">a</span>
                <span className="text-[#4285F4]">r</span>
                <span className="text-[#34A853]">c</span>
                <span className="text-[#EA4335]">h</span>
              </span>
              <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-[10px] uppercase font-bold px-1.5 py-0.5 rounded tracking-wider">
                AI
              </span>
            </button>
          </div>

          <div className="flex items-center space-x-3">
            {/* Audio Toggle */}
            <button
              type="button"
              onClick={toggleSound}
              className="p-2 rounded-xl border border-slate-800 bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label={isMuted ? 'Unmute UI Audio Feedback' : 'Mute UI Audio Feedback'}
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-blue-400" />}
            </button>

            {/* Author Portfolio Showcase Badge */}
            <a
              href="https://nullai.tech"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundEngine.playClickSound()}
              className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 text-xs font-medium transition-all"
            >
              <span>nullai.tech</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main id="main-content" role="main" className="flex-1 relative z-10">
        <AnimatePresence mode="wait">
          {!result && !isSearching ? (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center justify-center min-h-[82vh] px-4 py-12"
            >
              {/* Main Landing Branding */}
              <div className="flex flex-col items-center mb-8 select-none text-center">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-semibold mb-6 shadow-inner">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                  <span>Autonomous Grounded Synthesis Agent</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4">
                  <span className="text-[#4285F4]">D</span>
                  <span className="text-[#EA4335]">e</span>
                  <span className="text-[#FBBC05]">e</span>
                  <span className="text-[#4285F4]">p</span>
                  <span className="text-[#34A853]">S</span>
                  <span className="text-[#EA4335]">e</span>
                  <span className="text-[#FBBC05]">a</span>
                  <span className="text-[#4285F4]">r</span>
                  <span className="text-[#34A853]">c</span>
                  <span className="text-[#EA4335]">h</span>
                  <span className="text-slate-100 font-light ml-3">AI</span>
                </h1>
                <p className="text-slate-400 text-base md:text-lg max-w-xl font-normal leading-relaxed">
                  Real-time grounded AI research, structured JSON extraction, and instant multi-chart data analytics.
                </p>
              </div>

              {/* Gemini BYOK Config Card */}
              <div className="w-full max-w-2xl mb-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md p-4 shadow-xl">
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center space-x-2 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    <Key className="w-3.5 h-3.5 text-blue-400" />
                    <span>Gemini API Key (BYOK)</span>
                  </label>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    <span>Instant Mock Fallback Active</span>
                  </span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Paste Gemini API key (optional — mock engine works without key)"
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-950/80 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playClickSound();
                      localStorage.setItem('deepsearch_gemini_api_key', apiKey.trim());
                      setAnnouncement('Gemini API Key saved to browser storage.');
                    }}
                    className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    Save Key
                  </button>
                </div>
              </div>

              {/* Main Search Input Form */}
              <form role="search" onSubmit={handleSearch} className="w-full max-w-2xl relative group">
                <div className="relative flex items-center">
                  <Search className="absolute left-4 text-slate-500 w-5 h-5 group-focus-within:text-blue-400 transition-colors pointer-events-none" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search any topic for deep synthesis... (Press / to focus)"
                    className="w-full pl-12 pr-28 py-4 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl text-slate-100 placeholder-slate-500 shadow-2xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all text-base md:text-lg"
                  />
                  <div className="absolute right-3 flex items-center space-x-1">
                    <span className="hidden sm:inline-block text-[11px] font-mono text-slate-500 px-2 py-1 rounded bg-slate-800 border border-slate-700">
                      / or Ctrl+K
                    </span>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex flex-wrap justify-center gap-3 mt-6">
                  <button
                    type="submit"
                    onClick={() => soundEngine.playClickSound()}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-600/25 transition-all text-sm font-semibold flex items-center space-x-2 focus-visible:ring-2 focus-visible:ring-blue-400"
                  >
                    <Search className="w-4 h-4" />
                    <span>Deep Analysis</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playClickSound();
                      const randTopic = PRESET_TOPICS[Math.floor(Math.random() * PRESET_TOPICS.length)];
                      setQuery(randTopic);
                      handleSearch(undefined, randTopic);
                    }}
                    className="px-6 py-2.5 bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 rounded-xl transition-all text-sm font-medium flex items-center space-x-2 focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>I'm Feeling Analytical</span>
                  </button>
                </div>
              </form>

              {/* Preset Topic Pills */}
              <div className="w-full max-w-3xl mt-10">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3 text-center">
                  Trending Research Topics
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {PRESET_TOPICS.map((topic, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        soundEngine.playClickSound();
                        setQuery(topic);
                        handleSearch(undefined, topic);
                      }}
                      className="px-3.5 py-1.5 rounded-full border border-slate-800 bg-slate-900/60 hover:bg-slate-800 hover:border-slate-700 text-xs font-medium text-slate-300 transition-all focus-visible:ring-2 focus-visible:ring-blue-500"
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Searches Pills if present */}
              {recentSearches.length > 0 && (
                <div className="w-full max-w-2xl mt-6 border-t border-slate-800/80 pt-4">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span className="flex items-center gap-1.5 font-medium">
                      <History className="w-3.5 h-3.5 text-slate-400" />
                      <span>Recent Searches</span>
                    </span>
                    <button
                      onClick={() => {
                        localStorage.removeItem('deepsearch_recent_queries');
                        setRecentSearches([]);
                      }}
                      className="hover:text-slate-300 text-[11px]"
                    >
                      Clear history
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((sq, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          soundEngine.playClickSound();
                          setQuery(sq);
                          handleSearch(undefined, sq);
                        }}
                        className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-400 hover:text-slate-200 transition-colors"
                      >
                        {sq}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="w-full pb-16">
              {/* Sticky Search Results Header */}
              <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-4 py-3">
                <div className="max-w-7xl mx-auto flex items-center space-x-4">
                  <button 
                    onClick={() => {
                      soundEngine.playClickSound();
                      setResult(null);
                      setQuery('');
                    }}
                    className="text-2xl font-black tracking-tighter shrink-0 flex items-center focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg"
                    aria-label="Back to Search Home"
                  >
                    <span className="text-[#4285F4]">d</span>
                    <span className="text-[#EA4335]">s</span>
                  </button>
                  
                  <form role="search" onSubmit={handleSearch} className="flex-1 max-w-2xl relative">
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="w-full pl-4 pr-12 py-2 rounded-xl border border-slate-800 bg-slate-900 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all text-sm"
                    />
                    <button 
                      type="submit" 
                      onClick={() => soundEngine.playClickSound()}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-300 p-1"
                      aria-label="Submit search"
                    >
                      {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    </button>
                  </form>

                  {result && (
                    <div className="hidden md:flex items-center space-x-2 shrink-0">
                      <button
                        onClick={copySynthesis}
                        className="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-xs font-medium text-slate-300 flex items-center space-x-1.5 transition-colors"
                        title="Copy synthesis to clipboard"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                        <span>{copied ? 'Copied' : 'Copy'}</span>
                      </button>
                      <button
                        onClick={() => exportReport('md')}
                        className="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-xs font-medium text-slate-300 flex items-center space-x-1.5 transition-colors"
                        title="Export report as Markdown file"
                      >
                        <Download className="w-3.5 h-3.5 text-blue-400" />
                        <span>Export .MD</span>
                      </button>
                    </div>
                  )}
                </div>
              </header>

              {/* Main Analysis Container */}
              <div className="max-w-7xl mx-auto px-4 py-8">
                {isSearching ? (
                  <div className="flex flex-col items-center justify-center py-28 space-y-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin" />
                      <Sparkles className="w-6 h-6 text-purple-400 absolute inset-0 m-auto animate-pulse" />
                    </div>
                    <p className="text-slate-400 animate-pulse font-medium text-base">Synthesizing deep research &amp; visual data...</p>
                  </div>
                ) : result ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                  >
                    {/* Left Column: Markdown Synthesis & Topics */}
                    <div className="lg:col-span-2 space-y-8">
                      {result.isMock && (
                        <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-medium flex items-center space-x-2">
                          <Info className="w-4 h-4 text-amber-400 shrink-0" />
                          <span>✨ Active Showcase Engine: Operating in high-speed defensive mock synthesis mode. Add a Gemini API key above for live web grounding.</span>
                        </div>
                      )}

                      {/* Synthesis Markdown View */}
                      <section aria-labelledby="synthesis-heading" className="glass-panel rounded-2xl p-6 md:p-8 shadow-xl">
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
                          <div className="flex items-center space-x-2.5 text-blue-400">
                            <Globe className="w-5 h-5" />
                            <h2 id="synthesis-heading" className="text-xl font-bold text-slate-100">Deep Synthesis</h2>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={copySynthesis}
                              className="md:hidden p-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-300"
                              aria-label="Copy synthesis text"
                            >
                              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
                            </button>
                            <button
                              onClick={() => exportReport('md')}
                              className="md:hidden p-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-300"
                              aria-label="Export Markdown report"
                            >
                              <Download className="w-4 h-4 text-blue-400" />
                            </button>
                          </div>
                        </div>

                        <div className="prose prose-invert max-w-none">
                          <Markdown>{result.summary}</Markdown>
                        </div>
                      </section>

                      {/* Keywords & Related Topics Grid */}
                      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Key Keywords */}
                        <div className="glass-panel rounded-2xl p-6 shadow-xl">
                          <div className="flex items-center space-x-2 mb-4 text-purple-400">
                            <Hash className="w-5 h-5" />
                            <h3 className="font-semibold text-slate-100">Key Keywords</h3>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {result.keywords.map((kw, i) => (
                              <span key={i} className="px-3 py-1 bg-purple-950/60 text-purple-300 rounded-lg text-xs font-semibold border border-purple-800/50">
                                #{kw}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Related Follow-Up Topics */}
                        <div className="glass-panel rounded-2xl p-6 shadow-xl">
                          <div className="flex items-center space-x-2 mb-4 text-emerald-400">
                            <Layers className="w-5 h-5" />
                            <h3 className="font-semibold text-slate-100">Related Research Topics</h3>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {result.relatedTopics.map((topic, i) => (
                              <button 
                                key={i} 
                                onClick={() => {
                                  soundEngine.playClickSound();
                                  setQuery(topic);
                                  handleSearch(undefined, topic);
                                }}
                                className="px-3 py-1.5 bg-emerald-950/50 text-emerald-300 rounded-lg text-xs font-medium border border-emerald-800/40 hover:bg-emerald-900/60 hover:border-emerald-700 transition-all text-left focus-visible:ring-2 focus-visible:ring-emerald-400"
                              >
                                {topic}
                              </button>
                            ))}
                          </div>
                        </div>
                      </section>
                    </div>

                    {/* Right Column: Visual Charts & Sources */}
                    <div className="space-y-8">
                      {/* Visual Data Chart Section */}
                      <section aria-labelledby="visuals-heading" className="glass-panel rounded-2xl p-6 shadow-xl">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center space-x-2 text-amber-400">
                            <TrendingUp className="w-5 h-5" />
                            <h2 id="visuals-heading" className="font-bold text-slate-100">Visual Data Analytics</h2>
                          </div>
                          {/* Chart View Mode Controls */}
                          <div className="flex bg-slate-900 rounded-xl p-1 border border-slate-800">
                            <button 
                              onClick={() => { soundEngine.playClickSound(); setViewMode('bar'); }}
                              className={cn("p-1.5 rounded-lg transition-all", viewMode === 'bar' ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-slate-200")}
                              aria-label="Bar Chart View"
                              title="Bar Chart"
                            >
                              <BarChart3 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => { soundEngine.playClickSound(); setViewMode('pie'); }}
                              className={cn("p-1.5 rounded-lg transition-all", viewMode === 'pie' ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-slate-200")}
                              aria-label="Pie Chart View"
                              title="Pie Chart"
                            >
                              <PieChartIcon className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => { soundEngine.playClickSound(); setViewMode('line'); }}
                              className={cn("p-1.5 rounded-lg transition-all", viewMode === 'line' ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-slate-200")}
                              aria-label="Line Chart View"
                              title="Line Chart"
                            >
                              <TrendingUp className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => { soundEngine.playClickSound(); setViewMode('area'); }}
                              className={cn("p-1.5 rounded-lg transition-all", viewMode === 'area' ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-slate-200")}
                              aria-label="Area Chart View"
                              title="Area Chart"
                            >
                              <Sparkles className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="h-[280px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            {viewMode === 'bar' ? (
                              <BarChart data={result.dataPoints}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                                <XAxis dataKey="label" fontSize={11} tickLine={false} axisLine={false} stroke="#94a3b8" />
                                <YAxis fontSize={11} tickLine={false} axisLine={false} stroke="#94a3b8" />
                                <Tooltip 
                                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', borderColor: '#334155', color: '#f8fafc' }}
                                />
                                <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                              </BarChart>
                            ) : viewMode === 'pie' ? (
                              <PieChart>
                                <Pie
                                  data={result.dataPoints}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={55}
                                  outerRadius={85}
                                  paddingAngle={4}
                                  dataKey="value"
                                  nameKey="label"
                                >
                                  {result.dataPoints.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', borderColor: '#334155', color: '#f8fafc' }} />
                              </PieChart>
                            ) : viewMode === 'line' ? (
                              <LineChart data={result.dataPoints}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                                <XAxis dataKey="label" fontSize={11} tickLine={false} axisLine={false} stroke="#94a3b8" />
                                <YAxis fontSize={11} tickLine={false} axisLine={false} stroke="#94a3b8" />
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', borderColor: '#334155', color: '#f8fafc' }} />
                                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} dot={{ r: 5, fill: '#60a5fa' }} />
                              </LineChart>
                            ) : (
                              <AreaChart data={result.dataPoints}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                                <XAxis dataKey="label" fontSize={11} tickLine={false} axisLine={false} stroke="#94a3b8" />
                                <YAxis fontSize={11} tickLine={false} axisLine={false} stroke="#94a3b8" />
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', borderColor: '#334155', color: '#f8fafc' }} />
                                <Area type="monotone" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.25} />
                              </AreaChart>
                            )}
                          </ResponsiveContainer>
                        </div>
                      </section>

                      {/* Verified Sources & Citations Section */}
                      <section aria-labelledby="sources-heading" className="glass-panel rounded-2xl p-6 shadow-xl">
                        <div className="flex items-center space-x-2 mb-4 text-slate-300">
                          <Share2 className="w-5 h-5 text-blue-400" />
                          <h2 id="sources-heading" className="font-bold text-slate-100">Grounded Citations &amp; Sources</h2>
                        </div>
                        <div className="space-y-3">
                          {result.sources.map((source, i) => (
                            <a 
                              key={i}
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => soundEngine.playClickSound()}
                              className="flex items-start justify-between p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800 hover:border-slate-700 transition-all group focus-visible:ring-2 focus-visible:ring-blue-500"
                            >
                              <div className="flex-1 min-w-0 pr-3">
                                <p className="text-xs font-semibold text-slate-200 group-hover:text-blue-400 transition-colors truncate">
                                  {source.title}
                                </p>
                                <p className="text-[11px] text-slate-500 truncate mt-0.5">{source.url}</p>
                              </div>
                              <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-blue-400 shrink-0 mt-0.5" />
                            </a>
                          ))}
                        </div>
                      </section>
                    </div>
                  </motion.div>
                ) : null}

                {error && (
                  <div className="max-w-2xl mx-auto mt-8 p-4 bg-red-950/60 border border-red-800 text-red-300 rounded-xl flex items-center space-x-3 shadow-xl">
                    <Info className="w-5 h-5 text-red-400 shrink-0" />
                    <p className="text-sm font-medium">{error}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* Global Footer */}
      {!result && !isSearching && (
        <footer role="contentinfo" className="relative z-30 border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-md py-4 px-4 md:px-8 text-xs text-slate-400 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2">
            <button
              type="button"
              onClick={() => { soundEngine.playClickSound(); setActiveFooterDialog('About'); }}
              className="hover:text-slate-200 flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
            >
              <Info className="w-3.5 h-3.5 text-blue-400" />
              <span>About</span>
            </button>
            <button
              type="button"
              onClick={() => { soundEngine.playClickSound(); setActiveFooterDialog('Advertising'); }}
              className="hover:text-slate-200 flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
            >
              <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
              <span>Advertising</span>
            </button>
            <button
              type="button"
              onClick={() => { soundEngine.playClickSound(); setActiveFooterDialog('Business'); }}
              className="hover:text-slate-200 flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>Business</span>
            </button>
            <button
              type="button"
              onClick={() => { soundEngine.playClickSound(); setActiveFooterDialog('How Search works'); }}
              className="hover:text-slate-200 flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>How Search works</span>
            </button>
          </div>

          <div className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2">
            <button
              type="button"
              onClick={() => { soundEngine.playClickSound(); setActiveFooterDialog('Privacy'); }}
              className="hover:text-slate-200 flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Privacy</span>
            </button>
            <button
              type="button"
              onClick={() => { soundEngine.playClickSound(); setActiveFooterDialog('Terms'); }}
              className="hover:text-slate-200 flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              <span>Terms</span>
            </button>
            <button
              type="button"
              onClick={() => { soundEngine.playClickSound(); setActiveFooterDialog('Settings'); }}
              className="hover:text-slate-200 flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
            >
              <Settings className="w-3.5 h-3.5 text-slate-400" />
              <span>Settings</span>
            </button>
          </div>
        </footer>
      )}

      {/* Footer Modal Dialogs (AX Accessible) */}
      <AnimatePresence>
        {activeFooterDialog && (
          <>
            <motion.div
              aria-hidden="true"
              onClick={() => { soundEngine.playClickSound(); setActiveFooterDialog(null); }}
              className="fixed inset-0 z-[60] bg-slate-950/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="footer-dialog-title"
              className="fixed inset-0 z-[70] p-4 md:p-8 flex items-center justify-center pointer-events-none"
            >
              <motion.div
                className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden pointer-events-auto"
                initial={{ y: 15, opacity: 0, scale: 0.98 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 15, opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-start justify-between gap-4 border-b border-slate-800 p-5 md:p-6 bg-slate-950/60">
                  <div>
                    <h2 id="footer-dialog-title" className="text-xl font-bold text-slate-100">
                      {FOOTER_DIALOGS[activeFooterDialog].title}
                    </h2>
                    <p className="mt-1 text-xs text-slate-400">
                      {FOOTER_DIALOGS[activeFooterDialog].subtitle}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => { soundEngine.playClickSound(); setActiveFooterDialog(null); }}
                    className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500"
                    aria-label="Close dialog"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3 p-5 md:p-6 text-xs md:text-sm text-slate-300 leading-relaxed">
                  {FOOTER_DIALOGS[activeFooterDialog].body.map((paragraph, index) => (
                    <p key={`${activeFooterDialog}-p-${index}`}>{paragraph}</p>
                  ))}
                </div>

                <div className="flex justify-end border-t border-slate-800 p-4 bg-slate-950/60">
                  <button
                    type="button"
                    onClick={() => { soundEngine.playClickSound(); setActiveFooterDialog(null); }}
                    className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-semibold text-white hover:bg-blue-500 transition-colors focus-visible:ring-2 focus-visible:ring-blue-400"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
