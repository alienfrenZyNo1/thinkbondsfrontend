import { NextResponse } from 'next/server';
import { z } from 'zod';
import { offerSchema } from '@/lib/zod-schemas';
import { logAuditEvent } from '@/lib/audit';
import { v4 as uuidv4 } from 'uuid';

// GET /api/offers
export async function GET(request: Request) {
  try {
    // Log the attempt
    logAuditEvent({
      action: 'OFFER_LIST_ATTEMPT',
      resourceType: 'offer',
      details: {},
    });

    // Check if we're using mock data
    const useMock = process.env.USE_MOCK === 'true';

    // Get query parameters
    const url = new URL(request.url);
    const includeDeleted = url.searchParams.get('includeDeleted') === 'true';

    if (useMock) {
      // Return mock offers data
      const mockOffers = [
        {
          id: '1',
          proposalId: '1',
          bondAmount: '1000.00',
          premium: '50.00',
          effectiveDate: '2025-09-01',
          expiryDate: '2026-09-01',
          terms: 'Standard terms and conditions apply',
          status: 'pending',
          createdAt: '2025-08-28T10:0Z',
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
        },
        {
          id: '2',
          proposalId: '2',
          bondAmount: '2000.00',
          premium: '100.00',
          effectiveDate: '2025-09-01',
          expiryDate: '2026-09-01',
          terms: 'Standard terms and conditions apply',
          status: 'accepted',
          createdAt: '2025-08-27T10:00Z',
          editHistory: [
            {
              id: '2',
              timestamp: '2025-08-27T10:00Z',
              userId: 'wholesaler1',
              userName: 'Wholesaler User',
              action: 'Created',
              changes: {},
            },
            {
              id: '3',
              timestamp: '2025-08-28T10:00Z',
              userId: 'wholesaler1',
              userName: 'Wholesaler User',
              action: 'Accepted',
              changes: {
                status: 'accepted',
              },
            },
          ],
        },
        {
          id: '3',
          proposalId: '3',
          bondAmount: '1500.00',
          premium: '75.00',
          effectiveDate: '2025-09-01',
          expiryDate: '2026-09-01',
          terms: 'Standard terms and conditions apply',
          status: 'soft_deleted',
          createdAt: '2025-08-26T10:00Z',
          editHistory: [
            {
              id: '4',
              timestamp: '2025-08-26T10:00Z',
              userId: 'wholesaler1',
              userName: 'Wholesaler User',
              action: 'Created',
              changes: {},
            },
            {
              id: '5',
              timestamp: '2025-08-27T10:00Z',
              userId: 'wholesaler1',
              userName: 'Wholesaler User',
              action: 'Soft deleted',
              changes: {
                status: 'soft_deleted',
              },
            },
          ],
        },
      ];

      // Filter out soft deleted items unless explicitly requested
      const filteredOffers = includeDeleted
        ? mockOffers
        : mockOffers.filter(offer => offer.status !== 'soft_deleted');

      logAuditEvent({
        action: 'OFFER_LIST_SUCCESS',
        resourceType: 'offer',
        details: { count: filteredOffers.length, environment: 'mock' },
      });

      return NextResponse.json(filteredOffers);
    } else {
      // In production, fetch from DRAPI
      // This would typically involve calling the DRAPI endpoint

      logAuditEvent({
        action: 'OFFER_LIST_SUCCESS',
        resourceType: 'offer',
        details: { environment: 'production' },
      });

      return NextResponse.json([]);
    }
  } catch (error) {
    console.error('Error fetching offers:', error);

    logAuditEvent({
      action: 'OFFER_LIST_ERROR',
      resourceType: 'offer',
      details: {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    });

    return NextResponse.json(
      { error: 'Failed to fetch offers' },
      { status: 500 }
    );
  }
}

// GET /api/offers/bin - Get soft deleted offers
export async function GET_BIN() {
  try {
    // Log the attempt
    logAuditEvent({
      action: 'OFFER_BIN_LIST_ATTEMPT',
      resourceType: 'offer',
      details: {},
    });

    // Check if we're using mock data
    const useMock = process.env.USE_MOCK === 'true';

    if (useMock) {
      // Return mock offers data
      const mockOffers = [
        {
          id: '3',
          proposalId: '3',
          bondAmount: '1500.00',
          premium: '75.00',
          effectiveDate: '2025-09-01',
          expiryDate: '2026-09-01',
          terms: 'Standard terms and conditions apply',
          status: 'soft_deleted',
          createdAt: '2025-08-26T10:00Z',
          editHistory: [
            {
              id: '4',
              timestamp: '2025-08-26T10:00Z',
              userId: 'wholesaler1',
              userName: 'Wholesaler User',
              action: 'Created',
              changes: {},
            },
            {
              id: '5',
              timestamp: '2025-08-27T10:00Z',
              userId: 'wholesaler1',
              userName: 'Wholesaler User',
              action: 'Soft deleted',
              changes: {
                status: 'soft_deleted',
              },
            },
          ],
        },
      ];

      const softDeletedOffers = mockOffers.filter(
        offer => offer.status === 'soft_deleted'
      );

      logAuditEvent({
        action: 'OFFER_BIN_LIST_SUCCESS',
        resourceType: 'offer',
        details: { count: softDeletedOffers.length, environment: 'mock' },
      });

      return NextResponse.json(softDeletedOffers);
    } else {
      // In production, fetch from DRAPI
      // This would typically involve calling the DRAPI endpoint

      logAuditEvent({
        action: 'OFFER_BIN_LIST_SUCCESS',
        resourceType: 'offer',
        details: { environment: 'production' },
      });

      return NextResponse.json([]);
    }
  } catch (error) {
    console.error('Error fetching soft deleted offers:', error);

    logAuditEvent({
      action: 'OFFER_BIN_LIST_ERROR',
      resourceType: 'offer',
      details: {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    });

    return NextResponse.json(
      { error: 'Failed to fetch soft deleted offers' },
      { status: 500 }
    );
  }
}

// GET /api/offers/:id/history - Get edit history for an offer
export async function GET_HISTORY(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    // Log the attempt
    logAuditEvent({
      action: 'OFFER_HISTORY_ATTEMPT',
      resourceType: 'offer',
      resourceId: id,
      details: { hasId: !!id },
    });

    // Check if we're using mock data
    const useMock = process.env.USE_MOCK === 'true';

    if (useMock) {
      // Return mock offers data
      const mockOffers = [
        {
          id: '1',
          proposalId: '1',
          bondAmount: '1000.00',
          premium: '50.00',
          effectiveDate: '2025-09-01',
          expiryDate: '2026-09-01',
          terms: 'Standard terms and conditions apply',
          status: 'pending',
          createdAt: '2025-08-28T10:00:0Z',
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
        },
        {
          id: '2',
          proposalId: '2',
          bondAmount: '2000.00',
          premium: '100.00',
          effectiveDate: '2025-09-01',
          expiryDate: '2026-09-01',
          terms: 'Standard terms and conditions apply',
          status: 'accepted',
          createdAt: '2025-08-27T10:00Z',
          editHistory: [
            {
              id: '2',
              timestamp: '2025-08-27T10:00Z',
              userId: 'wholesaler1',
              userName: 'Wholesaler User',
              action: 'Created',
              changes: {},
            },
            {
              id: '3',
              timestamp: '2025-08-28T10:00Z',
              userId: 'wholesaler1',
              userName: 'Wholesaler User',
              action: 'Accepted',
              changes: {
                status: 'accepted',
              },
            },
          ],
        },
        {
          id: '3',
          proposalId: '3',
          bondAmount: '1500.00',
          premium: '75.00',
          effectiveDate: '2025-09-01',
          expiryDate: '2026-09-01',
          terms: 'Standard terms and conditions apply',
          status: 'soft_deleted',
          createdAt: '2025-08-26T10:00Z',
          editHistory: [
            {
              id: '4',
              timestamp: '2025-08-26T10:00Z',
              userId: 'wholesaler1',
              userName: 'Wholesaler User',
              action: 'Created',
              changes: {},
            },
            {
              id: '5',
              timestamp: '2025-08-27T10:00Z',
              userId: 'wholesaler1',
              userName: 'Wholesaler User',
              action: 'Soft deleted',
              changes: {
                status: 'soft_deleted',
              },
            },
          ],
        },
      ];

      const offer = mockOffers.find(o => o.id === id);
      if (!offer) {
        return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
      }

      logAuditEvent({
        action: 'OFFER_HISTORY_SUCCESS',
        resourceType: 'offer',
        resourceId: id,
        details: { environment: 'mock' },
      });

      return NextResponse.json(offer.editHistory || []);
    } else {
      // In production, fetch from DRAPI
      // This would typically involve calling the DRAPI endpoint

      logAuditEvent({
        action: 'OFFER_HISTORY_SUCCESS',
        resourceType: 'offer',
        resourceId: id,
        details: { environment: 'production' },
      });

      return NextResponse.json([]);
    }
  } catch (error) {
    console.error('Error fetching offer history:', error);

    logAuditEvent({
      action: 'OFFER_HISTORY_ERROR',
      resourceType: 'offer',
      details: {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    });

    return NextResponse.json(
      { error: 'Failed to fetch offer history' },
      { status: 500 }
    );
  }
}

// POST /api/offers
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Log the attempt
    logAuditEvent({
      action: 'OFFER_CREATE_ATTEMPT',
      resourceType: 'offer',
      details: { hasBody: !!body },
    });

    // Validate the request body
    const validatedData = offerSchema.parse(body);

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

      // In development, just return a success response with mock data
      logAuditEvent({
        action: 'OFFER_CREATE_SUCCESS',
        resourceType: 'offer',
        details: { environment: 'mock' },
      });

      return NextResponse.json({
        message: 'Offer created successfully',
        data: {
          ...validatedData,
          id: Date.now().toString(),
          status: 'pending',
          createdAt: new Date().toISOString(),
          editHistory: [editHistoryEntry],
        },
      });
    } else {
      // In production, create the offer in DRAPI
      // This would typically involve:
      // 1. Calling the DRAPI endpoint to create the offer
      // 2. Returning the created offer data

      logAuditEvent({
        action: 'OFFER_CREATE_SUCCESS',
        resourceType: 'offer',
        details: { environment: 'production' },
      });

      return NextResponse.json({
        message: 'Offer created successfully',
        data: {
          ...validatedData,
          id: Date.now().toString(),
          status: 'pending',
          createdAt: new Date().toISOString(),
        },
      });
    }
  } catch (error) {
    console.error('Error creating offer:', error);

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      logAuditEvent({
        action: 'OFFER_CREATE_VALIDATION_ERROR',
        resourceType: 'offer',
        details: { error: error.issues },
      });

      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      );
    }

    logAuditEvent({
      action: 'OFFER_CREATE_ERROR',
      resourceType: 'offer',
      details: {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    });

    // Handle other errors
    return NextResponse.json(
      { error: 'Failed to create offer' },
      { status: 500 }
    );
  }
}

