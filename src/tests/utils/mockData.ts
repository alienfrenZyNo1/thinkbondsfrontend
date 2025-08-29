// Mock data generators for testing

export const mockUsers = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
  },
  {
    id: '2',
    name: 'Broker User',
    email: 'broker@example.com',
    role: 'broker',
  },
  {
    id: '3',
    name: 'Policyholder User',
    email: 'policyholder@example.com',
    role: 'policyholder',
  },
];

export const mockBrokers = [
  {
    id: '1',
    companyName: 'Test Broker Inc.',
    contactName: 'John Broker',
    email: 'john@broker.com',
    phone: '+1234567890',
    status: 'approved',
    editHistory: [],
  },
  {
    id: '2',
    companyName: 'Another Broker Ltd.',
    contactName: 'Jane Broker',
    email: 'jane@broker.com',
    phone: '+1234567891',
    status: 'pending',
    editHistory: [],
  },
];

export const mockPolicyholders = [
  {
    id: '1',
    companyName: 'Test Company Inc.',
    contactName: 'John Policyholder',
    email: 'john@company.com',
    phone: '+1234567892',
    status: 'approved',
    editHistory: [],
  },
];

export const mockProposals = [
  {
    id: '1',
    title: 'Test Proposal',
    description: 'A test proposal for bonding',
    brokerId: '1',
    policyholderId: '1',
    status: 'approved',
    editHistory: [],
  },
];

export const mockOffers = [
  {
    id: '1',
    bondAmount: '1000.00',
    premium: '50.00',
    terms: 'Standard terms and conditions apply',
    effectiveDate: '2023-01-01',
    expiryDate: '2024-01-01',
    proposalId: '1',
    status: 'pending',
    editHistory: [],
  },
];

export const mockBonds = [
  {
    id: '1',
    bondAmount: '1000.00',
    premium: '50.00',
    terms: 'Standard terms and conditions apply',
    effectiveDate: '2023-01-01',
    expiryDate: '2024-01-01',
    policyholderId: '1',
    beneficiaryId: '1',
    status: 'active',
    editHistory: [],
  },
];

export const mockBeneficiaries = [
  {
    id: '1',
    companyName: 'Test Beneficiary Inc.',
    contactName: 'John Beneficiary',
    email: 'john@beneficiary.com',
    phone: '+1234567893',
    status: 'approved',
    editHistory: [],
  },
];

export const mockCreditsafeCompanies = [
  {
    id: '1',
    name: 'Test Company Ltd.',
    number: '12345678',
    country: 'GB',
    address: '123 Test Street',
    city: 'Test City',
    postcode: 'TE1 1ST',
  },
];

export const mockCreditsafeReports = [
  {
    companyId: '1',
    companyName: 'Test Company Ltd.',
    registrationNumber: '12345678',
    status: 'Active',
    legalForm: 'Limited',
    incorporationDate: '2020-01-01',
    address: '123 Test Street',
    city: 'Test City',
    postcode: 'TE1 1ST',
    country: 'GB',
    financialSummary: {
      currency: 'GBP',
      revenue: 1000000,
      profit: 100000,
      equity: 500000,
      employees: 50,
    },
    creditScore: {
      score: 80,
      rating: 'A',
      limit: 1000000,
    },
  },
];

export const mockEditHistory = [
  {
    id: '1',
    timestamp: '2023-01-01T10:00:00Z',
    userId: '1',
    userName: 'Admin User',
    action: 'Created',
    changes: {},
  },
  {
    id: '2',
    timestamp: '2023-01-02T10:00Z',
    userId: '1',
    userName: 'Admin User',
    action: 'Updated',
    changes: {
      status: 'approved',
    },
  },
];

// Function to generate mock edit history entries
export function generateMockEditHistory(
  userId: string,
  userName: string,
  action: string,
  changes: Record<string, unknown> = {}
) {
  return {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    userId,
    userName,
    action,
    changes,
  };
}

// Function to generate mock user
export function generateMockUser(
  id: string,
  name: string,
  email: string,
  role: string
) {
  return {
    id,
    name,
    email,
    role,
  };
}

// Function to generate mock broker
export function generateMockBroker(
  id: string,
  companyName: string,
  contactName: string,
  email: string,
  phone: string,
  status: string = 'pending'
) {
  return {
    id,
    companyName,
    contactName,
    email,
    phone,
    status,
    editHistory: [],
  };
}

// Function to generate mock policyholder
export function generateMockPolicyholder(
  id: string,
  companyName: string,
  contactName: string,
  email: string,
  phone: string,
  status: string = 'pending'
) {
  return {
    id,
    companyName,
    contactName,
    email,
    phone,
    status,
    editHistory: [],
  };
}

// Function to generate mock proposal
export function generateMockProposal(
  id: string,
  title: string,
  description: string,
  brokerId: string,
  policyholderId: string,
  status: string = 'pending'
) {
  return {
    id,
    title,
    description,
    brokerId,
    policyholderId,
    status,
    editHistory: [],
  };
}
