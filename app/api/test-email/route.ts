import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Log API key info (safely)
const apiKey = process.env.RESEND_API_KEY;
console.log('All env vars:', Object.keys(process.env));
console.log('API key type:', typeof apiKey);
console.log('API key starts with:', apiKey?.substring(0, 5));
console.log('API key length:', apiKey?.length);
console.log('Full API key value:', apiKey); // We'll remove this after debugging

const resend = new Resend(apiKey);

export async function POST() {
  try {
    // Validate API key
    if (!apiKey) {
      return NextResponse.json({ 
        error: 'API key is missing',
        envVars: Object.keys(process.env)
      }, { status: 500 });
    }

    if (!apiKey.startsWith('re_')) {
      return NextResponse.json({ 
        error: 'API key format is invalid. Should start with "re_"'
      }, { status: 500 });
    }

    console.log('Starting simple email test...');
    
    const { data, error } = await resend.emails.send({
      from: 'sam@sickdaysportsclub.com',
      to: ['sam@sickdaysportsclub.com'],
      subject: 'Test Email',
      html: '<p>This is a test email.</p>'
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true,
      data
    });
  } catch (error) {
    console.error('Error details:', error);
    return NextResponse.json({ 
      error: 'Failed to send email',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 