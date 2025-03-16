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

  const bubbleClass = 
    item.speaker.includes("MC1") ? "bg-blue-50" :
    item.speaker.includes("MC2") ? "bg-yellow-50" : 
    "bg-gray-50";

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-2 p-4 bg-gray-100 flex items-center">
          <div className="font-bold">{item.speaker}</div>
        </div>
        
        <div className={`col-span-8 p-4 ${bubbleClass}`}>
          {isEditMode ? (
            <div>
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full p-2 border rounded min-h-24"
              />
              <div className="mt-2 space-x-2">
                <button
                  onClick={handleSave}
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                >
                  ✅ Update
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-600 text-white px-3 py-1 rounded text-sm"
                >
                  ❌ Cancel
                </button>
              </div>
            </div>
          ) : (
            <div onClick={() => setIsEditMode(true)} className="cursor-pointer">
              <p>{item.content}</p>
            </div>
          )}
        </div>
        
        <div className="col-span-2 p-4 flex items-center justify-center">
          {audioUrl ? (
            <AudioPlayer src={audioUrl} showControls={true} />
          ) : (
            <button className="bg-gray-200 hover:bg-gray-300 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}