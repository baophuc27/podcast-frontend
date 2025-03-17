// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Keep track of redirects to prevent loops
const redirectTracker = new Map<string, number>();

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const ip = request.ip || 'unknown';
  const requestId = `${ip}-${path}`;
  
  // Count redirects for this specific request path
  const redirectCount = redirectTracker.get(requestId) || 0;
  
  // Get auth token
  const authToken = request.cookies.get('auth_token')?.value;
  
  console.log(`Path: ${path}, Auth: ${!!authToken}, Redirects: ${redirectCount}`);
  
  // Only protect /podcast path and limit redirects to prevent loops
  if (path.startsWith('/podcast') && !authToken && redirectCount < 1) {
    // Increment redirect count
    redirectTracker.set(requestId, redirectCount + 1);
    
    // After 10 seconds, reset the count (cleanup)
    setTimeout(() => {
      redirectTracker.delete(requestId);
    }, 10000);
    
    console.log(`Redirecting to login, count: ${redirectCount + 1}`);
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // Reset redirect count if it exists
  if (redirectTracker.has(requestId)) {
    redirectTracker.delete(requestId);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/podcast/:path*'],
};