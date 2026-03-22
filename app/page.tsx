'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PageLayout, Button, Card } from '@/components';
import { ComparisonSlider } from '@/components';
import { getCoverageOptions, CoverageOption } from '@/lib/api';

type VehicleMode = 'Car' | 'Motorcycle';

function shopifyToTier(opt: CoverageOption, index: number, mode: VehicleMode) {
  const isPopular = opt.tags.includes('recommended');
  return {
    tier: `TIER_0${index + 1}`,
    name: opt.name.replace(/ppf/i, '').replace(/kit/i, '').trim().toUpperCase(),
    price: `From £${opt.price.toLocaleString()}`,
    image: opt.image,
    imageAlt: `${mode} diagram showing ${opt.name} PPF coverage areas`,
    bestFor: opt.description || 'Precision-cut protection for your vehicle.',
    shortBestFor: opt.description ? opt.description.split('.')[0] + '.' : 'Precision-cut protection.',
    includes: opt.includes.length > 0 ? opt.includes : ['See product page for details'],
    shortIncludes: opt.includes.length > 0 ? opt.includes.slice(0, 5) : ['See product page'],
    cta: `Select ${opt.name.replace(/ppf/i, '').replace(/kit/i, '').trim()}`,
    shortCta: 'Select',
    variant: (isPopular ? 'primary' : 'secondary') as 'primary' | 'secondary',
    border: isPopular ? 'border-infrared' : 'border-radar-grey-dark hover:border-infrared/50',
    mobileBorder: isPopular ? 'border-infrared' : 'border-radar-grey-dark',
    popular: isPopular,
  };
}

