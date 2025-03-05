-- Update beta_applications table with new fields
ALTER TABLE beta_applications
ADD COLUMN IF NOT EXISTS emergency_contact JSONB,
ADD COLUMN IF NOT EXISTS profile_photo_url TEXT,
ADD COLUMN IF NOT EXISTS activity_experience JSONB,
ADD COLUMN IF NOT EXISTS adventure_style TEXT CHECK (adventure_style IN ('solo', 'self-guided-group', 'guided', 'flexible')),
ADD COLUMN IF NOT EXISTS social_preferences JSONB,
ADD COLUMN IF NOT EXISTS equipment_status JSONB,
ADD COLUMN IF NOT EXISTS weekday_preference TEXT[],
ADD COLUMN IF NOT EXISTS time_of_day TEXT[],
ADD COLUMN IF NOT EXISTS referral_source TEXT,
ADD COLUMN IF NOT EXISTS additional_info TEXT,
ADD COLUMN IF NOT EXISTS status TEXT CHECK (status IN ('pending', 'approved', 'rejected', 'waitlist')),
ADD COLUMN IF NOT EXISTS join_type TEXT CHECK (join_type IN ('beta', 'waitlist')),
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_beta_applications_status ON beta_applications(status);
CREATE INDEX IF NOT EXISTS idx_beta_applications_join_type ON beta_applications(join_type);
CREATE INDEX IF NOT EXISTS idx_beta_applications_created_at ON beta_applications(created_at);

-- Add RLS policies
ALTER TABLE beta_applications ENABLE ROW LEVEL SECURITY;

-- Allow insert from authenticated users only
CREATE POLICY "Allow insert for authenticated users only"
    ON beta_applications FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Allow select for authenticated users only
CREATE POLICY "Allow select for authenticated users only"
    ON beta_applications FOR SELECT
    TO authenticated
    USING (true);

-- Allow update for authenticated users only
CREATE POLICY "Allow update for authenticated users only"
    ON beta_applications FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true); 