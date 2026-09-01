import { NextResponse } from "next/server";
import { getCurrentWorkspace, getSessionUser } from "@/lib/auth/session";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "Sign in to continue" }, { status: 401 });
  const current = await getCurrentWorkspace();
  const supabase = createServerSupabaseClient();

  const [{ data: profile }, { data: settings }, { data: invoices }] = await Promise.all([
    supabase.from("user_profiles").select("*").eq("user_id", user.id).maybeSingle(),
    supabase.from("user_settings").select("*").eq("user_id", user.id).maybeSingle(),
    current
      ? supabase.from("invoices").select("id, invoice_number, amount, currency, status, created_at").eq("company_id", current.workspace.id)
      : Promise.resolve({ data: [] }),
  ]);

  const payload = {
    exportedAt: new Date().toISOString(),
    user: { id: user.id, email: user.email, createdAt: user.created_at },
    profile,
    settings,
    workspace: current?.workspace ?? null,
    invoices: invoices ?? [],
  };

  return new NextResponse(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="remotewise-export.json"`,
    },
  });
}
