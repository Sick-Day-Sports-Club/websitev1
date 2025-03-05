const fs = require('fs');
const path = require('path');

const apiDir = path.join(__dirname, '../app/api');

// Create a backup directory if it doesn't exist
const backupDir = path.join(__dirname, '../.api-backups');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir);
}

// Mock implementations for specific routes
const mockImplementations = {
  'verify-payment': `
    import { NextResponse } from 'next/server';
    
    export async function GET(request: Request) {
      try {
        // Simple mock implementation without any dependencies
        return NextResponse.json({ 
          status: 'succeeded',
          message: 'Mock payment verification for build process'
        });
      } catch (error) {
        console.error('Error in mock verify-payment:', error);
        return NextResponse.json({ error: 'Failed to verify payment' }, { status: 500 });
      }
    }
  `,
  'validate-coupon': `
    import { NextResponse } from 'next/server';
    
    export async function POST(request: Request) {
      try {
        // Simple mock implementation without any dependencies
        return NextResponse.json({
          code: 'MOCK_CODE',
          percentOff: 10,
          amountOff: 0,
          valid: true
        });
      } catch (error) {
        console.error('Error in mock validate-coupon:', error);
        return NextResponse.json({ error: 'Failed to validate coupon' }, { status: 500 });
      }
    }
  `,
  'create-payment-intent': `
    import { NextResponse } from 'next/server';
    
    export async function POST(request: Request) {
      try {
        // Simple mock implementation without any dependencies
        return NextResponse.json({ 
          clientSecret: 'mock_client_secret_for_build_process',
          isMock: true
        });
      } catch (error) {
        console.error('Error in mock create-payment-intent:', error);
        return NextResponse.json({ error: 'Failed to create payment intent' }, { status: 500 });
      }
    }
  `,
  'email-tracking': `
    import { NextResponse } from 'next/server';
    
    export async function GET(request: Request) {
      try {
        // Simple mock implementation without any dependencies
        return NextResponse.json({ 
          status: 'success',
          message: 'Mock email tracking for build process'
        });
      } catch (error) {
        console.error('Error in mock email-tracking:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
      }
    }
  `,
  'email-tracking/click/[id]': `
    import { NextResponse } from 'next/server';
    
    export async function GET(request: Request) {
      try {
        const url = new URL(request.url);
        const destination = url.searchParams.get('destination') || 'https://sickdaysportsclub.com';
        return NextResponse.redirect(destination);
      } catch (error) {
        console.error('Error in mock email-tracking/click:', error);
        return NextResponse.redirect('https://sickdaysportsclub.com');
      }
    }
  `,
  'email-tracking/pixel/[id]': `
    import { NextResponse } from 'next/server';
    
    export async function GET(request: Request) {
      try {
        // Return a transparent 1x1 pixel
        return new NextResponse(Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64'), {
          headers: {
            'Content-Type': 'image/gif',
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
      } catch (error) {
        console.error('Error in mock email-tracking/pixel:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
      }
    }
  `,
  'beta-signup': `
    import { NextResponse } from 'next/server';
    
    export async function POST(request: Request) {
      try {
        // Simple mock implementation without any dependencies
        return NextResponse.json({ 
          success: true,
          message: 'Mock beta signup for build process'
        });
      } catch (error) {
        console.error('Error in mock beta-signup:', error);
        return NextResponse.json({ error: 'Failed to process beta signup' }, { status: 500 });
      }
    }
  `
};

// Add create-payment-intent to the list of routes to keep enabled
const routesToKeepEnabled = [
  'create-payment-intent',
  'beta-signup',
  'verify-payment',
  'email-tracking',
  'email-tracking/click',
  'email-tracking/click/[id]',
  'email-tracking/pixel',
  'email-tracking/pixel/[id]',
  'validate-coupon'
];

// Default mock implementation for other routes
const defaultMock = `
  import { NextResponse } from 'next/server';
  
  export async function GET(request) {
    return NextResponse.json({ message: 'API disabled during build' }, { status: 503 });
  }
  
  export async function POST(request) {
    return NextResponse.json({ message: 'API disabled during build' }, { status: 503 });
  }
`;

// Backup original API route
function backupApiRoute(routePath) {
  const relativePath = path.relative(apiDir, routePath);
  const backupPath = path.join(backupDir, relativePath);
  
  // Create directory structure if it doesn't exist
  const backupDirPath = path.dirname(backupPath);
  if (!fs.existsSync(backupDirPath)) {
    fs.mkdirSync(backupDirPath, { recursive: true });
  }
  
  // Copy the file
  fs.copyFileSync(routePath, backupPath);
}

