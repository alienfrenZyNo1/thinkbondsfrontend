'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthData } from '@/lib/auth-hooks';
import { UserRole } from '@/lib/roles';
import { ProtectedRoute } from '@/components/protected-route';
import { Button } from '@/components/ui/button';

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
  editHistory: any[];
}

export default function BondsBinPage() {
  const router = useRouter();
 const { groups } = useAuthData();
  const [bonds, setBonds] = useState<Bond[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user has access to view the bond bin
  const canViewBondBin = groups.includes(UserRole.ADMIN) ||
                        groups.includes(UserRole.WHOLESALE);

  useEffect(() => {
    if (!canViewBondBin) {
      return;
    }

    const fetchSoftDeletedBonds = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/bonds/bin');
        if (!response.ok) {
          throw new Error('Failed to fetch soft deleted bonds');
        }
        const data = await response.json();
        setBonds(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchSoftDeletedBonds();
  }, [canViewBondBin]);

  const handleRestore = async (id: string) => {
    try {
      const response = await fetch(`/api/bonds/${id}/restore`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to restore bond');
      }

      // Remove the restored bond from the list
      setBonds(bonds.filter(bond => bond.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  if (!canViewBondBin) {
    return (
      <ProtectedRoute>
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">Soft Deleted Bonds</h1>
          <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
            <p className="text-yellow-700">You don't have permission to view soft deleted bonds.</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Soft Deleted Bonds</h1>
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
            <h2 className="text-xl font-semibold mb-4">Soft Deleted Bonds</h2>
            {bonds.length === 0 ? (
              <p>No soft deleted bonds found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border-b p-4 text-left">Bond ID</th>
                      <th className="border-b p-4 text-left">Bond Amount</th>
                      <th className="border-b p-4 text-left">Premium</th>
                      <th className="border-b p-4 text-left">Policyholder</th>
                      <th className="border-b p-4 text-left">Beneficiary</th>
                      <th className="border-b p-4 text-left">Effective Date</th>
                      <th className="border-b p-4 text-left">Expiry Date</th>
                      <th className="border-b p-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bonds.map((bond) => (
                      <tr key={bond.id} className="hover:bg-gray-50">
                        <td className="p-4 border-b">{bond.id}</td>
                        <td className="p-4 border-b">{bond.bondAmount}</td>
                        <td className="p-4 border-b">{bond.premium}</td>
                        <td className="p-4 border-b">{bond.policyholder.companyName}</td>
                        <td className="p-4 border-b">{bond.beneficiary.companyName}</td>
                        <td className="p-4 border-b">{bond.effectiveDate}</td>
                        <td className="p-4 border-b">{bond.expiryDate}</td>
                        <td className="p-4 border-b">
                          <Button 
                            onClick={() => handleRestore(bond.id)}
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