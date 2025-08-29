// API call test helpers

import { vi } from 'vitest';

// Mock fetch implementation
export function mockFetch(data: any, ok: boolean = true, status: number = 200) {
  return vi.fn().mockResolvedValue({
    ok,
    status,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data))
  });
}

// Mock successful API response
export function mockSuccessResponse(data: any) {
  return mockFetch(data, true, 200);
}

// Mock error API response
export function mockErrorResponse(error: any, status: number = 500) {
  return vi.fn().mockResolvedValue({
    ok: false,
    status,
    json: () => Promise.reject(error),
    text: () => Promise.reject(JSON.stringify(error))
  });
}

// Mock network error
export function mockNetworkError() {
  return vi.fn().mockRejectedValue(new Error('Network error'));
}

// Mock API timeout
export function mockTimeoutError() {
  return vi.fn().mockRejectedValue(new Error('Request timeout'));
}

// Mock API rate limit error
export function mockRateLimitError() {
  return mockErrorResponse({ error: 'Rate limit exceeded' }, 429);
}

// Create a mock API client
export class MockApiClient {
  private baseUrl: string;
 private mocks: Map<string, any>;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
    this.mocks = new Map();
  }

  // Set a mock response for a specific endpoint
  setMock(endpoint: string, response: any, method: string = 'GET') {
    const key = `${method}:${endpoint}`;
    this.mocks.set(key, response);
  }

  // Clear all mocks
  clearMocks() {
    this.mocks.clear();
  }

  // Mock fetch implementation that uses our mocks
  async fetch(url: string, options: any = {}) {
    const method = options.method || 'GET';
    const key = `${method}:${url}`;
    
    if (this.mocks.has(key)) {
      return this.mocks.get(key);
    }
    
    // Default mock response
    return {
      ok: true,
      status: 200,
      json: () => Promise.resolve({ message: 'Mock response' }),
      text: () => Promise.resolve(JSON.stringify({ message: 'Mock response' }))
    };
  }

  // GET request
  async get(url: string) {
    return this.fetch(url, { method: 'GET' });
  }

  // POST request
  async post(url: string, data: any) {
    return this.fetch(url, { method: 'POST', body: JSON.stringify(data) });
 }

  // PUT request
  async put(url: string, data: any) {
    return this.fetch(url, { method: 'PUT', body: JSON.stringify(data) });
  }

  // DELETE request
  async delete(url: string) {
    return this.fetch(url, { method: 'DELETE' });
  }
}

// Global mock API client instance
export const globalMockApiClient = new MockApiClient();

// Helper to mock global fetch
export function mockGlobalFetch(data: any, ok: boolean = true, status: number = 200) {
  // @ts-ignore
  global.fetch = mockFetch(data, ok, status);
}

// Helper to restore global fetch
export function restoreGlobalFetch() {
  // @ts-ignore
  global.fetch = undefined;
}

// Mock Next.js API route handler
export function mockNextApiHandler() {
  return {
    req: {
      method: 'GET',
      headers: {},
      body: null,
      query: {}
    },
    res: {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
      end: vi.fn()
    }
  };
}

// Mock Next.js API route handler with custom properties
export function mockNextApiHandlerWith(
  method: string = 'GET',
  body: any = null,
  query: any = {},
  headers: any = {}
) {
  return {
    req: {
      method,
      headers,
      body,
      query
    },
    res: {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
      end: vi.fn()
    }
  };
}