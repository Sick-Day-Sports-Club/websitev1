import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Create a new ratelimiter that allows 10 requests per 10 seconds
const redis = new Redis({
  url: 'https://smiling-basilisk-48356.upstash.io',
  token: 'AbzkAAIjcDFmZTcyY2Y5YmY4OGM0M2NjOTAwNzc0ZjJkNTQ1NzUwZnAxMA',
});

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  analytics: true,
});

// Security headers
const securityHeaders = {
  'X-DNS-Prefetch-Control': 'on',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://*.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.stripe.com https://*.supabase.co https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com; frame-src 'self' https://js.stripe.com https://hooks.stripe.com;",
};

export async function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname;

  // Apply rate limiting to API routes
  if (path.startsWith('/api/')) {
    const ip = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? '127.0.0.1';
    const { success, limit, reset, remaining } = await ratelimit.limit(ip);

    if (!success) {
      return new NextResponse('Too Many Requests', {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
        },
      });
    }
  }

  // Add security headers to all responses
  const response = NextResponse.next();

  // Add security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    if (path === '/beta-signup' && key === 'Content-Security-Policy') {
      // Special CSP for beta signup page with Stripe and Google Tag Manager
      const betaSignupCSP = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://*.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://*.stripe.com https://*.google-analytics.com; font-src 'self' data:; connect-src 'self' https://api.stripe.com https://*.supabase.co https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com; frame-src 'self' https://js.stripe.com https://hooks.stripe.com;";
      response.headers.set(key, betaSignupCSP);
    } else {
      response.headers.set(key, value);
    }
  });

  return response;
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    '/api/:path*',
    '/beta-signup',
    '/confirmation',
  ],
}; 