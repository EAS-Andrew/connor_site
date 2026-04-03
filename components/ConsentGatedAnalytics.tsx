'use client';

import { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { getConsent } from '@/lib/consent';

export function ConsentGatedAnalytics() {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    const check = () => setConsented(getConsent() === 'accepted');
    check();
    window.addEventListener('consent-updated', check);
    return () => window.removeEventListener('consent-updated', check);
  }, []);

  if (!consented) return null;

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
