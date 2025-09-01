import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { otp } = (await request.json()) as { otp?: string };
    if (otp !== '123456') {
      return NextResponse.json({ error: 'Invalid code' }, { status: 400 });
    }

    return NextResponse.json({
      offer: {
        id: 'BOND-001',
        proposalId: '1',
        bondAmount: '1000.00',
        premium: '500.00',
        effectiveDate: '2025-09-01',
        expiryDate: '2026-09-01',
        terms:
          'This bond is issued subject to the terms and conditions outlined in the agreement.',
        status: 'pending',
        createdAt: new Date().toISOString(),
      },
      policyholder: {
        id: '1',
        companyName: 'Tech Solutions Inc.',
        contactName: 'John Smith',
        email: 'john@techsolutions.com',
        phone: '+44 1234 567890',
        status: 'approved',
      },
      beneficiary: {
        id: '2',
        companyName: 'Global Manufacturing Co.',
        contactName: 'Jane Doe',
        email: 'jane@globalmanufacturing.com',
        phone: '+44 9876 543210',
        status: 'approved',
      },
    });
  } catch (error) {
    console.error('Error validating OTP:', error);
    return NextResponse.json(
      { error: 'Failed to validate OTP' },
      { status: 500 }
    );
  }
}

