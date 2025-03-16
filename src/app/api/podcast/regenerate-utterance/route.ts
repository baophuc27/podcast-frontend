import { NextRequest } from 'next/server';
import { PodcastData } from '@/types/podcast';
import { callBackendService } from '@/lib/api/backend';

type RegenerateUtterancePayload = {
  podcast_data: PodcastData[];
  idx: number;
  podcast_dir: string;
};

export async function POST(request: NextRequest) {
  try {
    const body: RegenerateUtterancePayload = await request.json();
    
    // Use the centralized backend service caller
    return callBackendService({
      endpoint: 'regenerate_utterance',
      payload: body
    });
    
  } catch (error) {
    console.error('Error in regenerate utterance API route:', error);
    return Response.json(
      { 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        audio_files: []
      },
      { status: 500 }
    );
  }
}