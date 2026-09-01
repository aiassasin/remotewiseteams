import { calculateFreelancerPayout, formatPricingMoney, type PricingCurrency } from "@/lib/pricing";
import { vatAmount, type VatRate } from "@/lib/compliance/vat";
import { sendInvoiceSentEmail } from "@/lib/email";
import { appUrl } from "@/lib/stripe/client";
import { createAdminClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  canCancelInvoice,
  type FreelancerBillingProfile,
  type InvoiceLine,
  type InvoiceRecord,
  type InvoiceStatus,
} from "@/lib/invoices";

function asString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function asNumber(value: unknown) {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : 0;
}

function mapInvoice(row: Record<string, unknown>): InvoiceRecord {
  const lines = Array.isArray(row.line_items)
    ? (row.line_items as InvoiceLine[]).map((line) => ({
        ...line,
        vatRate: typeof line.vatRate === "number" ? line.vatRate : 25.5,
      }))
    : [];
  return {
    id: asString(row.id),
    companyId: asString(row.company_id),
    freelancerId: asString(row.freelancer_id),
    invoiceNumber: asString(row.invoice_number),
    amount: asNumber(row.amount),
    currency: asString(row.currency) || "EUR",
    status: (asString(row.status) as InvoiceStatus) || "draft",
    clientName: asString(row.client_name),
    clientEmail: asString(row.client_email),
    clientAddress: asString(row.client_address),
    notes: asString(row.notes),
    lineItems: lines,
    serviceFee: asNumber(row.service_fee),
    shieldFee: asNumber(row.shield_fee),
    youKeep: asNumber(row.you_keep),
    dueDate: typeof row.due_date === "string" ? row.due_date : null,
    invoiceDate: typeof row.invoice_date === "string" ? row.invoice_date : null,
    paymentTerms: asString(row.payment_terms) || "14 days net",
    vatExempt: Boolean(row.vat_exempt),
    vatTotal: asNumber(row.vat_total),
    netTotal: asNumber(row.net_total),
    sellerBusinessId: asString(row.seller_business_id),
    buyerBusinessId: asString(row.buyer_business_id),
    createdAt: asString(row.created_at),
    cancelledAt: typeof row.cancelled_at === "string" ? row.cancelled_at : null,
  };
}

export async function listInvoices(filter: { companyId?: string; freelancerId?: string }) {
  const supabase = createServerSupabaseClient();
  let query = supabase.from("invoices").select("*").order("created_at", { ascending: false });
  if (filter.companyId) query = query.eq("company_id", filter.companyId);
  if (filter.freelancerId) query = query.eq("freelancer_id", filter.freelancerId);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => mapInvoice(row as Record<string, unknown>));
}

export async function loadFreelancerBillingProfile(userId: string) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.from("freelancers").select("*").eq("user_id", userId).maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;
  return {
    id: asString(data.id),
    companyId: asString(data.company_id),
    fullName: asString(data.full_name),
    email: asString(data.email),
    taxResidency: asString(data.tax_residency),
    vatId: asString(data.vat_id),
    addressLine1: asString(data.address_line1),
    addressCity: asString(data.address_city),
    addressPostalCode: asString(data.address_postal_code),
    addressCountry: asString(data.address_country),
    bankIban: asString(data.bank_iban),
    bankName: asString(data.bank_name),
    defaultClientName: asString(data.default_client_name),
    defaultClientEmail: asString(data.default_client_email),
    defaultClientAddress: asString(data.default_client_address),
  } satisfies FreelancerBillingProfile;
}

export async function saveFreelancerBillingProfile(
  freelancerId: string,
  input: Partial<FreelancerBillingProfile>,
) {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase
    .from("freelancers")
    .update({
      tax_residency: input.taxResidency,
      vat_id: input.vatId,
      address_line1: input.addressLine1,
      address_city: input.addressCity,
      address_postal_code: input.addressPostalCode,
      address_country: input.addressCountry,
      bank_iban: input.bankIban,
      bank_name: input.bankName,
      default_client_name: input.defaultClientName,
      default_client_email: input.defaultClientEmail,
      default_client_address: input.defaultClientAddress,
    })
    .eq("id", freelancerId);
  if (error) throw new Error(error.message);
}

function invoiceNumber() {
  const stamp = Date.now().toString(36).toUpperCase();
  return `INV-${stamp}`;
}

