import { NextResponse } from 'next/server';

// GET /api/proposals/:id
export async function GET() {
  return NextResponse.json({ message: 'Get proposal by ID' });
}

// PUT /api/proposals/:id
export async function PUT() {
  return NextResponse.json({ message: 'Update proposal by ID' });
}

// DELETE /api/proposals/:id
export async function DELETE() {
  return NextResponse.json({ message: 'Delete proposal by ID' });
}