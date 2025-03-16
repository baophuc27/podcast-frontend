'use client';

import { PodcastData } from '@/types/podcast';
import UtteranceCard from './UtteranceCard';
import { generateScriptContent, createDownloadLink } from '@/lib/utils/podcast';

interface PodcastScriptProps {
  podcastData: PodcastData[];
  audioFiles?: { [key: string]: string[] };
  onUpdate: (index: number, newContent: string) => void;
  onGenerateFinal: () => void;
  loading: boolean;
}

export default function PodcastScript({
  podcastData,
  audioFiles,
  onUpdate,
  onGenerateFinal,
  loading
}: PodcastScriptProps) {
  const handleDownloadScript = () => {
    const scriptContent = generateScriptContent(podcastData);
    createDownloadLink(scriptContent, 'podcast-script.txt');
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Podcast Script and Audio</h2>
      
      <div className="space-y-4 mb-6">
        {podcastData.map((item, idx) => (
          <UtteranceCard
            key={idx}
            item={item}
            index={idx}
            audioUrl={audioFiles?.[`utterance_${idx}`]?.[0]}
            onUpdate={onUpdate}
          />
        ))}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <button
          onClick={onGenerateFinal}
          disabled={loading}
          className="bg-orange-600 text-white px-4 py-2 rounded-md font-medium hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50"
        >
          🔄 Generate Final Podcast
        </button>
        
        <button
          onClick={handleDownloadScript}
          className="bg-gray-600 text-white px-4 py-2 rounded-md font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Download Script
        </button>
      </div>
    </div>
  );
}