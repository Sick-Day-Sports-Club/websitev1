-- SQL to safely fix column display names in the Supabase dashboard
-- Run this in the Supabase SQL Editor

-- First, let's check which columns actually exist in the table
SELECT column_name 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'beta_applications'
ORDER BY ordinal_position;

-- Now let's create a function to safely set column comments
DO $$
DECLARE
    column_exists boolean;
BEGIN
    -- Check and comment first_name
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'beta_applications'
        AND column_name = 'first_name'
    ) INTO column_exists;
    
    IF column_exists THEN
        EXECUTE 'COMMENT ON COLUMN beta_applications.first_name IS ''First Name''';
    END IF;
    
    -- Check and comment last_name
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'beta_applications'
        AND column_name = 'last_name'
    ) INTO column_exists;
    
    IF column_exists THEN
        EXECUTE 'COMMENT ON COLUMN beta_applications.last_name IS ''Last Name''';
    END IF;
    
    -- Check and comment email
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'beta_applications'
        AND column_name = 'email'
    ) INTO column_exists;
    
    IF column_exists THEN
        EXECUTE 'COMMENT ON COLUMN beta_applications.email IS ''Email Address''';
    END IF;
    
    -- Check and comment phone
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'beta_applications'
        AND column_name = 'phone'
    ) INTO column_exists;
    
    IF column_exists THEN
        EXECUTE 'COMMENT ON COLUMN beta_applications.phone IS ''Phone Number''';
    END IF;
    
    -- Check and comment location
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'beta_applications'
        AND column_name = 'location'
    ) INTO column_exists;
    
    IF column_exists THEN
        EXECUTE 'COMMENT ON COLUMN beta_applications.location IS ''Location''';
    END IF;
    
    -- Add more columns as needed following the same pattern
    
    -- Check and comment activities
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'beta_applications'
        AND column_name = 'activities'
    ) INTO column_exists;
    
    IF column_exists THEN
        EXECUTE 'COMMENT ON COLUMN beta_applications.activities IS ''Activities''';
    END IF;
    
    -- Check and comment activity_experience
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'beta_applications'
        AND column_name = 'activity_experience'
    ) INTO column_exists;
    
    IF column_exists THEN
        EXECUTE 'COMMENT ON COLUMN beta_applications.activity_experience IS ''Activity Experience''';
    END IF;
    
    -- Check and comment adventure_style
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'beta_applications'
        AND column_name = 'adventure_style'
    ) INTO column_exists;
    
    IF column_exists THEN
        EXECUTE 'COMMENT ON COLUMN beta_applications.adventure_style IS ''Adventure Style''';
    END IF;
    
    -- Check and comment social_preferences
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'beta_applications'
        AND column_name = 'social_preferences'
    ) INTO column_exists;
    
    IF column_exists THEN
        EXECUTE 'COMMENT ON COLUMN beta_applications.social_preferences IS ''Social Preferences''';
    END IF;
    
    -- Check and comment equipment_status
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'beta_applications'
        AND column_name = 'equipment_status'
    ) INTO column_exists;
    
    IF column_exists THEN
        EXECUTE 'COMMENT ON COLUMN beta_applications.equipment_status IS ''Equipment Status''';
    END IF;
    
    -- Check and comment availability
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'beta_applications'
        AND column_name = 'availability'
    ) INTO column_exists;
    
    IF column_exists THEN
        EXECUTE 'COMMENT ON COLUMN beta_applications.availability IS ''Availability''';
    END IF;
    
    -- Check and comment weekday_preference
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'beta_applications'
        AND column_name = 'weekday_preference'
    ) INTO column_exists;
    
    IF column_exists THEN
        EXECUTE 'COMMENT ON COLUMN beta_applications.weekday_preference IS ''Weekday Preference''';
    END IF;
    
    -- Check and comment time_of_day
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'beta_applications'
        AND column_name = 'time_of_day'
    ) INTO column_exists;
    
    IF column_exists THEN
        EXECUTE 'COMMENT ON COLUMN beta_applications.time_of_day IS ''Time of Day''';
    END IF;
    
    -- Check and comment referral_source
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'beta_applications'
        AND column_name = 'referral_source'
    ) INTO column_exists;
    
    IF column_exists THEN
        EXECUTE 'COMMENT ON COLUMN beta_applications.referral_source IS ''Referral Source''';
    END IF;
    
    -- Check and comment additional_info
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'beta_applications'
        AND column_name = 'additional_info'
    ) INTO column_exists;
    
    IF column_exists THEN
        EXECUTE 'COMMENT ON COLUMN beta_applications.additional_info IS ''Additional Info''';
    END IF;
    
    -- Check and comment status
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'beta_applications'
        AND column_name = 'status'
    ) INTO column_exists;
    
    IF column_exists THEN
        EXECUTE 'COMMENT ON COLUMN beta_applications.status IS ''Status''';
    END IF;
    
    -- Check and comment join_type
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'beta_applications'
        AND column_name = 'join_type'
    ) INTO column_exists;
    
    IF column_exists THEN
        EXECUTE 'COMMENT ON COLUMN beta_applications.join_type IS ''Join Type''';
    END IF;
    
    -- Check and comment created_at
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'beta_applications'
        AND column_name = 'created_at'
    ) INTO column_exists;
    
    IF column_exists THEN
        EXECUTE 'COMMENT ON COLUMN beta_applications.created_at IS ''Created At''';
    END IF;
    
    -- Check and comment updated_at (only if it exists)
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'beta_applications'
        AND column_name = 'updated_at'
    ) INTO column_exists;
    
    IF column_exists THEN
        EXECUTE 'COMMENT ON COLUMN beta_applications.updated_at IS ''Updated At''';
    END IF;
END $$; 