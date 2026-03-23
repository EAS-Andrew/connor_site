import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Configure Your Kit | StealthShield PPF',
  description:
    'Enter your car or motorcycle registration for instant pricing on precision-cut paint protection film. Free fitting kit included with every order.',
  openGraph: {
    title: 'Configure Your Kit | StealthShield PPF',
    description:
      'Precision-cut PPF for your car or motorcycle. Enter your reg, choose coverage, we verify and cut to spec.',
  },
  alternates: { canonical: 'https://stealthshieldppf.com/pre-cut' },
};

export default function PreCutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
