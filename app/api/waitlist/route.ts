import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    console.log('Received email:', email);

    // Insert email into the waitlist table
    const { error: insertError } = await supabaseAdmin
      .from('waitlist')
      .insert({ email });

    if (insertError) {
      console.error('Error inserting into waitlist:', insertError);
      return NextResponse.json({ error: 'Failed to add email to waitlist' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Email added to waitlist successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error in waitlist API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 