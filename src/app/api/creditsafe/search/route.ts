import { NextResponse } from 'next/server';
import companies from '@/mocks/data/companies.json';

// Simple rate limiting
const rateLimit = new Map<string, number>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const requests = rateLimit.get(ip) || 0;
  
  // Clean up old entries
  rateLimit.forEach((timestamp, key) => {
    if (now - timestamp > RATE_LIMIT_WINDOW) {
      rateLimit.delete(key);
    }
  });
  
  if (requests >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }
  
  rateLimit.set(ip, requests + 1);
  return false;
}

export async function GET(request: Request) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'localhost';
    
    // Check rate limit
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    
    // Validate query parameter
    if (!query || query.length < 2) {
      return NextResponse.json(
        { error: 'Search query must be at least 2 characters long' },
        { status: 400 }
      );
    }
    
    // Check if we're using mock data
    const useMock = process.env.USE_MOCK === 'true';
    
    if (useMock) {
      // Filter companies based on the search query
      const filteredCompanies = companies.filter(company =>
        company.name.toLowerCase().includes(query.toLowerCase()) ||
        company.number.includes(query)
      );
      
      // Limit to 10 results
      const results = filteredCompanies.slice(0, 10);
      
      // Add a small delay to simulate network request
      await new Promise(resolve => setTimeout(resolve, 200));
      
      return NextResponse.json(results);
    } else {
      // Real implementation would:
      // 1. Call the Creditsafe API
      // 2. Search for companies
      // 3. Return the results
      
      return NextResponse.json(
        { error: 'Real Creditsafe API implementation not available' },
        { status: 501 }
      );
    }
  } catch (error) {
    console.error('Error in Creditsafe search route:', error);
    return NextResponse.json(
      { error: 'Failed to search companies' },
      { status: 500 }
    );
  }
}