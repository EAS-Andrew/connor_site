'use client';

import { useState, useEffect } from 'react';

const CONSENT_KEY = 'stealthshield_cookie_consent';

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    setShow(false);
  };

  const decline = () => {
    localStorage.setItem(CONSENT_KEY, 'declined');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 animate-fadeIn">
      <div className="max-w-4xl mx-auto bg-radar-grey border border-radar-grey-dark p-4 sm:p-6 shadow-2xl shadow-black/60">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <p className="text-ghost-white text-sm leading-relaxed">
              We use cookies and analytics to improve your experience.
              By continuing to use this site, you agree to our use of cookies.
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
