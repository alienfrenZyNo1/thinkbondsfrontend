'use client';

import { ProtectedRoute } from '@/components/protected-route';
import { useAuthData } from '@/lib/auth-hooks';
import { UserRole } from '@/lib/roles';
import { useQuery } from '@tanstack/react-query';
import DataTable from '@/components/layout/DataTable';
import { Button } from '@/components/ui/button';

// Mock data fetching function
async function fetchBrokers() {
  // In a real implementation, this would call an API
  await new Promise(resolve => setTimeout(resolve, 500));
  const response = await fetch('/api/brokers');
  if (!response.ok) {
    throw new Error('Failed to fetch brokers');
  }
  return await response.json();
}

export default function BrokersPage() {
  const { groups } = useAuthData();

  // Check if user has access to view brokers
  const canViewBrokers =
    groups.includes(UserRole.ADMIN) ||
    groups.includes(UserRole.WHOLESALE) ||
    groups.includes(UserRole.AGENT);

  // Fetch brokers data
  const {
    data: brokers,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['brokers'],
    queryFn: fetchBrokers,
    enabled: canViewBrokers,
  });

  // Define table columns
  const columns = [
    { key: 'companyName', title: 'Company Name' },
    { key: 'contactName', title: 'Contact Name' },
    { key: 'email', title: 'Email' },
    { key: 'phone', title: 'Phone' },
  ];

  // Define actions for each row
  const actions = (_row: unknown) => {
    void _row;
    return (
      <div className="flex space-x-2">
        <Button variant="outline" size="sm">
          View
        </Button>
        {groups.includes(UserRole.ADMIN) ||
        groups.includes(UserRole.WHOLESALE) ? (
          <Button variant="outline" size="sm">
            Edit
          </Button>
        ) : null}
      </div>
    );
  };

  if (!canViewBrokers) {
    return (
      <ProtectedRoute>
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">Brokers</h1>
          <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
            <p className="text-yellow-700">
              You don&apos;t have permission to view brokers.
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
          <h1 className="text-3xl font-bold">Brokers</h1>
          {(groups.includes(UserRole.ADMIN) ||
            groups.includes(UserRole.WHOLESALE)) && (
            <Button>Create New Broker</Button>
          )}
        </div>

        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-4 mb-6">
            <p className="text-red-700">
              Error loading brokers: {(error as Error).message}
            </p>
          </div>
        )}

        {brokers && (
          <DataTable
            data={brokers}
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
