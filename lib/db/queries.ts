import { createClient } from '@/lib/supabaseServer';
import type { User } from '@supabase/supabase-js';

export async function getUserId(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

export function handleDbError(error: any): string {
  if (error?.message) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
}

export interface ActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

