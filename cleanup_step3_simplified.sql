-- Step 3 (Simplified): Copy data from the old table to the new one
-- Run this after step 2_fixed to migrate the data

-- Insert the data with the correct ID type
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