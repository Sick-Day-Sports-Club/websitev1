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

// Nested routes to keep enabled (parent/child format)
const nestedRoutesToKeep = [
  'email-tracking/click',
  'email-tracking/pixel'
];

// Function to check if a route should be kept
function shouldKeepRoute(routePath) {
  // Check direct routes
  if (routesToKeep.includes(routePath)) {
    return true;
  }
  
  // Check nested routes
  for (const nestedRoute of nestedRoutesToKeep) {
    const [parent, child] = nestedRoute.split('/');
    if (routePath === parent) {
      return true;
    }
  }
  
  return false;
}

// Function to check if a nested route should be kept
function shouldKeepNestedRoute(parentPath, childPath) {
  const fullPath = `${parentPath}/${childPath}`;
  return nestedRoutesToKeep.includes(fullPath);
}

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

const backupDir = path.join(process.cwd(), '.api-backups');
const pagesBackupDir = path.join(process.cwd(), '.pages-backups');
const apiDir = path.join(process.cwd(), 'app/api');
const appDir = path.join(process.cwd(), 'app');

function processDirectory(dirPath, isApiDir = false, parentPath = '') {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    
    if (entry.isDirectory()) {
      const isApi = entry.name === 'api' && path.relative(process.cwd(), dirPath) === 'app';
      const currentPath = isApiDir ? entry.name : '';
      const fullRoutePath = parentPath ? `${parentPath}/${entry.name}` : entry.name;
      const isApiRoute = isApiDir && !shouldKeepRoute(entry.name);
      const isNestedApiRoute = parentPath && !shouldKeepNestedRoute(parentPath, entry.name);
      const relativePath = path.relative(path.join(process.cwd(), 'app'), fullPath);
      const isPageToPreserve = pagesToKeep.includes(relativePath);
      
      if ((isApiRoute || isNestedApiRoute) && parentPath) {
        const relativePathFromApi = path.relative(path.join(process.cwd(), 'app', 'api'), fullPath);
        console.log(`Processing nested route: ${relativePathFromApi}, parent: ${parentPath}, current: ${entry.name}`);
        
        // Skip disabling if this is a nested route we want to keep
        if (shouldKeepNestedRoute(parentPath, entry.name)) {
          console.log(`Keeping nested route: ${relativePathFromApi}`);
          processDirectory(fullPath, isApi || isApiDir, fullRoutePath);
          continue;
        }
        
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
          console.log(`Disabled nested API route: ${relativePathFromApi}`);
        }
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
        processDirectory(fullPath, isApi || isApiDir, isApiDir ? fullRoutePath : '');
      }
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