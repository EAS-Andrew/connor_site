'use client';

import { PageLayout } from '@/components';
import Link from 'next/link';

export default function CookiePolicyPage() {
  return (
    <PageLayout>
      <div className="bg-stealth-black min-h-screen">
        <section className="relative py-16 sm:py-24 overflow-hidden">
          <div className="absolute top-0 left-0 w-48 h-48 border-l-2 border-t-2 border-radar-grey-dark opacity-30"></div>
          <div className="absolute bottom-0 right-0 w-48 h-48 border-r-2 border-b-2 border-radar-grey-dark opacity-30"></div>
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-3xl mx-auto">
              <div className="mb-4">
                <span className="text-[10px] text-infrared uppercase tracking-[0.3em] font-heading">
                  LEGAL // COOKIE_POLICY
                </span>
              </div>
              <h1 className="font-heading text-3xl sm:text-4xl text-ghost-white mb-3">
                Cookie Policy
              </h1>
              <p className="text-radar-grey-light text-sm mb-12">Last updated: April 2026</p>

              <div className="space-y-10">
                <div className="border-b border-radar-grey-dark pb-10">
                  <h2 className="font-heading text-lg text-ghost-white uppercase tracking-wider mb-4">1. What Are Cookies</h2>
                  <p className="text-radar-grey-light text-sm leading-relaxed">
                    Cookies are small text files stored on your device when you visit a website. We also use browser localStorage, which works similarly - storing small pieces of data on your device to remember your preferences between visits.
                  </p>
                </div>

                <div className="border-b border-radar-grey-dark pb-10">
                  <h2 className="font-heading text-lg text-ghost-white uppercase tracking-wider mb-4">2. Cookies and Storage We Use</h2>

                  <div className="mb-6">
                    <h3 className="font-heading text-sm text-infrared-light uppercase tracking-wider mb-3">Essential (always active)</h3>
                    <div className="bg-radar-grey border border-radar-grey-dark p-4 space-y-3">
                      <div>
                        <p className="text-ghost-white text-xs font-heading uppercase tracking-wider mb-1">stealthshield_cookie_consent</p>
                        <p className="text-radar-grey-light text-xs">Type: localStorage. Stores your cookie consent choice (accepted or declined). Without this we cannot remember your preference.</p>
                      </div>
                      <div>
                        <p className="text-ghost-white text-xs font-heading uppercase tracking-wider mb-1">stealthshield_cart_id</p>
                        <p className="text-radar-grey-light text-xs">Type: localStorage. Stores your shopping cart session so your items persist between page loads.</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-heading text-sm text-infrared-light uppercase tracking-wider mb-3">Analytics (only with consent)</h3>
                    <div className="bg-radar-grey border border-radar-grey-dark p-4 space-y-3">
                      <div>
                        <p className="text-ghost-white text-xs font-heading uppercase tracking-wider mb-1">Vercel Analytics</p>
                        <p className="text-radar-grey-light text-xs">Anonymised, cookieless analytics that records page views and referrer data. No personal data is collected. Only loaded after you accept cookies.</p>
                      </div>
                      <div>
                        <p className="text-ghost-white text-xs font-heading uppercase tracking-wider mb-1">Vercel Speed Insights</p>
                        <p className="text-radar-grey-light text-xs">Anonymised performance metrics (page load times, Core Web Vitals). No personal data is collected. Only loaded after you accept cookies.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-b border-radar-grey-dark pb-10">
                  <h2 className="font-heading text-lg text-ghost-white uppercase tracking-wider mb-4">3. How to Control Cookies</h2>
                  <p className="text-radar-grey-light text-sm leading-relaxed mb-3">
                    You can change your consent preference at any time by clearing your browser&apos;s localStorage for this site (the banner will reappear on your next visit).
                  </p>
                  <p className="text-radar-grey-light text-sm leading-relaxed">
                    You can also control cookies directly through your browser settings. Note that blocking essential storage may affect site functionality such as the shopping cart.
                  </p>
                </div>

                <div className="border-b border-radar-grey-dark pb-10">
                  <h2 className="font-heading text-lg text-ghost-white uppercase tracking-wider mb-4">4. Changes to This Policy</h2>
                  <p className="text-radar-grey-light text-sm leading-relaxed">
                    We may update this policy when we add or remove analytics tools. The date at the top of this page reflects the most recent revision.
                  </p>
                </div>

                <div className="pb-10">
                  <h2 className="font-heading text-lg text-ghost-white uppercase tracking-wider mb-4">5. Contact</h2>
                  <p className="text-radar-grey-light text-sm leading-relaxed">
                    Questions about how we use cookies? Email us at{' '}
                    <a href="mailto:info@stealthshieldppf.com" className="text-infrared hover:text-infrared-light">info@stealthshieldppf.com</a>{' '}
                    or see our <Link href="/privacy" className="text-infrared hover:text-infrared-light underline">Privacy Policy</Link> for broader data practices.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
