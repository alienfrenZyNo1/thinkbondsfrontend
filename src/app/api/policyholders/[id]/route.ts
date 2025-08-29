import { NextResponse } from 'next/server';

// GET /api/policyholders/:id
export async function GET() {
  return NextResponse.json({ message: 'Get policyholder by ID' });
}

// PUT /api/policyholders/:id
export async function PUT() {
  return NextResponse.json({ message: 'Update policyholder by ID' });
}

// DELETE /api/policyholders/:id
export async function DELETE() {
  return NextResponse.json({ message: 'Delete policyholder by ID' });
}
