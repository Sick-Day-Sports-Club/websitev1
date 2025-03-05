'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

// Component that uses useSearchParams
function ConfirmationContent() {
  const [status, setStatus] = useState<'success' | 'processing' | 'error'>('processing');
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const setupIntent = searchParams.get('setup_intent');
    const setupIntentClientSecret = searchParams.get('setup_intent_client_secret');
    
    if (setupIntent) {
      // Verify the setup status on the server
      fetch(`/api/verify-payment?setup_intent=${setupIntent}`)
        .then(res => res.json())
        .then(data => {
          setStatus(data.status === 'succeeded' ? 'success' : 'error');
        })
        .catch(() => setStatus('error'));
    }
  }, [searchParams]);

  return (
    <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
      {status === 'processing' && (
        <>
          <div className="flex justify-center mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
          <h1 className="text-xl font-bold text-center mb-2">Processing</h1>
          <p className="text-gray-600 text-center">Please wait while we confirm your payment method...</p>
        </>
      )}

      {status === 'success' && (
        <>
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h1 className="text-xl font-bold text-center mb-2">Payment Method Saved!</h1>
          <p className="text-gray-600 text-center mb-2">Your card has been securely saved for the beta program deposit.</p>
          <p className="text-gray-600 text-center mb-6">We'll notify you before processing the payment when we launch.</p>
          <div className="text-center">
            <Link 
              href="/"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Return Home
            </Link>
          </div>
        </>
      )}

      {status === 'error' && (
        <>
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          <h1 className="text-xl font-bold text-center mb-2">Setup Failed</h1>
          <p className="text-gray-600 text-center mb-6">There was an issue saving your payment method. Please try again.</p>
          <div className="text-center">
            <Link 
              href="/"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

// Main page component with Suspense boundary
export default function ConfirmationPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Suspense fallback={
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-center mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
          <h1 className="text-xl font-bold text-center mb-2">Loading...</h1>
          <p className="text-gray-600 text-center">Please wait while we load your confirmation details...</p>
        </div>
      }>
        <ConfirmationContent />
      </Suspense>
    </div>
  );
} 