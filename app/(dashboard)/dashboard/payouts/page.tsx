import { Wallet } from "lucide-react";
import { PlaceholderPage } from "@/components/layout/placeholder-page";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Payouts" };

export default function PayoutsPage() {
  return (
    <PlaceholderPage
      title="Payouts"
      description="Stripe transfers to freelancer bank accounts."
      icon={Wallet}
      emptyTitle="No payouts yet"
      emptyBody="Paid invoices will show a transfer here, usually within 1–2 business days."
    />
  );
}
