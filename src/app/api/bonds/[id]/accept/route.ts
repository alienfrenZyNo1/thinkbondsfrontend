import { NextResponse } from 'next/server';
import { verifyTimeLimitedToken, hashValue } from '@/lib/security';
import { logAuditEvent } from '@/lib/audit';

// In-memory storage for OTPs (in production, this would be in a database)
const otpStorage = new Map<string, { otp: string; expiresAt: number }>();

// POST /api/bonds/[id]/accept
export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { token, otp } = body;
    
    // Log the attempt
    logAuditEvent({
      action: 'BOND_ACCEPT_ATTEMPT',
      resourceType: 'bond',
      resourceId: params.id,
      details: { hasToken: !!token, hasOtp: !!otp }
    });
    
    // Check if we're using mock data
    const useMock = process.env.USE_MOCK === 'true';
    
    if (useMock) {
      // In development, validate with the hardcoded code "123456"
      if (process.env.NODE_ENV === "development" && otp === "123456") {
        logAuditEvent({
          action: 'BOND_ACCEPT_SUCCESS',
          resourceType: 'bond',
          resourceId: params.id,
          details: { environment: 'development' }
        });
        
        return NextResponse.json({
          message: 'Bond accepted successfully',
          bondId: params.id,
          status: 'accepted',
          acceptedAt: new Date().toISOString(),
        });
      }
      
      // For other cases in mock mode, just return success
      logAuditEvent({
        action: 'BOND_ACCEPT_SUCCESS',
        resourceType: 'bond',
        resourceId: params.id,
        details: { environment: 'mock' }
      });
      
      return NextResponse.json({
        message: 'Bond accepted successfully',
        bondId: params.id,
        status: 'accepted',
        acceptedAt: new Date().toISOString(),
      });
    } else {
      // In production, validate the token and OTP
      // 1. Verify the token
      const tokenData = verifyTimeLimitedToken(token);
      if (!tokenData) {
        logAuditEvent({
          action: 'BOND_ACCEPT_FAILED',
          resourceType: 'bond',
          resourceId: params.id,
          details: { reason: 'Invalid or expired token' }
        });
        
        return NextResponse.json(
          { error: 'Invalid or expired token' },
          { status: 400 }
        );
      }
      
      // 2. Validate the OTP
      const otpRecord = otpStorage.get(params.id);
      if (!otpRecord || otpRecord.expiresAt < Date.now()) {
        logAuditEvent({
          action: 'BOND_ACCEPT_FAILED',
          resourceType: 'bond',
          resourceId: params.id,
          details: { reason: 'OTP has expired' }
        });
        
        return NextResponse.json(
          { error: 'OTP has expired' },
          { status: 400 }
        );
      }
      
      // In a real implementation, we would hash the OTP before comparing
      // const hashedOtp = hashValue(otp);
      // if (hashedOtp !== otpRecord.otp) {
      if (otp !== otpRecord.otp) {
        logAuditEvent({
          action: 'BOND_ACCEPT_FAILED',
          resourceType: 'bond',
          resourceId: params.id,
          details: { reason: 'Invalid OTP' }
        });
        
        return NextResponse.json(
          { error: 'Invalid OTP' },
          { status: 400 }
        );
      }
      
      // 3. Remove the OTP from storage (one-time use)
      otpStorage.delete(params.id);
      
      // 4. Update the bond status in DRAPI/Swing
      // This would typically involve:
      // - Calling the DRAPI/Swing endpoint
      // - Updating the bond status
      // - Returning the updated bond information
      
      logAuditEvent({
        action: 'BOND_ACCEPT_SUCCESS',
        resourceType: 'bond',
        resourceId: params.id,
        details: { environment: 'production' }
      });
      
      return NextResponse.json({
        message: 'Bond accepted successfully',
        bondId: params.id,
        status: 'accepted',
        acceptedAt: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Error accepting bond:', error);
    
    logAuditEvent({
      action: 'BOND_ACCEPT_ERROR',
      resourceType: 'bond',
      resourceId: params.id,
      details: { error: error instanceof Error ? error.message : 'Unknown error' }
    });
    
    return NextResponse.json(
      { error: 'Failed to accept bond' },
      { status: 500 }
    );
  }
}

// POST /api/bonds/[id]/validate-otp
export async function POST_VALIDATE_OTP(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { token, otp } = body;
    
    // Log the attempt
    logAuditEvent({
      action: 'BOND_OTP_VALIDATE_ATTEMPT',
      resourceType: 'bond',
      resourceId: params.id,
      details: { hasToken: !!token, hasOtp: !!otp }
    });
    
    // Check if we're using mock data
    const useMock = process.env.USE_MOCK === 'true';
    
    if (useMock) {
      // In development, validate with the hardcoded code "123456"
      if (process.env.NODE_ENV === "development" && otp === "123456") {
        // Fetch offer details
        const offer = {
          id: params.id,
          bondAmount: "1000.00",
          premium: "50.00",
          effectiveDate: "2025-09-01",
          expiryDate: "2026-09-01",
          terms: "Standard terms and conditions apply",
          status: "pending",
        };
        
        const policyholder = {
          companyName: "Tech Solutions Inc.",
          contactName: "John Smith",
          email: "john@techsolutions.com",
        };
        
        const beneficiary = {
          companyName: "Global Manufacturing Co.",
          contactName: "Jane Doe",
          email: "jane@globalmanufacturing.com",
        };
        
        logAuditEvent({
          action: 'BOND_OTP_VALIDATE_SUCCESS',
          resourceType: 'bond',
          resourceId: params.id,
          details: { environment: 'development' }
        });
        
        return NextResponse.json({
          offer,
          policyholder,
          beneficiary
        });
      }
      
      // For other cases in mock mode, return error
      logAuditEvent({
        action: 'BOND_OTP_VALIDATE_FAILED',
        resourceType: 'bond',
        resourceId: params.id,
        details: { reason: 'Invalid OTP', environment: 'mock' }
      });
      
      return NextResponse.json(
        { error: 'Invalid OTP' },
        { status: 400 }
      );
    } else {
      // In production, validate the token and OTP
      // 1. Verify the token
      const tokenData = verifyTimeLimitedToken(token);
      if (!tokenData) {
        logAuditEvent({
          action: 'BOND_OTP_VALIDATE_FAILED',
          resourceType: 'bond',
          resourceId: params.id,
          details: { reason: 'Invalid or expired token' }
        });
        
        return NextResponse.json(
          { error: 'Invalid or expired token' },
          { status: 400 }
        );
      }
      
      // 2. Validate the OTP
      const otpRecord = otpStorage.get(params.id);
      if (!otpRecord || otpRecord.expiresAt < Date.now()) {
        logAuditEvent({
          action: 'BOND_OTP_VALIDATE_FAILED',
          resourceType: 'bond',
          resourceId: params.id,
          details: { reason: 'OTP has expired' }
        });
        
        return NextResponse.json(
          { error: 'OTP has expired' },
          { status: 400 }
        );
      }
      
      // In a real implementation, we would hash the OTP before comparing
      // const hashedOtp = hashValue(otp);
      // if (hashedOtp !== otpRecord.otp) {
      if (otp !== otpRecord.otp) {
        logAuditEvent({
          action: 'BOND_OTP_VALIDATE_FAILED',
          resourceType: 'bond',
          resourceId: params.id,
          details: { reason: 'Invalid OTP' }
        });
        
        return NextResponse.json(
          { error: 'Invalid OTP' },
          { status: 400 }
        );
      }
      
      // 3. Return the offer details
      // In a real implementation, this would fetch from DRAPI/Swing
      const offer = {
        id: params.id,
        bondAmount: "1000.00",
        premium: "50.00",
        effectiveDate: "2025-09-01",
        expiryDate: "2026-09-01",
        terms: "Standard terms and conditions apply",
        status: "pending",
      };
      
      const policyholder = {
        companyName: "Tech Solutions Inc.",
        contactName: "John Smith",
        email: "john@techsolutions.com",
      };
      
      const beneficiary = {
        companyName: "Global Manufacturing Co.",
        contactName: "Jane Doe",
        email: "jane@globalmanufacturing.com",
      };
      
      logAuditEvent({
        action: 'BOND_OTP_VALIDATE_SUCCESS',
        resourceType: 'bond',
        resourceId: params.id,
        details: { environment: 'production' }
      });
      
      return NextResponse.json({
        offer,
        policyholder,
        beneficiary
      });
    }
  } catch (error) {
    console.error('Error validating OTP:', error);
    
    logAuditEvent({
      action: 'BOND_OTP_VALIDATE_ERROR',
      resourceType: 'bond',
      resourceId: params.id,
      details: { error: error instanceof Error ? error.message : 'Unknown error' }
    });
    
    return NextResponse.json(
      { error: 'Failed to validate OTP' },
      { status: 500 }
    );
  }
}