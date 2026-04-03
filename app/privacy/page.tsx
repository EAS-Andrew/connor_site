'use client';

import { PageLayout } from '@/components';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
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
                  LEGAL // PRIVACY_POLICY
                </span>
              </div>
              <h1 className="font-heading text-3xl sm:text-4xl text-ghost-white mb-3">
                Privacy Policy
              </h1>
              <p className="text-radar-grey-light text-sm mb-12">Last updated: April 2026</p>

              <div className="space-y-10">
                <div className="border-b border-radar-grey-dark pb-10">
                  <h2 className="font-heading text-lg text-ghost-white uppercase tracking-wider mb-4">1. Who We Are</h2>
                  <p className="text-radar-grey-light text-sm leading-relaxed">
                    StealthShield operates the website stealthshieldppf.com. We supply precision-cut paint protection film (PPF) kits for cars and motorcycles in the United Kingdom. For the purposes of data protection law, we are the data controller of your personal information.
                  </p>
                  <p className="text-radar-grey-light text-sm leading-relaxed mt-3">
                    Contact us at: <a href="mailto:info@stealthshieldppf.com" className="text-infrared hover:text-infrared-light">info@stealthshieldppf.com</a>
                  </p>
                </div>

                <div className="border-b border-radar-grey-dark pb-10">
                  <h2 className="font-heading text-lg text-ghost-white uppercase tracking-wider mb-4">2. What Data We Collect</h2>
                  <ul className="text-radar-grey-light text-sm leading-relaxed space-y-2 list-disc list-inside">
                    <li><span className="text-ghost-white">Order information:</span> name, email address, delivery address, vehicle registration number, vehicle make and model.</li>
                    <li><span className="text-ghost-white">Vehicle photos:</span> images of your vehicle submitted to verify kit specifications.</li>
                    <li><span className="text-ghost-white">Payment information:</span> processed securely by our payment provider. We do not store your card details.</li>
                    <li><span className="text-ghost-white">Contact enquiries:</span> name, email, and message when you use our contact form.</li>
                    <li><span className="text-ghost-white">Analytics data:</span> anonymised usage data (pages visited, time on site) collected via Vercel Analytics, if you have consented to cookies.</li>
                  </ul>
                </div>

                <div className="border-b border-radar-grey-dark pb-10">
                  <h2 className="font-heading text-lg text-ghost-white uppercase tracking-wider mb-4">3. How We Use Your Data</h2>
                  <ul className="text-radar-grey-light text-sm leading-relaxed space-y-2 list-disc list-inside">
                    <li>To process and fulfil your orders, including cutting kits to your vehicle specification.</li>
                    <li>To communicate with you about your order, including delivery updates and photo verification.</li>
                    <li>To respond to your enquiries and provide customer support.</li>
                    <li>To improve our website and services using anonymised analytics data.</li>
                  </ul>
                </div>

                <div className="border-b border-radar-grey-dark pb-10">
                  <h2 className="font-heading text-lg text-ghost-white uppercase tracking-wider mb-4">4. Legal Basis for Processing</h2>
                  <ul className="text-radar-grey-light text-sm leading-relaxed space-y-2 list-disc list-inside">
                    <li><span className="text-ghost-white">Contract performance:</span> processing your orders and delivering your products.</li>
                    <li><span className="text-ghost-white">Legitimate interests:</span> responding to enquiries and improving our services.</li>
                    <li><span className="text-ghost-white">Consent:</span> analytics cookies, where you have accepted via our cookie banner.</li>
                  </ul>
                </div>

                <div className="border-b border-radar-grey-dark pb-10">
                  <h2 className="font-heading text-lg text-ghost-white uppercase tracking-wider mb-4">5. Cookies</h2>
                  <p className="text-radar-grey-light text-sm leading-relaxed">
                    We use cookies to remember your consent choice and, where you have accepted, to collect anonymised analytics data. For full details of the cookies we use, see our{' '}
                    <Link href="/cookies" className="text-infrared hover:text-infrared-light underline">Cookie Policy</Link>.
                  </p>
                </div>

                <div className="border-b border-radar-grey-dark pb-10">
                  <h2 className="font-heading text-lg text-ghost-white uppercase tracking-wider mb-4">6. Third Parties</h2>
                  <ul className="text-radar-grey-light text-sm leading-relaxed space-y-2 list-disc list-inside">
                    <li><span className="text-ghost-white">Shopify:</span> order management and payment processing. Shopify is the data processor for order and payment data.</li>
                    <li><span className="text-ghost-white">Vercel Analytics:</span> anonymised, cookie-free site analytics (only loaded with your consent).</li>
                    <li><span className="text-ghost-white">Vercel Speed Insights:</span> anonymised performance monitoring (only loaded with your consent).</li>
                    <li><span className="text-ghost-white">DVLA / vehicle lookup API:</span> used to look up vehicle details from your registration number. We do not store raw DVLA responses beyond order processing.</li>
                  </ul>
                  <p className="text-radar-grey-light text-sm leading-relaxed mt-3">
                    We do not sell your personal data to any third party.
                  </p>
                </div>

                <div className="border-b border-radar-grey-dark pb-10">
                  <h2 className="font-heading text-lg text-ghost-white uppercase tracking-wider mb-4">7. Data Retention</h2>
                  <p className="text-radar-grey-light text-sm leading-relaxed">
                    We retain order records for up to 7 years in line with UK tax and accounting obligations. Contact enquiry data is deleted after 2 years if no ongoing relationship exists. Vehicle photos are deleted once your kit has been cut and despatched.
                  </p>
                </div>

                <div className="border-b border-radar-grey-dark pb-10">
                  <h2 className="font-heading text-lg text-ghost-white uppercase tracking-wider mb-4">8. Your Rights</h2>
                  <p className="text-radar-grey-light text-sm leading-relaxed mb-3">
                    Under UK GDPR, you have the right to:
                  </p>
                  <ul className="text-radar-grey-light text-sm leading-relaxed space-y-2 list-disc list-inside">
                    <li>Access the personal data we hold about you.</li>
                    <li>Correct inaccurate or incomplete data.</li>
                    <li>Request erasure of your data where we no longer have a lawful reason to retain it.</li>
                    <li>Object to processing based on legitimate interests.</li>
                    <li>Withdraw consent at any time (this does not affect processing already carried out).</li>
                    <li>Lodge a complaint with the Information Commissioner&apos;s Office (ICO) at <a href="https://ico.org.uk" className="text-infrared hover:text-infrared-light" target="_blank" rel="noopener noreferrer">ico.org.uk</a>.</li>
                  </ul>
                  <p className="text-radar-grey-light text-sm leading-relaxed mt-3">
                    To exercise any of these rights, contact us at <a href="mailto:info@stealthshieldppf.com" className="text-infrared hover:text-infrared-light">info@stealthshieldppf.com</a>.
                  </p>
                </div>

                <div className="border-b border-radar-grey-dark pb-10">
                  <h2 className="font-heading text-lg text-ghost-white uppercase tracking-wider mb-4">9. Contact</h2>
                  <p className="text-radar-grey-light text-sm leading-relaxed">
                    For any privacy-related questions or requests, email us at{' '}
                    <a href="mailto:info@stealthshieldppf.com" className="text-infrared hover:text-infrared-light">info@stealthshieldppf.com</a>.
                  </p>
                </div>

                <div className="pb-10">
                  <h2 className="font-heading text-lg text-ghost-white uppercase tracking-wider mb-4">10. Updates to This Policy</h2>
                  <p className="text-radar-grey-light text-sm leading-relaxed">
                    We may update this policy from time to time. The date at the top of this page reflects the most recent revision. Continued use of the site after changes are posted constitutes acceptance of the updated policy.
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
