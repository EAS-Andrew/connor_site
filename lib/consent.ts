export const CONSENT_KEY = 'stealthshield_cookie_consent';

export function getConsent(): 'accepted' | 'declined' | null {
  if (typeof window === 'undefined') return null;
  const value = localStorage.getItem(CONSENT_KEY);
  if (value === 'accepted' || value === 'declined') return value;
  return null;
}

export function setConsent(value: 'accepted' | 'declined'): void {
  localStorage.setItem(CONSENT_KEY, value);
  window.dispatchEvent(new Event('consent-updated'));
}
