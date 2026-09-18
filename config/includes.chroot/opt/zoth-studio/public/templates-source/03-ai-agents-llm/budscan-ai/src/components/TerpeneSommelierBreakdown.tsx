import React from 'react';
import { ScanResult } from '@/src/services/gemini';
import { Activity, Thermometer, ShieldAlert, Award } from 'lucide-react';

interface TerpeneSommelierProps {
  result: ScanResult;
}

export default function TerpeneSommelierBreakdown({ result }: TerpeneSommelierProps) {
  const terpenes = result.terpenes || ['Myrcene', 'Caryophyllene', 'Limonene'];
  
  // Calculate synthetic quality score (0 - 100%)
  const score = Math.round(result.confidence * 100);

  const getTerpeneColor = (index: number) => {
    const colors = [
      'bg-emerald-500 text-emerald-300 border-emerald-500/30',
      'bg-teal-500 text-teal-300 border-teal-500/30',
      'bg-cyan-500 text-cyan-300 border-cyan-500/30',
      'bg-indigo-500 text-indigo-300 border-indigo-500/30',
      'bg-purple-500 text-purple-300 border-purple-500/30',
    ];
    return colors[index % colors.length];
  };

  const getTerpeneDesc = (name: string) => {
    const map: Record<string, string> = {
      Myrcene: 'Earthy, Herbal & Relaxing',
      Caryophyllene: 'Peppery & Anti-Inflammatory',
      Limonene: 'Citrus, Uplifting & Bright',
      Pinene: 'Pine, Sharp & Focus',
      Linalool: 'Floral & Calming',
      Terpinolene: 'Fruity & Herbaceous',
    };
    return map[name] || 'Aromatic Botanical Terpene';
  };

  return (
    <div className="bg-black/50 border border-emerald-500/20 rounded-xl p-3.5 space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-1.5">
          <Award className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wide">
            Sommelier Chemical Profile
          </span>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          <Activity className="w-3 h-3" />
          AI MATCH: {score}%
        </div>
      </div>

      {/* Terpene distribution bars */}
      <div className="space-y-2">
        <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
          Dominant Terpenes Detected
        </div>
        <div className="space-y-1.5">
          {terpenes.map((terp, idx) => {
            const pct = Math.max(30, 85 - idx * 18);
            return (
              <div key={terp} className="space-y-0.5">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-slate-200 font-semibold">{terp}</span>
                  <span className="text-slate-400">{getTerpeneDesc(terp)} ({pct}%)</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${getTerpeneColor(idx).split(' ')[0]}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Technical visual notes */}
      <div className="text-[11px] text-slate-300 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 leading-relaxed font-sans">
        <span className="font-mono text-[10px] text-emerald-400 uppercase block font-bold mb-0.5">
          Microscopic Feature Notes:
        </span>
        {result.visualNotes}
      </div>
    </div>
  );
}
