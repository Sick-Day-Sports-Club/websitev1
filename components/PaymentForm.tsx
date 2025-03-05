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
      const promise = getStripePromise();
      setStripePromise(promise);
      setIsStripeReady(!!promise);
    };
    
    initStripe();
  }, []);

  useEffect(() => {
    // Create SetupIntent when component mounts and Stripe is ready
    const createSetupIntent = async () => {
      if (!isStripeReady) return;
      
      try {
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            amount: props.amount,
            couponCode: props.couponCode 
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create payment intent');
        }

        const data: SetupIntentResponse = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        
        // Check if we got a mock client secret (from the build process)
        if (data.clientSecret === 'mock_client_secret_for_build_process') {
          console.log('Detected mock client secret - API is in mock mode');
          setIsMockSecret(true);
          return;
        }
        
        // Validate that the client secret looks like a real Stripe secret
        if (!data.clientSecret || !data.clientSecret.includes('_secret_')) {
          console.error('Invalid client secret format:', data.clientSecret);
          setError('Invalid client secret received from server');
          return;
        }
        
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
        <p className="text-sm text-yellow-600">
          For now, please use the free tier option or contact support for assistance.
        </p>
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