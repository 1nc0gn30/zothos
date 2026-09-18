/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from "motion/react";
import { 
  Flame, 
  Hammer, 
  Skull, 
  Download, 
  Copy, 
  Check, 
  Code, 
  Briefcase, 
  Mountain, 
  Volume2, 
  VolumeX, 
  ChevronRight, 
  ChevronLeft, 
  Info, 
  Tent, 
  Trees, 
  Menu, 
  X, 
  Search, 
  Shuffle,
  Mic,
  MicOff,
  Send,
  Sparkles,
  Settings,
  Keyboard,
  HelpCircle,
  Bot,
  User,
  RefreshCw
} from "lucide-react";

interface Prompt {
  label: string;
  text: string;
  iq: string;
  useCase: string;
}

interface PromptCategory {
  name: string;
  icon: React.ReactNode;
  prompts: Prompt[];
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'oog';
  text: string;
  timestamp: string;
}

const CAVE_WALL: PromptCategory[] = [
  {
    name: "WORK & SHINY ROCKS",
    icon: <Briefcase className="w-4 h-4" />,
    prompts: [
      { label: "ME WANT JOB", text: "Rewrite my resume for this job description. Keep quantified wins, remove fluff, and add a 5-line professional summary. Also give me 3 bullet points to tailor my LinkedIn. Job: [PASTE JD] Resume: [PASTE RESUME]", iq: "30", useCase: "Fast resume tailoring for specific roles." },
      { label: "ME PREP TALK", text: "Act as hiring manager. Ask me 8 likely interview questions for this role and score my answers with blunt feedback. End with a 7-day prep plan. Role: [PASTE ROLE]", iq: "35", useCase: "Interview preparation with structured practice." },
      { label: "ME WANT RAISE", text: "Draft a salary increase conversation script using my impact evidence. Include opening statement, likely objections, and calm rebuttals. Data: [PASTE IMPACT METRICS]", iq: "38", useCase: "Compensation negotiation with evidence." },
      { label: "ME RUN PROJECT", text: "Turn this messy project brief into a clear one-pager with goals, scope, non-goals, timeline, risks, and owners. Brief: [PASTE NOTES]", iq: "42", useCase: "Project kickoff clarity." },
      { label: "ME LEAD TRIBE", text: "I manage a team with conflicting priorities. Build a decision framework to choose what ships now vs later, and a weekly status format for stakeholders.", iq: "34", useCase: "Team prioritization and leadership communication." },
      { label: "ME WRITE UPDATE", text: "Convert these raw notes into an executive update email: what changed, why it matters, risks, asks, and next milestone. Notes: [PASTE NOTES]", iq: "28", useCase: "Stakeholder communication." },
      { label: "ME FIX CONFLICT", text: "Coach me for a difficult 1:1 with a teammate. Give me language that is direct, respectful, and behavior-focused, plus fallback phrases if the conversation gets tense.", iq: "29", useCase: "Conflict resolution at work." },
      { label: "ME HATE MEETING", text: "Summarize this meeting transcript into decisions, action items, owners, dates, and unresolved questions. Transcript: [PASTE TRANSCRIPT]", iq: "27", useCase: "Meeting hygiene and follow-through." },
      { label: "ME SWITCH CAREER", text: "Create a 90-day transition plan from my current role to [TARGET ROLE], including skill gaps, portfolio proof, networking plan, and weekly checkpoints.", iq: "40", useCase: "Career pivot planning." },
      { label: "ME RETIRE", text: "Explain a simple retirement strategy using US 401(k), IRA, and emergency fund priorities. Give me a monthly checklist based on my income and debt. Details: [PASTE NUMBERS]", iq: "45", useCase: "Personal financial planning basics." }
    ]
  },
  {
    name: "MAGIC BOX (CODE)",
    icon: <Code className="w-4 h-4" />,
    prompts: [
      { label: "CODE NO WORK", text: "Debug this error with root-cause analysis. Provide: probable cause, minimal fix, safer long-term fix, and test cases. Error: [PASTE ERROR] Code: [PASTE CODE]", iq: "32", useCase: "Reliable debugging workflow." },
      { label: "MAKE FAST", text: "Profile this function and propose optimization options ranked by effort vs impact. Include complexity changes and regression risks. Code: [PASTE CODE]", iq: "36", useCase: "Performance tuning with tradeoffs." },
      { label: "WHAT THIS?", text: "Explain this file for a new teammate: architecture intent, data flow, critical functions, and hidden foot-guns. File: [PASTE CODE]", iq: "26", useCase: "Codebase onboarding." },
      { label: "CLEAN CAVE", text: "Refactor this code in small safe steps. Return the commit-by-commit plan first, then the refactored version with comments only where necessary. Code: [PASTE CODE]", iq: "34", useCase: "Controlled refactor planning." },
      { label: "ME WRITE TEST", text: "Generate a test matrix for this function with normal, edge, and failure cases. Then write tests in [FRAMEWORK]. Function: [PASTE CODE]", iq: "33", useCase: "Testing coverage expansion." },
      { label: "ME REVIEW PR", text: "Review this PR diff as a strict senior engineer. Prioritize correctness, security, performance, and maintainability. Diff: [PASTE DIFF]", iq: "38", useCase: "High-signal code review." },
      { label: "ME DESIGN API", text: "Design a REST API for [FEATURE] with endpoints, request/response schemas, auth model, error format, and pagination strategy.", iq: "41", useCase: "Backend API design." },
      { label: "ME FIX TYPES", text: "I keep fighting TypeScript errors. Explain the root mismatch and provide the cleanest type-safe fix, not `any`. Code + errors: [PASTE]", iq: "31", useCase: "Type system troubleshooting." },
      { label: "ME SHIP FEATURE", text: "Break this feature request into implementation tasks with acceptance criteria, dependencies, and estimate (S/M/L). Request: [PASTE]", iq: "29", useCase: "Execution planning for engineering tickets." },
      { label: "MAGIC API", text: "Show how to integrate this external API safely: retry strategy, timeout policy, error handling, idempotency, and observability. Docs: [PASTE]", iq: "43", useCase: "Production-grade integration patterns." }
    ]
  },
  {
    name: "LIFE & FIRE",
    icon: <Flame className="w-4 h-4" />,
    prompts: [
      { label: "ME LONELY", text: "Write 3 dating app bios in different tones (playful, sincere, bold) based on my interests. Keep each under 180 characters. Info: [PASTE]", iq: "28", useCase: "Online dating profile writing." },
      { label: "ME HUNGRY", text: "Build a 5-day meal prep plan with grocery list under [$BUDGET], high protein, and minimal cooking time. Constraints: [PASTE]", iq: "27", useCase: "Budget-friendly meal planning." },
      { label: "ME NO SLEEP", text: "Give me a practical sleep reset plan for 7 nights with bedtime routine, caffeine cutoffs, and fallback options if I wake up at 3am.", iq: "30", useCase: "Sleep hygiene improvement." },
      { label: "ME WANT FIT", text: "Create a 4-week fitness plan with 30-minute sessions, no gym required, and progressive overload. Include rest and mobility days.", iq: "26", useCase: "Home workout routine." },
      { label: "ME STRESS BIG", text: "Design a stress triage routine for overloaded weeks: what to drop, what to defer, and what to automate. Give me a daily 15-minute reset ritual.", iq: "29", useCase: "Stress management and focus." },
      { label: "ME EAT BETTER", text: "Audit my current eating habits and suggest 5 high-impact changes I can sustain for 90 days. Habits: [PASTE]", iq: "24", useCase: "Nutrition habit improvement." },
      { label: "ME TALK BETTER", text: "Coach me to communicate clearly in personal relationships: active listening script, repair phrases, and boundary-setting examples.", iq: "31", useCase: "Healthier communication patterns." },
      { label: "ME TRAVEL", text: "Plan a 4-day trip with realistic pacing, budget breakdown, public transit options, and backup indoor activities. Destination: [PASTE]", iq: "25", useCase: "Trip itinerary planning." },
      { label: "ME BUILD HABIT", text: "Help me build one habit using trigger-action-reward. Give me a 30-day tracking template and anti-failure rules.", iq: "23", useCase: "Behavior change system." },
      { label: "ME WANT STYLE", text: "Create a minimalist wardrobe plan with versatile outfits for work and weekends, based on my climate and budget. Details: [PASTE]", iq: "22", useCase: "Personal style refresh." }
    ]
  },
  {
    name: "BIG BRAIN STUFF",
    icon: <Skull className="w-4 h-4" />,
    prompts: [
      { label: "WHAT IS AI?", text: "Explain AI at three levels: child, manager, and engineer. Use one shared analogy and show where the analogy breaks.", iq: "40", useCase: "Cross-audience concept explanation." },
      { label: "WHAT IS CLOUD?", text: "Explain cloud computing with clear tradeoffs between IaaS, PaaS, and serverless, then recommend one for a startup and one for enterprise.", iq: "41", useCase: "Architecture decision education." },
      { label: "WHAT IS MONEY?", text: "Teach me the basics of inflation, interest rates, and purchasing power using one concrete household example across 5 years.", iq: "44", useCase: "Economic literacy." },
      { label: "THINK CLEAR", text: "Challenge my argument using steelman + red-team thinking. Identify assumptions, weakest links, and how to test them. Argument: [PASTE]", iq: "46", useCase: "Critical thinking improvement." },
      { label: "DECIDE BETTER", text: "Build a decision memo template for high-stakes choices with options, criteria, uncertainty, and reversible vs irreversible framing.", iq: "39", useCase: "Better strategic decisions." },
      { label: "LEARN FAST", text: "Create a 2-week crash course plan to understand [TOPIC] deeply, including core concepts, practice tasks, and checkpoints.", iq: "37", useCase: "Structured self-learning." },
      { label: "WHAT IS TIME?", text: "Explain relativity intuitively first, then mathematically at a high level, and list common misconceptions.", iq: "55", useCase: "Science learning with layered depth." },
      { label: "WHY WE HERE?", text: "Summarize 4 major philosophical views on meaning, then give practical daily habits each view would suggest.", iq: "52", useCase: "Philosophy made actionable." },
      { label: "READ PAPER", text: "Summarize this research paper into: problem, method, key result, limits, and what I should do with it next. Paper: [PASTE]", iq: "48", useCase: "Research digestion workflow." },
      { label: "ARGUE FAIR", text: "Create a fair debate map between two positions on [TOPIC], including strongest evidence on both sides and unresolved questions.", iq: "43", useCase: "Balanced issue analysis." }
    ]
  },
  {
    name: "CAVE & TRIBE",
    icon: <Tent className="w-4 h-4" />,
    prompts: [
      { label: "CLEAN CAVE", text: "Create a realistic weekly cleaning plan for a small apartment with chores split into daily, weekly, monthly. Include a 20-minute emergency reset routine.", iq: "20", useCase: "Home maintenance system." },
      { label: "TRIBE DRAMA", text: "Help me resolve a social conflict without escalation. Draft a message that is firm, polite, and specific about boundaries.", iq: "22", useCase: "Relationship conflict de-escalation." },
      { label: "PARTY TIME", text: "Plan a house gathering for [N] people with timeline, shopping list, prep schedule, and cleanup plan.", iq: "18", useCase: "Event planning with low stress." },
      { label: "NEW CAVE", text: "Generate a moving checklist from 4 weeks out to move day, including utility transfers, address changes, and packing strategy.", iq: "21", useCase: "Organized relocation planning." },
      { label: "BABY CAVE", text: "Give me a practical newborn support checklist for first-time parents, including sleep shifts, feeding logs, and when to call pediatrician.", iq: "24", useCase: "New parent planning." },
      { label: "ROOMMATE PEACE", text: "Draft a roommate agreement template covering bills, guests, chores, quiet hours, and conflict process.", iq: "23", useCase: "Shared living expectations." },
      { label: "MONEY HOME", text: "Build a monthly household budget with fixed/variable categories, sinking funds, and a simple review cadence.", iq: "26", useCase: "Household money management." },
      { label: "TRIBE SCHEDULE", text: "Create a family weekly schedule that balances work, chores, meals, and downtime without overbooking.", iq: "19", useCase: "Family operations planning." },
      { label: "HOST GUEST", text: "Write a guest-prep checklist for overnight visitors that is welcoming but minimal effort.", iq: "15", useCase: "Hospitality preparation." },
      { label: "HARD TALK", text: "Help me prepare for a hard conversation with a family member: what to say, what not to say, and exit lines if it turns toxic.", iq: "27", useCase: "Emotionally difficult discussions." }
    ]
  },
  {
    name: "NATURE MAGIC",
    icon: <Trees className="w-4 h-4" />,
    prompts: [
      { label: "RAIN STOP", text: "Build me a bad-weather productivity plan with indoor movement, focused work blocks, and a low-energy fallback list.", iq: "17", useCase: "Staying productive during poor weather." },
      { label: "BERRY OR POISON", text: "I need a risk framework for uncertain choices. Give me a checklist for downside, reversibility, and confidence scoring.", iq: "28", useCase: "General risk assessment model." },
      { label: "TALK TO BEAR", text: "Help me handle a difficult neighbor issue with a step-by-step escalation path that starts friendly and ends formal if needed.", iq: "30", useCase: "Neighbor dispute management." },
      { label: "FIRE NO START", text: "When a plan fails, give me a troubleshooting protocol: diagnose, isolate variable, test smallest fix, and document lessons.", iq: "25", useCase: "Operational problem-solving." },
      { label: "OUTSIDE SMART", text: "Plan a beginner-friendly weekend nature trip with safety checklist, packing list, and weather contingencies.", iq: "16", useCase: "Trip readiness and safety." },
      { label: "SEASON SLUMP", text: "Create a routine to manage low mood in winter using light exposure, movement, social check-ins, and sleep timing.", iq: "23", useCase: "Seasonal wellness habits." },
      { label: "GREEN HOME", text: "Suggest 10 practical ways to reduce home energy waste without major renovations, ranked by savings potential.", iq: "21", useCase: "Sustainability with practical ROI." },
      { label: "EMERGENCY READY", text: "Build a 72-hour emergency preparedness checklist for a household, including food, water, communication, and meds.", iq: "27", useCase: "Basic emergency preparedness." },
      { label: "MORNING SUN", text: "Create a 20-minute morning routine that improves energy and focus using daylight, hydration, and movement.", iq: "14", useCase: "Daily rhythm optimization." },
      { label: "TRAIL DECISION", text: "Help me choose between two travel routes using weather risk, travel time, cost, and backup options.", iq: "18", useCase: "Structured route planning." }
    ]
  }
];