// PUT /api/offers/:id
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    // Log the attempt
    logAuditEvent({
      action: 'OFFER_UPDATE_ATTEMPT',
      resourceType: 'offer',
      resourceId: id,
      details: { hasBody: !!body, hasId: !!id },
    });

    // Validate the request body
    const validatedData = offerSchema.parse(body);

    // Check if we're using mock data
    const useMock = process.env.USE_MOCK === 'true';

    if (useMock) {
      // Create edit history entry
      const editHistoryEntry = {
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        userId: 'current_user_id', // In a real implementation, this would come from the session
        userName: 'Current User', // In a real implementation, this would come from the session
        action: 'Updated',
        changes: {},
      };

      // In development, just return a success response
      logAuditEvent({
        action: 'OFFER_UPDATE_SUCCESS',
        resourceType: 'offer',
        resourceId: id,
        details: { environment: 'mock' },
      });

      return NextResponse.json({
        message: `Offer ${id} updated successfully`,
        data: {
          ...validatedData,
          id,
          updatedAt: new Date().toISOString(),
          editHistory: [editHistoryEntry], // In a real implementation, this would append to existing history
        },
      });
    } else {
      // In production, update the offer in DRAPI
      // This would typically involve:
      // 1. Calling the DRAPI endpoint to update the offer
      // 2. Returning the updated offer data

      logAuditEvent({
        action: 'OFFER_UPDATE_SUCCESS',
        resourceType: 'offer',
        resourceId: id,
        details: { environment: 'production' },
      });

      return NextResponse.json({
        message: `Offer ${id} updated successfully`,
        data: {
          ...validatedData,
          id,
          updatedAt: new Date().toISOString(),
        },
      });
    }
  } catch (error) {
    console.error('Error updating offer:', error);

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      logAuditEvent({
        action: 'OFFER_UPDATE_VALIDATION_ERROR',
        resourceType: 'offer',
        details: { error: error.issues },
      });

      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      );
    }

    logAuditEvent({
      action: 'OFFER_UPDATE_ERROR',
      resourceType: 'offer',
      details: {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    });

    // Handle other errors
    return NextResponse.json(
      { error: 'Failed to update offer' },
      { status: 500 }
    );
  }
}

