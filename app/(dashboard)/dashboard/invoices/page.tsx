import { getCurrentWorkspace } from "@/lib/auth/session";
import { listInvoices } from "@/lib/invoices-server";
import type { InvoiceRecord } from "@/lib/invoices";
import { InvoicesPageClient } from "@/components/invoices/invoices-page-client";
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
    <InvoicesPageClient
      invoices={invoices}
      error={error}
      role="company"
      descriptionKey="invoices.description"
    />
  );
}
