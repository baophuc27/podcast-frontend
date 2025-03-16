/**
 * Types for the podcast generator application
 */

export type SpeakerProfile = {
  id: number;
  name: string;
  gender: string;
  age: number;
  speaker_id?: number;
  mc_guidelines: string;
};

export type PodcastData = {
  speaker: string;
  content: string;
};

export type AudioFiles = {
  [key: string]: string[];
};

export type APIResponse = {
  status_code: number;
  data: PodcastData[];
  audio_files?: AudioFiles;
  full_audio_path?: string;
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