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

-- Create function to add admin role
CREATE OR REPLACE FUNCTION add_admin_role(admin_email TEXT)
RETURNS void AS $$
DECLARE
  user_id UUID;
BEGIN
  -- Get user ID from email
  SELECT id INTO user_id FROM auth.users WHERE email = admin_email;
  
  IF user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found', admin_email;
  END IF;
  
  -- Insert admin role
  INSERT INTO user_roles (user_id, role)
  VALUES (user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 