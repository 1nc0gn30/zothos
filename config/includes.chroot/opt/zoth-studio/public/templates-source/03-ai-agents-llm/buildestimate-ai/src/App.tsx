import { useState, useEffect, useCallback } from 'react';
import { HardHat, Hammer, LayoutDashboard, Settings, ChevronRight, Sparkles, Info, Volume2, VolumeX } from 'lucide-react';
import { EstimatorForm } from './components/EstimatorForm';
import { AIResponseDisplay } from './components/AIResponseDisplay';
import { SettingsView } from './components/SettingsView';
import { SEOContent } from './components/SEOContent';
import { WaitlistModal } from './components/WaitlistModal';
import { AmbientCanvas } from './components/AmbientCanvas';
import { EstimateRequest, EstimateResponse } from './types';
import { executeEstimate, getUsageCount, hasCustomApiKey } from './lib/usage';
import { isSoundEnabled, setSoundEnabled, playToggleSound, playClickSound, playErrorSound } from './lib/sound';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';

type View = 'estimator' | 'seo' | 'settings';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('estimator');
  const [isLoading, setIsLoading] = useState(false);
  const [estimate, setEstimate] = useState<EstimateResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [usageCount, setUsageCount] = useState(0);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    setUsageCount(getUsageCount());
    setHasApiKey(hasCustomApiKey());
    setSoundOn(isSoundEnabled());
  }, [estimate]);

  const changeView = useCallback((view: View) => {
    playClickSound();
    setCurrentView(view);
    setAnnouncement(`Switched to ${view} view.`);
  }, []);

  const toggleAudio = useCallback(() => {
    const nextState = !soundOn;
    setSoundEnabled(nextState);
    setSoundOn(nextState);
    if (nextState) playToggleSound();
    setAnnouncement(nextState ? 'Audio enabled.' : 'Audio muted.');
  }, [soundOn]);

  // Global Keyboard Hotkey Listener (Alt+1, Alt+2, Alt+3, Alt+M)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey) {
        if (e.key === '1') {
          e.preventDefault();
          changeView('estimator');
        } else if (e.key === '2') {
          e.preventDefault();
          changeView('seo');
        } else if (e.key === '3') {
          e.preventDefault();
          changeView('settings');
        } else if (e.key.toLowerCase() === 'm') {
          e.preventDefault();
          toggleAudio();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [changeView, toggleAudio]);

  const handleGenerate = async (request: EstimateRequest) => {
    setIsLoading(true);
    setError(null);
    setAnnouncement('Generating project intelligence estimate...');
    try {
      const result = await executeEstimate(request);
      setEstimate(result);
      setAnnouncement(`Estimate generated successfully. Total cost: $${result.totalEstimate.toLocaleString()}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error(err);
      playErrorSound();
      setError('Failed to generate estimate. Please try again.');
      setAnnouncement('Estimate generation failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'settings':
        return <SettingsView onOpenWaitlist={() => setIsWaitlistOpen(true)} />;
      case 'seo':
        return <SEOContent />;
      case 'estimator':
      default:
        return (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            <div className="xl:col-span-4">
              <div className="glass-card p-6 sticky top-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 font-display">Project Parameters</h2>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Configuration Engine</p>
                  </div>
                  <div className={cn(
                    "text-[10px] font-bold px-2.5 py-1 rounded-full border",
                    hasApiKey 
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                      : "bg-blue-50 text-blue-700 border-blue-200"
                  )}>
                    {hasApiKey ? 'LIVE API ACTIVE' : 'OFFLINE CALIBRATED'}
                  </div>
                </div>
                <EstimatorForm onSubmit={handleGenerate} isLoading={isLoading} />
              </div>
            </div>
            
            <div className="xl:col-span-8">
              <AnimatePresence mode="wait">
                {estimate ? (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <AIResponseDisplay data={estimate} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-12 glass-card bg-white/70"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-slate-200/80 flex items-center justify-center mb-6">
                      <Sparkles className="w-8 h-8 text-accent-500" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 font-display">Ready for Intelligence Analysis</h3>
                    <p className="text-slate-500 max-w-xs text-xs leading-relaxed">
                      Select a 1-click preset or enter your custom project parameters to generate a high-fidelity estimate with 5-year ROI forecasts.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F1F1EF] text-slate-900 font-sans print:bg-white relative">
      {/* High-DPI Ambient Blueprint Canvas */}
      <AmbientCanvas />

      {/* Accessible Skip Navigation Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-6 focus:py-3 focus:bg-slate-900 focus:text-white focus:font-bold focus:rounded-xl focus:shadow-2xl focus:outline-none"
      >
        Skip to main content
      </a>

      {/* ARIA Live Region for Screen Readers */}
      <div aria-live="polite" className="sr-only">
        {announcement}
      </div>

      <WaitlistModal isOpen={isWaitlistOpen} onClose={() => setIsWaitlistOpen(false)} />
      
      {/* Sidebar Navigation */}
      <aside 
        className="hidden lg:flex w-64 flex-col bg-[#F1F1EF]/90 backdrop-blur-md p-6 border-r border-slate-200/80 print:hidden relative z-10"
        role="complementary"
        aria-label="Sidebar Navigation"
      >
        <div 
          className="flex items-center justify-between mb-10 cursor-pointer" 
          onClick={() => changeView('estimator')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && changeView('estimator')}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center shadow-lg">
              <HardHat className="text-white w-5 h-5" />
            </div>
            <div>
              <span className="font-display font-bold text-lg tracking-tight block leading-none">BuildEstimate</span>
              <span className="text-[9px] uppercase font-mono font-bold tracking-widest text-slate-400">AI Platform</span>
            </div>
          </div>
        </div>

        <nav className="space-y-1.5 flex-1" role="navigation" aria-label="Main Menu">
          <button 
            onClick={() => changeView('estimator')}
            aria-current={currentView === 'estimator' ? 'page' : undefined}
            className={cn(
              "w-full sidebar-item",
              currentView === 'estimator' ? "sidebar-item-active" : "sidebar-item-inactive"
            )}
          >
            <LayoutDashboard className="w-4 h-4" />
            Estimator
          </button>

          <button 
            onClick={() => changeView('seo')}
            aria-current={currentView === 'seo' ? 'page' : undefined}
            className={cn(
              "w-full sidebar-item",
              currentView === 'seo' ? "sidebar-item-active" : "sidebar-item-inactive"
            )}
          >
            <Info className="w-4 h-4" />
            Insights (AEO)
          </button>

          <button 
            onClick={() => changeView('settings')}
            aria-current={currentView === 'settings' ? 'page' : undefined}
            className={cn(
              "w-full sidebar-item",
              currentView === 'settings' ? "sidebar-item-active" : "sidebar-item-inactive"
            )}
          >
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </nav>

        {/* Audio Toggle & System Status */}
        <div className="mt-auto space-y-3">
          <button
            onClick={toggleAudio}
            className="w-full flex items-center justify-between p-3 bg-white/80 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-700 hover:bg-white transition-all"
            aria-label="Toggle Sound Effects"
          >
            <div className="flex items-center gap-2">
              {soundOn ? <Volume2 className="w-4 h-4 text-accent-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
              <span>Audio Effects</span>
            </div>
            <span className="text-[10px] uppercase font-mono text-slate-400">{soundOn ? 'ON' : 'OFF'}</span>
          </button>

          <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">System Status</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
              Calibrated Engine v2.4 Active. Market rates indexed for 2026.
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main 
        id="main-content" 
        className="flex-1 max-h-screen overflow-y-auto print:overflow-visible relative z-10 focus:outline-none"
        tabIndex={-1}
        role="main"
      >
        <header className="sticky top-0 z-20 bg-[#F1F1EF]/90 backdrop-blur-md px-6 py-4 flex items-center justify-between lg:hidden print:hidden border-b border-slate-200/80">
          <div className="flex items-center gap-2" onClick={() => changeView('estimator')}>
            <HardHat className="text-slate-900 w-6 h-6" />
            <span className="font-display font-bold text-lg">BuildEstimate</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleAudio} className="p-2 rounded-lg text-slate-600 hover:bg-slate-200/60" aria-label="Toggle audio">
              {soundOn ? <Volume2 className="w-5 h-5 text-accent-600" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
            </button>
            <button onClick={() => changeView('settings')} aria-label="Open settings">
              <Settings className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </header>

        <div className="max-w-6xl mx-auto p-6 lg:p-12 print:p-0">
          <div className="mb-8 print:hidden">
            <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2">
              <span>BuildEstimate</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-slate-900">{currentView}</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 font-display tracking-tight">
              {currentView === 'estimator' ? 'Construction Estimator & ROI Engine' : 
               currentView === 'settings' ? 'System Settings & API Setup' : 
               'Industry Intelligence & Research'}
            </h1>
            <p className="text-slate-500 mt-2 text-base font-medium max-w-2xl">
              {currentView === 'estimator' ? 'Generate high-fidelity cost projections, risk buffers, and 5-year ROI analyses.' : 
               currentView === 'settings' ? 'Configure Gemini API keys, audio feedback, and system preferences.' : 
               'Deep-dive into construction estimation algorithms, AEO insights, and contractor field data.'}
            </p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl flex items-center gap-3 text-xs font-semibold" role="alert">
              <Hammer className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
