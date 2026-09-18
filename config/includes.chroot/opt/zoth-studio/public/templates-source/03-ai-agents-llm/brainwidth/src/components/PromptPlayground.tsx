import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Terminal, Sliders, Play, Copy, Check, Cpu, RefreshCw } from 'lucide-react';
import { parseVoiceTask, estimateBandwidth } from '../services/ai';
import { TaskCategory } from '../types';

interface PresetPrompt {
  name: string;
  category: string;
  rawInput: string;
  description: string;
}

const PRESET_PROMPTS: PresetPrompt[] = [
  {
    name: "Architectural Code Refactor",
    category: "Deep Work",
    rawInput: "Refactor core authentication service to use OAuth2 PKCE flow for 2 hours tomorrow at 9am",
    description: "High cognitive effort task requiring sustained deep focus."
  },
  {
    name: "Sprint Retrospective Sync",
    category: "Meetings",
    rawInput: "Weekly sprint retrospective call with engineering team for 45 minutes",
    description: "Social communication & context switching overhead."
  },
  {
    name: "AI Prompt Optimization Study",
    category: "Learning",
    rawInput: "Read paper on direct preference optimization for 90 minutes daily",
    description: "High mental ingestion rate & cognitive learning bandwidth."
  },
  {
    name: "Clear Inbox & Expense Audit",
    category: "Admin",
    rawInput: "Process pending pull requests and clear receipts for 30 minutes",
    description: "Low-effort administrative maintenance task."
  }
];

