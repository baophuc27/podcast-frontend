'use client';

import { useState, FormEvent, useEffect } from 'react';
import Image from 'next/image';

type SpeakerProfile = {
  id: number;
  name: string;
  gender: string;
  age: number;
  mc_guidelines: string;
};

type PodcastData = {
  speaker: string;
  content: string;
};

type AudioFiles = {
  [key: string]: string[];
};

type APIResponse = {
  status_code: number;
  data: PodcastData[];
  audio_files?: AudioFiles;
  full_audio_path?: string;
  error?: string;
};

export default function PodcastGenerator() {
  const [urls, setUrls] = useState<string>('');
  const [guidelines, setGuidelines] = useState<string>('');
  const [podcastType, setPodcastType] = useState<string>('Discussion');
  const [duration, setDuration] = useState<number>(3);
  const [maxRevisions, setMaxRevisions] = useState<number>(1);
  const [selectedSpeakers, setSelectedSpeakers] = useState<number[]>([0, 1]);
  const [loading, setLoading] = useState<boolean>(false);
  const [apiResponse, setApiResponse] = useState<APIResponse | null>(null);
  const [audioProgress, setAudioProgress] = useState<number>(0);
  const [editModes, setEditModes] = useState<{ [key: string]: boolean }>({});
  const [editedPodcastData, setEditedPodcastData] = useState<PodcastData[]>([]);
  const [generatedFinal, setGeneratedFinal] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Define speaker profiles
  const SPEAKER_PROFILES: SpeakerProfile[] = [
    {
      id: 0,
      name: "Hương Linh",
      gender: "Female",
      age: 20,
      mc_guidelines: "+ Explanatory \n+ Comparative\n+ Reflective"
    },
    {
      id: 1,
      name: "Minh Tú",
      gender: "Male",
      age: 30,
      mc_guidelines: "+ Formal \n+ Informative \n+ Descriptive \n+ Objective"
    }
  ];

  useEffect(() => {
    // Initialize edited podcast data when API response changes
    if (apiResponse?.data && editedPodcastData.length === 0) {
      setEditedPodcastData([...apiResponse.data]);
    }
  }, [apiResponse]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setApiResponse(null);
    setAudioProgress(0);
    setEditModes({});
    setEditedPodcastData([]);
    setGeneratedFinal(false);
    setError(null); // Reset error state

    const urlList = urls.split('\n').filter(url => url.trim().length > 0);
    
    if (urlList.length === 0) {
      alert('Please enter at least one URL');
      setLoading(false);
      return;
    }

    if (selectedSpeakers.length === 0) {
      alert('Please select at least one speaker');
      setLoading(false);
      return;
    }

    const payload = {
      input_urls: urlList,
      guidelines: guidelines,
      duration: duration,
      speaker_ids: selectedSpeakers,
      podcast_type: podcastType,
      max_revisions: maxRevisions,
      speaker_profiles: SPEAKER_PROFILES.filter(profile => selectedSpeakers.includes(profile.id))
    };

    try {
      // Make API call to your backend
      const response = await fetch('/api/podcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const responseData: APIResponse = await response.json();

      // If successful and generate audio is requested
      if (responseData.status_code === 0) {
        // Simulate audio generation progress
        let progress = 0;
        const interval = setInterval(() => {
          progress += 5;
          setAudioProgress(progress);
          if (progress >= 100) {
            clearInterval(interval);
          }
        }, 300);

        // In a real app, you would call your audio generation API here
        // For now, we're simulating this process
        setTimeout(() => {
          clearInterval(interval);
          setAudioProgress(100);
          
          // In a real implementation, you would get the audio files from the API
          setApiResponse(responseData);
          setLoading(false);
        }, 6000);
      } else {
        setApiResponse(responseData);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error generating podcast:', error);
      setError('Failed to connect to the podcast generation service. Please check if the backend service is running.');
      setApiResponse({
        status_code: -1,
        data: [],
        error: 'Failed to generate podcast. Please try again.'
      });
      setLoading(false);
    }
  };

  const toggleEditMode = (idx: number) => {
    const utteranceKey = `utterance_${idx}`;
    setEditModes(prev => ({
      ...prev,
      [utteranceKey]: !prev[utteranceKey]
    }));
  };

  const updateContent = (idx: number, newContent: string) => {
    const updatedData = [...editedPodcastData];
    updatedData[idx].content = newContent;
    setEditedPodcastData(updatedData);
  };

  const regenerateFullPodcast = async () => {
    setLoading(true);
    
    // In a real implementation, you would call your API to regenerate the audio
    // For now, let's simulate the process
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setAudioProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 150);

    setTimeout(() => {
      clearInterval(interval);
      setAudioProgress(100);
      setGeneratedFinal(true);
      setLoading(false);
    }, 3000);
  };

  // Demo mode - simulates a successful response for development without backend
  const handleDemoMode = () => {
    setLoading(true);
    setApiResponse(null);
    setAudioProgress(0);
    setEditModes({});
    setEditedPodcastData([]);
    setGeneratedFinal(false);
    setError(null);

    // Simulate loading
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setAudioProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 100);

    // Simulate API response
    setTimeout(() => {
      clearInterval(interval);
      setAudioProgress(100);
      
      const demoData = [
        {
          speaker: "MC1 (Hương Linh)",
          content: "Hello and welcome to our podcast! Today we'll be discussing the latest developments in artificial intelligence and how they're shaping our world."
        },
        {
          speaker: "MC2 (Minh Tú)",
          content: "That's right. AI has been making tremendous progress in recent years, with applications ranging from healthcare to transportation. Let's dive into some of the most interesting breakthroughs."
        },
        {
          speaker: "MC1 (Hương Linh)",
          content: "One area where AI is making a significant impact is healthcare. Machine learning algorithms are now capable of diagnosing diseases with accuracy comparable to human doctors."
        },
        {
          speaker: "MC2 (Minh Tú)",
          content: "Indeed. A recent study published in Nature Medicine showed that AI systems could detect certain types of cancer earlier than traditional methods. This could potentially save thousands of lives."
        }
      ];
      
      setApiResponse({
        status_code: 0,
        data: demoData
      });
      
      setEditedPodcastData(demoData);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold text-blue-600 mb-2">Podcast Generator</h1>
      
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium">Connection Error</h3>
              <div className="mt-2 text-sm">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={handleDemoMode}
                  type="button"
                  className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
                >
                  Try Demo Mode (No backend required)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="mb-8 bg-gray-50 p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block mb-2 font-medium">Input URLs (one per line)</label>
          <textarea 
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={4}
            placeholder="https://example.com/article1&#10;https://example.com/article2"
            value={urls}
            onChange={(e) => setUrls(e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-2 font-medium">Guidelines</label>
            <input 
              type="text"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Custom guidelines"
              value={guidelines}
              onChange={(e) => setGuidelines(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block mb-2 font-medium">Podcast Type</label>
            <select 
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={podcastType}
              onChange={(e) => setPodcastType(e.target.value)}
            >
              <option value="Discussion">Discussion</option>
            </select>
          </div>
          
          <div>
            <label className="block mb-2 font-medium">Duration (minutes)</label>
            <input 
              type="number"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min={1}
              max={6}
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
            />
          </div>
          
          <div>
            <label className="block mb-2 font-medium">Maximum Revisions</label>
            <input 
              type="number"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min={1}
              max={5}
              value={maxRevisions}
              onChange={(e) => setMaxRevisions(parseInt(e.target.value))}
            />
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="font-medium mb-2">Speaker Selection</h3>
          <p className="text-sm text-gray-600 mb-2">Select which voices to use in your podcast</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SPEAKER_PROFILES.map((speaker) => (
              <div key={speaker.id} className="bg-white p-4 rounded shadow-sm">
                <div className="flex items-center">
                  <input 
                    type="checkbox"
                    id={`speaker-${speaker.id}`}
                    checked={selectedSpeakers.includes(speaker.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedSpeakers([...selectedSpeakers, speaker.id]);
                      } else {
                        setSelectedSpeakers(selectedSpeakers.filter(id => id !== speaker.id));
                      }
                    }}
                    className="mr-2 h-4 w-4 text-blue-600"
                  />
                  <label htmlFor={`speaker-${speaker.id}`} className="font-medium">
                    {speaker.gender} ({speaker.name})
                  </label>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  <p><strong>Age:</strong> {speaker.age}</p>
                  <p><strong>Style:</strong></p>
                  <pre className="whitespace-pre-wrap text-sm">
                    {speaker.mc_guidelines.replace(/\+/g, '•').trim()}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex space-x-4">
          <button 
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Generating...' : '🎙️ Generate Draft'}
          </button>
          
          <button 
            type="button"
            onClick={handleDemoMode}
            className="bg-gray-600 text-white px-6 py-3 rounded-md font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
          >
            Demo Mode
          </button>
        </div>
      </form>

      {loading && (
        <div className="mt-8 mb-12">
          <div className="bg-blue-50 p-4 rounded-md mb-4">
            <p className="text-blue-700">Your podcast is being generated. This may take a few minutes.</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
            <div 
              className="bg-blue-600 h-4 rounded-full transition-all duration-300 ease-in-out" 
              style={{width: `${audioProgress}%`}}
            ></div>
          </div>
          <p className="text-gray-600 text-sm">{audioProgress}% complete</p>
        </div>
      )}

      {apiResponse && (
        <div className="mt-8">
          {apiResponse.status_code === 0 ? (
            <div className="bg-green-50 p-4 rounded-md mb-6">
              <p className="text-green-700">✅ Success! Podcast generated successfully (Status Code: {apiResponse.status_code})</p>
            </div>
          ) : (
            <div className="bg-yellow-50 p-4 rounded-md mb-6">
              <p className="text-yellow-700">⚠️ Status Code: {apiResponse.status_code}</p>
              {apiResponse.error && <p className="text-red-600 mt-2">{apiResponse.error}</p>}
            </div>
          )}

          {editedPodcastData.length > 0 && (
            <>
              <h2 className="text-xl font-bold mb-4">Podcast Script and Audio</h2>
              
              <div className="space-y-4 mb-6">
                {editedPodcastData.map((item, idx) => {
                  const utteranceKey = `utterance_${idx}`;
                  const isEditMode = editModes[utteranceKey];
                  const bubbleClass = 
                    item.speaker.includes("MC1") ? "bg-blue-50" :
                    item.speaker.includes("MC2") ? "bg-yellow-50" : 
                    "bg-gray-50";
                  
                  return (
                    <div key={idx} className="border rounded-md overflow-hidden">
                      <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-2 p-4 bg-gray-100 flex items-center">
                          <div className="font-bold">{item.speaker}</div>
                        </div>
                        
                        <div className={`col-span-8 p-4 ${bubbleClass}`}>
                          {isEditMode ? (
                            <div>
                              <textarea
                                value={item.content}
                                onChange={(e) => updateContent(idx, e.target.value)}
                                className="w-full p-2 border rounded min-h-24"
                              />
                              <div className="mt-2 space-x-2">
                                <button
                                  onClick={() => toggleEditMode(idx)}
                                  className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                                >
                                  ✅ Update
                                </button>
                                <button
                                  onClick={() => toggleEditMode(idx)}
                                  className="bg-gray-600 text-white px-3 py-1 rounded text-sm"
                                >
                                  ❌ Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div onClick={() => toggleEditMode(idx)} className="cursor-pointer">
                              <p>{item.content}</p>
                            </div>
                          )}
                        </div>
                        
                        <div className="col-span-2 p-4 flex items-center justify-center">
                          {/* In a real implementation, you would use actual audio files */}
                          <button className="bg-gray-200 hover:bg-gray-300 p-2 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
                              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={regenerateFullPodcast}
                  disabled={loading}
                  className="bg-orange-600 text-white px-4 py-2 rounded-md font-medium hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  🔄 Generate Final Podcast
                </button>
                
                <button
                  className="bg-gray-600 text-white px-4 py-2 rounded-md font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Download Script
                </button>
              </div>
              
              {generatedFinal && (
                <div className="mt-6 p-6 bg-gray-50 rounded-lg shadow-md">
                  <h2 className="text-xl font-bold mb-4">Full Podcast</h2>
                  
                  <div className="w-full bg-white p-4 rounded-md border">
                    <audio controls className="w-full mb-4">
                      <source src="" type="audio/wav" />
                      Your browser does not support the audio element.
                    </audio>
                    
                    <button
                      className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Download Full Podcast Audio
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}