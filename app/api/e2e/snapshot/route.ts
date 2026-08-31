import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  const secret = process.env.INVITE_JWT_SECRET || process.env.E2E_SECRET;
  const provided = request.headers.get("x-e2e-secret");
  if (!secret || provided !== secret) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const ownerEmail = searchParams.get("ownerEmail");
  const freelancerEmail = searchParams.get("freelancerEmail");
  if (!ownerEmail || !freelancerEmail) {
    return NextResponse.json({ message: "ownerEmail and freelancerEmail required" }, { status: 400 });
  }

  const client = createAdminClient();
  if (!client) {
    return NextResponse.json({ message: "Admin client unavailable" }, { status: 500 });
  }
  const db = client;

  async function findUser(email: string) {
    for (let page = 1; page <= 10; page += 1) {
      const { data } = await db.auth.admin.listUsers({ page, perPage: 200 });
      const users = data?.users ?? [];
      const match = users.find((row) => row.email === email) ?? null;
      if (match) return match;
      if (users.length < 200) break;
    }
    return null;
  }

  const ownerUser = await findUser(ownerEmail);
  const freelancerUser = await findUser(freelancerEmail);

  const { data: company } = ownerUser
    ? await db
        .from("companies")
        .select("id, name, accent_color, owner_id")
        .eq("owner_id", ownerUser.id)
        .maybeSingle()
    : { data: null };

  const { data: member } = company
    ? await db
        .from("members")
        .select("id, role, user_id, company_id")
        .eq("company_id", company.id)
        .eq("user_id", ownerUser?.id ?? "")
        .maybeSingle()
    : { data: null };

  const { data: invite } = company
    ? await db
        .from("freelancer_invites")
        .select("id, status, email")
        .eq("company_id", company.id)
        .eq("email", freelancerEmail)
        .maybeSingle()
    : { data: null };

  const { data: freelancer } = company
    ? await db
        .from("freelancers")
        .select("id, status, user_id, email, full_name")
        .eq("company_id", company.id)
        .eq("email", freelancerEmail)
        .maybeSingle()
    : { data: null };

  const { data: contract } = company
    ? await db
        .from("contracts")
        .select("id, status, signer_name, signed_at, freelancer_id")
        .eq("company_id", company.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()
    : { data: null };

  return NextResponse.json({
    ownerUser: Boolean(ownerUser),
    freelancerUser: Boolean(freelancerUser),
    company,
    member,
    invite,
    freelancer,
    contract,
  });
}
