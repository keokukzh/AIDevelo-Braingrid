import { createClient } from '@/lib/supabaseServer';
import { createServiceRoleClient } from '@/lib/supabaseClient';
import type { User } from '@supabase/supabase-js';

// Guest user ID for public access mode
export const GUEST_USER_ID = '00000000-0000-0000-0000-000000000000';

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
  return GUEST_USER_ID;
}

// Get Supabase client for database operations
// Uses service role for public mode to bypass RLS
export async function getDbClient() {
  // In public mode, use service role client to bypass RLS
  // This allows the guest user to read/write data
  return createServiceRoleClient();
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

