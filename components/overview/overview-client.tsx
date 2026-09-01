"use client";

import Link from "next/link";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader } from "@/components/layout/page-header";
import { PageTransition } from "@/components/motion/page-transition";
import { CountUp } from "@/components/motion/count-up";
import { MoneyCircle } from "@/components/motion/money-circle";
import { Button } from "@/components/ui/button";
import { IsoIcon, type IsoIconName } from "@/components/icons/iso-icon";
import { EmptyState } from "@/components/empty-state";
import { formatPricingMoney, PLATFORM_TAKE_RATE } from "@/lib/pricing";
import type { OverviewData } from "@/lib/overview";

const ACTIONS: { href: string; label: string; icon: IsoIconName }[] = [
  { href: "/dashboard/freelancers", label: "Invite freelancer", icon: "invite" },
  { href: "/dashboard/contracts/new", label: "Send contract", icon: "send-contract" },
  { href: "/dashboard/invoices", label: "Review invoices", icon: "invoices" },
  { href: "/dashboard/help", label: "Help & support", icon: "help" },
];

const CHECK_STEPS = [
  { key: "invite" as const, label: "Invite a freelancer" },
  { key: "contract" as const, label: "Send a contract" },
  { key: "invoice" as const, label: "Receive the first invoice" },
  { key: "payout" as const, label: "Complete the first payout" },
];

const PIE_COLORS = ["#059669", "#2563EB", "#0B1A33", "#EA580C", "#64748B", "#DC2626"];

export function OverviewClient({ data, error }: { data: OverviewData | null; error?: string | null }) {
  if (error) {
    return (
      <PageTransition>
        <PageHeader title="Overview" />
        <div className="rw-card">
          <EmptyState icon="overview" title="Overview did not load." description={error} />
        </div>
      </PageTransition>
    );
  }
  if (!data) {
    return (
      <PageTransition>
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-card border border-border bg-card" />
          ))}
        </div>
      </PageTransition>
    );
  }

  const done = CHECK_STEPS.filter((step) => data.checklist[step.key]).length;
  const progress = Math.round((done / CHECK_STEPS.length) * 100);

  return (
    <PageTransition>
      <section className="rw-aurora -mx-6 mb-6 rounded-card px-6 py-8 lg:-mx-10 lg:px-10">
        <PageHeader
          title="Overview"
          description="A calm snapshot of your workspace — people, contracts, and money."
          actions={
            <>
              <Button asChild>
                <Link href="/dashboard/contracts/new" className="inline-flex items-center gap-2 !text-white">
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
      </section>

      <div className="mb-6 rounded-card border border-border bg-card p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <IsoIcon name="checklist" size={40} title="Get started" />
            <div>
              <h2 className="font-display text-card text-ink">Get your first payout</h2>
              <p className="font-sans text-small text-ink-secondary">
                Invite → contract → first invoice → first payout
              </p>
            </div>
          </div>
          <p className="font-sans text-small font-medium text-ink">{progress}%</p>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-pill bg-page">
          <div className="h-full bg-success transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
        <ol className="mt-4 grid gap-2 sm:grid-cols-4">
          {CHECK_STEPS.map((step) => (
            <li key={step.key} className="font-sans text-[13px] text-ink-secondary">
              <span className={data.checklist[step.key] ? "text-success-text" : ""}>
                {data.checklist[step.key] ? "✓" : "○"} {step.label}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Active freelancers", value: data.freelancerCount, prefix: "", icon: "freelancers" as const },
          { label: "Pending invoices", value: data.pendingInvoices, prefix: "", icon: "invoices" as const },
          { label: "Paid this month", value: data.paidThisMonth, prefix: "€", icon: "payouts" as const },
          { label: "Contracts signed", value: data.contractsSigned, prefix: "", icon: "contracts" as const },
        ].map((metric) => (
          <div key={metric.label} className="rw-card">
            <div className="flex items-center justify-between">
              <p className="font-sans text-small font-medium uppercase tracking-[0.05em] text-ink-muted">
                {metric.label}
              </p>
              <IsoIcon name={metric.icon} size={32} />
            </div>
            {metric.icon === "payouts" ? (
              <div className="mt-3">
                <MoneyCircle
                  keep={data.paidThisMonth}
                  fees={data.paidThisMonth * PLATFORM_TAKE_RATE}
                  label="Paid"
                  formattedKeep={formatPricingMoney(data.paidThisMonth, "EUR")}
                  size={120}
                />
              </div>
            ) : (
              <p className="mt-3 font-display text-[28px] font-semibold tracking-tight text-ink">
                <CountUp value={metric.value} prefix={metric.prefix} />
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-card border border-border bg-card p-5">
          <h2 className="font-display text-card text-ink">Monthly payouts</h2>
          {data.monthly.every((row) => row.amount === 0) ? (
            <EmptyState
              icon="payouts"
              title="No payouts yet."
              description="After a client pays, monthly totals land here."
              className="py-10"
            />
          ) : (
            <div className="mt-4 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.monthly}>
                  <XAxis dataKey="month" stroke="currentColor" fontSize={12} />
                  <YAxis stroke="currentColor" fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#2563EB" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
        <div className="rounded-card border border-border bg-card p-5">
          <h2 className="font-display text-card text-ink">Invoice status</h2>
          {data.statusSlices.length === 0 ? (
            <EmptyState
              icon="invoices"
              title="No invoices yet."
              description="Statuses split into a donut once the first invoice is sent."
              className="py-10"
            />
          ) : (
            <div className="mt-4 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data.statusSlices} dataKey="value" nameKey="name" innerRadius={48} outerRadius={72}>
                    {data.statusSlices.map((slice, index) => (
                      <Cell key={slice.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="rounded-card border border-border bg-card p-5">
          <h2 className="font-display text-card text-ink">Activity</h2>
          {data.activity.length === 0 ? (
            <p className="mt-3 font-sans text-[14px] text-ink-muted">
              Invites, signatures, invoices, and cancellations appear here.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {data.activity.map((item) => (
                <li key={item.id}>
                  <p className="font-sans text-[14px] font-medium text-ink">{item.title}</p>
                  {item.body ? <p className="font-sans text-small text-ink-muted">{item.body}</p> : null}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="rounded-card border border-border bg-card p-5">
          <h2 className="font-display text-card text-ink">Quick actions</h2>
          <ul className="mt-4 space-y-2">
            {ACTIONS.map((action) => (
              <li key={action.href}>
                <Link
                  href={action.href}
                  className="flex items-center gap-3 rounded-control px-2 py-2 hover:bg-page"
                >
                  <IsoIcon name={action.icon} size={28} />
                  <span className="font-sans text-[14px] text-ink">{action.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </PageTransition>
  );
}
