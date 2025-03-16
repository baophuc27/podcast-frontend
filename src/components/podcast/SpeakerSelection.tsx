'use client';

import { SpeakerProfile } from '@/types/podcast';
import { SPEAKER_PROFILES } from '@/lib/constants/speakers';

interface SpeakerSelectionProps {
  selectedSpeakers: number[];
  onChange: (selectedIds: number[]) => void;
}

export default function SpeakerSelection({ 
  selectedSpeakers, 
  onChange 
}: SpeakerSelectionProps) {
  const handleToggleSpeaker = (speakerId: number, isSelected: boolean) => {
    if (isSelected) {
      onChange([...selectedSpeakers, speakerId]);
    } else {
      onChange(selectedSpeakers.filter(id => id !== speakerId));
    }
  };

  return (
    <div className="mb-6">
      <h3 className="font-medium mb-4 text-gray-800 dark:text-gray-200 text-lg flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        Voice Selection
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Choose voices for your podcast speakers</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SPEAKER_PROFILES.map((speaker) => (
          <div 
            key={speaker.id} 
            className={`relative rounded-xl overflow-hidden transition-all duration-200 border-2 ${
              selectedSpeakers.includes(speaker.id) 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' 
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
            }`}
          >
            <input 
              type="checkbox"
              id={`speaker-${speaker.id}`}
              checked={selectedSpeakers.includes(speaker.id)}
              onChange={(e) => handleToggleSpeaker(speaker.id, e.target.checked)}
              className="sr-only"
            />
            <label 
              htmlFor={`speaker-${speaker.id}`} 
              className="block w-full cursor-pointer p-4"
            >
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                  speaker.gender === 'Female' ? 'bg-pink-100 text-pink-600' : 'bg-blue-100 text-blue-600'
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
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white text-lg">{speaker.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {speaker.gender}, {speaker.age} years
                  </p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 ${
                  selectedSpeakers.includes(speaker.id) 
                    ? 'border-blue-600 bg-blue-600' 
                    : 'border-gray-300 dark:border-gray-600'
                }`}>
                  {selectedSpeakers.includes(speaker.id) && (
                    <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  )}
                </div>
              </div>
              
              <div className="mt-3 text-sm text-gray-700 dark:text-gray-300">
                <div className="font-medium mb-1">Style:</div>
                <ul className="list-disc pl-5 space-y-1">
                  {speaker.mc_guidelines.split('+').filter(item => item.trim()).map((guideline, idx) => (
                    <li key={idx} className="text-sm">{guideline.trim()}</li>
                  ))}
                </ul>
              </div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}