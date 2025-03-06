-- Step 3 (Fixed): Copy data from the old table to the new one
-- Run this after step 2 to migrate the data

-- First, let's modify the new table to match the actual ID type
ALTER TABLE beta_applications_new 
ALTER COLUMN id TYPE bigint USING id::text::bigint;

-- Now insert the data with the correct ID type
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