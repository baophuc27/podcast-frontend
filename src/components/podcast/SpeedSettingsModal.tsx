'use client';

import React, { useRef, useEffect, useState } from 'react';
import { SpeakerProfile } from '@/types/podcast';

interface SpeedSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  speakers: SpeakerProfile[];
  speakerSpeeds: { [speakerId: number]: number };
  onSpeedChange: (speakerId: number, speed: number) => void;
}

export default function SpeedSettingsModal({ 
  isOpen, 
  onClose, 
  speakers, 
  speakerSpeeds, 
  onSpeedChange 
}: SpeedSettingsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [demoLoading, setDemoLoading] = useState<{ [speakerId: number]: boolean }>({});
  const [demoAudio, setDemoAudio] = useState<{ [speakerId: number]: string }>({});
  const audioRefs = useRef<{ [speakerId: number]: HTMLAudioElement | null }>({});
  
  // Demo text for generating audio samples
  const demoText = "Sau gần một tháng mở cổng đăng kí, cuộc thi sáng kiến khoa học 2025 thu hút hơn 30 hồ sơ tham dự, trong đó nhiều giải pháp về năng lượng, chất thải, sử dụng tài nguyên sẵn có";
  
  // Handle click outside to close modal
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent scrolling of the body when modal is open
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);
  
  // Handle escape key to close modal
  useEffect(() => {
    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  // Reset audio state on modal close
  useEffect(() => {
    if (!isOpen) {
      // Stop all playing audio when modal closes
      Object.values(audioRefs.current).forEach(audioEl => {
        if (audioEl) {
          audioEl.pause();
          audioEl.currentTime = 0;
        }
      });
    }
  }, [isOpen]);
  
  // Function to generate demo audio with current speed
  const generateDemoAudio = async (speakerId: number, speed: number) => {
    // Don't generate if already loading
    if (demoLoading[speakerId]) return;
    
    try {
      // Find speaker profile to determine speaker ID for TTS
      const speaker = speakers.find(s => s.id === speakerId);
      if (!speaker) return;
      
      const ttsSpeakerId = speaker.gender === 'Female' ? 1 : 2;
      
      // Set loading state for this speaker
      setDemoLoading(prev => ({ ...prev, [speakerId]: true }));
      
      // Make request to TTS API
      const response = await fetch('https://kiki-tts-engine.tts.zalo.ai/generate_audio', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: demoText,
          speed: speed,
          speaker_id: ttsSpeakerId,
          encode_type: 0
        })
      });
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.error_code === 0 && result.url) {
        // Set the audio URL
        setDemoAudio(prev => ({ ...prev, [speakerId]: result.url }));
      } else {
        throw new Error(`API error: ${result.error_message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error generating demo audio:', error);
      // Show error message to user
      alert('Could not generate demo audio. Please try again later.');
    } finally {
      // Clear loading state
      setDemoLoading(prev => ({ ...prev, [speakerId]: false }));
    }
  };

  // Handle playing demo audio
  const playDemoAudio = (speakerId: number) => {
    const audioEl = audioRefs.current[speakerId];
    if (audioEl) {
      // If we already have an audio element, just play it
      audioEl.play().catch(err => console.error('Error playing audio:', err));
    } else if (demoAudio[speakerId]) {
      // If we have a URL but no element yet, create one and play it
      const newAudio = new Audio(demoAudio[speakerId]);
      audioRefs.current[speakerId] = newAudio;
      newAudio.play().catch(err => console.error('Error playing audio:', err));
    } else {
      // If we don't have a URL yet, generate one first
      generateDemoAudio(speakerId, speakerSpeeds[speakerId] || 1.0);
    }
  };
  
  // Handle reset for a speaker
  const handleReset = (e: React.MouseEvent, speakerId: number) => {
    e.preventDefault();
    e.stopPropagation();
    onSpeedChange(speakerId, 1.0);
    
    // Clear existing demo audio for this speaker
    setDemoAudio(prev => {
      const newState = { ...prev };
      delete newState[speakerId];
      return newState;
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div 
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Voice Speed Settings
          </h3>
          <button
            onClick={onClose}
            type="button"
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-6">
          {speakers.map((speaker) => (
            <div key={speaker.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center mb-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                  speaker.gender === 'Female' ? 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                }`}>
                  {speaker.gender === 'Female' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{speaker.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{speaker.gender}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Voice Speed: {(speakerSpeeds[speaker.id] || 1.0).toFixed(1)}x
                  </span>
                  <button
                    onClick={(e) => handleReset(e, speaker.id)}
                    type="button"
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Reset to 1.0x
                  </button>
                </div>
                
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.1"
                  value={speakerSpeeds[speaker.id] || 1.0}
                  onChange={(e) => {
                    const newSpeed = parseFloat(e.target.value);
                    onSpeedChange(speaker.id, newSpeed);
                    // Clear existing demo audio when speed changes
                    setDemoAudio(prev => {
                      const newState = { ...prev };
                      delete newState[speaker.id];
                      return newState;
                    });
                  }}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-200 dark:bg-gray-700"
                  style={{
                    background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${(((speakerSpeeds[speaker.id] || 1.0) - 0.5) / 1) * 100}%, #E5E7EB ${(((speakerSpeeds[speaker.id] || 1.0) - 0.5) / 1) * 100}%, #E5E7EB 100%)`
                  }}
                />
                
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Slower (0.5x)</span>
                  <span>Normal (1.0x)</span>
                  <span>Faster (1.5x)</span>
                </div>
                
                <div className="flex justify-center space-x-2 pt-2">
                  {[0.5, 0.7, 1.0, 1.2, 1.5].map((speed) => (
                    <button
                      key={speed}
                      type="button"
                      onClick={() => onSpeedChange(speaker.id, speed)}
                      className={`px-2 py-1 text-xs rounded-md ${
                        (speakerSpeeds[speaker.id] || 1.0) === speed
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {speed.toFixed(1)}x
                    </button>
                  ))}
                </div>
                
                {/* Demo Audio Button */}
                <div className="flex justify-center mt-4">
                  <button
                    type="button"
                    onClick={() => playDemoAudio(speaker.id)}
                    disabled={demoLoading[speaker.id]}
                    className={`flex items-center rounded-md px-4 py-2 text-sm font-medium ${
                      demoLoading[speaker.id]
                        ? 'bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-800/50'
                    }`}
                  >
                    {demoLoading[speaker.id] ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating Demo...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {demoAudio[speaker.id] ? 'Play' : 'Generate Demo'}
                      </>
                    )}
                  </button>
                </div>
                
                {/* Hidden audio elements for demo playback */}
                {demoAudio[speaker.id] && (
                  <audio
                    src={demoAudio[speaker.id]}
                    ref={(el) => { audioRefs.current[speaker.id] = el; }}
                    className="hidden"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => {
              // Reset all speakers to 1.0
              speakers.forEach(speaker => onSpeedChange(speaker.id, 1.0));
              // Clear all demo audio
              setDemoAudio({});
            }}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            Reset All
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}