import { NextResponse } from "next/server";
import { getCurrentWorkspace } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { EMAIL_PATTERN } from "@/lib/utils";

export async function POST(request: Request) {
  const current = await getCurrentWorkspace();
  if (!current) return NextResponse.json({ message: "Sign in to continue" }, { status: 401 });
  if (current.workspace.role === "member") {
    return NextResponse.json({ message: "Only owners and admins can invite members" }, { status: 403 });
  }

  let body: { email?: string; role?: string };
  try {
    body = (await request.json()) as { email?: string; role?: string };
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }
  const email = body.email?.trim().toLowerCase() ?? "";
  const role = body.role === "admin" ? "admin" : "member";
  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ message: "Enter a valid email", field: "email" }, { status: 400 });
  }

  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ message: "Admin client unavailable" }, { status: 500 });

  let userId: string | null = null;
  for (let page = 1; page <= 8; page += 1) {
    const { data } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    const match = data?.users.find((row) => row.email?.toLowerCase() === email);
    if (match) {
      userId = match.id;
      break;
    }
    if ((data?.users.length ?? 0) < 200) break;
  }
  if (!userId) {
    return NextResponse.json(
      { message: "That email does not have a RemoteWise account yet. Ask them to sign up first." },
      { status: 404 },
    );
  }

  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("members").insert({
    user_id: userId,
    company_id: current.workspace.id,
    role,
  });
  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ message: "Already a member" }, { status: 409 });
    }
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const current = await getCurrentWorkspace();
  if (!current) return NextResponse.json({ message: "Sign in to continue" }, { status: 401 });
  if (current.workspace.role !== "owner") {
    return NextResponse.json({ message: "Only the owner can remove members" }, { status: 403 });
  }
  const { searchParams } = new URL(request.url);
  const memberId = searchParams.get("id");
  if (!memberId) return NextResponse.json({ message: "Missing member id" }, { status: 400 });

  const supabase = createServerSupabaseClient();
  const { data: target } = await supabase
    .from("members")
    .select("id, role, user_id")
    .eq("id", memberId)
    .eq("company_id", current.workspace.id)
    .maybeSingle();
  if (!target) return NextResponse.json({ message: "Member not found" }, { status: 404 });
  if (target.role === "owner") {
    return NextResponse.json({ message: "The owner cannot be removed" }, { status: 400 });
  }
  const { error } = await supabase.from("members").delete().eq("id", memberId);
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
