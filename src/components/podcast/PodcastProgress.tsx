'use client';

interface PodcastProgressProps {
  progress: number;
  message?: string;
}

export default function PodcastProgress({ 
  progress, 
  message = "Your podcast is being generated. This may take a few minutes." 
}: PodcastProgressProps) {
  return (
    <div className="mt-8 mb-12 bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-100 dark:border-gray-700 p-6 transition-all animate-fade-in">
      <div className="flex items-start gap-4 mb-6">
        <div className="bg-blue-100 dark:bg-blue-900/50 rounded-full p-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-1">Generating Podcast</h3>
          <p className="text-gray-600 dark:text-gray-300">{message}</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
          <span>Processing content</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-300 ease-out" 
            style={{width: `${progress}%`}}
          ></div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        {progress >= 30 && (
          <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-100 dark:border-gray-600">
            <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xs text-center text-gray-700 dark:text-gray-300">Content Analyzed</span>
          </div>
        )}
        
        {progress >= 60 && (
          <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-100 dark:border-gray-600">
            <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-xs text-center text-gray-700 dark:text-gray-300">Script Generated</span>
          </div>
        )}
        
        {progress >= 90 && (
          <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-100 dark:border-gray-600">
            <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.465a5 5 0 001.897-7.72m-3.95 10.5a9 9 0 0111.556-1.226L9.516 23.362l-4.983-4.983z" />
              </svg>
            </div>
            <span className="text-xs text-center text-gray-700 dark:text-gray-300">Audio Processing</span>
          </div>
        )}
      </div>
    </div>
  );
}