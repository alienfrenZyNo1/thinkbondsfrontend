'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthData } from '@/lib/auth-hooks';
import { UserRole } from '@/lib/roles';
import { ProtectedRoute } from '@/components/protected-route';
import { Button } from '@/components/ui/button';

interface Policyholder {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  status: string;
  editHistory: any[];
}

export default function PolicyholdersBinPage() {
  const router = useRouter();
 const { groups } = useAuthData();
  const [policyholders, setPolicyholders] = useState<Policyholder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user has access to view the policyholder bin
  const canViewPolicyholderBin = groups.includes(UserRole.ADMIN) ||
                                groups.includes(UserRole.WHOLESALE) ||
                                groups.includes(UserRole.AGENT) ||
                                groups.includes(UserRole.BROKER);

  useEffect(() => {
    if (!canViewPolicyholderBin) {
      return;
    }

    const fetchSoftDeletedPolicyholders = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/policyholders/bin');
        if (!response.ok) {
          throw new Error('Failed to fetch soft deleted policyholders');
        }
        const data = await response.json();
        setPolicyholders(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchSoftDeletedPolicyholders();
  }, [canViewPolicyholderBin]);

  const handleRestore = async (id: string) => {
    try {
      const response = await fetch(`/api/policyholders/${id}/restore`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to restore policyholder');
      }

      // Remove the restored policyholder from the list
      setPolicyholders(policyholders.filter(policyholder => policyholder.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  if (!canViewPolicyholderBin) {
    return (
      <ProtectedRoute>
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">Soft Deleted Policyholders</h1>
          <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
            <p className="text-yellow-700">You don't have permission to view soft deleted policyholders.</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Soft Deleted Policyholders</h1>
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
            <h2 className="text-xl font-semibold mb-4">Soft Deleted Policyholders</h2>
            {policyholders.length === 0 ? (
              <p>No soft deleted policyholders found.</p>
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
                    {policyholders.map((policyholder) => (
                      <tr key={policyholder.id} className="hover:bg-gray-50">
                        <td className="p-4 border-b">{policyholder.companyName}</td>
                        <td className="p-4 border-b">{policyholder.contactName}</td>
                        <td className="p-4 border-b">{policyholder.email}</td>
                        <td className="p-4 border-b">{policyholder.phone}</td>
                        <td className="p-4 border-b">
                          <Button 
                            onClick={() => handleRestore(policyholder.id)}
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