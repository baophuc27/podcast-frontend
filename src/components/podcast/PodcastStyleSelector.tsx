// src/components/podcast/PodcastStyleSelector.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';

// Style presets that combine format and quality
export const PODCAST_STYLES = [
  {
    id: 'traditional-news',
    name: 'Traditional News',
    description: 'Maintain neutral perspectives while providing information',
    podcastType: 'Alternating Briefing',
    duration: 'Short',
    maxRevisions: 2,
    guidelines: ''
  },
  {
    id: 'casual-balanced',
    name: 'Interactive Discussion',
    description: 'Conversational, natural dialogue with follow-up questions to deepen the conversation',
    podcastType: 'Discussion',
    duration: 'Medium',
    maxRevisions: 3,
    guidelines: ''
  },
  {
    id: 'quick-brief',
    name: 'Quick Briefing',
    description: 'Fast-paced essential information',
    podcastType: 'Solo Briefing',
    duration: 'Very Short',
    maxRevisions: 1,
    guidelines: ''
  },
  {
    id: 'custom',
    name: 'Custom Style',
    description: 'Fully customized podcast settings',
    podcastType: 'Discussion',
    duration: 'Medium',
    maxRevisions: 2,
    guidelines: ''
  },
];

interface PodcastStyleSelectorProps {
  onStyleChange: (style: {
    podcastType: string;
    duration: string;
    guidelines: string;
    maxRevisions: number;
  }) => void;
}

