import { PageSkeleton } from "@/components/ui/skeleton";

export default function PricingLoading() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <PageSkeleton />
    </div>
  );
}
