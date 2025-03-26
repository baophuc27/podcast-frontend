// src/app/api/podcast/route.ts
import { NextRequest } from 'next/server';
import { PodcastGenerationPayload } from '@/types/podcast';
import { callBackendService } from '@/lib/api/backend';

export async function POST(request: NextRequest) {
  try {
    const body: PodcastGenerationPayload = await request.json();

    // Use the centralized backend service caller with the script generation endpoint
    // This uses the main backend host (localhost:8172)
    return callBackendService({
      endpoint: 'generate_podcast_from_urls',
      payload: body,
      timeout: 300000, // 5 minute timeout for the main podcast generation
      host: 'http://10.30.78.37:8172' // Explicitly using the main backend host
    });

  } catch (error) {
    console.error('Error in podcast generation API route:', error);
    return Response.json(
      {
        status_code: -1,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        data: []
      },
      { status: 500 }
    );
  }
}