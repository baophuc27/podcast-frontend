// This file contains functions for interacting with the podcast generation API

import { PodcastData, APIResponse, SpeakerProfile } from '@/types/podcast';

/**
 * Generate a podcast from a list of URLs
 */
export async function generatePodcastFromUrls(
  inputUrls: string[],
  guidelines: string,
  duration: number,
  speakerIds: number[],
  podcastType: string,
  maxRevisions: number,
  speakerProfiles: SpeakerProfile[]
): Promise<APIResponse> {
  try {
    const payload = {
      input_urls: inputUrls,
      guidelines,
      duration,
      speaker_ids: speakerIds,
      podcast_type: podcastType,
      max_revisions: maxRevisions,
      speaker_profiles: speakerProfiles
    };

    const response = await fetch('http://localhost:8172/generate_podcast_from_urls', {
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
 * Generate audio for a single utterance
 */
export async function regenerateUtteranceAudio(
  podcastData: PodcastData[], 
  idx: number, 
  podcastDir: string
): Promise<string[]> {
  try {
    const response = await fetch('http://localhost:8172/regenerate_utterance', {
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
    const response = await fetch('http://localhost:8172/gen_audio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(podcastData)
    });

    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.error === 0) {
      return { success: true, audioUrl: data.data };
    } else {
      return { 
        success: false, 
        error: data.message || 'Failed to generate full podcast audio' 
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