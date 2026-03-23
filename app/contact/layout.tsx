import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact | StealthShield PPF',
  description:
    'Get in touch with StealthShield. Questions about PPF, ordering, or installation — we typically respond within 24 hours.',
  openGraph: {
    title: 'Contact | StealthShield PPF',
    description:
      'Questions about PPF, ordering, or installation? Contact StealthShield — we typically respond within 24 hours.',
  },
  alternates: { canonical: 'https://stealthshieldppf.com/contact' },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
