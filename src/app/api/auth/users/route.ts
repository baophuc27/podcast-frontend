import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

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

// Function to write tokens to text file
function writeTokens(tokens: string[]): boolean {
  try {
    // Ensure the auth directory exists
    const authDir = path.join(process.cwd(), 'auth');
    if (!fs.existsSync(authDir)) {
      fs.mkdirSync(authDir, { recursive: true });
    }
    
    // Convert tokens array to string format
    const fileContent = tokens.join('\n') + '\n';
    
    // Write to file
    fs.writeFileSync(TOKENS_FILE_PATH, fileContent);
    return true;
  } catch (error) {
    console.error('Error writing tokens file:', error);
    return false;
  }
}

// GET endpoint to retrieve all tokens (admin only)
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
    
    // Read tokens
    const tokens = readTokens();
    
    return NextResponse.json({ tokens });
  } catch (error) {
    console.error('Error getting tokens:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST endpoint to add a new token
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
    
    // Read existing tokens
    const tokens = readTokens();
    
    // Check if token already exists
    if (tokens.includes(token)) {
      return NextResponse.json(
        { error: 'Token already exists' },
        { status: 409 }
      );
    }
    
    // Add new token
    tokens.push(token);
    
    // Save updated tokens
    if (writeTokens(tokens)) {
      return NextResponse.json({
        success: true,
        message: 'Token created successfully'
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to create token' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error creating token:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE endpoint to remove a token
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const tokenToDelete = url.searchParams.get('token');
    
    if (!tokenToDelete) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }
    
    // Read existing tokens
    const tokens = readTokens();
    
    // Check if token exists
    if (!tokens.includes(tokenToDelete)) {
      return NextResponse.json(
        { error: 'Token not found' },
        { status: 404 }
      );
    }
    
    // Don't allow deleting the last token
    if (tokens.length === 1) {
      return NextResponse.json(
        { error: 'Cannot delete the only token' },
        { status: 403 }
      );
    }
    
    // Remove token
    const updatedTokens = tokens.filter(t => t !== tokenToDelete);
    
    // Save updated tokens
    if (writeTokens(updatedTokens)) {
      return NextResponse.json({
        success: true,
        message: 'Token deleted successfully'
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to delete token' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error deleting token:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}