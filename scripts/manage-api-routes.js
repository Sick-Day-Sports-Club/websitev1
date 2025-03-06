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

// Check if service role key is available
const hasServiceRoleKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
console.log('Service role key available:', hasServiceRoleKey);

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
// If service role key is available, don't disable waitlist routes
const routesToDisable = hasServiceRoleKey ? 
  [
    'email-tracking'
  ] : 
  [
    'email-tracking',
    'waitlist',
    'admin/waitlist'
  ];

console.log('Routes to disable:', routesToDisable);

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

const adminWaitlistMockImplementation = `
export async function GET(request) {
  // Return mock waitlist entries
  return new Response(JSON.stringify({
    entries: [
      { 
        id: '1', 
        email: 'example1@example.com', 
        created_at: new Date(Date.now() - 86400000).toISOString() 
      },
      { 
        id: '2', 
        email: 'example2@example.com', 
        created_at: new Date(Date.now() - 172800000).toISOString() 
      },
      { 
        id: '3', 
        email: 'example3@example.com', 
        created_at: new Date(Date.now() - 259200000).toISOString() 
      }
    ],
    note: 'This is mock data. Configure SUPABASE_SERVICE_ROLE_KEY in your production environment to see real data.'
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function POST(request) {
  return new Response(JSON.stringify({ message: 'Admin waitlist API is disabled in production' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
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
      const relativePath = path.relative(path.join(process.cwd(), 'app'), fullPath);
      const isPageToPreserve = pagesToKeep.includes(relativePath);
      
      // Check if this is a route to disable
      let isRouteToDisable = false;
      let routeToDisableName = '';
      
      for (const route of routesToDisable) {
        const routeParts = route.split('/');
        if (routeParts.length === 1) {
          // Simple route like 'email-tracking'
          if (isApiDir && entry.name === route) {
            isRouteToDisable = true;
            routeToDisableName = route;
            break;
          }
        } else if (routeParts.length === 2) {
          // Nested route like 'admin/waitlist'
          if (isApiDir && entry.name === routeParts[0]) {
            // This is the parent directory of a nested route to disable
            // We'll check for the child directory in the recursive call
            const nestedPath = path.join(fullPath, routeParts[1]);
            if (fs.existsSync(nestedPath) && fs.statSync(nestedPath).isDirectory()) {
              // Mark this directory for special handling
              isRouteToDisable = false;
              break;
            }
          }
        }
      }
      
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
          if (routeToDisableName === 'email-tracking') {
            mockImplementation = emailTrackingMockImplementation;
          } else if (routeToDisableName === 'beta-signup') {
            mockImplementation = betaSignupMockImplementation;
          } else if (routeToDisableName === 'waitlist') {
            mockImplementation = waitlistMockImplementation;
          }
          
          fs.writeFileSync(routeFile, mockImplementation);
        }
        
        // Process subdirectories to disable all nested routes
        processSubdirectories(fullPath, backupPath, 
          routeToDisableName === 'email-tracking', 
          routeToDisableName === 'beta-signup', 
          routeToDisableName === 'waitlist');
      } else if (isApiDir && entry.name === 'admin') {
        // Special handling for admin routes
        console.log('Processing admin directory:', fullPath);
        
        // Check for nested routes to disable
        const adminEntries = fs.readdirSync(fullPath, { withFileTypes: true });
        for (const adminEntry of adminEntries) {
          if (adminEntry.isDirectory()) {
            const adminFullPath = path.join(fullPath, adminEntry.name);
            const adminRelativePath = `admin/${adminEntry.name}`;
            
            if (routesToDisable.includes(adminRelativePath)) {
              // This is a nested admin route to disable
              const relativePathFromApi = path.relative(path.join(process.cwd(), 'app', 'api'), adminFullPath);
              console.log(`Explicitly disabling admin route: ${relativePathFromApi}`);
              
              // Create backup
              const backupPath = path.join(backupDir, relativePathFromApi);
              if (!fs.existsSync(backupPath)) {
                fs.mkdirSync(backupPath, { recursive: true });
              }
              
              // Backup all files in this directory
              const routeFiles = fs.readdirSync(adminFullPath);
              for (const file of routeFiles) {
                const sourceFile = path.join(adminFullPath, file);
                const targetFile = path.join(backupPath, file);
                
                if (fs.statSync(sourceFile).isFile()) {
                  fs.copyFileSync(sourceFile, targetFile);
                }
              }
              
              // Replace route.ts with mock implementation
              const routeFile = path.join(adminFullPath, 'route.ts');
              if (fs.existsSync(routeFile)) {
                console.log(`Replacing ${routeFile} with mock implementation`);
                
                // Choose the appropriate mock implementation
                let mockImplementation = defaultMockImplementation;
                if (adminEntry.name === 'waitlist') {
                  mockImplementation = adminWaitlistMockImplementation;
                }
                
                fs.writeFileSync(routeFile, mockImplementation);
              }
            }
          }
        }
        
        // Continue processing the admin directory
        processDirectory(fullPath, isApiDir);
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
        } else if (entry.name === 'admin' && isWaitlist) {
          mockImplementation = adminWaitlistMockImplementation;
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
  console.log('Environment:', process.env.NODE_ENV);
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