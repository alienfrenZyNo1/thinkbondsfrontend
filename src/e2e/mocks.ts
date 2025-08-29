import { Page } from '@playwright/test';
import { encode } from 'next-auth/jwt';

const isHttps = (process.env.NEXTAUTH_URL ?? '').startsWith('https://');
const COOKIE_NAME = isHttps
  ? '__Secure-next-auth.session-token'
  : 'next-auth.session-token';

export const mockAuthentication = async (page: Page, role: string) => {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error('NEXTAUTH_SECRET is not defined in the environment.');
  }

  const now = Math.floor(Date.now() / 1000);

  // Create a JWT token that matches what NextAuth expects with dominoData structure
  const jwtToken = {
    sub: '1', // Subject (user ID)
    name: `${role} User`,
    email: `${role}@example.com`,
    iat: now, // Issued at
    exp: now + 60 * 60, // Expires in 1 hour
    // Add the dominoData structure that the middleware expects
    dominoData: {
      user: {
        id: '1',
        name: `${role} User`,
        email: `${role}@example.com`,
        groups: [role],
      },
      groups: [role],
    },
    // Add user property for session callback
    user: {
      id: '1',
      name: `${role} User`,
      email: `${role}@example.com`,
      groups: [role],
    },
  };

  console.log('JWT token payload:', JSON.stringify(jwtToken, null, 2));

  // Use NextAuth's encode function to create a proper JWT
  const useEncryption =
    (process.env.NEXTAUTH_ENCRYPTION ?? '').toLowerCase() === 'true';
  const encodedToken = await encode({
    secret,
    token: jwtToken,
    encryption: useEncryption,
  });

  console.log('Generated JWT token length:', encodedToken.length);
  console.log('JWT token (first 50 chars):', encodedToken.substring(0, 50));

  // Set the cookie with the correct name for NextAuth v4
  await page.context().addCookies([
    {
      name: COOKIE_NAME,
      value: encodedToken,
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      sameSite: 'Lax',
      secure: isHttps,
    },
    {
      name: 'e2e-role',
      value: role,
      domain: 'localhost',
      path: '/',
      httpOnly: false,
      sameSite: 'Lax',
      secure: isHttps,
    },
  ]);

  console.log(`Set cookie: ${COOKIE_NAME} for localhost`);

  // Do not auto-navigate; let tests control navigation
  console.log(`Mocked authentication for role: ${role}`);
};
