import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

let supabase: SupabaseClient;

if (supabaseUrl && supabaseUrl.startsWith('http')) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  // Dummy client — จะไม่ทำงานจริงจนกว่าจะตั้งค่า env
  supabase = createClient('https://placeholder.supabase.co', 'placeholder');
}

export { supabase };

export function isSupabaseConfigured(): boolean {
  return supabaseUrl !== '' && supabaseUrl.startsWith('http') && supabaseUrl !== 'https://placeholder.supabase.co';
}
