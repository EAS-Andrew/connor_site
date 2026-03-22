import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About | StealthShield PPF',
  description:
    'UK-based paint protection film specialists for cars and motorcycles. Precision-cut PPF kits delivered direct to you or your installer.',
  openGraph: {
    title: 'About | StealthShield PPF',
    description:
      'UK-based PPF specialists delivering precision-cut protection kits with guaranteed fitment accuracy.',
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
