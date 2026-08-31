import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "Sign in to continue" }, { status: 401 });
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("user_settings").upsert({
    user_id: user.id,
    deletion_requested_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  return NextResponse.json({
    ok: true,
    message: "Deletion requested. We will erase account data that is not legally retained within 30 days.",
  });
}