// DELETE /api/offers/:id
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    // Log the attempt
    logAuditEvent({
      action: 'OFFER_SOFT_DELETE_ATTEMPT',
      resourceType: 'offer',
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
        action: 'OFFER_SOFT_DELETE_SUCCESS',
        resourceType: 'offer',
        resourceId: id,
        details: { environment: 'mock' },
      });

      return NextResponse.json({
        message: `Offer ${id} soft deleted successfully`,
        data: {
          id,
          status: 'soft_deleted',
          editHistory: [editHistoryEntry], // In a real implementation, this would append to existing history
        },
      });
    } else {
      // In production, soft delete the offer in DRAPI
      // This would typically involve:
      // 1. Calling the DRAPI endpoint to update the offer status to soft_deleted

      logAuditEvent({
        action: 'OFFER_SOFT_DELETE_SUCCESS',
        resourceType: 'offer',
        resourceId: id,
        details: { environment: 'production' },
      });

      return NextResponse.json({
        message: `Offer ${id} soft deleted successfully`,
      });
    }
  } catch (error) {
    console.error('Error soft deleting offer:', error);

    logAuditEvent({
      action: 'OFFER_SOFT_DELETE_ERROR',
      resourceType: 'offer',
      details: {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    });

    return NextResponse.json(
      { error: 'Failed to soft delete offer' },
      { status: 500 }
    );
  }
}

