import { pageMeta } from "@/lib/seo";
import { PricingView } from "@/components/pricing/pricing-view";

export const metadata = pageMeta(
  "Pricing",
  "Invoice any client without a company. 5.5% all-in for freelancers. Free contractor OS for companies.",
);

export default function PricingPage() {
  return <PricingView />;
}
