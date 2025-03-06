#!/usr/bin/env node

/**
 * This script creates an admin user in Supabase
 * 
 * Usage:
 * node scripts/create-admin.js
 * 
 * Environment variables required:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - ADMIN_EMAIL
 * - ADMIN_PASSWORD
 * - ADMIN_CREATION_SECRET
 */

const { createClient } = require('@supabase/supabase-js');
const readline = require('readline');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Load environment variables from .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  console.log(`Loading environment variables from ${envPath}`);
  const envConfig = dotenv.parse(fs.readFileSync(envPath));
  for (const key in envConfig) {
    process.env[key] = envConfig[key];
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function promptForValue(prompt, envVar) {
  return new Promise((resolve) => {
    const envValue = process.env[envVar];
    if (envValue) {
      console.log(`${prompt}: Using value from environment variable ${envVar}`);
      resolve(envValue);
      return;
    }

    rl.question(`${prompt}: `, (answer) => {
      resolve(answer);
    });
  });
}

async function createAdmin() {
  try {
    // Get required values
    const supabaseUrl = await promptForValue('Supabase URL', 'NEXT_PUBLIC_SUPABASE_URL');
    const adminEmail = await promptForValue('Admin email', 'ADMIN_EMAIL');
    const adminPassword = await promptForValue('Admin password', 'ADMIN_PASSWORD');
    const adminSecret = await promptForValue('Admin creation secret', 'ADMIN_CREATION_SECRET');

    // Validate inputs
    if (!supabaseUrl || !adminEmail || !adminPassword || !adminSecret) {
      console.error('All fields are required');
      process.exit(1);
    }

    console.log(`\nCreating admin user: ${adminEmail}`);
    console.log(`Using Supabase URL: ${supabaseUrl}`);

    // Make API request to create admin
    // Use the local development server URL instead of the Supabase URL
    const apiUrl = 'http://localhost:3000/api/admin/create-admin';
    console.log(`Calling API endpoint: ${apiUrl}`);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: adminEmail,
        password: adminPassword,
        adminSecret: adminSecret,
      }),
    });

    const responseText = await response.text();
    console.log(`API Response status: ${response.status}`);
    console.log(`API Response: ${responseText}`);
    
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (e) {
      console.error('Error parsing JSON response:', e);
      console.error('Raw response:', responseText);
      process.exit(1);
    }

    if (!response.ok) {
      console.error('Error creating admin user:', result.error || 'Unknown error');
      process.exit(1);
    }

    console.log('Admin user created successfully!');
    console.log('You can now log in to the admin portal with these credentials.');
  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  } finally {
    rl.close();
  }
}

createAdmin(); 