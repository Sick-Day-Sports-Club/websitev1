import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Log environment variables for debugging
    console.log('Environment check requested');
    console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY set:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    console.log('SUPABASE_SERVICE_ROLE_KEY set:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
    console.log('NODE_ENV:', process.env.NODE_ENV);

    // Check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const nodeEnv = process.env.NODE_ENV;
    
    // Prepare response with environment variable status
    const response = {
      environment: {
        NEXT_PUBLIC_SUPABASE_URL: supabaseUrl,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 5)}...` : null,
        SUPABASE_SERVICE_ROLE_KEY: supabaseServiceKey ? `${supabaseServiceKey.substring(0, 5)}...` : null,
        NODE_ENV: nodeEnv,
      },
      timestamp: new Date().toISOString(),
      message: 'Environment check completed'
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error checking environment:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 