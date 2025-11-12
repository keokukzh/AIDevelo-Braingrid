'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="px-4 py-2 text-text-secondary">
        Loading...
      </div>
    );
  }

  // Optional: Show login status if user is logged in, otherwise show nothing
  // Since we're in public mode, we'll hide the auth button
  return null;
  
  // Uncomment below if you want to show login option (optional)
  /*
  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-text-secondary">
          {user.email}
        </span>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-surface border border-border rounded-md hover:bg-surface/80 transition-colors"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => router.push('/login')}
      className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90 transition-colors"
    >
      Login
    </button>
  );
  */
}

