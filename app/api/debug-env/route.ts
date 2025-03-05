import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Only allow this in development or with a special header for security
  const isAuthorized = 
    process.env.NODE_ENV === 'development' || 
    request.headers.get('x-debug-auth') === 'sickday-debug-2024';
  
  if (!isAuthorized) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
  }
  
  // Check environment variables
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
  const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  return NextResponse.json({
    environment: process.env.NODE_ENV || 'unknown',
    buildTime: process.env.BUILD_TIME || 'unknown',
    stripeSecretKeySet: !!stripeSecretKey,
    stripeSecretKeyValid: stripeSecretKey.startsWith('sk_'),
    stripeSecretKeyPrefix: stripeSecretKey ? stripeSecretKey.substring(0, 6) : 'not-set',
    stripePublishableKeySet: !!stripePublishableKey,
    stripePublishableKeyValid: stripePublishableKey.startsWith('pk_'),
    stripePublishableKeyPrefix: stripePublishableKey ? stripePublishableKey.substring(0, 6) : 'not-set',
    supabaseUrlSet: !!supabaseUrl,
    supabaseAnonKeySet: !!supabaseAnonKey,
    supabaseAnonKeyPrefix: supabaseAnonKey ? supabaseAnonKey.substring(0, 10) : 'not-set',
  });
} 