// src/app/api/podcast/generate-batch-audio/route.ts
import { NextRequest } from 'next/server';
import { PodcastData } from '@/types/podcast';
import * as fs from 'fs';
import * as path from 'path';
import { splitLongUtterance } from '@/lib/utils/podcast';
import { HttpsProxyAgent } from 'https-proxy-agent';

type GenerateBatchAudioPayload = {
  podcast_data: PodcastData[];
  podcast_dir: string;
};

// Function to process text using TTS API - Updated to use speed parameter
async function processTTS(text: string, speakerId: number, outputFilename: string, speed: number = 1.0): Promise<[boolean, string | null]> {
  const url = 'https://kiki-tts-engine.tts.zalo.ai/generate_audio';
  
  // Check for proxy environment variables
  const proxyUrl = process.env.HTTPS_PROXY || process.env.HTTP_PROXY;
  
  // Create fetch options
  const fetchOptions: any = {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: text,
      speed: Math.max(0.5, Math.min(1.5, speed)),
      speaker_id: speakerId,
      encode_type: 0
    })
  };
  
  // Add proxy agent if proxy URL exists
  if (proxyUrl) {
    console.log(`Using proxy: ${proxyUrl}`);
    fetchOptions.agent = new HttpsProxyAgent(proxyUrl);
  }
  
  try {
    // Make request to TTS API
    const response = await fetch(url, fetchOptions);
    
    if (!response.ok) {
      return [false, `API responded with status: ${response.status}`];
    }
    
    const result = await response.json();
    
    if (result.error_code === 0) {
      // Download the WAV file
      const wavUrl = result.url;
      if (wavUrl) {
        const wavFetchOptions: any = {};
        
        // Add proxy agent if proxy URL exists
        if (proxyUrl) {
          wavFetchOptions.agent = new HttpsProxyAgent(proxyUrl);
        }
        
        const wavResponse = await fetch(wavUrl, wavFetchOptions);
        
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

// Process a single utterance - Updated to use speaker profile's speed
async function processUtterance(podcastData: PodcastData[], idx: number, podcastDir: string): Promise<string[]> {
  if (!podcastData || idx >= podcastData.length) {
    return [];
  }
  
  // Get the item to process
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
      `${speaker.toLowerCase().replace(' ', '_')}_${idx}_${chunkIdx}_${Date.now()}.wav`
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
    const body: GenerateBatchAudioPayload = await request.json();
    
    console.log("Generate batch audio API route called for utterances:", body.podcast_data.length);
    console.log("Using podcast dir:", body.podcast_dir);
    
    // Ensure the podcast directory exists
    const podcastDir = path.join(process.cwd(), body.podcast_dir);
    if (!fs.existsSync(podcastDir)) {
      console.log(`Creating podcast directory: ${podcastDir}`);
      fs.mkdirSync(podcastDir, { recursive: true });
    }
    
    // Process each utterance
    const result: { [key: string]: string[] } = {};
    const individualFiles: { [key: string]: string[] } = {};
    
    for (let i = 0; i < body.podcast_data.length; i++) {
      const utterance = body.podcast_data[i];
      
      // Process this utterance
      const audioFiles = await processUtterance(
        body.podcast_data,
        i,
        podcastDir
      );
      
      if (audioFiles.length > 0) {
        // Convert absolute paths to relative paths for the frontend
        const relativePaths = audioFiles.map(file => {
          return file.replace(process.cwd(), '').replace(/\\/g, '/');
        });
        
        // Store in both formats
        result[`utterance_${i}`] = relativePaths;
        individualFiles[`${utterance.speaker}_${i}`] = relativePaths;
      }
    }
    
    return Response.json({
      status_code: 0,
      audio_files: result,
      individual_files: individualFiles,
      podcast_dir: body.podcast_dir
    });
    
  } catch (error) {
    console.error('Error in generate batch audio API route:', error);
    return Response.json(
      { 
        status_code: -1,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        audio_files: {},
        individual_files: {}
      },
      { status: 500 }
    );
  }
}