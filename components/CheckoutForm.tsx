import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';

interface CheckoutFormProps {
  amount: number;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  couponCode?: string;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ amount, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Form submission started');

    if (!stripe || !elements) {
      console.error('Stripe or Elements not initialized');
      setErrorMessage('Payment system not fully loaded. Please try again.');
      return;
    }

    setIsProcessing(true);
    console.log('Processing payment...');

    try {
      console.log('Confirming setup with Stripe...');
      const result = await stripe.confirmSetup({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/confirmation`,
        },
      });
      
      console.log('Stripe confirmation result:', JSON.stringify(result));

      if (result.error) {
        console.error('Stripe error:', result.error);
        setErrorMessage(result.error.message || 'Payment setup failed');
        if (result.error.message) {
          onError?.(result.error.message);
        } else {
          onError?.('Payment setup failed');
        }
      } else {
        console.log('Payment setup successful');
        onSuccess?.();
      }
    } catch (err: any) {
      console.error('Exception during payment processing:', err);
      const errorMsg = err.message || 'An unexpected error occurred.';
      setErrorMessage(errorMsg);
      onError?.(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <PaymentElement />
      
      {errorMessage && (
        <div className="text-red-600 mt-4 text-sm">
          {errorMessage}
        </div>
      )}
      
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full mt-6 bg-[#4a7729] text-white py-3 px-6 rounded-lg font-medium 
                 hover:bg-opacity-90 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isProcessing ? 'Processing...' : 'Save Card'}
      </button>
      
      <p className="mt-4 text-sm text-gray-600 text-center">
        Your card information is securely processed by Stripe.
      </p>
    </form>
  );
};

export default CheckoutForm; 