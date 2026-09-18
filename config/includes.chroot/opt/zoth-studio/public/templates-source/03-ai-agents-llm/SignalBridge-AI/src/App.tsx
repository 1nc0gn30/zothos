import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Shield, Zap, MessageSquare, Code, Lock, Cpu, ArrowRight, Github, Globe, Terminal, 
  Keyboard, Volume2, VolumeX, Menu, X, CheckCircle, ExternalLink 
} from "lucide-react";
import { generateLandingImage } from "./lib/gemini";
import { soundFx } from "./lib/audio";
import { InteractiveSimulator } from "./components/InteractiveSimulator";
import { HowToSection } from "./components/HowToSection";
import { FAQSection } from "./components/FAQSection";
import { KeyboardShortcutsModal } from "./components/KeyboardShortcutsModal";

// Navbar Component
const Navbar = ({ 
  onPrimaryAction, 
  onOpenShortcuts 
}: { 
  onPrimaryAction: () => void; 
  onOpenShortcuts: () => void;
}) => {
  const [isMuted, setIsMuted] = useState(soundFx.isMuted());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleAudio = () => {
    const muted = soundFx.toggleMute();
    setIsMuted(muted);
  };

  return (
    <header role="banner" className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-4">
      <nav 
        role="navigation" 
        aria-label="Main Navigation" 
        className="max-w-7xl mx-auto flex items-center justify-between glass px-6 py-3.5 rounded-2xl shadow-[0_20px_60px_rgba(7,11,22,0.65)] border-white/15"
      >
        <div className="flex items-center gap-3">
          <a href="#" className="flex items-center gap-2.5 focus-visible:ring-2 focus-visible:ring-signal-blue focus-visible:outline-none rounded-lg p-1">
            <div className="w-9 h-9 bg-gradient-to-br from-signal-blue to-blue-500 rounded-xl flex items-center justify-center shadow-[0_6px_20px_rgba(44,107,237,0.45)]">
              <MessageSquare className="text-white w-5 h-5" />
            </div>
            <span className="font-display font-extrabold text-xl tracking-tight text-white">SignalBridge</span>
          </a>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-300">
          <a href="#simulator" onClick={() => soundFx.playClick()} className="hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-signal-blue focus-visible:outline-none rounded-md px-1.5 py-0.5">Live Playground</a>
          <a href="#features" onClick={() => soundFx.playClick()} className="hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-signal-blue focus-visible:outline-none rounded-md px-1.5 py-0.5">Features</a>
          <a href="#how-it-works" onClick={() => soundFx.playClick()} className="hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-signal-blue focus-visible:outline-none rounded-md px-1.5 py-0.5">Architecture</a>
          <a href="#security" onClick={() => soundFx.playClick()} className="hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-signal-blue focus-visible:outline-none rounded-md px-1.5 py-0.5">Security</a>
          <a href="#faq" onClick={() => soundFx.playClick()} className="hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-signal-blue focus-visible:outline-none rounded-md px-1.5 py-0.5">FAQ</a>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleAudio}
            className="p-2 rounded-xl glass hover:bg-white/10 text-gray-300 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-signal-blue focus-visible:outline-none"
            aria-label={isMuted ? "Unmute sound effects" : "Mute sound effects"}
            title="Toggle Web Audio SFX (M)"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              onOpenShortcuts();
            }}
            className="p-2 rounded-xl glass hover:bg-white/10 text-gray-300 hover:text-white transition-colors hidden sm:block focus-visible:ring-2 focus-visible:ring-signal-blue focus-visible:outline-none"
            aria-label="View keyboard shortcuts"
            title="Keyboard Shortcuts (?)"
          >
            <Keyboard className="w-4 h-4 text-signal-blue" />
          </button>

          <button 
            onClick={() => {
              soundFx.playClick();
              onPrimaryAction();
            }} 
            className="bg-signal-blue hover:bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all transform hover:scale-105 shadow-[0_10px_28px_rgba(44,107,237,0.45)] focus-visible:ring-2 focus-visible:ring-signal-blue focus-visible:outline-none"
          >
            Get Started
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl glass text-gray-300 hover:text-white focus-visible:ring-2 focus-visible:ring-signal-blue focus-visible:outline-none"
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden mt-2 max-w-7xl mx-auto glass rounded-2xl p-4 space-y-3 font-semibold text-sm border-white/15"
          >
            <a 
              href="#simulator" 
              onClick={() => setMobileMenuOpen(false)} 
              className="block p-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg"
            >
              Live Playground
            </a>
            <a 
              href="#features" 
              onClick={() => setMobileMenuOpen(false)} 
              className="block p-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg"
            >
              Features
            </a>
            <a 
              href="#how-it-works" 
              onClick={() => setMobileMenuOpen(false)} 
              className="block p-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg"
            >
              Architecture
            </a>
            <a 
              href="#security" 
              onClick={() => setMobileMenuOpen(false)} 
              className="block p-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg"
            >
              Security
            </a>
            <a 
              href="#faq" 
              onClick={() => setMobileMenuOpen(false)} 
              className="block p-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg"
            >
              FAQ
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

