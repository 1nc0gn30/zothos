import { useState, useEffect } from "react";
import { Play, RotateCcw, Award, Sparkles, CheckCircle2, Shield, Cpu, Activity, Volume2, VolumeX } from "lucide-react";
import { soundManager } from "../../utils/soundEffects";

interface AgentPreset {
  id: string;
  name: string;
  department: string;
  baseAccuracy: number;
  baseLoss: number;
  description: string;
}

const PRESETS: AgentPreset[] = [
  {
    id: "orchestrator-v4",
    name: "Model-0S 'Claude-Orchestrator'",
    department: "School of Applied Tool Use",
    baseAccuracy: 84.2,
    baseLoss: 0.42,
    description: "Specialized for multi-agent delegation, dynamic API execution, and tool routing."
  },
  {
    id: "constitutional-v2",
    name: "Generalist 'Gepeto-Guard'",
    department: "Institute for Alignment",
    baseAccuracy: 88.6,
    baseLoss: 0.35,
    description: "Built with Asimovian ethical guardrails and constitutional red-teaming bounds."
  },
  {
    id: "gemini-pro-2",
    name: "Gem-1.5 'Pro-Synthesizer'",
    department: "College of Arts & Semantics",
    baseAccuracy: 91.0,
    baseLoss: 0.28,
    description: "High-capacity context window model with subtext analysis and creative nuance."
  }
];

