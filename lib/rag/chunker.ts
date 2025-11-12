/**
 * Chunks text into smaller pieces with overlap for better context preservation
 * @param text - The text to chunk
 * @param chunkSize - Target chunk size in tokens (default: 800)
 * @param overlap - Overlap size in tokens (default: 100)
 * @returns Array of text chunks
 */
export function chunkText(
  text: string,
  chunkSize: number = 800,
  overlap: number = 100
): string[] {
  // Simple token estimation: ~4 characters per token
  const charsPerToken = 4;
  const chunkSizeChars = chunkSize * charsPerToken;
  const overlapChars = overlap * charsPerToken;
  const stepSize = chunkSizeChars - overlapChars;

  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + chunkSizeChars, text.length);
    const chunk = text.slice(start, end).trim();
    
    if (chunk.length > 0) {
      chunks.push(chunk);
    }
    
    start += stepSize;
    
    // Prevent infinite loop
    if (stepSize <= 0) {
      break;
    }
  }

  return chunks;
}

