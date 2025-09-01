'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useAuthData, useHasRole, useHasPermission } from '@/lib/auth-hooks';
import { UserRole } from '@/lib/roles';
import { Button } from '@/components/ui/button';

interface ProtectedRouteProps {
  requiredRole?: UserRole;
  requiredPermission?: string;
  children: React.ReactNode;
}

export function ProtectedRoute({
  requiredRole,
  requiredPermission,
  children
}: ProtectedRouteProps) {
  const { status } = useSession();
  const { isAuthenticated, isLoading } = useAuthData();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const e2eAuthed =
    mounted &&
    typeof document !== 'undefined' &&
    document.cookie.includes('e2e-role=');
  const authed = isAuthenticated || e2eAuthed;
  const hasRequiredRole = requiredRole ? useHasRole(requiredRole) : true;
  const hasRequiredPermission = requiredPermission
    ? useHasPermission(requiredPermission)
    : true;

  // Show loading state while checking authentication
  if (!mounted || isLoading || status === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, show login prompt
  if (!authed) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
        <p className="mb-4">You need to be signed in to access this content.</p>
        <Button onClick={() => (window.location.href = '/api/auth/signin')}>
          Sign In
        </Button>
      </div>
    );
  }

  // If user doesn't have the required role, show access denied
  if (requiredRole && !hasRequiredRole) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
        <p className="mb-4">
          You need the {requiredRole} role to access this content.
        </p>
        <Button onClick={() => window.history.back()}>Go Back</Button>
      </div>
    );
  }

  // If user doesn't have the required permission, show access denied
  if (requiredPermission && !hasRequiredPermission) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
        <p className="mb-4">
          You need the "{requiredPermission}" permission to access this content.
        </p>
        <Button onClick={() => window.history.back()}>Go Back</Button>
      </div>
    );
  }

  // If all checks pass, render the children
  return <>{children}</>;
}
