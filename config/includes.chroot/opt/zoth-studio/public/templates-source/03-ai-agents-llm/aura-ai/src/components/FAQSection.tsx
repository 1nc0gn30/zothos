import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'How does AURA AI Front Desk replace a traditional human receptionist?',
    answer: 'AURA autonomously handles inbound phone calls, greets website visitors, answers complex business FAQs, schedules appointments into your calendar (Google Calendar, Outlook, EHRs), and processes intake forms 24/7. It operates continuously without sick days, turnover, or training lag.'
  },
  {
    id: 'faq-2',
    question: 'How is the guaranteed 25% cost savings calculated?',
    answer: 'We match your current documented front-desk monthly expenditure and deliver complete 24/7 operational coverage for 25% less. For example, if you spend $4,500/mo on a traditional receptionist, AURA is $3,375/mo—saving you $1,125/mo ($13,500/yr) directly.'
  },
  {
    id: 'faq-3',
    question: 'Can AURA integrate with our existing CRM, calendar, and intake software?',
    answer: 'Yes! AURA natively connects with Google Calendar, Microsoft Outlook, Salesforce, HubSpot, Zendesk, Clio, AthenaHealth, and custom REST API endpoints via webhooks.'
  },
  {
    id: 'faq-4',
    question: 'What happens if our business has specialized or industry-specific workflows?',
    answer: 'Simply upload your standard operating procedures, PDF knowledge bases, or website URL. AURA ingests and synthesizes your exact operational knowledge in seconds, allowing it to handle complex queries accurately.'
  },
  {
    id: 'faq-5',
    question: 'What happens if a caller has a high-priority emergency after hours?',
    answer: 'AURA recognizes high-urgency keywords and caller sentiment. It can immediately route urgent calls to an on-call manager, dispatch emergency SMS notifications, or book priority appointment slots instantly.'
  }
];

export default function FAQSection() {
  const [expandedId, setExpandedId] = useState<string | null>('faq-1');

  const toggleItem = (id: string) => {
    soundEngine.playClick();
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="py-24 px-6 relative" aria-label="Frequently Asked Questions">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-900/5 text-brand-900 text-xs font-bold tracking-widest uppercase rounded-full mb-4">
            <HelpCircle size={14} />
            <span>Got Questions? • <kbd className="px-1.5 py-0.5 bg-white border border-brand-200 rounded text-[10px]">Alt + F</kbd></span>
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-brand-900 mb-6">
            Frequently Asked <br />
            <span className="text-brand-900/40 italic">Questions</span>
          </h2>
        </div>

        <div className="space-y-4">
          {FAQ_ITEMS.map((item) => {
            const isOpen = expandedId === item.id;
            return (
              <div
                key={item.id}
                className="glass-card rounded-2xl overflow-hidden border border-brand-200/80 transition-all"
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${item.id}`}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-display font-bold text-lg text-brand-900 hover:text-brand-900/80 focus:outline-none focus:ring-2 focus:ring-brand-900"
                >
                  <span className="flex items-center gap-3">
                    <Sparkles size={18} className="text-brand-900/40 flex-shrink-0" />
                    {item.question}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0 text-brand-500"
                  >
                    <ChevronDown size={20} />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${item.id}`}
                      role="region"
                      aria-labelledby={item.id}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-brand-500 leading-relaxed text-sm md:text-base border-t border-brand-100/60 pt-4">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
