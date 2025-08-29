'use client';

import { SessionProvider } from 'next-auth/react';
import type { Session } from 'next-auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

interface ProvidersProps {
  children: React.ReactNode;
}

interface E2EUser {
  id: string;
  name: string;
  email: string;
  groups: string[];
  dominoData: {
    id: string;
    name: string;
    email: string;
    groups: string[];
  };
}

interface E2ESession extends Session {
  user: E2EUser;
  accessToken: string;
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(() => new QueryClient());

  // Provide a synthetic session for e2e when enabled via env + cookie
  let initialSession: Session | null = null;
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_E2E === 'true') {
    const cookies = document.cookie || '';
    const roleMatch = cookies.match(/(?:^|;\s*)e2e-role=([^;]+)/);
    const role = roleMatch?.[1] || '';
    if (role) {
      const capitalized = role.charAt(0).toUpperCase() + role.slice(1);
      initialSession = {
        user: {
          id: '1',
          name: `${capitalized} User`,
          email: `${role}@example.com`,
          groups: [role],
          dominoData: {
            id: 'domino-1',
            name: `${capitalized} User`,
            email: `${role}@example.com`,
            groups: [role],
          },
        },
        expires: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        accessToken: 'mock-access-token',
      } as E2ESession;
    }
  }

  return (
    <SessionProvider
      refetchInterval={0}
      refetchOnWindowFocus={false}
      session={initialSession}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </SessionProvider>
  );
}
