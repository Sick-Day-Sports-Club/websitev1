import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Activity type
const ActivitySchema = z.object({
  category: z.string(),
  subcategory: z.string()
});

// Validation schema for the form data
const betaApplicationSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().nullable(),
  location: z.string().min(1, "Location is required"),
  activities: z.array(ActivitySchema).transform(activities => 
    activities.map(a => `${a.category}|${a.subcategory}`)
  ),
  activity_experience: z.record(z.string()),
  adventure_style: z.string(),
  social_preferences: z.object({
    groupSize: z.enum(['tiny', 'small', 'medium', 'large', 'no-preference']),
    pace: z.number().min(1).max(5),
    socialVibe: z.enum(['quiet', 'casual', 'social', 'no-preference'])
  }),
  equipment_status: z.record(z.string()),
  availability: z.array(z.string()).min(1, "At least one availability option is required"),
  weekday_preference: z.array(z.string()),
  time_of_day: z.array(z.string()).min(1, "At least one time of day preference is required"),
  referral_source: z.string().nullable(),
  additional_info: z.string().nullable(),
  status: z.enum(['pending', 'approved', 'rejected', 'waitlist']).optional().default('pending'),
  join_type: z.enum(['beta-basic', 'beta-better', 'beta-bomber', 'waitlist'])
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received data:', body); // Add logging
    
    // Validate the request body
    const validatedData = betaApplicationSchema.parse(body);
    console.log('Validated data:', validatedData); // Add logging

    // Check for existing application with same email
    const { data: existingApplication } = await supabase
      .from('beta_applications')
      .select('id, email')
      .eq('email', validatedData.email)
      .single();

    if (existingApplication) {
      return NextResponse.json(
        { error: 'An application with this email already exists' },
        { status: 409 }
      );
    }

    // Map frontend join_type values to database-compatible values
    let dbJoinType = 'waitlist';
    if (validatedData.join_type === 'beta-basic' || 
        validatedData.join_type === 'beta-better' || 
        validatedData.join_type === 'beta-bomber') {
      dbJoinType = 'beta';
    }

    // Set status based on join type
    const dataToInsert = {
      ...validatedData,
      join_type: dbJoinType,
      status: validatedData.join_type === 'waitlist' ? 'waitlist' : 'pending'
    };

    // Insert the application
    const { data, error } = await supabase
      .from('beta_applications')
      .insert([dataToInsert])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to submit application' },
        { status: 500 }
      );
    }

    // Return different response for waitlist vs paid memberships
    if (validatedData.join_type === 'waitlist') {
      return NextResponse.json(
        { 
          message: 'Successfully joined waitlist',
          data: data 
        },
        { status: 201 }
      );
    }

    return NextResponse.json(
      { 
        message: 'Application submitted successfully',
        data: data 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error processing request:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid application data',
          details: error.errors 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 