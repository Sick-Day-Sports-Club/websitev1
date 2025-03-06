-- SQL to set up proper RLS policies for the beta_applications table
-- Run this in the Supabase SQL Editor

-- First, enable RLS on the table
ALTER TABLE public.beta_applications ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (for anonymous form submissions)
CREATE POLICY "Allow public inserts" 
ON public.beta_applications
FOR INSERT 
TO public
WITH CHECK (true);

-- Allow authenticated users to view all records
CREATE POLICY "Allow authenticated users to view records" 
ON public.beta_applications
FOR SELECT 
TO authenticated
USING (true);

-- Allow authenticated users to update records
CREATE POLICY "Allow authenticated users to update records" 
ON public.beta_applications
FOR UPDATE 
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to delete records
CREATE POLICY "Allow authenticated users to delete records" 
ON public.beta_applications
FOR DELETE 
TO authenticated
USING (true);

-- Allow dashboard access for viewing records (optional - uncomment if you want to see records in the dashboard without being authenticated)
-- CREATE POLICY "Allow dashboard access" 
-- ON public.beta_applications
-- FOR SELECT
-- TO public
-- USING (true);

-- Note: The service role key automatically bypasses RLS, so no specific policy is needed for it 