import { PlaceholderPage } from "@/components/layout/placeholder-page";
import { MoneyCircle } from "@/components/motion/money-circle";
import { formatPricingMoney } from "@/lib/pricing";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Payouts" };

export default function PayoutsPage() {
  return (
    <div>
      <div className="mb-6 flex justify-center">
        <MoneyCircle
          keep={0}
          fees={0}
          label="Paid out"
          formattedKeep={formatPricingMoney(0, "EUR")}
          size={140}
        />
      </div>
      <PlaceholderPage
        title="Payouts"
        description="Stripe transfers to freelancer bank accounts."
        icon="payouts"
        emptyTitle="No payouts yet."
        emptyBody="After a client pays, the transfer lands here. Standard payout is 24 hours and free."
      />
    </div>
  );
}
