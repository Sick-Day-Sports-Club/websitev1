-- Step 5: Finalize the table structure
-- Run this after step 4 to set up indexes and comments

-- Create indexes on the new table
CREATE INDEX IF NOT EXISTS idx_beta_applications_new_email ON beta_applications_new(email);
CREATE INDEX IF NOT EXISTS idx_beta_applications_new_status ON beta_applications_new(status);
CREATE INDEX IF NOT EXISTS idx_beta_applications_new_created_at ON beta_applications_new(created_at);

-- Set column comments for better display in the dashboard
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

-- Apply RLS policies to the new table
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