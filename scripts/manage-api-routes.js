const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '.env.production' });
dotenv.config({ path: '.env.local' });

// Log environment variables for debugging
console.log('===== MANAGE API ROUTES ENVIRONMENT CHECK =====');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('NEXT_PUBLIC_SUPABASE_URL exists:', !!process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
console.log('SUPABASE_SERVICE_ROLE_KEY exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
console.log('============================================');

// Routes to keep enabled
const routesToKeep = [
  'beta-signup',
  'test-supabase',
  'test-supabase-simple',
  'env-check',
  'waitlist',
  'create-payment-intent',
  'check-env',
  'debug-env',
  'debug-form',
  'debug-supabase-build',
  'hello',
  'send-email',
  'test-email',
  'test-key',
  'validate-coupon',
  'validate-referral',
  'verify-payment'
];

// Routes to completely disable (will be replaced with mock implementation)
const routesToDisable = [
  'email-tracking'
];

// Pages to keep enabled
const pagesToKeep = [
  'api-test'
];

// Default mock implementation for other routes
const defaultMockImplementation = `import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'This API route is disabled in production' }, { status: 404 });
}

export async function POST() {
  return NextResponse.json({ message: 'This API route is disabled in production' }, { status: 404 });
}`;

// Special mock implementation for email-tracking routes
const emailTrackingMockImplementation = `import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  // For tracking pixel, return a 1x1 transparent GIF
  if (request.url.includes('/pixel/')) {
    return new NextResponse(
      Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64'),
      {
        headers: {
          'Content-Type': 'image/gif',
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  }
  
  // For click tracking, redirect if destination is provided
  if (request.url.includes('/click/')) {
    const url = new URL(request.url);
    const destination = url.searchParams.get('destination');
    if (destination) {
      return NextResponse.redirect(destination);
    }
  }
  
  return NextResponse.json({ message: 'Email tracking is disabled in production' }, { status: 404 });
}

export async function POST() {
  return NextResponse.json({ message: 'Email tracking is disabled in production' }, { status: 404 });
}`;

const backupDir = path.join(process.cwd(), '.api-backups');
const pagesBackupDir = path.join(process.cwd(), '.pages-backups');
const apiDir = path.join(process.cwd(), 'app/api');
const appDir = path.join(process.cwd(), 'app');

function processDirectory(dirPath, isApiDir = false) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    
    if (entry.isDirectory()) {
      const isApi = entry.name === 'api' && path.relative(process.cwd(), dirPath) === 'app';
      const isApiRoute = isApiDir && !routesToKeep.includes(entry.name);
      const isRouteToDisable = isApiDir && routesToDisable.includes(entry.name);
      const relativePath = path.relative(path.join(process.cwd(), 'app'), fullPath);
      const isPageToPreserve = pagesToKeep.includes(relativePath);
      
      if (isRouteToDisable) {
        // Explicitly disable this route and all its children
        const relativePathFromApi = path.relative(path.join(process.cwd(), 'app', 'api'), fullPath);
        console.log(`Explicitly disabling route: ${relativePathFromApi}`);
        
        // Create backup
        const backupPath = path.join(backupDir, relativePathFromApi);
        if (!fs.existsSync(backupPath)) {
          fs.mkdirSync(backupPath, { recursive: true });
        }
        
        // Backup all files in this directory
        const routeFiles = fs.readdirSync(fullPath);
        for (const file of routeFiles) {
          const sourceFile = path.join(fullPath, file);
          const targetFile = path.join(backupPath, file);
          
          if (fs.statSync(sourceFile).isFile()) {
            fs.copyFileSync(sourceFile, targetFile);
          }
        }
        
        // Replace route.ts with appropriate mock implementation
        const routeFile = path.join(fullPath, 'route.ts');
        if (fs.existsSync(routeFile)) {
          // Use special implementation for email-tracking routes
          const mockImplementation = entry.name === 'email-tracking' ? emailTrackingMockImplementation : defaultMockImplementation;
          fs.writeFileSync(routeFile, mockImplementation);
          console.log(`Disabled API route: ${relativePathFromApi}`);
        }
        
        // Process subdirectories to disable all nested routes
        processSubdirectories(fullPath, backupPath, entry.name === 'email-tracking');
      } else if (isApiRoute) {
        const relativePathFromApi = path.relative(path.join(process.cwd(), 'app', 'api'), fullPath);
        const backupPath = path.join(backupDir, relativePathFromApi);
        
        if (!fs.existsSync(backupPath)) {
          fs.mkdirSync(backupPath, { recursive: true });
        }
        
        const routeFiles = fs.readdirSync(fullPath);
        for (const file of routeFiles) {
          const sourceFile = path.join(fullPath, file);
          const targetFile = path.join(backupPath, file);
          
          if (fs.statSync(sourceFile).isFile()) {
            fs.copyFileSync(sourceFile, targetFile);
          }
        }
        
        const routeFile = path.join(fullPath, 'route.ts');
        if (fs.existsSync(routeFile)) {
          fs.writeFileSync(routeFile, defaultMockImplementation);
          console.log(`Disabled API route: ${relativePathFromApi}`);
        }
      } else if (isPageToPreserve) {
        const backupPath = path.join(pagesBackupDir, relativePath);
        
        if (!fs.existsSync(backupPath)) {
          fs.mkdirSync(backupPath, { recursive: true });
        }
        
        const pageFiles = fs.readdirSync(fullPath);
        for (const file of pageFiles) {
          const sourceFile = path.join(fullPath, file);
          const targetFile = path.join(backupPath, file);
          
          if (fs.statSync(sourceFile).isFile()) {
            fs.copyFileSync(sourceFile, targetFile);
          }
        }
        
        console.log(`Backed up page: ${relativePath}`);
      } else {
        processDirectory(fullPath, isApi || isApiDir);
      }
    }
  }
}

