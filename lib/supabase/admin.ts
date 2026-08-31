import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseSecretKey, getSupabaseUrl } from "@/lib/supabase/env";

let cached: SupabaseClient | null | undefined;

export function createAdminClient() {
  if (cached !== undefined) return cached;

  const url = getSupabaseUrl();
  const key = getSupabaseSecretKey();
  if (!url || !key) {
    cached = null;
    return cached;
  }

  cached = createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
  return cached;
}
