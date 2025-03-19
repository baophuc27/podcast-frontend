'use client';

import { useState, useRef, useEffect } from 'react';

interface PodcastFinalProps {
  audioUrl?: string;
}

export default function PodcastFinal({ audioUrl }: PodcastFinalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const previousUrlRef = useRef(audioUrl);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Only set up event handlers once
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleDurationChange = () => {
      setDuration(audio.duration);
      setLoading(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      audio.currentTime = 0;
    };

    const handleCanPlay = () => {
      setLoading(false);
      setError(null);
    };
    
    const handleError = () => {
      console.error("Error loading audio:", audioUrl);
      setError("Unable to load audio. The file may be unavailable or in an unsupported format.");
      setLoading(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
    };
  }, []); // Empty dependency array - only run once

  // Handle audioUrl changes separately
  useEffect(() => {
    if (audioUrl !== previousUrlRef.current) {
      setLoading(true);
      setIsPlaying(false);
      setCurrentTime(0);
      setError(null);
      previousUrlRef.current = audioUrl;
      
      console.log("Audio URL updated:", audioUrl);
      
      // Validate the URL
      if (audioUrl && !audioUrl.startsWith('http') && !audioUrl.startsWith('/')) {
        console.warn("Invalid audio URL format:", audioUrl);
        setError("Invalid audio URL format");
        setLoading(false);
      }
    }
  }, [audioUrl]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio || loading) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(error => {
        console.error('Error playing audio:', error);
      });
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (timeInSeconds: number): string => {
    if (isNaN(timeInSeconds)) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatDuration = (seconds: number): string => {
    if (isNaN(seconds) || seconds === 0) return "";
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    return `${minutes} min ${remainingSeconds} sec`;
  };

  return (
    <div className="mt-8 mb-12 bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-100 dark:border-gray-700 p-6 transition-all animate-fade-in">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Final Podcast
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            {formatDuration(duration) ? (
              <>Duration: <span className="font-medium">{formatDuration(duration)}</span></>
            ) : 'Your podcast has been created successfully'}
          </p>
        </div>
        
        <button
          disabled={!audioUrl}
          onClick={() => {
            if (audioUrl) {
              window.open(audioUrl, '_blank');
            }
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download Full Podcast
        </button>
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 p-3 mb-4 rounded-md border border-red-200 dark:border-red-800">
            <div className="flex">
              <svg className="h-5 w-5 text-red-500 dark:text-red-400 mt-0.5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        <audio ref={audioRef} src={audioUrl} className="hidden" />
        
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={togglePlayPause}
            disabled={!audioUrl || loading || !!error}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              !audioUrl || loading || !!error
                ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600'
            } text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </button>
          
          <div className="flex-1">
            <div className="flex items-center justify-between gap-4 mb-1">
              <span className="text-sm text-gray-600 dark:text-gray-400 font-mono">{formatTime(currentTime)}</span>
              <span className="text-sm text-gray-600 dark:text-gray-400 font-mono">{formatTime(duration)}</span>
            </div>
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleProgressChange}
              disabled={!audioUrl || duration === 0 || loading || !!error}
              className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${
                !audioUrl || duration === 0 || loading || !!error
                  ? 'bg-gray-200 dark:bg-gray-700 opacity-50'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
              style={{
                background: audioUrl && duration > 0 && !loading && !error
                  ? `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${(currentTime / duration) * 100}%, #E5E7EB ${(currentTime / duration) * 100}%, #E5E7EB 100%)`
                  : undefined
              }}
            />
          </div>
        </div>
        
        <div className="flex items-center justify-center mt-4">
          <div className="flex items-center space-x-4">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.465a5 5 0 001.897-7.72m-3.95 10.5a9 9 0 0111.556-1.226L9.516 23.362l-4.983-4.983z" />
                </svg>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">MP3</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">320kbps</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Share-ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}