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
  const [showDebug, setShowDebug] = useState(false);
  
  useEffect(() => {
    // Always log environment variables to help with debugging
    console.log('Client-side environment variables check:');
    const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'Not set';
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'Not set';
    
    console.log('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:', stripeKey);
    console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl);
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseKey);
    
    // Check if Stripe key starts with pk_
    const isStripeKeyValid = stripeKey.startsWith('pk_');
    if (!isStripeKeyValid) {
      console.error('CRITICAL ERROR: Stripe publishable key is invalid or not set correctly. It should start with "pk_"');
    }
    
    setEnvVars({
      stripeKey: stripeKey === 'Not set' ? 'Not set' : (isStripeKeyValid ? 'Valid (starts with pk_)' : 'INVALID (does not start with pk_)'),
      supabaseUrl: supabaseUrl === 'Not set' ? 'Not set' : 'Set (hidden for security)',
      supabaseKey: supabaseKey === 'Not set' ? 'Not set' : 'Set (hidden for security)'
    });
    
    // Auto-show debug if there's an issue with the Stripe key
    if (!isStripeKeyValid) {
      setShowDebug(true);
    }
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
          
          {/* Debug toggle button */}
          <div className="mb-4 text-center">
            <button 
              onClick={() => setShowDebug(!showDebug)}
              className="text-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
            >
              {showDebug ? 'Hide Debug Info' : 'Show Debug Info'}
            </button>
          </div>
          
          {/* Debug section */}
          {showDebug && (
            <div className="mb-8 p-4 border border-red-300 bg-red-50 rounded-md">
              <h3 className="font-bold text-red-700">Environment Debug Info:</h3>
              <ul className="text-sm">
                <li>Stripe Key: {envVars.stripeKey}</li>
                <li>Supabase URL: {envVars.supabaseUrl}</li>
                <li>Supabase Key: {envVars.supabaseKey}</li>
              </ul>
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-300 rounded">
                <p className="text-sm font-bold">Troubleshooting Tips:</p>
                <ul className="text-xs list-disc pl-4 mt-1">
                  <li>The Stripe publishable key should start with "pk_test_" or "pk_live_"</li>
                  <li>If using the secret key (starts with "sk_"), this is incorrect and needs to be changed</li>
                  <li>Check your Vercel environment variables settings</li>
                </ul>
              </div>
            </div>
          )}
          
          <BetaSignupForm />
        </div>
      </main>
      <Footer />
    </>
  );
} 