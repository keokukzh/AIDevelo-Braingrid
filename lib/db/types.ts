// Database types - These will be generated from Supabase schema
// For now, defining manually based on the schema

export interface Profile {
  id: string;
  username: string | null;
  created_at: string;
}

export interface Progress {
  id: number;
  user_id: string;
  topic_id: string;
  completed: boolean;
  updated_at: string;
}

export interface Note {
  id: number;
  user_id: string;
  kind: 'daily_win' | 'general';
  content: string;
  created_at: string;
}

export interface Event {
  id: number;
  user_id: string;
  type: 'gift' | 'like' | 'share' | 'chat';
  payload: Record<string, unknown>;
  created_at: string;
}

export interface KnowledgeChunk {
  id: number;
  title: string | null;
  source: string | null;
  chunk: string | null;
  embedding: number[] | null;
}

