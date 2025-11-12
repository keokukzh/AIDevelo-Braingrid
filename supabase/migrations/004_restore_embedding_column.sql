-- Restore embedding column after vector extension migration
-- This ensures the column exists even if migrations are re-run
ALTER TABLE knowledge_chunks 
ADD COLUMN IF NOT EXISTS embedding extensions.vector(1536);

