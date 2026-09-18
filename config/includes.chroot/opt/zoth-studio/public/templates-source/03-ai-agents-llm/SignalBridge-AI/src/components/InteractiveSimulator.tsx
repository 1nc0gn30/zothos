import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Terminal, Lock, Shield, Cpu, Zap, Activity, Send, CheckCircle2, RefreshCw, Key, Volume2, VolumeX, Eye, EyeOff } from "lucide-react";
import { soundFx } from "../lib/audio";

interface AgentOption {
  id: string;
  name: string;
  engine: string;
  latencyMs: number;
  icon: string;
  description: string;
}

const AGENTS: AgentOption[] = [
  { id: "llama3", name: "Llama 3.3 70B", engine: "Ollama Local (v11434)", latencyMs: 14, icon: "🦙", description: "Self-hosted local inference with 0 internet outbound." },
  { id: "deepseek", name: "DeepSeek R1 Distill", engine: "vLLM Homelab", latencyMs: 22, icon: "🧠", description: "Reasoning model running on local GPU cluster." },
  { id: "langchain", name: "LangChain Agent", engine: "Python Local Daemon", latencyMs: 35, icon: "🔗", description: "Autonomous web browser & document memory agent." },
  { id: "custom", name: "Custom Webhook", engine: "REST / WebSocket Relay", latencyMs: 8, icon: "⚡", description: "Direct HTTP bridge to your custom microservice." },
];

const PRESET_COMMANDS = [
  "/llama summarize \"Explain zero-knowledge AI orchestration\"",
  "/agent status --verbose",
  "/encrypt verify --ratchet-key=active",
  "/rag query \"How does Signal protocol protect keys?\"",
];

