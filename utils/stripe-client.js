'use client';

import { loadStripe } from '@stripe/stripe-js';

// Fallback key for development only - NEVER use in production
const FALLBACK_KEY = process.env.NODE_ENV === 'development' 
  ? 'pk_test_51Q4lGEKOdg5wedYdr7mBGug4P1J24uqyWM0IotNenW2gvSdWzjiS9XjsiTjt9oCEYEqwKVVsMisHI3ZfypPguBcD00vFOjAK6h' 
  : '';

// Function to get the Stripe publishable key from various sources
export function getStripeKey() {
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
  
  // Use fallback key in development only
  if (process.env.NODE_ENV === 'development' && FALLBACK_KEY) {
    console.log('Using fallback Stripe key (development only)');
    return FALLBACK_KEY;
  }
  
  console.error('No valid Stripe publishable key found');
  return '';
}

// Initialize Stripe with better error handling
let stripePromise = null;

export function getStripePromise() {
  if (stripePromise !== null) {
    return stripePromise;
  }
  
  if (typeof window === 'undefined') {
    return null;
  }
  
  const stripeKey = getStripeKey();
  
  if (!stripeKey) {
    console.error('Stripe publishable key is not defined');
    return null;
  }
  
  try {
    stripePromise = loadStripe(stripeKey);
    stripePromise.catch(error => {
      console.error('Error loading Stripe:', error);
      stripePromise = null;
    });
    return stripePromise;
  } catch (error) {
    console.error('Exception during Stripe initialization:', error);
    return null;
  }
} 