import { withAuth } from "next-auth/middleware";
import { NextRequest } from "next/server";

const PUBLIC_EXACT = new Set<string>([
  "/",                 // exact match only
  "/access/request",
  "/broker/register",
  "/accept",
]);

function isPublicRoute(pathname: string): boolean {
  if (PUBLIC_EXACT.has(pathname)) return true;        // exact paths only
  // (the next two are already excluded by matcher, but harmless to keep)
  if (pathname.startsWith("/_next")) return true;
  if (pathname === "/favicon.ico" || pathname.startsWith("/static")) return true;
  return false;
}

export default withAuth(
  function middleware(req: NextRequest) {
    if (isPublicRoute(req.nextUrl.pathname)) {
      return; // allow public pages through
    }
  },
  {
    pages: { signIn: "/access/request" }, // where unauthenticated users go
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;

        // public pages are always allowed
        if (isPublicRoute(pathname)) return true;

        // require auth elsewhere
        if (!token) return false;

        const userGroups: string[] = (token as any).dominoData?.groups ?? [];

        // Debug logging
        console.log('Middleware debug:', { pathname, userGroups, token: JSON.stringify(token, null, 2) });

        // RBAC
        if (pathname.startsWith("/settings/wholesaler")) {
          const hasAccess = userGroups.includes("admin") || userGroups.includes("wholesale");
          console.log('Access to /settings/wholesaler:', hasAccess, 'User groups:', userGroups);
          return hasAccess;
        }
        if (pathname.startsWith("/brokers")) {
          return userGroups.includes("admin");
        }
        if (pathname.startsWith("/policyholders")) {
          return userGroups.includes("admin") || userGroups.includes("broker");
        }
        if (pathname.startsWith("/proposals")) {
          return userGroups.includes("admin") || userGroups.includes("broker");
        }
        if (pathname.startsWith("/offers")) {
          return userGroups.includes("admin") || userGroups.includes("broker");
        }

        // default: any authenticated user
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    // don't run on API or static assets
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};