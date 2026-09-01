import { NextResponse } from "next/server";
import { getCurrentWorkspace, getSessionUser } from "@/lib/auth/session";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const current = await getCurrentWorkspace();
  const supabase = createServerSupabaseClient();
  const { data: freelancer } = await supabase
    .from("freelancers")
    .select("id, full_name, company_id, status")
    .eq("user_id", user.id)
    .maybeSingle();

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      fullName:
        current?.user.fullName ||
        (typeof user.user_metadata?.full_name === "string" ? user.user_metadata.full_name : null),
    },
    workspace: current?.workspace ?? null,
    freelancer,
  });
}