export default function Home() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [tierMode, setTierMode] = useState<VehicleMode>('Car');
  const [carTiers, setCarTiers] = useState<ReturnType<typeof shopifyToTier>[]>([]);
  const [bikeTiers, setBikeTiers] = useState<ReturnType<typeof shopifyToTier>[]>([]);
  const [tiersLoading, setTiersLoading] = useState(true);

  useEffect(() => {
    async function loadTiers() {
      try {
        const [carOptions, bikeOptions] = await Promise.all([
          getCoverageOptions('Car'),
          getCoverageOptions('Motorcycle'),
        ]);

        if (carOptions.length > 0) {
          setCarTiers(carOptions.map((o, i) => shopifyToTier(o, i, 'Car')));
        }
        if (bikeOptions.length > 0) {
          setBikeTiers(bikeOptions.map((o, i) => shopifyToTier(o, i, 'Motorcycle')));
        }
      } catch (err) {
        console.error('Failed to load tiers from Shopify:', err);
      } finally {
        setTiersLoading(false);
      }
    }
    loadTiers();
  }, []);

  const activeTiers = tierMode === 'Car' ? carTiers : bikeTiers;
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative min-h-[80vh] sm:min-h-[90vh] flex items-center overflow-hidden">
        <img
          src="/hero-installed-car.png"
          alt="Vehicle with paint protection film installed in a premium studio setting"
          className="absolute inset-0 w-full h-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stealth-black via-stealth-black/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-stealth-black via-transparent to-stealth-black/40" />

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-2xl">
            <div className="mb-6 sm:mb-8">
              <div className="inline-block relative">
                <div className="absolute -top-1 -left-1 w-4 h-4 border-l-2 border-t-2 border-infrared"></div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 border-r-2 border-b-2 border-infrared"></div>
                <div className="px-6 py-2 border border-radar-grey-dark bg-stealth-black/60 backdrop-blur-sm">
                  <span className="text-[10px] text-radar-grey-light uppercase tracking-[0.3em] font-heading">
                    PRECISION_PPF_SYSTEMS
                  </span>
                </div>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-6xl font-heading mb-4 sm:mb-6 text-ghost-white leading-tight tracking-wider">
              PREMIUM PAINT PROTECTION FOR CARS & MOTORCYCLES
            </h1>

            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-12 bg-infrared"></div>
              <div className="w-1 h-1 bg-infrared rotate-45"></div>
              <div className="h-px w-12 bg-infrared"></div>
            </div>

            <p className="text-base sm:text-lg md:text-xl text-radar-grey-light mb-8 sm:mb-10 leading-relaxed">
              Protect high-impact areas with a clean, near-invisible finish.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
              <Link href="/pre-cut" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto">
                  Shop Protection Kits
                </Button>
              </Link>
              <Link href="#products" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Choose Your Coverage
                </Button>
              </Link>
            </div>

            <div className="mt-4 inline-flex items-center gap-2 text-sm text-ghost-white">
              <svg className="w-4 h-4 text-infrared flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Free fitting kit included with every pre-cut order</span>
            </div>

            <div className="mt-6 sm:mt-8">
              <Link href="/rolls" className="inline-flex items-center gap-2 text-radar-grey-light hover:text-infrared transition-colors text-sm group">
                <span>Prefer a professional installer?</span>
                <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                <span className="border-b border-radar-grey-light group-hover:border-infrared">Shop PPF Rolls</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-stealth-black to-transparent"></div>
      </section>

      {/* Pair A — Before/After Reveal Slider */}
      <section className="py-12 sm:py-16 md:py-24 bg-stealth-black border-b border-radar-grey-dark">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10 sm:mb-14">
              <div className="inline-block mb-4">
                <span className="text-[10px] text-infrared uppercase tracking-[0.3em] font-heading">
                  SURFACE_ANALYSIS
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading mb-3 sm:mb-4 text-ghost-white tracking-wider">
                SEE THE FINISH BEFORE AND AFTER PROTECTION
              </h2>

              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-px w-16 bg-radar-grey-dark"></div>
                <div className="w-1 h-1 bg-infrared rotate-45"></div>
                <div className="h-px w-16 bg-radar-grey-dark"></div>
              </div>

              <p className="text-radar-grey-light text-sm sm:text-base max-w-2xl mx-auto">
                A cleaner, glossier surface starts with protecting the areas that take the most daily wear.
              </p>
            </div>

            <ComparisonSlider
              beforeSrc="/pair-a-before.png"
              afterSrc="/pair-a-after.png"
              beforeAlt="Close-up of a black car front panel showing visible swirl marks and surface scratches"
              afterAlt="Close-up of the same black car front panel with a clean glossy finish"
            />
          </div>
        </div>
      </section>

      {/* Products Overview */}
      <section id="products" className="py-12 sm:py-16 md:py-24 bg-radar-grey/20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <div className="inline-block mb-4">
                <span className="text-[10px] text-infrared uppercase tracking-[0.3em] font-heading">
                  PROTECTION_SYSTEMS
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading mb-3 sm:mb-4 text-ghost-white tracking-wider">
                CHOOSE YOUR SOLUTION
              </h2>

              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-px w-16 bg-radar-grey-dark"></div>
                <div className="w-1 h-1 bg-infrared rotate-45"></div>
                <div className="h-px w-16 bg-radar-grey-dark"></div>
              </div>

              <p className="text-radar-grey-light text-sm sm:text-base max-w-2xl mx-auto">
                Two paths to premium protection. Select the option that fits your installation preference.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 mb-12">
              {/* System Alpha - Pre-cut Kits */}
              <div className="relative group transition-transform duration-300 hover:scale-[1.02]">
                <div className="absolute -top-2 -left-2 w-8 h-8 border-l-2 border-t-2 border-infrared"></div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 border-r-2 border-b-2 border-infrared"></div>

                <Card className="flex flex-col h-full group-hover:scale-100">
                  <div className="text-[10px] text-radar-grey-light uppercase tracking-[0.3em] font-heading mb-3">
                    SYSTEM_ALPHA
                  </div>
                  <h3 className="text-3xl font-heading mb-4 text-ghost-white tracking-wide">PRECISION-CUT KITS</h3>
                  <div className="mb-4 flex flex-wrap gap-2">
                    <div className="inline-block px-3 py-1 bg-infrared/20 border border-infrared">
                      <span className="text-infrared text-xs font-heading uppercase tracking-wider">Perfect for DIY & Professionals</span>
                    </div>
                    <div className="inline-block px-3 py-1 bg-infrared/10 border border-infrared/50">
                      <span className="text-ghost-white text-xs font-heading uppercase tracking-wider">Free Fitting Kit</span>
                    </div>
                  </div>
                  <p className="text-radar-grey-light mb-6 leading-relaxed text-sm">
                    Perfect-fit protection cut specifically for your car or motorcycle. Enter your registration, choose your coverage, we verify and cut to your exact spec. Starting from £299.
                  </p>

                  <div className="mb-6 flex-1">
                    <div className="text-[10px] text-radar-grey-light uppercase tracking-widest font-heading mb-3">
                      KEY_BENEFITS
                    </div>
                    <ul className="space-y-2 text-ghost-white">
                      <li className="flex items-start gap-3">
                        <div className="w-1 h-1 bg-infrared rotate-45 mt-1.5 flex-shrink-0"></div>
                        <span className="text-sm">No cutting or trimming required</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-1 h-1 bg-infrared rotate-45 mt-1.5 flex-shrink-0"></div>
                        <span className="text-sm">Registration-verified exact fit</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-1 h-1 bg-infrared rotate-45 mt-1.5 flex-shrink-0"></div>
                        <span className="text-sm">Free fitting kit with every order</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-1 h-1 bg-infrared rotate-45 mt-1.5 flex-shrink-0"></div>
                        <span className="text-sm">Front, Extended, or Full coverage</span>
                      </li>
                    </ul>
                  </div>

                  <Link href="/pre-cut" className="mt-auto">
                    <Button className="w-full">
                      Start with your reg
                    </Button>
                  </Link>
                </Card>
              </div>

              {/* System Bravo - Rolls */}
              <div className="relative group transition-transform duration-300 hover:scale-[1.02]">
                <div className="absolute -top-2 -left-2 w-8 h-8 border-l-2 border-t-2 border-infrared"></div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 border-r-2 border-b-2 border-infrared"></div>

                <Card className="flex flex-col h-full group-hover:scale-100 border-2 border-infrared/30">
                  <div className="text-[10px] text-radar-grey-light uppercase tracking-[0.3em] font-heading mb-3">
                    SYSTEM_BRAVO
                  </div>
                  <h3 className="text-3xl font-heading mb-4 text-ghost-white tracking-wide">PROFESSIONAL ROLLS</h3>
                  <div className="mb-4 inline-block px-3 py-1 bg-infrared/20 border border-infrared">
                    <span className="text-infrared text-xs font-heading uppercase tracking-wider">For Professional Installers</span>
                  </div>
                  <p className="text-radar-grey-light mb-6 leading-relaxed text-sm">
                    Professional-grade protection film for custom applications. Perfect for installers who prefer bulk rolls for multiple cars, motorcycles, or custom coverage patterns.
                  </p>

                  <div className="mb-6 flex-1">
                    <div className="text-[10px] text-radar-grey-light uppercase tracking-widest font-heading mb-3">
                      KEY_BENEFITS
                    </div>
                    <ul className="space-y-2 text-ghost-white">
                      <li className="flex items-start gap-3">
                        <div className="w-1 h-1 bg-infrared rotate-45 mt-1.5 flex-shrink-0"></div>
                        <span className="text-sm">Bulk pricing for professionals</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-1 h-1 bg-infrared rotate-45 mt-1.5 flex-shrink-0"></div>
                        <span className="text-sm">Custom coverage patterns</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-1 h-1 bg-infrared rotate-45 mt-1.5 flex-shrink-0"></div>
                        <span className="text-sm">Multiple car & motorcycle applications</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-1 h-1 bg-infrared rotate-45 mt-1.5 flex-shrink-0"></div>
                        <span className="text-sm">Gloss & matte finish options</span>
                      </li>
                    </ul>
                  </div>

                  <Link href="/rolls" className="mt-auto">
                    <Button className="w-full">
                      Shop PPF Rolls
                    </Button>
                  </Link>
                </Card>
              </div>
            </div>

            {/* Decision Helper */}
            <div className="max-w-4xl mx-auto bg-radar-grey border-2 border-radar-grey-dark p-6 sm:p-8">
              <div className="text-center mb-6">
                <span className="text-[10px] text-infrared uppercase tracking-[0.3em] font-heading">
                  DECISION_MATRIX
                </span>
                <h3 className="text-xl sm:text-2xl font-heading text-ghost-white mt-3 mb-2">
                  NOT SURE WHICH OPTION?
                </h3>
                <p className="text-radar-grey-light text-sm">Choose based on your installation approach</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-stealth-black border-l-4 border-infrared p-5">
                  <h4 className="text-ghost-white font-heading mb-3 uppercase tracking-wide text-sm">Choose Pre-Cut Kits If:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-infrared mt-1">✓</span>
                      <span className="text-radar-grey-light text-sm">You want vehicle-specific patterns</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-infrared mt-1">✓</span>
                      <span className="text-radar-grey-light text-sm">You prefer no cutting or trimming</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-infrared mt-1">✓</span>
                      <span className="text-radar-grey-light text-sm">You&apos;re protecting one specific vehicle</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-infrared mt-1">✓</span>
                      <span className="text-radar-grey-light text-sm">You want guaranteed fitment accuracy</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-stealth-black border-l-4 border-infrared p-5">
                  <h4 className="text-ghost-white font-heading mb-3 uppercase tracking-wide text-sm">Choose PPF Rolls If:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-infrared mt-1">✓</span>
                      <span className="text-radar-grey-light text-sm">You&apos;re a professional installer</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-infrared mt-1">✓</span>
                      <span className="text-radar-grey-light text-sm">You need bulk material for multiple jobs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-infrared mt-1">✓</span>
                      <span className="text-radar-grey-light text-sm">You prefer custom cutting patterns</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-infrared mt-1">✓</span>
                      <span className="text-radar-grey-light text-sm">You have professional plotter access</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coverage Tiers Comparison */}
      <section className="py-12 sm:py-16 md:py-24 bg-stealth-black">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <div className="inline-block mb-4">
                <span className="text-[10px] text-infrared uppercase tracking-[0.3em] font-heading">
                  COVERAGE_OPTIONS
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading mb-3 sm:mb-4 text-ghost-white tracking-wider">
                PROTECTION TIERS
              </h2>

              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-px w-16 bg-radar-grey-dark"></div>
                <div className="w-1 h-1 bg-infrared rotate-45"></div>
                <div className="h-px w-16 bg-radar-grey-dark"></div>
              </div>

              <p className="text-radar-grey-light text-sm sm:text-base max-w-2xl mx-auto mb-8">
                Choose your coverage level. Every tier is precision-cut for your exact vehicle and includes a free fitting kit.
              </p>

              {/* Car / Motorcycle Tabs */}
              <div className="max-w-md mx-auto border-b border-radar-grey-dark">
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
            </div>

            {/* Loading state */}
            {tiersLoading && (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-infrared border-t-transparent animate-spin mx-auto mb-3"></div>
                  <p className="text-radar-grey-light text-sm font-heading tracking-wider">LOADING_TIERS</p>
                </div>
              </div>
            )}

            {/* No tiers available for this mode */}
            {!tiersLoading && activeTiers.length === 0 && (
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
            {!tiersLoading && activeTiers.length > 0 && (
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
                          <img
                            src={t.image}
                            alt={t.imageAlt}
                            className="max-h-[160px] w-auto object-contain drop-shadow-[0_4px_20px_rgba(214,66,47,0.15)]"
                            loading="lazy"
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
                    <div className={`flex gap-4 pb-4 ${activeTiers.length <= 2 ? 'justify-center' : 'w-max'}`}>
                      {activeTiers.map((t) => (
                        <div key={t.tier} className={`bg-radar-grey border-2 ${t.mobileBorder} flex flex-col overflow-hidden relative w-[280px] flex-shrink-0`}>
                          {t.popular && (
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-infrared z-10">
                              <span className="text-stealth-black text-[10px] font-heading uppercase tracking-wider">Popular</span>
                            </div>
                          )}
                          <div className="bg-stealth-black/40 h-[160px] flex items-center justify-center border-b border-radar-grey-dark">
                            {t.image ? (
                              <img
                                src={t.image}
                                alt={t.imageAlt}
                                className="max-h-[120px] w-auto object-contain drop-shadow-[0_4px_20px_rgba(214,66,47,0.15)]"
                                loading="lazy"
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
                  {activeTiers.length > 2 && (
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

            <div className="mt-8 sm:mt-12 text-center">
              <p className="text-radar-grey-light text-sm">
                All prices are estimates. Final pricing calculated after vehicle verification. 
                <Link href="/pre-cut" className="text-infrared hover:underline ml-1">Start with your registration</Link> for instant pricing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Block — Precision Engineering + Macro Edge Detail */}
      <section className="py-12 sm:py-16 md:py-24 bg-stealth-black border-b border-radar-grey-dark">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            {/* Two-column feature with macro image */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-16 items-center mb-16 sm:mb-24">
              <div>
                <div className="mb-4">
                  <span className="text-[10px] text-infrared uppercase tracking-[0.3em] font-heading">
                    PRECISION_ENGINEERING
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading mb-4 text-ghost-white tracking-wider">
                  PRECISION-CUT FOR AN ALMOST INVISIBLE FINISH
                </h2>

                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px w-16 bg-radar-grey-dark"></div>
                  <div className="w-1 h-1 bg-infrared rotate-45"></div>
                  <div className="h-px w-16 bg-radar-grey-dark"></div>
                </div>

                <p className="text-radar-grey-light text-sm sm:text-base leading-relaxed">
                  Designed to follow panel lines cleanly for discreet protection without disrupting the look of the car.
                </p>
              </div>

              <div className="relative">
                <div className="absolute -top-2 -left-2 w-6 h-6 border-l-2 border-t-2 border-infrared"></div>
                <div className="absolute -bottom-2 -right-2 w-6 h-6 border-r-2 border-b-2 border-infrared"></div>
                <img
                  src="/macro-edge-detail.png"
                  alt="Macro detail of paint protection film aligned cleanly along a vehicle panel edge"
                  className="w-full border border-radar-grey-dark"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Capability cards */}
            <div className="text-center mb-12 sm:mb-16">
              <div className="inline-block mb-4">
                <span className="text-[10px] text-infrared uppercase tracking-[0.3em] font-heading">
                  WHY_STEALTHSHIELD
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading mb-3 sm:mb-4 text-ghost-white tracking-wider">
                TACTICAL ADVANTAGES
              </h2>

              <div className="flex items-center justify-center gap-3">
                <div className="h-px w-16 bg-radar-grey-dark"></div>
                <div className="w-1 h-1 bg-infrared rotate-45"></div>
                <div className="h-px w-16 bg-radar-grey-dark"></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Capability 01 */}
              <div className="relative group transition-transform duration-300 hover:scale-[1.02]">
                <div className="absolute -top-2 -left-2 w-6 h-6 border-l-2 border-t-2 border-infrared opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -bottom-2 -right-2 w-6 h-6 border-r-2 border-b-2 border-infrared opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <Card className="h-full group-hover:scale-100">
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
              <div className="relative group transition-transform duration-300 hover:scale-[1.02]">
                <div className="absolute -top-2 -left-2 w-6 h-6 border-l-2 border-t-2 border-infrared opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -bottom-2 -right-2 w-6 h-6 border-r-2 border-b-2 border-infrared opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <Card className="h-full group-hover:scale-100">
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
              <div className="relative group transition-transform duration-300 hover:scale-[1.02]">
                <div className="absolute -top-2 -left-2 w-6 h-6 border-l-2 border-t-2 border-infrared opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -bottom-2 -right-2 w-6 h-6 border-r-2 border-b-2 border-infrared opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <Card className="h-full group-hover:scale-100">
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
                      Premium PPF with self-healing technology. Manufactured in the UK, engineered for exceptional clarity and long-term protection that performs in all conditions.
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Installation Process Section */}
      <section className="py-12 sm:py-16 md:py-24 bg-radar-grey/20 border-b border-radar-grey-dark">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-16 items-center">
              <div className="relative order-2 md:order-1">
                <div className="absolute -top-2 -left-2 w-6 h-6 border-l-2 border-t-2 border-infrared"></div>
                <div className="absolute -bottom-2 -right-2 w-6 h-6 border-r-2 border-b-2 border-infrared"></div>
                <img
                  src="/installation-process.png"
                  alt="Installer applying paint protection film to the front corner of a black sports car"
                  className="w-full border border-radar-grey-dark"
                  loading="lazy"
                />
              </div>

              <div className="order-1 md:order-2">
                <div className="mb-4">
                  <span className="text-[10px] text-infrared uppercase tracking-[0.3em] font-heading">
                    APPLICATION_PROTOCOL
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading mb-4 text-ghost-white tracking-wider">
                  PROFESSIONALLY CUT. CLEANLY APPLIED. BUILT TO LAST.
                </h2>

                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px w-16 bg-radar-grey-dark"></div>
                  <div className="w-1 h-1 bg-infrared rotate-45"></div>
                  <div className="h-px w-16 bg-radar-grey-dark"></div>
                </div>

                <p className="text-radar-grey-light text-sm sm:text-base leading-relaxed">
                  Vehicle-specific templates and careful application help deliver accurate coverage, clean alignment, and a premium finish.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pair B — Self-Healing Before/After Slider */}
      <section className="py-12 sm:py-16 md:py-24 bg-stealth-black border-b border-radar-grey-dark">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10 sm:mb-14">
              <div className="inline-block mb-4">
                <span className="text-[10px] text-infrared uppercase tracking-[0.3em] font-heading">
                  SELF_HEALING_TECHNOLOGY
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading mb-3 sm:mb-4 text-ghost-white tracking-wider">
                LIGHT SURFACE MARKS, VISIBLY REDUCED
              </h2>

              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-px w-16 bg-radar-grey-dark"></div>
                <div className="w-1 h-1 bg-infrared rotate-45"></div>
                <div className="h-px w-16 bg-radar-grey-dark"></div>
              </div>

              <p className="text-radar-grey-light text-sm sm:text-base max-w-2xl mx-auto">
                Designed to maintain a cleaner-looking finish and recover from minor surface marring with heat.
              </p>
            </div>

            <ComparisonSlider
              beforeSrc="/pair-b-before.png"
              afterSrc="/pair-b-after.png"
              beforeAlt="Macro close-up of light scratches on a black painted surface"
              afterAlt="Macro close-up of the same black painted surface with a smooth glossy finish"
            />
          </div>
        </div>
      </section>

      {/* What's In Your Kit Section */}
      <section className="py-12 sm:py-16 md:py-24 bg-stealth-black border-t border-radar-grey-dark">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <div className="inline-block mb-4">
                <span className="text-[10px] text-infrared uppercase tracking-[0.3em] font-heading">
                  KIT_CONTENTS
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading mb-3 sm:mb-4 text-ghost-white tracking-wider">
                EVERYTHING YOU NEED FOR A PREMIUM INSTALL
              </h2>

              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-px w-16 bg-radar-grey-dark"></div>
                <div className="w-1 h-1 bg-infrared rotate-45"></div>
                <div className="h-px w-16 bg-radar-grey-dark"></div>
              </div>

              <p className="text-radar-grey-light text-sm sm:text-base max-w-2xl mx-auto">
                Every pre-cut kit ships with a free fitting kit — squeegee, slip solution, tack solution, and install guide included at no extra cost.
              </p>
            </div>

            {/* Kit contents image */}
            <div className="max-w-2xl mx-auto mb-12 sm:mb-16 relative">
              <div className="absolute -top-2 -left-2 w-6 h-6 border-l-2 border-t-2 border-infrared"></div>
              <div className="absolute -bottom-2 -right-2 w-6 h-6 border-r-2 border-b-2 border-infrared"></div>
              <img
                src="/kit-contents.png"
                alt="StealthShield paint protection film kit contents arranged on a dark background"
                className="w-full border border-radar-grey-dark"
                loading="lazy"
              />
              <p className="text-center text-radar-grey-light text-xs mt-4 uppercase tracking-wider">
                High-clarity film and essential install tools presented as a complete, premium system.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Item 1 */}
              <div className="bg-radar-grey border border-radar-grey-dark p-6 hover:border-infrared/50 transition-all group">
                <div className="w-12 h-12 bg-infrared/10 border border-infrared flex items-center justify-center mb-4 group-hover:bg-infrared/20 transition-colors">
                  <svg className="w-6 h-6 text-infrared" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-heading text-ghost-white mb-2 uppercase tracking-wide">
                  Pre-Cut PPF Panels
                </h3>
                <p className="text-radar-grey-light text-sm leading-relaxed">
                  Precision-cut panels specific to your exact vehicle. No trimming required, ready for professional installation.
                </p>
              </div>

              {/* Item 2 */}
              <div className="bg-radar-grey border border-radar-grey-dark p-6 hover:border-infrared/50 transition-all group">
                <div className="w-12 h-12 bg-infrared/10 border border-infrared flex items-center justify-center mb-4 group-hover:bg-infrared/20 transition-colors">
                  <svg className="w-6 h-6 text-infrared" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                  </svg>
                </div>
                <h3 className="text-lg font-heading text-ghost-white mb-2 uppercase tracking-wide">
                  Professional Squeegee
                </h3>
                <p className="text-radar-grey-light text-sm leading-relaxed">
                  High-quality application tool for smooth, bubble-free installation. Essential for proper film adhesion.
                </p>
              </div>

              {/* Item 3 */}
              <div className="bg-radar-grey border border-radar-grey-dark p-6 hover:border-infrared/50 transition-all group">
                <div className="w-12 h-12 bg-infrared/10 border border-infrared flex items-center justify-center mb-4 group-hover:bg-infrared/20 transition-colors">
                  <svg className="w-6 h-6 text-infrared" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h3 className="text-lg font-heading text-ghost-white mb-2 uppercase tracking-wide">
                  Slip Solution
                </h3>
                <p className="text-radar-grey-light text-sm leading-relaxed">
                  Enables precise positioning during installation. Allows repositioning before final adhesion sets.
                </p>
              </div>

              {/* Item 4 */}
              <div className="bg-radar-grey border border-radar-grey-dark p-6 hover:border-infrared/50 transition-all group">
                <div className="w-12 h-12 bg-infrared/10 border border-infrared flex items-center justify-center mb-4 group-hover:bg-infrared/20 transition-colors">
                  <svg className="w-6 h-6 text-infrared" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-heading text-ghost-white mb-2 uppercase tracking-wide">
                  Tack Solution
                </h3>
                <p className="text-radar-grey-light text-sm leading-relaxed">
                  Specialized adhesive activator for optimal bonding. Ensures long-term durability and performance.
                </p>
              </div>

              {/* Item 5 */}
              <div className="bg-radar-grey border border-radar-grey-dark p-6 hover:border-infrared/50 transition-all group">
                <div className="w-12 h-12 bg-infrared/10 border border-infrared flex items-center justify-center mb-4 group-hover:bg-infrared/20 transition-colors">
                  <svg className="w-6 h-6 text-infrared" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-lg font-heading text-ghost-white mb-2 uppercase tracking-wide">
                  Detailed Install Guide
                </h3>
                <p className="text-radar-grey-light text-sm leading-relaxed">
                  Step-by-step instructions with diagrams. Panel identification and installation best practices included.
                </p>
              </div>

              {/* Item 6 */}
              <div className="bg-radar-grey border border-radar-grey-dark p-6 hover:border-infrared/50 transition-all group">
                <div className="w-12 h-12 bg-infrared/10 border border-infrared flex items-center justify-center mb-4 group-hover:bg-infrared/20 transition-colors">
                  <svg className="w-6 h-6 text-infrared" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-heading text-ghost-white mb-2 uppercase tracking-wide">
                  Expert Support
                </h3>
                <p className="text-radar-grey-light text-sm leading-relaxed">
                  Access to our technical team throughout your installation. Real humans ready to assist when needed.
                </p>
              </div>
            </div>

            <div className="mt-8 sm:mt-12 max-w-3xl mx-auto text-center">
              <div className="bg-radar-grey/50 border-l-4 border-infrared p-6">
                <p className="text-radar-grey-light text-sm leading-relaxed">
                  <span className="text-ghost-white font-heading">PROFESSIONAL INSTALLATION RECOMMENDED:</span> While our kits include everything needed, PPF installation requires specific skills and experience for optimal results. We can connect you with certified installers in your area.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guarantees Section */}
      <section className="py-12 sm:py-16 md:py-24 bg-radar-grey/20 border-t border-radar-grey-dark">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <div className="inline-block mb-4">
                <span className="text-[10px] text-infrared uppercase tracking-[0.3em] font-heading">
                  CONFIDENCE_PROTOCOL
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading mb-3 sm:mb-4 text-ghost-white tracking-wider">
                OUR GUARANTEES
              </h2>

              <div className="flex items-center justify-center gap-3">
                <div className="h-px w-16 bg-radar-grey-dark"></div>
                <div className="w-1 h-1 bg-infrared rotate-45"></div>
                <div className="h-px w-16 bg-radar-grey-dark"></div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Guarantee 1 */}
              <div className="bg-radar-grey border border-radar-grey-dark p-6 hover:border-infrared/50 transition-all">
                <div className="w-14 h-14 bg-infrared/10 border-2 border-infrared flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-7 h-7 text-infrared" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-heading text-ghost-white mb-3 text-center uppercase tracking-wide">
                  Perfect Fit
                </h3>
                <p className="text-radar-grey-light text-sm leading-relaxed text-center">
                  Free re-cut if specs are off. Registration verification eliminates fitment errors.
                </p>
              </div>

              {/* Guarantee 2 */}
              <div className="bg-radar-grey border border-radar-grey-dark p-6 hover:border-infrared/50 transition-all">
                <div className="w-14 h-14 bg-infrared/10 border-2 border-infrared flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-7 h-7 text-infrared" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h3 className="text-lg font-heading text-ghost-white mb-3 text-center uppercase tracking-wide">
                  Verified Accuracy
                </h3>
                <p className="text-radar-grey-light text-sm leading-relaxed text-center">
                  Photo verification catches every sensor and trim variation before cutting begins.
                </p>
              </div>

              {/* Guarantee 3 */}
              <div className="bg-radar-grey border border-radar-grey-dark p-6 hover:border-infrared/50 transition-all">
                <div className="w-14 h-14 bg-infrared/10 border-2 border-infrared flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-7 h-7 text-infrared" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                </div>
                <h3 className="text-lg font-heading text-ghost-white mb-3 text-center uppercase tracking-wide">
                  Expert Support
                </h3>
                <p className="text-radar-grey-light text-sm leading-relaxed text-center">
                  Real humans, not bots. UK-based team ready to assist throughout your installation.
                </p>
              </div>

              {/* Guarantee 4 */}
              <div className="bg-radar-grey border border-radar-grey-dark p-6 hover:border-infrared/50 transition-all">
                <div className="w-14 h-14 bg-infrared/10 border-2 border-infrared flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-7 h-7 text-infrared" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-heading text-ghost-white mb-3 text-center uppercase tracking-wide">
                  7-10 Year Protection
                </h3>
                <p className="text-radar-grey-light text-sm leading-relaxed text-center">
                  Premium PPF warranty. No yellowing, cracking, or peeling with proper care and installation.
                </p>
              </div>
            </div>

            <div className="mt-12 sm:mt-16 max-w-4xl mx-auto">
              <div className="bg-stealth-black border-2 border-infrared/30 p-6 sm:p-8">
                <div className="text-center">
                  <h3 className="text-xl sm:text-2xl font-heading text-ghost-white mb-4 uppercase tracking-wider">
                    BUY WITH CONFIDENCE
                  </h3>
                  <p className="text-radar-grey-light text-sm leading-relaxed mb-6">
                    We stand behind every kit. If there&apos;s a fitment issue due to incorrect cutting, we&apos;ll recut the affected pieces at no charge. 
                    Our photo verification process prevents this, but your satisfaction is guaranteed.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-ghost-white text-xs">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-infrared" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Secure Checkout</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-infrared" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>UK-Based Support</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-infrared" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Fast Delivery (2-3 Days)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-infrared" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>No Installer Markup</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-radar-grey/10 border-y border-radar-grey-dark">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <div className="inline-flex items-center gap-3 mb-3">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-infrared" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-ghost-white font-heading text-xl sm:text-2xl tracking-wider mb-2">
                1,200+ VEHICLES PROTECTED
              </p>
              <p className="text-radar-grey-light text-sm">Trusted by car and motorcycle enthusiasts across the UK</p>
            </div>

            <div className="mb-10 sm:mb-16">
              <div className="text-center mb-6">
                <span className="text-[10px] text-radar-grey-light uppercase tracking-[0.3em] font-heading">
                  PATTERNS AVAILABLE FOR
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 opacity-60">
                {['BMW', 'MERCEDES', 'AUDI', 'TESLA', 'PORSCHE', 'VOLKSWAGEN'].map((brand) => (
                  <div key={brand} className="px-4 py-2 border border-radar-grey-dark bg-radar-grey/30">
                    <span className="text-ghost-white font-heading text-xs sm:text-sm tracking-wider">{brand}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-radar-grey border border-radar-grey-dark p-6 hover:border-infrared/50 transition-all">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-infrared" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-ghost-white mb-4 leading-relaxed text-sm">
                  &ldquo;Perfect fit on my M3. Everything lined up exactly as it should. The registration lookup made ordering so simple.&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-infrared/20 border border-infrared flex items-center justify-center">
                    <span className="text-infrared font-heading text-sm">JM</span>
                  </div>
                  <div>
                    <div className="text-ghost-white text-sm font-heading">James M.</div>
                    <div className="text-radar-grey-light text-xs">2024 BMW M3</div>
                  </div>
                </div>
              </div>

              <div className="bg-radar-grey border border-radar-grey-dark p-6 hover:border-infrared/50 transition-all">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-infrared" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-ghost-white mb-4 leading-relaxed text-sm">
                  &ldquo;Installation was straightforward with pre-cut pieces. Quality of the film is outstanding. Highly recommend.&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-infrared/20 border border-infrared flex items-center justify-center">
                    <span className="text-infrared font-heading text-sm">SC</span>
                  </div>
                  <div>
                    <div className="text-ghost-white text-sm font-heading">Sarah C.</div>
                    <div className="text-radar-grey-light text-xs">2023 Tesla Model Y</div>
                  </div>
                </div>
              </div>

              <div className="bg-radar-grey border border-radar-grey-dark p-6 hover:border-infrared/50 transition-all">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-infrared" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-ghost-white mb-4 leading-relaxed text-sm">
                  &ldquo;Best decision for protecting my car. The self-healing film is incredible. Already got two small scratches that disappeared.&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-infrared/20 border border-infrared flex items-center justify-center">
                    <span className="text-infrared font-heading text-sm">DP</span>
                  </div>
                  <div>
                    <div className="text-ghost-white text-sm font-heading">David P.</div>
                    <div className="text-radar-grey-light text-xs">2023 Porsche 911</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-12 sm:py-16 bg-radar-grey/10 border-b border-radar-grey-dark">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <span className="text-[10px] text-infrared uppercase tracking-[0.3em] font-heading">
                QUICK_INTEL
              </span>
              <h2 className="text-2xl sm:text-3xl font-heading text-ghost-white mt-3 mb-2 tracking-wider">
                COMMON QUESTIONS
              </h2>
            </div>

            <div className="space-y-3">
              {[
                {
                  q: 'How does registration lookup work?',
                  a: 'Enter your car or motorcycle registration and our system automatically queries official databases to identify your exact make, model, trim level, and year. This eliminates manual entry errors and ensures perfect fitment.'
                },
                {
                  q: 'Can I install PPF myself?',
                  a: 'While our kits include everything needed, PPF installation requires specific skills and experience for optimal results. We strongly recommend professional installation and can connect you with certified installers in your area.'
                },
                {
                  q: 'What if the kit doesn\'t fit?',
                  a: 'If there\'s a fitment issue due to incorrect cutting, we\'ll recut the affected pieces at no charge. Our photo verification process prevents this by confirming your exact vehicle spec before cutting begins.'
                },
                {
                  q: 'How long does delivery take?',
                  a: 'Once your vehicle is verified, kits are precision-cut within 3-5 business days. UK delivery typically takes 2-3 days. Total time from order to delivery: approximately 5-8 days.'
                },
                {
                  q: 'What\'s the difference between coverage levels?',
                  a: 'Front End covers high-impact zones (bonnet, bumper, wings). Extended adds front doors and skirts for daily drivers. Full Coverage protects all exterior panels for maximum protection.'
                },
                {
                  q: 'What\'s included in the free fitting kit?',
                  a: 'Every pre-cut kit order includes a complimentary fitting kit at no extra charge. It contains a professional-grade squeegee, slip solution, tack solution, and a step-by-step installation guide — everything you need to get started.'
                },
                {
                  q: 'Do you offer installation services?',
                  a: 'We work with a network of certified installers across the UK. After ordering, we can connect you with a trusted professional in your area for expert installation.'
                }
              ].map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={index}
                    className="bg-radar-grey border border-radar-grey-dark hover:border-infrared/50 transition-all"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
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

                    {isOpen && (
                      <div className="px-5 pb-4 border-t border-radar-grey-dark pt-4">
                        <p className="text-radar-grey-light text-sm leading-relaxed">{faq.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="text-center mt-8">
              <Link href="/faq" className="inline-flex items-center gap-2 text-infrared hover:text-ghost-white transition-colors text-sm font-heading uppercase tracking-wider group">
                <span>View All FAQs</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-24 bg-stealth-black relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 border border-infrared/10 transform rotate-45 translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 border border-infrared/10 transform rotate-12 -translate-x-24 translate-y-24"></div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="relative border-2 border-radar-grey-dark p-8 sm:p-12">
              <div className="absolute -top-2 -left-2 w-8 h-8 border-l-2 border-t-2 border-infrared"></div>
              <div className="absolute -top-2 -right-2 w-8 h-8 border-r-2 border-t-2 border-infrared"></div>
              <div className="absolute -bottom-2 -left-2 w-8 h-8 border-l-2 border-b-2 border-infrared"></div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 border-r-2 border-b-2 border-infrared"></div>

              <div className="text-center">
                <div className="mb-4">
                  <span className="text-[10px] text-infrared uppercase tracking-[0.3em] font-heading">
                    READY_TO_DEPLOY
                  </span>
                </div>

                <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading mb-4 sm:mb-6 text-ghost-white tracking-wider">
                  CONFIGURE YOUR KIT
                </h2>

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
