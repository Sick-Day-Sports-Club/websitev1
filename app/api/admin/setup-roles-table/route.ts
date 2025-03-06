import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    // Verify environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing required environment variables');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Create Supabase client with service role key
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Check if user_roles table exists
    const { data: tableExists, error: checkError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'user_roles')
      .single();

    if (checkError) {
      console.log('Error checking if table exists, attempting to create it anyway');
    }

    if (!tableExists) {
      console.log('user_roles table does not exist, creating it');
      
      // Create the user_roles table
      try {
        // Try to create the table directly using the REST API
        const createTableResponse = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY || '',
            'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY || ''}`,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            query: `
              CREATE TABLE IF NOT EXISTS user_roles (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                user_id UUID NOT NULL,
                role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                UNIQUE(user_id, role)
              );
            `
          })
        });
        
        if (!createTableResponse.ok) {
          console.error('Error creating user_roles table via REST API');
          
          // Fallback: Try to create the table using the Supabase client
          const { error: createError } = await supabase
            .from('user_roles')
            .insert([{ 
              user_id: '00000000-0000-0000-0000-000000000000', 
              role: 'admin' 
            }])
            .select();
            
          if (createError && !createError.message.includes('already exists')) {
            console.error('Error creating user_roles table via insert:', createError);
            return NextResponse.json(
              { error: 'Failed to create user_roles table' },
              { status: 500 }
            );
          }
        }
      } catch (error) {
        console.error('Unexpected error creating table:', error);
        return NextResponse.json(
          { error: 'Failed to create user_roles table' },
          { status: 500 }
        );
      }
    }

    // Get the current user if provided in the request
    const userId = request.nextUrl.searchParams.get('userId');
    
    if (userId) {
      // Assign admin role to the user
      const { error: roleError } = await supabase
        .from('user_roles')
        .upsert({
          user_id: userId,
          role: 'admin'
        });

      if (roleError) {
        console.error('Error assigning admin role:', roleError);
        return NextResponse.json(
          { error: 'Failed to assign admin role' },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { success: true, message: 'Admin role assigned successfully' },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'user_roles table is set up' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 