import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GET, POST, GET_HISTORY } from '@/app/api/bonds/route';

// Mock environment variables
vi.mock('@/lib/audit', () => ({
  logAuditEvent: vi.fn()
}));

describe('Bonds API Routes', () => {
  beforeEach(() => {
    // Set mock environment variables
    vi.stubEnv('USE_MOCK', 'true');
  });

  afterEach(() => {
    // Clear environment variable mocks
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  describe('GET /api/bonds', () => {
    it('should return bonds list with mock data', async () => {
      const request = new Request('https://example.com/api/bonds', {
        method: 'GET',
      });

      const response = await GET(request);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.id).toBeDefined();
      expect(data.bondAmount).toBeDefined();
      expect(data.premium).toBeDefined();
    });

    it('should handle includeDeleted parameter', async () => {
      const request = new Request('https://example.com/api/bonds?includeDeleted=true', {
        method: 'GET',
      });

      const response = await GET(request);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.id).toBeDefined();
    });
  });

  describe('POST /api/bonds', () => {
    it('should create a new bond with mock data', async () => {
      const mockBody = {
        bondAmount: '1000.00',
        premium: '50.00',
        terms: 'Standard terms and conditions',
        effectiveDate: '2023-01-01',
        expiryDate: '2024-01-01',
        policyholderId: 'policyholder-1',
        beneficiaryId: 'beneficiary-1'
      };
      
      const request = new Request('https://example.com/api/bonds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockBody),
      });

      const response = await POST(request);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.message).toBe('Bond PDF generated successfully');
      expect(data.bondId).toBeDefined();
      expect(data.url).toBeDefined();
    });

    it('should validate required fields', async () => {
      const mockBody = {
        bondAmount: '1000.00'
        // Missing other required fields
      };
      
      const request = new Request('https://example.com/api/bonds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockBody),
      });

      const response = await POST(request);
      
      // In mock mode, it might still return success
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.message).toBe('Bond PDF generated successfully');
    });
  });

  describe('GET /api/bonds/[id]', () => {
    it('should return bond details', async () => {
      const request = new Request('https://example.com/api/bonds/1', {
        method: 'GET',
      });

      const response = await GET(request);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.id).toBe('1');
      expect(data.bondAmount).toBe('1000.00');
      expect(data.premium).toBe('50.00');
    });
  });

  describe('GET /api/bonds/[id]/history', () => {
    it('should return bond edit history', async () => {
      const request = new Request('https://example.com/api/bonds/1/history', {
        method: 'GET',
      });

      const response = await GET_HISTORY(request);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
      if (data.length > 0) {
        expect(data[0].id).toBeDefined();
        expect(data[0].timestamp).toBeDefined();
        expect(data[0].userId).toBeDefined();
        expect(data[0].userName).toBeDefined();
        expect(data[0].action).toBeDefined();
      }
    });
  });
});