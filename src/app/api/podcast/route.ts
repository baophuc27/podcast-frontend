import { NextRequest, NextResponse } from 'next/server';
import { PodcastGenerationPayload } from '@/types/podcast';

export async function POST(request: NextRequest) {
  try {
    const body: PodcastGenerationPayload = await request.json();
    
    // Forward request to your Python backend
    const response = await fetch('http://localhost:8172/generate_podcast_from_urls', {
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
    console.error('Error in podcast generation API route:', error);
    return NextResponse.json(
      { 
        status_code: -1, 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        data: []
      },
      { status: 500 }
    );
  }
}