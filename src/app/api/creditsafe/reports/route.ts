import { NextResponse } from 'next/server';
import reports from '@/mocks/data/reports.json';

// Simple in-memory cache
const cache = new Map<string, any>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface CacheItem {
  data: any;
  timestamp: number;
}

// Check if item is expired
function isExpired(item: CacheItem): boolean {
  return Date.now() - item.timestamp > CACHE_TTL;
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId') || params.id;
    
    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      );
    }
    
    // Check if we're using mock data
    const useMock = process.env.USE_MOCK === 'true';
    
    if (useMock) {
      // Check cache first
      const cacheKey = `report_${companyId}`;
      const cachedItem = cache.get(cacheKey);
      
      if (cachedItem && !isExpired(cachedItem)) {
        // Add a small delay to simulate network request
        await new Promise(resolve => setTimeout(resolve, 200));
        return NextResponse.json(cachedItem.data);
      }
      
      // Find the report for the company
      const report = reports.find(r => r.companyId === companyId);
      
      if (!report) {
        return NextResponse.json(
          { error: 'Report not found' },
          { status: 404 }
        );
      }
      
      // Cache the result
      cache.set(cacheKey, {
        data: report,
        timestamp: Date.now()
      });
      
      // Add a small delay to simulate network request
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return NextResponse.json(report);
    } else {
      // Real implementation would:
      // 1. Call the Creditsafe API
      // 2. Get the company report
      // 3. Return the results
      
      return NextResponse.json(
        { error: 'Real Creditsafe API implementation not available' },
        { status: 501 }
      );
    }
  } catch (error) {
    console.error('Error in Creditsafe reports route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch company report' },
      { status: 500 }
    );
  }
}