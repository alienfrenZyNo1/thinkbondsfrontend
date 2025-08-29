'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function AuthErrorHandler() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Check if there's an authentication error
    if ((session as any)?.error === 'RefreshAccessTokenError') {
      // Sign out the user to clear the invalid session
      // This will redirect them to the sign-in page
      router.push('/api/auth/signout');
    }
  }, [session, router]);

  // This component doesn't render anything
  return null;
}
