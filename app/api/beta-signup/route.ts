import { NextRequest, NextResponse } from 'next/server';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { sendBetaConfirmationEmail, sendWaitlistConfirmationEmail } from '@/utils/email';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Log environment variables (without exposing full keys)
console.log('API Route Environment Variables Check:');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
console.log('SUPABASE_SERVICE_ROLE_KEY exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);

// Create a function to initialize Supabase client
function initSupabase(): SupabaseClient | null {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase environment variables');
      return null;
    }
    
    // Explicitly convert to string to avoid any type issues
    return createClient(String(supabaseUrl), String(supabaseAnonKey));
  } catch (error) {
    console.error('Error initializing Supabase client:', error);
    return null;
  }
}

// Create a function to initialize Supabase admin client
function initSupabaseAdmin(): SupabaseClient | null {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase admin environment variables');
      
      // If we're in production and missing the service role key, fall back to anon key
      if (process.env.NODE_ENV === 'production' && !supabaseServiceKey && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.log('Falling back to anon key for admin operations in production');
        return createClient(
          String(supabaseUrl), 
          String(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
          {
            auth: {
              persistSession: false,
              autoRefreshToken: false,
            }
          }
        );
      }
      
      return null;
    }
    
    // Explicitly convert to string to avoid any type issues
    return createClient(String(supabaseUrl), String(supabaseServiceKey));
  } catch (error) {
    console.error('Error initializing Supabase admin client:', error);
    return null;
  }
}

// Initialize Stripe
let stripe: Stripe | null = null;
if (process.env.STRIPE_SECRET_KEY) {
  try {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-02-24.acacia',
    });
  } catch (error) {
    console.error('Error initializing Stripe:', error);
  }
}

// Initialize rate limiter
let ratelimit: Ratelimit | null = null;
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  try {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    
    ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, '1m'),
      analytics: true,
    });
  } catch (error) {
    console.error('Error initializing rate limiter:', error);
  }
}

export async function GET(request: NextRequest) {
  // Initialize Supabase client on demand
  const supabase = initSupabase();
  
  // Check if Supabase is properly initialized
  if (!supabase) {
    return NextResponse.json({ 
      message: 'Beta signup API is available but Supabase is not configured properly',
      supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    }, { status: 200 });
  }
  
  return NextResponse.json({ message: 'Beta signup API is available' }, { status: 200 });
}

export async function POST(request: NextRequest) {
  try {
    console.log('Beta signup API called');
    
    // Initialize Supabase clients on demand
    const supabase = initSupabase();
    const supabaseAdmin = initSupabaseAdmin();
    
    // Check if Supabase is properly initialized
    if (!supabase || !supabaseAdmin) {
      console.error('Supabase not properly initialized', {
        supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        supabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        supabaseServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
      });
      return NextResponse.json({ 
        error: 'Supabase not properly configured',
        details: {
          supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          supabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          supabaseServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
        }
      }, { status: 500 });
    }
    
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
    
    // Extract fields from the request, supporting both camelCase and snake_case
    const { 
      // camelCase fields (from frontend form)
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
      // snake_case fields (from direct API calls)
      first_name,
      last_name,
      activity_experience,
      adventure_style,
      social_preferences,
      equipment_status,
      weekday_preference,
      time_of_day,
      referral_source,
      additional_info,
      join_type
    } = data;

    // Use camelCase fields if available, otherwise use snake_case fields
    const firstNameValue = firstName || first_name;
    const lastNameValue = lastName || last_name;
    const emailValue = email;
    const joinTypeValue = joinType || join_type || 'waitlist';

    console.log('Extracted values:', { 
      firstNameValue, 
      lastNameValue, 
      emailValue, 
      joinTypeValue,
      firstName,
      first_name,
      lastName,
      last_name,
      joinType,
      join_type
    });

    // Validate required fields
    if (!firstNameValue || !lastNameValue || !emailValue) {
      console.error('Missing required fields:', { firstNameValue, lastNameValue, emailValue });
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if email already exists
    const { data: existingUser, error: lookupError } = await supabaseAdmin
      .from('beta_applications')
      .select('id, email, status')
      .eq('email', emailValue)
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
      first_name: firstNameValue,
      last_name: lastNameValue,
      email: emailValue,
      phone: phone || null,
      location: location || null,
      activities: activities || null,
      activity_experience: activityExperience || activity_experience || null,
      adventure_style: adventureStyle || adventure_style || null,
      social_preferences: socialPreferences || social_preferences || null,
      equipment_status: equipmentStatus || equipment_status || null,
      availability: availability || null,
      weekday_preference: weekdayPreference || weekday_preference || null,
      time_of_day: timeOfDay || time_of_day || null,
      referral_source: referralSource || referral_source || null,
      additional_info: additionalInfo || additional_info || null,
      join_type: joinTypeValue,
      status: joinTypeValue === 'paid' ? 'pending_payment' : 'waitlist',
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
      console.error('Error details:', JSON.stringify(insertError, null, 2));
      return NextResponse.json({ error: 'Failed to save user data', details: insertError }, { status: 500 });
    }

    console.log('Successfully inserted data, response:', userData);

    // Send confirmation email based on join type
    if (joinTypeValue === 'waitlist') {
      try {
        await sendWaitlistConfirmationEmail({
          email: emailValue,
          first_name: firstNameValue,
          last_name: lastNameValue
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
          email: emailValue,
          first_name: firstNameValue,
          last_name: lastNameValue
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