// Hero Section Component
const Hero = ({ onPrimaryAction }: { onPrimaryAction: () => void }) => {
  const [heroImage, setHeroImage] = useState<string | null>(null);

  useEffect(() => {
    generateLandingImage(
      "A sleek 3D visualization of a secure Signal messaging interface connecting to a neural network of local AI agents. Luminous blue accents, high-tech zero-knowledge ecosystem."
    ).then(setHeroImage);
  }, []);

  return (
    <section className="relative pt-36 pb-20 px-6 overflow-hidden" aria-label="Introduction">
      <div className="absolute -top-16 -left-16 h-72 w-72 rounded-full bg-signal-blue/20 blur-3xl pointer-events-none" />
      <div className="absolute top-20 right-0 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-signal-blue/15 border border-signal-blue/30 text-signal-blue text-xs font-extrabold mb-6">
            <Zap className="w-3.5 h-3.5 animate-pulse" />
            <span>LOCAL-FIRST ZERO-KNOWLEDGE GATEWAY</span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-extrabold leading-tight mb-6 text-white tracking-tight">
            Your Signal. <br />
            <span className="text-gradient">Your Local AI.</span>
          </h1>

          <p className="text-gray-300 text-lg md:text-xl max-w-xl mb-8 leading-relaxed">
            Connect your private Signal messages directly to self-hosted LLMs (Ollama, Llama 3.3, DeepSeek R1) and custom local agents. 100% end-to-end encrypted, zero middleman data leakage.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <button 
              onClick={() => {
                soundFx.playClick();
                onPrimaryAction();
              }} 
              className="bg-signal-blue hover:bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all group shadow-[0_16px_36px_rgba(44,107,237,0.4)] focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
            >
              <span>Launch Playground</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <a 
              href="https://nullai.tech" 
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundFx.playClick()}
              className="glass hover:bg-white/10 text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all border-white/20 focus-visible:ring-2 focus-visible:ring-signal-blue focus-visible:outline-none"
            >
              <span>Portfolio Showcase</span>
              <ExternalLink className="w-4 h-4 text-cyan-400" />
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-gray-400 text-sm font-medium">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Signal Protocol E2EE</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>Open Source</span>
            </div>
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-signal-blue" />
              <span>Local Hardware First</span>
            </div>
          </div>
        </motion.div>

        {/* Hero Artwork Frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative"
        >
          <div className="absolute -inset-4 bg-signal-blue/20 blur-3xl rounded-full opacity-60" />
          <div className="relative glass rounded-3xl p-2.5 aspect-video overflow-hidden shadow-2xl border-white/20">
            {heroImage ? (
              <img 
                src={heroImage} 
                alt="SignalBridge AI Architecture Visualizer" 
                className="w-full h-full object-cover rounded-2xl"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full bg-signal-surface animate-pulse flex items-center justify-center">
                <Cpu className="w-12 h-12 text-signal-blue/40" />
              </div>
            )}
          </div>

          {/* Floating UI Badge */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-6 -right-6 glass p-4 rounded-2xl shadow-2xl hidden md:block border-white/20 bg-black/60"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                <Shield className="text-emerald-400 w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Tunnel Active</p>
                <p className="text-[10px] font-mono text-emerald-400">0 Outbound Cloud Keys</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// Feature Card Component
const FeatureCard = ({
  icon: Icon,
  title,
  description,
  delay,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="glass p-8 rounded-3xl border-white/10 hover:border-signal-blue/40 transition-all duration-300 group hover:-translate-y-1"
  >
    <div className="w-14 h-14 bg-signal-blue/15 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-signal-blue/30 transition-colors">
      <Icon className="text-signal-blue w-7 h-7" />
    </div>
    <h3 className="font-display font-bold text-2xl mb-4 text-white">{title}</h3>
    <p className="text-gray-300 leading-relaxed">{description}</p>
  </motion.div>
);

const Features = () => (
  <section id="features" className="py-24 px-6 bg-signal-dark/60">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-20">
        <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 text-white">
          Built for Privacy, <br />
          <span className="text-gradient">Engineered for Power</span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          SignalBridge provides the missing link between your favorite private messenger and your self-hosted AI infrastructure.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <FeatureCard 
          icon={Lock}
          title="End-to-End Privacy"
          description="Messages stay inside Signal's double-ratchet encryption protocol until decrypted by your local orchestrator. Zero third-party telemetry."
          delay={0.1}
        />
        <FeatureCard 
          icon={Cpu}
          title="Local LLM Gateway"
          description="Run Ollama (Llama 3.3, DeepSeek R1, Mistral) or custom PyTorch models locally on your homelab or GPU workstation."
          delay={0.2}
        />
        <FeatureCard 
          icon={Code}
          title="Extensible Webhooks"
          description="Connect Python scripts, Node.js workers, or LangChain pipelines using standardized REST and WebSocket event listeners."
          delay={0.3}
        />
      </div>
    </div>
  </section>
);

// Waitlist / Contact Form Component
const WaitlistForm = ({ onLog }: { onLog?: (msg: string) => void }) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    soundFx.playSendSignal();

    const formData = new FormData();
    formData.append("form-name", "waitlist");
    formData.append("email", email);

    try {
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData as any).toString(),
      });
      setStatus("success");
      setEmail("");
      if (onLog) onLog("Joined waitlist successfully");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {status === "success" ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 glass rounded-2xl text-emerald-400 font-bold flex items-center justify-center gap-3 border-emerald-500/30"
        >
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <span>You're on the list! We will send updates soon.</span>
        </motion.div>
      ) : (
        <form 
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3"
          method="POST"
          action="/"
          data-netlify="true"
          data-netlify-honeypot="bot-field"
          name="waitlist"
        >
          <input type="hidden" name="form-name" value="waitlist" />
          <input type="text" name="bot-field" className="hidden" tabIndex={-1} autoComplete="off" />
          <input 
            type="email" 
            name="email"
            required
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-black/50 border border-white/20 rounded-xl px-4 py-3.5 text-white placeholder:text-gray-500 focus:outline-none focus:border-signal-blue focus:ring-2 focus:ring-signal-blue/30 transition-colors"
            aria-label="Email address for waitlist"
          />
          <button 
            type="submit"
            className="bg-signal-blue hover:bg-blue-600 text-white px-6 py-3.5 rounded-xl font-bold transition-all whitespace-nowrap shadow-[0_12px_30px_rgba(44,107,237,0.35)] focus-visible:ring-2 focus-visible:ring-signal-blue focus-visible:outline-none"
          >
            Join Waitlist
          </button>
        </form>
      )}
      {status === "error" && (
        <p className="text-red-400 text-xs mt-2 font-mono">Something went wrong. Please try again.</p>
      )}
    </div>
  );
};

