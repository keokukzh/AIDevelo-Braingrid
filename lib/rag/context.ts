import type { ChunkWithRelevance } from './search';

/**
 * Build context string from retrieved chunks
 * Formats chunks with source attribution for LLM consumption
 */
export function buildContext(chunks: ChunkWithRelevance[]): string {
  if (chunks.length === 0) {
    return '';
  }

  const contextParts = chunks.map((chunk, index) => {
    const source = chunk.source || 'Unknown source';
    const title = chunk.title || 'Untitled';
    return `[Source ${index + 1}: ${title} (${source})]\n${chunk.chunk || ''}\n`;
  });

  return contextParts.join('\n---\n\n');
}

/**
 * Estimate token count (rough approximation: 4 chars per token)
 */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Build context within token limit
 */
export function buildContextWithLimit(
  chunks: ChunkWithRelevance[],
  maxTokens: number = 4000
): string {
  let context = '';
  let totalTokens = 0;

  for (const chunk of chunks) {
    const chunkText = chunk.chunk || '';
    const chunkTokens = estimateTokens(chunkText);
    const source = chunk.source || 'Unknown source';
    const title = chunk.title || 'Untitled';
    const formattedChunk = `[Source: ${title} (${source})]\n${chunkText}\n\n---\n\n`;
    const formattedTokens = estimateTokens(formattedChunk);

    if (totalTokens + formattedTokens > maxTokens) {
      break;
    }

    context += formattedChunk;
    totalTokens += formattedTokens;
  }

  return context.trim();
}

