// Metadata configuration
import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "./ClientLayout";

// Import the env check utility to run during build
import '../utils/env-check';

export const metadata: Metadata = {
  metadataBase: new URL('https://sickdaysportsclub.com'),
  title: {
    template: '%s | Sick Day Sports Club',
    default: 'Connect with Local Outdoor Guides & Adventure Groups | Sick Day Sports Club',
  },
  description: 'Access local expertise and join adventure groups for outdoor activities. Connect with experienced guides who know the best spots for hiking, climbing, skiing, and more.',
  keywords: 'local guides, outdoor expertise, adventure groups, outdoor community, expert guides, local knowledge, outdoor activities',
  openGraph: {
    title: 'Connect with Local Outdoor Guides & Adventure Groups | Sick Day Sports Club',
    description: 'Access local expertise and join adventure groups for outdoor activities. Connect with experienced guides who know the best spots for hiking, climbing, skiing, and more.',
    url: 'https://sickdaysportsclub.com',
    siteName: 'Sick Day Sports Club',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Local guides sharing outdoor expertise with adventure groups'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Connect with Local Outdoor Guides & Groups',
    description: 'Access local expertise and join adventure groups for outdoor activities',
    images: ['/images/og-image.jpg'],
    creator: '@sickdaysports'
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientLayout>{children}</ClientLayout>;
}
