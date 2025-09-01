import { withAuth } from 'next-auth/middleware';
import { NextRequest } from 'next/server';

// Define the token type with dominoData
interface AuthToken {
  dominoData?: {
    groups: string[];
  };
  [key: string]: unknown;
}

const PUBLIC_EXACT = new Set<string>([
  '/', // exact match only
  '/access/request',
  '/broker/register',
  '/accept',
  // Treat dashboard as public in demo to avoid SSR/client mismatch
  '/dashboard'
]);

function isPublicRoute(pathname: string): boolean {
  if (PUBLIC_EXACT.has(pathname)) return true; // exact paths only
  // Public dynamic segments
  if (pathname.startsWith('/accept')) return true; // allow /accept/*
  // (the next two are already excluded by matcher, but harmless to keep)
  if (pathname.startsWith('/_next')) return true;
  if (pathname === '/favicon.ico' || pathname.startsWith('/static'))
    return true;
  return false;
}

export default withAuth(
  function middleware(req: NextRequest) {
    if (isPublicRoute(req.nextUrl.pathname)) {
      return; // allow public pages through
    }
  },
  {
    pages: { signIn: '/access/request' }, // where unauthenticated users go
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;
        const e2eRole = req.cookies.get('e2e-role')?.value;

        // public pages are always allowed
        if (isPublicRoute(pathname)) return true;

        // Treat presence of e2e-role cookie as authenticated (demo cookie)
        if (!token && e2eRole) {
          // Fall through to RBAC checks using cookie role
        } else if (!token) {
          // require auth elsewhere
          return false;
        }

        // Compute groups from real token or demo cookie role
        const userGroups: string[] = e2eRole
          ? [e2eRole]
          : ((token as AuthToken).dominoData?.groups ?? []);

        // Debug logging
        console.log('Middleware debug:', {
          pathname,
          userGroups,
          token: JSON.stringify(token, null, 2)
        });

        // RBAC
        if (pathname.startsWith('/settings/wholesaler')) {
          const hasAccess =
            userGroups.includes('admin') || userGroups.includes('wholesale');
          console.log(
            'Access to /settings/wholesaler:',
            hasAccess,
            'User groups:',
            userGroups
          );
          return hasAccess;
        }
        if (pathname.startsWith('/brokers')) {
          return userGroups.includes('admin');
        }
        if (pathname.startsWith('/policyholders')) {
          return userGroups.includes('admin');
        }
        if (pathname.startsWith('/proposals')) {
          return (
            userGroups.includes('admin') ||
            userGroups.includes('broker') ||
            userGroups.includes('wholesale')
          );
        }
        if (pathname.startsWith('/offers')) {
          return (
            userGroups.includes('admin') ||
            userGroups.includes('broker') ||
            userGroups.includes('wholesale')
          );
        }

        // default: any authenticated user
        return true;
      }
    }
  }
);

export const config = {
  matcher: [
    // don't run on API or static assets
    '/((?!api|_next/static|_next/image|favicon.ico).*)'
  ]
};
