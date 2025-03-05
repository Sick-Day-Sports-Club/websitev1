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
    default: 'Sick Day Sports Club | Book Outdoor Adventures',
  },
  description: 'Book outdoor adventures with local guides and outfitters.',
  openGraph: {
    title: 'Sick Day Sports Club | Book Outdoor Adventures',
    description: 'Book outdoor adventures with local guides and outfitters.',
    url: 'https://sickdaysportsclub.com',
    siteName: 'Sick Day Sports Club',
    locale: 'en_US',
    type: 'website',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientLayout>{children}</ClientLayout>;
}
