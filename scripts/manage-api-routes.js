const fs = require('fs');
const path = require('path');

// Routes to keep enabled
const routesToKeep = [
  'beta-signup',
  'test-supabase',
  'test-supabase-simple',
  'env-check',
  'waitlist',
  'create-payment-intent',
  'email-tracking',
  'check-env',
  'debug-env',
  'debug-form',
  'hello',
  'send-email',
  'test-email',
  'test-key',
  'validate-coupon',
  'validate-referral',
  'verify-payment'
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
      const relativePath = path.relative(path.join(process.cwd(), 'app'), fullPath);
      const isPageToPreserve = pagesToKeep.includes(relativePath);
      
      if (isApiRoute) {
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
        fs.writeFileSync(routeFile, defaultMockImplementation);
        
        console.log(`Disabled API route: ${relativePathFromApi}`);
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

function restoreApiRoutes() {
  if (fs.existsSync(backupDir)) {
    const backupFiles = [];
    
    function findBackupFiles(dir) {
      const files = fs.readdirSync(dir);
      
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

  if (fs.existsSync(pagesBackupDir)) {
    const pageBackupFiles = [];
    
    function findPageBackupFiles(dir) {
      const files = fs.readdirSync(dir);
      
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

if (process.env.NODE_ENV === 'production') {
  processDirectory(appDir);
} else {
  restoreApiRoutes();
} 