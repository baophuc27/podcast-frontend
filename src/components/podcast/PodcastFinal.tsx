'use client';

interface PodcastFinalProps {
  audioUrl?: string;
}

export default function PodcastFinal({ audioUrl }: PodcastFinalProps) {
  return (
    <div className="mt-6 p-6 bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Full Podcast</h2>
      
      <div className="w-full bg-white p-4 rounded-md border">
        <audio controls className="w-full mb-4">
          <source src={audioUrl || ''} type="audio/wav" />
          Your browser does not support the audio element.
        </audio>
        
        <button
          disabled={!audioUrl}
          onClick={() => {
            if (audioUrl) {
              window.open(audioUrl, '_blank');
            }
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          Download Full Podcast Audio
        </button>
      </div>
    </div>
  );
}