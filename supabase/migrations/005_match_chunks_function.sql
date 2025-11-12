-- Create match_chunks function for vector similarity search
-- This function works with the vector extension in the extensions schema
CREATE OR REPLACE FUNCTION public.match_chunks(
  query_embedding extensions.vector(1536),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  id bigint,
  title text,
  source text,
  chunk text,
  distance float
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  RETURN QUERY
  SELECT
    knowledge_chunks.id,
    knowledge_chunks.title,
    knowledge_chunks.source,
    knowledge_chunks.chunk,
    1 - (knowledge_chunks.embedding <=> query_embedding) as distance
  FROM knowledge_chunks
  WHERE 1 - (knowledge_chunks.embedding <=> query_embedding) > match_threshold
  ORDER BY knowledge_chunks.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

