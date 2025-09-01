'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/protected-route';

interface Bond {
  id: string;
  bondAmount: string;
  premium: string;
  effectiveDate: string;
  expiryDate: string;
  policyholder: { companyName: string };
  beneficiary: { companyName: string };
  terms: string;
  status: string;
}

export default function BondsPage() {
  const [bonds, setBonds] = useState<Bond[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/bonds');
        if (!res.ok) throw new Error('Failed to fetch bonds');
        const data = (await res.json()) as Bond[];
        setBonds(data);
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
        <h1 className="text-3xl font-bold mb-6">Bonds</h1>

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
            {bonds.length === 0 ? (
              <p>No bonds found.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-3 text-left">ID</th>
                    <th className="p-3 text-left">Amount</th>
                    <th className="p-3 text-left">Premium</th>
                    <th className="p-3 text-left">Policyholder</th>
                    <th className="p-3 text-left">Beneficiary</th>
                    <th className="p-3 text-left">Effective</th>
                    <th className="p-3 text-left">Expiry</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bonds.map(b => (
                    <tr key={b.id} className="border-t hover:bg-gray-50">
                      <td className="p-3">{b.id}</td>
                      <td className="p-3">{b.bondAmount}</td>
                      <td className="p-3">{b.premium}</td>
                      <td className="p-3">{b.policyholder.companyName}</td>
                      <td className="p-3">{b.beneficiary.companyName}</td>
                      <td className="p-3">{b.effectiveDate}</td>
                      <td className="p-3">{b.expiryDate}</td>
                      <td className="p-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                          {b.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <Link
                          className="text-primary underline"
                          href={`/bonds/${b.id}`}
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
