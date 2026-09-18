import { useState } from 'react';
import { motion } from 'motion/react';
import { DollarSign, TrendingDown, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import { soundEngine } from '../utils/audio';

export default function SavingsCalculator() {
  const [monthlySpend, setMonthlySpend] = useState<number>(4500);

  const calculateSavings = (spend: number) => {
    const auraCost = Math.round(spend * 0.75); // 25% off guaranteed
    const directMonthlySavings = spend - auraCost;
    const directAnnualSavings = directMonthlySavings * 12;
    // Hidden costs: approx 22% overhead on human salary (benefits, taxes, training, PTO)
    const hiddenOverhead = Math.round(spend * 0.22);
    const totalAnnualBenefit = (directMonthlySavings + hiddenOverhead) * 12;

    return {
      auraCost,
      directMonthlySavings,
      directAnnualSavings,
      hiddenOverhead,
      totalAnnualBenefit
    };
  };

  const stats = calculateSavings(monthlySpend);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setMonthlySpend(val);
  };

  return (
    <section id="math" className="py-24 px-6 bg-brand-900 text-white overflow-hidden" aria-label="Cost Comparison Calculator">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-white/10 text-white text-xs font-bold tracking-widest uppercase rounded-full mb-4">
            Interactive ROI Calculator • <kbd className="px-1.5 py-0.5 bg-white/20 rounded text-[10px]">Alt + C</kbd>
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Calculate Your Business <br />
            <span className="text-white/40 italic">Guaranteed Savings</span>
          </h2>
          <p className="text-white/70 text-lg leading-relaxed">
            Drag the slider to your current monthly receptionist expenditure and watch your annual overhead shrink instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Interactive Controls & Sliders */}
          <div className="lg:col-span-6 glass-card-dark p-8 md:p-10 rounded-[2.5rem] space-y-8">
            <div>
              <div className="flex justify-between items-center mb-4">
                <label htmlFor="spend-slider" className="text-sm font-bold uppercase tracking-wider text-white/80">
                  Current Monthly Receptionist Spend
                </label>
                <div className="flex items-center gap-1 text-2xl font-bold text-green-400 font-display">
                  <DollarSign size={20} />
                  <span>{monthlySpend.toLocaleString()}</span>
                  <span className="text-xs text-white/50 font-normal">/mo</span>
                </div>
              </div>

              <input
                id="spend-slider"
                type="range"
                min="2000"
                max="12000"
                step="250"
                value={monthlySpend}
                onChange={handleSliderChange}
                onInput={() => soundEngine.playClick()}
                className="w-full h-3 bg-white/20 rounded-lg appearance-none cursor-pointer accent-green-400 focus:outline-none focus:ring-2 focus:ring-green-400"
              />

              <div className="flex justify-between text-xs text-white/40 mt-2 font-mono">
                <span>$2,000/mo</span>
                <span>$6,000/mo</span>
                <span>$12,000/mo</span>
              </div>
            </div>

            {/* Quick preset buttons */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-white/50 block mb-3">
                Common Industry Benchmarks:
              </span>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Single Clinic', val: 3500 },
                  { label: 'Law Firm', val: 5500 },
                  { label: 'Multi-Location', val: 9000 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => {
                      soundEngine.playClick();
                      setMonthlySpend(preset.val);
                    }}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      monthlySpend === preset.val
                        ? 'bg-green-500 text-slate-900 border-green-400 font-bold'
                        : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
                    }`}
                  >
                    {preset.label} (${(preset.val / 1000).toFixed(1)}k)
                  </button>
                ))}
              </div>
            </div>

            {/* Bullet benefits */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center">
                  <CheckCircle2 size={16} />
                </div>
                <span className="text-sm font-medium text-white/90">25% baseline discount locked into contract</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center">
                  <CheckCircle2 size={16} />
                </div>
                <span className="text-sm font-medium text-white/90">Zero payroll taxes, health insurance, or PTO costs</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center">
                  <CheckCircle2 size={16} />
                </div>
                <span className="text-sm font-medium text-white/90">24/7/365 coverage with zero holiday overtime pay</span>
              </div>
            </div>
          </div>

          {/* Savings Display Cards */}
          <div className="lg:col-span-6 space-y-6">
            {/* Primary Annual Savings Highlight */}
            <motion.div
              key={monthlySpend}
              initial={{ scale: 0.96, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="p-8 md:p-10 rounded-[2.5rem] bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-transparent border border-emerald-500/30 relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 block mb-1">
                    Guaranteed Direct Savings
                  </span>
                  <h3 className="text-4xl md:text-5xl font-display font-bold text-white">
                    ${stats.directAnnualSavings.toLocaleString()}
                    <span className="text-sm font-normal text-emerald-300 font-sans ml-2">/year</span>
                  </h3>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center">
                  <TrendingDown size={30} />
                </div>
              </div>

              <p className="text-emerald-100/80 text-sm leading-relaxed mb-6">
                You save <strong className="text-white">${stats.directMonthlySavings.toLocaleString()} every month</strong> directly on subscription cost compared to human receptionist overhead.
              </p>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10 flex items-center justify-between text-xs font-mono">
                <span className="text-white/60">AURA Monthly Rate:</span>
                <span className="text-emerald-400 font-bold text-sm">${stats.auraCost.toLocaleString()}/mo</span>
              </div>
            </motion.div>

            {/* Total Annual Value Card */}
            <div className="p-6 md:p-8 rounded-[2rem] bg-white/5 border border-white/10 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/50 mb-2">
                  <Sparkles size={14} className="text-amber-400" />
                  Hidden Overhead Eliminated
                </div>
                <p className="text-2xl font-bold font-display text-amber-300">
                  +${(stats.hiddenOverhead * 12).toLocaleString()}
                </p>
                <p className="text-xs text-white/50 mt-1">Benefits, taxes, PTO, turnover training</p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/50 mb-2">
                  <ShieldCheck size={14} className="text-blue-400" />
                  Total Net Business Value
                </div>
                <p className="text-2xl font-bold font-display text-white">
                  ${stats.totalAnnualBenefit.toLocaleString()}
                </p>
                <p className="text-xs text-white/50 mt-1">Combined direct + indirect ROI per year</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
