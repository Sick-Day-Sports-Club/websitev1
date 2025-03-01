// Metadata configuration
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sick Day Sports Club",
  description: "Turn your sick days into adventure days",
  metadataBase: new URL('https://sickdaysports.club'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://sickdaysports.club',
    siteName: 'Sick Day Sports Club',
    title: 'Sick Day Sports Club',
    description: 'Turn your sick days into adventure days',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Sick Day Sports Club - Adventure Awaits'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sick Day Sports Club',
    description: 'Turn your sick days into adventure days',
    images: ['/images/og-image.jpg'],
    creator: '@sickdaysports'
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
  }
};

'use client';

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { useEffect } from "react";
import GoogleAnalytics from '@/components/GoogleAnalytics';
import CookieConsent from '@/components/CookieConsent';
import BackToTop from '@/components/BackToTop';
import SkipToContent from '@/components/SkipToContent';
import { initScrollDepthTracking } from '@/utils/analytics';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    initScrollDepthTracking();
  }, []);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SkipToContent />
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
        {children}
        <CookieConsent />
        <BackToTop />
      </body>
    </html>
  );
}
