'use client';

import { useState, useEffect } from 'react';

export default function ApiTestPage() {
  const [envCheckResult, setEnvCheckResult] = useState<any>(null);
  const [supabaseTestResult, setSupabaseTestResult] = useState<any>(null);
  const [supabaseSimpleResult, setSupabaseSimpleResult] = useState<any>(null);
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<Record<string, string>>({});

  const testEndpoint = async (endpoint: string, setter: (data: any) => void) => {
    setLoading(prev => ({ ...prev, [endpoint]: true }));
    setError(prev => ({ ...prev, [endpoint]: '' }));
    
    try {
      const response = await fetch(`/api/${endpoint}`);
      const data = await response.json();
      setter(data);
    } catch (err) {
      setError(prev => ({ 
        ...prev, 
        [endpoint]: err instanceof Error ? err.message : String(err) 
      }));
    } finally {
      setLoading(prev => ({ ...prev, [endpoint]: false }));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">API Test Page</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Environment Check</h2>
        <button 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
          onClick={() => testEndpoint('env-check', setEnvCheckResult)}
          disabled={loading['env-check']}
        >
          {loading['env-check'] ? 'Loading...' : 'Test Environment'}
        </button>
        
        {error['env-check'] && (
          <div className="mt-2 p-2 bg-red-100 text-red-700 rounded">
            Error: {error['env-check']}
          </div>
        )}
        
        {envCheckResult && (
          <pre className="mt-2 p-4 bg-gray-100 rounded overflow-auto">
            {JSON.stringify(envCheckResult, null, 2)}
          </pre>
        )}
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Supabase Test</h2>
        <button 
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
          onClick={() => testEndpoint('test-supabase', setSupabaseTestResult)}
          disabled={loading['test-supabase']}
        >
          {loading['test-supabase'] ? 'Loading...' : 'Test Supabase'}
        </button>
        
        {error['test-supabase'] && (
          <div className="mt-2 p-2 bg-red-100 text-red-700 rounded">
            Error: {error['test-supabase']}
          </div>
        )}
        
        {supabaseTestResult && (
          <pre className="mt-2 p-4 bg-gray-100 rounded overflow-auto">
            {JSON.stringify(supabaseTestResult, null, 2)}
          </pre>
        )}
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Supabase Simple Test</h2>
        <button 
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mr-2"
          onClick={() => testEndpoint('test-supabase-simple', setSupabaseSimpleResult)}
          disabled={loading['test-supabase-simple']}
        >
          {loading['test-supabase-simple'] ? 'Loading...' : 'Test Supabase (Simple)'}
        </button>
        
        {error['test-supabase-simple'] && (
          <div className="mt-2 p-2 bg-red-100 text-red-700 rounded">
            Error: {error['test-supabase-simple']}
          </div>
        )}
        
        {supabaseSimpleResult && (
          <pre className="mt-2 p-4 bg-gray-100 rounded overflow-auto">
            {JSON.stringify(supabaseSimpleResult, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
} 