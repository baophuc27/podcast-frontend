'use client';

import { useState, useRef, useEffect } from 'react';

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

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleDurationChange = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      audio.currentTime = 0;
    };

    const handleError = (e: ErrorEvent) => {
      console.error("Audio playback error:", e);
      setError("Unable to play audio. The audio file may not be available.");
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError as EventListener);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError as EventListener);
    };
  }, []);

  // Reset error state when src changes
  useEffect(() => {
    setError(null);
  }, [src]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      // Use a promise to catch play() errors (common in browsers)
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(err => {
            console.error("Playback failed:", err);
            setError("Playback failed. This may be due to browser autoplay restrictions or missing audio file.");
            setIsPlaying(false);
          });
      }
    }

    setIsPlaying(!isPlaying);
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Check if src is valid
  const isValidSrc = src && src.trim().length > 0;

  return (
    <div className={`flex flex-col ${className}`}>
      {isValidSrc ? (
        <>
          <audio
            ref={audioRef}
            src={src}
            autoPlay={autoPlay}
            preload="metadata"
            className={showControls ? 'hidden' : 'w-full'}
          />

          {error && (
            <div className="text-red-500 text-sm mb-2">
              {error}
            </div>
          )}

          {showControls && (
            <div className="flex flex-col w-full">
              <div className="flex items-center gap-2 mb-1">
                <button
                  onClick={togglePlayPause}
                  disabled={!!error}
                  className={`p-2 rounded-full ${error ? 'bg-gray-400' : 'bg-blue-600'} text-white hover:${error ? 'bg-gray-400' : 'bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  {isPlaying ? (
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
                    disabled={!!error || duration === 0}
                    className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${error || duration === 0 ? 'bg-gray-200 opacity-50' : 'bg-gray-200'}`}
                  />
                </div>

                <div className="text-sm text-gray-600 w-16 text-right">
                  {formatTime(currentTime)} / {formatTime(duration || 0)}
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center justify-center p-4 bg-gray-100 rounded-md">
          <span className="text-gray-500">Audio not available</span>
        </div>
      )}
    </div>
  );
}