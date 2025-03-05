import { NextResponse } from 'next/server';
import { sendBetaConfirmationEmail, sendWaitlistConfirmationEmail } from '../../../utils/email';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, email, firstName, lastName, amount } = body;

    if (!email || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (type === 'beta') {
      await sendBetaConfirmationEmail({ email, firstName, lastName, amount });
    } else if (type === 'waitlist') {
      await sendWaitlistConfirmationEmail({ email, firstName, lastName });
    } else {
      return NextResponse.json(
        { error: 'Invalid email type' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
} 