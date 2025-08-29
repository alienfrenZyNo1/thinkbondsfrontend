'use client';

import { ProtectedRoute } from '@/components/protected-route';
import { useAuthData } from '@/lib/auth-hooks';
import { UserRole } from '@/lib/roles';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Broker {
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
async function fetchBroker(id: string): Promise<Broker> {
  // In a real implementation, this would call an API
  await new Promise(resolve => setTimeout(resolve, 500));
  const response = await fetch(`/api/brokers/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch broker');
  }
  return await response.json();
}

async function fetchEditHistory(id: string): Promise<EditHistoryEntry[]> {
  // In a real implementation, this would call an API
  await new Promise(resolve => setTimeout(resolve, 500));
  const response = await fetch(`/api/brokers/${id}/history`);
  if (!response.ok) {
    throw new Error('Failed to fetch edit history');
  }
  return await response.json();
}

export default function BrokerDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { groups } = useAuthData();
  const [activeTab, setActiveTab] = useState<'details' | 'history'>('details');

  // Check if user has access to view brokers
  const canViewBroker =
    groups.includes(UserRole.ADMIN) ||
    groups.includes(UserRole.WHOLESALE) ||
    groups.includes(UserRole.AGENT) ||
    groups.includes(UserRole.BROKER);

  // Check if user can edit brokers
  const canEditBroker =
    groups.includes(UserRole.ADMIN) ||
    groups.includes(UserRole.WHOLESALE) ||
    groups.includes(UserRole.BROKER);

  // Check if user can restore brokers
  const canRestoreBroker =
    groups.includes(UserRole.ADMIN) || groups.includes(UserRole.WHOLESALE);

  // Fetch broker data
  const {
    data: broker,
    isLoading: isBrokerLoading,
    error: brokerError,
    refetch: refetchBroker,
  } = useQuery({
    queryKey: ['broker', params.id],
    queryFn: () => fetchBroker(params.id),
    enabled: canViewBroker,
  });

  // Fetch edit history
  const {
    data: editHistory,
    isLoading: isHistoryLoading,
    error: historyError,
  } = useQuery({
    queryKey: ['editHistory', params.id],
    queryFn: () => fetchEditHistory(params.id),
    enabled: canViewBroker && activeTab === 'history',
  });

  const handleSoftDelete = async () => {
    if (!canEditBroker) return;

    try {
      const response = await fetch(`/api/brokers/${params.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete broker');
      }

      // Refresh the broker data
      refetchBroker();
    } catch (error) {
      console.error('Error deleting broker:', error);
    }
  };

  const handleRestore = async () => {
    if (!canRestoreBroker) return;

    try {
      const response = await fetch(`/api/brokers/${params.id}/restore`, {
        method: 'PUT',
      });

      if (!response.ok) {
        throw new Error('Failed to restore broker');
      }

      // Refresh the broker data
      refetchBroker();
    } catch (error) {
      console.error('Error restoring broker:', error);
    }
  };

  if (!canViewBroker) {
    return (
      <ProtectedRoute>
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">Broker Details</h1>
          <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
            <p className="text-yellow-700">
              You don&apos;t have permission to view this broker.
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
          <h1 className="text-3xl font-bold">Broker Details</h1>
          <div className="flex space-x-2">
            {canEditBroker && (
              <Button onClick={() => router.push(`/brokers/${params.id}/edit`)}>
                Edit Broker
              </Button>
            )}
            {canEditBroker && broker?.status !== 'soft_deleted' && (
              <Button variant="destructive" onClick={handleSoftDelete}>
                Delete Broker
              </Button>
            )}
            {canRestoreBroker && broker?.status === 'soft_deleted' && (
              <Button onClick={handleRestore}>Restore Broker</Button>
            )}
            <Button variant="outline" onClick={() => router.back()}>
              Back
            </Button>
          </div>
        </div>

        {/* Status indicator */}
        {broker?.status === 'soft_deleted' && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p>This broker has been soft deleted.</p>
          </div>
        )}

        {/* Loading states */}
        {(isBrokerLoading || isHistoryLoading) && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        )}

        {/* Error states */}
        {(brokerError || historyError) && (
          <div className="bg-red-50 border border-red-200 rounded p-4 mb-6">
            <p className="text-red-700">
              Error loading data:{' '}
              {brokerError?.message || historyError?.message}
            </p>
          </div>
        )}

        {/* Tabs */}
        {broker && (
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

        {/* Broker details tab */}
        {broker && activeTab === 'details' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Broker Information</h2>
            <div className="space-y-3">
              <div>
                <label className="font-medium">Company Name:</label>
                <p>{broker.companyName}</p>
              </div>
              <div>
                <label className="font-medium">Contact Name:</label>
                <p>{broker.contactName}</p>
              </div>
              <div>
                <label className="font-medium">Email:</label>
                <p>{broker.email}</p>
              </div>
              <div>
                <label className="font-medium">Phone:</label>
                <p>{broker.phone}</p>
              </div>
              <div>
                <label className="font-medium">Status:</label>
                <p>{broker.status}</p>
              </div>
            </div>
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
                No edit history found for this broker.
              </p>
            )}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
