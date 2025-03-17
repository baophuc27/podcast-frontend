'use client';

import { useState } from 'react';
import { SPEAKER_PROFILES } from '@/lib/constants/speakers';

// Import the modal component instead of SpeedControl
import SpeedSettingsModal from './SpeedSettingsModal';

// Helper function to convert numeric age to description
const getAgeDescription = (age: number): string => {
  if (age < 25) return 'Young';
  if (age < 45) return 'Middle-aged';
  return 'Mature';
};

// Updated interface with speed-related props
interface SpeakerSelectionProps {
  selectedSpeakers: number[];
  speakerSpeeds: { [speakerId: number]: number }; // Added this prop
  onChange: (selectedIds: number[]) => void;
  onSpeedChange: (speakerId: number, speed: number) => void; // Added this prop
}

export default function SpeakerSelection({ 
  selectedSpeakers, 
  speakerSpeeds, // Added this prop
  onChange,
  onSpeedChange // Added this prop
}: SpeakerSelectionProps) {
  const [hostMenuOpen, setHostMenuOpen] = useState(false);
  const [guestMenuOpen, setGuestMenuOpen] = useState(false);
  const [isSpeedModalOpen, setIsSpeedModalOpen] = useState(false);
  
  const hostSpeaker = selectedSpeakers[0] !== undefined ? SPEAKER_PROFILES.find(s => s.id === selectedSpeakers[0]) : null;
  const guestSpeaker = selectedSpeakers[1] !== undefined ? SPEAKER_PROFILES.find(s => s.id === selectedSpeakers[1]) : null;
  
  // Get selected speakers as profiles
  const selectedSpeakerProfiles = SPEAKER_PROFILES.filter(
    speaker => selectedSpeakers.includes(speaker.id)
  );

  const selectHost = (speakerId: number) => {
    const newSelection = [...selectedSpeakers];
    
    // If this speaker is already selected as guest, reset guest
    if (selectedSpeakers[1] === speakerId) {
      newSelection[1] = undefined; // Reset guest selection
    }
    
    newSelection[0] = speakerId;
    onChange(newSelection);
    setHostMenuOpen(false);
  };

  const selectGuest = (speakerId: number) => {
    const newSelection = [...selectedSpeakers];
    newSelection[1] = speakerId;
    onChange(newSelection);
    setGuestMenuOpen(false);
  };

  const playAudio = (speakerId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const audio = new Audio(`/voices/${speakerId}_sample.wav`);
    audio.play().catch(err => console.error("Error playing audio:", err));
  };

  // Extract style tags from guidelines string
  const getStyleTags = (guidelines: string): string[] => {
    return guidelines.split('+')
      .map(item => item.trim())
      .filter(item => item.length > 0);
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-gray-800 dark:text-gray-200 text-lg flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Voice Selection
        </h3>
        
        {/* Speed Settings Button */}
        {(hostSpeaker || guestSpeaker) && (
          <button
            onClick={() => setIsSpeedModalOpen(true)}
            type="button"
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            Advanced Settings
          </button>
        )}
      </div>
      
      {/* Speed Settings Modal */}
      <SpeedSettingsModal 
        isOpen={isSpeedModalOpen}
        onClose={() => setIsSpeedModalOpen(false)}
        speakers={selectedSpeakerProfiles}
        speakerSpeeds={speakerSpeeds}
        onSpeedChange={onSpeedChange}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Host Voice Selection */}
        <div className="relative">
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Host Voice</label>
          <div 
            className="border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 p-3 flex items-center justify-between cursor-pointer"
            onClick={() => setHostMenuOpen(!hostMenuOpen)}
          >
            {hostSpeaker ? (
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                  hostSpeaker.gender === 'Female' ? 'bg-pink-100 text-pink-600' : 'bg-blue-100 text-blue-600'
                }`}>
                  {hostSpeaker.gender === 'Female' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>
                <div>
                  <span className="font-medium">{hostSpeaker.name}</span>
                  <div className="flex mt-1 gap-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                      {hostSpeaker.gender}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                      {getAgeDescription(hostSpeaker.age)}
                    </span>
                    <button 
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-200 transition-colors"
                      onClick={(e) => playAudio(hostSpeaker.id, e)}
                      type="button"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      </svg>
                      Play
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <span className="text-gray-500">Select host voice</span>
            )}
            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
            </svg>
          </div>
          
          {/* Host Dropdown */}
          {hostMenuOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-auto">
              {SPEAKER_PROFILES.map(speaker => {
                const styleTags = getStyleTags(speaker.mc_guidelines);
                // Host can select any voice, no restrictions
                return (
                  <div 
                    key={speaker.id}
                    className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => selectHost(speaker.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                          speaker.gender === 'Female' ? 'bg-pink-100 text-pink-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                          {speaker.gender === 'Female' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{speaker.name}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                              {speaker.gender}
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                              {getAgeDescription(speaker.age)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button 
                        className="text-blue-600 hover:text-blue-800 transition-colors p-1"
                        onClick={(e) => playAudio(speaker.id, e)}
                        type="button"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-2">
                      {styleTags.map((tag, idx) => (
                        <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          {/* Display current speed value instead of full speed control */}
          {hostSpeaker && (
            <div className="mt-3 text-sm text-gray-600 dark:text-gray-400 flex items-center justify-between px-1">
              <span>Voice speed: <span className="font-medium">{(speakerSpeeds[hostSpeaker.id] || 1.0).toFixed(1)}x</span></span>

            </div>
          )}
        </div>
        
        {/* Guest Voice Selection */}
        <div className="relative">
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Guest Voice</label>
          <div 
            className="border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 p-3 flex items-center justify-between cursor-pointer"
            onClick={() => setGuestMenuOpen(!guestMenuOpen)}
          >
            {guestSpeaker ? (
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                  guestSpeaker.gender === 'Female' ? 'bg-pink-100 text-pink-600' : 'bg-blue-100 text-blue-600'
                }`}>
                  {guestSpeaker.gender === 'Female' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>
                <div>
                  <span className="font-medium">{guestSpeaker.name}</span>
                  <div className="flex mt-1 gap-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                      {guestSpeaker.gender}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                      {getAgeDescription(guestSpeaker.age)}
                    </span>
                    <button 
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-200 transition-colors"
                      onClick={(e) => playAudio(guestSpeaker.id, e)}
                      type="button"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      </svg>
                      Play
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <span className="text-gray-500">Select guest voice</span>
            )}
            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
            </svg>
          </div>
          
          {/* Guest Dropdown */}
          {guestMenuOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-auto">
              {SPEAKER_PROFILES.map(speaker => {
                const styleTags = getStyleTags(speaker.mc_guidelines);
                const isDisabled = selectedSpeakers[0] === speaker.id;
                
                return (
                  <div 
                    key={speaker.id}
                    className={`p-3 ${isDisabled ? 'bg-gray-50 dark:bg-gray-900 opacity-60' : 'hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer'}`}
                    onClick={() => !isDisabled && selectGuest(speaker.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                          speaker.gender === 'Female' ? 'bg-pink-100 text-pink-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                          {speaker.gender === 'Female' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{speaker.name}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                              {speaker.gender}
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                              {getAgeDescription(speaker.age)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button 
                        className="text-blue-600 hover:text-blue-800 transition-colors p-1"
                        onClick={(e) => playAudio(speaker.id, e)}
                        type="button"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-2">
                      {styleTags.map((tag, idx) => (
                        <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    {isDisabled && (
                      <div className="mt-1 text-xs italic text-gray-500 dark:text-gray-400">
                        Already selected as host
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          
          {/* Display current speed value instead of full speed control */}
          {guestSpeaker && (
            <div className="mt-3 text-sm text-gray-600 dark:text-gray-400 flex items-center justify-between px-1">
              <span>Voice speed: <span className="font-medium">{(speakerSpeeds[guestSpeaker.id] || 1.0).toFixed(1)}x</span></span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}