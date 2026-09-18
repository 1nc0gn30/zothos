import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, X } from 'lucide-react';

interface FAQSectionProps {
  onClose: () => void;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ onClose }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does Gyroscope Shake-to-Spin work?',
      a: 'When opened on a mobile device (iOS/Android), the app connects to DeviceMotionEvent acceleration sensors. Shaking your device triggers high-velocity rotational spin physics automatically.',
    },
    {
      q: 'Can I play on desktop without a motion sensor?',
      a: 'Absolutly! Desktop users can click the "Spin Bottle" button, use keyboard hotkeys (Spacebar / S key), or click-and-drag directly on the 3D bottle canvas to flick it.',
    },
    {
      q: 'What is the AI Party Room Mode?',
      a: 'Party Room allows you to enter player names positioned around the bottle wheel. When the bottle lands on a player, it triggers AI-generated Truth, Dare, Deep, or Wild Party challenges tailored to that person!',
    },
    {
      q: 'Does it work offline without an API key?',
      a: 'Yes. The application features a complete offline procedural engine: Web Audio API sound synthesis and a pre-bundled bank of 60+ prompts work without any internet connection.',
    },
    {
      q: 'What keyboard shortcuts are available?',
      a: 'Spacebar / [S] = Spin Bottle | [M] = Toggle Audio | [P] = Switch Game Mode | [R] = Reset Bottle / Clear Prompt | [3] = Toggle 3D WebGL.',
    },
  ];

  return (
    <div className="faq-modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="faq-title">
      <div className="faq-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="faq-modal-header">
          <h2 id="faq-title" className="faq-modal-title">
            <HelpCircle className="icon-emerald" /> FAQ & Guide
          </h2>
          <button type="button" className="close-btn" onClick={onClose} aria-label="Close FAQ modal">
            <X className="icon" />
          </button>
        </div>

        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div key={`faq-${index}`} className={`faq-item ${openIndex === index ? 'open' : ''}`}>
              <button
                type="button"
                className="faq-question"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                aria-expanded={openIndex === index}
              >
                <span>{faq.q}</span>
                {openIndex === index ? <ChevronUp className="faq-chevron" /> : <ChevronDown className="faq-chevron" />}
              </button>

              {openIndex === index && (
                <div className="faq-answer">
                  <p>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="faq-footer">
          <p>Created by Zoth Studio Team • <a href="https://nullai.tech/" target="_blank" rel="noopener noreferrer">nullai.tech</a></p>
        </div>
      </div>
    </div>
  );
};
