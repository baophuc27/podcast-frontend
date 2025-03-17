import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

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

// Function to write users to text file
function writeUsers(users: Map<string, string>): boolean {
  try {
    // Ensure the auth directory exists
    const authDir = path.join(process.cwd(), 'auth');
    if (!fs.existsSync(authDir)) {
      fs.mkdirSync(authDir, { recursive: true });
    }
    
    // Convert users map to string format
    let fileContent = '';
    for (const [username, password] of users.entries()) {
      fileContent += `${username}:${password}\n`;
    }
    
    // Write to file
    fs.writeFileSync(USERS_FILE_PATH, fileContent);
    return true;
  } catch (error) {
    console.error('Error writing users file:', error);
    return false;
  }
}

// GET endpoint to retrieve all users (without passwords)
export async function GET(request: NextRequest) {
  try {
    // Check for admin authorization (could be enhanced)
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Read users
    const users = readUsers();
    const userList = Array.from(users.keys()).map(username => ({ username }));
    
    return NextResponse.json({ users: userList });
  } catch (error) {
    console.error('Error getting users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST endpoint to add a new user
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
    
    // Read existing users
    const users = readUsers();
    
    // Check if user already exists
    if (users.has(username)) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 409 }
      );
    }
    
    // Add new user
    users.set(username, password);
    
    // Save updated users
    if (writeUsers(users)) {
      return NextResponse.json({
        success: true,
        message: 'User created successfully'
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE endpoint to remove a user
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const username = url.searchParams.get('username');
    
    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }
    
    // Read existing users
    const users = readUsers();
    
    // Check if user exists
    if (!users.has(username)) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Don't allow deleting the last admin account
    if (username === 'admin' && users.size === 1) {
      return NextResponse.json(
        { error: 'Cannot delete the only admin account' },
        { status: 403 }
      );
    }
    
    // Remove user
    users.delete(username);
    
    // Save updated users
    if (writeUsers(users)) {
      return NextResponse.json({
        success: true,
        message: 'User deleted successfully'
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to delete user' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}