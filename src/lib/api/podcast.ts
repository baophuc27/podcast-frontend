/**
 * Client-side API functions for interacting with the podcast generation service
 */
import { PodcastData, APIResponse, PodcastGenerationPayload } from '@/types/podcast';

/**
 * Generate a podcast from a list of URLs
 * This calls the backend which uses process_tts and generate_podcast_audio_parallel
 * Backend host: localhost:8172
 */
export async function generatePodcast(payload: PodcastGenerationPayload): Promise<APIResponse> {
  try {
    console.log("Generating podcast with payload:", payload);
    
    const response = await fetch('/api/podcast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }

    const data: APIResponse = await response.json();
    console.log("Podcast generation response:", data);
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
 * This uses the TTS API indirectly through the backend which calls:
 * 'https://kiki-tts-engine.tts.zalo.ai/generate_audio'
 */
export async function regenerateUtterance(
  podcastData: PodcastData[], 
  idx: number, 
  podcastDir: string
): Promise<string[]> {
  try {
    console.log(`Regenerating utterance ${idx} in directory ${podcastDir}`);
    
    // Create payload matching the Python function parameters
    const payload = {
      podcast_data: podcastData,
      idx,
      podcast_dir: podcastDir
    };
    
    console.log("Regeneration payload:", payload);
    
    const response = await fetch('/api/podcast/regenerate-utterance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Regenerated utterance response:", data);
    
    // The Python function returns an array of audio file paths
    if (data.audio_files && Array.isArray(data.audio_files)) {
      // Ensure all paths use forward slashes and are properly formatted
      const formattedPaths = data.audio_files.map(path => {
        // Convert backslashes to forward slashes (Windows paths)
        let formattedPath = path.replace(/\\/g, '/');
        
        // Ensure path starts with a slash if it doesn't 
        if (!formattedPath.startsWith('/') && !formattedPath.startsWith('http')) {
          formattedPath = '/' + formattedPath;
        }
        
        console.log("Formatted audio path:", formattedPath);
        return formattedPath;
      });
      
      return formattedPaths;
    } else {
      console.error("Unexpected response format:", data);
      return [];
    }
  } catch (error) {
    console.error('Error regenerating utterance audio:', error);
    return [];
  }
}

/**
 * Generate the final podcast audio
 * This calls the dedicated full podcast generation service at:
 * 'http://10.30.78.48:8282/gen-audio'
 */
export async function generateFullPodcastAudio(
  podcastData: PodcastData[],
  podcastDir?: string
): Promise<{ success: boolean; audioUrl?: string; error?: string }> {
  try {
    console.log("Generating full podcast audio with data:", podcastData.length, "utterances");
    if (podcastDir) {
      console.log("Using podcast directory:", podcastDir);
    }
    
    // Format the podcast data to match what the backend expects for the gen-audio endpoint
    const formattedData = podcastData.map(item => {
      // Format speaker as MC1 or MC2
      let formattedSpeaker = item.speaker;
      if (item.speaker.includes("MC1")) {
        formattedSpeaker = "MC1";
      } else if (item.speaker.includes("MC2")) {
        formattedSpeaker = "MC2";
      }
      
      return {
        speaker: formattedSpeaker,
        content: item.content
      };
    });
    
    // Create the payload, including podcast_dir if provided
    const payload = podcastDir ? 
      { podcast_data: formattedData, podcast_dir: podcastDir } : 
      formattedData;
    
    const response = await fetch('/api/podcast/generate-full', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Full podcast audio response:", data);
    
    // Handle the updated response format
    // The response now has format: {"error":0,"message":"Success","data":"https://stc-ki-ki.zdn.vn/podcast/..."}
    if (data.error === 0 || data.status_code === 0) {
      // Check if the data field is a string (directly containing the URL)
      if (typeof data.data === 'string' && data.data.startsWith('http')) {
        return { success: true, audioUrl: data.data };
      } 
      return { success: true, audioUrl: data.data };
    } else {
      return { 
        success: false, 
        error: data.message || data.error || 'Failed to generate full podcast audio' 
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

// Add this function to src/lib/api/podcast.ts
export async function generateBatchAudio(
  podcastData: PodcastData[],
  podcastDir: string
): Promise<{
  success: boolean;
  audioFiles?: { [key: string]: string[] };
  individualFiles?: { [key: string]: string[] };
  error?: string;
}> {
  try {
    console.log("Generating batch audio with data:", podcastData.length, "utterances");
    console.log("Using podcast directory:", podcastDir);
    
    const payload = {
      podcast_data: podcastData,
      podcast_dir: podcastDir
    };
    
    const response = await fetch('/api/podcast/generate-batch-audio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Batch audio generation response:", data);
    
    if (data.status_code === 0) {
      return { 
        success: true, 
        audioFiles: data.audio_files, 
        individualFiles: data.individual_files 
      };
    } else {
      return { 
        success: false, 
        error: data.error || 'Failed to generate batch audio' 
      };
    }
  } catch (error) {
    console.error('Error generating batch audio:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}