import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseServer';
import { searchChunksByQuestion } from '@/lib/rag/search';
import { buildContextWithLimit } from '@/lib/rag/context';
import { openai, CHAT_MODEL } from '@/lib/openai';

// Increase route timeout for Next.js (default is 10s, we need more for OpenAI)
export const maxDuration = 60; // 60 seconds

export async function POST(request: NextRequest) {
  try {
    // No authentication required - public access

    // Parse request body with timeout
    const body = await Promise.race([
      request.json(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request body parsing timeout')), 5000)
      ),
    ]) as { question?: string };

    const { question } = body;

    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Question is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    if (question.length > 500) {
      return NextResponse.json(
        { success: false, error: 'Question must be 500 characters or less' },
        { status: 400 }
      );
    }

    // Search for similar chunks with timeout
    const chunks = await Promise.race([
      searchChunksByQuestion(question.trim(), 5),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Vector search timeout')), 15000)
      ),
    ]);

    if (chunks.length === 0) {
      return NextResponse.json({
        answer: "I don't have enough information in my knowledge base to answer this question. Please try rephrasing or ask about a different topic.",
        sources: [],
      });
    }

    // Build context from chunks
    const context = buildContextWithLimit(chunks, 4000);

    // System prompt
    const systemPrompt = `You are a helpful learning assistant. Answer questions based on the provided context from the knowledge base. 
- If the context contains relevant information, provide a clear and accurate answer.
- Cite sources when possible using the source information provided.
- If the context doesn't contain enough information to answer the question, say so clearly.
- Be concise but thorough.
- Use markdown formatting for better readability.`;

    // Generate answer using OpenAI with timeout
    const completion = await Promise.race([
      openai.chat.completions.create({
        model: CHAT_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Context:\n${context}\n\nQuestion: ${question}` },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('OpenAI API timeout')), 45000)
      ),
    ]);

    const answer = completion.choices[0]?.message?.content || 'Unable to generate answer.';

    // Format sources with relevance scores
    const sources = chunks.map((chunk) => ({
      title: chunk.title || 'Untitled',
      source: chunk.source || '',
      relevance: Math.round(chunk.relevance * 100) / 100,
    }));

    return NextResponse.json({
      answer,
      sources,
    });
  } catch (error: any) {
    console.error('Error in explanation endpoint:', error);
    
    // Provide user-friendly error messages
    let errorMessage = 'Internal server error';
    let statusCode = 500;

    if (error.message?.includes('timeout')) {
      errorMessage = 'The request took too long to process. Please try again with a simpler question.';
      statusCode = 504; // Gateway Timeout
    } else if (error.message?.includes('OpenAI')) {
      errorMessage = 'AI service is temporarily unavailable. Please try again later.';
      statusCode = 503; // Service Unavailable
    } else if (error.message) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: statusCode }
    );
  }
}

