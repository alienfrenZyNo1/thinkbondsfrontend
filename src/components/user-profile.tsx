'use client';

import { useAuthData } from '@/lib/auth-hooks';
import { Button } from '@/components/ui/button';

export function UserProfile() {
  const { user, groups, isAuthenticated, isLoading } = useAuthData();
  type SafeUser = {
    image?: string | null;
    name?: string | null;
    email?: string | null;
  } | null;
  const u = (user as SafeUser) ?? null;

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="animate-pulse rounded-full bg-gray-300 h-10 w-10"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 rounded w-24"></div>
          <div className="h-4 bg-gray-300 rounded w-16"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          onClick={() => {
            const cb =
              typeof window !== 'undefined' ? window.location.href : '/';
            window.location.href = `/sign-in?callbackUrl=${encodeURIComponent(cb)}`;
          }}
        >
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      <div className="relative">
        {u?.image ? (
          <img
            src={u.image || ''}
            alt={u.name || 'User'}
            className="rounded-full h-10 w-10 object-cover"
          />
        ) : (
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10 flex items-center justify-center">
            <span className="text-gray-500 text-sm font-medium">
              {u?.name?.charAt(0) || u?.email?.charAt(0) || 'U'}
            </span>
          </div>
        )}
      </div>
      <div className="hidden md:block">
        <p className="text-sm font-medium">{u?.name || u?.email}</p>
        <p className="text-xs text-gray-500">
          {groups.length > 0 ? groups.join(', ') : 'No groups'}
        </p>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => (window.location.href = '/api/auth/signout')}
      >
        Sign Out
      </Button>
    </div>
  );
}
