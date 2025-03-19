import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';
import { cookies } from 'next/headers';

// Define the tokens file path
const TOKENS_FILE_PATH = path.join(process.cwd(), 'auth', 'tokens.txt');

// Function to read tokens from text file
function readTokens(): string[] {
  const tokens = new Set<string>();
  
  try {
    // Ensure the auth directory exists
    const authDir = path.join(process.cwd(), 'auth');
    if (!fs.existsSync(authDir)) {
      fs.mkdirSync(authDir, { recursive: true });
    }
    
    // Create file with default token if it doesn't exist
    if (!fs.existsSync(TOKENS_FILE_PATH)) {
      fs.writeFileSync(TOKENS_FILE_PATH, 'admin-token-123\n');
    }
    
    // Read the file content
    const fileContent = fs.readFileSync(TOKENS_FILE_PATH, 'utf-8');
    
    // Parse each line as a token
    const lines = fileContent.split('\n');
    for (const line of lines) {
      if (line.trim() === '') continue;
      tokens.add(line.trim());
    }
  } catch (error) {
    console.error('Error reading tokens file:', error);
  }
  
  return Array.from(tokens);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }
    
    // Read tokens from file
    const validTokens = readTokens();
    
    // Check if token is valid
    if (!validTokens.includes(token)) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
    
    // Set authentication cookie
    const cookieStore = await cookies();
    cookieStore.set('auth_token', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Authentication successful'
    });
    
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}