import React from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, Zap, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface BrainStatusProps {
  currentLoad: number;
  peakLoad: number;
}

export const BrainStatus: React.FC<BrainStatusProps> = ({ currentLoad, peakLoad }) => {
  const limit = 10;
  const percentage = Math.min(100, (peakLoad / limit) * 100);
  
  let statusColor = "text-emerald-500";
  let bgColor = "bg-emerald-500";
  let shadowColor = "shadow-emerald-500/20";
  let label = "Optimal";
  let description = "Your cognitive load is well-managed.";

  if (peakLoad > limit) {
    statusColor = "text-red-500";
    bgColor = "bg-red-500";
    shadowColor = "shadow-red-500/20";
    label = "Overloaded";
    description = "Critical peak detected. Reschedule tasks.";
  } else if (peakLoad > limit * 0.7) {
    statusColor = "text-amber-500";
    bgColor = "bg-amber-500";
    shadowColor = "shadow-amber-500/20";
    label = "High Load";
    description = "Approaching capacity. Be careful.";
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-8">
      <div className="relative w-32 h-32 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="58"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-white/5"
          />
          <motion.circle
            cx="64"
            cy="64"
            r="58"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray={364.4}
            initial={{ strokeDashoffset: 364.4 }}
            animate={{ strokeDashoffset: 364.4 - (364.4 * percentage) / 100 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={statusColor}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-white">{Math.round(peakLoad)}</span>
          <span className="text-[10px] text-slate-500 uppercase font-bold">Peak BW</span>
        </div>
      </div>

      <div className="flex-1 text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
          <h2 className={cn("text-2xl font-bold", statusColor)}>{label}</h2>
          {peakLoad > limit ? <AlertTriangle size={20} className={statusColor} /> : <Zap size={20} className={statusColor} />}
        </div>
        <p className="text-slate-400 text-sm mb-4">{description}</p>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
            <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Current Load</div>
            <div className="text-xl font-bold text-white">{currentLoad} BW</div>
          </div>
          <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
            <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Daily Peak</div>
            <div className="text-xl font-bold text-white">{peakLoad} BW</div>
          </div>
        </div>
      </div>
    </div>
  );
};
