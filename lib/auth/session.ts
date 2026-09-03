import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export type Workspace = {
  id: string;
  name: string;
  accentColor: string;
  plan: string;
  logoUrl: string | null;
  role: "owner" | "admin" | "member";
};

export async function getSessionUser() {
  if (!isSupabaseConfigured()) return null;
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return data.user;
}

export async function getCurrentWorkspace(): Promise<
  | {
      user: { id: string; email: string; fullName: string; avatarUrl: string | null };
      workspace: Workspace;
    }
  | null
> {
  if (!isSupabaseConfigured()) return null;
  const supabase = createServerSupabaseClient();
  const { data: auth, error } = await supabase.auth.getUser();
  if (error || !auth.user) return null;

  const { data: membership } = await supabase
    .from("members")
    .select("role, company_id, companies(id, name, accent_color, plan, logo_url)")
    .eq("user_id", auth.user.id)
    .limit(1)
    .maybeSingle();

  const company = membership?.companies as
    | { id: string; name: string; accent_color: string | null; plan: string; logo_url: string | null }
    | { id: string; name: string; accent_color: string | null; plan: string; logo_url: string | null }[]
    | null
    | undefined;

  const row = Array.isArray(company) ? company[0] : company;
  if (!row) return null;

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("full_name, avatar_url")
    .eq("user_id", auth.user.id)
    .maybeSingle();

  const fullName =
    (typeof profile?.full_name === "string" && profile.full_name) ||
    (typeof auth.user.user_metadata?.full_name === "string" && auth.user.user_metadata.full_name) ||
    auth.user.email?.split("@")[0] ||
    "You";

  return {
    user: {
      id: auth.user.id,
      email: auth.user.email ?? "",
      fullName,
      avatarUrl: typeof profile?.avatar_url === "string" ? profile.avatar_url : null,
    },
    workspace: {
      id: row.id,
      name: row.name,
      accentColor: row.accent_color || "#2563EB",
      plan: row.plan,
      logoUrl: row.logo_url,
      role: (membership?.role as Workspace["role"]) || "member",
    },
  };
}

export async function getCurrentFreelancer() {
  if (!isSupabaseConfigured()) return null;
  const supabase = createServerSupabaseClient();
  const { data: auth, error } = await supabase.auth.getUser();
  if (error || !auth.user) return null;
  const { data } = await supabase
    .from("freelancers")
    .select("id, full_name, company_id, status, email")
    .eq("user_id", auth.user.id)
    .maybeSingle();
  return data;
}
