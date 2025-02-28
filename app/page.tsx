import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ValueProp from '@/components/ValueProp';
import HowItWorks from '@/components/HowItWorks';
import CtaSection from '@/components/CtaSection';
import Testimonials from '@/components/Testimonials';
import AdventurePrescriptions from '@/components/AdventurePrescriptions';
import EarlyAccess from '@/components/EarlyAccess';
import BackToWorkTips from '@/components/BackToWorkTips';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Sick Day Sports Club | Connect with Local Outdoor Guides',
  description: 'Connect with expert local guides for short but epic adventures in action sports and outdoor activities when you need a break from Zoom.',
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
      <AdventurePrescriptions />
      <EarlyAccess />
      <BackToWorkTips />
      <Footer />
    </main>
  );
}
