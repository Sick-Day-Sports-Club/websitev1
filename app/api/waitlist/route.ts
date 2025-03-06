import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Log environment variables (without exposing sensitive values)
console.log('API Route Environment Variables Check:');
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

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    console.log('Received email for waitlist:', email);

    // If service role key is available, use it regardless of environment
    if (serviceRoleKey) {
      console.log('Service role key available, proceeding with database operations');
      
      // First, check if the email already exists to avoid duplicates
      console.log('Checking if email already exists...');
      const { data: existingEmails, error: checkError } = await supabaseAdmin
        .from('waitlist')
        .select('*')
        .eq('email', email);

      if (checkError) {
        console.error('Error checking existing emails:', checkError);
        return NextResponse.json({ error: 'Failed to check existing emails', details: checkError }, { status: 500 });
      }

      if (existingEmails && existingEmails.length > 0) {
        console.log('Email already exists in waitlist:', email);
        return NextResponse.json({ message: 'Email already in waitlist', data: existingEmails[0] }, { status: 200 });
      }

      // Insert email into the waitlist table
      console.log('Attempting to insert into waitlist table...');
      const { data, error: insertError } = await supabaseAdmin
        .from('waitlist')
        .insert({ email })
        .select();

      if (insertError) {
        console.error('Error inserting into waitlist:', insertError);
        return NextResponse.json({ error: 'Failed to add email to waitlist', details: insertError }, { status: 500 });
      }

      console.log('Successfully added to waitlist:', data);
      
      return NextResponse.json({ message: 'Email added to waitlist successfully', data }, { status: 200 });
    } 
    // If in production and no service role key, return success message without DB operations
    else if (process.env.NODE_ENV === 'production') {
      console.log('Running in production without service role key - returning mock success');
      return NextResponse.json({ 
        message: 'Email received successfully', 
        note: 'This is a mock response. Configure SUPABASE_SERVICE_ROLE_KEY in your production environment to enable database operations.',
        mockData: { email }
      }, { status: 200 });
    }
    // This should never happen if the service role key is properly configured
    else {
      console.error('No service role key available in development environment');
      return NextResponse.json({ error: 'Service role key not configured' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in waitlist API:', error);
    return NextResponse.json({ error: 'Internal server error', details: error }, { status: 500 });
  }
} 