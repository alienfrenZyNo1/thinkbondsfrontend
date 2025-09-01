import { NextResponse } from 'next/server';
import policyholders from '@/mocks/data/policyholders.json';

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
  editHistory?: EditHistoryEntry[];
};

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const parts = url.pathname.split('/');
    const id = parts[parts.indexOf('policyholders') + 1];

    const useMock = process.env.USE_MOCK === 'true';
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    if (useMock) {
      const ph = (policyholders as Policyholder[]).find(p => p.id === id);
      if (!ph) {
        return NextResponse.json(
          { error: 'Policyholder not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(ph.editHistory || []);
    }

    return NextResponse.json([]);
  } catch (error) {
    console.error('Error fetching policyholder history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch policyholder history' },
      { status: 500 }
    );
  }
}

