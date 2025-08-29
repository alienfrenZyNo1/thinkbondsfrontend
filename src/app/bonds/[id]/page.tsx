'use client';

import { ProtectedRoute } from '@/components/protected-route';
import { useAuthData } from '@/lib/auth-hooks';
import { UserRole } from '@/lib/roles';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Bond {
  id: string;
  bondAmount: string;
  premium: string;
  effectiveDate: string;
  expiryDate: string;
  policyholder: {
    companyName: string;
    contactName: string;
    email: string;
  };
  beneficiary: {
    companyName: string;
    contactName: string;
    email: string;
  };
  terms: string;
  status: string;
  createdAt: string;
  editHistory: EditHistoryEntry[];
}

interface EditHistoryEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  changes?: Record<string, unknown>;
}

// Mock data fetching functions
async function fetchBond(id: string): Promise<Bond> {
  // In a real implementation, this would call an API
  await new Promise(resolve => setTimeout(resolve, 500));
  const response = await fetch(`/api/bonds/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch bond');
  }
  return await response.json();
}

async function fetchEditHistory(id: string): Promise<EditHistoryEntry[]> {
  // In a real implementation, this would call an API
  await new Promise(resolve => setTimeout(resolve, 500));
  const response = await fetch(`/api/bonds/${id}/history`);
  if (!response.ok) {
    throw new Error('Failed to fetch edit history');
  }
  return await response.json();
}

export default function BondDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { groups } = useAuthData();
  const [activeTab, setActiveTab] = useState<'details' | 'history'>('details');

  // Check if user has access to view bonds
  const canViewBond =
    groups.includes(UserRole.ADMIN) ||
    groups.includes(UserRole.WHOLESALE) ||
    groups.includes(UserRole.AGENT) ||
    groups.includes(UserRole.BROKER) ||
    groups.includes(UserRole.POLICYHOLDER);

  // Check if user can edit bonds
  const canEditBond =
    groups.includes(UserRole.ADMIN) || groups.includes(UserRole.WHOLESALE);

  // Check if user can restore bonds
  const canRestoreBond =
    groups.includes(UserRole.ADMIN) || groups.includes(UserRole.WHOLESALE);

  // Fetch bond data
  const {
    data: bond,
    isLoading: isBondLoading,
    error: bondError,
    refetch: refetchBond,
  } = useQuery<Bond>({
    queryKey: ['bond', params.id],
    queryFn: () => fetchBond(params.id),
    enabled: canViewBond,
  });

  // Fetch edit history
  const {
    data: editHistory,
    isLoading: isHistoryLoading,
    error: historyError,
  } = useQuery<EditHistoryEntry[]>({
    queryKey: ['editHistory', params.id],
    queryFn: () => fetchEditHistory(params.id),
    enabled: canViewBond && activeTab === 'history',
  });

  const handleSoftDelete = async () => {
    if (!canEditBond) return;

    try {
      const response = await fetch(`/api/bonds/${params.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete bond');
      }

      // Refresh the bond data
      refetchBond();
    } catch (error) {
      console.error('Error deleting bond:', error);
    }
  };

  const handleRestore = async () => {
    if (!canRestoreBond) return;

    try {
      const response = await fetch(`/api/bonds/${params.id}/restore`, {
        method: 'PUT',
      });

      if (!response.ok) {
        throw new Error('Failed to restore bond');
      }

      // Refresh the bond data
      refetchBond();
    } catch (error) {
      console.error('Error restoring bond:', error);
    }
  };

  if (!canViewBond) {
    return (
      <ProtectedRoute>
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">Bond Details</h1>
          <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
            <p className="text-yellow-700">
              You don&apos;t have permission to view this bond.
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
          <h1 className="text-3xl font-bold">Bond Details</h1>
          <div className="flex space-x-2">
            {canEditBond && (
              <Button onClick={() => router.push(`/bonds/${params.id}/edit`)}>
                Edit Bond
              </Button>
            )}
            {canEditBond && bond?.status !== 'soft_deleted' && (
              <Button variant="destructive" onClick={handleSoftDelete}>
                Delete Bond
              </Button>
            )}
            {canRestoreBond && bond?.status === 'soft_deleted' && (
              <Button onClick={handleRestore}>Restore Bond</Button>
            )}
            <Button variant="outline" onClick={() => router.back()}>
              Back
            </Button>
          </div>
        </div>

        {/* Status indicator */}
        {bond?.status === 'soft_deleted' && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p>This bond has been soft deleted.</p>
          </div>
        )}

        {/* Loading states */}
        {(isBondLoading || isHistoryLoading) && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        )}

        {/* Error states */}
        {(bondError || historyError) && (
          <div className="bg-red-50 border border-red-200 rounded p-4 mb-6">
            <p className="text-red-700">
              Error loading data: {bondError?.message || historyError?.message}
            </p>
          </div>
        )}

        {/* Tabs */}
        {bond && (
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'details'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab('details')}
                >
                  Details
                </button>
                <button
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'history'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab('history')}
                >
                  Edit History
                </button>
              </nav>
            </div>
          </div>
        )}

        {/* Bond details tab */}
        {bond && activeTab === 'details' && (
          <div className="space-y-6">
            {/* Bond Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Bond Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-medium">Bond Status:</label>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      bond.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : bond.status === 'accepted'
                          ? 'bg-green-100 text-green-800'
                          : bond.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : bond.status === 'soft_deleted'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-10 text-gray-800'
                    }`}
                  >
                    {bond.status}
                  </span>
                </div>
                <div>
                  <label className="font-medium">Bond Amount:</label>
                  <p>${bond.bondAmount}</p>
                </div>
                <div>
                  <label className="font-medium">Premium:</label>
                  <p>${bond.premium}</p>
                </div>
                <div>
                  <label className="font-medium">Effective Date:</label>
                  <p>{new Date(bond.effectiveDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="font-medium">Expiry Date:</label>
                  <p>{new Date(bond.expiryDate).toLocaleDateString()}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="font-medium">Terms:</label>
                  <p>{bond.terms}</p>
                </div>
              </div>
            </div>

            {/* Policyholder Section */}
            {bond.policyholder && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">
                  Policyholder Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-medium">Company Name:</label>
                    <p>{bond.policyholder.companyName}</p>
                  </div>
                  <div>
                    <label className="font-medium">Contact Name:</label>
                    <p>{bond.policyholder.contactName}</p>
                  </div>
                  <div>
                    <label className="font-medium">Email:</label>
                    <p>{bond.policyholder.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Beneficiary Section */}
            {bond.beneficiary && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">
                  Beneficiary Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-medium">Company Name:</label>
                    <p>{bond.beneficiary.companyName}</p>
                  </div>
                  <div>
                    <label className="font-medium">Contact Name:</label>
                    <p>{bond.beneficiary.contactName}</p>
                  </div>
                  <div>
                    <label className="font-medium">Email:</label>
                    <p>{bond.beneficiary.email}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Edit history tab */}
        {editHistory && activeTab === 'history' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Edit History</h2>
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
                  {editHistory.map((entry: EditHistoryEntry) => (
                    <tr key={entry.id} className="hover:bg-gray-50">
                      <td className="p-4 border-b">
                        {new Date(entry.timestamp).toLocaleString()}
                      </td>
                      <td className="p-4 border-b">{entry.userName}</td>
                      <td className="p-4 border-b">{entry.action}</td>
                      <td className="p-4 border-b">
                        {entry.changes ? (
                          <ul className="list-disc pl-5">
                            {Object.entries(entry.changes).map(
                              ([key, value]) => (
                                <li key={key}>
                                  <strong>{key}:</strong>{' '}
                                  {JSON.stringify(value)}
                                </li>
                              )
                            )}
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
            {editHistory.length === 0 && (
              <p className="text-gray-500 mt-4">
                No edit history found for this bond.
              </p>
            )}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
