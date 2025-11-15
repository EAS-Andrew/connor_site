'use client';

import { PageLayout } from '@/components';
import Link from 'next/link';
import { Button } from '@/components';

export default function AboutPage() {
    const values = [
        {
            title: 'Precision',
            tactical: 'ENGINEERED_ACCURACY',
            description: 'Every kit is cut to your exact vehicle specification using advanced CNC technology. No approximations. No generic fits.',
            icon: '◆',
        },
        {
            title: 'Confidence',
            tactical: 'ZERO_GUESSWORK',
            description: 'Automated lookup and expert verification eliminate uncertainty. You get the right kit, the first time, every time.',
            icon: '▲',
        },
        {
            title: 'Quality',
            tactical: 'PREMIUM_MATERIALS',
            description: 'Crystal-clear optics, self-healing technology, and superior durability. Protection engineered to last.',
            icon: '■',
        },
        {
            title: 'Clarity',
            tactical: 'SIMPLIFIED_PROCESS',
            description: 'PPF ordering shouldn&apos;t be complicated. We handle the complexity so you don&apos;t have to.',
            icon: '●',
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
                                    BRAND_IDENTITY
                                </span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading mb-6 text-ghost-white tracking-wider">
                                ABOUT STEALTHSHIELD
                            </h1>

                            {/* Divider */}
                            <div className="flex items-center justify-center gap-3 mb-6">
                                <div className="h-px w-16 bg-radar-grey-dark"></div>
                                <div className="w-1 h-1 bg-infrared rotate-45"></div>
                                <div className="h-px w-16 bg-radar-grey-dark"></div>
                            </div>

                            <p className="text-lg sm:text-xl text-radar-grey-light max-w-2xl mx-auto leading-relaxed">
                                Premium paint protection engineered for precision, delivered with confidence.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Brand Story */}
                <section className="py-12 sm:py-20 border-t border-radar-grey-dark">
                    <div className="container mx-auto px-4 sm:px-6">
                        <div className="max-w-4xl mx-auto">
                            <div className="mb-12 text-center">
                                <div className="mb-4">
                                    <span className="text-[10px] text-infrared uppercase tracking-[0.3em] font-heading">
                                        ORIGIN_PROTOCOL
                                    </span>
                                </div>
                                <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading mb-6 text-ghost-white tracking-wider">
                                    PRECISION PROTECTED
                                </h2>
                            </div>

                            <div className="space-y-6 text-radar-grey-light leading-relaxed text-base sm:text-lg">
                                <p>
                                    StealthShield was built on a simple principle: <span className="text-ghost-white font-semibold">protecting paintwork shouldn&apos;t require guesswork</span>.
                                </p>

                                <p>
                                    Traditional PPF ordering forces customers to navigate endless trim lists, model variations, and specification codes. One wrong selection means incorrect fitment, wasted time, and compromised protection.
                                </p>

                                <p>
                                    We engineered a better solution. By combining <span className="text-ghost-white font-semibold">intelligent vehicle lookup</span> with <span className="text-ghost-white font-semibold">expert verification</span> and <span className="text-ghost-white font-semibold">precision CNC cutting</span>, we eliminate uncertainty at every step.
                                </p>

                                <div className="bg-radar-grey border-l-4 border-infrared p-6 my-8">
                                    <p className="text-ghost-white font-heading text-xl sm:text-2xl tracking-wider mb-3">
                                        &ldquo;ACCURACY ABOVE EVERYTHING&rdquo;
                                    </p>
                                    <p className="text-radar-grey-light text-sm sm:text-base">
                                        Every order begins with precision. Every kit is verified. Every cut is exact.
                                    </p>
                                </div>

                                <p>
                                    StealthShield serves enthusiasts, daily drivers, and professional installers who demand <span className="text-ghost-white font-semibold">clarity, quality, and confidence</span>. You don&apos;t have to be an expert. You just need to care about your car.
                                </p>

                                <p>
                                    Manufactured right here in the UK, our Premium PPF stands among the nation&apos;s leading paint protection films. Engineered for exceptional clarity, unmatched durability and long-lasting anti-yellowing defence against everyday wear. Trusted by professionals across the country, our PPF delivers world-class protection with the reliability and quality that only UK manufacturing can provide.
                                </p>

                                <p className="text-ghost-white font-semibold text-lg sm:text-xl pt-4">
                                    Precision protection. Zero compromise.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Core Values */}
                <section className="py-12 sm:py-20 border-t border-radar-grey-dark">
                    <div className="container mx-auto px-4 sm:px-6">
                        <div className="max-w-5xl mx-auto">
                            <div className="mb-12 text-center">
                                <div className="mb-4">
                                    <span className="text-[10px] text-infrared uppercase tracking-[0.3em] font-heading">
                                        CORE_PRINCIPLES
                                    </span>
                                </div>
                                <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading mb-6 text-ghost-white tracking-wider">
                                    WHAT WE STAND FOR
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {values.map((value, index) => (
                                    <div
                                        key={index}
                                        className="relative bg-radar-grey border border-radar-grey-dark p-6 sm:p-8 hover:border-infrared/50 hover:scale-[1.02] transition-all duration-300"
                                    >
                                        {/* Icon */}
                                        <div className="absolute -top-4 -right-4 w-12 h-12 bg-stealth-black border-2 border-infrared flex items-center justify-center">
                                            <span className="text-2xl text-infrared">{value.icon}</span>
                                        </div>

                                        {/* Tactical label */}
                                        <div className="mb-3">
                                            <span className="text-[9px] text-infrared uppercase tracking-[0.3em] font-heading">
                                                {value.tactical}
                                            </span>
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-2xl font-heading mb-4 text-ghost-white uppercase tracking-wider">
                                            {value.title}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-radar-grey-light leading-relaxed">
                                            {value.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Who We Serve */}
                <section className="py-12 sm:py-20 border-t border-radar-grey-dark">
                    <div className="container mx-auto px-4 sm:px-6">
                        <div className="max-w-4xl mx-auto">
                            <div className="mb-12 text-center">
                                <div className="mb-4">
                                    <span className="text-[10px] text-infrared uppercase tracking-[0.3em] font-heading">
                                        TARGET_OPERATORS
                                    </span>
                                </div>
                                <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading mb-6 text-ghost-white tracking-wider">
                                    BUILT FOR DRIVERS WHO CARE
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <div className="text-center p-6 bg-radar-grey border border-radar-grey-dark hover:border-infrared/50 transition-all duration-300">
                                    <div className="w-2 h-2 bg-infrared rotate-45 mx-auto mb-4"></div>
                                    <h3 className="text-lg font-heading text-ghost-white mb-3 uppercase tracking-wider">
                                        ENTHUSIASTS
                                    </h3>
                                    <p className="text-radar-grey-light text-sm leading-relaxed">
                                        You notice every detail. You demand the best. So do we.
                                    </p>
                                </div>

                                <div className="text-center p-6 bg-radar-grey border border-radar-grey-dark hover:border-infrared/50 transition-all duration-300">
                                    <div className="w-2 h-2 bg-infrared rotate-45 mx-auto mb-4"></div>
                                    <h3 className="text-lg font-heading text-ghost-white mb-3 uppercase tracking-wider">
                                        DAILY DRIVERS
                                    </h3>
                                    <p className="text-radar-grey-light text-sm leading-relaxed">
                                        Your car deserves protection that works. No fuss, just results.
                                    </p>
                                </div>

                                <div className="text-center p-6 bg-radar-grey border border-radar-grey-dark hover:border-infrared/50 transition-all duration-300">
                                    <div className="w-2 h-2 bg-infrared rotate-45 mx-auto mb-4"></div>
                                    <h3 className="text-lg font-heading text-ghost-white mb-3 uppercase tracking-wider">
                                        INSTALLERS
                                    </h3>
                                    <p className="text-radar-grey-light text-sm leading-relaxed">
                                        Precision-cut kits save time and reduce errors. Quality you can trust.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
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
                                            READY_TO_BEGIN
                                        </span>
                                    </div>

                                    <h2 className="text-3xl sm:text-4xl font-heading mb-4 sm:mb-6 text-ghost-white tracking-wider">
                                        PROTECT YOUR INVESTMENT
                                    </h2>

                                    {/* Divider */}
                                    <div className="flex items-center justify-center gap-3 mb-6">
                                        <div className="h-px w-12 bg-radar-grey-dark"></div>
                                        <div className="w-1 h-1 bg-infrared rotate-45"></div>
                                        <div className="h-px w-12 bg-radar-grey-dark"></div>
                                    </div>

                                    <p className="text-base sm:text-lg text-radar-grey-light mb-8 sm:mb-12 px-4">
                                        Experience precision-engineered protection
                                    </p>

                                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                        <Link href="/pre-cut" className="inline-block w-full sm:w-auto">
                                            <Button size="lg" className="w-full sm:w-auto">
                                                Configure Your Kit
                                            </Button>
                                        </Link>
                                        <Link href="/how-it-works" className="inline-block w-full sm:w-auto">
                                            <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                                                How It Works
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

