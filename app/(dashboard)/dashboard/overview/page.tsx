import { PageHeader } from "@/components/layout/page-header";
import { PageTransition } from "@/components/motion/page-transition";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Overview",
};

const METRICS = [
  { label: "Active freelancers", value: "0", hint: "Invite your first teammate" },
  { label: "Pending invoices", value: "$0", hint: "Nothing waiting" },
  { label: "Paid this month", value: "$0", hint: "Payouts will land here" },
  { label: "Contracts signed", value: "0", hint: "Start from a template" },
];

export default function OverviewPage() {
  return (
    <PageTransition>
      <PageHeader
        title="Overview"
        description="A calm snapshot of your workspace — people, contracts, and money."
        actions={
          <>
            <Button asChild variant="secondary">
              <Link href="/dashboard/contracts/new">Send contract</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard/freelancers">Invite freelancer</Link>
            </Button>
          </>
        }
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {METRICS.map((metric) => (
          <div key={metric.label} className="rw-card">
            <p className="font-sans text-small font-medium uppercase tracking-[0.05em] text-ink-muted">
              {metric.label}
            </p>
            <p className="mt-3 font-display text-[28px] font-semibold tracking-tight text-ink">
              {metric.value}
            </p>
            <p className="mt-2 font-sans text-small text-ink-muted">{metric.hint}</p>
          </div>
        ))}
      </div>
    </PageTransition>
  );
}
