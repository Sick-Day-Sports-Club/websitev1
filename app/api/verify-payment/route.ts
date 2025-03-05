import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { z } from 'zod';

// Initialize Stripe with API key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia'
});

// Validation schema for query parameters
const verifyPaymentSchema = z.object({
  setup_intent: z.string().min(1),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Validate query parameters
    const validatedParams = verifyPaymentSchema.parse({
      setup_intent: searchParams.get('setup_intent'),
    });

    const intent = await stripe.setupIntents.retrieve(validatedParams.setup_intent);
    
    // Check if the setup intent is in a valid state
    if (intent.status !== 'succeeded' && intent.status !== 'requires_payment_method') {
      return NextResponse.json(
        { error: 'Invalid setup intent status', status: intent.status },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      status: intent.status,
      payment_method: intent.payment_method,
      metadata: intent.metadata
    });
  } catch (error) {
    console.error('Error verifying setup intent:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: error.errors },
        { status: 400 }
      );
    }
    
    if (error instanceof stripe.errors.StripeError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode || 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to verify payment setup' },
      { status: 500 }
    );
  }
} 