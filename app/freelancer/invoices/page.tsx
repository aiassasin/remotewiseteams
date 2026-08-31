import { getCurrentFreelancer, getSessionUser } from "@/lib/auth/session";
import { listInvoices } from "@/lib/invoices-server";
import type { InvoiceRecord } from "@/lib/invoices";
import { InvoiceList } from "@/components/invoices/invoice-list";
import { PageHeader } from "@/components/layout/page-header";
import { PageTransition } from "@/components/motion/page-transition";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Invoices" };
export const dynamic = "force-dynamic";

export default async function FreelancerInvoicesPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const freelancer = await getCurrentFreelancer();
  if (!freelancer) redirect("/signup");
  let invoices: InvoiceRecord[] = [];
  let error: string | null = null;
  try {
    invoices = await listInvoices({ freelancerId: freelancer.id });
  } catch (err) {
    error = err instanceof Error ? err.message : "Could not load invoices";
  }

  return (
    <PageTransition>
      <PageHeader
        title="Invoices"
        description="Draft, send, and cancel before the client pays."
        actions={
          <Button asChild>
            <Link href="/freelancer/invoices/new">New invoice</Link>
          </Button>
        }
      />
      {error ? (
        <div className="rw-card">
          <EmptyState icon="invoices" title="Invoices did not load." description={error} />
        </div>
      ) : (
        <InvoiceList invoices={invoices} role="freelancer" createHref="/freelancer/invoices/new" />
      )}
    </PageTransition>
  );
}
