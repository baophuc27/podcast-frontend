// src/app/api/podcast/generate-full/route.ts
import { NextRequest } from 'next/server';
import { PodcastData } from '@/types/podcast';
import { callBackendService } from '@/lib/api/backend';
import * as fs from 'fs';
import * as path from 'path';

type GenerateFullPayload = {
  podcast_data: PodcastData[];
  podcast_dir?: string;
};

export async function POST(request: NextRequest) {
  try {
    const body: GenerateFullPayload = await request.json();
    
    console.log("Generate full podcast API route called with:", 
      Array.isArray(body) ? body.length : body.podcast_data.length, "utterances");
    
    // Handle different payload formats - either an array of podcast data or an object with podcast_data
    let podcastData: PodcastData[];
    let podcastDir: string | undefined;
    
    if (Array.isArray(body)) {
      // Legacy format - just an array of podcast data
      podcastData = body;
    } else {
      // New format - object with podcast_data and optional podcast_dir
      podcastData = body.podcast_data;
      podcastDir = body.podcast_dir;
    }
    
    if (podcastDir) {
      console.log("Using provided podcast directory:", podcastDir);
      
      // Ensure the podcast directory exists (create it if it doesn't)
      const fullPodcastDir = path.join(process.cwd(), podcastDir);
      if (!fs.existsSync(fullPodcastDir)) {
        console.log(`Creating podcast directory: ${fullPodcastDir}`);
        fs.mkdirSync(fullPodcastDir, { recursive: true });
      }
    }
    
    // Prepare the payload for the backend service
    const payload = podcastDir 
      ? { podcast_data: podcastData, podcast_dir: podcastDir }
      : podcastData;
    
    // For full podcast generation, we call the dedicated gen-audio service
    // directly on the specific host
    return callBackendService({
      endpoint: 'gen-audio',  // This endpoint matches your Python code
      payload: payload,
      timeout: 120000, // 2 minute timeout for full audio generation
      host: 'http://10.30.78.48:8282' // Explicitly using the full podcast gen host
    });
    
  } catch (error) {
    console.error('Error in generate full podcast API route:', error);
    return Response.json(
      { 
        status_code: -1,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        data: null
      },
      { status: 500 }
    );
  }
}