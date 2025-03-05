import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const { amount, couponCode } = await request.json();
    
    // Validate input
    if (!amount || typeof amount !== 'number') {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }
    
    // Log environment variables status for debugging
    const stripeKeyStatus = process.env.STRIPE_SECRET_KEY 
      ? `Set (starts with ${process.env.STRIPE_SECRET_KEY.substring(0, 6)}...)` 
      : 'Not set';
    
    const supabaseUrlStatus = process.env.NEXT_PUBLIC_SUPABASE_URL 
      ? 'Set' 
      : 'Not set';
    
    const supabaseKeyStatus = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
      ? `Set (length: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length})` 
      : 'Not set';
    
    console.log('Environment variables status:');
    console.log('- STRIPE_SECRET_KEY:', stripeKeyStatus);
    console.log('- NEXT_PUBLIC_SUPABASE_URL:', supabaseUrlStatus);
    console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseKeyStatus);
    console.log('- NODE_ENV:', process.env.NODE_ENV || 'Not set');
    
    // Check if we're in build mode or missing environment variables
    if (!process.env.STRIPE_SECRET_KEY || 
        !process.env.NEXT_PUBLIC_SUPABASE_URL || 
        !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.log('Using mock implementation for create-payment-intent (missing env vars)');
      // Return a mock client secret for build/development
      return NextResponse.json({ 
        clientSecret: 'mock_client_secret_for_build_process',
        isMock: true,
        debug: {
          reason: 'Missing environment variables',
          stripeKeySet: !!process.env.STRIPE_SECRET_KEY,
          supabaseUrlSet: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          supabaseKeySet: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        }
      });
    }
    
    // Initialize Stripe and Supabase only when needed
    let stripe;
    try {
      stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2025-02-24.acacia',
      });
      console.log('Stripe initialized successfully');
    } catch (error: any) {
      console.error('Error initializing Stripe:', error);
      return NextResponse.json({ 
        clientSecret: 'mock_client_secret_for_build_process',
        isMock: true,
        debug: {
          reason: 'Stripe initialization failed',
          error: error.message
        }
      });
    }
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    
    // Create a customer
    let customer;
    try {
      customer = await stripe.customers.create({
        metadata: {
          amount: amount.toString(),
          couponCode: couponCode || 'none',
        },
      });
      console.log('Stripe customer created:', customer.id);
    } catch (error: any) {
      console.error('Error creating Stripe customer:', error);
      return NextResponse.json({ 
        clientSecret: 'mock_client_secret_for_build_process',
        isMock: true,
        debug: {
          reason: 'Failed to create Stripe customer',
          error: error.message
        }
      });
    }
    
    // Create a SetupIntent
    let setupIntent;
    try {
      setupIntent = await stripe.setupIntents.create({
        customer: customer.id,
        payment_method_types: ['card'],
        metadata: {
          amount: amount.toString(),
          couponCode: couponCode || 'none',
        },
      });
      console.log('Stripe setup intent created:', setupIntent.id);
    } catch (error: any) {
      console.error('Error creating Stripe setup intent:', error);
      return NextResponse.json({ 
        clientSecret: 'mock_client_secret_for_build_process',
        isMock: true,
        debug: {
          reason: 'Failed to create Stripe setup intent',
          error: error.message
        }
      });
    }
    
    return NextResponse.json({ 
      clientSecret: setupIntent.client_secret,
      debug: {
        success: true,
        setupIntentId: setupIntent.id,
        customerId: customer.id
      }
    });
  } catch (error: any) {
    console.error('Error creating setup intent:', error);
    return NextResponse.json({ 
      error: 'Failed to create payment intent',
      debug: {
        reason: 'Unhandled exception',
        error: error.message
      }
    }, { status: 500 });
  }
}
  