'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthData } from '@/lib/auth-hooks';
import { UserRole } from '@/lib/roles';
import { ProtectedRoute } from '@/components/protected-route';
import { Button } from '@/components/ui/button';

interface Offer {
  id: string;
  proposalId: string;
  bondAmount: string;
  premium: string;
  effectiveDate: string;
  expiryDate: string;
  terms: string;
  status: string;
  editHistory: unknown[];
}

export default function OffersBinPage() {
  const router = useRouter();
  const { groups } = useAuthData();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user has access to view the offer bin
  const canViewOfferBin =
    groups.includes(UserRole.ADMIN) || groups.includes(UserRole.WHOLESALE);

  useEffect(() => {
    if (!canViewOfferBin) {
      return;
    }

    const fetchSoftDeletedOffers = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/offers/bin');
        if (!response.ok) {
          throw new Error('Failed to fetch soft deleted offers');
        }
        const data = await response.json();
        setOffers(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSoftDeletedOffers();
  }, [canViewOfferBin]);

  const handleRestore = async (id: string) => {
    try {
      const response = await fetch(`/api/offers/${id}/restore`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to restore offer');
      }

      // Remove the restored offer from the list
      setOffers(offers.filter(offer => offer.id !== id));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred'
      );
    }
  };

  if (!canViewOfferBin) {
    return (
      <ProtectedRoute>
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">Soft Deleted Offers</h1>
          <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
            <p className="text-yellow-700">
              You don&apos;t have permission to view soft deleted offers.
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
          <h1 className="text-3xl font-bold">Soft Deleted Offers</h1>
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
            <h2 className="text-xl font-semibold mb-4">Soft Deleted Offers</h2>
            {offers.length === 0 ? (
              <p>No soft deleted offers found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border-b p-4 text-left">Offer ID</th>
                      <th className="border-b p-4 text-left">Proposal ID</th>
                      <th className="border-b p-4 text-left">Bond Amount</th>
                      <th className="border-b p-4 text-left">Premium</th>
                      <th className="border-b p-4 text-left">Effective Date</th>
                      <th className="border-b p-4 text-left">Expiry Date</th>
                      <th className="border-b p-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {offers.map(offer => (
                      <tr key={offer.id} className="hover:bg-gray-50">
                        <td className="p-4 border-b">{offer.id}</td>
                        <td className="p-4 border-b">{offer.proposalId}</td>
                        <td className="p-4 border-b">{offer.bondAmount}</td>
                        <td className="p-4 border-b">{offer.premium}</td>
                        <td className="p-4 border-b">{offer.effectiveDate}</td>
                        <td className="p-4 border-b">{offer.expiryDate}</td>
                        <td className="p-4 border-b">
                          <Button
                            onClick={() => handleRestore(offer.id)}
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
