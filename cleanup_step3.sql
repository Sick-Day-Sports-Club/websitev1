-- Step 3: Copy data from the old table to the new one
-- Run this after step 2 to migrate the data

-- First, let's try a simple insert with just the essential columns
INSERT INTO beta_applications_new (
    id,
    email,
    created_at
)
SELECT 
    id,
    email,
    created_at
FROM beta_applications;

-- Check if the data was copied correctly
SELECT COUNT(*) FROM beta_applications;
SELECT COUNT(*) FROM beta_applications_new; 