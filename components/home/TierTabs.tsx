'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/Button';

type VehicleMode = 'Car' | 'Motorcycle';

interface TierData {
  tier: string;
  name: string;
  price: string;
  image?: string;
  imageAlt: string;
  bestFor: string;
  shortBestFor: string;
  includes: string[];
  shortIncludes: string[];
  cta: string;
  shortCta: string;
  variant: 'primary' | 'secondary';
  border: string;
  mobileBorder: string;
  popular: boolean;
}

export function TierTabs({
  carTiers,
  bikeTiers,
}: {
  carTiers: TierData[];
  bikeTiers: TierData[];
}) {
  const [tierMode, setTierMode] = useState<VehicleMode>('Car');
  const activeTiers = tierMode === 'Car' ? carTiers : bikeTiers;

  return (
    <>
      {/* Car / Motorcycle Tabs */}
      <div className="max-w-md mx-auto border-b border-radar-grey-dark mb-12 sm:mb-16">
        <div className="flex">
          <button
            onClick={() => setTierMode('Car')}
            className={`flex-1 flex items-center justify-center gap-2 pb-3 font-heading text-xs uppercase tracking-[0.2em] transition-all relative ${
              tierMode === 'Car'
                ? 'text-ghost-white'
                : 'text-radar-grey-light hover:text-ghost-white'
            }`}
          >
            {tierMode === 'Car' && <div className="w-1 h-1 bg-infrared rotate-45"></div>}
            Cars
            {tierMode === 'Car' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-infrared"></div>
            )}
          </button>
          <div className="w-px bg-radar-grey-dark self-stretch mb-3"></div>
          <button
            onClick={() => setTierMode('Motorcycle')}
            className={`flex-1 flex items-center justify-center gap-2 pb-3 font-heading text-xs uppercase tracking-[0.2em] transition-all relative ${
              tierMode === 'Motorcycle'
                ? 'text-ghost-white'
                : 'text-radar-grey-light hover:text-ghost-white'
            }`}
          >
            {tierMode === 'Motorcycle' && <div className="w-1 h-1 bg-infrared rotate-45"></div>}
            Motorcycles
            {tierMode === 'Motorcycle' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-infrared"></div>
            )}
          </button>
        </div>
      </div>

      {/* No tiers available for this mode */}
      {activeTiers.length === 0 && (
        <div className="max-w-lg mx-auto text-center py-12">
          <div className="bg-radar-grey border border-radar-grey-dark p-8">
            <div className="w-12 h-12 bg-infrared/10 border border-infrared flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-infrared" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="5" cy="17" r="3" />
                <circle cx="19" cy="17" r="3" />
                <path d="M9 17h6m-9-4l3-6h4l3 6" />
              </svg>
            </div>
            <h3 className="text-xl font-heading text-ghost-white mb-3 tracking-wider">MOTORCYCLE KITS COMING SOON</h3>
            <p className="text-radar-grey-light text-sm leading-relaxed mb-6">
              We&apos;re preparing precision-cut motorcycle PPF kits. Contact us for a custom quote in the meantime.
            </p>
            <Link href="/contact">
              <Button variant="secondary">Get a Custom Quote</Button>
            </Link>
          </div>
        </div>
      )}

      {/* Desktop grid */}
      {activeTiers.length > 0 && (
        <>
          <div className={`hidden md:grid gap-8 ${activeTiers.length === 1 ? 'md:grid-cols-1 max-w-md mx-auto' : activeTiers.length === 2 ? 'md:grid-cols-2 max-w-3xl mx-auto' : 'md:grid-cols-3'}`}>
            {activeTiers.map((t) => (
              <div key={t.tier} className={`bg-radar-grey border-2 ${t.border} transition-all flex flex-col overflow-hidden relative`}>
                {t.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 px-4 py-1 bg-infrared z-10">
                    <span className="text-stealth-black text-xs font-heading uppercase tracking-wider">Most Popular</span>
                  </div>
                )}
                <div className="bg-stealth-black/40 h-[200px] flex items-center justify-center border-b border-radar-grey-dark">
                  {t.image ? (
                    <Image
                      src={t.image}
                      alt={t.imageAlt}
                      width={240}
                      height={160}
                      className="max-h-[160px] w-auto object-contain drop-shadow-[0_4px_20px_rgba(214,66,47,0.15)]"
                    />
                  ) : (
                    <div className="w-16 h-16 border border-radar-grey-dark flex items-center justify-center">
                      <div className="w-2 h-2 bg-infrared rotate-45"></div>
                    </div>
                  )}
                </div>
                <div className="p-6 sm:p-8 flex flex-col flex-1">
                  <div className="text-[10px] text-radar-grey-light uppercase tracking-widest mb-2 font-heading">
                    {t.tier}
                  </div>
                  <h3 className="text-2xl font-heading text-ghost-white mb-3 uppercase tracking-wide">{t.name}</h3>
                  <div className="text-3xl font-heading text-infrared mb-1">{t.price}</div>
                  <p className="text-xs text-radar-grey-light uppercase tracking-wider mb-5">Starting Price</p>

                  <p className="text-ghost-white text-sm leading-relaxed mb-5 pb-5 border-b border-radar-grey-dark">{t.bestFor}</p>

                  <ul className="space-y-2 mb-6 flex-1">
                    {t.includes.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <div className="w-1 h-1 bg-infrared rotate-45 mt-1.5 flex-shrink-0"></div>
                        <span className="text-sm text-ghost-white">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href="/pre-cut" className="mt-auto">
                    <Button variant={t.variant} className="w-full">{t.cta}</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile: compact swipeable cards */}
          <div className="md:hidden">
            <div className="-mx-4 px-4 overflow-x-auto scrollbar-hide">
              <div className={`flex gap-4 pb-4 ${activeTiers.length <= 1 ? 'justify-center' : 'w-max'}`}>
                {activeTiers.map((t) => (
                  <div key={t.tier} className={`bg-radar-grey border-2 ${t.mobileBorder} flex flex-col overflow-hidden relative w-[280px] flex-shrink-0`}>
                    {t.popular && (
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-infrared z-10">
                        <span className="text-stealth-black text-[10px] font-heading uppercase tracking-wider">Popular</span>
                      </div>
                    )}
                    <div className="bg-stealth-black/40 h-[160px] flex items-center justify-center border-b border-radar-grey-dark">
                      {t.image ? (
                        <Image
                          src={t.image}
                          alt={t.imageAlt}
                          width={180}
                          height={120}
                          className="max-h-[120px] w-auto object-contain drop-shadow-[0_4px_20px_rgba(214,66,47,0.15)]"
                        />
                      ) : (
                        <div className="w-12 h-12 border border-radar-grey-dark flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-infrared rotate-45"></div>
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="text-lg font-heading text-ghost-white mb-1 uppercase tracking-wide">{t.name}</h3>
                      <div className="text-2xl font-heading text-infrared mb-1">{t.price}</div>
                      <p className="text-[10px] text-radar-grey-light uppercase tracking-wider mb-3">Starting Price</p>

                      <p className="text-ghost-white text-xs leading-relaxed mb-3 pb-3 border-b border-radar-grey-dark">{t.shortBestFor}</p>

                      <ul className="space-y-1.5 mb-4 flex-1">
                        {t.shortIncludes.map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <div className="w-1 h-1 bg-infrared rotate-45 mt-1 flex-shrink-0"></div>
                            <span className="text-xs text-ghost-white">{item}</span>
                          </li>
                        ))}
                      </ul>

                      <Link href="/pre-cut" className="mt-auto">
                        <Button variant={t.variant} size="sm" className="w-full">{t.shortCta}</Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {activeTiers.length > 1 && (
              <div className="flex items-center justify-center gap-2 mt-4 animate-swipe-hint">
                <svg className="w-4 h-4 text-infrared" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
                <span className="text-[10px] text-radar-grey-light uppercase tracking-widest font-heading">Swipe to compare</span>
                <svg className="w-4 h-4 text-infrared" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
