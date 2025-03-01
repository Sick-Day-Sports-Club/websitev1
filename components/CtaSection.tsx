'use client';

import Link from 'next/link';
import { trackCTAClick } from '@/utils/analytics';

export default function CtaSection() {
  const handleCTAClick = (ctaType: 'beta_access' | 'waitlist') => {
    trackCTAClick(ctaType);
  };

  return (
    <section className="bg-gray-900 text-white py-20">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">
          We're Launching March 27th
        </h2>
        <p className="text-xl max-w-4xl mx-auto mb-8 text-center">
          Sick Day Sports Club is launching in Bend, OR this spring with plans for other top adventure towns through 2025. Save those sick days and be the first to experience the club.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link 
            href="/beta-signup" 
            className="bg-[#4a7729] hover:bg-[#3d6222] text-white font-semibold py-3 px-8 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-white border-2 border-[#4a7729] hover:border-[#3d6222]"
            onClick={() => handleCTAClick('beta_access')}
          >
            Apply for Beta Access
          </Link>
          <Link 
            href="/waitlist"
            className="bg-transparent hover:bg-white/10 text-white font-semibold py-3 px-8 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-white border-2 border-white"
            onClick={() => handleCTAClick('waitlist')}
          >
            Join Waitlist
          </Link>
        </div>
      </div>
    </section>
  );
}
