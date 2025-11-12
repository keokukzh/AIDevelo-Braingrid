import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseServer';
import { searchChunksByQuestion } from '@/lib/rag/search';
import { buildContextWithLimit } from '@/lib/rag/context';
import { openai, CHAT_MODEL } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
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

    // Search for similar chunks
    const chunks = await searchChunksByQuestion(question.trim(), 5);

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

    // Generate answer using OpenAI
    const completion = await openai.chat.completions.create({
      model: CHAT_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Context:\n${context}\n\nQuestion: ${question}` },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

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
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

