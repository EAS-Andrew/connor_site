import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { CookieConsent } from '@/components/CookieConsent';
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://stealthshieldppf.com"),
  title: "StealthShield | Premium Paint Protection Film",
  description:
    "Precision-cut paint protection film for cars and motorcycles. Enter your registration for instant pricing. Free fitting kit with every pre-cut order. UK-based with fast delivery.",
  alternates: {
    canonical: "https://stealthshieldppf.com",
  },
  openGraph: {
    title: "StealthShield | Premium Paint Protection Film",
    description:
      "Precision-cut PPF for cars and motorcycles. Free fitting kit included. UK-based with 2-3 day delivery.",
    siteName: "StealthShield",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "StealthShield | Premium Paint Protection Film",
    description:
      "Precision-cut PPF for cars and motorcycles. Free fitting kit included. UK-based with 2-3 day delivery.",
  },
};

export const viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'StealthShield',
    url: 'https://stealthshieldppf.com',
    logo: 'https://stealthshieldppf.com/logo.svg',
    email: 'info@stealthshieldppf.com',
    description: 'Precision-cut paint protection film for cars and motorcycles. UK-based with fast delivery.',
    areaServed: 'GB',
    sameAs: [],
  };

  return (
    <html lang="en" className="dark">
      <body
        className={`${sora.variable} ${inter.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {children}
        <Analytics />
        <SpeedInsights />
        <CookieConsent />
      </body>
    </html>
  );
}
