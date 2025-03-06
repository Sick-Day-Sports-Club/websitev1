-- SQL to add the missing updated_at column to the beta_applications table
-- Run this in the Supabase SQL Editor

-- First, check if the updated_at column already exists
DO $$
DECLARE
    column_exists boolean;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'beta_applications'
        AND column_name = 'updated_at'
    ) INTO column_exists;
    
    IF NOT column_exists THEN
        -- Add the updated_at column
        ALTER TABLE beta_applications ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
        
        -- Create or replace the trigger function
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ language 'plpgsql';
        
        -- Create the trigger
        DROP TRIGGER IF EXISTS update_beta_applications_updated_at ON beta_applications;
        CREATE TRIGGER update_beta_applications_updated_at
            BEFORE UPDATE ON beta_applications
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
            
        RAISE NOTICE 'Added updated_at column and created trigger';
    ELSE
        RAISE NOTICE 'updated_at column already exists';
    END IF;
END $$;

-- Now set the column comments
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