// PUT /api/offers/:id/restore - Restore a soft deleted offer
export async function PUT_RESTORE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    // Log the attempt
    logAuditEvent({
      action: 'OFFER_RESTORE_ATTEMPT',
      resourceType: 'offer',
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
          status: 'pending', // or whatever the appropriate status should be
        },
      };

      // In development, just return a success response
      logAuditEvent({
        action: 'OFFER_RESTORE_SUCCESS',
        resourceType: 'offer',
        resourceId: id,
        details: { environment: 'mock' },
      });

      return NextResponse.json({
        message: `Offer ${id} restored successfully`,
        data: {
          id,
          status: 'pending',
          editHistory: [editHistoryEntry], // In a real implementation, this would append to existing history
        },
      });
    } else {
      // In production, restore the offer in DRAPI
      // This would typically involve:
      // 1. Calling the DRAPI endpoint to update the offer status to pending

      logAuditEvent({
        action: 'OFFER_RESTORE_SUCCESS',
        resourceType: 'offer',
        resourceId: id,
        details: { environment: 'production' },
      });

      return NextResponse.json({
        message: `Offer ${id} restored successfully`,
      });
    }
  } catch (error) {
    console.error('Error restoring offer:', error);

    logAuditEvent({
      action: 'OFFER_RESTORE_ERROR',
      resourceType: 'offer',
      details: {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    });

    return NextResponse.json(
      { error: 'Failed to restore offer' },
      { status: 500 }
    );
  }
}
