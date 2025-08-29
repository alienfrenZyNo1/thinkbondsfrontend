import { NextResponse } from 'next/server';
import proposals from '@/mocks/data/proposals.json';
import { logAuditEvent } from '@/lib/audit';
import { v4 as uuidv4 } from 'uuid';

// GET /api/proposals
export async function GET(request: Request) {
  try {
    // Check if we're using mock data
    const useMock = process.env.USE_MOCK === 'true';
    
    // Get query parameters
    const url = new URL(request.url);
    const includeDeleted = url.searchParams.get('includeDeleted') === 'true';
    
    if (useMock) {
      // Filter out soft deleted items unless explicitly requested
      const filteredProposals = includeDeleted
        ? proposals
        : proposals.filter((proposal: any) => proposal.status !== 'soft_deleted');
      
      return NextResponse.json(filteredProposals);
    } else {
      // In a real implementation, this would call the DRAPI
      // For now, return the mock data
      return NextResponse.json(proposals);
    }
  } catch (error) {
    console.error('Error fetching proposals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch proposals' },
      { status: 500 }
    );
  }
}

// GET /api/proposals/bin - Get soft deleted proposals
export async function GET_BIN() {
  try {
    // Check if we're using mock data
    const useMock = process.env.USE_MOCK === 'true';
    
    if (useMock) {
      const softDeletedProposals = proposals.filter((proposal: any) => proposal.status === 'soft_deleted');
      return NextResponse.json(softDeletedProposals);
    } else {
      // In a real implementation, this would call the DRAPI
      // For now, return the mock data
      return NextResponse.json([]);
    }
  } catch (error) {
    console.error('Error fetching soft deleted proposals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch soft deleted proposals' },
      { status: 500 }
    );
  }
}

// GET /api/proposals/:id/history - Get edit history for a proposal
export async function GET_HISTORY(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    
    // Check if we're using mock data
    const useMock = process.env.USE_MOCK === 'true';
    
    if (useMock) {
      const proposal: any = proposals.find((p: any) => p.id === id);
      if (!proposal) {
        return NextResponse.json(
          { error: 'Proposal not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(proposal.editHistory || []);
    } else {
      // In a real implementation, this would call the DRAPI
      // For now, return empty array
      return NextResponse.json([]);
    }
  } catch (error) {
    console.error('Error fetching proposal history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch proposal history' },
      { status: 500 }
    );
  }
}

// POST /api/proposals
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
        changes: {}
      };
      
      // Add status and editHistory to the new proposal
      const newProposal = {
        ...body,
        id: (proposals.length + 1).toString(),
        status: 'draft',
        editHistory: [editHistoryEntry]
      };
      
      // Log audit event
      logAuditEvent({
        action: 'PROPOSAL_CREATED',
        resourceType: 'proposal',
        resourceId: newProposal.id,
        details: { proposal: newProposal }
      });
      
      // In a real implementation, this would create a proposal in the DRAPI
      // For now, just return a success message
      return NextResponse.json({
        message: 'Proposal created successfully',
        data: newProposal
      });
    } else {
      // In a real implementation, this would call the DRAPI
      return NextResponse.json({
        message: 'Proposal created successfully',
        data: { ...body, id: (proposals.length + 1).toString() }
      });
    }
  } catch (error) {
    console.error('Error creating proposal:', error);
    return NextResponse.json(
      { error: 'Failed to create proposal' },
      { status: 500 }
    );
  }
}

// PUT /api/proposals/:id
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    
    // Check if we're using mock data
    const useMock = process.env.USE_MOCK === 'true';
    
    if (useMock) {
      // Find the existing proposal
      const existingProposal: any = proposals.find((p: any) => p.id === id);
      if (!existingProposal) {
        return NextResponse.json(
          { error: 'Proposal not found' },
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
        changes: {}
      };
      
      // Log audit event
      logAuditEvent({
        action: 'PROPOSAL_UPDATED',
        resourceType: 'proposal',
        resourceId: id,
        details: { proposal: body }
      });
      
      // In a real implementation, this would update a proposal in the DRAPI
      // For now, just return a success message
      return NextResponse.json({
        message: `Proposal ${id} updated successfully`,
        data: { ...body, id, editHistory: [...(existingProposal.editHistory || []), editHistoryEntry] }
      });
    } else {
      // In a real implementation, this would call the DRAPI
      return NextResponse.json({
        message: `Proposal ${id} updated successfully`,
        data: { ...body, id }
      });
    }
  } catch (error) {
    console.error('Error updating proposal:', error);
    return NextResponse.json(
      { error: 'Failed to update proposal' },
      { status: 500 }
    );
  }
}

// DELETE /api/proposals/:id
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    
    // Check if we're using mock data
    const useMock = process.env.USE_MOCK === 'true';
    
    if (useMock) {
      // Find the existing proposal
      const existingProposal: any = proposals.find((p: any) => p.id === id);
      if (!existingProposal) {
        return NextResponse.json(
          { error: 'Proposal not found' },
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
          status: 'soft_deleted'
        }
      };
      
      // Log audit event
      logAuditEvent({
        action: 'PROPOSAL_SOFT_DELETED',
        resourceType: 'proposal',
        resourceId: id,
        details: { proposal: existingProposal }
      });
      
      // In a real implementation, this would update the proposal status to soft_deleted in the DRAPI
      // For now, just return a success message
      return NextResponse.json({
        message: `Proposal ${id} soft deleted successfully`,
        data: {
          ...existingProposal,
          id,
          status: 'soft_deleted',
          editHistory: [...(existingProposal.editHistory || []), editHistoryEntry]
        }
      });
    } else {
      // In a real implementation, this would call the DRAPI
      return NextResponse.json({
        message: `Proposal ${id} soft deleted successfully`
      });
    }
  } catch (error) {
    console.error('Error soft deleting proposal:', error);
    return NextResponse.json(
      { error: 'Failed to soft delete proposal' },
      { status: 500 }
    );
  }
}

// PUT /api/proposals/:id/restore - Restore a soft deleted proposal
export async function PUT_RESTORE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    
    // Check if we're using mock data
    const useMock = process.env.USE_MOCK === 'true';
    
    if (useMock) {
      // Find the existing proposal
      const existingProposal: any = proposals.find((p: any) => p.id === id);
      if (!existingProposal) {
        return NextResponse.json(
          { error: 'Proposal not found' },
          { status: 404 }
        );
      }
      
      // Check if the proposal is actually soft deleted
      if (existingProposal.status !== 'soft_deleted') {
        return NextResponse.json(
          { error: 'Proposal is not soft deleted' },
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
          status: 'draft' // or whatever the appropriate status should be
        }
      };
      
      // Log audit event
      logAuditEvent({
        action: 'PROPOSAL_RESTORED',
        resourceType: 'proposal',
        resourceId: id,
        details: { proposal: existingProposal }
      });
      
      // In a real implementation, this would update the proposal status to draft in the DRAPI
      // For now, just return a success message
      return NextResponse.json({
        message: `Proposal ${id} restored successfully`,
        data: {
          ...existingProposal,
          id,
          status: 'draft',
          editHistory: [...(existingProposal.editHistory || []), editHistoryEntry]
        }
      });
    } else {
      // In a real implementation, this would call the DRAPI
      return NextResponse.json({
        message: `Proposal ${id} restored successfully`
      });
    }
  } catch (error) {
    console.error('Error restoring proposal:', error);
    return NextResponse.json(
      { error: 'Failed to restore proposal' },
      { status: 500 }
    );
  }
}