'use client';

interface PodcastProgressProps {
  progress: number;
  message?: string;
}

export default function PodcastProgress({ 
  progress, 
  message = "Your podcast is being generated. This may take a few minutes." 
}: PodcastProgressProps) {
  return (
    <div className="mt-8 mb-12">
      <div className="bg-blue-50 p-4 rounded-md mb-4">
        <p className="text-blue-700">{message}</p>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
        <div 
          className="bg-blue-600 h-4 rounded-full transition-all duration-300 ease-in-out" 
          style={{width: `${progress}%`}}
        ></div>
      </div>
      <p className="text-gray-600 text-sm">{progress}% complete</p>
    </div>
  );
}