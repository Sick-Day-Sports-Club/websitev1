'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Stripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { useRouter } from 'next/navigation';
import CheckoutForm from './CheckoutForm';
import { getStripePromise } from '../utils/stripe-client';

// Add type declaration for window.STRIPE_PUBLISHABLE_KEY
declare global {
  interface Window {
    STRIPE_PUBLISHABLE_KEY?: string;
  }
}

// Types
interface PaymentFormProps {
  amount: number;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  couponCode?: string;
}

interface DiscountInfo {
  isValid: boolean;
  discountAmount?: number;
}

interface SetupIntentResponse {
  clientSecret: string;
  error?: string;
}

// Discount Display Component
const DiscountDisplay: React.FC<{ amount: number; discountedAmount: number | null }> = ({ amount, discountedAmount }) => {
  if (!discountedAmount) {
    return (
      <p className="text-sm">
        Your card will be securely saved now and charged ${amount.toFixed(2)} when we launch. 
        You can cancel anytime before the launch date.
      </p>
    );
  }

  return (
    <div>
      <p className="text-sm mb-2">
        Referral discount applied! 🎉
      </p>
      <p className="text-sm">
        <span className="line-through">${amount.toFixed(2)}</span>
        {' → '}
        <span className="font-bold">${discountedAmount.toFixed(2)}</span>
      </p>
    </div>
  );
};

// Main PaymentForm Component
const PaymentForm: React.FC<PaymentFormProps> = (props) => {
  const [clientSecret, setClientSecret] = useState<string>();
  const [error, setError] = useState<string>();
  const [isStripeReady, setIsStripeReady] = useState<boolean>(false);
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);
  const [isMockSecret, setIsMockSecret] = useState<boolean>(false);
  
  // Initialize Stripe
  useEffect(() => {
    const initStripe = async () => {
      try {
        console.log('Initializing Stripe in PaymentForm...');
        const promise = getStripePromise();
        setStripePromise(promise);
        setIsStripeReady(!!promise);
        
        if (!promise) {
          console.error('Failed to get Stripe promise');
        } else {
          console.log('Stripe promise obtained successfully');
        }
      } catch (error) {
        console.error('Error initializing Stripe:', error);
        setError('Failed to initialize payment system');
      }
    };
    
    initStripe();
  }, []);

  useEffect(() => {
    // Create SetupIntent when component mounts and Stripe is ready
    const createSetupIntent = async () => {
      if (!isStripeReady) {
        console.log('Stripe not ready yet, skipping setup intent creation');
        return;
      }
      
      console.log('Creating setup intent...');
      
      try {
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            amount: props.amount,
            couponCode: props.couponCode,
            forceReal: true // Add this flag to force real implementation
          }),
        });

        console.log('Setup intent API response status:', response.status);

        if (!response.ok) {
          console.error('API response not OK:', response.status);
          throw new Error('Failed to create payment intent');
        }

        const data: SetupIntentResponse = await response.json();
        console.log('Setup intent API response:', data);
        
        if (data.error) {
          console.error('Error in API response:', data.error);
          throw new Error(data.error);
        }
        
        // Check if we got a mock client secret (from the build process)
        if (data.clientSecret === 'mock_client_secret_for_build_process') {
          console.log('Detected mock client secret - API is in mock mode');
          console.log('Attempting to force real implementation...');
          
          // Try again with a different approach
          const retryResponse = await fetch('/api/create-payment-intent', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Force-Real': 'true' // Add a custom header to force real implementation
            },
            body: JSON.stringify({ 
              amount: props.amount,
              couponCode: props.couponCode,
              forceReal: true,
              timestamp: new Date().toISOString()
            }),
          });
          
          if (!retryResponse.ok) {
            console.error('Retry API response not OK:', retryResponse.status);
            setIsMockSecret(true);
            return;
          }
          
          const retryData = await retryResponse.json();
          
          if (retryData.clientSecret === 'mock_client_secret_for_build_process') {
            console.log('Still getting mock client secret after retry, showing mock mode message');
            setIsMockSecret(true);
            return;
          }
          
          console.log('Successfully got real client secret on retry');
          setClientSecret(retryData.clientSecret);
          return;
        }
        
        // Validate that the client secret looks like a real Stripe secret
        if (!data.clientSecret || !data.clientSecret.includes('_secret_')) {
          console.error('Invalid client secret format:', data.clientSecret);
          setError('Invalid client secret received from server');
          return;
        }
        
        console.log('Valid client secret received, length:', data.clientSecret.length);
        setClientSecret(data.clientSecret);
      } catch (err) {
        console.error('Error creating setup intent:', err);
        setError('Failed to initialize payment form');
      }
    };

    createSetupIntent();
  }, [props.amount, props.couponCode, isStripeReady]);

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  if (isMockSecret) {
    return (
      <div className="p-4 border border-yellow-300 bg-yellow-50 rounded-md">
        <h3 className="font-bold text-yellow-700 mb-2">Demo Mode</h3>
        <p className="text-yellow-700 mb-2">
          The payment system is currently in demo mode. In a real deployment, this would connect to Stripe for payment processing.
        </p>
        <p className="text-sm text-yellow-600 mb-3">
          For now, please use the free tier option or contact support for assistance.
        </p>
        
        {/* Debug button - only visible in development */}
        {process.env.NODE_ENV !== 'production' && (
          <button 
            className="mt-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-xs"
            onClick={async () => {
              try {
                console.log('Checking server environment variables...');
                const response = await fetch('/api/debug-env', {
                  headers: {
                    'x-debug-auth': 'sickday-debug-2024'
                  }
                });
                const data = await response.json();
                console.log('Server environment:', data);
                
                // Also check client environment
                console.log('Client environment:');
                console.log('- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:', process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'not set');
                console.log('- window.STRIPE_PUBLISHABLE_KEY:', typeof window !== 'undefined' ? window.STRIPE_PUBLISHABLE_KEY || 'not set' : 'N/A');
                
                // Check API response
                console.log('Testing API response...');
                const testResponse = await fetch('/api/create-payment-intent', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ amount: 99 }),
                });
                const testData = await testResponse.json();
                console.log('API response:', testData);
              } catch (error) {
                console.error('Debug error:', error);
              }
            }}
          >
            Debug Environment
          </button>
        )}
      </div>
    );
  }

  if (!isStripeReady) {
    return (
      <div className="p-4 border border-yellow-300 bg-yellow-50 rounded-md">
        <p className="text-yellow-700">Payment system is initializing. Please wait...</p>
        <button 
          className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          onClick={() => {
            const promise = getStripePromise();
            setStripePromise(promise);
            setIsStripeReady(!!promise);
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!clientSecret) {
    return <div>Loading payment form...</div>;
  }

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#4a7729',
      },
    },
  };

  return (
    <div>
      {stripePromise ? (
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm {...props} />
        </Elements>
      ) : (
        <div className="text-red-600 p-4 border border-red-300 bg-red-50 rounded-md">
          <p>Payment system could not be initialized. Please try again later or contact support.</p>
          <p className="text-sm mt-2">Error: Stripe publishable key may be missing or invalid.</p>
          <button 
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={() => {
              const promise = getStripePromise();
              setStripePromise(promise);
              setIsStripeReady(!!promise);
            }}
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentForm; 