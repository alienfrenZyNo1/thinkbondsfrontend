import { NextAuthOptions } from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";

// Define the Domino API response types
interface DominoUser {
  id: string;
  name: string;
 email: string;
 groups: string[];
 [key: string]: any;
}

interface DominoApiResponse {
  user: DominoUser;
  groups: string[];
}

// Extend the built-in session and JWT types
declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    error?: string;
    user: {
      id: string;
      name?: string;
      email?: string;
      image?: string;
      groups?: string[];
      dominoData?: any;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    user?: any;
    dominoData?: any;
  }
}

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const url = `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.KEYCLOAK_CLIENT_ID!,
        client_secret: process.env.KEYCLOAK_CLIENT_SECRET!,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken!,
      }),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      expiresAt: Math.floor(Date.now() / 1000 + refreshedTokens.expires_in),
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.error("Error refreshing access token", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

async function fetchDominoUserData(accessToken: string): Promise<DominoApiResponse | null> {
  try {
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
        id: "mock-user-id",
        name: "Mock User",
        email: "mock@example.com",
        groups: ["broker", "user"]
      },
      groups: ["broker", "user"]
    };
  } catch (error) {
    console.error("Error fetching Domino user data", error);
    return null;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID || "",
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET || "",
      issuer: process.env.KEYCLOAK_ISSUER || "",
      authorization: {
        params: {
          scope: "openid email profile",
        },
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name ?? profile.preferred_username,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        // Fetch Domino user data
        const dominoData = await fetchDominoUserData(account.access_token!);
        
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          expiresAt: account.expires_at,
          user,
          dominoData,
        };
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < (token.expiresAt as number) * 1000) {
        return token;
      }

      // Access token has expired, try to update it
      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      // Handle error during token refresh
      if (token.error === "RefreshAccessTokenError") {
        // Force sign out if token refresh failed
        return { ...session, error: "RefreshAccessTokenError" } as Session;
      }

      session.user = {
        ...session.user,
        ...(token.user as any),
        groups: token.dominoData?.groups || [],
        dominoData: token.dominoData?.user || null,
      };
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};