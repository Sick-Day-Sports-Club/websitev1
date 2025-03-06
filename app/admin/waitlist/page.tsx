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

  useEffect(() => {
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
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Waitlist Admin</h1>
      
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