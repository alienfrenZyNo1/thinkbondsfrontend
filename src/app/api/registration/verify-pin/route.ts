import { NextResponse } from 'next/server';
import { pinVerificationSchema } from '@/lib/zod-schemas';
import { ZodError } from 'zod';
import { getAccessCode, removeAccessCode } from '@/lib/mock-store';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate the request body
    const validatedData = pinVerificationSchema.parse(body);

    const { email, pin } = validatedData;

    // Check if we're using mock data
    const useMock = process.env.USE_MOCK === 'true';

    if (useMock) {
      // Check if the PIN matches for the email via shared mock store
      const accessCode = getAccessCode(email);

      if (!accessCode) {
        return NextResponse.json(
          { error: 'Invalid email or PIN' },
          { status: 400 }
        );
      }

      if (accessCode.pin6 !== pin) {
        return NextResponse.json(
          { error: 'Invalid email or PIN' },
          { status: 400 }
        );
      }

      // PIN is valid, remove it from storage (one-time use)
      removeAccessCode(email);

      return NextResponse.json({ success: true });
    } else {
      // Real implementation would:
      // 1. Check the PIN against the database
      // 2. Validate the PIN
      // 3. Remove or invalidate the PIN after use

      // For now, we'll just return success
      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.error('Error in verify-pin route:', error);

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
