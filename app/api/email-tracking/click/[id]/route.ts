import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';

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
    const destination = request.nextUrl.searchParams.get('destination');

    if (!destination) {
      return new NextResponse(null, { status: 400 });
    }

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

    // Record the click event
    await supabase
      .from('email_tracking')
      .insert([{
        email_id: trackingId,
        email_type: originalEmail.email_type,
        status: 'clicked',
        metadata: { clicked_url: destination },
        created_at: new Date().toISOString()
      }]);

    // Redirect to the destination URL
    return NextResponse.redirect(destination);
  } catch (error) {
    console.error('Error tracking email click:', error);
    return new NextResponse(null, { status: 500 });
  }
} 