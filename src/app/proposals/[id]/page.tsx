'use client';

import { ProtectedRoute } from '@/components/protected-route';
import { useAuthData } from '@/lib/auth-hooks';
import { UserRole } from '@/lib/roles';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Proposal {
  id: string;
  title: string;
  description: string;
  brokerId: string;
  policyholderId: string;
  status: string;
  editHistory: EditHistoryEntry[];
}

interface Policyholder {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
}

interface Broker {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
}

interface EditHistoryEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  changes?: Record<string, unknown>;
}

interface Offer {
  id: string;
  proposalId: string;
  bondAmount: string;
  premium: string;
  effectiveDate: string;
  expiryDate: string;
  terms: string;
  status: string;
  createdAt: string;
}

// Mock data fetching functions
async function fetchProposal(id: string): Promise<Proposal> {
  // In a real implementation, this would call an API
  await new Promise(resolve => setTimeout(resolve, 500));
  const response = await fetch(`/api/proposals/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch proposal');
  }
  return await response.json();
}

async function fetchPolicyholder(id: string): Promise<Policyholder> {
  // In a real implementation, this would call an API
  await new Promise(resolve => setTimeout(resolve, 500));
  const response = await fetch(`/api/policyholders/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch policyholder');
  }
  return await response.json();
}

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
  const response = await fetch(`/api/proposals/${id}/history`);
  if (!response.ok) {
    throw new Error('Failed to fetch edit history');
  }
  return await response.json();
}

// Mock function to fetch offer for this proposal
async function fetchOffer(_proposalId: string): Promise<Offer | null> {
  void _proposalId;
  // In a real implementation, this would call an API
  await new Promise(resolve => setTimeout(resolve, 500));

  // Mock offer data - in a real app, this would be fetched from the API
  // For now, we'll return null to simulate no offer existing
  return null;

  // Uncomment the following to simulate an existing offer:
  /*
  return {
    id: "1",
    proposalId: proposalId,
    bondAmount: "1000.00",
    premium: "50.00",
    effectiveDate: "2025-09-01",
    expiryDate: "2026-09-01",
    terms: "Standard terms and conditions apply",
    status: "pending", // pending, accepted, rejected
    createdAt: "2025-08-28T10:00Z",
 };
  */
}

