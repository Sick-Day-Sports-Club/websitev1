const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Testing build process locally...');

// Step 1: Run the disable-api-routes.js script
console.log('\n=== Step 1: Disabling API routes ===');
require('./disable-api-routes.js');

// Step 2: Check if the API routes were properly disabled
console.log('\n=== Step 2: Checking if API routes were disabled ===');
const testSupabasePath = path.join(__dirname, '../app/api/test-supabase/route.ts');
const betaSignupPath = path.join(__dirname, '../app/api/beta-signup/route.ts');

if (fs.existsSync(testSupabasePath)) {
  const testSupabaseContent = fs.readFileSync(testSupabasePath, 'utf8');
  console.log('test-supabase route content:', testSupabaseContent.substring(0, 200) + '...');
  console.log('Is mock implementation:', testSupabaseContent.includes('Mock Supabase connection test for build process'));
} else {
  console.log('test-supabase route not found!');
}

if (fs.existsSync(betaSignupPath)) {
  const betaSignupContent = fs.readFileSync(betaSignupPath, 'utf8');
  console.log('beta-signup route content:', betaSignupContent.substring(0, 200) + '...');
  console.log('Is mock implementation:', betaSignupContent.includes('Mock beta signup for build process'));
} else {
  console.log('beta-signup route not found!');
}

// Step 3: Run the restore-api-routes.js script
console.log('\n=== Step 3: Restoring API routes ===');
require('./restore-api-routes.js');

// Step 4: Check if the API routes were properly restored
console.log('\n=== Step 4: Checking if API routes were restored ===');

if (fs.existsSync(testSupabasePath)) {
  const testSupabaseContent = fs.readFileSync(testSupabasePath, 'utf8');
  console.log('test-supabase route content:', testSupabaseContent.substring(0, 200) + '...');
  console.log('Is mock implementation:', testSupabaseContent.includes('Mock Supabase connection test for build process'));
} else {
  console.log('test-supabase route not found!');
}

if (fs.existsSync(betaSignupPath)) {
  const betaSignupContent = fs.readFileSync(betaSignupPath, 'utf8');
  console.log('beta-signup route content:', betaSignupContent.substring(0, 200) + '...');
  console.log('Is mock implementation:', betaSignupContent.includes('Mock beta signup for build process'));
} else {
  console.log('beta-signup route not found!');
}

console.log('\nTest completed!'); 