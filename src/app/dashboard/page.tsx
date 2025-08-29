'use client';

import { ProtectedRoute } from '@/components/protected-route';
import { DominoUserData } from '@/components/domino-user-data';
import { useAuthData } from '@/lib/auth-hooks';
import { UserRole } from '@/lib/roles';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import Shell from '@/components/layout/Shell';

// Mock data fetching functions
async function fetchPendingRegistrations() {
  // In a real implementation, this would call an API
  await new Promise(resolve => setTimeout(resolve, 500));
  return [
    { id: '1', brokerName: 'ABC Insurance Brokers', status: 'pending' },
    { id: '2', brokerName: 'XYZ Risk Management', status: 'review' },
  ];
}

async function fetchPolicyholdersNeedingReview() {
  // In a real implementation, this would call an API
  await new Promise(resolve => setTimeout(resolve, 500));
  return [
    { id: '1', companyName: 'Tech Solutions Inc.', status: 'pending' },
    { id: '2', companyName: 'Global Manufacturing', status: 'review' },
  ];
}

async function fetchProposalsNeedingDecision() {
  // In a real implementation, this would call an API
  await new Promise(resolve => setTimeout(resolve, 500));
  return [
    { id: '1', title: 'Commercial Insurance Proposal', status: 'submitted' },
    { id: '2', title: 'Manufacturing Risk Assessment', status: 'under_review' },
  ];
}

async function fetchNotices() {
  // In a real implementation, this would call an API
  await new Promise(resolve => setTimeout(resolve, 500));
  return [
    { id: '1', title: 'System Maintenance', date: '2025-08-28' },
    { id: '2', title: 'New Features Available', date: '2025-08-25' },
  ];
}

async function fetchBrokerSummaries() {
  // In a real implementation, this would call an API
  await new Promise(resolve => setTimeout(resolve, 500));
  return [
    { id: '1', brokerName: 'ABC Insurance Brokers', policies: 5, proposals: 3 },
    { id: '2', brokerName: 'XYZ Risk Management', policies: 2, proposals: 1 },
  ];
}

async function fetchMyPolicyholders() {
  // In a real implementation, this would call an API
  await new Promise(resolve => setTimeout(resolve, 500));
  return [
    { id: '1', companyName: 'Tech Solutions Inc.', status: 'active' },
    { id: '2', companyName: 'Global Manufacturing', status: 'pending' },
  ];
}

async function fetchMyProposals() {
  // In a real implementation, this would call an API
  await new Promise(resolve => setTimeout(resolve, 500));
  return [
    { id: '1', title: 'Commercial Insurance Proposal', status: 'draft' },
    { id: '2', title: 'Manufacturing Risk Assessment', status: 'submitted' },
  ];
}

