import { getCurrentWorkspace } from "@/lib/auth/session";
import { listInvoices } from "@/lib/invoices-server";
import type { InvoiceRecord } from "@/lib/invoices";
import { InvoiceList } from "@/components/invoices/invoice-list";
import { PageHeader } from "@/components/layout/page-header";
import { PageTransition } from "@/components/motion/page-transition";
import { EmptyState } from "@/components/empty-state";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Invoices" };
export const dynamic = "force-dynamic";

export default async function InvoicesPage() {
  const current = await getCurrentWorkspace();
  if (!current) redirect("/login");
  let invoices: InvoiceRecord[] = [];
  let error: string | null = null;
  try {
    invoices = await listInvoices({ companyId: current.workspace.id });
  } catch (err) {
    error = err instanceof Error ? err.message : "Could not load invoices";
  }

  return (
    <PageTransition>
      <PageHeader
        title="Invoices"
        description="Approve freelancer invoices and send payouts through Stripe."
      />
      {error ? (
        <div className="rw-card">
          <EmptyState icon="invoices" title="Invoices did not load." description={error} />
        </div>
      ) : (
        <InvoiceList invoices={invoices} role="company" />
      )}
    </PageTransition>
  );
}
