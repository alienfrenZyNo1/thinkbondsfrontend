'use client';

import { ProtectedRoute } from '@/components/protected-route';
import { useAuthData } from '@/lib/auth-hooks';
import { UserRole } from '@/lib/roles';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { OfferForm, type OfferFormData } from '@/components/offer-form';
import { generateTimeLimitedToken, generateOTP } from '@/lib/security';

// In-memory storage for OTPs (in production, this would be in a database)
const otpStorage = new Map<string, { otp: string; expiresAt: number }>();

// Mock data fetching functions
async function fetchProposal(id: string) {
  // In a real implementation, this would call an API
  await new Promise(resolve => setTimeout(resolve, 500));
  const response = await fetch(`/api/proposals/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch proposal');
  }
  return await response.json();
}

async function fetchPolicyholder(id: string) {
  // In a real implementation, this would call an API
  await new Promise(resolve => setTimeout(resolve, 500));
  const response = await fetch(`/api/policyholders/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch policyholder');
  }
  return await response.json();
}

async function fetchBroker(id: string) {
  // In a real implementation, this would call an API
  await new Promise(resolve => setTimeout(resolve, 500));
  const response = await fetch(`/api/brokers/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch broker');
  }
  return await response.json();
}

export default function CreateOfferPage({
  params,
}: {
  params: { id: string };
}) {
  const { groups } = useAuthData();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  // const [offerData, setOfferData] = useState<unknown>(null);

  // Check if user has access to create offers (wholesaler or admin)
  const canCreateOffer =
    groups.includes(UserRole.ADMIN) || groups.includes(UserRole.WHOLESALE);

  // Fetch proposal data
  const {
    data: proposal,
    isLoading: isProposalLoading,
    error: proposalError,
  } = useQuery({
    queryKey: ['proposal', params.id],
    queryFn: () => fetchProposal(params.id),
    enabled: canCreateOffer,
  });

  // Fetch policyholder data
  const {
    data: policyholder,
    isLoading: isPolicyholderLoading,
    error: policyholderError,
  } = useQuery({
    queryKey: ['policyholder', proposal?.policyholderId],
    queryFn: () => fetchPolicyholder(proposal?.policyholderId),
    enabled: !!proposal?.policyholderId && canCreateOffer,
  });

  // Fetch broker data
  const {
    data: broker,
    isLoading: isBrokerLoading,
    error: brokerError,
  } = useQuery({
    queryKey: ['broker', proposal?.brokerId],
    queryFn: () => fetchBroker(proposal?.brokerId),
    enabled: !!proposal?.brokerId && canCreateOffer,
  });

  if (!canCreateOffer) {
    return (
      <ProtectedRoute>
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">Create Offer</h1>
          <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
            <p className="text-yellow-700">
              You don't have permission to create offers.
            </p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const handleOfferSubmit = async (values: OfferFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // In a real implementation, this would call an API to create the offer
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create the offer data
      const newOffer = {
        ...values,
        id: `OFFER-${Date.now()}`,
        proposalId: params.id,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      // Generate a secure token for acceptance
      const tokenData = {
        offerId: newOffer.id,
        proposalId: params.id,
        policyholderId: proposal?.policyholderId,
        beneficiaryId: proposal?.beneficiaryId, // Assuming this exists
      };

      void generateTimeLimitedToken(tokenData, 86400); // 24 hours expiry

      // Generate OTP for acceptance
      const otp = generateOTP();

      // Store OTP with 15-minute expiry (in production, this would be in a database)
      const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes
      otpStorage.set(newOffer.id, { otp, expiresAt });

      // In a real implementation, we would:
      // 1. Hash the OTP before storing
      // const hashedOtp = hashValue(otp);
      // otpStorage.set(newOffer.id, { otp: hashedOtp, expiresAt });

      // 2. Send email to policyholder and beneficiary with the token and OTP
      // This would typically involve calling an email service

      // Mock success
      // setOfferData(newOffer);
      setSuccess(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'Failed to create offer'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Create Bond Offer</h1>
          <Button onClick={() => router.back()}>Back to Proposal</Button>
        </div>

        {/* Loading states */}
        {(isProposalLoading || isPolicyholderLoading || isBrokerLoading) && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        )}

        {/* Error states */}
        {(proposalError || policyholderError || brokerError) && (
          <div className="bg-red-50 border border-red-200 rounded p-4 mb-6">
            <p className="text-red-700">
              Error loading data:{' '}
              {proposalError?.message ||
                policyholderError?.message ||
                brokerError?.message}
            </p>
          </div>
        )}

        {/* Success message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded p-4 mb-6">
            <p className="text-green-700">
              Offer created successfully! The policyholder and beneficiary will
              receive an email with acceptance instructions.
            </p>
            <div className="mt-4">
              <Button onClick={() => router.push(`/proposals/${params.id}`)}>
                Back to Proposal
              </Button>
            </div>
          </div>
        )}

        {/* Proposal and parties details */}
        {proposal && (
          <div className="space-y-6 mb-8">
            {/* Contract Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">
                Proposal Information
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

        {/* Offer Form */}
        {!success && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Create Bond Offer</h2>
            {submitError && (
              <div className="bg-red-50 border border-red-200 rounded p-4 mb-6">
                <p className="text-red-700">{submitError}</p>
              </div>
            )}
            <OfferForm
              onSubmit={handleOfferSubmit}
              isSubmitting={isSubmitting}
              proposal={proposal}
            />
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
