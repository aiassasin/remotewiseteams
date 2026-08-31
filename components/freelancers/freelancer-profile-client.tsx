"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Copy, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/motion/page-transition";
import { initials } from "@/lib/utils";
import type { StoredFreelancer } from "@/lib/store";
import Link from "next/link";

const TABS = ["Overview", "Contracts", "Invoices", "Activity"] as const;

export function FreelancerProfileClient() {
  const params = useParams<{ id: string }>();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Overview");
  const [data, setData] = useState<{
    freelancer: StoredFreelancer;
    contracts: { id: string; title: string; type: string; status: string; sentAt: string | null; signedAt: string | null }[];
    stats: { totalPaid: number; activeContracts: number; avgPaymentTime: string };
  } | null>(null);

  useEffect(() => {
    fetch(`/api/freelancers/${params.id}`)
      .then((res) => res.json())
      .then(setData);
  }, [params.id]);

  if (!data?.freelancer) {
    return <p className="font-sans text-body text-ink-muted">Loading profile…</p>;
  }

  const person = data.freelancer;

  return (
    <PageTransition>
      <div className="flex flex-col gap-6 lg:flex-row">
        <aside className="w-full shrink-0 lg:sticky lg:top-6 lg:w-[320px]">
          <div className="rounded-card border border-border bg-card p-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-light font-display text-section text-primary-text">
              {initials(person.fullName)}
            </div>
            <h1 className="mt-4 font-display text-section text-ink">{person.fullName}</h1>
            <p className="mt-1 font-sans text-[14px] text-ink-slate">{person.role ?? "Freelancer"}</p>
            <div className="mt-3">
              <Badge status={person.status}>{person.status}</Badge>
            </div>
            <p className="mt-3 font-sans text-[14px] text-ink-secondary">
              {person.country ?? "Location not set"}
            </p>
            <div className="mt-6 grid grid-cols-3 gap-2 border-t border-border pt-4">
              <div>
                <p className="font-display text-[18px] text-success">${data.stats.totalPaid}</p>
                <p className="font-sans text-small text-ink-muted">Total paid</p>
              </div>
              <div>
                <p className="font-display text-[18px] text-ink">{data.stats.activeContracts}</p>
                <p className="font-sans text-small text-ink-muted">Contracts</p>
              </div>
              <div>
                <p className="font-display text-[18px] text-ink">{data.stats.avgPaymentTime}</p>
                <p className="font-sans text-small text-ink-muted">Avg. pay</p>
              </div>
            </div>
            <div className="mt-6 rounded-control border border-border p-3">
              <p className="font-sans text-small uppercase tracking-[0.05em] text-ink-muted">Rate</p>
              <p className="mt-1 font-sans text-[14px] font-medium text-ink">
                {person.hourlyRate ? `${person.currency} ${person.hourlyRate}/hr` : "—"}
              </p>
            </div>
            <div className="mt-4 space-y-2 font-sans text-[14px] text-ink-secondary">
              <p className="flex items-center justify-between">
                {person.email}
                <button
                  type="button"
                  aria-label="Copy email"
                  onClick={() => navigator.clipboard.writeText(person.email)}
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </p>
              {person.linkedin ? (
                <a href={person.linkedin} className="flex items-center gap-1 text-primary">
                  LinkedIn <ExternalLink className="h-3 w-3" />
                </a>
              ) : null}
            </div>
            <p className="mt-4 font-sans text-[13px]">
              {person.stripeOnboarded ? (
                <span className="text-success-text">Stripe connected ✓</span>
              ) : (
                <span className="text-warning-text">Not connected</span>
              )}
            </p>
            <div className="mt-6 space-y-2">
              <Button asChild size="full">
                <Link href="/dashboard/contracts/new">Send contract</Link>
              </Button>
              <Button variant="secondary" size="full">
                Request invoice
              </Button>
              <Button variant="ghost" size="full">
                Send message
              </Button>
            </div>
          </div>
        </aside>
        <section className="min-w-0 flex-1">
          <div className="flex gap-4 border-b border-border">
            {TABS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setTab(item)}
                className={`border-b-2 px-1 pb-3 font-sans text-[14px] font-medium ${
                  tab === item
                    ? "border-primary text-ink"
                    : "border-transparent text-ink-muted"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="mt-6">
            {tab === "Overview" || tab === "Contracts" ? (
              data.contracts.length === 0 ? (
                <p className="font-sans text-body text-ink-slate">No contracts with this freelancer yet.</p>
              ) : (
                <div className="space-y-3">
                  {data.contracts.map((row) => (
                    <Link
                      key={row.id}
                      href={`/dashboard/contracts/${row.id}`}
                      className="block rounded-card border border-border bg-card p-4 hover:border-border-hover"
                    >
                      <p className="font-display text-card text-ink">{row.title}</p>
                      <p className="mt-1 font-sans text-small text-ink-muted">
                        {row.type} · {row.status}
                      </p>
                    </Link>
                  ))}
                </div>
              )
            ) : tab === "Invoices" ? (
              <p className="font-sans text-body text-ink-slate">No invoices yet.</p>
            ) : (
              <p className="font-sans text-body text-ink-slate">
                Invited {new Date(person.createdAt).toLocaleString()}
              </p>
            )}
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
