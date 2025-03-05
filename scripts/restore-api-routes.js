const fs = require('fs');
const path = require('path');

const apiDir = path.join(__dirname, '../app/api');
const backupDir = path.join(__dirname, '../.api-backups');

console.log('Restoring original API routes from backups...');

// Function to restore a file from backup
function restoreFile(backupPath, originalPath) {
  if (fs.existsSync(backupPath)) {
    // Create directory if it doesn't exist
    const dir = path.dirname(originalPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Copy the file back
    fs.copyFileSync(backupPath, originalPath);
    console.log(`Restored: ${originalPath}`);
    return true;
  }
  return false;
}

// Function to recursively restore files from backup directory
function restoreFilesRecursively(currentBackupDir, relativePath = '') {
  if (!fs.existsSync(currentBackupDir)) {
    return;
  }
  
  const items = fs.readdirSync(currentBackupDir);
  
  for (const item of items) {
    const backupItemPath = path.join(currentBackupDir, item);
    const stat = fs.statSync(backupItemPath);
    
    if (stat.isDirectory()) {
      // Recursively restore files in subdirectories
      restoreFilesRecursively(
        backupItemPath, 
        path.join(relativePath, item)
      );
    } else {
      // Restore the file
      const originalPath = path.join(apiDir, relativePath, item);
      restoreFile(backupItemPath, originalPath);
    }
  }
}

// Start the restoration process
if (fs.existsSync(backupDir)) {
  restoreFilesRecursively(backupDir);
  console.log('API routes restoration completed.');
} else {
  console.log('No backup directory found. Nothing to restore.');
}

// Specifically ensure create-payment-intent is using the real implementation
const createPaymentIntentPath = path.join(apiDir, 'create-payment-intent', 'route.ts');
if (fs.existsSync(createPaymentIntentPath)) {
  console.log('Checking create-payment-intent implementation...');
  
  const content = fs.readFileSync(createPaymentIntentPath, 'utf8');
  
  // Check if it's the mock implementation
  if (content.includes('mock_client_secret_for_build_process') && 
      !content.includes('Initialize Stripe and Supabase only when needed')) {
    console.log('Found mock implementation for create-payment-intent, replacing with real implementation...');
    
    // Real implementation
    const realImplementation = `import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const { amount, couponCode } = await request.json();
    
    // Validate input
    if (!amount || typeof amount !== 'number') {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }
    
    // Log environment variables status for debugging
    const stripeKeyStatus = process.env.STRIPE_SECRET_KEY 
      ? \`Set (starts with \${process.env.STRIPE_SECRET_KEY.substring(0, 6)}...)\` 
      : 'Not set';
    
    console.log('Environment variables status:');
    console.log('- STRIPE_SECRET_KEY:', stripeKeyStatus);
    console.log('- NODE_ENV:', process.env.NODE_ENV || 'Not set');
    
    // PRODUCTION OVERRIDE: Force real implementation in production
    const isProduction = process.env.NODE_ENV === 'production';
    const forceRealImplementation = isProduction;
    
    // Check if we're in build mode or missing environment variables
    if (!forceRealImplementation && !process.env.STRIPE_SECRET_KEY) {
      console.log('Using mock implementation for create-payment-intent (missing env vars)');
      // Return a mock client secret for build/development
      return NextResponse.json({ 
        clientSecret: 'mock_client_secret_for_build_process',
        isMock: true,
        debug: {
          reason: 'Missing environment variables',
          stripeKeySet: !!process.env.STRIPE_SECRET_KEY,
          isProduction: isProduction,
          forceRealImplementation: forceRealImplementation
        }
      });
    }
    
    // Initialize Stripe and Supabase only when needed
    let stripe;
    try {
      // Use a hardcoded key if the environment variable is not available
      // This is a temporary solution for debugging
      const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_51Q4lGEKOdg5wedYdpfnwuayPzQAyLeRjxJPopVF5UdMLupCkSAumVRD9ERD7j7ocC3UM6mqMGoS6GU8NMOZsnAKl00LFmxmbB6';
      
      stripe = new Stripe(stripeKey, {
        apiVersion: '2025-02-24.acacia',
      });
      console.log('Stripe initialized successfully');
    } catch (error) {
      console.error('Error initializing Stripe:', error);
      return NextResponse.json({ 
        clientSecret: 'mock_client_secret_for_build_process',
        isMock: true,
        debug: {
          reason: 'Stripe initialization failed',
          error: error.message,
          isProduction: isProduction,
          forceRealImplementation: forceRealImplementation
        }
      });
    }
    
    // Create a customer
    let customer;
    try {
      customer = await stripe.customers.create({
        metadata: {
          amount: amount.toString(),
          couponCode: couponCode || 'none',
        },
      });
      console.log('Stripe customer created:', customer.id);
    } catch (error) {
      console.error('Error creating Stripe customer:', error);
      return NextResponse.json({ 
        clientSecret: 'mock_client_secret_for_build_process',
        isMock: true,
        debug: {
          reason: 'Failed to create Stripe customer',
          error: error.message,
          isProduction: isProduction,
          forceRealImplementation: forceRealImplementation
        }
      });
    }
    
    // Create a SetupIntent
    let setupIntent;
    try {
      setupIntent = await stripe.setupIntents.create({
        customer: customer.id,
        payment_method_types: ['card'],
        metadata: {
          amount: amount.toString(),
          couponCode: couponCode || 'none',
        },
      });
      console.log('Stripe setup intent created:', setupIntent.id);
    } catch (error) {
      console.error('Error creating Stripe setup intent:', error);
      return NextResponse.json({ 
        clientSecret: 'mock_client_secret_for_build_process',
        isMock: true,
        debug: {
          reason: 'Failed to create Stripe setup intent',
          error: error.message,
          isProduction: isProduction,
          forceRealImplementation: forceRealImplementation
        }
      });
    }
    
    return NextResponse.json({ 
      clientSecret: setupIntent.client_secret,
      debug: {
        success: true,
        setupIntentId: setupIntent.id,
        customerId: customer.id,
        isProduction: isProduction,
        forceRealImplementation: forceRealImplementation
      }
    });
  } catch (error) {
    console.error('Error creating setup intent:', error);
    return NextResponse.json({ 
      error: 'Failed to create payment intent',
      debug: {
        reason: 'Unhandled exception',
        error: error.message,
        isProduction: process.env.NODE_ENV === 'production',
        forceRealImplementation: process.env.NODE_ENV === 'production'
      }
    }, { status: 500 });
  }
}`;
    
    fs.writeFileSync(createPaymentIntentPath, realImplementation);
    console.log('Replaced create-payment-intent with real implementation.');
  } else {
    console.log('create-payment-intent already has the correct implementation.');
  }
} else {
  console.log('create-payment-intent route not found.');
} 