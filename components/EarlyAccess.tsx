'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Container from './Container';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing environment variables for Supabase configuration');
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false // Since this is just for the waitlist, we don't need to persist the session
  }
});

export default function EarlyAccess() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    const launchDate = new Date('2024-03-15T00:00:00');

    const updateCountdown = () => {
      const now = new Date();
      const difference = launchDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

        setCountdown({ days, hours, minutes });
      } else {
        // If launch date has passed
        setCountdown({ days: 0, hours: 0, minutes: 0 });
      }
    };

    // Update immediately
    updateCountdown();

    // Update every minute
    const interval = setInterval(updateCountdown, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) return;
    
    setIsLoading(true);
    setMessage('');
    
    try {
      console.log('Submitting email:', email);
      console.log('Supabase URL:', supabaseUrl?.substring(0, 10) + '...');
      console.log('Supabase Key exists:', !!supabaseKey);
      
      // Validate Supabase connection
      console.log('Checking Supabase connection...');
      const { error: healthCheckError } = await supabase.from('waitlist').select('count').limit(0);
      if (healthCheckError) {
        console.error('Health check failed:', healthCheckError);
        throw new Error('Unable to connect to the waitlist service');
      }
      console.log('Connection check passed');

      console.log('Attempting to insert email into waitlist...');
      const { error } = await supabase
        .from('waitlist')
        .insert([{ email: email.trim() }]);
      
      if (error) {
        console.error('Supabase error:', error);
        
        // Check if it's a duplicate email error
        if (error.code === '23505') {
          console.log('Duplicate email detected');
          setMessage("You&apos;re already on our waitlist!");
          setMessageType('info');
        } else {
          throw error;
        }
      } else {
        console.log('Submission successful');
        setMessage('Thanks for joining our waitlist!');
        setMessageType('success');
        setEmail('');
      }
    } catch (error) {
      console.error('Error details:', error);
      setMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
      setMessageType('error');
    } finally {
      console.log('Request completed, loading state cleared');
      setIsLoading(false);
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage('');
      }, 3000);
    }
  };

  return (
    <section className="py-20 bg-[#4a7729] text-white text-center" id="signup">
      <Container>
        <h2 className="text-4xl font-bold mb-5">Get Early Access</h2>
        <p className="text-xl max-w-[700px] mx-auto mb-8">
          Be among the first to try the Club when we launch. Enter your email below for early access and start banking those wellness days.
        </p>
        
        {/* Countdown timer */}
        <div className="mb-12 bg-white/10 p-6 rounded-lg max-w-md mx-auto backdrop-blur-sm">
          <p className="text-center mb-2 font-bold text-xl">Launching Soon!</p>
          <div className="flex justify-center gap-6">
            <div className="text-center">
              <div className="text-5xl font-bold">{countdown.days}</div>
              <div className="text-sm uppercase tracking-wide">Days</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold">{countdown.hours}</div>
              <div className="text-sm uppercase tracking-wide">Hours</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold">{countdown.minutes}</div>
              <div className="text-sm uppercase tracking-wide">Minutes</div>
            </div>
          </div>
          <p className="text-center mt-4 italic font-medium">Why wait? Join the waitlist now!</p>
        </div>
        
        {/* Signup form */}
        <div className="flex justify-center">
          <form onSubmit={handleSubmit} className="flex w-full max-w-md relative">
            <div className="absolute -inset-1 bg-white/30 rounded-lg blur"></div>
            <div className="relative flex w-full bg-white rounded-lg p-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-1 p-4 rounded-l-md text-black min-w-0 focus:outline-none focus:ring-2 focus:ring-[#4a7729] placeholder:text-gray-500"
                required
                disabled={isLoading}
              />
              <button
                type="submit"
                className="px-6 py-4 bg-[#2c2c2c] text-white font-semibold rounded-md hover:bg-[#1a1a1a] transition-all duration-300 whitespace-nowrap transform hover:scale-105 shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? 'Submitting...' : 'Join Waitlist'}
              </button>
            </div>
          </form>
        </div>
        
        {/* Form message */}
        {message && (
          <div 
            className={`mt-6 text-lg font-bold ${
              messageType === 'success' ? 'text-white' : 
              messageType === 'error' ? 'text-red-200' :
              'text-blue-200'
            }`}
          >
            {message}
          </div>
        )}
      </Container>
    </section>
  );
} 