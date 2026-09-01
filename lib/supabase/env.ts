function readEnv(...keys: string[]) {
  for (const key of keys) {
    const value = process.env[key]?.trim().replace(/^["']|["']$/g, "");
    if (value) return value;
  }
  return "";
}

export function getSupabaseUrl() {
  return readEnv("NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_URL");
}

export function getSupabasePublishableKey() {
  return readEnv(
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    "SUPABASE_ANON_KEY",
    "SUPABASE_PUBLISHABLE_KEY",
  );
}

export function getSupabaseSecretKey() {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY ||
    ""
  );
}

export function isSupabaseConfigured() {
  return Boolean(getSupabaseUrl() && getSupabasePublishableKey());
}
