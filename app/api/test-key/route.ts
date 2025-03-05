import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.RESEND_API_KEY;
  
  return NextResponse.json({ 
    keyPresent: !!apiKey,
    keyLength: apiKey?.length || 0,
    allEnvVars: Object.keys(process.env)
  });
} 