export const InteractiveSimulator: React.FC<{ onLogAction?: (msg: string) => void }> = ({ onLogAction }) => {
  const [selectedAgent, setSelectedAgent] = useState<AgentOption>(AGENTS[0]);
  const [inputMsg, setInputMsg] = useState("");
  const [showCiphertext, setShowCiphertext] = useState(false);
  const [isMuted, setIsMuted] = useState(soundFx.isMuted());
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "inspect" | "topology">("chat");

  const [chatHistory, setChatHistory] = useState<Array<{
    id: string;
    sender: "user" | "signalbridge" | "agent";
    text: string;
    cipherText?: string;
    timestamp: string;
    metrics?: { latency: number; agent: string; ratchetKey: string };
  }>>([
    {
      id: "1",
      sender: "signalbridge",
      text: "SignalBridge AI Orchestrator initialized. Session Double-Ratchet active.",
      timestamp: "10:00:01 AM",
      metrics: { latency: 1.2, agent: "SignalBridge Core", ratchetKey: "0x8f3c...9a41" }
    },
    {
      id: "2",
      sender: "user",
      text: "/llama summarize \"Explain zero-knowledge AI orchestration\"",
      cipherText: "3f9a2b1c8e7d4f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a",
      timestamp: "10:00:15 AM"
    },
    {
      id: "3",
      sender: "agent",
      text: "Zero-knowledge AI orchestration ensures that your prompt text, context documents, and model outputs remain strictly encrypted during transmission. SignalBridge acts as the local decryptor inside your private firewall.",
      cipherText: "8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b",
      timestamp: "10:00:16 AM",
      metrics: { latency: 14.8, agent: "Llama 3.3 70B (Ollama)", ratchetKey: "0x4e12...b990" }
    }
  ]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sound Mute Toggle
  const toggleMute = () => {
    const muted = soundFx.toggleMute();
    setIsMuted(muted);
    if (onLogAction) onLogAction(muted ? "Audio muted" : "Audio unmuted");
  };

  // Canvas visualizer animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const render = () => {
      time += 0.02;
      const width = canvas.width = canvas.parentElement?.clientWidth || 600;
      const height = canvas.height = 240;

      ctx.clearRect(0, 0, width, height);

      // Node Positions
      const nodeA = { x: width * 0.18, y: height * 0.5, label: "Signal Mobile", color: "#38bdf8" };
      const nodeB = { x: width * 0.5, y: height * 0.5, label: "SignalBridge Daemon", color: "#2c6bed" };
      const nodeC = { x: width * 0.82, y: height * 0.35, label: selectedAgent.name, color: "#10b981" };
      const nodeD = { x: width * 0.82, y: height * 0.65, label: "E2EE Key Vault", color: "#8b5cf6" };

      // Draw Connections with glowing pulse
      const drawLine = (from: { x: number; y: number }, to: { x: number; y: number }, color: string) => {
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.opacity = 0.4;
        ctx.stroke();

        // Pulsing data packet
        const progress = (Math.sin(time * 2) + 1) / 2;
        const px = from.x + (to.x - from.x) * progress;
        const py = from.y + (to.y - from.y) * progress;

        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      };

      drawLine(nodeA, nodeB, "#38bdf8");
      drawLine(nodeB, nodeC, "#10b981");
      drawLine(nodeB, nodeD, "#8b5cf6");

      // Draw Nodes
      [nodeA, nodeB, nodeC, nodeD].forEach(n => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, 14, 0, Math.PI * 2);
        ctx.fillStyle = "#070b16";
        ctx.strokeStyle = n.color;
        ctx.lineWidth = 3;
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(n.x, n.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.fill();

        ctx.font = "11px system-ui, sans-serif";
        ctx.fillStyle = "#94a3b8";
        ctx.textAlign = "center";
        ctx.fillText(n.label, n.x, n.y + 26);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [selectedAgent]);

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputMsg;
    if (!query.trim() || isProcessing) return;

    soundFx.playSendSignal();

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const randomHex = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    const userMsgId = String(Date.now());

    const newUserMsg = {
      id: userMsgId,
      sender: "user" as const,
      text: query,
      cipherText: randomHex,
      timestamp
    };

    setChatHistory(prev => [...prev, newUserMsg]);
    setInputMsg("");
    setIsProcessing(true);

    if (onLogAction) onLogAction(`Transmitted signal to ${selectedAgent.name}`);

    // Simulate Signal Bridge local agent routing
    setTimeout(() => {
      soundFx.playReceiveSignal();

      let replyText = "";
      if (query.startsWith("/llama") || query.includes("summarize")) {
        replyText = `[${selectedAgent.name}] Summary generated: SignalBridge utilizes a local daemon to handle Double-Ratchet key exchanges, allowing instant response without cloud metadata exposure.`;
      } else if (query.startsWith("/status")) {
        replyText = `[SignalBridge Core] Operational | Latency: ${selectedAgent.latencyMs}ms | Active E2EE Sessions: 1 | Key Rotation: Synchronized`;
      } else if (query.startsWith("/encrypt")) {
        replyText = `[Crypto Audit] Prekey Bundle: Valid | Ephemeral Key: 0x9f...31a | Ratchet Step: 142 | Double-Ratchet Verification PASSED.`;
      } else {
        replyText = `[${selectedAgent.name}] Processed query: "${query.replace(/^\/\w+\s*/, '')}". Output decrypted locally via Signal Protocol.`;
      }

      const agentMsgHex = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
      const responseMsg = {
        id: String(Date.now() + 1),
        sender: "agent" as const,
        text: replyText,
        cipherText: agentMsgHex,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        metrics: {
          latency: Number((selectedAgent.latencyMs + Math.random() * 3).toFixed(1)),
          agent: selectedAgent.name,
          ratchetKey: `0x${Math.floor(Math.random() * 0xffffff).toString(16)}...${Math.floor(Math.random() * 0xffff).toString(16)}`
        }
      };

      setChatHistory(prev => [...prev, responseMsg]);
      setIsProcessing(false);
    }, 600);
  };

  return (
    <section id="simulator" className="py-16 px-4 md:px-6 bg-black/40 border-y border-white/10" aria-label="Interactive Signal Routing Simulator">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-signal-blue/10 border border-signal-blue/30 text-signal-blue text-xs font-bold mb-2">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              <span>LIVE PLAYGROUND DEMO</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-white">
              Signal Routing & AI Bridge <span className="text-gradient">Console</span>
            </h2>
            <p className="text-gray-400 text-sm md:text-base mt-1">
              Test sending encrypted Signal packets to your local AI agents in real time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleMute}
              className="p-2.5 rounded-xl glass hover:bg-white/10 text-gray-300 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-signal-blue focus-visible:outline-none"
              title={isMuted ? "Unmute Sound Effects" : "Mute Sound Effects"}
              aria-label={isMuted ? "Unmute Sound Effects" : "Mute Sound Effects"}
            >
              {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-green-400" />}
            </button>
            <button
              onClick={() => {
                setShowCiphertext(!showCiphertext);
                soundFx.playClick();
              }}
              className="px-4 py-2.5 rounded-xl glass hover:bg-white/10 text-xs font-semibold text-gray-200 flex items-center gap-2 transition-colors focus-visible:ring-2 focus-visible:ring-signal-blue focus-visible:outline-none"
              aria-label="Toggle raw ciphertext view"
            >
              {showCiphertext ? <EyeOff className="w-4 h-4 text-signal-blue" /> : <Eye className="w-4 h-4 text-cyan-400" />}
              <span>{showCiphertext ? "Hide Ciphertext" : "Inspect Encrypted Packets"}</span>
            </button>
          </div>
        </div>

        {/* Live Topology Canvas */}
        <div className="glass rounded-3xl p-4 mb-6 border-white/15 overflow-hidden">
          <div className="flex items-center justify-between px-2 mb-2">
            <span className="text-xs font-mono text-signal-blue font-bold flex items-center gap-2">
              <Zap className="w-3.5 h-3.5" /> LIVE E2EE ROUTING TOPOLOGY
            </span>
            <span className="text-[11px] text-gray-400 font-mono">Double-Ratchet Protocol v2.4</span>
          </div>
          <canvas ref={canvasRef} className="w-full h-[140px] rounded-2xl bg-black/40 border border-white/5" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Agent Selection & Controls */}
          <div className="lg:col-span-1 glass rounded-3xl p-6 border-white/10 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold font-display mb-4 flex items-center gap-2 text-white">
                <Cpu className="w-5 h-5 text-signal-blue" /> Select Target Agent
              </h3>
              <div className="space-y-3 mb-6">
                {AGENTS.map(agent => (
                  <button
                    key={agent.id}
                    onClick={() => {
                      setSelectedAgent(agent);
                      soundFx.playNodeRoute();
                    }}
                    className={`w-full p-3.5 rounded-2xl text-left transition-all border ${
                      selectedAgent.id === agent.id
                        ? "bg-signal-blue/20 border-signal-blue text-white shadow-[0_0_20px_rgba(44,107,237,0.3)]"
                        : "bg-black/30 border-white/5 text-gray-400 hover:bg-white/5 hover:text-gray-200"
                    } focus-visible:ring-2 focus-visible:ring-signal-blue focus-visible:outline-none`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm flex items-center gap-2">
                        <span>{agent.icon}</span> {agent.name}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/40 text-emerald-400 border border-emerald-500/20">
                        {agent.latencyMs}ms
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 leading-normal">{agent.description}</p>
                    <span className="text-[10px] font-mono text-gray-500 mt-2 block">{agent.engine}</span>
                  </button>
                ))}
              </div>

              {/* Sample Commands */}
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Preset Commands</h4>
              <div className="space-y-1.5">
                {PRESET_COMMANDS.map((cmd, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(cmd)}
                    className="w-full text-left font-mono text-[11px] p-2 rounded-xl bg-white/5 hover:bg-signal-blue/20 text-gray-300 hover:text-white transition-colors truncate block border border-white/5 focus-visible:ring-2 focus-visible:ring-signal-blue focus-visible:outline-none"
                    title={cmd}
                  >
                    {cmd}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 text-xs text-gray-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-emerald-400" /> Signal Protocol Active</span>
              <span className="font-mono text-[11px] text-signal-blue font-bold">100% Zero-Knowledge</span>
            </div>
          </div>

          {/* Interactive Chat Console */}
          <div className="lg:col-span-2 glass rounded-3xl p-6 border-white/10 flex flex-col h-[520px]">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-signal-blue" />
                <span className="font-mono text-sm font-bold text-gray-200">signalbridge-cli v2.4.0</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-mono text-emerald-400">Tunnel Connected</span>
              </div>
            </div>

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 font-mono text-xs" role="region" aria-label="Console Message Stream">
              {chatHistory.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3.5 rounded-2xl border ${
                    msg.sender === "user"
                      ? "bg-signal-blue/15 border-signal-blue/30 ml-8 text-blue-100"
                      : msg.sender === "signalbridge"
                      ? "bg-black/50 border-cyan-500/20 text-cyan-200"
                      : "bg-emerald-950/30 border-emerald-500/30 mr-8 text-emerald-100"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5 text-[10px] text-gray-400 border-b border-white/5 pb-1">
                    <span className="font-bold flex items-center gap-1">
                      {msg.sender === "user" ? "📱 Signal Client" : msg.sender === "signalbridge" ? "⚡ Bridge Core" : `🤖 ${selectedAgent.name}`}
                    </span>
                    <span>{msg.timestamp}</span>
                  </div>

                  {showCiphertext && msg.cipherText ? (
                    <div className="space-y-1 my-2 p-2 rounded-xl bg-black/60 font-mono text-[10px] text-cyan-400 overflow-x-auto border border-cyan-500/20">
                      <div className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Ratchet Encrypted Ciphertext:</div>
                      <div>{msg.cipherText}</div>
                    </div>
                  ) : null}

                  <p className="leading-relaxed font-sans text-sm">{msg.text}</p>

                  {msg.metrics && (
                    <div className="mt-2 pt-1.5 flex items-center justify-between text-[10px] text-gray-400 border-t border-white/5 font-mono">
                      <span>Latency: <strong className="text-emerald-400">{msg.metrics.latency}ms</strong></span>
                      <span>Ratchet: <strong className="text-cyan-400">{msg.metrics.ratchetKey}</strong></span>
                    </div>
                  )}
                </motion.div>
              ))}

              {isProcessing && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5 text-gray-400 font-mono text-xs">
                  <RefreshCw className="w-4 h-4 animate-spin text-signal-blue" />
                  <span>Encrypting via Signal ratchet & routing to {selectedAgent.name}...</span>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="mt-4 pt-3 border-t border-white/10 flex gap-2"
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  placeholder={`Send command to ${selectedAgent.name} (e.g. /llama summarize)...`}
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-signal-blue focus:ring-2 focus:ring-signal-blue/30 font-mono"
                  aria-label="Enter command or message"
                />
              </div>
              <button
                type="submit"
                disabled={isProcessing || !inputMsg.trim()}
                className="bg-signal-blue hover:bg-blue-600 disabled:opacity-50 px-5 py-3 rounded-xl font-bold transition-all flex items-center gap-2 text-white shadow-[0_4px_20px_rgba(44,107,237,0.4)] focus-visible:ring-2 focus-visible:ring-signal-blue focus-visible:outline-none"
                aria-label="Send message"
              >
                <span>Send</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
