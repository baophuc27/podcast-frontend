import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath = path === '/' || 
                       path.startsWith('/api/auth') || 
                       path.includes('_next') || 
                       path.includes('.png') ||
                       path.includes('.ico') ||
                       path.includes('.svg');

  // Get the authentication token from the cookies
  const isAuthenticated = request.cookies.get('auth_token')?.value;

  // Redirect logic for protected routes
  if (!isPublicPath && !isAuthenticated) {
    // Redirect to login page if trying to access protected route without auth
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api/auth routes (for login/logout)
     * 2. /_next routes (for static files)
     * 3. /_vercel routes (for static files)
     * 4. All static files (favicon, images, etc)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};