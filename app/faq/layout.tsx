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
  alternates: { canonical: 'https://stealthshieldppf.com/faq' },
};

const faqStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is Paint Protection Film (PPF)?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "PPF is a transparent, self-healing urethane film applied to cars and motorcycles to protect against stone chips, scratches, and environmental damage. It provides invisible protection while maintaining your vehicle's original appearance.",
      },
    },
    {
      '@type': 'Question',
      name: 'How does the registration lookup work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Enter your vehicle registration and our system automatically queries official databases to identify your exact make, model, trim level, and manufacturing year. This eliminates manual data entry and ensures accuracy.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I install PPF myself?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'PPF installation requires specific skills, tools, and experience. We strongly recommend professional installation to ensure proper fitment, alignment, and longevity.',
      },
    },
    {
      '@type': 'Question',
      name: 'What if my kit doesn\'t fit correctly?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "If there's a fitment issue due to incorrect cutting, we'll recut the affected pieces at no charge. Proper photo verification prevents this, but we stand behind our accuracy guarantee.",
      },
    },
    {
      '@type': 'Question',
      name: 'How long does PPF last?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Our premium PPF is engineered for 7-10+ years of protection with proper care. It resists yellowing, cracking, and peeling, and features self-healing technology that repairs minor scratches with heat.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does cutting and delivery take?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Once your vehicle is verified, kits are precision-cut within 3-5 business days. UK delivery typically takes 2-3 days. Total time from order to delivery: approximately 5-8 days.',
      },
    },
  ],
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      {children}
    </>
  );
}
