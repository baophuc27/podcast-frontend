// src/app/api/podcast/regenerate-utterance/route.ts
import { NextRequest } from 'next/server';
import { PodcastData } from '@/types/podcast';
import * as fs from 'fs';
import * as path from 'path';
import { HttpsProxyAgent } from 'https-proxy-agent';

type RegenerateUtterancePayload = {
  podcast_data: PodcastData[];
  idx: number;
  podcast_dir: string;
};
// Modified processTTS function to store CDN URLs
async function processTTS(text: string, speakerId: number, outputFilename: string, speed: number = 1.0): Promise<[boolean, string | null, string | null]> {
  const url = 'https://kiki-tts-engine.tts.zalo.ai/generate_audio';
  
  // Get proxy from environment
  const proxyUrl = process.env.HTTPS_PROXY || process.env.HTTP_PROXY || 
                  process.env.https_proxy || process.env.http_proxy;
  
  console.log(`=== PROXY CONFIGURATION ===`);
  console.log(`HTTP_PROXY: ${process.env.HTTP_PROXY || "Not set"}`);
  console.log(`HTTPS_PROXY: ${process.env.HTTPS_PROXY || "Not set"}`);
  console.log(`NO_PROXY: ${process.env.NO_PROXY || "Not set"}`);
  
  if (!proxyUrl) {
    console.log('⚠️ WARNING: No proxy URL found in environment variables. Continuing without proxy.');
  } else {
    console.log(`✅ Using proxy for TTS API: ${proxyUrl}`);
  }
  
  try {
    // Import node-fetch explicitly
    const fetch = (await import('node-fetch')).default;
    
    // Optional proxy agent - only create if proxyUrl exists
    let proxyAgent;
    if (proxyUrl) {
      const { HttpsProxyAgent } = await import('https-proxy-agent');
      proxyAgent = new HttpsProxyAgent(proxyUrl);
    }
    
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
    
    // Prepare fetch options
    const fetchOptions: any = {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    };
    
    // Only add proxy agent if it exists
    if (proxyAgent) {
      fetchOptions.agent = proxyAgent;
    }
    
    // Use node-fetch with optional proxy agent
    const response = await fetch(url, fetchOptions);
    
    console.log(`TTS API response status: ${response.status}`);
    
    if (!response.ok) {
      const errorDetail = await response.text().catch(e => "Could not read response body");
      console.error(`TTS API error: Status ${response.status}, Details: ${errorDetail}`);
      return [false, `API responded with status: ${response.status}, Details: ${errorDetail}`, null];
    }
    
    const result = await response.json();
    console.log(`TTS API response: ${JSON.stringify(result, null, 2)}`);
    
    if (result.error_code === 0) {
      // Download the WAV file
      const wavUrl = result.url;
      if (wavUrl) {
        console.log(`Downloading audio from: ${wavUrl}`);
        
        // Prepare download options - only use agent if proxy exists
        const downloadOptions: any = {};
        if (proxyAgent) {
          downloadOptions.agent = proxyAgent;
        }
        
        // Use the same fetch and optional proxy agent for downloading the audio
        const wavResponse = await fetch(wavUrl, downloadOptions);
        
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
          
          // Return success along with the CDN URL
          return [true, null, wavUrl];
        } else {
          const errorDetail = await wavResponse.text().catch(e => "Could not read response body");
          console.error(`Failed to download WAV file: ${wavResponse.status}, Details: ${errorDetail}`);
          return [false, `Failed to download WAV file: ${wavResponse.status}, Details: ${errorDetail}`, null];
        }
      } else {
        console.error("No URL found in the API response");
        return [false, "No URL found in the API response", null];
      }
    } else {
      console.error(`❌ TTS API call failed with error code: ${result.error_code}`);
      console.error(`Error details: ${JSON.stringify(result)}`);
      if (result.error_message) {
        console.error(`Error message: ${result.error_message}`);
      }
      return [false, `API call failed: Error code ${result.error_code}, ${result.error_message || 'No error message provided'}`, null];
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
    
    return [false, `Error processing TTS: ${error instanceof Error ? error.message : String(error)}`, null];
  }
}

// Function to regenerate audio for a single utterance - updated to return CDN URLs
async function regenerateSingleUtterance(podcastData: PodcastData[], idx: number, podcastDir: string): Promise<{ localFiles: string[], cdnUrl?: string }> {
  if (!podcastData || idx >= podcastData.length) {
    return { localFiles: [] };
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
  
  console.log(`Regenerating audio for speaker: ${speaker}, TTS speaker ID: ${ttsSpeakerId}, speed: ${speed}`);
  console.log(`Content length: ${content.length} characters`);
  
  // No longer splitting content into chunks - process the entire content at once
  const outputFile = path.join(
    podcastDir, 
    `${speaker.toLowerCase().replace(' ', '_')}_${idx}_edited_${Date.now()}.wav`
  );
  
  // Process TTS for the full content
  console.log(`Starting TTS processing for utterance index ${idx}`);
  console.log(`Output file: ${outputFile}`);
  
  const startTime = Date.now();
  const [success, error, cdnUrl] = await processTTS(content, ttsSpeakerId, outputFile, speed);
  const duration = Date.now() - startTime;
  
  if (success) {
    console.log(`✅ Successfully processed utterance in ${duration}ms`);
    
    // Get file size for debugging
    try {
      const stats = fs.statSync(outputFile);
      console.log(`Generated audio file size: ${(stats.size / 1024).toFixed(2)} KB`);
    } catch (err) {
      console.warn(`Could not get file stats: ${err instanceof Error ? err.message : String(err)}`);
    }
    
    return { localFiles: [outputFile], cdnUrl };
  } else {
    console.error(`❌ Failed to process utterance after ${duration}ms: ${error}`);
    console.error(`Utterance content (first 100 chars): ${content.substring(0, 100)}...`);
    return { localFiles: [] };
  }
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
    const { localFiles, cdnUrl } = await regenerateSingleUtterance(
      body.podcast_data,
      body.idx,
      podcastDir
    );
    
    console.log(`Generated ${localFiles.length} audio files`);
    
    // Return paths relative to the API route
    const relativePaths = localFiles.map(file => {
      // Convert absolute paths to relative paths for the frontend
      return file.replace(process.cwd(), '').replace(/\\/g, '/');
    });
    
    return Response.json({
      audio_files: relativePaths,
      cdn_url: cdnUrl // Include the CDN URL in the response
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