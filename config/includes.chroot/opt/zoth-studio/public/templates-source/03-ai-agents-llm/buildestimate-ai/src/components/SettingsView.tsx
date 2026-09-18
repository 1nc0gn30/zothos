import { useState, useEffect } from 'react';
import { Key, Trash2, ExternalLink, Zap, Lock, ShieldCheck, Volume2, VolumeX, Keyboard, Cpu } from 'lucide-react';
import { getCustomApiKey, setCustomApiKey, clearCustomApiKey, getUsageCount } from '../lib/usage';
import { isSoundEnabled, setSoundEnabled, playToggleSound, playClickSound } from '../lib/sound';

interface SettingsViewProps {
  onOpenWaitlist?: () => void;
}

export function SettingsView({ onOpenWaitlist }: SettingsViewProps) {
  const [apiKey, setApiKey] = useState('');
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const [usage, setUsage] = useState(0);
  const [soundOn, setSoundOn] = useState(true);

  useEffect(() => {
    setSavedKey(getCustomApiKey());
    setUsage(getUsageCount());
    setSoundOn(isSoundEnabled());
  }, []);

  const handleSave = () => {
    if (apiKey.trim()) {
      playClickSound();
      setCustomApiKey(apiKey.trim());
      setSavedKey(apiKey.trim());
      setApiKey('');
    }
  };

  const handleClear = () => {
    playClickSound();
    clearCustomApiKey();
    setSavedKey(null);
  };

  const handleToggleSound = () => {
    const nextState = !soundOn;
    setSoundEnabled(nextState);
    setSoundOn(nextState);
    if (nextState) playToggleSound();
  };

  return (
    <div className="max-w-3xl space-y-8 animate-in fade-in duration-300">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 font-display tracking-tight">System Settings</h1>
        <p className="text-slate-500 text-sm font-medium">Configure API connectivity, audio feedback, and system preferences.</p>
      </header>

      {/* Audio & Accessibility Settings */}
      <div className="glass-card p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-50 text-accent-600 flex items-center justify-center">
              {soundOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 font-display">Audio Feedback (Web Audio API)</h2>
              <p className="text-xs text-slate-500">Play synthetic chime on estimate completion and button actions.</p>
            </div>
          </div>
          <button
            onClick={handleToggleSound}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all border ${
              soundOn
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
            }`}
            aria-label="Toggle Sound Effects"
          >
            {soundOn ? 'SOUND ON' : 'MUTED'}
          </button>
        </div>

        <div className="h-px bg-slate-100" />

        {/* Keyboard Hotkeys List */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <Keyboard className="w-4 h-4 text-slate-500" />
            <span>Accessibility Hotkeys</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
              <span className="text-slate-600">Estimator</span>
              <kbd className="bg-white border px-1.5 py-0.5 rounded font-mono font-bold text-slate-800">Alt + 1</kbd>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
              <span className="text-slate-600">Insights</span>
              <kbd className="bg-white border px-1.5 py-0.5 rounded font-mono font-bold text-slate-800">Alt + 2</kbd>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
              <span className="text-slate-600">Settings</span>
              <kbd className="bg-white border px-1.5 py-0.5 rounded font-mono font-bold text-slate-800">Alt + 3</kbd>
            </div>
          </div>
        </div>
      </div>

      {/* API Configuration Card */}
      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Key className="w-5 h-5 text-slate-900" />
            <h2 className="text-base font-bold text-slate-900 font-display">Gemini API Engine Configuration</h2>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 font-semibold">
            <Cpu className="w-3.5 h-3.5 text-emerald-600" />
            Offline Fallback Active
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="flex gap-4 p-4 bg-blue-50/60 border border-blue-200/80 rounded-2xl">
            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed text-blue-900">
              <span className="font-bold uppercase tracking-tight">BYOK Privacy Model:</span>
              <p className="opacity-90 mt-0.5">
                Your API key is stored locally in your browser's encrypted localStorage. If no key is entered, BuildEstimate AI automatically runs our calibrated offline estimation engine so you can test all features smoothly.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <label htmlFor="api-key-input" className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Gemini API Key (Optional Override)
            </label>

            {savedKey ? (
              <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <span className="text-xs font-mono text-slate-500 tracking-widest">••••••••••••••••••••</span>
                </div>
                <button 
                  onClick={handleClear}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Disconnect
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <div className="relative flex-1 group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    id="api-key-input"
                    type="password" 
                    placeholder="Enter Private Key (AIza...)"
                    className="w-full bg-white border border-slate-200 pl-11 pr-4 py-3 text-xs font-medium focus:border-slate-900 outline-none transition-all rounded-2xl"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                </div>
                <button 
                  onClick={handleSave}
                  disabled={!apiKey.trim()}
                  className="btn-primary py-3 px-6 text-xs uppercase tracking-wider font-bold disabled:opacity-40"
                >
                  Save Key
                </button>
              </div>
            )}
            
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors pt-1"
            >
              Get a free API key from Google AI Studio
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Pro Features CTA */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-500/10 blur-3xl rounded-full -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-500/20 border border-accent-500/30 text-accent-300 text-[10px] font-bold uppercase tracking-wider">
              <Zap className="w-3 h-3 text-accent-400" />
              Enterprise Edition
            </div>
            <h3 className="text-2xl font-bold font-display tracking-tight">BuildEstimate Pro</h3>
            <p className="text-slate-400 text-xs max-w-md leading-relaxed">
              Unlock PDF export generation, multi-user contractor workspaces, and direct Procore & QuickBooks synchronization.
            </p>
          </div>
          
          <button 
            onClick={() => {
              playClickSound();
              if (onOpenWaitlist) onOpenWaitlist();
            }}
            className="w-full md:w-auto px-6 py-3.5 bg-white text-slate-900 font-bold text-xs rounded-2xl hover:bg-slate-100 active:scale-95 transition-all uppercase tracking-wider shrink-0 shadow-md"
          >
            Join Pro Waitlist
          </button>
        </div>
      </div>
    </div>
  );
}
