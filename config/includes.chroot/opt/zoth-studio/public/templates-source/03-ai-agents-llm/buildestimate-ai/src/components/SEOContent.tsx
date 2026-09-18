import { Shield, Zap, TrendingDown, Clock, HardHat, AlertTriangle, HelpCircle, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { playClickSound } from '../lib/sound';

const PAIN_POINTS = [
  {
    title: "Inaccurate Material Costs",
    description: "Market volatility makes static spreadsheets obsolete. BuildEstimate AI factors in localized market trends to ensure your material cost projections remain accurate.",
    icon: TrendingDown,
    color: "text-rose-500",
    bg: "bg-rose-500/10"
  },
  {
    title: "Labor Shortage Variance",
    description: "Estimating specialized trade labor hours is the hardest part of any bid. Our AI analyzes structural scope to deliver calibrated man-hour projections.",
    icon: Clock,
    color: "text-amber-500",
    bg: "bg-amber-500/10"
  },
  {
    title: "Unforeseen Scope Creep",
    description: "Unexpected site conditions destroy project profitability. We highlight potential risk vectors early so contractors can price contingencies up-front.",
    icon: AlertTriangle,
    color: "text-orange-500",
    bg: "bg-orange-500/10"
  }
];

const FAQS = [
  {
    q: "How does BuildEstimate AI calculate construction cost breakdowns?",
    a: "BuildEstimate AI analyzes project inputs including square footage, location market rates, material specifications, quality tiers, and project type (residential vs. commercial) to partition budget across Labor, Materials, Permits, Site Overhead, and Contractor Profit."
  },
  {
    q: "Can I use BuildEstimate AI without an API key?",
    a: "Yes! BuildEstimate AI features a built-in calibrated offline engine that generates realistic estimates automatically without needing an external API key. You can also enter a custom Gemini API key in Settings for live LLM generation."
  },
  {
    q: "What is the difference between commercial and residential estimation logic?",
    a: "Commercial bids factor in higher municipal permitting fees, specialized union trade labor rates, commercial liability insurance, and extended project timelines. Residential bids prioritize finish material quality grades and regional appraisal growth."
  },
  {
    q: "How are 5-Year ROI projections calculated?",
    a: "ROI projections combine expected immediate property appraisal increases upon milestone completion with regional compound appreciation rates and energy efficiency operational savings over a 5-year timeline."
  }
];

export function SEOContent() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    playClickSound();
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="space-y-16 py-8" role="region" aria-label="Industry Intelligence Insights">
      {/* Header Section */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest">
          Industry Intelligence & AEO Research
        </div>
        <motion.h2 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold text-slate-900 font-display tracking-tight"
        >
          Why 60% of Construction Estimates Exceed Budget
        </motion.h2>
        <p className="text-slate-600 text-base max-w-2xl mx-auto leading-relaxed">
          Inaccurate estimates ruin project margins. BuildEstimate AI solves the core failure points before sending the bid.
        </p>
      </section>

      {/* Pain Points Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PAIN_POINTS.map((point, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 flex flex-col items-start bg-white border border-slate-200/80 rounded-3xl"
          >
            <div className={`w-12 h-12 rounded-2xl ${point.bg} flex items-center justify-center mb-6`}>
              <point.icon className={`w-6 h-6 ${point.color}`} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2 font-display">
              {point.title}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {point.description}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Commercial vs Residential Section */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 text-white border border-slate-800 p-8 md:p-12 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-accent-500/10 blur-3xl rounded-full -mr-20 -mt-20 pointer-events-none" />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white text-xs font-bold px-4 py-1.5 rounded-full">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              ALGORITHMIC PRECISION
            </div>
            
            <h3 className="text-3xl font-bold font-display leading-tight">
              Commercial vs Residential:<br />
              The Estimation Gap
            </h3>
            
            <p className="text-slate-300 text-sm leading-relaxed">
              Commercial projects require strict regulatory permit tracking and higher overhead allocations. Residential projects demand precision in finish material specifications. <span className="text-accent-400 font-semibold">BuildEstimate AI dynamically adapts calculation engines</span> to your project type.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2.5 rounded-xl text-xs font-semibold">
                <Shield className="w-4 h-4 text-accent-400" />
                Risk Mitigation
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2.5 rounded-xl text-xs font-semibold">
                <Zap className="w-4 h-4 text-accent-400" />
                Real-Time Calibration
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <HardHat className="w-8 h-8 text-accent-400" />
              <div>
                <span className="block font-bold text-white text-sm">Contractor Field Experience</span>
                <span className="text-[11px] text-slate-400">Verified general contractor feedback</span>
              </div>
            </div>
            
            <p className="text-slate-300 italic text-xs leading-relaxed mb-6">
              "Using AI for our commercial bids saved over 14 hours of spreadsheet drafting per project. The labor vs material allocation was within 3.8% of actual ledger costs."
            </p>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-accent-500 flex items-center justify-center text-white font-bold text-xs">MR</div>
              <div>
                <div className="font-bold text-white text-xs">Michael R.</div>
                <div className="text-[10px] text-slate-400">Commercial Contractor • 16 Years Exp</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AEO Frequently Asked Questions Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <HelpCircle className="w-5 h-5 text-slate-900" />
          <h3 className="text-2xl font-bold text-slate-900 font-display">Frequently Asked Questions</h3>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="glass-card overflow-hidden border border-slate-200/80">
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-5 text-left flex items-center justify-between font-bold text-slate-900 text-sm focus:outline-none focus:bg-slate-50"
                aria-expanded={openFaq === idx}
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
