'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../utils/auth-context';

export default function AdminPortal() {
  const { user, isLoading, signIn, signOut, isAdmin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Authentication function using Supabase
  const authenticate = async () => {
    try {
      setAuthError(null);
      const { error } = await signIn(email, password);
      
      if (error) {
        setAuthError('Invalid credentials. Please try again.');
        console.error('Auth error:', error);
      }
    } catch (err) {
      setAuthError('An error occurred during authentication.');
      console.error('Auth error:', err);
    }
  };

  // Logout function
  const handleLogout = () => {
    signOut();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Admin Portal</h1>
        <p className="text-center">Loading...</p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Admin Portal</h1>
        
        {authError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {authError}
          </div>
        )}
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter admin email"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter admin password"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  authenticate();
                }
              }}
            />
          </div>
          <button
            onClick={authenticate}
            className="bg-[#4a7729] hover:bg-[#3d6222] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Sick Day Sports Club Admin Portal</h1>
        <div className="flex items-center space-x-4">
          <p className="text-gray-600">{user.email}</p>
          <button
            onClick={handleLogout}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Waitlist Dashboard Card */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Waitlist Dashboard</h2>
            <p className="text-gray-600 mb-6">
              View and manage all email addresses collected through the waitlist signup form.
            </p>
            <Link 
              href="/admin/waitlist" 
              className="inline-block bg-[#4a7729] hover:bg-[#3d6222] text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
            >
              Access Waitlist
            </Link>
          </div>
        </div>
        
        {/* Email Tracking Dashboard Card */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Email Tracking Dashboard</h2>
            <p className="text-gray-600 mb-6">
              Monitor email opens, clicks, and other engagement metrics for all sent emails.
            </p>
            <Link 
              href="/admin/email-stats" 
              className="inline-block bg-[#4a7729] hover:bg-[#3d6222] text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
            >
              Access Email Stats
            </Link>
          </div>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Admin Tools</h3>
        <p className="text-gray-600 mb-4">
          This portal provides access to administrative tools for managing the Sick Day Sports Club platform.
          Please ensure you have proper authorization before accessing or modifying any data.
        </p>
      </div>
    </div>
  );
} 