import { describe, it, expect } from 'vitest';
import { UserRole, hasPermission, canAccessRoute, rolePermissions } from '@/lib/roles';

describe('Roles utilities', () => {
  describe('hasPermission', () => {
    it('should return true when user role has the specified permission', () => {
      expect(hasPermission(UserRole.ADMIN, 'manage-users')).toBe(true);
      expect(hasPermission(UserRole.WHOLESALE, 'manage-brokers')).toBe(true);
      expect(hasPermission(UserRole.BROKER, 'write')).toBe(true);
    });

    it('should return false when user role does not have the specified permission', () => {
      expect(hasPermission(UserRole.AGENT, 'write')).toBe(false);
      expect(hasPermission(UserRole.POLICYHOLDER, 'write')).toBe(false);
      expect(hasPermission(UserRole.BROKER, 'manage-users')).toBe(false);
    });

    it('should return false for unknown roles', () => {
      expect(hasPermission('unknown' as UserRole, 'read')).toBe(false);
    });
  });

  describe('canAccessRoute', () => {
    it('should return true for placeholder implementation', () => {
      expect(canAccessRoute(UserRole.ADMIN, '/admin')).toBe(true);
      expect(canAccessRoute(UserRole.BROKER, '/broker')).toBe(true);
    });
  });

  describe('rolePermissions', () => {
    it('should define correct permissions for each role', () => {
      expect(rolePermissions[UserRole.ADMIN]).toEqual(['read', 'write', 'delete', 'manage-users']);
      expect(rolePermissions[UserRole.AGENT]).toEqual(['read']);
      expect(rolePermissions[UserRole.BROKER]).toEqual(['read', 'write']);
      expect(rolePermissions[UserRole.POLICYHOLDER]).toEqual(['read']);
      expect(rolePermissions[UserRole.WHOLESALE]).toEqual(['read', 'write', 'manage-brokers']);
    });
  });
});