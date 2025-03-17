import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    // Check if the auth token cookie exists - await cookies() as it's now async
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth_token');
    
    return NextResponse.json({
      isAuthenticated: !!authToken,
    });
  } catch (error) {
    console.error('Error checking authentication status:', error);
    return NextResponse.json(
      { error: 'Internal server error', isAuthenticated: false },
      { status: 500 }
    );
  }
}