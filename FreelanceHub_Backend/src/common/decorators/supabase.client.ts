// src/common/supabase.client.ts
import { createClient } from '@supabase/supabase-js';
import { SupabaseClient } from '@supabase/supabase-js';

let supabase: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (supabase) return supabase;

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials', {
      SUPABASE_URL: supabaseUrl,
      SUPABASE_KEY: !!supabaseKey ? '[exists]' : '[missing]',
    });
    throw new Error('Missing Supabase credentials');
  }

  supabase = createClient(supabaseUrl, supabaseKey);
  return supabase;
}
