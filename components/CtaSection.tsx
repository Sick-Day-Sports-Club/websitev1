'use client';

import React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { trackCTAClick, trackWaitlistSubmission } from '../utils/analytics';

interface CtaSectionProps {}

const CtaSection: React.FC<CtaSectionProps> = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleCTAClick = (ctaType: 'beta_access' | 'waitlist') => {
    trackCTAClick(ctaType);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitSuccess(false);
    setSubmitError('');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('Waitlist submission failed:', result);
        setSubmitError(result.error || 'Failed to join waitlist');
        throw new Error(result.error || 'Failed to join waitlist');
      }

      console.log('Waitlist submission successful:', result);
      
      if (result.mockData || result.note?.includes('mock')) {
        console.log('Received mock response from waitlist API');
      }
      
      trackWaitlistSubmission(email);
      setEmail('');
      setSubmitSuccess(true);
    } catch (error) {
      console.error('Error submitting to waitlist:', error);
      setSubmitError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-gray-900 text-white py-20" id="launch">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
          We're Launching Soon
        </h2>
        <p className="mt-6 text-lg leading-8 text-gray-300">
          Sick Day Sports Club is launching in Bend, OR soon with plans for other top adventure towns through 2025. Save those sick days and be the first to experience the club.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Link 
            href="/beta-signup" 
            className="bg-[#4a7729] hover:bg-[#3d6222] text-white font-semibold py-3 px-8 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-white border-2 border-[#4a7729] hover:border-[#3d6222]"
            onClick={() => handleCTAClick('beta_access')}
          >
            Join Now
          </Link>
        </div>

        {/* Waitlist explainer */}
        <p className="text-center text-gray-300 mb-8">
          Not ready to join or need more info? Join our email list to stay updated
        </p>

        {/* Success message */}
        {submitSuccess && (
          <div className="max-w-md mx-auto mb-6 p-4 bg-green-600 text-white rounded-md">
            Thanks for joining our email list! We'll keep you updated.
          </div>
        )}

        {/* Error message */}
        {submitError && (
          <div className="max-w-md mx-auto mb-6 p-4 bg-red-600 text-white rounded-md">
            {submitError}
          </div>
        )}

        {/* Waitlist form */}
        <div className="max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-1 p-4 border-none rounded-l-md sm:rounded-r-none rounded-r-md text-black"
                required
                disabled={isLoading}
              />
              <button
                type="submit"
                className="p-4 bg-[#2c2c2c] text-white font-semibold rounded-r-md sm:rounded-l-none rounded-l-md hover:bg-[#1a1a1a] transition-colors mt-2 sm:mt-0"
                disabled={isLoading}
              >
                {isLoading ? 'Submitting...' : 'Get Updates'}
              </button>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="humanCheck"
                required
                className="w-5 h-5 mr-3"
              />
              <label htmlFor="humanCheck" className="text-sm text-gray-300">
                Please check this to prove you're human
              </label>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default CtaSection;
