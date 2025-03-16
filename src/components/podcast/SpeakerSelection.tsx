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
      <h3 className="font-medium mb-2">Speaker Selection</h3>
      <p className="text-sm text-gray-600 mb-2">Select which voices to use in your podcast</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SPEAKER_PROFILES.map((speaker) => (
          <div key={speaker.id} className="bg-white p-4 rounded shadow-sm">
            <div className="flex items-center">
              <input 
                type="checkbox"
                id={`speaker-${speaker.id}`}
                checked={selectedSpeakers.includes(speaker.id)}
                onChange={(e) => handleToggleSpeaker(speaker.id, e.target.checked)}
                className="mr-2 h-4 w-4 text-blue-600"
              />
              <label htmlFor={`speaker-${speaker.id}`} className="font-medium">
                {speaker.gender} ({speaker.name})
              </label>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              <p><strong>Age:</strong> {speaker.age}</p>
              <p><strong>Style:</strong></p>
              <pre className="whitespace-pre-wrap text-sm">
                {speaker.mc_guidelines.replace(/\+/g, '•').trim()}
              </pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}