import { NextResponse } from 'next/server';
import { accessRequestSchema } from '@/lib/zod-schemas';
import { ZodError } from 'zod';

// In-memory storage for mock data
const mockAccessCodes: { email: string; pin6: string; country: string }[] = [];

// Generate a random 6-digit PIN
function generatePin(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate the request body
    const validatedData = accessRequestSchema.parse(body);

    const { email, country } = validatedData;
    const pin6 = generatePin();

    // Check if we're using mock data
    const useMock = process.env.USE_MOCK === 'true';

    if (useMock) {
      // Store in memory for mock implementation
      mockAccessCodes.push({ email, pin6, country });

      // In a real implementation, we would:
      // 1. Store the access code in a database
      // 2. Send an email with the PIN and link

      return NextResponse.json({
        email,
        pin6,
        link: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/broker/register?email=${encodeURIComponent(email)}`,
      });
    } else {
      // Real implementation would:
      // 1. Call middleware or DRAPI action
      // 2. Store Access Code in database
      // 3. Email a link with the PIN

      // For now, we'll return the same response structure
      return NextResponse.json({
        email,
        pin6,
        link: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/broker/register?email=${encodeURIComponent(email)}`,
      });
    }
  } catch (error) {
    console.error('Error in access-code route:', error);

    // Handle Zod validation errors
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
