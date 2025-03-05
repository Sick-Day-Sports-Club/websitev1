import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { z } from 'zod';

// Initialize Stripe with fallback for development/testing
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
const stripe = stripeSecretKey 
  ? new Stripe(stripeSecretKey, { apiVersion: '2023-10-16' as any }) 
  : null;

// Validation schema for the request body
const createSetupIntentSchema = z.object({
  amount: z.number().min(1).max(1000),
  couponCode: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // If Stripe isn't initialized, return a graceful error
    if (!stripe) {
      console.error('Stripe API key is not configured');
      return NextResponse.json(
        { error: 'Payment service is not configured' },
        { status: 503 }
      );
    }

    const { amount, currency = 'usd', description } = await request.json();

    if (!amount) {
      return NextResponse.json(
        { error: 'Amount is required' },
        { status: 400 }
      );
    }

    // Create a PaymentIntent with the specified amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      description,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
} 