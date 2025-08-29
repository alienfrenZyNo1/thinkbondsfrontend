import { useSession } from "next-auth/react";
import { useAuth } from "@/context/auth-context";
import { UserRole } from "@/lib/roles";

export function useAuthData() {
  const { data: session, status } = useSession();
  const { isAuthenticated, isLoading, user, groups } = useAuth();

  return {
    session,
    status,
    isAuthenticated,
    isLoading,
    user,
    groups,
    accessToken: session?.accessToken,
  };
}

export function useHasRole(requiredRole: UserRole) {
  const { groups } = useAuth();
  
  // Check if user has the required role
  return groups.includes(requiredRole);
}

export function useHasPermission(permission: string) {
  const { groups } = useAuth();
  
  // For now, we'll implement a simple permission check
  // In a real implementation, you would check against a permissions matrix
  if (groups.includes(UserRole.ADMIN)) {
    return true; // Admins have all permissions
  }
  
  if (groups.includes(UserRole.AGENT) && permission === "read") {
    return true;
  }
  
  if (groups.includes(UserRole.BROKER) &&
      (permission === "read" || permission === "write")) {
    return true;
  }
  
  if (groups.includes(UserRole.POLICYHOLDER) && permission === "read") {
    return true;
  }
  
  if (groups.includes(UserRole.WHOLESALE) &&
      (permission === "read" || permission === "write" || permission === "manage-brokers")) {
    return true;
  }
  
  return false;
}

export function useCanAccessRoute(route: string) {
  const { groups } = useAuth();
  
  // Simple route access control
  // In a real implementation, you would have a more sophisticated routing system
  if (groups.includes(UserRole.ADMIN)) {
    return true; // Admins can access everything
  }
  
  if (groups.includes(UserRole.AGENT) &&
      (route.includes("/broker") || route.includes("/policyholder") || route.includes("/proposal"))) {
    return true;
  }
  
  if (route.includes("/broker") && groups.includes(UserRole.BROKER)) {
    return true;
  }
  
  if (route.includes("/policyholder") &&
      (groups.includes(UserRole.POLICYHOLDER) || groups.includes(UserRole.BROKER))) {
    return true;
  }
  
  if (route.includes("/wholesale") && groups.includes(UserRole.WHOLESALE)) {
    return true;
  }
  
  // Public routes
  if (route === "/" ||
      route.includes("/access/request") ||
      route.includes("/broker/register") ||
      route.includes("/accept")) {
    return true;
  }
  
  return false;
}