import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    console.log('Testing Supabase connection...');
    console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    console.log('SUPABASE_SERVICE_ROLE_KEY exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
    
    // Initialize Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    // Test query
    const { data, error } = await supabase
      .from('beta_applications')
      .select('id, email, status')
      .limit(5);
    
    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        details: error
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Supabase connection successful',
      count: data?.length || 0,
      // Don't return actual data for security
      fields: data && data.length > 0 ? Object.keys(data[0]) : []
    });
  } catch (error) {
    console.error('Error testing Supabase connection:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 