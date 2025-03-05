-- Create beta applications table
CREATE TABLE IF NOT EXISTS beta_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    location TEXT NOT NULL,
    activities TEXT[] NOT NULL,
    activity_experience JSONB NOT NULL,
    adventure_style TEXT NOT NULL CHECK (
        adventure_style IN ('solo', 'self-guided-group', 'guided', 'flexible')
    ),
    social_preferences JSONB NOT NULL,
    equipment_status JSONB NOT NULL,
    availability TEXT[] NOT NULL,
    weekday_preference TEXT[] NOT NULL,
    time_of_day TEXT[] NOT NULL,
    referral_source TEXT,
    additional_info TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (
        status IN ('pending', 'approved', 'rejected', 'waitlist')
    ),
    join_type TEXT NOT NULL CHECK (
        join_type IN ('beta', 'waitlist')
    ),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create updated_at trigger
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

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_beta_applications_email ON beta_applications(email);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_beta_applications_status ON beta_applications(status);

-- Create RLS policies
ALTER TABLE beta_applications ENABLE ROW LEVEL SECURITY;

-- Allow inserts from authenticated and anonymous users
CREATE POLICY "Allow inserts for all users" ON beta_applications
    FOR INSERT TO public
    WITH CHECK (true);

-- Only allow admins to view all applications
CREATE POLICY "Allow select for admins" ON beta_applications
    FOR SELECT TO authenticated
    USING (auth.role() = 'admin');

-- Allow users to view their own applications
CREATE POLICY "Allow users to view own applications" ON beta_applications
    FOR SELECT TO public
    USING (email = auth.jwt() ->> 'email');

-- Only allow admins to update applications
CREATE POLICY "Allow updates for admins" ON beta_applications
    FOR UPDATE TO authenticated
    USING (auth.role() = 'admin')
    WITH CHECK (auth.role() = 'admin'); 