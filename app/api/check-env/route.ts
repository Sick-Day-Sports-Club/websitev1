import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.RESEND_API_KEY;
  
  return NextResponse.json({
    apiKeyPresent: !!apiKey,
    apiKeyStartsWith: apiKey?.substring(0, 5),
    apiKeyLength: apiKey?.length,
    allEnvVars: Object.keys(process.env),
    timestamp: new Date().toISOString()
  });
} 