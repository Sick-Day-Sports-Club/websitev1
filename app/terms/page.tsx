import React from 'react';
import Container from '../../components/Container';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Breadcrumbs from '../../components/Breadcrumbs';
import type { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Terms of Service | Sick Day Sports Club',
  description: 'Terms of service and user agreement for Sick Day Sports Club',
  openGraph: {
    title: 'Terms of Service | Sick Day Sports Club',
    description: 'Terms of service and user agreement for Sick Day Sports Club',
    url: 'https://sickdaysportsclub.com/terms'
  }
};

const breadcrumbItems = [
  { label: 'Home', href: '/', current: false },
  { label: 'Terms of Service', href: '/terms', current: true }
];

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

  return (
    <>
      <Script
        id="terms-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="py-12">
        <Container>
          <Breadcrumbs items={breadcrumbItems} />
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          <p className="text-gray-600 mb-8">Last Updated: March 4, 2025</p>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p className="mb-4">
                Welcome to Sick Day Sports Club ("SDSC," "we," "our," or "us"). By accessing our website at <a href="https://sickdaysports.club" className="text-[#4a7729] hover:text-[#3d6222]">sickdaysports.club</a> and using our services, you agree to these Terms of Service ("Terms"). Please read these Terms carefully before using our platform.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">2. Service Description</h2>
              <p className="mb-4">
                Sick Day Sports Club is a platform that connects users with local outdoor adventure guides for short experiences. We facilitate connections between users and independent guides but are not responsible for the actual delivery of guide services. Our primary role is to:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Match users with appropriate guides based on preferences</li>
                <li>Facilitate bookings and scheduling</li>
                <li>Process payments</li>
                <li>Provide a communication platform between users and guides</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">3.1 Account Creation</h3>
                <p>To use our services, you must create an account and provide accurate, complete information. You are responsible for maintaining the confidentiality of your account credentials.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">3.2 Account Requirements</h3>
                <p>You must be at least 18 years old to create an account. By creating an account, you confirm that you are of legal age and have the capacity to enter into a legally binding agreement.</p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">4. Booking and Payment</h2>
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">4.1 Booking Process</h3>
                <p>All adventure bookings are subject to guide availability, weather conditions, and other factors. Once a booking is confirmed, you will receive confirmation via email.</p>
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">4.2 Payments</h3>
                <p>All payments are processed through our platform. We accept major credit cards and other payment methods as specified on our website. Prices are inclusive of our service fees but may not include additional costs such as equipment rental, park fees, or transportation.</p>
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">4.3 Cancellation Policy</h3>
                <p className="mb-4">Our standard cancellation policy allows for:</p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Full refund if cancelled 48 hours before the scheduled adventure</li>
                  <li>50% refund if cancelled between 24-48 hours before the scheduled adventure</li>
                  <li>No refund if cancelled less than 24 hours before the scheduled adventure</li>
                </ul>
                <p>However, specific guides may have their own cancellation policies, which will be clearly communicated at the time of booking.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">4.4 Weather and Force Majeure</h3>
                <p>In case of dangerous weather conditions or other circumstances beyond our control, adventures may be rescheduled or refunded at the discretion of the guide and SDSC.</p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">5. User Responsibilities</h2>
              <p className="mb-4">As a user of our platform, you agree to:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Provide accurate information about your skill level, experience, and health conditions</li>
                <li>Arrive on time for scheduled adventures</li>
                <li>Follow all instructions provided by guides</li>
                <li>Respect local regulations and environmental guidelines</li>
                <li>Treat guides and other participants with respect</li>
                <li>Not attend adventures while under the influence of alcohol or drugs</li>
                <li>Bring required personal equipment as specified in the adventure description</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">6. Safety and Risk Acknowledgment</h2>
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">6.1 Inherent Risks</h3>
                <p className="mb-4 font-bold">OUTDOOR ACTIVITIES INVOLVE SIGNIFICANT INHERENT RISKS INCLUDING SERIOUS INJURY OR DEATH.</p>
                <p className="mb-4">These risks may include but are not limited to: adverse weather conditions, equipment failure, natural hazards (falling rocks, avalanches, lightning, etc.), wildlife encounters, and physical exertion.</p>
                <p className="mb-4 font-bold">BY USING OUR SERVICE, YOU EXPLICITLY ACKNOWLEDGE, UNDERSTAND, AND ACCEPT THESE RISKS.</p>
                <p className="mb-4">You voluntarily choose to participate in activities with full knowledge of the dangers involved.</p>
                <p className="mb-4">Users are solely responsible for:</p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Accurately assessing their own physical capabilities and limitations</li>
                  <li>Providing truthful information about medical conditions</li>
                  <li>Using appropriate safety equipment as directed</li>
                  <li>Following all guide instructions and safety protocols</li>
                  <li>Having appropriate personal insurance coverage for outdoor activities</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">6.2 Liability Waiver</h3>
                <p>Before participating in any adventure, users will be required to sign a liability waiver. This waiver releases SDSC, the guide, and related parties from liability for injuries, damages, or losses resulting from participation in the activity, except in cases of gross negligence or willful misconduct.</p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">7. Guide Relationships and Responsibilities</h2>
              <p className="mb-4 font-bold">GUIDES LISTED ON OUR PLATFORM ARE INDEPENDENT CONTRACTORS AND NOT EMPLOYEES OF SICK DAY SPORTS CLUB.</p>
              <p className="mb-4">We do not control their day-to-day operations, schedules, or specific service delivery methods. SDSC is solely a platform connecting independent guides with users seeking outdoor experiences.</p>
              <p className="mb-4">As independent contractors, guides are responsible for their own taxes, insurance, licenses, and compliance with all applicable regulations. SDSC does not provide worker's compensation, health benefits, or other employee benefits to guides.</p>
              <p className="mb-4">Despite this independent relationship, all guides on our platform are required to:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Maintain current certifications relevant to their activities</li>
                <li>Carry appropriate insurance</li>
                <li>Provide safe, high-quality experiences</li>
                <li>Accurately represent their qualifications and experience</li>
                <li>Adhere to all local regulations and best practices</li>
                <li>Carry basic first aid equipment and be trained in emergency procedures</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">8. Intellectual Property</h2>
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">8.1 Our Content</h3>
                <p>All content on the SDSC platform, including but not limited to text, graphics, logos, images, and software, is the property of SDSC or its content suppliers and is protected by copyright and other intellectual property laws.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">8.2 User Content</h3>
                <p>By posting content (including reviews, photos, or comments) on our platform, you grant SDSC a non-exclusive, royalty-free, perpetual, and worldwide license to use, modify, reproduce, and distribute such content for promotional purposes.</p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">9. Prohibited Activities</h2>
              <p className="mb-4">You agree not to:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Use our platform for any illegal purpose</li>
                <li>Attempt to gain unauthorized access to any part of our platform</li>
                <li>Use our platform to harass, abuse, or harm another person</li>
                <li>Impersonate any person or entity</li>
                <li>Post false, misleading, or deceptive content</li>
                <li>Interfere with the proper functioning of the platform</li>
                <li>Attempt to circumvent any security measures</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">10. Termination</h2>
              <p>We reserve the right to terminate or suspend your account and access to our services at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users, guides, SDSC, or third parties, or for any other reason.</p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">11. Limitation of Liability</h2>
              <p className="mb-4">You expressly understand and agree that participation in outdoor adventure activities carries inherent risks that cannot be eliminated regardless of the care taken by guides or SDSC.</p>
              <p className="mb-4">To the maximum extent permitted by law, SDSC SHALL NOT BE LIABLE for any injuries, damages, or losses arising from the inherent risks of outdoor activities. Additionally, SDSC shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Your use or inability to use our services</li>
                <li>Any conduct or content of any third party on the platform</li>
                <li>Unauthorized access, use, or alteration of your content or transmissions</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">12. Indemnification</h2>
              <p>You agree to indemnify, defend, and hold harmless SDSC, its officers, directors, employees, and agents, from and against any claims, liabilities, damages, losses, and expenses, including, without limitation, reasonable legal and accounting fees, arising out of or in any way connected with your access to or use of the platform, your violation of these Terms, or your violation of any third-party right.</p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">13. Changes to Terms</h2>
              <p>We may modify these Terms at any time. We will provide notice of any material changes by posting the updated Terms on this page with a new "Last Updated" date. Your continued use of the platform after any such change constitutes your acceptance of the revised Terms.</p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">14. Governing Law</h2>
              <p>These Terms shall be governed by and construed in accordance with the laws of the State of Oregon, without regard to its conflict of law provisions.</p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">15. Dispute Resolution</h2>
              <p>Any dispute arising from or relating to these Terms or your use of our platform shall first be resolved through good-faith negotiation. If such negotiation fails, the dispute shall be resolved through arbitration in Bend, Oregon, in accordance with the rules of the American Arbitration Association.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">16. Contact Information</h2>
              <p className="mb-4">For questions about these Terms, please contact us at:</p>
              <ul className="list-none space-y-2">
                <li>Email: <a href="mailto:info@sickdaysports.club" className="text-[#4a7729] hover:text-[#3d6222]">info@sickdaysports.club</a></li>
                <li>Address: Loveheimer LLC dba Sick Day Sports Club, 4949 Meadows Rd STE 600, Lake Oswego, OR 97035</li>
              </ul>
            </section>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
} 