import { openai, EMBEDDINGS_MODEL } from '@/lib/openai';

/**
 * Generate embedding for a single text
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await Promise.race([
    openai.embeddings.create({
      model: EMBEDDINGS_MODEL,
      input: text,
      timeout: 30000, // 30 seconds timeout
    }),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Embedding generation timeout')), 30000)
    ),
  ]);

  return response.data[0].embedding;
}

/**
 * Generate embeddings for multiple texts (batch processing)
 * Handles rate limits with exponential backoff
 */
export async function generateEmbeddings(
  texts: string[],
  maxRetries: number = 3
): Promise<number[][]> {
  const embeddings: number[][] = [];
  const batchSize = 100; // OpenAI allows up to 2048 inputs per request, but we'll use smaller batches

  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    let retries = 0;
    let success = false;

    while (retries < maxRetries && !success) {
      try {
        // Calculate timeout based on batch size (30s per 100 items, max 5 minutes)
        const batchTimeout = Math.min(batch.length * 300, 300000);
        
        const response = await Promise.race([
          openai.embeddings.create({
            model: EMBEDDINGS_MODEL,
            input: batch,
          }),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Batch embedding generation timeout')), batchTimeout)
          ),
        ]);

        const batchEmbeddings = response.data.map((item) => item.embedding);
        embeddings.push(...batchEmbeddings);
        success = true;
      } catch (error: any) {
        if (error.status === 429 && retries < maxRetries) {
          // Rate limit error - exponential backoff
          const delay = Math.pow(2, retries) * 1000;
          await new Promise((resolve) => setTimeout(resolve, delay));
          retries++;
        } else if (error.message?.includes('timeout')) {
          // Timeout error - retry once
          if (retries < maxRetries) {
            retries++;
            await new Promise((resolve) => setTimeout(resolve, 2000));
          } else {
            throw error;
          }
        } else {
          throw error;
        }
      }
    }
  }

  return embeddings;
}

