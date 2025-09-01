'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

const roles = [
  'admin',
  'wholesale',
  'broker',
  'agent',
  'policyholder'
] as const;

export function RoleSwitcher() {
  const [current, setCurrent] = useState<string>('');
  const [open, setOpen] = useState(false);

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
    // Reload to let SSR + client pick up new role consistently
    location.reload();
  };

  return (
    <div className="relative">
      <Button variant="outline" size="sm" onClick={() => setOpen(o => !o)}>
        Role: {current || 'none'}
      </Button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 rounded-md border bg-white shadow-md">
          <button
            className="w-full text-left px-3 py-2 hover:bg-gray-100"
            onClick={() => applyRole(null)}
          >
            Clear role
          </button>
          <div className="border-t my-1" />
          {roles.map(r => (
            <button
              key={r}
              className="w-full text-left px-3 py-2 hover:bg-gray-100"
              onClick={() => applyRole(r)}
            >
              {r}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
