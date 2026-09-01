import { createAdminClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { calculateFreelancerPayout, formatPricingMoney, type PricingCurrency } from "@/lib/pricing";
import { sendInvoicePaidEmail } from "@/lib/email";

export async function markInvoicePaid(
  invoiceId: string,
  companyId: string,
  paymentIntentId: string,
  processingFee: number,
  companyPays: number,
) {
  const admin = createAdminClient() ?? createServerSupabaseClient();
  const { data: invoice } = await admin.from("invoices").select("*").eq("id", invoiceId).maybeSingle();
  if (!invoice) return;
  await admin
    .from("invoices")
    .update({
      status: "paid",
      paid_at: new Date().toISOString(),
      stripe_payment_intent_id: paymentIntentId,
      processing_fee: processingFee,
      company_pays: companyPays,
    })
    .eq("id", invoiceId);

  const { data: freelancer } = await admin
    .from("freelancers")
    .select("email, full_name")
    .eq("id", invoice.freelancer_id)
    .maybeSingle();
  if (freelancer?.email) {
    const currency = (String(invoice.currency) || "EUR") as PricingCurrency;
    const breakdown = calculateFreelancerPayout(Number(invoice.amount) || 0, "standard", currency);
    await sendInvoicePaidEmail({
      to: freelancer.email,
      freelancerName: freelancer.full_name || "there",
      invoiceNumber: String(invoice.invoice_number),
      amount: formatPricingMoney(Number(invoice.amount) || 0, currency),
      youKeep: formatPricingMoney(Number(invoice.you_keep) || breakdown.youKeep, currency),
    }).catch(() => undefined);
  }

  await admin.from("activity_events").insert({
    company_id: companyId,
    event_type: "invoice_paid",
    title: `${String(invoice.invoice_number)} paid`,
    body: "The client paid. Choose standard or Lightning payout.",
    href: "/dashboard/payouts",
  });
}
