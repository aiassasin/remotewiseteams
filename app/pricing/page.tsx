import type { Metadata } from "next";
import { PricingView } from "@/components/pricing/pricing-view";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Invoice any client without a company. 8.5% all-in for freelancers. Free contractor management for companies.",
};

export default function PricingPage() {
  return <PricingView />;
}
