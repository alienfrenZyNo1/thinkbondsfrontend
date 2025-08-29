// Feature toggles
export interface FeatureFlags {
  enableNewDashboard: boolean;
  enableProposalWorkflow: boolean;
 enableBrokerPortal: boolean;
  enablePolicyholderPortal: boolean;
}

export const defaultFeatureFlags: FeatureFlags = {
  enableNewDashboard: false,
  enableProposalWorkflow: false,
  enableBrokerPortal: false,
  enablePolicyholderPortal: false,
};

export class FeatureFlagManager {
  private flags: FeatureFlags;

  constructor(flags: FeatureFlags = defaultFeatureFlags) {
    this.flags = flags;
  }

  isEnabled(flag: keyof FeatureFlags): boolean {
    return this.flags[flag];
  }

  enable(flag: keyof FeatureFlags): void {
    this.flags[flag] = true;
  }

  disable(flag: keyof FeatureFlags): void {
    this.flags[flag] = false;
  }
}