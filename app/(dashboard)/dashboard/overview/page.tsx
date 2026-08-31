import { PageHeader } from "@/components/layout/page-header";
import { PageTransition } from "@/components/motion/page-transition";
import { CountUp } from "@/components/motion/count-up";
import { Button } from "@/components/ui/button";
import { IsoIcon } from "@/components/icons/iso-icon";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Overview",
};

const METRICS = [
  { label: "Active freelancers", value: 0, prefix: "", hint: "Invite your first teammate", icon: "freelancers" as const },
  { label: "Pending invoices", value: 0, prefix: "$", hint: "Nothing waiting", icon: "invoices" as const },
  { label: "Paid this month", value: 0, prefix: "$", hint: "Payouts will land here", icon: "payouts" as const },
  { label: "Contracts signed", value: 0, prefix: "", hint: "Start from a template", icon: "contracts" as const },
];

export default function OverviewPage() {
  return (
    <PageTransition>
      <section className="rw-aurora -mx-6 mb-6 rounded-card px-6 py-8 lg:-mx-10 lg:px-10">
        <PageHeader
          title="Overview"
          description="A calm snapshot of your workspace — people, contracts, and money."
          actions={
            <>
              <Button asChild variant="secondary">
                <Link href="/dashboard/contracts/new" className="inline-flex items-center gap-2">
                  <IsoIcon name="send-contract" size={22} />
                  Send contract
                </Link>
              </Button>
              <Button asChild>
                <Link href="/dashboard/freelancers" className="inline-flex items-center gap-2 !text-white">
                  <IsoIcon name="invite" size={22} />
                  Invite freelancer
                </Link>
              </Button>
            </>
          }
        />
        <p className="font-sans text-body text-ink-secondary">
          No invoices yet. When you land your first client, create one in 60 seconds.
        </p>
      </section>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {METRICS.map((metric) => (
          <div key={metric.label} className="rw-card">
            <div className="flex items-center justify-between">
              <p className="font-sans text-small font-medium uppercase tracking-[0.05em] text-ink-muted">
                {metric.label}
              </p>
              <IsoIcon name={metric.icon} size={32} />
            </div>
            <p className="mt-3 font-display text-[28px] font-semibold tracking-tight text-ink">
              <CountUp value={metric.value} prefix={metric.prefix} />
            </p>
            <p className="mt-2 font-sans text-small text-ink-muted">{metric.hint}</p>
          </div>
        ))}
      </div>
    </PageTransition>
  );
}
