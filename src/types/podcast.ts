/**
 * Types for the podcast generator application
 */

export type PodcastData = {
  speaker: string;
  content: string;
  speakerProfile?: SpeakerProfile; // Add optional speakerProfile property
};

// Also ensure we add speed to SpeakerProfile
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
  podcast_dir?: string; // Add this to match the backend response
  error?: string;
};

export type PodcastGenerationPayload = {
  input_urls: string[];
  guidelines: string;
  duration: number;
  speaker_ids: number[];
  podcast_type: string;
  max_revisions: number;
  speaker_profiles: SpeakerProfile[];
};