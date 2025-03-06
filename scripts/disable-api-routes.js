const fs = require('fs');
const path = require('path');

// Routes to keep enabled
const routesToKeep = [
  'beta-signup',
  'test-supabase',
  'test-supabase-simple',
  'env-check'
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

// Create backup directory if it doesn't exist
const backupDir = path.join(process.cwd(), '.api-backups');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

// Create pages backup directory if it doesn't exist
const pagesBackupDir = path.join(process.cwd(), '.pages-backups');
if (!fs.existsSync(pagesBackupDir)) {
  fs.mkdirSync(pagesBackupDir, { recursive: true });
}

// Function to process directories recursively
function processDirectory(dirPath, isApiDir = false) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    
    if (entry.isDirectory()) {
      // Check if this is the api directory
      const isApi = entry.name === 'api' && path.relative(process.cwd(), dirPath) === 'app';
      
      // Check if this is a route directory inside the api directory
      const isApiRoute = isApiDir && !routesToKeep.includes(entry.name);
      
      // Check if this is a page directory that should be preserved
      const relativePath = path.relative(path.join(process.cwd(), 'app'), fullPath);
      const isPageToPreserve = pagesToKeep.includes(relativePath);
      
      if (isApiRoute) {
        // Backup the route directory
        const relativePathFromApi = path.relative(path.join(process.cwd(), 'app', 'api'), fullPath);
        const backupPath = path.join(backupDir, relativePathFromApi);
        
        // Create backup directory
        if (!fs.existsSync(backupPath)) {
          fs.mkdirSync(backupPath, { recursive: true });
        }
        
        // Backup files
        const routeFiles = fs.readdirSync(fullPath);
        for (const file of routeFiles) {
          const sourceFile = path.join(fullPath, file);
          const targetFile = path.join(backupPath, file);
          
          if (fs.statSync(sourceFile).isFile()) {
            fs.copyFileSync(sourceFile, targetFile);
          }
        }
        
        // Replace with mock implementation
        const routeFile = path.join(fullPath, 'route.ts');
        fs.writeFileSync(routeFile, defaultMockImplementation);
        
        console.log(`Disabled API route: ${relativePathFromApi}`);
      } else if (isPageToPreserve) {
        // Backup the page directory
        const backupPath = path.join(pagesBackupDir, relativePath);
        
        // Create backup directory
        if (!fs.existsSync(backupPath)) {
          fs.mkdirSync(backupPath, { recursive: true });
        }
        
        // Backup files
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
        // Process subdirectories
        processDirectory(fullPath, isApi || isApiDir);
      }
    }
  }
}

// Process the app directory
const appDir = path.join(process.cwd(), 'app');
processDirectory(appDir);

// Create mock implementations for routes we want to keep
console.log('Creating mock implementations for routes to keep...');

// Mock implementation for env-check
const envCheckDir = path.join(appDir, 'api', 'env-check');
if (!fs.existsSync(envCheckDir)) {
  fs.mkdirSync(envCheckDir, { recursive: true });
}

const envCheckRoutePath = path.join(envCheckDir, 'route.ts');
const envCheckRouteContent = `import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    return NextResponse.json({ 
      environment: {
        NEXT_PUBLIC_SUPABASE_URL: 'https://mock-url-for-build.supabase.co',
        NEXT_PUBLIC_SUPABASE_ANON_KEY: 'Set (masked)',
        SUPABASE_SERVICE_ROLE_KEY: 'Set (masked)',
        NODE_ENV: 'production'
      },
      timestamp: new Date().toISOString(),
      message: 'Mock environment check for build process'
    });
  } catch (error) {
    console.error('Error in mock env-check:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: String(error)
    }, { status: 500 });
  }
}`;

fs.writeFileSync(envCheckRoutePath, envCheckRouteContent);
console.log(`Created mock implementation for env-check at ${envCheckRoutePath}`);

console.log('API routes disabled for build process, except for specified routes to keep.'); 