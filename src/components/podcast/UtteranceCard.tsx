// src/components/podcast/UtteranceCard.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { PodcastData } from '@/types/podcast';
import AudioPlayer from './AudioPlayer';

interface UtteranceCardProps {
  item: PodcastData;
  index: number;
  audioUrl?: string;
  cdnUrl?: string; // Add CDN URL prop
  onUpdate: (index: number, newContent: string) => void;
  onRegenerateAudio?: () => void;
  isRegenerating?: boolean;
  disableRegeneration?: boolean;
  audioGenerating?: boolean;
}

export default function UtteranceCard({ 
  item, 
  index, 
  audioUrl, 
  cdnUrl, // New prop
  onUpdate,
  onRegenerateAudio,
  isRegenerating = false,
  disableRegeneration = false,
  audioGenerating = false
}: UtteranceCardProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState(item.content);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const previousContentRef = useRef(item.content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Update content if it changes from parent - with fix to prevent infinite loops
  useEffect(() => {
    if (item.content !== previousContentRef.current) {
      setEditedContent(item.content);
      previousContentRef.current = item.content;
    }
  }, [item.content]);

  // Auto-focus textarea and auto-resize when in edit mode
  useEffect(() => {
    if (isEditMode && textareaRef.current) {
      textareaRef.current.focus();
      adjustTextareaHeight(textareaRef.current);
    }
  }, [isEditMode]);

  // Handle mode transition with animation
  const toggleEditMode = (toEdit: boolean) => {
    setIsTransitioning(true);
    
    // Short delay for the animation to play
    setTimeout(() => {
      setIsEditMode(toEdit);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 150);
  };

  const handleSave = () => {
    // Only update and regenerate if content actually changed
    if (editedContent !== item.content) {
      onUpdate(index, editedContent);
      
      // Automatically regenerate audio when script is updated
      if (onRegenerateAudio && !disableRegeneration && !isRegenerating && !audioGenerating) {
        onRegenerateAudio();
      }
    }
    
    toggleEditMode(false);
  };

  const handleCancel = () => {
    setEditedContent(item.content);
    toggleEditMode(false);
  };

  // Auto-resize textarea to fit content
  const adjustTextareaHeight = (element: HTMLTextAreaElement) => {
    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight}px`;
  };

  // Function to handle audio download - using the CDN URL directly
  const handleDownloadAudio = () => {
    // Prefer CDN URL if available, otherwise use local audioUrl
    const downloadUrl = cdnUrl || audioUrl;
    
    if (!downloadUrl) {
      console.log("No URL available for download");
      return;
    }
    
    console.log(`Opening download URL: ${downloadUrl}`);
    
    // Open the audio URL in a new tab - this is the same approach used in PodcastFinal
    window.open(downloadUrl, '_blank');
  };

  // Get speaker style classes based on speaker type
  const getSpeakerColorClass = () => {
    if (item.speaker.includes("MC1")) {
      return {
        bg: 'bg-blue-50 dark:bg-blue-900/30',
        border: 'border-blue-200 dark:border-blue-800',
        icon: 'bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-300',
        text: 'text-blue-700 dark:text-blue-300',
        audioBtn: 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600',
        lightBg: 'bg-blue-50 dark:bg-blue-900/20',
        lightBorder: 'border-blue-100 dark:border-blue-900'
      };
    } else if (item.speaker.includes("MC2")) {
      return {
        bg: 'bg-amber-50 dark:bg-amber-900/30',
        border: 'border-amber-200 dark:border-amber-800',
        icon: 'bg-amber-100 text-amber-600 dark:bg-amber-800 dark:text-amber-300',
        text: 'text-amber-700 dark:text-amber-300',
        audioBtn: 'bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-600',
        lightBg: 'bg-amber-50 dark:bg-amber-900/20',
        lightBorder: 'border-amber-100 dark:border-amber-900'
      };
    } else {
      return {
        bg: 'bg-gray-50 dark:bg-gray-800/50',
        border: 'border-gray-200 dark:border-gray-700',
        icon: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
        text: 'text-gray-700 dark:text-gray-300',
        audioBtn: 'bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600',
        lightBg: 'bg-gray-50 dark:bg-gray-800/30',
        lightBorder: 'border-gray-100 dark:border-gray-800'
      };
    }
  };

  const colorClass = getSpeakerColorClass();

  return (
    <div className={`rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border ${colorClass.border}`}>
      {/* Speaker header section */}
      <div className={`p-3 ${colorClass.bg} flex justify-between items-center border-b ${colorClass.border}`}>
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
          </div>
        </div>
        
        {/* Edit/Save Actions */}
        <div className="flex items-center gap-2">
          {isEditMode ? (
            <>
              <button
                onClick={handleSave}
                className={`bg-green-600 hover:bg-green-700 text-white p-2.5 rounded-full flex items-center justify-center transition-all shadow-sm ${isTransitioning ? 'scale-95 opacity-70' : 'scale-100 opacity-100'}`}
                title="Save changes"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </button>
              <button
                onClick={handleCancel}
                className={`bg-gray-600 hover:bg-gray-700 text-white p-2.5 rounded-full flex items-center justify-center transition-all shadow-sm ${isTransitioning ? 'scale-95 opacity-70' : 'scale-100 opacity-100'}`}
                title="Cancel"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </>
          ) : (
            <button
              onClick={() => toggleEditMode(true)}
              className={`bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 p-2.5 rounded-full flex items-center justify-center transition-all shadow-sm border border-gray-200 dark:border-gray-600 ${isTransitioning ? 'scale-95 opacity-70' : 'scale-100 opacity-100'}`}
              title="Edit script"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          )}
        </div>
      </div>
      
      {/* Content and Audio section - side by side */}
      <div className="flex flex-col md:flex-row">
        {/* Content area with animation */}
        <div className={`flex-1 p-4 bg-white dark:bg-gray-800 ${isEditMode ? 'md:w-full' : ''} transition-all duration-300`}>
          <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-0 transform translate-y-2' : 'opacity-100 transform translate-y-0'}`}>
            {isEditMode ? (
              <textarea
                ref={textareaRef}
                value={editedContent}
                onChange={(e) => {
                  setEditedContent(e.target.value);
                  adjustTextareaHeight(e.target);
                }}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md min-h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none transition-colors duration-200"
                placeholder="Enter the speaker's dialogue here..."
              />
            ) : (
              <div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{item.content}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Audio player section - only show when not editing, with animations */}
        {!isEditMode && (
          <div className={`md:w-52 p-3 ${colorClass.lightBg} border-t md:border-t-0 md:border-l ${colorClass.border} flex flex-col justify-center transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
            {isRegenerating && (
              <div className="flex items-center mb-2 justify-center">
                <span className="flex items-center text-xs font-medium text-amber-600 dark:text-amber-400">
                  <svg className="animate-spin h-3 w-3 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Regenerating audio...
                </span>
              </div>
            )}
            
            {/* Show waiting status if audio is still generating */}
            {!isRegenerating && audioGenerating && !audioUrl && (
              <div className="flex items-center mb-2 justify-center">
                <span className="flex items-center text-xs font-medium text-blue-600 dark:text-blue-400">
                  <svg className="animate-spin h-3 w-3 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating audio...
                </span>
              </div>
            )}
            
            <AudioPlayer 
              src={audioUrl || ''} 
              showControls={true} 
              className="w-full" 
            />
            
            {/* Audio utility buttons container */}
            <div className="flex gap-2 mt-3">
              {/* Download Button - Only show when CDN URL or audio is available */}
              {(cdnUrl || audioUrl) && (
                <button
                  onClick={handleDownloadAudio}
                  className={`p-2 rounded-md text-xs font-medium flex items-center justify-center transition-colors flex-1
                    ${(!cdnUrl && !audioUrl)
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                      : `${colorClass.lightBg} border ${colorClass.lightBorder} ${colorClass.text} hover:bg-gray-100 dark:hover:bg-gray-700`
                    }
                  `}
                  disabled={!cdnUrl && !audioUrl}
                  title={(cdnUrl || audioUrl) ? "Download audio" : "No audio available"}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </button>
              )}
              
              {/* Show regenerate button only when not in generating state and we have audio */}
              {audioUrl && !audioGenerating && onRegenerateAudio && (
                <button
                  onClick={onRegenerateAudio}
                  disabled={disableRegeneration || isRegenerating}
                  className={`p-2 rounded-md text-xs font-medium flex items-center justify-center transition-colors flex-1
                    ${
                      disableRegeneration || isRegenerating
                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        : `${colorClass.lightBg} border ${colorClass.lightBorder} ${colorClass.text} hover:bg-gray-100 dark:hover:bg-gray-700`
                    }
                  `}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Regenerate
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}