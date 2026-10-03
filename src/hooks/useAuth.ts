'use client';

import { useEffect, useMemo, useState } from 'react';
import { type User } from '@supabase/supabase-js';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const isSupabaseAvailable = isSupabaseConfigured();
  const [loading, setLoading] = useState(isSupabaseAvailable);
  const supabase = useMemo(
    () => (isSupabaseAvailable ? createClient() : null),
    [isSupabaseAvailable],
  );

  useEffect(() => {
    if (!supabase) return;

    const client = supabase;
    let mounted = true;

    async function getUser() {
      const { data: { session } } = await client.auth.getSession();
      if (mounted) {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    }

    getUser();

    const { data: { subscription } } = client.auth.onAuthStateChange(
      (_event, session) => {
        if (mounted) {
          setUser(session?.user ?? null);
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const signOut = async () => {
    if (supabase) await supabase.auth.signOut();
  };

  return { user, loading, signOut };
}
