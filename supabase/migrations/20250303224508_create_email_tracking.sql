-- Create email_tracking table
CREATE TABLE IF NOT EXISTS email_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email_id UUID NOT NULL,
    recipient TEXT NOT NULL,
    email_type TEXT NOT NULL CHECK (email_type IN ('beta', 'waitlist')),
    status TEXT NOT NULL CHECK (status IN ('sent', 'opened', 'clicked')),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_email_tracking_email_id ON email_tracking(email_id);
CREATE INDEX IF NOT EXISTS idx_email_tracking_recipient ON email_tracking(recipient);
CREATE INDEX IF NOT EXISTS idx_email_tracking_email_type ON email_tracking(email_type);
CREATE INDEX IF NOT EXISTS idx_email_tracking_status ON email_tracking(status);
CREATE INDEX IF NOT EXISTS idx_email_tracking_created_at ON email_tracking(created_at);

-- Add RLS policies
ALTER TABLE email_tracking ENABLE ROW LEVEL SECURITY;

-- Allow insert from authenticated users only
CREATE POLICY "Allow insert for authenticated users only"
    ON email_tracking FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Allow select for authenticated users only
CREATE POLICY "Allow select for authenticated users only"
    ON email_tracking FOR SELECT
    TO authenticated
    USING (true);

-- Allow update for authenticated users only
CREATE POLICY "Allow update for authenticated users only"
    ON email_tracking FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);
