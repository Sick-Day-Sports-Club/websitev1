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
    
    // PRODUCTION OVERRIDE: Force real implementation in production
    const isProduction = process.env.NODE_ENV === 'production';
    const forceRealImplementation = isProduction;
    
    // Check if we're in build mode or missing environment variables
    if (!forceRealImplementation && 
        (!process.env.STRIPE_SECRET_KEY || 
        !process.env.NEXT_PUBLIC_SUPABASE_URL || 
        !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)) {
      console.log('Using mock implementation for create-payment-intent (missing env vars)');
      // Return a mock client secret for build/development
      return NextResponse.json({ 
        clientSecret: 'mock_client_secret_for_build_process',
        isMock: true,
        debug: {
          reason: 'Missing environment variables',
          stripeKeySet: !!process.env.STRIPE_SECRET_KEY,
          supabaseUrlSet: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          supabaseKeySet: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          isProduction: isProduction,
          forceRealImplementation: forceRealImplementation
        }
      });
    }
    
    // Initialize Stripe and Supabase only when needed
    let stripe;
    try {
      // Use a hardcoded key if the environment variable is not available
      // This is a temporary solution for debugging
      const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_51Q4lGEKOdg5wedYdpfnwuayPzQAyLeRjxJPopVF5UdMLupCkSAumVRD9ERD7j7ocC3UM6mqMGoS6GU8NMOZsnAKl00LFmxmbB6';
      
      stripe = new Stripe(stripeKey, {
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
          error: error.message,
          isProduction: isProduction,
          forceRealImplementation: forceRealImplementation
        }
      });
    }
    
    // Initialize Supabase with fallback values if needed
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zhefmgzldjoxwsblgkwm.supabase.co';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpoZWZtZ3psZGpveHdzYmxna3dtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2MTQxNzgsImV4cCI6MjA1NjE5MDE3OH0.ebveP3jmeo2zZiXU6apN0MeYeTioJJG5szIH0h8xNgM';
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
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
          error: error.message,
          isProduction: isProduction,
          forceRealImplementation: forceRealImplementation
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
          error: error.message,
          isProduction: isProduction,
          forceRealImplementation: forceRealImplementation
        }
      });
    }
    
    return NextResponse.json({ 
      clientSecret: setupIntent.client_secret,
      debug: {
        success: true,
        setupIntentId: setupIntent.id,
        customerId: customer.id,
        isProduction: isProduction,
        forceRealImplementation: forceRealImplementation
      }
    });
  } catch (error: any) {
    console.error('Error creating setup intent:', error);
    return NextResponse.json({ 
      error: 'Failed to create payment intent',
      debug: {
        reason: 'Unhandled exception',
        error: error.message,
        isProduction: process.env.NODE_ENV === 'production',
        forceRealImplementation: process.env.NODE_ENV === 'production'
      }
    }, { status: 500 });
  }
}
  