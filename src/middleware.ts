// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware will run for all protected routes
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Get auth token
  const authToken = request.cookies.get('auth_token')?.value;
  
  console.log(`Path: ${path}, Auth: ${!!authToken}`);
  
  // Only protect /podcast path
  if (path.startsWith('/podcast') && !authToken) {
    // Create the redirect URL with the original URL as a parameter
    // This allows us to redirect back after login
    const redirectUrl = new URL('/', request.url);
    redirectUrl.searchParams.set('redirected', 'true');
    redirectUrl.searchParams.set('from', path);
    
    console.log(`Redirecting to login from ${path}`);
    return NextResponse.redirect(redirectUrl);
  }
  
  return NextResponse.next();
}

// Update the matcher to include any paths that require authentication
export const config = {
  matcher: ['/podcast/:path*'],
};