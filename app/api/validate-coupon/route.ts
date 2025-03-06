
    import { NextResponse } from 'next/server';
    
    export async function POST(request: Request) {
      return NextResponse.json({
        code: 'MOCK_CODE',
        percentOff: 10,
        amountOff: 0,
        valid: true
      });
    }
  