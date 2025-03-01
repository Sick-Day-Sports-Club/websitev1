// Metadata configuration
import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "./ClientLayout";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientLayout>{children}</ClientLayout>;
}
