import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import { Analytics } from '@vercel/analytics/next';
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
  title: "StealthShield | Premium Paint Protection Film",
  description:
    "Precision-cut paint protection film for cars and motorcycles. Enter your registration for instant pricing. Free fitting kit with every pre-cut order. UK-based with fast delivery.",
  openGraph: {
    title: "StealthShield | Premium Paint Protection Film",
    description:
      "Precision-cut PPF for cars and motorcycles. Free fitting kit included. UK-based with 2-3 day delivery.",
    siteName: "StealthShield",
    type: "website",
  },
};

export const viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${sora.variable} ${inter.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
