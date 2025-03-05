ALTER TABLE referrals ADD COLUMN IF NOT EXISTS reward_description TEXT; ALTER TABLE referrals ADD COLUMN IF NOT EXISTS reward_constraints JSONB;
