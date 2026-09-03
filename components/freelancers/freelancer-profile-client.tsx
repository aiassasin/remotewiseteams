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
import { useFormat, useT } from "@/components/i18n/language-provider";
import { statusMessageKey } from "@/lib/i18n";

const TAB_KEYS = ["overview", "contracts", "invoices", "activity"] as const;

export function FreelancerProfileClient() {
  const t = useT();
  const format = useFormat();
  const params = useParams<{ id: string }>();
  const [tab, setTab] = useState<(typeof TAB_KEYS)[number]>("overview");
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
    return <p className="font-sans text-body text-ink-muted">{t("freelancers.loadingProfile")}</p>;
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
            <p className="mt-1 font-sans text-[14px] text-ink-slate">{person.role ?? t("common.freelancers")}</p>
            <div className="mt-3">
              <Badge status={person.status}>{person.status}</Badge>
            </div>
            <p className="mt-3 font-sans text-[14px] text-ink-secondary">
              {person.country ?? t("freelancers.locationUnset")}
            </p>
            <div className="mt-6 grid grid-cols-3 gap-2 border-t border-border pt-4">
              <div>
                <p className="font-display text-[18px] text-success">${data.stats.totalPaid}</p>
                <p className="font-sans text-small text-ink-muted">{t("freelancers.totalPaid")}</p>
              </div>
              <div>
                <p className="font-display text-[18px] text-ink">{data.stats.activeContracts}</p>
                <p className="font-sans text-small text-ink-muted">{t("nav.contracts")}</p>
              </div>
              <div>
                <p className="font-display text-[18px] text-ink">{data.stats.avgPaymentTime}</p>
                <p className="font-sans text-small text-ink-muted">{t("freelancers.avgPay")}</p>
              </div>
            </div>
            <div className="mt-6 rounded-control border border-border p-3">
              <p className="font-sans text-small uppercase tracking-[0.05em] text-ink-muted">{t("freelancers.colRate")}</p>
              <p className="mt-1 font-sans text-[14px] font-medium text-ink">
                {person.hourlyRate ? `${person.currency} ${person.hourlyRate}/hr` : "—"}
              </p>
            </div>
            <div className="mt-4 space-y-2 font-sans text-[14px] text-ink-secondary">
              <p className="flex items-center justify-between">
                {person.email}
                <button
                  type="button"
                  aria-label={t("freelancers.copyEmail")}
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
                <span className="text-success-text">{t("freelancers.stripeConnected")}</span>
              ) : (
                <span className="text-warning-text">{t("freelancers.notConnected")}</span>
              )}
            </p>
            <div className="mt-6 space-y-2">
              <Button asChild size="full">
                <Link href="/dashboard/contracts/new">{t("freelancers.sendContract")}</Link>
              </Button>
              <Button variant="secondary" size="full">
                {t("freelancers.requestInvoice")}
              </Button>
              <Button variant="ghost" size="full">
                {t("freelancers.sendMessage")}
              </Button>
            </div>
          </div>
        </aside>
        <section className="min-w-0 flex-1">
          <div className="flex gap-4 border-b border-border">
            {TAB_KEYS.map((item) => (
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
                {item === "overview"
                  ? t("freelancers.tabOverview")
                  : item === "contracts"
                    ? t("freelancers.tabContracts")
                    : item === "invoices"
                      ? t("freelancers.tabInvoices")
                      : t("freelancers.tabActivity")}
              </button>
            ))}
          </div>
          <div className="mt-6">
            {tab === "overview" || tab === "contracts" ? (
              data.contracts.length === 0 ? (
                <p className="font-sans text-body text-ink-slate">{t("freelancers.noContracts")}</p>
              ) : (
                <div className="space-y-3">
                  {data.contracts.map((row) => {
                    const statusKey = statusMessageKey(row.status);
                    return (
                    <Link
                      key={row.id}
                      href={`/dashboard/contracts/${row.id}`}
                      className="block rounded-card border border-border bg-card p-4 hover:border-border-hover"
                    >
                      <p className="font-display text-card text-ink">{row.title}</p>
                      <p className="mt-1 font-sans text-small text-ink-muted">
                        {row.type} · {statusKey ? t(statusKey) : row.status}
                      </p>
                    </Link>
                    );
                  })}
                </div>
              )
            ) : tab === "invoices" ? (
              <p className="font-sans text-body text-ink-slate">{t("freelancers.noInvoices")}</p>
            ) : (
              <p className="font-sans text-body text-ink-slate">
                {t("freelancers.invitedAt", { date: format.dateTime(person.createdAt) })}
              </p>
            )}
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
