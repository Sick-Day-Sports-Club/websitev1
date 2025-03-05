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
    console.log('Beta signup API called');
    
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
    console.log('Received data:', data);
    
    // Extract basic fields
    const { 
      first_name, 
      last_name, 
      email, 
      phone, 
      location, 
      activities,
      activity_experience,
      adventure_style,
      social_preferences,
      equipment_status,
      availability,
      weekday_preference,
      time_of_day,
      referral_source,
      additional_info,
      join_type
    } = data;

    // Validate required fields
    if (!first_name || !last_name || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if email already exists
    const { data: existingUser, error: lookupError } = await supabase
      .from('beta_applications')
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

    // Prepare data for insertion
    const applicationData = {
      first_name,
      last_name,
      email,
      phone: phone || null,
      location,
      activities,
      activity_experience,
      adventure_style,
      social_preferences,
      equipment_status,
      availability,
      weekday_preference,
      time_of_day,
      referral_source: referral_source || null,
      additional_info: additional_info || null,
      status: join_type === 'waitlist' ? 'waitlist' : 'pending',
      join_type
    };

    console.log('Inserting data into beta_applications:', applicationData);

    // Insert data into beta_applications table
    const { data: userData, error: insertError } = await supabase
      .from('beta_applications')
      .insert([applicationData])
      .select();

    if (insertError) {
      console.error('Error inserting user data:', insertError);
      return NextResponse.json({ error: 'Failed to save user data', details: insertError }, { status: 500 });
    }

    console.log('Successfully inserted data, response:', userData);

    // Send confirmation email based on join type
    if (join_type === 'waitlist') {
      try {
        await sendWaitlistConfirmationEmail({
          email,
          firstName: first_name,
          lastName: last_name
        });
      } catch (emailError) {
        console.error('Error sending waitlist confirmation email:', emailError);
        // Continue despite email error
      }

      return NextResponse.json({ 
        success: true,
        message: 'Successfully joined the waitlist',
        userId: userData[0].id
      });
    } else {
      try {
        await sendBetaConfirmationEmail({
          email,
          firstName: first_name,
          lastName: last_name,
          amount: 99 // $99 deposit
        });
      } catch (emailError) {
        console.error('Error sending beta confirmation email:', emailError);
        // Continue despite email error
      }

      return NextResponse.json({ 
        success: true,
        message: 'Successfully joined the beta program',
        userId: userData[0].id
      });
    }
  } catch (error) {
    console.error('Error in beta signup API:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}
