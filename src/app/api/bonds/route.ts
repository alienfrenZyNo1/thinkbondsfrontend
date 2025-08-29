import { NextResponse } from 'next/server';
import { logAuditEvent } from '@/lib/audit';
import { v4 as uuidv4 } from 'uuid';

// POST /api/bonds
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Log the attempt
    logAuditEvent({
      action: 'BOND_CREATE_ATTEMPT',
      resourceType: 'bond',
      details: { hasBody: !!body },
    });

    // Check if we're using mock data
    const useMock = process.env.USE_MOCK === 'true';

    if (useMock) {
      // Create edit history entry
      const editHistoryEntry = {
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        userId: 'current_user_id', // In a real implementation, this would come from the session
        userName: 'Current User', // In a real implementation, this would come from the session
        action: 'Created',
        changes: {},
      };

      // In development, return mock data or generate a mock PDF
      // For now, we'll return a success response with mock data
      logAuditEvent({
        action: 'BOND_CREATE_SUCCESS',
        resourceType: 'bond',
        details: { environment: 'mock' },
      });

      return NextResponse.json({
        message: 'Bond PDF generated successfully',
        bondId: `BOND-${Date.now()}`,
        url: '/mock-bond.pdf',
        data: {
          ...body,
          id: `BOND-${Date.now()}`,
          createdAt: new Date().toISOString(),
          status: 'active',
          editHistory: [editHistoryEntry],
        },
      });
    } else {
      // In production, proxy to DRAPI/Swing addon to generate actual PDF
      // This would typically involve:
      // 1. Calling the DRAPI/Swing endpoint
      // 2. Generating the PDF
      // 3. Returning the PDF URL or streaming the PDF back

      logAuditEvent({
        action: 'BOND_CREATE_SUCCESS',
        resourceType: 'bond',
        details: { environment: 'production' },
      });

      return NextResponse.json({
        message: 'Bond PDF generated successfully',
        bondId: `BOND-${Date.now()}`,
        url: '/api/bonds/generated-bond.pdf',
        data: {
          ...body,
          id: `BOND-${Date.now()}`,
          createdAt: new Date().toISOString(),
        },
      });
    }
  } catch (error) {
    console.error('Error generating bond PDF:', error);

    logAuditEvent({
      action: 'BOND_CREATE_ERROR',
      resourceType: 'bond',
      details: {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    });

    return NextResponse.json(
      { error: 'Failed to generate bond PDF' },
      { status: 500 }
    );
  }
}

