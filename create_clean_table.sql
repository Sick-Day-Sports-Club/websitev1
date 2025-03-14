-- SQL to create a clean new beta_applications table
-- Run this in the Supabase SQL Editor

-- First, drop any existing indexes that might cause conflicts
DROP INDEX IF EXISTS idx_beta_applications_email;
DROP INDEX IF EXISTS idx_beta_applications_status;
DROP INDEX IF EXISTS idx_beta_applications_join_type;
DROP INDEX IF EXISTS idx_beta_applications_created_at;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_beta_applications_updated_at ON beta_applications;

-- First, rename the existing table to keep it as a backup
ALTER TABLE IF EXISTS beta_applications RENAME TO beta_applications_old;

-- Create a new clean table with the correct structure
CREATE TABLE beta_applications (
    id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    location TEXT,
    activities JSONB,
    activity_experience JSONB,
    adventure_style TEXT CHECK (
        adventure_style IN ('solo', 'self-guided-group', 'guided', 'flexible')
    ),
    social_preferences JSONB,
    equipment_status JSONB,
    availability TEXT[],
    weekday_preference TEXT[],
    time_of_day TEXT[],
    referral_source TEXT,
    additional_info TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (
        status IN ('pending', 'approved', 'rejected', 'waitlist', 'pending_payment')
    ),
    join_type TEXT NOT NULL CHECK (
        join_type IN ('beta', 'waitlist', 'paid')
    ),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create the updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_beta_applications_updated_at
    BEFORE UPDATE ON beta_applications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_beta_applications_email ON beta_applications(email);
CREATE INDEX idx_beta_applications_status ON beta_applications(status);
CREATE INDEX idx_beta_applications_join_type ON beta_applications(join_type);
CREATE INDEX idx_beta_applications_created_at ON beta_applications(created_at);

-- Set column comments for better display in the dashboard
COMMENT ON COLUMN beta_applications.first_name IS 'First Name';
COMMENT ON COLUMN beta_applications.last_name IS 'Last Name';
COMMENT ON COLUMN beta_applications.email IS 'Email Address';
COMMENT ON COLUMN beta_applications.phone IS 'Phone Number';
COMMENT ON COLUMN beta_applications.location IS 'Location';
COMMENT ON COLUMN beta_applications.activities IS 'Activities';
COMMENT ON COLUMN beta_applications.activity_experience IS 'Activity Experience';
COMMENT ON COLUMN beta_applications.adventure_style IS 'Adventure Style';
COMMENT ON COLUMN beta_applications.social_preferences IS 'Social Preferences';
COMMENT ON COLUMN beta_applications.equipment_status IS 'Equipment Status';
COMMENT ON COLUMN beta_applications.availability IS 'Availability';
COMMENT ON COLUMN beta_applications.weekday_preference IS 'Weekday Preference';
COMMENT ON COLUMN beta_applications.time_of_day IS 'Time of Day';
COMMENT ON COLUMN beta_applications.referral_source IS 'Referral Source';
COMMENT ON COLUMN beta_applications.additional_info IS 'Additional Info';
COMMENT ON COLUMN beta_applications.status IS 'Status';
COMMENT ON COLUMN beta_applications.join_type IS 'Join Type';
COMMENT ON COLUMN beta_applications.created_at IS 'Created At';
COMMENT ON COLUMN beta_applications.updated_at IS 'Updated At';

-- Apply RLS policies
ALTER TABLE beta_applications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public inserts" ON beta_applications;
DROP POLICY IF EXISTS "Allow public to view all records" ON beta_applications;
DROP POLICY IF EXISTS "Allow authenticated users to update records" ON beta_applications;
DROP POLICY IF EXISTS "Allow authenticated users to delete records" ON beta_applications;

-- Allow public inserts (for anonymous form submissions)
CREATE POLICY "Allow public inserts" 
ON beta_applications
FOR INSERT 
TO public
WITH CHECK (true);

-- Allow public to view all records (for dashboard access)
CREATE POLICY "Allow public to view all records" 
ON beta_applications
FOR SELECT 
TO public
USING (true);

-- Allow authenticated users to update records
CREATE POLICY "Allow authenticated users to update records" 
ON beta_applications
FOR UPDATE 
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to delete records
CREATE POLICY "Allow authenticated users to delete records" 
ON beta_applications
FOR DELETE 
TO authenticated
USING (true); 