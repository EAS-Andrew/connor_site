'use client';

import { useState } from 'react';

interface FaqItem {
  q: string;
  a: string;
}

export function FaqAccordion({ faqs }: { faqs: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className="bg-radar-grey border border-radar-grey-dark hover:border-infrared/50 transition-all"
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left group"
            >
              <span className="text-ghost-white font-heading text-sm sm:text-base tracking-wide flex-1">
                {faq.q}
              </span>
              <div className="flex-shrink-0">
                <div
                  className={`w-6 h-6 border border-infrared flex items-center justify-center transition-transform duration-300 ${
                    isOpen ? 'rotate-45 bg-infrared/20' : 'bg-infrared/10'
                  }`}
                >
                  <svg
                    className="w-4 h-4 text-infrared"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M12 6v12m6-6H6'}
                    />
                  </svg>
                </div>
              </div>
            </button>

            <div
              className="grid transition-all duration-300 ease-in-out"
              style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
            >
              <div className="overflow-hidden">
                <div className="px-5 pb-4 border-t border-radar-grey-dark pt-4">
                  <p className="text-radar-grey-light text-sm leading-relaxed">{faq.a}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
