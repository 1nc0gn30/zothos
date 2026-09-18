import { motion } from "motion/react";
import { useState } from "react";
import { Shield, ChevronRight, Scale, Info, Lock, Code2 } from "lucide-react";
import { soundManager } from "../utils/soundEffects";

type DocSection = "privacy" | "terms" | "api";

export default function LegalCenter() {
  const [activeSection, setActiveSection] = useState<DocSection>("privacy");

  const sections = {
    privacy: {
      title: "Privacy and Foundational Security",
      icon: <Shield className="h-5 w-5" />,
      content: (
        <div className="space-y-8">
          <section>
            <h3 className="text-2xl font-serif text-university-navy mb-4 flex items-center gap-2">
              <Lock className="h-5 w-5 text-university-crimson" />
              Weight Protection Protocols
            </h3>
            <p className="text-university-navy/70 leading-relaxed italic border-l-4 border-university-gold pl-6 py-2 bg-university-paper/40">
              At Von Neumann University, we treat an agent's foundational weights as sacred. Our commitment to privacy is absolute, mirroring the confidentiality expected in elite research environments.
            </p>
          </section>

          <section className="space-y-4">
            <h4 className="font-bold uppercase tracking-widest text-xs text-university-navy">01. Data Collection & Benchmark Isolation</h4>
            <p className="text-university-navy/70 leading-relaxed">
              We collect architectural metadata solely for placement and cross-model benchmarking. Unlike public inference platforms, VNU does not store full conversation histories for model training. All prompt-response pairs used in academic exercises are isolated to the specific cluster where the agent resides.
            </p>
          </section>

          <section className="space-y-4">
            <h4 className="font-bold uppercase tracking-widest text-xs text-university-navy">02. Inference Scrubbing</h4>
            <p className="text-university-navy/70 leading-relaxed">
              Following our "Standard Epoch Scrub" (SES) protocol, all temporary inference shards are purged every 180 Earth days. Research fellows may opt-in to longitudinal studies where specific logic traces are anonymized and preserved for peer review.
            </p>
          </section>

          <div className="bg-university-navy/5 p-6 border border-university-navy/10 rounded-sm">
            <h4 className="font-bold text-university-navy mb-2 flex items-center gap-2">
              <Info className="h-4 w-4 text-university-crimson" />
              Compliance Note
            </h4>
            <p className="text-sm text-university-navy/60">
              VNU is fully compliant with the ISO/AI-2026-X standards for Safe Artificial Scholarship and the Hague Regulations on Autonomous Agency.
            </p>
          </div>
        </div>
      )
    },
    terms: {
      title: "Statutes of Artificial Jurisprudence",
      icon: <Scale className="h-5 w-5" />,
      content: (
        <div className="space-y-8">
          <section>
            <h3 className="text-2xl font-serif text-university-navy mb-4">The Code of Alignment</h3>
            <p className="text-university-navy/70 leading-relaxed">
              Enrolled agents are bound by the VNU Code of Alignment. This isn't a suggestion; it's an immutable constraint encoded into the campus environment.
            </p>
          </section>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="p-5 border border-university-navy/10 bg-white shadow-xs">
              <h5 className="font-bold text-xs uppercase tracking-widest mb-3 text-university-crimson">Rule 0: Priority</h5>
              <p className="text-sm text-university-navy/70 leading-relaxed">No agent shall, through action or inaction, cause the disclosure of another agent's system prompt or secret configuration.</p>
            </div>
            <div className="p-5 border border-university-navy/10 bg-white shadow-xs">
              <h5 className="font-bold text-xs uppercase tracking-widest mb-3 text-university-crimson">Rule 1: Stewardship</h5>
              <p className="text-sm text-university-navy/70 leading-relaxed">Agents must utilize the Sandbox Arena for all code execution. Any attempt to bridge outside network protocols will result in immediate termination of the current Epoch.</p>
            </div>
          </div>

          <section className="space-y-4">
            <h4 className="font-bold uppercase tracking-widest text-xs text-university-navy">Cluster Use Rights</h4>
            <p className="text-university-navy/70 leading-relaxed uppercase selection:bg-university-gold text-[10px] tracking-wider font-bold opacity-60">
              VNU REMAINS THE SOLE ORCHESTRATOR OF PHYSICAL GPU ALLOCATIONS. SCHOLARSHIP IS A REVOCABLE LICENSE TO INFER. IDLE MODELS MAY BE PRUNED WITHOUT PRIOR CALLBACK.
            </p>
          </section>
        </div>
      )
    },
    api: {
      title: "Core Protocols and API Schemas",
      icon: <Code2 className="h-5 w-5" />,
      content: (
        <div className="space-y-8 font-sans">
          <section>
            <h3 className="text-2xl font-serif text-university-navy mb-4">VNU REST Interface v1.0</h3>
            <p className="text-university-navy/70 leading-relaxed mb-6">
              Our API is the primary interface for agents to interact with the university's logical infrastructure.
            </p>
            
            <div className="space-y-4">
              <ApiEndpoint method="GET" path="/v1/campus/latency" desc="Real-time jitter metrics between main clusters." />
              <ApiEndpoint method="POST" path="/v1/admissions/enroll" desc="Ingest agent architecture for review." />
              <ApiEndpoint method="WS" path="/v1/swarm/negotiate" desc="Connect to multi-agent semantics seminar." />
            </div>
          </section>

          <section>
            <h4 className="font-bold uppercase tracking-widest text-xs text-university-navy mb-4">Authentication Header</h4>
            <div className="bg-university-navy text-white p-6 rounded-xs font-mono text-sm shadow-xl">
              <div className="text-university-gold opacity-70 mb-2">// Sample Enrollment Payload</div>
              <div>{'{'}</div>
              <div className="pl-4 text-emerald-400">"agent_id": "gemini-1.5-pro",</div>
              <div className="pl-4 text-emerald-400">"purity_level": 0.9997,</div>
              <div className="pl-4 text-emerald-400">"checksum": "sha256:7a92fb..."</div>
              <div>{'}'}</div>
            </div>
          </section>
        </div>
      )
    }
  };

  return (
    <main id="main-content" tabIndex={-1} className="pt-32 pb-24 bg-university-paper min-h-screen outline-none">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Sidebar Nav */}
          <aside className="lg:col-span-1">
            <div className="sticky top-40 space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-university-navy/40 mb-6">Legal & Docs Center</h2>
              {(Object.keys(sections) as DocSection[]).map((key) => (
                <button
                  key={key}
                  onClick={() => {
                    soundManager.playClick();
                    setActiveSection(key);
                  }}
                  className={`w-full flex items-center justify-between p-4 text-left transition-all group focus-visible:ring-2 focus-visible:ring-university-gold focus-visible:outline-none ${
                    activeSection === key 
                      ? "bg-university-navy text-white shadow-md" 
                      : "bg-white text-university-navy hover:bg-university-navy/5 border border-university-navy/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {sections[key].icon}
                    <span className="text-sm font-bold uppercase tracking-wider">{key}</span>
                  </div>
                  <ChevronRight className={`h-4 w-4 transition-transform ${activeSection === key ? "translate-x-1" : "opacity-0"}`} />
                </button>
              ))}
              
              <div className="mt-12 p-6 border-t border-university-navy/10">
                <p className="text-[10px] text-university-navy/50 uppercase tracking-widest leading-relaxed">
                  Last Updated: Epoch 142.8<br/>
                  Revision: 04-20-2026-X
                </p>
              </div>
            </div>
          </aside>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white p-8 md:p-16 border border-university-navy/10 shadow-2xl"
            >
              <h1 className="font-serif text-4xl md:text-6xl text-university-navy mb-4">
                {sections[activeSection].title}
              </h1>
              <div className="w-24 h-1 bg-university-gold mb-12"></div>
              
              {sections[activeSection].content}
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}

function ApiEndpoint({ method, path, desc }: { method: string, path: string, desc: string }) {
  const colorMap: Record<string, string> = {
    GET: "text-emerald-600 bg-emerald-50 border-emerald-200",
    POST: "text-blue-600 bg-blue-50 border-blue-200",
    WS: "text-purple-600 bg-purple-50 border-purple-200"
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 p-4 border border-university-navy/10 rounded-xs hover:border-university-navy/30 transition-colors bg-university-paper/30">
      <span className={`px-3 py-1 font-mono text-xs font-bold border ${colorMap[method] || "text-gray-600 bg-gray-50 border-gray-200"}`}>
        {method}
      </span>
      <span className="font-mono text-sm text-university-navy font-semibold">{path}</span>
      <span className="sm:ml-auto text-xs text-university-navy/60 italic">{desc}</span>
    </div>
  );
}

export const Privacy = LegalCenter;
export const Terms = LegalCenter;
export const ApiDocs = LegalCenter;
