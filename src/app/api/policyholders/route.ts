import { NextResponse } from 'next/server';
import policyholders from '@/mocks/data/policyholders.json';
import { logAuditEvent } from '@/lib/audit';
import { v4 as uuidv4 } from 'uuid';

// GET /api/policyholders
type EditHistoryEntry = {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  changes?: Record<string, unknown>;
};

type Policyholder = {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  status: string;
  editHistory?: EditHistoryEntry[];
};

export async function GET(request: Request) {
  try {
    // Check if we're using mock data
    const useMock = process.env.USE_MOCK === 'true';

    // Get query parameters
    const url = new URL(request.url);
    const includeDeleted = url.searchParams.get('includeDeleted') === 'true';

    if (useMock) {
      // Filter out soft deleted items unless explicitly requested
      const filteredPolicyholders = includeDeleted
        ? policyholders
        : policyholders.filter(
            (policyholder: Policyholder) =>
              policyholder.status !== 'soft_deleted'
          );

      return NextResponse.json(filteredPolicyholders);
    } else {
      // In a real implementation, this would call the DRAPI
      // For now, return the mock data
      return NextResponse.json(policyholders);
    }
  } catch (error) {
    console.error('Error fetching policyholders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch policyholders' },
      { status: 500 }
    );
  }
}

// GET /api/policyholders/bin - Get soft deleted policyholders
export async function GET_BIN() {
  try {
    // Check if we're using mock data
    const useMock = process.env.USE_MOCK === 'true';

    if (useMock) {
      const softDeletedPolicyholders = policyholders.filter(
        (policyholder: Policyholder) => policyholder.status === 'soft_deleted'
      );
      return NextResponse.json(softDeletedPolicyholders);
    } else {
      // In a real implementation, this would call the DRAPI
      // For now, return the mock data
      return NextResponse.json([]);
    }
  } catch (error) {
    console.error('Error fetching soft deleted policyholders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch soft deleted policyholders' },
      { status: 500 }
    );
  }
}

// GET /api/policyholders/:id/history - Get edit history for a policyholder
export async function GET_HISTORY(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    // Check if we're using mock data
    const useMock = process.env.USE_MOCK === 'true';

    if (useMock) {
      const policyholder: Policyholder | undefined = (
        policyholders as Policyholder[]
      ).find(p => p.id === id);
      if (!policyholder) {
        return NextResponse.json(
          { error: 'Policyholder not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(policyholder.editHistory || []);
    } else {
      // In a real implementation, this would call the DRAPI
      // For now, return empty array
      return NextResponse.json([]);
    }
  } catch (error) {
    console.error('Error fetching policyholder history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch policyholder history' },
      { status: 500 }
    );
  }
}

// POST /api/policyholders
export async function POST(request: Request) {
  try {
    const body = await request.json();

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

      // Add status and editHistory to the new policyholder
      const newPolicyholder: Policyholder = {
        ...body,
        id: (policyholders.length + 1).toString(),
        status: 'pending',
        editHistory: [editHistoryEntry],
      };

      // Log audit event
      logAuditEvent({
        action: 'POLICYHOLDER_CREATED',
        resourceType: 'policyholder',
        resourceId: newPolicyholder.id,
        details: { policyholder: newPolicyholder },
      });

      // In a real implementation, this would create a policyholder in the DRAPI
      // For now, just return a success message
      return NextResponse.json({
        message: 'Policyholder created successfully',
        data: newPolicyholder,
      });
    } else {
      // In a real implementation, this would call the DRAPI
      return NextResponse.json({
        message: 'Policyholder created successfully',
        data: { ...body, id: (policyholders.length + 1).toString() },
      });
    }
  } catch (error) {
    console.error('Error creating policyholder:', error);
    return NextResponse.json(
      { error: 'Failed to create policyholder' },
      { status: 500 }
    );
  }
}

