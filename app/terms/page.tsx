import Container from '@/components/Container';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import type { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Terms of Service | Sick Day Sports Club',
  description: 'Terms and conditions for using Sick Day Sports Club services.',
};

export default function Terms() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Terms of Service',
    description: 'Terms and conditions for using Sick Day Sports Club services.',
    publisher: {
      '@type': 'Organization',
      name: 'Sick Day Sports Club',
      url: 'https://sickdaysports.club'
    },
    dateModified: '2024-02-28',
  };

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Terms of Service', href: '/terms', current: true },
  ];

  return (
    <>
      <Script
        id="terms-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="py-16 bg-white min-h-[calc(100vh-80px)]" id="main-content">
        <Container>
          <Breadcrumbs items={breadcrumbItems} />
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
              <p className="mb-4">
                Welcome to Sick Day Sports Club. By accessing our website and using our services, you agree to these terms and conditions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Service Description</h2>
              <p className="mb-4">
                Sick Day Sports Club connects users with local outdoor guides for short adventure experiences. We act as a platform to facilitate these connections and are not responsible for the actual delivery of guide services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">User Responsibilities</h2>
              <p className="mb-4">As a user of our platform, you agree to:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Provide accurate and complete information when creating an account</li>
                <li>Maintain the confidentiality of your account credentials</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Respect the rights and privacy of other users and guides</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Safety and Risk Acknowledgment</h2>
              <p className="mb-4">
                Outdoor activities involve inherent risks. By using our service, you acknowledge and accept these risks. Users are responsible for:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Assessing their own physical capabilities</li>
                <li>Using appropriate safety equipment</li>
                <li>Following guide instructions and safety protocols</li>
                <li>Having appropriate insurance coverage</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Booking and Cancellation</h2>
              <p className="mb-4">
                All bookings are subject to guide availability and weather conditions. Cancellation policies may vary by guide and activity type.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Liability Limitations</h2>
              <p className="mb-4">
                While we strive to connect you with qualified guides, Sick Day Sports Club is not liable for:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Injuries or accidents during activities</li>
                <li>Lost or damaged equipment</li>
                <li>Guide-specific disputes</li>
                <li>Weather-related cancellations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Contact</h2>
              <p className="mb-4">
                For questions about these terms, please contact us at{' '}
                <a href="mailto:info@sickdaysports.club" className="text-[#4a7729] hover:underline">
                  info@sickdaysports.club
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Updates to Terms</h2>
              <p className="mb-4">
                We may update these terms from time to time. The latest version will always be posted on this page.
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