import { NextResponse } from "next/server";
import { getCurrentFreelancer, getSessionUser } from "@/lib/auth/session";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  calculateFreelancerPayout,
  formatPricingMoney,
  type PayoutOption,
  type PricingCurrency,
} from "@/lib/pricing";
import { getStripe, isStripeConfigured, toCents } from "@/lib/stripe/client";
import { sendPayoutReceivedEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "Sign in to continue" }, { status: 401 });
  const freelancer = await getCurrentFreelancer();
  if (!freelancer) return NextResponse.json({ message: "Freelancer profile required" }, { status: 403 });

  let speed: PayoutOption = "standard";
  try {
    const body = (await request.json()) as { speed?: string };
    if (body.speed === "lightning" || body.speed === "standard") speed = body.speed;
  } catch {
    speed = "standard";
  }

  const supabase = createServerSupabaseClient();
  const { data: invoice } = await supabase
    .from("invoices")
    .select("*")
    .eq("id", params.id)
    .eq("freelancer_id", freelancer.id)
    .maybeSingle();
  if (!invoice) return NextResponse.json({ message: "Invoice not found" }, { status: 404 });
  if (String(invoice.status) !== "paid") {
    return NextResponse.json({ message: "Pay the invoice first" }, { status: 400 });
  }

  const currency = (String(invoice.currency) || "EUR") as PricingCurrency;
  const breakdown = calculateFreelancerPayout(Number(invoice.amount) || 0, speed, currency);
  const { data: accountRow } = await supabase
    .from("freelancers")
    .select("stripe_account_id, email, full_name")
    .eq("id", freelancer.id)
    .maybeSingle();
  const stripeAccountId = typeof accountRow?.stripe_account_id === "string" ? accountRow.stripe_account_id : "";
  const stripe = getStripe();
  let transferId = `tr_mock_${params.id.slice(0, 8)}`;

  if (stripe && isStripeConfigured() && stripeAccountId && !stripeAccountId.startsWith("acct_mock")) {
    const transfer = await stripe.transfers.create({
      amount: toCents(breakdown.youKeep),
      currency: currency.toLowerCase(),
      destination: stripeAccountId,
      transfer_group: params.id,
      metadata: { invoiceId: params.id, speed, applicationFeePercent: "5.5" },
    });
    transferId = transfer.id;
  }

  const writer = createAdminClient() ?? supabase;
  await writer
    .from("invoices")
    .update({
      status: "paid_out",
      payout_option: speed,
      payout_at: new Date().toISOString(),
      stripe_transfer_id: transferId,
      you_keep: breakdown.youKeep,
      lightning_fee: breakdown.lightningFee,
    })
    .eq("id", params.id);

  await writer.from("payouts").insert({
    invoice_id: params.id,
    company_id: invoice.company_id,
    freelancer_id: freelancer.id,
    amount: breakdown.youKeep,
    currency,
    speed,
    status: "paid_out",
    stripe_transfer_id: transferId,
  });

  const { data: profile } = await supabase
    .from("freelancers")
    .select("email, full_name")
    .eq("id", freelancer.id)
    .maybeSingle();
  if (profile?.email) {
    await sendPayoutReceivedEmail({
      to: profile.email,
      freelancerName: profile.full_name || "there",
      invoiceNumber: String(invoice.invoice_number),
      youKeep: formatPricingMoney(breakdown.youKeep, currency),
      speed: speed === "lightning" ? "Lightning" : "standard 24h",
    }).catch(() => undefined);
  }

  return NextResponse.json({ ok: true, mocked: !isStripeConfigured(), transferId, youKeep: breakdown.youKeep });
}
