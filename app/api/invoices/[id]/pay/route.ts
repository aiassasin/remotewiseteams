import { NextResponse } from "next/server";
import { getCurrentWorkspace, getSessionUser } from "@/lib/auth/session";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { calculateCompanyCharge, formatPricingMoney, type PricingCurrency } from "@/lib/pricing";
import { appUrl, getStripe, isStripeConfigured, toCents } from "@/lib/stripe/client";
import { markInvoicePaid } from "@/lib/stripe/payments";

export const dynamic = "force-dynamic";

export async function POST(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "Sign in to continue" }, { status: 401 });
  const current = await getCurrentWorkspace();
  if (!current) return NextResponse.json({ message: "Company workspace required" }, { status: 403 });

  const supabase = createServerSupabaseClient();
  const { data: invoice, error } = await supabase
    .from("invoices")
    .select("*")
    .eq("id", params.id)
    .eq("company_id", current.workspace.id)
    .maybeSingle();
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  if (!invoice) return NextResponse.json({ message: "Invoice not found" }, { status: 404 });
  const status = String(invoice.status);
  if (status === "cancelled" || status === "paid" || status === "paid_out") {
    return NextResponse.json({ message: "This invoice cannot be paid" }, { status: 400 });
  }

  const currency = (String(invoice.currency) || "EUR") as PricingCurrency;
  const amount = Number(invoice.amount) || 0;
  const company = calculateCompanyCharge(amount, currency);
  const origin = appUrl();
  const stripe = getStripe();

  if (!stripe || !isStripeConfigured()) {
    await markInvoicePaid(params.id, current.workspace.id, "pi_mock", company.processingFee, company.companyPays);
    return NextResponse.json({
      mocked: true,
      url: `${origin}/dashboard/invoices?paid=${params.id}`,
    });
  }

  const { data: freelancer } = await supabase
    .from("freelancers")
    .select("stripe_account_id")
    .eq("id", invoice.freelancer_id)
    .maybeSingle();

  const destination = typeof freelancer?.stripe_account_id === "string" ? freelancer.stripe_account_id : "";
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${origin}/dashboard/invoices?paid=${params.id}`,
    cancel_url: `${origin}/dashboard/invoices?canceled=1`,
    customer_email: current.user.email || undefined,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: currency.toLowerCase(),
          unit_amount: toCents(company.companyPays),
          product_data: {
            name: `Invoice ${String(invoice.invoice_number)}`,
            description: `Invoice ${formatPricingMoney(amount, currency)} + 1.5% processing`,
          },
        },
      },
    ],
    payment_intent_data: {
      transfer_group: params.id,
      metadata: {
        invoiceId: params.id,
        companyId: current.workspace.id,
        applicationFeePercent: "5.5",
        processingFeePercent: "1.5",
        destinationAccount: destination,
      },
    },
    metadata: { invoiceId: params.id, companyId: current.workspace.id },
  });

  await supabase
    .from("invoices")
    .update({
      stripe_checkout_session_id: session.id,
      processing_fee: company.processingFee,
      company_pays: company.companyPays,
      status: "pending",
    })
    .eq("id", params.id);

  return NextResponse.json({ mocked: false, url: session.url });
}
