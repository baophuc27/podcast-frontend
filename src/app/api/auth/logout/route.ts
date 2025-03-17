// src/app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    // The correct way to handle cookies in Next.js route handlers
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });
    
    // Set the cookie in the response directly
    response.cookies.set({
      name: 'auth_token',
      value: '',
      expires: new Date(0),
      path: '/'
    });
    
    return response;
  } catch (error) {
    console.error('Error during logout:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}