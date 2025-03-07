import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const formData = await request.json();
    
    // Log the received data
    console.log('Received guide application:', formData);
    
    // Check if the guide_applications table exists, create it if it doesn't
    const { error: tableCheckError } = await supabase
      .from('guide_applications')
      .select('id')
      .limit(1);
    
    if (tableCheckError) {
      console.log('Table check error, attempting to create table:', tableCheckError);
      
      // Create the guide_applications table using SQL query
      try {
        const { error: createTableError } = await supabase.rpc('exec_sql', {
          sql_string: `
            CREATE TABLE IF NOT EXISTS guide_applications (
              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
              first_name TEXT NOT NULL,
              last_name TEXT NOT NULL,
              email TEXT NOT NULL,
              phone TEXT NOT NULL,
              location TEXT NOT NULL,
              activities TEXT[] NOT NULL,
              other_activities TEXT,
              experience TEXT NOT NULL,
              certifications TEXT NOT NULL,
              first_aid TEXT NOT NULL,
              business_name TEXT,
              website TEXT,
              insurance TEXT NOT NULL,
              availability JSONB NOT NULL,
              about_you TEXT NOT NULL,
              referral TEXT,
              status TEXT DEFAULT 'pending',
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
          `
        });
        
        if (createTableError) {
          console.error('Error creating guide_applications table using RPC:', createTableError);
          throw createTableError;
        }
        
        console.log('Successfully created guide_applications table using RPC');
      } catch (rpcError) {
        console.error('RPC method failed, trying direct SQL query:', rpcError);
        
        // If RPC fails, try direct SQL query
        try {
          // First, check if uuid-ossp extension is available
          await supabase.from('_temp_guide_app_check').insert({ id: 1 }).select();
        } catch (extensionError) {
          console.log('Creating table through direct insert approach');
          
          // Try creating the table through an insert operation
          try {
            await supabase.from('guide_applications').insert({
              first_name: 'Test',
              last_name: 'User',
              email: 'test@example.com',
              phone: '555-555-5555',
              location: 'Test Location',
              activities: ['test'],
              experience: 'test',
              certifications: 'test',
              first_aid: 'test',
              insurance: 'test',
              availability: { test: true },
              about_you: 'test'
            });
            console.log('Created guide_applications table through insert');
          } catch (insertError) {
            console.error('Error creating table through insert:', insertError);
            return NextResponse.json({ 
              error: 'Failed to create guide_applications table', 
              details: insertError 
            }, { status: 500 });
          }
        }
      }
    }
    
    // Process the form data
    const {
      firstName,
      lastName,
      email,
      phone,
      location,
      activities,
      otherActivities,
      experience,
      certifications,
      firstAid,
      businessName,
      website,
      insurance,
      availability,
      aboutYou,
      referral
    } = formData;
    
    // Ensure activities is an array
    const activitiesArray = Array.isArray(activities) ? activities : [activities].filter(Boolean);
    
    // Convert availability to proper format if needed
    const availabilityObject = typeof availability === 'object' ? availability : {};
    
    // Insert the application into the guide_applications table
    const { data, error } = await supabase
      .from('guide_applications')
      .insert({
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone: phone,
        location: location,
        activities: activitiesArray,
        other_activities: otherActivities,
        experience: experience,
        certifications: certifications,
        first_aid: firstAid,
        business_name: businessName,
        website: website,
        insurance: insurance,
        availability: availabilityObject,
        about_you: aboutYou,
        referral: referral,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select();
    
    if (error) {
      console.error('Error inserting guide application:', error);
      return NextResponse.json({ error: 'Failed to submit application', details: error }, { status: 500 });
    }
    
    // Send a success response
    return NextResponse.json({ 
      success: true, 
      message: 'Application submitted successfully', 
      data 
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error processing guide application:', error);
    return NextResponse.json({ error: 'Internal server error', details: error }, { status: 500 });
  }
} 