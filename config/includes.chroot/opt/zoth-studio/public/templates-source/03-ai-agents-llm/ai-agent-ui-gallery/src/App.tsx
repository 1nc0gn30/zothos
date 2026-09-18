import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  LayoutGrid, 
  Code as CodeIcon, 
  Settings, 
  Github, 
  ChevronLeft,
  ChevronRight,
  Info,
  X,
  Sparkles,
  Mic,
  Image as ImageIcon,
  FileText,
  Code as CodeIcon2,
  Search as SearchIcon,
  Languages,
  Palette,
  Layers,
  Volume2,
  VolumeX,
  SlidersHorizontal,
  Maximize2
} from "lucide-react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { chatbotVariants, ChatbotVariant, ChatbotCapability } from "./data/chatbotVariants";
import { ChatbotPreview } from "./components/ChatbotPreview";
import { CodeViewer } from "./components/CodeViewer";
import { WaitlistModal } from "./components/WaitlistModal";
import { Tooltip } from "./components/Tooltip";
import { VariantConfigViewer } from "./components/VariantConfigViewer";
import { PrivacyPage } from "./pages/PrivacyPage";
import { TermsPage } from "./pages/TermsPage";
import { ContactPage } from "./pages/ContactPage";
import { DocumentationPage } from "./pages/DocumentationPage";
import { UIKitPage } from "./pages/UIKitPage";
import { APIReferencePage } from "./pages/APIReferencePage";
import { CommunityPage } from "./pages/CommunityPage";
import { cn } from "./lib/utils";
import { sound } from "./lib/sound";

const CapabilityIcon = ({ capability, size = 16 }: { capability: ChatbotCapability; size?: number }) => {
  switch (capability) {
    case "voice": return <Mic size={size} />;
    case "vision": return <ImageIcon size={size} />;
    case "files": return <FileText size={size} />;
    case "code": return <CodeIcon2 size={size} />;
    case "search": return <SearchIcon size={size} />;
    case "translation": return <Languages size={size} />;
    case "creative": return <Palette size={size} />;
    default: return <Sparkles size={size} />;
  }
};

