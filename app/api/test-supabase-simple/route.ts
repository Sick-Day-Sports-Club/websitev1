import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    console.log('Testing Supabase connection (simple version)...');
    
    // Check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    // Basic response object
    const response: {
      environment: {
        NEXT_PUBLIC_SUPABASE_URL: string | undefined;
        NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
        NODE_ENV: string | undefined;
      };
      connection: string;
      query: string;
      error: string | null;
    } = {
      environment: {
        NEXT_PUBLIC_SUPABASE_URL: supabaseUrl,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseAnonKey ? 'Set (masked)' : 'Not set',
        NODE_ENV: process.env.NODE_ENV
      },
      connection: 'not_tested',
      query: 'not_tested',
      error: null
    };
    
    // Check if we have the required environment variables
    if (!supabaseUrl || !supabaseAnonKey) {
      response.error = 'Missing required environment variables';
      return NextResponse.json(response, { status: 500 });
    }
    
    // Initialize Supabase client
    try {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      response.connection = 'success';
      
      // Test query
      try {
        const { data, error } = await supabase
          .from('beta_applications')
          .select('id, email, status')
          .limit(5);
        
        if (error) {
          console.error('Supabase query error:', error);
          response.query = 'failed';
          response.error = error.message;
        } else {
          response.query = 'success';
        }
      } catch (queryError) {
        console.error('Error executing Supabase query:', queryError);
        response.query = 'failed';
        response.error = queryError instanceof Error ? queryError.message : String(queryError);
      }
    } catch (connectionError) {
      console.error('Error initializing Supabase client:', connectionError);
      response.connection = 'failed';
      response.error = connectionError instanceof Error ? connectionError.message : String(connectionError);
    }
    
    // Return the response
    const statusCode = 
      response.connection === 'failed' || response.query === 'failed' || response.error 
        ? 500 
        : 200;
    
    return NextResponse.json(response, { status: statusCode });
  } catch (error) {
    console.error('Error testing Supabase connection:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 