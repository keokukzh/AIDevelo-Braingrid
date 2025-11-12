import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabaseClient';
import { chunkText } from '@/lib/rag/chunker';
import { generateEmbeddings } from '@/lib/rag/embeddings';
import { verifyAdminAccess } from '@/lib/admin';
import { createClient } from '@/lib/supabaseServer';

export async function POST(request: NextRequest) {
  try {
    // Verify admin access
    const authHeader = request.headers.get('authorization');
    const serviceRoleKey = authHeader?.replace('Bearer ', '');

    // Get user email if available
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!verifyAdminAccess(serviceRoleKey, user?.email)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { title, source, text } = body;

    if (!title || !source || !text) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title, source, text' },
        { status: 400 }
      );
    }

    // Chunk the text
    const chunks = chunkText(text, 800, 100);

    if (chunks.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No chunks generated from text' },
        { status: 400 }
      );
    }

    // Generate embeddings for all chunks
    const embeddings = await generateEmbeddings(chunks);

    if (embeddings.length !== chunks.length) {
      return NextResponse.json(
        { success: false, error: 'Embedding generation failed' },
        { status: 500 }
      );
    }

    // Insert chunks into database using service role client (bypasses RLS)
    const serviceClient = createServiceRoleClient();
    const chunkIds: number[] = [];

    for (let i = 0; i < chunks.length; i++) {
      const { data, error } = await serviceClient
        .from('knowledge_chunks')
        .insert({
          title,
          source,
          chunk: chunks[i],
          embedding: embeddings[i],
        })
        .select('id')
        .single();

      if (error) {
        console.error('Error inserting chunk:', error);
        continue;
      }

      if (data) {
        chunkIds.push(data.id);
      }
    }

    return NextResponse.json({
      success: true,
      chunks_created: chunkIds.length,
      chunk_ids: chunkIds,
    });
  } catch (error: any) {
    console.error('Error in indexing endpoint:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

