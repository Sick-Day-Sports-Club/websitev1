import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const trackingId = params.id;
    const destination = request.nextUrl.searchParams.get('destination');

    if (!destination) {
      return NextResponse.json({ error: 'Destination not provided' }, { status: 400 });
    }

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

    // Record the click event
    // const { error: insertError } = await supabase
    //   .from('email_tracking')
    //   .insert([{
    //     email_id: trackingId,
    //     email_type: originalEmail.email_type,
    //     status: 'clicked',
    //     metadata: { clicked_url: destination },
    //     created_at: new Date().toISOString()
    //   }]);

    // if (insertError) {
    //   return NextResponse.json({ error: 'Failed to record click event' }, { status: 500 });
    // }

    // Redirect to the destination URL
    return NextResponse.redirect(destination);
  } catch (error) {
    console.error('Error tracking email click:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 