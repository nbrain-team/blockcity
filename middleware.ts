import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Redirect old /company routes to new /brand routes for consistency
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect /company/login to /brand/login (keeping old route working)
  if (pathname === '/company/login') {
    // Allow the route to work as-is (it now redirects to /brand/dashboard)
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/company/:path*',
    '/brand/:path*',
  ],
};

