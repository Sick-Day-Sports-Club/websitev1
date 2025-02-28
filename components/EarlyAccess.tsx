'use client';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

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
      const { error } = await supabase
        .from('waitlist')
        .insert([{ email: email.trim() }]);
      
      if (error) {
        // Check if it's a duplicate email error
        if (error.code === '23505') {
          setMessage("You're already on our waitlist!");
          setMessageType('info');
        } else {
          throw error;
        }
      } else {
        setMessage('Thanks for joining our waitlist!');
        setMessageType('success');
        setEmail('');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Something went wrong. Please try again.');
      setMessageType('error');
    } finally {
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