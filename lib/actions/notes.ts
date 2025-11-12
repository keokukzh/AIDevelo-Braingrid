'use server';

import { createClient } from '@/lib/supabaseServer';
import { getUserId, handleDbError, type ActionResult } from '@/lib/db/queries';
import type { Note } from '@/lib/db/types';

export async function saveNote(
  kind: 'daily_win' | 'general',
  content: string
): Promise<ActionResult<Note>> {
  try {
    const userId = await getUserId();
    if (!userId) {
      return { success: false, error: 'Not authenticated' };
    }

    if (!content || content.trim().length === 0) {
      return { success: false, error: 'Content is required' };
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from('notes')
      .insert({
        user_id: userId,
        kind,
        content: content.trim(),
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: handleDbError(error) };
    }

    return { success: true, data: data as Note };
  } catch (error) {
    return { success: false, error: handleDbError(error) };
  }
}

export async function fetchNotes(
  kind?: 'daily_win' | 'general'
): Promise<ActionResult<Note[]>> {
  try {
    const userId = await getUserId();
    if (!userId) {
      return { success: false, error: 'Not authenticated' };
    }

    const supabase = await createClient();
    let query = supabase
      .from('notes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (kind) {
      query = query.eq('kind', kind);
    }

    const { data, error } = await query;

    if (error) {
      return { success: false, error: handleDbError(error) };
    }

    return { success: true, data: (data || []) as Note[] };
  } catch (error) {
    return { success: false, error: handleDbError(error) };
  }
}

export async function updateNote(
  id: number,
  content: string
): Promise<ActionResult<Note>> {
  try {
    const userId = await getUserId();
    if (!userId) {
      return { success: false, error: 'Not authenticated' };
    }

    if (!content || content.trim().length === 0) {
      return { success: false, error: 'Content is required' };
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from('notes')
      .update({ content: content.trim() })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      return { success: false, error: handleDbError(error) };
    }

    return { success: true, data: data as Note };
  } catch (error) {
    return { success: false, error: handleDbError(error) };
  }
}

export async function deleteNote(id: number): Promise<ActionResult<void>> {
  try {
    const userId = await getUserId();
    if (!userId) {
      return { success: false, error: 'Not authenticated' };
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      return { success: false, error: handleDbError(error) };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: handleDbError(error) };
  }
}

