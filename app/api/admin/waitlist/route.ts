import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with service role key
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching waitlist entries...');
    
    // Use service role key to fetch all waitlist entries
    const { data, error } = await supabaseAdmin
      .from('waitlist')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching waitlist entries:', error);
      return NextResponse.json({ error: 'Failed to fetch waitlist entries', details: error }, { status: 500 });
    }

    console.log(`Successfully fetched ${data.length} waitlist entries`);
    
    // Log the first few entries for debugging
    if (data.length > 0) {
      console.log('Sample entries:', data.slice(0, 3));
    }
    
    return NextResponse.json({ entries: data }, { status: 200 });
  } catch (error) {
    console.error('Error in admin waitlist API:', error);
    return NextResponse.json({ error: 'Internal server error', details: error }, { status: 500 });
  }
} 