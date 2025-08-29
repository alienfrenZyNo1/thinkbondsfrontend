'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthData } from '@/lib/auth-hooks';
import { UserRole } from '@/lib/roles';
import { ProtectedRoute } from '@/components/protected-route';
import { Button } from '@/components/ui/button';

interface Proposal {
  id: string;
  title: string;
  description: string;
  brokerId: string;
  policyholderId: string;
  status: string;
  editHistory: Record<string, unknown>[];
}

export default function ProposalsBinPage() {
  const router = useRouter();
  const { groups } = useAuthData();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user has access to view the proposal bin
  const canViewProposalBin =
    groups.includes(UserRole.ADMIN) ||
    groups.includes(UserRole.WHOLESALE) ||
    groups.includes(UserRole.AGENT) ||
    groups.includes(UserRole.BROKER);

  useEffect(() => {
    if (!canViewProposalBin) {
      return;
    }

    const fetchSoftDeletedProposals = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/proposals/bin');
        if (!response.ok) {
          throw new Error('Failed to fetch soft deleted proposals');
        }
        const data = await response.json();
        setProposals(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSoftDeletedProposals();
  }, [canViewProposalBin]);

  const handleRestore = async (id: string) => {
    try {
      const response = await fetch(`/api/proposals/${id}/restore`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to restore proposal');
      }

      // Remove the restored proposal from the list
      setProposals(proposals.filter(proposal => proposal.id !== id));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred'
      );
    }
  };

  if (!canViewProposalBin) {
    return (
      <ProtectedRoute>
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">Soft Deleted Proposals</h1>
          <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
            <p className="text-yellow-700">
              You don't have permission to view soft deleted proposals.
            </p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Soft Deleted Proposals</h1>
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
            <h2 className="text-xl font-semibold mb-4">
              Soft Deleted Proposals
            </h2>
            {proposals.length === 0 ? (
              <p>No soft deleted proposals found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border-b p-4 text-left">Title</th>
                      <th className="border-b p-4 text-left">Description</th>
                      <th className="border-b p-4 text-left">Broker ID</th>
                      <th className="border-b p-4 text-left">
                        Policyholder ID
                      </th>
                      <th className="border-b p-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {proposals.map(proposal => (
                      <tr key={proposal.id} className="hover:bg-gray-50">
                        <td className="p-4 border-b">{proposal.title}</td>
                        <td className="p-4 border-b">{proposal.description}</td>
                        <td className="p-4 border-b">{proposal.brokerId}</td>
                        <td className="p-4 border-b">
                          {proposal.policyholderId}
                        </td>
                        <td className="p-4 border-b">
                          <Button
                            onClick={() => handleRestore(proposal.id)}
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                          >
                            Restore
                          </Button>
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
