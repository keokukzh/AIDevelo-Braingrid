import { createClient } from '@/lib/supabaseServer';
import { redirect } from 'next/navigation';

export async function getSession() {
  const supabase = await createClient();
  
  const {
    data: { session },
  } = await supabase.auth.getSession();
  
  return session;
}

export async function getUser() {
  const session = await getSession();
  return session?.user ?? null;
}

export async function requireAuth() {
  const user = await getUser();
  
  if (!user) {
    redirect('/login');
  }
  
  return user;
}

export async function getUserProfile() {
  const user = await getUser();
  
  if (!user) {
    return null;
  }
  
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  
  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  
  return data;
}

