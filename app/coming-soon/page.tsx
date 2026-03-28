import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'StealthShield | Coming Soon',
  description:
    'StealthShield — Premium paint protection film for cars and motorcycles. Launching soon.',
  robots: { index: false, follow: false },
};

export default function ComingSoonPage() {
  return (
    <main className="min-h-screen bg-stealth-black flex flex-col items-center justify-center px-4 sm:px-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 border border-infrared/5 transform rotate-45 translate-x-48 -translate-y-48" />
      <div className="absolute bottom-0 left-0 w-72 h-72 border border-infrared/5 transform rotate-12 -translate-x-36 translate-y-36" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-infrared/[0.02] blur-3xl" />

      <div className="relative z-10 max-w-2xl w-full text-center">
        {/* Logo */}
        <div className="mb-8 sm:mb-10 flex justify-center">
          <div className="relative w-14 h-14 sm:w-16 sm:h-16">
            <Image
              src="/logo.svg"
              alt="StealthShield Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Brand name */}
        <h2 className="font-heading text-2xl sm:text-3xl text-ghost-white tracking-[0.3em] mb-8 sm:mb-10">
          STEALTHSHIELD
        </h2>

        {/* Tactical label */}
        <div className="inline-block relative mb-8 sm:mb-10">
          <div className="absolute -top-1 -left-1 w-4 h-4 border-l-2 border-t-2 border-infrared" />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 border-r-2 border-b-2 border-infrared" />
          <div className="px-6 py-2 border border-radar-grey-dark bg-stealth-black/60">
            <span className="text-[10px] text-radar-grey-light uppercase tracking-[0.3em] font-heading">
              SYSTEM_STATUS: LAUNCHING_SOON
            </span>
          </div>
        </div>

        {/* Main heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading text-ghost-white tracking-wider mb-4 sm:mb-6 leading-tight">
          COMING SOON
        </h1>

        {/* Divider */}
        <div className="flex items-center justify-center gap-3 mb-6 sm:mb-8">
          <div className="h-px w-12 bg-radar-grey-dark" />
          <div className="w-1.5 h-1.5 bg-infrared rotate-45" />
          <div className="h-px w-12 bg-radar-grey-dark" />
        </div>

        {/* Description */}
        <p className="text-radar-grey-light text-base sm:text-lg leading-relaxed mb-10 sm:mb-12 max-w-lg mx-auto">
          Precision-cut paint protection film for cars and motorcycles.
          We&apos;re preparing something special.
        </p>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-10 sm:mb-12 max-w-xl mx-auto">
          {[
            { label: 'Registration Lookup', detail: 'Instant vehicle matching' },
            { label: 'Precision-Cut PPF', detail: 'Perfect fit guaranteed' },
            { label: 'Free Fitting Kit', detail: 'With every order' },
          ].map((feature) => (
            <div
              key={feature.label}
              className="border border-radar-grey-dark bg-radar-grey/20 p-4"
            >
              <div className="text-ghost-white text-xs font-heading uppercase tracking-wider mb-1">
                {feature.label}
              </div>
              <div className="text-radar-grey-light text-[11px] uppercase tracking-wide">
                {feature.detail}
              </div>
            </div>
          ))}
        </div>

        {/* Contact info */}
        <div className="border-t border-radar-grey-dark pt-8 sm:pt-10">
          <p className="text-radar-grey-light text-sm mb-3">
            Questions? Get in touch.
          </p>
          <a
            href="mailto:info@stealthshieldppf.com"
            className="inline-flex items-center gap-2 text-infrared hover:text-infrared-light transition-colors text-sm font-heading uppercase tracking-wider"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            info@stealthshieldppf.com
          </a>
        </div>
      </div>

      {/* Bottom decorative line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-infrared/30 to-transparent" />
    </main>
  );
}
