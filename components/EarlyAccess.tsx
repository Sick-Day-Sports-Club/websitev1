'use client';

import { useState, useEffect } from 'react';
import { trackWaitlistSubmission } from '@/utils/analytics';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
}

const LAUNCH_DATE = new Date('2024-03-27T09:00:00-07:00'); // 9 AM PDT on March 27th

export default function EarlyAccess() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = LAUNCH_DATE.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        });
      } else {
        // If we're past the launch date, show zeros
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
      }
    };

    // Calculate immediately and then every minute
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000);

    return () => clearInterval(timer);
  }, []);

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
    <section className="py-20 bg-[#4a7729] text-white text-center" id="signup">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl mb-5">Join Our Waitlist</h2>
        <p className="text-xl max-w-[700px] mx-auto mb-8">
          Be among the first to know when we launch in your area.
        </p>
        
        {/* Countdown timer */}
        <div className="mb-8 bg-white/10 p-6 rounded-lg max-w-md mx-auto">
          <p className="font-bold mb-4">Launching in Bend March 27!</p>
          <div className="flex justify-center gap-12 mb-4">
            <div className="text-center">
              <div className="text-5xl font-bold">{timeLeft.days}</div>
              <div className="text-sm uppercase tracking-wide">Days</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold">{timeLeft.hours}</div>
              <div className="text-sm uppercase tracking-wide">Hours</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold">{timeLeft.minutes}</div>
              <div className="text-sm uppercase tracking-wide">Minutes</div>
            </div>
          </div>
        </div>
        
        {/* Waitlist form */}
        <form onSubmit={handleSubmit} className="flex max-w-md mx-auto">
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
    </section>
  );
} 