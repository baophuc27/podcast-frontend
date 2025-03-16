'use client';

import { useState, FormEvent } from 'react';
import { SpeakerProfile } from '@/types/podcast';
import SpeakerSelection from './SpeakerSelection';
import { SPEAKER_PROFILES } from '@/lib/constants/speakers';

interface PodcastFormProps {
  onSubmit: (formData: PodcastFormData) => void;
  loading: boolean;
}

export interface PodcastFormData {
  urlList: string[];
  guidelines: string;
  duration: string; // Changed from number to string
  speakerIds: number[];
  podcastType: string;
  maxRevisions: number;
  speakerProfiles: SpeakerProfile[];
}

export default function PodcastForm({ 
  onSubmit, 
  loading 
}: PodcastFormProps) {
  const [urls, setUrls] = useState<string>('');
  const [guidelines, setGuidelines] = useState<string>('');
  const [podcastType, setPodcastType] = useState<string>('Discussion');
  const [duration, setDuration] = useState<string>('Medium'); // Changed from number to string
  const [maxRevisions, setMaxRevisions] = useState<number>(1);
  const [selectedSpeakers, setSelectedSpeakers] = useState<number[]>([0, 1]);

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

    const formData: PodcastFormData = {
      urlList,
      guidelines,
      duration,
      speakerIds: selectedSpeakers,
      podcastType,
      maxRevisions,
      speakerProfiles: SPEAKER_PROFILES.filter(profile => 
        selectedSpeakers.includes(profile.id)
      )
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
            placeholder="https://example.com/article1&#10;https://example.com/article2"
            value={urls}
            onChange={(e) => setUrls(e.target.value)}
          />
        </div>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Add URLs to articles you want to convert into podcast content</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block mb-2 font-medium text-gray-800 dark:text-gray-200">Guidelines</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <input 
              type="text"
              className="w-full pl-10 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Keep it conversational, explain complex terms"
              value={guidelines}
              onChange={(e) => setGuidelines(e.target.value)}
            />
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Optional instructions for tone and style</p>
        </div>
        
        <div>
          <label className="block mb-2 font-medium text-gray-800 dark:text-gray-200">Podcast Type</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <select 
              className="w-full pl-10 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 appearance-none"
              value={podcastType}
              onChange={(e) => setPodcastType(e.target.value)}
            >
              <option value="Discussion">Discussion</option>
              <option value="Interview">Interview</option>
              <option value="Narrative">Narrative</option>
              <option value="Educational">Educational</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Choose conversation format</p>
        </div>
        
        <div>
          <label className="block mb-2 font-medium text-gray-800 dark:text-gray-200">Duration</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <select 
              className="w-full pl-10 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 appearance-none"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            >
              <option value="Short">Short (1-3 minutes)</option>
              <option value="Medium">Medium (4-7 minutes)</option>
              <option value="Long">Long (8-10 minutes)</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Select podcast length</p>
        </div>
        
        <div>
          <label className="block mb-2 font-medium text-gray-800 dark:text-gray-200">Maximum Revisions</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <input 
              type="number"
              className="w-full pl-10 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              min={1}
              max={5}
              value={maxRevisions}
              onChange={(e) => setMaxRevisions(parseInt(e.target.value))}
            />
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">How many times you can regenerate content</p>
        </div>
      </div>
      
      <SpeakerSelection 
        selectedSpeakers={selectedSpeakers}
        onChange={setSelectedSpeakers}
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