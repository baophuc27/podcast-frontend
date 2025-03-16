'use client';

import React from 'react';

interface SpeedControlProps {
  speakerId: number;
  currentSpeed: number;
  onChange: (speakerId: number, newSpeed: number) => void;
}

export default function SpeedControl({ speakerId, currentSpeed, onChange }: SpeedControlProps) {
  // Fix reset button to prevent form submission
  const handleReset = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    e.stopPropagation(); // Stop event propagation
    onChange(speakerId, 1.0);
  };

  return (
    <div className="flex flex-col space-y-2">
      <label className="flex justify-between items-center text-sm font-medium text-gray-700 dark:text-gray-300">
        <span>Voice Speed: {currentSpeed.toFixed(1)}x</span>
        <button 
          onClick={handleReset}
          type="button" // Explicitly set button type to prevent form submission
          className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
        >
          Reset
        </button>
      </label>
      <input
        type="range"
        min="0.5"
        max="1.5"
        step="0.1"
        value={currentSpeed}
        onChange={(e) => onChange(speakerId, parseFloat(e.target.value))}
        className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-200 dark:bg-gray-700"
        style={{
          background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${((currentSpeed - 0.5) / 1) * 100}%, #E5E7EB ${((currentSpeed - 0.5) / 1) * 100}%, #E5E7EB 100%)`
        }}
      />
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>0.5x</span>
        <span>1.0x</span>
        <span>1.5x</span>
      </div>
    </div>
  );
}