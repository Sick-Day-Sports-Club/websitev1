'use client';

import React from 'react';
import BetaSignupForm from './BetaSignupForm';
import Navbar from './Navbar';
import Footer from './Footer';

export default function BetaSignupPage() {
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