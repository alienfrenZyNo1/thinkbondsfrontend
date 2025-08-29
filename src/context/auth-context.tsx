"use client";

import { useSession } from "next-auth/react";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any;
  groups: string[];
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  groups: [],
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [groups, setGroups] = useState<string[]>([]);

  useEffect(() => {
    if (session?.user?.groups) {
      setGroups(session.user.groups);
    } else if ((session as any)?.dominoData?.groups) {
      // Fallback to dominoData groups if user groups are not available
      setGroups((session as any).dominoData.groups);
    } else {
      setGroups([]);
    }
  }, [session]);

  const contextValue = {
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    user: session?.user || null,
    groups,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}