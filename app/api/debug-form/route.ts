import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    console.log('Debug form submission received:', data);
    
    // Return a success response with the received data
    return NextResponse.json({
      success: true,
      message: 'Debug form submission received successfully',
      receivedData: data,
      serverTime: new Date().toISOString(),
      environment: {
        NODE_ENV: process.env.NODE_ENV || 'Not set',
        STRIPE_KEY_SET: process.env.STRIPE_SECRET_KEY ? true : false,
        SUPABASE_URL_SET: process.env.NEXT_PUBLIC_SUPABASE_URL ? true : false,
        SUPABASE_KEY_SET: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? true : false
      }
    });
  } catch (error: any) {
    console.error('Error in debug form API:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to process debug form submission',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
} 