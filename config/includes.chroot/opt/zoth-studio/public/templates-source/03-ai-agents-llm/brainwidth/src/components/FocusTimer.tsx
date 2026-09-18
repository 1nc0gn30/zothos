import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, X, CheckCircle2 } from 'lucide-react';
import { Task } from '../types';
import { cn } from '../lib/utils';
import { 
  playClickSound, 
  playTimerStartSound, 
  playTimerPauseSound, 
  playTimerCompleteSound 
} from '../lib/audio';

interface FocusTimerProps {
  task: Task;
  onClose: () => void;
  onComplete: (id: string) => void;
}

export const FocusTimer: React.FC<FocusTimerProps> = ({ task, onClose, onComplete }) => {
  const [timeLeft, setTimeLeft] = React.useState(task.durationMinutes * 60);
  const [isActive, setIsActive] = React.useState(false);
  const [isFinished, setIsFinished] = React.useState(false);

  React.useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      setIsFinished(true);
      playTimerCompleteSound();
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => {
    if (isActive) {
      playTimerPauseSound();
      setIsActive(false);
    } else {
      playTimerStartSound();
      setIsActive(true);
    }
  };

  const handleReset = () => {
    playClickSound();
    setIsActive(false);
    setIsFinished(false);
    setTimeLeft(task.durationMinutes * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = 1 - timeLeft / (task.durationMinutes * 60);

  return (
    <div 
      className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-[60] p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="focus-timer-title"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-lg bg-white/5 border border-white/10 rounded-[40px] p-8 md:p-12 text-center relative overflow-hidden shadow-2xl"
      >
        {/* Background Glow */}
        <div className={cn(
          "absolute inset-0 opacity-10 blur-[100px] -z-10",
          task.category === 'Deep Work' ? "bg-emerald-500" : "bg-blue-500"
        )} />

        <button 
          onClick={() => { playClickSound(); onClose(); }}
          className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors p-2 rounded-full"
          aria-label="Close focus timer"
        >
          <X size={24} />
        </button>

        <div className="space-y-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-500 mb-2 block">Focus Mode</span>
            <h2 id="focus-timer-title" className="text-3xl font-bold text-white tracking-tight">{task.title}</h2>
            <p className="text-slate-400 mt-2 text-sm">{task.category} • <span className="font-mono text-emerald-400">{task.bandwidthScore} BW</span></p>
          </div>

          <div className="relative w-64 h-64 mx-auto flex items-center justify-center" role="timer" aria-live="polite">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="128"
                cy="128"
                r="120"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className="text-white/5"
              />
              <motion.circle
                cx="128"
                cy="128"
                r="120"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeDasharray={754}
                animate={{ strokeDashoffset: 754 - (754 * progress) }}
                className={cn(
                  "transition-all duration-1000",
                  task.category === 'Deep Work' ? "text-emerald-500" : "text-blue-500"
                )}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl font-mono font-light text-white tracking-tighter">
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6">
            <button 
              onClick={handleReset}
              className="p-4 bg-white/5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-all border border-white/5"
              aria-label="Reset focus timer"
            >
              <RotateCcw size={24} />
            </button>
            
            <button 
              onClick={toggleTimer}
              className={cn(
                "w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-2xl hover:scale-105 active:scale-95",
                isActive ? "bg-white/10 text-white border border-white/20" : "bg-emerald-500 text-white shadow-emerald-500/30"
              )}
              aria-label={isActive ? "Pause timer" : "Start timer"}
            >
              {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
            </button>

            <button 
              onClick={() => {
                playTimerCompleteSound();
                onComplete(task.id);
                onClose();
              }}
              className="p-4 bg-white/5 hover:bg-white/10 rounded-full text-slate-400 hover:text-emerald-500 transition-all border border-white/5"
              aria-label="Mark task as complete"
            >
              <CheckCircle2 size={24} />
            </button>
          </div>

          <AnimatePresence>
            {isFinished && (
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl text-emerald-500 font-medium"
                role="status"
              >
                Session Complete! Great work maintaining focus.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
