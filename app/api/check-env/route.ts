import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Only allow this in development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'This endpoint is only available in development mode' }, { status: 403 });
  }

  // Check for essential environment variables
  const envVars = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing',
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? 'Set' : 'Missing',
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ? 'Set' : 'Missing',
    RESEND_API_KEY: process.env.RESEND_API_KEY ? 'Set' : 'Missing',
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL ? 'Set' : 'Missing',
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN ? 'Set' : 'Missing',
    NODE_ENV: process.env.NODE_ENV || 'Not set'
  };

  return NextResponse.json({ 
    message: 'Environment variables check',
    variables: envVars
  });
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ message: 'API disabled during build' }, { status: 503 });
}
