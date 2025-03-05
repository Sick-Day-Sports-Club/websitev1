'use client';

import React, { useEffect } from 'react';
import BetaSignupForm from './BetaSignupForm';
import Navbar from './Navbar';
import Footer from './Footer';

export default function BetaSignupPage() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Client-side environment variables check:');
      console.log('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:', process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'Not set');
      console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set');
      console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'Not set');
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
          
          <BetaSignupForm />
        </div>
      </main>
      <Footer />
    </>
  );
} 