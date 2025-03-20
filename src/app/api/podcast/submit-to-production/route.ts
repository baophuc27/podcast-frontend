// src/app/api/podcast/submit-to-production/route.ts
import { NextRequest } from 'next/server';
import { PodcastData } from '@/types/podcast';
import fetch from 'node-fetch';
import { HttpsProxyAgent } from 'https-proxy-agent';

type SubmitToProductionPayload = {
  podcastData: PodcastData[];
  category: string; // "sport" or "general"
  finalAudioUrl: string;
  publishDate: string; // In YYYY-MM-DD format
};

export async function POST(request: NextRequest) {
  try {
    const body: SubmitToProductionPayload = await request.json();
    
    console.log("Submit to production API route called with category:", body.category);
    console.log("Final audio URL:", body.finalAudioUrl);
    console.log("Publish date:", body.publishDate);
    
    // Use the provided publish date
    const date = body.publishDate;
    
    // Format the podcast data to match what the production API expects
    const formattedScript = body.podcastData.map(item => {
      // Extract speed from speakerProfile if available
      const speed = item.speakerProfile?.speed || 1.0;
      
      return {
        speaker: item.speaker,
        content: item.content,
        speed: speed
      };
    });
    
    // Prepare payload for the production API
    const apiPayload = {
      category: body.category,
      date: date,
      script: formattedScript
    };
    
    console.log("Submitting to production with payload:", JSON.stringify(apiPayload));
    
    // Get proxy configuration
    const proxyUrl = process.env.HTTPS_PROXY || process.env.HTTP_PROXY || 
                    process.env.https_proxy || process.env.http_proxy;
    
    // Prepare fetch options
    const fetchOptions: any = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(apiPayload)
    };
    
    // Add proxy agent if proxy URL exists
    if (proxyUrl) {
      console.log(`Using proxy for production API: ${proxyUrl}`);
      fetchOptions.agent = new HttpsProxyAgent(proxyUrl);
    }
    
    // Call the production API
    const response = await fetch('http://10.30.78.48:8282/gen-stream-with-date', fetchOptions);
    
    if (!response.ok) {
      const errorDetail = await response.text().catch(e => "Could not read response body");
      console.error(`Production API error: Status ${response.status}, Details: ${errorDetail}`);
      return Response.json(
        { success: false, error: `API responded with status: ${response.status}` },
        { status: response.status }
      );
    }
    
    const result = await response.json();
    console.log("Production API response:", result);
    
    return Response.json({
      success: true,
      data: result
    });
    
  } catch (error) {
    console.error('Error in submit to production API route:', error);
    return Response.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}