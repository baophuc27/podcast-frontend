'use client';

interface ErrorAlertProps {
  message: string;
  onDemoMode?: () => void;
}

export default function ErrorAlert({ message, onDemoMode }: ErrorAlertProps) {
  return (
    <div className="mb-6 bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium">Connection Error</h3>
          <div className="mt-2 text-sm">
            <p>{message}</p>
          </div>
          {onDemoMode && (
            <div className="mt-4">
              <button
                onClick={onDemoMode}
                type="button"
                className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
              >
                Try Demo Mode (No backend required)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}