import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Upload Photos | StealthShield PPF',
  description: 'Upload vehicle photos for your StealthShield PPF order.',
  robots: { index: false, follow: false },
};

export default function UploadPhotosLayout({ children }: { children: React.ReactNode }) {
  return children;
}
