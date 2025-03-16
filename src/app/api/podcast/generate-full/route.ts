// src/app/api/podcast/generate-full/route.ts
import { NextRequest } from 'next/server';
import { PodcastData } from '@/types/podcast';
import { callBackendService } from '@/lib/api/backend';

export async function POST(request: NextRequest) {
  try {
    const body: PodcastData[] = await request.json();
    
    console.log("Generate full podcast API route called with:", body.length, "utterances");
    
    // For full podcast generation, we call the dedicated gen-audio service
    // directly on the specific host
    return callBackendService({
      endpoint: 'gen-audio',  // This endpoint matches your Python code
      payload: body,
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