import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cart | StealthShield PPF',
  description: 'Review your StealthShield PPF order before checkout.',
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
