export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
};

// Validate environment variables
if (typeof window === 'undefined') {
  // Server-side validation
  if (!supabaseConfig.url) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set');
  }
  if (!supabaseConfig.anonKey) {
    throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not set');
  }
}
