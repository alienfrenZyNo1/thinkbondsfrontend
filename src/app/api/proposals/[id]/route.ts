import { NextResponse } from 'next/server';
import proposals from '@/mocks/data/proposals.json';

interface EditHistory {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  changes: Record<string, unknown>;
}

interface Proposal {
  id: string;
  title: string;
  description: string;
  brokerId: string;
  policyholderId: string;
  status: string;
  editHistory: EditHistory[];
}

// GET /api/proposals/:id
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }
    const proposal = (proposals as Proposal[]).find(
      (p: Proposal) => p.id === id
    );
    if (!proposal) {
      return NextResponse.json(
        { error: 'Proposal not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(proposal);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch proposal' },
      { status: 500 }
    );
  }
}

// PUT /api/proposals/:id (mock)
export async function PUT() {
  return NextResponse.json({ message: 'Update proposal by ID' });
}

// DELETE /api/proposals/:id (mock)
export async function DELETE() {
  return NextResponse.json({ message: 'Delete proposal by ID' });
}
