// src/app/api/podcast/regenerate-utterance/route.ts
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
    
    console.log("Regenerate utterance API route called for idx:", body.idx);
    console.log("Using podcast dir:", body.podcast_dir);
    
    // For single utterance regeneration, we use the TTS API indirectly through the main backend
    // This calls a function that uses 'https://kiki-tts-engine.tts.zalo.ai/generate_audio'
    // But the request itself goes to the main backend which handles the TTS API call
    return callBackendService({
      endpoint: 'regenerate_utterance',
      payload: body,
      host: 'http://localhost:8172' // Explicitly using the main backend host
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