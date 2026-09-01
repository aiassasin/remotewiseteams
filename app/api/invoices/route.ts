import { NextResponse } from "next/server";
import { getCurrentFreelancer, getCurrentWorkspace, getSessionUser } from "@/lib/auth/session";
import {
  createInvoice,
  listInvoices,
  loadFreelancerBillingProfile,
  saveFreelancerBillingProfile,
} from "@/lib/invoices-server";
import type { InvoiceLine } from "@/lib/invoices";
import { PRICING_CURRENCIES, type PricingCurrency } from "@/lib/pricing";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "Sign in to continue" }, { status: 401 });
  const current = await getCurrentWorkspace();
  const freelancer = await getCurrentFreelancer();
  try {
    if (current) {
      const invoices = await listInvoices({ companyId: current.workspace.id });
      return NextResponse.json({ invoices, role: "company" });
    }
    if (freelancer) {
      const invoices = await listInvoices({ freelancerId: freelancer.id });
      return NextResponse.json({ invoices, role: "freelancer" });
    }
    return NextResponse.json({ message: "No workspace" }, { status: 403 });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Could not list invoices" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "Sign in to continue" }, { status: 401 });
  const profile = await loadFreelancerBillingProfile(user.id);
  if (!profile) {
    return NextResponse.json({ message: "Freelancer profile required" }, { status: 403 });
  }

  let body: {
    currency?: string;
    clientName?: string;
    clientEmail?: string;
    clientAddress?: string;
    notes?: string;
    lineItems?: InvoiceLine[];
    saveProfile?: boolean;
    taxResidency?: string;
    vatId?: string;
    addressLine1?: string;
    addressCity?: string;
    addressPostalCode?: string;
    addressCountry?: string;
    bankIban?: string;
    bankName?: string;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  const currency = (PRICING_CURRENCIES as readonly string[]).includes(body.currency ?? "")
    ? (body.currency as PricingCurrency)
    : "EUR";
  const lineItems = (body.lineItems ?? []).filter(
    (line) => line.description.trim() && line.quantity > 0 && line.unitPrice >= 0,
  );
  if (!lineItems.length) {
    return NextResponse.json({ message: "Add at least one line item" }, { status: 400 });
  }

  try {
    const invoice = await createInvoice({
      companyId: profile.companyId,
      freelancerId: profile.id,
      userId: user.id,
      currency,
      clientName: body.clientName?.trim() || profile.defaultClientName,
      clientEmail: body.clientEmail?.trim() || profile.defaultClientEmail,
      clientAddress: body.clientAddress?.trim() || profile.defaultClientAddress,
      notes: body.notes?.trim() || "",
      lineItems,
      profile: {
        ...profile,
        taxResidency: body.taxResidency?.trim() || profile.taxResidency,
        vatId: body.vatId?.trim() || profile.vatId,
        addressLine1: body.addressLine1?.trim() || profile.addressLine1,
        addressCity: body.addressCity?.trim() || profile.addressCity,
        addressPostalCode: body.addressPostalCode?.trim() || profile.addressPostalCode,
        addressCountry: body.addressCountry?.trim() || profile.addressCountry,
        bankIban: body.bankIban?.trim() || profile.bankIban,
        bankName: body.bankName?.trim() || profile.bankName,
        defaultClientName: body.clientName?.trim() || profile.defaultClientName,
        defaultClientEmail: body.clientEmail?.trim() || profile.defaultClientEmail,
        defaultClientAddress: body.clientAddress?.trim() || profile.defaultClientAddress,
      },
    });
    if (body.saveProfile !== false) {
      await saveFreelancerBillingProfile(profile.id, {
        taxResidency: body.taxResidency,
        vatId: body.vatId,
        addressLine1: body.addressLine1,
        addressCity: body.addressCity,
        addressPostalCode: body.addressPostalCode,
        addressCountry: body.addressCountry,
        bankIban: body.bankIban,
        bankName: body.bankName,
        defaultClientName: body.clientName,
        defaultClientEmail: body.clientEmail,
        defaultClientAddress: body.clientAddress,
      });
    }
    return NextResponse.json({ invoice });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Could not create invoice" },
      { status: 500 },
    );
  }
}
