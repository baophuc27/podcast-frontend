import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';
import { cookies } from 'next/headers';

// Define the users file path
const USERS_FILE_PATH = path.join(process.cwd(), 'auth', 'users.txt');

// Function to read users from text file
function readUsers(): Map<string, string> {
  const users = new Map<string, string>();
  
  try {
    // Ensure the auth directory exists
    const authDir = path.join(process.cwd(), 'auth');
    if (!fs.existsSync(authDir)) {
      fs.mkdirSync(authDir, { recursive: true });
    }
    
    // Create file with default admin user if it doesn't exist
    if (!fs.existsSync(USERS_FILE_PATH)) {
      fs.writeFileSync(USERS_FILE_PATH, 'admin:password\n');
    }
    
    // Read the file content
    const fileContent = fs.readFileSync(USERS_FILE_PATH, 'utf-8');
    
    // Parse each line as username:password
    const lines = fileContent.split('\n');
    for (const line of lines) {
      if (line.trim() === '') continue;
      
      const [username, password] = line.split(':');
      if (username && password) {
        users.set(username.trim(), password.trim());
      }
    }
  } catch (error) {
    console.error('Error reading users file:', error);
  }
  
  return users;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;
    
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }
    
    // Read users from file
    const users = readUsers();
    const storedPassword = users.get(username);
    
    // Check if user exists and password matches
    if (!storedPassword || storedPassword !== password) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }
    
    // Set authentication cookie
    const cookieStore = cookies();
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