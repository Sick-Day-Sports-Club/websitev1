
  import { NextResponse } from 'next/server';
  
  export async function GET(request) {
    return NextResponse.json({ message: 'API disabled during build' }, { status: 503 });
  }
  
  export async function POST(request) {
    return NextResponse.json({ message: 'API disabled during build' }, { status: 503 });
  }
