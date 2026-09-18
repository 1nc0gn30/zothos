import { FormEvent, useState } from 'react';
import { motion } from 'motion/react';
import { Anchor, ArrowRight, BrainCircuit, Eye, Send, Ship, Zap } from 'lucide-react';

const CONTACT_FORM_NAME = 'tidepoint-dossier';

function encodeForm(data: Record<string, string>) {
  return new URLSearchParams(data).toString();
}

function Navbar() {
  return (
    <nav className="fixed top-0 inset-x-0 z-40 border-b border-white/5 bg-black/40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Anchor className="w-5 h-5 text-[#FF4500]" />
          <span className="font-display font-bold text-xl tracking-tight">TIDEPOINT</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="hidden md:inline-block micro-label">Hampton Roads, VA</span>
          <a
            href="#contact"
            className="bg-white text-black px-5 py-2.5 rounded-full font-medium text-sm hover:scale-105 transition-transform"
          >
            Inquire Now
          </a>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="relative min-h-[95vh] flex flex-col items-center justify-center overflow-hidden pt-20">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 magic-grid z-0" />
      
      <div className="glow-orb w-[800px] h-[800px] bg-[#FF4500]/15 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 mix-blend-screen" />
      
      <div className="max-w-5xl mx-auto px-6 relative z-10 w-full flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.02] px-4 py-1.5 text-sm backdrop-blur-sm transition-colors hover:bg-white/[0.05] shadow-[0_0_0_1px_rgba(255,255,255,0.05)_inset]">
            <span className="shimmer-text flex items-center gap-2 font-mono text-xs uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF4500] animate-pulse" />
              Now Accepting HR Q3 Partners
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, filter: 'blur(12px)', y: 20 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
        >
          <h1 className="font-display text-[14vw] md:text-8xl leading-[0.9] tracking-[-0.04em] uppercase font-bold text-white max-w-5xl mb-6">
            Break <br className="md:hidden" /> <span className="text-gradient-magic">The Hull</span>
          </h1>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-gray-400 text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto mb-10"
        >
          Hampton Roads' premier think tank. We fuse advanced AI modeling with elite human insight to provide a fresh set of eyes, unblock pipelines, and strictly accelerate your shipping matrix.
        </motion.p>
        
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
           className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <a
            href="#contact"
            className="group relative inline-flex h-12 w-full sm:w-auto items-center justify-center overflow-hidden rounded-full bg-white font-medium text-black px-8 transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,69,0,0.3)]"
          >
            <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-150%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(150%)]">
                <div className="w-8 h-full bg-black/10 blur-sm" />
            </div>
            <span className="relative flex items-center gap-2">Initiate Protocol <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" /></span>
          </a>
          
          <a
            href="#services"
            className="inline-flex h-12 w-full sm:w-auto items-center justify-center rounded-full border border-white/10 bg-white/[0.02] px-8 font-medium text-white transition-all hover:bg-white/10 hover:text-[#FF4500]"
          >
            View Dossier
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function ValueProps() {
  const features = [
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Tactical Foresight",
      desc: "You are too close to the project. We act as the ultimate fresh set of eyes, identifying systemic blind spots before they capsize your launch."
    },
    {
      icon: <Ship className="w-6 h-6" />,
      title: "Velocity to Ship",
      desc: "Whether naval logistics or software deployment, our ideas unblock bottlenecks. We exist to dramatically speed up your ship time."
    },
    {
      icon: <BrainCircuit className="w-6 h-6" />,
      title: "AI-Augmented Intel",
      desc: "We leverage proprietary AI networks to simulate outcomes, but human domain experts command the strategy. It's AI—but vastly more than that."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "The X-Factor",
      desc: "The experience working with Tidepoint alters your DNA. Whatever your mission, our think tank leaves a permanent mark of operational excellence."
    }
  ];

  return (
    <section id="services" className="py-32 relative bg-[#010102]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-4 mb-12">
            <h2 className="font-display text-4xl md:text-6xl font-medium tracking-tight">
              Operational <span className="italic text-gray-500">Overhaul.</span>
            </h2>
          </div>
          
          {features.map((f, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="bg-white/[0.02] border border-white/5 p-8 rounded-2xl hover:bg-white/[0.04] transition-colors"
            >
              <div className="text-[#FF4500] mb-6">{f.icon}</div>
              <h3 className="font-display text-xl font-medium mb-3">{f.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ManipulationSection() {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="glow-orb w-[800px] h-[800px] bg-[#FF4500]/5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      
      <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
        <div className="inline-flex items-center gap-2 border border-[#FF4500]/30 bg-[#FF4500]/10 rounded-full px-4 py-1.5 mb-8">
          <span className="micro-label !text-[#FF4500]">Strictly Confidential</span>
        </div>
        
        <h2 className="font-display text-5xl md:text-7xl font-bold tracking-tight mb-8">
          Your competitors are already running predictive models. <br />
          <span className="text-gray-600">Are you charting blind?</span>
        </h2>
        
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
          The window for passive leadership is closed. In a coastal hub like Hampton Roads, 
          the difference between legacy and irrelevance is adaptability. We forge the ideas 
          that ensure you dictate the current, rather than being swept by it.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto text-left">
          <div className="border border-white/10 p-6 rounded-xl">
            <div className="text-4xl font-display font-bold text-white mb-2">3</div>
            <div className="text-sm font-mono text-gray-500 uppercase tracking-widest">Partners / Quarter</div>
            <p className="text-xs text-gray-400 mt-3">We limit our bandwidth to guarantee overwhelming force on your objective.</p>
          </div>
          <div className="border border-white/10 p-6 rounded-xl">
            <div className="text-4xl font-display font-bold text-white mb-2">40%</div>
            <div className="text-sm font-mono text-gray-500 uppercase tracking-widest">Velocity Increase</div>
            <p className="text-xs text-gray-400 mt-3">Average acceleration of shipping and deployment timelines post-engagement.</p>
          </div>
          <div className="border border-white/10 p-6 rounded-xl">
            <div className="text-4xl font-display font-bold text-white mb-2">∞</div>
            <div className="text-sm font-mono text-gray-500 uppercase tracking-widest">ROI Potential</div>
            <p className="text-xs text-gray-400 mt-3">A single paradigm-shifting idea from our tank covers our retainer for life.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTA() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    fullName: '',
    company: '',
    bottleneck: '',
    companySite: '',
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('submitting');

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: encodeForm({
          'form-name': CONTACT_FORM_NAME,
          fullName: formData.fullName,
          company: formData.company,
          bottleneck: formData.bottleneck,
          companySite: formData.companySite,
        }),
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      setFormData({fullName: '', company: '', bottleneck: '', companySite: ''});
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  return (
    <section id="contact" className="py-32 bg-white text-black relative -mx-1 -mb-1 px-6 border-t-[12px] border-[#FF4500]">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-display text-5xl md:text-8xl font-bold tracking-tighter uppercase mb-6">
          Seize <br /> Intervention.
        </h2>
        <p className="text-xl md:text-2xl font-light text-gray-600 mb-12">
          We are currently interviewing partners for our upcoming cohort. 
          Submit your dossier. If the challenge is daunting enough, we'll be in touch.
        </p>
        
        <form
          className="flex flex-col gap-4"
          name={CONTACT_FORM_NAME}
          data-netlify="true"
          netlify-honeypot="companySite"
          onSubmit={handleSubmit}
        >
          <input type="hidden" name="form-name" value={CONTACT_FORM_NAME} />
          <div className="absolute -left-[9999px]" aria-hidden="true">
            <label htmlFor="companySite">Company Website</label>
            <input
              id="companySite"
              name="companySite"
              type="text"
              autoComplete="off"
              tabIndex={-1}
              value={formData.companySite}
              onChange={(e) => setFormData((prev) => ({...prev, companySite: e.target.value}))}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              type="text" 
              name="fullName"
              placeholder="YOUR NAME" 
              required
              className="bg-gray-100 border border-transparent focus:border-black rounded-lg px-6 py-4 outline-none font-mono text-sm uppercase transition-colors"
              value={formData.fullName}
              onChange={(e) => setFormData((prev) => ({...prev, fullName: e.target.value}))}
            />
            <input 
              type="text" 
              name="company"
              placeholder="COMPANY / VESSEL" 
              required
              className="bg-gray-100 border border-transparent focus:border-black rounded-lg px-6 py-4 outline-none font-mono text-sm uppercase transition-colors"
              value={formData.company}
              onChange={(e) => setFormData((prev) => ({...prev, company: e.target.value}))}
            />
          </div>
          <textarea 
            name="bottleneck"
            placeholder="DESCRIBE YOUR BOTTLENECK..." 
            rows={4}
            required
            className="bg-gray-100 border border-transparent focus:border-black rounded-lg px-6 py-4 outline-none font-mono text-sm uppercase transition-colors resize-none"
            value={formData.bottleneck}
            onChange={(e) => setFormData((prev) => ({...prev, bottleneck: e.target.value}))}
          />
          
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="bg-black hover:bg-[#FF4500] disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-8 py-5 rounded-lg font-medium text-lg flex items-center justify-center gap-3 transition-colors mt-4"
          >
            {status === 'submitting' ? 'Submitting...' : 'Submit Request'} <Send className="w-5 h-5" />
          </button>

          <div aria-live="polite" className="min-h-6">
            {status === 'success' ? (
              <p className="text-sm font-mono uppercase tracking-wide text-green-700 text-center">
                Dossier received. We will review and reach out if there is mission fit.
              </p>
            ) : null}
            {status === 'error' ? (
              <p className="text-sm font-mono uppercase tracking-wide text-red-700 text-center">
                Submission failed. Please retry or email hello@tidepoint.757tech.pro.
              </p>
            ) : null}
          </div>
          
          <p className="text-center text-xs text-gray-500 font-mono mt-4 uppercase">
            Acceptance is not guaranteed. We choose challenges, not clients.
          </p>
        </form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-black text-white border-t border-white/10 py-12 px-6 relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <Anchor className="w-6 h-6 text-[#FF4500]" />
          <span className="font-display font-bold text-xl tracking-tight">TIDEPOINT</span>
        </div>
        <div className="text-xs font-mono text-gray-600 uppercase tracking-widest text-center md:text-right">
          © {new Date().getFullYear()} Tidepoint Strategic Think Tank<br />
          Operating out of Hampton Roads, Virginia
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-6 flex justify-center gap-6 text-xs font-mono uppercase tracking-widest text-gray-400">
        <a href="#services" className="hover:text-[#FF4500] transition-colors">Services</a>
        <a href="#contact" className="hover:text-[#FF4500] transition-colors">Contact</a>
        <a href="#" className="hover:text-[#FF4500] transition-colors">Top</a>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div className="min-h-screen relative isolation overflow-x-hidden">
      <div className="grain-overlay" />
      <Navbar />
      <main>
        <Hero />
        <ValueProps />
        <ManipulationSection />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
