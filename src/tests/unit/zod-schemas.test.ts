import { describe, it, expect } from 'vitest';
import {
  entityStatusSchema,
  editHistorySchema,
  userSchema,
  brokerSchema,
  policyholderSchema,
  proposalSchema,
  accessRequestSchema,
  pinVerificationSchema,
  brokerRegistrationSchema,
  creditsafeCompanySchema,
  creditsafeFinancialSummarySchema,
  creditsafeCreditScoreSchema,
  creditsafeReportSchema,
  beneficiarySchema,
  bondSchema,
  offerSchema,
} from '@/lib/zod-schemas';

describe('Zod Schemas', () => {
  describe('entityStatusSchema', () => {
    it('should validate correct status values', () => {
      expect(entityStatusSchema.parse('pending')).toBe('pending');
      expect(entityStatusSchema.parse('approved')).toBe('approved');
      expect(entityStatusSchema.parse('declined')).toBe('declined');
      expect(entityStatusSchema.parse('soft_deleted')).toBe('soft_deleted');
    });

    it('should throw error for invalid status values', () => {
      expect(() => entityStatusSchema.parse('invalid')).toThrow();
    });
  });

  describe('editHistorySchema', () => {
    it('should validate correct edit history data', () => {
      const validData = {
        id: '1',
        timestamp: '2023-01-01T00:00:00Z',
        userId: 'user1',
        userName: 'Test User',
        action: 'Created',
        changes: { field: 'value' },
      };

      expect(editHistorySchema.parse(validData)).toEqual(validData);
    });

    it('should validate edit history data without optional changes', () => {
      const validData = {
        id: '1',
        timestamp: '2023-01-01T00:00Z',
        userId: 'user1',
        userName: 'Test User',
        action: 'Created',
      };

      expect(editHistorySchema.parse(validData)).toEqual(validData);
    });

    it('should throw error for invalid timestamp', () => {
      const invalidData = {
        id: '1',
        timestamp: 'invalid-date',
        userId: 'user1',
        userName: 'Test User',
        action: 'Created',
      };

      expect(() => editHistorySchema.parse(invalidData)).toThrow();
    });
  });

  describe('userSchema', () => {
    it('should validate correct user data', () => {
      const validData = {
        name: 'Test User',
        email: 'test@example.com',
        role: 'admin',
      };

      expect(userSchema.parse(validData)).toEqual(validData);
    });

    it('should throw error for invalid email', () => {
      const invalidData = {
        name: 'Test User',
        email: 'invalid-email',
        role: 'admin',
      };

      expect(() => userSchema.parse(invalidData)).toThrow();
    });

    it('should throw error for missing name', () => {
      const invalidData = {
        email: 'test@example.com',
        role: 'admin',
      };

      expect(() => userSchema.parse(invalidData)).toThrow();
    });
  });

  describe('brokerSchema', () => {
    it('should validate correct broker data', () => {
      const validData = {
        companyName: 'Test Company',
        contactName: 'Test Contact',
        email: 'test@example.com',
        phone: '1234567890',
        status: 'pending',
        editHistory: [],
      };

      expect(brokerSchema.parse(validData)).toEqual(validData);
    });

    it('should use default status when not provided', () => {
      const validData = {
        companyName: 'Test Company',
        contactName: 'Test Contact',
        email: 'test@example.com',
        phone: '1234567890',
      };

      const result = brokerSchema.parse(validData);
      expect(result.status).toBe('pending');
      expect(result.editHistory).toEqual([]);
    });
  });

  describe('policyholderSchema', () => {
    it('should validate correct policyholder data', () => {
      const validData = {
        companyName: 'Test Company',
        contactName: 'Test Contact',
        email: 'test@example.com',
        phone: '1234567890',
        status: 'approved',
        editHistory: [],
      };

      expect(policyholderSchema.parse(validData)).toEqual(validData);
    });
  });

  describe('proposalSchema', () => {
    it('should validate correct proposal data', () => {
      const validData = {
        title: 'Test Proposal',
        description: 'Test Description',
        brokerId: 'broker-1',
        policyholderId: 'policyholder-1',
        status: 'pending',
        editHistory: [],
      };

      expect(proposalSchema.parse(validData)).toEqual(validData);
    });
  });

  describe('accessRequestSchema', () => {
    it('should validate correct access request data', () => {
      const validData = {
        email: 'test@example.com',
        country: 'USA',
      };

      expect(accessRequestSchema.parse(validData)).toEqual(validData);
    });

    it('should throw error for invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
        country: 'USA',
      };

      expect(() => accessRequestSchema.parse(invalidData)).toThrow();
    });
  });

  describe('pinVerificationSchema', () => {
    it('should validate correct PIN verification data', () => {
      const validData = {
        email: 'test@example.com',
        pin: '123456',
      };

      expect(pinVerificationSchema.parse(validData)).toEqual(validData);
    });

    it('should throw error for invalid PIN format', () => {
      const invalidData = {
        email: 'test@example.com',
        pin: '12345', // Too short
      };

      expect(() => pinVerificationSchema.parse(invalidData)).toThrow();
    });

    it('should throw error for non-numeric PIN', () => {
      const invalidData = {
        email: 'test@example.com',
        pin: '123abc', // Contains letters
      };

      expect(() => pinVerificationSchema.parse(invalidData)).toThrow();
    });
  });

  describe('brokerRegistrationSchema', () => {
    it('should validate correct broker registration data', () => {
      const validData = {
        companyName: 'Test Company',
        companyNumber: '123456',
        contactName: 'Test Contact',
        email: 'test@example.com',
        phone: '1234567890',
        address: '123 Test St',
        city: 'Test City',
        postcode: '12345',
        country: 'USA',
      };

      expect(brokerRegistrationSchema.parse(validData)).toEqual(validData);
    });
  });

  describe('creditsafeCompanySchema', () => {
    it('should validate correct Creditsafe company data', () => {
      const validData = {
        id: '1',
        name: 'Test Company',
        number: '123456',
        country: 'USA',
        address: '123 Test St',
        city: 'Test City',
        postcode: '12345',
      };

      expect(creditsafeCompanySchema.parse(validData)).toEqual(validData);
    });
  });

  describe('creditsafeFinancialSummarySchema', () => {
    it('should validate correct financial summary data', () => {
      const validData = {
        currency: 'USD',
        revenue: 1000000,
        profit: 100000,
        equity: 500000,
        employees: 50,
      };

      expect(creditsafeFinancialSummarySchema.parse(validData)).toEqual(
        validData
      );
    });

    it('should throw error for negative revenue', () => {
      const invalidData = {
        currency: 'USD',
        revenue: -1000000,
        profit: 100000,
        equity: 500000,
        employees: 50,
      };

      expect(() =>
        creditsafeFinancialSummarySchema.parse(invalidData)
      ).toThrow();
    });
  });

  describe('creditsafeCreditScoreSchema', () => {
    it('should validate correct credit score data', () => {
      const validData = {
        score: 80,
        rating: 'A',
        limit: 1000000,
      };

      expect(creditsafeCreditScoreSchema.parse(validData)).toEqual(validData);
    });

    it('should throw error for score out of range', () => {
      const invalidData = {
        score: 150,
        rating: 'A',
        limit: 1000000,
      };

      expect(() => creditsafeCreditScoreSchema.parse(invalidData)).toThrow();
    });
  });

  describe('creditsafeReportSchema', () => {
    it('should validate correct Creditsafe report data', () => {
      const validData = {
        companyId: '1',
        companyName: 'Test Company',
        registrationNumber: '123456',
        status: 'Active',
        legalForm: 'LLC',
        incorporationDate: '2020-01-01',
        address: '123 Test St',
        city: 'Test City',
        postcode: '12345',
        country: 'USA',
      };

      expect(creditsafeReportSchema.parse(validData)).toEqual(validData);
    });
  });

  describe('beneficiarySchema', () => {
    it('should validate correct beneficiary data', () => {
      const validData = {
        companyName: 'Test Company',
        contactName: 'Test Contact',
        email: 'test@example.com',
        phone: '1234567890',
        status: 'pending',
        editHistory: [],
      };

      expect(beneficiarySchema.parse(validData)).toEqual(validData);
    });
  });

  describe('bondSchema', () => {
    it('should validate correct bond data', () => {
      const validData = {
        bondAmount: '1000.00',
        premium: '50.00',
        terms: 'Standard terms and conditions apply',
        effectiveDate: '2023-01-01',
        expiryDate: '2024-01-01',
        policyholderId: 'policyholder-1',
        beneficiaryId: 'beneficiary-1',
        status: 'pending',
        editHistory: [],
      };

      expect(bondSchema.parse(validData)).toEqual(validData);
    });

    it('should throw error for invalid amount format', () => {
      const invalidData = {
        bondAmount: 'invalid',
        premium: '50.00',
        terms: 'Standard terms and conditions apply',
        effectiveDate: '2023-01-01',
        expiryDate: '2024-01-01',
        policyholderId: 'policyholder-1',
        beneficiaryId: 'beneficiary-1',
      };

      expect(() => bondSchema.parse(invalidData)).toThrow();
    });
  });

  describe('offerSchema', () => {
    it('should validate correct offer data', () => {
      const validData = {
        bondAmount: '1000.00',
        premium: '50.00',
        terms: 'Standard terms and conditions apply',
        effectiveDate: '2023-01-01',
        expiryDate: '2024-01-01',
        proposalId: 'proposal-1',
        status: 'pending',
        editHistory: [],
      };

      expect(offerSchema.parse(validData)).toEqual(validData);
    });
  });
});
