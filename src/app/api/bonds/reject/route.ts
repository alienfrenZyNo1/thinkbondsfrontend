import { NextResponse } from 'next/server';

// POST /api/bonds/reject
// Public rejection endpoint used by the demo AcceptanceFlow
// Accepts a JSON body { token?: string } and returns a success status.
export async function POST(request: Request) {
  try {
    const { token } = (await request.json().catch(() => ({}))) as {
      token?: string;
    };
    void token;

    return NextResponse.json({
      status: 'rejected',
      rejectedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error rejecting bond (public):', error);
    return NextResponse.json(
      { error: 'Failed to reject bond' },
      { status: 500 }
    );
  }
}
