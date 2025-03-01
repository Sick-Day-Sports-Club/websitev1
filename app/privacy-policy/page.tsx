import Container from '@/components/Container';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import type { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Privacy Policy | Sick Day Sports Club',
  description: 'Learn how Sick Day Sports Club collects, uses, and protects your personal information.',
};

export default function PrivacyPolicy() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Privacy Policy',
    description: 'Learn how Sick Day Sports Club collects, uses, and protects your personal information.',
    publisher: {
      '@type': 'Organization',
      name: 'Sick Day Sports Club',
      url: 'https://sickdaysports.club'
    },
    dateModified: '2024-02-28',
  };

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Privacy Policy', href: '/privacy-policy', current: true },
  ];

  return (
    <>
      <Script
        id="privacy-policy-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="py-16 bg-white min-h-[calc(100vh-80px)]" id="main-content">
        <Container>
          <Breadcrumbs items={breadcrumbItems} />
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
              <p className="mb-4">
                At Sick Day Sports Club, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information when you use our website.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
              <p className="mb-4">We collect the following types of information:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Email addresses when you join our waitlist</li>
                <li>Usage data through Google Analytics</li>
                <li>Cookie preferences</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">How We Use Cookies</h2>
              <p className="mb-4">
                We use cookies to analyze site traffic and improve your experience. Specifically:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Google Analytics cookies to understand how visitors use our site</li>
                <li>Functional cookies to remember your preferences</li>
                <li>Essential cookies necessary for the website to function properly</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
              <p className="mb-4">We use your information to:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Send you updates about our launch</li>
                <li>Improve our website and services</li>
                <li>Analyze site traffic and usage patterns</li>
                <li>Communicate important updates</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Data Protection</h2>
              <p className="mb-4">
                We implement appropriate security measures to protect your personal information. Your email address is stored securely in our database and is only used for the purposes stated above.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
              <p className="mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Access your personal information</li>
                <li>Request deletion of your information</li>
                <li>Opt-out of marketing communications</li>
                <li>Manage your cookie preferences</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p className="mb-4">
                If you have any questions about our Privacy Policy or how we handle your data, please contact us at{' '}
                <a href="mailto:info@sickdaysports.club" className="text-[#4a7729] hover:underline">
                  info@sickdaysports.club
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Updates to This Policy</h2>
              <p className="mb-4">
                We may update this Privacy Policy from time to time. The latest version will always be posted on this page.
              </p>
              <p className="text-sm text-gray-600">
                Last updated: February 28, 2024
              </p>
            </section>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
} 