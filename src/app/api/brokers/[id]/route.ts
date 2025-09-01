import { NextResponse } from 'next/server';
import brokers from '@/mocks/data/brokers.json';

type Broker = {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  status: string;
};

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const broker = (brokers as Broker[]).find(b => b.id === id);
    if (!broker) {
      return NextResponse.json({ error: 'Broker not found' }, { status: 404 });
    }
    return NextResponse.json(broker);
  } catch (error) {
    console.error('Error fetching broker:', error);
    return NextResponse.json(
      { error: 'Failed to fetch broker' },
      { status: 500 }
    );
  }
}

export async function PUT() {
  return NextResponse.json({ message: 'Update broker by ID' });
}

export async function DELETE() {
  return NextResponse.json({ message: 'Delete broker by ID' });
}

