import { PlaceholderPage } from "@/components/layout/placeholder-page";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Payouts" };

export default function PayoutsPage() {
  return (
    <PlaceholderPage
      title="Payouts"
      description="Stripe transfers to freelancer bank accounts."
      icon="payouts"
      emptyTitle="No payouts yet."
      emptyBody="After a client pays, the transfer lands here. Standard payout is 24 hours and free."
    />
  );
}
