import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 60000, // 60 seconds default timeout for all requests
  maxRetries: 2,
});

export const EMBEDDINGS_MODEL = process.env.EMBEDDINGS_MODEL || 'text-embedding-3-large';
export const CHAT_MODEL = process.env.CHAT_MODEL || 'gpt-4o-mini';