export default function DashboardPage() {
  const { groups } = useAuthData();

  // Determine user role
  const userRole = groups.includes(UserRole.ADMIN)
    ? UserRole.ADMIN
    : groups.includes(UserRole.WHOLESALE)
      ? UserRole.WHOLESALE
      : groups.includes(UserRole.BROKER)
        ? UserRole.BROKER
        : groups.includes(UserRole.POLICYHOLDER)
          ? UserRole.POLICYHOLDER
          : null;

  // Fetch data based on role
  const { data: pendingRegistrations } = useQuery({
    queryKey: ['pendingRegistrations'],
    queryFn: fetchPendingRegistrations,
    enabled: userRole === UserRole.WHOLESALE || userRole === UserRole.ADMIN,
  });

  const { data: policyholdersNeedingReview } = useQuery({
    queryKey: ['policyholdersNeedingReview'],
    queryFn: fetchPolicyholdersNeedingReview,
    enabled: userRole === UserRole.WHOLESALE || userRole === UserRole.ADMIN,
  });

  const { data: proposalsNeedingDecision } = useQuery({
    queryKey: ['proposalsNeedingDecision'],
    queryFn: fetchProposalsNeedingDecision,
    enabled: userRole === UserRole.WHOLESALE || userRole === UserRole.ADMIN,
  });

  const { data: notices } = useQuery({
    queryKey: ['notices'],
    queryFn: fetchNotices,
  });

  const { data: brokerSummaries } = useQuery({
    queryKey: ['brokerSummaries'],
    queryFn: fetchBrokerSummaries,
    enabled: userRole === UserRole.WHOLESALE || userRole === UserRole.ADMIN,
  });

  const { data: myPolicyholders } = useQuery({
    queryKey: ['myPolicyholders'],
    queryFn: fetchMyPolicyholders,
    enabled: userRole === UserRole.BROKER,
  });

  const { data: myProposals } = useQuery({
    queryKey: ['myProposals'],
    queryFn: fetchMyProposals,
    enabled: userRole === UserRole.BROKER,
  });

  return (
    <ProtectedRoute>
      <Shell>
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <p className="mb-4">Welcome to your dashboard!</p>

        {/* Role-specific content */}
        {userRole === UserRole.WHOLESALE && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <DominoUserData />

            <div className="p-4 bg-white border rounded">
              <h3 className="text-lg font-semibold mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Button className="w-full justify-start" variant="outline">
                  Create Policyholder
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  New Proposal
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  Review Pending Registrations
                </Button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">
                Pending Registrations
              </h2>
              {pendingRegistrations?.length ? (
                <ul className="space-y-2">
                  {pendingRegistrations.map(reg => (
                    <li
                      key={reg.id}
                      className="flex justify-between items-center"
                    >
                      <span>{reg.brokerName}</span>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">
                        {reg.status}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No pending registrations</p>
              )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">
                Policyholders Needing Review
              </h2>
              {policyholdersNeedingReview?.length ? (
                <ul className="space-y-2">
                  {policyholdersNeedingReview.map(ph => (
                    <li
                      key={ph.id}
                      className="flex justify-between items-center"
                    >
                      <span>{ph.companyName}</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                        {ph.status}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No policyholders needing review</p>
              )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">
                Proposals Needing Decision
              </h2>
              {proposalsNeedingDecision?.length ? (
                <ul className="space-y-2">
                  {proposalsNeedingDecision.map(prop => (
                    <li
                      key={prop.id}
                      className="flex justify-between items-center"
                    >
                      <span>{prop.title}</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                        {prop.status}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No proposals needing decision</p>
              )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Notices</h2>
              {notices?.length ? (
                <ul className="space-y-2">
                  {notices.map(notice => (
                    <li
                      key={notice.id}
                      className="border-b pb-2 last:border-b-0 last:pb-0"
                    >
                      <div className="font-medium">{notice.title}</div>
                      <div className="text-sm text-gray-500">{notice.date}</div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No notices</p>
              )}
            </div>
          </div>
        )}

        {userRole === UserRole.WHOLESALE && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <DominoUserData />

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Broker Summaries</h2>
              {brokerSummaries?.length ? (
                <ul className="space-y-3">
                  {brokerSummaries.map(broker => (
                    <li
                      key={broker.id}
                      className="border-b pb-3 last:border-b-0 last:pb-0"
                    >
                      <div className="font-medium">{broker.brokerName}</div>
                      <div className="text-sm text-gray-600">
                        Policies: {broker.policies} | Proposals:{' '}
                        {broker.proposals}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No broker summaries available</p>
              )}
            </div>
          </div>
        )}

        {userRole === UserRole.BROKER && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <DominoUserData />

            <div className="p-4 bg-white border rounded">
              <h3 className="text-lg font-semibold mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Button className="w-full justify-start" variant="outline">
                  Create Policyholder
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  New Proposal
                </Button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">My Policyholders</h2>
              {myPolicyholders?.length ? (
                <ul className="space-y-2">
                  {myPolicyholders.map(ph => (
                    <li
                      key={ph.id}
                      className="flex justify-between items-center"
                    >
                      <span>{ph.companyName}</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                        {ph.status}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No policyholders</p>
              )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">My Proposals</h2>
              {myProposals?.length ? (
                <ul className="space-y-2">
                  {myProposals.map(prop => (
                    <li
                      key={prop.id}
                      className="flex justify-between items-center"
                    >
                      <span>{prop.title}</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                        {prop.status}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No proposals</p>
              )}
            </div>
          </div>
        )}

        {userRole === UserRole.ADMIN && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <DominoUserData />

            <div className="p-4 bg-white border rounded">
              <h3 className="text-lg font-semibold mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Button className="w-full justify-start" variant="outline">
                  Manage Brokers
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  Manage Policyholders
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  Manage Proposals
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  View Bin (Soft-deleted items)
                </Button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">
                Pending Registrations
              </h2>
              {pendingRegistrations?.length ? (
                <ul className="space-y-2">
                  {pendingRegistrations.map(reg => (
                    <li
                      key={reg.id}
                      className="flex justify-between items-center"
                    >
                      <span>{reg.brokerName}</span>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">
                        {reg.status}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No pending registrations</p>
              )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">
                Policyholders Needing Review
              </h2>
              {policyholdersNeedingReview?.length ? (
                <ul className="space-y-2">
                  {policyholdersNeedingReview.map(ph => (
                    <li
                      key={ph.id}
                      className="flex justify-between items-center"
                    >
                      <span>{ph.companyName}</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                        {ph.status}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No policyholders needing review</p>
              )}
            </div>
          </div>
        )}

        {/* Default content for other roles or when no specific role is detected */}
        {!userRole && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <DominoUserData />
          </div>
        )}
      </Shell>
    </ProtectedRoute>
  );
}
