'use client';

import { PodcastData } from '@/types/podcast';
import UtteranceCard from './UtteranceCard';
import { generateScriptContent, createDownloadLink } from '@/lib/utils/podcast';

interface PodcastScriptProps {
  podcastData: PodcastData[];
  audioFiles?: { [key: string]: string[] };
  onUpdate: (index: number, newContent: string) => void;
  onGenerateFinal: () => void;
  loading: boolean;
}

export default function PodcastScript({
  podcastData,
  audioFiles,
  onUpdate,
  onGenerateFinal,
  loading
}: PodcastScriptProps) {
  const handleDownloadScript = () => {
    const scriptContent = generateScriptContent(podcastData);
    createDownloadLink(scriptContent, 'podcast-script.txt');
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-100 dark:border-gray-700 p-6 transition-all animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Podcast Script
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onGenerateFinal}
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-md"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                Generate Final Audio
              </>
            )}
          </button>
          
          <button
            onClick={handleDownloadScript}
            className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Script
          </button>
        </div>
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg mb-6 border border-gray-200 dark:border-gray-600">
        <div className="flex items-start gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Click on any speaker's text to edit the content. When you're satisfied with all utterances, click "Generate Final Audio" to create the complete podcast.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Total utterances: <span className="font-medium">{podcastData.length}</span>
            </p>
          </div>
        </div>
      </div>
      
      <div className="space-y-4 mb-6">
        {podcastData.map((item, idx) => (
          <UtteranceCard
            key={idx}
            item={item}
            index={idx}
            audioUrl={audioFiles?.[`utterance_${idx}`]?.[0]}
            onUpdate={onUpdate}
          />
        ))}
      </div>
    </div>
  );
}