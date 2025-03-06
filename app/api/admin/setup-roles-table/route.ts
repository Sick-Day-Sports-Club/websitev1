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
      const { error: createError } = await supabase.rpc('exec_sql', {
        sql_string: `
          CREATE TABLE IF NOT EXISTS user_roles (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
            role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(user_id, role)
          );
          
          -- Add RLS policies
          ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
          
          -- Policy for admins to read all roles
          CREATE POLICY IF NOT EXISTS "Admins can read all roles"
            ON user_roles
            FOR SELECT
            USING (
              auth.uid() IN (
                SELECT user_id FROM user_roles WHERE role = 'admin'
              )
            );
          
          -- Policy for users to read their own roles
          CREATE POLICY IF NOT EXISTS "Users can read their own roles"
            ON user_roles
            FOR SELECT
            USING (auth.uid() = user_id);
          
          -- Policy for service role to manage roles
          CREATE POLICY IF NOT EXISTS "Service role can manage roles"
            ON user_roles
            USING (true)
            WITH CHECK (true);
        `
      });

      if (createError) {
        console.error('Error creating user_roles table:', createError);
        
        // Try an alternative approach if the RPC method fails
        try {
          // This is a workaround and should be replaced with a proper migration
          const { error: altError } = await supabase.auth.admin.createUser({
            email: 'temp@example.com',
            password: 'tempPassword123!',
            email_confirm: true
          });
          
          if (altError) {
            console.error('Error with alternative approach:', altError);
            return NextResponse.json(
              { error: 'Failed to create user_roles table' },
              { status: 500 }
            );
          }
          
          console.log('Created temporary user, now attempting to create user_roles table');
          
          // Now try to create the table again
          // This is just a placeholder - in a real app, you would use migrations
          
          return NextResponse.json(
            { message: 'Please run the SQL from docs/setup-admin-user.md in the Supabase dashboard' },
            { status: 200 }
          );
        } catch (err) {
          console.error('Error with alternative approach:', err);
          return NextResponse.json(
            { error: 'Failed to create user_roles table' },
            { status: 500 }
          );
        }
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