export default function ProposalDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { groups } = useAuthData();
  const [activeTab, setActiveTab] = useState<'details' | 'history'>('details');

  // Check if user has access to view proposals
  const canViewProposal =
    groups.includes(UserRole.ADMIN) ||
    groups.includes(UserRole.WHOLESALE) ||
    groups.includes(UserRole.AGENT) ||
    groups.includes(UserRole.BROKER);

  // Check if user can create offers (wholesaler or admin)
  const canCreateOffer =
    groups.includes(UserRole.ADMIN) || groups.includes(UserRole.WHOLESALE);

  // Check if user can edit proposals
  const canEditProposal =
    groups.includes(UserRole.ADMIN) ||
    groups.includes(UserRole.WHOLESALE) ||
    groups.includes(UserRole.BROKER);

  // Check if user can restore proposals
  const canRestoreProposal =
    groups.includes(UserRole.ADMIN) || groups.includes(UserRole.WHOLESALE);

  // Fetch proposal data
  const {
    data: proposal,
    isLoading: isProposalLoading,
    error: proposalError,
    refetch: refetchProposal,
  } = useQuery<Proposal>({
    queryKey: ['proposal', params.id],
    queryFn: () => fetchProposal(params.id),
    enabled: canViewProposal,
  });

  // Fetch policyholder data
  const {
    data: policyholder,
    isLoading: isPolicyholderLoading,
    error: policyholderError,
  } = useQuery<Policyholder>({
    queryKey: ['policyholder', proposal?.policyholderId],
    queryFn: () =>
      proposal?.policyholderId
        ? fetchPolicyholder(proposal.policyholderId)
        : Promise.reject('No policyholder ID'),
    enabled: !!proposal?.policyholderId && canViewProposal,
  });

  // Fetch broker data
  const {
    data: broker,
    isLoading: isBrokerLoading,
    error: brokerError,
  } = useQuery<Broker>({
    queryKey: ['broker', proposal?.brokerId],
    queryFn: () =>
      proposal?.brokerId
        ? fetchBroker(proposal.brokerId)
        : Promise.reject('No broker ID'),
    enabled: !!proposal?.brokerId && canViewProposal,
  });

  // Fetch edit history
  const {
    data: editHistory,
    isLoading: isHistoryLoading,
    error: historyError,
  } = useQuery<EditHistoryEntry[]>({
    queryKey: ['editHistory', params.id],
    queryFn: () => fetchEditHistory(params.id),
    enabled: canViewProposal && activeTab === 'history',
  });

  // Fetch offer for this proposal
  const {
    data: offer,
    isLoading: isOfferLoading,
    error: offerError,
  } = useQuery<Offer | null>({
    queryKey: ['offer', params.id],
    queryFn: () => fetchOffer(params.id),
    enabled: canViewProposal && activeTab === 'details',
  });

  const handleSoftDelete = async () => {
    if (!canEditProposal) return;

    try {
      const response = await fetch(`/api/proposals/${params.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete proposal');
      }

      // Refresh the proposal data
      refetchProposal();
    } catch (error) {
      console.error('Error deleting proposal:', error);
    }
  };

  const handleRestore = async () => {
    if (!canRestoreProposal) return;

    try {
      const response = await fetch(`/api/proposals/${params.id}/restore`, {
        method: 'PUT',
      });

      if (!response.ok) {
        throw new Error('Failed to restore proposal');
      }

      // Refresh the proposal data
      refetchProposal();
    } catch (error) {
      console.error('Error restoring proposal:', error);
    }
  };

  if (!canViewProposal) {
    return (
      <ProtectedRoute>
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">Proposal Details</h1>
          <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
            <p className="text-yellow-700">
              You don&apos;t have permission to view this proposal.
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
          <h1 className="text-3xl font-bold">Proposal Details</h1>
          <div className="flex space-x-2">
            {canEditProposal && (
              <Button
                onClick={() => router.push(`/proposals/${params.id}/edit`)}
              >
                Edit
              </Button>
            )}
            {canEditProposal && proposal?.status !== 'soft_deleted' && (
              <Button variant="destructive" onClick={handleSoftDelete}>
                Delete
              </Button>
            )}
            {canRestoreProposal && proposal?.status === 'soft_deleted' && (
              <Button onClick={handleRestore}>Restore Proposal</Button>
            )}
            {canCreateOffer && !offer && activeTab === 'details' && (
              <Link href={`/proposals/${params.id}/offer`}>
                <Button>Create Offer</Button>
              </Link>
            )}
            <Button variant="outline" onClick={() => router.back()}>
              Back
            </Button>
          </div>
        </div>

        {/* Status indicator */}
        {proposal?.status === 'soft_deleted' && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p>This proposal has been soft deleted.</p>
          </div>
        )}

        {/* Loading states */}
        {(isProposalLoading ||
          isPolicyholderLoading ||
          isBrokerLoading ||
          isHistoryLoading ||
          isOfferLoading) && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        )}

        {/* Error states */}
        {(proposalError ||
          policyholderError ||
          brokerError ||
          historyError ||
          offerError) && (
          <div className="bg-red-50 border border-red-200 rounded p-4 mb-6">
            <p className="text-red-700">
              Error loading data:{' '}
              {proposalError?.message ||
                policyholderError?.message ||
                brokerError?.message ||
                historyError?.message ||
                offerError?.message}
            </p>
          </div>
        )}

        {/* Tabs */}
        {proposal && (
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

        {/* Proposal details tab */}
        {proposal && activeTab === 'details' && (
          <div className="space-y-6">
            {/* Contract Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">
                Contract Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-medium">Title:</label>
                  <p>{proposal.title}</p>
                </div>
                <div>
                  <label className="font-medium">Status:</label>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      proposal.status === 'draft'
                        ? 'bg-gray-100 text-gray-800'
                        : proposal.status === 'submitted'
                          ? 'bg-blue-100 text-blue-800'
                          : proposal.status === 'under_review'
                            ? 'bg-yellow-100 text-yellow-800'
                            : proposal.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : proposal.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : proposal.status === 'soft_deleted'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-gray-10 text-gray-800'
                    }`}
                  >
                    {proposal.status}
                  </span>
                </div>
                <div className="md:col-span-2">
                  <label className="font-medium">Description:</label>
                  <p>{proposal.description}</p>
                </div>
              </div>
            </div>

            {/* Offer Section */}
            {offer && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Bond Offer</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-medium">Offer Status:</label>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        offer.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : offer.status === 'accepted'
                            ? 'bg-green-100 text-green-800'
                            : offer.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-10 text-gray-800'
                      }`}
                    >
                      {offer.status}
                    </span>
                  </div>
                  <div>
                    <label className="font-medium">Bond Amount:</label>
                    <p>${offer.bondAmount}</p>
                  </div>
                  <div>
                    <label className="font-medium">Premium:</label>
                    <p>${offer.premium}</p>
                  </div>
                  <div>
                    <label className="font-medium">Effective Date:</label>
                    <p>{new Date(offer.effectiveDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="font-medium">Expiry Date:</label>
                    <p>{new Date(offer.expiryDate).toLocaleDateString()}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="font-medium">Terms:</label>
                    <p>{offer.terms}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <Button variant="outline">View Offer Details</Button>
                </div>
              </div>
            )}

            {/* Policyholder Section */}
            {policyholder && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">
                  Policyholder Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>
              </div>
            )}

            {/* Broker Section */}
            {broker && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">
                  Broker Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                No edit history found for this proposal.
              </p>
            )}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
