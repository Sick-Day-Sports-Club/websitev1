import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize regular Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Check if service role key is available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Initialize Supabase admin client with service role key for bypassing RLS if available
const supabaseAdmin = serviceRoleKey 
  ? createClient(supabaseUrl, serviceRoleKey)
  : supabase; // Fall back to regular client if service role key is not available

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Get destination URL early so it's available in the catch block
  const destination = request.nextUrl.searchParams.get('destination') || '/';
  
  try {
    const trackingId = params.id;

    if (!destination) {
      return NextResponse.json({ error: 'Destination not provided' }, { status: 400 });
    }

    // If in production and no service role key, just redirect without tracking
    if (process.env.NODE_ENV === 'production' && !serviceRoleKey) {
      console.log('Running in production without service role key - redirecting without tracking');
      return NextResponse.redirect(destination);
    }

    // Get the original email record to get the email type
    const { data: originalEmail, error } = await supabaseAdmin
      .from('email_tracking')
      .select('email_type')
      .eq('email_id', trackingId)
      .eq('status', 'sent')
      .single();

    if (error || !originalEmail) {
      // If we can't find the email, just redirect to the destination
      console.log('Email not found or error occurred, redirecting anyway:', error);
      return NextResponse.redirect(destination);
    }

    // Record the click event
    const { error: insertError } = await supabaseAdmin
      .from('email_tracking')
      .insert([{
        email_id: trackingId,
        email_type: originalEmail.email_type,
        status: 'clicked',
        metadata: { clicked_url: destination },
        created_at: new Date().toISOString()
      }]);

    if (insertError) {
      console.error('Failed to record click event:', insertError);
      // Still redirect even if tracking fails
      return NextResponse.redirect(destination);
    }

    // Redirect to the destination URL
    return NextResponse.redirect(destination);
  } catch (error) {
    console.error('Error tracking email click:', error);
    // If any error occurs, still redirect to the destination
    return NextResponse.redirect(destination);
  }
} 