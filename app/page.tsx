import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ValueProp from '../components/ValueProp';
import HowItWorks from '../components/HowItWorks';
import CtaSection from '../components/CtaSection';
import Testimonials from '../components/Testimonials';
import AdventurePrescriptions from '../components/AdventurePrescriptions';
import Footer from '../components/Footer';
import FAQ from '../components/FAQ';
import ContactForm from '../components/ContactForm';
import LogoScroll from '../components/LogoScroll';

export const metadata = {
  title: 'Connect with Local Outdoor Guides & Adventure Groups | Sick Day Sports Club',
  description: 'Access local expertise and join adventure groups for outdoor activities. Connect with experienced guides who know the best spots for hiking, climbing, skiing, and more.',
  keywords: 'local guides, outdoor expertise, adventure groups, outdoor community, expert guides, local knowledge, outdoor activities',
}

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <ValueProp />
      <HowItWorks />
      <CtaSection />
      <Testimonials />
      <LogoScroll />
      <AdventurePrescriptions />
      <FAQ />
      <ContactForm />
      <Footer />
    </main>
  );
}
