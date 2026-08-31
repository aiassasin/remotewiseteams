import { NextResponse } from "next/server";
import { getCurrentWorkspace, getSessionUser } from "@/lib/auth/session";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { EMAIL_PATTERN } from "@/lib/utils";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "Sign in to continue" }, { status: 401 });
  let body: { name?: string; email?: string; topic?: string; message?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }
  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? user.email ?? "";
  const message = body.message?.trim() ?? "";
  if (!name || !EMAIL_PATTERN.test(email) || message.length < 4) {
    return NextResponse.json({ message: "Name, email, and a short message are required" }, { status: 400 });
  }
  const current = await getCurrentWorkspace();
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("support_tickets").insert({
    company_id: current?.workspace.id ?? null,
    user_id: user.id,
    name,
    email,
    topic: body.topic?.trim() || "general",
    message,
  });
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
