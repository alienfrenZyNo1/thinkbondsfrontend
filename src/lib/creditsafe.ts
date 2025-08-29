// Creditsafe helpers

// Define TypeScript interfaces for Creditsafe responses
export interface CreditsafeCompany {
  id: string;
  name: string;
  number: string;
  country: string;
  address: string;
  city: string;
  postcode: string;
}

export interface CreditsafeReport {
  companyId: string;
  companyName: string;
  registrationNumber: string;
  status: string;
  legalForm: string;
  incorporationDate: string;
  address: string;
  city: string;
  postcode: string;
  country: string;
  financialSummary?: {
    currency: string;
    revenue: number;
    profit: number;
    equity: number;
    employees: number;
  };
  creditScore?: {
    score: number;
    rating: string;
    limit: number;
  };
}

// Custom error classes
export class CreditsafeError extends Error {
  constructor(
    message: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'CreditsafeError';
  }
}

export class NetworkError extends CreditsafeError {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class RateLimitError extends CreditsafeError {
  constructor(message: string) {
    super(message);
    this.name = 'RateLimitError';
  }
}

// Simple in-memory cache
interface CacheItem<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheItem<unknown>>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Check if item is expired
function isExpired<T>(item: CacheItem<T>): boolean {
  return Date.now() - item.timestamp > CACHE_TTL;
}

// Get item from cache
function getFromCache<T>(key: string): T | null {
  const item = cache.get(key);
  if (!item) return null;

  if (isExpired(item)) {
    cache.delete(key);
    return null;
  }

  return item.data;
}

// Set item in cache
function setInCache<T>(key: string, data: T): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

// Retry function with exponential backoff
async function retry<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) {
      throw error;
    }

    // Exponential backoff
    await new Promise(resolve => setTimeout(resolve, delay));
    return retry(fn, retries - 1, delay * 2);
  }
}

export class CreditsafeAPI {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl: string = 'https://api.creditsafe.com') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  /**
   * Get a company report from Creditsafe
   * @param companyId The Creditsafe company ID
   * @returns Promise<CreditsafeReport> The company report
   */
  async getCompanyReport(companyId: string): Promise<CreditsafeReport> {
    // Check cache first
    const cacheKey = `report_${companyId}`;
    const cached = getFromCache<CreditsafeReport>(cacheKey);
    if (cached) {
      return cached;
    }

    // Check if we're using mock data
    const useMock = process.env.USE_MOCK === 'true';

    if (useMock) {
      // For mock implementation, call our local API with retry logic
      try {
        const response = await retry(async () => {
          const res = await fetch(`/api/creditsafe/reports/${companyId}`);

          // Handle rate limiting
          if (res.status === 429) {
            throw new RateLimitError(
              'Rate limit exceeded. Please try again later.'
            );
          }

          if (!res.ok) {
            throw new NetworkError(
              `Failed to fetch company report: ${res.status} ${res.statusText}`
            );
          }

          return res;
        });

        const data = await response.json();
        setInCache(cacheKey, data);
        return data;
      } catch (error) {
        console.error('Error fetching company report:', error);

        // Re-throw with proper error type
        if (error instanceof CreditsafeError) {
          throw error;
        }

        throw new CreditsafeError(
          'Failed to fetch company report. Please try again.'
        );
      }
    } else {
      // Implementation for getting company report from Creditsafe API
      // This would make a real API call in production
      throw new Error('Real Creditsafe API implementation not yet available');
    }
  }

  /**
   * Search for companies in Creditsafe
   * @param searchTerm The search term to use
   * @returns Promise<CreditsafeCompany[]> Array of matching companies
   */
  async searchCompanies(searchTerm: string): Promise<CreditsafeCompany[]> {
    // Check cache first
    const cacheKey = `search_${searchTerm}`;
    const cached = getFromCache<CreditsafeCompany[]>(cacheKey);
    if (cached) {
      return cached;
    }

    // Check if we're using mock data
    const useMock = process.env.USE_MOCK === 'true';

    if (useMock) {
      // For mock implementation, call our local API with retry logic
      try {
        const response = await retry(async () => {
          const res = await fetch(
            `/api/creditsafe/search?q=${encodeURIComponent(searchTerm)}`
          );

          // Handle rate limiting
          if (res.status === 429) {
            throw new RateLimitError(
              'Rate limit exceeded. Please try again later.'
            );
          }

          if (!res.ok) {
            throw new NetworkError(
              `Failed to search companies: ${res.status} ${res.statusText}`
            );
          }

          return res;
        });

        const data = await response.json();
        setInCache(cacheKey, data);
        return data;
      } catch (error) {
        console.error('Error searching companies:', error);

        // Re-throw with proper error type
        if (error instanceof CreditsafeError) {
          throw error;
        }

        throw new CreditsafeError(
          'Failed to search companies. Please try again.'
        );
      }
    } else {
      // Implementation for searching companies in Creditsafe API
      // This would make a real API call in production
      throw new Error('Real Creditsafe API implementation not yet available');
    }
  }

  /**
   * Get company financials from Creditsafe
   * @param companyId The Creditsafe company ID
   * @returns Promise<any> The company financials
   */
  async getCompanyFinancials(
    companyId: string
  ): Promise<CreditsafeReport['financialSummary'] | Record<string, never>> {
    // Check if we're using mock data
    const useMock = process.env.USE_MOCK === 'true';

    if (useMock) {
      // For mock implementation, we could call a specific endpoint or return data from the report
      try {
        const report = await this.getCompanyReport(companyId);
        return report.financialSummary || {};
      } catch (error) {
        console.error('Error fetching company financials:', error);
        throw error;
      }
    } else {
      // Implementation for getting company financials from Creditsafe API
      // This would make a real API call in production
      throw new Error('Real Creditsafe API implementation not yet available');
    }
  }

  /**
   * Clear the cache
   */
  static clearCache(): void {
    cache.clear();
  }

  /**
   * Get cache size
   * @returns number The number of items in cache
   */
  static getCacheSize(): number {
    return cache.size;
  }
}
