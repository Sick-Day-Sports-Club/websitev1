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
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

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

    // Make API request to create admin
    const response = await fetch(`${supabaseUrl.replace(/\/$/, '')}/api/admin/create-admin`, {
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

    const result = await response.json();

    if (!response.ok) {
      console.error('Error creating admin user:', result.error);
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