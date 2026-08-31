import { PlaceholderPage } from "@/components/layout/placeholder-page";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Invoices" };

export default function InvoicesPage() {
  return (
    <PlaceholderPage
      title="Invoices"
      description="Approve freelancer invoices and send payouts through Stripe."
      icon="invoices"
      emptyTitle="No invoices yet."
      emptyBody="When you land billed work against a contract, it appears here. Create the first one in about a minute."
      actionHref="/dashboard/freelancers"
      actionLabel="Invite someone to bill"
    />
  );
}
