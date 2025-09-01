import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const useMock = process.env.USE_MOCK === 'true';
    if (useMock) {
      const { id } = await params;
      const history = [
        {
          id: 'h1',
          timestamp: '2025-08-28T10:00:00Z',
          userId: 'wholesaler1',
          userName: 'Wholesaler User',
          action: 'Created',
          changes: { resourceId: id }
        }
      ];
      return NextResponse.json(history);
    }
    return NextResponse.json([], { status: 200 });
  } catch (error) {
    console.error('Error fetching offer history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch history' },
      { status: 500 }
    );
  }
}