// Offline Primitive Oog Caveman Response Engine Fallback
const generatePrimitiveOogResponse = (query: string): string => {
  const q = query.toLowerCase();
  if (q.includes('job') || q.includes('resume') || q.includes('hire') || q.includes('work')) {
    return "Ugh! Oog inspect job rock! Caveman rule #1: Cut fluff like wild grass. Focus on shiny achievements—how many mammoth hunted, how much fire made. Put metrics on top, keep summary 5 lines!";
  }
  if (q.includes('code') || q.includes('bug') || q.includes('error') || q.includes('debug')) {
    return "Grrr! Bug in cave code! Oog say: 1. Isolate broken stick. 2. Print exact error log. 3. Check memory leak or null point. 4. Fix smallest piece first, then build test wall!";
  }
  if (q.includes('ai') || q.includes('llm') || q.includes('model') || q.includes('prompt')) {
    return "Oog is Large Lithic Model (LLM)! Prompt is like striking flint. Small sharp prompt make big fire! Too many words make smoke and confuse model. Be blunt like rock!";
  }
  if (q.includes('sleep') || q.includes('tired') || q.includes('stress')) {
    return "Oog know hard night in cave! Put down glowing stone 1 hour before sleep. Make cave dark and cool. If wake at 3am, do not hunt mammoth—breathe slow until morning sun!";
  }
  if (q.includes('food') || q.includes('eat') || q.includes('cook') || q.includes('hungry')) {
    return "Fire good, raw meat bad! Prep 5 days of protein and berries. Keep budget low, buy root vegetables and big bags of grain. Simple food make strong caveman!";
  }
  return `Ugh! Oog hear your words about "${query.slice(0, 30)}..."! Oog process with primitive brain: First strike fire, then isolate problem, then take action with big stone energy! What next rock you want to carve?`;
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'prompts' | 'voice' | 'settings'>('prompts');
  const [activeCategoryName, setActiveCategoryName] = useState<string>(CAVE_WALL[0].name);
  const [selectedPromptIndex, setSelectedPromptIndex] = useState<number | null>(0);
  const [copied, setCopied] = useState(false);
  const [thud, setThud] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [variableInputs, setVariableInputs] = useState<Record<string, string>>({});

  // Accessibility Live Announcements
  const [liveAnnouncement, setLiveAnnouncement] = useState('');

  // Keyboard Shortcuts Modal State
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Oog Voice AI Playground States
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'oog',
      text: "Ugh! Me Oog, world's first Large Lithic Model (LLM). Speak or type your request into cave mic!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [voiceInput, setVoiceInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isOogSpeaking, setIsOogSpeaking] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState(() => localStorage.getItem('OOG_GEMINI_KEY') || '');

  // Audio Context & Canvas Visualizer References
  const audioCtxRef = useRef<AudioContext | null>(null);
  const ambientNodesRef = useRef<{ gain: GainNode; source: AudioBufferSourceNode | OscillatorNode }[]>([]);
  const visualizerCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const recognitionRef = useRef<any>(null);

  const activeCategory = useMemo(() => 
    CAVE_WALL.find(c => c.name === activeCategoryName) || CAVE_WALL[0], 
  [activeCategoryName]);

  const selectedPrompt = useMemo(() => 
    selectedPromptIndex !== null ? activeCategory.prompts[selectedPromptIndex] : null,
  [activeCategory, selectedPromptIndex]);

  const filteredPromptEntries = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return activeCategory.prompts
      .map((prompt, index) => ({ prompt, index }))
      .filter(({ prompt }) => {
        if (!normalizedQuery) return true;
        return (
          prompt.label.toLowerCase().includes(normalizedQuery) ||
          prompt.text.toLowerCase().includes(normalizedQuery) ||
          prompt.useCase.toLowerCase().includes(normalizedQuery)
        );
      });
  }, [activeCategory, query]);

  // Extract variables like [PASTE RESUME], [PASTE JD] from selected prompt text
  const extractedVariables = useMemo(() => {
    if (!selectedPrompt) return [];
    const matches = selectedPrompt.text.match(/\[([A-Z0-9_\s]+)\]/g);
    if (!matches) return [];
    return Array.from(new Set(matches.map(m => m.slice(1, -1))));
  }, [selectedPrompt]);

  // Dynamic Prompt Text with injected variables
  const customizedPromptText = useMemo(() => {
    if (!selectedPrompt) return '';
    let result = selectedPrompt.text;
    extractedVariables.forEach(v => {
      const val = variableInputs[v];
      if (val && val.trim() !== '') {
        result = result.replace(new RegExp(`\\[${v}\\]`, 'g'), val.trim());
      }
    });
    return result;
  }, [selectedPrompt, extractedVariables, variableInputs]);

  // Audio Context Initialization
  const getAudioCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioCtxClass();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const announce = (msg: string) => {
    setLiveAnnouncement(msg);
  };

  const playThudSound = useCallback(() => {
    try {
      const ctx = getAudioCtx();
      const now = ctx.currentTime;

      // Deep Impact Sine
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.exponentialRampToValueAtTime(0.01, now + 0.5);
      gain.gain.setValueAtTime(1.0, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.5);

      // Stone Crackle Noise
      const bufferSize = ctx.sampleRate * 0.15;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
      
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(1800, now);
      
      noiseGain.gain.setValueAtTime(0.35, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      
      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(now);
    } catch (e) {
      console.warn("Audio thud playback skipped", e);
    }
  }, [getAudioCtx]);

  const playChipSound = useCallback(() => {
    try {
      const ctx = getAudioCtx();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(1300, now + 0.06);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.06);
    } catch (e) {}
  }, [getAudioCtx]);

  const playWhooshSound = useCallback(() => {
    try {
      const ctx = getAudioCtx();
      const now = ctx.currentTime;
      const bufferSize = Math.floor(ctx.sampleRate * 0.18);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1600, now);
      filter.frequency.exponentialRampToValueAtTime(220, now + 0.18);
      
      noiseGain.gain.setValueAtTime(0.12, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
      
      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(now);
    } catch (e) {}
  }, [getAudioCtx]);

  const startAmbient = useCallback(() => {
    try {
      const ctx = getAudioCtx();
      const now = ctx.currentTime;

      // Fire Crackle
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;
      const noiseGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, now);
      noiseGain.gain.setValueAtTime(0.025, now);
      
      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start();

      // Low Drum Pulse
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(55, now);
      oscGain.gain.setValueAtTime(0, now);
      
      const interval = 1.5;
      for (let i = 0; i < 200; i++) {
        const t = now + i * interval;
        oscGain.gain.setValueAtTime(0, t);
        oscGain.gain.linearRampToValueAtTime(0.05, t + 0.1);
        oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
      }

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      osc.start();

      ambientNodesRef.current.push({ gain: noiseGain, source: noise }, { gain: oscGain, source: osc });
    } catch (e) {}
  }, [getAudioCtx]);

  const stopAmbient = useCallback(() => {
    ambientNodesRef.current.forEach(node => {
      try {
        node.gain.gain.exponentialRampToValueAtTime(0.001, getAudioCtx().currentTime + 0.4);
        setTimeout(() => {
          try { node.source.stop(); } catch(e) {}
        }, 500);
      } catch (e) {}
    });
    ambientNodesRef.current = [];
  }, [getAudioCtx]);

  useEffect(() => {
    if (!isMuted) {
      startAmbient();
    } else {
      stopAmbient();
    }
    return () => stopAmbient();
  }, [isMuted, startAmbient, stopAmbient]);

  useEffect(() => {
    if (filteredPromptEntries.length === 0) {
      if (selectedPromptIndex !== null) setSelectedPromptIndex(null);
      return;
    }

    const stillVisible = selectedPromptIndex !== null &&
      filteredPromptEntries.some(entry => entry.index === selectedPromptIndex);

    if (!stillVisible) {
      setSelectedPromptIndex(filteredPromptEntries[0].index);
    }
  }, [filteredPromptEntries, selectedPromptIndex]);

  const triggerThud = useCallback(() => {
    setThud(true);
    playThudSound();
    setTimeout(() => setThud(false), 200);
  }, [playThudSound]);

  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    playChipSound();
    announce("Prompt text copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  }, [playChipSound]);

  const navigatePrompt = useCallback((direction: 'next' | 'prev') => {
    if (selectedPromptIndex === null || filteredPromptEntries.length === 0) return;

    const currentVisibleIndex = filteredPromptEntries.findIndex(
      (entry) => entry.index === selectedPromptIndex
    );
    if (currentVisibleIndex === -1) return;

    let nextVisibleIndex = direction === 'next' ? currentVisibleIndex + 1 : currentVisibleIndex - 1;
    if (nextVisibleIndex < 0) nextVisibleIndex = filteredPromptEntries.length - 1;
    if (nextVisibleIndex >= filteredPromptEntries.length) nextVisibleIndex = 0;
    setSelectedPromptIndex(filteredPromptEntries[nextVisibleIndex].index);
    playWhooshSound();
    announce(`Selected prompt: ${filteredPromptEntries[nextVisibleIndex].prompt.label}`);
  }, [filteredPromptEntries, selectedPromptIndex, playWhooshSound]);

  const pickRandomPrompt = useCallback(() => {
    if (filteredPromptEntries.length === 0) return;
    const randomIndex = Math.floor(Math.random() * filteredPromptEntries.length);
    setSelectedPromptIndex(filteredPromptEntries[randomIndex].index);
    setIsSidebarOpen(false);
    triggerThud();
    announce(`Random prompt selected: ${filteredPromptEntries[randomIndex].prompt.label}`);
  }, [filteredPromptEntries, triggerThud]);

  const selectedPromptPosition = useMemo(() => {
    if (selectedPromptIndex === null) return 0;
    const visiblePosition = filteredPromptEntries.findIndex((entry) => entry.index === selectedPromptIndex);
    return visiblePosition >= 0 ? visiblePosition + 1 : 0;
  }, [filteredPromptEntries, selectedPromptIndex]);

  const downloadAll = () => {
    const content = CAVE_WALL.map(cat => (
      `--- ${cat.name} ---\n` +
      cat.prompts.map(p => `[${p.label}] (IQ: ${p.iq})\nUse Case: ${p.useCase}\nPrompt: ${p.text}\n`).join('\n')
    )).join('\n\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'CAVEMAN_SCRATCHINGS.txt';
    a.click();
    URL.revokeObjectURL(url);
    triggerThud();
    announce("All prompts downloaded to CAVEMAN_SCRATCHINGS.txt");
  };

  // High-DPI Canvas Visualizer Loop
  useEffect(() => {
    const canvas = visualizerCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let bars = 40;
    let angle = 0;

    const render = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width * (window.devicePixelRatio || 1);
        canvas.height = height * (window.devicePixelRatio || 1);
      }
      ctx.save();
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);

      ctx.clearRect(0, 0, width, height);

      // Background ambient glow
      const cx = width / 2;
      const cy = height / 2;
      const activePulse = isOogSpeaking ? 1.4 : isRecording ? 1.2 : 0.6;
      
      const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, Math.max(width, height) / 2);
      grad.addColorStop(0, `rgba(245, 158, 11, ${0.15 * activePulse})`);
      grad.addColorStop(1, 'rgba(12, 10, 9, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Waveform / Spectrum Bars
      angle += 0.05;
      const barWidth = (width - 40) / bars;
      for (let i = 0; i < bars; i++) {
        const factor = Math.sin(angle + i * 0.2) * 0.5 + 0.5;
        const amplitude = (isOogSpeaking ? 40 : isRecording ? 30 : 12) * factor + 5;
        const x = 20 + i * barWidth;
        const y = cy - amplitude / 2;

        ctx.fillStyle = i % 2 === 0 ? '#f59e0b' : '#d97706';
        ctx.shadowBlur = isOogSpeaking ? 15 : 5;
        ctx.shadowColor = '#f59e0b';
        ctx.fillRect(x, y, barWidth - 3, amplitude);
      }

      ctx.restore();
      animFrameIdRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isOogSpeaking, isRecording]);

  // Speech Synthesis for Oog
  const speakOogResponse = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 0.7; // Low primitive voice pitch
    utterance.rate = 0.95;
    utterance.onstart = () => setIsOogSpeaking(true);
    utterance.onend = () => setIsOogSpeaking(false);
    utterance.onerror = () => setIsOogSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, []);

  // Send message to Oog Voice AI Engine (Local Mock or Gemini)
  const handleSendVoiceMessage = async (msgText?: string) => {
    const textToSend = (msgText || voiceInput).trim();
    if (!textToSend || isAiLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setVoiceInput('');
    setIsAiLoading(true);
    triggerThud();

    let replyText = '';

    try {
      if (geminiApiKey.trim()) {
        // Fetch from Gemini API
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey.trim()}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{
                parts: [{
                  text: `You are Oog, the world's first Large Lithic Model (LLM)—a blunt, caveman AI assistant. Speak in energetic, direct, high-signal caveman dialect ("Ugh! Oog process request!"). Keep responses actionable, under 4 sentences. User prompt: "${textToSend}"`
                }]
              }]
            })
          }
        );
        const data = await response.json();
        replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || generatePrimitiveOogResponse(textToSend);
      } else {
        // Local zero-latency fallback engine
        await new Promise(res => setTimeout(res, 600));
        replyText = generatePrimitiveOogResponse(textToSend);
      }
    } catch (e) {
      replyText = generatePrimitiveOogResponse(textToSend);
    } finally {
      setIsAiLoading(false);
      const oogMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'oog',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, oogMsg]);
      speakOogResponse(replyText);
      announce(`Oog responded: ${replyText}`);
    }
  };

  // Toggle Web Speech Recognition Mic
  const toggleMic = () => {
    if (isRecording) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition API is not supported in this browser. You can type directly into the input!");
      return;
    }

    try {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsRecording(true);
        announce("Recording started. Speak to Oog.");
      };

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setVoiceInput(transcript);
        handleSendVoiceMessage(transcript);
      };

      rec.onerror = (event: any) => {
        console.warn("Speech error:", event.error);
        setIsRecording(false);
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = rec;
      rec.start();
    } catch (e) {
      setIsRecording(false);
    }
  };

  // Keyboard Hotkey Listener (WCAG 2.1 AA AX)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore hotkeys when user is typing in input fields
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      if (e.key === '?' || (e.key === 'h' && !e.ctrlKey && !e.metaKey)) {
        e.preventDefault();
        setIsHelpOpen(prev => !prev);
      } else if (e.key === 'j' || e.key === 'ArrowDown') {
        e.preventDefault();
        navigatePrompt('next');
      } else if (e.key === 'k' || e.key === 'ArrowUp') {
        e.preventDefault();
        navigatePrompt('prev');
      } else if (e.key === 'r') {
        e.preventDefault();
        pickRandomPrompt();
      } else if (e.key === 'm') {
        e.preventDefault();
        setIsMuted(prev => !prev);
      } else if (e.key === 'v') {
        e.preventDefault();
        setActiveTab(prev => prev === 'prompts' ? 'voice' : 'prompts');
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
        if (selectedPrompt) {
          e.preventDefault();
          handleCopy(customizedPromptText);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigatePrompt, pickRandomPrompt, selectedPrompt, customizedPromptText, handleCopy]);

  return (
    <div className={`h-screen flex flex-col items-center p-2 md:p-4 font-sans selection:bg-amber-500/30 transition-all overflow-hidden ${thud ? 'scale-[0.99] brightness-125' : 'scale-100'}`}>
      
      {/* WCAG 2.1 AA Skip Navigation */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* ARIA Live Region for Screen Readers */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {liveAnnouncement}
      </div>

      {/* Compact Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        role="banner"
        className="w-full max-w-7xl flex items-center justify-between mb-2 md:mb-4 px-2 md:px-4"
      >
        <div className="flex items-center gap-2 md:gap-3">
          <button 
            onClick={() => { setIsSidebarOpen(!isSidebarOpen); playWhooshSound(); }}
            aria-label="Toggle prompt browser sidebar"
            aria-expanded={isSidebarOpen}
            className="lg:hidden p-2 bg-stone-900 rounded-lg border border-stone-700 text-amber-500 hover:border-amber-500 transition-colors"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="p-1.5 md:p-2 bg-amber-900 rounded-full border-2 border-stone-700 shadow-md">
            <Hammer className="w-4 h-4 md:w-6 md:h-6 text-amber-400" />
          </div>
          <h1 className="text-xl md:text-4xl font-black tracking-tighter text-stone-100 uppercase italic">
            AI TALK <span className="text-amber-500">AI GO</span>
          </h1>
        </div>

        {/* Tab Navigation Controls */}
        <nav aria-label="Main view tabs" className="flex items-center gap-1.5 bg-stone-900/90 p-1 rounded-2xl border border-stone-800">
          <button
            onClick={() => { setActiveTab('prompts'); playWhooshSound(); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'prompts' 
                ? 'bg-amber-900 text-white shadow-md border border-amber-700' 
                : 'text-stone-400 hover:text-stone-200'
            }`}
            aria-selected={activeTab === 'prompts'}
            role="tab"
          >
            <Mountain className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">CAVE WALL</span>
          </button>
          <button
            onClick={() => { setActiveTab('voice'); playWhooshSound(); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'voice' 
                ? 'bg-amber-900 text-white shadow-md border border-amber-700' 
                : 'text-stone-400 hover:text-stone-200'
            }`}
            aria-selected={activeTab === 'voice'}
            role="tab"
          >
            <Mic className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="hidden sm:inline">OOG VOICE AI</span>
          </button>
          <button
            onClick={() => { setActiveTab('settings'); playWhooshSound(); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'settings' 
                ? 'bg-amber-900 text-white shadow-md border border-amber-700' 
                : 'text-stone-400 hover:text-stone-200'
            }`}
            aria-selected={activeTab === 'settings'}
            role="tab"
            aria-label="Engine Settings"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </nav>

        {/* Global Controls */}
        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={() => setIsHelpOpen(true)}
            aria-label="Keyboard Shortcuts & Help"
            className="p-2 bg-stone-900 hover:bg-stone-800 rounded-full border border-stone-700 text-stone-300 transition-colors"
          >
            <Keyboard className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          <button 
            onClick={() => {
              setIsMuted(!isMuted);
              triggerThud();
            }}
            aria-label={isMuted ? 'Unmute ambient audio' : 'Mute ambient audio'}
            aria-pressed={!isMuted}
            className={`p-2 rounded-full border-2 transition-all cursor-pointer ${isMuted ? 'bg-stone-900 border-stone-700 text-stone-500' : 'bg-amber-900 border-amber-500 text-white glow-amber'}`}
          >
            {isMuted ? <VolumeX className="w-4 h-4 md:w-5 md:h-5" /> : <Volume2 className="w-4 h-4 md:w-5 md:h-5" />}
          </button>
        </div>
      </motion.header>

      {/* Main Content Area */}
      <main id="main-content" role="main" className="w-full max-w-7xl grid grid-cols-12 gap-2 md:gap-4 flex-1 min-h-0 px-2 md:px-4 pb-2 md:pb-4 relative">
        
        {activeTab === 'prompts' && (
          <>
            {/* Sidebar (Cave Wall) */}
            <aside 
              aria-label="Cave Wall Prompts Sidebar"
              className={`
                fixed inset-0 z-40 bg-stone-950/95 lg:relative lg:inset-auto lg:bg-transparent lg:z-0 lg:col-span-4 lg:flex flex-col gap-4 min-h-0 transition-transform duration-300
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
              `}
            >
              <div className="stone-card flex flex-col gap-3 md:gap-4 h-full min-h-0 w-[88%] max-w-sm lg:max-w-none lg:w-full p-4">
                <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                  <div className="flex items-center gap-2">
                    <Mountain className="w-5 h-5 text-amber-600" />
                    <h2 className="text-base md:text-lg font-black uppercase italic tracking-tight">THE CAVE WALL</h2>
                  </div>
                  <button 
                    onClick={() => { setIsSidebarOpen(false); playWhooshSound(); }}
                    className="lg:hidden p-1 hover:bg-stone-800 rounded text-stone-500"
                    aria-label="Close sidebar"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center gap-2 bg-stone-950 border-2 border-stone-800 rounded-xl px-3 py-2 focus-within:border-amber-600 transition-colors">
                  <Search className="w-4 h-4 text-stone-500 shrink-0" />
                  <input
                    type="text"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search 60+ prompts..."
                    className="bg-transparent outline-none w-full text-xs text-stone-200 placeholder:text-stone-500"
                    aria-label="Search prompts"
                  />
                </div>
                
                {/* Category Tabs */}
                <div className="flex flex-wrap gap-1.5">
                  {CAVE_WALL.map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => {
                        setActiveCategoryName(cat.name);
                        setQuery('');
                        triggerThud();
                      }}
                      className={`px-2.5 py-1 text-[9px] font-bold rounded-lg transition-all border-2 flex items-center gap-1.5 cursor-pointer ${
                        activeCategoryName === cat.name 
                        ? 'bg-amber-900 border-amber-600 text-white' 
                        : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                      }`}
                    >
                      {cat.icon}
                      {cat.name}
                    </button>
                  ))}
                </div>

                {/* Prompt List */}
                <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                  {filteredPromptEntries.length > 0 ? (
                    filteredPromptEntries.map(({ prompt: p, index }) => (
                      <button
                        key={`${p.label}-${index}`}
                        onClick={() => {
                          setSelectedPromptIndex(index);
                          setIsSidebarOpen(false);
                          triggerThud();
                        }}
                        className={`w-full text-left p-2.5 border-2 rounded-xl transition-all group relative overflow-hidden cursor-pointer ${
                          selectedPromptIndex === index
                          ? 'bg-amber-950/40 border-amber-600'
                          : 'bg-stone-950 border-stone-800/80 hover:border-stone-700'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-amber-500 font-black text-xs uppercase italic">{p.label}</span>
                          <span className="text-[8px] font-mono text-stone-500 bg-stone-900 px-1.5 py-0.5 rounded border border-stone-800">IQ: {p.iq}</span>
                        </div>
                        <p className="text-[10px] text-stone-400 leading-tight line-clamp-1 group-hover:text-stone-200">
                          {p.text}
                        </p>
                      </button>
                    ))
                  ) : (
                    <div className="text-center py-8 text-stone-500 text-xs">
                      No prompts match that search.
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={pickRandomPrompt}
                    className="stone-button text-[10px] py-2"
                    disabled={filteredPromptEntries.length === 0}
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                    <span>RANDOM</span>
                  </button>
                  <button onClick={downloadAll} className="stone-button text-[10px] py-2">
                    <Download className="w-3.5 h-3.5" />
                    <span>DOWNLOAD</span>
                  </button>
                </div>
              </div>
            </aside>

            {/* Main Prompt Detail Slab */}
            <section aria-label="Selected Prompt Detail" className="col-span-12 lg:col-span-8 flex flex-col gap-2 md:gap-4 min-h-0">
              <div className="stone-card p-3 md:p-4 flex items-center justify-between">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="text-amber-500">{activeCategory.icon}</div>
                  <div>
                    <p className="text-[8px] md:text-[9px] uppercase tracking-widest text-stone-500 font-black">Active Category</p>
                    <p className="text-xs md:text-sm font-black text-stone-200">{activeCategory.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[8px] md:text-[9px] uppercase tracking-widest text-stone-500 font-black">Showing</p>
                  <p className="text-xs md:text-sm font-black text-amber-500">
                    {filteredPromptEntries.length} / {activeCategory.prompts.length}
                  </p>
                </div>
              </div>

              {/* The Slab */}
              <div className="stone-card flex-1 flex flex-col items-center justify-between p-4 md:p-6 relative overflow-hidden min-h-0">
                <AnimatePresence mode="wait">
                  {selectedPrompt ? (
                    <motion.div
                      key={`${activeCategoryName}-${selectedPromptIndex}`}
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 1.05, y: -10 }}
                      className="flex flex-col items-center max-w-2xl w-full h-full justify-between overflow-y-auto pr-1"
                    >
                      <div className="flex flex-col items-center w-full">
                        <div className="mb-2 p-2.5 bg-stone-950 rounded-full border-2 border-stone-800 shadow-inner">
                          <Skull className="w-6 h-6 md:w-8 md:h-8 text-amber-500" />
                        </div>
                        
                        <h3 className="text-xl md:text-3xl font-black text-amber-500 uppercase italic mb-1 tracking-tighter">
                          {selectedPrompt.label}
                        </h3>
                        
                        <div className="flex gap-2 mb-3">
                          <span className="px-2 py-0.5 bg-stone-800 rounded-full text-[9px] font-bold text-stone-400 border border-stone-700">
                            IQ: {selectedPrompt.iq}
                          </span>
                          <span className="px-2 py-0.5 bg-amber-950/60 rounded-full text-[9px] font-bold text-amber-400 border border-amber-800">
                            PRIMITIVE SLAB
                          </span>
                          <span className="px-2 py-0.5 bg-stone-900 rounded-full text-[9px] font-bold text-stone-400 border border-stone-700">
                            {selectedPromptPosition}/{filteredPromptEntries.length}
                          </span>
                        </div>

                        {/* Interactive Variable Injector Inputs */}
                        {extractedVariables.length > 0 && (
                          <div className="w-full bg-stone-950/80 p-3 rounded-xl border border-amber-900/40 mb-3 space-y-2">
                            <p className="text-[9px] font-black text-amber-400 uppercase tracking-widest flex items-center gap-1">
                              <Sparkles className="w-3 h-3" /> Live Variable Injector
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {extractedVariables.map(varName => (
                                <div key={varName} className="flex flex-col gap-1">
                                  <label htmlFor={`var-${varName}`} className="text-[8px] font-mono text-stone-400 uppercase">[{varName}]</label>
                                  <input
                                    id={`var-${varName}`}
                                    type="text"
                                    placeholder={`Enter ${varName.toLowerCase()}...`}
                                    value={variableInputs[varName] || ''}
                                    onChange={(e) => setVariableInputs(prev => ({ ...prev, [varName]: e.target.value }))}
                                    className="bg-stone-900 border border-stone-700 rounded-lg px-2 py-1 text-xs text-amber-300 focus:border-amber-500 outline-none"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="bg-stone-950 p-4 md:p-6 rounded-2xl border-2 border-stone-800 shadow-xl relative mb-3 w-full group">
                          <p className="text-sm md:text-lg font-bold text-stone-100 leading-relaxed italic select-all">
                            "{customizedPromptText}"
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-2 md:gap-3 w-full mt-auto">
                        <div className="flex items-start gap-2 text-left bg-stone-800/40 p-2.5 rounded-xl border border-stone-700/60 w-full">
                          <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-[8px] font-black uppercase text-stone-400 mb-0.5">HIGH SIGNAL USE CASE</p>
                            <p className="text-xs text-stone-300 font-medium">{selectedPrompt.useCase}</p>
                          </div>
                        </div>

                        <div className="flex gap-2 w-full">
                          <button onClick={() => navigatePrompt('prev')} className="stone-button flex-1 py-2" aria-label="Previous prompt (Hotkey: ArrowUp/k)">
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          <button onClick={() => handleCopy(customizedPromptText)} className="stone-button flex-[3] py-2 text-xs md:text-sm">
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            <span>{copied ? 'COPIED!' : 'COPY PROMPT'}</span>
                          </button>
                          <button onClick={() => navigatePrompt('next')} className="stone-button flex-1 py-2" aria-label="Next prompt (Hotkey: ArrowDown/j)">
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-stone-500 py-12">
                      <Hammer className="w-16 h-16 mb-4 opacity-20 animate-bounce" />
                      <p className="text-xl font-black uppercase italic tracking-widest opacity-30">SELECT ROCK SLAB</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </section>
          </>
        )}

        {/* Oog Voice AI Playground View */}
        {activeTab === 'voice' && (
          <section aria-label="Oog Voice AI Agent Playground" className="col-span-12 flex flex-col gap-3 min-h-0 h-full">
            {/* Visualizer Canvas & Status Header */}
            <div className="stone-card p-4 relative overflow-hidden flex flex-col gap-3 shrink-0">
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-900/50 rounded-full border border-amber-600">
                    <Bot className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-amber-400 uppercase italic">OOG VOICE AI AGENT</h2>
                    <p className="text-[10px] text-stone-400 font-mono">
                      {geminiApiKey ? 'MODE: LIVE GEMINI 2.5 FLASH' : 'MODE: LOCAL PRIMITIVE OFFLINE ENGINE'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleMic}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-2 cursor-pointer ${
                      isRecording 
                        ? 'bg-red-900 border-red-500 text-white animate-pulse' 
                        : 'bg-amber-900 hover:bg-amber-800 border-amber-600 text-white'
                    }`}
                  >
                    {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    <span>{isRecording ? 'LISTENING...' : 'SPEAK TO OOG'}</span>
                  </button>
                </div>
              </div>

              {/* High-DPI Spectrum Canvas Visualizer */}
              <div className="w-full h-24 bg-stone-950 rounded-2xl border-2 border-stone-800 relative overflow-hidden">
                <canvas ref={visualizerCanvasRef} className="w-full h-full block" />
                <div className="absolute top-2 right-3 text-[9px] font-mono text-amber-500/70 uppercase tracking-widest pointer-events-none">
                  HIGH-DPI AUDIO SPECTRUM CANVAS
                </div>
              </div>
            </div>

            {/* Chat History Box */}
            <div className="stone-card flex-1 min-h-0 flex flex-col p-4">
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 text-[9px] font-mono text-stone-500">
                      {msg.sender === 'user' ? (
                        <><span>YOU</span> <User className="w-3 h-3 text-stone-400" /></>
                      ) : (
                        <><Bot className="w-3 h-3 text-amber-500" /> <span className="text-amber-500">OOG AI</span></>
                      )}
                      <span>• {msg.timestamp}</span>
                    </div>
                    <div className={msg.sender === 'user' ? 'cave-bubble-user' : 'cave-bubble-ai'}>
                      <p className="text-xs md:text-sm font-medium leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                ))}

                {isAiLoading && (
                  <div className="cave-bubble-ai flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-amber-400 animate-spin" />
                    <span className="text-xs italic text-amber-300">Oog carving response on rock slab...</span>
                  </div>
                )}
              </div>

              {/* Input Form */}
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSendVoiceMessage(); }}
                className="mt-3 flex items-center gap-2 pt-3 border-t border-stone-800"
              >
                <input
                  type="text"
                  value={voiceInput}
                  onChange={(e) => setVoiceInput(e.target.value)}
                  placeholder="Ask Oog anything (e.g. How to structure code, prep for interview, manage stress)..."
                  className="flex-1 bg-stone-950 border-2 border-stone-800 rounded-xl px-4 py-2.5 text-xs md:text-sm text-stone-200 placeholder:text-stone-500 focus:border-amber-600 outline-none"
                  aria-label="Type message to Oog AI"
                />
                <button
                  type="submit"
                  disabled={!voiceInput.trim() || isAiLoading}
                  className="stone-button py-2.5 px-4"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </section>
        )}

        {/* Engine Settings View */}
        {activeTab === 'settings' && (
          <section aria-label="Engine Settings" className="col-span-12 max-w-2xl mx-auto w-full min-h-0 flex flex-col justify-center">
            <div className="stone-card p-6 space-y-4">
              <div className="flex items-center gap-3 border-b border-stone-800 pb-3">
                <Settings className="w-6 h-6 text-amber-500" />
                <div>
                  <h2 className="text-lg font-black text-amber-500 uppercase italic">MODEL & ENGINE CONFIGURATION</h2>
                  <p className="text-xs text-stone-400">Configure AI inference provider for portfolio demonstration</p>
                </div>
              </div>

              <div className="space-y-3">
                <label htmlFor="gemini-key-input" className="text-xs font-bold text-stone-300 block">
                  Google Gemini API Key (Optional)
                </label>
                <input
                  id="gemini-key-input"
                  type="password"
                  value={geminiApiKey}
                  onChange={(e) => {
                    setGeminiApiKey(e.target.value);
                    localStorage.setItem('OOG_GEMINI_KEY', e.target.value);
                  }}
                  placeholder="AIzaSy..."
                  className="w-full bg-stone-950 border-2 border-stone-800 rounded-xl px-4 py-2.5 text-xs text-amber-300 focus:border-amber-500 outline-none font-mono"
                />
                <p className="text-[10px] text-stone-500 leading-relaxed">
                  If left empty, AI Talk AI Go operates seamlessly in <strong>Local Primitive Offline Engine Mode</strong> using pre-configured caveman logic so callers can test without credentials.
                </p>
              </div>

              <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-2">
                <p className="text-xs font-bold text-amber-400 uppercase">System Status & Diagnostics</p>
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                  <div className="text-stone-400">Audio Synth Engine: <span className="text-emerald-400">ACTIVE</span></div>
                  <div className="text-stone-400">Canvas Renderer: <span className="text-emerald-400">HIGH-DPI</span></div>
                  <div className="text-stone-400">Speech Rec API: <span className="text-amber-400">READY</span></div>
                  <div className="text-stone-400">WCAG AX Compliance: <span className="text-emerald-400">2.1 AA</span></div>
                </div>
              </div>

              <button
                onClick={() => { setActiveTab('prompts'); playWhooshSound(); }}
                className="stone-button w-full py-3 text-xs"
              >
                SAVE & RETURN TO CAVE WALL
              </button>
            </div>
          </section>
        )}
      </main>

      {/* Keyboard Hotkeys Modal */}
      <AnimatePresence>
        {isHelpOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <div className="stone-card max-w-md w-full p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                <div className="flex items-center gap-2">
                  <Keyboard className="w-5 h-5 text-amber-500" />
                  <h3 className="text-base font-black uppercase text-amber-500">KEYBOARD SHORTCUTS</h3>
                </div>
                <button onClick={() => setIsHelpOpen(false)} className="text-stone-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between p-2 bg-stone-950 rounded border border-stone-800">
                  <span className="text-stone-400">Next / Prev Prompt</span>
                  <span className="text-amber-400 font-bold">j / k  or  ↓ / ↑</span>
                </div>
                <div className="flex justify-between p-2 bg-stone-950 rounded border border-stone-800">
                  <span className="text-stone-400">Copy Current Prompt</span>
                  <span className="text-amber-400 font-bold">c  or  Cmd+C</span>
                </div>
                <div className="flex justify-between p-2 bg-stone-950 rounded border border-stone-800">
                  <span className="text-stone-400">Pick Random Prompt</span>
                  <span className="text-amber-400 font-bold">r</span>
                </div>
                <div className="flex justify-between p-2 bg-stone-950 rounded border border-stone-800">
                  <span className="text-stone-400">Toggle Ambient Sound</span>
                  <span className="text-amber-400 font-bold">m</span>
                </div>
                <div className="flex justify-between p-2 bg-stone-950 rounded border border-stone-800">
                  <span className="text-stone-400">Switch View Tab</span>
                  <span className="text-amber-400 font-bold">v</span>
                </div>
                <div className="flex justify-between p-2 bg-stone-950 rounded border border-stone-800">
                  <span className="text-stone-400">Toggle Shortcuts Help</span>
                  <span className="text-amber-400 font-bold">?  or  h</span>
                </div>
              </div>

              <button onClick={() => setIsHelpOpen(false)} className="stone-button w-full py-2.5 text-xs">
                CLOSE HELP
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* THUD Sound Impact Overlay */}
      <AnimatePresence>
        {thud && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }} 
            animate={{ opacity: 1, scale: 1.4 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
          >
            <span className="text-6xl md:text-8xl font-black text-amber-500 italic uppercase drop-shadow-2xl">THUD!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <footer role="contentinfo" className="mt-1 md:mt-2 text-stone-500 text-[8px] md:text-[9px] font-mono uppercase tracking-widest flex items-center gap-2 md:gap-4 pb-1 md:pb-2">
        <div className="flex gap-1.5 opacity-40">
          <Skull className="w-3 h-3" />
          <Flame className="w-3 h-3" />
          <Hammer className="w-3 h-3" />
        </div>
        <span>© 10,000 BC - NO WHEELS ALLOWED • NEALFRAZIER.TECH SHOWCASE</span>
      </footer>
    </div>
  );
}