// Helper function to process all subdirectories and disable all routes
function processSubdirectories(dirPath, backupPath, isEmailTracking = false) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const fullPath = path.join(dirPath, entry.name);
      const fullBackupPath = path.join(backupPath, entry.name);
      
      // Create backup directory
      if (!fs.existsSync(fullBackupPath)) {
        fs.mkdirSync(fullBackupPath, { recursive: true });
      }
      
      // Backup all files
      const files = fs.readdirSync(fullPath);
      for (const file of files) {
        const sourceFile = path.join(fullPath, file);
        const targetFile = path.join(fullBackupPath, file);
        
        if (fs.statSync(sourceFile).isFile()) {
          fs.copyFileSync(sourceFile, targetFile);
        }
      }
      
      // Replace route.ts with mock implementation
      const routeFile = path.join(fullPath, 'route.ts');
      if (fs.existsSync(routeFile)) {
        // Use special implementation for email-tracking routes
        const mockImplementation = isEmailTracking ? emailTrackingMockImplementation : defaultMockImplementation;
        fs.writeFileSync(routeFile, mockImplementation);
        const relativePathFromApi = path.relative(path.join(process.cwd(), 'app', 'api'), fullPath);
        console.log(`Disabled nested API route: ${relativePathFromApi}`);
      }
      
      // Process subdirectories recursively
      processSubdirectories(fullPath, fullBackupPath, isEmailTracking);
    }
  }
}

console.log('Restoring API routes...');

function restoreApiRoutes() {
  console.log('Checking if backup directory exists:', backupDir);
  if (fs.existsSync(backupDir)) {
    const backupFiles = [];
    
    function findBackupFiles(dir) {
      const files = fs.readdirSync(dir);
      console.log('Found files in backup directory:', files);
      
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
          findBackupFiles(filePath);
        } else {
          backupFiles.push(filePath);
        }
      });
    }
    
    findBackupFiles(backupDir);
    
    backupFiles.forEach(backupFile => {
      const relativePath = path.relative(backupDir, backupFile);
      const originalFile = path.join(apiDir, relativePath);
      console.log('Restoring file:', originalFile);
      
      const originalDir = path.dirname(originalFile);
      if (!fs.existsSync(originalDir)) {
        fs.mkdirSync(originalDir, { recursive: true });
      }
      
      fs.copyFileSync(backupFile, originalFile);
      console.log(`Restored API route: ${relativePath}`);
    });
    
    console.log('All API routes restored successfully.');
  } else {
    console.log('No API backups found. Nothing to restore.');
  }

  console.log('Checking if pages backup directory exists:', pagesBackupDir);
  if (fs.existsSync(pagesBackupDir)) {
    const pageBackupFiles = [];
    
    function findPageBackupFiles(dir) {
      const files = fs.readdirSync(dir);
      console.log('Found files in pages backup directory:', files);
      
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
          findPageBackupFiles(filePath);
        } else {
          pageBackupFiles.push(filePath);
        }
      });
    }
    
    findPageBackupFiles(pagesBackupDir);
    
    pageBackupFiles.forEach(backupFile => {
      const relativePath = path.relative(pagesBackupDir, backupFile);
      const originalFile = path.join(appDir, relativePath);
      console.log('Restoring page file:', originalFile);
      
      const originalDir = path.dirname(originalFile);
      if (!fs.existsSync(originalDir)) {
        fs.mkdirSync(originalDir, { recursive: true });
      }
      
      fs.copyFileSync(backupFile, originalFile);
      console.log(`Restored page: ${relativePath}`);
    });
    
    console.log('All pages restored successfully.');
  } else {
    console.log('No page backups found. Nothing to restore.');
  }
}

console.log('Environment:', process.env.NODE_ENV);
console.log('Calling restoreApiRoutes() in development environment.');

if (process.env.NODE_ENV === 'production') {
  processDirectory(appDir);
} else {
  restoreApiRoutes();
} 