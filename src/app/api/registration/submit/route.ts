import { NextResponse } from 'next/server';
import { brokerRegistrationSchema } from '@/lib/zod-schemas';
import { ZodError } from 'zod';

// In-memory storage for mock data (in a real app, this would be in a database)
const mockRegistrations: any[] = [];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate the request body
    const validatedData = brokerRegistrationSchema.parse(body);
    
    // Check if we're using mock data
    const useMock = process.env.USE_MOCK === 'true';
    
    if (useMock) {
      // Store in memory for mock implementation
      mockRegistrations.push({
        ...validatedData,
        id: Date.now().toString(),
        status: 'pending_review',
        createdAt: new Date().toISOString(),
      });
      
      // In a real implementation, we would:
      // 1. Create Registration doc (status pending_review)
      // 2. Generate list of required docs based on Wholesaler config
      // 3. Store in database
      
      return NextResponse.json({
        success: true,
        message: 'Registration submitted successfully'
      });
    } else {
      // Real implementation would:
      // 1. Create Registration doc (status pending_review)
      // 2. Generate list of required docs based on Wholesaler config
      // 3. Proxy to DRAPI
      
      return NextResponse.json({
        success: true,
        message: 'Registration submitted successfully'
      });
    }
  } catch (error: any) {
    console.error('Error in submit route:', error);
    
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