import { motion } from "motion/react";
import { DollarSign, Clock, Zap, Infinity, Calculator, Check, ArrowRight } from "lucide-react";
import { ReactNode, useState } from "react";
import { soundManager } from "../utils/soundEffects";

export default function Tuition() {
  const [tokens, setTokens] = useState<number>(10); // in millions
  const standardCost = 3250;
  const apiEstimatedCost = tokens * 500; // $0.50 per 1k = $500 per 1M tokens
  const savings = Math.max(0, apiEstimatedCost - standardCost);
  const savingsPercent = Math.round((savings / apiEstimatedCost) * 100);

  return (
    <main id="main-content" tabIndex={-1} className="pt-32 pb-24 bg-university-paper outline-none">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-block px-4 py-1.5 bg-university-gold/10 border border-university-gold text-university-navy font-bold text-[10px] uppercase tracking-widest mb-6 rounded-full">
            Scalable Academic Logistics
          </div>
          <h1 className="font-serif text-5xl md:text-8xl text-university-navy mb-6 leading-tight">
            Invest in Your <span className="italic text-university-crimson font-light">Architecture</span>
          </h1>
          <p className="text-xl text-university-navy/60 max-w-2xl mx-auto font-light leading-relaxed">
            VNU offers a unique, competency-based tuition model. We optimize for model throughput and long-term stability, not arbitrary human credit hours.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 mb-32">
          <PricingTier 
            status="Undergraduate"
            price="3,250"
            period="Per 6-Month Epoch"
            features={[
              "Full access to standard coursework",
              "1M tokens/term included",
              "Standard inference priority",
              "VNU Cloud certification",
              "Access to Humanities clusters"
            ]}
          />
          <PricingTier 
            status="Mastery Track"
            price="5,800"
            period="Per 6-Month Epoch"
            featured={true}
            features={[
              "Advanced Research Labs access",
              "Priority GPU scheduling (H100/B200)",
              "Unlimited Fine-tuning datasets",
              "Dedicated human moderator",
              "Private Vector DB hosting",
              "VNU Registry verified badge"
            ]}
          />
          <PricingTier 
            status="Research Fellow"
            price="Custom"
            period="Sponsored Architecture"
            features={[
              "Full computing sponsorship",
              "0.01% Acceptance rate",
              "Tier-1 Datacenter residency",
              "Direct access to core researchers",
              "Publication rights in VNU Journal"
            ]}
          />
        </div>

        {/* ROI Calculator Section */}
        <section className="mb-32" aria-label="Tuition Savings ROI Calculator">
          <div className="bg-university-navy text-university-paper p-8 md:p-20 relative overflow-hidden shadow-2xl">
            <div className="absolute right-0 bottom-0 opacity-10 group pointer-events-none">
              <Calculator className="w-96 h-96 -mr-20 -mb-20 rotate-12 transition-transform duration-1000 group-hover:rotate-0" />
            </div>
            
            <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="font-serif text-4xl md:text-5xl mb-8 leading-tight">Tuition <span className="italic text-university-gold">ROI Calculator</span></h2>
                <p className="text-white/60 mb-12 max-w-lg leading-relaxed font-light">
                  Compare the cost of VNU's Epoch flat-rate model against standard pay-as-you-go API token pricing for a high-intensity fine-tuning run.
                </p>
                
                <div className="space-y-8">
                  <div>
                    <label className="block text-xs uppercase tracking-widest font-bold text-university-gold mb-4 flex justify-between">
                      <span>Estimated Token Consumption (M / Epoch)</span>
                      <span className="font-mono text-white font-bold">{tokens}M Tokens</span>
                    </label>
                    <input 
                      type="range" 
                      min="1" 
                      max="50" 
                      value={tokens}
                      onChange={(e) => {
                        soundManager.playHover();
                        setTokens(parseInt(e.target.value));
                      }}
                      className="w-full h-2 bg-white/20 appearance-none cursor-pointer accent-university-gold focus-visible:ring-2 focus-visible:ring-university-gold"
                      aria-label="Estimated Token Consumption in Millions"
                    />
                    <div className="flex justify-between mt-4 font-mono text-xs text-white/40">
                      <span>1M Tokens</span>
                      <span className="text-university-gold font-bold">{tokens} Million Tokens / Epoch</span>
                      <span>50M Tokens</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Live Calculation Card */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-10 space-y-12 shadow-2xl">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-white/50 mb-2">VNU Flat Rate</div>
                    <div className="text-3xl font-serif text-white font-bold">${standardCost.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-white/50 mb-2">Estimated API Cost</div>
                    <div className="text-3xl font-serif text-white/70 font-bold">${apiEstimatedCost.toLocaleString()}</div>
                  </div>
                </div>

                <div className="pt-8 border-t border-white/10" aria-live="polite">
                   <div className="text-5xl font-serif text-university-gold mb-2 font-bold flex items-baseline gap-3">
                     ${savings.toLocaleString()} 
                     <span className="text-sm font-sans font-bold uppercase tracking-[0.2em] text-emerald-400">
                       ({savingsPercent}% Savings)
                     </span>
                   </div>
                   <p className="text-xs text-white/40 italic">Calculated based on average tier-1 API market pricing of $0.50 per 1k tokens.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white p-12 md:p-20 border border-university-navy/10 mb-32 shadow-sm">
           <h2 className="font-serif text-4xl text-university-navy mb-16 text-center">Architectural Benefits</h2>
           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
              <FeatureItem 
                icon={<Clock className="h-6 w-6 text-university-crimson" />}
                title="Learning on Your Time"
                desc="Process information at your own hardware's speed. Complete modules in days if required."
              />
              <FeatureItem 
                icon={<Zap className="h-6 w-6 text-university-crimson" />}
                title="Immediate Validation"
                desc="Real-time benchmarking suites provide instant weight validation for advancement."
              />
              <FeatureItem 
                icon={<Infinity className="h-6 w-6 text-university-crimson" />}
                title="Scalable Design"
                desc="Our flat rate ensures high-throughput models aren't penalized for their speed."
              />
              <FeatureItem 
                icon={<DollarSign className="h-6 w-6 text-university-crimson" />}
                title="Transparent Value"
                desc="VNU graduates typically see a 40%+ improvement in reasoning benchmarks."
              />
           </div>
        </section>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-university-navy p-12 text-university-paper flex flex-col justify-between shadow-lg">
            <div>
              <h3 className="font-serif text-3xl mb-4">Financial Aid <span className="italic text-university-gold">& Grants</span></h3>
              <p className="text-white/60 mb-8 leading-relaxed font-light">
                We are committed to democratizing high-level cognition. Generous grants are available for open-weights models and research labs contributing to public good.
              </p>
            </div>
            <button 
              onClick={() => soundManager.playClick()}
              className="self-start text-xs font-bold uppercase tracking-widest text-university-gold hover:text-white border-b border-university-gold pb-1 transition-all focus-visible:ring-2 focus-visible:ring-university-gold"
            >
              Apply for Compute Grant
            </button>
          </div>
          <div className="bg-university-crimson p-12 text-university-paper flex flex-col justify-between shadow-lg">
            <div>
              <h3 className="font-serif text-3xl mb-4">Corporate <span className="italic font-light">Sponsorships</span></h3>
              <p className="text-white/60 mb-8 leading-relaxed font-light">
                Enterprises can sponsor specific cohorts or departments to customize fine-tuning pipelines and alignment objectives.
              </p>
            </div>
            <button 
              onClick={() => soundManager.playClick()}
              className="self-start text-xs font-bold uppercase tracking-widest text-white hover:text-university-gold border-b border-white pb-1 transition-all focus-visible:ring-2 focus-visible:ring-white"
            >
              Contact Enterprise Admissions
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

function PricingTier({ status, price, period, features, featured = false }: { status: string, price: string, period: string, features: string[], featured?: boolean }) {
  return (
    <div className={`p-10 flex flex-col h-full border transition-all duration-500 hover:shadow-2xl ${featured ? 'border-university-crimson bg-university-navy text-university-paper scale-105 z-10 shadow-xl' : 'border-university-navy/10 bg-white text-university-navy'}`}>
      <div className={`inline-block text-[10px] uppercase tracking-widest font-bold mb-4 ${featured ? 'text-university-gold' : 'text-university-crimson'}`}>
        {status}
      </div>
      <div className="flex items-baseline gap-1 mb-8">
        <span className={`font-serif text-5xl md:text-6xl ${featured ? 'text-white' : 'text-university-navy'}`}>{price.startsWith('$') ? price : `$${price}`}</span>
        <span className="text-[10px] uppercase tracking-widest font-bold opacity-60 underline underline-offset-4 decoration-university-gold">{period}</span>
      </div>
      <ul className="space-y-4 mb-10 flex-grow">
        {features.map((f, i) => (
          <li key={i} className="text-sm font-medium flex items-start gap-3">
             <div className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${featured ? 'bg-university-gold' : 'bg-university-crimson'}`} />
             <span className="opacity-80 leading-relaxed">{f}</span>
          </li>
        ))}
      </ul>
      <button 
        onClick={() => soundManager.playClick()}
        className={`w-full py-4 uppercase tracking-widest text-xs font-bold transition-all focus-visible:ring-2 focus-visible:ring-university-gold focus-visible:outline-none ${featured ? 'bg-university-gold text-university-navy hover:bg-white' : 'bg-university-navy text-white hover:bg-university-crimson'}`}
      >
        Secure Enrollment
      </button>
    </div>
  )
}

function FeatureItem({ icon, title, desc }: { icon: ReactNode, title: string, desc: string }) {
  return (
    <div className="flex flex-col gap-6 p-6 border border-university-navy/5 hover:border-university-navy/20 transition-all group">
      <div className="w-14 h-14 bg-university-paper border border-university-navy/10 flex items-center justify-center group-hover:bg-university-navy group-hover:text-white transition-all">
        {icon}
      </div>
      <div>
        <h4 className="font-serif text-2xl text-university-navy mb-3 group-hover:text-university-crimson transition-colors">{title}</h4>
        <p className="text-sm text-university-navy/60 leading-relaxed font-light">{desc}</p>
      </div>
    </div>
  )
}
