'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

const roles = [
  'admin',
  'wholesale',
  'broker',
  'agent',
  'policyholder'
] as const;

function SignInInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const callbackUrl = sp?.get('callbackUrl') || '/dashboard';
  const [current, setCurrent] = useState<string>('');

  useEffect(() => {
    const cookies = document.cookie || '';
    const match = cookies.match(/(?:^|;\s*)e2e-role=([^;]+)/);
    setCurrent(match?.[1] || '');
  }, []);

  const applyRole = (role: string | null) => {
    if (role) {
      document.cookie = `e2e-role=${role}; Max-Age=31536000; path=/`;
    } else {
      document.cookie = 'e2e-role=; Max-Age=0; path=/';
    }
    router.push(callbackUrl);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Sign In</h1>
      <p className="text-gray-700 mb-4">
        This portal uses Keycloak for authentication in production. For local
        testing and demos, you can select a role below to continue.
      </p>
      <div className="mb-6">
        <p className="text-sm text-gray-600">
          Current demo role: <strong>{current || 'none'}</strong>
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {roles.map(r => (
          <Button key={r} variant="outline" onClick={() => applyRole(r)}>
            Continue as {r}
          </Button>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => applyRole(null)}>
          Clear role
        </Button>
        <Button
          onClick={() => (window.location.href = '/api/auth/signin')}
          title="Simulate production sign-in"
        >
          Go to Keycloak (prod)
        </Button>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <div className="p-4">
      <Suspense
        fallback={
          <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            Loading…
          </div>
        }
      >
        <SignInInner />
      </Suspense>
    </div>
  );
}
