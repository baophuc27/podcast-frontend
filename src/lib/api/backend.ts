import { NextResponse } from 'next/server';

// Define a proper type for the payload instead of using 'any'
type BackendPayload = Record<string, unknown>;

type BackendRequestOptions = {
  endpoint: string;
  payload: BackendPayload;
  timeout?: number;
  host?: string;
};

/**
 * Makes a request to the Python backend service
 */
export async function callBackendService({ endpoint, payload, timeout = 60000, host }: BackendRequestOptions): Promise<NextResponse> {
  try {
    // Use the provided host or default to the main backend
    const backend_url = host || 'http://localhost:8172';
    const url = `${backend_url}/${endpoint}`;

    console.log(`Attempting to connect to backend at: ${url}`);
    const response = await fetch(url, {
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
      (error instanceof Error && 'code' in error && (error as { code: number }).code === 23);

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