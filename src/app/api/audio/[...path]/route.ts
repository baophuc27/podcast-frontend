import { NextRequest } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

/**
 * API route to serve audio files from the server filesystem
 * This allows audio files generated by the backend to be accessed by the frontend
 */

export async function GET(
  request: NextRequest,
  // @ts-ignore - Suppress type error for Next.js route params
  { params }: { params: { path: string[] } }
): Promise<Response> {
  try {
    // Get the file path from the URL parameters
    const filePath = params.path.join('/');
    console.log('Requested audio file path:', filePath);

    // Construct the full path to the audio file
    // Adjust this base path to match where your audio files are stored
    let fullPath = path.join(process.cwd(), 'podcast_audio', filePath);

    // Log the constructed path for debugging
    console.log('Constructed full path:', fullPath);

    // Check if the file exists at the primary location
    if (!fs.existsSync(fullPath)) {
      console.log('Audio file not found at primary location, checking alternative paths...');

      // Try to find in alternative podcast_audio subdirectories
      // This handles cases where the backend might have created directories with unique names
      const podcastDir = path.join(process.cwd(), 'podcast_audio');

      if (fs.existsSync(podcastDir) && fs.statSync(podcastDir).isDirectory()) {
        // Get all subdirectories
        const subdirs = fs.readdirSync(podcastDir)
          .filter(item => fs.statSync(path.join(podcastDir, item)).isDirectory());

        // Look for the file in each subdirectory
        for (const subdir of subdirs) {
          const altPath = path.join(podcastDir, subdir, filePath);
          if (fs.existsSync(altPath)) {
            console.log('Found file in alternative path:', altPath);
            fullPath = altPath;
            break;
          }
        }
      }

      // Final check if file still not found
      if (!fs.existsSync(fullPath)) {
        console.error('Audio file not found at any location:', filePath);
        return new Response('Audio file not found', { status: 404 });
      }
    }

    console.log('Reading audio file:', fullPath);

    // Make sure the file exists and is accessible
    try {
      fs.accessSync(fullPath, fs.constants.R_OK);
    } catch (err) {
      console.error('File exists but cannot be read:', fullPath, err);
      return new Response('Audio file cannot be accessed', { status: 403 });
    }

    // Read the file
    const fileBuffer = fs.readFileSync(fullPath);

    // Determine content type based on file extension
    let contentType = 'audio/wav';
    if (fullPath.toLowerCase().endsWith('.mp3')) {
      contentType = 'audio/mpeg';
    } else if (fullPath.toLowerCase().endsWith('.ogg')) {
      contentType = 'audio/ogg';
    } else if (fullPath.toLowerCase().endsWith('.m4a')) {
      contentType = 'audio/mp4';
    }

    // Return the file with appropriate headers
    return new Response(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Length': fileBuffer.length.toString(),
        'Cache-Control': 'public, max-age=3600',
        'Accept-Ranges': 'bytes',
      },
    });
  } catch (error) {
    console.error('Error serving audio file:', error);
    return new Response(`Error serving audio file: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 });
  }
}

// Add proper route segment config
export const dynamic = 'force-dynamic';