import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Mic, Play, CheckCircle2, Clock, ShieldCheck, Cpu, Volume2, UserCheck } from 'lucide-react';
import AuraVisualizer from './AuraVisualizer';
import { soundEngine } from '../utils/audio';

interface PresetScenario {
  id: string;
  label: string;
  category: string;
  userPrompt: string;
  agentResponse: string;
  sentiment: string;
  sentimentScore: number;
  intent: string;
  latencyMs: number;
  actionTaken: string;
  visualState: 'listening' | 'processing' | 'speaking' | 'urgent';
}

const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: 'after-hours-dental',
    label: '2:30 AM Emergency Dental',
    category: 'Healthcare',
    userPrompt: "Hi, it's 2:30 AM and I broke a tooth. Do you have any emergency openings first thing tomorrow morning?",
    agentResponse: "I'm so sorry you're experiencing that! I've reserved our 8:00 AM emergency slot with Dr. Vance. I just texted a quick intake link to your mobile number.",
    sentiment: 'Empathetic & Rapid Priority',
    sentimentScore: 99,
    intent: 'EMERGENCY_SCHEDULING',
    latencyMs: 142,
    actionTaken: 'Emergency slot reserved in EMR • SMS intake link sent • Dentist notified',
    visualState: 'urgent'
  },
  {
    id: 'legal-retainer',
    label: 'Corporate Law Consultation',
    category: 'Legal Services',
    userPrompt: "Hello, we need a corporate litigation partner for an upcoming acquisition audit. What is your retainer structure?",
    agentResponse: "Thank you for reaching out. Our managing partner specializes in corporate acquisitions. I can schedule a confidential 30-minute introductory call for Thursday at 2 PM or Friday at 10 AM. Which works best?",
    sentiment: 'Polished & Professional',
    sentimentScore: 98,
    intent: 'HIGH_VALUE_LEAD_QUALIFICATION',
    latencyMs: 175,
    actionTaken: 'Lead tagged Tier-1 Enterprise • Calendar invite drafted • CRM profile created',
    visualState: 'speaking'
  },
  {
    id: 'auto-service',
    label: 'Auto Repair Status & Quote',
    category: 'Automotive',
    userPrompt: "Hey there! Can you tell me if my brake pad replacement on the Audi is finished yet?",
    agentResponse: "Hi Mark! Yes, your Audi A4 brake service was completed 20 minutes ago. Your total is $320, and your keys are securely stored at reception. Would you like me to send a payment link?",
    sentiment: 'Friendly & Efficient',
    sentimentScore: 96,
    intent: 'SERVICE_STATUS_AND_PAYMENT',
    latencyMs: 130,
    actionTaken: 'Shop Management API queried • Digital invoice link generated',
    visualState: 'speaking'
  }
];

