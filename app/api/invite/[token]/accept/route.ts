import { NextResponse } from "next/server";
import { COUNTRIES } from "@/lib/countries";
import { acceptInviteRecord, loadInvite } from "@/lib/invite-persistence";
import { verifyInviteToken } from "@/lib/jwt";
import { createAdminClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(
  request: Request,
  { params }: { params: { token: string } },
) {
  let body: { password?: string; country?: string; timezone?: string; name?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.password || body.password.length < 8) {
    return NextResponse.json(
      { message: "Password must be at least 8 characters", field: "password" },
      { status: 400 },
    );
  }

  const country = COUNTRIES.find((item) => item.code === body.country);
  if (!country) {
    return NextResponse.json(
      { message: "Select a country", field: "country" },
      { status: 400 },
    );
  }

  try {
    const payload = await verifyInviteToken(params.token);
    const invite = await loadInvite(payload.inviteId, params.token);
    if (!invite || invite.status !== "pending") {
      return NextResponse.json(
        { message: "This invite is no longer valid" },
        { status: 410 },
      );
    }
    if (new Date(invite.expiresAt).getTime() < Date.now()) {
      return NextResponse.json({ message: "This invite has expired" }, { status: 410 });
    }

    const name = body.name?.trim() || invite.name;
    const admin = createAdminClient();
    let userId = crypto.randomUUID();

    if (admin) {
      const { data, error } = await admin.auth.admin.createUser({
        email: invite.email,
        password: body.password,
        email_confirm: true,
        user_metadata: { full_name: name },
      });
      if (error || !data.user) {
        const exists = error?.message?.toLowerCase().includes("already") ?? false;
        return NextResponse.json(
          {
            message: exists
              ? "An account with this email already exists. Sign in instead."
              : error?.message || "Could not create account",
            field: exists ? "email" : "password",
          },
          { status: exists ? 409 : 500 },
        );
      }
      userId = data.user.id;
    }

    await acceptInviteRecord({
      invite,
      userId,
      name,
      country: country.name,
      timezone: body.timezone || "UTC",
    });

    const supabase = createServerSupabaseClient();
    await supabase.auth.signInWithPassword({
      email: invite.email,
      password: body.password,
    });

    return NextResponse.json({
      userId,
      redirect: "/onboarding/profile",
    });
  } catch {
    return NextResponse.json({ message: "Invite expired" }, { status: 410 });
  }
}
