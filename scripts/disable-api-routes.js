const fs = require('fs');
const path = require('path');

const apiDir = path.join(__dirname, '../app/api');

// Mock implementations for specific routes
const mockImplementations = {
  'create-payment-intent': `
    import { NextRequest, NextResponse } from 'next/server';
    
    export async function POST(request) {
      return NextResponse.json({ 
        clientSecret: 'mock_client_secret_for_build_process' 
      });
    }
  `,
  'verify-payment': `
    import { NextRequest, NextResponse } from 'next/server';
    
    export async function GET(request) {
      return NextResponse.json({ 
        status: 'succeeded',
        message: 'Mock payment verification for build process'
      });
    }
  `,
  'validate-coupon': `
    import { NextRequest, NextResponse } from 'next/server';
    
    export async function GET(request) {
      return NextResponse.json({ 
        valid: true,
        discount: 10,
        message: 'Mock coupon validation for build process'
      });
    }
  `
};

// Default mock implementation for other routes
const defaultMock = `
  import { NextRequest, NextResponse } from 'next/server';
  
  export async function GET(request) {
    return NextResponse.json({ message: 'API disabled during build' }, { status: 503 });
  }
  
  export async function POST(request) {
    return NextResponse.json({ message: 'API disabled during build' }, { status: 503 });
  }
`;

function disableApiRoutes(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      const dirName = path.basename(filePath);
      
      // Check if we have a specific mock for this route
      if (mockImplementations[dirName]) {
        // Find the route.ts or route.js file in this directory
        const routeFiles = fs.readdirSync(filePath).filter(f => 
          (f === 'route.ts' || f === 'route.js') && 
          fs.statSync(path.join(filePath, f)).isFile()
        );
        
        if (routeFiles.length > 0) {
          const routeFile = path.join(filePath, routeFiles[0]);
          fs.writeFileSync(routeFile, mockImplementations[dirName]);
          console.log(`Applied mock implementation to: ${dirName}`);
        }
      } else {
        disableApiRoutes(filePath);
      }
    } else if ((file === 'route.ts' || file === 'route.js') && 
               !Object.keys(mockImplementations).includes(path.basename(path.dirname(filePath)))) {
      // Apply default mock to routes without specific mocks
      fs.writeFileSync(filePath, defaultMock);
    }
  });
}

disableApiRoutes(apiDir); 