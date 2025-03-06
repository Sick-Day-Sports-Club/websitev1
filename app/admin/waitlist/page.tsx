'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

interface WaitlistEntry {
  id: string;
  email: string;
  created_at: string;
}

export default function WaitlistAdmin() {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Simple authentication function
  const authenticate = () => {
    // This is a simple authentication mechanism
    // In a real-world scenario, you would use a more secure method
    const adminPassword = 'sickdaysportsclub2024'; // You should change this to a strong password
    
    if (password === adminPassword) {
      setIsAuthenticated(true);
      setAuthError(null);
      localStorage.setItem('waitlistAdminAuth', 'true');
    } else {
      setAuthError('Invalid password. Please try again.');
    }
  };

  useEffect(() => {
    // Check if already authenticated
    if (localStorage.getItem('waitlistAdminAuth') === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    async function fetchWaitlist() {
      try {
        setLoading(true);
        
        // Create a Supabase client with the service role key
        // Note: This is safe because this code runs on the client but the service role key
        // is only used in the API route on the server
        const response = await fetch('/api/admin/waitlist', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch waitlist data');
        }

        const data = await response.json();
        setEntries(data.entries);
      } catch (err) {
        console.error('Error fetching waitlist:', err);
        setError('Failed to load waitlist data. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchWaitlist();
  }, [isAuthenticated]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('waitlistAdminAuth');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Admin Login</h1>
        
        {authError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {authError}
          </div>
        )}
        
        <div className="bg-white shadow-md rounded-lg p-6">
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Waitlist Admin</h1>
        <button
          onClick={handleLogout}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>
      
      {loading && <p className="text-gray-600">Loading waitlist data...</p>}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {!loading && !error && (
        <>
          <p className="mb-4">Total entries: {entries.length}</p>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Added
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {entries.map((entry) => (
                  <tr key={entry.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {entry.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(entry.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
                
                {entries.length === 0 && (
                  <tr>
                    <td colSpan={2} className="px-6 py-4 text-center text-sm text-gray-500">
                      No waitlist entries found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
} 