-- Step 6: Swap the tables
-- ONLY run this after verifying that beta_applications_new contains all the correct data

-- Drop the old table
DROP TABLE beta_applications;

-- Rename the new table
ALTER TABLE beta_applications_new RENAME TO beta_applications;

-- Rename the backup table
ALTER TABLE beta_applications_backup RENAME TO beta_applications_old_backup;

-- Rename the trigger to match the new table name
ALTER TRIGGER update_beta_applications_new_updated_at ON beta_applications RENAME TO update_beta_applications_updated_at;

-- Rename the indexes to match the new table name
ALTER INDEX idx_beta_applications_new_email RENAME TO idx_beta_applications_email;
ALTER INDEX idx_beta_applications_new_status RENAME TO idx_beta_applications_status;
ALTER INDEX idx_beta_applications_new_created_at RENAME TO idx_beta_applications_created_at; 