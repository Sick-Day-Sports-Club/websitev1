-- SQL to enable RLS and add a policy to allow service_role to access all data
-- Run this in the Supabase SQL Editor

-- Enable RLS on beta_applications table (if not already enabled)
ALTER TABLE public.beta_applications ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow service_role to access all data
CREATE POLICY "Allow service_role full access" 
ON public.beta_applications
USING (true)
WITH CHECK (true);

-- Create a policy to allow authenticated users to view all data
CREATE POLICY "Allow authenticated users to view all data" 
ON public.beta_applications
FOR SELECT
USING (auth.role() = 'authenticated');

-- Create a policy to allow dashboard access
CREATE POLICY "Allow dashboard access" 
ON public.beta_applications
FOR SELECT
USING (true); 