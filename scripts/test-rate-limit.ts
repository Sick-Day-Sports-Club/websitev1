import fetch from 'node-fetch';

const API_URL = 'http://localhost:3000/api/hello'; // Using default Next.js port
const TOTAL_REQUESTS = 15; // We'll send 15 requests (more than our 10/10s limit)

interface RateLimitResult {
  requestNumber: number;
  status?: number;
  rateLimit?: {
    limit: string;
    remaining: string;
    reset: string;
  };
  error?: string;
  timeMs: number;
}

async function testRateLimit() {
  console.log(`Starting rate limit test - sending ${TOTAL_REQUESTS} requests...`);
  console.log(`Testing endpoint: ${API_URL}\n`);
  
  const results = await Promise.all(
    Array(TOTAL_REQUESTS).fill(null).map(async (_, index) => {
      const startTime = Date.now();
      try {
        const response = await fetch(API_URL);
        
        const status = response.status;
        const headers = Object.fromEntries(response.headers);
        const body = await response.text();
        
        console.log(`Response body for request ${index + 1}:`, body);
        
        return {
          requestNumber: index + 1,
          status,
          rateLimit: {
            limit: headers['x-ratelimit-limit'],
            remaining: headers['x-ratelimit-remaining'],
            reset: headers['x-ratelimit-reset']
          },
          timeMs: Date.now() - startTime
        } as RateLimitResult;
      } catch (error) {
        console.error(`Detailed error for request ${index + 1}:`, error);
        return {
          requestNumber: index + 1,
          error: error instanceof Error ? error.message : 'Unknown error',
          timeMs: Date.now() - startTime
        } as RateLimitResult;
      }
    })
  );

  // Log results
  results.forEach(result => {
    if (result.error) {
      console.log(`Request ${result.requestNumber}: Failed - ${result.error} (${result.timeMs}ms)`);
    } else if (result.status && result.rateLimit) {
      console.log(
        `Request ${result.requestNumber}: Status ${result.status} - ` +
        `Remaining: ${result.rateLimit.remaining} (${result.timeMs}ms)`
      );
    }
  });

  // Summary
  const successful = results.filter(r => r.status === 200).length;
  const ratelimited = results.filter(r => r.status === 429).length;
  const failed = results.filter(r => r.error).length;

  console.log('\nSummary:');
  console.log(`- Successful requests: ${successful}`);
  console.log(`- Rate limited requests: ${ratelimited}`);
  console.log(`- Failed requests: ${failed}`);
}

testRateLimit().catch(console.error); 