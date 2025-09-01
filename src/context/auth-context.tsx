'use client';

import { useSession } from 'next-auth/react';
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState
} from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: unknown;
  groups: string[];
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  groups: []
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [groups, setGroups] = useState<string[]>([]);
  const [demoRole, setDemoRole] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cookies = document.cookie || '';
      const match = cookies.match(/(?:^|;\s*)e2e-role=([^;]+)/);
      setDemoRole(match?.[1] || null);
    }
  }, []);

  useEffect(() => {
    if (session?.user?.groups) {
      setGroups(session.user.groups);
    } else if (
      (session as unknown as { dominoData?: { groups?: string[] } })?.dominoData
        ?.groups
    ) {
      // Fallback to dominoData groups if user groups are not available
      setGroups(
        (session as unknown as { dominoData?: { groups?: string[] } })
          ?.dominoData?.groups || []
      );
    } else {
      setGroups([]);
    }
  }, [session]);

  const isAuthenticated = status === 'authenticated' || !!demoRole;
  const user =
    session?.user ||
    (demoRole
      ? {
          id: '1',
          name: `${demoRole.charAt(0).toUpperCase()}${demoRole.slice(1)} User`,
          email: `${demoRole}@example.com`,
          groups: [demoRole]
        }
      : null);

  const contextValue = {
    isAuthenticated,
    isLoading: status === 'loading',
    user,
    groups: groups.length ? groups : demoRole ? [demoRole] : []
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
