import { NextResponse } from 'next/server';
import { logAuditEvent } from '@/lib/audit';

// POST /api/bonds/[id]/reject
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { token } = body;

    // Log the attempt
    logAuditEvent({
      action: 'BOND_REJECT_ATTEMPT',
      resourceType: 'bond',
      resourceId: params.id,
      details: { hasToken: !!token },
    });

    // Check if we're using mock data
    const useMock = process.env.USE_MOCK === 'true';

    if (useMock) {
      // In development, just return success
      logAuditEvent({
        action: 'BOND_REJECT_SUCCESS',
        resourceType: 'bond',
        resourceId: params.id,
        details: { environment: 'mock' },
      });

      return NextResponse.json({
        message: 'Bond rejected successfully',
        bondId: params.id,
        status: 'rejected',
        rejectedAt: new Date().toISOString(),
      });
    } else {
      // In production, reject the bond
      // This would typically involve:
      // 1. Validating the token against your database
      // 2. Updating the bond status in DRAPI/Swing
      // 3. Returning the updated bond information

      logAuditEvent({
        action: 'BOND_REJECT_SUCCESS',
        resourceType: 'bond',
        resourceId: params.id,
        details: { environment: 'production' },
      });

      return NextResponse.json({
        message: 'Bond rejected successfully',
        bondId: params.id,
        status: 'rejected',
        rejectedAt: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Error rejecting bond:', error);

    logAuditEvent({
      action: 'BOND_REJECT_ERROR',
      resourceType: 'bond',
      resourceId: params.id,
      details: {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    });

    return NextResponse.json(
      { error: 'Failed to reject bond' },
      { status: 500 }
    );
  }
}
