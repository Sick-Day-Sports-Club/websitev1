# Checking Admin User Status in Supabase

Use these SQL queries in the Supabase SQL Editor to check the status of your admin user.

## Check if the User Exists

```sql
-- Replace 'your-admin-email@example.com' with your admin email
SELECT id, email, confirmed_at, last_sign_in_at
FROM auth.users
WHERE email = 'your-admin-email@example.com';
```

If this query returns a row, the user exists in Supabase. Note the `id` value as you'll need it for the next query.

## Check if the user_roles Table Exists

```sql
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public'
   AND table_name = 'user_roles'
);
```

This should return `true` if the table exists.

## Check if the User Has Admin Role

```sql
-- Replace 'user-id-from-previous-query' with the actual user ID
SELECT * FROM user_roles
WHERE user_id = 'user-id-from-previous-query';
```

If this query returns a row with `role = 'admin'`, the user has admin privileges.

## Create the user_roles Table if it Doesn't Exist

If the table doesn't exist, run the SQL from the `setup-admin-user.md` file to create it:

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

## Assign Admin Role to User

If the user exists but doesn't have the admin role, run this SQL:

```sql
-- Replace with the actual user ID
INSERT INTO user_roles (user_id, role)
VALUES ('user-id-from-previous-query', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
```

## Create User if Needed

If the user doesn't exist, you'll need to create them through the Supabase dashboard:
1. Go to Authentication > Users
2. Click "Add User"
3. Enter the email and password
4. Click "Create User"

Then run the SQL above to assign the admin role. 