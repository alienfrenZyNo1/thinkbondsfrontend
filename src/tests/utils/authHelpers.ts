// Authentication test helpers

import { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';

// Mock session data
export const mockSession: Session = {
  user: {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    image: undefined,
    groups: ['broker'],
    dominoData: {
      id: 'domino-1',
      name: 'Test User',
      email: 'test@example.com',
      groups: ['broker', 'user'],
    },
  },
  accessToken: 'mock-access-token',
  expires: new Date(Date.now() + 3600 * 1000).toISOString(), // 1 hour from now
};

// Mock JWT token data
export const mockToken: JWT = {
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
  expiresAt: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
  user: {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
  },
  dominoData: {
    groups: ['broker', 'user'],
    user: {
      id: 'domino-1',
      name: 'Test User',
      email: 'test@example.com',
      groups: ['broker', 'user'],
    },
  },
};

// Mock admin session data
export const mockAdminSession: Session = {
  user: {
    id: '2',
    name: 'Admin User',
    email: 'admin@example.com',
    image: undefined,
    groups: ['admin'],
    dominoData: {
      id: 'domino-2',
      name: 'Admin User',
      email: 'admin@example.com',
      groups: ['admin'],
    },
  },
  accessToken: 'mock-admin-access-token',
  expires: new Date(Date.now() + 3600 * 1000).toISOString(),
};

// Mock admin JWT token data
export const mockAdminToken: JWT = {
  accessToken: 'mock-admin-access-token',
  refreshToken: 'mock-admin-refresh-token',
  expiresAt: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
  user: {
    id: '2',
    name: 'Admin User',
    email: 'admin@example.com',
  },
  dominoData: {
    groups: ['admin'],
    user: {
      id: 'domino-2',
      name: 'Admin User',
      email: 'admin@example.com',
      groups: ['admin'],
    },
  },
};

// Mock broker session data
export const mockBrokerSession: Session = {
  user: {
    id: '3',
    name: 'Broker User',
    email: 'broker@example.com',
    image: undefined,
    groups: ['broker'],
    dominoData: {
      id: 'domino-3',
      name: 'Broker User',
      email: 'broker@example.com',
      groups: ['broker'],
    },
  },
  accessToken: 'mock-broker-access-token',
  expires: new Date(Date.now() + 3600 * 1000).toISOString(),
};

// Mock policyholder session data
export const mockPolicyholderSession: Session = {
  user: {
    id: '4',
    name: 'Policyholder User',
    email: 'policyholder@example.com',
    image: undefined,
    groups: ['policyholder'],
    dominoData: {
      id: 'domino-4',
      name: 'Policyholder User',
      email: 'policyholder@example.com',
      groups: ['policyholder'],
    },
  },
  accessToken: 'mock-policyholder-access-token',
  expires: new Date(Date.now() + 3600 * 1000).toISOString(),
};

// Function to create a mock session with custom properties
export function createMockSession(
  id: string,
  name: string,
  email: string,
  groups: string[] = ['user'],
  accessToken: string = 'mock-access-token'
): Session {
  return {
    user: {
      id,
      name,
      email,
      image: undefined,
      groups,
      dominoData: {
        id: `domino-${id}`,
        name,
        email,
        groups,
      },
    },
    accessToken,
    expires: new Date(Date.now() + 3600 * 1000).toISOString(),
  };
}

// Function to create a mock JWT token with custom properties
export function createMockToken(
  id: string,
  name: string,
  email: string,
  groups: string[] = ['user'],
  accessToken: string = 'mock-access-token'
): JWT {
  return {
    accessToken,
    refreshToken: `mock-refresh-token-${id}`,
    expiresAt: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
    user: {
      id,
      name,
      email,
    },
    dominoData: {
      groups,
      user: {
        id: `domino-${id}`,
        name,
        email,
        groups,
      },
    },
  };
}
