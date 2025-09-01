import { NextResponse } from 'next/server';

// POST /api/bonds/accept
// Public acceptance endpoint used by the demo AcceptanceFlow
// Accepts a JSON body { token?: string } and returns a success status.
export async function POST(request: Request) {
  try {
    // Parse body but don't require token for the demo
    const { token } = (await request.json().catch(() => ({}))) as {
      token?: string;
    };
    void token;

    return NextResponse.json({
      status: 'accepted',
      acceptedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error accepting bond (public):', error);
    return NextResponse.json(
      { error: 'Failed to accept bond' },
      { status: 500 }
    );
  }
}
