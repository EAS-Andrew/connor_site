import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PPF Film Rolls | StealthShield',
  description:
    'Professional-grade paint protection film rolls for cars and motorcycles. Self-healing technology, crystal-clear optics, and bulk pricing for installers.',
  openGraph: {
    title: 'PPF Film Rolls | StealthShield',
    description:
      'Professional-grade PPF rolls for cars and motorcycles. Bulk pricing available for installers and body shops.',
  },
  alternates: { canonical: 'https://stealthshieldppf.com/rolls' },
};

export default function RollsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
