import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Check if service role key is available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Initialize Supabase client with service role key if available, otherwise use anon key
const supabaseAdmin = serviceRoleKey 
  ? createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : createClient(supabaseUrl, anonKey);

export async function GET(request: NextRequest) {
  try {
    // If in production and no service role key, return mock data or informative message
    if (process.env.NODE_ENV === 'production' && !serviceRoleKey) {
      console.log('Running in production without service role key - returning mock data');
      return NextResponse.json({ 
        entries: [
          { 
            id: '1', 
            email: 'example@example.com', 
            created_at: new Date().toISOString() 
          }
        ],
        note: 'This is mock data. Configure SUPABASE_SERVICE_ROLE_KEY in your production environment to see real data.'
      }, { status: 200 });
    }

    console.log('Fetching waitlist entries...');
    
    // Use Supabase client to fetch all waitlist entries
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