export const PromptPlayground: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<number>(0);
  const [customInput, setCustomInput] = useState<string>(PRESET_PROMPTS[0].rawInput);
  const [parsedOutput, setParsedOutput] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Bandwidth calculator interactive state
  const [calcCategory, setCalcCategory] = useState<TaskCategory>('Deep Work');
  const [calcDuration, setCalcDuration] = useState<number>(60);
  const [calcComplexity, setCalcComplexity] = useState<'low' | 'medium' | 'high' | 'extreme'>('high');
  const [timeOfDayFatigue, setTimeOfDayFatigue] = useState<number>(0.2); // 0 (morning) to 0.8 (evening)

  const computedScore = React.useMemo(() => {
    let score = estimateBandwidth("Task", "Description", calcCategory, calcDuration);
    if (calcComplexity === 'low') score -= 1;
    if (calcComplexity === 'extreme') score += 2;
    if (timeOfDayFatigue > 0.5) score += 1;
    return Math.min(Math.max(score, 1), 10);
  }, [calcCategory, calcDuration, calcComplexity, timeOfDayFatigue]);

  const handleTestPrompt = async () => {
    setIsLoading(true);
    try {
      const res = await parseVoiceTask(customInput);
      setParsedOutput(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const selectPreset = (idx: number) => {
    setSelectedPreset(idx);
    setCustomInput(PRESET_PROMPTS[idx].rawInput);
    setParsedOutput(null);
  };

  const handleCopyJSON = () => {
    if (!parsedOutput) return;
    navigator.clipboard.writeText(JSON.stringify(parsedOutput, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8" role="region" aria-label="AI Prompt & Cognitive Load Playground">
      {/* Header banner */}
      <div className="bg-gradient-to-r from-emerald-500/10 via-indigo-500/10 to-purple-500/10 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl relative overflow-hidden">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="text-emerald-400" size={24} />
          <h2 className="text-2xl font-bold text-white tracking-tight">AI Prompt & Cognitive Load Playground</h2>
        </div>
        <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
          Test real-time AI natural language task parsing, custom prompt structures, and live cognitive bandwidth calculation powered by Google Gemini and offline heuristic fallbacks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Prompt Parser Playground */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col justify-between backdrop-blur-xl shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Terminal className="text-emerald-400" size={20} />
                <h3 className="text-lg font-semibold text-white">Prompt Decomposition Tester</h3>
              </div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                Gemini 3 Flash / Fallback
              </span>
            </div>

            {/* Presets selector */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Preset Test Scenarios
              </label>
              <div className="grid grid-cols-2 gap-2">
                {PRESET_PROMPTS.map((preset, idx) => (
                  <button
                    key={preset.name}
                    onClick={() => selectPreset(idx)}
                    className={`text-left p-2.5 rounded-xl border text-xs transition-all ${
                      selectedPreset === idx
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-md'
                        : 'bg-white/5 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10'
                    }`}
                  >
                    <div className="font-semibold truncate">{preset.name}</div>
                    <div className="text-[10px] text-slate-500">{preset.category}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Input textarea */}
            <div className="space-y-2 mb-4">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Input Prompt / Voice Transcript
              </label>
              <textarea
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                rows={3}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 font-sans"
                placeholder="Type any task description e.g. 'Finish API documentation for 45 minutes tomorrow'"
              />
            </div>

            <button
              onClick={handleTestPrompt}
              disabled={isLoading || !customInput.trim()}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
            >
              {isLoading ? <RefreshCw className="animate-spin" size={18} /> : <Play size={18} />}
              {isLoading ? "Executing AI Prompt Parsing..." : "Run Prompt Decomposition"}
            </button>
          </div>

          {/* Parsed JSON Output */}
          {parsedOutput && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 pt-4 border-t border-white/10"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Cpu size={14} /> Output Structured JSON Schema
                </span>
                <button
                  onClick={handleCopyJSON}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 bg-white/5 px-2 py-1 rounded border border-white/10"
                >
                  {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  {copied ? "Copied!" : "Copy JSON"}
                </button>
              </div>
              <pre className="bg-black/60 border border-white/10 rounded-xl p-3 text-xs font-mono text-emerald-300 overflow-x-auto max-h-48 scrollbar-thin">
                {JSON.stringify(parsedOutput, null, 2)}
              </pre>
            </motion.div>
          )}
        </div>

        {/* Live Bandwidth Math & Fatigue Model Simulator */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sliders className="text-indigo-400" size={20} />
              <h3 className="text-lg font-semibold text-white">Cognitive Load Simulator</h3>
            </div>

            <p className="text-xs text-slate-400 mb-6">
              Adjust parameters below to see how task category, duration, mental complexity, and circadian fatigue interact to calculate the real-time Brain Bandwidth (BW) score.
            </p>

            <div className="space-y-4">
              {/* Category */}
              <div>
                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
                  Task Category
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Deep Work', 'Learning', 'Meetings', 'Shallow Work', 'Admin', 'Personal'] as TaskCategory[]).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCalcCategory(cat)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-all ${
                        calcCategory === cat
                          ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300'
                          : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration Slider */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400 uppercase tracking-wider">Duration</span>
                  <span className="text-white font-mono">{calcDuration} minutes</span>
                </div>
                <input
                  type="range"
                  min={15}
                  max={240}
                  step={15}
                  value={calcDuration}
                  onChange={(e) => setCalcDuration(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              {/* Complexity */}
              <div>
                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
                  Task Complexity Factor
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['low', 'medium', 'high', 'extreme'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setCalcComplexity(lvl)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-medium capitalize border transition-all ${
                        calcComplexity === lvl
                          ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                          : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Circadian Fatigue */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400 uppercase tracking-wider">Time-of-Day Fatigue Offset</span>
                  <span className="text-white font-mono">
                    {timeOfDayFatigue < 0.3 ? 'Fresh Morning' : timeOfDayFatigue < 0.6 ? 'Midday Peak' : 'Late Evening'}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={0.9}
                  step={0.1}
                  value={timeOfDayFatigue}
                  onChange={(e) => setTimeOfDayFatigue(Number(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Computed Output Display */}
          <div className="mt-6 pt-4 border-t border-white/10 bg-white/5 rounded-2xl p-4 flex items-center justify-between border border-white/5">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Calculated Bandwidth</span>
              <div className="text-3xl font-extrabold text-white flex items-baseline gap-2">
                {computedScore} <span className="text-sm font-normal text-emerald-400">/ 10 BW</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold px-3 py-1 rounded-full text-white inline-block bg-gradient-to-r from-emerald-500 to-indigo-500">
                {computedScore >= 8 ? 'High Effort (Focus Required)' : computedScore >= 5 ? 'Moderate Strain' : 'Low Mental Load'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
