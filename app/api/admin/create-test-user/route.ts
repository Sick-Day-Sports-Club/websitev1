import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// This is a development-only route to create a test user
// It should be disabled or removed in production
export async function GET(request: NextRequest) {
  // Only allow in development mode
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'This endpoint is only available in development mode' },
      { status: 403 }
    );
  }

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

    // Get email and password from query params or use defaults
    const email = request.nextUrl.searchParams.get('email') || 'admin@sickdaysportsclub.com';
    const password = request.nextUrl.searchParams.get('password') || 'Admin123!';

    console.log(`Creating test user with email: ${email}`);

    // Check if user already exists
    const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error('Error listing users:', listError);
      return NextResponse.json(
        { error: 'Failed to check if user exists' },
        { status: 500 }
      );
    }

    const existingUser = existingUsers.users.find(u => u.email === email);
    
    if (existingUser) {
      console.log(`User ${email} already exists, updating password`);
      
      // Update password for existing user
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        existingUser.id,
        { password }
      );

      if (updateError) {
        console.error('Error updating user:', updateError);
        return NextResponse.json(
          { error: 'Failed to update user' },
          { status: 500 }
        );
      }

      // Ensure user is confirmed
      if (!existingUser.email_confirmed_at) {
        const { error: confirmError } = await supabase.auth.admin.updateUserById(
          existingUser.id,
          { email_confirm: true }
        );

        if (confirmError) {
          console.error('Error confirming user email:', confirmError);
        }
      }

      // Try to create user_roles table and assign admin role
      try {
        // Check if user_roles table exists
        const { data: tableExists, error: checkError } = await supabase
          .from('information_schema.tables')
          .select('table_name')
          .eq('table_schema', 'public')
          .eq('table_name', 'user_roles')
          .single();

        if (checkError || !tableExists) {
          console.log('Creating user_roles table');
          
          // Create the user_roles table
          const { error: createTableError } = await supabase.rpc('exec_sql', {
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

          if (createTableError) {
            console.error('Error creating user_roles table:', createTableError);
            // Continue anyway, as we'll try to insert the role
          }
        }

        // Assign admin role
        const { error: roleError } = await supabase
          .from('user_roles')
          .upsert({
            user_id: existingUser.id,
            role: 'admin'
          });

        if (roleError) {
          console.error('Error assigning admin role:', roleError);
          // Continue anyway, as the user was created/updated
        }
      } catch (err) {
        console.error('Error setting up user_roles:', err);
        // Continue anyway, as the user was created/updated
      }

      return NextResponse.json(
        { 
          success: true, 
          message: 'Test user updated successfully',
          user: {
            id: existingUser.id,
            email: existingUser.email,
            password: '(hidden for security)'
          }
        },
        { status: 200 }
      );
    }

    // Create new user
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });

    if (createError || !newUser?.user) {
      console.error('Error creating user:', createError);
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }

    // Try to create user_roles table and assign admin role
    try {
      // Check if user_roles table exists
      const { data: tableExists, error: checkError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .eq('table_name', 'user_roles')
        .single();

      if (checkError || !tableExists) {
        console.log('Creating user_roles table');
        
        // Create the user_roles table
        const { error: createTableError } = await supabase.rpc('exec_sql', {
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

        if (createTableError) {
          console.error('Error creating user_roles table:', createTableError);
          // Continue anyway, as we'll try to insert the role
        }
      }

      // Assign admin role
      const { error: roleError } = await supabase
        .from('user_roles')
        .upsert({
          user_id: newUser.user.id,
          role: 'admin'
        });

      if (roleError) {
        console.error('Error assigning admin role:', roleError);
        // Continue anyway, as the user was created
      }
    } catch (err) {
      console.error('Error setting up user_roles:', err);
      // Continue anyway, as the user was created
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Test user created successfully',
        user: {
          id: newUser.user.id,
          email: newUser.user.email,
          password: '(hidden for security)'
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 