// PUT /api/policyholders/:id
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    // Check if we're using mock data
    const useMock = process.env.USE_MOCK === 'true';

    if (useMock) {
      // Find the existing policyholder
      const existingPolicyholder: Policyholder | undefined = (
        policyholders as Policyholder[]
      ).find(p => p.id === id);
      if (!existingPolicyholder) {
        return NextResponse.json(
          { error: 'Policyholder not found' },
          { status: 404 }
        );
      }

      // Create edit history entry
      const editHistoryEntry = {
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        userId: 'current_user_id', // In a real implementation, this would come from the session
        userName: 'Current User', // In a real implementation, this would come from the session
        action: 'Updated',
        changes: {},
      };

      // Log audit event
      logAuditEvent({
        action: 'POLICYHOLDER_UPDATED',
        resourceType: 'policyholder',
        resourceId: id,
        details: { policyholder: body },
      });

      // In a real implementation, this would update a policyholder in the DRAPI
      // For now, just return a success message
      return NextResponse.json({
        message: `Policyholder ${id} updated successfully`,
        data: {
          ...body,
          id,
          editHistory: [
            ...(existingPolicyholder.editHistory || []),
            editHistoryEntry,
          ],
        },
      });
    } else {
      // In a real implementation, this would call the DRAPI
      return NextResponse.json({
        message: `Policyholder ${id} updated successfully`,
        data: { ...body, id },
      });
    }
  } catch (error) {
    console.error('Error updating policyholder:', error);
    return NextResponse.json(
      { error: 'Failed to update policyholder' },
      { status: 500 }
    );
  }
}

// DELETE /api/policyholders/:id
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    // Check if we're using mock data
    const useMock = process.env.USE_MOCK === 'true';

    if (useMock) {
      // Find the existing policyholder
      const existingPolicyholder: Policyholder | undefined = (
        policyholders as Policyholder[]
      ).find(p => p.id === id);
      if (!existingPolicyholder) {
        return NextResponse.json(
          { error: 'Policyholder not found' },
          { status: 404 }
        );
      }

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

      // Log audit event
      logAuditEvent({
        action: 'POLICYHOLDER_SOFT_DELETED',
        resourceType: 'policyholder',
        resourceId: id,
        details: { policyholder: existingPolicyholder },
      });

      // In a real implementation, this would update the policyholder status to soft_deleted in the DRAPI
      // For now, just return a success message
      return NextResponse.json({
        message: `Policyholder ${id} soft deleted successfully`,
        data: {
          ...existingPolicyholder,
          id,
          status: 'soft_deleted',
          editHistory: [
            ...(existingPolicyholder.editHistory || []),
            editHistoryEntry,
          ],
        },
      });
    } else {
      // In a real implementation, this would call the DRAPI
      return NextResponse.json({
        message: `Policyholder ${id} soft deleted successfully`,
      });
    }
  } catch (error) {
    console.error('Error soft deleting policyholder:', error);
    return NextResponse.json(
      { error: 'Failed to soft delete policyholder' },
      { status: 500 }
    );
  }
}

// PUT /api/policyholders/:id/restore - Restore a soft deleted policyholder
export async function PUT_RESTORE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    // Check if we're using mock data
    const useMock = process.env.USE_MOCK === 'true';

    if (useMock) {
      // Find the existing policyholder
      const existingPolicyholder: Policyholder | undefined = (
        policyholders as Policyholder[]
      ).find(p => p.id === id);
      if (!existingPolicyholder) {
        return NextResponse.json(
          { error: 'Policyholder not found' },
          { status: 404 }
        );
      }

      // Check if the policyholder is actually soft deleted
      if (existingPolicyholder.status !== 'soft_deleted') {
        return NextResponse.json(
          { error: 'Policyholder is not soft deleted' },
          { status: 400 }
        );
      }

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

      // Log audit event
      logAuditEvent({
        action: 'POLICYHOLDER_RESTORED',
        resourceType: 'policyholder',
        resourceId: id,
        details: { policyholder: existingPolicyholder },
      });

      // In a real implementation, this would update the policyholder status to pending in the DRAPI
      // For now, just return a success message
      return NextResponse.json({
        message: `Policyholder ${id} restored successfully`,
        data: {
          ...existingPolicyholder,
          id,
          status: 'pending',
          editHistory: [
            ...(existingPolicyholder.editHistory || []),
            editHistoryEntry,
          ],
        },
      });
    } else {
      // In a real implementation, this would call the DRAPI
      return NextResponse.json({
        message: `Policyholder ${id} restored successfully`,
      });
    }
  } catch (error) {
    console.error('Error restoring policyholder:', error);
    return NextResponse.json(
      { error: 'Failed to restore policyholder' },
      { status: 500 }
    );
  }
}