// Restore original API route
function restoreApiRoute(routePath) {
  const relativePath = path.relative(apiDir, routePath);
  const backupPath = path.join(backupDir, relativePath);
  
  if (fs.existsSync(backupPath)) {
    fs.copyFileSync(backupPath, routePath);
    return true;
  }
  
  return false;
}

// Special handling for validate-coupon route
const validateCouponPath = path.join(apiDir, 'validate-coupon', 'route.ts');
if (fs.existsSync(validateCouponPath)) {
  console.log('Backing up and replacing validate-coupon route with a simple mock');
  backupApiRoute(validateCouponPath);
  fs.writeFileSync(validateCouponPath, `
    import { NextResponse } from 'next/server';
    
    export async function POST(request: Request) {
      return NextResponse.json({
        code: 'MOCK_CODE',
        percentOff: 10,
        amountOff: 0,
        valid: true
      });
    }
  `);
}

function disableApiRoutes(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      const dirName = path.basename(filePath);
      const relativePath = path.relative(apiDir, filePath).replace(/\\/g, '/');
      
      // Check if this route should be kept enabled
      const shouldKeepEnabled = routesToKeepEnabled.some(route => 
        relativePath === route || relativePath.startsWith(`${route}/`)
      );
      
      if (shouldKeepEnabled) {
        console.log(`Keeping API route enabled: ${relativePath}`);
        
        // Find the route.ts or route.js file in this directory
        const routeFiles = fs.readdirSync(filePath).filter(f => 
          (f === 'route.ts' || f === 'route.js') && 
          fs.statSync(path.join(filePath, f)).isFile()
        );
        
        if (routeFiles.length > 0) {
          const routeFile = path.join(filePath, routeFiles[0]);
          // If it's an exact match and has a mock implementation, use the mock
          if (mockImplementations[relativePath]) {
            backupApiRoute(routeFile);
            fs.writeFileSync(routeFile, mockImplementations[relativePath]);
            console.log(`Applied mock implementation to: ${relativePath}`);
          } else {
            // For routes to keep enabled but without a specific mock, continue recursion
            disableApiRoutes(filePath);
          }
        } else {
          // Continue recursion for directories without route files
          disableApiRoutes(filePath);
        }
      } else {
        disableApiRoutes(filePath);
      }
    } else if ((file === 'route.ts' || file === 'route.js')) {
      const parentDir = path.basename(path.dirname(filePath));
      const relativePath = path.relative(apiDir, path.dirname(filePath)).replace(/\\/g, '/');
      
      // Check if this route should be kept enabled
      const shouldKeepEnabled = routesToKeepEnabled.some(route => 
        relativePath === route || relativePath.startsWith(`${route}/`)
      );
      
      if (shouldKeepEnabled) {
        // If it has a mock implementation, use it
        if (mockImplementations[relativePath]) {
          backupApiRoute(filePath);
          fs.writeFileSync(filePath, mockImplementations[relativePath]);
          console.log(`Applied mock implementation to: ${relativePath}`);
        } else {
          console.log(`Keeping original implementation for: ${relativePath}`);
        }
      } else {
        // For routes not in the keep-enabled list, apply the default mock
        backupApiRoute(filePath);
        fs.writeFileSync(filePath, defaultMock);
        console.log(`Applied default mock to: ${relativePath}`);
      }
    }
  });
}

// Create a script to restore the original API routes
const restoreScript = `
const fs = require('fs');
const path = require('path');

const apiDir = path.join(__dirname, '../app/api');
const backupDir = path.join(__dirname, '../.api-backups');

function restoreApiRoutes(dir) {
  if (!fs.existsSync(backupDir)) {
    console.log('No backups found. Nothing to restore.');
    return;
  }

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
    
    // Create directory structure if it doesn't exist
    const originalDir = path.dirname(originalFile);
    if (!fs.existsSync(originalDir)) {
      fs.mkdirSync(originalDir, { recursive: true });
    }
    
    // Copy the file back
    fs.copyFileSync(backupFile, originalFile);
    console.log(\`Restored: \${relativePath}\`);
  });
  
  console.log('All API routes restored successfully.');
}

restoreApiRoutes();
`;

// Write the restore script
fs.writeFileSync(path.join(__dirname, 'restore-api-routes.js'), restoreScript);

// Run the main function
disableApiRoutes(apiDir);

// Create a post-build script to restore the original API routes
const postBuildScript = `
#!/bin/sh
node scripts/restore-api-routes.js
`;

fs.writeFileSync(path.join(__dirname, '../post-build.sh'), postBuildScript);
fs.chmodSync(path.join(__dirname, '../post-build.sh'), '755');

console.log('API routes disabled for build. Original routes will be restored after build.'); 