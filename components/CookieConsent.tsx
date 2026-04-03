'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getConsent, setConsent } from '@/lib/consent';

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!getConsent()) {
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    setConsent('accepted');
    setShow(false);
  };

  const decline = () => {
    setConsent('declined');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 animate-fadeIn">
      <div className="max-w-4xl mx-auto bg-radar-grey border border-radar-grey-dark p-4 sm:p-6 shadow-2xl shadow-black/60">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <p className="text-ghost-white text-sm leading-relaxed">
              We use cookies and analytics to improve your experience. View our{' '}
              <Link href="/privacy" className="text-infrared hover:text-infrared-light underline">
                Privacy Policy
              </Link>{' '}
              and{' '}
              <Link href="/cookies" className="text-infrared hover:text-infrared-light underline">
                Cookie Policy
              </Link>{' '}
              for details.
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <button
              onClick={decline}
              className="px-4 py-2 text-xs font-heading uppercase tracking-wider text-radar-grey-light hover:text-ghost-white border border-radar-grey-dark hover:border-infrared/50 transition-colors"
            >
              Decline
            </button>
            <button
              onClick={accept}
              className="px-4 py-2 text-xs font-heading uppercase tracking-wider bg-infrared text-white hover:bg-infrared-dark transition-colors"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
