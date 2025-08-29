import { describe, it, expect } from 'vitest';
import { DominoAPI } from '@/lib/domino';

describe('DominoAPI', () => {
  let dominoAPI: DominoAPI;

  beforeEach(() => {
    dominoAPI = new DominoAPI('test-api-key');
  });

  describe('constructor', () => {
    it('should create an instance with default base URL', () => {
      expect(dominoAPI).toBeInstanceOf(DominoAPI);
    });

    it('should create an instance with custom base URL', () => {
      const customDominoAPI = new DominoAPI(
        'test-api-key',
        'https://custom.domino.com'
      );
      expect(customDominoAPI).toBeInstanceOf(DominoAPI);
    });
  });

  describe('getPolicyData', () => {
    it('should return policy data', async () => {
      const result = await dominoAPI.getPolicyData('policy-123');
      expect(result).toEqual({
        policyId: 'policy-123',
        message: 'Policy data from Domino API',
      });
    });
  });

  describe('createProposal', () => {
    it('should create a proposal', async () => {
      const proposalData = { title: 'Test Proposal' };
      const result = await dominoAPI.createProposal(proposalData);
      expect(result).toEqual({
        proposalData,
        message: 'Proposal created in Domino API',
      });
    });
  });

  describe('updatePolicy', () => {
    it('should update a policy', async () => {
      const updateData = { status: 'updated' };
      const result = await dominoAPI.updatePolicy('policy-123', updateData);
      expect(result).toEqual({
        policyId: 'policy-123',
        updateData,
        message: 'Policy updated in Domino API',
      });
    });
  });

  describe('createBondOffer', () => {
    it('should create a bond offer', async () => {
      const offerData = { amount: 1000 };
      const result = await dominoAPI.createBondOffer(offerData);
      expect(result).toEqual({
        offerData,
        message: 'Bond offer created in Domino API',
      });
    });
  });

  describe('getBondOffer', () => {
    it('should get a bond offer', async () => {
      const result = await dominoAPI.getBondOffer('offer-123');
      expect(result).toEqual({
        offerId: 'offer-123',
        message: 'Bond offer data from Domino API',
      });
    });
  });

  describe('acceptBondOffer', () => {
    it('should accept a bond offer', async () => {
      const acceptanceData = { accepted: true };
      const result = await dominoAPI.acceptBondOffer(
        'offer-123',
        acceptanceData
      );
      expect(result).toEqual({
        offerId: 'offer-123',
        acceptanceData,
        message: 'Bond offer accepted in Domino API',
      });
    });
  });

  describe('rejectBondOffer', () => {
    it('should reject a bond offer', async () => {
      const rejectionData = { reason: 'Not interested' };
      const result = await dominoAPI.rejectBondOffer(
        'offer-123',
        rejectionData
      );
      expect(result).toEqual({
        offerId: 'offer-123',
        rejectionData,
        message: 'Bond offer rejected in Domino API',
      });
    });
  });

  describe('generateBondPDF', () => {
    it('should generate a bond PDF', async () => {
      const result = await dominoAPI.generateBondPDF('offer-123');
      expect(result).toEqual({
        offerId: 'offer-123',
        message: 'Bond PDF generated in Domino API',
      });
    });
  });
});
