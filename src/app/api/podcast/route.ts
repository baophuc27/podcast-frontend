import { NextRequest, NextResponse } from 'next/server';
import { PodcastGenerationPayload } from '@/types/podcast';

export async function POST(request: NextRequest) {
    try {
        const body: PodcastGenerationPayload = await request.json();

        // Try to connect to your Python backend
        try {
            console.log("Attempting to connect to backend at: http://localhost:8172/generate_podcast_from_urls");

            // Forward request to your Python backend without timeout
            // Some backends might take longer to respond initially
            const response = await fetch('http://localhost:8172/generate_podcast_from_urls', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
                signal: AbortSignal.timeout(300000) // 30 second timeout
            });

            console.log("Backend response status:", response.status);

            if (!response.ok) {
                throw new Error(`Backend responded with status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Successfully received data from backend");

            // Return the response from your Python backend
            return NextResponse.json(data);
        } catch (connectionError) {
            // If connection to backend fails, return a specific error
            console.error('Failed to connect to backend server:', connectionError);

            // Check if it's a timeout error
            const errorMessage = connectionError instanceof Error
                ? connectionError.message
                : 'Unknown connection error';

            const isTimeout = errorMessage.includes('timeout') ||
                (connectionError instanceof Error && 'code' in connectionError && connectionError.code === 23);

            return NextResponse.json(
                {
                    status_code: -1,
                    error: isTimeout
                        ? 'Connection to the backend service timed out. The server might be busy or not responding.'
                        : 'Failed to connect to the podcast generation service. Please ensure the backend is running and accessible.',
                    data: []
                },
                { status: 503 } // Service Unavailable
            );
        }
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