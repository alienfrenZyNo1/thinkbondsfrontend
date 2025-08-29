import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Mock data for development
const mockDominoData = {
  user: {
    id: 'mock-user-id',
    name: 'Mock User',
    email: 'mock@example.com',
    groups: ['broker', 'user'],
    department: 'Sales',
    position: 'Broker',
  },
  groups: ['broker', 'user'],
};

// Simple in-memory cache for development
// In production, you would use Redis or another caching solution
const sessionCache: Record<
  string,
  {
    data: {
      user: {
        id: string;
        name: string;
        email: string;
        groups: string[];
        department: string;
        position: string;
      };
      groups: string[];
    };
    expires: number;
  }
> = {};

export async function GET() {
  try {
    // Get the session
    const session = await getServerSession(authOptions);

    if (!session || !session.accessToken) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check if we have cached data for this session
    const cacheKey = session.accessToken;
    const cached = sessionCache[cacheKey];
    const now = Date.now();

    // Cache TTL: 5 minutes (300,000 milliseconds)
    const CACHE_TTL = 5 * 60 * 1000;

    if (cached && cached.expires > now) {
      return new Response(JSON.stringify(cached.data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // In a real implementation, you would call the Domino REST API here
    // For now, we'll use mock data
    /*
    const response = await fetch(`${process.env.DOMINO_API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user data: ${response.statusText}`);
    }

    const dominoData = await response.json();
    */

    // Use mock data for now
    const dominoData = mockDominoData;

    // Cache the response
    sessionCache[cacheKey] = {
      data: dominoData,
      expires: now + CACHE_TTL,
    };

    return new Response(JSON.stringify(dominoData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch user data' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
