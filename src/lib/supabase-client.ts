import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase credentials missing. Check your environment variables.');
    // Return a dummy client or handle it in components
    return {} as any; 
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
}
