// Role util
export enum UserRole {
  ADMIN = 'admin',
  AGENT = 'agent',
  BROKER = 'broker',
  POLICYHOLDER = 'policyholder',
  WHOLESALE = 'wholesale',
}

export const rolePermissions = {
  [UserRole.ADMIN]: ['read', 'write', 'delete', 'manage-users'],
  [UserRole.AGENT]: ['read'],
  [UserRole.BROKER]: ['read', 'write'],
  [UserRole.POLICYHOLDER]: ['read'],
  [UserRole.WHOLESALE]: ['read', 'write', 'manage-brokers'],
};

export function hasPermission(userRole: UserRole, permission: string): boolean {
  const permissions = rolePermissions[userRole] || [];
  return permissions.includes(permission);
}

export function canAccessRoute(userRole: UserRole, route: string): boolean {
  // Implementation for checking if a user can access a route
  return true; // Placeholder implementation
}