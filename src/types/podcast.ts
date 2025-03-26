// Update this in src/types/podcast.ts

export type PodcastData = {
  speaker: string;
  content: string;
  speed?: number;
  speakerProfile?: SpeakerProfile; // Add optional speakerProfile property
  cdnUrl?: string;
};

// Ensure we add speed to SpeakerProfile
export type SpeakerProfile = {
  id: number;
  name: string;
  gender: string;
  age: number;
  speaker_id?: number;
  mc_guidelines: string;
  speed?: number; // Add optional speed property
};

export type AudioFiles = {
  [key: string]: string[];
};

export type APIResponse = {
  status_code: number;
  data: PodcastData[];
  audio_files?: AudioFiles;
  individual_files?: { [key: string]: string[] };
  full_audio_path?: string;
  podcast_dir?: string; 
  cdn_urls?: { [key: string]: string }; // Add CDN URLs map
  error?: string;
};
// Updated PodcastGenerationPayload to include the new podcast types
export type PodcastGenerationPayload = {
  input_urls: string[];
  guidelines: string;
  duration: number;
  speaker_ids: number[];
  podcast_type: string; // Can be 'Solo Briefing', 'Alternating Briefing', or 'Discussion'
  max_revisions: number;
  speaker_profiles: SpeakerProfile[];
  speaker_speeds?: { [speakerId: number]: number }; // Optional speaker speeds
};