"use client";

import { ProtectedRoute } from "@/components/protected-route";
import { useAuthData } from "@/lib/auth-hooks";
import { UserRole } from "@/lib/roles";
import { useQuery } from "@tanstack/react-query";
import DataTable from "@/components/layout/DataTable";
import { Button } from "@/components/ui/button";

// Mock data fetching function
async function fetchProposals() {
  // In a real implementation, this would call an API
  await new Promise(resolve => setTimeout(resolve, 500));
  const response = await fetch('/api/proposals');
  if (!response.ok) {
    throw new Error('Failed to fetch proposals');
  }
  return await response.json();
}

export default function ProposalsPage() {
  const { groups } = useAuthData();
  
  // Check if user has access to view proposals
  const canViewProposals = groups.includes(UserRole.ADMIN) ||
                         groups.includes(UserRole.WHOLESALE) ||
                         groups.includes(UserRole.AGENT) ||
                         groups.includes(UserRole.BROKER);
  
  // Fetch proposals data
  const { data: proposals, isLoading, error } = useQuery({
    queryKey: ['proposals'],
    queryFn: fetchProposals,
    enabled: canViewProposals,
  });

  // Define table columns
  const columns = [
    { key: 'title', title: 'Title' },
    { key: 'description', title: 'Description' },
    {
      key: 'status',
      title: 'Status',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          value === 'draft' ? 'bg-gray-100 text-gray-800' :
          value === 'submitted' ? 'bg-blue-100 text-blue-800' :
          value === 'under_review' ? 'bg-yellow-100 text-yellow-800' :
          value === 'approved' ? 'bg-green-100 text-green-800' :
          value === 'rejected' ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {value}
        </span>
      )
    },
  ];

  // Define actions for each row
  const actions = (row: any) => (
    <div className="flex space-x-2">
      <Button variant="outline" size="sm">View</Button>
      {groups.includes(UserRole.ADMIN) || groups.includes(UserRole.WHOLESALE) || groups.includes(UserRole.BROKER) ? (
        <Button variant="outline" size="sm">Edit</Button>
      ) : null}
    </div>
  );

  if (!canViewProposals) {
    return (
      <ProtectedRoute>
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">Proposals</h1>
          <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
            <p className="text-yellow-700">You don't have permission to view proposals.</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Proposals</h1>
          {(groups.includes(UserRole.ADMIN) || groups.includes(UserRole.WHOLESALE) || groups.includes(UserRole.BROKER)) && (
            <Button onClick={() => window.location.href = "/proposals/new"}>Create New Proposal</Button>
          )}
        </div>
        
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-4 mb-6">
            <p className="text-red-700">Error loading proposals: {(error as Error).message}</p>
          </div>
        )}
        
        {proposals && (
          <DataTable
            data={proposals}
            columns={columns}
            searchable={true}
            pagination={true}
            itemsPerPage={10}
            actions={actions}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}