'use client';

import { PageLayout } from '@/components';
import Link from 'next/link';
import { Button } from '@/components';

export default function HowItWorksPage() {
  const steps = [
    {
      number: '01',
      title: 'Enter Your Registration',
      description: 'Start by entering your vehicle registration. Our intelligent lookup system automatically identifies your exact make, model, trim, and year.',
      tactical: 'AUTOMATED_VEHICLE_SCAN',
      details: [
        'Instant vehicle identification',
        'No manual data entry required',
        'Covers UK & international registrations',
      ],
    },
    {
      number: '02',
      title: 'Confirm Your Details',
      description: 'Review the automatically detected vehicle specifications to ensure accuracy. Our system pulls data from official databases.',
      tactical: 'VERIFICATION_PROTOCOL',
      details: [
        'Official database cross-reference',
        'Trim-level accuracy',
        'Manufacturing date confirmation',
      ],
    },
    {
      number: '03',
      title: 'Choose Your Protection',
      description: 'Select your coverage level and finish. Every kit is precision-engineered for your exact vehicle specification.',
      tactical: 'PROTECTION_CONFIGURATION',
      details: [
        'Front End, Extended, or Full Coverage',
        'Gloss or Matte finish options',
        'Guaranteed perfect fit',
      ],
    },
    {
      number: '04',
      title: 'Photo Verification',
      description: 'After ordering, we request photos of your front bumper. This ensures we account for any sensors, radar, or trim variations.',
      tactical: 'PRECISION_VALIDATION',
      details: [
        'Expert visual inspection',
        'Sensor & radar detection',
        'Spec variation confirmation',
      ],
    },
    {
      number: '05',
      title: 'Precision Cutting',
      description: 'Once verified, your kit is cut to your exact vehicle specification using advanced CNC cutting technology.',
      tactical: 'FABRICATION_SEQUENCE',
      details: [
        'CNC precision cutting',
        'Vehicle-specific patterns',
        'Quality control inspection',
      ],
    },
    {
      number: '06',
      title: 'Delivery & Installation',
      description: 'Your precision-cut kit arrives ready for installation. No trimming, no templates, no compromise.',
      tactical: 'DEPLOYMENT_READY',
      details: [
        'Installer-ready packaging',
        'Application guidelines included',
        'Professional fitting available',
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
                  PRECISION_PROCESS
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading mb-6 text-ghost-white tracking-wider">
                HOW IT WORKS
              </h1>

              {/* Divider */}
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-px w-16 bg-radar-grey-dark"></div>
                <div className="w-1 h-1 bg-infrared rotate-45"></div>
                <div className="h-px w-16 bg-radar-grey-dark"></div>
              </div>

              <p className="text-lg sm:text-xl text-radar-grey-light max-w-2xl mx-auto leading-relaxed">
                From registration to installation, every step is engineered for accuracy and confidence. No guesswork. No compromise.
              </p>
            </div>
          </div>
        </section>

        {/* Process Steps */}
        <section className="py-12 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-5xl mx-auto space-y-12 sm:space-y-20">
              {steps.map((step, index) => (
                <div
                  key={step.number}
                  className="relative"
                >
                  {/* Connecting line (except for last item) */}
                  {index < steps.length - 1 && (
                    <div className="absolute left-8 sm:left-12 top-24 w-px h-full bg-gradient-to-b from-infrared/50 to-transparent hidden sm:block"></div>
                  )}

                  <div className="relative bg-radar-grey border border-radar-grey-dark p-6 sm:p-8 hover:border-infrared/50 transition-all duration-300">
                    {/* Step number accent */}
                    <div className="absolute -top-3 -left-3 w-16 h-16 sm:w-20 sm:h-20 bg-stealth-black border-2 border-infrared flex items-center justify-center">
                      <span className="text-2xl sm:text-3xl font-heading text-infrared">{step.number}</span>
                    </div>

                    <div className="pl-14 sm:pl-20">
                      {/* Tactical label */}
                      <div className="mb-3">
                        <span className="text-[9px] text-infrared uppercase tracking-[0.3em] font-heading">
                          {step.tactical}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-2xl sm:text-3xl font-heading mb-4 text-ghost-white">
                        {step.title}
                      </h3>

                      {/* Description */}
                      <p className="text-radar-grey-light text-base sm:text-lg leading-relaxed mb-6">
                        {step.description}
                      </p>

                      {/* Details list */}
                      <ul className="space-y-2">
                        {step.details.map((detail, i) => (
                          <li key={i} className="flex items-start gap-3 text-radar-grey-light">
                            <div className="w-1 h-1 bg-infrared rotate-45 mt-2.5 flex-shrink-0"></div>
                            <span className="text-sm sm:text-base">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why This Matters Section */}
        <section className="py-12 sm:py-20 border-t border-radar-grey-dark">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="mb-4">
                  <span className="text-[10px] text-infrared uppercase tracking-[0.3em] font-heading">
                    ACCURACY_ABOVE_EVERYTHING
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading mb-6 text-ghost-white tracking-wider">
                  WHY IT MATTERS
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-radar-grey border border-radar-grey-dark p-6 hover:border-infrared/50 hover:scale-[1.02] transition-all duration-300">
                  <h3 className="text-xl font-heading mb-3 text-ghost-white uppercase tracking-wider">
                    NO GUESSWORK
                  </h3>
                  <p className="text-radar-grey-light leading-relaxed">
                    Traditional PPF ordering relies on customers selecting trim levels from endless lists. One wrong choice means wrong fitment. Our automated lookup eliminates that risk entirely.
                  </p>
                </div>

                <div className="bg-radar-grey border border-radar-grey-dark p-6 hover:border-infrared/50 hover:scale-[1.02] transition-all duration-300">
                  <h3 className="text-xl font-heading mb-3 text-ghost-white uppercase tracking-wider">
                    VERIFIED ACCURACY
                  </h3>
                  <p className="text-radar-grey-light leading-relaxed">
                    Photo verification catches spec variations that databases miss—parking sensors, radar systems, aftermarket modifications. We ensure your kit matches your car, not just the model.
                  </p>
                </div>

                <div className="bg-radar-grey border border-radar-grey-dark p-6 hover:border-infrared/50 hover:scale-[1.02] transition-all duration-300">
                  <h3 className="text-xl font-heading mb-3 text-ghost-white uppercase tracking-wider">
                    INSTALLER READY
                  </h3>
                  <p className="text-radar-grey-light leading-relaxed">
                    No trimming. No templates. No improvisation. Every kit arrives precision-cut and ready to install, saving time and reducing the risk of installation errors.
                  </p>
                </div>

                <div className="bg-radar-grey border border-radar-grey-dark p-6 hover:border-infrared/50 hover:scale-[1.02] transition-all duration-300">
                  <h3 className="text-xl font-heading mb-3 text-ghost-white uppercase tracking-wider">
                    CONFIDENCE DELIVERED
                  </h3>
                  <p className="text-radar-grey-light leading-relaxed">
                    You don&apos;t have to be a PPF expert. You don&apos;t have to understand trim codes. Just enter your registration and let precision engineering handle the rest.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto">
              <div className="relative bg-radar-grey border-2 border-infrared/30 p-8 sm:p-12">
                {/* Corner accents */}
                <div className="absolute -top-1 -left-1 w-8 h-8 border-l-2 border-t-2 border-infrared"></div>
                <div className="absolute -top-1 -right-1 w-8 h-8 border-r-2 border-t-2 border-infrared"></div>
                <div className="absolute -bottom-1 -left-1 w-8 h-8 border-l-2 border-b-2 border-infrared"></div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 border-r-2 border-b-2 border-infrared"></div>

                <div className="text-center">
                  <div className="mb-4">
                    <span className="text-[10px] text-infrared uppercase tracking-[0.3em] font-heading">
                      READY_TO_BEGIN
                    </span>
                  </div>

                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading mb-4 sm:mb-6 text-ghost-white tracking-wider">
                    EXPERIENCE PRECISION
                  </h2>

                  {/* Divider */}
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <div className="h-px w-12 bg-radar-grey-dark"></div>
                    <div className="w-1 h-1 bg-infrared rotate-45"></div>
                    <div className="h-px w-12 bg-radar-grey-dark"></div>
                  </div>

                  <p className="text-base sm:text-lg text-radar-grey-light mb-8 sm:mb-12 px-4 uppercase tracking-wider text-sm">
                    Configure your precision-cut PPF kit in under 60 seconds
                  </p>

                  <Link href="/pre-cut" className="inline-block w-full sm:w-auto px-4">
                    <Button size="lg" className="w-full sm:w-auto">
                      Configure Your Kit
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}

