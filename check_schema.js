// Script to check the database schema
// Run with: node check_schema.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Initialize Supabase admin client with service role key for bypassing RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkSchema() {
  try {
    // Check the schema of the beta_applications table
    const { data: columns, error } = await supabaseAdmin
      .from('beta_applications')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Error fetching schema:', error);
      return;
    }

    if (columns && columns.length > 0) {
      console.log('Table schema (column names):', Object.keys(columns[0]));
    } else {
      console.log('No data found in the table');
    }

    // Check the most recent entries
    const { data: recentEntries, error: recentError } = await supabaseAdmin
      .from('beta_applications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (recentError) {
      console.error('Error fetching recent entries:', recentError);
      return;
    }

    console.log('Recent entries:', recentEntries);
  } catch (error) {
    console.error('Error checking schema:', error);
  }
}

checkSchema(); 