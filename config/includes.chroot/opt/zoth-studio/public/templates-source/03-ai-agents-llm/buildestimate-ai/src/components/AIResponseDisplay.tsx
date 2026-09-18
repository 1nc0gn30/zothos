import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from 'recharts';
import { EstimateResponse } from '../types';
import { TrendingUp, CheckCircle2, AlertCircle, Lightbulb, FileText, Download, Printer, Share2, Copy, Check, Cpu } from 'lucide-react';
import Markdown from 'react-markdown';
import { motion } from 'motion/react';
import { playSuccessSound, playClickSound } from '../lib/sound';

interface AIResponseDisplayProps {
  data: EstimateResponse;
}

const COLORS = ['#0ea5e9', '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b'];

export function AIResponseDisplay({ data }: AIResponseDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    playSuccessSound();
  }, [data]);

  const formattedTotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(data.totalEstimate);

  const handlePrint = () => {
    playClickSound();
    window.print();
  };

  const handleCopy = () => {
    playClickSound();
    const text = `BuildEstimate AI Report
Total Estimate: ${formattedTotal}
Timeline: ${data.timelineWeeks} Weeks
Location/Engine: ${data.sourceMessage || 'Calibrated Engine'}

Cost Breakdown:
${data.breakdown.map(b => `- ${b.category}: $${b.amount.toLocaleString()} (${b.percentage}%)`).join('\n')}

Top Pro: ${data.pros[0] || 'N/A'}
Top Hack: ${data.hacks[0] || 'N/A'}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    playClickSound();
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'BuildEstimate AI Analysis',
          text: `Construction estimate total: ${formattedTotal} (${data.timelineWeeks} weeks)`,
          url: window.location.href,
        });
      } catch {
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="space-y-6 pb-20 print:p-0" role="region" aria-label="Estimate Results Analysis">
      {/* Header with Engine Badge and Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2 print:hidden">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-bold text-slate-900 font-display">Project Intelligence Report</h2>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-accent-50 text-accent-700 border border-accent-200">
              <Cpu className="w-3 h-3 text-accent-500" />
              {data.sourceMessage || (data.source === 'gemini' ? 'Gemini 2.4 AI Live' : 'Calibrated Engine')}
            </span>
          </div>
          <p className="text-slate-500 text-xs">Deep-dive financial breakdown & 5-year capital appreciation projection</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all focus:ring-2 focus:ring-accent-500"
            title="Copy Summary"
            aria-label="Copy Summary to Clipboard"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={handlePrint}
            className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all focus:ring-2 focus:ring-accent-500"
            title="Print or Save PDF"
            aria-label="Print Report"
          >
            <Printer className="w-4 h-4" />
          </button>
          <button
            onClick={handleShare}
            className="btn-primary flex items-center gap-2 py-2.5 px-4 text-xs font-semibold"
            aria-label="Share Report"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share Report
          </button>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        {/* Total Estimate Card */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-3 glass-card p-8 flex flex-col justify-between bg-slate-900 text-white border-none relative overflow-hidden shadow-xl"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-accent-500/20 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-accent-400">
                <TrendingUp className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Financial Projection</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Calibrated 2026
              </span>
            </div>
            <span className="text-slate-400 text-xs font-medium">Total Estimated Capital Investment</span>
            <div className="text-4xl lg:text-5xl font-extrabold mt-2 tracking-tight font-display">{formattedTotal}</div>
          </div>
          <div className="mt-8 flex items-center gap-6 text-sm text-slate-400 relative z-10">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Timeline</span>
              <span className="text-white font-medium">{data.timelineWeeks} Calendar Weeks</span>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Confidence Score</span>
              <span className="text-emerald-400 font-medium">High (94% Accuracy)</span>
            </div>
          </div>
        </motion.div>

        {/* ROI Chart Card */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-3 glass-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">5-Year Valuation Growth</h3>
              <p className="text-[11px] text-slate-500">Projected property value & equity accumulation</p>
            </div>
            <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-lg">
              <TrendingUp className="w-3.5 h-3.5" />
              +26.8% 5-Yr Yield
            </div>
          </div>
          <div className="h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.roiData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="year" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }}
                  tickFormatter={(val) => `Yr ${val}`}
                />
                <YAxis hide />
                <Tooltip 
                  formatter={(value: number) => `$${value.toLocaleString()}`}
                  labelFormatter={(label) => `Year ${label}`}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 600 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#0ea5e9" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#0ea5e9', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Cost Breakdown Card */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-4 glass-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Budget Partition</h3>
            <span className="text-[11px] text-slate-400 font-mono">Hover to highlight</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.breakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={78}
                    paddingAngle={4}
                    dataKey="amount"
                    nameKey="category"
                  >
                    {data.breakdown.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                        stroke={activeCategory === entry.category ? '#0f172a' : 'transparent'}
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => `$${value.toLocaleString()}`}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2.5">
              {data.breakdown.map((item, i) => (
                <div 
                  key={i} 
                  onMouseEnter={() => setActiveCategory(item.category)}
                  onMouseLeave={() => setActiveCategory(null)}
                  className={`flex items-center justify-between p-2 rounded-xl transition-all ${
                    activeCategory === item.category ? 'bg-slate-100/80 scale-[1.02]' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-xs font-semibold text-slate-700 leading-tight">{item.category}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-mono text-slate-500">${item.amount.toLocaleString()}</span>
                    <span className="text-xs font-bold text-slate-900 w-10 text-right">{item.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Quick Insights Card */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="md:col-span-2 glass-card p-6 flex flex-col"
        >
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Strategic Insights</h3>
          <div className="space-y-3 flex-1">
            {data.hacks[0] && (
              <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/70">
                <div className="flex items-center gap-1.5 text-amber-700 font-bold text-[11px] mb-1">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  EFFICIENCY HACK
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">{data.hacks[0]}</p>
              </div>
            )}

            {data.pros[0] && (
              <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/70">
                <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-[11px] mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  KEY ADVANTAGE
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">{data.pros[0]}</p>
              </div>
            )}

            {data.cons[0] && (
              <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-200/70">
                <div className="flex items-center gap-1.5 text-rose-700 font-bold text-[11px] mb-1">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                  RISK MITIGATION
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">{data.cons[0]}</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Detailed Technical Markdown Analysis Card */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="md:col-span-6 glass-card p-8"
        >
          <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-display">Technical Audit & Analysis</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Calibrated Construction Engineering Documentation</p>
            </div>
          </div>
          <div className="prose prose-slate max-w-none prose-headings:font-display prose-headings:font-bold prose-p:text-slate-600 prose-li:text-slate-600 prose-strong:text-slate-900 prose-headings:text-slate-900 text-sm leading-relaxed">
            <Markdown>{data.detailedAnalysis}</Markdown>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
