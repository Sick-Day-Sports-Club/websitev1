'use client';

import React, { useEffect } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import GoogleAnalytics from '../components/GoogleAnalytics';
import CookieConsent from '../components/CookieConsent';
import BackToTop from '../components/BackToTop';
import SkipToContent from '../components/SkipToContent';
import ReCaptchaProvider from '../components/ReCaptchaProvider';
import { initScrollDepthTracking } from '../utils/analytics';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
        <ReCaptchaProvider>
          {children}
        </ReCaptchaProvider>
        <CookieConsent />
        <BackToTop />
      </body>
    </html>
  );
} 