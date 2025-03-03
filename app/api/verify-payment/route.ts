import { NextResponse } from 'next/server';
import stripe from '@/utils/stripe';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const paymentIntent = searchParams.get('payment_intent');

  if (!paymentIntent) {
    return NextResponse.json(
      { error: 'Payment intent ID is required' },
      { status: 400 }
    );
  }

  try {
    const intent = await stripe.paymentIntents.retrieve(paymentIntent);
    return NextResponse.json({ status: intent.status });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: 'Error verifying payment status' },
      { status: 500 }
    );
  }
} 