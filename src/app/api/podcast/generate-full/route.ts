import { NextRequest, NextResponse } from 'next/server';
import { PodcastData } from '@/types/podcast';

type RegenerateUtterancePayload = {
  podcast_data: PodcastData[];
  idx: number;
  podcast_dir: string;
};

export async function POST(request: NextRequest) {
  try {
    const body: RegenerateUtterancePayload = await request.json();
    
    // Forward request to your Python backend
    const response = await fetch('http://localhost:8172/regenerate_utterance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    
    // Return the response from your Python backend
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in regenerate utterance API route:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        audio_files: []
      },
      { status: 500 }
    );
  }
}