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
  
  // Get proxy from environment
  const proxyUrl = process.env.HTTPS_PROXY || process.env.HTTP_PROXY || 
                  process.env.https_proxy || process.env.http_proxy;
  
  console.log(`=== PROXY CONFIGURATION ===`);
  console.log(`HTTP_PROXY: ${process.env.HTTP_PROXY || "Not set"}`);
  console.log(`HTTPS_PROXY: ${process.env.HTTPS_PROXY || "Not set"}`);
  console.log(`NO_PROXY: ${process.env.NO_PROXY || "Not set"}`);
  
  if (!proxyUrl) {
    console.warn('⚠️ WARNING: No proxy URL found in environment variables. TTS API call may fail.');
  } else {
    console.log(`✅ Using proxy for TTS API: ${proxyUrl}`);
  }
  
  try {
    // Import node-fetch explicitly to ensure it works with the proxy correctly
    const fetch = (await import('node-fetch')).default;
    const { HttpsProxyAgent } = await import('https-proxy-agent');
    
    // Create a properly configured HttpsProxyAgent
    const proxyAgent = new HttpsProxyAgent(proxyUrl);
    
    // Prepare the request payload
    const payload = {
      text: text,
      speed: Math.max(0.5, Math.min(1.5, speed)),
      speaker_id: speakerId,
      encode_type: 0
    };
    
    console.log(`Sending TTS request for speaker ${speakerId} with speed ${speed}`);
    console.log(`Request payload: ${JSON.stringify({
      text: text.substring(0, 100) + "..." + (text.length > 100 ? ` (${text.length} chars total)` : ""),
      speed: Math.max(0.5, Math.min(1.5, speed)),
      speaker_id: speakerId,
      encode_type: 0
    })}`);
    
    // Use node-fetch with explicit proxy agent
    const response = await fetch(url, {
      method: 'POST',
      agent: proxyAgent,
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    console.log(`TTS API response status: ${response.status}`);
    
    if (!response.ok) {
      const errorDetail = await response.text().catch(e => "Could not read response body");
      console.error(`TTS API error: Status ${response.status}, Details: ${errorDetail}`);
      return [false, `API responded with status: ${response.status}, Details: ${errorDetail}`];
    }
    
    const result = await response.json();
    console.log(`TTS API response: ${JSON.stringify(result, null, 2)}`);
    
    if (result.error_code === 0) {
      // Download the WAV file
      const wavUrl = result.url;
      if (wavUrl) {
        console.log(`Downloading audio from: ${wavUrl}`);
        
        // Use the same fetch and proxy agent for downloading the audio
        const wavResponse = await fetch(wavUrl, {
          agent: proxyAgent
        });
        
        if (wavResponse.ok) {
          // Ensure the directory exists
          const dir = path.dirname(outputFilename);
          fs.mkdirSync(dir, { recursive: true });
          
          // Get the audio file content
          const arrayBuffer = await wavResponse.arrayBuffer();
          const audioBuffer = Buffer.from(arrayBuffer);
          
          // Write the file
          fs.writeFileSync(outputFilename, audioBuffer);
          console.log(`✅ Audio saved to: ${outputFilename}`);
          
          // Get file size for debugging
          try {
            const stats = fs.statSync(outputFilename);
            console.log(`Generated audio file size: ${(stats.size / 1024).toFixed(2)} KB`);
          } catch (err) {
            console.warn(`Could not get file stats: ${err instanceof Error ? err.message : String(err)}`);
          }
          
          return [true, null];
        } else {
          const errorDetail = await wavResponse.text().catch(e => "Could not read response body");
          console.error(`Failed to download WAV file: ${wavResponse.status}, Details: ${errorDetail}`);
          return [false, `Failed to download WAV file: ${wavResponse.status}, Details: ${errorDetail}`];
        }
      } else {
        console.error("No URL found in the API response");
        return [false, "No URL found in the API response"];
      }
    } else {
      console.error(`❌ TTS API call failed with error code: ${result.error_code}`);
      console.error(`Error details: ${JSON.stringify(result)}`);
      if (result.error_message) {
        console.error(`Error message: ${result.error_message}`);
      }
      return [false, `API call failed: Error code ${result.error_code}, ${result.error_message || 'No error message provided'}`];
    }
  } catch (error) {
    console.error(`❌ Exception during TTS processing:`, error);
    
    // More detailed error information
    if (error instanceof Error) {
      console.error(`Error name: ${error.name}`);
      console.error(`Error message: ${error.message}`);
      console.error(`Error stack: ${error.stack}`);
      
      // Network errors often have a 'cause' property
      if ('cause' in error) {
        console.error(`Error cause:`, (error as any).cause);
      }
    }
    
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