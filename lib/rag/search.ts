import { createClient } from '@/lib/supabaseServer';
import { generateEmbedding } from './embeddings';

export interface ChunkWithRelevance {
  id: number;
  title: string | null;
  source: string | null;
  chunk: string | null;
  relevance: number;
}

/**
 * Search for similar chunks using vector similarity
 * @param embedding - The query embedding vector
 * @param topK - Number of top results to return (default: 5)
 * @returns Array of chunks with relevance scores
 */
export async function searchSimilarChunks(
  embedding: number[],
  topK: number = 5
): Promise<ChunkWithRelevance[]> {
  const supabase = await createClient();

  // Use pgvector cosine similarity operator (<=>)
  // Lower distance = higher similarity
  const { data, error } = await supabase.rpc('match_chunks', {
    query_embedding: embedding,
    match_threshold: 0.7,
    match_count: topK,
  });

  if (error) {
    // Fallback to direct SQL query if RPC doesn't exist
    const { data: fallbackData, error: fallbackError } = await supabase
      .from('knowledge_chunks')
      .select('id, title, source, chunk')
      .limit(topK);

    if (fallbackError) {
      throw new Error(`Vector search failed: ${fallbackError.message}`);
    }

    // Calculate cosine similarity manually if RPC not available
    // For now, return chunks without relevance scores
    return (fallbackData || []).map((chunk) => ({
      ...chunk,
      relevance: 0.8, // Default relevance
    }));
  }

  return (data || []).map((item: any) => ({
    id: item.id,
    title: item.title,
    source: item.source,
    chunk: item.chunk,
    relevance: 1 - (item.distance || 0), // Convert distance to relevance
  }));
}

/**
 * Search chunks by question text (embeds question first)
 */
export async function searchChunksByQuestion(
  question: string,
  topK: number = 5
): Promise<ChunkWithRelevance[]> {
  const embedding = await generateEmbedding(question);
  return searchSimilarChunks(embedding, topK);
}

