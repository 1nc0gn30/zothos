import React, { useState, useRef, useEffect } from 'react';
import { 
  Tv, 
  X, 
  Sparkles, 
  RotateCcw, 
  Plus, 
  User, 
  Mic, 
  Code, 
  Star, 
  Rocket, 
  Shield, 
  Check, 
  Zap, 
  Share2, 
  Tag, 
  Clock, 
  Palette, 
  Play, 
  Sliders,
  CheckCircle2,
  Layers
} from 'lucide-react';
import { ProjectState } from '../../types/project';
import { TextOverlay } from '../../types/models';
import { 
  LowerThirdPreset, 
  LowerThirdTheme, 
  LOWER_THIRD_THEMES, 
  LOWER_THIRD_PRESET_METAS,
  createLowerThirdOverlay,
  drawLowerThirdOverlay 
} from '../../services/lowerThirdsService';
import { soundManager } from '../../services/audioService';

interface LowerThirdsModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectState;
  onAddOverlay: (overlay: TextOverlay) => void;
}

interface QuickTemplate {
  name: string;
  primary: string;
  secondary: string;
  tag: string;
  theme: LowerThirdTheme;
  icon?: 'user' | 'microphone' | 'sparkles' | 'code' | 'star' | 'rocket' | 'shield' | 'check' | 'zap';
  socialPlatform?: 'youtube' | 'github' | 'twitter' | 'generic';
  price?: string;
  originalPrice?: string;
}

const QUICK_TEMPLATES: Record<LowerThirdPreset, QuickTemplate[]> = {
  'speaker-pill': [
    {
      name: 'Keynote Speaker',
      primary: 'Alex Rivera',
      secondary: 'Chief Product Architect • Maya AI',
      tag: 'KEYNOTE',
      theme: 'indigo',
      icon: 'user',
    },
    {
      name: 'Podcast Host',
      primary: 'Sarah Connor',
      secondary: 'Host • The AI Builder Podcast',
      tag: 'HOST',
      theme: 'crimson',
      icon: 'microphone',
    },
    {
      name: 'Lead Developer',
      primary: 'David Miller',
      secondary: 'Core Contributor • OpenSource Studio',
      tag: 'DEV LEAD',
      theme: 'cyan',
      icon: 'code',
    },
  ],
  'tech-badge': [
    {
      name: 'WebGL Feature',
      primary: 'Zero-Latency WebGL Canvas',
      secondary: 'Real-time 60 FPS 4K compositing pipeline',
      tag: 'NEW FEATURE',
      theme: 'emerald',
      icon: 'sparkles',
    },
    {
      name: 'Linux Native',
      primary: 'Native Linux AppImage',
      secondary: 'Hardware-accelerated VA-API & NVENC encoding',
      tag: 'PERFORMANCE',
      theme: 'cyan',
      icon: 'zap',
    },
    {
      name: 'Privacy Core',
      primary: 'Zero Cloud Uploads',
      secondary: '100% on-device local video rendering engine',
      tag: 'PRIVACY FIRST',
      theme: 'violet',
      icon: 'shield',
    },
  ],
  'social-cta': [
    {
      name: 'YouTube Subscribe',
      primary: 'Maya Video Studio',
      secondary: 'Subscribe for weekly masterclasses & tutorials',
      tag: 'SUBSCRIBE',
      theme: 'crimson',
      socialPlatform: 'youtube',
    },
    {
      name: 'GitHub Star',
      primary: 'mayavideoeditor / maya',
      secondary: 'Star us on GitHub • Open-source on Linux',
      tag: 'STAR REPO',
      theme: 'amber',
      socialPlatform: 'github',
    },
    {
      name: 'Twitter / X Profile',
      primary: '@MayaVideoEditor',
      secondary: 'Follow for instant product updates & tips',
      tag: 'FOLLOW',
      theme: 'cyan',
      socialPlatform: 'twitter',
    },
  ],
  'launch-tag': [
    {
      name: 'Lifetime Special',
      primary: 'Maya Studio Pro Lifetime',
      secondary: 'All 3D Devices • 4K Export • No Watermark',
      tag: 'LAUNCH SALE',
      theme: 'amber',
      price: '$49',
      originalPrice: '$149',
    },
    {
      name: 'Early Adopter Pass',
      primary: 'Early Bird Creator Access 🚀',
      secondary: 'Instant access to neural voices & 3D frames',
      tag: 'EARLY BIRD',
      theme: 'violet',
      price: '$29',
      originalPrice: '$89',
    },
    {
      name: 'Pro Creator Bundle',
      primary: 'Studio Masterclass + Editor Suite',
      secondary: 'Full motion graphics library & CapCut export',
      tag: 'BUNDLE DEAL',
      theme: 'emerald',
      price: '$69',
      originalPrice: '$199',
    },
  ],
};

