'use server';

import { createClient } from '@/lib/supabaseServer';
import { getUserId, handleDbError, type ActionResult } from '@/lib/db/queries';
import type { Profile } from '@/lib/db/types';

export async function getProfile(): Promise<ActionResult<Profile>> {
  try {
    // Use a default user ID for public access mode
    const userId = await getUserId() || '00000000-0000-0000-0000-000000000000';

    const supabase = await createClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      return { success: false, error: handleDbError(error) };
    }

    return { success: true, data: data as Profile };
  } catch (error) {
    return { success: false, error: handleDbError(error) };
  }
}

export async function updateProfile(
  username: string
): Promise<ActionResult<Profile>> {
  try {
    // Use a default user ID for public access mode
    const userId = await getUserId() || '00000000-0000-0000-0000-000000000000';

    if (!username || username.trim().length < 3 || username.trim().length > 20) {
      return {
        success: false,
        error: 'Username must be between 3 and 20 characters',
      };
    }

    // Check if username is already taken
    const supabase = await createClient();
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username.trim())
      .neq('id', userId)
      .single();

    if (existing) {
      return { success: false, error: 'Username already taken' };
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({ username: username.trim() })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      return { success: false, error: handleDbError(error) };
    }

    return { success: true, data: data as Profile };
  } catch (error) {
    return { success: false, error: handleDbError(error) };
  }
}

export async function getProgressStats(): Promise<
  ActionResult<{
    total: number;
    completed: number;
    percentage: number;
    streak: number;
  }>
> {
  try {
    // Use a default user ID for public access mode
    const userId = await getUserId() || '00000000-0000-0000-0000-000000000000';

    const supabase = await createClient();
    const { data: progress, error } = await supabase
      .from('progress')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      return { success: false, error: handleDbError(error) };
    }

    const completed = progress?.filter((p) => p.completed).length || 0;
    const total = progress?.length || 0;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Calculate streak (simplified - consecutive days with any progress)
    const dates = new Set(
      progress?.map((p) => new Date(p.updated_at).toDateString()) || []
    );
    const sortedDates = Array.from(dates).sort().reverse();
    let streak = 0;
    const today = new Date().toDateString();
    
    for (let i = 0; i < sortedDates.length; i++) {
      const checkDate = new Date();
      checkDate.setDate(checkDate.getDate() - i);
      if (sortedDates.includes(checkDate.toDateString())) {
        streak++;
      } else {
        break;
      }
    }

    return {
      success: true,
      data: {
        total,
        completed,
        percentage,
        streak,
      },
    };
  } catch (error) {
    return { success: false, error: handleDbError(error) };
  }
}

