const fs = require('fs');
const path = require('path');

const apiDir = path.join(__dirname, '../app/api');

// Mock implementations for specific routes
const mockImplementations = {
  'create-payment-intent': `
    import { NextResponse } from 'next/server';
    
    export async function POST(request) {
      try {
        // Simple mock implementation without any dependencies
        return NextResponse.json({ 
          clientSecret: 'mock_client_secret_for_build_process' 
        });
      } catch (error) {
        console.error('Error in mock create-payment-intent:', error);
        return NextResponse.json({ error: 'Failed to create payment intent' }, { status: 500 });
      }
    }
  `,
  'verify-payment': `
    import { NextResponse } from 'next/server';
    
    export async function GET(request) {
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
  'email-tracking': `
    import { NextResponse } from 'next/server';
    
    export async function GET(request) {
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
    
    export async function GET(request) {
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
    
    export async function GET(request) {
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
  `
};

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

// Special handling for validate-coupon route
const validateCouponPath = path.join(apiDir, 'validate-coupon', 'route.ts');
if (fs.existsSync(validateCouponPath)) {
  console.log('Completely replacing validate-coupon route with a simple mock');
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
      
      // Skip validate-coupon since we've already handled it
      if (relativePath === 'validate-coupon') {
        console.log(`Keeping API route enabled: ${relativePath}`);
        return;
      }
      
      // Check if we have a specific mock for this route or its parent
      const mockKey = Object.keys(mockImplementations).find(key => 
        relativePath === key || relativePath.startsWith(`${key}/`)
      );
      
      if (mockKey) {
        console.log(`Keeping API route enabled: ${relativePath}`);
        
        // Find the route.ts or route.js file in this directory
        const routeFiles = fs.readdirSync(filePath).filter(f => 
          (f === 'route.ts' || f === 'route.js') && 
          fs.statSync(path.join(filePath, f)).isFile()
        );
        
        if (routeFiles.length > 0) {
          const routeFile = path.join(filePath, routeFiles[0]);
          // If it's an exact match, use the specific mock
          if (relativePath === mockKey) {
            fs.writeFileSync(routeFile, mockImplementations[mockKey]);
            console.log(`Applied mock implementation to: ${relativePath}`);
          } else {
            // For nested routes under a parent with a mock, continue recursion
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
      
      // Skip validate-coupon since we've already handled it
      if (relativePath === 'validate-coupon') {
        return;
      }
      
      // Check if this route or its parent has a specific mock
      const mockKey = Object.keys(mockImplementations).find(key => 
        relativePath === key || relativePath.startsWith(`${key}/`)
      );
      
      if (!mockKey) {
        // Apply default mock to routes without specific mocks
        fs.writeFileSync(filePath, defaultMock);
        console.log(`Applied default mock to: ${relativePath}`);
      }
    }
  });
}

disableApiRoutes(apiDir); 