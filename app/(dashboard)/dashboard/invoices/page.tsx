import { Receipt } from "lucide-react";
import { PlaceholderPage } from "@/components/layout/placeholder-page";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Invoices" };

export default function InvoicesPage() {
  return (
    <PlaceholderPage
      title="Invoices"
      description="Approve freelancer invoices and send payouts through Stripe."
      icon={Receipt}
      emptyTitle="No invoices yet"
      emptyBody="Invoices appear here once a freelancer submits work against a contract."
    />
  );
}
