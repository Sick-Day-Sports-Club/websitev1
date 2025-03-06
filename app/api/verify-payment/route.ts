
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
  