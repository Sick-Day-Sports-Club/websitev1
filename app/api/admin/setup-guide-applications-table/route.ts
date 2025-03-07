import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with service role key for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export async function GET(request: NextRequest) {
  try {
    console.log('Setting up guide_applications table...');
    
    // Check if the table already exists
    const { error: checkError } = await supabase
      .from('guide_applications')
      .select('id')
      .limit(1);
    
    if (!checkError) {
      console.log('guide_applications table already exists');
      return NextResponse.json({ 
        success: true, 
        message: 'guide_applications table already exists' 
      });
    }
    
    console.log('Creating guide_applications table...');
    
    // Try using SQL query via REST API
    const sqlQuery = `
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
    `;
    
    try {
      // First, try using the rpc method if available
      const { error: rpcError } = await supabase.rpc('exec_sql', {
        sql_string: sqlQuery
      });
      
      if (rpcError) {
        console.error('RPC method failed:', rpcError);
        throw rpcError;
      }
      
      console.log('Successfully created guide_applications table using RPC');
    } catch (error) {
      console.log('RPC method failed, trying direct SQL via REST API...');
      
      // If RPC fails, try direct SQL via REST API
      try {
        // Create the table using a direct SQL query via the REST API
        const response = await fetch(`${supabaseUrl}/rest/v1/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseKey}`,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            query: sqlQuery
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('REST API SQL query failed:', errorData);
          throw new Error(`REST API SQL query failed: ${JSON.stringify(errorData)}`);
        }
        
        console.log('Successfully created guide_applications table using REST API');
      } catch (restError) {
        console.error('REST API method failed:', restError);
        
        // Last resort: try creating the table by inserting a record
        console.log('Trying to create table by inserting a record...');
        
        try {
          const { error: insertError } = await supabase
            .from('guide_applications')
            .insert({
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
          
          if (insertError) {
            console.error('Insert method failed:', insertError);
            throw insertError;
          }
          
          console.log('Successfully created guide_applications table by inserting a record');
          
          // Clean up the test record
          await supabase
            .from('guide_applications')
            .delete()
            .eq('email', 'test@example.com');
            
          console.log('Cleaned up test record');
        } catch (insertError) {
          console.error('All methods failed to create the table:', insertError);
          return NextResponse.json({ 
            error: 'Failed to create guide_applications table', 
            details: insertError 
          }, { status: 500 });
        }
      }
    }
    
    // Verify the table was created
    const { data, error: verifyError } = await supabase
      .from('guide_applications')
      .select('id')
      .limit(1);
    
    if (verifyError) {
      console.error('Error verifying table creation:', verifyError);
      return NextResponse.json({ 
        error: 'Failed to verify table creation', 
        details: verifyError 
      }, { status: 500 });
    }
    
    console.log('guide_applications table created and verified');
    
    return NextResponse.json({ 
      success: true, 
      message: 'guide_applications table created successfully' 
    });
  } catch (error) {
    console.error('Error setting up guide_applications table:', error);
    return NextResponse.json({ 
      error: 'Failed to set up guide_applications table', 
      details: error 
    }, { status: 500 });
  }
} 