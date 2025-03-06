import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// This route is specifically for debugging Supabase connection during build
export async function GET(request: NextRequest) {
  // Log all environment variables without exposing full values
  console.log('===== DEBUG SUPABASE BUILD =====');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('NEXT_PUBLIC_SUPABASE_URL exists:', !!process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('NEXT_PUBLIC_SUPABASE_URL value:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY length:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length : 0);
  console.log('SUPABASE_SERVICE_ROLE_KEY exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
  console.log('SUPABASE_SERVICE_ROLE_KEY length:', process.env.SUPABASE_SERVICE_ROLE_KEY ? process.env.SUPABASE_SERVICE_ROLE_KEY.length : 0);
  
  // Prepare response object
  const response = {
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_SUPABASE_URL_EXISTS: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY_EXISTS: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      NEXT_PUBLIC_SUPABASE_ANON_KEY_LENGTH: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length : 0,
      SUPABASE_SERVICE_ROLE_KEY_EXISTS: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      SUPABASE_SERVICE_ROLE_KEY_LENGTH: process.env.SUPABASE_SERVICE_ROLE_KEY ? process.env.SUPABASE_SERVICE_ROLE_KEY.length : 0
    },
    supabaseClientTest: null as string | null,
    error: null as string | null
  };
  
  try {
    // Try to initialize Supabase client
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.log('Attempting to create Supabase client...');
      
      // Create client with explicit string values to avoid any type issues
      const supabaseUrl = String(process.env.NEXT_PUBLIC_SUPABASE_URL);
      const supabaseAnonKey = String(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
      
      try {
        const supabase = createClient(supabaseUrl, supabaseAnonKey);
        response.supabaseClientTest = 'Client created successfully';
        console.log('Supabase client created successfully');
      } catch (clientError) {
        console.error('Error creating Supabase client:', clientError);
        response.supabaseClientTest = 'Failed to create client';
        response.error = clientError instanceof Error ? clientError.message : String(clientError);
      }
    } else {
      console.log('Missing required Supabase environment variables');
      response.supabaseClientTest = 'Missing required environment variables';
    }
  } catch (error) {
    console.error('Unexpected error in debug-supabase-build:', error);
    response.error = error instanceof Error ? error.message : String(error);
  }
  
  console.log('===== END DEBUG SUPABASE BUILD =====');
  return NextResponse.json(response);
} 