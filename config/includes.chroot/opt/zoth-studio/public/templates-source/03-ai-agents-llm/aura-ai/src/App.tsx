import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Clock, 
  TrendingDown, 
  Zap, 
  ShieldCheck, 
  ArrowRight,
  Coffee,
  UserMinus,
  CalendarX,
  Sparkles,
  Keyboard,
  CheckCircle2
} from 'lucide-react';
import ContactForm from './components/ContactForm';
import AuraPlayground from './components/AuraPlayground';
import SavingsCalculator from './components/SavingsCalculator';
import FAQSection from './components/FAQSection';
import MusicPlayer from './components/MusicPlayer';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import { soundEngine } from './utils/audio';

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    } else {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [pathname, hash]);

  return null;
}

function LandingPage() {
  const [activeHotkeyNotice, setActiveHotkeyNotice] = useState<string | null>(null);

  // Global Keyboard Shortcuts (AX Requirement)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey) {
        const key = e.key.toLowerCase();
        let targetId: string | null = null;
        let noticeText = '';

        if (key === 'p') {
          targetId = 'playground';
          noticeText = 'Jumped to Interactive AI Playground';
        } else if (key === 'c') {
          targetId = 'math';
          noticeText = 'Jumped to ROI Calculator & Pricing';
        } else if (key === 'f') {
          targetId = 'faq';
          noticeText = 'Jumped to Frequently Asked Questions';
        } else if (key === 'm') {
          soundEngine.toggleAmbient();
          noticeText = 'Toggled Ambient Background Audio';
        }

        if (targetId) {
          e.preventDefault();
          soundEngine.playClick();
          const targetEl = document.getElementById(targetId);
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth' });
            targetEl.focus();
          }
        }

        if (noticeText) {
          setActiveHotkeyNotice(noticeText);
          setTimeout(() => setActiveHotkeyNotice(null), 3000);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  return (
    <>
      {/* Skip Navigation Link for WCAG 2.1 AA Compliance */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-5 focus:py-3 focus:bg-brand-900 focus:text-white focus:rounded-xl focus:shadow-2xl focus:ring-2 focus:ring-emerald-400 font-bold text-sm"
      >
        Skip to main content
      </a>

      {/* Screen Reader ARIA Live Region for Hotkeys */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {activeHotkeyNotice}
      </div>

      {/* Floating Hotkey Notice Badge */}
      {activeHotkeyNotice && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-24 right-6 z-50 bg-brand-900 text-white text-xs px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 border border-white/20"
        >
          <Keyboard size={14} className="text-emerald-400" />
          <span>{activeHotkeyNotice}</span>
        </motion.div>
      )}

      {/* Navigation Bar */}
      <nav role="banner" className="fixed top-0 w-full z-40 bg-accent-soft/80 backdrop-blur-md border-b border-brand-200/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link 
            to="/" 
            onClick={() => soundEngine.playClick()}
            className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-brand-900 rounded-lg p-1"
          >
            <div className="w-8 h-8 bg-brand-900 rounded-lg flex items-center justify-center shadow-md">
              <Sparkles className="text-white" size={18} />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-brand-900">AURA</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-brand-900/70">
            <a href="#playground" onClick={() => soundEngine.playClick()} className="hover:text-brand-900 transition-colors">
              Playground
            </a>
            <a href="#pain" onClick={() => soundEngine.playClick()} className="hover:text-brand-900 transition-colors">
              The Problem
            </a>
            <a href="#math" onClick={() => soundEngine.playClick()} className="hover:text-brand-900 transition-colors">
              ROI Calculator
            </a>
            <a href="#faq" onClick={() => soundEngine.playClick()} className="hover:text-brand-900 transition-colors">
              FAQ
            </a>
            <a 
              href="#contact" 
              onClick={() => soundEngine.playClick()}
              className="px-5 py-2.5 bg-brand-900 text-white rounded-full hover:scale-105 transition-transform focus:ring-2 focus:ring-offset-2 focus:ring-brand-900 font-semibold shadow-lg shadow-brand-900/10"
            >
              Get Started
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main id="main-content" role="main" tabIndex={-1} className="outline-none">
        {/* Hero Section */}
        <section className="pt-40 pb-20 px-6 overflow-hidden relative" aria-label="Introduction">
          <div className="max-w-7xl mx-auto text-center relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="absolute -top-20 -left-20 w-96 h-96 bg-orange-100/60 rounded-full blur-3xl -z-10"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="absolute -bottom-20 -right-20 w-96 h-96 bg-indigo-100/60 rounded-full blur-3xl -z-10"
            />

            <motion.div {...fadeIn}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-900/5 text-brand-900 text-xs font-bold tracking-widest uppercase rounded-full mb-6 border border-brand-900/10">
                <Sparkles size={14} />
                <span>The Future of Front-Desk Operations</span>
              </span>
              <h1 className="text-5xl md:text-7xl font-display font-bold text-brand-900 mb-8 leading-[1.1] text-balance">
                Hire the last receptionist <br />
                <span className="text-brand-900/40 italic">you'll ever need.</span>
              </h1>
              <p className="max-w-2xl mx-auto text-lg md:text-xl text-brand-500 mb-12 leading-relaxed text-balance">
                Aura is an AI-powered front desk agent that handles calls, schedules appointments, and greets visitors 24/7. No sick days. No turnover. Just 25% lower costs.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a 
                  href="#contact" 
                  onClick={() => soundEngine.playClick()}
                  className="w-full sm:w-auto px-8 py-4 bg-brand-900 text-white rounded-2xl font-semibold flex items-center justify-center gap-2 hover:shadow-2xl hover:shadow-brand-900/20 transition-all group focus:ring-2 focus:ring-offset-2 focus:ring-brand-900"
                >
                  <span>Replace Your Employee Today</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </a>
                <a 
                  href="#playground" 
                  onClick={() => soundEngine.playClick()}
                  className="w-full sm:w-auto px-8 py-4 bg-white text-brand-900 border border-brand-200 rounded-2xl font-semibold hover:bg-brand-50 transition-colors focus:ring-2 focus:ring-brand-900"
                >
                  Launch Interactive Demo
                </a>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mt-16 relative max-w-5xl mx-auto"
            >
              <div className="glass-card rounded-[2.5rem] p-4 md:p-8 overflow-hidden relative">
                <img 
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000" 
                  alt="Modern Office Front Desk automated by AURA AI" 
                  className="w-full h-[420px] object-cover rounded-[1.5rem]"
                  loading="eager"
                />
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <div className="glass-card p-6 rounded-2xl max-w-xs text-left shadow-2xl border border-white/60">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <TrendingDown className="text-green-600" size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-brand-500 font-medium">Monthly Savings</p>
                        <p className="text-xl font-bold text-brand-900">$1,250+/mo</p>
                      </div>
                    </div>
                    <p className="text-sm text-brand-500 leading-relaxed">
                      Aura replaced a full-time receptionist at a law firm, saving them 28% in overhead instantly.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Interactive AI Front Desk & Emotional Intelligence Playground */}
        <AuraPlayground />

        {/* Pain Points Section */}
        <section id="pain" className="py-24 px-6 bg-brand-900 text-white overflow-hidden" aria-label="Problem Analysis">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div {...fadeIn}>
                <h2 className="text-4xl md:text-5xl font-display font-bold mb-8 leading-tight">
                  Human employees are <br />
                  <span className="text-white/40">your biggest liability.</span>
                </h2>
                <div className="space-y-8">
                  {[
                    { icon: Coffee, title: "The 'Coffee' Break Cost", desc: "Average employees spend 1.5 hours daily on non-work tasks. You pay for every minute." },
                    { icon: CalendarX, title: "Sick Days & No-Shows", desc: "When they're out, your business stops. Aura is online 24/7/365 without fail." },
                    { icon: UserMinus, title: "The Turnover Trap", desc: "Hiring and training a new receptionist costs $4,000+ every time. Aura never quits." }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-6">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                        <item.icon size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                        <p className="text-white/60 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div 
                {...fadeIn}
                className="relative"
              >
                <div className="bg-white/5 rounded-3xl p-8 border border-white/10">
                  <h3 className="text-2xl font-display font-bold mb-6">The Real Cost Comparison</h3>
                  <div className="space-y-6">
                    <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Human Receptionist</span>
                        <span className="text-red-400 font-bold">$4,500/mo</span>
                      </div>
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="w-full h-full bg-red-500" />
                      </div>
                      <p className="text-xs text-white/40 mt-3 italic">*Includes salary, benefits, taxes, and overhead.</p>
                    </div>

                    <div className="p-6 rounded-2xl bg-green-500/10 border border-green-500/20">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Aura AI Agent</span>
                        <span className="text-green-400 font-bold">$3,375/mo</span>
                      </div>
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="w-3/4 h-full bg-green-500" />
                      </div>
                      <p className="text-xs text-green-400 mt-3 font-bold">Guaranteed 25% Savings</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Interactive ROI Calculator */}
        <SavingsCalculator />

        {/* Features Section */}
        <section id="solution" className="py-24 px-6" aria-label="AURA Capabilities">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <motion.h2 {...fadeIn} className="text-4xl md:text-5xl font-display font-bold text-brand-900 mb-6">
                Better than a human. <br />
                <span className="text-brand-900/40">By design.</span>
              </motion.h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Clock, title: "24/7 Availability", desc: "Aura never sleeps. Capture every lead, even at 3 AM on a Sunday." },
                { icon: Zap, title: "Instant Training", desc: "Upload your business docs and Aura knows your entire operation in seconds." },
                { icon: ShieldCheck, title: "Perfect Memory", desc: "Aura remembers every caller, every preference, and every detail. Forever." }
              ].map((feature, i) => (
                <motion.div 
                  key={i}
                  {...fadeIn}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card p-8 rounded-[2rem] hover:scale-105 transition-transform border border-brand-200/80"
                >
                  <div className="w-14 h-14 rounded-2xl bg-brand-900 text-white flex items-center justify-center mb-6 shadow-md">
                    <feature.icon size={28} />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-brand-900 mb-4">{feature.title}</h3>
                  <p className="text-brand-500 leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <FAQSection />

        {/* Pricing/Conversion Section */}
        <section id="pricing" className="py-24 px-6 bg-accent-warm" aria-label="Contact and Pricing">
          <div id="contact" className="max-w-7xl mx-auto tabIndex={-1}">
            <div className="glass-card rounded-[3rem] overflow-hidden grid grid-cols-1 lg:grid-cols-2 shadow-2xl border border-white/60">
              <div className="p-12 md:p-20 bg-brand-900 text-white">
                <h2 className="text-4xl md:text-5xl font-display font-bold mb-8">
                  Stop hiring. <br />
                  Start scaling.
                </h2>
                <p className="text-white/70 text-lg mb-12 leading-relaxed">
                  We don't just sell software. We sell freedom from HR headaches. Tell us what you pay your current receptionist, and we'll match the service for 25% less. Guaranteed.
                </p>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                      <CheckCircle2 size={14} className="text-white" />
                    </div>
                    <span className="font-medium">No setup fees</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                      <CheckCircle2 size={14} className="text-white" />
                    </div>
                    <span className="font-medium">Cancel anytime</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                      <CheckCircle2 size={14} className="text-white" />
                    </div>
                    <span className="font-medium">24/7 Dedicated Support</span>
                  </div>
                </div>
              </div>
              <div className="p-12 md:p-20 bg-white/90">
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer role="contentinfo" className="py-12 px-6 border-t border-brand-200 bg-white/40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-brand-900 rounded flex items-center justify-center">
                <Sparkles className="text-white" size={12} />
              </div>
              <span className="font-display font-bold text-lg tracking-tight text-brand-900">AURA</span>
            </div>
            <p className="text-xs text-brand-500 font-medium uppercase tracking-widest">
              Showcase for <a href="https://nealfrazier.tech/" className="underline hover:text-brand-900">nealfrazier.tech</a> • Hosted by Tech Pro
            </p>
          </div>
          <p className="text-sm text-brand-500">© 2026 Aura by Tech Pro. All rights reserved.</p>
          <div className="flex gap-6 text-sm font-medium text-brand-900/70">
            <Link to="/privacy" onClick={() => soundEngine.playClick()} className="hover:text-brand-900">Privacy Policy</Link>
            <Link to="/terms" onClick={() => soundEngine.playClick()} className="hover:text-brand-900">Terms of Service</Link>
          </div>
        </div>
      </footer>

      {/* Ambient / Procedural Audio Floating Widget */}
      <MusicPlayer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen font-sans">
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
