import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { sendBetaConfirmationEmail, sendWaitlistConfirmationEmail } from '@/utils/email';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

// Initialize rate limiter
let ratelimit: Ratelimit | null = null;
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
  
  ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '1m'),
    analytics: true,
  });
}

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'API disabled during build' }, { status: 503 });
}

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting if configured
    if (ratelimit) {
      const ip = request.headers.get('x-forwarded-for') || 'anonymous';
      const { success, limit, reset, remaining } = await ratelimit.limit(ip);
      
      if (!success) {
        return NextResponse.json(
          { error: 'Too many requests. Please try again later.' },
          { 
            status: 429,
            headers: {
              'X-RateLimit-Limit': limit.toString(),
              'X-RateLimit-Remaining': remaining.toString(),
              'X-RateLimit-Reset': reset.toString(),
            }
          }
        );
      }
    }

    const data = await request.json();
    const { firstName, lastName, email, referralCode, membershipType, paymentMethod } = data;

    // Validate required fields
    if (!firstName || !lastName || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if email already exists
    const { data: existingUser, error: lookupError } = await supabase
      .from('beta_users')
      .select('id, email, status')
      .eq('email', email)
      .single();

    if (lookupError && lookupError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      console.error('Error checking for existing user:', lookupError);
      return NextResponse.json({ error: 'Failed to check for existing user' }, { status: 500 });
    }

    if (existingUser) {
      return NextResponse.json({ 
        error: 'This email is already registered',
        status: existingUser.status
      }, { status: 400 });
    }

    // Process based on membership type
    if (membershipType === 'beta' && paymentMethod) {
      // Save payment method for future charging
      try {
        // Store user data in Supabase
        const { data: userData, error: insertError } = await supabase
          .from('beta_users')
          .insert([
            { 
              first_name: firstName,
              last_name: lastName,
              email,
              referral_code: referralCode || null,
              membership_type: membershipType,
              payment_method_id: paymentMethod.id,
              status: 'active'
            }
          ])
          .select();

        if (insertError) {
          console.error('Error inserting user data:', insertError);
          return NextResponse.json({ error: 'Failed to save user data' }, { status: 500 });
        }

        // Send confirmation email
        await sendBetaConfirmationEmail({
          email,
          firstName,
          lastName,
          amount: 99 // $99 deposit
        });

        return NextResponse.json({ 
          success: true,
          message: 'Successfully joined the beta program',
          userId: userData[0].id
        });
      } catch (error) {
        console.error('Error processing beta signup:', error);
        return NextResponse.json({ error: 'Failed to process beta signup' }, { status: 500 });
      }
    } else {
      // Waitlist signup (no payment)
      try {
        // Store user data in Supabase
        const { data: userData, error: insertError } = await supabase
          .from('beta_users')
          .insert([
            { 
              first_name: firstName,
              last_name: lastName,
              email,
              referral_code: referralCode || null,
              membership_type: 'waitlist',
              status: 'waitlist'
            }
          ])
          .select();

        if (insertError) {
          console.error('Error inserting waitlist user data:', insertError);
          return NextResponse.json({ error: 'Failed to save user data' }, { status: 500 });
        }

        // Send confirmation email
        await sendWaitlistConfirmationEmail({
          email,
          firstName,
          lastName
        });

        return NextResponse.json({ 
          success: true,
          message: 'Successfully joined the waitlist',
          userId: userData[0].id
        });
      } catch (error) {
        console.error('Error processing waitlist signup:', error);
        return NextResponse.json({ error: 'Failed to process waitlist signup' }, { status: 500 });
      }
    }
  } catch (error) {
    console.error('Error in beta signup API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
