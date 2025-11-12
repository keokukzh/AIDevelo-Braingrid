import { createClient } from '@/lib/supabaseServer';
import type { User } from '@supabase/supabase-js';

export async function getUserId(): Promise<string | null> {
  // In public mode, always return guest user ID
  // If authentication is needed later, uncomment below:
  /*
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
  */
  return '00000000-0000-0000-0000-000000000000';
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

