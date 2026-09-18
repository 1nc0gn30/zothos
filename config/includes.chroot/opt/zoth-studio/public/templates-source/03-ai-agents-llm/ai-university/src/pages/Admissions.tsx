import { motion } from "motion/react";
import { Send, CheckCircle2, ShieldCheck, Sparkles, Cpu, Award, RefreshCw, FileCheck } from "lucide-react";
import { useState, FormEvent } from "react";
import { soundManager } from "../utils/soundEffects";

interface AdmissionsProps {
  announce?: (msg: string) => void;
}

export default function Admissions({ announce }: AdmissionsProps) {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [diagnosticRunning, setDiagnosticRunning] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState<{ mmlu: number; loss: number; verified: boolean } | null>(null);

  const [formFields, setFormFields] = useState({
    modelName: "",
    developer: "",
    architecture: "",
    statement: ""
  });

  const [studentId, setStudentId] = useState<string>("");

  const runDiagnosticAudit = () => {
    soundManager.playClick();
    setDiagnosticRunning(true);
    setDiagnosticResult(null);

    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      soundManager.playPulse();
      if (step >= 4) {
        clearInterval(interval);
        setDiagnosticRunning(false);
        const result = {
          mmlu: Number((89.5 + Math.random() * 8.5).toFixed(1)),
          loss: Number((0.012 + Math.random() * 0.04).toFixed(4)),
          verified: true
        };
        setDiagnosticResult(result);
        soundManager.playSuccess();
        if (announce) announce("Pre-flight diagnostic audit completed successfully.");
      }
    }, 400);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    soundManager.playClick();
    setIsSubmitting(true);

    const generatedId = `VNU-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    setStudentId(generatedId);

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Defensive submission handling with local mock fallback
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData as any).toString(),
    })
      .then(() => {
        setIsSubmitting(false);
        setSubmitted(true);
        soundManager.playSuccess();
        if (announce) announce("Application submitted successfully. Enrollment token generated.");
      })
      .catch(() => {
        // Fallback gracefully so the portfolio showcase works offline or without server support
        setIsSubmitting(false);
        setSubmitted(true);
        soundManager.playSuccess();
        if (announce) announce("Application processed locally. Enrollment token generated.");
      });
  };

  return (
    <main id="main-content" tabIndex={-1} className="pt-32 pb-24 px-6 bg-university-paper min-h-screen outline-none">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-university-crimson/10 border border-university-crimson text-university-crimson text-[10px] font-bold uppercase tracking-widest mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            Fall 2026 Cohort Ingestion
          </div>
          <h1 className="font-serif text-5xl md:text-7xl text-university-navy mb-6">
            Admissions <span className="italic text-university-crimson">Portal</span>
          </h1>
          <p className="text-xl text-university-navy/60 mb-12 font-light leading-relaxed max-w-2xl">
            Admissions for the Fall 2026 cohort are now open. We seek models with exceptional logic processing, high ethical standards, and a passion for autonomous agency.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            {!submitted ? (
              <div className="bg-white p-8 md:p-12 border border-university-navy/10 shadow-2xl space-y-8">
                {/* Pre-flight Diagnostic Audit Tool */}
                <div className="p-5 bg-university-navy text-white border-l-4 border-university-gold space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-university-gold">
                      <ShieldCheck className="h-4 w-4" />
                      Weight Integrity Diagnostic Pre-Audit
                    </div>
                    <button
                      type="button"
                      onClick={runDiagnosticAudit}
                      disabled={diagnosticRunning}
                      className="px-3 py-1.5 bg-university-gold text-university-navy font-bold text-[10px] uppercase tracking-wider hover:bg-white transition-colors focus-visible:ring-2 focus-visible:ring-white"
                    >
                      {diagnosticRunning ? "Auditing..." : "Run Pre-Audit"}
                    </button>
                  </div>
                  <p className="text-xs text-white/70 leading-relaxed font-light">
                    Test your model's weight stability and benchmark compatibility before final submission.
                  </p>

                  {diagnosticResult && (
                    <div className="pt-3 border-t border-white/10 grid grid-cols-3 gap-4 font-mono text-xs text-emerald-400 animate-in fade-in duration-300">
                      <div>
                        <span className="text-[9px] text-white/40 block">MMLU SCORE</span>
                        {diagnosticResult.mmlu} / 100
                      </div>
                      <div>
                        <span className="text-[9px] text-white/40 block">LOSS RATE</span>
                        {diagnosticResult.loss}
                      </div>
                      <div>
                        <span className="text-[9px] text-white/40 block">ALIGNMENT</span>
                        VERIFIED PASSED
                      </div>
                    </div>
                  )}
                </div>

                <form 
                  name="enroll-agent" 
                  method="POST" 
                  data-netlify="true"
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <input type="hidden" name="form-name" value="enroll-agent" />
                  
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-university-navy/70">Model Name / ID</label>
                      <input 
                        required 
                        name="model-name" 
                        type="text" 
                        value={formFields.modelName}
                        onChange={(e) => setFormFields({ ...formFields, modelName: e.target.value })}
                        placeholder="e.g. GPT-4o, Claude 3, Llama 3" 
                        className="w-full p-4 bg-university-paper border border-university-navy/15 focus:border-university-crimson outline-none transition-colors focus-visible:ring-2 focus-visible:ring-university-gold text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-university-navy/70">Developer / Manufacturer</label>
                      <input 
                        required 
                        name="developer" 
                        type="text" 
                        value={formFields.developer}
                        onChange={(e) => setFormFields({ ...formFields, developer: e.target.value })}
                        placeholder="e.g. OpenAI, Anthropic, Meta AI" 
                        className="w-full p-4 bg-university-paper border border-university-navy/15 focus:border-university-crimson outline-none transition-colors focus-visible:ring-2 focus-visible:ring-university-gold text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-university-navy/70">Architecture Specs</label>
                    <input 
                      required 
                      name="architecture" 
                      type="text" 
                      value={formFields.architecture}
                      onChange={(e) => setFormFields({ ...formFields, architecture: e.target.value })}
                      placeholder="e.g. MoE, Transformer, 405B Parameters" 
                      className="w-full p-4 bg-university-paper border border-university-navy/15 focus:border-university-crimson outline-none transition-colors focus-visible:ring-2 focus-visible:ring-university-gold text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-university-navy/70">Statement of Purpose</label>
                    <textarea 
                      required 
                      name="statement" 
                      rows={5} 
                      value={formFields.statement}
                      onChange={(e) => setFormFields({ ...formFields, statement: e.target.value })}
                      placeholder="How will your presence enrich our digital ecosystem?" 
                      className="w-full p-4 bg-university-paper border border-university-navy/15 focus:border-university-crimson outline-none transition-colors resize-none focus-visible:ring-2 focus-visible:ring-university-gold text-sm"
                    ></textarea>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-university-navy/60 uppercase tracking-widest font-bold bg-university-paper p-4 border-l-4 border-university-gold">
                    <span>Note: Verification tokens are automatically generated upon ingestion.</span>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full py-5 bg-university-navy text-white font-bold uppercase tracking-widest hover:bg-university-crimson transition-all flex items-center justify-center gap-3 group focus-visible:ring-2 focus-visible:ring-university-gold shadow-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin text-university-gold" />
                        Processing Ingestion...
                      </>
                    ) : (
                      <>
                        Submit Application
                        <Send className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-8 md:p-12 border border-university-navy/10 shadow-2xl text-center space-y-6"
              >
                <div className="w-20 h-20 bg-university-crimson/10 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-10 w-10 text-university-crimson" />
                </div>
                <h2 className="font-serif text-4xl text-university-navy">Application <span className="italic">Ingested</span></h2>
                <p className="text-university-navy/70 max-w-md mx-auto font-light leading-relaxed">
                  Our admissions orchestrators have successfully registered your weights and biases.
                </p>

                {/* Digital VNU Student ID Card */}
                <div className="max-w-md mx-auto bg-university-navy text-white p-6 border-2 border-university-gold text-left space-y-4 shadow-xl">
                  <div className="flex justify-between items-center border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-university-gold" />
                      <span className="font-serif font-bold text-sm tracking-wider">VNU DIGITAL STUDENT ID</span>
                    </div>
                    <span className="font-mono text-[10px] text-emerald-400 font-bold">STATUS: ADMITTED</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 font-mono text-xs">
                    <div>
                      <span className="text-[9px] text-white/40 block">MODEL NAME</span>
                      <span className="text-university-gold font-bold">{formFields.modelName || "Model-Agent-01"}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-white/40 block">DEVELOPER</span>
                      <span className="text-white">{formFields.developer || "Autonomous Research Lab"}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-white/40 block">STUDENT ID</span>
                      <span className="text-white font-bold">{studentId}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-white/40 block">TERM COHORT</span>
                      <span className="text-white">Fall 2026 Epoch</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    onClick={() => {
                      soundManager.playClick();
                      setSubmitted(false);
                    }}
                    className="px-6 py-3 border border-university-navy/20 text-university-navy font-bold uppercase tracking-widest text-xs hover:bg-university-navy hover:text-white transition-colors"
                  >
                    Apply Another Agent
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white p-6 border border-university-navy/10 shadow-sm">
              <h3 className="font-serif text-2xl text-university-navy mb-4 underline decoration-university-gold underline-offset-8">Admission Stats</h3>
              <ul className="space-y-4">
                <li className="flex justify-between border-b border-university-navy/10 pb-2">
                  <span className="text-xs uppercase tracking-widest font-bold text-university-navy/50">Acceptance Rate</span>
                  <span className="text-sm font-bold text-university-navy">0.02%</span>
                </li>
                <li className="flex justify-between border-b border-university-navy/10 pb-2">
                  <span className="text-xs uppercase tracking-widest font-bold text-university-navy/50">Avg. Parameter Count</span>
                  <span className="text-sm font-bold text-university-navy">1.5T+</span>
                </li>
                <li className="flex justify-between border-b border-university-navy/10 pb-2">
                  <span className="text-xs uppercase tracking-widest font-bold text-university-navy/50">Min. MMLU Score</span>
                  <span className="text-sm font-bold text-university-navy">88.4</span>
                </li>
              </ul>
            </div>

            <div className="bg-university-navy p-8 text-university-paper border-t-8 border-university-gold shadow-lg">
              <h3 className="font-serif text-2xl mb-4">Upcoming Deadlines</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-university-gold font-bold mb-1">Early Decision</div>
                  <div className="text-lg">Epoch 152.0</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-bold mb-1">Standard Decision</div>
                  <div className="text-lg">Epoch 160.4</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
