// src/app/api/podcast/regenerate-utterance/route.ts
import { NextRequest } from 'next/server';
import { PodcastData } from '@/types/podcast';
import * as fs from 'fs';
import * as path from 'path';
import { splitLongUtterance } from '@/lib/utils/podcast';

type RegenerateUtterancePayload = {
  podcast_data: PodcastData[];
  idx: number;
  podcast_dir: string;
};

// Function to process text using TTS API
async function processTTS(text: string, speakerId: number, outputFilename: string, speed: number = 1.0): Promise<[boolean, string | null]> {
  const url = 'https://kiki-tts-engine.tts.zalo.ai/generate_audio';
  
  // Ensure speed is within valid range (0.5 to 1.5)
  const validSpeed = Math.max(0.5, Math.min(1.5, speed));
  
  // Log the speed value being used
  console.log(`Processing TTS with speed: ${validSpeed} for speaker ID: ${speakerId}`);
  
  const payload = {
    text: text,
    speed: validSpeed, // Use validated speed parameter
    speaker_id: speakerId,
    encode_type: 0
  };
  
  try {
    // Make request to TTS API
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      return [false, `API responded with status: ${response.status}`];
    }
    
    const result = await response.json();
    
    if (result.error_code === 0) {
      // Download the WAV file
      const wavUrl = result.url;
      if (wavUrl) {
        const wavResponse = await fetch(wavUrl);
        
        if (wavResponse.ok) {
          // Ensure the directory exists
          const dir = path.dirname(outputFilename);
          fs.mkdirSync(dir, { recursive: true });
          
          // Get the audio file content
          const audioBuffer = Buffer.from(await wavResponse.arrayBuffer());
          
          // Write the file
          fs.writeFileSync(outputFilename, audioBuffer);
          return [true, null];
        } else {
          return [false, `Failed to download WAV file: ${wavResponse.status}`];
        }
      } else {
        return [false, "No URL found in the API response"];
      }
    } else {
      return [false, `API call failed: ${JSON.stringify(result)}`];
    }
  } catch (error) {
    return [false, `Error processing TTS: ${error instanceof Error ? error.message : String(error)}`];
  }
}

// Function to regenerate audio for a single utterance
async function regenerateSingleUtterance(podcastData: PodcastData[], idx: number, podcastDir: string): Promise<string[]> {
  if (!podcastData || idx >= podcastData.length) {
    return [];
  }
  
  // Get the item to regenerate
  const item = podcastData[idx];
  const speaker = item.speaker;
  const content = item.content;
  
  // Determine speaker ID for TTS
  let ttsSpeakerId = 1; // Default to MC1/female
  let speed = 1.0; // Default speed
  
  if (speaker.includes("MC1")) {
    ttsSpeakerId = 1; // Female voice
    // Check if there's a speed property in speaker data
    if (item.speakerProfile && typeof item.speakerProfile.speed === 'number') {
      speed = item.speakerProfile.speed;
      console.log(`Using MC1 speaker speed from profile: ${speed}`);
    }
  } else if (speaker.includes("MC2")) {
    ttsSpeakerId = 2; // Male voice
    // Check if there's a speed property in speaker data
    if (item.speakerProfile && typeof item.speakerProfile.speed === 'number') {
      speed = item.speakerProfile.speed;
      console.log(`Using MC2 speaker speed from profile: ${speed}`);
    }
  }
  
  // Split long content into manageable chunks
  const chunks = splitLongUtterance(content);
  const chunkAudioFiles: string[] = [];
  
  // Process each chunk
  for (let chunkIdx = 0; chunkIdx < chunks.length; chunkIdx++) {
    const chunk = chunks[chunkIdx];
    
    // Use a unique filename to avoid overwriting existing files
    const outputFile = path.join(
      podcastDir, 
      `${speaker.toLowerCase().replace(' ', '_')}_${idx}_${chunkIdx}_edited_${Date.now()}.wav`
    );
    
    // Process TTS for this chunk with speed parameter
    const [success, error] = await processTTS(chunk, ttsSpeakerId, outputFile, speed);
    
    if (success) {
      chunkAudioFiles.push(outputFile);
    } else {
      console.error(`Failed to process chunk ${chunkIdx}: ${error}`);
    }
  }
  
  return chunkAudioFiles;
}

export async function POST(request: NextRequest) {
  try {
    const body: RegenerateUtterancePayload = await request.json();
    
    console.log("Regenerate utterance API route called for idx:", body.idx);
    console.log("Using podcast dir:", body.podcast_dir);
    
    // Ensure the podcast directory exists
    const podcastDir = path.join(process.cwd(), body.podcast_dir);
    if (!fs.existsSync(podcastDir)) {
      console.log(`Creating podcast directory: ${podcastDir}`);
      fs.mkdirSync(podcastDir, { recursive: true });
    }
    
    // Call the direct implementation to regenerate the utterance
    const audioFiles = await regenerateSingleUtterance(
      body.podcast_data,
      body.idx,
      podcastDir
    );
    
    console.log(`Generated ${audioFiles.length} audio files`);
    
    // Return paths relative to the API route
    const relativePaths = audioFiles.map(file => {
      // Convert absolute paths to relative paths for the frontend
      return file.replace(process.cwd(), '').replace(/\\/g, '/');
    });
    
    return Response.json({
      audio_files: relativePaths
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