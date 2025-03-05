'use client';

import { loadStripe } from '@stripe/stripe-js';

// Hardcoded keys - this is a temporary solution
// Publishable keys are meant to be public, but this should be replaced with proper env vars
const HARDCODED_KEYS = {
  development: 'pk_test_51Q4lGEKOdg5wedYdr7mBGug4P1J24uqyWM0IotNenW2gvSdWzjiS9XjsiTjt9oCEYEqwKVVsMisHI3ZfypPguBcD00vFOjAK6h',
  production: 'pk_test_51Q4lGEKOdg5wedYdr7mBGug4P1J24uqyWM0IotNenW2gvSdWzjiS9XjsiTjt9oCEYEqwKVVsMisHI3ZfypPguBcD00vFOjAK6h'
};

// Function to get the Stripe publishable key from various sources
export function getStripeKey() {
  console.log('Getting Stripe key...');
  
  // Try to get from Next.js environment
  const envKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  
  if (envKey && envKey.startsWith('pk_')) {
    console.log('Using Stripe key from Next.js environment');
    return envKey;
  }
  
  // Try to get from window object (if manually injected)
  if (typeof window !== 'undefined' && window.STRIPE_PUBLISHABLE_KEY && window.STRIPE_PUBLISHABLE_KEY.startsWith('pk_')) {
    console.log('Using Stripe key from window object');
    return window.STRIPE_PUBLISHABLE_KEY;
  }
  
  // Use hardcoded key as last resort
  const nodeEnv = process.env.NODE_ENV || 'development';
  const hardcodedKey = HARDCODED_KEYS[nodeEnv] || HARDCODED_KEYS.development;
  
  if (hardcodedKey) {
    console.log(`Using hardcoded Stripe key for ${nodeEnv} environment (TEMPORARY SOLUTION)`);
    return hardcodedKey;
  }
  
  console.error('No valid Stripe publishable key found');
  return '';
}

// Initialize Stripe with better error handling
let stripePromise = null;

export function getStripePromise() {
  if (stripePromise !== null) {
    console.log('Returning existing Stripe promise');
    return stripePromise;
  }
  
  if (typeof window === 'undefined') {
    console.log('Window not defined, cannot initialize Stripe');
    return null;
  }
  
  const stripeKey = getStripeKey();
  
  if (!stripeKey) {
    console.error('Stripe publishable key is not defined');
    return null;
  }
  
  try {
    console.log('Initializing Stripe with key starting with:', stripeKey.substring(0, 7) + '...');
    
    // Force clear any previous instances
    stripePromise = null;
    
    // Create a new Stripe instance
    stripePromise = loadStripe(stripeKey);
    
    // Add error handling
    stripePromise.catch(error => {
      console.error('Error loading Stripe:', error);
      stripePromise = null;
    });
    
    console.log('Stripe initialization started');
    return stripePromise;
  } catch (error) {
    console.error('Exception during Stripe initialization:', error);
    return null;
  }
} 