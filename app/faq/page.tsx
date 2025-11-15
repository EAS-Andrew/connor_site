'use client';

import { useState } from 'react';
import { PageLayout } from '@/components';
import Link from 'next/link';
import { Button } from '@/components';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      category: 'PRODUCT_SPECS',
      questions: [
        {
          q: 'What is Paint Protection Film (PPF)?',
          a: 'PPF is a transparent, self-healing urethane film applied to vehicle surfaces to protect against stone chips, scratches, and environmental damage. It provides invisible protection while maintaining your vehicle\'s original appearance.',
        },
        {
          q: 'What\'s the difference between Gloss and Matte PPF?',
          a: 'Gloss PPF provides a crystal-clear, high-shine finish that maintains your vehicle\'s factory appearance. Matte PPF delivers a sophisticated satin finish. Both offer identical protection and self-healing properties.',
        },
        {
          q: 'How long does PPF last?',
          a: 'Our premium PPF is engineered for 7-10+ years of protection with proper care. It resists yellowing, cracking, and peeling, and features self-healing technology that repairs minor scratches with heat.',
        },
        {
          q: 'Can PPF be removed?',
          a: 'Yes. PPF can be professionally removed without damaging the underlying paintwork when proper techniques are used. It actually protects your original paint, preserving resale value.',
        },
      ],
    },
    {
      category: 'ORDERING_PROCESS',
      questions: [
        {
          q: 'How does the registration lookup work?',
          a: 'Enter your vehicle registration and our system automatically queries official databases to identify your exact make, model, trim level, and manufacturing year. This eliminates manual data entry and ensures accuracy.',
        },
        {
          q: 'What if my vehicle isn\'t found?',
          a: 'If automatic lookup doesn\'t find your vehicle, our team will manually verify your specifications. Contact us with your registration and we\'ll handle it directly.',
        },
        {
          q: 'Why do you request photos after ordering?',
          a: 'Photos of your front and rear bumpers allow us to verify your exact vehicle specification - parking sensors, radar systems, trim variations, and aftermarket modifications. This ensures your kit matches your car perfectly, not just the model.',
        },
        {
          q: 'How long does cutting and delivery take?',
          a: 'Once your vehicle is verified, kits are precision-cut within 3-5 business days. UK delivery typically takes 2-3 days. Rush orders may be available - contact us for details.',
        },
      ],
    },
    {
      category: 'INSTALLATION',
      questions: [
        {
          q: 'Can I install PPF myself?',
          a: 'PPF installation requires specific skills, tools, and experience. We strongly recommend professional installation to ensure proper fitment, alignment, and longevity. Improper installation can compromise protection and appearance.',
        },
        {
          q: 'Do you offer installation services?',
          a: 'We work with a network of certified installers across the UK. Contact us and we\'ll connect you with a trusted professional in your area.',
        },
        {
          q: 'What\'s included in the kit?',
          a: 'Each kit includes precision-cut PPF pieces for your selected coverage level, application guidelines, and care instructions. All pieces are labeled for easy identification during installation.',
        },
        {
          q: 'Do I need to prep my vehicle before installation?',
          a: 'Yes. Your vehicle must be thoroughly cleaned, decontaminated, and free of wax or sealants. Professional installers typically perform paint correction before application for optimal results.',
        },
      ],
    },
    {
      category: 'COVERAGE_OPTIONS',
      questions: [
        {
          q: 'What does Front End coverage include?',
          a: 'Front Bumper, Bonnet, Headlights, Mirror Caps, Front Wings, and Front A-Pillar & Edge of Roof. Ideal for high-impact area protection.',
        },
        {
          q: 'What does Extended coverage include?',
          a: 'Everything in Front End coverage plus Front Doors and Skirts. Provides comprehensive front and side protection.',
        },
        {
          q: 'What does Full Coverage include?',
          a: 'All panels covered (excluding glass). Complete vehicle protection for maximum coverage and peace of mind.',
        },
        {
          q: 'Can I add individual panels later?',
          a: 'Yes. Contact us with your vehicle details and we can cut additional panels. However, ordering complete coverage initially is more cost-effective.',
        },
      ],
    },
    {
      category: 'CARE_WARRANTY',
      questions: [
        {
          q: 'How do I care for PPF?',
          a: 'Wash regularly with pH-neutral soap and microfiber materials. Avoid automatic car washes with brushes. PPF can be waxed or sealed with most products. Detailed care instructions are included with every kit.',
        },
        {
          q: 'What warranty do you offer?',
          a: 'Our premium PPF carries a manufacturer warranty against yellowing, cracking, peeling, and delamination. Warranty details vary by product - contact us for specific terms.',
        },
        {
          q: 'What if my kit doesn\'t fit correctly?',
          a: 'If there\'s a fitment issue due to incorrect cutting, we\'ll recut the affected pieces at no charge. Proper photo verification prevents this, but we stand behind our accuracy guarantee.',
        },
        {
          q: 'Do you ship internationally?',
          a: 'Currently we serve UK customers. International shipping may be available for specific regions - contact us to discuss your requirements.',
        },
      ],
    },
  ];

  return (
    <PageLayout>
      <div className="bg-stealth-black min-h-screen">
        {/* Hero Section */}
        <section className="relative py-16 sm:py-24 overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6">
            {/* Angular background pattern */}
            <div className="absolute top-0 left-0 w-48 h-48 md:w-64 md:h-64 border-l-2 border-t-2 border-radar-grey-dark opacity-30"></div>
            <div className="absolute bottom-0 right-0 w-48 h-48 md:w-64 md:h-64 border-r-2 border-b-2 border-radar-grey-dark opacity-30"></div>

            <div className="relative z-10 max-w-4xl mx-auto text-center">
              <div className="mb-4">
                <span className="text-[10px] text-infrared uppercase tracking-[0.3em] font-heading">
                  INTEL_DATABASE
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading mb-6 text-ghost-white tracking-wider">
                FREQUENTLY ASKED QUESTIONS
              </h1>

              {/* Divider */}
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-px w-16 bg-radar-grey-dark"></div>
                <div className="w-1 h-1 bg-infrared rotate-45"></div>
                <div className="h-px w-16 bg-radar-grey-dark"></div>
              </div>

              <p className="text-lg sm:text-xl text-radar-grey-light max-w-2xl mx-auto leading-relaxed">
                Everything you need to know about StealthShield PPF and our precision process.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Sections */}
        <section className="py-12 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto space-y-12">
              {faqs.map((category, catIndex) => (
                <div key={catIndex} className="border-t border-radar-grey-dark pt-8">
                  <div className="mb-6">
                    <span className="text-[10px] text-infrared uppercase tracking-[0.3em] font-heading">
                      {category.category}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {category.questions.map((faq, qIndex) => {
                      const globalIndex = faqs
                        .slice(0, catIndex)
                        .reduce((acc, cat) => acc + cat.questions.length, 0) + qIndex;
                      const isOpen = openIndex === globalIndex;

                      return (
                        <div
                          key={qIndex}
                          className="bg-radar-grey border border-radar-grey-dark hover:border-infrared/50 transition-all duration-300"
                        >
                          <button
                            onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                            className="w-full px-6 py-4 flex items-start justify-between gap-4 text-left"
                          >
                            <span className="text-ghost-white font-heading text-base sm:text-lg flex-1">
                              {faq.q}
                            </span>
                            <div className="flex-shrink-0 pt-1">
                              <div
                                className={`w-4 h-4 border-2 border-infrared flex items-center justify-center transition-transform duration-300 ${
                                  isOpen ? 'rotate-45' : ''
                                }`}
                              >
                                <div className="w-1.5 h-1.5 bg-infrared"></div>
                              </div>
                            </div>
                          </button>

                          {isOpen && (
                            <div className="px-6 pb-4 border-t border-radar-grey-dark pt-4">
                              <p className="text-radar-grey-light leading-relaxed">{faq.a}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Still Have Questions */}
        <section className="py-16 sm:py-24 border-t border-radar-grey-dark">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto">
              <div className="relative bg-radar-grey border-2 border-infrared/30 p-8 sm:p-12">
                {/* Corner accents */}
                <div className="absolute -top-2 -left-2 w-8 h-8 border-l-2 border-t-2 border-infrared"></div>
                <div className="absolute -top-2 -right-2 w-8 h-8 border-r-2 border-t-2 border-infrared"></div>
                <div className="absolute -bottom-2 -left-2 w-8 h-8 border-l-2 border-b-2 border-infrared"></div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 border-r-2 border-b-2 border-infrared"></div>

                <div className="text-center">
                  <div className="mb-4">
                    <span className="text-[10px] text-infrared uppercase tracking-[0.3em] font-heading">
                      SUPPORT_CHANNEL
                    </span>
                  </div>

                  <h2 className="text-3xl sm:text-4xl font-heading mb-4 sm:mb-6 text-ghost-white tracking-wider">
                    STILL HAVE QUESTIONS?
                  </h2>

                  {/* Divider */}
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <div className="h-px w-12 bg-radar-grey-dark"></div>
                    <div className="w-1 h-1 bg-infrared rotate-45"></div>
                    <div className="h-px w-12 bg-radar-grey-dark"></div>
                  </div>

                  <p className="text-base sm:text-lg text-radar-grey-light mb-8 sm:mb-12 px-4">
                    Our team is ready to assist with your specific requirements
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link href="/contact" className="inline-block w-full sm:w-auto">
                      <Button size="lg" className="w-full sm:w-auto">
                        Contact Us
                      </Button>
                    </Link>
                    <Link href="/pre-cut" className="inline-block w-full sm:w-auto">
                      <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                        Configure Kit
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}

