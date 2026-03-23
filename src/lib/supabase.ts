import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isAdmin = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return false;

  const role = session.user?.user_metadata?.role || session.user?.app_metadata?.role;
  return role === 'admin';
};
