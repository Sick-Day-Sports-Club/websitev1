-- Step 1: Diagnose the table structure
-- Run this in the Supabase SQL Editor to see what columns actually exist

-- Check all columns in the table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'beta_applications'
ORDER BY ordinal_position;

-- Create a backup of the table before making any changes
CREATE TABLE IF NOT EXISTS beta_applications_backup AS 
SELECT * FROM beta_applications; 