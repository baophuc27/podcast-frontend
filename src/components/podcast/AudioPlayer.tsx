// src/components/podcast/AudioPlayer.tsx
'use client';

import { useState, useRef, useEffect, useMemo } from 'react';

interface AudioPlayerProps {
  src: string;
  showControls?: boolean;
  autoPlay?: boolean;
  className?: string;
}

export default function AudioPlayer({
  src,
  showControls = true,
  autoPlay = false,
  className = '',
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Process the source URL - using useMemo to avoid recalculation on every render
  const audioSrc = useMemo(() => {
    if (!src) return '';
    
    // If it's already an absolute URL, return it
    if (src.startsWith('http://') || src.startsWith('https://')) {
      return src;
    }
    
    // If it's a demo path, keep it as is
    if (src.startsWith('/demo/')) {
      return src;
    }
    
    // Convert backslashes to forward slashes
    const cleanPath = src.replace(/\\/g, '/');
    
    // Simple transformation to API route
    if (cleanPath.includes('podcast_audio')) {
      const parts = cleanPath.split('podcast_audio/');
      if (parts.length > 1) {
        return `/api/audio/${parts[1]}`;
      }
    }
    
    // Basic path transformation
    return `/api/audio/${cleanPath.split('/').filter(Boolean).slice(-2).join('/')}`;
  }, [src]);

  // Reset states when the src prop changes
  useEffect(() => {
    console.log(`Audio source changed to: ${src}`);
    console.log(`Processed to: ${audioSrc}`);
    
    setError(null);
    setLoading(true);
    setIsPlaying(false);
    setCurrentTime(0);
    
    if (!audioSrc) {
      setLoading(false);
    }
  }, [src, audioSrc]);

  // Handle audio element events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

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
    };

    const handleError = () => {
      console.error("Audio playback error for:", audioSrc);
      setError("Unable to play audio. The file may not be available.");
      setIsPlaying(false);
      setLoading(false);
    };

    // Add event listeners
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);
    
    // If the audio source exists, load it
    if (audioSrc) {
      audio.load();
    }

    // Clean up event listeners
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
    };
  }, [audioSrc]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio || loading) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {
            setError("Playback failed. This may be due to browser autoplay restrictions.");
            setIsPlaying(false);
          });
      }
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

  // Check if source is valid
  const isValidSrc = Boolean(audioSrc);

  return (
    <div className={`flex flex-col ${className}`}>
      {isValidSrc ? (
        <>
          <audio
            ref={audioRef}
            src={audioSrc}
            preload="metadata"
            className={showControls ? 'hidden' : 'w-full'}
          />

          {error && (
            <div className="text-red-500 dark:text-red-400 text-xs mb-2 bg-red-50 dark:bg-red-900/20 p-2 rounded border border-red-200 dark:border-red-800">
              {error}
            </div>
          )}

          {showControls && (
            <div className="flex flex-col w-full">
              <div className="flex items-center gap-2 mb-1">
                <button
                  onClick={togglePlayPause}
                  disabled={!!error || loading}
                  className={`p-2 rounded-full flex items-center justify-center transition-colors ${
                    error || loading 
                      ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600'
                  } text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {loading ? (
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : isPlaying ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="6" y="4" width="4" height="16"></rect>
                      <rect x="14" y="4" width="4" height="16"></rect>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                  )}
                </button>

                <div className="flex-1">
                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleProgressChange}
                    disabled={!!error || duration === 0 || loading}
                    className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${
                      error || duration === 0 || loading
                        ? 'bg-gray-200 dark:bg-gray-700 opacity-50' 
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                    style={{
                      background: !error && duration > 0 && !loading
                        ? `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${(currentTime / duration) * 100}%, #E5E7EB ${(currentTime / duration) * 100}%, #E5E7EB 100%)`
                        : undefined
                    }}
                  />
                </div>

                <div className="text-xs text-gray-600 dark:text-gray-400 w-16 text-right font-mono">
                  {formatTime(currentTime)} / {formatTime(duration || 0)}
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center justify-center p-3 bg-gray-100 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
          <span className="text-gray-500 dark:text-gray-400 text-sm">Audio not available</span>
        </div>
      )}
    </div>
  );
}