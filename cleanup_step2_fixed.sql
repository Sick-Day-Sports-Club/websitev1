-- Step 2 (Fixed): Create a new table with the correct structure
-- Run this after step 1 to create a clean table

-- Create a new table with the correct structure and bigint ID
CREATE TABLE beta_applications_new (
    id bigint PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    email TEXT UNIQUE,
    phone TEXT,
    location TEXT,
    activities JSONB,
    activity_experience JSONB,
    adventure_style TEXT,
    social_preferences JSONB,
    equipment_status JSONB,
    availability TEXT[],
    weekday_preference TEXT[],
    time_of_day TEXT[],
    referral_source TEXT,
    additional_info TEXT,
    status TEXT,
    join_type TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create the updated_at trigger for the new table
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