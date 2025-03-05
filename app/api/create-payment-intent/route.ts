import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  try {
    const { amount, couponCode } = await request.json();
    
    // Validate input
    if (!amount || typeof amount !== 'number') {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }
    
    // CRITICAL: Log environment variables status for debugging
    console.log('CRITICAL: create-payment-intent API called');
    console.log('NODE_ENV:', process.env.NODE_ENV || 'Not set');
    console.log('STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? 'Set (starts with ' + process.env.STRIPE_SECRET_KEY.substring(0, 6) + '...)' : 'Not set');
    
    // PRODUCTION OVERRIDE: Always use real implementation
    // Use a hardcoded key if the environment variable is not available
    const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_51Q4lGEKOdg5wedYdpfnwuayPzQAyLeRjxJPopVF5UdMLupCkSAumVRD9ERD7j7ocC3UM6mqMGoS6GU8NMOZsnAKl00LFmxmbB6';
    
    // Initialize Stripe
    const stripe = new Stripe(stripeKey, {
      apiVersion: '2025-02-24.acacia',
    });
    
    console.log('Stripe initialized successfully');
    
    // Create a customer
    const customer = await stripe.customers.create({
      metadata: {
        amount: amount.toString(),
        couponCode: couponCode || 'none',
      },
    });
    
    console.log('Stripe customer created:', customer.id);
    
    // Create a SetupIntent
    const setupIntent = await stripe.setupIntents.create({
      customer: customer.id,
      payment_method_types: ['card'],
      metadata: {
        amount: amount.toString(),
        couponCode: couponCode || 'none',
      },
    });
    
    console.log('Stripe setup intent created:', setupIntent.id);
    
    return NextResponse.json({ 
      clientSecret: setupIntent.client_secret,
      debug: {
        success: true,
        setupIntentId: setupIntent.id,
        customerId: customer.id
      }
    });
  } catch (error: any) {
    console.error('CRITICAL ERROR in create-payment-intent:', error);
    
    // Return a more detailed error response
    return NextResponse.json({ 
      error: 'Failed to create payment intent',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}
  