'use client';

import { useState, FormEvent } from 'react';
import { SpeakerProfile } from '@/types/podcast';
import SpeakerSelection from './SpeakerSelection';
import { SPEAKER_PROFILES } from '@/lib/constants/speakers';
import PodcastStyleSelector, { PODCAST_STYLES } from './PodcastStyleSelector';

interface PodcastFormProps {
  onSubmit: (formData: PodcastFormData) => void;
  loading: boolean;
}

export interface PodcastFormData {
  urlList: string[];
  guidelines: string;
  duration: string;
  speakerIds: number[];
  podcastType: string;
  maxRevisions: number;
  speakerProfiles: SpeakerProfile[];
  speakerSpeeds: { [speakerId: number]: number }; // Add speaker speeds
}

export default function PodcastForm({ 
  onSubmit, 
  loading 
}: PodcastFormProps) {
  const [urls, setUrls] = useState<string>('');
  const [selectedSpeakers, setSelectedSpeakers] = useState<number[]>([0, 1]);
  
  // Add state for speaker speeds
  const [speakerSpeeds, setSpeakerSpeeds] = useState<{ [speakerId: number]: number }>({
    0: 1.0, // Default speed for speaker 0
    1: 1.0  // Default speed for speaker 1
  });
  
  // Style states (unified from format and quality)
  const [guidelines, setGuidelines] = useState<string>('');
  const [podcastType, setPodcastType] = useState<string>(PODCAST_STYLES[0].podcastType);
  const [duration, setDuration] = useState<string>(PODCAST_STYLES[0].duration);
  const [maxRevisions, setMaxRevisions] = useState<number>(PODCAST_STYLES[0].maxRevisions);

  const handleStyleChange = (style: { 
    podcastType: string; 
    duration: string; 
    guidelines: string;
    maxRevisions: number;
  }) => {
    setPodcastType(style.podcastType);
    setDuration(style.duration);
    setGuidelines(style.guidelines);
    setMaxRevisions(style.maxRevisions);
  };

  // Handle speed changes for a specific speaker
  const handleSpeedChange = (speakerId: number, newSpeed: number) => {
    setSpeakerSpeeds(prev => ({
      ...prev,
      [speakerId]: newSpeed
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    const urlList = urls.split('\n').filter(url => url.trim().length > 0);
    
    if (urlList.length === 0) {
      alert('Please enter at least one URL');
      return;
    }

    if (selectedSpeakers.length === 0) {
      alert('Please select at least one speaker');
      return;
    }

    // Get the speaker profiles with speed values
    const profilesWithSpeed = SPEAKER_PROFILES.filter(profile => 
      selectedSpeakers.includes(profile.id)
    ).map(profile => ({
      ...profile,
      speed: speakerSpeeds[profile.id] || 1.0 // Use configured speed or default to 1.0
    }));
    
    const formData: PodcastFormData = {
      urlList,
      guidelines,
      duration,
      speakerIds: selectedSpeakers,
      podcastType,
      maxRevisions,
      speakerProfiles: profilesWithSpeed,
      speakerSpeeds // Include speaker speeds in the form data
    };

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-100 dark:border-gray-700 p-8 transition-all">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="mr-2 text-blue-600"
        >
          <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
          <line x1="6" y1="1" x2="6" y2="4"></line>
          <line x1="10" y1="1" x2="10" y2="4"></line>
          <line x1="14" y1="1" x2="14" y2="4"></line>
        </svg>
        Create Your Podcast
      </h2>
      
      <div className="mb-6">
        <label className="block mb-2 font-medium text-gray-800 dark:text-gray-200">Input URLs (one per line)</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <textarea 
            className="w-full pl-10 p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            rows={4}
            placeholder={"https://example.com/article1\nhttps://example.com/article2"}
            value={urls}
            onChange={(e) => setUrls(e.target.value)}
          />
        </div>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Add URLs to articles you want to convert into podcast content</p>
      </div>
      
      {/* Unified Style Selector */}
      <PodcastStyleSelector onStyleChange={handleStyleChange} />
      
      <SpeakerSelection 
        selectedSpeakers={selectedSpeakers}
        speakerSpeeds={speakerSpeeds}
        onChange={setSelectedSpeakers}
        onSpeedChange={handleSpeedChange}
      />
      
      <div className="flex justify-center mt-8">
        <button 
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 min-w-40"
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
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                <line x1="6" y1="1" x2="6" y2="4"></line>
                <line x1="10" y1="1" x2="10" y2="4"></line>
                <line x1="14" y1="1" x2="14" y2="4"></line>
              </svg>
              Generate Draft
            </>
          )}
        </button>
      </div>
    </form>
  );
}