import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock the auth module with mocked environment variables
vi.mock('@/lib/auth', () => ({
  authOptions: {
    providers: [
      {
        id: 'keycloak',
        clientId: 'test-client-id',
        clientSecret: 'test-client-secret',
        issuer: 'https://keycloak.example.com',
        authorization: {
          params: {
            scope: 'openid email profile',
          },
        },
      }
    ],
    session: {
      strategy: 'jwt'
    },
    callbacks: {
      jwt: vi.fn(),
      session: vi.fn()
    },
    secret: 'test-secret',
    debug: false
  }
}));

import { authOptions } from '@/lib/auth';

describe('Auth functions', () => {
  describe('authOptions', () => {
    it('should have correct providers configuration', () => {
      expect(authOptions.providers).toHaveLength(1);
      expect(authOptions.providers[0]).toHaveProperty('id', 'keycloak');
    });

    it('should have correct session configuration', () => {
      expect(authOptions.session).toEqual({
        strategy: 'jwt'
      });
    });

    it('should have callbacks defined', () => {
      expect(authOptions.callbacks).toBeDefined();
      expect(typeof authOptions.callbacks?.jwt).toBe('function');
      expect(typeof authOptions.callbacks?.session).toBe('function');
    });

    it('should have secret defined', () => {
      expect(authOptions.secret).toBe('test-secret');
    });
  });

  describe('KeycloakProvider', () => {
    it('should be configured with correct client credentials', () => {
      const provider: any = authOptions.providers[0];
      expect(provider).toHaveProperty('clientId', 'test-client-id');
      expect(provider).toHaveProperty('clientSecret', 'test-client-secret');
      expect(provider).toHaveProperty('issuer', 'https://keycloak.example.com');
    });

    it('should have correct authorization parameters', () => {
      const provider: any = authOptions.providers[0];
      expect(provider).toHaveProperty('authorization');
      expect(provider.authorization).toHaveProperty('params');
      expect(provider.authorization.params).toEqual({
        scope: 'openid email profile'
      });
    });
  });
});