// Engineering Post Section
const SEOPost = () => (
  <section className="py-24 px-6 bg-signal-dark/20 border-y border-white/5" aria-label="Technical Documentation">
    <div className="max-w-4xl mx-auto">
      <article className="glass p-8 md:p-12 rounded-[2.5rem] border-white/10">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-signal-blue/20 rounded-2xl flex items-center justify-center">
            <Cpu className="text-signal-blue w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-signal-blue tracking-wider uppercase">ARCHITECTURAL WHITEPAPER</p>
            <h3 className="text-2xl font-display font-bold text-white">The Future of Zero-Knowledge Local AI Orchestration</h3>
          </div>
        </div>

        <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed space-y-6">
          <p>
            In an era where centralized AI providers log user queries for model training, privacy-conscious developers require a zero-trust communication channel. <strong>SignalBridge AI</strong> bridges private Signal messenger clients to self-hosted artificial intelligence infrastructure.
          </p>

          <p>
            By leveraging the <strong>Signal Protocol</strong> (X3DH key agreement and Double Ratchet session management), SignalBridge guarantees that message contents remain end-to-end encrypted from mobile devices directly to your local hardware. Whether running <em>Llama 3.3</em>, <em>DeepSeek R1</em>, or local LangChain agents, your data stays in your custody.
          </p>

          <h4 className="text-white font-bold text-xl mt-8">Why Local-First Zero-Knowledge Matters</h4>
          <p>
            Cloud AI APIs force users to trade confidentiality for intelligence. SignalBridge flips this trade-off. By running your own orchestrator node, you maintain 100% ownership over prompt contexts, private key stores, and output logs. This represents the privacy-first standard championed by <strong>Zoth Studio Team (Tech Pro)</strong>.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-8 border-t border-white/10 mt-8">
            <span className="text-xs text-gray-400">Author:</span>
            <a href="https://nullai.tech" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-signal-blue hover:underline">
              Zoth Studio Team (Tech Pro)
            </a>
            <span className="text-gray-600">•</span>
            <span className="text-xs text-gray-400">Published: 2026</span>
            <span className="text-gray-600">•</span>
            <span className="text-xs text-gray-400">5 min read</span>
          </div>
        </div>
      </article>
    </div>
  </section>
);

