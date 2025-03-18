// src/components/podcast/PodcastStyleSelector.tsx
'use client';

// Cleaner, simplified podcast style selector with improved UI

import { useState, useEffect } from 'react';

interface PodcastStyleSelectorProps {
  onStyleChange: (style: {
    podcastType: string;
    duration: string;
    guidelines: string;
    maxRevisions: number;
  }) => void;
}
export const PODCAST_STYLES = [
  {
    id: 'traditional-news',
    name: 'Traditional News',
    description: 'Maintain neutral perspectives while providing information',
    podcastType: 'Alternating Briefing',
    duration: 'Short',
    maxRevisions: 3, // Set to High Quality
    guidelines: ''
  },
  {
    id: 'casual-balanced',
    name: 'Interactive Discussion',
    description: 'Conversational, natural dialogue with follow-up questions to deepen the conversation',
    podcastType: 'Discussion',
    duration: 'Medium',
    maxRevisions: 3, // Set to High Quality
    guidelines: ''
  },
  {
    id: 'quick-brief',
    name: 'Quick Briefing',
    description: 'Fast-paced essential information',
    podcastType: 'Solo Briefing',
    duration: 'Very Short',
    maxRevisions: 3, // Set to High Quality
    guidelines: ''
  },
  {
    id: 'custom',
    name: 'Custom Style',
    description: 'Fully customized podcast settings',
    podcastType: 'Discussion',
    duration: 'Medium',
    maxRevisions: 3, // Set to High Quality
    guidelines: ''
  },
];
export default function PodcastStyleSelector({ onStyleChange }: PodcastStyleSelectorProps) {
  const [customGuidelines, setCustomGuidelines] = useState('');
  const [customPodcastType, setCustomPodcastType] = useState('Discussion');
  const [customDuration, setCustomDuration] = useState('Medium');
  // Quality setting is fixed to High Quality (maxRevisions: 3)
  const customMaxRevisions = 1;

  // Initialize with default values when component mounts
  useEffect(() => {
    // Notify parent component about initial style
    onStyleChange({
      podcastType: customPodcastType,
      duration: customDuration,
      guidelines: customGuidelines,
      maxRevisions: customMaxRevisions // Always use high quality
    });
  }, []);

  const handleCustomGuidelinesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomGuidelines(e.target.value);
    onStyleChange({
      podcastType: customPodcastType,
      duration: customDuration,
      guidelines: e.target.value,
      maxRevisions: customMaxRevisions // Always use high quality
    });
  };

  const handleCustomPodcastTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // Get the new podcast type
    const newPodcastType = e.target.value;
    
    // Update the state
    setCustomPodcastType(newPodcastType);
    
    // Notify parent about the change
    onStyleChange({
      podcastType: newPodcastType,
      duration: customDuration,
      guidelines: customGuidelines,
      maxRevisions: customMaxRevisions // Always use high quality
    });
  };

  const handleCustomDurationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCustomDuration(e.target.value);
    onStyleChange({
      podcastType: customPodcastType,
      duration: e.target.value,
      guidelines: customGuidelines,
      maxRevisions: customMaxRevisions // Always use high quality
    });
  };

  return (
    <div className="mb-8">
      <label className="block mb-3 text-lg font-medium text-gray-800 dark:text-gray-200">Podcast Style</label>
      <div className="relative">
        {/* Format & Duration header removed */}
        {/* Removed style dropdown */}

        <div className="mt-4 p-5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-sm">
          {/* Two settings first */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Format</label>
              <div className="relative">
                <select 
                  className="w-full p-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 appearance-none"
                  value={customPodcastType}
                  onChange={handleCustomPodcastTypeChange}
                >
                  <option value="Solo Briefing">Solo Briefing</option>
                  <option value="Alternating Briefing">Alternating Briefing</option>
                  <option value="Discussion">Discussion</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                  </svg>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Duration</label>
              <div className="relative">
                <select 
                  className="w-full p-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 appearance-none"
                  value={customDuration}
                  onChange={handleCustomDurationChange}
                >
                  <option value="Very Short">Very Short (1-2 min)</option>
                  <option value="Short">Short (3-5 min)</option>
                  <option value="Medium">Medium (6-8 min)</option>
                  <option value="Long">Long (9-12 min)</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          {/* Guidelines textarea */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Guidelines (Optional)</label>
            <textarea 
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              rows={4}
              placeholder="Any additional instructions (news title, news outline, etc.)"
              value={customGuidelines}
              onChange={handleCustomGuidelinesChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}