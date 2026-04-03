'use client';

import { PageLayout } from '@/components';

export default function TermsOfServicePage() {
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
                  LEGAL // TERMS_OF_SERVICE
                </span>
              </div>
              <h1 className="font-heading text-3xl sm:text-4xl text-ghost-white mb-3">
                Terms of Service
              </h1>
              <p className="text-radar-grey-light text-sm mb-12">Last updated: April 2026</p>

              <div className="space-y-10">
                <div className="border-b border-radar-grey-dark pb-10">
                  <h2 className="font-heading text-lg text-ghost-white uppercase tracking-wider mb-4">1. Agreement to Terms</h2>
                  <p className="text-radar-grey-light text-sm leading-relaxed">
                    By accessing stealthshieldppf.com or placing an order with StealthShield, you agree to these Terms of Service. If you do not agree, please do not use this website or place an order.
                  </p>
                </div>

                <div className="border-b border-radar-grey-dark pb-10">
                  <h2 className="font-heading text-lg text-ghost-white uppercase tracking-wider mb-4">2. Use of the Website</h2>
                  <p className="text-radar-grey-light text-sm leading-relaxed mb-3">
                    You may use this website for lawful purposes only. You agree not to:
                  </p>
                  <ul className="text-radar-grey-light text-sm leading-relaxed space-y-2 list-disc list-inside">
                    <li>Attempt to gain unauthorised access to any part of the site or its infrastructure.</li>
                    <li>Use automated tools to scrape, crawl, or harvest content without our prior written consent.</li>
                    <li>Transmit any harmful, offensive, or unlawful content.</li>
                    <li>Misrepresent your identity or vehicle details when placing an order.</li>
                  </ul>
                </div>

                <div className="border-b border-radar-grey-dark pb-10">
                  <h2 className="font-heading text-lg text-ghost-white uppercase tracking-wider mb-4">3. Orders and Products</h2>
                  <p className="text-radar-grey-light text-sm leading-relaxed mb-3">
                    All orders are subject to acceptance and availability. We reserve the right to refuse or cancel an order at any time.
                  </p>
                  <ul className="text-radar-grey-light text-sm leading-relaxed space-y-2 list-disc list-inside">
                    <li>Pre-cut kits are manufactured to the vehicle specification you provide. It is your responsibility to ensure the vehicle registration and details you submit are accurate.</li>
                    <li>Where we request photos for verification, kits will not be cut until satisfactory photos have been received.</li>
                    <li>Prices are displayed in GBP and include VAT where applicable. We reserve the right to change prices without notice, but the price confirmed at checkout is the price you will be charged.</li>
                    <li>Returns and refunds are handled in line with your statutory rights under UK consumer law. Custom-cut kits may not be eligible for return unless faulty.</li>
                  </ul>
                </div>

                <div className="border-b border-radar-grey-dark pb-10">
                  <h2 className="font-heading text-lg text-ghost-white uppercase tracking-wider mb-4">4. Intellectual Property</h2>
                  <p className="text-radar-grey-light text-sm leading-relaxed">
                    All content on this website - including text, images, logos, and design - is the property of StealthShield or its licensors and is protected by copyright. You may not reproduce, distribute, or create derivative works without our express written permission.
                  </p>
                </div>

                <div className="border-b border-radar-grey-dark pb-10">
                  <h2 className="font-heading text-lg text-ghost-white uppercase tracking-wider mb-4">5. Limitation of Liability</h2>
                  <p className="text-radar-grey-light text-sm leading-relaxed mb-3">
                    To the fullest extent permitted by law, StealthShield shall not be liable for:
                  </p>
                  <ul className="text-radar-grey-light text-sm leading-relaxed space-y-2 list-disc list-inside">
                    <li>Indirect, incidental, or consequential losses arising from use of this website or our products.</li>
                    <li>Loss of data, revenue, or business opportunity.</li>
                    <li>Damage to your vehicle resulting from incorrect installation of PPF. We provide installation guidance but professional fitting is recommended.</li>
                  </ul>
                  <p className="text-radar-grey-light text-sm leading-relaxed mt-3">
                    Nothing in these terms limits our liability for death or personal injury caused by negligence, fraud, or any other liability that cannot be excluded by law.
                  </p>
                </div>

                <div className="border-b border-radar-grey-dark pb-10">
                  <h2 className="font-heading text-lg text-ghost-white uppercase tracking-wider mb-4">6. Governing Law</h2>
                  <p className="text-radar-grey-light text-sm leading-relaxed">
                    These terms are governed by the laws of England and Wales. Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.
                  </p>
                </div>

                <div className="pb-10">
                  <h2 className="font-heading text-lg text-ghost-white uppercase tracking-wider mb-4">7. Contact</h2>
                  <p className="text-radar-grey-light text-sm leading-relaxed">
                    Questions about these terms? Email us at{' '}
                    <a href="mailto:info@stealthshieldppf.com" className="text-infrared hover:text-infrared-light">info@stealthshieldppf.com</a>.
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