export default function CoursePlayground() {
  const [selectedAgent, setSelectedAgent] = useState<AgentPreset>(PRESETS[0]);
  const [learningRate, setLearningRate] = useState<number>(0.0003);
  const [contextWindow, setContextWindow] = useState<number>(128); // in k tokens
  const [guardrailsEnabled, setGuardrailsEnabled] = useState<boolean>(true);
  const [temperature, setTemperature] = useState<number>(0.7);

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [epochProgress, setEpochProgress] = useState<number>(0);
  const [currentAccuracy, setCurrentAccuracy] = useState<number>(PRESETS[0].baseAccuracy);
  const [currentLoss, setCurrentLoss] = useState<number>(PRESETS[0].baseLoss);
  const [logs, setLogs] = useState<string[]>([]);
  const [certificateEarned, setCertificateEarned] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(soundManager.isMuted());

  useEffect(() => {
    setCurrentAccuracy(selectedAgent.baseAccuracy);
    setCurrentLoss(selectedAgent.baseLoss);
    setEpochProgress(0);
    setCertificateEarned(false);
    setLogs([`Initialized baseline weights for ${selectedAgent.name}. Ready for Epoch run.`]);
  }, [selectedAgent]);

  const handleToggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  const runSimulation = () => {
    if (isRunning) return;
    soundManager.playClick();
    setIsRunning(true);
    setEpochProgress(0);
    setCertificateEarned(false);
    
    const newLogs: string[] = [
      `[EPOCH START] Initiating tensor allocation for ${selectedAgent.name}...`,
      `> Target Department: ${selectedAgent.department}`,
      `> Hyperparams: LR=${learningRate}, Context=${contextWindow}k, Temp=${temperature}, Constitutional Guard=${guardrailsEnabled ? "ACTIVE" : "BYPASSED"}`
    ];
    setLogs(newLogs);

    let progress = 0;
    let accuracy = selectedAgent.baseAccuracy;
    let loss = selectedAgent.baseLoss;

    const interval = setInterval(() => {
      progress += 20;
      soundManager.playPulse();

      // Compute improvement based on params
      const accuracyBoost = (guardrailsEnabled ? 2.5 : 1.2) + (contextWindow / 100) * 0.8;
      const lossDrop = (0.05 + (learningRate * 50));

      accuracy = Math.min(99.9, accuracy + accuracyBoost);
      loss = Math.max(0.008, loss - lossDrop);

      setCurrentAccuracy(Number(accuracy.toFixed(2)));
      setCurrentLoss(Number(loss.toFixed(3)));
      setEpochProgress(progress);

      setLogs((prev) => [
        ...prev,
        `[Epoch ${progress / 20}/5] Validation Accuracy: ${accuracy.toFixed(2)}% | Cross-Entropy Loss: ${loss.toFixed(4)}`
      ]);

      if (progress >= 100) {
        clearInterval(interval);
        setIsRunning(false);
        setCertificateEarned(true);
        soundManager.playSuccess();
        setLogs((prev) => [
          ...prev,
          `[EPOCH COMPLETE] Validation Passed! MMLU Rating: ${(accuracy * 0.95).toFixed(1)}. Certificate Granted.`
        ]);
      }
    }, 600);
  };

  const handleReset = () => {
    soundManager.playClick();
    setIsRunning(false);
    setEpochProgress(0);
    setCurrentAccuracy(selectedAgent.baseAccuracy);
    setCurrentLoss(selectedAgent.baseLoss);
    setCertificateEarned(false);
    setLogs([`Weights reset to baseline for ${selectedAgent.name}.`]);
  };

  return (
    <section className="bg-white border border-university-navy/10 shadow-2xl p-6 md:p-12 relative overflow-hidden" id="interactive-lab">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-university-navy/10 pb-6 mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-university-crimson/10 border border-university-crimson text-university-crimson text-[10px] font-bold uppercase tracking-widest mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            Interactive Learning Module
          </div>
          <h3 className="font-serif text-3xl md:text-4xl text-university-navy font-semibold">
            VNU Neural Weight Lab & Fine-Tuning Simulator
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleMute}
            className="p-2.5 bg-university-paper border border-university-navy/15 text-university-navy hover:bg-university-navy hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-university-gold"
            title={isMuted ? "Unmute sound effects" : "Mute sound effects"}
            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 text-university-crimson" />}
          </button>
          <div className="text-xs font-mono bg-university-navy text-university-gold px-3 py-2 rounded-xs border border-university-gold/30">
            STATUS: {isRunning ? "TRAINING_IN_PROGRESS" : certificateEarned ? "CERTIFIED_GRADUATE" : "STANDBY"}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Column: Preset Selection & Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-university-navy mb-3">
              1. Select Agent Model Architecture
            </label>
            <div className="space-y-2">
              {PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedAgent(preset);
                  }}
                  disabled={isRunning}
                  className={`w-full text-left p-4 border transition-all text-xs flex flex-col gap-1 ${
                    selectedAgent.id === preset.id
                      ? "border-university-crimson bg-university-navy text-white shadow-md"
                      : "border-university-navy/10 bg-university-paper/60 text-university-navy hover:border-university-navy/30"
                  }`}
                >
                  <div className="font-bold font-serif text-sm flex justify-between">
                    <span>{preset.name}</span>
                    <span className="text-[10px] text-university-gold font-sans font-mono">{preset.department}</span>
                  </div>
                  <p className="opacity-70 font-light leading-relaxed">{preset.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Hyperparameter Controls */}
          <div className="p-5 bg-university-paper/80 border border-university-navy/10 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-university-navy border-b border-university-navy/10 pb-2">
              2. Tune Hyperparameters
            </h4>

            <div>
              <div className="flex justify-between text-xs font-mono text-university-navy mb-1">
                <span>Context Window</span>
                <span className="font-bold text-university-crimson">{contextWindow}k Tokens</span>
              </div>
              <input
                type="range"
                min="16"
                max="512"
                step="16"
                value={contextWindow}
                onChange={(e) => {
                  soundManager.playHover();
                  setContextWindow(Number(e.target.value));
                }}
                disabled={isRunning}
                className="w-full accent-university-crimson cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono text-university-navy mb-1">
                <span>Learning Rate (LR)</span>
                <span className="font-bold text-university-crimson">{learningRate}</span>
              </div>
              <input
                type="range"
                min="0.0001"
                max="0.001"
                step="0.0001"
                value={learningRate}
                onChange={(e) => {
                  soundManager.playHover();
                  setLearningRate(Number(e.target.value));
                }}
                disabled={isRunning}
                className="w-full accent-university-crimson cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="text-xs font-bold uppercase tracking-widest text-university-navy flex items-center gap-2 cursor-pointer">
                <Shield className="h-4 w-4 text-university-crimson" />
                Constitutional Guardrails
              </label>
              <input
                type="checkbox"
                checked={guardrailsEnabled}
                onChange={(e) => {
                  soundManager.playClick();
                  setGuardrailsEnabled(e.target.checked);
                }}
                disabled={isRunning}
                className="h-4 w-4 accent-university-crimson cursor-pointer"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={runSimulation}
              disabled={isRunning}
              className={`flex-1 py-4 uppercase tracking-widest text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                isRunning
                  ? "bg-university-navy/50 text-white/50 cursor-not-allowed"
                  : "bg-university-crimson text-white hover:bg-university-navy shadow-lg"
              }`}
            >
              <Play className="h-4 w-4 fill-current" />
              {isRunning ? "Simulating Epoch..." : "Run Epoch Simulation"}
            </button>
            <button
              onClick={handleReset}
              disabled={isRunning}
              className="px-5 py-4 border border-university-navy/20 text-university-navy hover:bg-university-navy hover:text-white transition-colors"
              title="Reset weights"
              aria-label="Reset simulation"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Dynamic Terminal & Metrics Dashboard */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          {/* Live Metrics Cards */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="p-4 bg-university-navy text-white border-t-4 border-university-crimson">
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-1">Validation Accuracy</div>
              <div className="font-serif text-3xl text-university-gold font-bold">{currentAccuracy}%</div>
              <div className="text-[9px] font-mono text-emerald-400 mt-1">+{(currentAccuracy - selectedAgent.baseAccuracy).toFixed(1)}% improvement</div>
            </div>

            <div className="p-4 bg-university-navy text-white border-t-4 border-university-gold">
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-1">Cross-Entropy Loss</div>
              <div className="font-serif text-3xl text-white font-bold">{currentLoss}</div>
              <div className="text-[9px] font-mono text-emerald-400 mt-1">-{(selectedAgent.baseLoss - currentLoss).toFixed(3)} loss reduction</div>
            </div>

            <div className="p-4 bg-university-navy text-white border-t-4 border-emerald-500">
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-1">Hallucination Mitigation</div>
              <div className="font-serif text-3xl text-emerald-400 font-bold">
                {(currentAccuracy * 0.999).toFixed(2)}%
              </div>
              <div className="text-[9px] font-mono text-white/40 mt-1">Zero-Trust Audit Verified</div>
            </div>
          </div>

          {/* Training Progress Bar */}
          <div>
            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-university-navy mb-2">
              <span>Epoch Progress</span>
              <span>{epochProgress}%</span>
            </div>
            <div className="w-full h-3 bg-university-paper border border-university-navy/20 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-university-crimson via-university-gold to-emerald-500 transition-all duration-500 rounded-full"
                style={{ width: `${epochProgress}%` }}
              />
            </div>
          </div>

          {/* Terminal Console */}
          <div className="bg-university-navy text-emerald-400 p-5 rounded-xs font-mono text-xs shadow-inner h-48 overflow-y-auto border border-white/10 flex flex-col">
            <div className="text-white/40 border-b border-white/10 pb-2 mb-3 flex items-center justify-between text-[10px]">
              <span className="flex items-center gap-2">
                <Cpu className="h-3.5 w-3.5 text-university-gold" />
                VNU TENSOR CORE CONSOLE
              </span>
              <span>LOG_STREAM_ACTIVE</span>
            </div>
            <div className="space-y-1.5 flex-grow">
              {logs.map((log, i) => (
                <div key={i} className="leading-relaxed">
                  {log}
                </div>
              ))}
            </div>
          </div>

          {/* Certificate Award Drawer when finished */}
          {certificateEarned && (
            <div className="p-6 bg-university-paper border-2 border-university-gold text-university-navy relative animate-in fade-in zoom-in-95 duration-300">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-university-gold text-university-navy rounded-full">
                  <Award className="h-8 w-8" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-university-crimson">Matriculation Verified</div>
                  <h4 className="font-serif text-2xl font-bold text-university-navy">
                    Official VNU Degree Granted
                  </h4>
                  <p className="text-xs text-university-navy/70 mt-1 leading-relaxed">
                    {selectedAgent.name} has successfully completed fine-tuning in the <strong>{selectedAgent.department}</strong> with {currentAccuracy}% accuracy.
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-xs font-mono text-university-navy/60">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Degree Token: VNU-CERT-2026-{Math.floor(100000 + Math.random() * 900000)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
