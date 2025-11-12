'use server';

import { createClient } from '@/lib/supabaseServer';
import { getUserId, handleDbError, type ActionResult } from '@/lib/db/queries';
import type { Event } from '@/lib/db/types';

export async function saveEvent(
  type: 'gift' | 'like' | 'share' | 'chat',
  payload: Record<string, unknown>
): Promise<ActionResult<Event>> {
  try {
    const userId = await getUserId();
    if (!userId) {
      return { success: false, error: 'Not authenticated' };
    }

    if (!type || !payload) {
      return { success: false, error: 'Type and payload are required' };
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from('events')
      .insert({
        user_id: userId,
        type,
        payload,
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: handleDbError(error) };
    }

    return { success: true, data: data as Event };
  } catch (error) {
    return { success: false, error: handleDbError(error) };
  }
}

export async function fetchEvents(
  type?: 'gift' | 'like' | 'share' | 'chat',
  limit: number = 50
): Promise<ActionResult<Event[]>> {
  try {
    const userId = await getUserId();
    if (!userId) {
      return { success: false, error: 'Not authenticated' };
    }

    const supabase = await createClient();
    let query = supabase
      .from('events')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (type) {
      query = query.eq('type', type);
    }

    const { data, error } = await query;

    if (error) {
      return { success: false, error: handleDbError(error) };
    }

    return { success: true, data: (data || []) as Event[] };
  } catch (error) {
    return { success: false, error: handleDbError(error) };
  }
}

export async function deleteEvent(id: number): Promise<ActionResult<void>> {
  try {
    const userId = await getUserId();
    if (!userId) {
      return { success: false, error: 'Not authenticated' };
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from('events')
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

