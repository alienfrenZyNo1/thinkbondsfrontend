'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthData } from '@/lib/auth-hooks';
import { UserRole } from '@/lib/roles';
import { ProtectedRoute } from '@/components/protected-route';

interface EditHistoryEntry {
  id: string;
 timestamp: string;
 userId: string;
  userName: string;
  action: string;
 changes?: Record<string, any>;
}

export default function OfferHistoryPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { groups } = useAuthData();
  const [editHistory, setEditHistory] = useState<EditHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user has access to view offer history
  const canViewOfferHistory = groups.includes(UserRole.ADMIN) ||
                             groups.includes(UserRole.WHOLESALE) ||
                             groups.includes(UserRole.AGENT) ||
                             groups.includes(UserRole.BROKER);

  useEffect(() => {
    if (!canViewOfferHistory) {
      return;
    }

    const fetchEditHistory = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/offers/${params.id}/history`);
        if (!response.ok) {
          throw new Error('Failed to fetch edit history');
        }
        const data = await response.json();
        setEditHistory(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchEditHistory();
  }, [params.id, canViewOfferHistory]);

  if (!canViewOfferHistory) {
    return (
      <ProtectedRoute>
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">Offer Edit History</h1>
          <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
            <p className="text-yellow-700">You don't have permission to view this offer's edit history.</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Offer Edit History</h1>
          <button
            onClick={() => router.back()}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Back
          </button>
        </div>

        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-4 mb-6">
            <p className="text-red-700">Error: {error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Edit History</h2>
            {editHistory.length === 0 ? (
              <p>No edit history found for this offer.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border-b p-4 text-left">Timestamp</th>
                      <th className="border-b p-4 text-left">User</th>
                      <th className="border-b p-4 text-left">Action</th>
                      <th className="border-b p-4 text-left">Changes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {editHistory.map((entry) => (
                      <tr key={entry.id} className="hover:bg-gray-50">
                        <td className="p-4 border-b">{new Date(entry.timestamp).toLocaleString()}</td>
                        <td className="p-4 border-b">{entry.userName}</td>
                        <td className="p-4 border-b">{entry.action}</td>
                        <td className="p-4 border-b">
                          {entry.changes ? (
                            <ul className="list-disc pl-5">
                              {Object.entries(entry.changes).map(([key, value]) => (
                                <li key={key}>
                                  <strong>{key}:</strong> {JSON.stringify(value)}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            'No changes recorded'
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}