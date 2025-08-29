// Test data for unit and e2e tests

export const testUsers = [
  {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    password: 'admin123'
  },
  {
    id: 'broker-1',
    name: 'Broker User',
    email: 'broker@example.com',
    role: 'broker',
    password: 'broker123'
  },
  {
    id: 'policyholder-1',
    name: 'Policyholder User',
    email: 'policyholder@example.com',
    role: 'policyholder',
    password: 'policyholder123'
  },
  {
    id: 'wholesale-1',
    name: 'Wholesale User',
    email: 'wholesale@example.com',
    role: 'wholesale',
    password: 'wholesale123'
  }
];

export const testBrokers = [
  {
    id: 'broker-1',
    companyName: 'Test Broker Inc.',
    contactName: 'John Broker',
    email: 'john@broker.com',
    phone: '+1234567890',
    status: 'approved',
    editHistory: []
  }
];

export const testPolicyholders = [
  {
    id: 'policyholder-1',
    companyName: 'Test Company Ltd.',
    contactName: 'John Policyholder',
    email: 'john@company.com',
    phone: '+1234567891',
    status: 'approved',
    editHistory: []
  }
];

export const testProposals = [
  {
    id: 'proposal-1',
    title: 'Test Proposal',
    description: 'A test proposal for bonding',
    brokerId: 'broker-1',
    policyholderId: 'policyholder-1',
    status: 'approved',
    editHistory: []
  }
];

export const testOffers = [
  {
    id: 'offer-1',
    bondAmount: '1000.00',
    premium: '50.00',
    terms: 'Standard terms and conditions apply',
    effectiveDate: '2023-01-01',
    expiryDate: '2024-01-01',
    proposalId: 'proposal-1',
    status: 'pending',
    editHistory: []
  }
];

export const testBonds = [
  {
    id: 'bond-1',
    bondAmount: '1000.00',
    premium: '50.00',
    terms: 'Standard terms and conditions apply',
    effectiveDate: '2023-01-01',
    expiryDate: '2024-01-01',
    policyholderId: 'policyholder-1',
    beneficiaryId: 'beneficiary-1',
    status: 'active',
    editHistory: []
  }
];

export const testBeneficiaries = [
  {
    id: 'beneficiary-1',
    companyName: 'Test Beneficiary Inc.',
    contactName: 'John Beneficiary',
    email: 'john@beneficiary.com',
    phone: '+1234567892',
    status: 'approved',
    editHistory: []
  }
];

export const testEditHistory = [
  {
    id: 'history-1',
    timestamp: '2023-01-01T10:00:00Z',
    userId: 'admin-1',
    userName: 'Admin User',
    action: 'Created',
    changes: {}
  },
  {
    id: 'history-2',
    timestamp: '2023-01-02T10:00:00Z',
    userId: 'admin-1',
    userName: 'Admin User',
    action: 'Updated',
    changes: {
      status: 'approved'
    }
  }
];

export const testTokens = {
  validAcceptToken: 'valid-accept-token-123',
  expiredAcceptToken: 'expired-accept-token-123',
  invalidAcceptToken: 'invalid-accept-token-123'
};

export const testOTP = {
  valid: '123456',
  invalid: '000000'
};

export const testCountries = [
  { code: 'GB', name: 'United Kingdom' },
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' }
];

export const testCredentials = {
  admin: {
    email: 'admin@example.com',
    password: 'admin123'
  },
  broker: {
    email: 'broker@example.com',
    password: 'broker123'
  },
  policyholder: {
    email: 'policyholder@example.com',
    password: 'policyholder123'
  }
};