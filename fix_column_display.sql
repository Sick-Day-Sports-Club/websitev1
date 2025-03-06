-- SQL to fix column display names in the Supabase dashboard
-- Run this in the Supabase SQL Editor

-- First, let's check which columns actually exist in the table
SELECT column_name 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'beta_applications'
ORDER BY ordinal_position;

-- Set column comments to ensure proper display in the dashboard
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

-- Alternatively, if you want to completely remove the camelCase columns from the dashboard view,
-- you can create a view that only includes the snake_case columns:

/*
CREATE OR REPLACE VIEW beta_applications_view AS
SELECT
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
  created_at
FROM beta_applications;

-- Grant permissions on the view
GRANT SELECT ON beta_applications_view TO authenticated;
GRANT SELECT ON beta_applications_view TO service_role;
*/ 