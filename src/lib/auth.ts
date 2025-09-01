import { NextAuthOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { Session } from 'next-auth';

// Define the Domino API response types
interface DominoUser {
  id: string;
  name: string;
  email: string;
  groups: string[];
  [key: string]: unknown;
}

interface DominoApiResponse {
  user: DominoUser;
  groups: string[];
}

interface DominoData {
  id: string;
  name: string;
  email: string;
  groups: string[];
}

interface AuthUser {
  id: string;
  name?: string;
  email?: string;
  image?: string;
  groups?: string[];
}

// Extend the built-in session and JWT types
declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    error?: string;
    user: AuthUser & {
      dominoData?: DominoData | null;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    user?: AuthUser;
    dominoData?: {
      user: DominoUser;
      groups: string[];
    } | null;
    [key: string]: unknown;
  }
}

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const url = `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_id: process.env.KEYCLOAK_CLIENT_ID!,
        client_secret: process.env.KEYCLOAK_CLIENT_SECRET!,
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken!
      })
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      expiresAt: Math.floor(Date.now() / 1000 + refreshedTokens.expires_in),
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken
    };
  } catch (error) {
    console.error('Error refreshing access token', error);
    return {
      ...token,
      error: 'RefreshAccessTokenError'
    };
  }
}

async function fetchDominoUserData(
  accessToken: string
): Promise<DominoApiResponse | null> {
  try {
    void accessToken;
    // This is where we would call the Domino REST API
    // For now, we'll return mock data
    // In a real implementation, you would call:
    // const response = await fetch(`${process.env.DOMINO_API_URL}/me`, {
    //   headers: {
    //     Authorization: `Bearer ${accessToken}`,
    //   },
    // });
    // return await response.json();

    // Mock implementation for now
    return {
      user: {
        id: 'mock-user-id',
        name: 'Mock User',
        email: 'mock@example.com',
        groups: ['broker', 'user']
      },
      groups: ['broker', 'user']
    };
  } catch (error) {
    console.error('Error fetching Domino user data', error);
    return null;
  }
}

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/access/request'
  },
  providers: [
    /* ... */
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        const exp =
          account.expires_at ??
          (account.expires_in && typeof account.expires_in === 'number'
            ? Math.floor(Date.now() / 1000) + account.expires_in
            : undefined);

        const dominoData = await fetchDominoUserData(account.access_token!);

        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          expiresAt: exp,
          user,
          dominoData
        } as JWT;
      }

      // accept either custom expiresAt or standard exp
      const expiresAt =
        (token as JWT & { expiresAt?: number }).expiresAt ?? token.exp;
      if (typeof expiresAt === 'number' && Date.now() < expiresAt * 1000) {
        return token;
      }

      // if no refresh token available (mock), don't break
      if (!token.refreshToken) return token;

      return refreshAccessToken(token);
    },

    async session({ session, token }) {
      if (token.error === 'RefreshAccessTokenError') {
        return { ...session, error: 'RefreshAccessTokenError' } as Session;
      }
      session.user = {
        ...session.user,
        ...(token.user as AuthUser),
        groups: token.dominoData?.groups || token.user?.groups || [],
        dominoData: token.dominoData?.user || null
      };
      session.accessToken = token.accessToken as string | undefined;
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development'
};
