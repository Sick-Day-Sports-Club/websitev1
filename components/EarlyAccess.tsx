'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

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
          setMessage("You're already on our waitlist!");
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
      <div className="container">
        <h2 className="text-4xl mb-5">Get Early Access</h2>
        <p className="text-xl max-w-[700px] mx-auto mb-8">
          Be among the first to try Sick Day Sports Club when we launch. Enter your email below for early access or the waitlist and start banking those wellness days.
        </p>
        
        {/* Countdown timer */}
        <div className="mb-8 bg-white/10 p-4 rounded max-w-md mx-auto">
          <p className="text-center mb-1"><strong>Weekend is too far away!</strong></p>
          <div className="flex justify-center gap-4">
            <div className="text-center">
              <div className="text-4xl font-bold">3</div>
              <div>Days</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold">7</div>
              <div>Hours</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold">42</div>
              <div>Minutes</div>
            </div>
          </div>
          <p className="text-center mt-3 italic">Why wait? Take a sick day!</p>
        </div>
        
        {/* Signup form */}
        <div className="flex justify-center">
          <form onSubmit={handleSubmit} className="flex w-full max-w-md">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 p-4 border-none rounded-l-md text-black min-w-0"
              required
              disabled={isLoading}
            />
            <button
              type="submit"
              className="p-4 bg-[#2c2c2c] text-white font-semibold rounded-r-md hover:bg-[#1a1a1a] transition-colors whitespace-nowrap"
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Join Waitlist'}
            </button>
          </form>
        </div>
        
        {/* Form message */}
        {message && (
          <div 
            className={`mt-4 font-bold ${
              messageType === 'success' ? 'text-white' : 
              messageType === 'error' ? 'text-red-200' :
              'text-blue-200'
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </section>
  );
} 