export async function createInvoice(input: {
  companyId: string;
  freelancerId: string;
  userId: string;
  currency: PricingCurrency;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  notes: string;
  lineItems: InvoiceLine[];
  profile: FreelancerBillingProfile;
  invoiceDate?: string;
  dueDate?: string;
  paymentTerms?: string;
  vatExempt?: boolean;
  sellerBusinessId?: string;
  buyerBusinessId?: string;
}) {
  const amount = input.lineItems.reduce(
    (sum, line) => sum + Math.max(line.quantity, 0) * Math.max(line.unitPrice, 0),
    0,
  );
  const vatExempt = Boolean(input.vatExempt);
  const vatTotal = input.lineItems.reduce((sum, line) => {
    const net = Math.max(line.quantity, 0) * Math.max(line.unitPrice, 0);
    return sum + vatAmount(net, line.vatRate as VatRate, vatExempt);
  }, 0);
  const breakdown = calculateFreelancerPayout(amount, "standard", input.currency);
  const supabase = createServerSupabaseClient();
  const row = {
    company_id: input.companyId,
    freelancer_id: input.freelancerId,
    issued_by_user_id: input.userId,
    invoice_number: invoiceNumber(),
    amount: breakdown.amount,
    currency: input.currency,
    status: "draft",
    client_name: input.clientName,
    client_email: input.clientEmail,
    client_address: input.clientAddress,
    notes: input.notes,
    line_items: input.lineItems,
    service_fee: breakdown.serviceFee,
    shield_fee: breakdown.shieldFee,
    you_keep: breakdown.youKeep,
    invoice_date: input.invoiceDate || new Date().toISOString().slice(0, 10),
    due_date: input.dueDate || null,
    payment_terms: input.paymentTerms || "14 days net",
    vat_exempt: vatExempt,
    vat_total: Math.round(vatTotal * 100) / 100,
    net_total: breakdown.amount,
    seller_business_id: input.sellerBusinessId || input.profile.vatId || "",
    buyer_business_id: input.buyerBusinessId || "",
    sender_snapshot: {
      fullName: input.profile.fullName,
      address: input.profile.addressLine1,
      taxResidency: input.profile.taxResidency,
      vatId: input.profile.vatId,
      bankIban: input.profile.bankIban,
    },
  };
  const { data, error } = await supabase.from("invoices").insert(row).select("*").single();
  if (error) throw new Error(error.message);
  return mapInvoice(data as Record<string, unknown>);
}

export async function sendInvoice(id: string, freelancerId: string) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("invoices")
    .update({ status: "sent" })
    .eq("id", id)
    .eq("freelancer_id", freelancerId)
    .eq("status", "draft")
    .select("*")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Only draft invoices can be sent");
  const mapped = mapInvoice(data as Record<string, unknown>);
  const [{ data: company }, { data: freelancer }] = await Promise.all([
    supabase.from("companies").select("name").eq("id", mapped.companyId).maybeSingle(),
    supabase.from("freelancers").select("full_name").eq("id", freelancerId).maybeSingle(),
  ]);
  if (mapped.clientEmail) {
    await sendInvoiceSentEmail({
      to: mapped.clientEmail,
      freelancerName: freelancer?.full_name || "Freelancer",
      companyName: company?.name || "Your client",
      invoiceNumber: mapped.invoiceNumber,
      amount: formatPricingMoney(mapped.amount, mapped.currency as PricingCurrency),
      dueDate: mapped.dueDate || "on receipt",
      invoiceUrl: `${appUrl()}/dashboard/invoices`,
    }).catch(() => undefined);
  }
  return mapped;
}

export async function cancelInvoice(input: {
  id: string;
  freelancerId: string;
  userId: string;
  reason: string;
}) {
  const supabase = createServerSupabaseClient();
  const { data: existing } = await supabase
    .from("invoices")
    .select("*")
    .eq("id", input.id)
    .eq("freelancer_id", input.freelancerId)
    .maybeSingle();
  if (!existing) throw new Error("Invoice not found");
  const mapped = mapInvoice(existing as Record<string, unknown>);
  if (!canCancelInvoice(mapped.status)) {
    throw new Error("Only draft or sent invoices can be cancelled");
  }
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("invoices")
    .update({
      status: "cancelled",
      cancelled_at: now,
      cancelled_by: input.userId,
      cancel_reason: input.reason,
    })
    .eq("id", input.id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);

  const admin = createAdminClient();
  const writer = admin ?? supabase;
  await writer.from("invoice_events").insert({
    invoice_id: input.id,
    company_id: mapped.companyId,
    actor_id: input.userId,
    event_type: "cancelled",
    payload: { reason: input.reason },
  });
  await writer.from("activity_events").insert({
    company_id: mapped.companyId,
    actor_id: input.userId,
    event_type: "invoice_cancelled",
    title: `${mapped.invoiceNumber} was cancelled`,
    body: input.reason,
    href: "/dashboard/invoices",
  });
  return mapInvoice(data as Record<string, unknown>);
}
