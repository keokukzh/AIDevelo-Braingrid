-- Enable pgvector extension for embeddings in extensions schema
CREATE SCHEMA IF NOT EXISTS extensions;
CREATE EXTENSION IF NOT EXISTS vector SCHEMA extensions;

-- Profiles table (1:1 with auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Progress table (Learning progress per user/topic)
CREATE TABLE IF NOT EXISTS progress (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Notes table (User notes and daily wins)
CREATE TABLE IF NOT EXISTS notes (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  kind TEXT CHECK (kind IN ('daily_win', 'general')) DEFAULT 'general',
  content TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Events table (Stored live events for replay/analytics)
CREATE TABLE IF NOT EXISTS events (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('gift', 'like', 'share', 'chat')) NOT NULL,
  payload JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Knowledge chunks table (RAG embeddings)
CREATE TABLE IF NOT EXISTS knowledge_chunks (
  id BIGSERIAL PRIMARY KEY,
  title TEXT,
  source TEXT,
  chunk TEXT,
  embedding VECTOR(1536)  -- text-embedding-3-large dimension
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_progress_user_id ON progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_topic_id ON progress(topic_id);
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_kind ON notes(kind);
CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(type);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at DESC);

-- Create vector index for similarity search (using ivfflat for better performance)
-- Note: This requires at least some data to be effective
-- CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_embedding ON knowledge_chunks 
--   USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

