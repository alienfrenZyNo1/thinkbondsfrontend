'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuthData } from '@/lib/auth-hooks';
import { OtpVerification } from '@/components/otp-verification';
import { BondCertificate } from '@/components/bond-certificate';
import { verifyTimeLimitedToken } from '@/lib/security';

interface AcceptanceFlowProps {
  token: string;
}

interface Offer {
  id: string;
  bondAmount: string;
  premium: string;
  effectiveDate: string;
  expiryDate: string;
  terms: string;
  status?: string;
}

interface Policyholder {
  companyName: string;
  contactName: string;
  email: string;
}

interface Beneficiary {
  companyName: string;
  contactName: string;
  email: string;
}

export function AcceptanceFlow({ token }: AcceptanceFlowProps) {
  const [step, setStep] = useState<'otp' | 'certificate' | 'completed'>('otp');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offer, setOffer] = useState<Offer | null>(null);
  const [policyholder, setPolicyholder] = useState<Policyholder | null>(null);
  const [beneficiary, setBeneficiary] = useState<Beneficiary | null>(null);
  const { isAuthenticated } = useAuthData();

  // Mock function to fetch offer details
  const fetchOfferDetails = async (token: string) => {
    // In a real implementation, this would call an API
    await new Promise(resolve => setTimeout(resolve, 500));

    // Verify the token unless running e2e
    const isE2E = (process.env.NEXT_PUBLIC_E2E ?? '').toLowerCase() === 'true';
    if (!isE2E) {
      const tokenData = verifyTimeLimitedToken(token);
      if (!tokenData) {
        throw new Error('Invalid or expired token');
      }
    }

    // Mock data
    return {
      offer: {
        id: 'BOND-001',
        bondAmount: '1000.00',
        premium: '500.00',
        effectiveDate: '2025-09-01',
        expiryDate: '2026-09-01',
        terms:
          'This bond is issued subject to the terms and conditions outlined in the agreement. The policyholder agrees to pay the premium and comply with all terms. The beneficiary may make a claim in the event of default by the policyholder.',
      },
      policyholder: {
        companyName: 'Tech Solutions Inc.',
        contactName: 'John Smith',
        email: 'john@techsolutions.com',
      },
      beneficiary: {
        companyName: 'Global Manufacturing Co.',
        contactName: 'Jane Doe',
        email: 'jane@globalmanufacturing.com',
      },
    };
  };

  const handleOtpVerify = async (otp: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // In development, accept the hardcoded code "123456"
      if (process.env.NODE_ENV === 'development' && otp === '123456') {
        // Fetch offer details
        const data = await fetchOfferDetails(token);
        setOffer(data.offer);
        setPolicyholder(data.policyholder);
        setBeneficiary(data.beneficiary);
        setStep('certificate');
        return;
      }

      // In production, validate the OTP against your backend
      const response = await fetch('/api/bonds/accept/validate-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, otp }),
      });

      if (!response.ok) {
        throw new Error('Invalid code');
      }

      const data = await response.json();
      setOffer(data.offer);
      setPolicyholder(data.policyholder);
      setBeneficiary(data.beneficiary);
      setStep('certificate');
    } catch {
      setError('Invalid code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // In production, this would call an API to accept the bond
      const response = await fetch('/api/bonds/accept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        throw new Error('Failed to accept bond');
      }

      const data = await response.json();
      if (offer) {
        setOffer({ ...offer, status: data.status });
      }
      setStep('completed');
    } catch {
      setError('Failed to accept bond. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // In production, this would call an API to reject the bond
      const response = await fetch('/api/bonds/reject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        throw new Error('Failed to reject bond');
      }

      const data = await response.json();
      if (offer) {
        setOffer({ ...offer, status: data.status });
      }
      setStep('completed');
    } catch {
      setError('Failed to reject bond. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Already Signed In</h2>
        <p className="mb-4">
          You are already signed in. Please continue to the application.
        </p>
        <Button onClick={() => (window.location.href = '/dashboard')}>
          Go to Dashboard
        </Button>
      </div>
    );
  }

  if (step === 'otp') {
    return (
      <OtpVerification
        onVerify={handleOtpVerify}
        isLoading={isLoading}
        error={error}
      />
    );
  }

  if (step === 'certificate' && offer && policyholder && beneficiary) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold text-center mb-6">
          Bond Certificate
        </h1>

        <BondCertificate
          offer={offer}
          policyholder={policyholder}
          beneficiary={beneficiary}
        />

        {error && (
          <div className="max-w-4xl mx-auto mt-6 p-4 bg-red-50 border-red-200 rounded">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="max-w-4xl mx-auto mt-8 flex justify-center space-x-4">
          <Button onClick={handleReject} variant="outline" disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Reject Bond'}
          </Button>
          <Button onClick={handleAccept} disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Accept and Sign'}
          </Button>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className="max-w-4xl mx-auto mt-6 p-4 bg-yellow-100 rounded">
            <p className="text-sm">
              <strong>Development Mode:</strong> This is a mock certificate for
              demonstration purposes.
            </p>
          </div>
        )}
      </div>
    );
  }

  if (step === 'completed') {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Bond Process Completed</h2>
        <p className="mb-4">
          {offer?.status === 'accepted'
            ? 'The bond has been successfully accepted and signed.'
            : 'The bond has been rejected.'}
        </p>
        <Button onClick={() => (window.location.href = '/')}>
          Return to Home
        </Button>
      </div>
    );
  }

  return null;
}
