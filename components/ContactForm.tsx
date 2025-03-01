'use client';

import { motion } from 'framer-motion';
import { trackEvent } from '@/utils/analytics';

export default function ContactForm() {
  const handleEmailClick = () => {
    trackEvent('contact_email_click', 'conversion', 'Contact Email Click');
  };

  return (
    <section className="py-16 bg-white" id="contact">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-8">Contact Us</h2>
        <p className="text-gray-600 mb-12 text-lg">
          Have questions about Sick Day Sports Club? We'd love to hear from you. Send us an email and we'll get back to you as soon as possible.
        </p>

        <motion.a
          href="mailto:info@sickdaysports.club?subject=Question about Sick Day Sports Club"
          onClick={handleEmailClick}
          className="inline-flex items-center px-8 py-3 rounded-md text-white font-semibold bg-[#4a7729] hover:bg-[#3d6222] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4a7729]"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Email Us
        </motion.a>

        <div className="mt-8 text-gray-500">
          <p>Our team typically responds within 24 hours during business days.</p>
        </div>
      </div>
    </section>
  );
} 