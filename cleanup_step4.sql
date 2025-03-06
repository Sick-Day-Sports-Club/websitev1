-- Step 4: Update the new table with additional data
-- Run this after step 3 to fill in the remaining columns

-- Update first_name and last_name
UPDATE beta_applications_new n
SET 
    first_name = COALESCE(o.first_name, o."firstName"),
    last_name = COALESCE(o.last_name, o."lastName")
FROM beta_applications o
WHERE n.id = o.id;

-- Update other columns
UPDATE beta_applications_new n
SET 
    phone = o.phone,
    location = o.location,
    status = o.status,
    join_type = o.join_type
FROM beta_applications o
WHERE n.id = o.id;

-- Update JSON columns
UPDATE beta_applications_new n
SET 
    activity_experience = o.activity_experience,
    social_preferences = o.social_preferences,
    equipment_status = o.equipment_status
FROM beta_applications o
WHERE n.id = o.id;

-- Update array columns if they exist
UPDATE beta_applications_new n
SET 
    availability = o.availability
FROM beta_applications o
WHERE n.id = o.id
AND o.availability IS NOT NULL;

UPDATE beta_applications_new n
SET 
    weekday_preference = o.weekday_preference
FROM beta_applications o
WHERE n.id = o.id
AND o.weekday_preference IS NOT NULL;

UPDATE beta_applications_new n
SET 
    time_of_day = o.time_of_day
FROM beta_applications o
WHERE n.id = o.id
AND o.time_of_day IS NOT NULL;

-- Update text columns that might be in either format
UPDATE beta_applications_new n
SET 
    referral_source = COALESCE(o.referral_source, o."referralSource"),
    additional_info = COALESCE(o.additional_info, o."additionalInfo"),
    adventure_style = o.adventure_style
FROM beta_applications o
WHERE n.id = o.id;

-- Check the data
SELECT * FROM beta_applications_new LIMIT 5; 