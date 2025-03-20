// src/app/podcast/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { PodcastData, APIResponse } from '@/types/podcast';
import PodcastForm, { PodcastFormData } from '@/components/podcast/PodcastForm';
import PodcastProgress from '@/components/podcast/PodcastProgress';
import PodcastScript from '@/components/podcast/PodcastScript';
import PodcastFinal from '@/components/podcast/PodcastFinal';
import ErrorAlert from '@/components/ui/ErrorAlert';
import { generateFullPodcastAudio, generateBatchAudio } from '@/lib/api/podcast';

export default function PodcastGenerator() {
  const [loading, setLoading] = useState<boolean>(false);
  const [apiResponse, setApiResponse] = useState<APIResponse | null>(null);
  const [audioProgress, setAudioProgress] = useState<number>(0);
  const [editedPodcastData, setEditedPodcastData] = useState<PodcastData[]>([]);
  const [generatedFinal, setGeneratedFinal] = useState<boolean>(false);
  const [finalAudioUrl, setFinalAudioUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [podcastDir, setPodcastDir] = useState<string>('');
  const [scriptReady, setScriptReady] = useState<boolean>(false);
  const [audioGenerating, setAudioGenerating] = useState<boolean>(false);
  const [audioMessage, setAudioMessage] = useState<string>("Your podcast script is being generated. This may take a few minutes.");

  // Debug podcast directory changes
  useEffect(() => {
    if (apiResponse && apiResponse.audio_files) {
      console.log("Audio files available:", apiResponse.audio_files);
      console.log("Individual files (raw):", apiResponse.individual_files);
    }
  }, [apiResponse]);

  // Improved podcast directory handling
  useEffect(() => {
    console.log("Podcast directory set to:", podcastDir);
  }, [podcastDir]);

  // Helper function to convert duration string to number
  const getDurationInMinutes = (durationString: string): number => {
    switch (durationString) {
      case 'Very Short': return 2;  // 1-2 minutes
      case 'Short': return 4;         // 3-5 minutes
      case 'Medium': return 7;        // 6-8 minutes
      case 'Long': return 10;         // 9-12 minutes
      default: return 4;              // Default to Short if unrecognized
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
    setPodcastDir('');
    setScriptReady(false);
    setAudioGenerating(false);
    setAudioMessage("Your podcast script is being generated. This may take a few minutes.");
  
    // Enhanced payload with speaker speeds
    const payload = {
      input_urls: formData.urlList,
      guidelines: formData.guidelines,
      duration: getDurationInMinutes(formData.duration),
      speaker_ids: formData.speakerIds,
      podcast_type: formData.podcastType,
      max_revisions: formData.maxRevisions,
      speaker_profiles: formData.speakerProfiles,
      speaker_speeds: formData.speakerSpeeds // Include speaker speeds
    };
  
    try {
      // Start progress animation for script generation (0-70%)
      let progress = 0;
      const interval = setInterval(() => {
        progress += 1;
        setAudioProgress(Math.min(progress, 65)); // Cap at 65% for script generation
        if (progress >= 65) {
          clearInterval(interval);
        }
      }, 1000);
  
      // Make API call to backend to generate script
      const response = await fetch('/api/podcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
  
      clearInterval(interval);
      const responseData: APIResponse = await response.json();
      console.log("Script generation response:", responseData);
  
      if (responseData.status_code === 0) {
        // Script generated successfully, show it to the user
        setAudioProgress(70);
        setApiResponse(responseData);
        
        // Prepare data for audio generation by adding speaker profiles with speeds
        const podcastDataWithProfiles = responseData.data.map(item => {
          // Find the matching speaker profile
          const speakerProfile = formData.speakerProfiles.find(
            profile => (item.speaker.includes("MC1") && profile.id === formData.speakerIds[0]) ||
              (item.speaker.includes("MC2") && profile.id === formData.speakerIds[1])
          );
  
          return {
            ...item,
            speakerProfile: speakerProfile || undefined
          };
        });
  
        setEditedPodcastData(podcastDataWithProfiles);
        setScriptReady(true);
        
        // Create a podcast directory if one wasn't provided
        const dirPath = responseData.podcast_dir || `podcast_audio/podcast_${Date.now()}`;
        setPodcastDir(dirPath);
        console.log("Using podcast directory:", dirPath);
        
        // Now start audio generation in the background
        setAudioGenerating(true);
        setAudioMessage("Your podcast script is ready! Generating audio in the background...");
        
        // Continue increasing progress for audio generation (70-95%)
        let audioGenProgress = 70;
        const audioInterval = setInterval(() => {
          audioGenProgress += 1;
          setAudioProgress(Math.min(audioGenProgress, 95)); // Cap at 95% until audio is done
          if (audioGenProgress >= 95) {
            clearInterval(audioInterval);
          }
        }, 500);
  
        // Generate audio for all utterances
        const audioResult = await generateBatchAudio(podcastDataWithProfiles, dirPath);
        clearInterval(audioInterval);
  
        if (audioResult.success && audioResult.audioFiles) {
          // Update the response with generated audio files and CDN URLs
          responseData.audio_files = audioResult.audioFiles;
          responseData.individual_files = audioResult.individualFiles;
          responseData.podcast_dir = dirPath;
          // Also add CDN URLs to the response
          responseData.cdn_urls = audioResult.cdnUrls;
  
          setAudioProgress(100);
          setApiResponse(responseData);
          setAudioGenerating(false);
        } else {
          setError(audioResult.error || 'Failed to generate audio for utterances');
          setAudioProgress(100);
          setApiResponse(responseData);
          setAudioGenerating(false);
        }
      } else {
        setApiResponse(responseData);
        setError(responseData.error || 'An error occurred during podcast generation');
      }
  
      setLoading(false);
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
    if (!podcastDir) {
      setError("Cannot generate podcast: podcast directory not available");
      return;
    }

    setLoading(true);
    setAudioProgress(0);
    setError(null);
    try {
      // Start progress animation
      let progress = 0;
      const interval = setInterval(() => {
        progress += 3;
        setAudioProgress(Math.min(progress, 95)); // Cap at 95% until we get the response
        if (progress >= 95) {
          clearInterval(interval);
        }
      }, 700);

      // Call the API to generate the full podcast
      const result = await generateFullPodcastAudio(editedPodcastData, podcastDir);

      clearInterval(interval);
      setAudioProgress(100);

      if (result.success && result.audioUrl) {
        setFinalAudioUrl(result.audioUrl);
        setGeneratedFinal(true);
      } else {
        setError(result.error || 'Failed to generate final podcast audio');
      }

      setLoading(false);
    } catch (error) {
      console.error('Error generating final podcast:', error);
      setError('Failed to generate final podcast audio. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 pt-12">

      {error && (
        <ErrorAlert message={error} />
      )}

      <PodcastForm
        onSubmit={handleFormSubmit}
        loading={loading}
      />

      {loading && (
        <PodcastProgress 
          progress={audioProgress} 
          message={audioMessage}
        />
      )}

{(apiResponse && scriptReady) && (
  <div className="mt-8 space-y-8">
    {apiResponse.status_code === 0 ? (
      <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg border border-green-200 dark:border-green-800 flex items-center gap-3">
        <div className="bg-green-100 dark:bg-green-800 rounded-full p-1">
          <svg className="h-5 w-5 text-green-600 dark:text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <p className="text-green-700 dark:text-green-300 font-medium">Podcast script generated successfully!</p>
          {audioGenerating && (
            <p className="text-green-600 dark:text-green-400 text-sm mt-1">Generating audio in the background...</p>
          )}
        </div>
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
          cdnUrls={apiResponse.cdn_urls} // Pass CDN URLs here
          podcastDir={podcastDir}
          onUpdate={updateContent}
          onGenerateFinal={regenerateFullPodcast}
          loading={loading}
          audioGenerating={audioGenerating}
        />

        {generatedFinal && (
          <PodcastFinal 
            audioUrl={finalAudioUrl} 
            podcastData={editedPodcastData} 
          />
        )}
      </>
    )}
  </div>
)}
    </div>
  );
}