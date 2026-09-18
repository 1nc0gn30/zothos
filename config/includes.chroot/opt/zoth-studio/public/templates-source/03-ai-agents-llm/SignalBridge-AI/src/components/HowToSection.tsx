import React, { useState } from "react";
import { motion } from "motion/react";
import { Terminal, Copy, Check, Server, Shield, Smartphone, MessageSquare } from "lucide-react";
import { soundFx } from "../lib/audio";

const STEPS = [
  {
    num: "01",
    title: "Deploy Orchestrator Daemon",
    desc: "Install the lightweight SignalBridge daemon on your local server, homelab, or desktop.",
    cmd: "npm install -g signalbridge-cli && signalbridge init",
    icon: Server
  },
  {
    num: "02",
    title: "Link Signal Account",
    desc: "Authenticate your Signal phone number using standard E2EE prekey QR code pairing.",
    cmd: "signalbridge link --device-name=\"Homelab-Node-1\"",
    icon: Smartphone
  },
  {
    num: "03",
    title: "Attach Local AI Targets",
    desc: "Configure local LLM inference engines (Ollama, vLLM) or custom Python workers.",
    cmd: "signalbridge add-target --name=\"llama3\" --url=\"http://localhost:11434\"",
    icon: Shield
  },
  {
    num: "04",
    title: "Chat Privately from Mobile",
    desc: "Send encrypted Signal messages directly to your self-hosted AI assistants anytime.",
    cmd: "signalbridge start --daemon",
    icon: MessageSquare
  }
];

export const HowToSection: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (cmd: string, index: number) => {
    navigator.clipboard.writeText(cmd);
    soundFx.playSuccess();
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <section id="how-it-works" className="py-24 px-6 bg-black/60">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            How SignalBridge <span className="text-gradient">Works</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Get up and running in under four minutes with zero cloud vendor dependencies.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step, i) => {
            const StepIcon = step.icon;
            const isCopied = copiedIndex === i;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass p-6 rounded-3xl border-white/10 hover:border-signal-blue/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-display font-black text-3xl text-signal-blue/30 group-hover:text-signal-blue transition-colors">
                      {step.num}
                    </span>
                    <div className="w-10 h-10 bg-signal-blue/10 rounded-xl flex items-center justify-center">
                      <StepIcon className="w-5 h-5 text-signal-blue" />
                    </div>
                  </div>

                  <h3 className="font-bold font-display text-xl text-white mb-2">{step.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">{step.desc}</p>
                </div>

                <div className="relative group/code">
                  <div className="bg-black/60 p-3 rounded-xl border border-white/10 font-mono text-[11px] text-cyan-300 overflow-x-auto">
                    {step.cmd}
                  </div>
                  <button
                    onClick={() => handleCopy(step.cmd, i)}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-signal-blue focus-visible:outline-none"
                    aria-label={`Copy command for ${step.title}`}
                    title="Copy command"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
