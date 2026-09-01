import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { loadFreelancerBillingProfile, saveFreelancerBillingProfile } from "@/lib/invoices-server";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "Sign in to continue" }, { status: 401 });
  try {
    const profile = await loadFreelancerBillingProfile(user.id);
    if (!profile) return NextResponse.json({ message: "Not a freelancer" }, { status: 404 });
    return NextResponse.json({ profile });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Could not load profile" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "Sign in to continue" }, { status: 401 });
  const profile = await loadFreelancerBillingProfile(user.id);
  if (!profile) return NextResponse.json({ message: "Not a freelancer" }, { status: 404 });
  const body = (await request.json()) as Record<string, string>;
  await saveFreelancerBillingProfile(profile.id, body);
  return NextResponse.json({ ok: true });
}
