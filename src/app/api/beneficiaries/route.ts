import { NextResponse } from 'next/server';

// Since beneficiaries are part of proposals, we'll mock some data
const beneficiaries = [
  {
    id: '1',
    companyName: 'Beneficiary Corp',
    contactName: 'Sam Wilson',
    email: 'sam@beneficiary.com',
    phone: '+11111111',
    address: '123 Beneficiary St',
    city: 'Beneficiary City',
    postcode: 'BC1 1BC',
    country: 'GB',
  },
  {
    id: '2',
    companyName: 'Another Beneficiary Ltd',
    contactName: 'Jane Doe',
    email: 'jane@anotherbeneficiary.com',
    phone: '+2222222',
    address: '456 Another St',
    city: 'Another City',
    postcode: 'AC2 2AC',
    country: 'GB',
  },
];

// GET /api/beneficiaries
export async function GET() {
  try {
    // Check if we're using mock data
    const useMock = process.env.USE_MOCK === 'true';

    if (useMock) {
      return NextResponse.json(beneficiaries);
    } else {
      // In a real implementation, this would call the DRAPI
      // For now, return the mock data
      return NextResponse.json(beneficiaries);
    }
  } catch (error) {
    console.error('Error fetching beneficiaries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch beneficiaries' },
      { status: 500 }
    );
  }
}

// POST /api/beneficiaries
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Check if we're using mock data
    const useMock = process.env.USE_MOCK === 'true';

    if (useMock) {
      // In a real implementation, this would create a beneficiary in the DRAPI
      // For now, just return a success message
      return NextResponse.json({
        message: 'Beneficiary created successfully',
        data: { ...body, id: (beneficiaries.length + 1).toString() },
      });
    } else {
      // In a real implementation, this would call the DRAPI
      return NextResponse.json({
        message: 'Beneficiary created successfully',
        data: { ...body, id: (beneficiaries.length + 1).toString() },
      });
    }
  } catch (error) {
    console.error('Error creating beneficiary:', error);
    return NextResponse.json(
      { error: 'Failed to create beneficiary' },
      { status: 500 }
    );
  }
}

// PUT /api/beneficiaries/:id
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    // Check if we're using mock data
    const useMock = process.env.USE_MOCK === 'true';

    if (useMock) {
      // In a real implementation, this would update a beneficiary in the DRAPI
      // For now, just return a success message
      return NextResponse.json({
        message: `Beneficiary ${id} updated successfully`,
        data: { ...body, id },
      });
    } else {
      // In a real implementation, this would call the DRAPI
      return NextResponse.json({
        message: `Beneficiary ${id} updated successfully`,
        data: { ...body, id },
      });
    }
  } catch (error) {
    console.error('Error updating beneficiary:', error);
    return NextResponse.json(
      { error: 'Failed to update beneficiary' },
      { status: 500 }
    );
  }
}

// DELETE /api/beneficiaries/:id
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    // Check if we're using mock data
    const useMock = process.env.USE_MOCK === 'true';

    if (useMock) {
      // In a real implementation, this would delete a beneficiary in the DRAPI
      // For now, just return a success message
      return NextResponse.json({
        message: `Beneficiary ${id} deleted successfully`,
      });
    } else {
      // In a real implementation, this would call the DRAPI
      return NextResponse.json({
        message: `Beneficiary ${id} deleted successfully`,
      });
    }
  } catch (error) {
    console.error('Error deleting beneficiary:', error);
    return NextResponse.json(
      { error: 'Failed to delete beneficiary' },
      { status: 500 }
    );
  }
}
