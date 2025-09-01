'use client';

import { useAuthData } from '@/lib/auth-hooks';
import { useEffect, useState } from 'react';

interface DominoUser {
  id: string;
  name: string;
  email: string;
  groups: string[];
  [key: string]: unknown;
}

interface DominoData {
  user: DominoUser;
  groups: string[];
}

export function DominoUserData() {
  const { accessToken, isAuthenticated } = useAuthData();
  const [dominoData, setDominoData] = useState<DominoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchDominoData = async () => {
      try {
        setLoading(true);
        setError(null);

        const headers: Record<string, string> = {};
        if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
        const response = await fetch('/api/me', { headers });

        if (!response.ok) {
          throw new Error('Failed to fetch Domino user data');
        }

        const data: DominoData = await response.json();
        setDominoData(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDominoData();
  }, [accessToken, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
        <p>You need to be signed in to view Domino user data.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded">
        <p className="text-red-700">Error: {error}</p>
      </div>
    );
  }

  if (!dominoData) {
    return (
      <div className="p-4 bg-gray-50 border-gray-200 rounded">
        <p>No Domino user data available.</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white border rounded">
      <h3 className="text-lg font-semibold mb-3">Domino User Data</h3>
      <div className="space-y-2">
        <div>
          <span className="font-medium">Name:</span> {dominoData.user.name}
        </div>
        <div>
          <span className="font-medium">Email:</span> {dominoData.user.email}
        </div>
        <div>
          <span className="font-medium">Groups:</span>{' '}
          {dominoData.groups.join(', ') || 'None'}
        </div>
        <div>
          <span className="font-medium">User ID:</span> {dominoData.user.id}
        </div>
      </div>
    </div>
  );
}
