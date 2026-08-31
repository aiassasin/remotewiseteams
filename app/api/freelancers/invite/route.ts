import { NextResponse } from "next/server";
import { getCurrentWorkspace } from "@/lib/auth/session";
import { sendInviteEmail } from "@/lib/email";
import { persistInvite } from "@/lib/invite-persistence";
import { signInviteToken } from "@/lib/jwt";
import type { StoredInvite } from "@/lib/store";
import { hashToken } from "@/lib/token-hash";
import { EMAIL_PATTERN } from "@/lib/utils";
import type { Currency } from "@/lib/types";

type InviteBody = {
  name?: string;
  email?: string;
  role?: string;
  rate?: number | null;
  currency?: Currency;
  note?: string;
  companyId?: string;
};

export async function POST(request: Request) {
  const current = await getCurrentWorkspace();
  if (!current) {
    return NextResponse.json({ message: "Sign in to invite a freelancer" }, { status: 401 });
  }

  let body: InviteBody;
  try {
    body = (await request.json()) as InviteBody;
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim().toLowerCase() ?? "";

  if (!name) {
    return NextResponse.json({ message: "Full name is required", field: "name" }, { status: 400 });
  }
  if (!email) {
    return NextResponse.json({ message: "Email is required", field: "email" }, { status: 400 });
  }
  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ message: "Enter a valid email address", field: "email" }, { status: 400 });
  }
  if (body.rate != null && (typeof body.rate !== "number" || body.rate <= 0)) {
    return NextResponse.json({ message: "Enter a valid hourly rate", field: "rate" }, { status: 400 });
  }

  const inviteId = crypto.randomUUID();
  const companyName = current.workspace.name;
  const token = await signInviteToken({
    inviteId,
    email,
    name,
    companyName,
  });

  const invite: StoredInvite = {
    id: inviteId,
    token,
    tokenHash: hashToken(token),
    name,
    email,
    role: body.role?.trim() || null,
    rate: body.rate ?? null,
    currency: body.currency ?? "USD",
    note: body.note?.trim() || null,
    companyId: current.workspace.id,
    companyName,
    status: "pending",
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
  };

  try {
    await persistInvite(invite, {
      id: current.workspace.id,
      name: current.workspace.name,
    });
  } catch (error) {
    const err = error as Error & { field?: string; status?: number };
    return NextResponse.json(
      { message: err.message, field: err.field ?? "email" },
      { status: err.status ?? 500 },
    );
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
  const inviteUrl = `${appUrl}/invite/${token}`;

  try {
    await sendInviteEmail({
      to: email,
      companyName,
      freelancerName: name,
      inviteUrl,
      note: invite.note,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Invite saved, but the email could not be sent",
        field: "email",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({
    inviteId,
    token,
    inviteUrl,
    message: `Invite sent to ${email}`,
  });
}
