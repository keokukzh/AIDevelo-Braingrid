'use server';

import { getUserId, handleDbError, getDbClient, type ActionResult } from '@/lib/db/queries';
import type { Progress } from '@/lib/db/types';

export async function saveProgress(
  topicId: string,
  completed: boolean
): Promise<ActionResult<Progress>> {
  try {
    // Use guest user ID for public access mode
    const userId = await getUserId() || '00000000-0000-0000-0000-000000000000';

    if (!topicId) {
      return { success: false, error: 'Topic ID is required' };
    }

    // Use service role client to bypass RLS in public mode
    const supabase = await getDbClient();
    const { data, error } = await supabase
      .from('progress')
      .upsert(
        {
          user_id: userId,
          topic_id: topicId,
          completed,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'user_id,topic_id',
        }
      )
      .select()
      .single();

    if (error) {
      return { success: false, error: handleDbError(error) };
    }

    return { success: true, data: data as Progress };
  } catch (error) {
    return { success: false, error: handleDbError(error) };
  }
}

export async function fetchProgress(): Promise<ActionResult<Progress[]>> {
  try {
    // Use guest user ID for public access mode
    const userId = await getUserId() || '00000000-0000-0000-0000-000000000000';

    // Use service role client to bypass RLS in public mode
    const supabase = await getDbClient();
    const { data, error } = await supabase
      .from('progress')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) {
      return { success: false, error: handleDbError(error) };
    }

    return { success: true, data: (data || []) as Progress[] };
  } catch (error) {
    return { success: false, error: handleDbError(error) };
  }
}

export async function fetchProgressByTopic(
  topicId: string
): Promise<ActionResult<Progress | null>> {
  try {
    // Use guest user ID for public access mode
    const userId = await getUserId() || '00000000-0000-0000-0000-000000000000';

    // Use service role client to bypass RLS in public mode
    const supabase = await getDbClient();
    const { data, error } = await supabase
      .from('progress')
      .select('*')
      .eq('user_id', userId)
      .eq('topic_id', topicId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return { success: true, data: null };
      }
      return { success: false, error: handleDbError(error) };
    }

    return { success: true, data: data as Progress };
  } catch (error) {
    return { success: false, error: handleDbError(error) };
  }
}

export async function deleteProgress(
  topicId: string
): Promise<ActionResult<void>> {
  try {
    // Use guest user ID for public access mode
    const userId = await getUserId() || '00000000-0000-0000-0000-000000000000';

    // Use service role client to bypass RLS in public mode
    const supabase = await getDbClient();
    const { error } = await supabase
      .from('progress')
      .delete()
      .eq('user_id', userId)
      .eq('topic_id', topicId);

    if (error) {
      return { success: false, error: handleDbError(error) };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: handleDbError(error) };
  }
}