// Security Architecture Section
const Security = () => (
  <section id="security" className="py-24 px-6 bg-gradient-to-b from-black to-signal-dark/30">
    <div className="max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-8 text-white">
            Uncompromising <br />
            <span className="text-gradient">Security Architecture</span>
          </h2>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-signal-blue/15 rounded-xl flex items-center justify-center shrink-0">
                <Shield className="text-signal-blue w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-lg text-white mb-1">Zero-Knowledge Standard</h4>
                <p className="text-gray-300">Private keys and model parameters are kept isolated on your local server. Zero telemetry transmitted to external vendors.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 bg-signal-blue/15 rounded-xl flex items-center justify-center shrink-0">
                <Lock className="text-signal-blue w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-lg text-white mb-1">Double Ratchet Protocol</h4>
                <p className="text-gray-300">Uses Signal's ratcheting mechanism to cycle encryption keys per message, providing forward secrecy.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 bg-signal-blue/15 rounded-xl flex items-center justify-center shrink-0">
                <Zap className="text-signal-blue w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-lg text-white mb-1">Local Ollama / vLLM Binding</h4>
                <p className="text-gray-300">Direct IPC / localhost socket connection to local inference backends without exposing public HTTP endpoints.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Code Snippet Box */}
        <div className="relative">
          <div className="absolute -inset-10 bg-signal-blue/10 blur-3xl rounded-full" />
          <div className="glass p-8 rounded-3xl border-white/15 relative bg-black/60 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <span className="text-xs font-mono text-signal-blue font-bold">config.yaml (Secure Daemon)</span>
              <span className="text-[10px] font-mono text-emerald-400">VERIFIED E2EE</span>
            </div>
            <pre className="font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed">
              <code>{`# SignalBridge Local Orchestrator Config
bridge:
  protocol: "signal-v2"
  encryption: "x3dh-double-ratchet"
  local_only: true
  listen_socket: "/var/run/signalbridge.sock"

agents:
  - id: "ollama-llama3"
    engine: "ollama"
    endpoint: "http://127.0.0.1:11434"
    model: "llama3.3:70b"

  - id: "vllm-deepseek"
    engine: "vllm"
    endpoint: "http://127.0.0.1:8000"
    model: "deepseek-r1"`}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// Legal Modal Component
const LegalModal = ({ 
  title, 
  content, 
  isOpen, 
  onClose 
}: { 
  title: string; 
  content: string; 
  isOpen: boolean; 
  onClose: () => void;
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md" role="dialog" aria-modal="true">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8 rounded-3xl border-white/20 relative"
      >
        <button 
          onClick={() => {
            soundFx.playClick();
            onClose();
          }} 
          className="absolute top-5 right-5 text-gray-400 hover:text-white p-2 rounded-xl focus-visible:ring-2 focus-visible:ring-signal-blue focus-visible:outline-none"
          aria-label="Close legal modal"
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="font-display text-3xl font-bold mb-6 text-white">{title}</h2>
        <div className="text-gray-300 space-y-4 text-sm leading-relaxed whitespace-pre-wrap font-sans">
          {content}
        </div>
      </motion.div>
    </div>
  );
};

