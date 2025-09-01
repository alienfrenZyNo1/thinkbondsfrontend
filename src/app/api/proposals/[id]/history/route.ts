import { NextResponse } from 'next/server';
import proposals from '@/mocks/data/proposals.json';

type EditHistoryEntry = {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  changes?: Record<string, unknown>;
};

type Proposal = {
  id: string;
  editHistory?: EditHistoryEntry[];
};

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const parts = url.pathname.split('/');
    const id = parts[parts.indexOf('proposals') + 1];

    const useMock = process.env.USE_MOCK === 'true';
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    if (useMock) {
      const proposal = (proposals as Proposal[]).find(p => p.id === id);
      if (!proposal) {
        return NextResponse.json(
          { error: 'Proposal not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(proposal.editHistory || []);
    }

    return NextResponse.json([]);
  } catch (error) {
    console.error('Error fetching proposal history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch proposal history' },
      { status: 500 }
    );
  }
}

