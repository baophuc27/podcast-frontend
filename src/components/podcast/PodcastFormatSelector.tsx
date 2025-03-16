'use client';

import { useState } from 'react';

// Format presets
export const PODCAST_FORMATS = [
  {
    id: 'conversational',
    name: 'Conversational',
    description: 'Casual and engaging dialogue between speakers',
    podcastType: 'Discussion',
    duration: 'Medium',
    guidelines: ''
  },
  {
    id: 'interview',
    name: 'Interview',
    description: 'Question-answer format with a guest perspective',
    podcastType: 'Interview',
    duration: 'Long',
    guidelines: ''
  },
  {
    id: 'short-form',
    name: 'Short-Form',
    description: 'Brief highlights of key information',
    podcastType: 'Discussion',
    duration: 'Short',
    guidelines: ''
  },
  {
    id: 'in-depth',
    name: 'In-Depth Analysis',
    description: 'Thorough examination of complex topics',
    podcastType: 'Educational',
    duration: 'Long',
    guidelines: ''
  },
];

// Quality-speed presets
export const QUALITY_SETTINGS = [
  {
    id: 'high-speed',
    name: 'High Speed',
    description: 'Fastest generation with basic quality',
    maxRevisions: 1
  },
  {
    id: 'balanced',
    name: 'Balanced',
    description: 'Good balance of speed and quality',
    maxRevisions: 2
  },
  {
    id: 'high-quality',
    name: 'High Quality',
    description: 'Best quality with longer generation time',
    maxRevisions: 3
  }
];

interface PodcastFormatSelectorProps {
  onFormatChange: (format: any) => void;
  onQualityChange: (quality: any) => void;
}

export default function PodcastFormatSelector({ 
  onFormatChange, 
  onQualityChange 
}: PodcastFormatSelectorProps) {
  const [selectedFormatId, setSelectedFormatId] = useState('conversational');
  const [selectedQualityId, setSelectedQualityId] = useState('balanced');
  const [isFormatExpanded, setIsFormatExpanded] = useState(false);
  const [isQualityExpanded, setIsQualityExpanded] = useState(false);
  const [customGuidelines, setCustomGuidelines] = useState('');
  const [customPodcastType, setCustomPodcastType] = useState('Discussion');
  const [customDuration, setCustomDuration] = useState('Medium');
  
  // Get the selected format template
  const selectedFormatTemplate = PODCAST_FORMATS.find(format => format.id === selectedFormatId) || PODCAST_FORMATS[0];
  
  // Create the actual format with potentially customized values
  const selectedFormat = {
    ...selectedFormatTemplate,
    guidelines: customGuidelines || selectedFormatTemplate.guidelines,
    podcastType: customPodcastType || selectedFormatTemplate.podcastType,
    duration: customDuration || selectedFormatTemplate.duration
  };
  
  // Get the selected quality
  const selectedQuality = QUALITY_SETTINGS.find(quality => quality.id === selectedQualityId) || QUALITY_SETTINGS[1];

  

  const handleQualityChange = (qualityId: string) => {
    setSelectedQualityId(qualityId);
    const quality = QUALITY_SETTINGS.find(q => q.id === qualityId);
    if (quality) {
      onQualityChange({
        maxRevisions: quality.maxRevisions
      });
    }
    setIsQualityExpanded(false);
  };

  const handleCustomGuidelinesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomGuidelines(e.target.value);
    onFormatChange({
      podcastType: customPodcastType,
      duration: customDuration,
      guidelines: e.target.value
    });
  };

  const handleCustomPodcastTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCustomPodcastType(e.target.value);
    onFormatChange({
      podcastType: e.target.value,
      duration: customDuration,
      guidelines: customGuidelines
    });
  };

  const handleCustomDurationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCustomDuration(e.target.value);
    onFormatChange({
      podcastType: customPodcastType,
      duration: e.target.value,
      guidelines: customGuidelines
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      {/* Format Selection */}
      <div className="relative">
        <label className="block mb-2 font-medium text-gray-800 dark:text-gray-200">Podcast Format</label>
        <div 
          className="relative border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 p-3 cursor-pointer"
          onClick={() => setIsFormatExpanded(!isFormatExpanded)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/50 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400">
                  <path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-gray-100">{selectedFormat.name}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedFormat.id === 'custom' ? 'Custom format settings' : `${selectedFormat.duration} • ${selectedFormat.podcastType}`}
                </div>
              </div>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
            </svg>
          </div>
        </div>

        {/* Format Dropdown */}
        {isFormatExpanded && (
          <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 max-h-80 overflow-auto">
            {PODCAST_FORMATS.map(format => (
              <div 
                key={format.id}
                className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                onClick={() => {
                  setSelectedFormatId(format.id);
                  const foundFormat = PODCAST_FORMATS.find(f => f.id === format.id);
                  if (foundFormat) {
                    // Set initial values for the new format
                    setCustomGuidelines(foundFormat.guidelines);
                    setCustomPodcastType(foundFormat.podcastType);
                    setCustomDuration(foundFormat.duration);
                    
                    // Pass these values to the parent component
                    onFormatChange({
                      podcastType: foundFormat.podcastType,
                      duration: foundFormat.duration,
                      guidelines: foundFormat.guidelines
                    });
                  }
                  setIsFormatExpanded(false);
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">{format.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{format.description}</div>
                  </div>
                  {selectedFormatId === format.id && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Format Settings (available for all styles) */}
          <div className="mt-4 space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Guidelines</label>
              <textarea 
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                rows={3}
                placeholder="Enter custom guidelines for your podcast..."
                value={customGuidelines}
                onChange={handleCustomGuidelinesChange}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Podcast Type</label>
                <select 
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  value={customPodcastType}
                  onChange={handleCustomPodcastTypeChange}
                >
                  <option value="Discussion">Discussion</option>
                  <option value="Interview">Interview</option>
                  <option value="Narrative">Narrative</option>
                  <option value="Educational">Educational</option>
                </select>
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Duration</label>
                <select 
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  value={customDuration}
                  onChange={handleCustomDurationChange}
                >
                  <option value="Short">Short (1-2 min)</option>
                  <option value="Medium">Medium (3-5 min)</option>
                  <option value="Long">Long (6-8 min)</option>
                </select>
              </div>
            </div>
          </div>
      </div>

      {/* Quality Selection */}
      <div className="relative">
        <label className="block mb-2 font-medium text-gray-800 dark:text-gray-200">Generation Quality</label>
        <div 
          className="relative border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 p-3 cursor-pointer"
          onClick={() => setIsQualityExpanded(!isQualityExpanded)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/50 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600 dark:text-purple-400">
                  <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-gray-100">{selectedQuality.name}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{selectedQuality.description}</div>
              </div>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
            </svg>
          </div>
        </div>

        {/* Quality Dropdown */}
        {isQualityExpanded && (
          <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700">
            {QUALITY_SETTINGS.map(quality => (
              <div 
                key={quality.id}
                className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                onClick={() => handleQualityChange(quality.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">{quality.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{quality.description}</div>
                  </div>
                  {selectedQualityId === quality.id && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}