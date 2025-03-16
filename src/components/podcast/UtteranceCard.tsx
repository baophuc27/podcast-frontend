'use client';

import { useState } from 'react';
import { PodcastData } from '@/types/podcast';
import AudioPlayer from './AudioPlayer';

interface UtteranceCardProps {
  item: PodcastData;
  index: number;
  audioUrl?: string;
  onUpdate: (index: number, newContent: string) => void;
}

export default function UtteranceCard({ 
  item, 
  index, 
  audioUrl, 
  onUpdate 
}: UtteranceCardProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState(item.content);

  const handleSave = () => {
    onUpdate(index, editedContent);
    setIsEditMode(false);
  };

  const handleCancel = () => {
    setEditedContent(item.content);
    setIsEditMode(false);
  };

  const getSpeakerColorClass = () => {
    if (item.speaker.includes("MC1")) {
      return {
        bg: 'bg-blue-50 dark:bg-blue-900/30',
        border: 'border-blue-200 dark:border-blue-800',
        icon: 'bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-300',
        text: 'text-blue-700 dark:text-blue-300'
      };
    } else if (item.speaker.includes("MC2")) {
      return {
        bg: 'bg-amber-50 dark:bg-amber-900/30',
        border: 'border-amber-200 dark:border-amber-800',
        icon: 'bg-amber-100 text-amber-600 dark:bg-amber-800 dark:text-amber-300',
        text: 'text-amber-700 dark:text-amber-300'
      };
    } else {
      return {
        bg: 'bg-gray-50 dark:bg-gray-800/50',
        border: 'border-gray-200 dark:border-gray-700',
        icon: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
        text: 'text-gray-700 dark:text-gray-300'
      };
    }
  };

  const colorClass = getSpeakerColorClass();

  return (
    <div className={`rounded-lg overflow-hidden shadow-sm border ${colorClass.border} transition-all duration-200 hover:shadow-md`}>
      <div className="flex flex-col md:flex-row">
        <div className={`md:w-1/4 lg:w-1/5 p-4 ${colorClass.bg} flex flex-row md:flex-col justify-between md:justify-start items-center md:items-start gap-4`}>
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${colorClass.icon}`}>
              {item.speaker.includes("MC1") ? (
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
              <h4 className={`font-bold ${colorClass.text}`}>{item.speaker}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">Speaker {index + 1}</p>
            </div>
          </div>
          
          <div className="md:mt-4 w-full">
            {audioUrl ? (
              <AudioPlayer src={audioUrl} showControls={true} className="md:mt-2" />
            ) : (
              <div className="flex justify-center md:justify-start">
                <button className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 p-2 rounded-full transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600 dark:text-gray-300">
                    <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex-1 p-4 bg-white dark:bg-gray-800">
          {isEditMode ? (
            <div>
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded min-h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              <div className="mt-3 flex gap-2">
                <button
                  onClick={handleSave}
                  className="bg-green-600 text-white px-4 py-2 rounded text-sm flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Update
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-600 text-white px-4 py-2 rounded text-sm flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{item.content}</p>
              <div className="mt-3">
                <button
                  onClick={() => setIsEditMode(true)}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium flex items-center transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Edit Script
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}