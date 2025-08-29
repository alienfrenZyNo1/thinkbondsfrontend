'use client';

import { ProtectedRoute } from '@/components/protected-route';
import { useAuthData } from '@/lib/auth-hooks';
import { UserRole } from '@/lib/roles';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { CreditsafeReport } from '@/components/creditsafe-report';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Policyholder {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  status: string;
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
async function fetchPolicyholder(id: string) {
  // In a real implementation, this would call an API
  await new Promise(resolve => setTimeout(resolve, 500));
  const response = await fetch(`/api/policyholders/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch policyholder');
  }
  return await response.json();
}

async function fetchCreditsafeData(companyId: string) {
  // In a real implementation, this would call the Creditsafe API
  await new Promise(resolve => setTimeout(resolve, 500));
  const response = await fetch(`/api/creditsafe/search?q=${companyId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch Creditsafe data');
  }
  const data = await response.json();
  return data.length > 0 ? data[0] : null;
}

async function fetchEditHistory(id: string) {
  // In a real implementation, this would call an API
  await new Promise(resolve => setTimeout(resolve, 500));
  const response = await fetch(`/api/policyholders/${id}/history`);
  if (!response.ok) {
    throw new Error('Failed to fetch edit history');
  }
  return await response.json();
}

export default function PolicyholderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { groups } = useAuthData();
  const [activeTab, setActiveTab] = useState<'details' | 'history'>('details');

  // Check if user has access to view policyholders
  const canViewPolicyholder =
    groups.includes(UserRole.ADMIN) ||
    groups.includes(UserRole.WHOLESALE) ||
    groups.includes(UserRole.AGENT) ||
    groups.includes(UserRole.BROKER);

  // Check if user can edit policyholders
  const canEditPolicyholder =
    groups.includes(UserRole.ADMIN) ||
    groups.includes(UserRole.WHOLESALE) ||
    groups.includes(UserRole.BROKER);

  // Check if user can restore policyholders
  const canRestorePolicyholder =
    groups.includes(UserRole.ADMIN) || groups.includes(UserRole.WHOLESALE);

  // Fetch policyholder data
  const {
    data: policyholder,
    isLoading: isPolicyholderLoading,
    error: policyholderError,
    refetch: refetchPolicyholder,
  } = useQuery({
    queryKey: ['policyholder', params.id],
    queryFn: () => fetchPolicyholder(params.id),
    enabled: canViewPolicyholder,
  });

  // Fetch Creditsafe data
  const {
    data: creditsafeData,
    isLoading: isCreditsafeLoading,
    error: creditsafeError,
  } = useQuery({
    queryKey: ['creditsafe', policyholder?.companyName],
    queryFn: () => fetchCreditsafeData(policyholder?.companyName),
    enabled: !!policyholder?.companyName && canViewPolicyholder,
  });

  // Fetch edit history
  const {
    data: editHistory,
    isLoading: isHistoryLoading,
    error: historyError,
  } = useQuery({
    queryKey: ['editHistory', params.id],
    queryFn: () => fetchEditHistory(params.id),
    enabled: canViewPolicyholder && activeTab === 'history',
  });

  const handleSoftDelete = async () => {
    if (!canEditPolicyholder) return;

    try {
      const response = await fetch(`/api/policyholders/${params.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete policyholder');
      }

      // Refresh the policyholder data
      refetchPolicyholder();
    } catch {
      console.error('Error deleting policyholder');
    }
  };

  const handleRestore = async () => {
    if (!canRestorePolicyholder) return;

    try {
      const response = await fetch(`/api/policyholders/${params.id}/restore`, {
        method: 'PUT',
      });

      if (!response.ok) {
        throw new Error('Failed to restore policyholder');
      }

      // Refresh the policyholder data
      refetchPolicyholder();
    } catch {
      console.error('Error restoring policyholder');
    }
  };

  if (!canViewPolicyholder) {
    return (
      <ProtectedRoute>
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">Policyholder Details</h1>
          <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
            <p className="text-yellow-700">
              You don&apos;t have permission to view this policyholder.
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
          <h1 className="text-3xl font-bold">Policyholder Details</h1>
          <div className="flex space-x-2">
            {canEditPolicyholder && (
              <Button
                onClick={() => router.push(`/policyholders/${params.id}/edit`)}
              >
                Edit Policyholder
              </Button>
            )}
            {canEditPolicyholder && policyholder?.status !== 'soft_deleted' && (
              <Button variant="destructive" onClick={handleSoftDelete}>
                Delete Policyholder
              </Button>
            )}
            {canRestorePolicyholder &&
              policyholder?.status === 'soft_deleted' && (
                <Button onClick={handleRestore}>Restore Policyholder</Button>
              )}
            <Button variant="outline" onClick={() => router.back()}>
              Back
            </Button>
          </div>
        </div>

        {/* Status indicator */}
        {policyholder?.status === 'soft_deleted' && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p>This policyholder has been soft deleted.</p>
          </div>
        )}

        {/* Loading states */}
        {(isPolicyholderLoading || isCreditsafeLoading || isHistoryLoading) && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        )}

        {/* Error states */}
        {(policyholderError || creditsafeError || historyError) && (
          <div className="bg-red-50 border border-red-200 rounded p-4 mb-6">
            <p className="text-red-700">
              Error loading data:{' '}
              {policyholderError?.message ||
                creditsafeError?.message ||
                historyError?.message}
            </p>
          </div>
        )}

        {/* Tabs */}
        {policyholder && (
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

        {/* Policyholder details tab */}
        {policyholder && activeTab === 'details' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">
                Policyholder Information
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="font-medium">Company Name:</label>
                  <p>{policyholder.companyName}</p>
                </div>
                <div>
                  <label className="font-medium">Contact Name:</label>
                  <p>{policyholder.contactName}</p>
                </div>
                <div>
                  <label className="font-medium">Email:</label>
                  <p>{policyholder.email}</p>
                </div>
                <div>
                  <label className="font-medium">Phone:</label>
                  <p>{policyholder.phone}</p>
                </div>
                <div>
                  <label className="font-medium">Status:</label>
                  <p>{policyholder.status}</p>
                </div>
              </div>
            </div>

            {/* Creditsafe data */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">
                Creditsafe Information
              </h2>
              {creditsafeData ? (
                <div className="space-y-3">
                  <div>
                    <label className="font-medium">Company Number:</label>
                    <p>{creditsafeData.number}</p>
                  </div>
                  <div>
                    <label className="font-medium">Address:</label>
                    <p>{creditsafeData.address}</p>
                  </div>
                  <div>
                    <label className="font-medium">City:</label>
                    <p>{creditsafeData.city}</p>
                  </div>
                  <div>
                    <label className="font-medium">Postcode:</label>
                    <p>{creditsafeData.postcode}</p>
                  </div>
                  <div>
                    <label className="font-medium">Country:</label>
                    <p>{creditsafeData.country}</p>
                  </div>
                </div>
              ) : (
                <p>No Creditsafe data available</p>
              )}
            </div>
          </div>
        )}

        {/* Creditsafe Report */}
        {policyholder &&
          policyholder.companyName &&
          activeTab === 'details' && (
            <div className="mb-6">
              <CreditsafeReport
                companyId={policyholder.id}
                companyName={policyholder.companyName}
              />
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
                No edit history found for this policyholder.
              </p>
            )}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