export const LowerThirdsModal: React.FC<LowerThirdsModalProps> = ({
  isOpen,
  onClose,
  project,
  onAddOverlay,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<LowerThirdPreset>('speaker-pill');
  const [primaryText, setPrimaryText] = useState('Alex Rivera');
  const [secondaryText, setSecondaryText] = useState('Chief Product Architect • Maya AI');
  const [tagText, setTagText] = useState('SPEAKER');
  const [theme, setTheme] = useState<LowerThirdTheme>('indigo');
  const [avatarIcon, setAvatarIcon] = useState<'user' | 'microphone' | 'sparkles' | 'code' | 'star' | 'rocket' | 'shield' | 'check' | 'zap'>('user');
  const [socialPlatform, setSocialPlatform] = useState<'youtube' | 'github' | 'twitter' | 'generic'>('youtube');
  const [price, setPrice] = useState('$49');
  const [originalPrice, setOriginalPrice] = useState('$149');
  const [duration, setDuration] = useState(4.0);
  const [positionPreset, setPositionPreset] = useState<'bottom-left' | 'bottom-center' | 'bottom-right' | 'top-left'>('bottom-left');
  const [animationStyle, setAnimationStyle] = useState<'slide-up' | 'scale-in' | 'bounce-in' | 'fade-slide'>('slide-up');

  // Preview canvas animation
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [animTime, setAnimTime] = useState(0.8);
  const [isLooping, setIsLooping] = useState(true);

  // Switch preset default values
  const handleSelectPreset = (preset: LowerThirdPreset) => {
    setSelectedPreset(preset);
    const meta = LOWER_THIRD_PRESET_METAS.find(p => p.id === preset) || LOWER_THIRD_PRESET_METAS[0];
    setPrimaryText(meta.defaultPrimary);
    setSecondaryText(meta.defaultSecondary);
    setTagText(meta.defaultTag);
    setTheme(meta.defaultTheme);
    setAvatarIcon(meta.defaultIcon);
    if (meta.defaultSocialPlatform) {
      setSocialPlatform(meta.defaultSocialPlatform);
    }
    if (preset === 'social-cta' || preset === 'launch-tag') {
      setPositionPreset('bottom-center');
    } else {
      setPositionPreset('bottom-left');
    }
    setAnimTime(0);
    soundManager.playPop();
  };

  const handleApplyQuickTemplate = (qt: QuickTemplate) => {
    setPrimaryText(qt.primary);
    setSecondaryText(qt.secondary);
    setTagText(qt.tag);
    setTheme(qt.theme);
    if (qt.icon) setAvatarIcon(qt.icon);
    if (qt.socialPlatform) setSocialPlatform(qt.socialPlatform);
    if (qt.price) setPrice(qt.price);
    if (qt.originalPrice) setOriginalPrice(qt.originalPrice);
    setAnimTime(0);
    soundManager.playDing();
  };

  const replayAnimation = () => {
    setAnimTime(0);
    soundManager.playWhoosh();
  };

  // Compute normalized coordinate based on placement selection
  const getCoordinates = (): { x: number; y: number } => {
    switch (positionPreset) {
      case 'bottom-left':
        return { x: 0.24, y: 0.85 };
      case 'bottom-center':
        return { x: 0.50, y: 0.85 };
      case 'bottom-right':
        return { x: 0.76, y: 0.85 };
      case 'top-left':
        return { x: 0.24, y: 0.18 };
      default:
        return { x: 0.50, y: 0.85 };
    }
  };

  // Real-time Canvas Rendering for Preview Box
  useEffect(() => {
    if (!isOpen) return;

    let animId: number;
    let lastTs = performance.now();

    const renderPreview = (now: number) => {
      const delta = (now - lastTs) / 1000;
      lastTs = now;

      if (isLooping) {
        setAnimTime((prev) => {
          const next = prev + delta;
          if (next > duration + 0.8) {
            return 0; // loop animation
          }
          return next;
        });
      }

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const w = canvas.width;
          const h = canvas.height;

          // Clear backdrop with studio preview background
          ctx.clearRect(0, 0, w, h);

          // Simulated studio video frame background
          const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, w / 1.5);
          bgGrad.addColorStop(0, '#1e293b');
          bgGrad.addColorStop(1, '#090d16');
          ctx.fillStyle = bgGrad;
          ctx.fillRect(0, 0, w, h);

          // Subtle studio viewport grid
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
          ctx.lineWidth = 1;
          const gridSize = 32;
          for (let x = 0; x < w; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
          }
          for (let y = 0; y < h; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
          }

          // Center Preview Mockup Text Overlay
          const previewOverlay: TextOverlay = {
            id: 'preview',
            startTime: 0,
            duration,
            text: primaryText,
            subtitle: secondaryText,
            tag: tagText,
            position: { x: 0.5, y: 0.5 }, // centered in preview canvas
            style: selectedPreset,
            lowerThirdPreset: selectedPreset,
            bgColor: LOWER_THIRD_THEMES[theme]?.gradientStart || '#6366F1',
            textColor: LOWER_THIRD_THEMES[theme]?.textColor || '#FFFFFF',
            fontSize: selectedPreset === 'speaker-pill' ? 22 : selectedPreset === 'tech-badge' ? 20 : 21,
            avatarIcon,
            socialPlatform,
            theme,
            animationStyle,
            accentColor: LOWER_THIRD_THEMES[theme]?.accent,
            price,
            originalPrice,
          };

          drawLowerThirdOverlay(ctx, w, h, previewOverlay, animTime);
        }
      }

      animId = requestAnimationFrame(renderPreview);
    };

    animId = requestAnimationFrame(renderPreview);
    return () => cancelAnimationFrame(animId);
  }, [
    isOpen,
    isLooping,
    duration,
    primaryText,
    secondaryText,
    tagText,
    selectedPreset,
    theme,
    avatarIcon,
    socialPlatform,
    price,
    originalPrice,
    animationStyle,
    animTime
  ]);

  if (!isOpen) return null;

  const handleAdd = () => {
    const playheadTime = project.currentSeconds || 0;
    const coords = getCoordinates();

    const newOverlay = createLowerThirdOverlay(
      selectedPreset,
      {
        primaryText,
        secondaryText,
        tagText,
        theme,
        avatarIcon,
        socialPlatform,
        position: coords,
        fontSize: selectedPreset === 'speaker-pill' ? 22 : selectedPreset === 'tech-badge' ? 20 : 21,
        animationStyle,
        price,
        originalPrice,
      },
      playheadTime,
      duration
    );

    onAddOverlay(newOverlay);
    soundManager.playDing();
    onClose();
  };

  const playheadSeconds = project.currentSeconds || 0;
  const playheadFormatted = `${Math.floor(playheadSeconds / 60)
    .toString()
    .padStart(2, '0')}:${(playheadSeconds % 60).toFixed(2).padStart(5, '0')}s`;

  return (
    <div className="fixed inset-0 bg-dark-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="w-[840px] max-h-[92vh] bg-dark-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 flex flex-col animate-in fade-in zoom-in-95 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center space-x-3 text-emerald-400 font-semibold">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <Tv className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base text-white font-bold">Broadcast Lower Thirds Studio</span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Motion Graphics
                </span>
              </div>
              <p className="text-xs text-slate-400 font-normal">
                Cinematic animated lower-thirds, speaker tags, social CTAs & SaaS launch ribbons.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Preset Styles Bar */}
        <div className="grid grid-cols-4 gap-2">
          {LOWER_THIRD_PRESET_METAS.map((preset) => {
            const isSelected = selectedPreset === preset.id;
            const themeCfg = LOWER_THIRD_THEMES[preset.defaultTheme];

            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset.id)}
                className={`p-3 rounded-2xl text-left border transition relative flex flex-col justify-between space-y-2 ${
                  isSelected
                    ? 'bg-dark-950 border-emerald-500/70 shadow-lg shadow-emerald-500/10 scale-[1.02]'
                    : 'bg-dark-950/60 border-slate-800 hover:border-slate-700 hover:bg-dark-950/90'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div 
                    className="w-7 h-7 rounded-lg flex items-center justify-center shadow-sm"
                    style={{
                      background: `linear-gradient(135deg, ${themeCfg.gradientStart}, ${themeCfg.gradientEnd})`
                    }}
                  >
                    {preset.id === 'speaker-pill' && <User className="w-3.5 h-3.5 text-white" />}
                    {preset.id === 'tech-badge' && <Zap className="w-3.5 h-3.5 text-white" />}
                    {preset.id === 'social-cta' && <Share2 className="w-3.5 h-3.5 text-white" />}
                    {preset.id === 'launch-tag' && <Tag className="w-3.5 h-3.5 text-white" />}
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  )}
                </div>

                <div>
                  <h4 className="text-xs font-bold text-white truncate">{preset.title}</h4>
                  <span className="text-[10px] text-slate-400 font-mono block truncate">{preset.badge}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Live Interactive Preview Box */}
        <div className="relative h-44 w-full bg-dark-950 rounded-2xl border border-slate-800 overflow-hidden shadow-inner flex flex-col justify-between">
          <canvas
            ref={canvasRef}
            width={790}
            height={176}
            className="w-full h-full block"
          />

          {/* Top overlay controls */}
          <div className="absolute top-2.5 left-3 right-3 flex items-center justify-between pointer-events-none">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded bg-dark-900/80 border border-slate-800 text-[10px] font-mono text-emerald-400 backdrop-blur">
                LIVE PREVIEW
              </span>
              <span className="px-2 py-0.5 rounded bg-dark-900/80 border border-slate-800 text-[10px] font-mono text-slate-400 backdrop-blur">
                {animTime.toFixed(2)}s / {duration.toFixed(1)}s
              </span>
            </div>

            <div className="flex items-center space-x-1.5 pointer-events-auto">
              <button
                onClick={replayAnimation}
                title="Replay Entrance Animation"
                className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-dark-900/90 hover:bg-slate-800 border border-slate-700 text-[11px] font-semibold text-white transition backdrop-blur shadow-sm active:scale-95"
              >
                <RotateCcw className="w-3 h-3 text-emerald-400" />
                <span>Replay Motion</span>
              </button>
            </div>
          </div>

          {/* Bottom quick template pills */}
          <div className="absolute bottom-2 left-3 right-3 flex items-center space-x-1.5 overflow-x-auto py-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 pr-1 flex items-center space-x-1 shrink-0">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Presets:</span>
            </span>
            {QUICK_TEMPLATES[selectedPreset]?.map((qt) => (
              <button
                key={qt.name}
                onClick={() => handleApplyQuickTemplate(qt)}
                className="px-2 py-0.5 rounded-md bg-dark-900/90 hover:bg-dark-800 border border-slate-700/80 text-[10px] text-slate-200 hover:text-white transition whitespace-nowrap backdrop-blur shrink-0"
              >
                {qt.name}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Form Customization Body */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4 max-h-[36vh]">
          {/* Main Text Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Primary Text */}
            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-semibold flex items-center justify-between">
                <span>Primary Title / Name</span>
                <span className="text-[10px] text-slate-400 font-normal">Bold headline</span>
              </label>
              <input
                type="text"
                value={primaryText}
                onChange={(e) => setPrimaryText(e.target.value)}
                placeholder="e.g. Alex Rivera or Feature Name"
                className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-slate-800 text-white text-xs font-medium focus:border-emerald-500 focus:outline-none transition"
              />
            </div>

            {/* Secondary Subtitle */}
            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-semibold flex items-center justify-between">
                <span>Subtitle / Role / Spec</span>
                <span className="text-[10px] text-slate-400 font-normal">Supporting context</span>
              </label>
              <input
                type="text"
                value={secondaryText}
                onChange={(e) => setSecondaryText(e.target.value)}
                placeholder="e.g. Chief Product Architect • Maya Labs"
                className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-slate-800 text-white text-xs font-medium focus:border-emerald-500 focus:outline-none transition"
              />
            </div>
          </div>

          {/* Second Row: Tag + Preset-specific fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Tag / Category Badge */}
            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-semibold">
                Badge / Tag Text
              </label>
              <input
                type="text"
                value={tagText}
                onChange={(e) => setTagText(e.target.value)}
                placeholder="e.g. SPEAKER, FEATURE, SALE"
                className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-slate-800 text-white text-xs font-medium focus:border-emerald-500 focus:outline-none transition"
              />
            </div>

            {/* Icon / Platform / Price */}
            {selectedPreset === 'speaker-pill' && (
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs text-slate-300 font-semibold">Avatar Icon</label>
                <div className="grid grid-cols-8 gap-1 bg-dark-950 p-1 rounded-xl border border-slate-800">
                  {(['user', 'microphone', 'code', 'sparkles', 'star', 'rocket', 'shield', 'check'] as const).map((ic) => (
                    <button
                      key={ic}
                      onClick={() => setAvatarIcon(ic)}
                      className={`py-1.5 rounded-lg flex items-center justify-center transition ${
                        avatarIcon === ic ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white hover:bg-dark-850'
                      }`}
                      title={ic}
                    >
                      {ic === 'user' && <User className="w-3.5 h-3.5" />}
                      {ic === 'microphone' && <Mic className="w-3.5 h-3.5" />}
                      {ic === 'code' && <Code className="w-3.5 h-3.5" />}
                      {ic === 'sparkles' && <Sparkles className="w-3.5 h-3.5" />}
                      {ic === 'star' && <Star className="w-3.5 h-3.5" />}
                      {ic === 'rocket' && <Rocket className="w-3.5 h-3.5" />}
                      {ic === 'shield' && <Shield className="w-3.5 h-3.5" />}
                      {ic === 'check' && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedPreset === 'social-cta' && (
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs text-slate-300 font-semibold">Platform & Button Style</label>
                <div className="grid grid-cols-3 gap-1.5 bg-dark-950 p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => {
                      setSocialPlatform('youtube');
                      setTagText('SUBSCRIBE');
                    }}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition ${
                      socialPlatform === 'youtube' ? 'bg-red-600 text-white shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>YouTube</span>
                  </button>
                  <button
                    onClick={() => {
                      setSocialPlatform('github');
                      setTagText('STAR REPO');
                    }}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition ${
                      socialPlatform === 'github' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>GitHub Star</span>
                  </button>
                  <button
                    onClick={() => {
                      setSocialPlatform('twitter');
                      setTagText('FOLLOW');
                    }}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition ${
                      socialPlatform === 'twitter' ? 'bg-sky-600 text-white shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>Twitter / X</span>
                  </button>
                </div>
              </div>
            )}

            {selectedPreset === 'launch-tag' && (
              <>
                <div className="space-y-1">
                  <label className="text-xs text-slate-300 font-semibold">Current Price</label>
                  <input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="$49"
                    className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-slate-800 text-white text-xs font-medium focus:border-emerald-500 focus:outline-none transition"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-300 font-semibold">Strikethrough Price</label>
                  <input
                    type="text"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    placeholder="$149"
                    className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-slate-800 text-white text-xs font-medium focus:border-emerald-500 focus:outline-none transition"
                  />
                </div>
              </>
            )}

            {selectedPreset === 'tech-badge' && (
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs text-slate-300 font-semibold">Card Accent Style</label>
                <div className="grid grid-cols-4 gap-1 bg-dark-950 p-1 rounded-xl border border-slate-800">
                  {(['sparkles', 'zap', 'shield', 'code'] as const).map((ic) => (
                    <button
                      key={ic}
                      onClick={() => setAvatarIcon(ic)}
                      className={`py-1.5 rounded-lg flex items-center justify-center space-x-1 text-xs capitalize transition ${
                        avatarIcon === ic ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {ic === 'sparkles' && <Sparkles className="w-3 h-3" />}
                      {ic === 'zap' && <Zap className="w-3 h-3" />}
                      {ic === 'shield' && <Shield className="w-3 h-3" />}
                      {ic === 'code' && <Code className="w-3 h-3" />}
                      <span>{ic}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Color Themes Grid */}
          <div className="space-y-1.5">
            <label className="text-xs text-slate-300 font-semibold flex items-center space-x-1">
              <Palette className="w-3.5 h-3.5 text-emerald-400" />
              <span>Color Gradient Theme</span>
            </label>
            <div className="grid grid-cols-7 gap-2">
              {(Object.keys(LOWER_THIRD_THEMES) as LowerThirdTheme[]).map((thmKey) => {
                const thm = LOWER_THIRD_THEMES[thmKey];
                const isSelected = theme === thmKey;
                return (
                  <button
                    key={thmKey}
                    onClick={() => setTheme(thmKey)}
                    className={`py-2 px-2 rounded-xl text-center border transition flex flex-col items-center space-y-1.5 ${
                      isSelected
                        ? 'bg-dark-950 border-emerald-400 ring-2 ring-emerald-500/20 scale-105 shadow-md'
                        : 'bg-dark-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div
                      className="w-6 h-6 rounded-full border border-white/20 shadow-sm"
                      style={{
                        background: `linear-gradient(135deg, ${thm.gradientStart}, ${thm.gradientEnd})`
                      }}
                    />
                    <span className="text-[10px] font-medium text-slate-300 truncate max-w-full">
                      {thm.name.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Animation & Timing & Placement */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 border-t border-slate-800/80">
            {/* Entrance Animation */}
            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-semibold">Entrance Motion</label>
              <div className="grid grid-cols-2 gap-1 bg-dark-950 p-1 rounded-xl border border-slate-800">
                {(['slide-up', 'scale-in', 'bounce-in', 'fade-slide'] as const).map((anim) => (
                  <button
                    key={anim}
                    onClick={() => {
                      setAnimationStyle(anim);
                      replayAnimation();
                    }}
                    className={`py-1 rounded-lg text-[10px] font-medium capitalize transition ${
                      animationStyle === anim ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {anim.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Canvas Placement */}
            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-semibold">Screen Position</label>
              <div className="grid grid-cols-2 gap-1 bg-dark-950 p-1 rounded-xl border border-slate-800">
                {(['bottom-left', 'bottom-center', 'bottom-right', 'top-left'] as const).map((pos) => (
                  <button
                    key={pos}
                    onClick={() => setPositionPreset(pos)}
                    className={`py-1 rounded-lg text-[10px] font-medium capitalize transition ${
                      positionPreset === pos ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {pos.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-300 font-semibold">
                <span className="flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-emerald-400" />
                  <span>On-screen Duration</span>
                </span>
                <span className="font-mono text-emerald-400">{duration.toFixed(1)}s</span>
              </div>
              <input
                type="range"
                min="1.5"
                max="8.0"
                step="0.5"
                value={duration}
                onChange={(e) => setDuration(parseFloat(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer mt-2"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-slate-400 text-xs font-mono">
            <span>Insert at Playhead:</span>
            <span className="px-2 py-0.5 rounded bg-dark-950 border border-slate-800 text-emerald-400 font-bold">
              {playheadFormatted}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-dark-950 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              className="flex items-center space-x-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 transition active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Insert Lower Third</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LowerThirdsModal;
