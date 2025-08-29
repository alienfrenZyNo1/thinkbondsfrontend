'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthData } from '@/lib/auth-hooks';
import { UserRole } from '@/lib/roles';
import { ProtectedRoute } from '@/components/protected-route';
import { Button } from '@/components/ui/button';

interface Broker {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  status: string;
  editHistory: any[];
}

export default function BrokersBinPage() {
  const router = useRouter();
  const { groups } = useAuthData();
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user has access to view the broker bin
  const canViewBrokerBin = groups.includes(UserRole.ADMIN) ||
                          groups.includes(UserRole.WHOLESALE);

  useEffect(() => {
    if (!canViewBrokerBin) {
      return;
    }

    const fetchSoftDeletedBrokers = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/brokers/bin');
        if (!response.ok) {
          throw new Error('Failed to fetch soft deleted brokers');
        }
        const data = await response.json();
        setBrokers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchSoftDeletedBrokers();
  }, [canViewBrokerBin]);

  const handleRestore = async (id: string) => {
    try {
      const response = await fetch(`/api/brokers/${id}/restore`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to restore broker');
      }

      // Remove the restored broker from the list
      setBrokers(brokers.filter(broker => broker.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  if (!canViewBrokerBin) {
    return (
      <ProtectedRoute>
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">Soft Deleted Brokers</h1>
          <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
            <p className="text-yellow-700">You don't have permission to view soft deleted brokers.</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Soft Deleted Brokers</h1>
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
            <h2 className="text-xl font-semibold mb-4">Soft Deleted Brokers</h2>
            {brokers.length === 0 ? (
              <p>No soft deleted brokers found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border-b p-4 text-left">Company Name</th>
                      <th className="border-b p-4 text-left">Contact Name</th>
                      <th className="border-b p-4 text-left">Email</th>
                      <th className="border-b p-4 text-left">Phone</th>
                      <th className="border-b p-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {brokers.map((broker) => (
                      <tr key={broker.id} className="hover:bg-gray-50">
                        <td className="p-4 border-b">{broker.companyName}</td>
                        <td className="p-4 border-b">{broker.contactName}</td>
                        <td className="p-4 border-b">{broker.email}</td>
                        <td className="p-4 border-b">{broker.phone}</td>
                        <td className="p-4 border-b">
                          <Button 
                            onClick={() => handleRestore(broker.id)}
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