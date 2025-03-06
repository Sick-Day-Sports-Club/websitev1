import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Log environment variables (without exposing sensitive values)
console.log('API Route Environment Variables Check:');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
console.log('SUPABASE_SERVICE_ROLE_KEY exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);

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

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    console.log('Received email for waitlist:', email);

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
    console.log('Attempting to insert into waitlist table with service role key...');
    const { data, error: insertError } = await supabaseAdmin
      .from('waitlist')
      .insert({ email })
      .select();

    if (insertError) {
      console.error('Error inserting into waitlist:', insertError);
      return NextResponse.json({ error: 'Failed to add email to waitlist', details: insertError }, { status: 500 });
    }

    console.log('Successfully added to waitlist:', data);
    
    // Double-check that the email was added
    console.log('Verifying email was added...');
    const { data: verifyData, error: verifyError } = await supabaseAdmin
      .from('waitlist')
      .select('*')
      .eq('email', email);
      
    if (verifyError) {
      console.error('Error verifying email addition:', verifyError);
    } else {
      console.log('Verification result:', verifyData);
    }

    return NextResponse.json({ message: 'Email added to waitlist successfully', data }, { status: 200 });
  } catch (error) {
    console.error('Error in waitlist API:', error);
    return NextResponse.json({ error: 'Internal server error', details: error }, { status: 500 });
  }
} 