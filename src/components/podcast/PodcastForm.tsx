'use client';

import { useState, FormEvent } from 'react';
import { SpeakerProfile } from '@/types/podcast';
import SpeakerSelection from './SpeakerSelection';
import { SPEAKER_PROFILES } from '@/lib/constants/speakers';

interface PodcastFormProps {
  onSubmit: (formData: PodcastFormData) => void;
  onDemoMode: () => void;
  loading: boolean;
}

export interface PodcastFormData {
  urlList: string[];
  guidelines: string;
  duration: number;
  speakerIds: number[];
  podcastType: string;
  maxRevisions: number;
  speakerProfiles: SpeakerProfile[];
}

export default function PodcastForm({ 
  onSubmit, 
  onDemoMode, 
  loading 
}: PodcastFormProps) {
  const [urls, setUrls] = useState<string>('');
  const [guidelines, setGuidelines] = useState<string>('');
  const [podcastType, setPodcastType] = useState<string>('Discussion');
  const [duration, setDuration] = useState<number>(3);
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
    <form onSubmit={handleSubmit} className="mb-8 bg-gray-50 p-6 rounded-lg shadow-md">
      <div className="mb-4">
        <label className="block mb-2 font-medium">Input URLs (one per line)</label>
        <textarea 
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={4}
          placeholder="https://example.com/article1&#10;https://example.com/article2"
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-2 font-medium">Guidelines</label>
          <input 
            type="text"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Custom guidelines"
            value={guidelines}
            onChange={(e) => setGuidelines(e.target.value)}
          />
        </div>
        
        <div>
          <label className="block mb-2 font-medium">Podcast Type</label>
          <select 
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={podcastType}
            onChange={(e) => setPodcastType(e.target.value)}
          >
            <option value="Discussion">Discussion</option>
          </select>
        </div>
        
        <div>
          <label className="block mb-2 font-medium">Duration (minutes)</label>
          <input 
            type="number"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            min={1}
            max={6}
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
          />
        </div>
        
        <div>
          <label className="block mb-2 font-medium">Maximum Revisions</label>
          <input 
            type="number"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            min={1}
            max={5}
            value={maxRevisions}
            onChange={(e) => setMaxRevisions(parseInt(e.target.value))}
          />
        </div>
      </div>
      
      <SpeakerSelection 
        selectedSpeakers={selectedSpeakers}
        onChange={setSelectedSpeakers}
      />
      
      <div className="flex space-x-4">
        <button 
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Generating...' : '🎙️ Generate Draft'}
        </button>
        
        <button 
          type="button"
          onClick={onDemoMode}
          className="bg-gray-600 text-white px-6 py-3 rounded-md font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
        >
          Demo Mode
        </button>
      </div>
    </form>
  );
}