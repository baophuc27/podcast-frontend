'use client';

import { useState } from 'react';
import { PodcastData, APIResponse } from '@/types/podcast';
import PodcastForm, { PodcastFormData } from '@/components/podcast/PodcastForm';
import PodcastProgress from '@/components/podcast/PodcastProgress';
import PodcastScript from '@/components/podcast/PodcastScript';
import PodcastFinal from '@/components/podcast/PodcastFinal';
import ErrorAlert from '@/components/ui/ErrorAlert';

export default function PodcastGenerator() {
  const [loading, setLoading] = useState<boolean>(false);
  const [apiResponse, setApiResponse] = useState<APIResponse | null>(null);
  const [audioProgress, setAudioProgress] = useState<number>(0);
  const [editedPodcastData, setEditedPodcastData] = useState<PodcastData[]>([]);
  const [generatedFinal, setGeneratedFinal] = useState<boolean>(false);
  const [finalAudioUrl, setFinalAudioUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Helper function to convert duration string to number
  const getDurationInMinutes = (durationString: string): number => {
    switch (durationString) {
      case 'Short': return 2;  // 1-3 minutes
      case 'Long': return 7;   // 8-10 minutes
      default: return 4;       // Medium (4-7 minutes)
    }
  };

  const handleFormSubmit = async (formData: PodcastFormData) => {
    setLoading(true);
    setApiResponse(null);
    setAudioProgress(0);
    setEditedPodcastData([]);
    setGeneratedFinal(false);
    setFinalAudioUrl('');
    setError(null);

    const payload = {
      input_urls: formData.urlList,
      guidelines: formData.guidelines,
      duration: getDurationInMinutes(formData.duration),
      speaker_ids: formData.speakerIds,
      podcast_type: formData.podcastType,
      max_revisions: formData.maxRevisions,
      speaker_profiles: formData.speakerProfiles
    };

    try {
      // Make API call to your backend
      const response = await fetch('/api/podcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const responseData: APIResponse = await response.json();

      // If successful
      if (responseData.status_code === 0) {
        // Simulate audio generation progress
        let progress = 0;
        const interval = setInterval(() => {
          progress += 5;
          setAudioProgress(progress);
          if (progress >= 100) {
            clearInterval(interval);
          }
        }, 300);

        setTimeout(() => {
          clearInterval(interval);
          setAudioProgress(100);
          setApiResponse(responseData);
          setEditedPodcastData(responseData.data);
          setLoading(false);
        }, 6000);
      } else {
        setApiResponse(responseData);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error generating podcast:', error);
      setError('Failed to connect to the podcast generation service. Please check if the backend service is running.');
      setApiResponse({
        status_code: -1,
        data: [],
        error: 'Failed to generate podcast. Please try again.'
      });
      setLoading(false);
    }
  };

  const updateContent = (idx: number, newContent: string) => {
    const updatedData = [...editedPodcastData];
    updatedData[idx].content = newContent;
    setEditedPodcastData(updatedData);
  };

  const regenerateFullPodcast = async () => {
    setLoading(true);
    setAudioProgress(0);
    
    try {
      // In a real implementation, you would use the API client
      // const result = await generateFullPodcastAudio(editedPodcastData);
      // if (result.success && result.audioUrl) {
      //    setFinalAudioUrl(result.audioUrl);
      // }
      
      // For demo purposes, simulate progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 5;
        setAudioProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
        }
      }, 150);

      setTimeout(() => {
        clearInterval(interval);
        setAudioProgress(100);
        setGeneratedFinal(true);
        setFinalAudioUrl('https://example.com/sample-podcast.mp3'); // Placeholder URL
        setLoading(false);
      }, 3000);
    } catch (error) {
      console.error('Error generating final podcast:', error);
      setError('Failed to generate final podcast audio.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 pt-12">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2 flex items-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="32" 
            height="32" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="mr-3 text-blue-600"
          >
            <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
            <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
            <line x1="6" y1="1" x2="6" y2="4"></line>
            <line x1="10" y1="1" x2="10" y2="4"></line>
            <line x1="14" y1="1" x2="14" y2="4"></line>
          </svg>
          Podcast Generator
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg max-w-3xl">
          Transform your content into engaging audio conversations. Simply provide URLs to your articles, choose voice styles, and customize your podcast settings.
        </p>
      </div>
      
      {error && (
        <ErrorAlert message={error} />
      )}
      
      <PodcastForm 
        onSubmit={handleFormSubmit}
        loading={loading}
      />

      {loading && (
        <PodcastProgress progress={audioProgress} />
      )}

      {apiResponse && (
        <div className="mt-8 space-y-8">
          {apiResponse.status_code === 0 ? (
            <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg border border-green-200 dark:border-green-800 flex items-center gap-3">
              <div className="bg-green-100 dark:bg-green-800 rounded-full p-1">
                <svg className="h-5 w-5 text-green-600 dark:text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-green-700 dark:text-green-300 font-medium">Podcast generated successfully!</p>
            </div>
          ) : (
            <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800 flex items-center gap-3">
              <div className="bg-yellow-100 dark:bg-yellow-800 rounded-full p-1">
                <svg className="h-5 w-5 text-yellow-600 dark:text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-yellow-700 dark:text-yellow-300 font-medium">Status Code: {apiResponse.status_code}</p>
                {apiResponse.error && <p className="text-red-600 dark:text-red-400 mt-1">{apiResponse.error}</p>}
              </div>
            </div>
          )}

          {editedPodcastData.length > 0 && (
            <>
              <PodcastScript 
                podcastData={editedPodcastData}
                audioFiles={apiResponse.audio_files}
                onUpdate={updateContent}
                onGenerateFinal={regenerateFullPodcast}
                loading={loading}
              />
              
              {generatedFinal && (
                <PodcastFinal audioUrl={finalAudioUrl} />
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}