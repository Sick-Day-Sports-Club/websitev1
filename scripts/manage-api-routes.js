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
  'email-tracking',
  'waitlist'
];

// Pages to keep enabled
const pagesToKeep = [
  'api-test'
];

// Mock implementations for disabled routes
const defaultMockImplementation = `
export async function GET(request) {
  return new Response(JSON.stringify({ message: 'This API route is disabled in production' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function POST(request) {
  return new Response(JSON.stringify({ message: 'This API route is disabled in production' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
`;

const emailTrackingMockImplementation = `
export async function GET(request) {
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/');
  const trackingType = pathParts[pathParts.length - 2]; // 'pixel' or 'click'
  
  if (trackingType === 'pixel') {
    // Return a 1x1 transparent GIF for tracking pixels
    const TRANSPARENT_GIF = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
    return new Response(TRANSPARENT_GIF, {
      status: 200,
      headers: {
        'Content-Type': 'image/gif',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } else if (trackingType === 'click') {
    // Handle click tracking by redirecting to the destination URL
    const destination = url.searchParams.get('destination') || 'https://sickdaysportsclub.com';
    return Response.redirect(destination, 302);
  }
  
  return new Response(JSON.stringify({ message: 'Email tracking is disabled in production' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function POST(request) {
  return new Response(JSON.stringify({ message: 'Email tracking is disabled in production' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
`;

const betaSignupMockImplementation = `
export async function GET(request) {
  return new Response(JSON.stringify({ message: 'Beta signup API is available (mock)' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function POST(request) {
  try {
    // Parse the request body
    const data = await request.json();
    
    // Extract basic fields
    const { 
      firstName, lastName, email, 
      first_name, last_name,
      joinType, join_type
    } = data;
    
    // Use camelCase fields if available, otherwise use snake_case fields
    const firstNameValue = firstName || first_name || 'User';
    const lastNameValue = lastName || last_name || '';
    const emailValue = email || 'user@example.com';
    const joinTypeValue = joinType || join_type || 'waitlist';
    
    return new Response(JSON.stringify({
      success: true,
      message: \`Successfully joined the \${joinTypeValue === 'waitlist' ? 'waitlist' : 'beta program'} (mock)\`,
      userId: 'mock-user-id-' + Date.now(),
      mockData: {
        name: \`\${firstNameValue} \${lastNameValue}\`,
        email: emailValue,
        type: joinTypeValue
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Mock error processing request',
      message: 'This is a mock implementation for the beta signup API'
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
`;

const waitlistMockImplementation = `
export async function GET(request) {
  return new Response(JSON.stringify({ message: 'Waitlist API is available (mock)' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function POST(request) {
  try {
    // Parse the request body
    const data = await request.json();
    
    // Extract email
    const { email } = data;
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Email added to waitlist successfully (mock)',
      mockData: {
        email: email || 'user@example.com'
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Mock error processing request',
      message: 'This is a mock implementation for the waitlist API'
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
`;

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
        
        // Replace route.ts with mock implementation
        const routeFile = path.join(fullPath, 'route.ts');
        if (fs.existsSync(routeFile)) {
          console.log(`Replacing ${routeFile} with mock implementation`);
          
          // Choose the appropriate mock implementation
          let mockImplementation = defaultMockImplementation;
          if (entry.name === 'email-tracking') {
            mockImplementation = emailTrackingMockImplementation;
          } else if (entry.name === 'beta-signup') {
            mockImplementation = betaSignupMockImplementation;
          } else if (entry.name === 'waitlist') {
            mockImplementation = waitlistMockImplementation;
          }
          
          fs.writeFileSync(routeFile, mockImplementation);
        }
        
        // Process subdirectories to disable all nested routes
        processSubdirectories(fullPath, backupPath, entry.name === 'email-tracking', entry.name === 'beta-signup', entry.name === 'waitlist');
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
function processSubdirectories(dirPath, backupPath, isEmailTracking = false, isBetaSignup = false, isWaitlist = false) {
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
        console.log(`Replacing ${routeFile} with mock implementation`);
        
        // Choose the appropriate mock implementation
        let mockImplementation = defaultMockImplementation;
        if (isEmailTracking || entry.name === 'email-tracking') {
          mockImplementation = emailTrackingMockImplementation;
        } else if (isBetaSignup || entry.name === 'beta-signup') {
          mockImplementation = betaSignupMockImplementation;
        } else if (isWaitlist || entry.name === 'waitlist') {
          mockImplementation = waitlistMockImplementation;
        }
        
        fs.writeFileSync(routeFile, mockImplementation);
      }
      
      // Process subdirectories recursively
      processSubdirectories(fullPath, fullBackupPath, isEmailTracking, isBetaSignup, isWaitlist);
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