-- SQL to fix RLS policies for the beta_applications table
-- Run this in the Supabase SQL Editor

-- First, drop all existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow public inserts" ON public.beta_applications;
DROP POLICY IF EXISTS "Allow authenticated users to view records" ON public.beta_applications;
DROP POLICY IF EXISTS "Allow authenticated users to update records" ON public.beta_applications;
DROP POLICY IF EXISTS "Allow authenticated users to delete records" ON public.beta_applications;
DROP POLICY IF EXISTS "Allow inserts for all users" ON public.beta_applications;
DROP POLICY IF EXISTS "Allow select for admins" ON public.beta_applications;
DROP POLICY IF EXISTS "Allow users to view own applications" ON public.beta_applications;
DROP POLICY IF EXISTS "Allow updates for admins" ON public.beta_applications;
DROP POLICY IF EXISTS "Allow insert for authenticated users only" ON public.beta_applications;
DROP POLICY IF EXISTS "Allow select for authenticated users only" ON public.beta_applications;
DROP POLICY IF EXISTS "Allow update for authenticated users only" ON public.beta_applications;
DROP POLICY IF EXISTS "Allow dashboard access" ON public.beta_applications;

-- Make sure RLS is enabled
ALTER TABLE public.beta_applications ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (for anonymous form submissions)
CREATE POLICY "Allow public inserts" 
ON public.beta_applications
FOR INSERT 
TO public
WITH CHECK (true);

-- Allow public to view all records (for dashboard access)
CREATE POLICY "Allow public to view all records" 
ON public.beta_applications
FOR SELECT 
TO public
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

-- Note: The service role key automatically bypasses RLS, so no specific policy is needed for it 