# Setting Up Admin User in Supabase

Since we're having issues with the automated script, here's how to set up the admin user manually using the Supabase dashboard.

## Step 1: Create the user_roles Table

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Create a new query and paste the following SQL:

```sql
-- Create user_roles table
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
CREATE POLICY "Admins can read all roles"
  ON user_roles
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM user_roles WHERE role = 'admin'
    )
  );

-- Policy for users to read their own roles
CREATE POLICY "Users can read their own roles"
  ON user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy for service role to manage roles
CREATE POLICY "Service role can manage roles"
  ON user_roles
  USING (true)
  WITH CHECK (true);
```

4. Run the query to create the table and policies

## Step 2: Create an Admin User

1. In the Supabase dashboard, go to Authentication > Users
2. Click "Add User"
3. Enter the email and password for your admin user
4. Click "Create User"

## Step 3: Assign Admin Role

1. Go back to the SQL Editor
2. Create a new query and paste the following SQL, replacing `your-admin-email@example.com` with the email you used:

```sql
-- Get the user ID
WITH user_id_query AS (
  SELECT id FROM auth.users WHERE email = 'your-admin-email@example.com'
)
-- Insert admin role
INSERT INTO user_roles (user_id, role)
SELECT id, 'admin' FROM user_id_query
ON CONFLICT (user_id, role) DO NOTHING;
```

3. Run the query to assign the admin role

## Step 4: Verify Setup

1. Go to the Table Editor and select the `user_roles` table
2. You should see a row with the user ID and role 'admin'
3. Try logging in to your admin portal with the credentials you created

## Troubleshooting

If you encounter issues:

1. Check that the user was created successfully in Authentication > Users
2. Verify that the user_roles table was created with the correct schema
3. Make sure the RLS policies are properly set up
4. Check that the admin role was assigned correctly in the user_roles table 