import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://alhnvqlksbgpzedjtnhi.supabase.co'

export const supabase = createClient(supabaseUrl, import.meta.env.VITE_SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    storage: localStorage,
    detectSessionInUrl: true
  }
})