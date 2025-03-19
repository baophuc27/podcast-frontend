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
    // Get the raw request body
    const rawBody = await request.json();
    
    console.log("Generate full podcast API route called with raw body:", rawBody);
    
    // Log proxy settings for debugging
    console.log("Proxy environment variables:");
    console.log("HTTP_PROXY:", process.env.HTTP_PROXY || "Not set");
    console.log("HTTPS_PROXY:", process.env.HTTPS_PROXY || "Not set");
    console.log("NO_PROXY:", process.env.NO_PROXY || "Not set");
    
    // Handle different payload formats:
    // 1. Direct array format (coming from curl): [{"speaker":"MC1","content":"..."}]
    // 2. Object with podcast_data: { podcast_data: [...], podcast_dir: "..." }
    let podcastData: PodcastData[];
    let podcastDir: string | undefined;
    
    if (Array.isArray(rawBody)) {
      // Format 1: Direct array (from curl)
      console.log("Received direct array format");
      podcastData = rawBody;
    } else {
      // Format 2: Object with podcast_data property
      console.log("Received object format with podcast_data property");
      if (!rawBody.podcast_data || !Array.isArray(rawBody.podcast_data)) {
        throw new Error("Invalid podcast_data format");
      }
      podcastData = rawBody.podcast_data;
      podcastDir = rawBody.podcast_dir;
    }
    
    // Ensure podcastData is valid and properly formatted
    if (!podcastData || !Array.isArray(podcastData) || podcastData.length === 0) {
      console.error("Invalid podcast data format:", podcastData);
      return Response.json(
        { 
          status_code: -1,
          error: "Invalid podcast data format. Expected array of podcast utterances.",
          data: null
        },
        { status: 400 }
      );
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
    
    // IMPORTANT: Always send podcastData as a direct array to match the curl example
    // The backend API expects an array of podcast utterances: [{"speaker":"MC1","content":"..."}]
    const payload = podcastData;
    
    console.log("Sending payload to backend service:", 
      `Array with ${payload.length} items`);
    
    // For full podcast generation, we call the dedicated gen-audio service
    // directly on the specific host
    const backendResponse = await callBackendService({
      endpoint: 'gen-audio',  // This endpoint matches your Python code
      payload: payload,
      timeout: 120000, // 2 minute timeout for full audio generation
      host: 'http://10.30.78.48:8282', // Explicitly using the full podcast gen host
      useProxy: true // Add this flag to explicitly enable proxy support
    });
    
    // Return the response directly to maintain the correct structure
    // The response has format: {"error":0,"message":"Success","data":"https://stc-ki-ki.zdn.vn/podcast/..."}
    return backendResponse;
    
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