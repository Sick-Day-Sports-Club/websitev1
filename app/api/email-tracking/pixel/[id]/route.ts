import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const trackingId = context.params.id;

    // Get the original email record to get the email type
    const { data: originalEmail, error } = await supabase
      .from('email_tracking')
      .select('email_type')
      .eq('email_id', trackingId)
      .eq('status', 'sent')
      .single();

    if (error || !originalEmail) {
      return NextResponse.json({ error: 'Email not found' }, { status: 404 });
    }

    // Record the open event
    const { error: insertError } = await supabase
      .from('email_tracking')
      .insert([{
        email_id: trackingId,
        email_type: originalEmail.email_type,
        status: 'opened',
        created_at: new Date().toISOString()
      }]);

    if (insertError) {
      return NextResponse.json({ error: 'Failed to record open event' }, { status: 500 });
    }

    // Return a 1x1 transparent GIF
    return new NextResponse(
      Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64'),
      {
        headers: {
          'Content-Type': 'image/gif',
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  } catch (error) {
    console.error('Error tracking email open:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 