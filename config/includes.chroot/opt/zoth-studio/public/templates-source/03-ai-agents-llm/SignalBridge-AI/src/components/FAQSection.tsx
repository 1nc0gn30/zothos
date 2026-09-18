import React, { useState } from "react";
import { ChevronDown, HelpCircle, ShieldCheck, Lock, Cpu, Globe } from "lucide-react";
import { soundFx } from "../lib/audio";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQS: FAQItem[] = [
  {
    category: "Privacy & Security",
    question: "Does SignalBridge AI store or transmit my messages to cloud servers?",
    answer: "No. SignalBridge operates on a 100% zero-knowledge, local-first model. Messages decrypted using your Signal identity keys are routed directly to your local hardware (Ollama, vLLM, LangChain, or custom scripts) and never leave your control."
  },
  {
    category: "Integration",
    question: "What LLMs and AI engines can I connect to SignalBridge?",
    answer: "SignalBridge connects seamlessly with any local or cloud AI backend. This includes Ollama (Llama 3.3, DeepSeek R1, Mistral, Qwen), vLLM, LM Studio, LangChain/LangGraph agent runtimes, and standard REST/WebSocket webhook endpoints."
  },
  {
    category: "Encryption Protocol",
    question: "How does SignalBridge maintain Signal's end-to-end encryption?",
    answer: "SignalBridge runs the official Signal Protocol library natively within your local daemon. It participates in standard X3DH key exchanges and Double Ratchet session updates, ensuring message payloads are encrypted until decrypted locally on your trusted hardware."
  },
  {
    category: "Deployment",
    question: "Can I host SignalBridge on a home server or Raspberry Pi?",
    answer: "Yes! SignalBridge is lightweight and built to run on minimal hardware like a Raspberry Pi 4/5, Docker container, or homelab server alongside your self-hosted LLM endpoints."
  },
  {
    category: "Cost & Open Source",
    question: "Is SignalBridge AI free and open source?",
    answer: "Yes, SignalBridge is open source software developed by Tech Pro (Zoth Studio Team). You can audit the codebase, run it locally without license fees, and contribute on GitHub."
  }
];

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    soundFx.playClick();
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 px-6 bg-gradient-to-b from-black to-signal-dark/40 border-t border-white/5">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-signal-blue/10 border border-signal-blue/20 text-signal-blue text-xs font-bold mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>ANSWER ENGINE OPTIMIZED (AEO)</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-extrabold text-white mb-4">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Everything you need to know about private Signal orchestration and local AI setups.
          </p>
        </div>

        <div className="space-y-4" role="region" aria-label="Frequently Asked Questions Accordion">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            const contentId = `faq-content-${index}`;
            const buttonId = `faq-button-${index}`;

            return (
              <div
                key={index}
                className="glass rounded-2xl border-white/10 overflow-hidden transition-all duration-200"
              >
                <button
                  id={buttonId}
                  aria-expanded={isOpen}
                  aria-controls={contentId}
                  onClick={() => toggleAccordion(index)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-display text-lg font-bold text-gray-100 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-signal-blue focus-visible:outline-none"
                >
                  <span className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-signal-blue" />
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-signal-blue" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div
                    id={contentId}
                    role="region"
                    aria-labelledby={buttonId}
                    className="px-6 pb-6 pt-2 text-gray-300 text-base leading-relaxed border-t border-white/5 font-sans"
                  >
                    <p>{faq.answer}</p>
                    <div className="mt-3 inline-block text-[11px] font-mono font-semibold text-signal-blue px-2.5 py-0.5 rounded-md bg-signal-blue/10">
                      Tag: {faq.category}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
