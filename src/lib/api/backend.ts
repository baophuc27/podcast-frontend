import { NextResponse } from 'next/server';
import fetch from 'node-fetch';
import { HttpsProxyAgent } from 'https-proxy-agent';

// Define proper types
type BackendPayload = Record<string, unknown>;

type BackendRequestOptions = {
  endpoint: string;
  payload: BackendPayload;
  timeout?: number;
  host?: string;
  useProxy?: boolean;
};

export async function callBackendService({ 
  endpoint, 
  payload, 
  timeout = 60000, 
  host,
  useProxy = true // Default to true to maintain backward compatibility
}: BackendRequestOptions): Promise<NextResponse> {
  try {
    // Use the provided host or default to the main backend
    const backend_url = host || 'http://localhost:8172';
    const url = `${backend_url}/${endpoint}`;
    
    // Check for proxy environment variables
    const proxyUrl = process.env.HTTPS_PROXY || process.env.HTTP_PROXY;
    
    // Create fetch options
    const fetchOptions: any = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };
    
    // Add timeout if specified
    if (timeout) {
      // Using setTimeout-based solution for broader compatibility
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      fetchOptions.signal = controller.signal;
      
      // Clean up the timeout when the request completes
      const cleanup = () => clearTimeout(timeoutId);
    }
    
    // Add proxy agent if proxy URL exists and useProxy is true
    if (useProxy && proxyUrl) {
      console.log(`Using proxy for backend call: ${proxyUrl}`);
      fetchOptions.agent = new HttpsProxyAgent(proxyUrl);
    }

    console.log(`Attempting to connect to backend at: ${url}`);
    const response = await fetch(url, fetchOptions);
    
    console.log("Backend response status:", response.status);

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Successfully received data from backend");

    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error in ${endpoint} API route:`, error);

    // Check if it's a timeout error
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const isTimeout = errorMessage.includes('timeout') ||
      (error instanceof Error && 'code' in error && (error as any).code === 23);

    if (isTimeout) {
      return NextResponse.json(
        {
          status_code: -1,
          error: 'Connection to the backend service timed out. The server might be busy or not responding.'
        },
        { status: 503 } // Service Unavailable
      );
    }

    return NextResponse.json(
      {
        status_code: -1,
        error: errorMessage
      },
      { status: 500 }
    );
  }
}