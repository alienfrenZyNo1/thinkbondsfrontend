import { NextResponse } from 'next/server';

// GET /api/settings/wholesaler
export async function GET() {
  return NextResponse.json({ message: 'Get wholesaler settings' });
}

// PUT /api/settings/wholesaler
export async function PUT() {
  return NextResponse.json({ message: 'Update wholesaler settings' });
}