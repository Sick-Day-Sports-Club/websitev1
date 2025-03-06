import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Log environment variables (without exposing sensitive values)
console.log('Admin Waitlist API Route Environment Variables Check:');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
console.log('SUPABASE_SERVICE_ROLE_KEY exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);

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
    // If service role key is available, use it regardless of environment
    if (serviceRoleKey) {
      console.log('Service role key available, proceeding with database operations');
      
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
    }
    // If in production and no service role key, return mock data or informative message
    else if (process.env.NODE_ENV === 'production') {
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
    // This should never happen if the service role key is properly configured
    else {
      console.error('No service role key available in development environment');
      return NextResponse.json({ error: 'Service role key not configured' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in admin waitlist API:', error);
    return NextResponse.json({ error: 'Internal server error', details: error }, { status: 500 });
  }
} 