import { NextResponse } from "next/server";
import { getStripe, getStripeSecretKey } from "@/lib/stripe/client";
import { markInvoicePaid } from "@/lib/stripe/payments";
import { calculateCompanyCharge, type PricingCurrency } from "@/lib/pricing";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  const body = await request.text();

  if (!stripe || !secret || !getStripeSecretKey()) {
    return NextResponse.json({ received: true, mocked: true });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ message: "Missing signature" }, { status: 400 });

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Invalid signature" },
      { status: 400 },
    );
  }

  if (event.type === "checkout.session.completed" || event.type === "payment_intent.succeeded") {
    const object = event.data.object as {
      metadata?: { invoiceId?: string; companyId?: string };
      payment_intent?: string;
      id?: string;
    };
    const invoiceId = object.metadata?.invoiceId;
    if (invoiceId) {
      const admin = createAdminClient();
      if (admin) {
        const { data: invoice } = await admin.from("invoices").select("*").eq("id", invoiceId).maybeSingle();
        if (invoice && String(invoice.status) !== "paid" && String(invoice.status) !== "paid_out") {
          const currency = (String(invoice.currency) || "EUR") as PricingCurrency;
          const company = calculateCompanyCharge(Number(invoice.amount) || 0, currency);
          await markInvoicePaid(
            invoiceId,
            String(invoice.company_id),
            typeof object.payment_intent === "string" ? object.payment_intent : object.id || "unknown",
            company.processingFee,
            company.companyPays,
          );
        }
      }
    }
  }

  if (event.type === "account.updated") {
    const account = event.data.object as { id?: string; payouts_enabled?: boolean };
    const admin = createAdminClient();
    if (admin && account.id && account.payouts_enabled) {
      await admin.from("freelancers").update({ stripe_onboarded: true }).eq("stripe_account_id", account.id);
    }
  }

  return NextResponse.json({ received: true });
}
