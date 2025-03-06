-- SQL to clean up the beta_applications table by removing duplicate columns
-- Run this in the Supabase SQL Editor

-- First, let's check all columns in the table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'beta_applications'
ORDER BY ordinal_position;

-- Create a backup of the table before making changes
CREATE TABLE IF NOT EXISTS beta_applications_backup AS 
SELECT * FROM beta_applications;

-- Now let's clean up the table by standardizing on snake_case columns
-- We'll create a new table with the correct structure and copy the data over

-- Step 1: Create a new table with the correct structure
CREATE TABLE beta_applications_new (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    location TEXT NOT NULL,
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

-- Step 2: Copy data from the old table to the new table, merging duplicate columns
INSERT INTO beta_applications_new (
    id,
    first_name,
    last_name,
    email,
    phone,
    location,
    activities,
    activity_experience,
    adventure_style,
    social_preferences,
    equipment_status,
    availability,
    weekday_preference,
    time_of_day,
    referral_source,
    additional_info,
    status,
    join_type,
    created_at,
    updated_at
)
SELECT 
    id,
    COALESCE(first_name, "firstName") AS first_name,
    COALESCE(last_name, "lastName") AS last_name,
    email,
    phone,
    location,
    CASE 
        WHEN activities IS NOT NULL AND jsonb_typeof(to_jsonb(activities)) = 'array' THEN to_jsonb(activities)
        ELSE NULL
    END AS activities,
    activity_experience,
    adventure_style,
    social_preferences,
    equipment_status,
    CASE 
        WHEN availability IS NOT NULL AND array_length(availability, 1) > 0 THEN availability
        ELSE ARRAY[]::TEXT[]
    END AS availability,
    CASE 
        WHEN weekday_preference IS NOT NULL AND array_length(weekday_preference, 1) > 0 THEN weekday_preference
        ELSE ARRAY[]::TEXT[]
    END AS weekday_preference,
    CASE 
        WHEN time_of_day IS NOT NULL AND array_length(time_of_day, 1) > 0 THEN time_of_day
        ELSE ARRAY[]::TEXT[]
    END AS time_of_day,
    COALESCE(referral_source, "referralSource") AS referral_source,
    COALESCE(additional_info, "additionalInfo") AS additional_info,
    status,
    join_type,
    created_at,
    COALESCE(updated_at, created_at) AS updated_at
FROM beta_applications;

-- Step 3: Create the updated_at trigger for the new table
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_beta_applications_new_updated_at
    BEFORE UPDATE ON beta_applications_new
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Step 4: Create indexes on the new table
CREATE INDEX IF NOT EXISTS idx_beta_applications_new_email ON beta_applications_new(email);
CREATE INDEX IF NOT EXISTS idx_beta_applications_new_status ON beta_applications_new(status);
CREATE INDEX IF NOT EXISTS idx_beta_applications_new_join_type ON beta_applications_new(join_type);
CREATE INDEX IF NOT EXISTS idx_beta_applications_new_created_at ON beta_applications_new(created_at);

-- Step 5: Set column comments for better display in the dashboard
COMMENT ON COLUMN beta_applications_new.first_name IS 'First Name';
COMMENT ON COLUMN beta_applications_new.last_name IS 'Last Name';
COMMENT ON COLUMN beta_applications_new.email IS 'Email Address';
COMMENT ON COLUMN beta_applications_new.phone IS 'Phone Number';
COMMENT ON COLUMN beta_applications_new.location IS 'Location';
COMMENT ON COLUMN beta_applications_new.activities IS 'Activities';
COMMENT ON COLUMN beta_applications_new.activity_experience IS 'Activity Experience';
COMMENT ON COLUMN beta_applications_new.adventure_style IS 'Adventure Style';
COMMENT ON COLUMN beta_applications_new.social_preferences IS 'Social Preferences';
COMMENT ON COLUMN beta_applications_new.equipment_status IS 'Equipment Status';
COMMENT ON COLUMN beta_applications_new.availability IS 'Availability';
COMMENT ON COLUMN beta_applications_new.weekday_preference IS 'Weekday Preference';
COMMENT ON COLUMN beta_applications_new.time_of_day IS 'Time of Day';
COMMENT ON COLUMN beta_applications_new.referral_source IS 'Referral Source';
COMMENT ON COLUMN beta_applications_new.additional_info IS 'Additional Info';
COMMENT ON COLUMN beta_applications_new.status IS 'Status';
COMMENT ON COLUMN beta_applications_new.join_type IS 'Join Type';
COMMENT ON COLUMN beta_applications_new.created_at IS 'Created At';
COMMENT ON COLUMN beta_applications_new.updated_at IS 'Updated At';

-- Step 6: Apply RLS policies to the new table
ALTER TABLE beta_applications_new ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (for anonymous form submissions)
CREATE POLICY "Allow public inserts" 
ON beta_applications_new
FOR INSERT 
TO public
WITH CHECK (true);

-- Allow public to view all records (for dashboard access)
CREATE POLICY "Allow public to view all records" 
ON beta_applications_new
FOR SELECT 
TO public
USING (true);

-- Allow authenticated users to update records
CREATE POLICY "Allow authenticated users to update records" 
ON beta_applications_new
FOR UPDATE 
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to delete records
CREATE POLICY "Allow authenticated users to delete records" 
ON beta_applications_new
FOR DELETE 
TO authenticated
USING (true);

-- Step 7: Swap the tables (UNCOMMENT THESE LINES AFTER VERIFYING THE NEW TABLE IS CORRECT)
/*
DROP TABLE beta_applications;
ALTER TABLE beta_applications_new RENAME TO beta_applications;
ALTER TABLE beta_applications_backup RENAME TO beta_applications_old_backup;

-- Rename the trigger to match the new table name
ALTER TRIGGER update_beta_applications_new_updated_at ON beta_applications RENAME TO update_beta_applications_updated_at;

-- Rename the indexes to match the new table name
ALTER INDEX idx_beta_applications_new_email RENAME TO idx_beta_applications_email;
ALTER INDEX idx_beta_applications_new_status RENAME TO idx_beta_applications_status;
ALTER INDEX idx_beta_applications_new_join_type RENAME TO idx_beta_applications_join_type;
ALTER INDEX idx_beta_applications_new_created_at RENAME TO idx_beta_applications_created_at;
*/

-- IMPORTANT: After running this script, verify that beta_applications_new contains all the correct data
-- Then uncomment and run the Step 7 commands to swap the tables 