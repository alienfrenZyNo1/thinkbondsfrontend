import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const useMock = process.env.USE_MOCK === 'true';
    if (useMock || process.env.NODE_ENV !== 'production') {
      // Minimal mock offers by id
      const base = {
        id,
        bondAmount: id === '2' ? '2000.00' : '1000.00',
        premium: id === '2' ? '100.00' : '50.00',
        effectiveDate: '2025-09-01',
        expiryDate: '2026-09-01',
        terms: 'Standard terms and conditions apply',
        status: id === '2' ? 'accepted' : 'pending',
        createdAt: new Date().toISOString(),
        editHistory: []
      } as const;

      const offer = {
        ...base,
        proposalId: id === '2' ? '2' : '1'
      };

      return NextResponse.json(offer);
    }

    // Production placeholder
    return NextResponse.json({ error: 'Not implemented' }, { status: 501 });
  } catch (error) {
    console.error('Error fetching offer by id:', error);
    return NextResponse.json(
      { error: 'Failed to fetch offer' },
      { status: 500 }
    );
  }
}
