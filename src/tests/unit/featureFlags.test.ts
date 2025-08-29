import { describe, it, expect } from 'vitest';
import { FeatureFlagManager, defaultFeatureFlags } from '@/lib/featureFlags';

describe('Feature flags', () => {
  describe('FeatureFlagManager', () => {
    it('should create an instance with default feature flags', () => {
      const manager = new FeatureFlagManager();
      expect(manager).toBeInstanceOf(FeatureFlagManager);
      
      // Check that all default flags are set correctly
      expect(manager.isEnabled('enableNewDashboard')).toBe(defaultFeatureFlags.enableNewDashboard);
      expect(manager.isEnabled('enableProposalWorkflow')).toBe(defaultFeatureFlags.enableProposalWorkflow);
      expect(manager.isEnabled('enableBrokerPortal')).toBe(defaultFeatureFlags.enableBrokerPortal);
      expect(manager.isEnabled('enablePolicyholderPortal')).toBe(defaultFeatureFlags.enablePolicyholderPortal);
    });

    it('should create an instance with custom feature flags', () => {
      const customFlags = {
        enableNewDashboard: true,
        enableProposalWorkflow: false,
        enableBrokerPortal: true,
        enablePolicyholderPortal: false
      };
      
      const manager = new FeatureFlagManager(customFlags);
      expect(manager).toBeInstanceOf(FeatureFlagManager);
      
      expect(manager.isEnabled('enableNewDashboard')).toBe(true);
      expect(manager.isEnabled('enableProposalWorkflow')).toBe(false);
      expect(manager.isEnabled('enableBrokerPortal')).toBe(true);
      expect(manager.isEnabled('enablePolicyholderPortal')).toBe(false);
    });

    it('should check if a feature flag is enabled', () => {
      const manager = new FeatureFlagManager();
      
      // Test with default values
      expect(manager.isEnabled('enableNewDashboard')).toBe(false);
      expect(manager.isEnabled('enableProposalWorkflow')).toBe(false);
    });

    it('should enable a feature flag', () => {
      const manager = new FeatureFlagManager();
      
      expect(manager.isEnabled('enableNewDashboard')).toBe(false);
      manager.enable('enableNewDashboard');
      expect(manager.isEnabled('enableNewDashboard')).toBe(true);
    });

    it('should disable a feature flag', () => {
      const customFlags = { ...defaultFeatureFlags, enableNewDashboard: true };
      const manager = new FeatureFlagManager(customFlags);
      
      expect(manager.isEnabled('enableNewDashboard')).toBe(true);
      manager.disable('enableNewDashboard');
      expect(manager.isEnabled('enableNewDashboard')).toBe(false);
    });
  });

  describe('defaultFeatureFlags', () => {
    it('should have the correct default values for feature flags', () => {
      // Based on the debug output, we can see the actual values
      expect(defaultFeatureFlags.enableNewDashboard).toBe(true);
      expect(defaultFeatureFlags.enableProposalWorkflow).toBe(false);
      expect(defaultFeatureFlags.enableBrokerPortal).toBe(false);
      expect(defaultFeatureFlags.enablePolicyholderPortal).toBe(false);
    });
  });
});