/**
 * Utility functions for the podcast generator application
 */

import { PodcastData } from '@/types/podcast';

/**
 * Split a long utterance into smaller chunks suitable for TTS processing.
 */
export function splitLongUtterance(text: string): string[] {
  const words = text.split(/\s+/);
  
  // If text is less than 80 words, return as single chunk
  if (words.length <= 80) {
    return [text];
  }

  const sentences = text.split('.').filter(s => s.trim().length > 0);
  const chunks: string[] = [];
  let currentChunk: string[] = [];
  let currentWordCount = 0;

  for (const sentence of sentences) {
    const sentenceWords = sentence.trim().split(/\s+/);
    const sentenceWordCount = sentenceWords.length;

    // If adding this sentence keeps us under 80 words and we're over 50,
    // or if this is the first sentence in the chunk, add it
    if (currentWordCount + sentenceWordCount <= 80) {
      currentChunk.push(sentence);
      currentWordCount += sentenceWordCount;

      // If we're between 40-80 words, store the chunk and start a new one
      if (currentWordCount >= 40) {
        chunks.push(`${currentChunk.join('. ')}.`);
        currentChunk = [];
        currentWordCount = 0;
      }
    } else {
      if (currentChunk.length > 0) {
        chunks.push(`${currentChunk.join('. ')}.`);
      }

      currentChunk = [sentence];
      currentWordCount = sentenceWordCount;
    }
  }

  // Add any remaining chunk
  if (currentChunk.length > 0) {
    chunks.push(`${currentChunk.join('. ')}.`);
  }

  return chunks;
}

/**
 * Generate a script file from podcast data
 */
export function generateScriptContent(podcastData: PodcastData[]): string {
  return podcastData.map(item => {
    const formattedSpeaker = item.speaker.includes('MC1') 
      ? 'MC1' 
      : item.speaker.includes('MC2') 
        ? 'MC2' 
        : item.speaker;
        
    return `${formattedSpeaker}: ${item.content}`;
  }).join('\n\n');
}

/**
 * Format time in a human-readable format
 */
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Creates a download link for a blob
 */
export function createDownloadLink(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  
  // Trigger download
  document.body.appendChild(anchor);
  anchor.click();
  
  // Cleanup
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}