import { getCurrentWorkspace } from "@/lib/auth/session";
import { listInvoices } from "@/lib/invoices-server";
import type { InvoiceRecord } from "@/lib/invoices";
import { PayoutsPageClient } from "@/components/payouts/payouts-client";
import { pageMeta } from "@/lib/seo";
import { redirect } from "next/navigation";

export const metadata = pageMeta(
  "Payouts",
  "Standard 24h free payouts or Lightning 1%. Platform keeps 5.5%.",
);
export const dynamic = "force-dynamic";

export default async function PayoutsPage() {
  const current = await getCurrentWorkspace();
  if (!current) redirect("/login");
  let invoices: InvoiceRecord[] = [];
  let error: string | null = null;
  try {
    invoices = await listInvoices({ companyId: current.workspace.id });
  } catch (err) {
    error = err instanceof Error ? err.message : "Could not load payouts";
  }

  return <PayoutsPageClient invoices={invoices} error={error} role="company" />;
}