export default function PodcastStyleSelector({ onStyleChange }: PodcastStyleSelectorProps) {
  const [selectedStyleId, setSelectedStyleId] = useState('casual-balanced');
  const [isStyleMenuOpen, setIsStyleMenuOpen] = useState(false);
  const [customGuidelines, setCustomGuidelines] = useState(PODCAST_STYLES[1].guidelines); // Set default to Interactive Discussion guidelines
  const [customPodcastType, setCustomPodcastType] = useState(PODCAST_STYLES[1].podcastType);
  const [customDuration, setCustomDuration] = useState(PODCAST_STYLES[1].duration);
  const [customMaxRevisions, setCustomMaxRevisions] = useState(PODCAST_STYLES[1].maxRevisions);
  
  // Initialize with the default selected style when component mounts
  useEffect(() => {
    const style = PODCAST_STYLES.find(s => s.id === selectedStyleId);
    if (style) {
      setCustomGuidelines(style.guidelines);
      setCustomPodcastType(style.podcastType);
      setCustomDuration(style.duration);
      setCustomMaxRevisions(style.maxRevisions);
      
      // Notify parent component about initial style
      onStyleChange({
        podcastType: style.podcastType,
        duration: style.duration,
        guidelines: style.guidelines,
        maxRevisions: style.maxRevisions
      });
    }
  }, []);
  
  // Get the selected style template
  const selectedStyle = PODCAST_STYLES.find(style => style.id === selectedStyleId) || PODCAST_STYLES[1];
  
  // Create the actual style with potentially customized values
  const currentStyle = {
    ...selectedStyle,
    guidelines: customGuidelines,
    podcastType: customPodcastType,
    duration: customDuration,
    maxRevisions: customMaxRevisions
  };
  
  // Function to get the display name based on current settings
  const getDisplayStyleName = useCallback(() => {
    // Find a matching predefined style based on current settings
    const matchingStyle = PODCAST_STYLES.find(style => 
      style.id !== 'custom' && 
      style.guidelines === customGuidelines &&
      style.podcastType === customPodcastType &&
      style.duration === customDuration &&
      style.maxRevisions === customMaxRevisions
    );
    
    // Return the matching style name or "Custom Style" if no match
    return matchingStyle ? matchingStyle.name : "Custom Style";
  }, [customGuidelines, customPodcastType, customDuration, customMaxRevisions]);

  // Function to check if current settings match a predefined style
  const checkIfCustomStyle = useCallback(() => {
    const matchingStyle = PODCAST_STYLES.find(style => 
      style.id !== 'custom' && 
      style.guidelines === customGuidelines &&
      style.podcastType === customPodcastType &&
      style.duration === customDuration &&
      style.maxRevisions === customMaxRevisions
    );

    // If no matching style found, switch to custom
    if (!matchingStyle) {
      if (selectedStyleId !== 'custom') {
        setSelectedStyleId('custom');
      }
    } else {
      // If there's a matching style, update the selectedStyleId to match
      if (selectedStyleId !== matchingStyle.id) {
        setSelectedStyleId(matchingStyle.id);
      }
    }
  }, [customGuidelines, customPodcastType, customDuration, customMaxRevisions, selectedStyleId]);

  const handleStyleSelect = (styleId: string) => {
    setSelectedStyleId(styleId);
    const style = PODCAST_STYLES.find(s => s.id === styleId);
    if (style) {
      // Set initial values for the new style
      setCustomGuidelines(style.guidelines);
      setCustomPodcastType(style.podcastType);
      setCustomDuration(style.duration);
      setCustomMaxRevisions(style.maxRevisions);
      
      // Pass these values to the parent component
      onStyleChange({
        podcastType: style.podcastType,
        duration: style.duration,
        guidelines: style.guidelines,
        maxRevisions: style.maxRevisions
      });
    }
    
    setIsStyleMenuOpen(false);
  };

  const handleCustomGuidelinesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomGuidelines(e.target.value);
    onStyleChange({
      podcastType: customPodcastType,
      duration: customDuration,
      guidelines: e.target.value,
      maxRevisions: customMaxRevisions
    });
    
    // Check if we need to switch to custom style
    setTimeout(() => checkIfCustomStyle(), 0);
  };

  const handleCustomPodcastTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCustomPodcastType(e.target.value);
    onStyleChange({
      podcastType: e.target.value,
      duration: customDuration,
      guidelines: customGuidelines,
      maxRevisions: customMaxRevisions
    });
    
    // Check if we need to switch to custom style
    setTimeout(() => checkIfCustomStyle(), 0);
  };

  const handleCustomDurationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCustomDuration(e.target.value);
    onStyleChange({
      podcastType: customPodcastType,
      duration: e.target.value,
      guidelines: customGuidelines,
      maxRevisions: customMaxRevisions
    });
    
    // Check if we need to switch to custom style
    setTimeout(() => checkIfCustomStyle(), 0);
  };

  const handleMaxRevisionsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const revisions = parseInt(e.target.value);
    setCustomMaxRevisions(revisions);
    onStyleChange({
      podcastType: customPodcastType,
      duration: customDuration,
      guidelines: customGuidelines,
      maxRevisions: revisions
    });
    
    // Check if we need to switch to custom style
    setTimeout(() => checkIfCustomStyle(), 0);
  };

  // Helper to get quality level text from max revisions
  const getQualityLevel = (revisions: number): string => {
    switch(revisions) {
      case 1: return 'Fast';
      case 3: return 'High Quality';
      default: return 'Balanced';
    }
  };

  return (
    <div className="mb-6">
      <label className="block mb-2 font-medium text-gray-800 dark:text-gray-200">Podcast Style</label>
      <div className="relative">
        <div 
          className="relative border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 p-3 cursor-pointer"
          onClick={() => setIsStyleMenuOpen(!isStyleMenuOpen)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-900/50 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600 dark:text-indigo-400">
                  <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-gray-100">{getDisplayStyleName()}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                {customPodcastType} • {customDuration} • {getQualityLevel(customMaxRevisions)}
                </div>
              </div>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
            </svg>
          </div>
        </div>

        {/* Style Dropdown */}
        {isStyleMenuOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 max-h-80 overflow-auto">
            {PODCAST_STYLES.map(style => (
              <div 
                key={style.id}
                className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                onClick={() => handleStyleSelect(style.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">{style.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{style.description}</div>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                        {style.duration}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                        {style.podcastType}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                        {getQualityLevel(style.maxRevisions)}
                      </span>
                    </div>
                  </div>
                  {selectedStyleId === style.id && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Custom Style Settings - REARRANGED ORDER */}
        <div className={`mt-4 space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50 ${selectedStyleId === 'custom' ? 'border-indigo-300 dark:border-indigo-700' : ''}`}>
          {/* Three settings first */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Format</label>
              <select 
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                value={customPodcastType}
                onChange={handleCustomPodcastTypeChange}
              >
                <option value="Solo Briefing">Solo Briefing</option>
                <option value="Alternating Briefing">Alternating Briefing</option>
                <option value="Discussion">Discussion</option>
              </select>
            </div>
            
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Duration</label>
              <select 
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                value={customDuration}
                onChange={handleCustomDurationChange}
              >
                <option value="Very Short">Very Short (1-2 min)</option>
                <option value="Short">Short (3-5 min)</option>
                <option value="Medium">Medium (6-8 min)</option>
                <option value="Long">Long (9-12 min)</option>
              </select>
            </div>
            
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Quality</label>
              <select 
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                value={customMaxRevisions}
                onChange={handleMaxRevisionsChange}
              >
                <option value="1">Fast (minimal revisions)</option>
                <option value="2">Balanced (moderate revisions)</option>
                <option value="3">High Quality (thorough revisions)</option>
              </select>
            </div>
          </div>
          
          {/* Guidelines textarea moved below */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Guidelines (Optional)</label>
            <textarea 
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              rows={3}
              placeholder="Enter specific instructions for tone, topics to emphasize, or content approach..."
              value={customGuidelines}
              onChange={handleCustomGuidelinesChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}