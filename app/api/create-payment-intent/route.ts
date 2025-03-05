import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { z } from 'zod';

// Initialize Stripe with API key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia'
});

// Validation schema for the request body
const createSetupIntentSchema = z.object({
  amount: z.number().min(1).max(1000),
  couponCode: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate request body
    const validatedData = createSetupIntentSchema.parse(body);
    
    // Create metadata object
    const metadata: Record<string, string> = {
      type: 'beta_deposit',
      amount: validatedData.amount.toString(),
    };

    // If coupon code is provided, validate it first
    if (validatedData.couponCode) {
      try {
        const coupon = await stripe.coupons.retrieve(validatedData.couponCode);
        if (coupon.valid) {
          metadata.coupon_code = validatedData.couponCode;
          
          // Calculate discounted amount
          let finalAmount = validatedData.amount;
          if (coupon.percent_off) {
            finalAmount = finalAmount * (1 - coupon.percent_off / 100);
          }
          if (coupon.amount_off) {
            finalAmount = Math.max(0, finalAmount - (coupon.amount_off / 100));
          }
          metadata.discounted_amount = finalAmount.toString();
        }
      } catch (error) {
        // If coupon is invalid, just proceed without it
        console.warn('Invalid coupon code:', error);
      }
    }

    // Create a SetupIntent
    const setupIntent = await stripe.setupIntents.create({
      payment_method_types: ['card'],
      metadata
    });

    return NextResponse.json({ clientSecret: setupIntent.client_secret });
  } catch (error) {
    console.error('Error creating setup intent:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Error setting up payment method' },
      { status: 500 }
    );
  }
} 