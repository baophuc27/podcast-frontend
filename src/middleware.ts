// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Get auth token
  const authToken = request.cookies.get('auth_token')?.value;
  
  // Only protect /podcast path
  if (path.startsWith('/podcast') && !authToken) {
    // Simply redirect to login page
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/podcast/:path*'],
};