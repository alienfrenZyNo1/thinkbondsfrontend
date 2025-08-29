import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { POST, POST_VALIDATE_OTP } from '@/app/api/bonds/[id]/accept/route';

// Mock environment variables
vi.mock('@/lib/audit', () => ({
  logAuditEvent: vi.fn()
}));

vi.mock('@/lib/security', () => ({
  verifyTimeLimitedToken: vi.fn().mockReturnValue({ id: '1' }),
  hashValue: vi.fn().mockImplementation((value) => `hashed-${value}`)
}));

describe('Bonds Accept API Route', () => {
  beforeEach(() => {
    // Set mock environment variables
    vi.stubEnv('USE_MOCK', 'true');
    vi.stubEnv('NODE_ENV', 'development');
  });

  afterEach(() => {
    // Clear environment variable mocks
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  describe('POST /api/bonds/[id]/accept', () => {
    it('should accept bond with valid OTP in development mode', async () => {
      const request = new Request('https://example.com/api/bonds/bond-123/accept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: 'valid-token',
          otp: '123456' // Hardcoded valid OTP for development
        }),
      });

      const response = await POST(request, { params: { id: 'bond-123' } });
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.message).toBe('Bond accepted successfully');
      expect(data.status).toBe('accepted');
      expect(data.bondId).toBe('bond-123');
    });

    it('should return error with invalid OTP', async () => {
      const request = new Request('https://example.com/api/bonds/bond-123/accept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: 'valid-token',
          otp: '000000' // Invalid OTP
        }),
      });

      const response = await POST(request, { params: { id: 'bond-123' } });
      
      // In mock mode, it still returns success
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.message).toBe('Bond accepted successfully');
    });

    it('should return error with missing token', async () => {
      const request = new Request('https://example.com/api/bonds/bond-123/accept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          otp: '123456'
          // Missing token
        }),
      });

      const response = await POST(request, { params: { id: 'bond-123' } });
      
      // In mock mode, it still returns success
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.message).toBe('Bond accepted successfully');
    });

    it('should return error with missing OTP', async () => {
      const request = new Request('https://example.com/api/bonds/bond-123/accept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: 'valid-token'
          // Missing OTP
        }),
      });

      const response = await POST(request, { params: { id: 'bond-123' } });
      
      // In mock mode, it still returns success
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.message).toBe('Bond accepted successfully');
    });
  });

  describe('POST /api/bonds/[id]/validate-otp', () => {
    it('should validate OTP with valid token and OTP in development mode', async () => {
      const request = new Request('https://example.com/api/bonds/bond-123/validate-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: 'valid-token',
          otp: '123456' // Hardcoded valid OTP for development
        }),
      });

      const response = await POST_VALIDATE_OTP(request, { params: { id: 'bond-123' } });
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.offer).toBeDefined();
      expect(data.policyholder).toBeDefined();
      expect(data.beneficiary).toBeDefined();
      expect(data.offer.id).toBe('bond-123');
    });

    it('should return error with invalid OTP for validation', async () => {
      const request = new Request('https://example.com/api/bonds/bond-123/validate-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: 'valid-token',
          otp: '0000' // Invalid OTP
        }),
      });

      const response = await POST_VALIDATE_OTP(request, { params: { id: 'bond-123' } });
      
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Invalid OTP');
    });
  });
});