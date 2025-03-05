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

// Initialize Supabase admin client with service role key for bypassing RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
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
    
    // Extract fields from the request
    const { 
      firstName, 
      lastName, 
      email, 
      phone,
      location,
      activities,
      activityExperience,
      adventureStyle,
      socialPreferences,
      equipmentStatus,
      availability,
      weekdayPreference,
      timeOfDay,
      referralSource,
      additionalInfo,
      joinType,
      referralCode
    } = data;

    // Validate required fields
    if (!firstName || !lastName || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if email already exists
    const { data: existingUser, error: lookupError } = await supabaseAdmin
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

    // Prepare application data with snake_case field names for the database
    const applicationData = {
      first_name: firstName,
      last_name: lastName,
      email,
      phone: phone || null,
      location: location || null,
      activities: activities || null,
      activity_experience: activityExperience || null,
      adventure_style: adventureStyle || null,
      social_preferences: socialPreferences || null,
      equipment_status: equipmentStatus || null,
      availability: availability || null,
      weekday_preference: weekdayPreference || null,
      time_of_day: timeOfDay || null,
      referral_source: referralSource || null,
      additional_info: additionalInfo || null,
      join_type: joinType || 'waitlist',
      referral_code: referralCode || null,
      status: joinType === 'paid' ? 'pending_payment' : 'waitlist',
      created_at: new Date().toISOString()
    };

    console.log('Inserting application data:', applicationData);

    // Insert data into beta_applications table using admin client
    const { data: userData, error: insertError } = await supabaseAdmin
      .from('beta_applications')
      .insert([applicationData])
      .select();

    if (insertError) {
      console.error('Error inserting user data:', insertError);
      return NextResponse.json({ error: 'Failed to save user data', details: insertError }, { status: 500 });
    }

    console.log('Successfully inserted data, response:', userData);

    // Send confirmation email based on join type
    if (joinType === 'waitlist') {
      try {
        await sendWaitlistConfirmationEmail({
          email,
          firstName,
          lastName
        });
        console.log('Waitlist confirmation email sent');
      } catch (emailError) {
        console.error('Failed to send waitlist confirmation email:', emailError);
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
          firstName,
          lastName
        });
        console.log('Beta confirmation email sent');
      } catch (emailError) {
        console.error('Failed to send beta confirmation email:', emailError);
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
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
