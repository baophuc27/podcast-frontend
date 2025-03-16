/**
 * Client-side API functions for interacting with the podcast generation service
 */
import { PodcastData, APIResponse, SpeakerProfile, PodcastGenerationPayload } from '@/types/podcast';

/**
 * Generate a podcast from a list of URLs
 */
export async function generatePodcast(payload: PodcastGenerationPayload): Promise<APIResponse> {
  try {
    const response = await fetch('/api/podcast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }

    const data: APIResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error generating podcast:', error);
    return {
      status_code: -1,
      data: [],
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Regenerate audio for a single utterance
 */
export async function regenerateUtterance(
  podcastData: PodcastData[], 
  idx: number, 
  podcastDir: string
): Promise<string[]> {
  try {
    const response = await fetch('/api/podcast/regenerate-utterance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        podcast_data: podcastData,
        idx,
        podcast_dir: podcastDir
      })
    });

    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }

    const data = await response.json();
    return data.audio_files || [];
  } catch (error) {
    console.error('Error regenerating utterance audio:', error);
    return [];
  }
}

/**
 * Generate the final podcast audio
 */
export async function generateFullPodcastAudio(
  podcastData: PodcastData[]
): Promise<{ success: boolean; audioUrl?: string; error?: string }> {
  try {
    const response = await fetch('/api/podcast/generate-full', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(podcastData)
    });

    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.status_code === 0) {
      return { success: true, audioUrl: data.data };
    } else {
      return { 
        success: false, 
        error: data.error || 'Failed to generate full podcast audio' 
      };
    }
  } catch (error) {
    console.error('Error generating full podcast audio:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}