// Footer Component
const Footer = () => {
  const [modal, setModal] = useState<{ title: string, content: string } | null>(null);

  const terms = `Terms of Service for SignalBridge AI

1. Acceptance of Terms
By accessing signalbridge-ai.757tech.pro, you agree to be bound by these terms.

2. Description of Service
SignalBridge provides open-source software to connect Signal messaging with local AI agents. You own and operate your host environment.

3. Zero Knowledge & Privacy
We do not collect or transmit message content. See our Privacy Policy for full details.

4. User Responsibility
You are responsible for configuring your local agents and backends.

5. Limitation of Liability
SignalBridge is provided "as is" without warranty of any kind.`;

  const privacy = `Privacy Policy for SignalBridge AI

1. Data Collection
We do not collect, store, or transmit your Signal messages or private keys. All decryption happens locally.

2. Waitlist Information
If you voluntarily join our waitlist, we store your email address solely for project notifications.

3. Third Parties
We do not sell data to third parties. Netlify processes waitlist form submissions securely.`;

  return (
    <footer role="contentinfo" className="py-12 px-6 border-t border-white/10 bg-black">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-signal-blue rounded-lg flex items-center justify-center">
            <MessageSquare className="text-white w-4 h-4" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight text-white">SignalBridge AI</span>
        </div>

        <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-400">
          <button 
            onClick={() => {
              soundFx.playClick();
              setModal({ title: "Privacy Policy", content: privacy });
            }} 
            className="hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-signal-blue focus-visible:outline-none rounded px-1"
          >
            Privacy Policy
          </button>
          <button 
            onClick={() => {
              soundFx.playClick();
              setModal({ title: "Terms of Service", content: terms });
            }} 
            className="hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-signal-blue focus-visible:outline-none rounded px-1"
          >
            Terms of Service
          </button>
          <a 
            href="https://nullai.tech" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-signal-blue transition-colors flex items-center gap-1 font-semibold focus-visible:ring-2 focus-visible:ring-signal-blue focus-visible:outline-none rounded px-1"
          >
            <span>nullai.tech</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="text-center md:text-right">
          <p className="text-sm text-gray-400">
            Created by <a href="https://nullai.tech" target="_blank" rel="noopener noreferrer" className="text-white font-bold hover:text-signal-blue transition-colors">Zoth Studio Team (Tech Pro)</a>
          </p>
          <p className="text-xs text-gray-400 mt-1">© 2026 SignalBridge AI. All rights reserved.</p>
        </div>
      </div>

      <LegalModal 
        isOpen={!!modal} 
        title={modal?.title || ""} 
        content={modal?.content || ""} 
        onClose={() => setModal(null)} 
      />
    </footer>
  );
};

export default function App() {
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const scrollToWaitlist = () => {
    const simulatorSection = document.getElementById("simulator");
    simulatorSection?.scrollIntoView({ behavior: "smooth", block: "start" });
    setStatusMessage("Navigated to Live Playground Console");
  };

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle shortcuts modal on '?'
      if (e.key === "?" && !shortcutsOpen) {
        setShortcutsOpen(true);
        soundFx.playClick();
      }
      // Jump to simulator on 'Ctrl+K' or 'Cmd+K'
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        scrollToWaitlist();
      }
      // Mute audio on 'M'
      if (e.key.toLowerCase() === "m" && !["input", "textarea"].includes((e.target as HTMLElement).tagName.toLowerCase())) {
        const isMuted = soundFx.toggleMute();
        setStatusMessage(isMuted ? "Sound muted" : "Sound unmuted");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcutsOpen]);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-signal-blue selection:text-white antialiased">
      {/* Accessibility Skip Link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2.5 focus:bg-signal-blue focus:text-white focus:font-bold focus:rounded-xl focus:shadow-2xl focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>

      {/* ARIA Live Region */}
      <div role="status" aria-live="polite" className="sr-only">
        {statusMessage}
      </div>

      <Navbar 
        onPrimaryAction={scrollToWaitlist} 
        onOpenShortcuts={() => setShortcutsOpen(true)} 
      />

      <main id="main-content" tabIndex={-1} className="focus:outline-none">
        <Hero onPrimaryAction={scrollToWaitlist} />
        <InteractiveSimulator onLogAction={(msg) => setStatusMessage(msg)} />
        <Features />
        <HowToSection />
        <Security />
        <SEOPost />
        <FAQSection />

        {/* Call to Action Section */}
        <section id="waitlist" className="py-24 px-6 scroll-mt-32" aria-label="Join Waitlist">
          <div className="max-w-5xl mx-auto glass rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden border-white/15 shadow-[0_30px_80px_rgba(7,11,22,0.65)]">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-signal-blue/20 to-transparent pointer-events-none" />
            <div className="absolute -bottom-20 -right-16 h-60 w-60 rounded-full bg-cyan-400/15 blur-3xl pointer-events-none" />

            <h2 className="font-display text-4xl md:text-6xl font-extrabold mb-6 text-white relative z-10">
              Ready to Bridge the Gap?
            </h2>
            <p className="text-gray-300 text-lg md:text-xl mb-12 max-w-2xl mx-auto relative z-10 leading-relaxed">
              Join the private waitlist to get early access to SignalBridge release packages for your homelab or server.
            </p>

            <div className="relative z-10">
              <WaitlistForm onLog={(msg) => setStatusMessage(msg)} />
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <KeyboardShortcutsModal 
        isOpen={shortcutsOpen} 
        onClose={() => setShortcutsOpen(false)} 
      />
    </div>
  );
}
