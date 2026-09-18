import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles, Download, X, Settings, Wand2, ImageIcon, Check,
  AlertCircle, Loader2, ExternalLink,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAISettingsStore } from '../store/aiSettingsStore';

interface DigitalAssetModalProps {
  orderId: string;
  productNames: string[];
  avatarUrl?: string | null;
  isOpen: boolean;
  onClose: () => void;
  onGenerated?: () => void;
}

const STYLE_OPTIONS = [
  { id: 'abstract', label: 'Abstract', desc: 'Colorful geometric patterns' },
  { id: 'retro', label: 'Retro', desc: 'Vintage psychedelic vibes' },
  { id: 'cyberpunk', label: 'Cyberpunk', desc: 'Neon futuristic aesthetic' },
  { id: 'nature', label: 'Nature', desc: 'Organic flowing textures' },
  { id: 'minimal', label: 'Minimal', desc: 'Clean bold shapes' },
];

const DigitalAssetModal: React.FC<DigitalAssetModalProps> = ({
  orderId, productNames, avatarUrl, isOpen, onClose, onGenerated,
}) => {
  const [step, setStep] = useState<'generate' | 'settings' | 'result'>('generate');
  const [selectedStyle, setSelectedStyle] = useState('abstract');
  const [customPrompt, setCustomPrompt] = useState('');
  const [includeAvatar, setIncludeAvatar] = useState(true);
  const [includeLogo, setIncludeLogo] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);

  const aiSettings = useAISettingsStore();

  useEffect(() => {
    if (!isOpen || !orderId) return;
    checkExisting();
  }, [isOpen, orderId]);

  const checkExisting = async () => {
    const { data } = await supabase
      .from('ai_generations')
      .select('*')
      .eq('order_id', orderId)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .maybeSingle();
    if (data?.generated_asset_url) {
      setGeneratedUrl(data.generated_asset_url);
      setStep('result');
    }
  };

  const buildPrompt = () => {
    const names = productNames.join(', ');
    let base = customPrompt.trim() || `a premium digital collectible representing: ${names}`;
    const extras: string[] = [];
    if (includeAvatar && avatarUrl) extras.push('incorporating the user avatar character');
    if (includeLogo) extras.push('featuring the 757 Gas Shop cannabis leaf logo subtly integrated');
    if (extras.length > 0) base += `. ${extras.join(', ')}.`;
    return `${base} Style: ${selectedStyle}, vibrant, high quality digital art, artistic composition, no text, no watermark, premium collectible aesthetic.`;
  };

  const handleGenerate = async () => {
    setGenerating(true); setError(null);
    try {
      const prompt = buildPrompt();
      const res = await fetch('/api/ai-generation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: orderId, prompt, style: selectedStyle,
          provider: aiSettings.provider,
          avatar_url: avatarUrl, include_avatar: includeAvatar, include_logo: includeLogo,
          openai_api_key: aiSettings.openaiApiKey, openai_model: aiSettings.openaiModel,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed');
      setGeneratedUrl(data.asset_url); setStep('result'); onGenerated?.();
    } catch (err: any) { setError(err.message || 'Failed'); }
    finally { setGenerating(false); }
  };

  const handleDownload = () => {
    if (!generatedUrl) return;
    const a = document.createElement('a');
    a.href = generatedUrl;
    a.download = `757-gas-asset-${orderId.slice(-8)}.png`;
    a.target = '_blank';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
      >
        <div className="bg-card border border-border rounded-[2rem] shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto pointer-events-auto scrollbar-premium">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl"><Sparkles className="h-5 w-5 text-primary" /></div>
              <div>
                <h3 className="font-bold text-lg">Digital Asset</h3>
                <p className="text-xs text-muted-foreground">Powered by your AI key</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-muted rounded-xl transition-colors"><X className="h-5 w-5" /></button>
          </div>

          <div className="p-6">
            {step === 'generate' && (
              <div className="space-y-6">
                {/* Style selection */}
                <div>
                  <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">Pick a style</label>
                  <div className="grid grid-cols-2 gap-2">
                    {STYLE_OPTIONS.map(s => (
                      <button key={s.id} onClick={() => setSelectedStyle(s.id)}
                        className={`p-3 rounded-xl border-2 text-left transition-all duration-200 ${
                          selectedStyle === s.id ? 'border-primary bg-primary/10' : 'border-border/50 bg-muted/30 hover:border-primary/30'
                        }`}
                      >
                        <div className="font-bold text-sm">{s.label}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{s.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mashup toggles */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider block">Mashup elements</label>
                  <div className="flex flex-wrap gap-3">
                    <label className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      includeAvatar ? 'border-primary bg-primary/10' : 'border-border/50 bg-muted/30'
                    } ${!avatarUrl ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      <input type="checkbox" checked={includeAvatar} onChange={e => setIncludeAvatar(e.target.checked)} disabled={!avatarUrl} className="sr-only" />
                      <span className="text-sm font-semibold">My Avatar</span>
                      {avatarUrl && <img src={avatarUrl} alt="" className="h-5 w-5 rounded-full object-cover border border-white/20" />}
                    </label>
                    <label className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      includeLogo ? 'border-primary bg-primary/10' : 'border-border/50 bg-muted/30'
                    }`}>
                      <input type="checkbox" checked={includeLogo} onChange={e => setIncludeLogo(e.target.checked)} className="sr-only" />
                      <span className="text-sm font-semibold">757 Logo</span>
                      <img src="/757-Gas-Logo-Nav.png" alt="" className="h-5 w-5 object-contain" />
                    </label>
                  </div>
                </div>

                {/* Custom prompt */}
                <div>
                  <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Custom prompt (optional)</label>
                  <textarea value={customPrompt} onChange={e => setCustomPrompt(e.target.value)} placeholder="Describe what you want..." rows={2}
                    className="input-premium resize-none text-sm"
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-xl">
                    <AlertCircle className="h-4 w-4 shrink-0" />{error}
                  </div>
                )}

                <div className="flex gap-3">
                  <button onClick={() => setStep('settings')}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-border bg-muted/30 font-semibold text-sm hover:bg-muted transition-colors"
                  >
                    <Settings className="h-4 w-4" />AI Settings
                  </button>
                  <button onClick={handleGenerate} disabled={generating}
                    className="flex-1 flex items-center justify-center gap-2 btn-premium text-primary-foreground py-3 rounded-xl font-bold disabled:opacity-50"
                  >
                    {generating ? (
                      <><Loader2 className="h-5 w-5 animate-spin" />Creating...</>
                    ) : (
                      <><Wand2 className="h-5 w-5" />Generate Asset</>
                    )}
                  </button>
                </div>
              </div>
            )}

            {step === 'settings' && (
              <div className="space-y-5">
                <div>
                  <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Provider</label>
                  <select value={aiSettings.provider} onChange={e => aiSettings.setProvider(e.target.value as any)} className="input-premium">
                    <option value="pollinations">Pollinations.ai (free, no key)</option>
                    <option value="openai">OpenAI DALL-E (your key)</option>
                  </select>
                </div>

                {aiSettings.provider === 'openai' && (
                  <>
                    <div>
                      <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">OpenAI API Key</label>
                      <input type="password" value={aiSettings.openaiApiKey} onChange={e => aiSettings.setOpenaiApiKey(e.target.value)} placeholder="sk-..." className="input-premium" />
                      <p className="text-xs text-muted-foreground mt-1">Stored locally on your device only.</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Model</label>
                      <select value={aiSettings.openaiModel} onChange={e => aiSettings.setOpenaiModel(e.target.value)} className="input-premium">
                        <option value="dall-e-3">DALL-E 3</option>
                        <option value="dall-e-2">DALL-E 2</option>
                      </select>
                    </div>
                  </>
                )}

                <button onClick={() => setStep('generate')}
                  className="w-full flex items-center justify-center gap-2 btn-premium text-primary-foreground py-3 rounded-xl font-bold"
                >
                  <Check className="h-4 w-4" />Save Settings
                </button>
              </div>
            )}

            {step === 'result' && generatedUrl && (
              <div className="space-y-5">
                <div className="relative rounded-xl overflow-hidden border border-border bg-zinc-900">
                  <img src={generatedUrl} alt="Generated digital asset" className="w-full h-auto object-contain" loading="eager" />
                </div>
                <div className="flex gap-3">
                  <button onClick={handleDownload}
                    className="flex-1 flex items-center justify-center gap-2 btn-premium text-primary-foreground py-3 rounded-xl font-bold"
                  >
                    <Download className="h-5 w-5" />Download
                  </button>
                  <button onClick={() => window.open(generatedUrl, '_blank')}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-border bg-muted/30 font-semibold text-sm hover:bg-muted transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />Open
                  </button>
                </div>
                <button onClick={() => { setStep('generate'); setGeneratedUrl(null); }}
                  className="w-full text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
                >
                  Generate a different style
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DigitalAssetModal;
