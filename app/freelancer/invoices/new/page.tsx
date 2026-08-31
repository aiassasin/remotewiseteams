import { getSessionUser } from "@/lib/auth/session";
import { loadFreelancerBillingProfile } from "@/lib/invoices-server";
import { InvoiceBuilder } from "@/components/invoices/invoice-builder";
import { PageHeader } from "@/components/layout/page-header";
import { PageTransition } from "@/components/motion/page-transition";
import { EmptyState } from "@/components/empty-state";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "New invoice" };
export const dynamic = "force-dynamic";

export default async function NewInvoicePage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const profile = await loadFreelancerBillingProfile(user.id);
  if (!profile) {
    return (
      <PageTransition>
        <PageHeader title="New invoice" />
        <div className="rw-card">
          <EmptyState
            icon="invoices"
            title="Freelancer profile missing."
            description="Accept a company invite first. We save your address, tax residency, VAT ID, bank, and clients for the next invoice."
          />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <PageHeader
        title="New invoice"
        description="Fees calculate as you type. Profile fields are saved once and reused."
      />
      <InvoiceBuilder profile={profile} />
    </PageTransition>
  );
}
