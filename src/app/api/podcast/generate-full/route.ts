import { NextRequest } from 'next/server';
import { PodcastData } from '@/types/podcast';
import { callBackendService } from '@/lib/api/backend';

export async function POST(request: NextRequest) {
  try {
    const body: PodcastData[] = await request.json();
    
    // Use the centralized backend service caller
    return callBackendService({
      endpoint: 'gen_audio',
      payload: body
    });
    
  } catch (error) {
    console.error('Error in generate full podcast API route:', error);
    return Response.json(
      { 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        data: null
      },
      { status: 500 }
    );
  }
}