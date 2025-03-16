import { NextRequest } from 'next/server';
import { PodcastGenerationPayload } from '@/types/podcast';
import { callBackendService } from '@/lib/api/backend';

export async function POST(request: NextRequest) {
  try {
    const body: PodcastGenerationPayload = await request.json();
    
    // Use the centralized backend service caller with a longer timeout
    return callBackendService({
      endpoint: 'generate_podcast_from_urls',
      payload: body,
      timeout: 300000 // 5 minute timeout for the main podcast generation
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