import { NextResponse } from "next/server";
import { getCurrentFreelancer, getSessionUser } from "@/lib/auth/session";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { appUrl, getStripe, isStripeConfigured } from "@/lib/stripe/client";

export const dynamic = "force-dynamic";

export async function POST() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "Sign in to continue" }, { status: 401 });
  const freelancer = await getCurrentFreelancer();
  if (!freelancer) return NextResponse.json({ message: "Freelancer profile required" }, { status: 403 });

  const origin = appUrl();
  const stripe = getStripe();
  if (!stripe || !isStripeConfigured()) {
    const supabase = createServerSupabaseClient();
    await supabase
      .from("freelancers")
      .update({ stripe_onboarded: true, stripe_account_id: `acct_mock_${freelancer.id.slice(0, 8)}` })
      .eq("id", freelancer.id);
    return NextResponse.json({
      mocked: true,
      url: `${origin}/onboarding/profile?stripe=mock`,
    });
  }

  const supabase = createServerSupabaseClient();
  const { data: row } = await supabase
    .from("freelancers")
    .select("stripe_account_id")
    .eq("id", freelancer.id)
    .maybeSingle();

  let accountId = typeof row?.stripe_account_id === "string" ? row.stripe_account_id : "";
  if (!accountId) {
    const account = await stripe.accounts.create({
      controller: {
        stripe_dashboard: { type: "express" },
        fees: { payer: "application" },
        losses: { payments: "application" },
      },
      capabilities: {
        transfers: { requested: true },
        card_payments: { requested: true },
      },
      email: user.email,
      metadata: { freelancerId: freelancer.id, userId: user.id },
    });
    accountId = account.id;
    await supabase.from("freelancers").update({ stripe_account_id: accountId }).eq("id", freelancer.id);
  }

  const link = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${origin}/onboarding/profile?stripe=refresh`,
    return_url: `${origin}/onboarding/profile?stripe=return`,
    type: "account_onboarding",
  });

  return NextResponse.json({ mocked: false, url: link.url, accountId });
}

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "Sign in to continue" }, { status: 401 });
  const freelancer = await getCurrentFreelancer();
  if (!freelancer) return NextResponse.json({ onboarded: false });
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from("freelancers")
    .select("stripe_account_id, stripe_onboarded")
    .eq("id", freelancer.id)
    .maybeSingle();
  return NextResponse.json({
    onboarded: Boolean(data?.stripe_onboarded),
    accountId: data?.stripe_account_id ?? null,
    testMode: !isStripeConfigured(),
  });
}
