import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ | StealthShield PPF',
  description:
    'Frequently asked questions about StealthShield paint protection film. Coverage options, installation, ordering process, delivery, and warranty information.',
  openGraph: {
    title: 'FAQ | StealthShield PPF',
    description:
      'Everything you need to know about StealthShield PPF — coverage, installation, ordering, and warranty.',
  },
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return children;
}
