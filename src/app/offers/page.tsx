'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/protected-route';

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

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/offers');
        if (!res.ok) throw new Error('Failed to fetch offers');
        const data = (await res.json()) as Offer[];
        setOffers(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  return (
    <ProtectedRoute>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Offers</h1>

        {loading && (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-4 mb-6">
            <p className="text-red-700">Error: {error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
            {offers.length === 0 ? (
              <p>No offers found.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-3 text-left">ID</th>
                    <th className="p-3 text-left">Proposal</th>
                    <th className="p-3 text-left">Amount</th>
                    <th className="p-3 text-left">Premium</th>
                    <th className="p-3 text-left">Effective</th>
                    <th className="p-3 text-left">Expiry</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {offers.map(o => (
                    <tr key={o.id} className="border-t hover:bg-gray-50">
                      <td className="p-3">{o.id}</td>
                      <td className="p-3">{o.proposalId}</td>
                      <td className="p-3">{o.bondAmount}</td>
                      <td className="p-3">{o.premium}</td>
                      <td className="p-3">{o.effectiveDate}</td>
                      <td className="p-3">{o.expiryDate}</td>
                      <td className="p-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                          {o.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <Link
                          className="text-primary underline"
                          href={`/offers/${o.id}`}
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
