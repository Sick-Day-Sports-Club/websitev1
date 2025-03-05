import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Initialize Stripe conditionally
let stripe: Stripe | null = null;
let supabase: any = null;

// Only initialize if the environment variables are available
// This prevents build errors when environment variables aren't set
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-02-24.acacia',
  });
}

// Initialize Supabase conditionally
if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export async function POST(request: NextRequest) {
  try {
    const { amount, couponCode } = await request.json();
    
    // Validate input
    if (!amount || typeof amount !== 'number') {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }
    
    // Check if we're in build mode or missing environment variables
    if (!stripe || !supabase) {
      console.log('Using mock implementation for create-payment-intent (build mode or missing env vars)');
      // Return a mock client secret for build/development
      return NextResponse.json({ 
        clientSecret: 'mock_client_secret_for_build_process',
        isMock: true
      });
    }
    
    // Create a customer
    const customer = await stripe.customers.create({
      metadata: {
        amount: amount.toString(),
        couponCode: couponCode || 'none',
      },
    });
    
    // Create a SetupIntent
    const setupIntent = await stripe.setupIntents.create({
      customer: customer.id,
      payment_method_types: ['card'],
      metadata: {
        amount: amount.toString(),
        couponCode: couponCode || 'none',
      },
    });
    
    return NextResponse.json({ clientSecret: setupIntent.client_secret });
  } catch (error) {
    console.error('Error creating setup intent:', error);
    return NextResponse.json({ error: 'Failed to create payment intent' }, { status: 500 });
  }
}
  