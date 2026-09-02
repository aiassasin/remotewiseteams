"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Freelancer } from "@/lib/types";
import { countryFlag } from "@/lib/flags";
import { useT } from "@/components/i18n/language-provider";

export function FreelancerCardGrid({
  rows,
  formatCurrency,
  initials,
}: {
  rows: Freelancer[];
  formatCurrency: (amount: number | null | undefined, currency?: string) => string;
  initials: (name: string) => string;
}) {
  const t = useT();
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {rows.map((row, index) => (
        <article
          key={row.id}
          className="relative rounded-card border border-border bg-card p-6 text-center transition-colors duration-100 hover:border-border-hover"
          style={{ animationDelay: `${Math.min(index, 7) * 40}ms` }}
        >
          {row.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={row.avatarUrl}
              alt=""
              className="mx-auto h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-light font-sans text-[18px] font-medium text-primary-text">
              {initials(row.fullName)}
            </div>
          )}
          <h3 className="mt-4 font-display text-card text-ink">
            {countryFlag(row.country)} {row.fullName}
          </h3>
          <p className="mt-1 font-sans text-[13px] text-ink-slate">
            {row.role ?? t("common.freelancers")}
          </p>
          <div className="mt-3 flex justify-center">
            <Badge status={row.status}>{row.status}</Badge>
          </div>
          <p className="mt-3 font-sans text-[14px] font-medium text-ink">
            {formatCurrency(row.hourlyRate, row.currency)}
          </p>
          <p className="mt-2 font-sans text-small text-ink-muted">
            {t("freelancers.contractsInvoices", {
              contracts: row.contractCount,
              invoices: row.invoiceCount,
            })}
          </p>
          <Button asChild variant="secondary" size="full" className="mt-4">
            <Link href={`/dashboard/freelancers/${row.id}`}>{t("freelancers.viewProfile")}</Link>
          </Button>
        </article>
      ))}
    </div>
  );
}
