'use client';

import { supabaseClient } from '@/lib/supabase/client';
import { SessionContextProvider } from '@supabase/auth-helpers-react';

export default function SupabaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={null}
    >
      {children}
    </SessionContextProvider>
  );
}
