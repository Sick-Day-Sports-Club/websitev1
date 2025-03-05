'use client';

import React, { useEffect, useState } from 'react';
import BetaSignupForm from './BetaSignupForm';
import Navbar from './Navbar';
import Footer from './Footer';

export default function BetaSignupPage() {
  const [envVars, setEnvVars] = useState({
    stripeKey: '',
    supabaseUrl: '',
    supabaseKey: ''
  });
  
  useEffect(() => {
    // Always log environment variables to help with debugging
    console.log('Client-side environment variables check:');
    const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'Not set';
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'Not set';
    
    console.log('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:', stripeKey);
    console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl);
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseKey);
    
    setEnvVars({
      stripeKey: stripeKey === 'Not set' ? 'Not set' : 'Set (hidden for security)',
      supabaseUrl: supabaseUrl === 'Not set' ? 'Not set' : 'Set (hidden for security)',
      supabaseKey: supabaseKey === 'Not set' ? 'Not set' : 'Set (hidden for security)'
    });
  }, []);

  return (
    <>
      <Navbar />
      <main className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Join the Club</h1>
            <p className="text-xl text-gray-600">
              Sign up early to get founding member pricing and be among the first to experience Sick Day Sports Club.
            </p>
          </div>
          
          {/* Debug section - only visible in development or with query param */}
          {(process.env.NODE_ENV === 'development' || 
            (typeof window !== 'undefined' && window.location.search.includes('debug=true'))) && (
            <div className="mb-8 p-4 border border-red-300 bg-red-50 rounded-md">
              <h3 className="font-bold text-red-700">Environment Debug Info:</h3>
              <ul className="text-sm">
                <li>Stripe Key: {envVars.stripeKey}</li>
                <li>Supabase URL: {envVars.supabaseUrl}</li>
                <li>Supabase Key: {envVars.supabaseKey}</li>
              </ul>
              <p className="text-xs mt-2 text-gray-500">
                This debug info is only visible in development mode or with ?debug=true in the URL
              </p>
            </div>
          )}
          
          <BetaSignupForm />
        </div>
      </main>
      <Footer />
    </>
  );
} 