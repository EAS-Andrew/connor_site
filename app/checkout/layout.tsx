import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Checkout | StealthShield PPF',
  description: 'Complete your StealthShield PPF order.',
  robots: { index: false, follow: false },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
