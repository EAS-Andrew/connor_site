import Link from 'next/link';
import { PageLayout, Button, Card } from '@/components';

export default function Home() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative min-h-[80vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Angular background pattern */}
        <div className="absolute inset-0 opacity-5 overflow-hidden">
          <div className="absolute top-0 left-0 w-48 h-48 md:w-96 md:h-96 border border-ghost-white transform -rotate-45 translate-x-[-50%] translate-y-[-50%]"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 md:w-96 md:h-96 lg:w-[600px] lg:h-[600px] border border-ghost-white transform rotate-12 translate-x-[30%] translate-y-[30%]"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Tactical classification label */}
            <div className="mb-8">
              <div className="inline-block relative">
                <div className="absolute -top-1 -left-1 w-4 h-4 border-l-2 border-t-2 border-infrared"></div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 border-r-2 border-b-2 border-infrared"></div>
                <div className="px-6 py-2 border border-radar-grey-dark bg-radar-grey">
                  <span className="text-[10px] text-radar-grey-light uppercase tracking-[0.3em] font-heading">
                    PRECISION_PPF_SYSTEMS
                  </span>
                </div>
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-heading mb-4 sm:mb-6 text-ghost-white leading-tight tracking-wider">
              PERFECT FIT. EVERY TIME.
            </h1>

            {/* Horizontal accent */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-12 bg-infrared"></div>
              <div className="w-1 h-1 bg-infrared rotate-45"></div>
              <div className="h-px w-12 bg-infrared"></div>
            </div>

            <p className="text-lg sm:text-xl md:text-2xl text-ghost-white mb-3 sm:mb-4 font-heading tracking-wide">
              PRECISION-CUT PAINT PROTECTION FILM
            </p>
            <p className="text-base sm:text-lg text-radar-grey-light mb-8 sm:mb-12 max-w-2xl mx-auto px-4 leading-relaxed">
              Enter your registration • Choose your coverage • We verify and cut to your exact vehicle spec
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4">
              <Link href="/pre-cut" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto">
                  Configure Your Kit
                </Button>
              </Link>
              <Link href="#why-us" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  How It Works
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-stealth-black to-transparent"></div>
      </section>

      {/* Why Us Section */}
      <section id="why-us" className="py-12 sm:py-16 md:py-24 bg-stealth-black">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            {/* Section header with tactical styling */}
            <div className="text-center mb-12 sm:mb-16">
              <div className="inline-block mb-4">
                <span className="text-[10px] text-infrared uppercase tracking-[0.3em] font-heading">
                  TACTICAL_ADVANTAGES
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading mb-3 sm:mb-4 text-ghost-white tracking-wider">
                WHY STEALTHSHIELD
              </h2>

              {/* Divider */}
              <div className="flex items-center justify-center gap-3">
                <div className="h-px w-16 bg-radar-grey-dark"></div>
                <div className="w-1 h-1 bg-infrared rotate-45"></div>
                <div className="h-px w-16 bg-radar-grey-dark"></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Capability 01 */}
              <div className="relative group">
                <div className="absolute -top-1 -left-1 w-6 h-6 border-l-2 border-t-2 border-infrared opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 border-r-2 border-b-2 border-infrared opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <Card className="h-full">
                  <div className="text-center">
                    <div className="text-[10px] text-radar-grey-light uppercase tracking-[0.3em] font-heading mb-4">
                      CAPABILITY_01
                    </div>
                    <div className="w-16 h-16 mx-auto mb-6 bg-infrared/10 flex items-center justify-center">
                      <div className="relative w-8 h-8">
                        <div className="absolute inset-x-0 bottom-0 w-0 h-0 mx-auto border-l-[16px] border-r-[16px] border-b-[28px] border-l-transparent border-r-transparent border-b-infrared animate-pulse"></div>
                        <div className="absolute inset-x-0 bottom-0 w-0 h-0 mx-auto border-l-[16px] border-r-[16px] border-b-[28px] border-l-transparent border-r-transparent border-b-infrared opacity-30"></div>
                      </div>
                    </div>
                    <h3 className="text-2xl font-heading mb-4 text-ghost-white tracking-wide">CRYSTAL CLARITY</h3>
                    <p className="text-radar-grey-light text-sm leading-relaxed">
                      Invisible protection that preserves your vehicle&apos;s finish. Optical clarity that maintains the original appearance with zero distortion.
                    </p>
                  </div>
                </Card>
              </div>

              {/* Capability 02 */}
              <div className="relative group">
                <div className="absolute -top-1 -left-1 w-6 h-6 border-l-2 border-t-2 border-infrared opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 border-r-2 border-b-2 border-infrared opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <Card className="h-full">
                  <div className="text-center">
                    <div className="text-[10px] text-radar-grey-light uppercase tracking-[0.3em] font-heading mb-4">
                      CAPABILITY_02
                    </div>
                    <div className="w-16 h-16 mx-auto mb-6 bg-infrared/10 flex items-center justify-center">
                      <div className="relative w-8 h-8">
                        <div className="absolute inset-0 border-2 border-infrared transform rotate-45 animate-spin-slow"></div>
                        <div className="absolute inset-0 border-2 border-infrared transform rotate-45 opacity-30"></div>
                      </div>
                    </div>
                    <h3 className="text-2xl font-heading mb-4 text-ghost-white tracking-wide">PERFECT FIT</h3>
                    <p className="text-radar-grey-light text-sm leading-relaxed">
                      Registration-verified fitment for your exact vehicle. No guesswork, no wrong trim, just perfect-fit patterns cut to spec.
                    </p>
                  </div>
                </Card>
              </div>

              {/* Capability 03 */}
              <div className="relative group">
                <div className="absolute -top-1 -left-1 w-6 h-6 border-l-2 border-t-2 border-infrared opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 border-r-2 border-b-2 border-infrared opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <Card className="h-full">
                  <div className="text-center">
                    <div className="text-[10px] text-radar-grey-light uppercase tracking-[0.3em] font-heading mb-4">
                      CAPABILITY_03
                    </div>
                    <div className="w-16 h-16 mx-auto mb-6 bg-infrared/10 flex items-center justify-center">
                      <div className="relative w-10 h-10">
                        <svg className="absolute inset-0 animate-ping opacity-75" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <polygon points="20,2 35,12 35,28 20,38 5,28 5,12" stroke="#D6422F" strokeWidth="2" fill="none" />
                        </svg>
                        <svg className="absolute inset-0" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <polygon points="20,2 35,12 35,28 20,38 5,28 5,12" stroke="#D6422F" strokeWidth="2" fill="none" />
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-2xl font-heading mb-4 text-ghost-white tracking-wide">BUILT TO LAST</h3>
                    <p className="text-radar-grey-light text-sm leading-relaxed">
                      Premium PPF with self-healing technology. Engineered for long-term protection that performs in all conditions.
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Overview */}
      <section id="products" className="py-12 sm:py-16 md:py-24 bg-radar-grey/20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            {/* Section header */}
            <div className="text-center mb-12 sm:mb-16">
              <div className="inline-block mb-4">
                <span className="text-[10px] text-infrared uppercase tracking-[0.3em] font-heading">
                  PROTECTION_SYSTEMS
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading mb-3 sm:mb-4 text-ghost-white tracking-wider">
                OUR PRODUCTS
              </h2>

              {/* Divider */}
              <div className="flex items-center justify-center gap-3">
                <div className="h-px w-16 bg-radar-grey-dark"></div>
                <div className="w-1 h-1 bg-infrared rotate-45"></div>
                <div className="h-px w-16 bg-radar-grey-dark"></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* System Alpha */}
              <div className="relative">
                <div className="absolute -top-2 -left-2 w-8 h-8 border-l-2 border-t-2 border-infrared"></div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 border-r-2 border-b-2 border-infrared"></div>

                <Card className="flex flex-col h-full">
                  <div className="text-[10px] text-radar-grey-light uppercase tracking-[0.3em] font-heading mb-3">
                    SYSTEM_ALPHA
                  </div>
                  <h3 className="text-3xl font-heading mb-4 text-ghost-white tracking-wide">PRECISION-CUT PPF KITS</h3>
                  <p className="text-radar-grey-light mb-6 leading-relaxed text-sm">
                    Perfect-fit protection cut specifically for your vehicle. Enter your registration, choose your coverage, we verify and cut to your exact spec.
                  </p>

                  {/* Specs list */}
                  <div className="mb-6">
                    <div className="text-[10px] text-radar-grey-light uppercase tracking-widest font-heading mb-3">
                      SYSTEM_SPEC
                    </div>
                    <ul className="space-y-2 text-ghost-white flex-1">
                      <li className="flex items-start gap-3">
                        <div className="w-1 h-1 bg-infrared rotate-45 mt-1.5 flex-shrink-0"></div>
                        <span className="text-sm">Registration-verified fitment accuracy</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-1 h-1 bg-infrared rotate-45 mt-1.5 flex-shrink-0"></div>
                        <span className="text-sm">Post-purchase spec confirmation</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-1 h-1 bg-infrared rotate-45 mt-1.5 flex-shrink-0"></div>
                        <span className="text-sm">Gloss or matt finish options</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-1 h-1 bg-infrared rotate-45 mt-1.5 flex-shrink-0"></div>
                        <span className="text-sm">Professional-grade clarity & durability</span>
                      </li>
                    </ul>
                  </div>

                  <Link href="/pre-cut" className="mt-auto">
                    <Button className="w-full">
                      Configure Your Kit
                    </Button>
                  </Link>
                </Card>
              </div>

              {/* System Bravo */}
              <div className="relative">
                <div className="absolute -top-2 -left-2 w-8 h-8 border-l-2 border-t-2 border-radar-grey-dark"></div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 border-r-2 border-b-2 border-radar-grey-dark"></div>

                <Card className="flex flex-col h-full opacity-75">
                  <div className="text-[10px] text-radar-grey-light uppercase tracking-[0.3em] font-heading mb-3">
                    SYSTEM_BRAVO
                  </div>
                  <h3 className="text-3xl font-heading mb-4 text-ghost-white tracking-wide">PREMIUM PPF FILM ROLLS</h3>
                  <p className="text-radar-grey-light mb-6 leading-relaxed text-sm">
                    Professional-grade protection film for custom applications. Premium quality with optical clarity and self-healing technology.
                  </p>

                  {/* Specs list */}
                  <div className="mb-6">
                    <div className="text-[10px] text-radar-grey-light uppercase tracking-widest font-heading mb-3">
                      SYSTEM_SPEC
                    </div>
                    <ul className="space-y-2 text-ghost-white flex-1">
                      <li className="flex items-start gap-3">
                        <div className="w-1 h-1 bg-radar-grey-light rotate-45 mt-1.5 flex-shrink-0"></div>
                        <span className="text-sm">Gloss & matt finish options</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-1 h-1 bg-radar-grey-light rotate-45 mt-1.5 flex-shrink-0"></div>
                        <span className="text-sm">Crystal-clear optical quality</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-1 h-1 bg-radar-grey-light rotate-45 mt-1.5 flex-shrink-0"></div>
                        <span className="text-sm">Self-healing technology</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-1 h-1 bg-radar-grey-light rotate-45 mt-1.5 flex-shrink-0"></div>
                        <span className="text-sm">Professional installer-ready</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-auto">
                    <Button variant="secondary" className="w-full" disabled>
                      Coming Soon
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-24 bg-stealth-black relative overflow-hidden">
        {/* Angular accent elements */}
        <div className="absolute top-0 right-0 w-64 h-64 border border-infrared/10 transform rotate-45 translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 border border-infrared/10 transform rotate-12 -translate-x-24 translate-y-24"></div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Tactical frame */}
            <div className="relative border-2 border-radar-grey-dark p-8 sm:p-12">
              <div className="absolute -top-1 -left-1 w-8 h-8 border-l-2 border-t-2 border-infrared"></div>
              <div className="absolute -top-1 -right-1 w-8 h-8 border-r-2 border-t-2 border-infrared"></div>
              <div className="absolute -bottom-1 -left-1 w-8 h-8 border-l-2 border-b-2 border-infrared"></div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 border-r-2 border-b-2 border-infrared"></div>

              <div className="text-center">
                <div className="mb-4">
                  <span className="text-[10px] text-infrared uppercase tracking-[0.3em] font-heading">
                    READY_TO_DEPLOY
                  </span>
                </div>

                <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading mb-4 sm:mb-6 text-ghost-white tracking-wider">
                  CONFIGURE YOUR KIT
                </h2>

                {/* Divider */}
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="h-px w-12 bg-radar-grey-dark"></div>
                  <div className="w-1 h-1 bg-infrared rotate-45"></div>
                  <div className="h-px w-12 bg-radar-grey-dark"></div>
                </div>

                <p className="text-base sm:text-lg text-radar-grey-light mb-8 sm:mb-12 px-4 uppercase tracking-wider text-sm">
                  Access precision-engineered protection system in under 60 seconds
                </p>

                <Link href="/pre-cut" className="inline-block w-full sm:w-auto px-4">
                  <Button size="lg" className="w-full sm:w-auto">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