const CapabilityBadge = ({ capability }: { capability: ChatbotCapability }) => {
  const getIcon = () => {
    switch (capability) {
      case "voice": return <Mic size={12} />;
      case "vision": return <ImageIcon size={12} />;
      case "files": return <FileText size={12} />;
      case "code": return <CodeIcon2 size={12} />;
      case "search": return <SearchIcon size={12} />;
      case "translation": return <Languages size={12} />;
      case "creative": return <Palette size={12} />;
      default: return <Sparkles size={12} />;
    }
  };

  const getTooltipContent = () => {
    switch (capability) {
      case "voice": return "Real-time voice synthesis & acoustic modeling";
      case "vision": return "Advanced image analysis & neural OCR";
      case "files": return "Multi-format document & data processing";
      case "code": return "Live syntax highlighting & debugging";
      case "search": return "Live web search grounding";
      case "translation": return "Instant multi-language localization";
      case "creative": return "Generative art & copywriting";
      default: return "AI-powered reasoning";
    }
  };

  return (
    <Tooltip content={getTooltipContent()}>
      <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-slate-300 hover:bg-white/10 transition-colors cursor-help">
        {getIcon()}
        {capability}
      </div>
    </Tooltip>
  );
};

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStyleFilter, setSelectedStyleFilter] = useState<string>("all");
  const [showCode, setShowCode] = useState(false);
  const [showLearnMore, setShowLearnMore] = useState(false);
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [viewMode, setViewMode] = useState<"stage" | "grid">("stage");
  const [isMuted, setIsMuted] = useState(() => sound.getMuted());
  const [announcement, setAnnouncement] = useState("");
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const filteredVariants = chatbotVariants.filter(v => {
    const matchesSearch = 
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.style.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.capabilities.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStyle = selectedStyleFilter === "all" || v.style === selectedStyleFilter;

    return matchesSearch && matchesStyle;
  });

  const currentVariant = filteredVariants[currentIndex] || chatbotVariants[0];

  const announce = (msg: string) => {
    setAnnouncement(msg);
  };

  const nextVariant = () => {
    sound.playClick();
    setCurrentIndex((prev) => {
      const nextIdx = (prev + 1) % filteredVariants.length;
      announce(`Selected component ${nextIdx + 1} of ${filteredVariants.length}: ${filteredVariants[nextIdx]?.name}`);
      return nextIdx;
    });
  };

  const prevVariant = () => {
    sound.playClick();
    setCurrentIndex((prev) => {
      const prevIdx = (prev - 1 + filteredVariants.length) % filteredVariants.length;
      announce(`Selected component ${prevIdx + 1} of ${filteredVariants.length}: ${filteredVariants[prevIdx]?.name}`);
      return prevIdx;
    });
  };

  const toggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
    announce(muted ? "Sound effects muted" : "Sound effects enabled");
  };

  const toggleViewMode = () => {
    sound.playToggle();
    const newMode = viewMode === "stage" ? "grid" : "stage";
    setViewMode(newMode);
    announce(`Switched to ${newMode} view mode`);
  };

  // Keyboard navigation & accessibility hotkeys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        if (e.key === "Escape") {
          (e.target as HTMLElement).blur();
        }
        return;
      }

      if (e.key === "ArrowRight") nextVariant();
      if (e.key === "ArrowLeft") prevVariant();
      if (e.key === "/" || (e.ctrlKey && e.key === "k") || (e.metaKey && e.key === "k")) {
        e.preventDefault();
        searchInputRef.current?.focus();
        announce("Search input focused");
      }
      if (e.key === "Escape") {
        setShowLearnMore(false);
        setShowCode(false);
        setShowWaitlist(false);
      }
      if (e.altKey && e.key.toLowerCase() === "c") {
        e.preventDefault();
        setShowCode(prev => !prev);
        sound.playToggle();
      }
      if (e.altKey && e.key.toLowerCase() === "m") {
        e.preventDefault();
        toggleSound();
      }
      if (e.altKey && e.key.toLowerCase() === "g") {
        e.preventDefault();
        toggleViewMode();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [filteredVariants.length, viewMode]);

  const uniqueStyles = ["all", ...Array.from(new Set(chatbotVariants.map(v => v.style)))];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-blue-500/30 overflow-x-hidden relative">
      {/* Skip Navigation Link (AX WCAG 2.1 AA) */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-xl focus:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-400 font-bold"
      >
        Skip to main content
      </a>

      {/* ARIA Live Region for Screen Reader Announcements */}
      <div id="a11y-announcer" aria-live="polite" className="sr-only">
        {announcement}
      </div>

      <Routes>
        <Route path="/" element={
          <>
            {/* Background Atmosphere */}
            <div className="fixed inset-0 pointer-events-none z-0">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[600px] bg-blue-600/10 blur-[140px] opacity-60" />
              <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-600/5 blur-[120px]" />
              <div className="absolute top-[20%] left-[-10%] w-[300px] h-[300px] bg-purple-600/5 blur-[100px]" />
            </div>

            {/* Navigation Header */}
            <nav role="navigation" aria-label="Main navigation" className="border-b border-white/5 bg-[#020617]/80 backdrop-blur-md sticky top-0 z-50">
              <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">
                <Link to="/" className="flex items-center gap-2 group shrink-0" onClick={() => sound.playClick()}>
                  <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:rotate-6 transition-transform">
                    <Sparkles size={18} className="text-white" />
                  </div>
                  <span className="font-bold text-lg tracking-tight text-white hidden xs:block">AgentUI<span className="text-blue-500">.</span></span>
                </Link>

                <div className="flex-1 max-w-md">
                  <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={14} />
                    <Tooltip content="Search styles or capabilities (Press / or Ctrl+K)" position="bottom">
                      <input 
                        ref={searchInputRef}
                        type="text" 
                        placeholder="Search 50+ components... (/)" 
                        value={searchQuery}
                        aria-label="Search components by name, style, or capability"
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setCurrentIndex(0);
                        }}
                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-slate-600"
                      />
                    </Tooltip>
                  </div>
                </div>

                <div className="flex items-center gap-2 md:gap-3 shrink-0">
                  <Tooltip content={isMuted ? "Unmute Sound Effects [Alt+M]" : "Mute Sound Effects [Alt+M]"}>
                    <button
                      onClick={toggleSound}
                      aria-label={isMuted ? "Unmute sound effects" : "Mute sound effects"}
                      className="p-2 text-slate-400 hover:text-white bg-white/5 border border-white/10 rounded-xl transition-all hover:bg-white/10"
                    >
                      {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} className="text-blue-400" />}
                    </button>
                  </Tooltip>

                  <Tooltip content={viewMode === "stage" ? "Switch to Grid Explorer [Alt+G]" : "Switch to Stage View [Alt+G]"}>
                    <button
                      onClick={toggleViewMode}
                      aria-label={viewMode === "stage" ? "Switch to Grid Explorer view" : "Switch to Stage View"}
                      className={cn(
                        "p-2 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider",
                        viewMode === "grid" 
                          ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20" 
                          : "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10"
                      )}
                    >
                      <LayoutGrid size={18} />
                      <span className="hidden sm:inline">{viewMode === "stage" ? "Grid" : "Stage"}</span>
                    </button>
                  </Tooltip>

                  <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-white transition-colors hidden md:block" title="GitHub"><Github size={20} /></a>
                  <Tooltip content="Unlock premium components">
                    <button 
                      onClick={() => {
                        sound.playClick();
                        setShowWaitlist(true);
                      }}
                      className="bg-white text-slate-950 px-4 py-2 rounded-xl text-xs md:text-sm font-black uppercase tracking-widest hover:bg-slate-200 transition-all shadow-lg active:scale-95"
                    >
                      Pro <span className="hidden sm:inline">Access</span>
                    </button>
                  </Tooltip>
                </div>
              </div>
            </nav>

            {/* Main Stage & Explorer Content */}
            <main id="main-content" role="main" tabIndex={-1} className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-16 relative z-10 focus:outline-none">
              
              {/* Category Filter Pills Bar */}
              <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1 shrink-0 mr-2">
                  <SlidersHorizontal size={12} /> Filter Style:
                </span>
                {uniqueStyles.map(st => (
                  <button
                    key={st}
                    onClick={() => {
                      sound.playClick();
                      setSelectedStyleFilter(st);
                      setCurrentIndex(0);
                    }}
                    className={cn(
                      "px-3.5 py-1.5 rounded-full text-xs font-bold capitalize transition-all shrink-0 border",
                      selectedStyleFilter === st
                        ? "bg-blue-600/20 border-blue-500/50 text-blue-400 shadow-md shadow-blue-500/10"
                        : "bg-slate-900/50 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                    )}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {viewMode === "stage" ? (
                <div className="grid lg:grid-cols-12 gap-12 md:gap-20 items-start">
                  
                  {/* Left Column: Info & Controls */}
                  <div className="lg:col-span-5 space-y-10 md:sticky md:top-28">
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 text-blue-500 font-bold text-[10px] uppercase tracking-[0.2em] bg-blue-500/5 self-start px-3 py-1 rounded-full border border-blue-500/10">
                        <LayoutGrid size={12} />
                        Component {currentIndex + 1} / {filteredVariants.length}
                      </div>
                
                <div className="space-y-4">
                  <motion.h1 
                    key={currentVariant.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-[0.85] text-gradient"
                  >
                    {currentVariant.name}
                  </motion.h1>
                  <div className="flex flex-wrap gap-2">
                    {currentVariant.capabilities.map(cap => (
                      <CapabilityBadge key={cap} capability={cap} />
                    ))}
                  </div>
                </div>

                <motion.p 
                  key={`desc-${currentVariant.id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-lg text-slate-400 leading-relaxed max-w-md font-medium"
                >
                  {currentVariant.description}
                </motion.p>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="px-4 py-2 bg-slate-900 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 shadow-inner">
                  <Layers size={14} className="text-blue-500" />
                  {currentVariant.style}
                </div>
                <div className="px-4 py-2 bg-slate-900 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono shadow-inner">
                  {currentVariant.theme.fontFamily.replace('font-', '')}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
                <div className="flex gap-2 justify-center">
                  <Tooltip content="Previous Variant (Left Arrow)">
                    <button 
                      onClick={prevVariant}
                      aria-label="Previous component variant"
                      className="w-14 h-14 rounded-[20px] border border-white/5 bg-slate-900 flex items-center justify-center hover:bg-white hover:text-black transition-all active:scale-90 shadow-xl group focus:ring-2 focus:ring-blue-500"
                    >
                      <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                  </Tooltip>
                  <Tooltip content="Next Variant (Right Arrow)">
                    <button 
                      onClick={nextVariant}
                      aria-label="Next component variant"
                      className="w-14 h-14 rounded-[20px] border border-white/5 bg-slate-900 flex items-center justify-center hover:bg-white hover:text-black transition-all active:scale-90 shadow-xl group focus:ring-2 focus:ring-blue-500"
                    >
                      <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Tooltip>
                </div>
                <div className="flex-1 flex gap-2">
                  <Tooltip content="Copy production-ready code [Alt+C]">
                    <button 
                      onClick={() => {
                        sound.playToggle();
                        setShowCode(!showCode);
                      }}
                      className={cn(
                        "flex-1 h-14 rounded-[20px] font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl focus:ring-2 focus:ring-blue-500",
                        showCode ? "bg-blue-600 text-white" : "bg-slate-900 border border-white/5 text-white hover:bg-slate-800"
                      )}
                    >
                      <CodeIcon size={18} />
                      {showCode ? "Hide Snippet" : "Get Snippet"}
                    </button>
                  </Tooltip>
                  <Tooltip content="View detailed specs">
                    <button 
                      onClick={() => {
                        sound.playClick();
                        setShowLearnMore(true);
                      }}
                      aria-label="View component details"
                      className="w-14 h-14 rounded-[20px] bg-slate-900 border border-white/5 text-white hover:bg-slate-800 flex items-center justify-center transition-all active:scale-95 shadow-xl focus:ring-2 focus:ring-blue-500"
                    >
                      <Info size={18} />
                    </button>
                  </Tooltip>
                </div>
              </div>

              <div className="p-8 glass-panel rounded-[32px] space-y-4 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full" />
                <div className="flex items-center gap-3 text-blue-400 font-bold text-xs uppercase tracking-widest">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Sparkles size={16} />
                  </div>
                  Component Specs
                </div>
                <p className="text-sm text-slate-400 leading-relaxed font-medium">
                  Optimized for <span className="text-white font-bold">React 19</span> and <span className="text-white font-bold">Tailwind v4</span>. 
                  Includes modular state management and context-aware transitions.
                </p>
                <div className="flex items-center gap-4 pt-2">
                  <div className="flex -space-x-2">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center overflow-hidden">
                        <img src={`https://picsum.photos/seed/user${i}/32/32`} alt="user avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">2.4k+ developers integrated</span>
                </div>
              </div>
            </div>

            {/* Right Column: Preview Area */}
            <div className="lg:col-span-7 space-y-12">
              <div className="relative aspect-square md:aspect-[4/3] bg-slate-950/50 rounded-[48px] border border-white/5 overflow-hidden shadow-2xl glass-panel group">
                {/* Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px]"></div>
                <div className="absolute inset-0 bg-radial-gradient from-blue-600/5 via-transparent to-transparent"></div>
                
                <div className="absolute inset-0 flex items-center justify-center p-8 md:p-12">
                  <div className="text-center space-y-8">
                    <motion.div 
                      key={`icon-${currentVariant.id}`}
                      initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
                      animate={{ scale: 1, opacity: 1, rotate: 0 }}
                      className={cn(
                        "w-24 h-24 md:w-40 md:h-40 mx-auto rounded-[40px] md:rounded-[56px] flex items-center justify-center text-white shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative",
                        currentVariant.theme.primary
                      )}
                    >
                      <currentVariant.icon size={64} className="md:size-20" />
                      <div className="absolute -bottom-3 -right-3 w-12 h-12 md:w-16 md:h-16 bg-white rounded-2xl md:rounded-3xl flex items-center justify-center text-slate-950 shadow-2xl border-4 border-slate-950">
                        <CapabilityIcon capability={currentVariant.capabilities[0]} size={24} />
                      </div>
                    </motion.div>
                    <div className="space-y-3">
                      <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase italic">Interactive Stage Preview</h2>
                      <p className="text-slate-500 text-sm md:text-lg font-medium tracking-tight">Test the <span className="text-blue-400 capitalize font-bold">{currentVariant.style}</span> architecture in real-time. Click the floating chat button bottom-right!</p>
                    </div>
                  </div>
                </div>

                {/* The actual floating chatbot widget */}
                <ChatbotPreview key={currentVariant.id} variant={currentVariant} />
              </div>

              <AnimatePresence>
                {showCode && (
                  <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 30, scale: 0.98 }}
                    className="relative"
                  >
                    <div className="absolute -top-3 left-10 px-4 py-1.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full z-10 shadow-lg">
                      Production Source
                    </div>
                    <CodeViewer variant={currentVariant} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        ) : (
          /* Grid Explorer View Mode (Showing all 50 Component Cards) */
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-white uppercase italic">
                  Component <span className="text-gradient">Explorer</span>
                </h2>
                <p className="text-slate-400 text-sm mt-1">Showing {filteredVariants.length} plug-and-play AI UI variants</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVariants.map((variant, idx) => {
                const IconComp = variant.icon;
                return (
                  <motion.div
                    key={variant.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(idx * 0.03, 0.5) }}
                    className="glass-card p-6 rounded-3xl flex flex-col justify-between space-y-6 group hover:scale-[1.02] transition-all cursor-pointer relative overflow-hidden"
                    onClick={() => {
                      sound.playClick();
                      setCurrentIndex(chatbotVariants.findIndex(v => v.id === variant.id));
                      setViewMode("stage");
                    }}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg", variant.theme.primary)}>
                          <IconComp size={24} />
                        </div>
                        <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-400">
                          {variant.style}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                          {variant.name}
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed mt-1 line-clamp-2">
                          {variant.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {variant.capabilities.map(cap => (
                          <span key={cap} className="px-2 py-0.5 bg-slate-900 border border-white/5 rounded-md text-[9px] font-mono text-slate-300 uppercase">
                            {cap}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-bold text-blue-400 group-hover:translate-x-1 transition-transform">
                      <span>Launch Preview Stage →</span>
                      <Maximize2 size={14} />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </>
  } />
  <Route path="/privacy" element={<PrivacyPage />} />
  <Route path="/terms" element={<TermsPage />} />
  <Route path="/contact" element={<ContactPage />} />
  <Route path="/documentation" element={<DocumentationPage />} />
  <Route path="/ui-kit" element={<UIKitPage />} />
  <Route path="/api-reference" element={<APIReferencePage />} />
  <Route path="/community" element={<CommunityPage onJoinClick={() => setShowWaitlist(true)} />} />
</Routes>

      {/* Learn More Modal */}
      <AnimatePresence>
        {showLearnMore && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLearnMore(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              role="dialog"
              aria-modal="true"
              aria-labelledby="learn-more-title"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-[32px] overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-8 md:p-12 space-y-8">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">
                      AI Component Details
                    </div>
                    <h2 id="learn-more-title" className="text-4xl font-black tracking-tighter uppercase italic">{currentVariant.name}</h2>
                  </div>
                  <button 
                    onClick={() => {
                      sound.playClick();
                      setShowLearnMore(false);
                    }}
                    aria-label="Close modal"
                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-widest text-blue-500 mb-3">Capabilities</h3>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        {currentVariant.capabilitiesDescription}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-widest text-blue-500 mb-3">Use Cases</h3>
                      <ul className="space-y-2">
                        {currentVariant.useCases.map((useCase, idx) => (
                          <li key={idx} className="text-sm text-slate-300 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            {useCase}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-widest text-rose-500 mb-3">Limitations</h3>
                      <ul className="space-y-2">
                        {currentVariant.limits.map((limit, idx) => (
                          <li key={idx} className="text-sm text-slate-400 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-rose-500/50" />
                            {limit}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                      <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Design Style</h3>
                      <p className="text-xs text-slate-400 leading-relaxed italic">
                        The "{currentVariant.style}" aesthetic focuses on {
                          currentVariant.style === 'glass' ? 'transparency, depth, and glassmorphic blurs' :
                          currentVariant.style === 'brutalist' ? 'raw structure and high contrast borders' :
                          currentVariant.style === 'minimal' ? 'clarity, high readability, and whitespace' :
                          'visual impact and unique interaction patterns'
                        }.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Config Viewer */}
                <div className="pt-8 border-t border-white/5">
                  <VariantConfigViewer variant={currentVariant} />
                </div>

                <div className="pt-8 border-t border-white/5 flex justify-end">
                  <button 
                    onClick={() => {
                      sound.playClick();
                      setShowLearnMore(false);
                    }}
                    className="px-8 py-3 bg-blue-600 text-white rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-blue-500 transition-all focus:ring-2 focus:ring-blue-400"
                  >
                    Got it
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer role="contentinfo" className="border-t border-white/5 pt-16 pb-32 mt-24 bg-black/20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
          <div className="col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <Sparkles className="text-blue-500" />
              <span className="font-bold text-xl text-white">AgentUI Gallery</span>
            </div>
            <p className="text-slate-500 max-w-sm leading-relaxed">
              The premier open-source collection of AI agent interfaces. 
              Engineered for React 19, Tailwind CSS v4, and modern Answer Engine Optimization (AEO).
            </p>
            <div className="flex items-center gap-4">
              <Tooltip content="Star on GitHub">
                <a href="https://github.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"><Github size={18} /></a>
              </Tooltip>
              <Tooltip content="Portfolio Showcase">
                <a href="https://nealfrazier.tech" target="_blank" rel="noreferrer" className="px-3 py-2 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-bold hover:bg-blue-600/20 transition-all">nealfrazier.tech</a>
              </Tooltip>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-white font-bold text-sm uppercase tracking-widest">Resources</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><Tooltip content="Guides & Tutorials"><Link to="/documentation" className="hover:text-white transition-colors">Documentation</Link></Tooltip></li>
              <li><Tooltip content="Design System Specs"><Link to="/ui-kit" className="hover:text-white transition-colors">UI Kit</Link></Tooltip></li>
              <li><Tooltip content="SDK & Data Models"><Link to="/api-reference" className="hover:text-white transition-colors">API Reference</Link></Tooltip></li>
              <li><Tooltip content="Join the Discussion"><Link to="/community" className="hover:text-white transition-colors">Community</Link></Tooltip></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-white font-bold text-sm uppercase tracking-widest">AEO & Legal</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><a href="/llms.txt" target="_blank" className="hover:text-white transition-colors font-mono text-xs">/llms.txt (AI Manifest)</a></li>
              <li><a href="/ai.txt" target="_blank" className="hover:text-white transition-colors font-mono text-xs">/ai.txt</a></li>
              <li><a href="/sitemap.xml" target="_blank" className="hover:text-white transition-colors font-mono text-xs">/sitemap.xml</a></li>
              <li><Tooltip content="Data Protection"><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></Tooltip></li>
              <li><Tooltip content="Usage Guidelines"><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></Tooltip></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-16 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600">
          <p>© 2026 AgentUI Gallery. Handcrafted for AI developers by Tech Pro (nealfrazier.tech).</p>
          <div className="flex gap-6">
            <span>Built with React 19</span>
            <span>Tailwind CSS v4</span>
            <span>Powered by Gemini & OpenAI</span>
          </div>
        </div>
      </footer>

      <WaitlistModal isOpen={showWaitlist} onClose={() => setShowWaitlist(false)} />
    </div>
  );
}
