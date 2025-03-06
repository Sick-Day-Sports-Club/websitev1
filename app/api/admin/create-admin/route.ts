import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// This is a protected route that should only be called from a secure environment
// like a deployment script or admin dashboard with proper authentication
export async function POST(request: NextRequest) {
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

    // Get request body
    const { email, password, adminSecret } = await request.json();

    // Validate request
    if (!email || !password || !adminSecret) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify admin secret (this should be a strong, environment-specific secret)
    if (adminSecret !== process.env.ADMIN_CREATION_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user_roles table exists, create it if it doesn't
    try {
      // Try to create the user_roles table if it doesn't exist
      const { error: tableError } = await supabase.rpc('create_user_roles_table_if_not_exists');
      
      if (tableError) {
        console.log('Creating user_roles table manually...');
        // If the RPC doesn't exist, create the table manually
        // Skip the SQL execution for now and just try to use the table
        // The table should be created through migrations in production
        console.log('Skipping table creation - please run migrations manually');
      }
    } catch (error) {
      console.error('Error checking/creating user_roles table:', error);
      // Continue anyway, as the table might already exist
    }

    // Check if user already exists
    const { data: existingUsers, error: queryError } = await supabase
      .from('auth.users')
      .select('id')
      .eq('email', email);

    if (queryError) {
      console.log('Error querying auth.users, trying alternative approach');
      // Try a different approach to find the user
      const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.error('Error listing users:', authError);
        return NextResponse.json(
          { error: 'Failed to check if user exists' },
          { status: 500 }
        );
      }
      
      const existingUser = users.find(u => u.email === email);
      
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
        
        // Add admin role
        const { error: roleError } = await supabase
          .from('user_roles')
          .upsert({
            user_id: existingUser.id,
            role: 'admin'
          });

        if (roleError) {
          console.error('Error adding admin role:', roleError);
          return NextResponse.json(
            { error: 'Failed to assign admin role' },
            { status: 500 }
          );
        }
        
        return NextResponse.json(
          { success: true, message: 'Admin user updated successfully' },
          { status: 200 }
        );
      }
    } else if (existingUsers && existingUsers.length > 0) {
      const userId = existingUsers[0].id;
      console.log(`User ${email} already exists, updating password`);
      
      // Update password for existing user
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        userId,
        { password }
      );

      if (updateError) {
        console.error('Error updating user:', updateError);
        return NextResponse.json(
          { error: 'Failed to update user' },
          { status: 500 }
        );
      }
      
      // Add admin role
      const { error: roleError } = await supabase
        .from('user_roles')
        .upsert({
          user_id: userId,
          role: 'admin'
        });

      if (roleError) {
        console.error('Error adding admin role:', roleError);
        return NextResponse.json(
          { error: 'Failed to assign admin role' },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { success: true, message: 'Admin user updated successfully' },
        { status: 200 }
      );
    }

    // Create new user
    console.log('Creating new user:', email);
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

    console.log('User created successfully, adding admin role');
    // Add admin role
    const { error: roleError } = await supabase
      .from('user_roles')
      .upsert({
        user_id: newUser.user.id,
        role: 'admin'
      });

    if (roleError) {
      console.error('Error adding admin role:', roleError);
      return NextResponse.json(
        { error: 'Failed to assign admin role' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Admin user created successfully' },
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