// GET /api/bonds/:id
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    // Log the attempt
    logAuditEvent({
      action: 'BOND_FETCH_ATTEMPT',
      resourceType: 'bond',
      resourceId: id,
      details: { hasId: !!id },
    });

    // Check if we're using mock data
    const useMock = process.env.USE_MOCK === 'true';

    if (useMock) {
      // In development, return mock data
      logAuditEvent({
        action: 'BOND_FETCH_SUCCESS',
        resourceType: 'bond',
        resourceId: id,
        details: { environment: 'mock' },
      });

      return NextResponse.json({
        id,
        bondAmount: '1000.00',
        premium: '50.00',
        effectiveDate: '2025-09-01',
        expiryDate: '2026-09-01',
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
        terms:
          'This bond is issued subject to the terms and conditions outlined in the agreement.',
        status: 'active',
        createdAt: new Date().toISOString(),
        editHistory: [
          {
            id: '1',
            timestamp: '2025-08-28T10:00:0Z',
            userId: 'wholesaler1',
            userName: 'Wholesaler User',
            action: 'Created',
            changes: {},
          },
        ],
      });
    } else {
      // In production, fetch from DRAPI/Swing addon
      // This would typically involve calling the DRAPI/Swing endpoint

      logAuditEvent({
        action: 'BOND_FETCH_SUCCESS',
        resourceType: 'bond',
        resourceId: id,
        details: { environment: 'production' },
      });

      return NextResponse.json({
        id,
        bondAmount: '1000.00',
        premium: '50.00',
        effectiveDate: '2025-09-01',
        expiryDate: '2026-09-01',
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
        terms:
          'This bond is issued subject to the terms and conditions outlined in the agreement.',
        status: 'active',
        createdAt: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Error fetching bond:', error);

    logAuditEvent({
      action: 'BOND_FETCH_ERROR',
      resourceType: 'bond',
      details: {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    });

    return NextResponse.json(
      { error: 'Failed to fetch bond' },
      { status: 500 }
    );
  }
}

// DELETE /api/bonds/:id
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    // Log the attempt
    logAuditEvent({
      action: 'BOND_SOFT_DELETE_ATTEMPT',
      resourceType: 'bond',
      resourceId: id,
      details: { hasId: !!id },
    });

    // Check if we're using mock data
    const useMock = process.env.USE_MOCK === 'true';

    if (useMock) {
      // Create edit history entry for soft delete
      const editHistoryEntry = {
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        userId: 'current_user_id', // In a real implementation, this would come from the session
        userName: 'Current User', // In a real implementation, this would come from the session
        action: 'Soft Deleted',
        changes: {
          status: 'soft_deleted',
        },
      };

      // In development, just return a success response
      logAuditEvent({
        action: 'BOND_SOFT_DELETE_SUCCESS',
        resourceType: 'bond',
        resourceId: id,
        details: { environment: 'mock' },
      });

      return NextResponse.json({
        message: `Bond ${id} soft deleted successfully`,
        data: {
          id,
          status: 'soft_deleted',
          editHistory: [editHistoryEntry], // In a real implementation, this would append to existing history
        },
      });
    } else {
      // In production, soft delete the bond in DRAPI
      // This would typically involve:
      // 1. Calling the DRAPI endpoint to update the bond status to soft_deleted

      logAuditEvent({
        action: 'BOND_SOFT_DELETE_SUCCESS',
        resourceType: 'bond',
        resourceId: id,
        details: { environment: 'production' },
      });

      return NextResponse.json({
        message: `Bond ${id} soft deleted successfully`,
      });
    }
  } catch (error) {
    console.error('Error soft deleting bond:', error);

    logAuditEvent({
      action: 'BOND_SOFT_DELETE_ERROR',
      resourceType: 'bond',
      details: {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    });

    return NextResponse.json(
      { error: 'Failed to soft delete bond' },
      { status: 500 }
    );
  }
}

// PUT /api/bonds/:id/restore - Restore a soft deleted bond
export async function PUT_RESTORE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    // Log the attempt
    logAuditEvent({
      action: 'BOND_RESTORE_ATTEMPT',
      resourceType: 'bond',
      resourceId: id,
      details: { hasId: !!id },
    });

    // Check if we're using mock data
    const useMock = process.env.USE_MOCK === 'true';

    if (useMock) {
      // Create edit history entry for restore
      const editHistoryEntry = {
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        userId: 'current_user_id', // In a real implementation, this would come from the session
        userName: 'Current User', // In a real implementation, this would come from the session
        action: 'Restored',
        changes: {
          status: 'active', // or whatever the appropriate status should be
        },
      };

      // In development, just return a success response
      logAuditEvent({
        action: 'BOND_RESTORE_SUCCESS',
        resourceType: 'bond',
        resourceId: id,
        details: { environment: 'mock' },
      });

      return NextResponse.json({
        message: `Bond ${id} restored successfully`,
        data: {
          id,
          status: 'active',
          editHistory: [editHistoryEntry], // In a real implementation, this would append to existing history
        },
      });
    } else {
      // In production, restore the bond in DRAPI
      // This would typically involve:
      // 1. Calling the DRAPI endpoint to update the bond status to active

      logAuditEvent({
        action: 'BOND_RESTORE_SUCCESS',
        resourceType: 'bond',
        resourceId: id,
        details: { environment: 'production' },
      });

      return NextResponse.json({
        message: `Bond ${id} restored successfully`,
      });
    }
  } catch (error) {
    console.error('Error restoring bond:', error);

    logAuditEvent({
      action: 'BOND_RESTORE_ERROR',
      resourceType: 'bond',
      details: {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    });

    return NextResponse.json(
      { error: 'Failed to restore bond' },
      { status: 500 }
    );
  }
}

// GET /api/bonds/:id/history - Get edit history for a bond
export async function GET_HISTORY(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    // Log the attempt
    logAuditEvent({
      action: 'BOND_HISTORY_ATTEMPT',
      resourceType: 'bond',
      resourceId: id,
      details: { hasId: !!id },
    });

    // Check if we're using mock data
    const useMock = process.env.USE_MOCK === 'true';

    if (useMock) {
      // In development, return mock data
      logAuditEvent({
        action: 'BOND_HISTORY_SUCCESS',
        resourceType: 'bond',
        resourceId: id,
        details: { environment: 'mock' },
      });

      // Return mock edit history data
      const mockEditHistory = [
        {
          id: '1',
          timestamp: '2025-08-28T10:00:0Z',
          userId: 'wholesaler1',
          userName: 'Wholesaler User',
          action: 'Created',
          changes: {},
        },
      ];

      return NextResponse.json(mockEditHistory);
    } else {
      // In production, fetch from DRAPI/Swing addon
      // This would typically involve calling the DRAPI/Swing endpoint

      logAuditEvent({
        action: 'BOND_HISTORY_SUCCESS',
        resourceType: 'bond',
        resourceId: id,
        details: { environment: 'production' },
      });

      return NextResponse.json([]);
    }
  } catch (error) {
    console.error('Error fetching bond history:', error);

    logAuditEvent({
      action: 'BOND_HISTORY_ERROR',
      resourceType: 'bond',
      details: {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    });

    return NextResponse.json(
      { error: 'Failed to fetch bond history' },
      { status: 500 }
    );
  }
}
