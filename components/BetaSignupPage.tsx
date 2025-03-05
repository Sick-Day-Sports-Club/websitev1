'use client';

import React, { useEffect, useState } from 'react';
import BetaSignupForm from './BetaSignupForm';
import Navbar from './Navbar';
import Footer from './Footer';
import { getStripeKey } from '../utils/stripe-client';

// Add type declaration for window.STRIPE_PUBLISHABLE_KEY
declare global {
  interface Window {
    STRIPE_PUBLISHABLE_KEY?: string;
  }
}

export default function BetaSignupPage() {
  const [envVars, setEnvVars] = useState({
    stripeKey: '',
    stripeKeyValue: '',
    stripeKeySource: '',
    supabaseUrl: '',
    supabaseKey: '',
    buildTime: '',
    nodeEnv: ''
  });
  const [showDebug, setShowDebug] = useState(true); // Auto-show debug by default
  
  const checkEnvironmentVars = () => {
    // Always log environment variables to help with debugging
    console.log('Client-side environment variables check:');
    const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'Not set';
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'Not set';
    const nodeEnv = process.env.NODE_ENV || 'Not set';
    
    console.log('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:', stripeKey);
    console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl);
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseKey);
    console.log('NODE_ENV:', nodeEnv);
    
    // Get Stripe key from our utility
    const utilityStripeKey = getStripeKey();
    let stripeKeySource = 'Not available';
    
    if (utilityStripeKey) {
      if (utilityStripeKey === stripeKey && stripeKey !== 'Not set') {
        stripeKeySource = 'Environment variable';
      } else if (typeof window !== 'undefined' && window.STRIPE_PUBLISHABLE_KEY === utilityStripeKey) {
        stripeKeySource = 'Window object (injected)';
      } else {
        stripeKeySource = 'Hardcoded fallback';
      }
    }
    
    // Check if Stripe key starts with pk_
    const isStripeKeyValid = utilityStripeKey.startsWith('pk_');
    if (!isStripeKeyValid) {
      console.error('CRITICAL ERROR: Stripe publishable key is invalid or not set correctly. It should start with "pk_"');
    }
    
    // Show a masked version of the key for debugging (first 8 chars)
    const maskedKey = utilityStripeKey 
      ? `${utilityStripeKey.substring(0, 8)}...` 
      : 'Not set';
    
    setEnvVars({
      stripeKey: utilityStripeKey ? (isStripeKeyValid ? 'Valid (starts with pk_)' : 'INVALID (does not start with pk_)') : 'Not set',
      stripeKeyValue: maskedKey,
      stripeKeySource: stripeKeySource,
      supabaseUrl: supabaseUrl === 'Not set' ? 'Not set' : 'Set (hidden for security)',
      supabaseKey: supabaseKey === 'Not set' ? 'Not set' : 'Set (hidden for security)',
      buildTime: new Date().toISOString(),
      nodeEnv: nodeEnv
    });
  };
  
  useEffect(() => {
    checkEnvironmentVars();
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
              <h3 className="font-bold text-red-700">Environment Debug Info (Updated):</h3>
              <ul className="text-sm">
                <li>Stripe Key Status: {envVars.stripeKey}</li>
                <li>Stripe Key Value: {envVars.stripeKeyValue}</li>
                <li>Stripe Key Source: {envVars.stripeKeySource}</li>
                <li>Supabase URL: {envVars.supabaseUrl}</li>
                <li>Supabase Key: {envVars.supabaseKey}</li>
                <li>Node Environment: {envVars.nodeEnv}</li>
                <li>Build Time: {envVars.buildTime}</li>
              </ul>
              
              <div className="mt-4 flex justify-center">
                <button 
                  onClick={checkEnvironmentVars}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Refresh Debug Info
                </button>
              </div>
              
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-300 rounded">
                <p className="text-sm font-bold">Troubleshooting Tips:</p>
                <ul className="text-xs list-disc pl-4 mt-1">
                  <li>The Stripe publishable key should start with "pk_test_" or "pk_live_"</li>
                  <li>If using the secret key (starts with "sk_"), this is incorrect and needs to be changed</li>
                  <li>Check your Vercel environment variables settings</li>
                  <li>Make sure to redeploy after updating environment variables</li>
                  <li>Try clearing your browser cache or using incognito mode</li>
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