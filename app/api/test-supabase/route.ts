import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Define status type to ensure consistency
type StatusType = 'not_tested' | 'success' | 'failed';

// Define types for the response
interface SupabaseTestResponse {
  environment: {
    NEXT_PUBLIC_SUPABASE_URL: string | undefined;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string | null;
    SUPABASE_SERVICE_ROLE_KEY: string | null;
    NODE_ENV: string | undefined;
  };
  connection: {
    status: StatusType;
    error: string | null;
  };
  query: {
    status: StatusType;
    error: string | null;
    count: number;
    fields: string[];
  };
}

// Helper function to check if a status is failed
function isStatusFailed(status: StatusType): boolean {
  return status === 'failed';
}

export async function GET(request: NextRequest) {
  try {
    console.log('Testing Supabase connection...');
    
    // Check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl);
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY exists:', !!supabaseAnonKey);
    console.log('SUPABASE_SERVICE_ROLE_KEY exists:', !!supabaseServiceKey);
    
    // Prepare response with environment variable status
    const response: SupabaseTestResponse = {
      environment: {
        NEXT_PUBLIC_SUPABASE_URL: supabaseUrl,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 5)}...` : null,
        SUPABASE_SERVICE_ROLE_KEY: supabaseServiceKey ? `${supabaseServiceKey.substring(0, 5)}...` : null,
        NODE_ENV: process.env.NODE_ENV,
      },
      connection: {
        status: 'not_tested',
        error: null
      },
      query: {
        status: 'not_tested',
        error: null,
        count: 0,
        fields: []
      }
    };
    
    // Check if we have the required environment variables
    if (!supabaseUrl || !supabaseAnonKey) {
      response.connection.status = 'failed';
      response.connection.error = 'Missing required environment variables';
      return NextResponse.json(response, { status: 500 });
    }
    
    // Initialize Supabase client
    let supabase;
    try {
      supabase = createClient(supabaseUrl, supabaseAnonKey);
      response.connection.status = 'success';
    } catch (error) {
      console.error('Error initializing Supabase client:', error);
      response.connection.status = 'failed';
      response.connection.error = error instanceof Error ? error.message : String(error);
      return NextResponse.json(response, { status: 500 });
    }
    
    // Test query
    try {
      const { data, error } = await supabase
        .from('beta_applications')
        .select('id, email, status')
        .limit(5);
      
      if (error) {
        console.error('Supabase query error:', error);
        response.query.status = 'failed';
        response.query.error = error.message;
      } else {
        response.query.status = 'success';
        response.query.count = data?.length || 0;
        response.query.fields = data && data.length > 0 ? Object.keys(data[0]) : [];
      }
    } catch (error) {
      console.error('Error executing Supabase query:', error);
      response.query.status = 'failed';
      response.query.error = error instanceof Error ? error.message : String(error);
    }
    
    // Return the response with appropriate status code
    const isFailed = 
      isStatusFailed(response.connection.status) || 
      isStatusFailed(response.query.status);
    
    const statusCode = isFailed ? 500 : 200;
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