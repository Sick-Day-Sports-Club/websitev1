'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { trackCTAClick, trackWaitlistSubmission } from '@/utils/analytics';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
}

// March 27, 2024 at 9:00 AM PDT
const LAUNCH_DATE = new Date(Date.UTC(2024, 2, 27, 16, 0, 0)); // 9 AM PDT = 16:00 UTC

export default function CtaSection() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    function calculateTimeLeft() {
      const now = new Date();
      const difference = LAUNCH_DATE.getTime() - now.getTime();
      console.log('Time difference:', difference);
      console.log('Current time:', now.toISOString());
      console.log('Launch time:', LAUNCH_DATE.toISOString());

      if (difference > 0) {
        // Calculate full days
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        // Calculate remaining hours
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        // Calculate remaining minutes
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

        console.log('Calculated time left:', { days, hours, minutes });
        setTimeLeft({ days, hours, minutes });
      } else {
        console.log('No time left, countdown finished');
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
      }
    }

    // Calculate immediately
    calculateTimeLeft();
    
    // Then update every minute
    const timer = setInterval(calculateTimeLeft, 60000);

    return () => clearInterval(timer);
  }, []);

  const handleCTAClick = (ctaType: 'beta_access' | 'waitlist') => {
    trackCTAClick(ctaType);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Implement actual API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      trackWaitlistSubmission(email);
      setEmail('');
      alert('Thanks for joining our waitlist! We\'ll keep you updated.');
    } catch (error) {
      alert('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-gray-900 text-white py-20" id="launch">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">
          We're Launching March 27th
        </h2>
        <p className="text-xl max-w-4xl mx-auto mb-8 text-center">
          Sick Day Sports Club is launching in Bend, OR this spring with plans for other top adventure towns through 2025. Save those sick days and be the first to experience the club.
        </p>
        
        {/* Countdown timer - always show for now while debugging */}
        <div className="mb-12 bg-white/10 p-6 rounded-lg max-w-2xl mx-auto">
          <p className="font-bold mb-4 text-center">Countdown to Launch</p>
          <div className="flex justify-center gap-12 mb-4">
            <div className="text-center">
              <div className="text-5xl font-bold">{String(timeLeft.days).padStart(2, '0')}</div>
              <div className="text-sm uppercase tracking-wide mt-2">Days</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</div>
              <div className="text-sm uppercase tracking-wide mt-2">Hours</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</div>
              <div className="text-sm uppercase tracking-wide mt-2">Minutes</div>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Link 
            href="/beta-signup" 
            className="bg-[#4a7729] hover:bg-[#3d6222] text-white font-semibold py-3 px-8 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-white border-2 border-[#4a7729] hover:border-[#3d6222]"
            onClick={() => handleCTAClick('beta_access')}
          >
            Apply for Bend Launch
          </Link>
        </div>

        {/* Waitlist explainer */}
        <p className="text-center text-gray-300 mb-8">
          Not ready to join or need more info? Join our waitlist below to stay updated
        </p>

        {/* Waitlist form */}
        <div className="max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="flex">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 p-4 border-none rounded-l-md text-black"
              required
              disabled={isLoading}
            />
            <button
              type="submit"
              className="p-4 bg-[#2c2c2c] text-white font-semibold rounded-r-md hover:bg-[#1a1a1a] transition-colors"
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Join Waitlist'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
