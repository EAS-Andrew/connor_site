import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How It Works | StealthShield PPF',
  description:
    'Our 6-step process for cars and motorcycles: enter your registration, verify your vehicle, choose coverage, we precision-cut your kit, and deliver with a free fitting kit.',
  openGraph: {
    title: 'How It Works | StealthShield PPF',
    description:
      'From registration lookup to delivery — how StealthShield precision-cuts PPF for your exact vehicle.',
  },
  alternates: { canonical: 'https://stealthshieldppf.com/how-it-works' },
};

export default function HowItWorksLayout({ children }: { children: React.ReactNode }) {
  return children;
}
