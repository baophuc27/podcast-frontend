import { NextResponse } from 'next/server';

type BackendRequestOptions = {
  endpoint: string;
  payload: any;
  timeout?: number;
};

/**
 * Makes a request to the Python backend service
 */
export async function callBackendService<T>({ endpoint, payload, timeout = 60000 }: BackendRequestOptions): Promise<NextResponse> {
  try {
    console.log(`Attempting to connect to backend at: http://localhost:8172/${endpoint}`);
    
    const response = await fetch(`http://localhost:8172/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: timeout ? AbortSignal.timeout(timeout) : undefined
    });

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