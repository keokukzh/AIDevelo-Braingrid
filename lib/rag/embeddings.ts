import { openai, EMBEDDINGS_MODEL } from '@/lib/openai';

/**
 * Generate embedding for a single text
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: EMBEDDINGS_MODEL,
    input: text,
  });

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
        const response = await openai.embeddings.create({
          model: EMBEDDINGS_MODEL,
          input: batch,
        });

        const batchEmbeddings = response.data.map((item) => item.embedding);
        embeddings.push(...batchEmbeddings);
        success = true;
      } catch (error: any) {
        if (error.status === 429 && retries < maxRetries) {
          // Rate limit error - exponential backoff
          const delay = Math.pow(2, retries) * 1000;
          await new Promise((resolve) => setTimeout(resolve, delay));
          retries++;
        } else {
          throw error;
        }
      }
    }
  }

  return embeddings;
}

