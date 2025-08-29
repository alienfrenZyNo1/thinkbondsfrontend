import { NextResponse } from 'next/server';
import brokers from '@/mocks/data/brokers.json';
import { logAuditEvent } from '@/lib/audit';
import { v4 as uuidv4 } from 'uuid';

// GET /api/brokers
type EditHistoryEntry = {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  changes?: Record<string, unknown>;
};

type Broker = {
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
      const filteredBrokers = includeDeleted
        ? brokers
        : brokers.filter((broker: Broker) => broker.status !== 'soft_deleted');

      return NextResponse.json(filteredBrokers);
    } else {
      // In a real implementation, this would call the DRAPI
      // For now, return the mock data
      return NextResponse.json(brokers);
    }
  } catch (error) {
    console.error('Error fetching brokers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch brokers' },
      { status: 500 }
    );
  }
}

// GET /api/brokers/bin - Get soft deleted brokers
export async function GET_BIN() {
  try {
    // Check if we're using mock data
    const useMock = process.env.USE_MOCK === 'true';

    if (useMock) {
      const softDeletedBrokers = brokers.filter(
        (broker: Broker) => broker.status === 'soft_deleted'
      );
      return NextResponse.json(softDeletedBrokers);
    } else {
      // In a real implementation, this would call the DRAPI
      // For now, return the mock data
      return NextResponse.json([]);
    }
  } catch (error) {
    console.error('Error fetching soft deleted brokers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch soft deleted brokers' },
      { status: 500 }
    );
  }
}

// GET /api/brokers/:id/history - Get edit history for a broker
export async function GET_HISTORY(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    // Check if we're using mock data
    const useMock = process.env.USE_MOCK === 'true';

    if (useMock) {
      const broker: Broker | undefined = (brokers as Broker[]).find(
        b => b.id === id
      );
      if (!broker) {
        return NextResponse.json(
          { error: 'Broker not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(broker.editHistory || []);
    } else {
      // In a real implementation, this would call the DRAPI
      // For now, return empty array
      return NextResponse.json([]);
    }
  } catch (error) {
    console.error('Error fetching broker history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch broker history' },
      { status: 500 }
    );
  }
}

// POST /api/brokers
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

      // Add status and editHistory to the new broker
      const newBroker: Broker = {
        ...body,
        id: (brokers.length + 1).toString(),
        status: 'pending',
        editHistory: [editHistoryEntry],
      };

      // Log audit event
      logAuditEvent({
        action: 'BROKER_CREATED',
        resourceType: 'broker',
        resourceId: newBroker.id,
        details: { broker: newBroker },
      });

      // In a real implementation, this would create a broker in the DRAPI
      // For now, just return a success message
      return NextResponse.json({
        message: 'Broker created successfully',
        data: newBroker,
      });
    } else {
      // In a real implementation, this would call the DRAPI
      return NextResponse.json({
        message: 'Broker created successfully',
        data: { ...body, id: (brokers.length + 1).toString() },
      });
    }
  } catch (error) {
    console.error('Error creating broker:', error);
    return NextResponse.json(
      { error: 'Failed to create broker' },
      { status: 500 }
    );
  }
}

// PUT /api/brokers/:id
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    // Check if we're using mock data
    const useMock = process.env.USE_MOCK === 'true';

    if (useMock) {
      // Find the existing broker
      const existingBroker: Broker | undefined = (brokers as Broker[]).find(
        b => b.id === id
      );
      if (!existingBroker) {
        return NextResponse.json(
          { error: 'Broker not found' },
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
        action: 'BROKER_UPDATED',
        resourceType: 'broker',
        resourceId: id,
        details: { broker: body },
      });

      // In a real implementation, this would update a broker in the DRAPI
      // For now, just return a success message
      return NextResponse.json({
        message: `Broker ${id} updated successfully`,
        data: {
          ...body,
          id,
          editHistory: [
            ...(existingBroker.editHistory || []),
            editHistoryEntry,
          ],
        },
      });
    } else {
      // In a real implementation, this would call the DRAPI
      return NextResponse.json({
        message: `Broker ${id} updated successfully`,
        data: { ...body, id },
      });
    }
  } catch (error) {
    console.error('Error updating broker:', error);
    return NextResponse.json(
      { error: 'Failed to update broker' },
      { status: 500 }
    );
  }
}

// DELETE /api/brokers/:id
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    // Check if we're using mock data
    const useMock = process.env.USE_MOCK === 'true';

    if (useMock) {
      // Find the existing broker
      const existingBroker: Broker | undefined = (brokers as Broker[]).find(
        b => b.id === id
      );
      if (!existingBroker) {
        return NextResponse.json(
          { error: 'Broker not found' },
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
        action: 'BROKER_SOFT_DELETED',
        resourceType: 'broker',
        resourceId: id,
        details: { broker: existingBroker },
      });

      // In a real implementation, this would update the broker status to soft_deleted in the DRAPI
      // For now, just return a success message
      return NextResponse.json({
        message: `Broker ${id} soft deleted successfully`,
        data: {
          ...existingBroker,
          id,
          status: 'soft_deleted',
          editHistory: [
            ...(existingBroker.editHistory || []),
            editHistoryEntry,
          ],
        },
      });
    } else {
      // In a real implementation, this would call the DRAPI
      return NextResponse.json({
        message: `Broker ${id} soft deleted successfully`,
      });
    }
  } catch (error) {
    console.error('Error soft deleting broker:', error);
    return NextResponse.json(
      { error: 'Failed to soft delete broker' },
      { status: 500 }
    );
  }
}

// PUT /api/brokers/:id/restore - Restore a soft deleted broker
export async function PUT_RESTORE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    // Check if we're using mock data
    const useMock = process.env.USE_MOCK === 'true';

    if (useMock) {
      // Find the existing broker
      const existingBroker: Broker | undefined = (brokers as Broker[]).find(
        b => b.id === id
      );
      if (!existingBroker) {
        return NextResponse.json(
          { error: 'Broker not found' },
          { status: 404 }
        );
      }

      // Check if the broker is actually soft deleted
      if (existingBroker.status !== 'soft_deleted') {
        return NextResponse.json(
          { error: 'Broker is not soft deleted' },
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
        action: 'BROKER_RESTORED',
        resourceType: 'broker',
        resourceId: id,
        details: { broker: existingBroker },
      });

      // In a real implementation, this would update the broker status to pending in the DRAPI
      // For now, just return a success message
      return NextResponse.json({
        message: `Broker ${id} restored successfully`,
        data: {
          ...existingBroker,
          id,
          status: 'pending',
          editHistory: [
            ...(existingBroker.editHistory || []),
            editHistoryEntry,
          ],
        },
      });
    } else {
      // In a real implementation, this would call the DRAPI
      return NextResponse.json({
        message: `Broker ${id} restored successfully`,
      });
    }
  } catch (error) {
    console.error('Error restoring broker:', error);
    return NextResponse.json(
      { error: 'Failed to restore broker' },
      { status: 500 }
    );
  }
}
