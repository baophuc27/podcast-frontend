'use client';

import { useState } from 'react';
import { PodcastData, APIResponse } from '@/types/podcast';
import PodcastForm, { PodcastFormData } from '@/components/podcast/PodcastForm';
import PodcastProgress from '@/components/podcast/PodcastProgress';
import PodcastScript from '@/components/podcast/PodcastScript';
import PodcastFinal from '@/components/podcast/PodcastFinal';
import { generatePodcast, generateFullPodcastAudio } from '@/lib/api/podcast';

export default function PodcastGenerator() {
  const [loading, setLoading] = useState<boolean>(false);
  const [apiResponse, setApiResponse] = useState<APIResponse | null>(null);
  const [audioProgress, setAudioProgress] = useState<number>(0);
  const [editedPodcastData, setEditedPodcastData] = useState<PodcastData[]>([]);
  const [generatedFinal, setGeneratedFinal] = useState<boolean>(false);
  const [finalAudioUrl, setFinalAudioUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

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
      duration: formData.duration,
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
        setLoading(false);
      }, 3000);
    } catch (error) {
      console.error('Error generating final podcast:', error);
      setError('Failed to generate final podcast audio.');
      setLoading(false);
    }
  };

  // Demo mode implementation
  const handleDemoMode = () => {
    setLoading(true);
    setApiResponse(null);
    setAudioProgress(0);
    setEditedPodcastData([]);
    setGeneratedFinal(false);
    setFinalAudioUrl('');
    setError(null);

    // Simulate loading
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setAudioProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 100);

    // Simulate API response
    setTimeout(() => {
      clearInterval(interval);
      setAudioProgress(100);
      
      const demoData = [
        {
          speaker: "MC1 (Hương Linh)",
          content: "Hello and welcome to our podcast! Today we'll be discussing the latest developments in artificial intelligence and how they're shaping our world."
        },
        {
          speaker: "MC2 (Minh Tú)",
          content: "That's right. AI has been making tremendous progress in recent years, with applications ranging from healthcare to transportation. Let's dive into some of the most interesting breakthroughs."
        },
        {
          speaker: "MC1 (Hương Linh)",
          content: "One area where AI is making a significant impact is healthcare. Machine learning algorithms are now capable of diagnosing diseases with accuracy comparable to human doctors."
        },
        {
          speaker: "MC2 (Minh Tú)",
          content: "Indeed. A recent study published in Nature Medicine showed that AI systems could detect certain types of cancer earlier than traditional methods. This could potentially save thousands of lives."
        }
      ];
      
      setApiResponse({
        status_code: 0,
        data: demoData
      });
      
      setEditedPodcastData(demoData);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold text-blue-600 mb-2">Podcast Generator</h1>
      
      {error && (
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
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={handleDemoMode}
                  type="button"
                  className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
                >
                  Try Demo Mode (No backend required)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <PodcastForm 
        onSubmit={handleFormSubmit} 
        onDemoMode={handleDemoMode}
        loading={loading}
      />

      {loading && (
        <PodcastProgress progress={audioProgress} />
      )}

      {apiResponse && (
        <div className="mt-8">
          {apiResponse.status_code === 0 ? (
            <div className="bg-green-50 p-4 rounded-md mb-6">
              <p className="text-green-700">✅ Success! Podcast generated successfully</p>
            </div>
          ) : (
            <div className="bg-yellow-50 p-4 rounded-md mb-6">
              <p className="text-yellow-700">⚠️ Status Code: {apiResponse.status_code}</p>
              {apiResponse.error && <p className="text-red-600 mt-2">{apiResponse.error}</p>}
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