export default function AuraPlayground() {
  const [selectedScenario, setSelectedScenario] = useState<PresetScenario>(PRESET_SCENARIOS[0]);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<'idle' | 'listening' | 'analyzing' | 'complete'>('idle');
  const [liveLog, setLiveLog] = useState<string>('Select a scenario or type a prompt to test AURA in real time.');
  const [speechEnabled, setSpeechEnabled] = useState<boolean>(true);
  const [liveAnnouncement, setLiveAnnouncement] = useState<string>('');

  const liveRegionRef = useRef<HTMLDivElement>(null);

  const triggerSimulation = (scenario: PresetScenario) => {
    soundEngine.playClick();
    setSelectedScenario(scenario);
    setIsSimulating(true);
    setActiveStep('listening');
    setLiveLog(`Ingesting query: "${scenario.userPrompt}"`);
    setLiveAnnouncement(`Simulating query: ${scenario.userPrompt}`);

    setTimeout(() => {
      soundEngine.playAuraPulse();
      setActiveStep('analyzing');
      setLiveLog(`Analyzing intent (${scenario.intent}) & extracting sentiment...`);
      setLiveAnnouncement(`Analyzing intent and extracting sentiment.`);
    }, 900);

    setTimeout(() => {
      soundEngine.playSuccess();
      setActiveStep('complete');
      setIsSimulating(false);
      setLiveLog(`AURA Response generated in ${scenario.latencyMs}ms: "${scenario.agentResponse}"`);
      setLiveAnnouncement(`AURA responded in ${scenario.latencyMs} milliseconds. ${scenario.agentResponse}`);

      // Web Speech API Voice synthesis if available
      if (speechEnabled && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(scenario.agentResponse);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    }, 2200);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;

    const customScenario: PresetScenario = {
      id: 'custom-' + Date.now(),
      label: 'Custom Query',
      category: 'General Business',
      userPrompt: customPrompt,
      agentResponse: `Thank you for contacting us! I have analyzed your request ("${customPrompt.slice(0, 40)}...") and instantly routed it to our priority front desk workflow.`,
      sentiment: 'Customer-Centric & Adaptive',
      sentimentScore: 97,
      intent: 'CUSTOM_INTAKE_ROUTING',
      latencyMs: 158,
      actionTaken: 'Custom intent categorized • Calendar checked • Response dispatched',
      visualState: 'speaking'
    };

    triggerSimulation(customScenario);
  };

  return (
    <section id="playground" className="py-24 px-6 relative" aria-label="Interactive AI Aura Playground">
      {/* Accessibility live announcement region */}
      <div
        ref={liveRegionRef}
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {liveAnnouncement}
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-900/5 text-brand-900 text-xs font-bold tracking-widest uppercase rounded-full mb-4">
            <Sparkles size={14} className="text-brand-900" />
            <span>Interactive Demo • <kbd className="px-1.5 py-0.5 bg-white border border-brand-200 rounded text-[10px]">Alt + P</kbd></span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-brand-900 mb-6">
            Test AURA's Emotional <br />
            <span className="text-brand-900/40 italic">Intelligence Engine</span>
          </h2>
          <p className="text-brand-500 text-lg leading-relaxed">
            See how AURA processes after-hours emergencies, qualifies high-value legal prospects, and updates customers in real-time with sub-180ms response speed.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Preset Scenarios & Custom Input */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="glass-card p-6 md:p-8 rounded-[2rem] space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-display font-bold text-brand-900">Select Test Scenario</h3>
                <button
                  onClick={() => setSpeechEnabled(!speechEnabled)}
                  className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border border-brand-200 hover:bg-brand-50 transition-colors"
                  aria-label={speechEnabled ? "Mute voice readout" : "Enable voice readout"}
                >
                  <Volume2 size={14} className={speechEnabled ? "text-green-600" : "text-brand-500"} />
                  <span>{speechEnabled ? "Voice On" : "Voice Off"}</span>
                </button>
              </div>

              <div className="space-y-3">
                {PRESET_SCENARIOS.map((scenario) => {
                  const isSelected = selectedScenario.id === scenario.id;
                  return (
                    <button
                      key={scenario.id}
                      onClick={() => triggerSimulation(scenario)}
                      disabled={isSimulating}
                      className={`w-full text-left p-4 rounded-xl transition-all border ${
                        isSelected
                          ? 'bg-brand-900 text-white border-brand-900 shadow-lg shadow-brand-900/20'
                          : 'bg-white/80 text-brand-900 border-brand-200/80 hover:border-brand-900/40 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-bold uppercase tracking-wider ${isSelected ? 'text-brand-200' : 'text-brand-500'}`}>
                          {scenario.category}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${isSelected ? 'bg-white/20 text-white' : 'bg-brand-100 text-brand-900'}`}>
                          {scenario.latencyMs}ms
                        </span>
                      </div>
                      <p className="font-semibold text-sm">{scenario.label}</p>
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-brand-200">
                <label htmlFor="custom-prompt" className="block text-xs font-bold text-brand-900 uppercase tracking-wider mb-2">
                  Or Test Custom Prompt
                </label>
                <form onSubmit={handleCustomSubmit} className="flex gap-2">
                  <input
                    id="custom-prompt"
                    type="text"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="e.g. Can I reschedule my appointment for Tuesday?"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-brand-200 text-sm focus:ring-2 focus:ring-brand-900 outline-none bg-white/70"
                  />
                  <button
                    type="submit"
                    disabled={isSimulating || !customPrompt.trim()}
                    className="px-4 py-2.5 bg-brand-900 text-white rounded-xl text-sm font-semibold flex items-center gap-1.5 hover:bg-brand-900/90 transition-colors disabled:opacity-50"
                  >
                    <Play size={16} fill="currentColor" />
                    <span>Run</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Live Operational Metric Card */}
            <div className="glass-card p-6 rounded-[2rem] grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-600 flex items-center justify-center">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-xs text-brand-500 font-medium">Avg Latency</p>
                  <p className="text-lg font-bold text-brand-900">155ms</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <p className="text-xs text-brand-500 font-medium">Accuracy Score</p>
                  <p className="text-lg font-bold text-brand-900">99.4%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Visualizer & Real-time AI Output */}
          <div className="lg:col-span-7 glass-card p-8 rounded-[2rem] flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-brand-200/60">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-brand-900">
                  AURA AI Visualizer • {activeStep.toUpperCase()}
                </span>
              </div>
              <span className="text-xs text-brand-500 font-mono">
                {selectedScenario.intent}
              </span>
            </div>

            {/* Canvas Aura sphere */}
            <div className="h-[260px] relative mb-6">
              <AuraVisualizer state={selectedScenario.visualState} />
              
              {/* Overlay pulse indicator */}
              <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/40 text-xs font-semibold text-brand-900 flex items-center gap-1.5 shadow-sm">
                <Cpu size={14} className="text-brand-900" />
                <span>{selectedScenario.sentiment}</span>
              </div>
            </div>

            {/* Conversation Breakdown */}
            <div className="space-y-4 bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-brand-200/60">
              <div>
                <span className="text-[11px] font-bold text-brand-500 uppercase tracking-wider block mb-1">
                  Incoming Caller Query:
                </span>
                <p className="text-sm font-medium text-brand-900 italic">
                  "{selectedScenario.userPrompt}"
                </p>
              </div>

              <div className="pt-3 border-t border-brand-100">
                <span className="text-[11px] font-bold text-brand-900 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                  <UserCheck size={14} className="text-green-600" />
                  AURA Autonomous Response:
                </span>
                <p className="text-sm font-semibold text-brand-900">
                  {selectedScenario.agentResponse}
                </p>
              </div>

              {/* Action Breakdown Badge */}
              <div className="pt-3 border-t border-brand-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-medium flex items-center gap-1">
                  <CheckCircle2 size={12} />
                  {selectedScenario.actionTaken}
                </span>
                <span className="text-brand-500 font-mono text-[11px]">
                  Sentiment Score: {selectedScenario.sentimentScore}%
                </span>
              </div>
            </div>

            {/* Console Log Bar */}
            <div className="mt-4 p-3 bg-brand-900 text-brand-200 rounded-xl font-mono text-xs flex items-center justify-between">
              <span className="truncate">{liveLog}</span>
              <span className="text-[10px] text-green-400 font-bold ml-2">LIVE</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
