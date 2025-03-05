import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type RouteParams = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function GET(
  request: Request,
  context: RouteParams
) {
  try {
    const trackingId = context.params.id;

    // Get the original email record to get the email type
    const { data: originalEmail } = await supabase
      .from('email_tracking')
      .select('email_type')
      .eq('email_id', trackingId)
      .eq('status', 'sent')
      .single();

    if (!originalEmail) {
      return new NextResponse(null, { status: 404 });
    }

    // Record the open event
    await supabase
      .from('email_tracking')
      .insert([{
        email_id: trackingId,
        email_type: originalEmail.email_type,
        status: 'opened',
        created_at: new Date().toISOString()
      }]);

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
    return new NextResponse(null, { status: 500 });
  }
} 